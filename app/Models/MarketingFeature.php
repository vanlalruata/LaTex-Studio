<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $slug
 * @property string $title
 * @property string $summary
 * @property string $description
 * @property string $category
 * @property string $availability_status
 * @property string $icon_key
 * @property bool $is_featured
 * @property bool $is_public
 * @property int $sort_order
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class MarketingFeature extends Model
{
    /** @use HasFactory<MarketingFeatureFactory> */
    use HasFactory;

    /** @var list<string> */
    protected $fillable = [
        'slug',
        'title',
        'summary',
        'description',
        'category',
        'availability_status',
        'icon_key',
        'is_featured',
        'is_public',
        'sort_order',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_featured' => 'boolean',
            'is_public' => 'boolean',
            'sort_order' => 'integer',
        ];
    }
}
