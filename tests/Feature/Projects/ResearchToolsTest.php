<?php

use App\Enums\ProjectRole;
use App\Models\Project;
use App\Models\ProjectMember;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

beforeEach(function (): void {
    Storage::fake('local');
});

test('research assets can be created, filtered, and only edited by project editors', function (): void {
    $owner = User::factory()->create();
    $viewer = User::factory()->create();
    $outsider = User::factory()->create();

    $project = Project::factory()->create(['owner_id' => $owner->id]);
    ProjectMember::query()->create([
        'project_id' => $project->id,
        'user_id' => $viewer->id,
        'role' => ProjectRole::Viewer,
        'invited_by' => $owner->id,
    ]);

    $response = $this->actingAs($owner)
        ->postJson(route('projects.research-assets.store', $project), [
            'kind' => 'equation',
            'title' => 'Operator loss',
            'label' => 'eq:operator-loss',
            'caption' => 'Group-lasso plus physics residual.',
            'payload' => ['latex' => '\\mathcal{L}(\\theta) = 0', 'numbered' => true],
            'status' => 'ready',
        ])
        ->assertCreated()
        ->assertJsonPath('asset.payload.latex', '\\mathcal{L}(\\theta) = 0');

    $assetId = $response->json('asset.public_id');

    $this->actingAs($viewer)
        ->getJson(route('projects.research-assets.index', $project).'?kind=equation')
        ->assertOk()
        ->assertJsonCount(1, 'assets');

    $this->actingAs($viewer)
        ->getJson(route('projects.research-assets.index', $project).'?kind=figure')
        ->assertOk()
        ->assertJsonCount(0, 'assets');

    $this->actingAs($viewer)
        ->postJson(route('projects.research-assets.store', $project), [
            'kind' => 'table',
            'title' => 'Unauthorized table',
            'payload' => [],
        ])
        ->assertForbidden();

    $this->actingAs($owner)
        ->deleteJson(route('projects.research-assets.destroy', [$project, $assetId]))
        ->assertOk();

    $this->actingAs($outsider)
        ->getJson(route('projects.research-assets.index', $project))
        ->assertForbidden();
});

test('bibliography sources support search, derived keys, and duplicate protection', function (): void {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);

    $created = $this->actingAs($owner)
        ->postJson(route('projects.bibliography.store', $project), [
            'title' => 'Neural Operator Learning',
            'authors' => ['Kovachki, Nikola', 'Li, Zongyi'],
            'year' => 2023,
            'venue' => 'JMLR',
        ])
        ->assertCreated()
        ->assertJsonPath('source.citation', fn (string $citation): bool => str_starts_with($citation, '\\cite{'));

    $key = $created->json('source.key');
    expect($key)->not->toBe('');

    $this->actingAs($owner)
        ->postJson(route('projects.bibliography.store', $project), [
            'key' => $key,
            'title' => 'Duplicate key',
        ])
        ->assertStatus(422);

    $this->actingAs($owner)
        ->getJson(route('projects.bibliography.index', $project).'?q=Neural')
        ->assertOk()
        ->assertJsonCount(1, 'sources');
});

test('OCR and conversion submissions enter the processing queue', function (): void {
    $owner = User::factory()->create();
    $viewer = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);

    ProjectMember::query()->create([
        'project_id' => $project->id,
        'user_id' => $viewer->id,
        'role' => ProjectRole::Viewer,
        'invited_by' => $owner->id,
    ]);

    $this->actingAs($owner)
        ->postJson(route('projects.ocr.store', $project), [
            'source_filename' => 'handwritten-derivation.png',
            'mime_type' => 'image/png',
            'languages' => 'eng+deu',
        ])
        ->assertStatus(202)
        ->assertJsonPath('job.status', 'queued');

    $this->actingAs($owner)
        ->postJson(route('projects.conversions.store', $project), [
            'direction' => 'docx_to_latex',
            'input_filename' => 'draft.docx',
        ])
        ->assertStatus(202)
        ->assertJsonPath('job.status', 'queued')
        ->assertJsonPath('job.engine', 'pandoc');

    $this->actingAs($viewer)
        ->getJson(route('projects.ocr.index', $project))
        ->assertOk()
        ->assertJsonCount(1, 'jobs');

    $this->actingAs($viewer)
        ->postJson(route('projects.ocr.store', $project), ['source_filename' => 'x.png'])
        ->assertForbidden();
});
