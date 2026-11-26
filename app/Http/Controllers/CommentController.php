<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\CommentThread;
use App\Models\Project;
use App\Models\ProjectFile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class CommentController extends Controller
{
    public function index(Project $project): JsonResponse
    {
        Gate::authorize('view', $project);

        $threads = CommentThread::query()
            ->where('project_id', $project->id)
            ->with(['file:id,public_id,path', 'author:id,name', 'comments.user:id,name'])
            ->latest('updated_at')
            ->get()
            ->map(fn (CommentThread $thread): array => [
                'public_id' => $thread->public_id,
                'file_path' => $thread->file->path ?? '',
                'start_line' => $thread->start_line,
                'end_line' => $thread->end_line,
                'quote_excerpt' => $thread->quote_excerpt,
                'status' => $thread->status,
                'author_name' => $thread->author->name ?? 'User',
                'created_at' => $thread->created_at?->toIso8601String(),
                'comments' => $thread->comments->map(fn (Comment $comment): array => [
                    'id' => $comment->id,
                    'author_name' => $comment->user->name ?? 'User',
                    'body' => $comment->body,
                    'created_at' => $comment->created_at?->toIso8601String(),
                ])->values(),
            ]);

        return response()->json(['threads' => $threads]);
    }

    public function store(Request $request, Project $project): JsonResponse
    {
        Gate::authorize('comment', $project);

        $user = $request->user();
        abort_if($user === null, 401);

        $validated = $request->validate([
            'file_id' => ['required', 'string'],
            'start_line' => ['required', 'integer', 'min:1'],
            'end_line' => ['required', 'integer', 'min:1'],
            'quote_excerpt' => ['nullable', 'string', 'max:1000'],
            'body' => ['required', 'string', 'max:5000'],
        ]);

        $file = ProjectFile::query()
            ->where('project_id', $project->id)
            ->where('public_id', $validated['file_id'])
            ->firstOrFail();

        $thread = CommentThread::query()->create([
            'project_id' => $project->id,
            'project_file_id' => $file->id,
            'created_by' => $user->id,
            'start_line' => $validated['start_line'],
            'end_line' => max($validated['start_line'], $validated['end_line']),
            'quote_excerpt' => $validated['quote_excerpt'] ?? null,
            'status' => 'open',
        ]);

        Comment::query()->create([
            'thread_id' => $thread->id,
            'user_id' => $user->id,
            'body' => $validated['body'],
        ]);

        return response()->json([
            'public_id' => $thread->public_id,
            'status' => $thread->status,
        ], 201);
    }

    public function reply(Request $request, Project $project, CommentThread $thread): JsonResponse
    {
        Gate::authorize('comment', $project);
        abort_unless($thread->project_id === $project->id, 404);

        $user = $request->user();
        abort_if($user === null, 401);

        $validated = $request->validate([
            'body' => ['required', 'string', 'max:5000'],
        ]);

        $comment = Comment::query()->create([
            'thread_id' => $thread->id,
            'user_id' => $user->id,
            'body' => $validated['body'],
        ]);

        return response()->json([
            'id' => $comment->id,
            'author_name' => $user->name,
            'body' => $comment->body,
            'created_at' => $comment->created_at?->toIso8601String(),
        ], 201);
    }

    public function resolve(Request $request, Project $project, CommentThread $thread): JsonResponse
    {
        Gate::authorize('comment', $project);
        abort_unless($thread->project_id === $project->id, 404);

        $newStatus = $thread->status === 'resolved' ? 'open' : 'resolved';

        $thread->update([
            'status' => $newStatus,
            'resolved_by' => $newStatus === 'resolved' ? $request->user()?->id : null,
            'resolved_at' => $newStatus === 'resolved' ? now() : null,
        ]);

        return response()->json(['status' => $thread->status]);
    }
}
