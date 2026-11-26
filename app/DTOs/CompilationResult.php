<?php

namespace App\DTOs;

use App\Enums\CompilationStatus;

readonly class CompilationResult
{
    public function __construct(
        public CompilationStatus $status,
        public int $exitCode,
        public int $durationMs,
        public ?int $peakMemoryKb = null,
        public ?string $workerImageDigest = null,
        public ?string $pdfContents = null,
        public ?string $logContents = null,
        public ?string $synctexContents = null,
        public ?string $errorSummary = null,
    ) {}
}
