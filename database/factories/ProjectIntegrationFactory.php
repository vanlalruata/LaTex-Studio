<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\ProjectIntegration;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProjectIntegration>
 */
class ProjectIntegrationFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'project_id' => Project::factory(),
            'provider' => 'github',
            'label' => 'GitHub',
            'status' => 'connected',
            'config' => [
                'repository' => fake()->slug(2),
                'branch' => 'main',
            ],
            'last_synced_at' => now()->subHours(2),
            'connected_by' => User::factory(),
        ];
    }
}
