<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Services\Git\GitSyncService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;

class GitAuthController extends Controller
{
    public function redirect(
        Request $request,
        Project $project,
        string $provider,
        GitSyncService $syncService,
    ): RedirectResponse {
        Gate::authorize('editFiles', $project);
        abort_unless(in_array($provider, ['github', 'gitlab'], true), 404);

        $state = Str::random(40);
        $request->session()->put("git_oauth_state.{$provider}", [
            'state' => $state,
            'project_public_id' => $project->public_id,
        ]);

        $redirectUri = route('git.oauth.callback', ['provider' => $provider]);
        $url = $syncService->provider($provider)->authorizationUrl($state, $redirectUri);

        return redirect()->away($url);
    }

    public function callback(
        Request $request,
        string $provider,
        GitSyncService $syncService,
    ): RedirectResponse {
        abort_unless(in_array($provider, ['github', 'gitlab'], true), 404);

        /** @var array{state: string, project_public_id: string}|null $stored */
        $stored = $request->session()->pull("git_oauth_state.{$provider}");
        $incomingState = (string) $request->query('state', '');
        $code = (string) $request->query('code', '');

        abort_if(
            $stored === null || ! hash_equals($stored['state'], $incomingState) || $code === '',
            403,
            'Invalid OAuth state.'
        );

        $project = Project::query()->where('public_id', $stored['project_public_id'])->firstOrFail();
        Gate::authorize('editFiles', $project);

        $redirectUri = route('git.oauth.callback', ['provider' => $provider]);
        $token = $syncService->provider($provider)->exchangeCode($code, $redirectUri);

        if ($token === null) {
            return redirect()->route('projects.show', $project)
                ->with('error', "Failed to authenticate with {$provider}.");
        }

        $integration = $project->integrations()->firstOrNew(['provider' => $provider]);
        $integration->label = ucfirst($provider);
        $integration->status = 'connected';
        $integration->connected_by = $request->user()?->id;
        $integration->last_synced_at = now();
        $integration->setAccessToken($token);
        $integration->save();

        return redirect()->route('projects.show', $project)
            ->with('success', ucfirst($provider).' connected.');
    }

    public function repositories(
        Project $project,
        string $provider,
        GitSyncService $syncService,
    ): JsonResponse {
        Gate::authorize('view', $project);
        abort_unless(in_array($provider, ['github', 'gitlab'], true), 404);

        $integration = $project->integrations()->where('provider', $provider)->first();
        $token = $integration?->accessToken();

        abort_if($token === null, 422, 'Connect your account before listing repositories.');

        return response()->json([
            'repositories' => $syncService->provider($provider)->listRepositories($token),
        ]);
    }

    public function disconnect(Project $project, string $provider): JsonResponse
    {
        Gate::authorize('editFiles', $project);
        abort_unless(in_array($provider, ['github', 'gitlab'], true), 404);

        $integration = $project->integrations()->where('provider', $provider)->first();
        if ($integration !== null) {
            $integration->setAccessToken(null);
            $integration->status = 'disconnected';
            $integration->save();
        }

        return response()->json(['disconnected' => true]);
    }
}
