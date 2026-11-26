<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePricingPlanRequest;
use App\Http\Requests\Admin\UpdatePricingPlanRequest;
use App\Http\Requests\Admin\UpdatePublicSiteSettingsRequest;
use App\Models\AuditEvent;
use App\Models\PricingPlan;
use App\Services\PublicSite\PublicPricingVisibility;
use App\Services\PublicSite\PublicSiteSettings;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicSiteController extends Controller
{
    public function index(
        PublicSiteSettings $settings,
        PublicPricingVisibility $pricingVisibility,
    ): Response {
        $allSettings = $settings->all();
        $resolvedPricing = $pricingVisibility->resolve();
        $plans = PricingPlan::query()
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get();

        $activePublicCount = $plans->where('is_active', true)->where('is_public', true)->count();
        $paidModeWithoutPlansWarning = $allSettings['pricing_mode'] !== 'free' && $activePublicCount === 0;

        return Inertia::render('Admin/PublicSite', [
            'settings' => $allSettings,
            'plans' => $plans,
            'pricingVisible' => $resolvedPricing['visible'],
            'paidModeWithoutPlansWarning' => $paidModeWithoutPlansWarning,
        ]);
    }

    public function updateSettings(
        UpdatePublicSiteSettingsRequest $request,
        PublicSiteSettings $settings,
    ): RedirectResponse {
        $previousMode = $settings->get('pricing_mode', 'free');
        $validated = $request->validated();

        $settings->updateMany($validated);

        AuditEvent::query()->create([
            'user_id' => $request->user()?->id,
            'action' => $previousMode !== $validated['pricing_mode']
                ? 'public_site.pricing_mode_changed'
                : 'public_site.settings_updated',
            'metadata' => [
                'pricing_mode' => $validated['pricing_mode'],
                'pricing_page_enabled' => $validated['pricing_page_enabled'],
                'registration_mode' => $validated['registration_mode'],
            ],
            'ip_address' => $request->ip(),
        ]);

        return back()->with('success', 'Public site settings updated.');
    }

    public function storePlan(
        StorePricingPlanRequest $request,
        PublicSiteSettings $settings,
    ): RedirectResponse {
        $plan = PricingPlan::query()->create($request->validated());
        $settings->forgetCache();

        AuditEvent::query()->create([
            'user_id' => $request->user()?->id,
            'action' => 'public_site.pricing_plan_created',
            'subject_type' => PricingPlan::class,
            'subject_id' => $plan->id,
            'metadata' => [
                'slug' => $plan->slug,
                'is_active' => $plan->is_active,
                'is_public' => $plan->is_public,
            ],
            'ip_address' => $request->ip(),
        ]);

        return back()->with('success', 'Pricing plan created.');
    }

    public function updatePlan(
        UpdatePricingPlanRequest $request,
        PricingPlan $plan,
        PublicSiteSettings $settings,
    ): RedirectResponse {
        $plan->update($request->validated());
        $settings->forgetCache();

        AuditEvent::query()->create([
            'user_id' => $request->user()?->id,
            'action' => 'public_site.pricing_plan_updated',
            'subject_type' => PricingPlan::class,
            'subject_id' => $plan->id,
            'metadata' => [
                'slug' => $plan->slug,
                'is_active' => $plan->is_active,
                'is_public' => $plan->is_public,
            ],
            'ip_address' => $request->ip(),
        ]);

        return back()->with('success', 'Pricing plan updated.');
    }

    public function destroyPlan(
        Request $request,
        PricingPlan $plan,
        PublicSiteSettings $settings,
    ): RedirectResponse {
        $slug = $plan->slug;
        $planId = $plan->id;
        $plan->delete();
        $settings->forgetCache();

        AuditEvent::query()->create([
            'user_id' => $request->user()?->id,
            'action' => 'public_site.pricing_plan_deleted',
            'subject_type' => PricingPlan::class,
            'subject_id' => $planId,
            'metadata' => ['slug' => $slug],
            'ip_address' => $request->ip(),
        ]);

        return back()->with('success', 'Pricing plan deleted.');
    }
}
