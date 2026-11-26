<?php

namespace App\Enums;

enum ProjectRole: string
{
    case Owner = 'owner';
    case Editor = 'editor';
    case Reviewer = 'reviewer';
    case Commenter = 'commenter';
    case Viewer = 'viewer';

    public function canEdit(): bool
    {
        return match ($this) {
            self::Owner, self::Editor => true,
            default => false,
        };
    }

    public function canCompile(): bool
    {
        return $this->canEdit();
    }

    public function canComment(): bool
    {
        return match ($this) {
            self::Owner, self::Editor, self::Reviewer, self::Commenter => true,
            self::Viewer => false,
        };
    }

    public function canManage(): bool
    {
        return $this === self::Owner;
    }

    public function canExport(): bool
    {
        return match ($this) {
            self::Owner, self::Editor, self::Reviewer => true,
            self::Commenter, self::Viewer => false,
        };
    }
}
