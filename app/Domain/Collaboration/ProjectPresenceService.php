<?php

namespace App\Domain\Collaboration;

use App\Events\UserCursorMoved;
use App\Events\UserPresenceUpdated;
use App\Models\Project;
use App\Models\User;
use Illuminate\Support\Facades\Cache;

class ProjectPresenceService
{
    private const ONLINE_WINDOW_SECONDS = 60;

    /**
     * @param  array{file_id: string, line: int, column: int, file_path?: string|null}|null  $cursor
     */
    public function touch(Project $project, User $user, ?array $cursor = null): void
    {
        $key = $this->key($project);
        $presence = $this->entries($project);
        $now = time();

        $existing = $presence[$user->id] ?? [
            'id' => $user->id,
            'name' => $user->name,
            'color' => $this->colorFor($user->id),
            'cursor' => null,
        ];

        $presence[$user->id] = [
            'id' => $user->id,
            'name' => $user->name,
            'color' => $this->colorFor($user->id),
            'last_seen' => $now,
            'cursor' => $cursor ?? $existing['cursor'],
        ];

        $presence = array_filter(
            $presence,
            static fn (array $entry): bool => ($now - $entry['last_seen']) <= self::ONLINE_WINDOW_SECONDS
        );

        Cache::put($key, $presence, now()->addMinutes(2));

        UserPresenceUpdated::dispatch($project->public_id, $this->online($project));

        if ($cursor !== null) {
            UserCursorMoved::dispatch(
                $project->public_id,
                $user->id,
                $user->name,
                $this->colorFor($user->id),
                $cursor,
            );
        }
    }

    /**
     * @return list<array{id: int, name: string, color: string, cursor: array<string, mixed>|null}>
     */
    public function online(Project $project): array
    {
        $now = time();

        $online = array_values(array_map(
            static fn (array $entry): array => [
                'id' => $entry['id'],
                'name' => $entry['name'],
                'color' => $entry['color'],
                'cursor' => $entry['cursor'],
            ],
            array_filter(
                $this->entries($project),
                static fn (array $entry): bool => ($now - $entry['last_seen']) <= self::ONLINE_WINDOW_SECONDS
            )
        ));

        usort($online, static fn (array $a, array $b): int => $a['id'] <=> $b['id']);

        return $online;
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    private function entries(Project $project): array
    {
        /** @var array<int, array<string, mixed>> $presence */
        $presence = Cache::get($this->key($project), []);

        return $presence;
    }

    private function key(Project $project): string
    {
        return "project.presence.{$project->id}";
    }

    private function colorFor(int $userId): string
    {
        $palette = ['indigo', 'emerald', 'amber', 'rose', 'sky', 'violet'];

        return $palette[$userId % count($palette)];
    }
}
