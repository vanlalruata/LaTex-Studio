<?php

namespace App\Models;

use Database\Factories\OrganizationFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property string $public_id
 * @property string $name
 * @property string $slug
 * @property int $storage_quota_bytes
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Organization extends Model
{
    /** @use HasFactory<OrganizationFactory> */
    use HasFactory;

    /** @var list<string> */
    protected $fillable = [
        'public_id',
        'name',
        'slug',
        'storage_quota_bytes',
    ];

    protected static function booted(): void
    {
        static::creating(function (self $organization): void {
            if (empty($organization->public_id)) {
                $organization->public_id = (string) Str::uuid();
            }
        });
    }

    /**
     * @return BelongsToMany<User, $this>
     */
    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'organization_members')
            ->withPivot('role')
            ->withTimestamps();
    }

    /**
     * @return HasMany<Project, $this>
     */
    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }
}
