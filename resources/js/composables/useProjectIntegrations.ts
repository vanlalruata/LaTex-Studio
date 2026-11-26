import { ref } from 'vue';
import { apiGet, apiSend } from '@/lib/http';
import integrationsRoutes from '@/routes/projects/integrations';

export type IntegrationProvider =
    | 'github'
    | 'zotero'
    | 'slack'
    | 'overleaf'
    | 'custom';

export type IntegrationStatus = 'disconnected' | 'connected' | 'error';

export interface IntegrationItem {
    public_id: string;
    provider: IntegrationProvider;
    label: string;
    status: IntegrationStatus;
    config: Record<string, unknown>;
    last_synced_at: string | null;
    connected_by_name: string | null;
    created_at: string | null;
}

export const INTEGRATION_PROVIDERS: IntegrationProvider[] = [
    'github',
    'zotero',
    'slack',
    'overleaf',
    'custom',
];

export function useProjectIntegrations(projectPublicId: string) {
    const integrations = ref<IntegrationItem[]>([]);
    const error = ref<string | null>(null);

    async function load(): Promise<void> {
        const result = await apiGet<{ integrations: IntegrationItem[] }>(
            integrationsRoutes.index(projectPublicId).url,
        );

        if (!result.ok || !result.data) {
            error.value = result.message;

            return;
        }

        integrations.value = result.data.integrations;
        error.value = null;
    }

    async function connect(
        provider: IntegrationProvider,
        label: string,
    ): Promise<boolean> {
        const result = await apiSend<{ integration: IntegrationItem }>(
            integrationsRoutes.store(projectPublicId).url,
            'POST',
            { provider, label, status: 'disconnected' },
        );

        if (!result.ok || !result.data) {
            error.value = result.message;

            return false;
        }

        integrations.value = [...integrations.value, result.data.integration];

        return true;
    }

    async function setStatus(
        integrationId: string,
        status: IntegrationStatus,
    ): Promise<void> {
        const result = await apiSend<{ integration: IntegrationItem }>(
            integrationsRoutes.update({
                project: projectPublicId,
                integration: integrationId,
            }).url,
            'PATCH',
            { status },
        );

        if (result.ok && result.data) {
            const updated = result.data.integration;
            integrations.value = integrations.value.map((integration) =>
                integration.public_id === updated.public_id
                    ? updated
                    : integration,
            );
        }
    }

    async function remove(integrationId: string): Promise<void> {
        const result = await apiSend<{ deleted: boolean }>(
            integrationsRoutes.destroy({
                project: projectPublicId,
                integration: integrationId,
            }).url,
            'DELETE',
        );

        if (result.ok) {
            integrations.value = integrations.value.filter(
                (integration) => integration.public_id !== integrationId,
            );
        }
    }

    return { integrations, error, load, connect, setStatus, remove };
}