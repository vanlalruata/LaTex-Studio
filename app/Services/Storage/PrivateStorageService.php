<?php

namespace App\Services\Storage;

use Illuminate\Contracts\Filesystem\Filesystem;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class PrivateStorageService
{
    public function disk(): Filesystem
    {
        return Storage::disk('local');
    }

    /**
     * Store file contents under a private project key and return storage metadata.
     *
     * @return array{storage_key: string, sha256_checksum: string, size_bytes: int}
     */
    public function putProjectFile(string $projectPublicId, string $contents): array
    {
        $checksum = hash('sha256', $contents);
        $storageKey = sprintf('projects/%s/blobs/%s-%s', $projectPublicId, $checksum, Str::random(8));

        $this->disk()->put($storageKey, $contents);

        return [
            'storage_key' => $storageKey,
            'sha256_checksum' => $checksum,
            'size_bytes' => strlen($contents),
        ];
    }

    public function getContents(string $storageKey): ?string
    {
        if (! $this->disk()->exists($storageKey)) {
            return null;
        }

        return $this->disk()->get($storageKey);
    }

    public function delete(string $storageKey): void
    {
        if ($this->disk()->exists($storageKey)) {
            $this->disk()->delete($storageKey);
        }
    }

    /**
     * Store a build artifact privately and return storage metadata.
     *
     * @return array{storage_key: string, sha256_checksum: string, size_bytes: int}
     */
    public function putBuildArtifact(string $compilationPublicId, string $filename, string $contents): array
    {
        $checksum = hash('sha256', $contents);
        $storageKey = sprintf('artifacts/%s/%s', $compilationPublicId, basename($filename));

        $this->disk()->put($storageKey, $contents);

        return [
            'storage_key' => $storageKey,
            'sha256_checksum' => $checksum,
            'size_bytes' => strlen($contents),
        ];
    }
}
