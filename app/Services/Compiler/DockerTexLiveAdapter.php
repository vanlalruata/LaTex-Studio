<?php

namespace App\Services\Compiler;

use App\DTOs\CompilationRequest;
use App\DTOs\CompilationResult;
use App\Enums\CompilationStatus;
use Illuminate\Support\Facades\Process;

class DockerTexLiveAdapter implements LatexCompilerInterface
{
    public function __construct(
        private readonly string $workerImage = 'latexstudio/texlive-worker:latest',
    ) {}

    public function compile(CompilationRequest $request): CompilationResult
    {
        $workDir = $request->workspacePath;
        $outDir = $workDir.DIRECTORY_SEPARATOR.'out';

        if (! is_dir($outDir)) {
            mkdir($outDir, 0755, true);
        }

        $manifest = [
            'protocol_version' => '1.0',
            'compilation_id' => $request->compilationPublicId,
            'engine' => $request->engine->value,
            'root_file' => $request->rootFile,
            'bibliography_tool' => $request->bibliographyTool,
            'enable_synctex' => $request->enableSynctex,
            'limits' => [
                'wall_timeout_seconds' => $request->wallTimeoutSeconds,
                'memory_mb' => $request->memoryMb,
                'cpus' => $request->cpus,
                'pids_limit' => $request->pidsLimit,
                'max_output_mb' => $request->maxOutputMb,
            ],
        ];

        file_put_contents(
            $workDir.DIRECTORY_SEPARATOR.'build-request.v1.json',
            (string) json_encode($manifest, JSON_PRETTY_PRINT | JSON_THROW_ON_ERROR)
        );

        $startMs = (int) (microtime(true) * 1000);

        $result = Process::timeout($request->wallTimeoutSeconds + 5)->run([
            'docker',
            'run',
            '--rm',
            '--network=none',
            '--read-only',
            '--cap-drop=ALL',
            '--security-opt=no-new-privileges',
            '--tmpfs', '/tmp:rw,noexec,nosuid,size=128m',
            '--memory', "{$request->memoryMb}m",
            '--memory-swap', "{$request->memoryMb}m",
            '--cpus', (string) $request->cpus,
            '--pids-limit', (string) $request->pidsLimit,
            '-v', "{$workDir}:/work:rw",
            $this->workerImage,
        ]);

        $durationMs = max(1, ((int) (microtime(true) * 1000)) - $startMs);

        $resultJsonPath = $outDir.DIRECTORY_SEPARATOR.'build-result.v1.json';
        $baseName = pathinfo($request->rootFile, PATHINFO_FILENAME);

        $pdfPath = $outDir.DIRECTORY_SEPARATOR."{$baseName}.pdf";
        $logPath = $outDir.DIRECTORY_SEPARATOR."{$baseName}.log";
        $synctexPath = $outDir.DIRECTORY_SEPARATOR."{$baseName}.synctex.gz";

        $pdfContents = is_file($pdfPath) ? (file_get_contents($pdfPath) ?: null) : null;
        $logContents = is_file($logPath) ? (file_get_contents($logPath) ?: null) : null;
        $synctexContents = is_file($synctexPath) ? (file_get_contents($synctexPath) ?: null) : null;

        if ($logContents === null && is_file($outDir.DIRECTORY_SEPARATOR.'worker-stdout.log')) {
            $logContents = file_get_contents($outDir.DIRECTORY_SEPARATOR.'worker-stdout.log') ?: null;
        }

        if ($result->exitCode() === 124) {
            return new CompilationResult(
                status: CompilationStatus::TimedOut,
                exitCode: 124,
                durationMs: $durationMs,
                logContents: $logContents,
                errorSummary: 'Compilation exceeded wall-clock timeout.',
            );
        }

        if (is_file($resultJsonPath)) {
            /** @var array<string, mixed>|null $parsed */
            $parsed = json_decode((string) file_get_contents($resultJsonPath), true);
            if (is_array($parsed) && ($parsed['status'] ?? '') === 'succeeded' && $pdfContents !== null) {
                return new CompilationResult(
                    status: CompilationStatus::Succeeded,
                    exitCode: 0,
                    durationMs: (int) ($parsed['metrics']['duration_ms'] ?? $durationMs),
                    pdfContents: $pdfContents,
                    logContents: $logContents,
                    synctexContents: $synctexContents,
                );
            }
        }

        return new CompilationResult(
            status: CompilationStatus::Failed,
            exitCode: $result->exitCode() ?? 1,
            durationMs: $durationMs,
            logContents: $logContents ?? $result->errorOutput(),
            errorSummary: 'LaTeX compilation failed. Inspect normalized diagnostics for details.',
        );
    }
}
