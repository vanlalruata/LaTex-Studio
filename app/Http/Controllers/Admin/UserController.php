<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditEvent;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();

        $users = User::query()
            ->with('roles:id,name')
            ->withCount(['ownedProjects', 'memberProjects'])
            ->when($search !== '', static function ($query) use ($search): void {
                $query->where(static function ($query) use ($search): void {
                    $query->where('name', 'like', '%'.$search.'%')
                        ->orWhere('email', 'like', '%'.$search.'%');
                });
            })
            ->orderBy('name')
            ->orderBy('id')
            ->paginate(25)
            ->withQueryString()
            ->through(static fn (User $user): array => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_admin' => $user->roles->contains('name', 'admin'),
                'owned_projects_count' => $user->owned_projects_count,
                'member_projects_count' => $user->member_projects_count,
                'created_at' => $user->created_at?->toIso8601String(),
            ]);

        return Inertia::render('Admin/Users', [
            'users' => $users,
            'filters' => ['search' => $search],
            'adminCount' => User::query()->whereHas('roles', static fn ($query) => $query->where('name', 'admin'))->count(),
        ]);
    }

    public function updateAdminRole(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'is_admin' => ['required', 'boolean'],
        ]);

        $adminRole = Role::query()->firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $isAdmin = $user->hasRole($adminRole);
        $shouldBeAdmin = (bool) $validated['is_admin'];

        if ($isAdmin === $shouldBeAdmin) {
            return back();
        }

        if (! $shouldBeAdmin) {
            if ($request->user()?->is($user)) {
                return back()->withErrors(['is_admin' => 'You cannot remove your own administrator role.']);
            }

            if ($adminRole->users()->count() <= 1) {
                return back()->withErrors(['is_admin' => 'At least one administrator must remain.']);
            }

            $user->removeRole($adminRole);
        } else {
            $user->assignRole($adminRole);
        }

        AuditEvent::query()->create([
            'user_id' => $request->user()?->id,
            'action' => $shouldBeAdmin ? 'admin.user.promoted' : 'admin.user.demoted',
            'subject_type' => User::class,
            'subject_id' => $user->id,
            'metadata' => ['email' => $user->email],
            'ip_address' => $request->ip(),
        ]);

        return back()->with('success', $shouldBeAdmin ? 'Administrator role granted.' : 'Administrator role removed.');
    }
}
