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
 * @property string $content_mode
 * @property array<string, mixed>|null $structured_document_json
 * @property string $latex_source
 * @property string|null $summary
 * @property Carbon|null $created_at
 */
class EquationRevision extends Model
{
    public $timestamps = false;

    /** @var list<string> */
    protected $fillable = [
        'public_id',
        'equation_id',
        'user_id',
        'content_mode',
        'structured_document_json',
        'latex_source',
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
            'structured_document_json' => 'array',
            'created_at' => 'datetime',
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
