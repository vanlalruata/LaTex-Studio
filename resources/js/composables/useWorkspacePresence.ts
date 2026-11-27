import { onBeforeUnmount, ref } from 'vue';
import { usePresenceChannel } from '@/composables/usePresenceChannel';
import { apiGet, apiSend } from '@/lib/http';
import presenceRoutes from '@/routes/projects/presence';

export interface PresenceCursor {
    file_id: string;
    file_path: string;
    line: number;
    column: number;
}

export interface PresenceUser {
    id: number;
    name: string;
    color: string;
    cursor: PresenceCursor | null;
}

const HEARTBEAT_INTERVAL_MS = 15000;

export function useWorkspacePresence(projectPublicId: string) {
    const users = ref<PresenceUser[]>([]);
    const lastCursor = ref<{
        file_id: string;
        line: number;
        column: number;
    } | null>(null);

    let heartbeat: ReturnType<typeof setInterval> | null = null;

    const { isConnected } = usePresenceChannel(projectPublicId, {
        onPresenceUpdated(nextUsers) {
            users.value = nextUsers;
        },
        onCursorMoved(payload) {
            const idx = users.value.findIndex((u) => u.id === payload.user_id);
            if (idx >= 0) {
                const updated = [...users.value];
                updated[idx] = {
                    ...updated[idx],
                    cursor: payload.cursor,
                };
                users.value = updated;
            }
        },
    });

    async function refresh(): Promise<void> {
        const result = await apiGet<{ users: PresenceUser[] }>(
            presenceRoutes.index(projectPublicId).url,
        );

        if (result.ok && result.data) {
            users.value = result.data.users;
        }
    }

    async function touch(
        cursor?: { file_id: string; line: number; column: number },
    ): Promise<void> {
        if (cursor) {
            lastCursor.value = cursor;
        }

        const result = await apiSend<{ users: PresenceUser[] }>(
            presenceRoutes.store(projectPublicId).url,
            'POST',
            lastCursor.value ? { ...lastCursor.value } : {},
        );

        if (result.ok && result.data) {
            users.value = result.data.users;
        }
    }

    function start(): void {
        void touch();

        heartbeat = setInterval(() => {
            void touch();
        }, HEARTBEAT_INTERVAL_MS);
    }

    function stop(): void {
        if (heartbeat !== null) {
            clearInterval(heartbeat);
            heartbeat = null;
        }
    }

    onBeforeUnmount(stop);

    return { users, isConnected, refresh, touch, start, stop };
}
