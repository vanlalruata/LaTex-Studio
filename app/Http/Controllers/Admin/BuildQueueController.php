<?php

namespace App\Http\Controllers\Admin;

use App\Domain\Administration\AuditService;
use App\Domain\Compilation\BuildQueueHealthService;
use App\Enums\CompilationStatus;
use App\Http\Controllers\Controller;
use App\Models\Compilation;
use App\Services\Compiler\CompilerSettingsService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BuildQueueController extends Controller
{
    public function index(
        BuildQueueHealthService $queueHealth,
        CompilerSettingsService $compilerSettings,
    ): Response {
        return Inertia::render('Admin/BuildQueue', [
            'driver' => $compilerSettings->driver(),
            'summary' => $queueHealth->summary(),
            'stuckCompilations' => $queueHealth->stuckCompilations(),
            'recentCompilations' => $queueHealth->recentCompilations(),
        ]);
    }

    public function cancel(
        Request $request,
        Compilation $compilation,
        AuditService $audit,
    ): RedirectResponse {
        abort_if($compilation->status->isTerminal(), 422, 'Compilation has already finished.');

        $compilation->update([
            'status' => CompilationStatus::Cancelled,
            'finished_at' => now(),
            'error_summary' => 'Force-cancelled by platform administrator.',
        ]);

        $audit->record(
            action: 'admin.compilation.force_cancelled',
            user: $request->user(),
            project: $compilation->project,
            subject: $compilation,
            ipAddress: $request->ip(),
        );

        return back()->with('success', 'Compilation cancelled.');
    }
}
