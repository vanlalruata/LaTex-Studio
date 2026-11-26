<?php

use App\Enums\CompilerEngine;
use App\Models\Template;
use Inertia\Testing\AssertableInertia as Assert;

test('all public marketing pages render expected Inertia components', function (string $routeName, string $component) {
    $response = $this->get(route($routeName));

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page->component($component));
})->with([
    ['home', 'Public/Home'],
    ['public.features', 'Public/Features'],
    ['public.how-it-works', 'Public/HowItWorks'],
    ['public.templates', 'Public/Templates'],
    ['public.about', 'Public/About'],
    ['public.faq', 'Public/Faq'],
    ['public.privacy', 'Public/Privacy'],
    ['public.terms', 'Public/Terms'],
]);

test('features page exposes non-disabled features with explicit status', function () {
    $response = $this->get(route('public.features'));

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Public/Features')
            ->has('features')
            ->where('features.0.status', 'available')
        );
});

test('templates page lists only public templates', function () {
    Template::query()->create([
        'slug' => 'public-article',
        'title' => 'Public Research Article',
        'category' => 'article',
        'description' => 'Public template.',
        'compiler_engine' => CompilerEngine::PdfLaTeX,
        'files_manifest' => [['path' => 'main.tex', 'content' => '\documentclass{article}']],
        'is_public' => true,
    ]);

    Template::query()->create([
        'slug' => 'private-template',
        'title' => 'Private Internal Template',
        'category' => 'article',
        'description' => 'Should not be public.',
        'compiler_engine' => CompilerEngine::PdfLaTeX,
        'files_manifest' => [['path' => 'main.tex', 'content' => '\documentclass{article}']],
        'is_public' => false,
    ]);

    $response = $this->get(route('public.templates'));

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Public/Templates')
            ->has('templates', 1)
            ->where('templates.0.slug', 'public-article')
        );
});
