<?php

namespace App\Http\Controllers\PublicSite;

use App\Http\Controllers\Controller;
use App\Models\Template;
use Inertia\Inertia;
use Inertia\Response;

class TemplateController extends Controller
{
    public function __invoke(): Response
    {
        $templates = Template::query()
            ->where('is_public', true)
            ->orderBy('category')
            ->orderBy('title')
            ->get(['slug', 'title', 'category', 'description', 'compiler_engine'])
            ->map(static fn (Template $template): array => [
                'slug' => $template->slug,
                'title' => $template->title,
                'category' => $template->category,
                'description' => $template->description,
                'compilerEngine' => $template->compiler_engine->value,
            ])
            ->values()
            ->all();

        return Inertia::render('Public/Templates', [
            'templates' => $templates,
        ]);
    }
}
