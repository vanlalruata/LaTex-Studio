<?php

use App\Enums\ProjectRole;
use App\Models\Project;
use App\Models\ProjectFile;
use App\Models\ProjectMember;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

beforeEach(function (): void {
    Storage::fake('local');
});

function member(Project $project, User $user, ProjectRole $role): void
{
    ProjectMember::query()->create([
        'project_id' => $project->id,
        'user_id' => $user->id,
        'role' => $role,
        'invited_by' => $project->owner_id,
    ]);
}

test('reviewers and commenters can annotate lines while viewers cannot', function (): void {
    $owner = User::factory()->create();
    $reviewer = User::factory()->create();
    $commenter = User::factory()->create();
    $viewer = User::factory()->create();
    $outsider = User::factory()->create();

    $project = Project::factory()->create(['owner_id' => $owner->id]);
    member($project, $reviewer, ProjectRole::Reviewer);
    member($project, $commenter, ProjectRole::Commenter);
    member($project, $viewer, ProjectRole::Viewer);

    $file = ProjectFile::query()->create([
        'project_id' => $project->id,
        'path' => 'sections/intro.tex',
        'mime_type' => 'text/x-tex',
        'size_bytes' => 0,
        'is_directory' => false,
        'version' => 1,
    ]);

    $created = $this->actingAs($reviewer)
        ->postJson(route('projects.annotations.store', $project), [
            'file_id' => $file->public_id,
            'start_line' => 12,
            'end_line' => 14,
            'kind' => 'highlight',
            'body' => 'Tighten this claim.',
        ])
        ->assertCreated()
        ->assertJsonPath('annotation.author_name', $reviewer->name);

    $annotationId = $created->json('annotation.public_id');

    $this->actingAs($viewer)
        ->getJson(route('projects.annotations.index', $project))
        ->assertOk()
        ->assertJsonCount(1, 'annotations');

    $this->actingAs($viewer)
        ->postJson(route('projects.annotations.store', $project), [
            'file_id' => $file->public_id,
            'start_line' => 1,
        ])
        ->assertForbidden();

    $this->actingAs($reviewer)
        ->patchJson(route('projects.annotations.update', [$project, $annotationId]), [
            'status' => 'resolved',
        ])
        ->assertOk()
        ->assertJsonPath('annotation.status', 'resolved');

    $this->actingAs($commenter)
        ->patchJson(route('projects.annotations.update', [$project, $annotationId]), [
            'body' => 'Hijack',
        ])
        ->assertForbidden();

    $this->actingAs($outsider)
        ->getJson(route('projects.annotations.index', $project))
        ->assertForbidden();
});

test('presence heartbeats exchange collaborator cursors', function (): void {
    $owner = User::factory()->create(['name' => 'Ada Lovelace']);
    $editor = User::factory()->create(['name' => 'Grace Hopper']);
    $outsider = User::factory()->create();

    $project = Project::factory()->create(['owner_id' => $owner->id]);
    member($project, $editor, ProjectRole::Editor);

    $file = ProjectFile::query()->create([
        'project_id' => $project->id,
        'path' => 'main.tex',
        'mime_type' => 'text/x-tex',
        'size_bytes' => 0,
        'is_directory' => false,
        'version' => 1,
    ]);

    $this->actingAs($owner)
        ->postJson(route('projects.presence.store', $project), [
            'file_id' => $file->public_id,
            'line' => 42,
            'column' => 7,
        ])
        ->assertOk()
        ->assertJsonPath('users.0.name', 'Ada Lovelace')
        ->assertJsonPath('users.0.cursor.line', 42);

    $presence = $this->actingAs($editor)
        ->getJson(route('projects.presence.index', $project))
        ->assertOk()
        ->assertJsonPath('users.0.cursor.file_path', 'main.tex')
        ->assertJsonPath('users.0.cursor.column', 7);

    expect($presence->json('users.0.color'))->toBeIn(['indigo', 'emerald', 'amber', 'rose', 'sky', 'violet']);

    $this->actingAs($editor)
        ->postJson(route('projects.presence.store', $project), [
            'file_id' => 'not-a-project-file',
            'line' => 1,
        ])
        ->assertStatus(422);

    $this->actingAs($outsider)
        ->getJson(route('projects.presence.index', $project))
        ->assertForbidden();
});
