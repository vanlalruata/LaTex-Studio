<?php

namespace App\Http\Controllers;

use App\Domain\Figures\StandaloneTikzBuilder;
use App\Domain\Files\PathValidator;
use App\Domain\Files\SaveProjectFileAction;
use App\Domain\Revisions\CreateRevisionAction;
use App\Http\Requests\InsertFigureIntoFileRequest;
use App\Http\Requests\StoreFigureRequest;
use App\Http\Requests\UpdateFigureRequest;
use App\Models\Figure;
use App\Models\FigureRenderJob;
use App\Models\FigureRevision;
use App\Models\Project;
use App\Models\ProjectFile;
use App\Services\Storage\PrivateStorageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class FigureController extends Controller
{
    public function index(Request $request, Project $project): Response|JsonResponse
    {
        Gate::authorize('view', $project);

        $figures = Figure::query()
            ->where('project_id', $project->id)
            ->orderByDesc('updated_at')
            ->get()
            ->map(fn (Figure $figure): array => $this->formatFigure($figure))
            ->values();

        if ($request->wantsJson()) {
            return response()->json(['figures' => $figures]);
        }

        $user = $request->user();
        $first = Figure::query()
            ->where('project_id', $project->id)
            ->with(['lastSuccessfulRenderJob.artifacts', 'revisions.user'])
            ->orderByDesc('updated_at')
            ->first();

        return Inertia::render('Projects/FigureEditor', [
            'project' => [
                'public_id' => $project->public_id,
                'title' => $project->title,
                'root_file_path' => $project->root_file_path,
                'can_edit' => $user !== null && ($project->roleFor($user)?->canEdit() ?? false),
            ],
            'figures' => $figures,
            'activeFigure' => $first !== null ? $this->formatFigure($first) : null,
            'projectFiles' => $this->projectTexFiles($project),
            'revisions' => $first !== null ? $this->formatRevisions($first) : [],
            'lastRender' => $first?->lastSuccessfulRenderJob !== null
                ? $this->formatRenderSummary($project, $first, $first->lastSuccessfulRenderJob)
                : null,
        ]);
    }

    public function show(Request $request, Project $project, Figure $figure): Response
    {
        Gate::authorize('view', $project);
        abort_if($figure->project_id !== $project->id, 404);

        $figure->load(['lastSuccessfulRenderJob.artifacts', 'revisions.user']);

        $figures = Figure::query()
            ->where('project_id', $project->id)
            ->orderByDesc('updated_at')
            ->get()
            ->map(fn (Figure $item): array => $this->formatFigure($item))
            ->values();

        $user = $request->user();

        return Inertia::render('Projects/FigureEditor', [
            'project' => [
                'public_id' => $project->public_id,
                'title' => $project->title,
                'root_file_path' => $project->root_file_path,
                'can_edit' => $user !== null && ($project->roleFor($user)?->canEdit() ?? false),
            ],
            'figures' => $figures,
            'activeFigure' => $this->formatFigure($figure),
            'projectFiles' => $this->projectTexFiles($project),
            'revisions' => $this->formatRevisions($figure),
            'lastRender' => $figure->lastSuccessfulRenderJob !== null
                ? $this->formatRenderSummary($project, $figure, $figure->lastSuccessfulRenderJob)
                : null,
        ]);
    }

    public function store(StoreFigureRequest $request, Project $project): JsonResponse
    {
        Gate::authorize('editFiles', $project);

        $user = $request->user();
        abort_if($user === null, 401);

        $validated = $request->validated();

        $figure = Figure::query()->create([
            'project_id' => $project->id,
            'user_id' => $user->id,
            'name' => trim((string) $validated['name']),
            'schema_version' => (int) $validated['schema_version'],
            'mode' => (string) ($validated['mode'] ?? 'visual_native'),
            'scene_json' => $validated['scene_json'],
            'tikz_source' => (string) $validated['tikz_source'],
            'required_packages_json' => $validated['required_packages_json'] ?? ['tikz'],
            'required_libraries_json' => $validated['required_libraries_json'] ?? [],
        ]);

        $this->recordRevision($figure, $user->id, 'Initial figure snapshot');

        return response()->json([
            'figure' => $this->formatFigure($figure),
            'revisions' => $this->formatRevisions($figure->load('revisions.user')),
        ], 201);
    }

    public function update(UpdateFigureRequest $request, Project $project, Figure $figure): JsonResponse
    {
        Gate::authorize('editFiles', $project);
        abort_if($figure->project_id !== $project->id, 404);

        $user = $request->user();
        abort_if($user === null, 401);

        $validated = $request->validated();

        $figure->fill([
            'name' => isset($validated['name']) ? trim((string) $validated['name']) : $figure->name,
            'schema_version' => $validated['schema_version'] ?? $figure->schema_version,
            'mode' => $validated['mode'] ?? $figure->mode,
            'scene_json' => $validated['scene_json'] ?? $figure->scene_json,
            'tikz_source' => $validated['tikz_source'] ?? $figure->tikz_source,
            'required_packages_json' => array_key_exists('required_packages_json', $validated)
                ? $validated['required_packages_json']
                : $figure->required_packages_json,
            'required_libraries_json' => array_key_exists('required_libraries_json', $validated)
                ? $validated['required_libraries_json']
                : $figure->required_libraries_json,
        ]);
        $figure->save();

        $this->recordRevision($figure, $user->id, 'Saved changes');

        return response()->json([
            'figure' => $this->formatFigure($figure),
            'revisions' => $this->formatRevisions($figure->load('revisions.user')),
        ]);
    }

    public function destroy(Project $project, Figure $figure): JsonResponse
    {
        Gate::authorize('editFiles', $project);
        abort_if($figure->project_id !== $project->id, 404);

        $figure->delete();

        return response()->json(['deleted' => true]);
    }

    public function restoreRevision(
        Request $request,
        Project $project,
        Figure $figure,
        FigureRevision $revision,
    ): JsonResponse {
        Gate::authorize('editFiles', $project);
        abort_if($figure->project_id !== $project->id || $revision->figure_id !== $figure->id, 404);

        $user = $request->user();
        abort_if($user === null, 401);

        $figure->update([
            'schema_version' => $revision->schema_version,
            'mode' => $revision->mode,
            'scene_json' => $revision->scene_json,
            'tikz_source' => $revision->tikz_source,
        ]);

        $this->recordRevision($figure, $user->id, 'Restored revision '.$revision->public_id);

        return response()->json([
            'figure' => $this->formatFigure($figure->fresh() ?? $figure),
            'revisions' => $this->formatRevisions($figure->load('revisions.user')),
        ]);
    }

    public function exportTex(
        Request $request,
        Project $project,
        Figure $figure,
        StandaloneTikzBuilder $builder,
    ): HttpResponse {
        Gate::authorize('export', $project);
        abort_if($figure->project_id !== $project->id, 404);

        $standalone = $request->boolean('standalone', false);
        $content = $standalone ? $builder->build($figure) : $figure->tikz_source."\n";
        $slug = Str::slug($figure->name) ?: 'figure';
        $suffix = $standalone ? '-standalone.tex' : '.tex';

        return response($content, 200, [
            'Content-Type' => 'application/x-tex; charset=utf-8',
            'Content-Disposition' => "attachment; filename=\"{$slug}{$suffix}\"",
        ]);
    }

    public function insertIntoFile(
        InsertFigureIntoFileRequest $request,
        Project $project,
        PrivateStorageService $storage,
        PathValidator $pathValidator,
        SaveProjectFileAction $saveFile,
        CreateRevisionAction $createRevision,
    ): JsonResponse {
        Gate::authorize('editFiles', $project);

        $user = $request->user();
        abort_if($user === null, 401);

        $validated = $request->validated();

        /** @var ProjectFile|null $targetFile */
        $targetFile = $project->files()
            ->where('public_id', $validated['file_public_id'])
            ->where('is_directory', false)
            ->first();
        abort_if($targetFile === null, 404, 'Target project file not found.');

        $tikzSource = trim((string) $validated['tikz_source']);
        $placement = trim((string) ($validated['placement'] ?? 'htbp')) ?: 'htbp';
        $caption = trim((string) ($validated['caption'] ?? ''));
        $label = trim((string) ($validated['label'] ?? ''));

        $externalPath = null;
        if ($validated['mode'] === 'external') {
            $slug = Str::slug((string) ($validated['figure_slug'] ?? 'figure')) ?: 'figure';
            $externalPath = $pathValidator->normalize("figures/{$slug}.tex");

            /** @var ProjectFile|null $existingExternal */
            $existingExternal = $project->files()
                ->where('path', $externalPath)
                ->where('is_directory', false)
                ->first();

            if ($existingExternal === null) {
                $stored = $storage->putProjectFile($project->public_id, $tikzSource."\n");
                ProjectFile::query()->create([
                    'project_id' => $project->id,
                    'path' => $externalPath,
                    'storage_key' => $stored['storage_key'],
                    'mime_type' => 'application/x-tex',
                    'size_bytes' => $stored['size_bytes'],
                    'sha256_checksum' => $stored['sha256_checksum'],
                    'is_directory' => false,
                    'version' => 1,
                    'updated_by' => $user->id,
                ]);
            } else {
                $saveFile->execute($project, $existingExternal, $tikzSource."\n", $user);
            }

            $body = "\\input{{$externalPath}}";
        } else {
            $body = $tikzSource;
        }

        $figureLines = [
            "\\begin{figure}[{$placement}]",
            '  \\centering',
            $body,
        ];
        if ($caption !== '') {
            $figureLines[] = "  \\caption{{$caption}}";
        }
        if ($label !== '') {
            $figureLines[] = "  \\label{{$label}}";
        }
        $figureLines[] = '\\end{figure}';
        $snippet = implode("\n", $figureLines);

        $contents = $targetFile->storage_key !== null ? ($storage->getContents($targetFile->storage_key) ?? '') : '';

        /** @var list<string> $packagesToAdd */
        $packagesToAdd = $validated['packages_to_add'] ?? ['tikz'];
        /** @var list<string> $librariesToAdd */
        $librariesToAdd = $validated['libraries_to_add'] ?? [];
        $contents = $this->injectPreambleRequirements($contents, $packagesToAdd, $librariesToAdd);

        $insertAtLine = $validated['insert_at_line'] ?? null;
        if (is_int($insertAtLine)) {
            $lines = explode("\n", $contents);
            $idx = max(0, min(count($lines), $insertAtLine - 1));
            array_splice($lines, $idx, 0, ['', $snippet, '']);
            $updatedContents = implode("\n", $lines);
        } elseif (str_contains($contents, '\end{document}')) {
            $updatedContents = str_replace(
                '\end{document}',
                "\n".$snippet."\n\n\\end{document}",
                $contents,
            );
        } else {
            $updatedContents = rtrim($contents)."\n\n".$snippet."\n";
        }

        $savedFile = $saveFile->execute($project, $targetFile, $updatedContents, $user);
        $revision = $createRevision->execute($project, $user, 'Inserted TikZ figure into '.$targetFile->path);

        return response()->json([
            'file_path' => $savedFile->path,
            'external_file_path' => $externalPath,
            'file_version' => $savedFile->version,
            'revision_public_id' => $revision->public_id,
        ]);
    }

    /**
     * @param  list<string>  $packages
     * @param  list<string>  $libraries
     */
    private function injectPreambleRequirements(string $contents, array $packages, array $libraries): string
    {
        $injections = [];
        foreach ($packages as $pkg) {
            if ($pkg === '' || str_contains($contents, "\\usepackage{{$pkg}}")) {
                continue;
            }
            $injections[] = "\\usepackage{{$pkg}}";
        }

        $missingLibs = [];
        foreach ($libraries as $lib) {
            if ($lib !== '' && ! str_contains($contents, $lib)) {
                $missingLibs[] = $lib;
            }
        }
        if ($missingLibs !== []) {
            $injections[] = '\\usetikzlibrary{'.implode(', ', $missingLibs).'}';
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

    private function recordRevision(Figure $figure, int $userId, string $summary): void
    {
        FigureRevision::query()->create([
            'figure_id' => $figure->id,
            'user_id' => $userId,
            'schema_version' => $figure->schema_version,
            'mode' => $figure->mode,
            'scene_json' => $figure->scene_json,
            'tikz_source' => $figure->tikz_source,
            'summary' => $summary,
        ]);
    }

    /**
     * @return list<array{public_id: string, path: string}>
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
            ])
            ->all());
    }

    /**
     * @return list<array{public_id: string, summary: string|null, mode: string, author: string, created_at: string|null}>
     */
    private function formatRevisions(Figure $figure): array
    {
        return array_values($figure->revisions()
            ->with('user')
            ->orderByDesc('id')
            ->limit(20)
            ->get()
            ->map(fn (FigureRevision $rev): array => [
                'public_id' => $rev->public_id,
                'summary' => $rev->summary,
                'mode' => $rev->mode,
                'author' => $rev->user->name ?? 'Unknown',
                'created_at' => $rev->created_at?->toIso8601String(),
            ])
            ->all());
    }

    /**
     * @return array<string, mixed>
     */
    private function formatRenderSummary(Project $project, Figure $figure, FigureRenderJob $job): array
    {
        $artifactTypes = $job->artifacts->pluck('type')->values()->all();

        return [
            'public_id' => $job->public_id,
            'engine' => $job->engine,
            'status' => $job->status,
            'is_terminal' => in_array($job->status, ['succeeded', 'failed', 'timed_out'], true),
            'exit_code' => $job->exit_code,
            'duration_ms' => $job->duration_ms,
            'error_summary' => $job->error_summary,
            'diagnostics' => $job->diagnostics_json ?? [],
            'artifacts' => $artifactTypes,
            'pdf_url' => in_array('pdf', $artifactTypes, true)
                ? route('projects.figures.renders.artifact', [$project, $figure, $job, 'pdf'])
                : null,
            'log_url' => in_array('log', $artifactTypes, true)
                ? route('projects.figures.renders.artifact', [$project, $figure, $job, 'log'])
                : null,
            'finished_at' => $job->finished_at?->toIso8601String(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function formatFigure(Figure $figure): array
    {
        return [
            'public_id' => $figure->public_id,
            'name' => $figure->name,
            'schema_version' => $figure->schema_version,
            'mode' => $figure->mode,
            'scene_json' => $figure->scene_json,
            'tikz_source' => $figure->tikz_source,
            'required_packages_json' => $figure->required_packages_json ?? ['tikz'],
            'required_libraries_json' => $figure->required_libraries_json ?? [],
            'updated_at' => $figure->updated_at?->toIso8601String(),
        ];
    }
}
