<?php

namespace Database\Factories;

use App\Enums\BuildProfile;
use App\Enums\CompilerEngine;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Project>
 */
class ProjectFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'public_id' => (string) Str::uuid(),
            'owner_id' => User::factory(),
            'organization_id' => null,
            'title' => fake()->sentence(4),
            'description' => fake()->paragraph(),
            'root_file_path' => 'main.tex',
            'compiler_engine' => CompilerEngine::PdfLaTeX,
            'build_profile' => BuildProfile::Standard,
            'bibliography_tool' => 'biber',
            'auto_compile' => true,
            'storage_bytes' => 0,
        ];
    }
}
