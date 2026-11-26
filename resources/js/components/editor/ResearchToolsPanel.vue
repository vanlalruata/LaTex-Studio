<script setup lang="ts">
import { Code2, Grid, Image, Library, Sigma } from '@lucide/vue';
import { computed, ref } from 'vue';
import type {
    BibliographyItem,
    ConversionJobItem,
    OcrJobItem,
    ResearchAssetItem,
    ResearchAssetKind,
} from '@/composables/useResearchWorkspace';
import { latexToMathML } from '@/lib/mathRenderer';

const props = withDefaults(
    defineProps<{
        assets?: ResearchAssetItem[];
        sources?: BibliographyItem[];
        ocrJobs?: OcrJobItem[];
        conversions?: ConversionJobItem[];
        canEdit?: boolean;
    }>(),
    {
        assets: () => [],
        sources: () => [],
        ocrJobs: () => [],
        conversions: () => [],
        canEdit: false,
    },
);

const emit = defineEmits<{
    insert: [snippet: string];
    createAsset: [payload: { kind: ResearchAssetKind; title: string; latex: string }];
    deleteAsset: [assetId: string];
    insertCitation: [citation: string];
    createOcr: [filename: string];
    deleteOcr: [jobId: string];
    createConversion: [
        direction: ConversionJobItem['direction'],
        filename: string,
    ];
    deleteConversion: [jobId: string];
}>();

const activeTool = ref<'table' | 'tikz' | 'math' | 'snippets' | 'library'>(
    'table',
);
const tableRows = ref(3);
const tableCols = ref(3);
const tableCaption = ref('Experimental validation results.');
const mathInput = ref(
    '\\hat{\\theta} = \\arg\\min_{\\theta} \\|X\\theta - y\\|_2^2',
);

const assetTitle = ref('Equation asset');
const assetKind = ref<ResearchAssetKind>('equation');
const ocrFilename = ref('');
const conversionFilename = ref('');
const conversionDirection = ref<ConversionJobItem['direction']>(
    'docx_to_latex',
);

const mathPreviewHtml = computed(() => {
    try {
        return latexToMathML(mathInput.value, true);
    } catch {
        return mathInput.value;
    }
});

function insertTable(): void {
    const colsSpec = 'l' + 'c'.repeat(Math.max(1, tableCols.value - 1));
    const header = Array.from(
        { length: tableCols.value },
        (_, i) => `Col ${i + 1}`,
    ).join(' & ');
    const row = Array.from({ length: tableCols.value }, () => '0.00').join(
        ' & ',
    );
    const body = Array.from(
        { length: tableRows.value },
        () => `${row} \\\\`,
    ).join('\n');

    const latex = `\\begin{table}[h]\n\\centering\n\\caption{${tableCaption.value}}\n\\begin{tabular}{${colsSpec}}\n\\toprule\n${header} \\\\\n\\midrule\n${body}\n\\bottomrule\n\\end{tabular}\n\\end{table}\n`;
    emit('insert', latex);
}

function assetLatex(asset: ResearchAssetItem): string | null {
    return typeof asset.payload.latex === 'string' && asset.payload.latex !== ''
        ? asset.payload.latex
        : null;
}

function saveAsset(): void {
    const title = assetTitle.value.trim();
    if (!title) {
        return;
    }

    emit('createAsset', {
        kind: assetKind.value,
        title,
        latex: mathInput.value,
    });
}

function submitOcr(): void {
    const filename = ocrFilename.value.trim();
    if (!filename) {
        return;
    }

    emit('createOcr', filename);
    ocrFilename.value = '';
}

function submitConversion(): void {
    const filename = conversionFilename.value.trim();
    if (!filename) {
        return;
    }

    emit('createConversion', conversionDirection.value, filename);
    conversionFilename.value = '';
}

