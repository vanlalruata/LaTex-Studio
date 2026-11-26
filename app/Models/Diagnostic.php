<?php

namespace App\Models;

use App\Enums\DiagnosticSeverity;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $compilation_id
 * @property DiagnosticSeverity $severity
 * @property string|null $file_path
 * @property int|null $line
 * @property int|null $column
 * @property string|null $code
 * @property string $message
 * @property string|null $raw_excerpt
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class Diagnostic extends Model
{
    /** @var list<string> */
    protected $fillable = [
        'compilation_id',
        'severity',
        'file_path',
        'line',
        'column',
        'code',
        'message',
        'raw_excerpt',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'severity' => DiagnosticSeverity::class,
        ];
    }

    /**
     * @return BelongsTo<Compilation, $this>
     */
    public function compilation(): BelongsTo
    {
        return $this->belongsTo(Compilation::class);
    }
}
