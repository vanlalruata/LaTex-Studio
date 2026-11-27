<?php

use App\Models\Project;
use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('project.{projectPublicId}.compilations', function (User $user, string $projectPublicId): bool {
    $project = Project::query()
        ->where('public_id', $projectPublicId)
        ->first();

    return $project !== null && $project->roleFor($user) !== null;
});

Broadcast::channel('project.{projectPublicId}.presence', function (User $user, string $projectPublicId): bool {
    $project = Project::query()
        ->where('public_id', $projectPublicId)
        ->first();

    return $project !== null && $project->roleFor($user) !== null;
});

Broadcast::channel('presence.project.{projectPublicId}', function (User $user, string $projectPublicId): array|false {
    $project = Project::query()
        ->where('public_id', $projectPublicId)
        ->first();

    if ($project === null || $project->roleFor($user) === null) {
        return false;
    }

    return [
        'id' => $user->id,
        'name' => $user->name,
    ];
});
