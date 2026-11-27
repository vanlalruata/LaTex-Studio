<?php

use App\Models\Project;
use App\Models\User;
use Illuminate\Http\UploadedFile;

test('collaborator can create folder and upload binary files into that folder', function (): void {
    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);

    $this->actingAs($owner)
        ->postJson(route('projects.files.store', $project), [
            'path' => 'figures',
            'is_directory' => true,
        ])
        ->assertCreated()
        ->assertJsonPath('path', 'figures')
        ->assertJsonPath('is_directory', true);

    $image = UploadedFile::fake()->image('diagram.png', 120, 80);

    $uploadResponse = $this->actingAs($owner)
        ->post(route('projects.files.store', $project), [
            'path' => 'figures/diagram.png',
            'file' => $image,
        ], [
            'Accept' => 'application/json',
        ])
        ->assertCreated()
        ->assertJsonPath('path', 'figures/diagram.png')
        ->assertJsonPath('is_directory', false);

    $filePublicId = $uploadResponse->json('public_id');

    $this->actingAs($owner)
        ->getJson(route('projects.files.show', [$project, $filePublicId]))
        ->assertOk()
        ->assertJsonPath('path', 'figures/diagram.png');
});
