<?php

use App\Events\UserCursorMoved;
use App\Events\UserPresenceUpdated;
use App\Models\Project;
use App\Models\ProjectFile;
use App\Models\User;
use Illuminate\Support\Facades\Event;

test('updating presence broadcasts presence and cursor events on project channel', function (): void {
    Event::fake([UserPresenceUpdated::class, UserCursorMoved::class]);

    $owner = User::factory()->create();
    $project = Project::factory()->create(['owner_id' => $owner->id]);
    $file = ProjectFile::query()->create([
        'project_id' => $project->id,
        'path' => 'main.tex',
        'mime_type' => 'text/x-tex',
        'size_bytes' => 10,
        'is_directory' => false,
        'version' => 1,
    ]);

    $this->actingAs($owner)
        ->postJson(route('projects.presence.store', $project), [
            'file_id' => $file->public_id,
            'line' => 14,
            'column' => 5,
        ])
        ->assertOk()
        ->assertJsonCount(1, 'users');

    Event::assertDispatched(UserPresenceUpdated::class, function (UserPresenceUpdated $event) use ($project): bool {
        return $event->projectPublicId === $project->public_id
            && $event->broadcastAs() === 'presence.updated'
            && count($event->users) === 1;
    });

    Event::assertDispatched(UserCursorMoved::class, function (UserCursorMoved $event) use ($project, $owner): bool {
        return $event->projectPublicId === $project->public_id
            && $event->userId === $owner->id
            && $event->cursor['line'] === 14
            && $event->cursor['column'] === 5;
    });
});
