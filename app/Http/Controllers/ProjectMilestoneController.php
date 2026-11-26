<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ProjectMilestone;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class ProjectMilestoneController extends Controller
{
    public function index(Project $project): JsonResponse
    {
        Gate::authorize('view', $project);

        $milestones = $project->milestones()
            ->withCount('tasks')
            ->orderBy('sort_order')
            ->orderBy('due_at')
            ->get()
            ->map(fn (ProjectMilestone $milestone): array => [
                'public_id' => $milestone->public_id,
                'title' => $milestone->title,
                'description' => $milestone->description,
                'status' => $milestone->status,
                'due_at' => $milestone->due_at?->toIso8601String(),
                'completed_at' => $milestone->completed_at?->toIso8601String(),
                'sort_order' => $milestone->sort_order,
                'tasks_count' => $milestone->tasks_count,
            ]);

        return response()->json(['milestones' => $milestones]);
    }

    public function store(Request $request, Project $project): JsonResponse
    {
        Gate::authorize('editFiles', $project);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'status' => ['nullable', Rule::in(['planned', 'active', 'completed'])],
            'due_at' => ['nullable', 'date'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:100000'],
        ]);

        $status = $validated['status'] ?? 'planned';

        $milestone = $project->milestones()->create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'status' => $status,
            'due_at' => isset($validated['due_at']) ? Carbon::parse($validated['due_at']) : null,
            'completed_at' => $status === 'completed' ? now() : null,
            'sort_order' => $validated['sort_order'] ?? 0,
        ]);

        return response()->json([
            'milestone' => [
                'public_id' => $milestone->public_id,
                'title' => $milestone->title,
                'description' => $milestone->description,
                'status' => $milestone->status,
                'due_at' => $milestone->due_at?->toIso8601String(),
                'completed_at' => $milestone->completed_at?->toIso8601String(),
                'sort_order' => $milestone->sort_order,
                'tasks_count' => 0,
            ],
        ], 201);
    }

    public function update(Request $request, Project $project, ProjectMilestone $milestone): JsonResponse
    {
        Gate::authorize('editFiles', $project);
        abort_unless($milestone->project_id === $project->id, 404);

        $validated = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'status' => ['sometimes', Rule::in(['planned', 'active', 'completed'])],
            'due_at' => ['nullable', 'date'],
            'sort_order' => ['sometimes', 'integer', 'min:0', 'max:100000'],
        ]);

        if (isset($validated['due_at'])) {
            $validated['due_at'] = Carbon::parse($validated['due_at']);
        }

        if (isset($validated['status'])) {
            $validated['completed_at'] = $validated['status'] === 'completed' ? now() : null;
        }

        $milestone->update($validated);

        return response()->json([
            'milestone' => [
                'public_id' => $milestone->public_id,
                'title' => $milestone->title,
                'description' => $milestone->description,
                'status' => $milestone->status,
                'due_at' => $milestone->due_at?->toIso8601String(),
                'completed_at' => $milestone->completed_at?->toIso8601String(),
                'sort_order' => $milestone->sort_order,
                'tasks_count' => $milestone->tasks()->count(),
            ],
        ]);
    }

    public function destroy(Project $project, ProjectMilestone $milestone): JsonResponse
    {
        Gate::authorize('editFiles', $project);
        abort_unless($milestone->project_id === $project->id, 404);

        $milestone->tasks()->update(['milestone_id' => null]);
        $milestone->delete();

        return response()->json(['deleted' => true]);
    }
}
