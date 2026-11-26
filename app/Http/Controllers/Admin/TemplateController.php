<?php

namespace App\Http\Controllers\Admin;

use App\Domain\Files\PathValidator;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTemplateRequest;
use App\Http\Requests\Admin\UpdateTemplateRequest;
use App\Models\AuditEvent;
use App\Models\Template;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TemplateController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Templates', [
            'templates' => Template::query()
                ->with('organization:id,name')
                ->orderBy('title')
                ->get(),
            'engines' => [
                ['value' => 'pdflatex', 'label' => 'pdfLaTeX'],
                ['value' => 'xelatex', 'label' => 'XeLaTeX'],
                ['value' => 'lualatex', 'label' => 'LuaLaTeX'],
            ],
        ]);
    }

    public function store(StoreTemplateRequest $request, PathValidator $paths): RedirectResponse
    {
        $data = $request->validated();
        $data['files_manifest'] = $this->normalizeManifest($data['files_manifest'], $paths);
        $template = Template::query()->create($data);

        $this->audit($request, 'template.created', $template);

        return back()->with('success', 'Template created.');
    }

    public function update(
        UpdateTemplateRequest $request,
        Template $template,
        PathValidator $paths,
    ): RedirectResponse {
        $data = $request->validated();
        $data['files_manifest'] = $this->normalizeManifest($data['files_manifest'], $paths);
        $template->update($data);

        $this->audit($request, 'template.updated', $template);

        return back()->with('success', 'Template updated.');
    }

    public function destroy(Request $request, Template $template): RedirectResponse
    {
        $templateId = $template->id;
        $slug = $template->slug;
        $template->delete();

        AuditEvent::query()->create([
            'user_id' => $request->user()?->id,
            'action' => 'template.deleted',
            'subject_type' => Template::class,
            'subject_id' => $templateId,
            'metadata' => ['slug' => $slug],
            'ip_address' => $request->ip(),
        ]);

        return back()->with('success', 'Template deleted.');
    }

    /**
     * @param  list<array{path: string, content: string}>  $manifest
     * @return list<array{path: string, content: string}>
     */
    private function normalizeManifest(array $manifest, PathValidator $paths): array
    {
        return array_values(array_map(
            static fn (array $file): array => [
                'path' => $paths->normalize($file['path']),
                'content' => $file['content'],
            ],
            $manifest,
        ));
    }

    private function audit(Request $request, string $action, Template $template): void
    {
        AuditEvent::query()->create([
            'user_id' => $request->user()?->id,
            'action' => $action,
            'subject_type' => Template::class,
            'subject_id' => $template->id,
            'metadata' => [
                'slug' => $template->slug,
                'is_public' => $template->is_public,
            ],
            'ip_address' => $request->ip(),
        ]);
    }
}
