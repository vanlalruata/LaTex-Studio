<?php

use App\Enums\ProjectRole;
use App\Models\Project;
use App\Models\ProjectMember;
use App\Models\ProjectTask;
use App\Models\User;

function addMember(Project $project, User $user, ProjectRole $role): void
{
    ProjectMember::query()->create([
        'project_id' => $project->id,
        'user_id' => $user->id,
        'role' => $role,
        'invited_by' => $project->owner_id,
    ]);
}

test('editors can plan milestones and tasks while viewers and outsiders are read-only or blocked', function (): void {
    $owner = User::factory()->create();
    $editor = User::factory()->create();
    $viewer = User::factory()->create();
    $outsider = User::factory()->create();

    $project = Project::factory()->create(['owner_id' => $owner->id]);
    addMember($project, $editor, ProjectRole::Editor);
    addMember($project, $viewer, ProjectRole::Viewer);

    $milestoneResponse = $this->actingAs($editor)
        ->postJson(route('projects.milestones.store', $project), [
            'title' => 'Camera-ready submission',
            'status' => 'active',
            'due_at' => now()->addWeek()->toIso8601String(),
        ])
        ->assertCreated();

    $milestoneId = $milestoneResponse->json('milestone.public_id');

    $taskResponse = $this->actingAs($editor)
        ->postJson(route('projects.tasks.store', $project), [
            'title' => 'Resolve reviewer comments',
            'milestone_id' => $milestoneId,
            'assigned_to' => $owner->id,
            'priority' => 'high',
            'due_at' => now()->subDay()->toIso8601String(),
        ])
        ->assertCreated()
        ->assertJsonPath('task.assignee_name', $owner->name)
        ->assertJsonPath('task.is_overdue', true);

    $taskId = $taskResponse->json('task.public_id');

    $this->actingAs($editor)
        ->patchJson(route('projects.tasks.update', [$project, $taskId]), ['status' => 'done'])
        ->assertOk()
        ->assertJsonPath('task.status', 'done');

    expect(ProjectTask::query()->where('public_id', $taskId)->firstOrFail()->completed_at)->not->toBeNull();

    $this->actingAs($viewer)
        ->getJson(route('projects.tasks.index', $project))
        ->assertOk()
        ->assertJsonCount(1, 'tasks')
        ->assertJsonCount(1, 'milestones')
        ->assertJsonPath('milestones.0.tasks_count', 1);

    $this->actingAs($viewer)
        ->postJson(route('projects.tasks.store', $project), ['title' => 'Nope'])
        ->assertForbidden();

    $this->actingAs($editor)
        ->postJson(route('projects.tasks.store', $project), [
            'title' => 'Bad assignee',
            'assigned_to' => $outsider->id,
        ])
        ->assertStatus(422);

    $this->actingAs($outsider)
        ->getJson(route('projects.tasks.index', $project))
        ->assertForbidden();
});

test('integrations are unique per provider, mask secrets, and require edit permissions', function (): void {
    $owner = User::factory()->create();
    $outsider = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);

    $response = $this->actingAs($owner)
        ->postJson(route('projects.integrations.store', $project), [
            'provider' => 'github',
            'label' => 'Research repository',
            'status' => 'connected',
            'config' => ['repository' => 'lab/manuscript', 'access_token' => 'ghp_secret'],
        ])
        ->assertCreated()
        ->assertJsonPath('integration.config.access_token', '••••••••')
        ->assertJsonPath('integration.config.repository', 'lab/manuscript');

    expect($response->json('integration.last_synced_at'))->not->toBeNull();

    $this->actingAs($owner)
        ->postJson(route('projects.integrations.store', $project), [
            'provider' => 'github',
            'label' => 'Duplicate',
        ])
        ->assertStatus(422);

    $integrationId = $response->json('integration.public_id');

    $this->actingAs($owner)
        ->patchJson(route('projects.integrations.update', [$project, $integrationId]), [
            'status' => 'disconnected',
        ])
        ->assertOk()
        ->assertJsonPath('integration.status', 'disconnected')
        ->assertJsonPath('integration.last_synced_at', null);

    $this->actingAs($outsider)
        ->patchJson(route('projects.integrations.update', [$project, $integrationId]), [
            'status' => 'connected',
        ])
        ->assertForbidden();
});
