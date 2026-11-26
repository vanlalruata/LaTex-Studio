<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateOrganizationQuotaRequest;
use App\Models\AuditEvent;
use App\Models\Organization;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class OrganizationController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Organizations', [
            'organizations' => Organization::query()
                ->withCount(['members', 'projects'])
                ->withSum('projects', 'storage_bytes')
                ->orderBy('name')
                ->paginate(25)
                ->through(static fn (Organization $organization): array => [
                    'id' => $organization->id,
                    'public_id' => $organization->public_id,
                    'name' => $organization->name,
                    'slug' => $organization->slug,
                    'storage_quota_bytes' => $organization->storage_quota_bytes,
                    'storage_bytes' => (int) ($organization->projects_sum_storage_bytes ?? 0),
                    'members_count' => $organization->members_count,
                    'projects_count' => $organization->projects_count,
                ]),
        ]);
    }

    public function updateQuota(
        UpdateOrganizationQuotaRequest $request,
        Organization $organization,
    ): RedirectResponse {
        $oldQuota = $organization->storage_quota_bytes;
        $newQuota = $request->validated('storage_quota_bytes');
        $organization->update(['storage_quota_bytes' => $newQuota]);

        AuditEvent::query()->create([
            'user_id' => $request->user()?->id,
            'action' => 'admin.organization.storage_quota_updated',
            'subject_type' => Organization::class,
            'subject_id' => $organization->id,
            'metadata' => ['from' => $oldQuota, 'to' => $newQuota],
            'ip_address' => $request->ip(),
        ]);

        return back()->with('success', 'Organization storage quota updated.');
    }
}
