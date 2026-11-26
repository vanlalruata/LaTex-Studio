<?php

use App\Enums\ProjectRole;
use App\Models\Project;
use App\Models\ProjectChatMessage;
use App\Models\ProjectMember;
use App\Models\User;

test('project members can post and view threaded collaborator chat messages', function () {
    $owner = User::factory()->create();
    $coauthor = User::factory()->create();

    $project = Project::factory()->create([
        'owner_id' => $owner->id,
    ]);

    ProjectMember::query()->create([
        'project_id' => $project->id,
        'user_id' => $coauthor->id,
        'role' => ProjectRole::Editor,
        'invited_by' => $owner->id,
    ]);

    $createResponse = $this->actingAs($owner)
        ->postJson(route('projects.chat.store', $project), [
            'body' => 'Please check Section 2 equations.',
        ]);

    $createResponse->assertCreated();
    $parentPublicId = $createResponse->json('message.public_id');

    $this->actingAs($coauthor)
        ->postJson(route('projects.chat.store', $project), [
            'body' => 'Reviewed and updated!',
            'parent_public_id' => $parentPublicId,
        ])
        ->assertCreated();

    $indexResponse = $this->actingAs($coauthor)
        ->getJson(route('projects.chat.index', $project));

    $indexResponse->assertOk()
        ->assertJsonCount(2, 'messages')
        ->assertJsonPath('messages.1.parent_public_id', $parentPublicId);

    expect(ProjectChatMessage::query()->where('project_id', $project->id)->count())->toBe(2);
});

test('non-members cannot access or post to project chat', function () {
    $owner = User::factory()->create();
    $stranger = User::factory()->create();
    $project = Project::factory()->create([
        'owner_id' => $owner->id,
    ]);

    $this->actingAs($stranger)
        ->getJson(route('projects.chat.index', $project))
        ->assertForbidden();

    $this->actingAs($stranger)
        ->postJson(route('projects.chat.store', $project), [
            'body' => 'Unauthorized message',
        ])
        ->assertForbidden();
});
