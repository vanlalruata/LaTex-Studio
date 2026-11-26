<?php

namespace App\Http\Controllers;

use App\Models\DocumentAnnotation;
use App\Models\Project;
use App\Models\ProjectFile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class AnnotationController extends Controller
{
    public function index(Request $request, Project $project): JsonResponse
    {
        Gate::authorize('view', $project);

        $query = $project->annotations()
            ->with(['file:id,public_id,path', 'user:id,name'])
            ->latest('created_at');

        $filePublicId = $request->query('file_id');
        if (is_string($filePublicId) && $filePublicId !== '') {
            $fileIds = $project->files()
                ->where('public_id', $filePublicId)
                ->pluck('id');

            $query->whereIn('project_file_id', $fileIds);
        }

        $annotations = $query->limit(200)->get()->map(
            fn (DocumentAnnotation $annotation): array => $this->payload($annotation)
        )->values();

        return response()->json(['annotations' => $annotations]);
    }

    public function store(Request $request, Project $project): JsonResponse
    {
        Gate::authorize('comment', $project);

        $user = $request->user();
        abort_if($user === null, 401);

        $validated = $request->validate([
            'file_id' => ['required', 'string'],
            'kind' => ['nullable', Rule::in(['note', 'highlight', 'task'])],
            'start_line' => ['required', 'integer', 'min:1', 'max:1000000'],
            'end_line' => ['nullable', 'integer', 'min:1', 'max:1000000', 'gte:start_line'],
            'color' => ['nullable', Rule::in(['yellow', 'green', 'blue', 'rose', 'violet'])],
            'body' => ['nullable', 'string', 'max:2000'],
        ]);

        $file = ProjectFile::query()
            ->where('project_id', $project->id)
            ->where('public_id', $validated['file_id'])
            ->firstOrFail();

        $annotation = $project->annotations()->create([
            'project_file_id' => $file->id,
            'user_id' => $user->id,
            'kind' => $validated['kind'] ?? 'note',
            'start_line' => $validated['start_line'],
            'end_line' => $validated['end_line'] ?? $validated['start_line'],
            'color' => $validated['color'] ?? 'yellow',
            'body' => $validated['body'] ?? null,
            'status' => 'open',
        ]);

        $annotation->load(['file:id,public_id,path', 'user:id,name']);

        return response()->json(['annotation' => $this->payload($annotation)], 201);
    }

    public function update(Request $request, Project $project, DocumentAnnotation $annotation): JsonResponse
    {
        Gate::authorize('comment', $project);
        abort_unless($annotation->project_id === $project->id, 404);

        $user = $request->user();
        $isAuthor = $user !== null && $annotation->user_id === $user->id;
        $canEdit = Gate::allows('editFiles', $project);
        abort_unless($isAuthor || $canEdit, 403);

        $validated = $request->validate([
            'body' => ['nullable', 'string', 'max:2000'],
            'status' => ['sometimes', Rule::in(['open', 'resolved'])],
            'color' => ['sometimes', Rule::in(['yellow', 'green', 'blue', 'rose', 'violet'])],
        ]);

        $annotation->update($validated);
        $annotation->load(['file:id,public_id,path', 'user:id,name']);

        return response()->json(['annotation' => $this->payload($annotation)]);
    }

    public function destroy(Request $request, Project $project, DocumentAnnotation $annotation): JsonResponse
    {
        Gate::authorize('comment', $project);
        abort_unless($annotation->project_id === $project->id, 404);

        $user = $request->user();
        $isAuthor = $user !== null && $annotation->user_id === $user->id;
        abort_unless($isAuthor || Gate::allows('editFiles', $project), 403);

        $annotation->delete();

        return response()->json(['deleted' => true]);
    }

    /**
     * @return array<string, mixed>
     */
    private function payload(DocumentAnnotation $annotation): array
    {
        return [
            'public_id' => $annotation->public_id,
            'file_id' => $annotation->file?->public_id,
            'file_path' => $annotation->file?->path,
            'kind' => $annotation->kind,
            'start_line' => $annotation->start_line,
            'end_line' => $annotation->end_line,
            'color' => $annotation->color,
            'body' => $annotation->body,
            'status' => $annotation->status,
            'author_name' => $annotation->user?->name ?? 'Collaborator',
            'created_at' => $annotation->created_at?->toIso8601String(),
        ];
    }
}
