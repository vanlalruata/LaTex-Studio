<?php

use App\Models\Project;
use App\Models\ProjectFile;
use App\Models\ProjectIntegration;
use App\Models\User;
use App\Services\Storage\PrivateStorageService;
use Illuminate\Support\Facades\Http;

test('owner can push project files to connected github repository', function (): void {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);

    $stored = app(PrivateStorageService::class)->putProjectFile($project->public_id, '\documentclass{article}');
    ProjectFile::query()->create([
        'project_id' => $project->id,
        'path' => 'main.tex',
        'storage_key' => $stored['storage_key'],
        'sha256_checksum' => $stored['sha256_checksum'],
        'mime_type' => 'text/x-tex',
        'size_bytes' => $stored['size_bytes'],
        'is_directory' => false,
        'version' => 1,
    ]);

    $integration = new ProjectIntegration([
        'project_id' => $project->id,
        'provider' => 'github',
        'label' => 'GitHub',
        'status' => 'connected',
        'config' => ['repository' => 'researcher/paper', 'branch' => 'main'],
        'connected_by' => $owner->id,
    ]);
    $integration->setAccessToken('gho_push_token');
    $integration->save();

    Http::fake([
        'api.github.com/repos/researcher/paper/contents/*' => Http::sequence()
            ->push(['sha' => 'old-blob-sha'], 200)
            ->push(['commit' => ['sha' => 'new-commit-sha-999']], 200),
    ]);

    $this->actingAs($owner)
        ->postJson(route('projects.git.push', [$project, 'github']), [
            'message' => 'Push manuscript',
        ])
        ->assertOk()
        ->assertJsonPath('queued', true);

    $integration->refresh();
    expect($integration->config['last_push_sha'] ?? null)->toBe('new-commit-sha-999');
});
