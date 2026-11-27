<?php

use App\DTOs\CompilationResult;
use App\Enums\CompilationStatus;
use App\Enums\ProjectRole;
use App\Models\Figure;
use App\Models\Project;
use App\Models\ProjectFile;
use App\Models\ProjectMember;
use App\Models\User;
use App\Services\Compiler\LatexCompilerInterface;
use App\Services\Storage\PrivateStorageService;
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

test('figure revisions are recorded on save and can be restored', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);

    $createResponse = $this->actingAs($owner)
        ->postJson(route('projects.figures.store', $project), [
            'name' => 'Arch v1',
            'schema_version' => 1,
            'scene_json' => ['schema_version' => 1, 'objects' => [['id' => 'n1']]],
            'tikz_source' => "\\begin{tikzpicture}\n  \\node (n1) at (0,0) {A};\n\\end{tikzpicture}",
        ])
        ->assertCreated();

    $publicId = $createResponse->json('figure.public_id');
    $firstRevisionId = $createResponse->json('revisions.0.public_id');

    $this->actingAs($owner)
        ->putJson(route('projects.figures.update', [$project, $publicId]), [
            'tikz_source' => "\\begin{tikzpicture}\n  \\node (n1) at (1,1) {B};\n\\end{tikzpicture}",
        ])
        ->assertOk();

    $this->actingAs($owner)
        ->postJson(route('projects.figures.revisions.restore', [$project, $publicId, $firstRevisionId]))
        ->assertOk()
        ->assertJsonPath('figure.tikz_source', "\\begin{tikzpicture}\n  \\node (n1) at (0,0) {A};\n\\end{tikzpicture}");
});

test('figure can be rendered through compiler adapter and retains last successful render on failure', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);

    $figure = Figure::query()->create([
        'project_id' => $project->id,
        'user_id' => $owner->id,
        'name' => 'Renderable Diagram',
        'schema_version' => 1,
        'mode' => 'visual_native',
        'scene_json' => ['schema_version' => 1, 'objects' => []],
        'tikz_source' => "\\begin{tikzpicture}\n  \\node (a) at (0,0) {Hello};\n\\end{tikzpicture}",
        'required_packages_json' => ['tikz'],
        'required_libraries_json' => ['arrows.meta'],
    ]);

    $mockSuccess = Mockery::mock(LatexCompilerInterface::class);
    $mockSuccess->shouldReceive('compile')->once()->andReturn(new CompilationResult(
        status: CompilationStatus::Succeeded,
        exitCode: 0,
        durationMs: 120,
        pdfContents: '%PDF-1.4 fake pdf',
        logContents: 'Output written on figure.pdf (1 page).',
    ));
    $this->instance(LatexCompilerInterface::class, $mockSuccess);

    $res1 = $this->actingAs($owner)
        ->postJson(route('projects.figures.renders.store', [$project, $figure]))
        ->assertCreated();

    $renderId1 = $res1->json('renderJob.public_id');

    $this->actingAs($owner)
        ->getJson(route('projects.figures.renders.show', [$project, $figure, $renderId1]))
        ->assertOk()
        ->assertJsonPath('renderJob.status', 'succeeded')
        ->assertJsonPath('lastSuccessfulRenderId', $renderId1);

    $this->actingAs($owner)
        ->get(route('projects.figures.renders.artifact', [$project, $figure, $renderId1, 'pdf']))
        ->assertOk()
        ->assertHeader('Content-Type', 'application/pdf');

    $mockFail = Mockery::mock(LatexCompilerInterface::class);
    $mockFail->shouldReceive('compile')->once()->andReturn(new CompilationResult(
        status: CompilationStatus::Failed,
        exitCode: 1,
        durationMs: 90,
        logContents: "! Undefined control sequence.\nl.5 \\badcmd",
        errorSummary: 'LaTeX failed.',
    ));
    $this->instance(LatexCompilerInterface::class, $mockFail);

    $res2 = $this->actingAs($owner)
        ->postJson(route('projects.figures.renders.store', [$project, $figure]))
        ->assertCreated();

    $renderId2 = $res2->json('renderJob.public_id');

    $this->actingAs($owner)
        ->getJson(route('projects.figures.renders.show', [$project, $figure, $renderId2]))
        ->assertOk()
        ->assertJsonPath('renderJob.status', 'failed')
        ->assertJsonPath('lastSuccessfulRenderId', $renderId1);
});

