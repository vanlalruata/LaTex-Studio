<?php

namespace Database\Factories;

use App\Enums\CompilerEngine;
use App\Models\Template;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Template>
 */
class TemplateFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->sentence(3);

        return [
            'public_id' => (string) Str::uuid(),
            'organization_id' => null,
            'slug' => Str::slug($title).'-'.Str::lower(Str::random(4)),
            'title' => rtrim($title, '.'),
            'category' => 'article',
            'description' => fake()->sentence(),
            'compiler_engine' => CompilerEngine::PdfLaTeX,
            'files_manifest' => [
                [
                    'path' => 'main.tex',
                    'content' => "\\documentclass{article}\n\\begin{document}\nHello World\n\\end{document}\n",
                ],
            ],
            'is_public' => true,
        ];
    }
}
