<script setup lang="ts">
import { Link2, Plug, Trash2 } from '@lucide/vue';
import { ref } from 'vue';
import {
    INTEGRATION_PROVIDERS,
    type IntegrationItem,
    type IntegrationProvider,
    type IntegrationStatus,
} from '@/composables/useProjectIntegrations';

const props = defineProps<{
    integrations: IntegrationItem[];
    canEdit: boolean;
}>();

const emit = defineEmits<{
    connect: [provider: IntegrationProvider, label: string];
    setStatus: [integrationId: string, status: IntegrationStatus];
    remove: [integrationId: string];
}>();

const selectedProvider = ref<IntegrationProvider>('github');
const label = ref('');

const providerLabels: Record<IntegrationProvider, string> = {
    github: 'GitHub',
    zotero: 'Zotero',
    slack: 'Slack',
    overleaf: 'Overleaf',
    custom: 'Custom',
};

function availableProviders(): IntegrationProvider[] {
    return INTEGRATION_PROVIDERS.filter(
        (provider) =>
            !props.integrations.some(
                (integration) => integration.provider === provider,
            ),
    );
}

function submit(): void {
    const trimmed = label.value.trim();
    if (!trimmed) {
        return;
    }

    emit('connect', selectedProvider.value, trimmed);
    label.value = '';
}
</script>

<template>
    <div class="flex h-full flex-col bg-white">
        <div class="border-b border-slate-100 px-3 py-2">
            <span
                class="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-slate-500 uppercase"
            >
                <Plug class="size-3.5 text-indigo-600" />
                Integrations
            </span>
        </div>

        <div class="flex-1 space-y-2 overflow-y-auto p-2 text-xs">
            <p class="text-[11px] text-slate-500">
                Connect reproducible research services. Credentials stay
                server-side and secret config values are masked.
            </p>

            <div
                v-for="integration in integrations"
                :key="integration.public_id"
                class="group rounded-lg border border-slate-200 p-2.5"
            >
                <div class="flex items-center justify-between gap-2">
                    <div class="min-w-0">
                        <p class="truncate font-medium text-slate-800">
                            {{ integration.label }}
                        </p>
                        <p class="text-[10px] text-slate-500">
                            {{ providerLabels[integration.provider] }} ·
                            {{ integration.status }}
                        </p>
                    </div>
                    <button
                        v-if="canEdit"
                        type="button"
                        class="hidden rounded p-0.5 text-slate-400 group-hover:block hover:text-rose-600"
                        title="Remove integration"
                        @click="emit('remove', integration.public_id)"
                    >
                        <Trash2 class="size-3" />
                    </button>
                </div>

                <div v-if="canEdit" class="mt-2 flex gap-1">
                    <button
                        type="button"
                        class="flex-1 rounded px-2 py-1 text-[10px] font-medium"
                        :class="
                            integration.status === 'connected'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                        "
                        @click="
                            emit(
                                'setStatus',
                                integration.public_id,
                                integration.status === 'connected'
                                    ? 'disconnected'
                                    : 'connected',
                            )
                        "
                    >
                        <Link2 class="mr-1 inline size-3" />
                        {{
                            integration.status === 'connected'
                                ? 'Disconnect'
                                : 'Connect'
                        }}
                    </button>
                    <button
                        type="button"
                        class="rounded px-2 py-1 text-[10px] font-medium text-slate-600 hover:bg-slate-100"
                        @click="emit('setStatus', integration.public_id, 'error')"
                    >
                        Mark error
                    </button>
                </div>
            </div>

            <p v-if="integrations.length === 0" class="py-4 text-center text-slate-400">
                No services connected yet.
            </p>

            <form
                v-if="canEdit && availableProviders().length > 0"
                class="mt-3 space-y-1.5 border-t border-slate-100 pt-2"
                @submit.prevent="submit"
            >
                <p class="font-semibold text-slate-700">Connect a service</p>
                <select
                    v-model="selectedProvider"
                    class="w-full rounded border border-slate-200 bg-white px-2 py-1"
                >
                    <option
                        v-for="provider in availableProviders()"
                        :key="provider"
                        :value="provider"
                    >
                        {{ providerLabels[provider] }}
                    </option>
                </select>
                <input
                    v-model="label"
                    type="text"
                    placeholder="Connection label"
                    class="w-full rounded border border-slate-200 px-2 py-1"
                />
                <button
                    type="submit"
                    class="w-full rounded bg-indigo-600 px-2 py-1 font-medium text-white hover:bg-indigo-700"
                >
                    <Plug class="mr-1 inline size-3" /> Add integration
                </button>
            </form>
        </div>
    </div>
</template>