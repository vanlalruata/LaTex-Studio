<?php

namespace App\Policies;

use App\Models\Compilation;
use App\Models\User;

class CompilationPolicy
{
    public function view(User $user, Compilation $compilation): bool
    {
        return $compilation->project->roleFor($user) !== null;
    }

    public function downloadArtifact(User $user, Compilation $compilation): bool
    {
        return $compilation->project->roleFor($user) !== null;
    }
}
