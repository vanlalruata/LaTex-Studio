<?php

use App\Enums\ProjectRole;
use App\Models\Figure;
use App\Models\Project;
use App\Models\ProjectMember;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('project editor can open figure editor and create, update, show, and delete a figure', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);

    $this->actingAs($owner)
        ->get(route('projects.figures.index', $project))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Projects/FigureEditor')
            ->where('project.public_id', $project->public_id)
            ->where('project.can_edit', true)
        );

    $scene = [
        'schema_version' => 1,
        'id' => 'fig_test1',
        'name' => 'Decision Flow',
        'unit' => 'cm',
        'grid' => ['enabled' => true, 'step' => 0.5, 'snap' => true],
        'layers' => [['id' => 'layer_main', 'name' => 'Main Layer', 'visible' => true, 'locked' => false, 'order' => 0]],
        'objects' => [],
        'metadata' => ['caption' => '', 'label' => 'fig:decision'],
    ];

    $createResponse = $this->actingAs($owner)
        ->postJson(route('projects.figures.store', $project), [
            'name' => 'Decision Flow',
            'schema_version' => 1,
            'mode' => 'visual_native',
            'scene_json' => $scene,
            'tikz_source' => "\\begin{tikzpicture}\n\\end{tikzpicture}",
            'required_packages_json' => ['tikz'],
            'required_libraries_json' => [],
        ]);

    $createResponse->assertCreated()
        ->assertJsonPath('figure.name', 'Decision Flow')
        ->assertJsonPath('figure.mode', 'visual_native');

    $publicId = $createResponse->json('figure.public_id');

    $this->actingAs($owner)
        ->get(route('projects.figures.show', [$project, $publicId]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Projects/FigureEditor')
            ->where('activeFigure.public_id', $publicId)
        );

    $this->actingAs($owner)
        ->putJson(route('projects.figures.update', [$project, $publicId]), [
            'name' => 'Decision Flow v2',
            'scene_json' => [...$scene, 'name' => 'Decision Flow v2'],
        ])
        ->assertOk()
        ->assertJsonPath('figure.name', 'Decision Flow v2');

    $this->actingAs($owner)
        ->deleteJson(route('projects.figures.destroy', [$project, $publicId]))
        ->assertOk()
        ->assertJsonPath('deleted', true);

    expect(Figure::query()->where('project_id', $project->id)->count())->toBe(0);
});

test('viewer and non-member cannot mutate figures', function () {
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

    $payload = [
        'name' => 'Unauthorized',
        'schema_version' => 1,
        'scene_json' => ['schema_version' => 1, 'objects' => []],
        'tikz_source' => '\begin{tikzpicture}\end{tikzpicture}',
    ];

    $this->actingAs($viewer)
        ->get(route('projects.figures.index', $project))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->where('project.can_edit', false));

    $this->actingAs($viewer)
        ->postJson(route('projects.figures.store', $project), $payload)
        ->assertForbidden();

    $this->actingAs($stranger)
        ->get(route('projects.figures.index', $project))
        ->assertForbidden();
});

test('figure routes reject cross-project access', function () {
    $owner = User::factory()->create();
    $projectA = Project::factory()->create(['owner_id' => $owner->id]);
    $projectB = Project::factory()->create(['owner_id' => $owner->id]);

    $figure = Figure::query()->create([
        'project_id' => $projectA->id,
        'user_id' => $owner->id,
        'name' => 'Isolated Figure',
        'schema_version' => 1,
        'mode' => 'visual_native',
        'scene_json' => ['schema_version' => 1, 'objects' => []],
        'tikz_source' => '\begin{tikzpicture}\end{tikzpicture}',
    ]);

    $this->actingAs($owner)
        ->get(route('projects.figures.show', [$projectB, $figure->public_id]))
        ->assertNotFound();

    $this->actingAs($owner)
        ->putJson(route('projects.figures.update', [$projectB, $figure->public_id]), ['name' => 'Tampered'])
        ->assertNotFound();
});
