<?php

namespace App\Http\Controllers\Admin;

use App\Domain\Administration\AuditService;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateCompilerSettingsRequest;
use App\Services\Compiler\CompilerSettingsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CompilerSettingsController extends Controller
{
    public function index(CompilerSettingsService $settings): Response
    {
        return Inertia::render('Admin/CompilerSettings', [
            'settings' => $settings->all(),
            'health' => $settings->checkHealth(),
        ]);
    }

    public function update(
        UpdateCompilerSettingsRequest $request,
        CompilerSettingsService $settings,
        AuditService $audit,
    ): RedirectResponse {
        $previousDriver = $settings->driver();
        $validated = $request->validated();

        $validated['local_texlive_bin_path'] = (string) ($validated['local_texlive_bin_path'] ?? '');

        $settings->update($validated);

        $audit->record(
            action: 'compiler.settings_updated',
            user: $request->user(),
            metadata: [
                'previous_driver' => $previousDriver,
                'driver' => $validated['driver'],
                'docker_image' => $validated['docker_image'],
            ],
            ipAddress: $request->ip(),
        );

        return back()->with('success', 'Compiler settings updated.');
    }

    public function testCompile(Request $request, CompilerSettingsService $settings): JsonResponse
    {
        $validated = $request->validate([
            'driver' => ['nullable', Rule::in(['docker', 'local'])],
        ]);

        return response()->json(
            $settings->runTestCompilation($validated['driver'] ?? null)
        );
    }
}
