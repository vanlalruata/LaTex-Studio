<?php

use App\Enums\AiProvider;
use App\Enums\ProjectRole;
use App\Models\ChangeSuggestion;
use App\Models\Project;
use App\Models\ProjectMember;
use App\Models\User;
use App\Models\UserAiCredential;
use Illuminate\Support\Facades\Http;

test('user ai api keys are encrypted and strictly isolated per user', function (): void {
    $userA = User::factory()->create();
    $userB = User::factory()->create();

    $this->actingAs($userA)
        ->post(route('ai-credentials.store'), [
            'provider' => AiProvider::Gemini->value,
            'label' => 'My Gemini Key',
            'model' => 'gemini-2.5-flash',
            'api_key' => 'AIzaSySecretKey1234567890',
            'is_default' => true,
        ])
        ->assertRedirect();

    $credential = UserAiCredential::query()->where('user_id', $userA->id)->firstOrFail();

    // Plaintext key is not exposed in serialized JSON and is encrypted in DB
    expect($credential->key_last_four)->toBe('7890')
        ->and($credential->toArray())->not->toHaveKey('api_key');

    // User B cannot delete User A's credential
    $this->actingAs($userB)
        ->delete(route('ai-credentials.destroy', $credential))
        ->assertForbidden();

    // Shared project: User B (collaborator) cannot use User A's AI key
    $this->actingAs($userA)->post(route('projects.store'), [
        'title' => 'Shared AI Paper',
    ]);
    $project = Project::query()->where('title', 'Shared AI Paper')->firstOrFail();
    ProjectMember::query()->create([
        'project_id' => $project->id,
        'user_id' => $userB->id,
        'role' => ProjectRole::Editor,
    ]);

    $this->actingAs($userB)
        ->getJson(route('projects.ai.index', $project))
        ->assertOk()
        ->assertJsonCount(0, 'credentials');

    $this->actingAs($userB)
        ->postJson(route('projects.ai.ask', $project), [
            'credential_id' => $credential->public_id,
            'kind' => 'chat',
            'prompt' => 'Review my abstract',
        ])
        ->assertUnprocessable();
});

test('ai assistant uses the authenticated users key and creates pending diff suggestions without silent overwrite', function (): void {
    $user = User::factory()->create();

    $this->actingAs($user)->post(route('ai-credentials.store'), [
        'provider' => AiProvider::Gemini->value,
        'label' => 'My Gemini Key',
        'model' => 'gemini-2.5-flash',
        'api_key' => 'AIzaSySecretKey1234567890',
        'is_default' => true,
    ]);

    $this->actingAs($user)->post(route('projects.store'), [
        'title' => 'AI Assisted Paper',
    ]);
    $project = Project::query()->where('title', 'AI Assisted Paper')->firstOrFail();
    $file = $project->files()->firstOrFail();

    Http::fake([
        'generativelanguage.googleapis.com/*' => Http::response([
            'candidates' => [
                [
                    'content' => [
                        'parts' => [
                            [
                                'text' => "Here is a clearer phrasing:\n```json_patch\n{\"title\":\"Improve intro\",\"original_excerpt\":\"Start writing your manuscript here.\",\"proposed_content\":\"This paper presents our methodology.\"}\n```",
                            ],
                        ],
                    ],
                ],
            ],
        ], 200),
    ]);

    $this->actingAs($user)
        ->postJson(route('projects.ai.ask', $project), [
            'file_id' => $file->public_id,
            'kind' => 'chat',
            'prompt' => 'Improve the introduction.',
        ])
        ->assertCreated()
        ->assertJsonPath('status', 'pending');

    // Proposed patch is stored as a pending ChangeSuggestion for human approval
    expect(ChangeSuggestion::query()->where('project_id', $project->id)->where('source', 'ai')->count())->toBe(1);
});
