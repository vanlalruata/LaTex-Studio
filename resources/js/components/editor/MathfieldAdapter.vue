<script setup lang="ts">
import { Keyboard, MoveRight } from '@lucide/vue';
import { computed, nextTick, ref } from 'vue';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { latexToMathML } from '@/lib/mathRenderer';

const props = withDefaults(
    defineProps<{
        modelValue: string;
        displayMode?: boolean;
        readOnly?: boolean;
    }>(),
    {
        displayMode: true,
        readOnly: false,
    },
);

const emit = defineEmits<{
    'update:modelValue': [value: string];
    undo: [];
    redo: [];
}>();

const inputRef = ref<HTMLInputElement | null>(null);
const showVirtualKeyboard = ref(true);
const vkTab = ref<'core' | 'functions' | 'greek' | 'structures'>('core');

const renderedMathMl = computed(() => {
    try {
        const normalized = (props.modelValue || '\\square').replace(/#(\d+)/g, '\\square');
        return latexToMathML(normalized, props.displayMode);
    } catch {
        return '';
    }
});

const placeholderCount = computed(() => {
    const matches = props.modelValue.match(/#\d+|\\square/g);
    return matches ? matches.length : 0;
});

function focusField(): void {
    inputRef.value?.focus();
}

function jumpToNextPlaceholder(): void {
    const el = inputRef.value;
    if (!el) {
        return;
    }
    const val = props.modelValue;
    const cursor = el.selectionEnd ?? 0;
    const regex = /#\d+|\\square/g;
    let match: RegExpExecArray | null;
    let firstMatch: RegExpExecArray | null = null;

    while ((match = regex.exec(val)) !== null) {
        if (!firstMatch) {
            firstMatch = match;
        }
        if (match.index >= cursor) {
            el.focus();
            el.setSelectionRange(match.index, match.index + match[0].length);
            return;
        }
    }

    if (firstMatch) {
        el.focus();
        el.setSelectionRange(firstMatch.index, firstMatch.index + firstMatch[0].length);
    }
}

function insertSnippet(snippet: string): void {
    if (props.readOnly) {
        return;
    }
    const el = inputRef.value;
    if (!el) {
        emit('update:modelValue', props.modelValue ? `${props.modelValue} ${snippet}` : snippet);
        return;
    }

    const start = el.selectionStart ?? props.modelValue.length;
    const end = el.selectionEnd ?? props.modelValue.length;
    const next = props.modelValue.slice(0, start) + snippet + props.modelValue.slice(end);
    emit('update:modelValue', next);

    void nextTick(() => {
        el.focus();
        const placeholderMatch = /#\d+|\\square/.exec(snippet);
        if (placeholderMatch) {
            const pStart = start + placeholderMatch.index;
            el.setSelectionRange(pStart, pStart + placeholderMatch[0].length);
        } else {
            const pos = start + snippet.length;
            el.setSelectionRange(pos, pos);
        }
    });
}

function handleKeydown(event: KeyboardEvent): void {
    if (event.key === 'Tab' && placeholderCount.value > 0) {
        event.preventDefault();
        jumpToNextPlaceholder();
        return;
    }
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'z') {
        event.preventDefault();
        if (event.shiftKey) {
            emit('redo');
        } else {
            emit('undo');
        }
    }
}

defineExpose({
    insertSnippet,
    focusField,
    jumpToNextPlaceholder,
});

const vkKeys: Record<typeof vkTab.value, Array<{ label: string; snippet: string; spoken: string }>> = {
    core: [
        { label: 'a/b', snippet: '\\frac{#1}{#2}', spoken: 'Fraction' },
        { label: '√x', snippet: '\\sqrt{#1}', spoken: 'Square root' },
        { label: 'xⁿ', snippet: '^{#1}', spoken: 'Superscript' },
        { label: 'xₙ', snippet: '_{#1}', spoken: 'Subscript' },
        { label: '±', snippet: '\\pm', spoken: 'Plus minus' },
        { label: '≠', snippet: '\\neq', spoken: 'Not equal' },
        { label: '≤', snippet: '\\leq', spoken: 'Less than or equal' },
        { label: '≥', snippet: '\\geq', spoken: 'Greater than or equal' },
        { label: '≈', snippet: '\\approx', spoken: 'Approximately equal' },
        { label: '·', snippet: '\\cdot', spoken: 'Dot product' },
        { label: '×', snippet: '\\times', spoken: 'Times' },
        { label: '∞', snippet: '\\infty', spoken: 'Infinity' },
    ],
    functions: [
        { label: '∑', snippet: '\\sum_{i=1}^{n} #1', spoken: 'Summation' },
        { label: '∏', snippet: '\\prod_{i=1}^{n} #1', spoken: 'Product' },
        { label: '∫', snippet: '\\int_{a}^{b} #1\\,dx', spoken: 'Integral' },
        { label: 'lim', snippet: '\\lim_{x \\to \\infty} #1', spoken: 'Limit' },
        { label: '∂/∂x', snippet: '\\frac{\\partial #1}{\\partial x}', spoken: 'Partial derivative' },
        { label: 'sin', snippet: '\\sin(#1)', spoken: 'Sine' },
        { label: 'cos', snippet: '\\cos(#1)', spoken: 'Cosine' },
        { label: 'log', snippet: '\\log(#1)', spoken: 'Logarithm' },
        { label: 'exp', snippet: '\\exp(#1)', spoken: 'Exponential' },
        { label: 'argmin', snippet: '\\arg\\min_{#1}', spoken: 'Argmin' },
    ],
    greek: [
        { label: 'α', snippet: '\\alpha', spoken: 'Alpha' },
        { label: 'β', snippet: '\\beta', spoken: 'Beta' },
        { label: 'γ', snippet: '\\gamma', spoken: 'Gamma' },
        { label: 'δ', snippet: '\\delta', spoken: 'Delta' },
        { label: 'θ', snippet: '\\theta', spoken: 'Theta' },
        { label: 'λ', snippet: '\\lambda', spoken: 'Lambda' },
        { label: 'μ', snippet: '\\mu', spoken: 'Mu' },
        { label: 'π', snippet: '\\pi', spoken: 'Pi' },
        { label: 'σ', snippet: '\\sigma', spoken: 'Sigma' },
        { label: 'φ', snippet: '\\varphi', spoken: 'Phi' },
        { label: 'ω', snippet: '\\omega', spoken: 'Omega' },
        { label: 'Δ', snippet: '\\Delta', spoken: 'Capital Delta' },
    ],
    structures: [
        { label: '( )', snippet: '\\left( #1 \\right)', spoken: 'Scaled parentheses' },
        { label: '[ ]', snippet: '\\left[ #1 \\right]', spoken: 'Scaled brackets' },
        { label: '‖·‖', snippet: '\\left\\| #1 \\right\\|_2', spoken: 'L2 norm' },
        { label: '⟨·,·⟩', snippet: '\\langle #1, #2 \\rangle', spoken: 'Inner product' },
        { label: '[Mat]', snippet: '\\begin{pmatrix} #1 & #2 \\\\ #3 & #4 \\end{pmatrix}', spoken: '2x2 Matrix' },
        { label: '{Cases', snippet: '\\begin{cases} #1 & \\text{if } #2 \\\\ #3 & \\text{otherwise} \\end{cases}', spoken: 'Cases' },
        { label: 'x̂', snippet: '\\hat{#1}', spoken: 'Hat accent' },
        { label: 'x⃗', snippet: '\\vec{#1}', spoken: 'Vector arrow' },
    ],
};
</script>

<template>
    <div class="space-y-2 rounded-md border border-slate-200 bg-white p-2.5">
        <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
                <Badge variant="secondary" class="text-[10px]">Interactive Mathfield</Badge>
                <span v-if="placeholderCount > 0" class="text-[11px] text-amber-700">
                    {{ placeholderCount }} placeholder(s) · Press Tab to jump
                </span>
            </div>
            <div class="flex items-center gap-1.5">
                <Button
                    v-if="placeholderCount > 0"
                    variant="outline"
                    size="sm"
                    class="h-6 px-2 text-[11px]"
                    @click="jumpToNextPlaceholder"
                >
                    <MoveRight class="mr-1 size-3" />
                    Next Slot
                </Button>
                <Button
                    :variant="showVirtualKeyboard ? 'secondary' : 'ghost'"
                    size="sm"
                    class="h-6 px-2 text-[11px]"
                    @click="showVirtualKeyboard = !showVirtualKeyboard"
                >
                    <Keyboard class="mr-1 size-3" />
                    Keypad
                </Button>
            </div>
        </div>

        <!-- Visual Rendered Mathfield Surface -->
        <div
            class="flex min-h-20 cursor-text items-center justify-center overflow-x-auto rounded-md border border-emerald-500/40 bg-slate-950 px-4 py-3 text-lg text-white"
            role="region"
            aria-label="Interactive Mathematical Preview"
            @click="focusField"
            v-html="renderedMathMl"
        />

        <!-- Caret-Aware Math Input -->
        <input
            ref="inputRef"
            type="text"
            :value="modelValue"
            :readonly="readOnly"
            aria-label="Mathfield expression input"
            placeholder="Type LaTeX math or use the keypad below..."
            class="h-8 w-full rounded-md border border-slate-200 bg-slate-50 px-2.5 font-mono text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none"
            @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
            @keydown="handleKeydown"
        />

        <!-- Virtual Mathematical Keyboard -->
        <div v-if="showVirtualKeyboard && !readOnly" class="rounded-md border border-slate-200 bg-slate-50 p-2">
            <Tabs v-model="vkTab" class="mb-2">
                <TabsList class="h-7">
                    <TabsTrigger value="core" class="px-2 text-[11px]">123 &amp; Ops</TabsTrigger>
                    <TabsTrigger value="functions" class="px-2 text-[11px]">Calc &amp; f(x)</TabsTrigger>
                    <TabsTrigger value="greek" class="px-2 text-[11px]">αβγ</TabsTrigger>
                    <TabsTrigger value="structures" class="px-2 text-[11px]">Structures</TabsTrigger>
                </TabsList>
            </Tabs>
            <div class="grid grid-cols-4 gap-1 sm:grid-cols-6">
                <Button
                    v-for="k in vkKeys[vkTab]"
                    :key="k.label"
                    variant="outline"
                    size="sm"
                    class="h-7 bg-white px-1.5 text-xs font-medium"
                    :aria-label="k.spoken"
                    :title="`${k.spoken} (${k.snippet})`"
                    @click="insertSnippet(k.snippet)"
                >
                    {{ k.label }}
                </Button>
            </div>
        </div>
    </div>
</template>
