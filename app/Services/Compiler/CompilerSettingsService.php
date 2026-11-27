<?php

namespace App\Services\Compiler;

use App\DTOs\CompilationRequest;
use App\Enums\CompilationStatus;
use App\Enums\CompilerEngine;
use App\Models\SystemSetting;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Throwable;

class CompilerSettingsService
{
    public const CACHE_KEY = 'system.compiler_settings';

    /**
     * @return array{
     *     driver: 'docker'|'local',
     *     docker_image: string,
     *     docker_memory_mb: int,
     *     docker_cpus: float,
     *     docker_pids_limit: int,
     *     local_texlive_bin_path: string,
     *     local_latexmk_path: string,
     *     wall_timeout: int,
     *     max_output_mb: int
     * }
     */
    public function all(): array
    {
        $defaults = $this->defaults();

        if (! Schema::hasTable('system_settings')) {
            return $defaults;
        }

        /** @var array<string, mixed> $stored */
        $stored = Cache::remember(self::CACHE_KEY, now()->addMinutes(30), static function (): array {
            return SystemSetting::query()
                ->where('key', 'like', 'compiler.%')
                ->pluck('value', 'key')
                ->all();
        });

        $driver = $stored['compiler.driver'] ?? $defaults['driver'];

        return [
            'driver' => $driver === 'local' ? 'local' : 'docker',
            'docker_image' => is_string($stored['compiler.docker_image'] ?? null)
                ? $stored['compiler.docker_image']
                : $defaults['docker_image'],
            'docker_memory_mb' => (int) ($stored['compiler.docker_memory_mb'] ?? $defaults['docker_memory_mb']),
            'docker_cpus' => (float) ($stored['compiler.docker_cpus'] ?? $defaults['docker_cpus']),
            'docker_pids_limit' => (int) ($stored['compiler.docker_pids_limit'] ?? $defaults['docker_pids_limit']),
            'local_texlive_bin_path' => is_string($stored['compiler.local_texlive_bin_path'] ?? null)
                ? $stored['compiler.local_texlive_bin_path']
                : $defaults['local_texlive_bin_path'],
            'local_latexmk_path' => is_string($stored['compiler.local_latexmk_path'] ?? null) && $stored['compiler.local_latexmk_path'] !== ''
                ? $stored['compiler.local_latexmk_path']
                : $defaults['local_latexmk_path'],
            'wall_timeout' => (int) ($stored['compiler.wall_timeout'] ?? $defaults['wall_timeout']),
            'max_output_mb' => (int) ($stored['compiler.max_output_mb'] ?? $defaults['max_output_mb']),
        ];
    }

    public function driver(): string
    {
        return $this->all()['driver'];
    }

    /**
     * @param  array<string, mixed>  $values
     */
    public function update(array $values): void
    {
        $mapping = [
            'driver' => 'compiler.driver',
            'docker_image' => 'compiler.docker_image',
            'docker_memory_mb' => 'compiler.docker_memory_mb',
            'docker_cpus' => 'compiler.docker_cpus',
            'docker_pids_limit' => 'compiler.docker_pids_limit',
            'local_texlive_bin_path' => 'compiler.local_texlive_bin_path',
            'local_latexmk_path' => 'compiler.local_latexmk_path',
            'wall_timeout' => 'compiler.wall_timeout',
            'max_output_mb' => 'compiler.max_output_mb',
        ];

        foreach ($mapping as $inputKey => $settingKey) {
            if (! array_key_exists($inputKey, $values)) {
                continue;
            }

            SystemSetting::query()->updateOrCreate(
                ['key' => $settingKey],
                ['value' => $values[$inputKey]],
            );
        }

        $this->forgetCache();
    }

    public function forgetCache(): void
    {
        Cache::forget(self::CACHE_KEY);
    }

