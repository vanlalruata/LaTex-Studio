<script setup lang="ts">
import {
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    FileCode2,
    FileImage,
    FileText,
    Play,
    RotateCcw,
    ZoomIn,
    ZoomOut,
} from '@lucide/vue';
import { computed, ref } from 'vue';

type SampleFileId = 'main' | 'intro' | 'bib' | 'figure';
type MobileTab = 'files' | 'source' | 'pdf';
type CompilerLabel = 'pdfLaTeX' | 'XeLaTeX' | 'LuaLaTeX';

interface SampleFile {
    id: SampleFileId;
    path: string;
    kind: 'tex' | 'bib' | 'svg';
    content: string;
}

const sampleFiles: SampleFile[] = [
    {
        id: 'main',
        path: 'main.tex',
        kind: 'tex',
        content: `\\documentclass[11pt]{article}
\\usepackage[margin=1in]{geometry}
\\usepackage{amsmath,amssymb,booktabs}
\\usepackage{graphicx}

\\title{Reproducible Document Workflows in Academic Writing}
\\author{A. Researcher \\and B. Collaborator}
\\date{Sample Manuscript}

\\begin{document}
\\maketitle

\\begin{abstract}
This synthetic sample demonstrates a structured LaTeX manuscript with
modular sections, mathematical notation, figures, and bibliography entries.
\\end{abstract}

\\input{sections/introduction}

\\section{Model Formulation}
We minimize the regularized empirical objective:
\\begin{equation}\\label{eq:objective}
    \\hat{\\boldsymbol{\\theta}} = \\arg\\min_{\\boldsymbol{\\theta}}
    \\left\\| \\mathbf{X}\\boldsymbol{\\theta} - \\mathbf{y} \\right\\|_2^2
    + \\lambda \\|\\boldsymbol{\\theta}\\|_2^2.
\\end{equation}

\\bibliographystyle{plain}
\\bibliography{references}
\\end{document}`,
    },
    {
        id: 'intro',
        path: 'sections/introduction.tex',
        kind: 'tex',
        content: `\\section{Introduction}
Structured typesetting separates manuscript content from visual layout.
Authors organize chapters, equations, and references in plain-text
source files while inspecting typeset PDF output alongside diagnostics.

\\subsection{Validation Summary}
Table~\\ref{tab:validation} summarizes illustrative synthetic results
comparing baseline and regularized estimators across sample runs.

\\begin{table}[h]
\\centering
\\caption{Illustrative validation comparison (synthetic data).}
\\label{tab:validation}
\\begin{tabular}{lcc}
\\toprule
Method & $\\lambda$ & Sample RMSE \\\\
\\midrule
Baseline & 0.00 & 0.184 \\\\
Regularized A & 0.10 & 0.127 \\\\
Regularized B & 1.00 & 0.119 \\\\
\\bottomrule
\\end{tabular}
\\end{table}`,
    },
    {
        id: 'bib',
        path: 'references.bib',
        kind: 'bib',
        content: `% Illustrative synthetic bibliography entries (not real DOIs)
@article{sample2025workflow,
  author  = {Researcher, Alex and Collaborator, Blair},
  title   = {Structured Source Workflows for Technical Manuscripts},
  journal = {Journal of Illustrative Examples},
  year    = {2025},
  volume  = {12},
  pages   = {14--29}
}

@book{sample2024typesetting,
  author    = {Author, Casey},
  title     = {Foundations of Reproducible Typesetting},
  publisher = {Academic Sample Press},
  year      = {2024}
}`,
    },
    {
        id: 'figure',
        path: 'figures/workflow-placeholder.svg',
        kind: 'svg',
        content: `<svg viewBox="0 0 360 90" xmlns="http://www.w3.org/2000/svg">
  <rect x="10" y="20" width="90" height="44" rx="8" fill="#eff6ff" stroke="#1d4ed8"/>
  <text x="55" y="46" text-anchor="middle" font-size="11" fill="#0f172a">LaTeX Source</text>
  <line x1="100" y1="42" x2="135" y2="42" stroke="#64748b" stroke-width="1.5"/>
  <rect x="135" y="20" width="90" height="44" rx="8" fill="#f0fdfa" stroke="#0f766e"/>
  <text x="180" y="46" text-anchor="middle" font-size="11" fill="#0f172a">TeX Live Build</text>
  <line x1="225" y1="42" x2="260" y2="42" stroke="#64748b" stroke-width="1.5"/>
  <rect x="260" y="20" width="90" height="44" rx="8" fill="#f8fafc" stroke="#475569"/>
  <text x="305" y="46" text-anchor="middle" font-size="11" fill="#0f172a">PDF Output</text>
</svg>`,
    },
];

