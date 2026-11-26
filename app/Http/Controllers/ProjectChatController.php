<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProjectChatMessageRequest;
use App\Models\Project;
use App\Models\ProjectChatMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Gate;

class ProjectChatController extends Controller
{
    public function index(Request $request, Project $project): JsonResponse
    {
        Gate::authorize('view', $project);

        $user = $request->user();
        if ($user !== null) {
            $this->touchPresence($project, $user->id, $user->name);
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
            'onlineUsers' => $this->onlineUsers($project),
        ]);
    }

    public function store(StoreProjectChatMessageRequest $request, Project $project): JsonResponse
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
        $this->touchPresence($project, $user->id, $user->name);

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

    private function touchPresence(Project $project, int $userId, string $userName): void
    {
        $key = "project.presence.{$project->id}";
        /** @var array<int, array{id: int, name: string, last_seen: int}> $presence */
        $presence = Cache::get($key, []);
        $now = time();

        $presence[$userId] = [
            'id' => $userId,
            'name' => $userName,
            'last_seen' => $now,
        ];

        $presence = array_filter(
            $presence,
            static fn (array $entry): bool => ($now - $entry['last_seen']) <= 60
        );

        Cache::put($key, $presence, now()->addMinutes(2));
    }

    /**
     * @return list<array{id: int, name: string}>
     */
    private function onlineUsers(Project $project): array
    {
        $key = "project.presence.{$project->id}";
        /** @var array<int, array{id: int, name: string, last_seen: int}> $presence */
        $presence = Cache::get($key, []);
        $now = time();

        return array_values(array_map(
            static fn (array $entry): array => [
                'id' => $entry['id'],
                'name' => $entry['name'],
            ],
            array_filter(
                $presence,
                static fn (array $entry): bool => ($now - $entry['last_seen']) <= 60
            )
        ));
    }
}
