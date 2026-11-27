<?php

namespace App\Domain\Collaboration;

use App\Models\ProjectFile;
use App\Services\Storage\PrivateStorageService;

class ConflictDetectionService
{
    public function __construct(
        private readonly PrivateStorageService $storage,
    ) {}

    /**
     * Detect whether a file save conflicts with the current server revision.
     *
     * @return array{
     *     has_conflict: bool,
     *     server_version: int,
     *     server_sha256: string|null,
     *     server_content: string|null,
     *     updated_by_name: string|null
     * }
     */
    public function check(
        ProjectFile $file,
        ?int $expectedVersion = null,
        ?string $baseSha256 = null,
    ): array {
        $versionMismatch = $expectedVersion !== null && $file->version !== $expectedVersion;
        $hashMismatch = $baseSha256 !== null
            && $file->sha256_checksum !== null
            && ! hash_equals($file->sha256_checksum, $baseSha256);

        if (! $versionMismatch && ! $hashMismatch) {
            return [
                'has_conflict' => false,
                'server_version' => $file->version,
                'server_sha256' => $file->sha256_checksum,
                'server_content' => null,
                'updated_by_name' => null,
            ];
        }

        $file->loadMissing('updater:id,name');
        $serverContent = $file->storage_key !== null
            ? $this->storage->getContents($file->storage_key)
            : '';

        return [
            'has_conflict' => true,
            'server_version' => $file->version,
            'server_sha256' => $file->sha256_checksum,
            'server_content' => $serverContent ?? '',
            'updated_by_name' => $file->updater?->name,
        ];
    }
}
