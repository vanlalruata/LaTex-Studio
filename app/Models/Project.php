<?php

namespace App\Models;

use App\Enums\BuildProfile;
use App\Enums\CompilerEngine;
use App\Enums\ProjectRole;
use Database\Factories\ProjectFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property string $public_id
 * @property int $owner_id
 * @property int|null $organization_id
 * @property string $title
 * @property string|null $description
 * @property string $root_file_path
 * @property CompilerEngine $compiler_engine
 * @property BuildProfile $build_profile
 * @property string $bibliography_tool
 * @property bool $auto_compile
 * @property int|null $last_successful_compilation_id
 * @property int $storage_bytes
 * @property Carbon|null $archived_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Project extends Model
{
    /** @use HasFactory<ProjectFactory> */
    use HasFactory;

    /** @var list<string> */
    protected $fillable = [
        'public_id',
        'owner_id',
        'organization_id',
        'title',
        'description',
        'root_file_path',
        'compiler_engine',
        'build_profile',
        'bibliography_tool',
        'auto_compile',
        'last_successful_compilation_id',
        'storage_bytes',
        'archived_at',
    ];

    protected static function booted(): void
    {
        static::creating(function (self $project): void {
            if (empty($project->public_id)) {
                $project->public_id = (string) Str::uuid();
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
            'auto_compile' => 'boolean',
            'archived_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    /**
     * @return BelongsTo<Organization, $this>
     */
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    /**
     * @return BelongsToMany<User, $this>
     */
    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'project_members')
            ->withPivot(['role', 'invited_by'])
            ->withTimestamps();
    }

    /**
     * @return HasMany<ProjectMember, $this>
     */
    public function memberships(): HasMany
    {
        return $this->hasMany(ProjectMember::class);
    }

    /**
     * @return HasMany<ProjectFile, $this>
     */
    public function files(): HasMany
    {
        return $this->hasMany(ProjectFile::class);
    }

    /**
     * @return HasMany<ProjectRevision, $this>
     */
    public function revisions(): HasMany
    {
        return $this->hasMany(ProjectRevision::class);
    }

    /**
     * @return HasMany<Compilation, $this>
     */
    public function compilations(): HasMany
    {
        return $this->hasMany(Compilation::class);
    }

    /**
     * @return HasMany<TableDesign, $this>
     */
    public function tableDesigns(): HasMany
    {
        return $this->hasMany(TableDesign::class);
    }

    /**
     * @return BelongsTo<Compilation, $this>
     */
    public function lastSuccessfulCompilation(): BelongsTo
    {
        return $this->belongsTo(Compilation::class, 'last_successful_compilation_id');
    }

    public function roleFor(User $user): ?ProjectRole
    {
        if ($this->owner_id === $user->id) {
            return ProjectRole::Owner;
        }

        /** @var ProjectMember|null $membership */
        $membership = $this->memberships()
            ->where('user_id', $user->id)
            ->first();

        return $membership?->role;
    }
}
