<script setup lang="ts">
import { Code2, Grid, Image, Sigma } from '@lucide/vue';
import { computed, ref } from 'vue';
import { latexToMathML } from '@/lib/mathRenderer';

const emit = defineEmits<{
    (e: 'insert', snippet: string): void;
}>();

const activeTool = ref<'table' | 'tikz' | 'math' | 'snippets'>('table');
const tableRows = ref(3);
const tableCols = ref(3);
const tableCaption = ref('Experimental validation results.');
const mathInput = ref(
    '\\hat{\\theta} = \\arg\\min_{\\theta} \\|X\\theta - y\\|_2^2',
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
        <div class="grid grid-cols-4 border-b border-slate-200 bg-slate-50">
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

            <div v-else class="space-y-2">
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
        </div>
    </div>
</template>
