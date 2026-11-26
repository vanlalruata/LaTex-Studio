<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\ReviewAssignment;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ReviewAssignment>
 */
class ReviewAssignmentFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'project_id' => Project::factory(),
            'project_file_id' => null,
            'assignee_id' => User::factory(),
            'assigned_by' => User::factory(),
            'title' => fake()->sentence(4),
            'instructions' => fake()->paragraph(),
            'due_at' => now()->addDays(7),
            'status' => 'pending',
            'completed_at' => null,
        ];
    }
}
