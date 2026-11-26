<?php

use App\Enums\ProjectRole;
use App\Models\Project;
use App\Models\ProjectMember;
use App\Models\TableDesign;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('project editor can open table designer and save a table design', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);

    $this->actingAs($owner)
        ->get(route('projects.tables.index', $project))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Projects/TableDesigner')
            ->where('project.public_id', $project->public_id)
            ->where('project.can_edit', true)
        );

    $response = $this->actingAs($owner)
        ->postJson(route('projects.tables.store', $project), [
            'name' => 'Ablation Study',
            'schema_version' => 1,
            'document_json' => ['schemaVersion' => 1, 'name' => 'Ablation Study', 'rows' => [], 'columns' => []],
            'generated_latex' => "\\begin{tabular}{lc}\n\\toprule\nA & B \\\\\n\\bottomrule\n\\end{tabular}",
            'status' => 'visual',
        ]);

    $response->assertCreated();
    $publicId = $response->json('tableDesign.public_id');

    $this->actingAs($owner)
        ->putJson(route('projects.tables.update', [$project, $publicId]), [
            'name' => 'Ablation Study v2',
            'schema_version' => 1,
            'document_json' => ['schemaVersion' => 1, 'name' => 'Ablation Study v2', 'rows' => [], 'columns' => []],
            'generated_latex' => "\\begin{tabular}{lc}\n\\toprule\nA & B \\\\\n\\bottomrule\n\\end{tabular}",
            'status' => 'visual',
        ])
        ->assertOk()
        ->assertJsonPath('tableDesign.name', 'Ablation Study v2');

    expect(TableDesign::query()->where('project_id', $project->id)->count())->toBe(1);
});

test('viewer and non-member cannot mutate table designs', function () {
    $owner = User::factory()->create();
    $viewer = User::factory()->create();
    $stranger = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);

    ProjectMember::query()->create([
        'project_id' => $project->id,
        'user_id' => $viewer->id,
        'role' => ProjectRole::Viewer,
        'invited_by' => $owner->id,
    ]);

    $this->actingAs($viewer)
        ->postJson(route('projects.tables.store', $project), [
            'name' => 'Unauthorized',
            'schema_version' => 1,
            'document_json' => ['schemaVersion' => 1],
            'generated_latex' => '\begin{tabular}{c}\end{tabular}',
        ])
        ->assertForbidden();

    $this->actingAs($stranger)
        ->get(route('projects.tables.index', $project))
        ->assertForbidden();
});
