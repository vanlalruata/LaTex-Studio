<?php

namespace App\Http\Controllers;

use App\Domain\Administration\AuditService;
use App\Domain\Files\PathValidator;
use App\Domain\Projects\CreateProjectAction;
use App\Enums\CompilerEngine;
use App\Http\Requests\Projects\StoreProjectRequest;
use App\Http\Requests\Projects\UpdateProjectRequest;
use App\Models\Project;
use App\Models\Template;
use App\Services\Storage\PrivateStorageService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use ZipArchive;

class ProjectController extends Controller
{
    public function store(StoreProjectRequest $request, CreateProjectAction $action): RedirectResponse
    {
        $user = $request->user();
        abort_if($user === null, 401);

        $template = null;
        if ($request->filled('template_id')) {
            $template = Template::query()
                ->where('public_id', $request->string('template_id')->toString())
                ->first();
        }

        $engine = $request->filled('compiler_engine')
            ? CompilerEngine::from($request->string('compiler_engine')->toString())
            : null;

        $project = $action->execute(
            owner: $user,
            title: $request->string('title')->toString(),
            description: $request->input('description'),
            template: $template,
            engine: $engine,
        );

        return to_route('projects.show', $project);
    }

    public function show(Request $request, Project $project, PrivateStorageService $storage): Response
    {
        Gate::authorize('view', $project);

        $user = $request->user();
        abort_if($user === null, 401);

        $files = $project->files()
            ->orderByDesc('is_directory')
            ->orderBy('path')
            ->get();

        $activeFile = $files->firstWhere('path', $project->root_file_path)
            ?? $files->firstWhere('is_directory', false);

        $initialContent = '';
        if ($activeFile !== null && $activeFile->storage_key !== null) {
            $initialContent = $storage->getContents($activeFile->storage_key) ?? '';
        }

        $revisions = $project->revisions()
            ->with('creator:id,name')
            ->latest('created_at')
            ->limit(25)
            ->get()
            ->map(fn ($revision): array => [
                'public_id' => $revision->public_id,
                'revision_hash' => $revision->revision_hash,
                'message' => $revision->message,
                'creator_name' => $revision->creator->name ?? 'System',
                'created_at' => $revision->created_at?->toIso8601String(),
            ]);

        $latestCompilation = $project->compilations()
            ->with('diagnostics')
            ->latest('created_at')
            ->first();

        $buildHistory = $project->compilations()
            ->latest('created_at')
            ->limit(10)
            ->get()
            ->map(fn ($c): array => [
                'public_id' => $c->public_id,
                'status' => $c->status->value,
                'compiler_engine' => $c->compiler_engine->value,
                'duration_ms' => $c->duration_ms,
                'created_at' => $c->created_at?->toIso8601String(),
            ])
            ->values();

        return Inertia::render('Projects/Workspace', [
            'project' => [
                'public_id' => $project->public_id,
                'title' => $project->title,
                'description' => $project->description,
                'root_file_path' => $project->root_file_path,
                'compiler_engine' => $project->compiler_engine->value,
                'build_profile' => $project->build_profile->value,
                'bibliography_tool' => $project->bibliography_tool,
                'auto_compile' => $project->auto_compile,
                'storage_bytes' => $project->storage_bytes,
                'role' => $project->roleFor($user)->value ?? 'viewer',
                'can_edit' => $project->roleFor($user)?->canEdit() ?? false,
                'can_compile' => $project->roleFor($user)?->canCompile() ?? false,
                'last_successful_compilation_id' => $project->lastSuccessfulCompilation?->public_id,
            ],
            'files' => $files->map(fn ($file): array => [
                'public_id' => $file->public_id,
                'path' => $file->path,
                'mime_type' => $file->mime_type,
                'size_bytes' => $file->size_bytes,
                'is_directory' => $file->is_directory,
                'version' => $file->version,
            ])->values(),
            'activeFile' => $activeFile !== null ? [
                'public_id' => $activeFile->public_id,
                'path' => $activeFile->path,
                'mime_type' => $activeFile->mime_type,
                'version' => $activeFile->version,
                'content' => $initialContent,
            ] : null,
            'revisions' => $revisions,
            'latestCompilation' => $latestCompilation !== null ? [
                'public_id' => $latestCompilation->public_id,
                'status' => $latestCompilation->status->value,
                'compiler_engine' => $latestCompilation->compiler_engine->value,
                'duration_ms' => $latestCompilation->duration_ms,
                'error_summary' => $latestCompilation->error_summary,
                'created_at' => $latestCompilation->created_at?->toIso8601String(),
                'diagnostics' => $latestCompilation->diagnostics->map(fn ($d): array => [
                    'severity' => $d->severity->value,
                    'file_path' => $d->file_path,
                    'line' => $d->line,
                    'message' => $d->message,
                ])->values(),
            ] : null,
            'buildHistory' => $buildHistory,
        ]);
    }

    public function update(UpdateProjectRequest $request, Project $project, PathValidator $validator): RedirectResponse
    {
        Gate::authorize('update', $project);

        $data = $request->validated();
        if (isset($data['root_file_path'])) {
            $data['root_file_path'] = $validator->normalize($data['root_file_path']);
        }

        $project->update($data);

        return back();
    }

    public function destroy(Project $project, AuditService $audit, Request $request): RedirectResponse
    {
        Gate::authorize('delete', $project);

        $audit->record('project.deleted', $request->user(), $project, $project);
        $project->delete();

        return to_route('dashboard');
    }

    public function export(Project $project, PrivateStorageService $storage): BinaryFileResponse
    {
        Gate::authorize('export', $project);

        $tempPath = tempnam(sys_get_temp_dir(), 'ltxzip_');
        abort_if($tempPath === false, 500, 'Unable to create export archive.');

        $zip = new ZipArchive;
        abort_if($zip->open($tempPath, ZipArchive::OVERWRITE) !== true, 500, 'Unable to open export archive.');

        foreach ($project->files()->where('is_directory', false)->get() as $file) {
            if ($file->storage_key === null) {
                continue;
            }
            $contents = $storage->getContents($file->storage_key);
            if ($contents !== null) {
                $zip->addFromString($file->path, $contents);
            }
        }

        $zip->close();

        $filename = preg_replace('/[^a-zA-Z0-9_-]+/', '-', $project->title) ?: 'project';

        return response()->download($tempPath, "{$filename}.zip")->deleteFileAfterSend(true);
    }
}
