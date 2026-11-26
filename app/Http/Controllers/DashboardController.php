<?php

namespace App\Http\Controllers;

use App\Models\Compilation;
use App\Models\Project;
use App\Models\Template;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();
        abort_if($user === null, 401);

        $projects = Project::query()
            ->where(function ($query) use ($user): void {
                $query->where('owner_id', $user->id)
                    ->orWhereHas('memberships', fn ($q) => $q->where('user_id', $user->id));
            })
            ->with(['owner:id,name', 'lastSuccessfulCompilation:id,public_id,status,created_at'])
            ->withCount('files')
            ->latest('updated_at')
            ->get()
            ->map(fn (Project $project): array => [
                'public_id' => $project->public_id,
                'title' => $project->title,
                'description' => $project->description,
                'owner_name' => $project->owner->name ?? 'Unknown',
                'compiler_engine' => $project->compiler_engine->value,
                'root_file_path' => $project->root_file_path,
                'files_count' => $project->files_count,
                'storage_bytes' => $project->storage_bytes,
                'role' => $project->roleFor($user)->value ?? 'viewer',
                'updated_at' => $project->updated_at?->toIso8601String(),
            ]);

        $templates = Template::query()
            ->where('is_public', true)
            ->orderBy('title')
            ->get(['public_id', 'slug', 'title', 'category', 'description', 'compiler_engine'])
            ->map(fn (Template $template): array => [
                'public_id' => $template->public_id,
                'slug' => $template->slug,
                'title' => $template->title,
                'category' => $template->category,
                'description' => $template->description,
                'compiler_engine' => $template->compiler_engine->value,
            ]);

        $recentBuildsCount = Compilation::query()
            ->where('triggered_by', $user->id)
            ->where('created_at', '>=', now()->subDays(30))
            ->count();

        return Inertia::render('Dashboard', [
            'projects' => $projects,
            'templates' => $templates,
            'stats' => [
                'active_projects' => $projects->count(),
                'total_storage_bytes' => (int) $projects->sum('storage_bytes'),
                'templates_count' => $templates->count(),
                'recent_builds' => $recentBuildsCount,
            ],
        ]);
    }
}
