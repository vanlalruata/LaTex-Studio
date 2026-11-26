<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $table_design_id
 * @property int $version_number
 * @property array<string, mixed> $document_json
 * @property string $generated_latex
 * @property string $checksum
 * @property int $created_by
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class TableDesignVersion extends Model
{
    /** @var list<string> */
    protected $fillable = [
        'table_design_id',
        'version_number',
        'document_json',
        'generated_latex',
        'checksum',
        'created_by',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'version_number' => 'integer',
            'document_json' => 'array',
        ];
    }

    /**
     * @return BelongsTo<TableDesign, $this>
     */
    public function tableDesign(): BelongsTo
    {
        return $this->belongsTo(TableDesign::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
