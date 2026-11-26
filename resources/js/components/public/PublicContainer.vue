<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from '@/lib/utils';

type Props = {
    class?: HTMLAttributes['class'];
    narrow?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
    narrow: false,
});
</script>

<template>
    <div
        :class="
            cn(
                'mx-auto w-full px-4 sm:px-6 lg:px-8',
                props.narrow ? 'max-w-4xl' : 'max-w-7xl',
                props.class,
            )
        "
    >
        <slot />
    </div>
</template>
