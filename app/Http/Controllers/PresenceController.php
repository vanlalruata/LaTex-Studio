<?php

namespace App\Http\Controllers;

use App\Domain\Collaboration\ProjectPresenceService;
use App\Models\Project;
use App\Models\ProjectFile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class PresenceController extends Controller
{
    public function index(Project $project, ProjectPresenceService $presence): JsonResponse
    {
        Gate::authorize('view', $project);

        return response()->json(['users' => $presence->online($project)]);
    }

    public function store(Request $request, Project $project, ProjectPresenceService $presence): JsonResponse
    {
        Gate::authorize('view', $project);

        $user = $request->user();
        abort_if($user === null, 401);

        $validated = $request->validate([
            'file_id' => ['nullable', 'string'],
            'line' => ['nullable', 'integer', 'min:1', 'max:1000000'],
            'column' => ['nullable', 'integer', 'min:1', 'max:1000000'],
        ]);

        $cursor = null;
        if (! empty($validated['file_id'])) {
            $file = ProjectFile::query()
                ->where('project_id', $project->id)
                ->where('public_id', $validated['file_id'])
                ->first();

            abort_if($file === null, 422, 'Cursor file does not belong to this project.');

            $cursor = [
                'file_id' => $file->public_id,
                'file_path' => $file->path,
                'line' => $validated['line'] ?? 1,
                'column' => $validated['column'] ?? 1,
            ];
        }

        $presence->touch($project, $user, $cursor);

        return response()->json([
            'users' => $presence->online($project),
            'refreshed_at' => now()->toIso8601String(),
        ]);
    }
}
