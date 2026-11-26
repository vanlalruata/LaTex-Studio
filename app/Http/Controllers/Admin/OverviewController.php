<?php

namespace App\Http\Controllers\Admin;

use App\Enums\CompilationStatus;
use App\Http\Controllers\Controller;
use App\Models\AuditEvent;
use App\Models\Compilation;
use App\Models\Organization;
use App\Models\Project;
use App\Models\Template;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class OverviewController extends Controller
{
    public function __invoke(): Response
    {
        $activeBuildStatuses = [
            CompilationStatus::Requested,
            CompilationStatus::Snapshotting,
            CompilationStatus::Queued,
            CompilationStatus::Starting,
            CompilationStatus::Compiling,
            CompilationStatus::Validating,
        ];

        return Inertia::render('Admin/Overview', [
            'metrics' => [
                'users' => User::query()->count(),
                'organizations' => Organization::query()->count(),
                'projects' => Project::query()->count(),
                'templates' => Template::query()->count(),
                'storageBytes' => (int) Project::query()->sum('storage_bytes'),
                'activeBuilds' => Compilation::query()->whereIn('status', $activeBuildStatuses)->count(),
            ],
            'recentEvents' => AuditEvent::query()
                ->with(['user:id,name', 'project:id,title'])
                ->latest('created_at')
                ->limit(8)
                ->get(),
        ]);
    }
}
