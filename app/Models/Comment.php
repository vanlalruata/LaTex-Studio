<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $thread_id
 * @property int $user_id
 * @property string $body
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Comment extends Model
{
    /** @var list<string> */
    protected $fillable = [
        'thread_id',
        'user_id',
        'body',
    ];

    /**
     * @return BelongsTo<CommentThread, $this>
     */
    public function thread(): BelongsTo
    {
        return $this->belongsTo(CommentThread::class, 'thread_id');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
