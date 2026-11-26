<script lang="ts" setup>
import type { ToasterProps } from 'vue-sonner';
import {
    AlertCircle,
    AlertTriangle,
    CheckCircle2,
    Info,
    Loader2Icon,
    XIcon,
} from '@lucide/vue';
import { Toaster as Sonner } from 'vue-sonner';
import { cn } from '@/lib/utils';

import 'vue-sonner/style.css';

const props = withDefaults(defineProps<ToasterProps>(), {
    position: 'top-right',
    duration: 4000,
    closeButton: false,
});
</script>

<template>
    <Sonner
        v-bind="props"
        :class="cn('toaster group', props.class)"
        :position="props.position"
        :duration="props.duration"
        :toast-options="{
            ...props.toastOptions,
            classes: {
                toast: 'app-toast rounded-lg border-0 px-4 py-3 text-sm font-medium shadow-sm',
                success: 'app-toast-success',
                error: 'app-toast-error',
                warning: 'app-toast-warning',
                info: 'app-toast-info',
                ...props.toastOptions?.classes,
            },
        }"
    >
        <template #success-icon>
            <CheckCircle2
                class="size-5 shrink-0 fill-[#16a34a] text-white"
                aria-hidden="true"
            />
        </template>
        <template #info-icon>
            <Info
                class="size-5 shrink-0 fill-[#2563eb] text-white"
                aria-hidden="true"
            />
        </template>
        <template #warning-icon>
            <AlertTriangle
                class="size-5 shrink-0 fill-[#d97706] text-white"
                aria-hidden="true"
            />
        </template>
        <template #error-icon>
            <AlertCircle
                class="size-5 shrink-0 fill-[#dc2626] text-white"
                aria-hidden="true"
            />
        </template>
        <template #loading-icon>
            <div>
                <Loader2Icon class="size-4 animate-spin" />
            </div>
        </template>
        <template #close-icon>
            <XIcon class="size-4" />
        </template>
    </Sonner>
</template>

<style>
[data-sonner-toaster] [data-sonner-toast].app-toast {
    border-radius: 0.5rem;
    border-width: 1px;
    font-weight: 500;
    box-shadow: 0 4px 12px -2px rgb(15 23 42 / 0.08);
}

[data-sonner-toaster] [data-sonner-toast].app-toast-success {
    background-color: #bbf7d0;
    border-color: #86efac;
    color: #166534;
}

[data-sonner-toaster] [data-sonner-toast].app-toast-error {
    background-color: #fecaca;
    border-color: #fca5a5;
    color: #991b1b;
}

[data-sonner-toaster] [data-sonner-toast].app-toast-warning {
    background-color: #fed7aa;
    border-color: #fdba74;
    color: #92400e;
}

[data-sonner-toaster] [data-sonner-toast].app-toast-info {
    background-color: #bfdbfe;
    border-color: #93c5fd;
    color: #1e40af;
}
</style>