    /**
     * @return array{
     *     docker: array{available: bool, server_version: string|null, image_present: bool, message: string},
     *     local: array{
     *         available: bool,
     *         detected_bin_path: string|null,
     *         latexmk_version: string|null,
     *         pdflatex_version: string|null,
     *         available_engines: list<string>,
     *         message: string
     *     }
     * }
     */
    public function checkHealth(): array
    {
        $settings = $this->all();

        $dockerAvailable = false;
        $dockerVersion = null;
        $imagePresent = false;
        $dockerMessage = 'Docker daemon is not reachable.';

        try {
            $dockerInfo = Process::timeout(5)->run(['docker', 'info', '--format', '{{.ServerVersion}}']);
            if ($dockerInfo->successful() && trim($dockerInfo->output()) !== '') {
                $dockerAvailable = true;
                $dockerVersion = trim($dockerInfo->output());
                $imageCheck = Process::timeout(5)->run(['docker', 'image', 'inspect', $settings['docker_image']]);
                $imagePresent = $imageCheck->successful();
                $dockerMessage = $imagePresent
                    ? "Docker {$dockerVersion} ready with image {$settings['docker_image']}."
                    : "Docker {$dockerVersion} running, but image {$settings['docker_image']} was not found locally.";
            }
        } catch (Throwable $exception) {
            $dockerMessage = $exception->getMessage();
        }

        $localAvailable = false;
        $latexmkVersion = null;
        $pdflatexVersion = null;
        $availableEngines = [];
        $binPath = $settings['local_texlive_bin_path'] !== ''
            ? $settings['local_texlive_bin_path']
            : $this->detectLocalTexLiveBinPath();
        $localMessage = 'Local TeX Live binaries were not found.';

        try {
            $env = [];
            if ($binPath !== null && $binPath !== '') {
                $env['PATH'] = $binPath.PATH_SEPARATOR.(string) getenv('PATH');
            }

            $latexmkBinary = $binPath !== null && is_executable($binPath.DIRECTORY_SEPARATOR.'latexmk')
                ? $binPath.DIRECTORY_SEPARATOR.'latexmk'
                : $settings['local_latexmk_path'];
            $latexmkProc = Process::timeout(5)->env($env)->run([$latexmkBinary, '-v']);
            if ($latexmkProc->successful()) {
                $latexmkVersion = strtok(trim($latexmkProc->output()), "\n") ?: 'latexmk';
            }

            foreach (['pdflatex', 'xelatex', 'lualatex'] as $engine) {
                $engineBinary = $binPath !== null && is_executable($binPath.DIRECTORY_SEPARATOR.$engine)
                    ? $binPath.DIRECTORY_SEPARATOR.$engine
                    : $engine;
                $proc = Process::timeout(5)->env($env)->run([$engineBinary, '--version']);
                if ($proc->successful()) {
                    $availableEngines[] = $engine;
                    if ($engine === 'pdflatex') {
                        $pdflatexVersion = strtok(trim($proc->output()), "\n") ?: 'pdflatex';
                    }
                }
            }

            if ($pdflatexVersion !== null) {
                $localAvailable = true;
                $modeNote = $latexmkVersion !== null ? 'latexmk + direct engines' : 'direct engines (no latexmk)';
                $localMessage = "Local TeX Live ready ({$pdflatexVersion}; {$modeNote}).";
            }
        } catch (Throwable $exception) {
            $localMessage = $exception->getMessage();
        }

        return [
            'docker' => [
                'available' => $dockerAvailable,
                'server_version' => $dockerVersion,
                'image_present' => $imagePresent,
                'message' => $dockerMessage,
            ],
            'local' => [
                'available' => $localAvailable,
                'detected_bin_path' => $binPath,
                'latexmk_version' => $latexmkVersion,
                'pdflatex_version' => $pdflatexVersion,
                'available_engines' => $availableEngines,
                'message' => $localMessage,
            ],
        ];
    }