const selectedFileId = ref<SampleFileId>('main');
const mobileTab = ref<MobileTab>('source');
const compiler = ref<CompilerLabel>('pdfLaTeX');
const currentPage = ref<1 | 2>(1);
const zoomPercent = ref<number>(100);
const isSimulating = ref(false);
const compileCount = ref(0);
const announcement = ref(
    'Interactive preview loaded with sample-research-paper.',
);

const activeFile = computed(
    () =>
        sampleFiles.find((f) => f.id === selectedFileId.value) ??
        sampleFiles[0],
);

const numberedLines = computed(() => activeFile.value.content.split('\n'));

const statusText = computed(() => {
    if (isSimulating.value) {
        return `Simulating ${compiler.value} preview build...`;
    }
    if (compileCount.value === 0) {
        return `Sample preview ready (${compiler.value} · 2 pages · 0 errors)`;
    }
    return `Simulated preview updated (${compiler.value} · Pass #${compileCount.value} · 2 pages)`;
});

function selectFile(fileId: SampleFileId): void {
    selectedFileId.value = fileId;
    const found = sampleFiles.find((f) => f.id === fileId);
    if (found) {
        announcement.value = `Viewing ${found.path}.`;
    }
    if (mobileTab.value === 'files') {
        mobileTab.value = 'source';
    }
}

function simulateCompile(): void {
    if (isSimulating.value) {
        return;
    }
    isSimulating.value = true;
    announcement.value = `Running simulated ${compiler.value} preview.`;
    window.setTimeout(() => {
        isSimulating.value = false;
        compileCount.value += 1;
        announcement.value = `Simulated ${compiler.value} preview ready. Showing page ${currentPage.value} of 2.`;
    }, 350);
}

function zoomIn(): void {
    zoomPercent.value = Math.min(125, zoomPercent.value + 15);
}

function zoomOut(): void {
    zoomPercent.value = Math.max(70, zoomPercent.value - 15);
}

function resetDemo(): void {
    selectedFileId.value = 'main';
    mobileTab.value = 'source';
    compiler.value = 'pdfLaTeX';
    currentPage.value = 1;
    zoomPercent.value = 100;
    isSimulating.value = false;
    compileCount.value = 0;
    announcement.value = 'Demo reset to initial sample project state.';
}
</script>

