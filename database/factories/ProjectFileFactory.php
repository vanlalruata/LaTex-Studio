<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\ProjectFile;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<ProjectFile>
 */
class ProjectFileFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'public_id' => (string) Str::uuid(),
            'project_id' => Project::factory(),
            'path' => 'main.tex',
            'storage_key' => null,
            'mime_type' => 'text/x-tex',
            'size_bytes' => 0,
            'sha256_checksum' => null,
            'is_directory' => false,
            'version' => 1,
        ];
    }
}
