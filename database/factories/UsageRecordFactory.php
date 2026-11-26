<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\UsageRecord;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<UsageRecord>
 */
class UsageRecordFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'project_id' => Project::factory(),
            'metric' => 'compile_seconds',
            'quantity' => fake()->numberBetween(10, 600),
            'metadata' => null,
        ];
    }
}
