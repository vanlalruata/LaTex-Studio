<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property string $slug
 * @property string|null $summary
 * @property int $price_amount
 * @property string $currency
 * @property string $billing_interval
 * @property array<int, string>|null $features
 * @property string $cta_label
 * @property string $cta_type
 * @property string|null $cta_target
 * @property bool $is_active
 * @property bool $is_public
 * @property int $sort_order
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class PricingPlan extends Model
{
    /** @var list<string> */
    protected $fillable = [
        'name',
        'slug',
        'summary',
        'price_amount',
        'currency',
        'billing_interval',
        'features',
        'cta_label',
        'cta_type',
        'cta_target',
        'is_active',
        'is_public',
        'sort_order',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'price_amount' => 'integer',
            'features' => 'array',
            'is_active' => 'boolean',
            'is_public' => 'boolean',
            'sort_order' => 'integer',
        ];
    }
}
