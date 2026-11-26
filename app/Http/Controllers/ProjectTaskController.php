<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ProjectMember;
use App\Models\ProjectMilestone;
use App\Models\ProjectTask;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class ProjectTaskController extends Controller
{
    public function index(Project $project): JsonResponse
    {
        Gate::authorize('view', $project);

        $tasks = $project->tasks()
            ->with(['assignee:id,name', 'milestone:id,public_id,title'])
            ->orderByRaw("case when status = 'done' then 1 else 0 end")
            ->orderBy('sort_order')
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (ProjectTask $task): array => $this->taskPayload($task))
            ->values();

        $milestones = $project->milestones()
            ->withCount('tasks')
            ->orderBy('sort_order')
            ->orderBy('due_at')
            ->get()
            ->map(fn (ProjectMilestone $milestone): array => $this->milestonePayload($milestone))
            ->values();

        return response()->json([
            'tasks' => $tasks,
            'milestones' => $milestones,
        ]);
    }

    public function store(Request $request, Project $project): JsonResponse
    {
        Gate::authorize('editFiles', $project);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'status' => ['nullable', Rule::in(['todo', 'in_progress', 'blocked', 'done'])],
            'priority' => ['nullable', Rule::in(['low', 'medium', 'high', 'urgent'])],
            'assigned_to' => ['nullable', 'integer', 'exists:users,id'],
            'milestone_id' => ['nullable', 'string'],
            'due_at' => ['nullable', 'date'],
            'sort_order' => ['nullable', 'integer', 'min:0', 'max:100000'],
        ]);

        $milestone = $this->resolveMilestone($project, $validated['milestone_id'] ?? null);
        $assignee = $this->resolveAssignee($project, $validated['assigned_to'] ?? null);

        $status = $validated['status'] ?? 'todo';

        $task = $project->tasks()->create([
            'milestone_id' => $milestone?->id,
            'assigned_to' => $assignee?->id,
            'created_by' => $request->user()?->id,
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'status' => $status,
            'priority' => $validated['priority'] ?? 'medium',
            'due_at' => isset($validated['due_at']) ? Carbon::parse($validated['due_at']) : null,
            'completed_at' => $status === 'done' ? now() : null,
            'sort_order' => $validated['sort_order'] ?? 0,
        ]);

        $task->load(['assignee:id,name', 'milestone:id,public_id,title']);

        return response()->json(['task' => $this->taskPayload($task)], 201);
    }

    public function update(Request $request, Project $project, ProjectTask $task): JsonResponse
    {
        Gate::authorize('editFiles', $project);
        abort_unless($task->project_id === $project->id, 404);

        $validated = $request->validate([
            'title' => ['sometimes', 'required', 'string', 'max:255'],
            'description' => ['nullable', 'string', 'max:5000'],
            'status' => ['sometimes', Rule::in(['todo', 'in_progress', 'blocked', 'done'])],
            'priority' => ['sometimes', Rule::in(['low', 'medium', 'high', 'urgent'])],
            'assigned_to' => ['nullable', 'integer', 'exists:users,id'],
            'milestone_id' => ['nullable', 'string'],
            'due_at' => ['nullable', 'date'],
            'sort_order' => ['sometimes', 'integer', 'min:0', 'max:100000'],
        ]);

        if (array_key_exists('milestone_id', $validated)) {
            $validated['milestone_id'] = $this->resolveMilestone($project, $validated['milestone_id'])?->id;
        }

        if (array_key_exists('assigned_to', $validated)) {
            $validated['assigned_to'] = $this->resolveAssignee($project, $validated['assigned_to'])?->id;
        }

        if (isset($validated['due_at'])) {
            $validated['due_at'] = Carbon::parse($validated['due_at']);
        }

        if (isset($validated['status'])) {
            $validated['completed_at'] = $validated['status'] === 'done' ? now() : null;
        }

        $task->update($validated);
        $task->load(['assignee:id,name', 'milestone:id,public_id,title']);

        return response()->json(['task' => $this->taskPayload($task)]);
    }

    public function destroy(Project $project, ProjectTask $task): JsonResponse
    {
        Gate::authorize('editFiles', $project);
        abort_unless($task->project_id === $project->id, 404);

        $task->delete();

        return response()->json(['deleted' => true]);
    }

    private function resolveMilestone(Project $project, ?string $publicId): ?ProjectMilestone
    {
        if ($publicId === null || $publicId === '') {
            return null;
        }

        $milestone = $project->milestones()->where('public_id', $publicId)->first();
        abort_if($milestone === null, 422, 'Milestone does not belong to this project.');

        return $milestone;
    }

    private function resolveAssignee(Project $project, ?int $userId): ?User
    {
        if ($userId === null) {
            return null;
        }

        $isMember = $project->owner_id === $userId
            || ProjectMember::query()
                ->where('project_id', $project->id)
                ->where('user_id', $userId)
                ->exists();

        abort_unless($isMember, 422, 'Assignee must be a project member.');

        return User::query()->find($userId);
    }

    /**
     * @return array<string, mixed>
     */
    private function taskPayload(ProjectTask $task): array
    {
        return [
            'public_id' => $task->public_id,
            'title' => $task->title,
            'description' => $task->description,
            'status' => $task->status,
            'priority' => $task->priority,
            'due_at' => $task->due_at?->toIso8601String(),
            'completed_at' => $task->completed_at?->toIso8601String(),
            'sort_order' => $task->sort_order,
            'milestone_public_id' => $task->milestone?->public_id,
            'milestone_title' => $task->milestone?->title,
            'assignee_name' => $task->assignee?->name,
            'is_overdue' => $task->due_at !== null
                && $task->status !== 'done'
                && $task->due_at->isPast(),
            'created_at' => $task->created_at?->toIso8601String(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function milestonePayload(ProjectMilestone $milestone): array
    {
        return [
            'public_id' => $milestone->public_id,
            'title' => $milestone->title,
            'description' => $milestone->description,
            'status' => $milestone->status,
            'due_at' => $milestone->due_at?->toIso8601String(),
            'completed_at' => $milestone->completed_at?->toIso8601String(),
            'sort_order' => $milestone->sort_order,
            'tasks_count' => $milestone->tasks_count ?? $milestone->tasks()->count(),
        ];
    }
}
