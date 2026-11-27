<script setup lang="ts">
import { ArrowDownToLine, ArrowUpFromLine, GitBranch, Unplug } from '@lucide/vue';
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const props = defineProps<{
    provider: 'github' | 'gitlab';
    connected: boolean;
    repository?: string | null;
    branch?: string | null;
    lastSyncedAt?: string | null;
    connectUrl: string;
    pushUrl: string;
    pullUrl: string;
    disconnectUrl: string;
    getCsrfToken: () => string;
}>();

const emit = defineEmits<{
    synced: [];
}>();

const busyAction = ref<'push' | 'pull' | 'disconnect' | null>(null);
const statusMessage = ref<string | null>(null);

async function triggerAction(action: 'push' | 'pull' | 'disconnect'): Promise<void> {
    busyAction.value = action;
    statusMessage.value = null;

    const url =
        action === 'push'
            ? props.pushUrl
            : action === 'pull'
              ? props.pullUrl
              : props.disconnectUrl;

    try {
        const response = await fetch(url, {
            method: action === 'disconnect' ? 'DELETE' : 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-XSRF-TOKEN': props.getCsrfToken(),
            },
        });

        if (response.ok) {
            statusMessage.value =
                action === 'disconnect'
                    ? 'Disconnected repository.'
                    : `${action === 'push' ? 'Push' : 'Pull'} queued.`;
            emit('synced');
        } else {
            statusMessage.value = 'Operation failed.';
        }
    } finally {
        busyAction.value = null;
    }
}
</script>

<template>
    <div class="space-y-3 rounded-lg border p-3 text-xs">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
                <GitBranch class="size-4 text-primary" />
                <span class="font-semibold capitalize">{{ props.provider }}</span>
                <Badge :variant="props.connected ? 'default' : 'outline'">
                    {{ props.connected ? 'Connected' : 'Disconnected' }}
                </Badge>
            </div>

            <a
                v-if="!props.connected"
                :href="props.connectUrl"
                class="inline-flex items-center rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground hover:opacity-90"
            >
                Connect
            </a>
        </div>

        <p v-if="props.repository" class="text-muted-foreground">
            {{ props.repository }} ({{ props.branch || 'main' }})
        </p>

        <div v-if="props.connected" class="flex flex-wrap gap-2">
            <Button
                size="sm"
                variant="outline"
                :disabled="busyAction !== null"
                @click="triggerAction('push')"
            >
                <ArrowUpFromLine class="mr-1 size-3.5" />
                Push
            </Button>
            <Button
                size="sm"
                variant="outline"
                :disabled="busyAction !== null"
                @click="triggerAction('pull')"
            >
                <ArrowDownToLine class="mr-1 size-3.5" />
                Pull
            </Button>
            <Button
                size="sm"
                variant="ghost"
                :disabled="busyAction !== null"
                @click="triggerAction('disconnect')"
            >
                <Unplug class="mr-1 size-3.5" />
                Disconnect
            </Button>
        </div>

        <p v-if="statusMessage" class="text-[11px] text-muted-foreground">{{ statusMessage }}</p>
    </div>
</template>
