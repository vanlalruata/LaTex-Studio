import { ref } from 'vue';
import synctexRoutes from '@/routes/compilations/synctex';

export function useSynctex(getCsrfToken: () => string) {
    const isSyncing = ref(false);

    async function forwardLookup(
        compilationId: string,
        filePath: string,
        line: number,
    ): Promise<{ page: number; x: number | null; y: number | null } | null> {
        isSyncing.value = true;
        try {
            const response = await fetch(synctexRoutes.forward(compilationId).url, {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-XSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify({ file_path: filePath, line }),
            });

            if (!response.ok) {
                return null;
            }

            return (await response.json()) as {
                page: number;
                x: number | null;
                y: number | null;
            };
        } finally {
            isSyncing.value = false;
        }
    }

    async function inverseLookup(
        compilationId: string,
        payload: { page: number; x: number; y: number },
    ): Promise<{ file_id: string; file_path: string; line: number } | null> {
        isSyncing.value = true;
        try {
            const response = await fetch(synctexRoutes.inverse(compilationId).url, {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-XSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                return null;
            }

            return (await response.json()) as {
                file_id: string;
                file_path: string;
                line: number;
            };
        } finally {
            isSyncing.value = false;
        }
    }

    return {
        isSyncing,
        forwardLookup,
        inverseLookup,
    };
}
