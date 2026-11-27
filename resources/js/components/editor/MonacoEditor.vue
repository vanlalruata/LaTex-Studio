<script setup lang="ts">
import * as monaco from 'monaco-editor';
import { onBeforeUnmount, onMounted, ref, toRef, watch } from 'vue';
import { useRemoteCursors } from '@/composables/useRemoteCursors';
import type { PresenceUser } from '@/composables/useWorkspacePresence';
import { registerLatexLanguage } from '@/services/latex/monacoLatexLanguage';
import {
    applyLiveMarkers,
    registerLatexProviders,
} from '@/services/latex/monacoLatexProviders';

const props = withDefaults(
    defineProps<{
        modelValue: string;
        language?: string;
        readOnly?: boolean;
        remoteCursors?: PresenceUser[];
        currentFileId?: string | null;
        currentUserId?: number | null;
    }>(),
    {
        language: 'latex',
        readOnly: false,
        remoteCursors: () => [],
        currentFileId: null,
        currentUserId: null,
    },
);

const emit = defineEmits<{
    'update:modelValue': [value: string];
    cursorChange: [position: { lineNumber: number; column: number }];
    synctexJump: [lineNumber: number];
    save: [];
}>();

const containerRef = ref<HTMLElement | null>(null);
let editorInstance: monaco.editor.IStandaloneCodeEditor | null = null;
let ignoreNextChange = false;

const { syncDecorations } = useRemoteCursors(
    () => editorInstance,
    toRef(props, 'remoteCursors'),
    toRef(props, 'currentFileId'),
    toRef(props, 'currentUserId'),
);

function insertText(text: string): void {
    if (!editorInstance) {
        return;
    }

    const selection = editorInstance.getSelection();
    if (!selection) {
        return;
    }

    editorInstance.executeEdits('toolbar', [
        {
            range: selection,
            text,
            forceMoveMarkers: true,
        },
    ]);
    editorInstance.focus();
}

function revealLine(lineNumber: number): void {
    if (!editorInstance) {
        return;
    }

    editorInstance.revealLineInCenter(lineNumber);
    editorInstance.setPosition({ lineNumber, column: 1 });
    editorInstance.focus();
}

function refreshMarkers(): void {
    const model = editorInstance?.getModel();
    if (model && props.language === 'latex') {
        applyLiveMarkers(model);
    }
}

defineExpose({
    insertText,
    revealLine,
    refreshMarkers,
});

onMounted(() => {
    if (!containerRef.value) {
        return;
    }

    registerLatexLanguage();
    registerLatexProviders();

    editorInstance = monaco.editor.create(containerRef.value, {
        value: props.modelValue,
        language: props.language,
        theme: 'latex-studio-light',
        readOnly: props.readOnly,
        automaticLayout: true,
        wordWrap: 'on',
        minimap: { enabled: false },
        fontSize: 13.5,
        lineHeight: 22,
        fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
        scrollBeyondLastLine: false,
        renderLineHighlight: 'line',
        padding: { top: 12, bottom: 12 },
    });

    editorInstance.onDidChangeModelContent(() => {
        if (ignoreNextChange || !editorInstance) {
            return;
        }
        refreshMarkers();
        emit('update:modelValue', editorInstance.getValue());
    });

    refreshMarkers();

    editorInstance.onDidChangeCursorPosition((event) => {
        emit('cursorChange', {
            lineNumber: event.position.lineNumber,
            column: event.position.column,
        });
    });

    editorInstance.onMouseDown((event) => {
        if ((event.event.ctrlKey || event.event.metaKey) && event.target.position) {
            emit('synctexJump', event.target.position.lineNumber);
        }
    });

    editorInstance.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
        emit('save');
    });

    syncDecorations();
});

watch(
    () => props.modelValue,
    (newValue) => {
        if (!editorInstance) {
            return;
        }
        if (editorInstance.getValue() !== newValue) {
            ignoreNextChange = true;
            editorInstance.setValue(newValue);
            ignoreNextChange = false;
        }
    },
);

watch(
    () => props.language,
    (newLanguage) => {
        if (!editorInstance) {
            return;
        }
        const model = editorInstance.getModel();
        if (model) {
            monaco.editor.setModelLanguage(model, newLanguage);
        }
    },
);

onBeforeUnmount(() => {
    editorInstance?.dispose();
    editorInstance = null;
});
</script>

<template>
    <div ref="containerRef" class="latex-monaco-host h-full w-full overflow-hidden bg-white" />
</template>

<style scoped>
.latex-monaco-host :deep(.monaco-hover) {
    max-width: calc(100% - 16px) !important;
}

.latex-monaco-host :deep(.monaco-hover .monaco-hover-content) {
    max-width: 100% !important;
    overflow-x: auto;
}

.latex-monaco-host :deep(.monaco-hover .rendered-markdown img) {
    max-width: 100%;
    height: auto;
    display: block;
}

.latex-monaco-host :deep(.remote-cursor-caret) {
    border-left: 2px solid;
    margin-left: -1px;
}

.latex-monaco-host :deep(.remote-cursor-caret-indigo) { border-color: #6366f1; }
.latex-monaco-host :deep(.remote-cursor-caret-emerald) { border-color: #10b981; }
.latex-monaco-host :deep(.remote-cursor-caret-amber) { border-color: #f59e0b; }
.latex-monaco-host :deep(.remote-cursor-caret-rose) { border-color: #f43f5e; }
.latex-monaco-host :deep(.remote-cursor-caret-sky) { border-color: #0ea5e9; }
.latex-monaco-host :deep(.remote-cursor-caret-violet) { border-color: #8b5cf6; }
</style>
