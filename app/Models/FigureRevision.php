<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property string $public_id
 * @property int $figure_id
 * @property int $user_id
 * @property int $schema_version
 * @property string $mode
 * @property array<string, mixed> $scene_json
 * @property string $tikz_source
 * @property string|null $summary
 * @property Carbon|null $created_at
 */
class FigureRevision extends Model
{
    public $timestamps = false;

    /** @var list<string> */
    protected $fillable = [
        'public_id',
        'figure_id',
        'user_id',
        'schema_version',
        'mode',
        'scene_json',
        'tikz_source',
        'summary',
        'created_at',
    ];

    protected static function booted(): void
    {
        static::creating(function (self $revision): void {
            if (empty($revision->public_id)) {
                $revision->public_id = (string) Str::uuid();
            }
            if ($revision->created_at === null) {
                $revision->created_at = Carbon::now();
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
            'schema_version' => 'integer',
            'scene_json' => 'array',
            'created_at' => 'datetime',
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
}
