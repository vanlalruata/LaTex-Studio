<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { Check } from '@lucide/vue';
import { computed } from 'vue';
import { register } from '@/routes';
import type { PricingPlanItem } from '@/types/public';

type Props = {
    plan: PricingPlanItem;
};

const props = defineProps<Props>();

const formattedPrice = computed(() => {
    if (props.plan.priceAmount === 0) {
        return 'Free';
    }
    try {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: props.plan.currency || 'USD',
            maximumFractionDigits: props.plan.priceAmount % 100 === 0 ? 0 : 2,
        }).format(props.plan.priceAmount / 100);
    } catch {
        return `${props.plan.currency} ${(props.plan.priceAmount / 100).toFixed(2)}`;
    }
});

const intervalLabel = computed(() => {
    if (props.plan.priceAmount === 0) {
        return '';
    }
    switch (props.plan.billingInterval) {
        case 'month':
            return '/ month';
        case 'year':
            return '/ year';
        case 'one_time':
            return 'one-time';
        default:
            return '';
    }
});

const ctaHref = computed(() => {
    if (props.plan.ctaType === 'register') {
        return register.url();
    }
    if (props.plan.ctaType === 'external' && props.plan.ctaTarget) {
        return props.plan.ctaTarget;
    }
    if (props.plan.ctaType === 'contact') {
        return props.plan.ctaTarget || '/contact';
    }
    return null;
});
</script>

<template>
    <article
        class="flex h-full flex-col justify-between rounded-2xl border border-academic-border bg-surface p-6 shadow-(--shadow-soft)"
    >
        <div>
            <h3 class="text-lg font-semibold text-ink">
                {{ props.plan.name }}
            </h3>
            <p
                v-if="props.plan.summary"
                class="mt-2 text-sm leading-relaxed text-ink-muted"
            >
                {{ props.plan.summary }}
            </p>

            <div class="mt-6 flex items-baseline gap-1.5">
                <span class="text-3xl font-semibold tracking-tight text-ink">
                    {{ formattedPrice }}
                </span>
                <span v-if="intervalLabel" class="text-sm text-ink-muted">
                    {{ intervalLabel }}
                </span>
            </div>

            <ul
                v-if="props.plan.features.length > 0"
                class="mt-6 space-y-2.5 border-t border-academic-border pt-6 text-sm text-ink-muted"
            >
                <li
                    v-for="(feature, idx) in props.plan.features"
                    :key="idx"
                    class="flex items-start gap-2.5"
                >
                    <Check
                        class="mt-0.5 size-4 shrink-0 text-academic-accent"
                        aria-hidden="true"
                    />
                    <span>{{ feature }}</span>
                </li>
            </ul>
        </div>

        <div v-if="ctaHref" class="mt-8">
            <a
                v-if="props.plan.ctaType === 'external'"
                :href="ctaHref"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex w-full items-center justify-center rounded-lg bg-academic-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-academic-primary-hover"
            >
                {{ props.plan.ctaLabel }}
            </a>
            <Link
                v-else
                :href="ctaHref"
                class="inline-flex w-full items-center justify-center rounded-lg bg-academic-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-academic-primary-hover"
            >
                {{ props.plan.ctaLabel }}
            </Link>
        </div>
    </article>
</template>
