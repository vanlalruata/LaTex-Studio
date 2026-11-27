<?php

use App\Models\InstitutionalDomain;
use App\Models\PricingPlan;
use App\Models\User;
use App\Services\PublicSite\PublicSiteSettings;
use Inertia\Testing\AssertableInertia as Assert;

test('institutional free user receives shared institution props on dashboard and pricing', function (): void {
    app(PublicSiteSettings::class)->updateMany([
        'pricing_mode' => 'paid',
        'pricing_page_enabled' => true,
    ]);

    PricingPlan::query()->create([
        'name' => 'Pro',
        'slug' => 'pro',
        'price_amount' => 1500,
        'is_active' => true,
        'is_public' => true,
    ]);

    InstitutionalDomain::query()->create([
        'domain' => 'mzu.edu.in',
        'institution_name' => 'Mizoram University',
        'is_active' => true,
    ]);

    $user = User::factory()->create([
        'email' => 'faculty@mzu.edu.in',
        'is_institutional_free' => true,
        'institutional_domain' => 'mzu.edu.in',
        'institutional_granted_at' => now(),
    ]);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('auth.user.is_institutional_free', true)
            ->where('auth.user.institutional_domain', 'mzu.edu.in')
            ->where('auth.user.institution_name', 'Mizoram University')
        );

    $this->actingAs($user)
        ->get(route('public.pricing'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('auth.user.is_institutional_free', true)
        );
});
