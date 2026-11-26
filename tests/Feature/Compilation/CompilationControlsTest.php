<?php

use App\Enums\ArtifactType;
use App\Enums\BuildProfile;
use App\Enums\CompilationStatus;
use App\Enums\CompilerEngine;
use App\Jobs\RunCompilationJob;
use App\Models\BuildArtifact;
use App\Models\Compilation;
use App\Models\Project;
use App\Models\User;
use App\Services\Storage\PrivateStorageService;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Storage;

beforeEach(function (): void {
    Storage::fake('local');
});

function syncTexFixture(): string
{
    $raw = implode("\n", [
        'SyncTeX Version:1',
        'Input:1:/work/src/main.tex',
        'Input:2:/work/src/chapters/intro.tex',
        '{1',
        '[1,7:65536,131072',
        '{2',
        '[2,20:196608,262144',
    ]);

    return gzencode($raw);
}

test('queued builds can be cancelled and retried while terminal rules are enforced', function (): void {
    Queue::fake();

    $owner = User::factory()->create();
    $outsider = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);

    $queued = $this->actingAs($owner)
        ->postJson(route('projects.compilations.store', $project), [])
        ->assertCreated()
        ->json('public_id');

    Queue::assertPushed(RunCompilationJob::class, 1);

    $this->actingAs($outsider)
        ->postJson(route('compilations.cancel', $queued))
        ->assertForbidden();

    $this->actingAs($owner)
        ->postJson(route('compilations.cancel', $queued))
        ->assertOk()
        ->assertJsonPath('status', 'cancelled');

    $this->actingAs($owner)
        ->postJson(route('compilations.cancel', $queued))
        ->assertStatus(422);

    $running = Compilation::query()->create([
        'project_id' => $project->id,
        'idempotency_key' => 'still-running-'.$project->id,
        'compiler_engine' => CompilerEngine::PdfLaTeX,
        'build_profile' => BuildProfile::Standard,
        'status' => CompilationStatus::Compiling,
    ]);

    $this->actingAs($owner)
        ->postJson(route('compilations.retry', $running))
        ->assertStatus(422);

    $retryId = $this->actingAs($owner)
        ->postJson(route('compilations.retry', $queued))
        ->assertCreated()
        ->assertJsonPath('status', 'queued')
        ->json('public_id');

    Queue::assertPushed(RunCompilationJob::class, 2);

    expect($retryId)->not->toBe($queued);
});

test('the compiler engine can be switched by editors only', function (): void {
    $owner = User::factory()->create();
    $outsider = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);

    $this->actingAs($outsider)
        ->putJson(route('projects.engine.update', $project), ['compiler_engine' => 'xelatex'])
        ->assertForbidden();

    $this->actingAs($owner)
        ->putJson(route('projects.engine.update', $project), ['compiler_engine' => 'xelatex'])
        ->assertOk()
        ->assertJsonPath('compiler_engine', 'xelatex');

    expect($project->refresh()->compiler_engine)->toBe(CompilerEngine::XeLaTeX);

    $this->actingAs($owner)
        ->putJson(route('projects.engine.update', $project), ['compiler_engine' => 'tectonic'])
        ->assertStatus(422);
});

test('synctex forward and inverse lookups map between source and pdf coordinates', function (): void {
    $owner = User::factory()->create();
    $outsider = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);

    foreach (['main.tex' => "Main file.\n", 'chapters/intro.tex' => "Intro chapter.\n"] as $path => $content) {
        $this->actingAs($owner)
            ->postJson(route('projects.files.store', $project), [
                'path' => $path,
                'content' => $content,
            ])
            ->assertCreated();
    }

    $compilation = Compilation::query()->create([
        'project_id' => $project->id,
        'idempotency_key' => 'synctex-'.$project->id,
        'compiler_engine' => CompilerEngine::PdfLaTeX,
        'build_profile' => BuildProfile::Standard,
        'status' => CompilationStatus::Published,
    ]);

    $stored = app(PrivateStorageService::class)
        ->putBuildArtifact($compilation->public_id, 'output.synctex.gz', syncTexFixture());

    BuildArtifact::query()->create([
        'compilation_id' => $compilation->id,
        'type' => ArtifactType::Synctex,
        'storage_key' => $stored['storage_key'],
        'sha256_checksum' => $stored['sha256_checksum'],
        'size_bytes' => $stored['size_bytes'],
    ]);

    $this->actingAs($outsider)
        ->postJson(route('compilations.synctex.forward', $compilation), [
            'file_path' => 'main.tex',
            'line' => 7,
        ])
        ->assertForbidden();

    $this->actingAs($owner)
        ->postJson(route('compilations.synctex.forward', $compilation), [
            'file_path' => 'main.tex',
            'line' => 99,
        ])
        ->assertOk()
        ->assertJsonPath('page', 1)
        ->assertJsonPath('line', 99);

    $this->actingAs($owner)
        ->postJson(route('compilations.synctex.forward', $compilation), [
            'file_path' => 'not-in-project.tex',
            'line' => 1,
        ])
        ->assertStatus(422);

    $this->actingAs($owner)
        ->postJson(route('compilations.synctex.inverse', $compilation), [
            'page' => 2,
            'x' => 3,
            'y' => 4,
        ])
        ->assertOk()
        ->assertJsonPath('file_path', 'chapters/intro.tex')
        ->assertJsonPath('line', 20);

    $bare = Compilation::query()->create([
        'project_id' => $project->id,
        'idempotency_key' => 'no-synctex-'.$project->id,
        'compiler_engine' => CompilerEngine::PdfLaTeX,
        'build_profile' => BuildProfile::Standard,
        'status' => CompilationStatus::Failed,
    ]);

    $this->actingAs($owner)
        ->postJson(route('compilations.synctex.forward', $bare), [
            'file_path' => 'main.tex',
            'line' => 1,
        ])
        ->assertStatus(422);
});
