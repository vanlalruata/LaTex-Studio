<?php

namespace App\Domain\Collaboration;

use App\Models\ProjectFile;

class GitConflictResolver
{
    public function decide(
        ?ProjectFile $localFile,
        string $remoteContent,
        ?string $lastSyncedSha256,
    ): string {
        if ($localFile === null) {
            return 'create';
        }

        $remoteSha256 = hash('sha256', $remoteContent);

        if ($localFile->sha256_checksum === $remoteSha256) {
            return 'unchanged';
        }

        if ($lastSyncedSha256 === null || $localFile->sha256_checksum === $lastSyncedSha256) {
            return 'update';
        }

        return 'conflict';
    }
}