const tikzTemplates = [
    {
        name: 'Flowchart Pipeline',
        code: `\\begin{figure}[h]\n\\centering\n\\begin{tikzpicture}[node distance=2.5cm, auto]\n  \\node[draw, rounded corners, fill=blue!5] (a) {Input};\n  \\node[draw, rounded corners, fill=teal!5, right of=a] (b) {Model};\n  \\node[draw, rounded corners, fill=gray!5, right of=b] (c) {Output};\n  \\draw[->] (a) -- (b);\n  \\draw[->] (b) -- (c);\n\\end{tikzpicture}\n\\caption{System pipeline.}\n\\end{figure}\n`,
    },
    {
        name: 'Coordinate Plot',
        code: `\\begin{figure}[h]\n\\centering\n\\begin{tikzpicture}\n  \\draw[->] (0,0) -- (4,0) node[right] {$x$};\n  \\draw[->] (0,0) -- (0,3) node[above] {$y$};\n  \\draw[thick, blue] (0.2,0.4) -- (1.5,1.2) -- (3.5,2.5);\n\\end{tikzpicture}\n\\caption{Illustrative plot.}\n\\end{figure}\n`,
    },
];
</script>

<template>
    <div class="flex h-full flex-col bg-white">
        <div class="grid grid-cols-5 border-b border-slate-200 bg-slate-50">
            <button
                type="button"
                class="flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium"
                :class="
                    activeTool === 'table'
                        ? 'border-b-2 border-indigo-600 bg-white text-indigo-600'
                        : 'text-slate-500'
                "
                @click="activeTool = 'table'"
            >
                <Grid class="size-3.5" /> Table
            </button>
            <button
                type="button"
                class="flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium"
                :class="
                    activeTool === 'tikz'
                        ? 'border-b-2 border-indigo-600 bg-white text-indigo-600'
                        : 'text-slate-500'
                "
                @click="activeTool = 'tikz'"
            >
                <Image class="size-3.5" /> TikZ
            </button>
            <button
                type="button"
                class="flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium"
                :class="
                    activeTool === 'math'
                        ? 'border-b-2 border-indigo-600 bg-white text-indigo-600'
                        : 'text-slate-500'
                "
                @click="activeTool = 'math'"
            >
                <Sigma class="size-3.5" /> Math
            </button>
            <button
                type="button"
                class="flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium"
                :class="
                    activeTool === 'snippets'
                        ? 'border-b-2 border-indigo-600 bg-white text-indigo-600'
                        : 'text-slate-500'
                "
                @click="activeTool = 'snippets'"
            >
                <Code2 class="size-3.5" /> Snippets
            </button>
            <button
                type="button"
                class="flex flex-col items-center gap-0.5 py-2 text-[10px] font-medium"
                :class="
                    activeTool === 'library'
                        ? 'border-b-2 border-indigo-600 bg-white text-indigo-600'
                        : 'text-slate-500'
                "
                @click="activeTool = 'library'"
            >
                <Library class="size-3.5" /> Library
            </button>
        </div>

        <div class="flex-1 space-y-4 overflow-y-auto p-3 text-xs">
            <div v-if="activeTool === 'table'" class="space-y-3">
                <p class="font-semibold text-slate-800">
                    Booktabs Table Builder
                </p>
                <div class="grid grid-cols-2 gap-2">
                    <label class="block">
                        <span class="text-[11px] text-slate-500">Rows</span>
                        <input
                            v-model.number="tableRows"
                            type="number"
                            min="1"
                            max="15"
                            class="mt-1 w-full rounded border border-slate-200 px-2 py-1"
                        />
                    </label>
                    <label class="block">
                        <span class="text-[11px] text-slate-500">Columns</span>
                        <input
                            v-model.number="tableCols"
                            type="number"
                            min="1"
                            max="10"
                            class="mt-1 w-full rounded border border-slate-200 px-2 py-1"
                        />
                    </label>
                </div>
                <label class="block">
                    <span class="text-[11px] text-slate-500">Caption</span>
                    <input
                        v-model="tableCaption"
                        type="text"
                        class="mt-1 w-full rounded border border-slate-200 px-2 py-1"
                    />
                </label>
                <button
                    type="button"
                    class="w-full rounded-md bg-indigo-600 px-3 py-1.5 font-medium text-white hover:bg-indigo-700"
                    @click="insertTable"
                >
                    Insert Table into Editor
                </button>
            </div>

            <div v-else-if="activeTool === 'tikz'" class="space-y-3">
                <p class="font-semibold text-slate-800">
                    TikZ Figure Templates
                </p>
                <div
                    v-for="tpl in tikzTemplates"
                    :key="tpl.name"
                    class="rounded-lg border border-slate-200 p-2.5"
                >
                    <p class="font-medium text-slate-800">{{ tpl.name }}</p>
                    <button
                        type="button"
                        class="mt-2 w-full rounded bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
                        @click="emit('insert', tpl.code)"
                    >
                        Insert TikZ Block
                    </button>
                </div>
            </div>

            <div v-else-if="activeTool === 'math'" class="space-y-3">
                <p class="font-semibold text-slate-800">Equation Composer</p>
                <textarea
                    v-model="mathInput"
                    rows="3"
                    class="w-full rounded border border-slate-200 p-2 font-mono text-[11px]"
                />
                <div
                    class="overflow-x-auto rounded border border-slate-100 bg-slate-50 p-3 text-center"
                    v-html="mathPreviewHtml"
                />
                <button
                    type="button"
                    class="w-full rounded-md bg-indigo-600 px-3 py-1.5 font-medium text-white hover:bg-indigo-700"
                    @click="
                        emit(
                            'insert',
                            `\\begin{equation}\n    ${mathInput}\n\\end{equation}\n`,
                        )
                    "
                >
                    Insert Equation
                </button>
            </div>

            <div v-else-if="activeTool === 'snippets'" class="space-y-2">
                <p class="font-semibold text-slate-800">Academic Snippets</p>
                <button
                    type="button"
                    class="w-full rounded border border-slate-200 p-2 text-left hover:bg-slate-50"
                    @click="
                        emit(
                            'insert',
                            '\\begin{abstract}\n    Summary of the study.\n\\end{abstract}\n',
                        )
                    "
                >
                    Abstract Block
                </button>
                <button
                    type="button"
                    class="w-full rounded border border-slate-200 p-2 text-left hover:bg-slate-50"
                    @click="
                        emit(
                            'insert',
                            '\\begin{figure}[h]\n\\centering\n\\includegraphics[width=0.8\\linewidth]{figures/example.png}\n\\caption{Caption text.}\n\\label{fig:example}\n\\end{figure}\n',
                        )
                    "
                >
                    Figure Environment
                </button>
                <button
                    type="button"
                    class="w-full rounded border border-slate-200 p-2 text-left hover:bg-slate-50"
                    @click="
                        emit(
                            'insert',
                            '\\begin{itemize}\n    \\item First item\n    \\item Second item\n\\end{itemize}\n',
                        )
                    "
                >
                    Bullet List (itemize)
                </button>
            </div>

            <div v-else class="space-y-4">
                <div class="space-y-2">
                    <p class="font-semibold text-slate-800">
                        Research assets ({{ props.assets.length }})
                    </p>
                    <div v-if="props.canEdit" class="space-y-1.5 rounded border border-slate-200 p-2">
                        <input
                            v-model="assetTitle"
                            type="text"
                            placeholder="Asset title"
                            class="w-full rounded border border-slate-200 px-2 py-1"
                        />
                        <select
                            v-model="assetKind"
                            class="w-full rounded border border-slate-200 bg-white px-2 py-1"
                        >
                            <option value="equation">Equation</option>
                            <option value="table">Table</option>
                            <option value="figure">Figure</option>
                        </select>
                        <button
                            type="button"
                            class="w-full rounded bg-indigo-600 px-2 py-1 font-medium text-white hover:bg-indigo-700"
                            @click="saveAsset"
                        >
                            Save composer equation as asset
                        </button>
                    </div>

                    <div
                        v-for="asset in props.assets"
                        :key="asset.public_id"
                        class="rounded border border-slate-200 p-2"
                    >
                        <div class="flex items-center justify-between gap-2">
                            <div class="min-w-0">
                                <p class="truncate font-medium text-slate-800">
                                    {{ asset.title }}
                                </p>
                                <p class="text-[10px] uppercase text-slate-500">
                                    {{ asset.kind }} · {{ asset.status }}
                                </p>
                            </div>
                            <div class="flex shrink-0 gap-1">
                                <button
                                    v-if="assetLatex(asset)"
                                    type="button"
                                    class="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
                                    @click="emit('insert', assetLatex(asset) ?? '')"
                                >
                                    Insert
                                </button>
                                <button
                                    v-if="props.canEdit"
                                    type="button"
                                    class="rounded px-1.5 py-0.5 text-[10px] text-slate-500 hover:text-rose-600"
                                    @click="emit('deleteAsset', asset.public_id)"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                        <pre
                            v-if="assetLatex(asset)"
                            class="mt-1 max-h-16 overflow-auto rounded bg-slate-50 p-1 font-mono text-[10px] text-slate-700"
                        >{{ assetLatex(asset) }}</pre>
                    </div>
                    <p v-if="props.assets.length === 0" class="text-[11px] text-slate-400">
                        No saved figures, tables, or equations yet.
                    </p>
                </div>

                <div class="space-y-2 border-t border-slate-100 pt-3">
                    <p class="font-semibold text-slate-800">
                        Bibliography ({{ props.sources.length }})
                    </p>
                    <button
                        v-for="source in props.sources"
                        :key="source.public_id"
                        type="button"
                        class="block w-full rounded border border-slate-200 p-2 text-left hover:bg-slate-50"
                        @click="emit('insertCitation', source.citation)"
                    >
                        <span class="block truncate font-medium text-slate-800">
                            {{ source.title }}
                        </span>
                        <span class="block text-[10px] text-slate-500">
                            {{ source.key }} · {{ source.year ?? 'n.d.' }}
                        </span>
                    </button>
                    <p v-if="props.sources.length === 0" class="text-[11px] text-slate-400">
                        No bibliography sources synced yet.
                    </p>
                </div>

                <div class="space-y-2 border-t border-slate-100 pt-3">
                    <p class="font-semibold text-slate-800">
                        OCR queue ({{ props.ocrJobs.length }})
                    </p>
                    <form v-if="props.canEdit" class="flex gap-1" @submit.prevent="submitOcr">
                        <input
                            v-model="ocrFilename"
                            type="text"
                            placeholder="scan.png"
                            class="min-w-0 flex-1 rounded border border-slate-200 px-2 py-1"
                        />
                        <button
                            type="submit"
                            class="rounded bg-slate-800 px-2 py-1 font-medium text-white hover:bg-slate-900"
                        >
                            Queue
                        </button>
                    </form>
                    <div
                        v-for="job in props.ocrJobs"
                        :key="job.public_id"
                        class="flex items-center justify-between rounded border border-slate-100 bg-slate-50/60 px-2 py-1"
                    >
                        <span class="truncate">{{ job.source_filename }}</span>
                        <div class="ml-2 flex shrink-0 items-center gap-1">
                            <span class="text-[10px] uppercase text-slate-500">{{ job.status }}</span>
                            <button
                                v-if="props.canEdit"
                                type="button"
                                class="text-[10px] text-slate-400 hover:text-rose-600"
                                @click="emit('deleteOcr', job.public_id)"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                </div>

                <div class="space-y-2 border-t border-slate-100 pt-3">
                    <p class="font-semibold text-slate-800">
                        Conversions ({{ props.conversions.length }})
                    </p>
                    <form
                        v-if="props.canEdit"
                        class="space-y-1"
                        @submit.prevent="submitConversion"
                    >
                        <select
                            v-model="conversionDirection"
                            class="w-full rounded border border-slate-200 bg-white px-2 py-1"
                        >
                            <option value="docx_to_latex">DOCX → LaTeX</option>
                            <option value="latex_to_docx">LaTeX → DOCX</option>
                            <option value="markdown_to_latex">Markdown → LaTeX</option>
                        </select>
                        <div class="flex gap-1">
                            <input
                                v-model="conversionFilename"
                                type="text"
                                placeholder="draft.docx"
                                class="min-w-0 flex-1 rounded border border-slate-200 px-2 py-1"
                            />
                            <button
                                type="submit"
                                class="rounded bg-slate-800 px-2 py-1 font-medium text-white hover:bg-slate-900"
                            >
                                Queue
                            </button>
                        </div>
                    </form>
                    <div
                        v-for="job in props.conversions"
                        :key="job.public_id"
                        class="flex items-center justify-between rounded border border-slate-100 bg-slate-50/60 px-2 py-1"
                    >
                        <span class="truncate">{{ job.input_filename }}</span>
                        <div class="ml-2 flex shrink-0 items-center gap-1">
                            <span class="text-[10px] uppercase text-slate-500">
                                {{ job.direction }} · {{ job.status }}
                            </span>
                            <button
                                v-if="props.canEdit"
                                type="button"
                                class="text-[10px] text-slate-400 hover:text-rose-600"
                                @click="emit('deleteConversion', job.public_id)"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
