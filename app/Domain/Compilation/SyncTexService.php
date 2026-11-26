<?php

namespace App\Domain\Compilation;

class SyncTexService
{
    /**
     * Resolve a forward SyncTeX lookup (source file + line -> PDF page) from gzipped SyncTeX data.
     *
     * @return array{page: int, x: float|null, y: float|null}|null
     */
    public function forwardLookup(string $gzippedSynctex, string $filePath, int $line): ?array
    {
        $decoded = @gzdecode($gzippedSynctex);
        $raw = $decoded !== false ? $decoded : $gzippedSynctex;

        $lines = preg_split('/\r\n|\r|\n/', $raw) ?: [];
        $targetBasename = basename($filePath);
        $inputIds = [];
        $currentPage = 1;

        foreach ($lines as $entry) {
            if (preg_match('/^Input:(\d+):(.+)$/', $entry, $m) === 1) {
                if (basename(trim($m[2])) === $targetBasename) {
                    $inputIds[(int) $m[1]] = true;
                }

                continue;
            }

            if (preg_match('/^\{(\d+)$/', $entry, $m) === 1) {
                $currentPage = (int) $m[1];

                continue;
            }

            if (preg_match('/^[xkhv](\d+),(\d+):(-?\d+),(-?\d+)/', $entry, $m) === 1) {
                $tag = (int) $m[1];
                $srcLine = (int) $m[2];

                if (isset($inputIds[$tag]) && $srcLine === $line) {
                    return [
                        'page' => $currentPage,
                        'x' => (float) $m[3] / 65536.0,
                        'y' => (float) $m[4] / 65536.0,
                    ];
                }
            }
        }

        return null;
    }
}
