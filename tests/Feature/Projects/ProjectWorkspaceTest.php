<?php

use App\Enums\ProjectRole;
use App\Models\Project;
use App\Models\ProjectMember;
use App\Models\Template;
use App\Models\User;
use Database\Seeders\TemplateSeeder;

test('authenticated user can view dashboard and create project from template', function (): void {
    $this->seed(TemplateSeeder::class);
    $user = User::factory()->create();
    $template = Template::query()->where('slug', 'basic-research-article')->firstOrFail();

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk();

    $response = $this->actingAs($user)
        ->post(route('projects.store'), [
            'title' => 'My Quantum Paper',
            'template_id' => $template->public_id,
        ]);

    $project = Project::query()->where('title', 'My Quantum Paper')->firstOrFail();
    $response->assertRedirect(route('projects.show', $project));

    $this->actingAs($user)
        ->get(route('projects.show', $project))
        ->assertOk();

    expect($project->files()->count())->toBe(2)
        ->and($project->revisions()->count())->toBe(1);
});

test('non-members are denied access to project workspace, files, and export', function (): void {
    $owner = User::factory()->create();
    $outsider = User::factory()->create();

    $this->actingAs($owner)->post(route('projects.store'), [
        'title' => 'Private Manuscript',
    ]);

    $project = Project::query()->where('title', 'Private Manuscript')->firstOrFail();
    $file = $project->files()->firstOrFail();

    $this->actingAs($outsider)
        ->get(route('projects.show', $project))
        ->assertForbidden();

    $this->actingAs($outsider)
        ->getJson(route('projects.files.show', [$project, $file]))
        ->assertForbidden();

    $this->actingAs($outsider)
        ->putJson(route('projects.files.update', [$project, $file]), [
            'content' => 'tampered',
        ])
        ->assertForbidden();

    $this->actingAs($outsider)
        ->get(route('projects.export', $project))
        ->assertForbidden();
});

test('editor can save files with optimistic version conflict protection and traversal is rejected', function (): void {
    $owner = User::factory()->create();
    $editor = User::factory()->create();

    $this->actingAs($owner)->post(route('projects.store'), [
        'title' => 'Collaborative Paper',
    ]);

    $project = Project::query()->where('title', 'Collaborative Paper')->firstOrFail();
    ProjectMember::query()->create([
        'project_id' => $project->id,
        'user_id' => $editor->id,
        'role' => ProjectRole::Editor,
    ]);

    $file = $project->files()->firstOrFail();

    // Reject path traversal
    $this->actingAs($editor)
        ->postJson(route('projects.files.store', $project), [
            'path' => '../../etc/passwd',
            'content' => 'bad',
        ])
        ->assertUnprocessable();

    // First save succeeds and increments version from 1 to 2
    $this->actingAs($editor)
        ->putJson(route('projects.files.update', [$project, $file]), [
            'content' => "\\documentclass{article}\n\\begin{document}Updated\\end{document}\n",
            'expected_version' => 1,
        ])
        ->assertOk()
        ->assertJsonPath('version', 2);

    // Stale expected_version=1 returns 409 Conflict
    $this->actingAs($editor)
        ->putJson(route('projects.files.update', [$project, $file]), [
            'content' => 'stale overwrite',
            'expected_version' => 1,
        ])
        ->assertConflict();

    // Create manual snapshot
    $this->actingAs($editor)
        ->postJson(route('projects.revisions.store', $project), [
            'message' => 'Before submission',
        ])
        ->assertCreated();
});
