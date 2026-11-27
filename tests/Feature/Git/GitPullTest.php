<?php

use App\Models\Project;
use App\Models\ProjectFile;
use App\Models\ProjectIntegration;
use App\Models\User;
use App\Services\Storage\PrivateStorageService;
use Illuminate\Support\Facades\Http;

test('pull creates new files, updates unmodified files, and flags local conflicts without overwriting', function (): void {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $storage = app(PrivateStorageService::class);

    $unmodifiedContent = 'Original unmodified';
    $storedUnmodified = $storage->putProjectFile($project->public_id, $unmodifiedContent);
    $unmodifiedFile = ProjectFile::query()->create([
        'project_id' => $project->id,
        'path' => 'clean.tex',
        'storage_key' => $storedUnmodified['storage_key'],
        'sha256_checksum' => $storedUnmodified['sha256_checksum'],
        'mime_type' => 'text/x-tex',
        'size_bytes' => $storedUnmodified['size_bytes'],
        'is_directory' => false,
        'version' => 1,
    ]);

    $localModifiedContent = 'Local edit by author';
    $storedConflict = $storage->putProjectFile($project->public_id, $localModifiedContent);
    $conflictFile = ProjectFile::query()->create([
        'project_id' => $project->id,
        'path' => 'conflict.tex',
        'storage_key' => $storedConflict['storage_key'],
        'sha256_checksum' => $storedConflict['sha256_checksum'],
        'mime_type' => 'text/x-tex',
        'size_bytes' => $storedConflict['size_bytes'],
        'is_directory' => false,
        'version' => 2,
    ]);

    $integration = new ProjectIntegration([
        'project_id' => $project->id,
        'provider' => 'github',
        'label' => 'GitHub',
        'status' => 'connected',
        'config' => [
            'repository' => 'researcher/paper',
            'branch' => 'main',
            'last_synced_files' => [
                'clean.tex' => $storedUnmodified['sha256_checksum'],
                'conflict.tex' => hash('sha256', 'Old base content'),
            ],
        ],
        'connected_by' => $owner->id,
    ]);
    $integration->setAccessToken('gho_pull_token');
    $integration->save();

    Http::fake([
        'api.github.com/repos/researcher/paper/git/trees/*' => Http::response([
            'tree' => [
                ['type' => 'blob', 'path' => 'clean.tex', 'sha' => '1', 'size' => 10],
                ['type' => 'blob', 'path' => 'conflict.tex', 'sha' => '2', 'size' => 10],
                ['type' => 'blob', 'path' => 'new.tex', 'sha' => '3', 'size' => 10],
            ],
        ], 200),
        'api.github.com/repos/researcher/paper/contents/clean.tex*' => Http::response([
            'content' => base64_encode('Remote updated clean'),
        ], 200),
        'api.github.com/repos/researcher/paper/contents/conflict.tex*' => Http::response([
            'content' => base64_encode('Remote conflicting change'),
        ], 200),
        'api.github.com/repos/researcher/paper/contents/new.tex*' => Http::response([
            'content' => base64_encode('Brand new file'),
        ], 200),
    ]);

    $this->actingAs($owner)
        ->postJson(route('projects.git.pull', [$project, 'github']))
        ->assertOk();

    $unmodifiedFile->refresh();
    $conflictFile->refresh();

    expect($storage->getContents($unmodifiedFile->storage_key))->toBe('Remote updated clean')
        ->and($storage->getContents($conflictFile->storage_key))->toBe('Local edit by author')
        ->and($project->files()->where('path', 'new.tex')->exists())->toBeTrue();
});
