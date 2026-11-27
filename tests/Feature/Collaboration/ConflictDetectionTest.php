<?php

use App\Enums\ProjectRole;
use App\Models\Project;
use App\Models\ProjectFile;
use App\Models\User;
use App\Services\Storage\PrivateStorageService;

test('saving a project file with stale version or base sha256 returns 409 with server state', function (): void {
    $owner = User::factory()->create();
    $collaborator = User::factory()->create(['name' => 'Dr. Collaborator']);
    $project = Project::factory()->create(['owner_id' => $owner->id]);

    $project->members()->attach($collaborator->id, ['role' => ProjectRole::Editor->value]);

    $stored = app(PrivateStorageService::class)->putProjectFile($project->public_id, 'Initial content');

    $file = ProjectFile::query()->create([
        'project_id' => $project->id,
        'path' => 'main.tex',
        'storage_key' => $stored['storage_key'],
        'sha256_checksum' => $stored['sha256_checksum'],
        'mime_type' => 'text/x-tex',
        'size_bytes' => $stored['size_bytes'],
        'is_directory' => false,
        'version' => 1,
        'updated_by' => $owner->id,
    ]);

    // Collaborator saves version 2
    $this->actingAs($collaborator)
        ->putJson(route('projects.files.update', [$project, $file]), [
            'content' => 'Collaborator update',
            'expected_version' => 1,
        ])
        ->assertOk()
        ->assertJsonPath('version', 2);

    // Owner tries to save with stale expected_version=1
    $this->actingAs($owner)
        ->putJson(route('projects.files.update', [$project, $file]), [
            'content' => 'Owner stale update',
            'expected_version' => 1,
        ])
        ->assertConflict()
        ->assertJsonPath('server_version', 2);

    expect($file->fresh()?->version)->toBe(2);

    // Owner tries to save with current version=2 but stale base_sha256
    $this->actingAs($owner)
        ->putJson(route('projects.files.update', [$project, $file]), [
            'content' => 'Owner hash conflict',
            'expected_version' => 2,
            'base_sha256' => str_repeat('a', 64),
        ])
        ->assertConflict()
        ->assertJsonPath('server_content', 'Collaborator update')
        ->assertJsonPath('updated_by_name', 'Dr. Collaborator');

    // Owner saves with matching version=2 and matching base_sha256
    $file->refresh();
    $this->actingAs($owner)
        ->putJson(route('projects.files.update', [$project, $file]), [
            'content' => 'Resolved content',
            'expected_version' => 2,
            'base_sha256' => $file->sha256_checksum,
        ])
        ->assertOk()
        ->assertJsonPath('version', 3);
});
