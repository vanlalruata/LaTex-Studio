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
 * @property string $name
 * @property int $schema_version
 * @property array<string, mixed> $document_json
 * @property string $generated_latex
 * @property int|null $source_file_id
 * @property int|null $source_revision_id
 * @property string $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class TableDesign extends Model
{
    /** @var list<string> */
    protected $fillable = [
        'public_id',
        'project_id',
        'user_id',
        'name',
        'schema_version',
        'document_json',
        'generated_latex',
        'source_file_id',
        'source_revision_id',
        'status',
    ];

    protected static function booted(): void
    {
        static::creating(function (self $design): void {
            if (empty($design->public_id)) {
                $design->public_id = (string) Str::uuid();
            }
        });
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'schema_version' => 'integer',
            'document_json' => 'array',
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
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<ProjectFile, $this>
     */
    public function sourceFile(): BelongsTo
    {
        return $this->belongsTo(ProjectFile::class, 'source_file_id');
    }

    /**
     * @return BelongsTo<ProjectRevision, $this>
     */
    public function sourceRevision(): BelongsTo
    {
        return $this->belongsTo(ProjectRevision::class, 'source_revision_id');
    }

    /**
     * @return HasMany<TableDesignVersion, $this>
     */
    public function versions(): HasMany
    {
        return $this->hasMany(TableDesignVersion::class);
    }
}
