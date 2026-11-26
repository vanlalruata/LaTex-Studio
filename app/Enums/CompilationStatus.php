<?php

namespace App\Enums;

enum CompilationStatus: string
{
    case Requested = 'requested';
    case Snapshotting = 'snapshotting';
    case Queued = 'queued';
    case Starting = 'starting';
    case Compiling = 'compiling';
    case Validating = 'validating';
    case Succeeded = 'succeeded';
    case Failed = 'failed';
    case TimedOut = 'timed_out';
    case Cancelled = 'cancelled';
    case Published = 'published';

    public function isTerminal(): bool
    {
        return match ($this) {
            self::Published, self::Failed, self::TimedOut, self::Cancelled => true,
            default => false,
        };
    }
}
