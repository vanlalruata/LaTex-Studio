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
 * @property int $project_id
 * @property int $user_id
 * @property string $title
 * @property string $provider
 * @property string $model
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class AiConversation extends Model
{
    /** @var list<string> */
    protected $fillable = [
        'public_id',
        'project_id',
        'user_id',
        'title',
        'provider',
        'model',
    ];

    protected static function booted(): void
    {
        static::creating(function (self $conversation): void {
            if (empty($conversation->public_id)) {
                $conversation->public_id = (string) Str::uuid();
            }
        });
    }

    /**
     * @return BelongsTo<Project, $this>
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return HasMany<AiAction, $this>
     */
    public function actions(): HasMany
    {
        return $this->hasMany(AiAction::class, 'conversation_id');
    }
}
