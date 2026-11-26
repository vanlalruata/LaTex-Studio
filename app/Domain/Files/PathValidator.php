<?php

namespace App\Domain\Files;

use InvalidArgumentException;

class PathValidator
{
    /**
     * Normalize and validate a relative project file path.
     *
     * @throws InvalidArgumentException
     */
    public function normalize(string $rawPath): string
    {
        if (str_contains($rawPath, "\0")) {
            throw new InvalidArgumentException('Path contains null bytes.');
        }

        $normalized = str_replace('\\', '/', trim($rawPath));
        $normalized = ltrim($normalized, '/');
        $normalized = preg_replace('#/+#', '/', $normalized) ?? '';

        if ($normalized === '' || $normalized === '.') {
            throw new InvalidArgumentException('Path cannot be empty.');
        }

        if (preg_match('/^[a-zA-Z]:/', $normalized) === 1) {
            throw new InvalidArgumentException('Drive-qualified paths are not allowed.');
        }

        $segments = explode('/', $normalized);
        $clean = [];

        foreach ($segments as $segment) {
            if ($segment === '' || $segment === '.') {
                continue;
            }

            if ($segment === '..') {
                throw new InvalidArgumentException('Path traversal segments (..) are not allowed.');
            }

            $clean[] = $segment;
        }

        if ($clean === []) {
            throw new InvalidArgumentException('Path cannot be empty.');
        }

        $result = implode('/', $clean);

        if (strlen($result) > 512) {
            throw new InvalidArgumentException('Path exceeds maximum length of 512 characters.');
        }

        return $result;
    }

    public function inferMimeType(string $path): string
    {
        $ext = strtolower(pathinfo($path, PATHINFO_EXTENSION));

        return match ($ext) {
            'tex', 'ltx', 'sty', 'cls', 'bst' => 'text/x-tex',
            'bib' => 'application/x-bibtex',
            'md' => 'text/markdown',
            'json' => 'application/json',
            'txt', 'log' => 'text/plain',
            'png' => 'image/png',
            'jpg', 'jpeg' => 'image/jpeg',
            'svg' => 'image/svg+xml',
            'pdf' => 'application/pdf',
            default => 'application/octet-stream',
        };
    }
}
