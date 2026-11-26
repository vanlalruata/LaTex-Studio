<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property string $public_id
 * @property string $name
 * @property string $slug
 * @property string|null $description
 * @property array<string, mixed> $configuration_json
 * @property bool $is_system
 * @property bool $is_active
 * @property int|null $created_by
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class TableStyleProfile extends Model
{
    /** @var list<string> */
    protected $fillable = [
        'public_id',
        'name',
        'slug',
        'description',
        'configuration_json',
        'is_system',
        'is_active',
        'created_by',
    ];

    protected static function booted(): void
    {
        static::creating(function (self $profile): void {
            if (empty($profile->public_id)) {
                $profile->public_id = (string) Str::uuid();
            }
        });
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'configuration_json' => 'array',
            'is_system' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
