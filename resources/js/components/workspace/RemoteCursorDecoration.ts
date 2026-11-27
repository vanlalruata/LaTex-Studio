import * as monaco from 'monaco-editor';
import type { PresenceUser } from '@/composables/useWorkspacePresence';

export function buildRemoteCursorDecorations(
    users: PresenceUser[],
    currentFileId: string | null | undefined,
    currentUserId: number | null | undefined,
): monaco.editor.IModelDeltaDecoration[] {
    if (!currentFileId) {
        return [];
    }

    const decorations: monaco.editor.IModelDeltaDecoration[] = [];

    for (const user of users) {
        if (currentUserId !== undefined && currentUserId !== null && user.id === currentUserId) {
            continue;
        }

        if (!user.cursor || user.cursor.file_id !== currentFileId) {
            continue;
        }

        const line = Math.max(1, user.cursor.line);
        const col = Math.max(1, user.cursor.column);

        decorations.push({
            range: new monaco.Range(line, col, line, col + 1),
            options: {
                className: `remote-cursor-line remote-cursor-${user.color}`,
                beforeContentClassName: `remote-cursor-caret remote-cursor-caret-${user.color}`,
                hoverMessage: {
                    value: `**${user.name}** (line ${line}, col ${col})`,
                },
            },
        });
    }

    return decorations;
}
