<?php

namespace App\Domain\Files;

use App\Models\Project;
use App\Models\ProjectFile;
use App\Models\User;
use App\Services\Storage\PrivateStorageService;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;

class SaveProjectFileAction
{
    public function __construct(
        private readonly PrivateStorageService $storage,
    ) {}

    public function execute(
        Project $project,
        ProjectFile $file,
        string $contents,
        User $actor,
        ?int $expectedVersion = null,
    ): ProjectFile {
        return DB::transaction(function () use ($project, $file, $contents, $actor, $expectedVersion): ProjectFile {
            if ($expectedVersion !== null && $file->version !== $expectedVersion) {
                throw new ConflictHttpException('File has been modified in a newer revision.');
            }

            $stored = $this->storage->putProjectFile($project->public_id, $contents);
            $deltaBytes = $stored['size_bytes'] - $file->size_bytes;

            $file->update([
                'storage_key' => $stored['storage_key'],
                'sha256_checksum' => $stored['sha256_checksum'],
                'size_bytes' => $stored['size_bytes'],
                'version' => $file->version + 1,
                'updated_by' => $actor->id,
            ]);

            $newTotal = max(0, $project->storage_bytes + $deltaBytes);
            $project->update(['storage_bytes' => $newTotal]);

            return $file->refresh();
        });
    }
}
