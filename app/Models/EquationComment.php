<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property string $public_id
 * @property int $equation_id
 * @property int $user_id
 * @property string $body
 * @property Carbon|null $resolved_at
 * @property int|null $resolved_by
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class EquationComment extends Model
{
    /** @var list<string> */
    protected $fillable = [
        'public_id',
        'equation_id',
        'user_id',
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
     * @return BelongsTo<Equation, $this>
     */
    public function equation(): BelongsTo
    {
        return $this->belongsTo(Equation::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
