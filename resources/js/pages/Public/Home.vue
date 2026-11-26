<script setup lang="ts">
import { Link, usePage } from '@inertiajs/vue3';
import {
    ArrowRight,
    BookOpen,
    CheckCircle2,
    FileCode2,
    FileText,
    GitBranch,
    LayoutGrid,
    ScanLine,
    Sigma,
    Sparkles,
    Users,
} from '@lucide/vue';
import { computed } from 'vue';
import FaqAccordion from '@/components/public/FaqAccordion.vue';
import FeatureCard from '@/components/public/FeatureCard.vue';
import PublicContainer from '@/components/public/PublicContainer.vue';
import SectionHeading from '@/components/public/SectionHeading.vue';
import SeoHead from '@/components/public/SeoHead.vue';
import { dashboard, login, register } from '@/routes';
import {
    faq,
    features as featuresRoute,
    howItWorks,
    templates,
} from '@/routes/public';
import type { FaqItem, FeatureItem } from '@/types/public';

type Props = {
    canRegister: boolean;
    features: FeatureItem[];
    faqs: FaqItem[];
};

const props = defineProps<Props>();
const page = usePage();
const isAuthenticated = computed(() => Boolean(page.props.auth?.user));
const registrationMode = computed(
    () => page.props.publicSite?.registrationMode ?? 'open',
);

const iconMap: Record<string, typeof FileCode2> = {
    code: FileCode2,
    'file-text': FileText,
    book: BookOpen,
    users: Users,
    sparkles: Sparkles,
    'git-branch': GitBranch,
    sigma: Sigma,
    layout: LayoutGrid,
    scan: ScanLine,
};

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
                        one focused workspace. Bring co-authors and optional
                        human-reviewed AI assistance into the process as your
                        work grows.
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
                                v-if="
                                    registrationMode === 'open' &&
                                    props.canRegister
                                "
                                :href="register()"
                                class="inline-flex items-center justify-center rounded-lg bg-academic-primary px-5 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-academic-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academic-primary"
                            >
                                Get started
                            </Link>
                            <Link
                                :href="howItWorks()"
                                class="inline-flex items-center justify-center rounded-lg border border-academic-border bg-surface px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academic-primary"
                            >
                                See how it works
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

    <section class="border-b border-academic-border bg-surface py-6">
        <PublicContainer>
            <div
                class="grid gap-4 text-sm text-ink-muted sm:grid-cols-2 lg:grid-cols-4"
            >
                <div class="flex items-center gap-2.5">
                    <CheckCircle2
                        class="size-4 shrink-0 text-academic-accent"
                        aria-hidden="true"
                    />
                    <span>Sandboxed TeX Live compilation</span>
                </div>
                <div class="flex items-center gap-2.5">
                    <CheckCircle2
                        class="size-4 shrink-0 text-academic-accent"
                        aria-hidden="true"
                    />
                    <span>pdfLaTeX, XeLaTeX &amp; LuaLaTeX</span>
                </div>
                <div class="flex items-center gap-2.5">
                    <CheckCircle2
                        class="size-4 shrink-0 text-academic-accent"
                        aria-hidden="true"
                    />
                    <span>Human-reviewed AI suggestions</span>
                </div>
                <div class="flex items-center gap-2.5">
                    <CheckCircle2
                        class="size-4 shrink-0 text-academic-accent"
                        aria-hidden="true"
                    />
                    <span>Portable ZIP source export</span>
                </div>
            </div>
        </PublicContainer>
    </section>

    <section id="features" class="py-16 sm:py-20">
        <PublicContainer>
            <div
                class="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"
            >
                <SectionHeading
                    eyebrow="Capabilities"
                    title="Everything around the writing workflow"
                    description="The work behind a research paper involves more than typing. Keep source files, references, compilation, and review connected in one place."
                />
                <Link
                    :href="featuresRoute()"
                    class="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-academic-primary hover:text-academic-primary-hover"
                >
                    <span>Explore all features</span>
                    <ArrowRight class="size-4" aria-hidden="true" />
                </Link>
            </div>

            <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <FeatureCard
                    v-for="feature in props.features"
                    :key="feature.slug"
                    :feature="feature"
                    :icon="iconMap[feature.iconKey || 'code']"
                />
            </div>
        </PublicContainer>
    </section>

    <section class="border-y border-academic-border bg-surface py-16 sm:py-20">
        <PublicContainer>
            <div class="grid items-center gap-10 lg:grid-cols-12">
                <div class="lg:col-span-6">
                    <SectionHeading
                        eyebrow="Human-reviewed AI"
                        title="AI that assists. You stay in control."
                        description="Ask for help understanding a compilation error, reviewing a section, or proposing a focused revision. Connect your own Gemini, OpenAI, or Anthropic API key in settings—every suggestion is presented for explicit approval."
                    />
                    <ul class="mt-6 space-y-3 text-sm text-ink-muted">
                        <li class="flex items-start gap-2.5">
                            <CheckCircle2
                                class="mt-0.5 size-4 shrink-0 text-academic-accent"
                                aria-hidden="true"
                            />
                            <span
                                >API keys are stored encrypted per user and
                                never shared across accounts.</span
                            >
                        </li>
                        <li class="flex items-start gap-2.5">
                            <CheckCircle2
                                class="mt-0.5 size-4 shrink-0 text-academic-accent"
                                aria-hidden="true"
                            />
                            <span
                                >No automatic document overwrites; review diffs
                                before accepting any edit.</span
                            >
                        </li>
                    </ul>
                </div>
                <div class="lg:col-span-6">
                    <div
                        class="rounded-2xl border border-academic-border bg-canvas p-6 shadow-(--shadow-soft)"
                    >
                        <div
                            class="flex items-center justify-between border-b border-academic-border pb-3"
                        >
                            <span class="text-xs font-semibold text-ink"
                                >AI Assistant — Review Proposal</span
                            >
                            <span
                                class="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-medium text-academic-primary"
                            >
                                Requires approval
                            </span>
                        </div>
                        <p class="mt-4 text-xs font-medium text-ink-muted">
                            Suggested fix for
                            <code class="font-mono text-ink"
                                >Undefined control sequence</code
                            >
                            on line 28:
                        </p>
                        <pre
                            class="mt-3 overflow-x-auto rounded-lg border border-academic-border bg-surface p-3 font-mono text-xs text-ink"
                        ><code>- \hat\bolsymbol&#123;\theta&#125;
