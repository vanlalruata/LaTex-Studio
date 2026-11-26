<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property string $public_id
 * @property int $project_id
 * @property int $user_id
 * @property string $name
 * @property int $schema_version
 * @property string $mode
 * @property array<string, mixed> $scene_json
 * @property string $tikz_source
 * @property list<string>|null $required_packages_json
 * @property list<string>|null $required_libraries_json
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Figure extends Model
{
    /** @var list<string> */
    protected $fillable = [
        'public_id',
        'project_id',
        'user_id',
        'name',
        'schema_version',
        'mode',
        'scene_json',
        'tikz_source',
        'required_packages_json',
        'required_libraries_json',
    ];

    protected static function booted(): void
    {
        static::creating(function (self $figure): void {
            if (empty($figure->public_id)) {
                $figure->public_id = (string) Str::uuid();
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
            'schema_version' => 'integer',
            'scene_json' => 'array',
            'required_packages_json' => 'array',
            'required_libraries_json' => 'array',
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
}
