import { onBeforeUnmount, ref } from 'vue';

export interface CompilationStatusPayload {
    public_id: string;
    status: string;
    is_terminal: boolean;
    progress: number;
    error_summary: string | null;
    last_successful_compilation_id: string | null;
}

export interface CompilationLogPayload {
    public_id: string;
    chunk: string;
}

interface EchoPrivateChannel {
    listen(event: string, callback: (payload: never) => void): EchoPrivateChannel;
}

interface EchoClient {
    private(channel: string): EchoPrivateChannel;
    leave(channel: string): void;
}

export function useCompilationChannel(
    projectPublicId: string,
    handlers: {
        onStatusChanged?: (payload: CompilationStatusPayload) => void;
        onLogAppended?: (payload: CompilationLogPayload) => void;
    },
) {
    const isConnected = ref(false);
    const channelName = `project.${projectPublicId}.compilations`;

    const echo = (window as Window & { Echo?: EchoClient }).Echo;

    if (echo) {
        const channel = echo.private(channelName);

        channel.listen('.compilation.status.changed', (payload: CompilationStatusPayload) => {
            handlers.onStatusChanged?.(payload);
        });

        channel.listen('.compilation.log.appended', (payload: CompilationLogPayload) => {
            handlers.onLogAppended?.(payload);
        });

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
