<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class UserPresenceUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * @param  list<array{id: int, name: string, color: string, cursor: array<string, mixed>|null}>  $users
     */
    public function __construct(
        public readonly string $projectPublicId,
        public readonly array $users,
    ) {}

    /**
     * @return list<PrivateChannel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("project.{$this->projectPublicId}.presence"),
        ];
    }

    public function broadcastAs(): string
    {
        return 'presence.updated';
    }

    /**
     * @return array{users: list<array{id: int, name: string, color: string, cursor: array<string, mixed>|null}>}
     */
    public function broadcastWith(): array
    {
        return [
            'users' => $this->users,
        ];
    }
}
