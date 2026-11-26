<?php

namespace App\Http\Controllers;

use App\Domain\Administration\AuditService;
use App\Domain\Files\PathValidator;
use App\Domain\Files\SaveProjectFileAction;
use App\Domain\Revisions\CreateRevisionAction;
use App\Models\Project;
use App\Models\ProjectFile;
use App\Models\ProjectRevision;
use App\Services\Storage\PrivateStorageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;

class ProjectRevisionController extends Controller
{
    private const TEXT_EXTENSIONS = ['tex', 'ltx', 'bib', 'md', 'txt', 'sty', 'cls', 'bst', 'json', 'yaml', 'yml', 'csv', 'log'];

    private const MAX_DIFF_FILE_BYTES = 300000;

    private const MAX_DIFF_TOTAL_BYTES = 1500000;

    public function index(Project $project): JsonResponse
    {
        Gate::authorize('view', $project);

        $revisions = $project->revisions()
            ->with('creator:id,name')
            ->latest('created_at')
            ->limit(50)
            ->get()
            ->map(fn ($revision): array => [
                'public_id' => $revision->public_id,
                'revision_hash' => $revision->revision_hash,
                'message' => $revision->message,
                'creator_name' => $revision->creator->name ?? 'System',
                'created_at' => $revision->created_at?->toIso8601String(),
            ]);

        return response()->json(['revisions' => $revisions]);
    }

    public function store(Request $request, Project $project, CreateRevisionAction $action): JsonResponse
    {
        Gate::authorize('editFiles', $project);

        $validated = $request->validate([
            'message' => ['nullable', 'string', 'max:255'],
        ]);

        $revision = $action->execute(
            project: $project,
            actor: $request->user(),
            message: $validated['message'] ?? 'Manual snapshot',
        );

        return response()->json([
            'public_id' => $revision->public_id,
            'revision_hash' => $revision->revision_hash,
            'message' => $revision->message,
            'created_at' => $revision->created_at?->toIso8601String(),
        ], 201);
    }

    public function show(Project $project, ProjectRevision $revision): JsonResponse
    {
        Gate::authorize('view', $project);
        abort_unless($revision->project_id === $project->id, 404);

        $files = collect($revision->manifest)
            ->map(fn (array $meta, string $path): array => [
                'path' => $path,
                'size_bytes' => $meta['size_bytes'] ?? 0,
                'sha256' => $meta['sha256'] ?? null,
            ])
            ->sortBy('path')
            ->values();

        $revision->load('creator:id,name');

        return response()->json([
            'revision' => [
                'public_id' => $revision->public_id,
                'revision_hash' => $revision->revision_hash,
                'message' => $revision->message,
                'creator_name' => $revision->creator?->name ?? 'System',
                'created_at' => $revision->created_at?->toIso8601String(),
                'files' => $files,
            ],
        ]);
    }

    public function diff(Request $request, Project $project, ProjectRevision $revision, PrivateStorageService $storage): JsonResponse
    {
        Gate::authorize('view', $project);
        abort_unless($revision->project_id === $project->id, 404);

        $against = $request->query('against', 'current');
        $againstRevision = null;

        if (is_string($against) && $against !== '' && $against !== 'current') {
            $againstRevision = $project->revisions()->where('public_id', $against)->first();
            abort_if($againstRevision === null, 422, 'Comparison revision does not belong to this project.');
        }

        /** @var array<string, array{sha256?: string|null, storage_key?: string|null, size_bytes?: int}> $before */
        $before = $revision->manifest;

        if ($againstRevision !== null) {
            /** @var array<string, array{sha256?: string|null, storage_key?: string|null, size_bytes?: int}> $after */
            $after = $againstRevision->manifest;
        } else {
            $after = $project->files()
                ->where('is_directory', false)
                ->get()
                ->mapWithKeys(fn (ProjectFile $file): array => [
                    $file->path => [
                        'sha256' => $file->sha256_checksum,
                        'storage_key' => $file->storage_key,
                        'size_bytes' => $file->size_bytes,
                    ],
                ])
                ->all();
        }

        $paths = array_values(array_unique([...array_keys($before), ...array_keys($after)]));
        sort($paths);

        $counts = ['added' => 0, 'removed' => 0, 'modified' => 0, 'unchanged' => 0];
        $files = [];
        $loadedBytes = 0;

        foreach ($paths as $path) {
            $beforeMeta = $before[$path] ?? null;
            $afterMeta = $after[$path] ?? null;

            if ($beforeMeta === null) {
                $status = 'added';
            } elseif ($afterMeta === null) {
                $status = 'removed';
            } elseif (($beforeMeta['sha256'] ?? null) !== ($afterMeta['sha256'] ?? null)) {
                $status = 'modified';
            } else {
                $status = 'unchanged';
            }

            $counts[$status]++;

            if ($status === 'unchanged') {
                continue;
            }

            $isText = in_array(strtolower(pathinfo($path, PATHINFO_EXTENSION)), self::TEXT_EXTENSIONS, true);
            $size = max((int) ($beforeMeta['size_bytes'] ?? 0), (int) ($afterMeta['size_bytes'] ?? 0));
            $canLoad = $isText && $size <= self::MAX_DIFF_FILE_BYTES && $loadedBytes + ($size * 2) <= self::MAX_DIFF_TOTAL_BYTES;

            $beforeContent = null;
            $afterContent = null;

            if ($canLoad) {
                $beforeContent = $this->loadContent($storage, $beforeMeta['storage_key'] ?? null);
                $afterContent = $this->loadContent($storage, $afterMeta['storage_key'] ?? null);
                $loadedBytes += strlen((string) $beforeContent) + strlen((string) $afterContent);
            }

            $files[] = [
                'path' => $path,
                'status' => $status,
                'before' => $beforeContent,
                'after' => $afterContent,
                'text_available' => $canLoad,
                'size_bytes' => $size,
            ];

            if (count($files) >= 100) {
                break;
            }
        }

        $revision->load('creator:id,name');
        $againstRevision?->load('creator:id,name');

        return response()->json([
            'revision' => [
                'public_id' => $revision->public_id,
                'revision_hash' => $revision->revision_hash,
                'message' => $revision->message,
                'creator_name' => $revision->creator?->name ?? 'System',
                'created_at' => $revision->created_at?->toIso8601String(),
            ],
            'against' => $againstRevision !== null
                ? [
                    'public_id' => $againstRevision->public_id,
                    'revision_hash' => $againstRevision->revision_hash,
                    'message' => $againstRevision->message,
                    'creator_name' => $againstRevision->creator?->name ?? 'System',
                    'created_at' => $againstRevision->created_at?->toIso8601String(),
                ]
                : null,
            'counts' => $counts,
            'files' => $files,
        ]);
    }

