<script setup lang="ts">
import PricingCard from '@/components/public/PricingCard.vue';
import PublicContainer from '@/components/public/PublicContainer.vue';
import SectionHeading from '@/components/public/SectionHeading.vue';
import SeoHead from '@/components/public/SeoHead.vue';
import type { PricingPlanItem } from '@/types/public';

type Props = {
    plans: PricingPlanItem[];
    mode: 'free' | 'paid' | 'contact_sales';
    taxNote: string | null;
};

const props = defineProps<Props>();
</script>

<template>
    <SeoHead
        title="Pricing"
        description="Transparent plans for individual researchers and academic teams."
    />

    <section class="border-b border-academic-border bg-canvas py-14 sm:py-20">
        <PublicContainer>
            <SectionHeading
                eyebrow="Plans"
                title="Simple, transparent plans"
                description="Choose a plan that fits your research workflow and collaboration needs."
            />
        </PublicContainer>
    </section>

    <section class="py-14 sm:py-20">
        <PublicContainer>
            <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <PricingCard
                    v-for="plan in props.plans"
                    :key="plan.slug"
                    :plan="plan"
                />
            </div>

            <p
                v-if="props.taxNote"
                class="mt-8 text-center text-xs text-ink-muted"
            >
                {{ props.taxNote }}
            </p>
        </PublicContainer>
    </section>
</template>
