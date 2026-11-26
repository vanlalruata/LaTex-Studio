<?php

use Inertia\Testing\AssertableInertia as Assert;

test('interactive demo page renders without exposing user projects or credentials', function () {
    $response = $this->get(route('public.demo'));

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Public/Demo')
            ->missing('projects')
            ->missing('credentials')
        );
});
