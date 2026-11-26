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
 * @property int|null $added_by
 * @property string $provider
 * @property string $key
 * @property string $title
 * @property array<int, string>|null $authors
 * @property int|null $year
 * @property string|null $venue
 * @property string|null $doi
 * @property string|null $url
 * @property string|null $raw_bibtex
 * @property bool $is_imported
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class BibliographySource extends Model
{
    use HasFactory;

    /** @var list<string> */
    protected $fillable = [
        'public_id',
        'project_id',
        'added_by',
        'provider',
        'key',
        'title',
        'authors',
        'year',
        'venue',
        'doi',
        'url',
        'raw_bibtex',
        'is_imported',
    ];

    protected static function booted(): void
    {
        static::creating(function (self $source): void {
            if (empty($source->public_id)) {
                $source->public_id = (string) Str::uuid();
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
            'authors' => 'array',
            'year' => 'integer',
            'is_imported' => 'boolean',
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
    public function addedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'added_by');
    }
}
