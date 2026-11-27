<?php

namespace App\Services\Compiler;

use InvalidArgumentException;

class CompilerAdapterFactory
{
    public function __construct(
        private readonly CompilerSettingsService $settings,
    ) {}

    public function resolve(?string $driver = null): LatexCompilerInterface
    {
        $resolvedSettings = $this->settings->all();
        $selectedDriver = $driver ?? $resolvedSettings['driver'];

        return match ($selectedDriver) {
            'docker' => new DockerTexLiveAdapter(
                workerImage: $resolvedSettings['docker_image'],
            ),
            'local' => new LocalTexLiveAdapter(
                latexmkPath: $resolvedSettings['local_latexmk_path'],
                texliveBinPath: $resolvedSettings['local_texlive_bin_path'] !== ''
                    ? $resolvedSettings['local_texlive_bin_path']
                    : (string) ($this->settings->detectLocalTexLiveBinPath() ?? ''),
                defaultWallTimeout: $resolvedSettings['wall_timeout'],
                defaultMaxOutputMb: $resolvedSettings['max_output_mb'],
            ),
            default => throw new InvalidArgumentException("Unsupported compiler driver [{$selectedDriver}]."),
        };
    }
}
