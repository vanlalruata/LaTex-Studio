<?php

namespace App\Http\Controllers;

use App\Models\Figure;
use App\Models\FigureComment;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class FigureCommentController extends Controller
{
    public function index(Project $project, Figure $figure): JsonResponse
    {
        Gate::authorize('view', $project);
        abort_if($figure->project_id !== $project->id, 404);

        $comments = $figure->comments()
            ->with('user')
            ->orderByDesc('id')
            ->get()
            ->map(fn (FigureComment $comment): array => $this->formatComment($comment))
            ->values();

        return response()->json(['comments' => $comments]);
    }

    public function store(Request $request, Project $project, Figure $figure): JsonResponse
    {
        Gate::authorize('comment', $project);
        abort_if($figure->project_id !== $project->id, 404);

        $user = $request->user();
        abort_if($user === null, 401);

        $validated = $request->validate([
            'body' => ['required', 'string', 'max:2000'],
            'object_id' => ['nullable', 'string', 'max:64'],
            'object_label' => ['nullable', 'string', 'max:120'],
        ]);

        $comment = FigureComment::query()->create([
            'figure_id' => $figure->id,
            'user_id' => $user->id,
            'object_id' => $validated['object_id'] ?? null,
            'object_label' => $validated['object_label'] ?? null,
            'body' => trim((string) $validated['body']),
        ]);

        $comment->load('user');

        return response()->json([
            'comment' => $this->formatComment($comment),
        ], 201);
    }

    public function toggleResolve(Request $request, Project $project, Figure $figure, FigureComment $comment): JsonResponse
    {
        Gate::authorize('comment', $project);
        abort_if($figure->project_id !== $project->id || $comment->figure_id !== $figure->id, 404);

        $user = $request->user();
        abort_if($user === null, 401);

        if ($comment->resolved_at === null) {
            $comment->update([
                'resolved_at' => now(),
                'resolved_by' => $user->id,
            ]);
        } else {
            $comment->update([
                'resolved_at' => null,
                'resolved_by' => null,
            ]);
        }

        $comment->load('user');

        return response()->json([
            'comment' => $this->formatComment($comment),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function formatComment(FigureComment $comment): array
    {
        return [
            'public_id' => $comment->public_id,
            'object_id' => $comment->object_id,
            'object_label' => $comment->object_label,
            'body' => $comment->body,
            'author' => $comment->user->name ?? 'Unknown',
            'is_resolved' => $comment->resolved_at !== null,
            'created_at' => $comment->created_at?->toIso8601String(),
        ];
    }
}
