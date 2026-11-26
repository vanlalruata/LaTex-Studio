<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3';
import {
    BookOpen,
    CheckCircle2,
    FileCode2,
    FileText,
    GitBranch,
    Sparkles,
    Users,
} from '@lucide/vue';
import { computed } from 'vue';
import FeatureCard from '@/components/public/FeatureCard.vue';
import PublicContainer from '@/components/public/PublicContainer.vue';
import SectionHeading from '@/components/public/SectionHeading.vue';
import SeoHead from '@/components/public/SeoHead.vue';
import { dashboard, login, register } from '@/routes';
import type { FeatureItem } from '@/types/public';

const page = usePage();
const isAuthenticated = computed(() => Boolean(page.props.auth?.user));
const registrationMode = computed(
    () => page.props.publicSite?.registrationMode ?? 'open',
);

const coreCapabilities: FeatureItem[] = [
    {
        slug: 'latex-workspace',
        title: 'LaTeX workspace',
        summary:
            'Organize project files, bibliography entries, and figures in a focused source editor.',
        status: 'available',
    },
    {
        slug: 'pdf-preview',
        title: 'Live PDF compilation',
        summary:
            'Compile manuscripts in a managed TeX Live environment and inspect diagnostics alongside your PDF.',
        status: 'available',
    },
    {
        slug: 'bibliography-workflow',
        title: 'Bibliography & citations',
        summary:
            'Keep BibTeX references, citation keys, and label outlines close to the sections they support.',
        status: 'available',
    },
    {
        slug: 'coauthor-review',
        title: 'Co-author review',
        summary:
            'Coordinate comments, review threads, and change suggestions with collaborators in one place.',
        status: 'available',
    },
    {
        slug: 'ai-assistance',
        title: 'Human-reviewed AI assistance',
        summary:
            'Use your own API key for error explanations and focused revision suggestions that require explicit approval.',
        status: 'available',
    },
    {
        slug: 'revisions-export',
        title: 'Revisions & portable export',
        summary:
            'Save named project snapshots and export complete source archives whenever you need them.',
        status: 'available',
    },
];

const featureIcons = [
    FileCode2,
    FileText,
    BookOpen,
    Users,
    Sparkles,
    GitBranch,
];

const workflowSteps = [
    {
        step: '01',
        title: 'Start with a project',
        description:
            'Choose an academic template or open a clean LaTeX workspace.',
    },
    {
        step: '02',
        title: 'Write and organize',
        description:
            'Keep source files, figures, and bibliography together in one project tree.',
    },
    {
        step: '03',
        title: 'Compile and inspect',
        description:
            'Run a managed TeX Live build and review the PDF and normalized diagnostics.',
    },
    {
        step: '04',
        title: 'Review and export',
        description:
            'Resolve collaborator comments, save revisions, and export your manuscript.',
    },
];
</script>

