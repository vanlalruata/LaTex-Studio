<?php

namespace App\Http\Controllers;

use App\Models\ConversionJob;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class ConversionJobController extends Controller
{
    public function index(Project $project): JsonResponse
    {
        Gate::authorize('view', $project);

        $jobs = $project->conversionJobs()
            ->with('requester:id,name')
            ->latest('created_at')
            ->limit(50)
            ->get()
            ->map(fn (ConversionJob $job): array => $this->payload($job))
            ->values();

        return response()->json(['jobs' => $jobs]);
    }

    public function store(Request $request, Project $project): JsonResponse
    {
        Gate::authorize('editFiles', $project);

        $validated = $request->validate([
            'direction' => ['required', Rule::in(['docx_to_latex', 'latex_to_docx', 'markdown_to_latex'])],
            'input_filename' => ['required', 'string', 'max:255'],
            'engine' => ['nullable', Rule::in(['pandoc'])],
        ]);

        $job = $project->conversionJobs()->create([
            'user_id' => $request->user()?->id,
            'status' => 'queued',
            'direction' => $validated['direction'],
            'engine' => $validated['engine'] ?? 'pandoc',
            'input_filename' => basename($validated['input_filename']),
        ]);

        $job->load('requester:id,name');

        return response()->json(['job' => $this->payload($job)], 202);
    }

    public function destroy(Project $project, ConversionJob $conversionJob): JsonResponse
    {
        Gate::authorize('editFiles', $project);
        abort_unless($conversionJob->project_id === $project->id, 404);

        $conversionJob->delete();

        return response()->json(['deleted' => true]);
    }

    /**
     * @return array<string, mixed>
     */
    private function payload(ConversionJob $job): array
    {
        return [
            'public_id' => $job->public_id,
            'status' => $job->status,
            'direction' => $job->direction,
            'engine' => $job->engine,
            'input_filename' => $job->input_filename,
            'output_filename' => $job->output_filename,
            'log_excerpt' => $job->log_excerpt,
            'requested_by' => $job->requester?->name,
            'created_at' => $job->created_at?->toIso8601String(),
        ];
    }
}
