<?php

use App\Domain\Diagnostics\DiagnosticsNormalizer;
use App\Enums\DiagnosticSeverity;

test('normalizes file-line-error, fatal TeX errors, and LaTeX warnings', function (): void {
    $rawLog = <<<'LOG'
This is pdfTeX, Version 3.141592653
./main.tex:14: Undefined control sequence.
l.14 \badcommand
! LaTeX Error: Environment itemize undefined.
l.22 \begin{itemize}
LaTeX Warning: Reference `eq:missing' on page 1 undefined on input line 30.
LOG;

    $normalizer = new DiagnosticsNormalizer;
    $diagnostics = $normalizer->normalize($rawLog);

    expect($diagnostics)->toHaveCount(3)
        ->and($diagnostics[0]['severity'])->toBe(DiagnosticSeverity::Error)
        ->and($diagnostics[0]['file_path'])->toBe('main.tex')
        ->and($diagnostics[0]['line'])->toBe(14)
        ->and($diagnostics[0]['message'])->toBe('Undefined control sequence.')
        ->and($diagnostics[1]['severity'])->toBe(DiagnosticSeverity::Error)
        ->and($diagnostics[1]['line'])->toBe(22)
        ->and($diagnostics[2]['severity'])->toBe(DiagnosticSeverity::Warning)
        ->and($diagnostics[2]['line'])->toBe(30);
});
