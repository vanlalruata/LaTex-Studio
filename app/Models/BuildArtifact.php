<?php

namespace App\Models;

use App\Enums\ArtifactType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property string $public_id
 * @property int $compilation_id
 * @property ArtifactType $type
 * @property string $storage_key
 * @property string $sha256_checksum
 * @property int $size_bytes
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class BuildArtifact extends Model
{
    /** @var list<string> */
    protected $fillable = [
        'public_id',
        'compilation_id',
        'type',
        'storage_key',
        'sha256_checksum',
        'size_bytes',
    ];

    protected static function booted(): void
    {
        static::creating(function (self $artifact): void {
            if (empty($artifact->public_id)) {
                $artifact->public_id = (string) Str::uuid();
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
            'type' => ArtifactType::class,
            'size_bytes' => 'integer',
        ];
    }

    /**
     * @return BelongsTo<Compilation, $this>
     */
    public function compilation(): BelongsTo
    {
        return $this->belongsTo(Compilation::class);
    }
}
