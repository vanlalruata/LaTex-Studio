<?php

namespace Database\Seeders;

use App\Models\MarketingFeature;
use App\Services\PublicSite\MarketingCatalog;
use Illuminate\Database\Seeder;

class MarketingFeatureSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        foreach (app(MarketingCatalog::class)->defaultFeatures() as $sortOrder => $feature) {
            MarketingFeature::query()->firstOrCreate(
                ['slug' => $feature['slug']],
                [
                    'title' => $feature['title'],
                    'summary' => $feature['summary'],
                    'description' => $feature['description'],
                    'category' => $feature['category'],
                    'availability_status' => $feature['status'],
                    'icon_key' => $feature['iconKey'],
                    'is_featured' => $feature['featured'],
                    'is_public' => true,
                    'sort_order' => $sortOrder,
                ],
            );
        }
    }
}