<template>
    <div
        class="overflow-hidden rounded-2xl border border-academic-border bg-surface shadow-(--shadow-soft)"
    >
        <div
            class="flex flex-wrap items-center justify-between gap-3 border-b border-academic-border bg-slate-50/90 px-4 py-3"
        >
            <div class="flex flex-wrap items-center gap-3">
                <span
                    class="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-academic-primary"
                >
                    Interactive preview — sample project
                </span>
                <span class="font-mono text-xs text-ink-muted">
                    sample-research-paper/
                </span>
            </div>

            <div class="flex flex-wrap items-center gap-2">
                <label for="demo-compiler" class="sr-only">
                    Sample compiler engine
                </label>
                <select
                    id="demo-compiler"
                    v-model="compiler"
                    class="rounded-lg border border-academic-border bg-surface px-2.5 py-1.5 text-xs font-medium text-ink focus-visible:outline-2 focus-visible:outline-academic-primary"
                >
                    <option value="pdfLaTeX">pdfLaTeX</option>
                    <option value="XeLaTeX">XeLaTeX</option>
                    <option value="LuaLaTeX">LuaLaTeX</option>
                </select>

                <button
                    type="button"
                    :disabled="isSimulating"
                    class="inline-flex items-center gap-1.5 rounded-lg bg-academic-primary px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-academic-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academic-primary disabled:opacity-60"
                    @click="simulateCompile"
                >
                    <Play class="size-3.5" aria-hidden="true" />
                    <span>{{
                        isSimulating ? 'Simulating...' : 'Compile preview'
                    }}</span>
                </button>

                <button
                    type="button"
                    class="inline-flex items-center gap-1.5 rounded-lg border border-academic-border bg-surface px-3 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-academic-primary"
                    @click="resetDemo"
                >
                    <RotateCcw class="size-3.5" aria-hidden="true" />
                    <span>Reset demo</span>
                </button>
            </div>
        </div>

        <div
            role="tablist"
            aria-label="Demo workspace panels"
            class="grid grid-cols-3 border-b border-academic-border bg-canvas lg:hidden"
        >
            <button
                type="button"
                role="tab"
                :aria-selected="mobileTab === 'files'"
                class="py-2.5 text-xs font-medium transition-colors"
                :class="
                    mobileTab === 'files'
                        ? 'border-b-2 border-academic-primary bg-surface text-academic-primary'
                        : 'text-ink-muted'
                "
                @click="mobileTab = 'files'"
            >
                Files
            </button>
            <button
                type="button"
                role="tab"
                :aria-selected="mobileTab === 'source'"
                class="py-2.5 text-xs font-medium transition-colors"
                :class="
                    mobileTab === 'source'
                        ? 'border-b-2 border-academic-primary bg-surface text-academic-primary'
                        : 'text-ink-muted'
                "
                @click="mobileTab = 'source'"
            >
                Source
            </button>
            <button
                type="button"
                role="tab"
                :aria-selected="mobileTab === 'pdf'"
                class="py-2.5 text-xs font-medium transition-colors"
                :class="
                    mobileTab === 'pdf'
                        ? 'border-b-2 border-academic-primary bg-surface text-academic-primary'
                        : 'text-ink-muted'
                "
                @click="mobileTab = 'pdf'"
            >
                PDF Preview
            </button>
        </div>

        <div
            class="grid min-h-[440px] divide-y divide-academic-border lg:grid-cols-12 lg:divide-x lg:divide-y-0"
        >
            <aside
                aria-label="Sample project files"
                class="bg-slate-50/50 p-3 lg:col-span-3 lg:block"
                :class="mobileTab === 'files' ? 'block' : 'hidden'"
            >
                <p
                    class="mb-2.5 px-2 text-[11px] font-semibold tracking-wider text-ink-muted uppercase"
                >
                    Project Tree
                </p>
                <ul class="space-y-1">
                    <li v-for="file in sampleFiles" :key="file.id">
                        <button
                            type="button"
                            class="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left font-mono text-xs transition-colors focus-visible:outline-2 focus-visible:outline-academic-primary"
                            :class="
                                selectedFileId === file.id
                                    ? 'bg-blue-50 font-medium text-academic-primary'
                                    : 'text-ink-muted hover:bg-slate-100 hover:text-ink'
                            "
                            :aria-current="
                                selectedFileId === file.id ? 'true' : undefined
                            "
                            @click="selectFile(file.id)"
                        >
                            <FileImage
                                v-if="file.kind === 'svg'"
                                class="size-3.5 shrink-0"
                                aria-hidden="true"
                            />
                            <FileText
                                v-else-if="file.kind === 'bib'"
                                class="size-3.5 shrink-0"
                                aria-hidden="true"
                            />
                            <FileCode2
                                v-else
                                class="size-3.5 shrink-0"
                                aria-hidden="true"
                            />
                            <span class="truncate">{{ file.path }}</span>
                        </button>
                    </li>
                </ul>
            </aside>

            <section
                aria-label="Read-only sample LaTeX source"
                class="flex flex-col bg-surface lg:col-span-5 lg:flex"
                :class="mobileTab === 'source' ? 'flex' : 'hidden'"
            >
                <div
                    class="flex items-center justify-between border-b border-academic-border px-4 py-2 text-xs text-ink-muted"
                >
                    <span class="font-mono font-medium text-ink">
                        {{ activeFile.path }}
                    </span>
                    <span class="text-[11px]">Read-only sample</span>
                </div>
                <div
                    class="flex-1 overflow-x-auto p-4 font-mono text-xs leading-relaxed"
                >
                    <div
                        v-for="(line, index) in numberedLines"
                        :key="index"
                        class="flex gap-4 whitespace-pre"
                    >
                        <span
                            class="w-6 shrink-0 text-right text-slate-400 select-none"
                        >
                            {{ index + 1 }}
                        </span>
                        <span class="text-ink">{{ line || ' ' }}</span>
                    </div>
                </div>
            </section>

            <section
                aria-label="Simulated sample PDF preview"
                class="flex flex-col bg-slate-100/70 lg:col-span-4 lg:flex"
                :class="mobileTab === 'pdf' ? 'flex' : 'hidden'"
            >
                <div
                    class="flex items-center justify-between border-b border-academic-border bg-surface px-3 py-2 text-xs text-ink-muted"
                >
                    <div class="flex items-center gap-1">
                        <button
                            type="button"
                            class="rounded p-1 hover:bg-slate-100 disabled:opacity-40"
                            :disabled="currentPage === 1"
                            aria-label="Previous preview page"
                            @click="currentPage = 1"
                        >
                            <ChevronLeft class="size-4" aria-hidden="true" />
                        </button>
                        <span class="px-1 font-medium text-ink">
                            Page {{ currentPage }} / 2
                        </span>
                        <button
                            type="button"
                            class="rounded p-1 hover:bg-slate-100 disabled:opacity-40"
                            :disabled="currentPage === 2"
                            aria-label="Next preview page"
                            @click="currentPage = 2"
                        >
                            <ChevronRight class="size-4" aria-hidden="true" />
                        </button>
                    </div>

                    <div class="flex items-center gap-1">
                        <button
                            type="button"
                            class="rounded p-1 hover:bg-slate-100"
                            aria-label="Zoom out preview"
                            @click="zoomOut"
                        >
                            <ZoomOut class="size-3.5" aria-hidden="true" />
                        </button>
                        <span class="w-10 text-center font-mono text-[11px]">
                            {{ zoomPercent }}%
                        </span>
                        <button
                            type="button"
                            class="rounded p-1 hover:bg-slate-100"
                            aria-label="Zoom in preview"
                            @click="zoomIn"
                        >
                            <ZoomIn class="size-3.5" aria-hidden="true" />
                        </button>
                    </div>
                </div>

                <div class="flex-1 overflow-auto p-4">
                    <div
                        class="mx-auto origin-top rounded-lg border border-academic-border bg-surface p-6 shadow-xs transition-transform"
                        :style="{
                            transform: `scale(${zoomPercent / 100})`,
                        }"
                    >
                        <template v-if="currentPage === 1">
                            <div class="text-center">
                                <h3
                                    class="font-serif text-sm font-semibold text-ink"
                                >
                                    Reproducible Document Workflows in Academic
                                    Writing
                                </h3>
                                <p class="mt-1 text-[11px] text-ink-muted">
                                    A. Researcher &amp; B. Collaborator
                                </p>
                            </div>

                            <div class="mt-4 border-y border-slate-100 py-2.5">
                                <p
                                    class="text-center text-[10px] font-semibold tracking-wide text-ink uppercase"
                                >
                                    Abstract
                                </p>
                                <p
                                    class="mt-1 text-[11px] leading-relaxed text-ink-muted"
                                >
                                    This synthetic sample demonstrates a
                                    structured LaTeX manuscript with modular
                                    sections, mathematical notation, figures,
                                    and bibliography entries.
                                </p>
                            </div>

                            <div class="mt-4 space-y-2">
                                <h4 class="text-xs font-semibold text-ink">
                                    1 Introduction
                                </h4>
                                <p
                                    class="text-[11px] leading-relaxed text-ink-muted"
                                >
                                    Structured typesetting separates manuscript
                                    content from visual layout. Authors inspect
                                    typeset PDF output alongside normalized
                                    diagnostics.
                                </p>
                                <h4 class="pt-1 text-xs font-semibold text-ink">
                                    2 Model Formulation
                                </h4>
                                <div
                                    class="rounded border border-slate-100 bg-slate-50 px-3 py-2 text-center font-serif text-xs text-ink"
                                >
                                    &theta;&#770; = arg min ||X&theta; &minus;
                                    y||&sup2; + &lambda;||&theta;||&sup2;
                                    &nbsp;&nbsp;(1)
                                </div>
                            </div>
                        </template>

                        <template v-else>
                            <div class="space-y-4">
                                <div>
                                    <h4 class="text-xs font-semibold text-ink">
                                        1.1 Validation Summary
                                    </h4>
                                    <p class="mt-1 text-[11px] text-ink-muted">
                                        Table 1: Illustrative validation
                                        comparison (synthetic data).
                                    </p>
                                    <table
                                        class="mt-2 w-full border-collapse text-left text-[10px] text-ink"
                                    >
                                        <thead>
                                            <tr
                                                class="border-y border-slate-300"
                                            >
                                                <th class="py-1 font-semibold">
                                                    Method
                                                </th>
                                                <th class="py-1 font-semibold">
                                                    &lambda;
                                                </th>
                                                <th class="py-1 font-semibold">
                                                    Sample RMSE
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody
                                            class="divide-y divide-slate-100"
                                        >
                                            <tr>
                                                <td class="py-1">Baseline</td>
                                                <td class="py-1">0.00</td>
                                                <td class="py-1">0.184</td>
                                            </tr>
                                            <tr>
                                                <td class="py-1">
                                                    Regularized A
                                                </td>
                                                <td class="py-1">0.10</td>
                                                <td class="py-1">0.127</td>
                                            </tr>
                                            <tr>
                                                <td class="py-1">
                                                    Regularized B
                                                </td>
                                                <td class="py-1">1.00</td>
                                                <td class="py-1">0.119</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div>
                                    <p
                                        class="mb-1.5 text-[10px] font-medium text-ink-muted"
                                    >
                                        Figure 1: Sample workflow illustration
                                    </p>
                                    <svg
                                        viewBox="0 0 360 84"
                                        class="w-full rounded border border-slate-100 bg-white"
                                        role="img"
                                        aria-label="Diagram showing LaTeX Source flowing to TeX Live Build and PDF Output"
                                    >
                                        <rect
                                            x="8"
                                            y="18"
                                            width="92"
                                            height="44"
                                            rx="8"
                                            fill="#eff6ff"
                                            stroke="#1d4ed8"
                                        />
                                        <text
                                            x="54"
                                            y="44"
                                            text-anchor="middle"
                                            font-size="11"
                                            fill="#0f172a"
                                        >
                                            LaTeX Source
                                        </text>
                                        <line
                                            x1="100"
                                            y1="40"
                                            x2="134"
                                            y2="40"
                                            stroke="#64748b"
                                            stroke-width="1.5"
                                        />
                                        <rect
                                            x="134"
                                            y="18"
                                            width="92"
                                            height="44"
                                            rx="8"
                                            fill="#f0fdfa"
                                            stroke="#0f766e"
                                        />
                                        <text
                                            x="180"
                                            y="44"
                                            text-anchor="middle"
                                            font-size="11"
                                            fill="#0f172a"
                                        >
                                            TeX Live Build
                                        </text>
                                        <line
                                            x1="226"
                                            y1="40"
                                            x2="260"
                                            y2="40"
                                            stroke="#64748b"
                                            stroke-width="1.5"
                                        />
                                        <rect
                                            x="260"
                                            y="18"
                                            width="92"
                                            height="44"
                                            rx="8"
                                            fill="#f8fafc"
                                            stroke="#475569"
                                        />
                                        <text
                                            x="306"
                                            y="44"
                                            text-anchor="middle"
                                            font-size="11"
                                            fill="#0f172a"
                                        >
                                            PDF Output
                                        </text>
                                    </svg>
                                </div>
                            </div>
                        </template>
                    </div>
                </div>
            </section>
        </div>

        <div
            class="flex flex-col justify-between gap-2 border-t border-academic-border bg-slate-50/90 px-4 py-2.5 text-xs text-ink-muted sm:flex-row sm:items-center"
        >
            <div class="flex items-center gap-2">
                <CheckCircle2
                    class="size-3.5 shrink-0 text-academic-accent"
                    aria-hidden="true"
                />
                <span class="font-medium text-ink">{{ statusText }}</span>
            </div>
            <p class="text-[11px]">
                Simulation note: uses synthetic sample content and does not
                compile visitor-provided files.
            </p>
        </div>

        <p class="sr-only" aria-live="polite">
            {{ announcement }}
        </p>
    </div>
</template>
