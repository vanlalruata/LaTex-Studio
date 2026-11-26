<?php

namespace App\Http\Controllers;

use App\Domain\Collaboration\ProjectPresenceService;
use App\Http\Requests\StoreProjectChatMessageRequest;
use App\Models\Project;
use App\Models\ProjectChatMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ProjectChatController extends Controller
{
    public function index(Request $request, Project $project, ProjectPresenceService $presence): JsonResponse
    {
        Gate::authorize('view', $project);

        $user = $request->user();
        if ($user !== null) {
            $presence->touch($project, $user);
        }

        $messages = ProjectChatMessage::query()
            ->where('project_id', $project->id)
            ->with(['user:id,name', 'parent:id,public_id'])
            ->orderBy('created_at')
            ->limit(150)
            ->get()
            ->map(static fn (ProjectChatMessage $msg): array => [
                'public_id' => $msg->public_id,
                'body' => $msg->body,
                'parent_public_id' => $msg->parent?->public_id,
                'user' => [
                    'id' => $msg->user?->id,
                    'name' => $msg->user->name ?? 'Collaborator',
                ],
                'created_at' => $msg->created_at?->toIso8601String(),
            ])
            ->values()
            ->all();

        return response()->json([
            'messages' => $messages,
            'onlineUsers' => $presence->online($project),
        ]);
    }

    public function store(StoreProjectChatMessageRequest $request, Project $project, ProjectPresenceService $presence): JsonResponse
    {
        Gate::authorize('view', $project);

        $user = $request->user();
        abort_if($user === null, 401);

        $parentId = null;
        $parentPublicId = $request->validated('parent_public_id');
        if (is_string($parentPublicId) && $parentPublicId !== '') {
            $parent = ProjectChatMessage::query()
                ->where('project_id', $project->id)
                ->where('public_id', $parentPublicId)
                ->first();
            abort_if($parent === null, 422, 'Invalid parent message.');
            $parentId = $parent->id;
        }

        $message = ProjectChatMessage::query()->create([
            'project_id' => $project->id,
            'user_id' => $user->id,
            'parent_id' => $parentId,
            'body' => trim((string) $request->validated('body')),
        ]);

        $message->load(['user:id,name', 'parent:id,public_id']);
        $presence->touch($project, $user);

        return response()->json([
            'message' => [
                'public_id' => $message->public_id,
                'body' => $message->body,
                'parent_public_id' => $message->parent?->public_id,
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                ],
                'created_at' => $message->created_at?->toIso8601String(),
            ],
        ], 201);
    }
}
