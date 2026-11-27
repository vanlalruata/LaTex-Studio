<?php

namespace App\Http\Controllers;

use App\Jobs\GitPullJob;
use App\Jobs\GitPushJob;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class GitSyncController extends Controller
{
    public function push(Request $request, Project $project, string $provider): JsonResponse
    {
        Gate::authorize('editFiles', $project);
        abort_unless(in_array($provider, ['github', 'gitlab'], true), 404);

        $validated = $request->validate([
            'message' => ['nullable', 'string', 'max:255'],
        ]);

        $integration = $project->integrations()
            ->where('provider', $provider)
            ->firstOrFail();

        $user = $request->user();
        abort_if($user === null, 401);

        GitPushJob::dispatch(
            $project->id,
            $integration->id,
            $user->id,
            $validated['message'] ?? 'Sync from LaTeX Studio',
        );

        return response()->json(['queued' => true, 'action' => 'push']);
    }

    public function pull(Request $request, Project $project, string $provider): JsonResponse
    {
        Gate::authorize('editFiles', $project);
        abort_unless(in_array($provider, ['github', 'gitlab'], true), 404);

        $integration = $project->integrations()
            ->where('provider', $provider)
            ->firstOrFail();

        $user = $request->user();
        abort_if($user === null, 401);

        GitPullJob::dispatch(
            $project->id,
            $integration->id,
            $user->id,
        );

        return response()->json(['queued' => true, 'action' => 'pull']);
    }
}
