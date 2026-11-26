<script setup lang="ts">
type Props = {
    eyebrow?: string;
    title: string;
    description?: string;
    align?: 'left' | 'center';
};

const props = withDefaults(defineProps<Props>(), {
    align: 'left',
});
</script>

<template>
    <div
        :class="[
            'max-w-3xl',
            props.align === 'center' ? 'mx-auto text-center' : 'text-left',
        ]"
    >
        <p
            v-if="props.eyebrow"
            class="mb-3 text-xs font-semibold tracking-wider text-academic-primary uppercase"
        >
            {{ props.eyebrow }}
        </p>
        <h2
            class="text-2xl font-semibold tracking-tight text-ink sm:text-3xl lg:text-4xl"
        >
            {{ props.title }}
        </h2>
        <p
            v-if="props.description"
            class="mt-4 text-base leading-relaxed text-ink-muted sm:text-lg"
        >
            {{ props.description }}
        </p>
    </div>
</template>
