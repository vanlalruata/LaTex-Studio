<?php

namespace App\Models;

use App\Enums\BuildProfile;
use App\Enums\CompilationStatus;
use App\Enums\CompilerEngine;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property string $public_id
 * @property int $project_id
 * @property int|null $revision_id
 * @property int|null $triggered_by
 * @property string $idempotency_key
 * @property CompilerEngine $compiler_engine
 * @property BuildProfile $build_profile
 * @property string|null $worker_image_digest
 * @property CompilationStatus $status
 * @property int|null $exit_code
 * @property int|null $duration_ms
 * @property int|null $peak_memory_kb
 * @property string|null $error_summary
 * @property Carbon|null $started_at
 * @property Carbon|null $finished_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Compilation extends Model
{
    /** @var list<string> */
    protected $fillable = [
        'public_id',
        'project_id',
        'revision_id',
        'triggered_by',
        'idempotency_key',
        'compiler_engine',
        'build_profile',
        'worker_image_digest',
        'status',
        'exit_code',
        'duration_ms',
        'peak_memory_kb',
        'error_summary',
        'started_at',
        'finished_at',
    ];

    protected static function booted(): void
    {
        static::creating(function (self $compilation): void {
            if (empty($compilation->public_id)) {
                $compilation->public_id = (string) Str::uuid();
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
            'compiler_engine' => CompilerEngine::class,
            'build_profile' => BuildProfile::class,
            'status' => CompilationStatus::class,
            'started_at' => 'datetime',
            'finished_at' => 'datetime',
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
     * @return BelongsTo<ProjectRevision, $this>
     */
    public function revision(): BelongsTo
    {
        return $this->belongsTo(ProjectRevision::class, 'revision_id');
    }

    /**
     * @return HasMany<BuildArtifact, $this>
     */
    public function artifacts(): HasMany
    {
        return $this->hasMany(BuildArtifact::class);
    }

    /**
     * @return HasMany<Diagnostic, $this>
     */
    public function diagnostics(): HasMany
    {
        return $this->hasMany(Diagnostic::class);
    }
}
