<?php

namespace App\Http\Controllers;

use App\Models\OcrJob;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class OcrJobController extends Controller
{
    public function index(Project $project): JsonResponse
    {
        Gate::authorize('view', $project);

        $jobs = $project->ocrJobs()
            ->with('requester:id,name')
            ->latest('created_at')
            ->limit(50)
            ->get()
            ->map(fn (OcrJob $job): array => $this->payload($job))
            ->values();

        return response()->json(['jobs' => $jobs]);
    }

    public function store(Request $request, Project $project): JsonResponse
    {
        Gate::authorize('editFiles', $project);

        $validated = $request->validate([
            'source_filename' => ['required', 'string', 'max:255'],
            'mime_type' => ['nullable', 'string', 'max:64', Rule::in(['image/png', 'image/jpeg', 'image/webp', 'application/pdf'])],
            'languages' => ['nullable', 'string', 'max:64', 'regex:/^[a-z]{3}(\\+[a-z]{3})*$/'],
        ]);

        $job = $project->ocrJobs()->create([
            'user_id' => $request->user()?->id,
            'status' => 'queued',
            'source_filename' => basename($validated['source_filename']),
            'mime_type' => $validated['mime_type'] ?? null,
            'languages' => $validated['languages'] ?? 'eng',
        ]);

        $job->load('requester:id,name');

        return response()->json(['job' => $this->payload($job)], 202);
    }

    public function destroy(Project $project, OcrJob $ocrJob): JsonResponse
    {
        Gate::authorize('editFiles', $project);
        abort_unless($ocrJob->project_id === $project->id, 404);

        $ocrJob->delete();

        return response()->json(['deleted' => true]);
    }

    /**
     * @return array<string, mixed>
     */
    private function payload(OcrJob $job): array
    {
        return [
            'public_id' => $job->public_id,
            'status' => $job->status,
            'source_filename' => $job->source_filename,
            'mime_type' => $job->mime_type,
            'languages' => $job->languages,
            'extracted_latex' => $job->extracted_latex,
            'confidence' => $job->confidence !== null ? (float) $job->confidence : null,
            'error_message' => $job->error_message,
            'requested_by' => $job->requester?->name,
            'created_at' => $job->created_at?->toIso8601String(),
        ];
    }
}
