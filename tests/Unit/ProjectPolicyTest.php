<?php

use App\Enums\ProjectRole;
use App\Models\Project;
use App\Models\ProjectMember;
use App\Models\User;
use App\Policies\ProjectPolicy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

test('enforces project-scoped permissions per role and denies non-members', function (): void {
    $owner = User::factory()->create();
    $editor = User::factory()->create();
    $reviewer = User::factory()->create();
    $viewer = User::factory()->create();
    $outsider = User::factory()->create();

    $project = Project::factory()->create(['owner_id' => $owner->id]);

    ProjectMember::query()->create(['project_id' => $project->id, 'user_id' => $editor->id, 'role' => ProjectRole::Editor]);
    ProjectMember::query()->create(['project_id' => $project->id, 'user_id' => $reviewer->id, 'role' => ProjectRole::Reviewer]);
    ProjectMember::query()->create(['project_id' => $project->id, 'user_id' => $viewer->id, 'role' => ProjectRole::Viewer]);

    $policy = new ProjectPolicy;

    expect($policy->view($owner, $project))->toBeTrue()
        ->and($policy->update($owner, $project))->toBeTrue()
        ->and($policy->delete($owner, $project))->toBeTrue()
        ->and($policy->editFiles($editor, $project))->toBeTrue()
        ->and($policy->compile($editor, $project))->toBeTrue()
        ->and($policy->manageMembers($editor, $project))->toBeFalse()
        ->and($policy->view($reviewer, $project))->toBeTrue()
        ->and($policy->editFiles($reviewer, $project))->toBeFalse()
        ->and($policy->export($reviewer, $project))->toBeTrue()
        ->and($policy->view($viewer, $project))->toBeTrue()
        ->and($policy->export($viewer, $project))->toBeFalse()
        ->and($policy->view($outsider, $project))->toBeFalse()
        ->and($policy->editFiles($outsider, $project))->toBeFalse()
        ->and($policy->compile($outsider, $project))->toBeFalse();
});