<template>
    <SeoHead
        title="Research writing, from source to finished paper"
        description="A focused research-writing workspace for LaTeX editing, managed TeX Live compilation, live PDF preview, collaboration, and human-reviewed AI assistance."
    />

    <section
        class="border-b border-academic-border bg-canvas py-14 sm:py-20 lg:py-24"
    >
        <PublicContainer>
            <div class="grid items-center gap-12 lg:grid-cols-12">
                <div class="lg:col-span-6">
                    <p
                        class="mb-4 text-xs font-semibold tracking-wider text-academic-primary uppercase"
                    >
                        A focused workspace for academic writing
                    </p>
                    <h1
                        class="text-3xl font-semibold tracking-tight text-ink sm:text-4xl lg:text-5xl lg:leading-[1.12]"
                    >
                        Research writing, from source to finished paper.
                    </h1>
                    <p
                        class="mt-5 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg"
                    >
                        Write in LaTeX, organize your research files, compile
                        with a managed TeX Live workflow, and review your PDF in
                        one focused workspace.
                    </p>

                    <div class="mt-8 flex flex-wrap items-center gap-3.5">
                        <Link
                            v-if="isAuthenticated"
                            :href="dashboard()"
                            class="inline-flex items-center justify-center rounded-lg bg-academic-primary px-5 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-academic-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academic-primary"
                        >
                            Open workspace
                        </Link>
                        <template v-else>
                            <Link
                                v-if="registrationMode === 'open'"
                                :href="register()"
                                class="inline-flex items-center justify-center rounded-lg bg-academic-primary px-5 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-academic-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academic-primary"
                            >
                                Get started
                            </Link>
                            <Link
                                :href="login()"
                                class="inline-flex items-center justify-center rounded-lg border border-academic-border bg-surface px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academic-primary"
                            >
                                Sign in
                            </Link>
                        </template>
                    </div>

                    <p class="mt-4 text-xs text-ink-muted">
                        Your source stays editable. Your workflow stays in view.
                    </p>
                </div>

                <div class="lg:col-span-6">
                    <div
                        class="overflow-hidden rounded-2xl border border-academic-border bg-surface shadow-(--shadow-soft)"
                        role="img"
                        aria-label="Illustration of a three-pane LaTeX workspace with file tree, LaTeX source editor, and compiled PDF preview"
                    >
                        <div
                            class="flex items-center justify-between border-b border-academic-border bg-slate-50/80 px-4 py-2.5 text-xs text-ink-muted"
                        >
                            <span class="font-medium text-ink"
                                >sample-paper / main.tex</span
                            >
                            <span
                                class="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-800"
                            >
                                <CheckCircle2
                                    class="size-3"
                                    aria-hidden="true"
                                />
                                Ready
                            </span>
                        </div>
                        <div
                            class="grid divide-y divide-academic-border sm:grid-cols-12 sm:divide-x sm:divide-y-0"
                        >
                            <div
                                class="bg-slate-50/40 p-3 text-xs text-ink-muted sm:col-span-3"
                            >
                                <p class="mb-2 font-semibold text-ink">Files</p>
                                <ul class="space-y-1.5 font-mono text-[11px]">
                                    <li
                                        class="rounded bg-blue-50 px-2 py-1 font-medium text-academic-primary"
                                    >
                                        main.tex
                                    </li>
                                    <li class="px-2 py-0.5">references.bib</li>
                                    <li class="px-2 py-0.5">
                                        sections/intro.tex
                                    </li>
                                </ul>
                            </div>
                            <div
                                class="p-4 font-mono text-xs leading-relaxed text-ink sm:col-span-5"
                            >
                                <p class="text-academic-primary">
                                    \section&#123;Introduction&#125;
                                </p>
                                <p class="mt-1 text-ink-muted">
                                    We evaluate the regularized estimator
                                    <span class="text-ink"
                                        >$\hat&#123;\theta&#125;$</span
                                    >
                                    across three benchmark corpora.
                                </p>
                                <p class="mt-2 text-academic-primary">
                                    \begin&#123;equation&#125;
                                </p>
                                <p class="pl-3 text-ink">
                                    L(\theta) = \|X\theta - y\|_2^2 +
                                    \lambda\|\theta\|_2^2
                                </p>
                                <p class="text-academic-primary">
                                    \end&#123;equation&#125;
                                </p>
                            </div>
                            <div class="bg-slate-50/50 p-4 sm:col-span-4">
                                <div
                                    class="rounded-lg border border-academic-border bg-surface p-3.5 shadow-xs"
                                >
                                    <p
                                        class="text-[11px] font-semibold text-ink"
                                    >
                                        1 Introduction
                                    </p>
                                    <p
                                        class="mt-1.5 text-[10px] leading-relaxed text-ink-muted"
                                    >
                                        We evaluate the regularized estimator
                                        across three benchmark corpora.
                                    </p>
                                    <div
                                        class="mt-2.5 rounded border border-slate-100 bg-slate-50 px-2 py-1.5 text-center font-serif text-[10px] text-ink"
                                    >
                                        L(&theta;) = ||X&theta; &minus;
                                        y||&sup2; + &lambda;||&theta;||&sup2;
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PublicContainer>
    </section>

    <section id="features" class="py-16 sm:py-20">
        <PublicContainer>
            <SectionHeading
                eyebrow="Capabilities"
                title="Everything around the writing workflow"
                description="The work behind a research paper involves more than typing. Keep source files, references, compilation, and review connected in one place."
            />

            <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <FeatureCard
                    v-for="(feature, idx) in coreCapabilities"
                    :key="feature.slug"
                    :feature="feature"
                    :icon="featureIcons[idx]"
                />
            </div>
        </PublicContainer>
    </section>

    <section
        id="how-it-works"
        class="border-y border-academic-border bg-surface py-16 sm:py-20"
    >
        <PublicContainer>
            <SectionHeading
                eyebrow="Workflow"
                title="From first draft to a review-ready PDF"
                description="A transparent writing pipeline built around standard LaTeX projects."
            />

            <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div
                    v-for="item in workflowSteps"
                    :key="item.step"
                    class="rounded-2xl border border-academic-border bg-canvas p-6"
                >
                    <span
                        class="text-xs font-semibold tracking-wider text-academic-primary"
                    >
                        Step {{ item.step }}
                    </span>
                    <h3 class="mt-2 text-base font-semibold text-ink">
                        {{ item.title }}
                    </h3>
                    <p class="mt-2 text-sm leading-relaxed text-ink-muted">
                        {{ item.description }}
                    </p>
                </div>
            </div>
        </PublicContainer>
    </section>

    <section id="templates" class="py-16 sm:py-20">
        <PublicContainer>
            <SectionHeading
                eyebrow="Templates & Documents"
                title="Structured starting points for academic manuscripts"
                description="Begin with clean, reproducible templates for journal articles, conference papers, theses, and technical reports."
            />
            <div class="mt-8 grid gap-6 sm:grid-cols-3">
                <div
                    class="rounded-2xl border border-academic-border bg-surface p-6"
                >
                    <h3 class="text-base font-semibold text-ink">
                        Journal &amp; Article
                    </h3>
                    <p class="mt-2 text-sm text-ink-muted">
                        Standard article structure with abstract, equations,
                        tables, and BibTeX bibliography.
                    </p>
                </div>
                <div
                    class="rounded-2xl border border-academic-border bg-surface p-6"
                >
                    <h3 class="text-base font-semibold text-ink">
                        Thesis &amp; Dissertation
                    </h3>
                    <p class="mt-2 text-sm text-ink-muted">
                        Multi-file chapter layout with cross-references,
                        appendices, and clean sectioning.
                    </p>
                </div>
                <div
                    class="rounded-2xl border border-academic-border bg-surface p-6"
                >
                    <h3 class="text-base font-semibold text-ink">
                        Technical Report
                    </h3>
                    <p class="mt-2 text-sm text-ink-muted">
                        Clear documentation layout for lab notes, preprints, and
                        reproducible project summaries.
                    </p>
                </div>
            </div>
        </PublicContainer>
    </section>

    <section
        id="faq"
        class="border-t border-academic-border bg-surface py-16 sm:py-20"
    >
        <PublicContainer narrow>
            <SectionHeading
                eyebrow="Questions"
                title="Frequently asked questions"
                align="center"
            />
            <div
                class="mt-10 divide-y divide-academic-border rounded-2xl border border-academic-border bg-canvas"
            >
                <div class="p-6">
                    <h3 class="text-base font-semibold text-ink">
                        Which LaTeX compilers are supported?
                    </h3>
                    <p class="mt-2 text-sm leading-relaxed text-ink-muted">
                        Manuscripts compile inside a managed, sandboxed TeX Live
                        environment supporting standard engines such as
                        pdfLaTeX, XeLaTeX, and LuaLaTeX.
                    </p>
                </div>
                <div class="p-6">
                    <h3 class="text-base font-semibold text-ink">
                        Are AI edits applied automatically?
                    </h3>
                    <p class="mt-2 text-sm leading-relaxed text-ink-muted">
                        No. AI assistance uses your own configured API key and
                        proposes suggestions or error explanations that you
                        inspect and explicitly accept or reject.
                    </p>
                </div>
            </div>
        </PublicContainer>
    </section>
</template>
