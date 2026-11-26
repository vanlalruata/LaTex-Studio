<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property string $public_id
 * @property int $figure_id
 * @property int $user_id
 * @property string $engine
 * @property string $status
 * @property int|null $exit_code
 * @property int|null $duration_ms
 * @property string|null $error_summary
 * @property list<array{severity: string, file_path: string, line: int|null, message: string, raw_excerpt: string|null}>|null $diagnostics_json
 * @property Carbon|null $started_at
 * @property Carbon|null $finished_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class FigureRenderJob extends Model
{
    /** @var list<string> */
    protected $fillable = [
        'public_id',
        'figure_id',
        'user_id',
        'engine',
        'status',
        'exit_code',
        'duration_ms',
        'error_summary',
        'diagnostics_json',
        'started_at',
        'finished_at',
    ];

    protected static function booted(): void
    {
        static::creating(function (self $job): void {
            if (empty($job->public_id)) {
                $job->public_id = (string) Str::uuid();
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
            'exit_code' => 'integer',
            'duration_ms' => 'integer',
            'diagnostics_json' => 'array',
            'started_at' => 'datetime',
            'finished_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<Figure, $this>
     */
    public function figure(): BelongsTo
    {
        return $this->belongsTo(Figure::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return HasMany<FigureArtifact, $this>
     */
    public function artifacts(): HasMany
    {
        return $this->hasMany(FigureArtifact::class);
    }
}
