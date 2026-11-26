<?php

namespace Database\Factories;

use App\Models\ConversionJob;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ConversionJob>
 */
class ConversionJobFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'project_id' => Project::factory(),
            'user_id' => User::factory(),
            'status' => 'queued',
            'direction' => 'docx_to_latex',
            'engine' => 'pandoc',
            'input_filename' => fake()->slug(2).'.docx',
            'output_filename' => null,
            'log_excerpt' => null,
        ];
    }
}
