<?php

namespace App\Http\Controllers;

use App\Domain\Files\SaveProjectFileAction;
use App\Domain\Revisions\CreateRevisionAction;
use App\Http\Requests\InsertTableIntoFileRequest;
use App\Http\Requests\StoreTableDesignRequest;
use App\Http\Requests\UpdateTableDesignRequest;
use App\Models\Project;
use App\Models\ProjectFile;
use App\Models\TableDesign;
use App\Models\TableStyleProfile;
use App\Services\Storage\PrivateStorageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class TableDesignController extends Controller
{
    public function index(Request $request, Project $project, PrivateStorageService $storage): Response|JsonResponse
    {
        Gate::authorize('view', $project);

        $designs = TableDesign::query()
            ->where('project_id', $project->id)
            ->orderByDesc('updated_at')
            ->get()
            ->map(fn (TableDesign $design): array => $this->formatDesign($design))
            ->values();

        if ($request->wantsJson()) {
            return response()->json(['tables' => $designs]);
        }

        $user = $request->user();

        return Inertia::render('Projects/TableDesigner', [
            'project' => [
                'public_id' => $project->public_id,
                'title' => $project->title,
                'root_file_path' => $project->root_file_path,
                'can_edit' => $user !== null && ($project->roleFor($user)?->canEdit() ?? false),
            ],
            'tableDesigns' => $designs,
            'activeDesign' => $designs->first(),
            'styleProfiles' => $this->styleProfiles(),
            'projectFiles' => $this->projectTexFiles($project),
            'loadedPackages' => $this->detectLoadedPackages($project, $storage),
        ]);
    }

    public function show(Request $request, Project $project, TableDesign $tableDesign, PrivateStorageService $storage): Response
    {
        Gate::authorize('view', $project);
        abort_if($tableDesign->project_id !== $project->id, 404);

        $designs = TableDesign::query()
            ->where('project_id', $project->id)
            ->orderByDesc('updated_at')
            ->get()
            ->map(fn (TableDesign $design): array => $this->formatDesign($design))
            ->values();

        $user = $request->user();

        return Inertia::render('Projects/TableDesigner', [
            'project' => [
                'public_id' => $project->public_id,
                'title' => $project->title,
                'root_file_path' => $project->root_file_path,
                'can_edit' => $user !== null && ($project->roleFor($user)?->canEdit() ?? false),
            ],
            'tableDesigns' => $designs,
            'activeDesign' => $this->formatDesign($tableDesign),
            'styleProfiles' => $this->styleProfiles(),
            'projectFiles' => $this->projectTexFiles($project),
            'loadedPackages' => $this->detectLoadedPackages($project, $storage),
        ]);
    }

    public function store(StoreTableDesignRequest $request, Project $project): JsonResponse
    {
        Gate::authorize('editFiles', $project);

        $user = $request->user();
        abort_if($user === null, 401);

        $validated = $request->validated();

        $design = TableDesign::query()->create([
            'project_id' => $project->id,
            'user_id' => $user->id,
            'name' => trim((string) $validated['name']),
            'schema_version' => (int) $validated['schema_version'],
            'document_json' => $validated['document_json'],
            'generated_latex' => (string) $validated['generated_latex'],
            'status' => (string) ($validated['status'] ?? 'visual'),
        ]);

        return response()->json([
            'tableDesign' => $this->formatDesign($design),
        ], 201);
    }

    public function update(
        UpdateTableDesignRequest $request,
        Project $project,
        TableDesign $tableDesign,
    ): JsonResponse {
        Gate::authorize('editFiles', $project);
        abort_if($tableDesign->project_id !== $project->id, 404);

        $validated = $request->validated();

        $tableDesign->update([
            'name' => trim((string) $validated['name']),
            'schema_version' => (int) $validated['schema_version'],
            'document_json' => $validated['document_json'],
            'generated_latex' => (string) $validated['generated_latex'],
            'status' => (string) ($validated['status'] ?? $tableDesign->status),
        ]);

        return response()->json([
            'tableDesign' => $this->formatDesign($tableDesign),
        ]);
    }

    public function destroy(Project $project, TableDesign $tableDesign): RedirectResponse|JsonResponse
    {
        Gate::authorize('editFiles', $project);
        abort_if($tableDesign->project_id !== $project->id, 404);

        $tableDesign->delete();

        if (request()->wantsJson()) {
            return response()->json(['deleted' => true]);
        }

        return to_route('projects.tables.index', $project)
            ->with('success', 'Table design deleted.');
    }

    public function insertIntoFile(
        InsertTableIntoFileRequest $request,
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

        $contents = $file->storage_key !== null ? ($storage->getContents($file->storage_key) ?? '') : '';

        /** @var list<array{packageName: string, options?: list<string>}> $packagesToAdd */
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
        $revision = $createRevision->execute($project, $user, 'Inserted table into '.$file->path);

        if (! empty($validated['table_design_public_id'])) {
            TableDesign::query()
                ->where('project_id', $project->id)
                ->where('public_id', $validated['table_design_public_id'])
                ->update([
                    'source_file_id' => $savedFile->id,
                    'source_revision_id' => $revision->id,
                ]);
        }

        return response()->json([
            'file_path' => $savedFile->path,
            'file_version' => $savedFile->version,
            'revision_public_id' => $revision->public_id,
        ]);
    }

    /**
     * @return array{
     *     public_id: string,
     *     name: string,
     *     schema_version: int,
     *     document_json: array<string, mixed>,
     *     generated_latex: string,
     *     status: string,
     *     updated_at: string|null
     * }
     */
    private function formatDesign(TableDesign $design): array
    {
        return [
            'public_id' => $design->public_id,
            'name' => $design->name,
            'schema_version' => $design->schema_version,
            'document_json' => $design->document_json,
            'generated_latex' => $design->generated_latex,
            'status' => $design->status,
            'updated_at' => $design->updated_at?->toIso8601String(),
        ];
    }

    /**
     * @return list<array{
     *     public_id: string,
     *     name: string,
     *     slug: string,
     *     description: string|null,
     *     configuration_json: array<string, mixed>
     * }>
     */
    private function styleProfiles(): array
    {
        return TableStyleProfile::query()
            ->where('is_active', true)
            ->orderBy('id')
            ->get(['public_id', 'name', 'slug', 'description', 'configuration_json'])
            ->map(static fn (TableStyleProfile $p): array => [
                'public_id' => $p->public_id,
                'name' => $p->name,
                'slug' => $p->slug,
                'description' => $p->description,
                'configuration_json' => $p->configuration_json,
            ])
            ->values()
            ->all();
    }

    /**
     * @return list<array{public_id: string, path: string}>
     */
    private function projectTexFiles(Project $project): array
    {
        return $project->files()
            ->where('is_directory', false)
            ->orderBy('path')
            ->get(['public_id', 'path'])
            ->filter(static fn (ProjectFile $f): bool => str_ends_with($f->path, '.tex') || str_ends_with($f->path, '.ltx'))
            ->map(static fn (ProjectFile $f): array => [
                'public_id' => $f->public_id,
                'path' => $f->path,
            ])
            ->values()
            ->all();
    }

    /**
     * @return list<string>
     */
    private function detectLoadedPackages(Project $project, PrivateStorageService $storage): array
    {
        $root = $project->files()->where('path', $project->root_file_path)->first();
        if ($root === null || $root->storage_key === null) {
            return [];
        }
        $contents = $storage->getContents($root->storage_key) ?? '';
        preg_match_all('/\\\\usepackage(?:\[[^\]]*\])?\{([^}]+)\}/', $contents, $matches);
        $packages = [];
        foreach ($matches[1] as $group) {
            foreach (explode(',', $group) as $pkg) {
                $name = trim($pkg);
                if ($name !== '') {
                    $packages[] = $name;
                }
            }
        }

        return array_values(array_unique($packages));
    }

    /**
     * @param  list<array{packageName: string, options?: list<string>}>  $packagesToAdd
     */
    private function injectMissingPackages(string $contents, array $packagesToAdd): string
    {
        if ($packagesToAdd === []) {
            return $contents;
        }

        preg_match_all('/\\\\usepackage(?:\[[^\]]*\])?\{([^}]+)\}/', $contents, $matches);
        $existing = [];
        foreach ($matches[1] as $group) {
            foreach (explode(',', $group) as $pkg) {
                $existing[] = trim($pkg);
            }
        }

        $declarations = [];
        foreach ($packagesToAdd as $req) {
            $name = $req['packageName'];
            if (in_array($name, $existing, true)) {
                continue;
            }
            $opts = $req['options'] ?? [];
            $optStr = $opts !== [] ? '['.implode(',', $opts).']' : '';
            $declarations[] = "\\usepackage{$optStr}{{$name}}";
            $existing[] = $name;
        }

        if ($declarations === []) {
            return $contents;
        }

        $block = implode("\n", $declarations)."\n";
        if (str_contains($contents, '\begin{document}')) {
            return str_replace('\begin{document}', $block.'\begin{document}', $contents);
        }

        return $block.$contents;
    }
}
