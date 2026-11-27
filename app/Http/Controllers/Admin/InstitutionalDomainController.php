<?php

namespace App\Http\Controllers\Admin;

use App\Domain\Administration\AuditService;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreInstitutionalDomainRequest;
use App\Http\Requests\Admin\UpdateInstitutionalDomainRequest;
use App\Models\InstitutionalDomain;
use App\Models\User;
use App\Services\InstitutionalAccessService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InstitutionalDomainController extends Controller
{
    public function index(InstitutionalAccessService $service): Response
    {
        $domains = InstitutionalDomain::query()
            ->with('creator:id,name')
            ->orderBy('domain')
            ->get()
            ->map(static fn (InstitutionalDomain $domain): array => [
                'id' => $domain->id,
                'domain' => $domain->domain,
                'institution_name' => $domain->institution_name,
                'is_active' => $domain->is_active,
                'max_users' => $domain->max_users,
                'usage_count' => $service->usageCount($domain),
                'expires_at' => $domain->expires_at?->toDateString(),
                'is_expired' => $domain->expires_at !== null && $domain->expires_at->isPast(),
                'notes' => $domain->notes,
                'creator_name' => $domain->creator?->name,
                'created_at' => $domain->created_at?->toIso8601String(),
            ])
            ->values()
            ->all();

        return Inertia::render('Admin/InstitutionalDomains', [
            'domains' => $domains,
            'totalInstitutionalUsers' => User::query()->where('is_institutional_free', true)->count(),
        ]);
    }

    public function store(
        StoreInstitutionalDomainRequest $request,
        AuditService $audit,
    ): RedirectResponse {
        $validated = $request->validated();

        $domain = InstitutionalDomain::query()->create([
            'domain' => $validated['domain'],
            'institution_name' => $validated['institution_name'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
            'max_users' => $validated['max_users'] ?? null,
            'expires_at' => $validated['expires_at'] ?? null,
            'notes' => $validated['notes'] ?? null,
            'created_by' => $request->user()?->id,
        ]);

        $audit->record(
            action: 'admin.institutional_domain.created',
            user: $request->user(),
            subject: $domain,
            metadata: ['domain' => $domain->domain, 'institution_name' => $domain->institution_name],
            ipAddress: $request->ip(),
        );

        return back()->with('success', "Domain {$domain->domain} added to institutional free-access whitelist.");
    }

    public function update(
        UpdateInstitutionalDomainRequest $request,
        InstitutionalDomain $domain,
        AuditService $audit,
    ): RedirectResponse {
        $domain->update($request->validated());

        $audit->record(
            action: 'admin.institutional_domain.updated',
            user: $request->user(),
            subject: $domain,
            metadata: ['domain' => $domain->domain, 'is_active' => $domain->is_active],
            ipAddress: $request->ip(),
        );

        return back()->with('success', "Updated {$domain->domain}.");
    }

    public function destroy(
        Request $request,
        InstitutionalDomain $domain,
        AuditService $audit,
    ): RedirectResponse {
        $domainName = $domain->domain;
        $domainId = $domain->id;
        $domain->delete();

        $audit->record(
            action: 'admin.institutional_domain.deleted',
            user: $request->user(),
            metadata: ['domain' => $domainName, 'domain_id' => $domainId],
            ipAddress: $request->ip(),
        );

        return back()->with('success', "Removed {$domainName}. Existing users keep their access.");
    }

    public function bulkGrant(
        Request $request,
        InstitutionalDomain $domain,
        InstitutionalAccessService $service,
        AuditService $audit,
    ): RedirectResponse {
        $suffix = '@'.strtolower($domain->domain);
        $currentCount = $service->usageCount($domain);
        $remaining = $domain->max_users !== null ? max(0, $domain->max_users - $currentCount) : null;

        $query = User::query()
            ->where('is_institutional_free', false)
            ->whereRaw('LOWER(email) LIKE ?', ['%'.$suffix]);

        if ($remaining !== null) {
            $query->limit($remaining);
        }

        $users = $query->get();
        $granted = 0;

        foreach ($users as $user) {
            $service->grant($user, $domain);
            $granted++;
        }

        $audit->record(
            action: 'admin.institutional_domain.bulk_granted',
            user: $request->user(),
            subject: $domain,
            metadata: ['domain' => $domain->domain, 'granted_count' => $granted],
            ipAddress: $request->ip(),
        );

        return back()->with('success', "Granted institutional free access to {$granted} existing user(s) for {$domain->domain}.");
    }
}
