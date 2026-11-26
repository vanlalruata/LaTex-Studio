<script setup lang="ts">
import PublicContainer from '@/components/public/PublicContainer.vue';
import SectionHeading from '@/components/public/SectionHeading.vue';
import SeoHead from '@/components/public/SeoHead.vue';
</script>

<template>
    <SeoHead
        title="About"
        description="Learn about the mission and design principles behind LaTeX Studio."
    />

    <section class="border-b border-academic-border bg-canvas py-14 sm:py-20">
        <PublicContainer>
            <SectionHeading
                eyebrow="About"
                title="A transparent workspace built for serious research writing"
                description="LaTeX Studio is designed around source control, reproducible TeX Live builds, and author autonomy."
            />
        </PublicContainer>
    </section>

    <section class="py-14 sm:py-20">
        <PublicContainer
            narrow
            class="space-y-8 text-base leading-relaxed text-ink-muted"
        >
            <div>
                <h2 class="text-xl font-semibold text-ink">Who it serves</h2>
                <p class="mt-3">
                    We build for academic authors preparing journal and
                    conference papers, postgraduate students writing theses,
                    faculty research groups, and technical writers who rely on
                    structured LaTeX projects.
                </p>
            </div>

            <div>
                <h2 class="text-xl font-semibold text-ink">Our approach</h2>
                <p class="mt-3">
                    Manuscripts remain standard LaTeX source files that you can
                    inspect, version, and export as ZIP archives at any time.
                    Compilation runs inside a managed, sandboxed TeX Live
                    service with normalized diagnostics so build issues are easy
                    to trace.
                </p>
            </div>

            <div>
                <h2 class="text-xl font-semibold text-ink">
                    Author-controlled AI
                </h2>
                <p class="mt-3">
                    Optional AI assistance connects using your own provider API
                    key and presents suggestions for explicit human review
                    rather than rewriting your paper automatically.
                </p>
            </div>
        </PublicContainer>
    </section>
</template>
