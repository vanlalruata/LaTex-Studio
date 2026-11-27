<?php

namespace App\Http\Controllers;

use App\Jobs\GitPullJob;
use App\Models\ProjectIntegration;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GitWebhookController extends Controller
{
    public function handle(
        Request $request,
        string $provider,
        ProjectIntegration $integration,
    ): JsonResponse {
        abort_unless(
            in_array($provider, ['github', 'gitlab'], true) && $integration->provider === $provider,
            404
        );

        $secret = $integration->webhookSecret();
        abort_if($secret === null || $secret === '', 403, 'Webhook secret is not configured.');

        if ($provider === 'github') {
            $signature = (string) $request->header('X-Hub-Signature-256', '');
            $expected = 'sha256='.hash_hmac('sha256', $request->getContent(), $secret);
            abort_unless(hash_equals($expected, $signature), 403, 'Invalid webhook signature.');
        } else {
            $token = (string) $request->header('X-Gitlab-Token', '');
            abort_unless(hash_equals($secret, $token), 403, 'Invalid webhook token.');
        }

        $project = $integration->project;
        $actorId = $integration->connected_by ?? $project->owner_id;

        GitPullJob::dispatch($project->id, $integration->id, $actorId);

        return response()->json(['accepted' => true]);
    }
}
