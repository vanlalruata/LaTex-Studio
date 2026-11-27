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
 * @property int|null $project_id
 * @property int $user_id
 * @property string $title
 * @property int $schema_version
 * @property string $content_mode
 * @property string $math_mode
 * @property string $environment
 * @property array<string, mixed>|null $structured_document_json
 * @property string $latex_source
 * @property list<string>|null $package_requirements_json
 * @property string $source_hash
 * @property string|null $last_successful_pdf_key
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Equation extends Model
{
    /** @var list<string> */
    protected $fillable = [
        'public_id',
        'project_id',
        'user_id',
        'title',
        'schema_version',
        'content_mode',
        'math_mode',
        'environment',
        'structured_document_json',
        'latex_source',
        'package_requirements_json',
        'source_hash',
        'last_successful_pdf_key',
    ];

    protected static function booted(): void
    {
        static::creating(function (self $equation): void {
            if (empty($equation->public_id)) {
                $equation->public_id = (string) Str::uuid();
            }
            if (empty($equation->source_hash)) {
                $equation->source_hash = hash('sha256', (string) $equation->latex_source);
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
            'structured_document_json' => 'array',
            'package_requirements_json' => 'array',
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
     * @return HasMany<EquationRevision, $this>
     */
    public function revisions(): HasMany
    {
        return $this->hasMany(EquationRevision::class);
    }

    /**
     * @return HasMany<EquationComment, $this>
     */
    public function comments(): HasMany
    {
        return $this->hasMany(EquationComment::class);
    }
}
