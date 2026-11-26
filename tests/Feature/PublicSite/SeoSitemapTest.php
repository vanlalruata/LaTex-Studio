<?php

use App\Models\PricingPlan;
use App\Services\PublicSite\PublicSiteSettings;

test('sitemap excludes pricing when hidden and excludes private routes', function () {
    $response = $this->get(route('public.sitemap'));

    $response->assertOk()
        ->assertHeader('Content-Type', 'application/xml; charset=utf-8');

    $content = (string) $response->getContent();
    expect($content)
        ->toContain(route('home'))
        ->toContain(route('public.features'))
        ->toContain(route('public.demo'))
        ->toContain(route('public.contact'))
        ->not->toContain(route('public.pricing'))
        ->not->toContain('/admin')
        ->not->toContain('/dashboard');
});

test('sitemap includes pricing when pricing is visible', function () {
    PricingPlan::query()->create([
        'name' => 'Pro',
        'slug' => 'pro',
        'summary' => 'Pro plan',
        'price_amount' => 1500,
        'currency' => 'USD',
        'billing_interval' => 'month',
        'features' => ['Unlimited projects'],
        'cta_label' => 'Get started',
        'cta_type' => 'register',
        'is_active' => true,
        'is_public' => true,
        'sort_order' => 1,
    ]);

    app(PublicSiteSettings::class)->updateMany([
        'pricing_mode' => 'paid',
        'pricing_page_enabled' => true,
    ]);

    $response = $this->get(route('public.sitemap'));

    $response->assertOk();
    expect((string) $response->getContent())->toContain(route('public.pricing'));
});
