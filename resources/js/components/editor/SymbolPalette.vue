<script setup lang="ts">
import { computed, ref } from 'vue';

const emit = defineEmits<{
    insert: [snippet: string];
}>();

const activeCategory = ref<'greek' | 'operators' | 'relations' | 'arrows' | 'structures'>('greek');

const categories: Array<{ id: typeof activeCategory.value; label: string }> = [
    { id: 'greek', label: 'Greek' },
    { id: 'operators', label: 'Ops' },
    { id: 'relations', label: 'Rel' },
    { id: 'arrows', label: 'Arrows' },
    { id: 'structures', label: 'Struct' },
];

const symbols: Record<typeof activeCategory.value, Array<{ glyph: string; cmd: string }>> = {
    greek: [
        { glyph: 'α', cmd: '\\alpha' },
        { glyph: 'β', cmd: '\\beta' },
        { glyph: 'γ', cmd: '\\gamma' },
        { glyph: 'δ', cmd: '\\delta' },
        { glyph: 'ϵ', cmd: '\\epsilon' },
        { glyph: 'θ', cmd: '\\theta' },
        { glyph: 'λ', cmd: '\\lambda' },
        { glyph: 'μ', cmd: '\\mu' },
        { glyph: 'π', cmd: '\\pi' },
        { glyph: 'σ', cmd: '\\sigma' },
        { glyph: 'ϕ', cmd: '\\phi' },
        { glyph: 'ω', cmd: '\\omega' },
        { glyph: 'Γ', cmd: '\\Gamma' },
        { glyph: 'Δ', cmd: '\\Delta' },
        { glyph: 'Θ', cmd: '\\Theta' },
        { glyph: 'Σ', cmd: '\\Sigma' },
        { glyph: 'Ω', cmd: '\\Omega' },
    ],
    operators: [
        { glyph: '∑', cmd: '\\sum_{i=1}^{n}' },
        { glyph: '∏', cmd: '\\prod_{i=1}^{n}' },
        { glyph: '∫', cmd: '\\int_{a}^{b}' },
        { glyph: '∂', cmd: '\\partial' },
        { glyph: '∇', cmd: '\\nabla' },
        { glyph: '±', cmd: '\\pm' },
        { glyph: '×', cmd: '\\times' },
        { glyph: '·', cmd: '\\cdot' },
        { glyph: '∞', cmd: '\\infty' },
    ],
    relations: [
        { glyph: '≤', cmd: '\\leq' },
        { glyph: '≥', cmd: '\\geq' },
        { glyph: '≠', cmd: '\\neq' },
        { glyph: '≈', cmd: '\\approx' },
        { glyph: '≡', cmd: '\\equiv' },
        { glyph: '∈', cmd: '\\in' },
        { glyph: '∉', cmd: '\\notin' },
        { glyph: '⊂', cmd: '\\subset' },
        { glyph: '⊆', cmd: '\\subseteq' },
    ],
    arrows: [
        { glyph: '→', cmd: '\\rightarrow' },
        { glyph: '←', cmd: '\\leftarrow' },
        { glyph: '⇒', cmd: '\\Rightarrow' },
        { glyph: '⇔', cmd: '\\Leftrightarrow' },
        { glyph: '↦', cmd: '\\mapsto' },
        { glyph: '↑', cmd: '\\uparrow' },
        { glyph: '↓', cmd: '\\downarrow' },
    ],
    structures: [
        { glyph: 'a/b', cmd: '\\frac{a}{b}' },
        { glyph: '√x', cmd: '\\sqrt{x}' },
        { glyph: 'xⁿ', cmd: '^{n}' },
        { glyph: 'xᵢ', cmd: '_{i}' },
        { glyph: '‖x‖', cmd: '\\left\\| x \\right\\|' },
        { glyph: '()', cmd: '\\left(  \\right)' },
    ],
};

const currentSymbols = computed(() => symbols[activeCategory.value]);
</script>

<template>
    <div class="flex h-full flex-col">
        <div class="border-b border-slate-100 px-3 py-2">
            <span class="text-xs font-semibold tracking-wider text-slate-500 uppercase">Symbol Palette</span>
        </div>

        <div class="flex gap-1 border-b border-slate-100 p-1.5">
            <button
                v-for="cat in categories"
                :key="cat.id"
                type="button"
                class="flex-1 rounded px-1.5 py-1 text-[11px] font-medium transition"
                :class="
                    activeCategory === cat.id
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-slate-600 hover:bg-slate-100'
                "
                @click="activeCategory = cat.id"
            >
                {{ cat.label }}
            </button>
        </div>

        <div class="grid grid-cols-4 gap-1.5 overflow-y-auto p-2">
            <button
                v-for="sym in currentSymbols"
                :key="sym.cmd"
                type="button"
                class="flex flex-col items-center justify-center rounded-md border border-slate-200 bg-white p-2 text-slate-800 transition hover:border-indigo-300 hover:bg-indigo-50/50"
                :title="sym.cmd"
                @click="emit('insert', sym.cmd)"
            >
                <span class="text-base leading-none">{{ sym.glyph }}</span>
            </button>
        </div>
    </div>
</template>
