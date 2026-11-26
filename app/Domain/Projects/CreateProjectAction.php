<?php

namespace App\Domain\Projects;

use App\Domain\Administration\AuditService;
use App\Domain\Files\PathValidator;
use App\Domain\Revisions\CreateRevisionAction;
use App\Enums\BuildProfile;
use App\Enums\CompilerEngine;
use App\Models\Project;
use App\Models\ProjectFile;
use App\Models\Template;
use App\Models\User;
use App\Services\Storage\PrivateStorageService;
use Illuminate\Support\Facades\DB;

class CreateProjectAction
{
    public function __construct(
        private readonly PrivateStorageService $storage,
        private readonly PathValidator $pathValidator,
        private readonly CreateRevisionAction $createRevision,
        private readonly AuditService $audit,
    ) {}

    public function execute(
        User $owner,
        string $title,
        ?string $description = null,
        ?Template $template = null,
        ?CompilerEngine $engine = null,
    ): Project {
        return DB::transaction(function () use ($owner, $title, $description, $template, $engine): Project {
            $resolvedEngine = $engine ?? $template?->compiler_engine ?? CompilerEngine::PdfLaTeX;

            $project = Project::query()->create([
                'owner_id' => $owner->id,
                'title' => $title,
                'description' => $description,
                'root_file_path' => 'main.tex',
                'compiler_engine' => $resolvedEngine,
                'build_profile' => BuildProfile::Standard,
                'bibliography_tool' => 'biber',
                'auto_compile' => true,
                'storage_bytes' => 0,
            ]);

            $files = $template !== null
                ? $template->files_manifest
                : [
                    [
                        'path' => 'main.tex',
                        'content' => "\\documentclass[11pt]{article}\n\\usepackage{amsmath,amssymb}\n\n\\title{{$title}}\n\\author{{$owner->name}}\n\\date{\\today}\n\n\\begin{document}\n\\maketitle\n\n\\section{Introduction}\nStart writing your manuscript here.\n\n\\end{document}\n",
                    ],
                ];

            $totalBytes = 0;

            foreach ($files as $entry) {
                $path = $this->pathValidator->normalize($entry['path']);
                $stored = $this->storage->putProjectFile($project->public_id, $entry['content']);
                $totalBytes += $stored['size_bytes'];

                ProjectFile::query()->create([
                    'project_id' => $project->id,
                    'path' => $path,
                    'storage_key' => $stored['storage_key'],
                    'mime_type' => $this->pathValidator->inferMimeType($path),
                    'size_bytes' => $stored['size_bytes'],
                    'sha256_checksum' => $stored['sha256_checksum'],
                    'is_directory' => false,
                    'version' => 1,
                    'updated_by' => $owner->id,
                ]);
            }

            $project->update(['storage_bytes' => $totalBytes]);

            $this->createRevision->execute($project, $owner, 'Initial project snapshot');
            $this->audit->record('project.created', $owner, $project, $project, [
                'template_slug' => $template?->slug,
            ]);

            return $project;
        });
    }
}
