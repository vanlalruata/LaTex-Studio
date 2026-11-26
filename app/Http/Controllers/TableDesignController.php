<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTableDesignRequest;
use App\Http\Requests\UpdateTableDesignRequest;
use App\Models\Project;
use App\Models\TableDesign;
use App\Models\TableStyleProfile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class TableDesignController extends Controller
{
    public function index(Request $request, Project $project): Response|JsonResponse
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
                'can_edit' => $user !== null && ($project->roleFor($user)?->canEdit() ?? false),
            ],
            'tableDesigns' => $designs,
            'activeDesign' => $designs->first(),
            'styleProfiles' => $this->styleProfiles(),
        ]);
    }

    public function show(Request $request, Project $project, TableDesign $tableDesign): Response
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
                'can_edit' => $user !== null && ($project->roleFor($user)?->canEdit() ?? false),
            ],
            'tableDesigns' => $designs,
            'activeDesign' => $this->formatDesign($tableDesign),
            'styleProfiles' => $this->styleProfiles(),
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
}
