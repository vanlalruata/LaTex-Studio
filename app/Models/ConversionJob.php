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
 * @property int|null $user_id
 * @property string $status
 * @property string $direction
 * @property string $engine
 * @property string $input_filename
 * @property string|null $output_filename
 * @property string|null $log_excerpt
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class ConversionJob extends Model
{
    use HasFactory;

    /** @var list<string> */
    protected $fillable = [
        'public_id',
        'project_id',
        'user_id',
        'status',
        'direction',
        'engine',
        'input_filename',
        'output_filename',
        'log_excerpt',
    ];

    protected static function booted(): void
    {
        static::creating(function (self $job): void {
            if (empty($job->public_id)) {
                $job->public_id = (string) Str::uuid();
            }
        });
    }

    public function getRouteKeyName(): string
    {
        return 'public_id';
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
    public function requester(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
