<script setup lang="ts">
import { CheckCircle2, Clock, Sparkles } from '@lucide/vue';
import { computed } from 'vue';
import type { FeatureStatus } from '@/types/public';

type Props = {
    status: Exclude<FeatureStatus, 'disabled'>;
};

const props = defineProps<Props>();

const badgeConfig = computed(() => {
    switch (props.status) {
        case 'available':
            return {
                label: 'Available',
                classes: 'border-emerald-200 bg-emerald-50 text-emerald-800',
                icon: CheckCircle2,
            };
        case 'beta':
            return {
                label: 'Beta',
                classes: 'border-amber-200 bg-amber-50 text-amber-800',
                icon: Sparkles,
            };
        case 'planned':
            return {
                label: 'Planned',
                classes: 'border-slate-200 bg-slate-100 text-slate-700',
                icon: Clock,
            };
    }
});
</script>

<template>
    <span
        class="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium"
        :class="badgeConfig.classes"
    >
        <component
            :is="badgeConfig.icon"
            class="size-3.5 shrink-0"
            aria-hidden="true"
        />
        <span>{{ badgeConfig.label }}</span>
    </span>
</template>
