<?php

namespace Database\Seeders;

use App\Domain\Files\PathValidator;
use App\Enums\BuildProfile;
use App\Enums\CompilerEngine;
use App\Enums\ProjectRole;
use App\Models\Organization;
use App\Models\Project;
use App\Models\ProjectFile;
use App\Models\ProjectMember;
use App\Models\ProjectRevision;
use App\Models\Template;
use App\Models\User;
use App\Services\Storage\PrivateStorageService;
use Illuminate\Database\Seeder;

class ProjectSeeder extends Seeder
{
    public function run(): void
    {
        $researcher = User::query()->where('email', 'researcher@latexstudio.com')->first();
        $coauthor = User::query()->where('email', 'coauthor@latexstudio.com')->first();

        if ($researcher === null) {
            return;
        }

        $organization = Organization::query()->firstOrCreate(
            ['slug' => 'reaslab-research'],
            ['name' => 'ReasLab Research Group']
        );

        $organization->members()->syncWithoutDetaching([
            $researcher->id => ['role' => 'owner'],
        ]);

        if ($coauthor !== null) {
            $organization->members()->syncWithoutDetaching([
                $coauthor->id => ['role' => 'member'],
            ]);
        }

        $project = Project::query()->firstOrCreate(
            [
                'owner_id' => $researcher->id,
                'title' => 'A Reproducible LaTeX Workflow',
            ],
            [
                'organization_id' => $organization->id,
                'description' => 'Demonstration manuscript for reproducible research writing.',
                'root_file_path' => 'main.tex',
                'compiler_engine' => CompilerEngine::PdfLaTeX,
                'build_profile' => BuildProfile::Standard,
                'bibliography_tool' => 'biber',
                'auto_compile' => true,
            ]
        );

        if ($coauthor !== null) {
            ProjectMember::query()->firstOrCreate(
                [
                    'project_id' => $project->id,
                    'user_id' => $coauthor->id,
                ],
                [
                    'role' => ProjectRole::Editor,
                    'invited_by' => $researcher->id,
                ]
            );
        }

        if ($project->files()->count() > 0) {
            return;
        }

        $template = Template::query()->where('slug', 'basic-research-article')->first();
        $files = $template !== null
            ? $template->files_manifest
            : [
                ['path' => 'main.tex', 'content' => "\\documentclass{article}\n\\begin{document}\nHello.\n\\end{document}\n"],
            ];

        $storage = app(PrivateStorageService::class);
        $validator = app(PathValidator::class);
        $manifest = [];
        $totalBytes = 0;

        foreach ($files as $entry) {
            $path = $validator->normalize($entry['path']);
            $stored = $storage->putProjectFile($project->public_id, $entry['content']);
            $totalBytes += $stored['size_bytes'];

            ProjectFile::query()->create([
                'project_id' => $project->id,
                'path' => $path,
                'storage_key' => $stored['storage_key'],
                'mime_type' => $validator->inferMimeType($path),
                'size_bytes' => $stored['size_bytes'],
                'sha256_checksum' => $stored['sha256_checksum'],
                'is_directory' => false,
                'version' => 1,
                'updated_by' => $researcher->id,
            ]);

            $manifest[$path] = $stored['sha256_checksum'];
        }

        ksort($manifest);
        $revisionHash = hash('sha256', (string) json_encode($manifest));

        ProjectRevision::query()->create([
            'project_id' => $project->id,
            'created_by' => $researcher->id,
            'revision_hash' => $revisionHash,
            'manifest' => $manifest,
            'message' => 'Initial seeded project revision',
        ]);

        $project->update(['storage_bytes' => $totalBytes]);
    }
}
