<?php

use App\DTOs\CompilationResult;
use App\Enums\CompilationStatus;
use App\Enums\ProjectRole;
use App\Models\Equation;
use App\Models\Project;
use App\Models\ProjectFile;
use App\Models\ProjectMember;
use App\Models\User;
use App\Services\Compiler\LatexCompilerInterface;
use App\Services\Storage\PrivateStorageService;
use Inertia\Testing\AssertableInertia as Assert;

test('project editor can open equation studio, create, update, and restore revisions', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);

    $this->actingAs($owner)
        ->get(route('projects.equations.index', $project))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Projects/EquationStudio')
            ->where('project.public_id', $project->public_id)
            ->where('project.can_edit', true)
        );

    $create = $this->actingAs($owner)
        ->postJson(route('projects.equations.store', $project), [
            'title' => 'Ridge Objective',
            'content_mode' => 'structured',
            'math_mode' => 'display',
            'environment' => 'equation',
            'latex_source' => 'E = mc^2',
            'package_requirements_json' => ['amsmath'],
        ])
        ->assertCreated()
        ->assertJsonPath('equation.title', 'Ridge Objective');

    $eqId = $create->json('equation.public_id');
    $rev1Id = $create->json('revisions.0.public_id');

    $this->actingAs($owner)
        ->putJson(route('projects.equations.update', [$project, $eqId]), [
            'latex_source' => 'a^2 + b^2 = c^2',
        ])
        ->assertOk()
        ->assertJsonPath('equation.latex_source', 'a^2 + b^2 = c^2');

    $this->actingAs($owner)
        ->postJson(route('projects.equations.revisions.restore', [$project, $eqId, $rev1Id]))
        ->assertOk()
        ->assertJsonPath('equation.latex_source', 'E = mc^2');

    $this->actingAs($owner)
        ->deleteJson(route('projects.equations.destroy', [$project, $eqId]))
        ->assertOk()
        ->assertJsonPath('deleted', true);

    expect(Equation::query()->where('project_id', $project->id)->count())->toBe(0);
});

test('equation insertion injects missing packages and detects stale file version conflicts', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);

    $storage = app(PrivateStorageService::class);
    $stored = $storage->putProjectFile($project->public_id, "\\documentclass{article}\n\\begin{document}\nHello\n\\end{document}\n");
    $file = ProjectFile::query()->create([
        'project_id' => $project->id,
        'path' => 'main.tex',
        'storage_key' => $stored['storage_key'],
        'mime_type' => 'application/x-tex',
        'size_bytes' => $stored['size_bytes'],
        'sha256_checksum' => $stored['sha256_checksum'],
        'version' => 2,
        'updated_by' => $owner->id,
    ]);

    $this->actingAs($owner)
        ->postJson(route('projects.equations.insert', $project), [
            'file_public_id' => $file->public_id,
            'latex' => "\\begin{equation}\n  E = mc^2\n\\end{equation}",
            'expected_file_version' => 1,
            'packages_to_add' => ['amsmath'],
        ])
        ->assertStatus(409);

    $this->actingAs($owner)
        ->postJson(route('projects.equations.insert', $project), [
            'file_public_id' => $file->public_id,
            'latex' => "\\begin{equation}\n  E = mc^2\n\\end{equation}",
            'expected_file_version' => 2,
            'packages_to_add' => ['amsmath'],
        ])
        ->assertOk()
        ->assertJsonPath('file_path', 'main.tex');

    $updated = $storage->getContents($file->fresh()->storage_key);
    expect($updated)->toContain('\usepackage{amsmath}')
        ->toContain('E = mc^2');
});

test('equation compile preview uses compiler adapter and retains last successful pdf on failure', function () {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);

    $equation = Equation::query()->create([
        'project_id' => $project->id,
        'user_id' => $owner->id,
        'title' => 'Euler',
        'latex_source' => 'e^{i\pi} + 1 = 0',
        'package_requirements_json' => ['amsmath'],
    ]);

    $mockSuccess = Mockery::mock(LatexCompilerInterface::class);
    $mockSuccess->shouldReceive('compile')->once()->andReturn(new CompilationResult(
        status: CompilationStatus::Succeeded,
        exitCode: 0,
        durationMs: 85,
        pdfContents: '%PDF-1.4 equation',
        logContents: 'Output written on equation.pdf',
    ));
    $this->instance(LatexCompilerInterface::class, $mockSuccess);

    $this->actingAs($owner)
        ->postJson(route('projects.equations.compile-preview', [$project, $equation]))
        ->assertOk()
        ->assertJsonPath('status', 'succeeded');

    $this->actingAs($owner)
        ->get(route('projects.equations.preview-pdf', [$project, $equation]))
        ->assertOk()
        ->assertHeader('Content-Type', 'application/pdf');

    $mockFail = Mockery::mock(LatexCompilerInterface::class);
    $mockFail->shouldReceive('compile')->once()->andReturn(new CompilationResult(
        status: CompilationStatus::Failed,
        exitCode: 1,
        durationMs: 50,
        logContents: '! Undefined control sequence.',
        errorSummary: 'Failed',
    ));
    $this->instance(LatexCompilerInterface::class, $mockFail);

    $this->actingAs($owner)
        ->postJson(route('projects.equations.compile-preview', [$project, $equation]))
        ->assertStatus(422)
        ->assertJsonPath('status', 'failed');

    expect($equation->fresh()->last_successful_pdf_key)->not->toBeNull();
});

test('commenter can post and resolve equation comments while viewer and stranger are blocked', function () {
    $owner = User::factory()->create();
    $commenter = User::factory()->create();
    $viewer = User::factory()->create();
    $stranger = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $otherProject = Project::factory()->create(['owner_id' => $owner->id]);

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

    $equation = Equation::query()->create([
        'project_id' => $project->id,
        'user_id' => $owner->id,
        'title' => 'Loss',
        'latex_source' => 'L = \frac{1}{2}x^2',
    ]);

    $commentRes = $this->actingAs($commenter)
        ->postJson(route('projects.equations.comments.store', [$project, $equation]), [
            'body' => 'Check scaling factor.',
        ])
        ->assertCreated();

    $commentId = $commentRes->json('comment.public_id');

    $this->actingAs($commenter)
        ->postJson(route('projects.equations.comments.resolve', [$project, $equation, $commentId]))
        ->assertOk()
        ->assertJsonPath('comment.is_resolved', true);

    $this->actingAs($viewer)
        ->postJson(route('projects.equations.comments.store', [$project, $equation]), [
            'body' => 'Blocked',
        ])
        ->assertForbidden();

    $this->actingAs($stranger)
        ->get(route('projects.equations.index', $project))
        ->assertForbidden();

    $this->actingAs($owner)
        ->get(route('projects.equations.show', [$otherProject, $equation]))
        ->assertNotFound();
});
