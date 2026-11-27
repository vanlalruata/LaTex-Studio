<?php

namespace App\DTOs;

use App\Enums\CompilerEngine;

readonly class CompilationRequest
{
    public function __construct(
        public string $compilationPublicId,
        public CompilerEngine $engine,
        public string $rootFile,
        public string $bibliographyTool,
        public bool $enableSynctex,
        public string $workspacePath,
        public int $wallTimeoutSeconds = 60,
        public int $memoryMb = 1024,
        public float $cpus = 1.0,
        public int $pidsLimit = 64,
        public int $maxOutputMb = 100,
        public bool $enableStreaming = false,
    ) {}
}
