<?php

namespace App\Http\Controllers;

use App\Domain\Administration\AuditService;
use App\Domain\Files\SaveProjectFileAction;
use App\Domain\Revisions\CreateRevisionAction;
use App\Enums\SuggestionStatus;
use App\Models\ChangeSuggestion;
use App\Models\Project;
use App\Models\ProjectFile;
use App\Services\Storage\PrivateStorageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class SuggestionController extends Controller
{
    public function index(Project $project): JsonResponse
    {
        Gate::authorize('view', $project);

        $suggestions = ChangeSuggestion::query()
            ->where('project_id', $project->id)
            ->with(['file:id,public_id,path', 'proposer:id,name'])
            ->latest('created_at')
            ->get()
            ->map(fn (ChangeSuggestion $s): array => [
                'public_id' => $s->public_id,
                'file_id' => $s->file->public_id ?? '',
                'file_path' => $s->file->path ?? '',
                'title' => $s->title,
                'original_excerpt' => $s->original_excerpt,
                'proposed_content' => $s->proposed_content,
                'start_line' => $s->start_line,
                'end_line' => $s->end_line,
                'source' => $s->source,
                'status' => $s->status->value,
                'proposer_name' => $s->proposer->name ?? 'User',
                'created_at' => $s->created_at?->toIso8601String(),
            ]);

        return response()->json(['suggestions' => $suggestions]);
    }

    public function store(Request $request, Project $project): JsonResponse
    {
        Gate::authorize('proposeSuggestion', $project);

        $user = $request->user();
        abort_if($user === null, 401);

        $validated = $request->validate([
            'file_id' => ['required', 'string'],
            'title' => ['required', 'string', 'max:255'],
            'original_excerpt' => ['nullable', 'string'],
            'proposed_content' => ['required', 'string'],
            'start_line' => ['sometimes', 'integer', 'min:1'],
            'end_line' => ['sometimes', 'integer', 'min:1'],
        ]);

        $file = ProjectFile::query()
            ->where('project_id', $project->id)
            ->where('public_id', $validated['file_id'])
            ->firstOrFail();

        $suggestion = ChangeSuggestion::query()->create([
            'project_id' => $project->id,
            'project_file_id' => $file->id,
            'proposed_by' => $user->id,
            'title' => $validated['title'],
            'original_excerpt' => $validated['original_excerpt'] ?? null,
            'proposed_content' => $validated['proposed_content'],
            'start_line' => $validated['start_line'] ?? 1,
            'end_line' => $validated['end_line'] ?? 1,
            'source' => 'human',
            'status' => SuggestionStatus::Pending,
        ]);

        return response()->json([
            'public_id' => $suggestion->public_id,
            'status' => $suggestion->status->value,
        ], 201);
    }

    public function accept(
        Request $request,
        Project $project,
        ChangeSuggestion $suggestion,
        PrivateStorageService $storage,
        SaveProjectFileAction $saveFile,
        CreateRevisionAction $createRevision,
        AuditService $audit,
    ): JsonResponse {
        Gate::authorize('editFiles', $project);
        abort_unless($suggestion->project_id === $project->id, 404);
        abort_if($suggestion->status !== SuggestionStatus::Pending, 422, 'Suggestion has already been reviewed.');

        $user = $request->user();
        abort_if($user === null, 401);

        $file = $suggestion->file;
        abort_if($file === null, 404);

        DB::transaction(function () use ($project, $file, $suggestion, $user, $storage, $saveFile, $createRevision, $audit): void {
            $currentContent = $file->storage_key !== null
                ? ($storage->getContents($file->storage_key) ?? '')
                : '';

            $newContent = $suggestion->proposed_content;

            if ($suggestion->original_excerpt !== null && $suggestion->original_excerpt !== '' && str_contains($currentContent, $suggestion->original_excerpt)) {
                $newContent = str_replace($suggestion->original_excerpt, $suggestion->proposed_content, $currentContent);
            }

            $saveFile->execute($project, $file, $newContent, $user);
            $createRevision->execute($project, $user, "Accepted suggestion: {$suggestion->title}");

            $suggestion->update([
                'status' => SuggestionStatus::Accepted,
                'reviewed_by' => $user->id,
                'reviewed_at' => now(),
            ]);

            $audit->record('suggestion.accepted', $user, $project, $suggestion);
        });

        return response()->json(['status' => SuggestionStatus::Accepted->value]);
    }

    public function reject(Request $request, Project $project, ChangeSuggestion $suggestion, AuditService $audit): JsonResponse
    {
        Gate::authorize('editFiles', $project);
        abort_unless($suggestion->project_id === $project->id, 404);
        abort_if($suggestion->status !== SuggestionStatus::Pending, 422, 'Suggestion has already been reviewed.');

        $suggestion->update([
            'status' => SuggestionStatus::Rejected,
            'reviewed_by' => $request->user()?->id,
            'reviewed_at' => now(),
        ]);

        $audit->record('suggestion.rejected', $request->user(), $project, $suggestion);

        return response()->json(['status' => SuggestionStatus::Rejected->value]);
    }
}
