<?php

use App\Jobs\GitPullJob;
use App\Models\Project;
use App\Models\ProjectIntegration;
use App\Models\User;
use Illuminate\Support\Facades\Queue;

test('github webhook verifies signature and queues pull job', function (): void {
    Queue::fake();

    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);

    $integration = new ProjectIntegration([
        'project_id' => $project->id,
        'provider' => 'github',
        'label' => 'GitHub',
        'status' => 'connected',
        'connected_by' => $owner->id,
    ]);
    $integration->setWebhookSecret('super-secret-webhook');
    $integration->save();

    $payload = json_encode(['ref' => 'refs/heads/main'], JSON_THROW_ON_ERROR);
    $validSignature = 'sha256='.hash_hmac('sha256', $payload, 'super-secret-webhook');

    // Invalid signature rejected
    $this->postJson(
        route('webhooks.git.handle', ['github', $integration]),
        ['ref' => 'refs/heads/main'],
        ['X-Hub-Signature-256' => 'sha256=invalid']
    )->assertForbidden();

    // Valid signature accepted
    $this->call(
        'POST',
        route('webhooks.git.handle', ['github', $integration]),
        [],
        [],
        [],
        [
            'CONTENT_TYPE' => 'application/json',
            'HTTP_X_HUB_SIGNATURE_256' => $validSignature,
        ],
        $payload
    )->assertOk();

    Queue::assertPushed(GitPullJob::class);
});
