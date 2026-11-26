<?php

namespace App\Domain\Compilation;

use App\Domain\Administration\AuditService;
use App\Domain\Revisions\CreateRevisionAction;
use App\Enums\CompilationStatus;
use App\Jobs\RunCompilationJob;
use App\Models\Compilation;
use App\Models\Project;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class RequestCompilationAction
{
    public function __construct(
        private readonly CreateRevisionAction $createRevision,
        private readonly AuditService $audit,
    ) {}

    public function execute(Project $project, User $actor, ?string $idempotencyKey = null): Compilation
    {
        $compilation = DB::transaction(function () use ($project, $actor, $idempotencyKey): Compilation {
            if ($idempotencyKey !== null) {
                $existing = Compilation::query()
                    ->where('idempotency_key', $idempotencyKey)
                    ->first();

                if ($existing !== null) {
                    return $existing;
                }
            }

            $revision = $this->createRevision->execute($project, $actor, 'Pre-compile snapshot');

            // Coalesce any still-queued obsolete build requests for this project
            $project->compilations()
                ->whereIn('status', [CompilationStatus::Requested, CompilationStatus::Queued])
                ->update([
                    'status' => CompilationStatus::Cancelled,
                    'finished_at' => now(),
                ]);

            return Compilation::query()->create([
                'project_id' => $project->id,
                'revision_id' => $revision->id,
                'triggered_by' => $actor->id,
                'idempotency_key' => $idempotencyKey ?? (string) Str::uuid(),
                'compiler_engine' => $project->compiler_engine,
                'build_profile' => $project->build_profile,
                'status' => CompilationStatus::Queued,
            ]);
        });

        $this->audit->record('compilation.requested', $actor, $project, $compilation);

        RunCompilationJob::dispatch($compilation->id);

        return $compilation;
    }
}
