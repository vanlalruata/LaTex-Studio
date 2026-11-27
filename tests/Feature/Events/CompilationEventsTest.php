<?php

use App\DTOs\CompilationRequest;
use App\DTOs\CompilationResult;
use App\Enums\CompilationStatus;
use App\Events\CompilationLogAppended;
use App\Events\CompilationStatusChanged;
use App\Models\Project;
use App\Models\User;
use App\Services\Compiler\LatexCompilerInterface;
use Illuminate\Support\Facades\Event;

test('compilation job broadcasts status transitions on project channel', function (): void {
    Event::fake([CompilationStatusChanged::class]);

    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);

    $this->app->bind(LatexCompilerInterface::class, fn (): LatexCompilerInterface => new class implements LatexCompilerInterface
    {
        public function compile(CompilationRequest $request): CompilationResult
        {
            return new CompilationResult(
                status: CompilationStatus::Succeeded,
                exitCode: 0,
                durationMs: 120,
                pdfContents: "%PDF-1.4\n%ok\n",
                logContents: "Output written on main.pdf\n",
            );
        }
    });

    $this->actingAs($owner)
        ->postJson(route('projects.compilations.store', $project))
        ->assertCreated();

    $statuses = [];
    Event::assertDispatched(CompilationStatusChanged::class, function (CompilationStatusChanged $event) use (&$statuses, $project): bool {
        if ($event->projectPublicId === $project->public_id) {
            $statuses[] = $event->status;
        }

        return true;
    });

    expect($statuses)->toContain(
        CompilationStatus::Starting,
        CompilationStatus::Compiling,
        CompilationStatus::Validating,
        CompilationStatus::Published,
    );
});

test('compilation status event payload includes progress and terminal flags', function (): void {
    $event = new CompilationStatusChanged(
        projectPublicId: 'proj-uuid',
        compilationPublicId: 'comp-uuid',
        status: CompilationStatus::Compiling,
    );

    expect($event->broadcastAs())->toBe('compilation.status.changed')
        ->and($event->broadcastOn()[0]->name)->toBe('private-project.proj-uuid.compilations')
        ->and($event->broadcastWith())->toMatchArray([
            'public_id' => 'comp-uuid',
            'status' => 'compiling',
            'is_terminal' => false,
            'progress' => 55,
        ]);

    $logEvent = new CompilationLogAppended('proj-uuid', 'comp-uuid', 'Pass 1...');
    expect($logEvent->broadcastAs())->toBe('compilation.log.appended')
        ->and($logEvent->broadcastWith())->toBe([
            'public_id' => 'comp-uuid',
            'chunk' => 'Pass 1...',
        ]);
});
