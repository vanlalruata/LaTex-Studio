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
        private readonly bool $autoInstallPackages = false,
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
        $timeout = $request->wallTimeoutSeconds > 0
            ? $request->wallTimeoutSeconds
            : $this->defaultWallTimeout;
        $maxOutputMb = $request->maxOutputMb > 0
            ? $request->maxOutputMb
            : $this->defaultMaxOutputMb;

        $env = [];
        if ($this->texliveBinPath !== '') {
            $env['PATH'] = $this->texliveBinPath.PATH_SEPARATOR.(string) getenv('PATH');
        }

        $startMs = (int) (microtime(true) * 1000);

        [$exitCode, $errorOutput, $timedOut] = $this->runCompilePass($request, $rootFile, $srcDir, $outDir, $timeout, $env);

        $autoInstallRounds = 0;
        while (! $timedOut && $exitCode !== 0 && $this->autoInstallPackages && $autoInstallRounds < 3) {
            $initialLog = $this->readLog($outDir, $rootFile) ?? $errorOutput;
            if (! $this->installMissingPackagesFromLog($initialLog, $env)) {
                break;
            }
            $autoInstallRounds++;
            [$exitCode, $errorOutput, $timedOut] = $this->runCompilePass($request, $rootFile, $srcDir, $outDir, $timeout, $env);
        }

        $durationMs = max(1, ((int) (microtime(true) * 1000)) - $startMs);

        if ($timedOut || $exitCode === 124) {
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

    /**
     * @param  array<string, string>  $env
     * @return array{0: int, 1: string, 2: bool}
     */
    private function runCompilePass(
        CompilationRequest $request,
        string $rootFile,
        string $srcDir,
        string $outDir,
        int $timeout,
        array $env,
    ): array {
        if ($this->hasLatexmk()) {
            $command = $this->buildLatexmkCommand($request, $rootFile, $outDir);

            return $this->runCommand($command, $srcDir, $timeout, $env);
        }

        return $this->runDirectEngine($request, $rootFile, $srcDir, $outDir, $timeout, $env);
    }

    /**
     * @param  array<string, string>  $env
     */
    private function installMissingPackagesFromLog(string $logContents, array $env): bool
    {
        if (preg_match_all('/! LaTeX Error: File [`\']([A-Za-z0-9_.-]+)\' not found\./', $logContents, $matches) < 1) {
            return false;
        }

        $missingFiles = array_slice(array_values(array_unique($matches[1])), 0, 5);
        $tlmgr = $this->resolveBinary('tlmgr');
        $installedAny = false;

        foreach ($missingFiles as $missingFile) {
            $package = $this->resolveTlmgrPackage($tlmgr, $missingFile, $env);
            if ($package === null) {
                continue;
            }

            $install = Process::timeout(120)->env($env)->run([$tlmgr, 'install', $package]);
            if ($install->successful()) {
                $installedAny = true;
            }
        }

        return $installedAny;
    }

    /**
     * @param  array<string, string>  $env
     */
    private function resolveTlmgrPackage(string $tlmgr, string $missingFile, array $env): ?string
    {
        $search = Process::timeout(45)->env($env)->run([$tlmgr, 'search', '--global', '--file', '/'.$missingFile]);

        if ($search->successful() && preg_match_all('/^([A-Za-z0-9_.-]+):\s*$/m', $search->output(), $pkgMatches) >= 1) {
            foreach ($pkgMatches[1] as $candidate) {
                if ($candidate !== 'tlmgr') {
                    return $candidate;
                }
            }
        }

        $fallback = pathinfo($missingFile, PATHINFO_FILENAME);

        return preg_match('/^[A-Za-z0-9_.-]+$/', $fallback) === 1 ? $fallback : null;
    }

    /**
     * @return list<string>
     */
    private function buildLatexmkCommand(CompilationRequest $request, string $rootFile, string $outDir): array
    {
        $engineFlag = match ($request->engine) {
            CompilerEngine::PdfLaTeX => '-pdf',
            CompilerEngine::XeLaTeX => '-xelatex',
            CompilerEngine::LuaLaTeX => '-lualatex',
        };

        $command = [
            $this->resolveBinary($this->latexmkPath),
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

        return $command;
    }

    /**
     * Fallback multi-pass compilation when latexmk is not installed on the host.
     *
     * @param  array<string, string>  $env
     * @return array{0: int, 1: string, 2: bool}
     */
    private function runDirectEngine(
        CompilationRequest $request,
        string $rootFile,
        string $srcDir,
        string $outDir,
        int $timeout,
        array $env,
    ): array {
        $binary = $this->resolveBinary($request->engine->value);
        $command = [
            $binary,
            '-interaction=nonstopmode',
            '-halt-on-error',
            '-file-line-error',
            '-no-shell-escape',
            $request->enableSynctex ? '-synctex=1' : '-synctex=0',
            "-output-directory={$outDir}",
            $rootFile,
        ];

        [$exitCode, $errorOutput, $timedOut] = $this->runCommand($command, $srcDir, $timeout, $env);
        if ($timedOut || $exitCode !== 0) {
            return [$exitCode, $errorOutput, $timedOut];
        }

        $baseName = pathinfo($rootFile, PATHINFO_FILENAME);
        $bcfPath = $outDir.DIRECTORY_SEPARATOR."{$baseName}.bcf";
        $auxPath = $outDir.DIRECTORY_SEPARATOR."{$baseName}.aux";

        if ($request->bibliographyTool !== 'none') {
            if (is_file($bcfPath)) {
                $this->runCommand([$this->resolveBinary('biber'), "--output-directory={$outDir}", $baseName], $srcDir, $timeout, $env);
            } elseif (is_file($auxPath) && str_contains((string) file_get_contents($auxPath), '\\bibdata')) {
                $this->runCommand([$this->resolveBinary('bibtex'), $auxPath], $srcDir, $timeout, $env);
            }
        }

        // Second pass for cross-references and bibliography
        return $this->runCommand($command, $srcDir, $timeout, $env);
    }

    /**
     * @param  list<string>  $command
     * @param  array<string, string>  $env
     * @return array{0: int, 1: string, 2: bool}
     */
    private function runCommand(array $command, string $cwd, int $timeout, array $env): array
    {
        $pending = Process::path($cwd)->timeout($timeout);
        if ($env !== []) {
            $pending = $pending->env($env);
        }

        try {
            $result = $pending->run($command);

            return [$result->exitCode() ?? 1, $result->errorOutput(), false];
        } catch (ProcessTimedOutException) {
            return [124, '', true];
        }
    }

    private function hasLatexmk(): bool
    {
        if (str_contains($this->latexmkPath, DIRECTORY_SEPARATOR)) {
            return is_executable($this->latexmkPath);
        }

        if ($this->texliveBinPath !== '' && is_executable($this->texliveBinPath.DIRECTORY_SEPARATOR.$this->latexmkPath)) {
            return true;
        }

        $pathDirs = explode(PATH_SEPARATOR, (string) getenv('PATH'));
        foreach ($pathDirs as $dir) {
            if ($dir !== '' && is_executable(rtrim($dir, DIRECTORY_SEPARATOR).DIRECTORY_SEPARATOR.$this->latexmkPath)) {
                return true;
            }
        }

        return false;
    }

    private function resolveBinary(string $name): string
    {
        if (str_contains($name, DIRECTORY_SEPARATOR)) {
            return $name;
        }

        if ($this->texliveBinPath !== '') {
            $candidate = rtrim($this->texliveBinPath, DIRECTORY_SEPARATOR).DIRECTORY_SEPARATOR.$name;
            if (is_executable($candidate)) {
                return $candidate;
            }
        }

        return $name;
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
