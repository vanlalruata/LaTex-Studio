<?php

namespace App\Models;

use App\Enums\AiProvider;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property string $public_id
 * @property int $user_id
 * @property AiProvider $provider
 * @property string $label
 * @property string $model
 * @property string|null $base_url
 * @property string $api_key
 * @property string $key_last_four
 * @property bool $is_default
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Hidden(['api_key'])]
class UserAiCredential extends Model
{
    /** @var list<string> */
    protected $fillable = [
        'public_id',
        'user_id',
        'provider',
        'label',
        'model',
        'base_url',
        'api_key',
        'key_last_four',
        'is_default',
    ];

    protected static function booted(): void
    {
        static::creating(function (self $credential): void {
            if (empty($credential->public_id)) {
                $credential->public_id = (string) Str::uuid();
            }
        });
    }

    public function getRouteKeyName(): string
    {
        return 'public_id';
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'provider' => AiProvider::class,
            'api_key' => 'encrypted',
            'is_default' => 'boolean',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
