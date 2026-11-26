<?php

namespace App\Domain\Diagnostics;

use App\Enums\DiagnosticSeverity;

class DiagnosticsNormalizer
{
    /**
     * Parse raw LaTeX / latexmk log output into normalized diagnostic records.
     *
     * @return list<array{
     *     severity: DiagnosticSeverity,
     *     file_path: string|null,
     *     line: int|null,
     *     column: int|null,
     *     code: string|null,
     *     message: string,
     *     raw_excerpt: string|null
     * }>
     */
    public function normalize(string $rawLog): array
    {
        if (trim($rawLog) === '') {
            return [];
        }

        $diagnostics = [];
        $lines = preg_split('/\r\n|\r|\n/', $rawLog) ?: [];
        $lineCount = count($lines);

        for ($i = 0; $i < $lineCount; $i++) {
            $line = $lines[$i];

            // Match -file-line-error style: ./main.tex:14: Undefined control sequence.
            if (preg_match('/^(?:\.\/)?([^\s:]+\.[a-zA-Z0-9]+):(\d+):\s*(.+)$/', $line, $matches) === 1) {
                $excerpt = $this->collectExcerpt($lines, $i);
                $diagnostics[] = [
                    'severity' => DiagnosticSeverity::Error,
                    'file_path' => $matches[1],
                    'line' => (int) $matches[2],
                    'column' => null,
                    'code' => 'tex.error',
                    'message' => trim($matches[3]),
                    'raw_excerpt' => $excerpt,
                ];

                continue;
            }

            // Match standard TeX error: ! LaTeX Error: ... or ! Undefined control sequence.
            if (str_starts_with($line, '! ')) {
                $message = trim(substr($line, 2));
                $errorLine = null;
                $excerpt = $this->collectExcerpt($lines, $i);

                for ($j = $i + 1; $j < min($i + 5, $lineCount); $j++) {
                    if (preg_match('/^l\.(\d+)\s/', $lines[$j], $lineMatch) === 1) {
                        $errorLine = (int) $lineMatch[1];
                        break;
                    }
                }

                $diagnostics[] = [
                    'severity' => DiagnosticSeverity::Error,
                    'file_path' => null,
                    'line' => $errorLine,
                    'column' => null,
                    'code' => 'tex.fatal',
                    'message' => $message,
                    'raw_excerpt' => $excerpt,
                ];

                continue;
            }

            // Match LaTeX / Package warnings
            if (preg_match('/^(?:LaTeX|Package\s+\S+)\s+Warning:\s*(.+)$/', $line, $warnMatches) === 1) {
                $warnLine = null;
                if (preg_match('/input line (\d+)/', $line, $lineMatch) === 1) {
                    $warnLine = (int) $lineMatch[1];
                }

                $diagnostics[] = [
                    'severity' => DiagnosticSeverity::Warning,
                    'file_path' => null,
                    'line' => $warnLine,
                    'column' => null,
                    'code' => 'tex.warning',
                    'message' => trim($warnMatches[1]),
                    'raw_excerpt' => $line,
                ];
            }
        }

        return $diagnostics;
    }

    /**
     * @param  list<string>  $lines
     */
    private function collectExcerpt(array $lines, int $index): string
    {
        $slice = array_slice($lines, $index, 3);

        return implode("\n", $slice);
    }
}
