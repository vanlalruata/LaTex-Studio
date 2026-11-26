<script setup lang="ts">
import PublicContainer from '@/components/public/PublicContainer.vue';
import SectionHeading from '@/components/public/SectionHeading.vue';
import SeoHead from '@/components/public/SeoHead.vue';
</script>

<template>
    <SeoHead
        title="Privacy Policy"
        description="Draft privacy policy notice for LaTeX Studio."
    />

    <section class="border-b border-academic-border bg-canvas py-14 sm:py-20">
        <PublicContainer narrow>
            <SectionHeading
                eyebrow="Legal (Draft)"
                title="Privacy Policy"
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
                This deployment collects account details necessary for
                authentication, project storage, and optional user-configured AI
                provider credentials (stored encrypted per user).
            </p>
            <p>
                Contact enquiries submitted through public forms are stored
                solely to respond to your request. Final legal terms, retention
                schedules, and jurisdiction disclosures must be reviewed by your
                legal counsel before public launch.
            </p>
        </PublicContainer>
    </section>
</template>
