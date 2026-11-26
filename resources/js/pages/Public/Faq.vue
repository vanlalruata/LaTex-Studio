<script setup lang="ts">
import FaqAccordion from '@/components/public/FaqAccordion.vue';
import PublicContainer from '@/components/public/PublicContainer.vue';
import SectionHeading from '@/components/public/SectionHeading.vue';
import SeoHead from '@/components/public/SeoHead.vue';
import type { FaqItem } from '@/types/public';

type Props = {
    faqs: FaqItem[];
};

const props = defineProps<Props>();
</script>

<template>
    <SeoHead
        title="Frequently Asked Questions"
        description="Answers to common questions about LaTeX Studio, supported compilers, collaboration, AI keys, and source export."
    />

    <section class="border-b border-academic-border bg-canvas py-14 sm:py-20">
        <PublicContainer narrow class="text-center">
            <SectionHeading
                eyebrow="FAQ"
                title="Frequently asked questions"
                description="Details on supported TeX Live engines, collaboration, AI key privacy, and project portability."
                align="center"
            />
        </PublicContainer>
    </section>

    <section class="py-14 sm:py-20">
        <PublicContainer narrow>
            <FaqAccordion :items="props.faqs" />
        </PublicContainer>
    </section>
</template>
