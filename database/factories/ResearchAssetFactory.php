<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\ResearchAsset;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ResearchAsset>
 */
class ResearchAssetFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'project_id' => Project::factory(),
            'created_by' => User::factory(),
            'kind' => 'figure',
            'title' => fake()->sentence(3),
            'label' => 'fig:'.fake()->unique()->slug(2),
            'caption' => fake()->sentence(12),
            'payload' => [
                'source' => "\\begin{tikzpicture}\n\\draw (0,0) -- (2,1);\n\\end{tikzpicture}",
            ],
            'status' => 'draft',
        ];
    }
}
