<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import PublicContainer from '@/components/public/PublicContainer.vue';
import SectionHeading from '@/components/public/SectionHeading.vue';
import SeoHead from '@/components/public/SeoHead.vue';
import { dashboard, register } from '@/routes';

const page = usePage();
const isAuthenticated = computed(() => Boolean(page.props.auth?.user));
const registrationMode = computed(
    () => page.props.publicSite?.registrationMode ?? 'open',
);

const steps = [
    {
        number: '01',
        title: 'Create a project from a blank workspace or template',
        detail: 'Start with a clean manuscript or select an academic template with pre-configured document classes and bibliography files.',
    },
    {
        number: '02',
        title: 'Organize source files, figures, and bibliography',
        detail: 'Keep modular .tex chapters, BibTeX databases, and figures in a validated project tree.',
    },
    {
        number: '03',
        title: 'Write in the LaTeX editor',
        detail: 'Use project-aware completions for \\cite and \\ref, inline formula hover previews, and structural outline folding.',
    },
    {
        number: '04',
        title: 'Compile with a supported TeX Live engine',
        detail: 'Run pdfLaTeX, XeLaTeX, or LuaLaTeX inside an isolated compilation worker. Multi-pass builds resolve cross-references and bibliographies cleanly.',
    },
    {
        number: '05',
        title: 'Inspect the PDF and normalized diagnostics',
        detail: 'Review rendered pages alongside line-level errors and warnings. Your previous successful PDF stays available even if an intermediate draft fails.',
    },
    {
        number: '06',
        title: 'Review, collaborate, and export',
        detail: 'Coordinate co-author comment threads and change suggestions, save named revisions, and export your full ZIP source archive anytime.',
    },
];
</script>

<template>
    <SeoHead
        title="How it works"
        description="Follow the six-step LaTeX writing workflow from project creation and managed TeX Live compilation to review and portable export."
    />

    <section class="border-b border-academic-border bg-canvas py-14 sm:py-20">
        <PublicContainer>
            <SectionHeading
                eyebrow="Workflow"
                title="From source files to a finished manuscript"
                description="A predictable, transparent pipeline where your LaTeX source and build diagnostics stay in view."
            />
        </PublicContainer>
    </section>

    <section class="py-14 sm:py-20">
        <PublicContainer narrow>
            <ol class="space-y-6">
                <li
                    v-for="step in steps"
                    :key="step.number"
                    class="flex flex-col gap-3 rounded-2xl border border-academic-border bg-surface p-6 shadow-(--shadow-soft) sm:flex-row sm:items-start sm:gap-6"
                >
                    <span
                        class="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-semibold text-academic-primary"
                    >
                        {{ step.number }}
                    </span>
                    <div>
                        <h2 class="text-lg font-semibold text-ink">
                            {{ step.title }}
                        </h2>
                        <p class="mt-2 text-sm leading-relaxed text-ink-muted">
                            {{ step.detail }}
                        </p>
                    </div>
                </li>
            </ol>

            <div class="mt-12 flex justify-center">
                <Link
                    v-if="isAuthenticated"
                    :href="dashboard()"
                    class="inline-flex items-center justify-center rounded-lg bg-academic-primary px-5 py-3 text-sm font-medium text-white hover:bg-academic-primary-hover"
                >
                    Open workspace
                </Link>
                <Link
                    v-else-if="registrationMode === 'open'"
                    :href="register()"
                    class="inline-flex items-center justify-center rounded-lg bg-academic-primary px-5 py-3 text-sm font-medium text-white hover:bg-academic-primary-hover"
                >
                    Create an account
                </Link>
            </div>
        </PublicContainer>
    </section>
</template>
