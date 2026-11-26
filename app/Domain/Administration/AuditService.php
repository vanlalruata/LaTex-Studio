<?php

namespace App\Domain\Administration;

use App\Models\AuditEvent;
use App\Models\Project;
use App\Models\User;
use Illuminate\Database\Eloquent\Model;

class AuditService
{
    /**
     * @param  array<string, mixed>  $metadata
     */
    public function record(
        string $action,
        ?User $user = null,
        ?Project $project = null,
        ?Model $subject = null,
        array $metadata = [],
        ?string $ipAddress = null,
    ): AuditEvent {
        return AuditEvent::query()->create([
            'user_id' => $user?->id,
            'project_id' => $project?->id,
            'action' => $action,
            'subject_type' => $subject !== null ? $subject::class : null,
            'subject_id' => $subject?->getKey(),
            'metadata' => $metadata !== [] ? $metadata : null,
            'ip_address' => $ipAddress,
        ]);
    }
}
