<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { ArrowRight } from '@lucide/vue';
import type { Component } from 'vue';
import StatusBadge from '@/components/public/StatusBadge.vue';
import type { FeatureItem } from '@/types/public';

type Props = {
    feature: FeatureItem;
    icon?: Component;
};

const props = defineProps<Props>();
</script>

<template>
    <article
        class="flex h-full flex-col justify-between rounded-2xl border border-academic-border bg-surface p-6 shadow-(--shadow-soft) transition-colors hover:border-slate-300"
    >
        <div>
            <div class="mb-4 flex items-start justify-between gap-3">
                <div
                    v-if="props.icon"
                    class="flex size-10 shrink-0 items-center justify-center rounded-xl border border-academic-border bg-canvas text-academic-primary"
                >
                    <component
                        :is="props.icon"
                        class="size-5"
                        aria-hidden="true"
                    />
                </div>
                <StatusBadge :status="props.feature.status" />
            </div>

            <h3 class="text-lg font-semibold tracking-tight text-ink">
                {{ props.feature.title }}
            </h3>
            <p class="mt-2 text-sm leading-relaxed text-ink-muted">
                {{ props.feature.summary }}
            </p>
        </div>

        <div v-if="props.feature.href" class="mt-5 pt-2">
            <Link
                :href="props.feature.href"
                class="inline-flex items-center gap-1.5 text-sm font-medium text-academic-primary hover:text-academic-primary-hover focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academic-primary"
            >
                <span>Learn more</span>
                <ArrowRight class="size-4" aria-hidden="true" />
            </Link>
        </div>
    </article>
</template>
