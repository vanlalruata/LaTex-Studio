<?php

use App\Models\Project;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

beforeEach(function (): void {
    Storage::fake('local');
});

test('a revision can be inspected, diffed against current state, and restored', function (): void {
    $owner = User::factory()->create();
    $outsider = User::factory()->create();

    $this->actingAs($owner)
        ->post(route('projects.store'), ['title' => 'Revision demo'])
        ->assertRedirect();

    $project = Project::query()->latest('id')->firstOrFail();
    $file = $project->files()->where('path', 'main.tex')->firstOrFail();

    $original = $this->actingAs($owner)
        ->getJson(route('projects.files.show', [$project, $file]))
        ->assertOk()
        ->json('content');

    $baseline = $this->actingAs($owner)
        ->postJson(route('projects.revisions.store', $project), ['message' => 'Baseline'])
        ->assertCreated();

    $baselineId = $baseline->json('public_id');

    $this->actingAs($owner)
        ->getJson(route('projects.revisions.show', [$project, $baselineId]))
        ->assertOk()
        ->assertJsonPath('revision.files.0.path', 'main.tex');

    $updatedContent = "\\documentclass{article}\n\\begin{document}\nUpdated body.\n\\end{document}";

    $this->actingAs($owner)
        ->putJson(route('projects.files.update', [$project, $file]), ['content' => $updatedContent])
        ->assertOk();

    $editedRevision = $this->actingAs($owner)
        ->postJson(route('projects.revisions.store', $project), ['message' => 'Edited'])
        ->assertCreated()
        ->json('public_id');

    $diff = $this->actingAs($owner)
        ->getJson(route('projects.revisions.diff', [$project, $baselineId]))
        ->assertOk()
        ->assertJsonPath('counts.modified', 1)
        ->assertJsonPath('files.0.path', 'main.tex')
        ->assertJsonPath('files.0.status', 'modified')
        ->assertJsonPath('files.0.text_available', true);

    expect($diff->json('files.0.before'))->toBe($original)
        ->and($diff->json('files.0.after'))->toBe($updatedContent);

    $this->actingAs($owner)
        ->getJson(route('projects.revisions.diff', [$project, $editedRevision]).'?against='.$baselineId)
        ->assertOk()
        ->assertJsonPath('counts.modified', 1)
        ->assertJsonPath('against.revision_hash', $baseline->json('revision_hash'));

    $this->actingAs($owner)
        ->postJson(route('projects.revisions.restore', [$project, $baselineId]))
        ->assertOk()
        ->assertJsonPath('restored', 1)
        ->assertJsonPath('created', 0)
        ->assertJsonPath('skipped', 0);

    $restored = $this->actingAs($owner)
        ->getJson(route('projects.files.show', [$project, $file]))
        ->assertOk()
        ->json('content');

    expect($restored)->toBe($original);

    $history = $this->actingAs($owner)
        ->getJson(route('projects.revisions.index', $project))
        ->assertOk()
        ->assertJsonCount(3, 'revisions');

    $messages = collect($history->json('revisions'))->pluck('message');

    expect($messages)
        ->toContain('Edited')
        ->toContain('Initial project snapshot')
        ->and($messages->contains(fn (?string $message): bool => str_starts_with((string) $message, 'Restored snapshot')))->toBeTrue();

    $this->actingAs($outsider)
        ->getJson(route('projects.revisions.diff', [$project, $baselineId]))
        ->assertForbidden();
});
