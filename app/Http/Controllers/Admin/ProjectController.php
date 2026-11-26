<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\BulkArchiveProjectsRequest;
use App\Models\AuditEvent;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();
        $archived = $request->query('archived', 'all');

        $projects = Project::query()
            ->with('owner:id,name,email')
            ->withCount(['files', 'memberships'])
            ->when($search !== '', static function ($query) use ($search): void {
                $query->where(static function ($query) use ($search): void {
                    $query->where('title', 'like', '%'.$search.'%')
                        ->orWhereHas('owner', static fn ($ownerQuery) => $ownerQuery
                            ->where('name', 'like', '%'.$search.'%')
                            ->orWhere('email', 'like', '%'.$search.'%'));
                });
            })
            ->when($archived === 'active', static fn ($query) => $query->whereNull('archived_at'))
            ->when($archived === 'archived', static fn ($query) => $query->whereNotNull('archived_at'))
            ->latest('updated_at')
            ->paginate(25)
            ->withQueryString()
            ->through(static fn (Project $project): array => [
                'id' => $project->id,
                'public_id' => $project->public_id,
                'title' => $project->title,
                'owner' => $project->owner?->only(['name', 'email']),
                'storage_bytes' => $project->storage_bytes,
                'files_count' => $project->files_count,
                'members_count' => $project->memberships_count + 1,
                'archived_at' => $project->archived_at?->toIso8601String(),
                'updated_at' => $project->updated_at?->toIso8601String(),
            ]);

        return Inertia::render('Admin/Projects', [
            'projects' => $projects,
            'filters' => ['search' => $search, 'archived' => $archived],
        ]);
    }

    public function archive(Request $request, Project $project): RedirectResponse
    {
        $archived = $request->boolean('archived');
        $project->update(['archived_at' => $archived ? now() : null]);

        AuditEvent::query()->create([
            'user_id' => $request->user()?->id,
            'project_id' => $project->id,
            'action' => $archived ? 'admin.project.archived' : 'admin.project.restored',
            'subject_type' => Project::class,
            'subject_id' => $project->id,
            'metadata' => ['public_id' => $project->public_id],
            'ip_address' => $request->ip(),
        ]);

        return back()->with('success', $archived ? 'Project archived.' : 'Project restored.');
    }

    public function bulkArchive(BulkArchiveProjectsRequest $request): RedirectResponse
    {
        $projectIds = $request->validated('project_ids');
        $projects = Project::query()->whereIn('public_id', $projectIds)->whereNull('archived_at')->get();

        foreach ($projects as $project) {
            $project->update(['archived_at' => now()]);
        }

        AuditEvent::query()->create([
            'user_id' => $request->user()?->id,
            'action' => 'admin.projects.bulk_archived',
            'metadata' => ['count' => $projects->count()],
            'ip_address' => $request->ip(),
        ]);

        return back()->with('success', $projects->count().' projects archived.');
    }
}
