<script setup lang="ts">
import PublicContainer from '@/components/public/PublicContainer.vue';
import SectionHeading from '@/components/public/SectionHeading.vue';
import SeoHead from '@/components/public/SeoHead.vue';
</script>

<template>
    <SeoHead
        title="Terms of Service"
        description="Draft terms of service for LaTeX Studio."
    />

    <section class="border-b border-academic-border bg-canvas py-14 sm:py-20">
        <PublicContainer narrow>
            <SectionHeading
                eyebrow="Legal (Draft)"
                title="Terms of Service"
                description="Development placeholder — replace with organization-approved legal copy prior to production launch."
            />
        </PublicContainer>
    </section>

    <section class="py-14 sm:py-20">
        <PublicContainer
            narrow
            class="space-y-6 text-sm leading-relaxed text-ink-muted"
        >
            <p>
                Authors retain ownership of their LaTeX manuscripts, figures,
                and compiled outputs. Optional AI suggestions are provided
                without warranty and require author verification before
                inclusion in any academic work.
            </p>
            <p>
                Final acceptable-use, liability, and institutional terms must be
                reviewed and approved by your organization prior to production
                deployment.
            </p>
        </PublicContainer>
    </section>
</template>
