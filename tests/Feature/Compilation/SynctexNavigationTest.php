<?php

use App\Enums\ArtifactType;
use App\Enums\CompilationStatus;
use App\Enums\CompilerEngine;
use App\Models\BuildArtifact;
use App\Models\Compilation;
use App\Models\Project;
use App\Models\ProjectFile;
use App\Models\User;
use App\Services\Storage\PrivateStorageService;

test('project member can perform forward and inverse synctex lookups while outsider is denied', function (): void {
    $owner = User::factory()->create();
    $outsider = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);

    $file = ProjectFile::query()->create([
        'project_id' => $project->id,
        'path' => 'main.tex',
        'mime_type' => 'text/x-tex',
        'size_bytes' => 32,
        'is_directory' => false,
        'version' => 1,
    ]);

    $compilation = Compilation::query()->create([
        'project_id' => $project->id,
        'triggered_by' => $owner->id,
        'idempotency_key' => 'synctex-test-1',
        'compiler_engine' => CompilerEngine::PdfLaTeX,
        'status' => CompilationStatus::Published,
    ]);

    $synctexRaw = implode("\n", [
        'SyncTeX Version:1',
        'Input:1:./main.tex',
        '{1',
        'h1,12:6553600,13107200:0,0,0',
        '}1',
    ]);

    $stored = app(PrivateStorageService::class)->putBuildArtifact(
        $compilation->public_id,
        'output.synctex.gz',
        gzencode($synctexRaw) ?: $synctexRaw,
    );

    BuildArtifact::query()->create([
        'compilation_id' => $compilation->id,
        'type' => ArtifactType::Synctex,
        'storage_key' => $stored['storage_key'],
        'sha256_checksum' => $stored['sha256_checksum'],
        'size_bytes' => $stored['size_bytes'],
    ]);

    $this->actingAs($owner)
        ->postJson(route('compilations.synctex.forward', $compilation), [
            'file_path' => 'main.tex',
            'line' => 12,
        ])
        ->assertOk()
        ->assertJsonPath('page', 1);

    $this->actingAs($owner)
        ->postJson(route('compilations.synctex.inverse', $compilation), [
            'page' => 1,
            'x' => 100,
            'y' => 200,
        ])
        ->assertOk()
        ->assertJsonPath('file_id', $file->public_id)
        ->assertJsonPath('line', 12);

    $this->actingAs($outsider)
        ->postJson(route('compilations.synctex.forward', $compilation), [
            'file_path' => 'main.tex',
            'line' => 12,
        ])
        ->assertForbidden();
});
