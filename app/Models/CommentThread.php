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
 * @property int $project_file_id
 * @property int $created_by
 * @property int $start_line
 * @property int $end_line
 * @property string|null $quote_excerpt
 * @property string $status
 * @property int|null $resolved_by
 * @property Carbon|null $resolved_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class CommentThread extends Model
{
    /** @var list<string> */
    protected $fillable = [
        'public_id',
        'project_id',
        'project_file_id',
        'created_by',
        'start_line',
        'end_line',
        'quote_excerpt',
        'status',
        'resolved_by',
        'resolved_at',
    ];

    protected static function booted(): void
    {
        static::creating(function (self $thread): void {
            if (empty($thread->public_id)) {
                $thread->public_id = (string) Str::uuid();
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
     * @return BelongsTo<Project, $this>
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * @return BelongsTo<ProjectFile, $this>
     */
    public function file(): BelongsTo
    {
        return $this->belongsTo(ProjectFile::class, 'project_file_id');
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * @return HasMany<Comment, $this>
     */
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class, 'thread_id');
    }
}
