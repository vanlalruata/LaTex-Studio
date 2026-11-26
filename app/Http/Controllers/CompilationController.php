<?php

namespace App\Http\Controllers;

use App\Domain\Compilation\RequestCompilationAction;
use App\Enums\ArtifactType;
use App\Models\Compilation;
use App\Models\Project;
use App\Services\Storage\PrivateStorageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
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

        $compilation->load('diagnostics');

        return response()->json([
            'public_id' => $compilation->public_id,
            'status' => $compilation->status->value,
            'compiler_engine' => $compilation->compiler_engine->value,
            'exit_code' => $compilation->exit_code,
            'duration_ms' => $compilation->duration_ms,
            'error_summary' => $compilation->error_summary,
            'is_terminal' => $compilation->status->isTerminal(),
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
}