    public function restore(
        Request $request,
        Project $project,
        ProjectRevision $revision,
        PrivateStorageService $storage,
        SaveProjectFileAction $saveFile,
        CreateRevisionAction $createRevision,
        PathValidator $pathValidator,
        AuditService $audit,
    ): JsonResponse {
        Gate::authorize('editFiles', $project);
        abort_unless($revision->project_id === $project->id, 404);

        $user = $request->user();
        abort_if($user === null, 401);

        $restored = 0;
        $created = 0;
        $skipped = 0;

        DB::transaction(function () use ($project, $revision, $storage, $saveFile, $pathValidator, $user, &$restored, &$created, &$skipped): void {
            /** @var array<string, array{sha256?: string|null, storage_key?: string|null, size_bytes?: int}> $manifest */
            $manifest = $revision->manifest;

            foreach ($manifest as $rawPath => $meta) {
                $path = $pathValidator->normalize($rawPath);
                $storageKey = $meta['storage_key'] ?? null;

                if ($storageKey === null) {
                    $skipped++;

                    continue;
                }

                $contents = $storage->getContents($storageKey);
                if ($contents === null) {
                    abort(422, "Snapshot content for {$path} is no longer available.");
                }

                $expectedSha = $meta['sha256'] ?? null;
                if (is_string($expectedSha) && ! hash_equals($expectedSha, hash('sha256', $contents))) {
                    abort(422, "Snapshot content for {$path} failed its integrity check.");
                }

                /** @var ProjectFile|null $file */
                $file = $project->files()->where('path', $path)->first();

                if ($file !== null && ! $file->is_directory) {
                    if ($file->sha256_checksum === hash('sha256', $contents)) {
                        $skipped++;

                        continue;
                    }

                    $saveFile->execute($project, $file, $contents, $user);
                    $restored++;

                    continue;
                }

                if ($file !== null && $file->is_directory) {
                    $skipped++;

                    continue;
                }

                $stored = $storage->putProjectFile($project->public_id, $contents);

                ProjectFile::query()->create([
                    'project_id' => $project->id,
                    'path' => $path,
                    'storage_key' => $stored['storage_key'],
                    'mime_type' => $pathValidator->inferMimeType($path),
                    'size_bytes' => $stored['size_bytes'],
                    'sha256_checksum' => $stored['sha256_checksum'],
                    'is_directory' => false,
                    'version' => 1,
                    'updated_by' => $user->id,
                ]);

                $project->increment('storage_bytes', $stored['size_bytes']);
                $created++;
            }
        });

        $snapshot = $createRevision->execute(
            $project,
            $user,
            'Restored snapshot '.substr($revision->revision_hash, 0, 12),
        );

        $audit->record('revision.restored', $user, $project, $revision, [
            'restored' => $restored,
            'created' => $created,
            'skipped' => $skipped,
        ]);

        return response()->json([
            'restored' => $restored,
            'created' => $created,
            'skipped' => $skipped,
            'revision' => [
                'public_id' => $snapshot->public_id,
                'revision_hash' => $snapshot->revision_hash,
                'message' => $snapshot->message,
                'created_at' => $snapshot->created_at?->toIso8601String(),
            ],
        ]);
    }

    private function loadContent(PrivateStorageService $storage, ?string $storageKey): ?string
    {
        if ($storageKey === null) {
            return null;
        }

        return $storage->getContents($storageKey);
    }
}
