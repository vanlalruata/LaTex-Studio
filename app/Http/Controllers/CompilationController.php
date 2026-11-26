<?php

namespace App\Http\Controllers;

use App\Domain\Administration\AuditService;
use App\Domain\Compilation\RequestCompilationAction;
use App\Domain\Compilation\SyncTexService;
use App\Enums\ArtifactType;
use App\Enums\CompilationStatus;
use App\Enums\CompilerEngine;
use App\Models\Compilation;
use App\Models\Project;
use App\Models\ProjectFile;
use App\Services\Storage\PrivateStorageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

class CompilationController extends Controller
{
    public function store(Request $request, Project $project, RequestCompilationAction $action): JsonResponse
    {
        Gate::authorize('compile', $project);

        $user = $request->user();
        abort_if($user === null, 401);

        $validated = $request->validate([
            'idempotency_key' => ['nullable', 'string', 'max:128'],
        ]);

        $compilation = $action->execute(
            project: $project,
            actor: $user,
            idempotencyKey: $validated['idempotency_key'] ?? null,
        );

        return response()->json([
            'public_id' => $compilation->public_id,
            'status' => $compilation->status->value,
            'compiler_engine' => $compilation->compiler_engine->value,
            'created_at' => $compilation->created_at?->toIso8601String(),
        ], 201);
    }

    public function show(Compilation $compilation): JsonResponse
    {
        Gate::authorize('view', $compilation);

        $compilation->load('diagnostics', 'artifacts');

        $artifactTypes = $compilation->artifacts->pluck('type')->map(
            fn (ArtifactType $type): string => $type->value
        )->values();

        return response()->json([
            'public_id' => $compilation->public_id,
            'status' => $compilation->status->value,
            'compiler_engine' => $compilation->compiler_engine->value,
            'exit_code' => $compilation->exit_code,
            'duration_ms' => $compilation->duration_ms,
            'error_summary' => $compilation->error_summary,
            'is_terminal' => $compilation->status->isTerminal(),
            'started_at' => $compilation->started_at?->toIso8601String(),
            'finished_at' => $compilation->finished_at?->toIso8601String(),
            'artifacts' => $artifactTypes,
            'last_successful_compilation_id' => $compilation->project->lastSuccessfulCompilation?->public_id,
            'diagnostics' => $compilation->diagnostics->map(fn ($d): array => [
                'severity' => $d->severity->value,
                'file_path' => $d->file_path,
                'line' => $d->line,
                'message' => $d->message,
                'raw_excerpt' => $d->raw_excerpt,
            ])->values(),
        ]);
    }

    public function cancel(Request $request, Compilation $compilation, AuditService $audit): JsonResponse
    {
        $project = $compilation->project;
        Gate::authorize('compile', $project);

        abort_if($compilation->status->isTerminal(), 422, 'Compilation has already finished.');

        $compilation->update([
            'status' => CompilationStatus::Cancelled,
            'finished_at' => now(),
            'error_summary' => 'Cancelled by a project collaborator.',
        ]);

        $audit->record('compilation.cancelled', $request->user(), $project, $compilation);

        return response()->json([
            'public_id' => $compilation->public_id,
            'status' => CompilationStatus::Cancelled->value,
            'is_terminal' => true,
        ]);
    }

    public function retry(
        Request $request,
        Compilation $compilation,
        RequestCompilationAction $action,
        AuditService $audit,
    ): JsonResponse {
        $project = $compilation->project;
        Gate::authorize('compile', $project);

        abort_unless($compilation->status->isTerminal(), 422, 'Wait for the current build to finish before retrying.');

        $user = $request->user();
        abort_if($user === null, 401);

        $retry = $action->execute(
            project: $project,
            actor: $user,
            idempotencyKey: 'retry-'.$compilation->public_id.'-'.now()->getTimestamp(),
        );

        $audit->record('compilation.retried', $user, $project, $retry, [
            'retried_from' => $compilation->public_id,
        ]);

        return response()->json([
            'public_id' => $retry->public_id,
            'status' => $retry->status->value,
            'compiler_engine' => $retry->compiler_engine->value,
            'created_at' => $retry->created_at?->toIso8601String(),
        ], 201);
    }

