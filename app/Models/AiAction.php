<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property string $public_id
 * @property int $conversation_id
 * @property int $project_id
 * @property int $user_id
 * @property int|null $project_file_id
 * @property string $kind
 * @property string $prompt
 * @property string $response_text
 * @property array<string, mixed>|null $proposed_patch
 * @property string $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class AiAction extends Model
{
    /** @var list<string> */
    protected $fillable = [
        'public_id',
        'conversation_id',
        'project_id',
        'user_id',
        'project_file_id',
        'kind',
        'prompt',
        'response_text',
        'proposed_patch',
        'status',
    ];

    protected static function booted(): void
    {
        static::creating(function (self $action): void {
            if (empty($action->public_id)) {
                $action->public_id = (string) Str::uuid();
            }
        });
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'proposed_patch' => 'array',
        ];
    }

    /**
     * @return BelongsTo<AiConversation, $this>
     */
    public function conversation(): BelongsTo
    {
        return $this->belongsTo(AiConversation::class, 'conversation_id');
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
}
