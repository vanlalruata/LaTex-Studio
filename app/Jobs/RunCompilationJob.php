<?php

namespace App\Jobs;

use App\Domain\Diagnostics\DiagnosticsNormalizer;
use App\Domain\Files\PathValidator;
use App\DTOs\CompilationRequest;
use App\Enums\ArtifactType;
use App\Enums\CompilationStatus;
use App\Models\BuildArtifact;
use App\Models\Compilation;
use App\Models\Diagnostic;
use App\Services\Compiler\LatexCompilerInterface;
use App\Services\Storage\PrivateStorageService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Throwable;

class RunCompilationJob implements ShouldQueue
{
    use Queueable;

    public int $tries = 1;

    public int $timeout = 120;

    public function __construct(
        public readonly int $compilationId,
    ) {}

    public function handle(
        LatexCompilerInterface $compiler,
        PrivateStorageService $storage,
        PathValidator $pathValidator,
        DiagnosticsNormalizer $normalizer,
    ): void {
        $compilation = Compilation::query()->with(['project', 'revision'])->find($this->compilationId);

        if ($compilation === null || $compilation->status === CompilationStatus::Cancelled) {
            return;
        }

        $project = $compilation->project;
        $revision = $compilation->revision;

        if ($revision === null) {
            $compilation->update([
                'status' => CompilationStatus::Failed,
                'error_summary' => 'Missing revision snapshot for compilation.',
                'finished_at' => now(),
            ]);

            return;
        }

        $compilation->update([
            'status' => CompilationStatus::Starting,
            'started_at' => now(),
        ]);

        $workDir = storage_path('app/build-workspaces/'.Str::uuid()->toString());
        $srcDir = $workDir.DIRECTORY_SEPARATOR.'src';

        try {
            File::ensureDirectoryExists($srcDir);

            /** @var array<string, array{sha256: string|null, storage_key: string|null, size_bytes: int}> $manifest */
            $manifest = $revision->manifest;

            foreach ($manifest as $rawPath => $meta) {
                $safePath = $pathValidator->normalize($rawPath);
                $storageKey = $meta['storage_key'] ?? null;
                if ($storageKey === null) {
                    continue;
                }

                $contents = $storage->getContents($storageKey);
                if ($contents === null) {
                    continue;
                }

                $targetFile = $srcDir.DIRECTORY_SEPARATOR.str_replace('/', DIRECTORY_SEPARATOR, $safePath);
                File::ensureDirectoryExists(dirname($targetFile));
                file_put_contents($targetFile, $contents);
            }

            $compilation->update(['status' => CompilationStatus::Compiling]);

            $result = $compiler->compile(new CompilationRequest(
                compilationPublicId: $compilation->public_id,
                engine: $compilation->compiler_engine,
                rootFile: $pathValidator->normalize($project->root_file_path),
                bibliographyTool: $project->bibliography_tool,
                enableSynctex: true,
                workspacePath: $workDir,
            ));

            $compilation->update(['status' => CompilationStatus::Validating]);

            if ($result->logContents !== null) {
                $this->storeArtifact($storage, $compilation, ArtifactType::Log, 'build.log', $result->logContents);

                foreach ($normalizer->normalize($result->logContents) as $diag) {
                    Diagnostic::query()->create([
                        'compilation_id' => $compilation->id,
                        'severity' => $diag['severity'],
                        'file_path' => $diag['file_path'],
                        'line' => $diag['line'],
                        'column' => $diag['column'],
                        'code' => $diag['code'],
                        'message' => $diag['message'],
                        'raw_excerpt' => $diag['raw_excerpt'],
                    ]);
                }
            }

            $pdfContents = $result->pdfContents;
            $hasValidPdf = $result->status === CompilationStatus::Succeeded
                && $pdfContents !== null
                && str_starts_with($pdfContents, '%PDF-');

            if ($hasValidPdf) {
                $this->storeArtifact($storage, $compilation, ArtifactType::Pdf, 'output.pdf', $pdfContents);

                if ($result->synctexContents !== null) {
                    $this->storeArtifact($storage, $compilation, ArtifactType::Synctex, 'output.synctex.gz', $result->synctexContents);
                }

                $compilation->update([
                    'status' => CompilationStatus::Published,
                    'exit_code' => $result->exitCode,
                    'duration_ms' => $result->durationMs,
                    'peak_memory_kb' => $result->peakMemoryKb,
                    'worker_image_digest' => $result->workerImageDigest,
                    'finished_at' => now(),
                ]);

                // Only update last_successful_compilation_id on validated PDF success
                $project->update([
                    'last_successful_compilation_id' => $compilation->id,
                ]);
            } else {
                $finalStatus = $result->status === CompilationStatus::TimedOut
                    ? CompilationStatus::TimedOut
                    : CompilationStatus::Failed;

                $compilation->update([
                    'status' => $finalStatus,
                    'exit_code' => $result->exitCode,
                    'duration_ms' => $result->durationMs,
                    'peak_memory_kb' => $result->peakMemoryKb,
                    'worker_image_digest' => $result->workerImageDigest,
                    'error_summary' => $result->errorSummary ?? 'Compilation did not produce a valid PDF.',
                    'finished_at' => now(),
                ]);
            }
        } catch (Throwable $exception) {
            $compilation->update([
                'status' => CompilationStatus::Failed,
                'error_summary' => $exception->getMessage(),
                'finished_at' => now(),
            ]);
        } finally {
            if (is_dir($workDir)) {
                File::deleteDirectory($workDir);
            }
        }
    }

    private function storeArtifact(
        PrivateStorageService $storage,
        Compilation $compilation,
        ArtifactType $type,
        string $filename,
        string $contents,
    ): void {
        $stored = $storage->putBuildArtifact($compilation->public_id, $filename, $contents);

        BuildArtifact::query()->updateOrCreate(
            [
                'compilation_id' => $compilation->id,
                'type' => $type,
            ],
            [
                'storage_key' => $stored['storage_key'],
                'sha256_checksum' => $stored['sha256_checksum'],
                'size_bytes' => $stored['size_bytes'],
            ]
        );
    }
}
