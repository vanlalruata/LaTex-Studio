import { onBeforeUnmount, ref } from 'vue';
import type { PresenceCursor, PresenceUser } from '@/composables/useWorkspacePresence';

interface EchoPrivateChannel {
    listen(event: string, callback: (payload: never) => void): EchoPrivateChannel;
}

interface EchoClient {
    private(channel: string): EchoPrivateChannel;
    leave(channel: string): void;
}

export function usePresenceChannel(
    projectPublicId: string,
    handlers: {
        onPresenceUpdated?: (users: PresenceUser[]) => void;
        onCursorMoved?: (payload: {
            user_id: number;
            name: string;
            color: string;
            cursor: PresenceCursor;
        }) => void;
    },
) {
    const isConnected = ref(false);
    const channelName = `project.${projectPublicId}.presence`;
    const echo = (window as Window & { Echo?: EchoClient }).Echo;

    if (echo) {
        const channel = echo.private(channelName);

        channel.listen('.presence.updated', (payload: { users: PresenceUser[] }) => {
            handlers.onPresenceUpdated?.(payload.users);
        });

        channel.listen(
            '.cursor.moved',
            (payload: { user_id: number; name: string; color: string; cursor: PresenceCursor }) => {
                handlers.onCursorMoved?.(payload);
            },
        );

        isConnected.value = true;
    }

    function unsubscribe(): void {
        if (echo && isConnected.value) {
            echo.leave(channelName);
            isConnected.value = false;
        }
    }

    onBeforeUnmount(() => {
        unsubscribe();
    });

    return {
        isConnected,
        unsubscribe,
    };
}
