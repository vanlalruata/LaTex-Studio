<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string|null $organization
 * @property string|null $role
 * @property string $category
 * @property string $subject
 * @property string $message
 * @property string $status
 * @property string|null $source_page
 * @property int|null $handled_by
 * @property Carbon|null $handled_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
class ContactEnquiry extends Model
{
    /** @var list<string> */
    protected $fillable = [
        'name',
        'email',
        'organization',
        'role',
        'category',
        'subject',
        'message',
        'status',
        'source_page',
        'handled_by',
        'handled_at',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'handled_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function handler(): BelongsTo
    {
        return $this->belongsTo(User::class, 'handled_by');
    }
}
