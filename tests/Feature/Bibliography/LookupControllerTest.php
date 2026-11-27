<?php

use App\Models\Project;
use App\Models\User;
use Illuminate\Support\Facades\Http;

test('project member can lookup doi, import bibtex, and export bibtex', function (): void {
    $owner = User::factory()->create();
    $outsider = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);

    Http::fake([
        'doi.org/*' => Http::response(
            "@article{einstein1905,\n  title={On the Electrodynamics of Moving Bodies},\n  author={Einstein, Albert},\n  year={1905},\n  journal={Annalen der Physik}\n}",
            200,
        ),
    ]);

    $this->actingAs($owner)
        ->postJson(route('projects.bibliography.lookup', $project), [
            'provider' => 'doi',
            'query' => '10.1002/andp.19053221004',
        ])
        ->assertOk()
        ->assertJsonPath('results.0.title', 'On the Electrodynamics of Moving Bodies');

    $this->actingAs($outsider)
        ->postJson(route('projects.bibliography.lookup', $project), [
            'provider' => 'doi',
            'query' => '10.1002/andp.19053221004',
        ])
        ->assertForbidden();

    $this->actingAs($owner)
        ->postJson(route('projects.bibliography.import', $project), [
            'bibtex' => "@article{knuth1984,\n  title={The TeXbook},\n  author={Knuth, Donald E.},\n  year={1984}\n}",
        ])
        ->assertCreated()
        ->assertJsonPath('imported_count', 1);

    $this->actingAs($owner)
        ->get(route('projects.bibliography.export', $project))
        ->assertOk()
        ->assertHeader('Content-Type', 'application/x-bibtex; charset=utf-8')
        ->assertSee('@article{knuth1984,', false);
});
