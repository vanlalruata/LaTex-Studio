<?php

namespace Database\Factories;

use App\Models\OcrJob;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<OcrJob>
 */
class OcrJobFactory extends Factory
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
            'source_filename' => fake()->slug(2).'.png',
            'mime_type' => 'image/png',
            'languages' => 'eng',
            'extracted_latex' => null,
            'confidence' => null,
            'error_message' => null,
        ];
    }
}
