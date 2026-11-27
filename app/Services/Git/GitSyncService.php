<?php

namespace App\Services\Git;

use App\Domain\Administration\AuditService;
use App\Domain\Collaboration\GitConflictResolver;
use App\Domain\Files\PathValidator;
use App\Domain\Files\SaveProjectFileAction;
use App\Domain\Revisions\CreateRevisionAction;
use App\Models\Project;
use App\Models\ProjectFile;
use App\Models\ProjectIntegration;
use App\Models\User;
use App\Services\Storage\PrivateStorageService;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;
use RuntimeException;

class GitSyncService
{
    public function __construct(
        private readonly GitHubProvider $github,
        private readonly GitLabProvider $gitlab,
        private readonly PrivateStorageService $storage,
        private readonly PathValidator $pathValidator,
        private readonly SaveProjectFileAction $saveFile,
        private readonly CreateRevisionAction $createRevision,
        private readonly GitConflictResolver $conflictResolver,
        private readonly AuditService $audit,
    ) {}

    public function provider(string $name): GitProviderInterface
    {
        return match ($name) {
            'github' => $this->github,
            'gitlab' => $this->gitlab,
            default => throw new InvalidArgumentException("Unsupported Git provider [{$name}]."),
        };
    }

    /**
     * @return array{commit_sha: string, files_count: int}
     */
    public function push(
        Project $project,
        ProjectIntegration $integration,
        User $actor,
        string $message = 'Sync from LaTeX Studio',
    ): array {
        $token = $integration->accessToken();
        if ($token === null) {
            throw new RuntimeException('Git integration is missing an access token.');
        }

        $config = $integration->config ?? [];
        $repo = is_string($config['repository'] ?? null) ? $config['repository'] : '';
        $branch = is_string($config['branch'] ?? null) && $config['branch'] !== '' ? $config['branch'] : 'main';

        if ($repo === '') {
            throw new RuntimeException('Target Git repository is not configured.');
        }

        $files = [];
        $syncedHashes = [];

        foreach ($project->files()->where('is_directory', false)->get() as $file) {
            if ($file->storage_key === null) {
                continue;
            }
            $contents = $this->storage->getContents($file->storage_key);
            if ($contents === null) {
                continue;
            }
            $files[$file->path] = $contents;
            $syncedHashes[$file->path] = hash('sha256', $contents);
        }

        $commitSha = $this->provider($integration->provider)->commitFiles(
            token: $token,
            repo: $repo,
            branch: $branch,
            message: $message,
            files: $files,
        );

        if ($commitSha === null) {
            $integration->update(['status' => 'error']);
            throw new RuntimeException('Failed to push files to Git repository.');
        }

        $integration->update([
            'status' => 'connected',
            'last_synced_at' => now(),
            'config' => array_merge($config, [
                'last_push_sha' => $commitSha,
                'last_synced_files' => $syncedHashes,
            ]),
        ]);

        $this->audit->record('git.pushed', $actor, $project, $integration, [
            'provider' => $integration->provider,
            'repository' => $repo,
            'branch' => $branch,
            'commit_sha' => $commitSha,
        ]);

        return [
            'commit_sha' => $commitSha,
            'files_count' => count($files),
        ];
    }

    /**
     * @return array{created: list<string>, updated: list<string>, conflicts: list<string>}
     */
    public function pull(
        Project $project,
        ProjectIntegration $integration,
        User $actor,
    ): array {
        $token = $integration->accessToken();
        if ($token === null) {
            throw new RuntimeException('Git integration is missing an access token.');
        }

        $config = $integration->config ?? [];
        $repo = is_string($config['repository'] ?? null) ? $config['repository'] : '';
        $branch = is_string($config['branch'] ?? null) && $config['branch'] !== '' ? $config['branch'] : 'main';

        if ($repo === '') {
            throw new RuntimeException('Target Git repository is not configured.');
        }

        $provider = $this->provider($integration->provider);
        $tree = $provider->getTree($token, $repo, $branch);

        /** @var array<string, string> $lastSyncedFiles */
        $lastSyncedFiles = is_array($config['last_synced_files'] ?? null) ? $config['last_synced_files'] : [];

        $created = [];
        $updated = [];
        $conflicts = [];

        DB::transaction(function () use (
            $project,
            $provider,
            $token,
            $repo,
            $branch,
            $tree,
            $actor,
            &$lastSyncedFiles,
            &$created,
            &$updated,
            &$conflicts,
        ): void {
            foreach ($tree as $entry) {
                $safePath = $this->pathValidator->normalize($entry['path']);
                $remoteContent = $provider->getFileContent($token, $repo, $entry['path'], $branch);
                if ($remoteContent === null) {
                    continue;
                }

                $localFile = $project->files()
                    ->where('is_directory', false)
                    ->where('path', $safePath)
                    ->first();

                $decision = $this->conflictResolver->decide(
                    localFile: $localFile,
                    remoteContent: $remoteContent,
                    lastSyncedSha256: $lastSyncedFiles[$safePath] ?? null,
                );

                if ($decision === 'conflict') {
                    $conflicts[] = $safePath;

                    continue;
                }

                $remoteHash = hash('sha256', $remoteContent);

                if ($decision === 'create') {
                    $stored = $this->storage->putProjectFile($project->public_id, $remoteContent);

                    ProjectFile::query()->create([
                        'project_id' => $project->id,
                        'path' => $safePath,
                        'storage_key' => $stored['storage_key'],
                        'mime_type' => $this->pathValidator->inferMimeType($safePath),
                        'size_bytes' => $stored['size_bytes'],
                        'sha256_checksum' => $stored['sha256_checksum'],
                        'is_directory' => false,
                        'version' => 1,
                        'updated_by' => $actor->id,
                    ]);

                    $project->increment('storage_bytes', $stored['size_bytes']);
                    $created[] = $safePath;
                    $lastSyncedFiles[$safePath] = $remoteHash;

                    continue;
                }

                if ($decision === 'update' && $localFile !== null) {
                    $this->saveFile->execute($project, $localFile, $remoteContent, $actor);
                    $updated[] = $safePath;
                    $lastSyncedFiles[$safePath] = $remoteHash;

                    continue;
                }

                $lastSyncedFiles[$safePath] = $remoteHash;
            }
        });

        if ($created !== [] || $updated !== []) {
            $this->createRevision->execute($project, $actor, "Pulled from {$integration->provider} ({$repo}@{$branch})");
        }

        $integration->update([
            'status' => 'connected',
            'last_synced_at' => now(),
            'config' => array_merge($config, [
                'last_synced_files' => $lastSyncedFiles,
            ]),
        ]);

        $this->audit->record('git.pulled', $actor, $project, $integration, [
            'provider' => $integration->provider,
            'repository' => $repo,
            'created' => count($created),
            'updated' => count($updated),
            'conflicts' => count($conflicts),
        ]);

        return [
            'created' => $created,
            'updated' => $updated,
            'conflicts' => $conflicts,
        ];
    }
}
