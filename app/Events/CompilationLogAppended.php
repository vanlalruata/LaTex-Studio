<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CompilationLogAppended implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly string $projectPublicId,
        public readonly string $compilationPublicId,
        public readonly string $chunk,
    ) {}

    /**
     * @return list<PrivateChannel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("project.{$this->projectPublicId}.compilations"),
        ];
    }

    public function broadcastAs(): string
    {
        return 'compilation.log.appended';
    }

    /**
     * @return array{public_id: string, chunk: string}
     */
    public function broadcastWith(): array
    {
        return [
            'public_id' => $this->compilationPublicId,
            'chunk' => $this->chunk,
        ];
    }
}