test('figure can be exported as tex and inserted into manuscript file', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);

    $storage = app(PrivateStorageService::class);
    $stored = $storage->putProjectFile($project->public_id, "\\documentclass{article}\n\\begin{document}\nHello\n\\end{document}\n");
    $mainFile = ProjectFile::query()->create([
        'project_id' => $project->id,
        'path' => 'main.tex',
        'storage_key' => $stored['storage_key'],
        'mime_type' => 'application/x-tex',
        'size_bytes' => $stored['size_bytes'],
        'sha256_checksum' => $stored['sha256_checksum'],
        'version' => 1,
        'updated_by' => $owner->id,
    ]);

    $figure = Figure::query()->create([
        'project_id' => $project->id,
        'user_id' => $owner->id,
        'name' => 'System Pipeline',
        'schema_version' => 1,
        'mode' => 'visual_native',
        'scene_json' => ['schema_version' => 1, 'objects' => []],
        'tikz_source' => "\\begin{tikzpicture}\n  \\node (a) at (0,0) {Input};\n\\end{tikzpicture}",
        'required_packages_json' => ['tikz'],
        'required_libraries_json' => ['arrows.meta'],
    ]);

    $this->actingAs($owner)
        ->get(route('projects.figures.export', [$project, $figure]).'?standalone=1')
        ->assertOk()
        ->assertSee('\documentclass[tikz,border=4pt]{standalone}', false);

    $this->actingAs($owner)
        ->postJson(route('projects.figures.insert', $project), [
            'figure_public_id' => $figure->public_id,
            'file_public_id' => $mainFile->public_id,
            'mode' => 'external',
            'tikz_source' => $figure->tikz_source,
            'figure_slug' => 'System Pipeline',
            'caption' => 'Proposed pipeline',
            'label' => 'fig:pipeline',
            'packages_to_add' => ['tikz'],
            'libraries_to_add' => ['arrows.meta'],
        ])
        ->assertOk()
        ->assertJsonPath('external_file_path', 'figures/system-pipeline.tex');

    $updatedMain = $storage->getContents($mainFile->fresh()->storage_key);
    expect($updatedMain)->toContain('\usepackage{tikz}')
        ->toContain('\usetikzlibrary{arrows.meta}')
        ->toContain('\input{figures/system-pipeline.tex}');
});

test('collaborators with comment permission can post and resolve figure comments while viewers cannot', function () {
    $owner = User::factory()->create();
    $commenter = User::factory()->create();
    $viewer = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);

    ProjectMember::query()->create([
        'project_id' => $project->id,
        'user_id' => $commenter->id,
        'role' => ProjectRole::Commenter,
        'invited_by' => $owner->id,
    ]);

    ProjectMember::query()->create([
        'project_id' => $project->id,
        'user_id' => $viewer->id,
        'role' => ProjectRole::Viewer,
        'invited_by' => $owner->id,
    ]);

    $figure = Figure::query()->create([
        'project_id' => $project->id,
        'user_id' => $owner->id,
        'name' => 'Review Diagram',
        'schema_version' => 1,
        'mode' => 'visual_native',
        'scene_json' => ['schema_version' => 1, 'objects' => []],
        'tikz_source' => '\begin{tikzpicture}\end{tikzpicture}',
    ]);

    $commentResponse = $this->actingAs($commenter)
        ->postJson(route('projects.figures.comments.store', [$project, $figure]), [
            'body' => 'Check arrow label alignment.',
            'object_id' => 'obj_n1',
            'object_label' => 'n1',
        ])
        ->assertCreated()
        ->assertJsonPath('comment.object_label', 'n1')
        ->assertJsonPath('comment.is_resolved', false);

    $commentId = $commentResponse->json('comment.public_id');

    $this->actingAs($commenter)
        ->postJson(route('projects.figures.comments.resolve', [$project, $figure, $commentId]))
        ->assertOk()
        ->assertJsonPath('comment.is_resolved', true);

    $this->actingAs($viewer)
        ->postJson(route('projects.figures.comments.store', [$project, $figure]), [
            'body' => 'Viewer should be blocked.',
        ])
        ->assertForbidden();
});
