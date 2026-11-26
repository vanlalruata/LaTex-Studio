<?php

namespace App\Http\Controllers;

use App\Domain\Revisions\CreateRevisionAction;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ProjectRevisionController extends Controller
{
    public function index(Project $project): JsonResponse
    {
        Gate::authorize('view', $project);

        $revisions = $project->revisions()
            ->with('creator:id,name')
            ->latest('created_at')
            ->limit(50)
            ->get()
            ->map(fn ($revision): array => [
                'public_id' => $revision->public_id,
                'revision_hash' => $revision->revision_hash,
                'message' => $revision->message,
                'creator_name' => $revision->creator->name ?? 'System',
                'created_at' => $revision->created_at?->toIso8601String(),
            ]);

        return response()->json(['revisions' => $revisions]);
    }

    public function store(Request $request, Project $project, CreateRevisionAction $action): JsonResponse
    {
        Gate::authorize('editFiles', $project);

        $validated = $request->validate([
            'message' => ['nullable', 'string', 'max:255'],
        ]);

        $revision = $action->execute(
            project: $project,
            actor: $request->user(),
            message: $validated['message'] ?? 'Manual snapshot',
        );

        return response()->json([
            'public_id' => $revision->public_id,
            'revision_hash' => $revision->revision_hash,
            'message' => $revision->message,
            'created_at' => $revision->created_at?->toIso8601String(),
        ], 201);
    }
}
