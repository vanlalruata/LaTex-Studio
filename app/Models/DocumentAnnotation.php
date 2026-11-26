<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property string $public_id
 * @property int $project_id
 * @property int $project_file_id
 * @property int $user_id
 * @property string $kind
 * @property int $start_line
 * @property int $end_line
 * @property string $color
 * @property string|null $body
 * @property string $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class DocumentAnnotation extends Model
{
    use HasFactory;

    /** @var list<string> */
    protected $fillable = [
        'public_id',
        'project_id',
        'project_file_id',
        'user_id',
        'kind',
        'start_line',
        'end_line',
        'color',
        'body',
        'status',
    ];

    protected static function booted(): void
    {
        static::creating(function (self $annotation): void {
            if (empty($annotation->public_id)) {
                $annotation->public_id = (string) Str::uuid();
            }
        });
    }

    public function getRouteKeyName(): string
    {
        return 'public_id';
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
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
