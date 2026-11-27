<?php

namespace App\Domain\Compilation;

use App\Enums\CompilationStatus;
use App\Models\Compilation;
use App\Services\Compiler\CompilerSettingsService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class BuildQueueHealthService
{
    public function __construct(
        private readonly CompilerSettingsService $compilerSettings,
    ) {}

    /**
     * @return array{
     *     queued: int,
     *     running: int,
     *     succeeded_24h: int,
     *     failed_24h: int,
     *     pending_jobs: int,
     *     failed_jobs: int
     * }
     */
    public function summary(): array
    {
        $since = now()->subDay();

        return [
            'queued' => Compilation::query()
                ->whereIn('status', [CompilationStatus::Requested, CompilationStatus::Snapshotting, CompilationStatus::Queued])
                ->count(),
            'running' => Compilation::query()
                ->whereIn('status', [CompilationStatus::Starting, CompilationStatus::Compiling, CompilationStatus::Validating])
                ->count(),
            'succeeded_24h' => Compilation::query()
                ->whereIn('status', [CompilationStatus::Succeeded, CompilationStatus::Published])
                ->where('created_at', '>=', $since)
                ->count(),
            'failed_24h' => Compilation::query()
                ->whereIn('status', [CompilationStatus::Failed, CompilationStatus::TimedOut])
                ->where('created_at', '>=', $since)
                ->count(),
            'pending_jobs' => Schema::hasTable('jobs') ? DB::table('jobs')->count() : 0,
            'failed_jobs' => Schema::hasTable('failed_jobs') ? DB::table('failed_jobs')->count() : 0,
        ];
    }

    /**
     * @return list<array<string, mixed>>
     */
    public function recentCompilations(int $limit = 30): array
    {
        return array_values(Compilation::query()
            ->with(['project:id,public_id,title', 'triggeredBy:id,name,email'])
            ->latest('created_at')
            ->limit($limit)
            ->get()
            ->map(static fn (Compilation $compilation): array => [
                'public_id' => $compilation->public_id,
                'project_title' => $compilation->project->title,
                'project_public_id' => $compilation->project->public_id,
                'triggered_by' => $compilation->triggeredBy?->name,
                'engine' => $compilation->compiler_engine->value,
                'status' => $compilation->status->value,
                'is_terminal' => $compilation->status->isTerminal(),
                'duration_ms' => $compilation->duration_ms,
                'worker_image_digest' => $compilation->worker_image_digest,
                'error_summary' => $compilation->error_summary,
                'started_at' => $compilation->started_at?->toIso8601String(),
                'created_at' => $compilation->created_at?->toIso8601String(),
            ])
            ->all());
    }

    /**
     * @return list<array<string, mixed>>
     */
    public function stuckCompilations(): array
    {
        $thresholdSeconds = $this->compilerSettings->all()['wall_timeout'] + 30;
        $cutoff = now()->subSeconds($thresholdSeconds);

        return array_values(Compilation::query()
            ->with(['project:id,public_id,title'])
            ->whereIn('status', [
                CompilationStatus::Requested,
                CompilationStatus::Snapshotting,
                CompilationStatus::Queued,
                CompilationStatus::Starting,
                CompilationStatus::Compiling,
                CompilationStatus::Validating,
            ])
            ->where(function ($query) use ($cutoff): void {
                $query->where('started_at', '<=', $cutoff)
                    ->orWhere(function ($inner) use ($cutoff): void {
                        $inner->whereNull('started_at')
                            ->where('created_at', '<=', $cutoff);
                    });
            })
            ->latest('created_at')
            ->get()
            ->map(static fn (Compilation $compilation): array => [
                'public_id' => $compilation->public_id,
                'project_title' => $compilation->project->title,
                'engine' => $compilation->compiler_engine->value,
                'status' => $compilation->status->value,
                'started_at' => $compilation->started_at?->toIso8601String(),
                'created_at' => $compilation->created_at?->toIso8601String(),
            ])
            ->all());
    }
}
