<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreMarketingFeatureRequest;
use App\Http\Requests\Admin\UpdateMarketingFeatureRequest;
use App\Models\AuditEvent;
use App\Models\MarketingFeature;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MarketingFeatureController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Features', [
            'features' => MarketingFeature::query()
                ->orderBy('sort_order')
                ->orderBy('id')
                ->get(),
            'iconKeys' => ['code', 'file-text', 'book', 'users', 'sparkles', 'git-branch', 'sigma', 'layout', 'scan'],
        ]);
    }

    public function store(StoreMarketingFeatureRequest $request): RedirectResponse
    {
        $feature = MarketingFeature::query()->create($request->validated());

        $this->audit($request, 'marketing_feature.created', $feature);

        return back()->with('success', 'Marketing feature created.');
    }

    public function update(
        UpdateMarketingFeatureRequest $request,
        MarketingFeature $feature,
    ): RedirectResponse {
        $feature->update($request->validated());

        $this->audit($request, 'marketing_feature.updated', $feature);

        return back()->with('success', 'Marketing feature updated.');
    }

    public function destroy(Request $request, MarketingFeature $feature): RedirectResponse
    {
        $slug = $feature->slug;
        $featureId = $feature->id;
        $feature->delete();

        AuditEvent::query()->create([
            'user_id' => $request->user()?->id,
            'action' => 'marketing_feature.deleted',
            'subject_type' => MarketingFeature::class,
            'subject_id' => $featureId,
            'metadata' => ['slug' => $slug],
            'ip_address' => $request->ip(),
        ]);

        return back()->with('success', 'Marketing feature deleted.');
    }

    private function audit(Request $request, string $action, MarketingFeature $feature): void
    {
        AuditEvent::query()->create([
            'user_id' => $request->user()?->id,
            'action' => $action,
            'subject_type' => MarketingFeature::class,
            'subject_id' => $feature->id,
            'metadata' => [
                'slug' => $feature->slug,
                'availability_status' => $feature->availability_status,
                'is_public' => $feature->is_public,
            ],
            'ip_address' => $request->ip(),
        ]);
    }
}
