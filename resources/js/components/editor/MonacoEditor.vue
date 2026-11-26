<script setup lang="ts">
import * as monaco from 'monaco-editor';
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
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
    }>(),
    {
        language: 'latex',
        readOnly: false,
    },
);

const emit = defineEmits<{
    'update:modelValue': [value: string];
    cursorChange: [position: { lineNumber: number; column: number }];
    save: [];
}>();

const containerRef = ref<HTMLElement | null>(null);
let editorInstance: monaco.editor.IStandaloneCodeEditor | null = null;
let ignoreNextChange = false;

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

    editorInstance.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
        emit('save');
    });
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
    <div ref="containerRef" class="h-full w-full overflow-hidden bg-white" />
</template>
