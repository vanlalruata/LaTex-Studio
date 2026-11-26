<?php

namespace App\Models;

use Database\Factories\ProjectFileFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property string $public_id
 * @property int $project_id
 * @property string $path
 * @property string|null $storage_key
 * @property string $mime_type
 * @property int $size_bytes
 * @property string|null $sha256_checksum
 * @property bool $is_directory
 * @property int $version
 * @property int|null $updated_by
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class ProjectFile extends Model
{
    /** @use HasFactory<ProjectFileFactory> */
    use HasFactory;

    /** @var list<string> */
    protected $fillable = [
        'public_id',
        'project_id',
        'path',
        'storage_key',
        'mime_type',
        'size_bytes',
        'sha256_checksum',
        'is_directory',
        'version',
        'updated_by',
    ];

    protected static function booted(): void
    {
        static::creating(function (self $file): void {
            if (empty($file->public_id)) {
                $file->public_id = (string) Str::uuid();
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
            'is_directory' => 'boolean',
            'size_bytes' => 'integer',
            'version' => 'integer',
        ];
    }

    /**
     * @return BelongsTo<Project, $this>
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
