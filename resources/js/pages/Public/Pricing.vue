<script setup lang="ts">
import { usePage } from '@inertiajs/vue3';
import { GraduationCap } from '@lucide/vue';
import { computed } from 'vue';
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
const page = usePage();
const institutionalUser = computed(() => {
    const user = (page.props.auth as {
        user?: {
            is_institutional_free?: boolean;
            institutional_domain?: string | null;
            institution_name?: string | null;
        } | null;
    })?.user;

    return user?.is_institutional_free ? user : null;
});
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
            <div
                v-if="institutionalUser"
                class="mx-auto max-w-2xl rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center"
            >
                <GraduationCap class="mx-auto mb-3 size-8 text-emerald-600" />
                <h2 class="text-xl font-semibold text-emerald-950">
                    You have full access through your institution
                </h2>
                <p class="mt-2 text-sm text-emerald-800">
                    Your account is covered under free institutional access
                    <span v-if="institutionalUser.institution_name || institutionalUser.institutional_domain">
                        ({{ institutionalUser.institution_name || institutionalUser.institutional_domain }})
                    </span>.
                    No subscription or payment is required.
                </p>
            </div>

            <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
