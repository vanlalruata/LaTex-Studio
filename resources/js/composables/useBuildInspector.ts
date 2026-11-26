import { ref } from 'vue';
import { apiGetText } from '@/lib/http';
import compilationsRoutes from '@/routes/compilations';

export function useBuildInspector() {
    const logText = ref<string | null>(null);
    const logCompilationId = ref<string | null>(null);
    const isLoadingLog = ref(false);
    const error = ref<string | null>(null);

    async function loadLog(compilationId: string): Promise<void> {
        isLoadingLog.value = true;
        error.value = null;

        const text = await apiGetText(
            compilationsRoutes.artifacts.show({
                compilation: compilationId,
                type: 'log',
            }).url,
        );

        isLoadingLog.value = false;

        if (text === null) {
            logText.value = null;
            logCompilationId.value = compilationId;
            error.value = 'No build log artifact is available for this run.';

            return;
        }

        logText.value = text;
        logCompilationId.value = compilationId;
    }

    return { logText, logCompilationId, isLoadingLog, error, loadLog };
}