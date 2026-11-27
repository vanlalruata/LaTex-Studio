<?php

namespace App\Jobs;

use App\Models\Project;
use App\Models\ProjectIntegration;
use App\Models\User;
use App\Services\Git\GitSyncService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class GitPushJob implements ShouldQueue
{
    use Queueable;

    public int $tries = 1;

    public function __construct(
        public readonly int $projectId,
        public readonly int $integrationId,
        public readonly int $actorId,
        public readonly string $message = 'Sync from LaTeX Studio',
    ) {}

    public function handle(GitSyncService $syncService): void
    {
        $project = Project::query()->find($this->projectId);
        $integration = ProjectIntegration::query()->find($this->integrationId);
        $actor = User::query()->find($this->actorId);

        if ($project === null || $integration === null || $actor === null) {
            return;
        }

        $syncService->push($project, $integration, $actor, $this->message);
    }
}
