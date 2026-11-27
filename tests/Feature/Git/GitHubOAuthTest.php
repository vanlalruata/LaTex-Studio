<?php

use App\Models\Project;
use App\Models\ProjectIntegration;
use App\Models\User;
use Illuminate\Support\Facades\Http;

test('owner can initiate github oauth, exchange code for encrypted token, and disconnect', function (): void {
    config()->set('git-integrations.github.client_id', 'gh-client-123');
    config()->set('git-integrations.github.client_secret', 'gh-secret-xyz');

    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);

    $redirectResponse = $this->actingAs($owner)
        ->get(route('projects.git.redirect', [$project, 'github']))
        ->assertRedirect();

    $location = (string) $redirectResponse->headers->get('Location');
    parse_str((string) parse_url($location, PHP_URL_QUERY), $query);

    expect($location)->toContain('github.com/login/oauth/authorize')
        ->and($query['state'] ?? null)->not->toBeEmpty();

    Http::fake([
        'github.com/login/oauth/access_token' => Http::response([
            'access_token' => 'gho_secret_token_value',
        ], 200),
    ]);

    $this->actingAs($owner)
        ->get(route('git.oauth.callback', [
            'provider' => 'github',
            'state' => $query['state'],
            'code' => 'auth-code-1',
        ]))
        ->assertRedirect(route('projects.show', $project));

    $integration = ProjectIntegration::query()
        ->where('project_id', $project->id)
        ->where('provider', 'github')
        ->firstOrFail();

    expect($integration->status)->toBe('connected')
        ->and($integration->accessToken())->toBe('gho_secret_token_value')
        ->and($integration->encrypted_token)->not->toBe('gho_secret_token_value')
        ->and(array_key_exists('encrypted_token', $integration->toArray()))->toBeFalse();

    $this->actingAs($owner)
        ->deleteJson(route('projects.git.disconnect', [$project, 'github']))
        ->assertOk();

    $integration->refresh();
    expect($integration->status)->toBe('disconnected')
        ->and($integration->accessToken())->toBeNull();
});
