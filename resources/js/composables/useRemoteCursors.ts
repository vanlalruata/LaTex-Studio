import type * as monaco from 'monaco-editor';
import { type Ref, watch } from 'vue';
import { buildRemoteCursorDecorations } from '@/components/workspace/RemoteCursorDecoration';
import type { PresenceUser } from '@/composables/useWorkspacePresence';

export function useRemoteCursors(
    getEditor: () => monaco.editor.IStandaloneCodeEditor | null,
    remoteCursors: Ref<PresenceUser[] | undefined>,
    currentFileId: Ref<string | null | undefined>,
    currentUserId: Ref<number | null | undefined>,
) {
    let decorationIds: string[] = [];

    function syncDecorations(): void {
        const editor = getEditor();
        if (!editor) {
            return;
        }

        const nextDecorations = buildRemoteCursorDecorations(
            remoteCursors.value ?? [],
            currentFileId.value,
            currentUserId.value,
        );

        decorationIds = editor.deltaDecorations(decorationIds, nextDecorations);
    }

    watch([remoteCursors, currentFileId, currentUserId], syncDecorations, {
        deep: true,
    });

    return {
        syncDecorations,
    };
}
