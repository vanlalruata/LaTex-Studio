<?php

namespace App\Jobs;

use App\Domain\Diagnostics\DiagnosticsNormalizer;
use App\Domain\Figures\StandaloneTikzBuilder;
use App\DTOs\CompilationRequest;
use App\Enums\CompilationStatus;
use App\Enums\CompilerEngine;
use App\Models\FigureArtifact;
use App\Models\FigureRenderJob;
use App\Services\Compiler\LatexCompilerInterface;
use App\Services\Storage\PrivateStorageService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Throwable;

class RenderFigureJob implements ShouldQueue
{
    use Queueable;

    public int $tries = 1;

    public int $timeout = 60;

    public function __construct(
        public readonly int $figureRenderJobId,
    ) {}

    public function handle(
        LatexCompilerInterface $compiler,
        PrivateStorageService $storage,
        DiagnosticsNormalizer $normalizer,
        StandaloneTikzBuilder $builder,
    ): void {
        $renderJob = FigureRenderJob::query()->with(['figure.project'])->find($this->figureRenderJobId);

        if ($renderJob === null || $renderJob->figure === null) {
            return;
        }

        $figure = $renderJob->figure;

        $renderJob->update([
            'status' => 'running',
            'started_at' => now(),
        ]);

        $workDir = storage_path('app/build-workspaces/'.Str::uuid()->toString());
        $srcDir = $workDir.DIRECTORY_SEPARATOR.'src';

        try {
            File::ensureDirectoryExists($srcDir);

            $standaloneTex = $builder->build($figure);
            file_put_contents($srcDir.DIRECTORY_SEPARATOR.'figure.tex', $standaloneTex);

            $engine = CompilerEngine::tryFrom($renderJob->engine) ?? CompilerEngine::PdfLaTeX;

            $result = $compiler->compile(new CompilationRequest(
                compilationPublicId: $renderJob->public_id,
                workspacePath: $workDir,
                engine: $engine,
                rootFile: 'figure.tex',
                bibliographyTool: 'none',
                enableSynctex: false,
                wallTimeoutSeconds: 20,
                memoryMb: 512,
                cpus: 1.0,
                pidsLimit: 64,
                maxOutputMb: 25,
            ));

            $artifactKeyPrefix = "figures-{$renderJob->public_id}";

            $texStored = $storage->putBuildArtifact($artifactKeyPrefix, 'figure.tex', $standaloneTex);
            FigureArtifact::query()->create([
                'figure_render_job_id' => $renderJob->id,
                'type' => 'tex',
                'storage_key' => $texStored['storage_key'],
                'mime_type' => 'application/x-tex',
                'size_bytes' => $texStored['size_bytes'],
                'sha256_checksum' => $texStored['sha256_checksum'],
            ]);

            if ($result->logContents !== null) {
                $logStored = $storage->putBuildArtifact($artifactKeyPrefix, 'figure.log', $result->logContents);
                FigureArtifact::query()->create([
                    'figure_render_job_id' => $renderJob->id,
                    'type' => 'log',
                    'storage_key' => $logStored['storage_key'],
                    'mime_type' => 'text/plain',
                    'size_bytes' => $logStored['size_bytes'],
                    'sha256_checksum' => $logStored['sha256_checksum'],
                ]);
            }

            if ($result->pdfContents !== null) {
                $pdfStored = $storage->putBuildArtifact($artifactKeyPrefix, 'figure.pdf', $result->pdfContents);
                FigureArtifact::query()->create([
                    'figure_render_job_id' => $renderJob->id,
                    'type' => 'pdf',
                    'storage_key' => $pdfStored['storage_key'],
                    'mime_type' => 'application/pdf',
                    'size_bytes' => $pdfStored['size_bytes'],
                    'sha256_checksum' => $pdfStored['sha256_checksum'],
                ]);
            }

            $diagnostics = [];
            if ($result->logContents !== null) {
                foreach ($normalizer->normalize($result->logContents) as $item) {
                    $diagnostics[] = [
                        'severity' => $item['severity']->value,
                        'file_path' => $item['file_path'] ?? 'figure.tex',
                        'line' => $item['line'],
                        'message' => $item['message'],
                        'raw_excerpt' => $item['raw_excerpt'],
                    ];
                }
            }

            $statusString = match ($result->status) {
                CompilationStatus::Succeeded => 'succeeded',
                CompilationStatus::TimedOut => 'timed_out',
                default => 'failed',
            };

            $renderJob->update([
                'status' => $statusString,
                'exit_code' => $result->exitCode,
                'duration_ms' => $result->durationMs,
                'error_summary' => $result->errorSummary,
                'diagnostics_json' => $diagnostics,
                'finished_at' => now(),
            ]);

            if ($result->status === CompilationStatus::Succeeded) {
                $figure->update([
                    'last_successful_render_job_id' => $renderJob->id,
                ]);
            }
        } catch (Throwable $exception) {
            $renderJob->update([
                'status' => 'failed',
                'error_summary' => $exception->getMessage(),
                'finished_at' => now(),
            ]);
        } finally {
            File::deleteDirectory($workDir);
        }
    }
}
