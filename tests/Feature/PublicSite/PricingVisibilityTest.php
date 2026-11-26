<?php

use App\Models\PricingPlan;
use App\Models\User;
use App\Services\PublicSite\PublicSiteSettings;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Role;

function createPublicPlan(array $overrides = []): PricingPlan
{
    return PricingPlan::query()->create(array_merge([
        'name' => 'Researcher Pro',
        'slug' => 'researcher-pro-'.uniqid(),
        'summary' => 'For active academic authors.',
        'price_amount' => 1200,
        'currency' => 'USD',
        'billing_interval' => 'month',
        'features' => ['Unlimited projects', 'Priority builds'],
        'cta_label' => 'Get started',
        'cta_type' => 'register',
        'cta_target' => null,
        'is_active' => true,
        'is_public' => true,
        'sort_order' => 1,
    ], $overrides));
}

test('pricing visibility matrix hides or shows pricing strictly according to business rules', function (
    string $mode,
    bool $pageEnabled,
    string $planState,
    bool $expectedVisible,
) {
    if ($planState === 'active_public') {
        createPublicPlan(['is_active' => true, 'is_public' => true]);
    } elseif ($planState === 'inactive_only') {
        createPublicPlan(['is_active' => false, 'is_public' => true]);
    } elseif ($planState === 'private_only') {
        createPublicPlan(['is_active' => true, 'is_public' => false]);
    }

    app(PublicSiteSettings::class)->updateMany([
        'pricing_mode' => $mode,
        'pricing_page_enabled' => $pageEnabled,
    ]);

    $home = $this->get(route('home'));
    $home->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('publicSite.pricingVisible', $expectedVisible)
            ->has('pricingPlans', $expectedVisible ? 1 : 0)
        );

    $pricingResponse = $this->get(route('public.pricing'));
    if ($expectedVisible) {
        $pricingResponse->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Public/Pricing')
                ->has('plans', 1)
            );
    } else {
        $pricingResponse->assertNotFound();
    }
})->with([
    'free + page enabled + active public plan => hidden' => ['free', true, 'active_public', false],
    'free + page disabled + active public plan => hidden' => ['free', false, 'active_public', false],
    'paid + page disabled + active public plan => hidden' => ['paid', false, 'active_public', false],
    'paid + page enabled + no plans => hidden' => ['paid', true, 'none', false],
    'paid + page enabled + inactive only => hidden' => ['paid', true, 'inactive_only', false],
    'paid + page enabled + private only => hidden' => ['paid', true, 'private_only', false],
    'paid + page enabled + active public plan => visible' => ['paid', true, 'active_public', true],
    'contact_sales + page enabled + no plans => hidden' => ['contact_sales', true, 'none', false],
]);

test('non-admin users are forbidden from admin public site management', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('admin.public-site.index'))
        ->assertForbidden();

    $this->actingAs($user)
        ->put(route('admin.public-site.settings.update'), [
            'pricing_mode' => 'paid',
        ])
        ->assertForbidden();
});

test('admin can update pricing settings and plans and cache invalidates immediately', function () {
    $role = Role::query()->firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
    $admin = User::factory()->create();
    $admin->assignRole($role);

    // Initially hidden
    $this->get(route('public.pricing'))->assertNotFound();

    $this->actingAs($admin)
        ->post(route('admin.public-site.plans.store'), [
            'name' => 'Academic Team',
            'slug' => 'academic-team',
            'summary' => 'For labs and co-authors.',
            'price_amount' => 2900,
            'currency' => 'USD',
            'billing_interval' => 'month',
            'features' => ['Shared workspaces', 'Review threads'],
            'cta_label' => 'Get started',
            'cta_type' => 'register',
            'cta_target' => null,
            'is_active' => true,
            'is_public' => true,
            'sort_order' => 1,
        ])
        ->assertRedirect();

    $this->actingAs($admin)
        ->put(route('admin.public-site.settings.update'), [
            'pricing_mode' => 'paid',
            'pricing_page_enabled' => true,
            'pricing_currency' => 'USD',
            'pricing_tax_note' => 'Taxes may apply based on jurisdiction.',
            'registration_mode' => 'open',
            'contact_form_enabled' => true,
            'contact_notification_email' => null,
            'public_brand_name' => 'LaTeX Studio',
            'public_tagline' => 'Research writing, from source to finished paper.',
            'public_support_email' => null,
            'public_announcement' => null,
        ])
        ->assertRedirect();

    $this->get(route('public.pricing'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Public/Pricing')
            ->has('plans', 1)
            ->where('plans.0.slug', 'academic-team')
        );
});
