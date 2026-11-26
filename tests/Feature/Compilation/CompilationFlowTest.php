<?php

use App\DTOs\CompilationRequest;
use App\DTOs\CompilationResult;
use App\Enums\CompilationStatus;
use App\Models\Compilation;
use App\Models\Project;
use App\Models\User;
use App\Services\Compiler\LatexCompilerInterface;

test('compilation publishes valid PDF, streams private artifact, and preserves last successful PDF on later failure', function (): void {
    $owner = User::factory()->create();
    $outsider = User::factory()->create();

    $this->actingAs($owner)->post(route('projects.store'), [
        'title' => 'Reproducible Paper',
    ]);

    $project = Project::query()->where('title', 'Reproducible Paper')->firstOrFail();

    // 1. First build succeeds
    $this->app->bind(LatexCompilerInterface::class, fn (): LatexCompilerInterface => new class implements LatexCompilerInterface
    {
        public function compile(CompilationRequest $request): CompilationResult
        {
            return new CompilationResult(
                status: CompilationStatus::Succeeded,
                exitCode: 0,
                durationMs: 250,
                pdfContents: "%PDF-1.4\n%fake-valid-pdf\n",
                logContents: "This is pdfTeX\nOutput written on main.pdf (1 page).\n",
                synctexContents: 'synctex-data',
            );
        }
    });

    $firstResponse = $this->actingAs($owner)
        ->postJson(route('projects.compilations.store', $project))
        ->assertCreated();

    $firstId = $firstResponse->json('public_id');
    $firstCompilation = Compilation::query()->where('public_id', $firstId)->firstOrFail();
    $project->refresh();

    expect($firstCompilation->status)->toBe(CompilationStatus::Published)
        ->and($project->last_successful_compilation_id)->toBe($firstCompilation->id);

    // Owner can stream private PDF artifact with nosniff header
    $this->actingAs($owner)
        ->get(route('compilations.artifacts.show', [$firstCompilation, 'pdf']))
        ->assertOk()
        ->assertHeader('Content-Type', 'application/pdf')
        ->assertHeader('X-Content-Type-Options', 'nosniff');

    // Outsider is denied compilation trigger, status view, and artifact download (IDOR check)
    $this->actingAs($outsider)
        ->postJson(route('projects.compilations.store', $project))
        ->assertForbidden();

    $this->actingAs($outsider)
        ->getJson(route('compilations.show', $firstCompilation))
        ->assertForbidden();

    $this->actingAs($outsider)
        ->get(route('compilations.artifacts.show', [$firstCompilation, 'pdf']))
        ->assertForbidden();

    // 2. Second build fails with diagnostics -> previous successful PDF must remain intact
    $this->app->bind(LatexCompilerInterface::class, fn (): LatexCompilerInterface => new class implements LatexCompilerInterface
    {
        public function compile(CompilationRequest $request): CompilationResult
        {
            return new CompilationResult(
                status: CompilationStatus::Failed,
                exitCode: 1,
                durationMs: 120,
                pdfContents: null,
                logContents: "./main.tex:9: Undefined control sequence.\nl.9 \\brokenmacro\n",
                errorSummary: 'LaTeX compilation failed.',
            );
        }
    });

    $secondResponse = $this->actingAs($owner)
        ->postJson(route('projects.compilations.store', $project))
        ->assertCreated();

    $secondId = $secondResponse->json('public_id');
    $secondCompilation = Compilation::query()->where('public_id', $secondId)->firstOrFail();
    $project->refresh();

    expect($secondCompilation->status)->toBe(CompilationStatus::Failed)
        ->and($secondCompilation->diagnostics()->count())->toBe(1)
        ->and($project->last_successful_compilation_id)->toBe($firstCompilation->id);

    // Previous PDF artifact is still downloadable
    $this->actingAs($owner)
        ->get(route('compilations.artifacts.show', [$firstCompilation, 'pdf']))
        ->assertOk();
});
