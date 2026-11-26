<?php

use App\Models\Project;
use App\Models\Template;
use App\Models\User;
use Database\Seeders\TemplateSeeder;

test('project index extracts labels, bibtex citation keys, and files for authorized members', function (): void {
    $this->seed(TemplateSeeder::class);
    $owner = User::factory()->create();
    $outsider = User::factory()->create();

    $template = Template::query()->where('slug', 'multifile-thesis-biber')->firstOrFail();

    $this->actingAs($owner)->post(route('projects.store'), [
        'title' => 'Thesis Index Test',
        'template_id' => $template->public_id,
    ]);

    $project = Project::query()->where('title', 'Thesis Index Test')->firstOrFail();

    $this->actingAs($owner)
        ->getJson(route('projects.index', $project))
        ->assertOk()
        ->assertJsonPath('citations.0', 'knuth1984texbook')
        ->assertJsonFragment(['main.tex'])
        ->assertJsonFragment(['references.bib']);

    $this->actingAs($outsider)
        ->getJson(route('projects.index', $project))
        ->assertForbidden();
});
