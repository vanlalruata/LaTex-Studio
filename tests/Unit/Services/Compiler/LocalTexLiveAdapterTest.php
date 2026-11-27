<?php

use App\DTOs\CompilationRequest;
use App\Enums\CompilationStatus;
use App\Enums\CompilerEngine;
use App\Services\Compiler\LocalTexLiveAdapter;
use Illuminate\Process\PendingProcess;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Process;
use Tests\TestCase;

uses(TestCase::class);

beforeEach(function (): void {
    $this->workDir = storage_path('framework/testing/local-compiler-'.uniqid());
    File::ensureDirectoryExists($this->workDir.DIRECTORY_SEPARATOR.'src');
    File::ensureDirectoryExists($this->workDir.DIRECTORY_SEPARATOR.'out');
});

afterEach(function (): void {
    if (is_dir($this->workDir)) {
        File::deleteDirectory($this->workDir);
    }
});

test('local adapter compiles pdfLaTeX successfully and collects artifacts', function (): void {
    $outDir = $this->workDir.DIRECTORY_SEPARATOR.'out';

    Process::fake(function (PendingProcess $process) use ($outDir) {
        file_put_contents($outDir.DIRECTORY_SEPARATOR.'main.pdf', "%PDF-1.4\n%local-pdf\n");
        file_put_contents($outDir.DIRECTORY_SEPARATOR.'main.log', "This is pdfTeX\nOutput written on main.pdf.\n");
        file_put_contents($outDir.DIRECTORY_SEPARATOR.'main.synctex.gz', 'synctex-bytes');

        return Process::result(output: 'Latexmk: All targets (main.pdf) are up-to-date', exitCode: 0);
    });

    $fakeLatexmk = $this->workDir.DIRECTORY_SEPARATOR.'latexmk';
    file_put_contents($fakeLatexmk, "#!/bin/sh\nexit 0\n");
    chmod($fakeLatexmk, 0755);

    $adapter = new LocalTexLiveAdapter(latexmkPath: $fakeLatexmk);
    $result = $adapter->compile(new CompilationRequest(
        compilationPublicId: 'comp-123',
        engine: CompilerEngine::PdfLaTeX,
        rootFile: 'main.tex',
        bibliographyTool: 'biber',
        enableSynctex: true,
        workspacePath: $this->workDir,
    ));

    expect($result->status)->toBe(CompilationStatus::Succeeded)
        ->and($result->exitCode)->toBe(0)
        ->and($result->workerImageDigest)->toBe('local-texlive')
        ->and($result->pdfContents)->toBe("%PDF-1.4\n%local-pdf\n")
        ->and($result->logContents)->toContain('Output written on main.pdf.')
        ->and($result->synctexContents)->toBe('synctex-bytes');

    Process::assertRan(function (PendingProcess $process): bool {
        return is_array($process->command)
            && str_ends_with($process->command[0], 'latexmk')
            && in_array('-pdf', $process->command, true)
            && in_array('-synctex=1', $process->command, true)
            && in_array('-latexoption=-no-shell-escape', $process->command, true)
            && in_array('main.tex', $process->command, true);
    });
});

test('local adapter falls back to direct engine execution when latexmk is unavailable', function (): void {
    $outDir = $this->workDir.DIRECTORY_SEPARATOR.'out';

    Process::fake(function (PendingProcess $process) use ($outDir) {
        file_put_contents($outDir.DIRECTORY_SEPARATOR.'main.pdf', "%PDF-1.4\n%direct-pdflatex\n");
        file_put_contents($outDir.DIRECTORY_SEPARATOR.'main.log', "This is pdfTeX\n");

        return Process::result(output: 'Output written on main.pdf', exitCode: 0);
    });

    $adapter = new LocalTexLiveAdapter(latexmkPath: '/nonexistent/latexmk');
    $result = $adapter->compile(new CompilationRequest(
        compilationPublicId: 'comp-direct',
        engine: CompilerEngine::PdfLaTeX,
        rootFile: 'main.tex',
        bibliographyTool: 'none',
        enableSynctex: true,
        workspacePath: $this->workDir,
    ));

    expect($result->status)->toBe(CompilationStatus::Succeeded)
        ->and($result->pdfContents)->toBe("%PDF-1.4\n%direct-pdflatex\n");

    Process::assertRan(function (PendingProcess $process): bool {
        return is_array($process->command)
            && str_ends_with($process->command[0], 'pdflatex')
            && in_array('-no-shell-escape', $process->command, true)
            && in_array('-synctex=1', $process->command, true);
    });
});

test('local adapter passes xelatex and lualatex flags and disables bibtex when requested', function (): void {
    Process::fake([
        '*' => Process::result(output: '', exitCode: 1),
    ]);

    $fakeLatexmk = $this->workDir.DIRECTORY_SEPARATOR.'latexmk';
    file_put_contents($fakeLatexmk, "#!/bin/sh\nexit 0\n");
    chmod($fakeLatexmk, 0755);

    $adapter = new LocalTexLiveAdapter(latexmkPath: $fakeLatexmk);
    $adapter->compile(new CompilationRequest(
        compilationPublicId: 'comp-xe',
        engine: CompilerEngine::XeLaTeX,
        rootFile: 'paper.tex',
        bibliographyTool: 'none',
        enableSynctex: false,
        workspacePath: $this->workDir,
    ));

    Process::assertRan(function (PendingProcess $process): bool {
        return is_array($process->command)
            && in_array('-xelatex', $process->command, true)
            && in_array('-synctex=0', $process->command, true)
            && in_array('-bibtex-', $process->command, true);
    });
});

test('local adapter returns timed out status on exit code 124', function (): void {
    Process::fake([
        '*' => Process::result(output: '', errorOutput: 'Timed out', exitCode: 124),
    ]);

    $adapter = new LocalTexLiveAdapter;
    $result = $adapter->compile(new CompilationRequest(
        compilationPublicId: 'comp-timeout',
        engine: CompilerEngine::LuaLaTeX,
        rootFile: 'main.tex',
        bibliographyTool: 'biber',
        enableSynctex: true,
        workspacePath: $this->workDir,
    ));

    expect($result->status)->toBe(CompilationStatus::TimedOut)
        ->and($result->exitCode)->toBe(124)
        ->and($result->errorSummary)->toContain('timeout');
});

test('local adapter returns failed status when exit code is non-zero or pdf is invalid', function (): void {
    $outDir = $this->workDir.DIRECTORY_SEPARATOR.'out';

    Process::fake(function () use ($outDir) {
        file_put_contents($outDir.DIRECTORY_SEPARATOR.'main.log', "! Undefined control sequence.\nl.4 \\badcmd\n");

        return Process::result(output: '', errorOutput: 'latexmk failed', exitCode: 1);
    });

    $adapter = new LocalTexLiveAdapter;
    $result = $adapter->compile(new CompilationRequest(
        compilationPublicId: 'comp-fail',
        engine: CompilerEngine::PdfLaTeX,
        rootFile: 'main.tex',
        bibliographyTool: 'biber',
        enableSynctex: true,
        workspacePath: $this->workDir,
    ));

    expect($result->status)->toBe(CompilationStatus::Failed)
        ->and($result->exitCode)->toBe(1)
        ->and($result->pdfContents)->toBeNull()
        ->and($result->logContents)->toContain('Undefined control sequence');
});
