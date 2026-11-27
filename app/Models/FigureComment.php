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
 * @property string|null $object_id
 * @property string|null $object_label
 * @property string $body
 * @property Carbon|null $resolved_at
 * @property int|null $resolved_by
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class FigureComment extends Model
{
    /** @var list<string> */
    protected $fillable = [
        'public_id',
        'figure_id',
        'user_id',
        'object_id',
        'object_label',
        'body',
        'resolved_at',
        'resolved_by',
    ];

    protected static function booted(): void
    {
        static::creating(function (self $comment): void {
            if (empty($comment->public_id)) {
                $comment->public_id = (string) Str::uuid();
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
            'resolved_at' => 'datetime',
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
