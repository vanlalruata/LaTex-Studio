<?php

namespace App\Http\Controllers;

use App\Domain\Administration\AuditService;
use App\Enums\ProjectRole;
use App\Models\Project;
use App\Models\ProjectMember;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class ProjectMemberController extends Controller
{
    public function index(Project $project): JsonResponse
    {
        Gate::authorize('view', $project);

        $members = $project->memberships()
            ->with('user:id,name,email')
            ->get()
            ->map(fn (ProjectMember $member): array => [
                'id' => $member->id,
                'name' => $member->user->name ?? 'Unknown',
                'email' => $member->user->email ?? '',
                'role' => $member->role->value,
            ]);

        return response()->json([
            'owner' => [
                'name' => $project->owner->name ?? 'Owner',
                'email' => $project->owner->email ?? '',
                'role' => ProjectRole::Owner->value,
            ],
            'members' => $members,
        ]);
    }

    public function store(Request $request, Project $project, AuditService $audit): JsonResponse
    {
        Gate::authorize('manageMembers', $project);

        $validated = $request->validate([
            'email' => ['required', 'email', 'exists:users,email'],
            'role' => ['required', Rule::enum(ProjectRole::class), Rule::notIn([ProjectRole::Owner->value])],
        ]);

        $targetUser = User::query()->where('email', $validated['email'])->firstOrFail();
        if ($targetUser->id === $project->owner_id) {
            return response()->json(['message' => 'User is already the project owner.'], 422);
        }

        $member = ProjectMember::query()->updateOrCreate(
            [
                'project_id' => $project->id,
                'user_id' => $targetUser->id,
            ],
            [
                'role' => ProjectRole::from($validated['role']),
                'invited_by' => $request->user()?->id,
            ]
        );

        $audit->record('project.member.added', $request->user(), $project, $member, [
            'target_user_id' => $targetUser->id,
            'role' => $validated['role'],
        ]);

        return response()->json([
            'id' => $member->id,
            'name' => $targetUser->name,
            'email' => $targetUser->email,
            'role' => $member->role->value,
        ], 201);
    }

    public function destroy(Request $request, Project $project, ProjectMember $member, AuditService $audit): JsonResponse
    {
        Gate::authorize('manageMembers', $project);
        abort_unless($member->project_id === $project->id, 404);

        $audit->record('project.member.removed', $request->user(), $project, $member);
        $member->delete();

        return response()->json(['deleted' => true]);
    }
}
