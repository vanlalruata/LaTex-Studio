<?php

namespace App\Domain\Compilation;

class SyncTexService
{
    private const UNIT = 65536.0;

    /**
     * Resolve a forward SyncTeX lookup (source path + line -> PDF page and point).
     *
     * @return array{page: int, x: float|null, y: float|null}|null
     */
    public function forwardLookup(string $synctex, string $filePath, int $line): ?array
    {
        $raw = $this->decode($synctex);
        $target = $this->normalizePath($filePath);

        $inputIds = [];
        $page = 1;
        $nearest = null;
        $nearestDistance = PHP_INT_MAX;

        foreach ($this->records($raw) as $record) {
            if ($record['type'] === 'input') {
                if ($this->pathMatches($target, $record['path'])) {
                    $inputIds[$record['tag']] = true;
                }

                continue;
            }

            if ($record['type'] === 'page') {
                $page = $record['page'];

                continue;
            }

            if (! isset($inputIds[$record['tag']])) {
                continue;
            }

            if ($record['line'] === $line) {
                return [
                    'page' => $page,
                    'x' => $record['x'],
                    'y' => $record['y'],
                ];
            }

            $distance = abs($record['line'] - $line);
            if ($distance < $nearestDistance) {
                $nearestDistance = $distance;
                $nearest = [
                    'page' => $page,
                    'x' => $record['x'],
                    'y' => $record['y'],
                ];
            }
        }

        return $nearest;
    }

    /**
     * Resolve an inverse SyncTeX lookup (PDF page + point -> source file and line).
     *
     * @return array{file_path: string, line: int, x: float, y: float, distance: float}|null
     */
    public function inverseLookup(string $synctex, int $page, float $x, float $y): ?array
    {
        $raw = $this->decode($synctex);
        $inputs = [];
        $currentPage = 1;
        $best = null;
        $bestDistance = PHP_FLOAT_MAX;

        foreach ($this->records($raw) as $record) {
            if ($record['type'] === 'input') {
                $inputs[$record['tag']] = $record['path'];

                continue;
            }

            if ($record['type'] === 'page') {
                $currentPage = $record['page'];

                continue;
            }

            if ($currentPage !== $page || ! isset($inputs[$record['tag']])) {
                continue;
            }

            $distance = hypot($record['x'] - $x, $record['y'] - $y);
            if ($distance < $bestDistance) {
                $bestDistance = $distance;
                $best = [
                    'file_path' => $inputs[$record['tag']],
                    'line' => $record['line'],
                    'x' => $record['x'],
                    'y' => $record['y'],
                    'distance' => round($distance, 3),
                ];
            }
        }

        return $best;
    }

    private function decode(string $synctex): string
    {
        $decoded = @gzdecode($synctex);

        return $decoded !== false ? $decoded : $synctex;
    }

    /**
     * @return iterable<int, array<string, mixed>>
     */
    private function records(string $raw): iterable
    {
        $lines = preg_split('/\r\n|\r|\n/', $raw) ?: [];

        foreach ($lines as $entry) {
            if (preg_match('/^Input:(\d+):(.+)$/', $entry, $m) === 1) {
                yield ['type' => 'input', 'tag' => (int) $m[1], 'path' => trim($m[2])];

                continue;
            }

            if (preg_match('/^\{(\d+)$/', $entry, $m) === 1) {
                yield ['type' => 'page', 'page' => (int) $m[1]];

                continue;
            }

            if (preg_match('/^[\[\(xkhv](\d+),(\d+):(-?\d+),(-?\d+)/', $entry, $m) === 1) {
                yield [
                    'type' => 'box',
                    'tag' => (int) $m[1],
                    'line' => (int) $m[2],
                    'x' => (float) $m[3] / self::UNIT,
                    'y' => (float) $m[4] / self::UNIT,
                ];
            }
        }
    }

    private function normalizePath(string $path): string
    {
        $path = str_replace('\\', '/', trim($path));

        return ltrim($path, './');
    }

    private function pathMatches(string $target, string $candidate): bool
    {
        $candidate = $this->normalizePath($candidate);

        return $candidate === $target
            || str_ends_with($candidate, '/'.$target)
            || basename($candidate) === basename($target);
    }
}
