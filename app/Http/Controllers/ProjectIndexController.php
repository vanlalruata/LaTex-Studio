<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Services\Storage\PrivateStorageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class ProjectIndexController extends Controller
{
    public function __invoke(Project $project, PrivateStorageService $storage): JsonResponse
    {
        Gate::authorize('view', $project);

        $files = $project->files()
            ->where('is_directory', false)
            ->orderBy('path')
            ->get(['path', 'storage_key']);

        $labels = [];
        $citations = [];
        $bibContents = [];

        foreach ($files as $file) {
            if ($file->storage_key === null) {
                continue;
            }

            $ext = strtolower(pathinfo($file->path, PATHINFO_EXTENSION));
            if (! in_array($ext, ['tex', 'ltx', 'bib'], true)) {
                continue;
            }

            $content = $storage->getContents($file->storage_key);
            if ($content === null) {
                continue;
            }

            if (in_array($ext, ['tex', 'ltx'], true)) {
                if (preg_match_all('/\\\\label\{([^}]+)\}/', $content, $matches) > 0) {
                    foreach ($matches[1] as $label) {
                        $labels[] = trim($label);
                    }
                }
            }

            if ($ext === 'bib') {
                $bibContents[] = $content;
                if (preg_match_all('/@[a-zA-Z]+\s*\{\s*([^,\s]+)\s*,/', $content, $matches) > 0) {
                    foreach ($matches[1] as $key) {
                        $citations[] = trim($key);
                    }
                }
            }
        }

        return response()->json([
            'labels' => array_values(array_unique($labels)),
            'citations' => array_values(array_unique($citations)),
            'files' => $files->pluck('path')->values(),
            'bib_source' => implode("\n\n", $bibContents),
        ]);
    }
}
