<?php

use App\DTOs\CompilationRequest;
use App\DTOs\CompilationResult;
use App\Enums\CompilationStatus;
use App\Models\BibliographySource;
use App\Models\Project;
use App\Models\User;
use App\Services\Compiler\LatexCompilerInterface;

test('compilation job writes references.bib from project bibliography sources into workspace', function (): void {
    $owner = User::factory()->create();

    $this->actingAs($owner)->post(route('projects.store'), [
        'title' => 'Bib Integration Paper',
    ]);

    $project = Project::query()->where('title', 'Bib Integration Paper')->firstOrFail();
    $project->files()->where('path', 'references.bib')->delete();

    BibliographySource::query()->create([
        'project_id' => $project->id,
        'added_by' => $owner->id,
        'provider' => 'manual',
        'key' => 'einstein1905',
        'title' => 'On the Electrodynamics of Moving Bodies',
        'authors' => ['Albert Einstein'],
        'year' => 1905,
        'venue' => 'Annalen der Physik',
    ]);

    $capturedBib = null;

    $this->app->bind(LatexCompilerInterface::class, function () use (&$capturedBib): LatexCompilerInterface {
        return new class($capturedBib) implements LatexCompilerInterface
        {
            public function __construct(private mixed &$capturedBib) {}

            public function compile(CompilationRequest $request): CompilationResult
            {
                $bibFile = $request->workspacePath.DIRECTORY_SEPARATOR.'src'.DIRECTORY_SEPARATOR.'references.bib';
                $this->capturedBib = is_file($bibFile) ? file_get_contents($bibFile) : null;

                return new CompilationResult(
                    status: CompilationStatus::Succeeded,
                    exitCode: 0,
                    durationMs: 100,
                    pdfContents: "%PDF-1.4\n%ok\n",
                );
            }
        };
    });

    $this->actingAs($owner)
        ->postJson(route('projects.compilations.store', $project))
        ->assertCreated();

    expect($capturedBib)->toBeString()
        ->toContain('@misc{einstein1905,')
        ->toContain('title = {On the Electrodynamics of Moving Bodies}');
});
