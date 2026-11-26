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
 * @property string $provider
 * @property string $label
 * @property string $status
 * @property array<string, mixed>|null $config
 * @property Carbon|null $last_synced_at
 * @property int|null $connected_by
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class ProjectIntegration extends Model
{
    use HasFactory;

    /** @var list<string> */
    protected $fillable = [
        'public_id',
        'project_id',
        'provider',
        'label',
        'status',
        'config',
        'last_synced_at',
        'connected_by',
    ];

    protected static function booted(): void
    {
        static::creating(function (self $integration): void {
            if (empty($integration->public_id)) {
                $integration->public_id = (string) Str::uuid();
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
            'config' => 'array',
            'last_synced_at' => 'datetime',
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
    public function connector(): BelongsTo
    {
        return $this->belongsTo(User::class, 'connected_by');
    }
}
