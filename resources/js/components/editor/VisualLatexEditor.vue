<script setup lang="ts">
import { Plus, Sigma } from '@lucide/vue';
import { computed } from 'vue';
import { latexToMathML } from '@/lib/mathRenderer';

const props = defineProps<{
    modelValue: string;
    canEdit: boolean;
}>();

const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void;
    (e: 'insertSnippet', snippet: string): void;
}>();

interface VisualBlock {
    kind: 'title' | 'abstract' | 'section' | 'subsection' | 'equation' | 'text';
    content: string;
    rawMatch?: string;
}

const parsedBlocks = computed<VisualBlock[]>(() => {
    const src = props.modelValue;
    const blocks: VisualBlock[] = [];

    const titleMatch = src.match(/\\title\{([^}]*)\}/);
    if (titleMatch) {
        blocks.push({ kind: 'title', content: titleMatch[1] });
    }

    const abstractMatch = src.match(
        /\\begin\{abstract\}([\s\S]*?)\\end\{abstract\}/,
    );
    if (abstractMatch) {
        blocks.push({ kind: 'abstract', content: abstractMatch[1].trim() });
    }

    const bodyMatch = src.match(
        /\\begin\{document\}([\s\S]*?)\\end\{document\}/,
    );
    const body = bodyMatch ? bodyMatch[1] : src;

    const lines = body.split('\n');
    let inEquation = false;
    let eqBuffer: string[] = [];

    for (const line of lines) {
        const trimmed = line.trim();
        if (
            !trimmed ||
            trimmed === '\\maketitle' ||
            trimmed.startsWith('\\begin{abstract}') ||
            trimmed.startsWith('\\end{abstract}') ||
            trimmed.startsWith('\\begin{document}') ||
            trimmed.startsWith('\\end{document}')
        ) {
            continue;
        }

        if (trimmed.startsWith('\\begin{equation')) {
            inEquation = true;
            eqBuffer = [];
            continue;
        }

        if (trimmed.startsWith('\\end{equation')) {
            inEquation = false;
            blocks.push({
                kind: 'equation',
                content: eqBuffer.join(' ').trim(),
            });
            continue;
        }

        if (inEquation) {
            if (!trimmed.startsWith('\\label{')) {
                eqBuffer.push(trimmed.replace(/\\label\{[^}]*\}/g, '').trim());
            }
            continue;
        }

        const sec = trimmed.match(/^\\section\*?\{([^}]*)\}/);
        if (sec) {
            blocks.push({
                kind: 'section',
                content: sec[1],
                rawMatch: trimmed,
            });
            continue;
        }

        const subsec = trimmed.match(/^\\subsection\*?\{([^}]*)\}/);
        if (subsec) {
            blocks.push({
                kind: 'subsection',
                content: subsec[1],
                rawMatch: trimmed,
            });
            continue;
        }

        if (!trimmed.startsWith('\\')) {
            blocks.push({ kind: 'text', content: trimmed });
        }
    }

    return blocks;
});

function renderEquation(tex: string): string {
    try {
        return latexToMathML(tex, true);
    } catch {
        return tex;
    }
}

function updateTitle(newTitle: string): void {
    if (!props.canEdit) {
        return;
    }
    const updated = props.modelValue.replace(
        /\\title\{([^}]*)\}/,
        `\\title{${newTitle}}`,
    );
    emit('update:modelValue', updated);
}

function updateSection(oldRaw: string | undefined, newHeading: string): void {
    if (!props.canEdit || !oldRaw) {
        return;
    }
    const isSub = oldRaw.startsWith('\\subsection');
    const replacement = isSub
        ? `\\subsection{${newHeading}}`
        : `\\section{${newHeading}}`;
    emit('update:modelValue', props.modelValue.replace(oldRaw, replacement));
}
</script>

<template>
    <div class="flex h-full flex-col overflow-y-auto bg-slate-50/50 p-6">
        <div
            class="mx-auto w-full max-w-2xl space-y-5 rounded-xl border border-slate-200 bg-white p-8 shadow-xs"
        >
            <div
                class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3"
            >
                <span class="text-xs font-medium text-slate-500">
                    Visual Document View (synced with LaTeX source)
                </span>
                <div v-if="canEdit" class="flex gap-1.5">
                    <button
                        type="button"
                        class="inline-flex items-center gap-1 rounded border border-slate-200 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
                        @click="
                            emit('insertSnippet', '\n\\section{New Section}\n')
                        "
                    >
                        <Plus class="size-3" /> Section
                    </button>
                    <button
                        type="button"
                        class="inline-flex items-center gap-1 rounded border border-slate-200 px-2 py-1 text-xs text-slate-700 hover:bg-slate-50"
                        @click="
                            emit(
                                'insertSnippet',
                                '\n\\begin{equation}\n    f(x) = x^2\n\\end{equation}\n',
                            )
                        "
                    >
                        <Sigma class="size-3" /> Equation
                    </button>
                </div>
            </div>

            <div
                v-if="parsedBlocks.length === 0"
                class="py-12 text-center text-sm text-slate-400"
            >
                Open a <code class="font-mono">.tex</code> file with sections or
                equations to inspect its visual structure.
            </div>

            <template v-for="(block, index) in parsedBlocks" :key="index">
                <div v-if="block.kind === 'title'" class="text-center">
                    <input
                        :value="block.content"
                        :readonly="!canEdit"
                        class="w-full border-b border-transparent text-center font-serif text-2xl font-semibold text-slate-900 focus:border-indigo-400 focus:outline-none"
                        @change="
                            updateTitle(
                                ($event.target as HTMLInputElement).value,
                            )
                        "
                    />
                </div>

                <div
                    v-else-if="block.kind === 'abstract'"
                    class="rounded-lg border border-slate-100 bg-slate-50/80 p-4"
                >
                    <p
                        class="mb-1 text-center text-xs font-semibold text-slate-500 uppercase"
                    >
                        Abstract
                    </p>
                    <p class="text-sm leading-relaxed text-slate-700">
                        {{ block.content }}
                    </p>
                </div>

                <div v-else-if="block.kind === 'section'">
                    <input
                        :value="block.content"
                        :readonly="!canEdit"
                        class="w-full border-b border-transparent text-lg font-semibold text-slate-900 focus:border-indigo-400 focus:outline-none"
                        @change="
                            updateSection(
                                block.rawMatch,
                                ($event.target as HTMLInputElement).value,
                            )
                        "
                    />
                </div>

                <div v-else-if="block.kind === 'subsection'">
                    <input
                        :value="block.content"
                        :readonly="!canEdit"
                        class="w-full border-b border-transparent text-base font-semibold text-slate-800 focus:border-indigo-400 focus:outline-none"
                        @change="
                            updateSection(
                                block.rawMatch,
                                ($event.target as HTMLInputElement).value,
                            )
                        "
                    />
                </div>

                <div
                    v-else-if="block.kind === 'equation'"
                    class="overflow-x-auto rounded-lg border border-slate-100 bg-slate-50 px-4 py-3 text-center text-slate-900"
                    v-html="renderEquation(block.content)"
                />

                <p v-else class="text-sm leading-relaxed text-slate-700">
                    {{ block.content }}
                </p>
            </template>
        </div>
    </div>
</template>
