<?php

namespace Database\Factories;

use App\Models\MarketingFeature;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<MarketingFeature>
 */
class MarketingFeatureFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->sentence(3);

        return [
            'slug' => fake()->unique()->slug(),
            'title' => rtrim($title, '.'),
            'summary' => fake()->sentence(),
            'description' => fake()->paragraph(),
            'category' => 'Research workflow',
            'availability_status' => 'planned',
            'icon_key' => 'code',
            'is_featured' => false,
            'is_public' => true,
            'sort_order' => 0,
        ];
    }
}
