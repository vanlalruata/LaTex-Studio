<?php

namespace App\Http\Controllers;

use App\Domain\Collaboration\ConflictDetectionService;
use App\Domain\Files\PathValidator;
use App\Domain\Files\SaveProjectFileAction;
use App\Http\Requests\Projects\StoreProjectFileRequest;
use App\Http\Requests\Projects\UpdateProjectFileRequest;
use App\Models\Project;
use App\Models\ProjectFile;
use App\Services\Storage\PrivateStorageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Gate;
use InvalidArgumentException;

class ProjectFileController extends Controller
{
    public function show(Project $project, ProjectFile $file, PrivateStorageService $storage): JsonResponse
    {
        Gate::authorize('view', $project);
        abort_unless($file->project_id === $project->id, 404);

        $contents = '';
        if (! $file->is_directory && $file->storage_key !== null) {
            $raw = $storage->getContents($file->storage_key) ?? '';
            $contents = mb_check_encoding($raw, 'UTF-8') ? $raw : '';
        }

        return response()->json([
            'public_id' => $file->public_id,
            'path' => $file->path,
            'mime_type' => $file->mime_type,
            'is_directory' => $file->is_directory,
            'version' => $file->version,
            'content' => $contents,
        ]);
    }

    public function store(
        StoreProjectFileRequest $request,
        Project $project,
        PathValidator $validator,
        PrivateStorageService $storage,
    ): JsonResponse {
        Gate::authorize('editFiles', $project);

        $user = $request->user();
        abort_if($user === null, 401);

        try {
            $path = $validator->normalize($request->string('path')->toString());
        } catch (InvalidArgumentException $exception) {
            return response()->json(['message' => $exception->getMessage()], 422);
        }

        if ($project->files()->where('path', $path)->exists()) {
            return response()->json(['message' => 'A file already exists at this path.'], 422);
        }

        $isDirectory = $request->boolean('is_directory', false);
        $uploadedFile = $request->file('file');

        if ($uploadedFile instanceof UploadedFile) {
            $isDirectory = false;
            $contents = (string) file_get_contents($uploadedFile->getRealPath());
        } else {
            $contents = $isDirectory ? '' : (string) ($request->input('content') ?? '');
        }

        $storageKey = null;
        $checksum = null;
        $sizeBytes = 0;

        if (! $isDirectory) {
            $stored = $storage->putProjectFile($project->public_id, $contents);
            $storageKey = $stored['storage_key'];
            $checksum = $stored['sha256_checksum'];
            $sizeBytes = $stored['size_bytes'];
        }

        $mimeType = $isDirectory ? 'inode/directory' : $validator->inferMimeType($path);
        if (! $isDirectory && $uploadedFile instanceof UploadedFile && $mimeType === 'application/octet-stream') {
            $mimeType = $uploadedFile->getClientMimeType() ?: $mimeType;
        }

        $file = ProjectFile::query()->create([
            'project_id' => $project->id,
            'path' => $path,
            'storage_key' => $storageKey,
            'mime_type' => $mimeType,
            'size_bytes' => $sizeBytes,
            'sha256_checksum' => $checksum,
            'is_directory' => $isDirectory,
            'version' => 1,
            'updated_by' => $user->id,
        ]);

        if ($sizeBytes > 0) {
            $project->increment('storage_bytes', $sizeBytes);
        }

        return response()->json([
            'public_id' => $file->public_id,
            'path' => $file->path,
            'mime_type' => $file->mime_type,
            'size_bytes' => $file->size_bytes,
            'is_directory' => $file->is_directory,
            'version' => $file->version,
            'content' => (! $isDirectory && mb_check_encoding($contents, 'UTF-8')) ? $contents : '',
        ], 201);
    }

    public function update(
        UpdateProjectFileRequest $request,
        Project $project,
        ProjectFile $file,
        SaveProjectFileAction $action,
        ConflictDetectionService $conflictDetection,
    ): JsonResponse {
        Gate::authorize('editFiles', $project);
        abort_unless($file->project_id === $project->id, 404);
        abort_if($file->is_directory, 422, 'Cannot write content to a directory.');

        $user = $request->user();
        abort_if($user === null, 401);

        $expectedVersion = $request->filled('expected_version')
            ? $request->integer('expected_version')
            : null;
        $baseSha256 = $request->filled('base_sha256')
            ? (string) $request->input('base_sha256')
            : null;

        $conflict = $conflictDetection->check($file, $expectedVersion, $baseSha256);
        if ($conflict['has_conflict']) {
            return response()->json([
                'message' => 'File has been modified in a newer revision.',
                'server_version' => $conflict['server_version'],
                'server_sha256' => $conflict['server_sha256'],
                'server_content' => $conflict['server_content'],
                'updated_by_name' => $conflict['updated_by_name'],
            ], 409);
        }

        $updated = $action->execute(
            project: $project,
            file: $file,
            contents: (string) $request->input('content'),
            actor: $user,
            expectedVersion: $expectedVersion,
        );

        return response()->json([
            'public_id' => $updated->public_id,
            'path' => $updated->path,
            'version' => $updated->version,
            'sha256_checksum' => $updated->sha256_checksum,
            'size_bytes' => $updated->size_bytes,
        ]);
    }

    public function destroy(Project $project, ProjectFile $file, PrivateStorageService $storage): JsonResponse
    {
        Gate::authorize('editFiles', $project);
        abort_unless($file->project_id === $project->id, 404);

        if ($file->storage_key !== null) {
            $storage->delete($file->storage_key);
        }

        $size = $file->size_bytes;
        $file->delete();

        if ($size > 0) {
            $project->update([
                'storage_bytes' => max(0, $project->storage_bytes - $size),
            ]);
        }

        return response()->json(['deleted' => true]);
    }
}
