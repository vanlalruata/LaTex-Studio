<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditEvent;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AuditController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();

        $events = AuditEvent::query()
            ->with(['user:id,name,email', 'project:id,title'])
            ->when($search !== '', static function ($query) use ($search): void {
                $query->where(static function ($query) use ($search): void {
                    $query->where('action', 'like', '%'.$search.'%')
                        ->orWhereHas('user', static fn ($userQuery) => $userQuery
                            ->where('name', 'like', '%'.$search.'%')
                            ->orWhere('email', 'like', '%'.$search.'%'));
                });
            })
            ->latest('created_at')
            ->paginate(50)
            ->withQueryString();

        return Inertia::render('Admin/Audit', [
            'events' => $events,
            'filters' => ['search' => $search],
        ]);
    }
}
