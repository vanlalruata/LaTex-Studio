<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $figure_render_job_id
 * @property string $type
 * @property string $storage_key
 * @property string $mime_type
 * @property int $size_bytes
 * @property string|null $sha256_checksum
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class FigureArtifact extends Model
{
    /** @var list<string> */
    protected $fillable = [
        'figure_render_job_id',
        'type',
        'storage_key',
        'mime_type',
        'size_bytes',
        'sha256_checksum',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'size_bytes' => 'integer',
        ];
    }

    /**
     * @return BelongsTo<FigureRenderJob, $this>
     */
    public function renderJob(): BelongsTo
    {
        return $this->belongsTo(FigureRenderJob::class, 'figure_render_job_id');
    }
}
