<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFigureRequest;
use App\Http\Requests\UpdateFigureRequest;
use App\Models\Figure;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

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

        return Inertia::render('Projects/FigureEditor', [
            'project' => [
                'public_id' => $project->public_id,
                'title' => $project->title,
                'root_file_path' => $project->root_file_path,
                'can_edit' => $user !== null && ($project->roleFor($user)?->canEdit() ?? false),
            ],
            'figures' => $figures,
            'activeFigure' => $figures->first(),
        ]);
    }

    public function show(Request $request, Project $project, Figure $figure): Response
    {
        Gate::authorize('view', $project);
        abort_if($figure->project_id !== $project->id, 404);

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

        return response()->json([
            'figure' => $this->formatFigure($figure),
        ], 201);
    }

    public function update(UpdateFigureRequest $request, Project $project, Figure $figure): JsonResponse
    {
        Gate::authorize('editFiles', $project);
        abort_if($figure->project_id !== $project->id, 404);

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

        return response()->json([
            'figure' => $this->formatFigure($figure),
        ]);
    }

    public function destroy(Project $project, Figure $figure): JsonResponse
    {
        Gate::authorize('editFiles', $project);
        abort_if($figure->project_id !== $project->id, 404);

        $figure->delete();

        return response()->json(['deleted' => true]);
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
