<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ResearchAsset;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class ResearchAssetController extends Controller
{
    public function index(Request $request, Project $project): JsonResponse
    {
        Gate::authorize('view', $project);

        $query = $project->researchAssets()
            ->with('author:id,name')
            ->latest('created_at');

        $kind = $request->query('kind');
        if (is_string($kind) && in_array($kind, ['figure', 'table', 'equation'], true)) {
            $query->where('kind', $kind);
        }

        $assets = $query->limit(200)->get()->map(
            fn (ResearchAsset $asset): array => $this->payload($asset)
        )->values();

        return response()->json(['assets' => $assets]);
    }

    public function store(Request $request, Project $project): JsonResponse
    {
        Gate::authorize('editFiles', $project);

        $validated = $request->validate([
            'kind' => ['required', Rule::in(['figure', 'table', 'equation'])],
            'title' => ['required', 'string', 'max:255'],
            'label' => ['nullable', 'string', 'max:120'],
            'caption' => ['nullable', 'string', 'max:2000'],
            'payload' => ['required', 'array'],
            'status' => ['nullable', Rule::in(['draft', 'ready'])],
        ]);

        $asset = $project->researchAssets()->create([
            'created_by' => $request->user()?->id,
            'kind' => $validated['kind'],
            'title' => $validated['title'],
            'label' => $validated['label'] ?? null,
            'caption' => $validated['caption'] ?? null,
            'payload' => $validated['payload'],
            'status' => $validated['status'] ?? 'draft',
        ]);

        $asset->load('author:id,name');

        return response()->json(['asset' => $this->payload($asset)], 201);
    }

    public function destroy(Project $project, ResearchAsset $asset): JsonResponse
    {
        Gate::authorize('editFiles', $project);
        abort_unless($asset->project_id === $project->id, 404);

        $asset->delete();

        return response()->json(['deleted' => true]);
    }

    /**
     * @return array<string, mixed>
     */
    private function payload(ResearchAsset $asset): array
    {
        return [
            'public_id' => $asset->public_id,
            'kind' => $asset->kind,
            'title' => $asset->title,
            'label' => $asset->label,
            'caption' => $asset->caption,
            'payload' => $asset->payload,
            'status' => $asset->status,
            'author_name' => $asset->author?->name,
            'created_at' => $asset->created_at?->toIso8601String(),
        ];
    }
}
