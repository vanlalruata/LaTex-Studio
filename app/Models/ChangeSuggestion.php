<?php

namespace App\Models;

use App\Enums\SuggestionStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property string $public_id
 * @property int $project_id
 * @property int $project_file_id
 * @property int $proposed_by
 * @property string $title
 * @property string|null $original_excerpt
 * @property string $proposed_content
 * @property int $start_line
 * @property int $end_line
 * @property string $source
 * @property SuggestionStatus $status
 * @property int|null $reviewed_by
 * @property Carbon|null $reviewed_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class ChangeSuggestion extends Model
{
    /** @var list<string> */
    protected $fillable = [
        'public_id',
        'project_id',
        'project_file_id',
        'proposed_by',
        'title',
        'original_excerpt',
        'proposed_content',
        'start_line',
        'end_line',
        'source',
        'status',
        'reviewed_by',
        'reviewed_at',
    ];

    protected static function booted(): void
    {
        static::creating(function (self $suggestion): void {
            if (empty($suggestion->public_id)) {
                $suggestion->public_id = (string) Str::uuid();
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
            'status' => SuggestionStatus::class,
            'reviewed_at' => 'datetime',
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
    public function proposer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'proposed_by');
    }
}
