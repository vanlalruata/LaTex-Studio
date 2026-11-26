<?php

namespace App\Models;

use App\Enums\CompilerEngine;
use Database\Factories\TemplateFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;

/**
 * @property int $id
 * @property string $public_id
 * @property int|null $organization_id
 * @property string $slug
 * @property string $title
 * @property string $category
 * @property string|null $description
 * @property CompilerEngine $compiler_engine
 * @property array<int, array{path: string, content: string}> $files_manifest
 * @property bool $is_public
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Template extends Model
{
    /** @use HasFactory<TemplateFactory> */
    use HasFactory;

    /** @var list<string> */
    protected $fillable = [
        'public_id',
        'organization_id',
        'slug',
        'title',
        'category',
        'description',
        'compiler_engine',
        'files_manifest',
        'is_public',
    ];

    protected static function booted(): void
    {
        static::creating(function (self $template): void {
            if (empty($template->public_id)) {
                $template->public_id = (string) Str::uuid();
            }
        });
    }

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'compiler_engine' => CompilerEngine::class,
            'files_manifest' => 'array',
            'is_public' => 'boolean',
        ];
    }

    /**
     * @return BelongsTo<Organization, $this>
     */
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }
}
