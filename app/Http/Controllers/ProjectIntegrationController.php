<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ProjectIntegration;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;

class ProjectIntegrationController extends Controller
{
    private const PROVIDERS = ['github', 'zotero', 'slack', 'overleaf', 'custom'];

    private const STATUSES = ['disconnected', 'connected', 'error'];

    public function index(Project $project): JsonResponse
    {
        Gate::authorize('view', $project);

        $integrations = $project->integrations()
            ->with('connector:id,name')
            ->orderBy('provider')
            ->get()
            ->map(fn (ProjectIntegration $integration): array => $this->payload($integration))
            ->values();

        return response()->json(['integrations' => $integrations]);
    }

    public function store(Request $request, Project $project): JsonResponse
    {
        Gate::authorize('editFiles', $project);

        $validated = $request->validate([
            'provider' => ['required', Rule::in(self::PROVIDERS)],
            'label' => ['required', 'string', 'max:120'],
            'status' => ['nullable', Rule::in(self::STATUSES)],
            'config' => ['nullable', 'array'],
            'config.*' => ['nullable', 'string', 'max:2000'],
        ]);

        $exists = $project->integrations()
            ->where('provider', $validated['provider'])
            ->exists();

        abort_if($exists, 422, 'This integration provider is already configured for the project.');

        $status = $validated['status'] ?? 'disconnected';

        $integration = $project->integrations()->create([
            'provider' => $validated['provider'],
            'label' => $validated['label'],
            'status' => $status,
            'config' => $validated['config'] ?? null,
            'last_synced_at' => $status === 'connected' ? now() : null,
            'connected_by' => $request->user()?->id,
        ]);

        $integration->load('connector:id,name');

        return response()->json(['integration' => $this->payload($integration)], 201);
    }

    public function update(Request $request, Project $project, ProjectIntegration $integration): JsonResponse
    {
        Gate::authorize('editFiles', $project);
        abort_unless($integration->project_id === $project->id, 404);

        $validated = $request->validate([
            'label' => ['sometimes', 'required', 'string', 'max:120'],
            'status' => ['sometimes', Rule::in(self::STATUSES)],
            'config' => ['nullable', 'array'],
            'config.*' => ['nullable', 'string', 'max:2000'],
        ]);

        if (isset($validated['status'])) {
            $validated['last_synced_at'] = $validated['status'] === 'connected' ? now() : null;
            $validated['connected_by'] = $request->user()?->id;
        }

        $integration->update($validated);
        $integration->load('connector:id,name');

        return response()->json(['integration' => $this->payload($integration)]);
    }

    public function destroy(Project $project, ProjectIntegration $integration): JsonResponse
    {
        Gate::authorize('editFiles', $project);
        abort_unless($integration->project_id === $project->id, 404);

        $integration->delete();

        return response()->json(['deleted' => true]);
    }

    /**
     * Mask secret-looking configuration values before sending them to the browser.
     *
     * @return array<string, mixed>
     */
    private function payload(ProjectIntegration $integration): array
    {
        $config = $integration->config ?? [];
        $masked = [];

        foreach ($config as $key => $value) {
            $isSecret = is_string($key) && preg_match('/token|secret|password|key/i', $key) === 1;
            $masked[$key] = $isSecret && is_string($value) && $value !== '' ? '••••••••' : $value;
        }

        return [
            'public_id' => $integration->public_id,
            'provider' => $integration->provider,
            'label' => $integration->label,
            'status' => $integration->status,
            'config' => (object) $masked,
            'last_synced_at' => $integration->last_synced_at?->toIso8601String(),
            'connected_by_name' => $integration->connector?->name,
            'created_at' => $integration->created_at?->toIso8601String(),
        ];
    }
}
