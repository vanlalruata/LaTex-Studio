<?php

namespace App\Http\Controllers;

use App\Jobs\RenderFigureJob;
use App\Models\Figure;
use App\Models\FigureArtifact;
use App\Models\FigureRenderJob;
use App\Models\Project;
use App\Services\Storage\PrivateStorageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\Response;

class FigureRenderController extends Controller
{
    public function store(Request $request, Project $project, Figure $figure): JsonResponse
    {
        Gate::authorize('compile', $project);
        abort_if($figure->project_id !== $project->id, 404);

        $user = $request->user();
        abort_if($user === null, 401);

        $validated = $request->validate([
            'engine' => ['sometimes', 'string', Rule::in(['pdflatex', 'xelatex', 'lualatex'])],
        ]);

        $renderJob = FigureRenderJob::query()->create([
            'figure_id' => $figure->id,
            'user_id' => $user->id,
            'engine' => (string) ($validated['engine'] ?? 'pdflatex'),
            'status' => 'queued',
        ]);

        RenderFigureJob::dispatch($renderJob->id);

        return response()->json([
            'renderJob' => $this->formatRenderJob($renderJob, $project, $figure),
        ], 201);
    }

    public function show(Project $project, Figure $figure, FigureRenderJob $renderJob): JsonResponse
    {
        Gate::authorize('view', $project);
        abort_if($figure->project_id !== $project->id || $renderJob->figure_id !== $figure->id, 404);

        $renderJob->load('artifacts');
        $figure->load('lastSuccessfulRenderJob');

        return response()->json([
            'renderJob' => $this->formatRenderJob($renderJob, $project, $figure),
            'lastSuccessfulRenderId' => $figure->lastSuccessfulRenderJob?->public_id,
        ]);
    }

    public function artifact(
        Project $project,
        Figure $figure,
        FigureRenderJob $renderJob,
        string $type,
        PrivateStorageService $storage,
    ): Response {
        Gate::authorize('view', $project);
        abort_if($figure->project_id !== $project->id || $renderJob->figure_id !== $figure->id, 404);
        abort_unless(in_array($type, ['pdf', 'log', 'tex'], true), 404);

        /** @var FigureArtifact|null $artifact */
        $artifact = $renderJob->artifacts()->where('type', $type)->first();
        abort_if($artifact === null, 404);

        $contents = $storage->getContents($artifact->storage_key);
        abort_if($contents === null, 404);

        $ext = $type;

        return response($contents, 200, [
            'Content-Type' => $artifact->mime_type,
            'Content-Disposition' => "inline; filename=\"{$figure->public_id}.{$ext}\"",
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    private function formatRenderJob(FigureRenderJob $job, Project $project, Figure $figure): array
    {
        $artifactTypes = $job->artifacts->pluck('type')->values()->all();

        return [
            'public_id' => $job->public_id,
            'engine' => $job->engine,
            'status' => $job->status,
            'is_terminal' => in_array($job->status, ['succeeded', 'failed', 'timed_out'], true),
            'exit_code' => $job->exit_code,
            'duration_ms' => $job->duration_ms,
            'error_summary' => $job->error_summary,
            'diagnostics' => $job->diagnostics_json ?? [],
            'artifacts' => $artifactTypes,
            'pdf_url' => in_array('pdf', $artifactTypes, true)
                ? route('projects.figures.renders.artifact', [$project, $figure, $job, 'pdf'])
                : null,
            'log_url' => in_array('log', $artifactTypes, true)
                ? route('projects.figures.renders.artifact', [$project, $figure, $job, 'log'])
                : null,
            'finished_at' => $job->finished_at?->toIso8601String(),
        ];
    }
}
