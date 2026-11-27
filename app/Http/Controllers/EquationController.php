<?php

namespace App\Http\Controllers;

use App\Domain\Diagnostics\DiagnosticsNormalizer;
use App\Domain\Equations\StandaloneEquationBuilder;
use App\Domain\Files\SaveProjectFileAction;
use App\Domain\Revisions\CreateRevisionAction;
use App\DTOs\CompilationRequest;
use App\Enums\CompilationStatus;
use App\Enums\CompilerEngine;
use App\Http\Requests\InsertEquationIntoFileRequest;
use App\Http\Requests\StoreEquationRequest;
use App\Http\Requests\UpdateEquationRequest;
use App\Models\Equation;
use App\Models\EquationComment;
use App\Models\EquationRevision;
use App\Models\Project;
use App\Models\ProjectFile;
use App\Services\Compiler\LatexCompilerInterface;
use App\Services\Storage\PrivateStorageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class EquationController extends Controller
{
    public function index(Request $request, Project $project): Response|JsonResponse
    {
        Gate::authorize('view', $project);

        $equations = Equation::query()
            ->where('project_id', $project->id)
            ->orderByDesc('updated_at')
            ->get()
            ->map(fn (Equation $eq): array => $this->formatEquation($project, $eq))
            ->values();

        if ($request->wantsJson()) {
            return response()->json(['equations' => $equations]);
        }

        $user = $request->user();
        $first = Equation::query()
            ->where('project_id', $project->id)
            ->with(['revisions.user', 'comments.user'])
            ->orderByDesc('updated_at')
            ->first();

        return Inertia::render('Projects/EquationStudio', [
            'project' => [
                'public_id' => $project->public_id,
                'title' => $project->title,
                'root_file_path' => $project->root_file_path,
                'can_edit' => $user !== null && ($project->roleFor($user)?->canEdit() ?? false),
                'can_comment' => $user !== null && ($project->roleFor($user)?->canComment() ?? false),
            ],
            'equations' => $equations,
            'activeEquation' => $first !== null ? $this->formatEquation($project, $first) : null,
            'projectFiles' => $this->projectTexFiles($project),
            'revisions' => $first !== null ? $this->formatRevisions($first) : [],
            'comments' => $first !== null ? $this->formatComments($first) : [],
        ]);
    }

    public function show(Request $request, Project $project, Equation $equation): Response
    {
        Gate::authorize('view', $project);
        abort_if($equation->project_id !== $project->id, 404);

        $equation->load(['revisions.user', 'comments.user']);

        $equations = Equation::query()
            ->where('project_id', $project->id)
            ->orderByDesc('updated_at')
            ->get()
            ->map(fn (Equation $eq): array => $this->formatEquation($project, $eq))
            ->values();

        $user = $request->user();

        return Inertia::render('Projects/EquationStudio', [
            'project' => [
                'public_id' => $project->public_id,
                'title' => $project->title,
                'root_file_path' => $project->root_file_path,
                'can_edit' => $user !== null && ($project->roleFor($user)?->canEdit() ?? false),
                'can_comment' => $user !== null && ($project->roleFor($user)?->canComment() ?? false),
            ],
            'equations' => $equations,
            'activeEquation' => $this->formatEquation($project, $equation),
            'projectFiles' => $this->projectTexFiles($project),
            'revisions' => $this->formatRevisions($equation),
            'comments' => $this->formatComments($equation),
        ]);
    }

    public function store(StoreEquationRequest $request, Project $project): JsonResponse
    {
        Gate::authorize('editFiles', $project);

        $user = $request->user();
        abort_if($user === null, 401);

        $validated = $request->validated();
        $latex = (string) $validated['latex_source'];

        $equation = Equation::query()->create([
            'project_id' => $project->id,
            'user_id' => $user->id,
            'title' => trim((string) $validated['title']),
            'schema_version' => (int) ($validated['schema_version'] ?? 1),
            'content_mode' => (string) ($validated['content_mode'] ?? 'structured'),
            'math_mode' => (string) ($validated['math_mode'] ?? 'display'),
            'environment' => (string) ($validated['environment'] ?? 'equation'),
            'structured_document_json' => $validated['structured_document_json'] ?? null,
            'latex_source' => $latex,
            'package_requirements_json' => $validated['package_requirements_json'] ?? ['amsmath'],
            'source_hash' => hash('sha256', $latex),
        ]);

        $this->recordRevision($equation, $user->id, 'Initial equation snapshot');

        return response()->json([
            'equation' => $this->formatEquation($project, $equation),
            'revisions' => $this->formatRevisions($equation->load('revisions.user')),
        ], 201);
    }

    public function update(UpdateEquationRequest $request, Project $project, Equation $equation): JsonResponse
    {
        Gate::authorize('editFiles', $project);
        abort_if($equation->project_id !== $project->id, 404);

        $user = $request->user();
        abort_if($user === null, 401);

        $validated = $request->validated();
        $latex = $validated['latex_source'] ?? $equation->latex_source;

        $equation->fill([
            'title' => isset($validated['title']) ? trim((string) $validated['title']) : $equation->title,
            'content_mode' => $validated['content_mode'] ?? $equation->content_mode,
            'math_mode' => $validated['math_mode'] ?? $equation->math_mode,
            'environment' => $validated['environment'] ?? $equation->environment,
            'structured_document_json' => array_key_exists('structured_document_json', $validated)
                ? $validated['structured_document_json']
                : $equation->structured_document_json,
            'latex_source' => $latex,
            'package_requirements_json' => array_key_exists('package_requirements_json', $validated)
                ? $validated['package_requirements_json']
                : $equation->package_requirements_json,
            'source_hash' => hash('sha256', (string) $latex),
        ]);
        $equation->save();

        $this->recordRevision($equation, $user->id, 'Saved equation changes');

        return response()->json([
            'equation' => $this->formatEquation($project, $equation),
            'revisions' => $this->formatRevisions($equation->load('revisions.user')),
        ]);
    }

    public function destroy(Project $project, Equation $equation): JsonResponse
    {
        Gate::authorize('editFiles', $project);
        abort_if($equation->project_id !== $project->id, 404);

        $equation->delete();

        return response()->json(['deleted' => true]);
    }

    public function restoreRevision(
        Request $request,
        Project $project,
        Equation $equation,
        EquationRevision $revision,
    ): JsonResponse {
        Gate::authorize('editFiles', $project);
        abort_if($equation->project_id !== $project->id || $revision->equation_id !== $equation->id, 404);

        $user = $request->user();
        abort_if($user === null, 401);

        $equation->update([
            'content_mode' => $revision->content_mode,
            'structured_document_json' => $revision->structured_document_json,
            'latex_source' => $revision->latex_source,
            'source_hash' => hash('sha256', $revision->latex_source),
        ]);

        $this->recordRevision($equation, $user->id, 'Restored revision '.$revision->public_id);

        return response()->json([
            'equation' => $this->formatEquation($project, $equation->fresh() ?? $equation),
            'revisions' => $this->formatRevisions($equation->load('revisions.user')),
        ]);
    }

    public function insertIntoFile(
        InsertEquationIntoFileRequest $request,
        Project $project,
        PrivateStorageService $storage,
        SaveProjectFileAction $saveFile,
        CreateRevisionAction $createRevision,
    ): JsonResponse {
        Gate::authorize('editFiles', $project);

        $user = $request->user();
        abort_if($user === null, 401);

        $validated = $request->validated();

        /** @var ProjectFile|null $file */
        $file = $project->files()
            ->where('public_id', $validated['file_public_id'])
            ->where('is_directory', false)
            ->first();
        abort_if($file === null, 404, 'Target project file not found.');

        if (isset($validated['expected_file_version']) && (int) $validated['expected_file_version'] !== $file->version) {
            return response()->json([
                'message' => 'Target file has been modified since you opened it. Reload before inserting.',
                'current_version' => $file->version,
            ], 409);
        }

        $contents = $file->storage_key !== null ? ($storage->getContents($file->storage_key) ?? '') : '';

        /** @var list<string> $packagesToAdd */
        $packagesToAdd = $validated['packages_to_add'] ?? [];
        $contents = $this->injectMissingPackages($contents, $packagesToAdd);

        $latex = trim((string) $validated['latex']);
        $insertAtLine = $validated['insert_at_line'] ?? null;

        if (is_int($insertAtLine)) {
            $lines = explode("\n", $contents);
            $idx = max(0, min(count($lines), $insertAtLine - 1));
            array_splice($lines, $idx, 0, ['', $latex, '']);
            $updatedContents = implode("\n", $lines);
        } elseif (str_contains($contents, '\end{document}')) {
            $updatedContents = str_replace(
                '\end{document}',
                "\n".$latex."\n\n\\end{document}",
                $contents,
            );
        } else {
            $updatedContents = rtrim($contents)."\n\n".$latex."\n";
        }

        $savedFile = $saveFile->execute($project, $file, $updatedContents, $user);
        $revision = $createRevision->execute($project, $user, 'Inserted equation into '.$file->path);

        return response()->json([
            'file_path' => $savedFile->path,
            'file_version' => $savedFile->version,
            'revision_public_id' => $revision->public_id,
        ]);
    }

    public function compilePreview(
        Project $project,
        Equation $equation,
        LatexCompilerInterface $compiler,
        PrivateStorageService $storage,
        DiagnosticsNormalizer $normalizer,
        StandaloneEquationBuilder $builder,
    ): JsonResponse {
        Gate::authorize('compile', $project);
        abort_if($equation->project_id !== $project->id, 404);

        $workDir = storage_path('app/build-workspaces/'.Str::uuid()->toString());
        $srcDir = $workDir.DIRECTORY_SEPARATOR.'src';

        try {
            File::ensureDirectoryExists($srcDir);
            file_put_contents($srcDir.DIRECTORY_SEPARATOR.'equation.tex', $builder->build($equation));

            $result = $compiler->compile(new CompilationRequest(
                compilationPublicId: $equation->public_id,
                workspacePath: $workDir,
                engine: CompilerEngine::PdfLaTeX,
                rootFile: 'equation.tex',
                bibliographyTool: 'none',
                enableSynctex: false,
                wallTimeoutSeconds: 15,
                memoryMb: 512,
                cpus: 1.0,
                pidsLimit: 64,
                maxOutputMb: 15,
            ));

            $diagnostics = [];
            if ($result->logContents !== null) {
                foreach ($normalizer->normalize($result->logContents) as $item) {
                    $diagnostics[] = [
                        'severity' => $item['severity']->value,
                        'line' => $item['line'],
                        'message' => $item['message'],
                    ];
                }
            }

            if ($result->status === CompilationStatus::Succeeded && $result->pdfContents !== null) {
                $stored = $storage->putBuildArtifact("equation-{$equation->public_id}", 'equation.pdf', $result->pdfContents);
                $equation->update(['last_successful_pdf_key' => $stored['storage_key']]);

                return response()->json([
                    'status' => 'succeeded',
                    'duration_ms' => $result->durationMs,
                    'pdf_url' => route('projects.equations.preview-pdf', [$project, $equation]),
                    'diagnostics' => $diagnostics,
                ]);
            }

            return response()->json([
                'status' => 'failed',
                'error_summary' => $result->errorSummary ?? 'TeX compilation failed.',
                'pdf_url' => $equation->last_successful_pdf_key !== null
                    ? route('projects.equations.preview-pdf', [$project, $equation])
                    : null,
                'diagnostics' => $diagnostics,
            ], 422);
        } finally {
            File::deleteDirectory($workDir);
        }
    }

    public function previewPdf(
        Project $project,
        Equation $equation,
        PrivateStorageService $storage,
    ): HttpResponse {
        Gate::authorize('view', $project);
        abort_if($equation->project_id !== $project->id || $equation->last_successful_pdf_key === null, 404);

        $contents = $storage->getContents($equation->last_successful_pdf_key);
        abort_if($contents === null, 404);

        return response($contents, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => "inline; filename=\"{$equation->public_id}.pdf\"",
        ]);
    }

    public function storeComment(Request $request, Project $project, Equation $equation): JsonResponse
    {
        Gate::authorize('comment', $project);
        abort_if($equation->project_id !== $project->id, 404);

        $user = $request->user();
        abort_if($user === null, 401);

        $validated = $request->validate([
            'body' => ['required', 'string', 'max:2000'],
        ]);

        $comment = EquationComment::query()->create([
            'equation_id' => $equation->id,
            'user_id' => $user->id,
            'body' => trim((string) $validated['body']),
        ]);

        $comment->load('user');

        return response()->json([
            'comment' => $this->formatComment($comment),
        ], 201);
    }

    public function toggleResolveComment(
        Request $request,
        Project $project,
        Equation $equation,
        EquationComment $comment,
    ): JsonResponse {
        Gate::authorize('comment', $project);
        abort_if($equation->project_id !== $project->id || $comment->equation_id !== $equation->id, 404);

        $user = $request->user();
        abort_if($user === null, 401);

        if ($comment->resolved_at === null) {
            $comment->update(['resolved_at' => now(), 'resolved_by' => $user->id]);
        } else {
            $comment->update(['resolved_at' => null, 'resolved_by' => null]);
        }

        $comment->load('user');

        return response()->json([
            'comment' => $this->formatComment($comment),
        ]);
    }

    /**
     * @param  list<string>  $packages
     */
    private function injectMissingPackages(string $contents, array $packages): string
    {
        $injections = [];
        foreach ($packages as $pkg) {
            if ($pkg === '' || str_contains($contents, "\\usepackage{{$pkg}}")) {
                continue;
            }
            $injections[] = "\\usepackage{{$pkg}}";
        }
        if ($injections === []) {
            return $contents;
        }
        $block = implode("\n", $injections)."\n";
        if (str_contains($contents, '\begin{document}')) {
            return str_replace('\begin{document}', $block.'\begin{document}', $contents);
        }

        return $block.$contents;
    }

    private function recordRevision(Equation $equation, int $userId, string $summary): void
    {
        EquationRevision::query()->create([
            'equation_id' => $equation->id,
            'user_id' => $userId,
            'content_mode' => $equation->content_mode,
            'structured_document_json' => $equation->structured_document_json,
            'latex_source' => $equation->latex_source,
            'summary' => $summary,
        ]);
    }

    /**
     * @return list<array{public_id: string, path: string, version: int}>
     */
    private function projectTexFiles(Project $project): array
    {
        return array_values($project->files()
            ->where('is_directory', false)
            ->where('path', 'like', '%.tex')
            ->orderBy('path')
            ->get()
            ->map(fn (ProjectFile $file): array => [
                'public_id' => $file->public_id,
                'path' => $file->path,
                'version' => $file->version,
            ])
            ->all());
    }

    /**
     * @return list<array{public_id: string, summary: string|null, content_mode: string, author: string, created_at: string|null}>
     */
    private function formatRevisions(Equation $equation): array
    {
        return array_values($equation->revisions()
            ->with('user')
            ->orderByDesc('id')
            ->limit(20)
            ->get()
            ->map(fn (EquationRevision $rev): array => [
                'public_id' => $rev->public_id,
                'summary' => $rev->summary,
                'content_mode' => $rev->content_mode,
                'author' => $rev->user->name ?? 'Unknown',
                'created_at' => $rev->created_at?->toIso8601String(),
            ])
            ->all());
    }

    /**
     * @return list<array{public_id: string, body: string, author: string, is_resolved: bool, created_at: string|null}>
     */
    private function formatComments(Equation $equation): array
    {
        return array_values($equation->comments()
            ->with('user')
            ->orderByDesc('id')
            ->get()
            ->map(fn (EquationComment $comment): array => $this->formatComment($comment))
            ->all());
    }

    /**
     * @return array{public_id: string, body: string, author: string, is_resolved: bool, created_at: string|null}
     */
    private function formatComment(EquationComment $comment): array
    {
        return [
            'public_id' => $comment->public_id,
            'body' => $comment->body,
            'author' => $comment->user->name ?? 'Unknown',
            'is_resolved' => $comment->resolved_at !== null,
            'created_at' => $comment->created_at?->toIso8601String(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function formatEquation(Project $project, Equation $equation): array
    {
        return [
            'public_id' => $equation->public_id,
            'title' => $equation->title,
            'schema_version' => $equation->schema_version,
            'content_mode' => $equation->content_mode,
            'math_mode' => $equation->math_mode,
            'environment' => $equation->environment,
            'structured_document_json' => $equation->structured_document_json,
            'latex_source' => $equation->latex_source,
            'package_requirements_json' => $equation->package_requirements_json ?? ['amsmath'],
            'pdf_url' => $equation->last_successful_pdf_key !== null
                ? route('projects.equations.preview-pdf', [$project, $equation])
                : null,
            'updated_at' => $equation->updated_at?->toIso8601String(),
        ];
    }
}
