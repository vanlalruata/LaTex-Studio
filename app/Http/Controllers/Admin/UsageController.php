<?php

namespace App\Http\Controllers\Admin;

use App\Enums\CompilationStatus;
use App\Http\Controllers\Controller;
use App\Models\Compilation;
use App\Models\Organization;
use App\Models\Project;
use App\Models\UsageRecord;
use Inertia\Inertia;
use Inertia\Response;

class UsageController extends Controller
{
    public function index(): Response
    {
        $activeStatuses = [
            CompilationStatus::Requested,
            CompilationStatus::Snapshotting,
            CompilationStatus::Queued,
            CompilationStatus::Starting,
            CompilationStatus::Compiling,
            CompilationStatus::Validating,
        ];

        return Inertia::render('Admin/Usage', [
            'usageByMetric' => UsageRecord::query()
                ->selectRaw('metric, SUM(quantity) as total_quantity')
                ->groupBy('metric')
                ->orderBy('metric')
                ->get()
                ->map(static fn (UsageRecord $record): array => [
                    'metric' => $record->metric,
                    'total' => (int) $record->getAttribute('total_quantity'),
                ]),
            'storage' => [
                'projectBytes' => (int) Project::query()->sum('storage_bytes'),
                'organizationQuotaBytes' => (int) Organization::query()->sum('storage_quota_bytes'),
            ],
            'builds' => [
                'active' => Compilation::query()->whereIn('status', $activeStatuses)->count(),
                'failed' => Compilation::query()->where('status', CompilationStatus::Failed)->count(),
                'timedOut' => Compilation::query()->where('status', CompilationStatus::TimedOut)->count(),
                'succeeded' => Compilation::query()->whereIn('status', [CompilationStatus::Succeeded, CompilationStatus::Published])->count(),
            ],
            'recentUsage' => UsageRecord::query()
                ->with(['user:id,name,email', 'project:id,title'])
                ->latest('created_at')
                ->paginate(50),
        ]);
    }
}
