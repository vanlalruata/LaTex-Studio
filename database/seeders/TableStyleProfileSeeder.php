<?php

namespace Database\Seeders;

use App\Models\TableStyleProfile;
use Illuminate\Database\Seeder;

class TableStyleProfileSeeder extends Seeder
{
    public function run(): void
    {
        $profiles = [
            [
                'slug' => 'booktabs',
                'name' => 'Three-Line Booktabs',
                'description' => 'Clean academic three-line layout with toprule, midrule, and bottomrule.',
                'configuration_json' => [
                    'preset' => 'booktabs',
                    'fontSize' => 'normalsize',
                    'lineSpacing' => '1.0',
                    'captionPosition' => 'top',
                ],
            ],
            [
                'slug' => 'ieee',
                'name' => 'IEEE-like Compact',
                'description' => 'Compact formatting preset with footnotesize text, 4pt column separation, and top caption.',
                'configuration_json' => [
                    'preset' => 'ieee',
                    'fontSize' => 'footnotesize',
                    'tabColSep' => '4pt',
                    'lineSpacing' => '1.0',
                    'captionPosition' => 'top',
                ],
            ],
            [
                'slug' => 'springer',
                'name' => 'Springer-like Table',
                'description' => 'Formatting preset with small font, booktabs rules, and top caption.',
                'configuration_json' => [
                    'preset' => 'springer',
                    'fontSize' => 'small',
                    'lineSpacing' => '1.0',
                    'captionPosition' => 'top',
                ],
            ],
            [
                'slug' => 'elsevier',
                'name' => 'Elsevier-like Table',
                'description' => 'Formatting preset with small font, 1.15 line spacing, and top caption.',
                'configuration_json' => [
                    'preset' => 'elsevier',
                    'fontSize' => 'small',
                    'lineSpacing' => '1.15',
                    'captionPosition' => 'top',
                ],
            ],
            [
                'slug' => 'thesis',
                'name' => 'Thesis / Dissertation',
                'description' => 'Readable dissertation preset with normalsize text and 1.15 row stretch.',
                'configuration_json' => [
                    'preset' => 'thesis',
                    'fontSize' => 'normalsize',
                    'lineSpacing' => '1.15',
                    'captionPosition' => 'top',
                ],
            ],
        ];

        foreach ($profiles as $profile) {
            TableStyleProfile::query()->updateOrCreate(
                ['slug' => $profile['slug']],
                [
                    'name' => $profile['name'],
                    'description' => $profile['description'],
                    'configuration_json' => $profile['configuration_json'],
                    'is_system' => true,
                    'is_active' => true,
                ]
            );
        }
    }
}