+ \hat&#123;\boldsymbol&#123;\theta&#125;&#125;</code></pre>
                        <div class="mt-4 flex gap-2">
                            <span
                                class="rounded-md bg-academic-primary px-3 py-1.5 text-xs font-medium text-white"
                            >
                                Apply suggestion
                            </span>
                            <span
                                class="rounded-md border border-academic-border bg-surface px-3 py-1.5 text-xs font-medium text-ink-muted"
                            >
                                Dismiss
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </PublicContainer>
    </section>

    <section id="how-it-works" class="py-16 sm:py-20">
        <PublicContainer>
            <div
                class="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"
            >
                <SectionHeading
                    eyebrow="Workflow"
                    title="From first draft to a review-ready PDF"
                    description="A transparent writing pipeline built around standard LaTeX projects."
                />
                <Link
                    :href="howItWorks()"
                    class="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-academic-primary hover:text-academic-primary-hover"
                >
                    <span>See full workflow</span>
                    <ArrowRight class="size-4" aria-hidden="true" />
                </Link>
            </div>

            <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div
                    v-for="item in workflowSteps"
                    :key="item.step"
                    class="rounded-2xl border border-academic-border bg-surface p-6 shadow-(--shadow-soft)"
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

    <section
        id="templates"
        class="border-t border-academic-border bg-surface py-16 sm:py-20"
    >
        <PublicContainer>
            <div
                class="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"
            >
                <SectionHeading
                    eyebrow="Templates & Documents"
                    title="Structured starting points for academic manuscripts"
                    description="Begin with clean, reproducible templates for journal articles, conference papers, theses, and technical reports."
                />
                <Link
                    :href="templates()"
                    class="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-academic-primary hover:text-academic-primary-hover"
                >
                    <span>Browse templates</span>
                    <ArrowRight class="size-4" aria-hidden="true" />
                </Link>
            </div>
            <div class="mt-8 grid gap-6 sm:grid-cols-3">
                <div
                    class="rounded-2xl border border-academic-border bg-canvas p-6"
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
                    class="rounded-2xl border border-academic-border bg-canvas p-6"
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
                    class="rounded-2xl border border-academic-border bg-canvas p-6"
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
        class="border-t border-academic-border bg-canvas py-16 sm:py-20"
    >
        <PublicContainer narrow>
            <SectionHeading
                eyebrow="Questions"
                title="Frequently asked questions"
                align="center"
            />
            <div class="mt-10">
                <FaqAccordion :items="props.faqs" />
            </div>
            <div class="mt-6 text-center">
                <Link
                    :href="faq()"
                    class="inline-flex items-center gap-1.5 text-sm font-medium text-academic-primary hover:text-academic-primary-hover"
                >
                    <span>View all questions</span>
                    <ArrowRight class="size-4" aria-hidden="true" />
                </Link>
            </div>
        </PublicContainer>
    </section>

    <section
        class="border-t border-academic-border bg-ink py-16 text-white sm:py-20"
    >
        <PublicContainer narrow class="text-center">
            <h2 class="text-2xl font-semibold tracking-tight sm:text-3xl">
                Give your research a more focused writing space.
            </h2>
            <p class="mx-auto mt-4 max-w-xl text-base text-slate-300">
                Start a project, explore the workflow, and keep full control
                over your LaTeX source files.
            </p>
            <div class="mt-8 flex flex-wrap justify-center gap-3.5">
                <Link
                    v-if="isAuthenticated"
                    :href="dashboard()"
                    class="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-slate-100"
                >
                    Open workspace
                </Link>
                <template v-else>
                    <Link
                        v-if="registrationMode === 'open' && props.canRegister"
                        :href="register()"
                        class="inline-flex items-center justify-center rounded-lg bg-white px-5 py-3 text-sm font-medium text-ink transition-colors hover:bg-slate-100"
                    >
                        Get started
                    </Link>
                    <Link
                        :href="login()"
                        class="inline-flex items-center justify-center rounded-lg border border-white/25 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
                    >
                        Sign in
                    </Link>
                </template>
            </div>
        </PublicContainer>
    </section>
</template>
