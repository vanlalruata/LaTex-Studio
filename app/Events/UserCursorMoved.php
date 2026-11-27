<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class UserCursorMoved implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * @param  array{file_id: string, line: int, column: int, file_path?: string|null}  $cursor
     */
    public function __construct(
        public readonly string $projectPublicId,
        public readonly int $userId,
        public readonly string $name,
        public readonly string $color,
        public readonly array $cursor,
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
        return 'cursor.moved';
    }

    /**
     * @return array{
     *     user_id: int,
     *     name: string,
     *     color: string,
     *     cursor: array{file_id: string, line: int, column: int, file_path?: string|null}
     * }
     */
    public function broadcastWith(): array
    {
        return [
            'user_id' => $this->userId,
            'name' => $this->name,
            'color' => $this->color,
            'cursor' => $this->cursor,
        ];
    }
}
