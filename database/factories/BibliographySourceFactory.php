<?php

namespace Database\Factories;

use App\Models\BibliographySource;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<BibliographySource>
 */
class BibliographySourceFactory extends Factory
{
    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $key = fake()->unique()->slug(2);
        $title = fake()->sentence(6);
        $year = fake()->numberBetween(2015, 2026);

        return [
            'project_id' => Project::factory(),
            'added_by' => User::factory(),
            'provider' => 'manual',
            'key' => $key,
            'title' => $title,
            'authors' => [fake()->name(), fake()->name()],
            'year' => $year,
            'venue' => fake()->company(),
            'doi' => '10.1000/'.fake()->unique()->numerify('####'),
            'url' => 'https://example.org/'.$key,
            'raw_bibtex' => "@article{{$key},\n  title = {{$title}},\n  year = {{$year}}\n}",
            'is_imported' => false,
        ];
    }
}
