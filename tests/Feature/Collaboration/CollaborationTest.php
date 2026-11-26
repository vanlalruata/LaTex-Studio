<?php

use App\Enums\ProjectRole;
use App\Enums\SuggestionStatus;
use App\Models\ChangeSuggestion;
use App\Models\Project;
use App\Models\ProjectMember;
use App\Models\User;

test('collaborators can comment and propose suggestions while only editors/owners can accept changes', function (): void {
    $owner = User::factory()->create();
    $reviewer = User::factory()->create();
    $outsider = User::factory()->create();

    $this->actingAs($owner)->post(route('projects.store'), [
        'title' => 'Peer Reviewed Paper',
    ]);

    $project = Project::query()->where('title', 'Peer Reviewed Paper')->firstOrFail();
    $file = $project->files()->firstOrFail();

    // Owner invites reviewer
    $this->actingAs($owner)
        ->postJson(route('projects.members.store', $project), [
            'email' => $reviewer->email,
            'role' => ProjectRole::Reviewer->value,
        ])
        ->assertCreated();

    // Reviewer can create a comment thread and propose a change suggestion
    $this->actingAs($reviewer)
        ->postJson(route('projects.comments.store', $project), [
            'file_id' => $file->public_id,
            'start_line' => 1,
            'end_line' => 2,
            'body' => 'Please clarify the introduction.',
        ])
        ->assertCreated();

    $suggestionRes = $this->actingAs($reviewer)
        ->postJson(route('projects.suggestions.store', $project), [
            'file_id' => $file->public_id,
            'title' => 'Clarify intro',
            'original_excerpt' => 'Start writing your manuscript here.',
            'proposed_content' => 'We introduce a reproducible workflow.',
        ])
        ->assertCreated();

    $suggestion = ChangeSuggestion::query()
        ->where('public_id', $suggestionRes->json('public_id'))
        ->firstOrFail();

    // Reviewer cannot accept their own suggestion (editFiles required)
    $this->actingAs($reviewer)
        ->postJson(route('projects.suggestions.accept', [$project, $suggestion]))
        ->assertForbidden();

    // Outsider cannot read comments
    $this->actingAs($outsider)
        ->getJson(route('projects.comments.index', $project))
        ->assertForbidden();

    // Owner accepts suggestion -> creates new revision and marks accepted
    $this->actingAs($owner)
        ->postJson(route('projects.suggestions.accept', [$project, $suggestion]))
        ->assertOk()
        ->assertJsonPath('status', SuggestionStatus::Accepted->value);

    expect($project->revisions()->count())->toBe(2)
        ->and(ProjectMember::query()->where('project_id', $project->id)->count())->toBe(1);
});
