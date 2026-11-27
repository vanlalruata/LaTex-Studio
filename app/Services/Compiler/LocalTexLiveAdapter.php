<?php

namespace App\Services\Compiler;

use App\DTOs\CompilationRequest;
use App\DTOs\CompilationResult;
use App\Enums\CompilationStatus;
use App\Enums\CompilerEngine;
use Illuminate\Process\Exceptions\ProcessTimedOutException;
use Illuminate\Support\Facades\Process;

class LocalTexLiveAdapter implements LatexCompilerInterface
{
    public function __construct(
        private readonly string $latexmkPath = 'latexmk',
        private readonly string $texliveBinPath = '',
        private readonly int $defaultWallTimeout = 60,
        private readonly int $defaultMaxOutputMb = 100,
    ) {}

    public function compile(CompilationRequest $request): CompilationResult
    {
        $workDir = $request->workspacePath;
        $srcDir = $workDir.DIRECTORY_SEPARATOR.'src';
        $outDir = $workDir.DIRECTORY_SEPARATOR.'out';

        if (! is_dir($outDir)) {
            mkdir($outDir, 0755, true);
        }

        $rootFile = ltrim(str_replace('\\', '/', $request->rootFile), '/');
        $engineFlag = match ($request->engine) {
            CompilerEngine::PdfLaTeX => '-pdf',
            CompilerEngine::XeLaTeX => '-xelatex',
            CompilerEngine::LuaLaTeX => '-lualatex',
        };

        $command = [
            $this->latexmkPath,
            $engineFlag,
            '-interaction=nonstopmode',
            '-halt-on-error',
            '-file-line-error',
            '-latexoption=-no-shell-escape',
            $request->enableSynctex ? '-synctex=1' : '-synctex=0',
            "-outdir={$outDir}",
        ];

        if ($request->bibliographyTool === 'none') {
            $command[] = '-bibtex-';
        }

        $command[] = $rootFile;

        $timeout = $request->wallTimeoutSeconds > 0
            ? $request->wallTimeoutSeconds
            : $this->defaultWallTimeout;

        $maxOutputMb = $request->maxOutputMb > 0
            ? $request->maxOutputMb
            : $this->defaultMaxOutputMb;

        $startMs = (int) (microtime(true) * 1000);

        $pendingProcess = Process::path($srcDir)->timeout($timeout);

        if ($this->texliveBinPath !== '') {
            $currentPath = (string) getenv('PATH');
            $pendingProcess = $pendingProcess->env([
                'PATH' => $this->texliveBinPath.PATH_SEPARATOR.$currentPath,
            ]);
        }

        try {
            $result = $pendingProcess->run($command);
            $exitCode = $result->exitCode() ?? 1;
            $errorOutput = $result->errorOutput();
        } catch (ProcessTimedOutException) {
            $durationMs = max(1, ((int) (microtime(true) * 1000)) - $startMs);

            return new CompilationResult(
                status: CompilationStatus::TimedOut,
                exitCode: 124,
                durationMs: $durationMs,
                workerImageDigest: 'local-texlive',
                logContents: $this->readLog($outDir, $rootFile),
                errorSummary: 'Local TeX Live compilation exceeded wall-clock timeout.',
            );
        }

        $durationMs = max(1, ((int) (microtime(true) * 1000)) - $startMs);

        if ($exitCode === 124) {
            return new CompilationResult(
                status: CompilationStatus::TimedOut,
                exitCode: 124,
                durationMs: $durationMs,
                workerImageDigest: 'local-texlive',
                logContents: $this->readLog($outDir, $rootFile),
                errorSummary: 'Local TeX Live compilation exceeded wall-clock timeout.',
            );
        }

        $baseName = pathinfo($rootFile, PATHINFO_FILENAME);
        $pdfPath = $outDir.DIRECTORY_SEPARATOR."{$baseName}.pdf";
        $synctexPath = $outDir.DIRECTORY_SEPARATOR."{$baseName}.synctex.gz";

        $logContents = $this->readLog($outDir, $rootFile);
        $pdfContents = is_file($pdfPath) ? (file_get_contents($pdfPath) ?: null) : null;
        $synctexContents = is_file($synctexPath) ? (file_get_contents($synctexPath) ?: null) : null;

        if ($pdfContents !== null && strlen($pdfContents) > ($maxOutputMb * 1024 * 1024)) {
            return new CompilationResult(
                status: CompilationStatus::Failed,
                exitCode: 1,
                durationMs: $durationMs,
                workerImageDigest: 'local-texlive',
                logContents: $logContents,
                errorSummary: "Generated PDF exceeds the {$maxOutputMb} MB output limit.",
            );
        }

        if ($exitCode === 0 && $pdfContents !== null && str_starts_with($pdfContents, '%PDF-')) {
            return new CompilationResult(
                status: CompilationStatus::Succeeded,
                exitCode: 0,
                durationMs: $durationMs,
                workerImageDigest: 'local-texlive',
                pdfContents: $pdfContents,
                logContents: $logContents,
                synctexContents: $synctexContents,
            );
        }

        return new CompilationResult(
            status: CompilationStatus::Failed,
            exitCode: $exitCode,
            durationMs: $durationMs,
            workerImageDigest: 'local-texlive',
            logContents: $logContents ?? ($errorOutput !== '' ? $errorOutput : null),
            errorSummary: 'LaTeX compilation failed. Inspect normalized diagnostics for details.',
        );
    }

    private function readLog(string $outDir, string $rootFile): ?string
    {
        $baseName = pathinfo($rootFile, PATHINFO_FILENAME);
        $logPath = $outDir.DIRECTORY_SEPARATOR."{$baseName}.log";

        if (is_file($logPath)) {
            return file_get_contents($logPath) ?: null;
        }

        return null;
    }
}
