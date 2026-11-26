<?php

use Inertia\Testing\AssertableInertia as Assert;

test('public home page renders with allowlisted publicSite props', function () {
    $response = $this->get(route('home'));

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Public/Home')
            ->has('publicSite', fn (Assert $publicSite) => $publicSite
                ->has('brandName')
                ->has('tagline')
                ->has('registrationMode')
                ->where('pricingVisible', false)
                ->where('contactFormEnabled', true)
                ->has('supportEmail')
                ->has('announcement')
            )
        );
});

test('unknown web routes render the public 404 page', function () {
    $response = $this->get('/non-existent-public-route-xyz');

    $response->assertNotFound()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Public/NotFound')
        );
});