    public function detectLocalTexLiveBinPath(): ?string
    {
        $patterns = [];
        $home = getenv('HOME');
        if (is_string($home) && $home !== '') {
            $patterns[] = rtrim($home, '/').'/texlive/*/bin/*';
        }
        $patterns[] = '/home/*/texlive/*/bin/*';
        $patterns[] = '/usr/local/texlive/*/bin/*';
        $patterns[] = '/opt/texlive/*/bin/*';

        $candidates = [];
        foreach ($patterns as $pattern) {
            $matches = glob($pattern, GLOB_ONLYDIR);
            if (is_array($matches)) {
                rsort($matches);
                foreach ($matches as $dir) {
                    $candidates[] = $dir;
                }
            }
        }
        $candidates[] = '/usr/bin';

        foreach ($candidates as $dir) {
            if (is_executable($dir.DIRECTORY_SEPARATOR.'pdflatex')) {
                return $dir;
            }
        }

        return null;
    }

    /**
     * @return array{ok: bool, driver: string, duration_ms: int, message: string}
     */
    public function runTestCompilation(?string $driver = null): array
    {
        $selectedDriver = $driver ?? $this->driver();
        $workDir = storage_path('app/build-workspaces/healthcheck-'.Str::uuid()->toString());
        $srcDir = $workDir.DIRECTORY_SEPARATOR.'src';

        try {
            File::ensureDirectoryExists($srcDir);
            file_put_contents(
                $srcDir.DIRECTORY_SEPARATOR.'main.tex',
                "\\documentclass{article}\n\\begin{document}\nLaTeX Studio Health Check.\n\\end{document}\n"
            );

            $adapter = app(CompilerAdapterFactory::class)->resolve($selectedDriver);
            $settings = $this->all();

            $result = $adapter->compile(new CompilationRequest(
                compilationPublicId: 'healthcheck',
                engine: CompilerEngine::PdfLaTeX,
                rootFile: 'main.tex',
                bibliographyTool: 'none',
                enableSynctex: false,
                workspacePath: $workDir,
                wallTimeoutSeconds: min(30, $settings['wall_timeout']),
                memoryMb: $settings['docker_memory_mb'],
                cpus: $settings['docker_cpus'],
                pidsLimit: $settings['docker_pids_limit'],
                maxOutputMb: $settings['max_output_mb'],
            ));

            $ok = $result->status === CompilationStatus::Succeeded
                && $result->pdfContents !== null
                && str_starts_with($result->pdfContents, '%PDF-');

            return [
                'ok' => $ok,
                'driver' => $selectedDriver,
                'duration_ms' => $result->durationMs,
                'message' => $ok
                    ? "Test compilation succeeded via {$selectedDriver} in {$result->durationMs} ms."
                    : ($result->errorSummary ?? 'Test compilation failed.'),
            ];
        } catch (Throwable $exception) {
            return [
                'ok' => false,
                'driver' => $selectedDriver,
                'duration_ms' => 0,
                'message' => $exception->getMessage(),
            ];
        } finally {
            if (is_dir($workDir)) {
                File::deleteDirectory($workDir);
            }
        }
    }

    /**
     * @return array{
     *     driver: 'docker'|'local',
     *     docker_image: string,
     *     docker_memory_mb: int,
     *     docker_cpus: float,
     *     docker_pids_limit: int,
     *     local_texlive_bin_path: string,
     *     local_latexmk_path: string,
     *     wall_timeout: int,
     *     max_output_mb: int
     * }
     */
    private function defaults(): array
    {
        $driver = (string) config('compiler.driver', 'docker');

        return [
            'driver' => $driver === 'local' ? 'local' : 'docker',
            'docker_image' => (string) config('compiler.docker.image', 'latexstudio/texlive-worker:latest'),
            'docker_memory_mb' => (int) config('compiler.docker.memory_mb', 1024),
            'docker_cpus' => (float) config('compiler.docker.cpus', 1.0),
            'docker_pids_limit' => (int) config('compiler.docker.pids_limit', 64),
            'local_texlive_bin_path' => (string) config('compiler.local.texlive_bin_path', ''),
            'local_latexmk_path' => (string) config('compiler.local.latexmk_path', 'latexmk'),
            'wall_timeout' => (int) config('compiler.docker.wall_timeout', 60),
            'max_output_mb' => (int) config('compiler.docker.max_output_mb', 100),
        ];
    }
}
