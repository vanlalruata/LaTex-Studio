<?php

namespace App\Domain\Revisions;

use App\Models\Project;
use App\Models\ProjectRevision;
use App\Models\User;

class CreateRevisionAction
{
    public function execute(Project $project, ?User $actor = null, ?string $message = null): ProjectRevision
    {
        $manifest = [];

        $files = $project->files()
            ->where('is_directory', false)
            ->orderBy('path')
            ->get(['path', 'sha256_checksum', 'storage_key', 'size_bytes']);

        foreach ($files as $file) {
            $manifest[$file->path] = [
                'sha256' => $file->sha256_checksum,
                'storage_key' => $file->storage_key,
                'size_bytes' => $file->size_bytes,
            ];
        }

        $revisionHash = hash('sha256', (string) json_encode($manifest));

        $existing = $project->revisions()
            ->where('revision_hash', $revisionHash)
            ->first();

        if ($existing !== null) {
            return $existing;
        }

        return ProjectRevision::query()->create([
            'project_id' => $project->id,
            'created_by' => $actor?->id,
            'revision_hash' => $revisionHash,
            'manifest' => $manifest,
            'message' => $message,
        ]);
    }
}
