<?php

namespace App\Events;

use App\Enums\CompilationStatus;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CompilationStatusChanged implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly string $projectPublicId,
        public readonly string $compilationPublicId,
        public readonly CompilationStatus $status,
        public readonly ?string $errorSummary = null,
        public readonly ?string $lastSuccessfulCompilationPublicId = null,
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
        return 'compilation.status.changed';
    }

    /**
     * @return array{
     *     public_id: string,
     *     status: string,
     *     is_terminal: bool,
     *     progress: int,
     *     error_summary: string|null,
     *     last_successful_compilation_id: string|null
     * }
     */
    public function broadcastWith(): array
    {
        $progress = match ($this->status) {
            CompilationStatus::Requested, CompilationStatus::Snapshotting, CompilationStatus::Queued => 10,
            CompilationStatus::Starting => 25,
            CompilationStatus::Compiling => 55,
            CompilationStatus::Validating => 85,
            CompilationStatus::Succeeded, CompilationStatus::Published, CompilationStatus::Failed, CompilationStatus::TimedOut, CompilationStatus::Cancelled => 100,
        };

        return [
            'public_id' => $this->compilationPublicId,
            'status' => $this->status->value,
            'is_terminal' => $this->status->isTerminal(),
            'progress' => $progress,
            'error_summary' => $this->errorSummary,
            'last_successful_compilation_id' => $this->lastSuccessfulCompilationPublicId,
        ];
    }
}
