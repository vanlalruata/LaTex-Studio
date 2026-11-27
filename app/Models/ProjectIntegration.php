<?php

namespace App\Models;

use Carbon\CarbonInterface;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Str;
use Throwable;

/**
 * @property int $id
 * @property string $public_id
 * @property int $project_id
 * @property string $provider
 * @property string $label
 * @property string $status
 * @property array<string, mixed>|null $config
 * @property string|null $encrypted_token
 * @property string|null $webhook_secret
 * @property CarbonInterface|null $last_synced_at
 * @property int|null $connected_by
 * @property CarbonInterface|null $created_at
 * @property CarbonInterface|null $updated_at
 */
class ProjectIntegration extends Model
{
    /** @use HasFactory<Factory<self>> */
    use HasFactory;

    /** @var list<string> */
    protected $fillable = [
        'public_id',
        'project_id',
        'provider',
        'label',
        'status',
        'config',
        'encrypted_token',
        'webhook_secret',
        'last_synced_at',
        'connected_by',
    ];

    /** @var list<string> */
    protected $hidden = [
        'encrypted_token',
        'webhook_secret',
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

    public function setAccessToken(?string $token): void
    {
        $this->encrypted_token = $token !== null && $token !== ''
            ? Crypt::encryptString($token)
            : null;
    }

    public function accessToken(): ?string
    {
        if ($this->encrypted_token === null || $this->encrypted_token === '') {
            return null;
        }

        try {
            return Crypt::decryptString($this->encrypted_token);
        } catch (Throwable) {
            return null;
        }
    }

    public function setWebhookSecret(?string $secret): void
    {
        $this->webhook_secret = $secret !== null && $secret !== ''
            ? Crypt::encryptString($secret)
            : null;
    }

    public function webhookSecret(): ?string
    {
        if ($this->webhook_secret === null || $this->webhook_secret === '') {
            return null;
        }

        try {
            return Crypt::decryptString($this->webhook_secret);
        } catch (Throwable) {
            return null;
        }
    }
}
