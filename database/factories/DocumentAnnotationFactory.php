<?php

namespace Database\Factories;

use App\Models\DocumentAnnotation;
use App\Models\Project;
use App\Models\ProjectFile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DocumentAnnotation>
 */
class DocumentAnnotationFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $start = fake()->numberBetween(1, 20);

        return [
            'project_id' => Project::factory(),
            'project_file_id' => ProjectFile::factory(),
            'user_id' => User::factory(),
            'kind' => 'note',
            'start_line' => $start,
            'end_line' => $start + fake()->numberBetween(0, 6),
            'color' => 'yellow',
            'body' => fake()->sentence(10),
            'status' => 'open',
        ];
    }
}
