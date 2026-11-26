<?php

namespace App\Policies;

use App\Models\Project;
use App\Models\User;

class ProjectPolicy
{
    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Project $project): bool
    {
        return $project->roleFor($user) !== null;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Project $project): bool
    {
        $role = $project->roleFor($user);

        return $role !== null && $role->canManage();
    }

    public function delete(User $user, Project $project): bool
    {
        $role = $project->roleFor($user);

        return $role !== null && $role->canManage();
    }

    public function editFiles(User $user, Project $project): bool
    {
        $role = $project->roleFor($user);

        return $role !== null && $role->canEdit();
    }

    public function compile(User $user, Project $project): bool
    {
        $role = $project->roleFor($user);

        return $role !== null && $role->canCompile();
    }

    public function export(User $user, Project $project): bool
    {
        $role = $project->roleFor($user);

        return $role !== null && $role->canExport();
    }

    public function manageMembers(User $user, Project $project): bool
    {
        $role = $project->roleFor($user);

        return $role !== null && $role->canManage();
    }

    public function comment(User $user, Project $project): bool
    {
        $role = $project->roleFor($user);

        return $role !== null && $role->canComment();
    }

    public function proposeSuggestion(User $user, Project $project): bool
    {
        $role = $project->roleFor($user);

        return $role !== null && $role->canExport();
    }
}