    public function updateEngine(Request $request, Project $project, AuditService $audit): JsonResponse
    {
        Gate::authorize('compile', $project);

        $validated = $request->validate([
            'compiler_engine' => ['required', Rule::enum(CompilerEngine::class)],
        ]);

        $previous = $project->compiler_engine;
        $engine = CompilerEngine::from($validated['compiler_engine']);

        $project->update(['compiler_engine' => $engine]);

        $audit->record('project.engine_changed', $request->user(), $project, $project, [
            'from' => $previous->value,
            'to' => $engine->value,
        ]);

        return response()->json([
            'compiler_engine' => $engine->value,
            'engine_label' => $engine->label(),
        ]);
    }

    public function forwardSynctex(
        Request $request,
        Compilation $compilation,
        SyncTexService $syncTex,
        PrivateStorageService $storage,
    ): JsonResponse {
        Gate::authorize('view', $compilation);

        $validated = $request->validate([
            'file_path' => ['required', 'string', 'max:512'],
            'line' => ['required', 'integer', 'min:1', 'max:1000000'],
        ]);

        $project = $compilation->project;
        $fileExists = $project->files()
            ->where('is_directory', false)
            ->where('path', $validated['file_path'])
            ->exists();

        abort_unless($fileExists, 422, 'Source file does not belong to this project.');

        $synctex = $this->synctexContents($compilation, $storage);
        abort_if($synctex === null, 422, 'This build has no SyncTeX data.');

        $result = $syncTex->forwardLookup($synctex, $validated['file_path'], $validated['line']);
        abort_if($result === null, 404, 'No SyncTeX mapping found for that line.');

        return response()->json([
            'page' => $result['page'],
            'x' => $result['x'],
            'y' => $result['y'],
            'file_path' => $validated['file_path'],
            'line' => $validated['line'],
        ]);
    }

    public function inverseSynctex(
        Request $request,
        Compilation $compilation,
        SyncTexService $syncTex,
        PrivateStorageService $storage,
    ): JsonResponse {
        Gate::authorize('view', $compilation);

        $validated = $request->validate([
            'page' => ['required', 'integer', 'min:1', 'max:10000'],
            'x' => ['required', 'numeric'],
            'y' => ['required', 'numeric'],
        ]);

        $synctex = $this->synctexContents($compilation, $storage);
        abort_if($synctex === null, 422, 'This build has no SyncTeX data.');

        $result = $syncTex->inverseLookup(
            $synctex,
            (int) $validated['page'],
            (float) $validated['x'],
            (float) $validated['y'],
        );

        abort_if($result === null, 404, 'No source mapping found at that location.');

        $file = $this->findProjectFile($compilation->project, $result['file_path']);
        abort_if($file === null, 404, 'Mapped source file is not part of the project.');

        return response()->json([
            'file_id' => $file->public_id,
            'file_path' => $file->path,
            'line' => $result['line'],
            'distance' => $result['distance'],
        ]);
    }

    public function artifact(Compilation $compilation, string $type, PrivateStorageService $storage): Response
    {
        Gate::authorize('downloadArtifact', $compilation);

        $artifactType = ArtifactType::tryFrom($type);
        abort_if($artifactType === null, 404);

        $artifact = $compilation->artifacts()
            ->where('type', $artifactType)
            ->first();

        abort_if($artifact === null, 404);

        $contents = $storage->getContents($artifact->storage_key);
        abort_if($contents === null, 404);

        $contentType = match ($artifactType) {
            ArtifactType::Pdf => 'application/pdf',
            ArtifactType::Log => 'text/plain; charset=utf-8',
            ArtifactType::Synctex, ArtifactType::Aux => 'application/octet-stream',
        };

        return response($contents, 200, [
            'Content-Type' => $contentType,
            'Content-Length' => (string) strlen($contents),
            'X-Content-Type-Options' => 'nosniff',
            'Cache-Control' => 'private, max-age=3600',
        ]);
    }

    private function synctexContents(Compilation $compilation, PrivateStorageService $storage): ?string
    {
        $artifact = $compilation->artifacts()
            ->where('type', ArtifactType::Synctex)
            ->first();

        if ($artifact === null) {
            return null;
        }

        return $storage->getContents($artifact->storage_key);
    }

    private function findProjectFile(Project $project, string $synctexPath): ?ProjectFile
    {
        $normalized = ltrim(str_replace('\\', '/', $synctexPath), './');

        return $project->files()
            ->where('is_directory', false)
            ->get()
            ->first(function (ProjectFile $file) use ($normalized): bool {
                return $normalized === $file->path
                    || str_ends_with($normalized, '/'.$file->path)
                    || basename($normalized) === basename($file->path);
            });
    }
}
