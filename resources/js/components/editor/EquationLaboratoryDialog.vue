<script setup lang="ts">
import {
    AlertCircle,
    BookmarkPlus,
    CheckCircle2,
    Copy,
    Redo2,
    Search,
    Sigma,
    Star,
    Undo2,
} from '@lucide/vue';
import { computed, nextTick, ref, watch } from 'vue';
import { toast } from 'vue-sonner';
import MathfieldAdapter from '@/components/editor/MathfieldAdapter.vue';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { latexToMathML } from '@/lib/mathRenderer';
import {
    EQUATION_TEMPLATES,
    type EquationTemplateEntry,
} from '@/services/equationBuilder/equationTemplates';
import {
    type EquationInsertMode,
    validateEquationLatex,
    wrapEquationForInsertion,
} from '@/services/equationBuilder/equationValidator';
import {
    type MathSymbolEntry,
    searchSymbols,
    SYMBOL_CATEGORIES,
    type SymbolCategory,
} from '@/services/equationBuilder/symbolCatalogue';

const props = withDefaults(
    defineProps<{
        open: boolean;
        initialLatex?: string;
        canEdit?: boolean;
    }>(),
    {
        initialLatex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
        canEdit: true,
    },
);

const emit = defineEmits<{
    'update:open': [value: boolean];
    insert: [latex: string];
    saveAsset: [payload: { title: string; latex: string }];
}>();

const FAVORITES_KEY = 'equation_lab_favorites_v1';
const RECENTS_KEY = 'equation_lab_recents_v1';

const formula = ref(props.initialLatex);
const historyPast = ref<string[]>([]);
const historyFuture = ref<string[]>([]);
const searchQuery = ref('');
const activeCategory = ref<SymbolCategory | 'all' | 'favorites' | 'recent'>('greek');
const insertMode = ref<EquationInsertMode>('equation');
const equationLabel = ref('');
const textareaRef = ref<{ $el?: HTMLElement } | null>(null);
const mathfieldRef = ref<InstanceType<typeof MathfieldAdapter> | null>(null);
const editorSurface = ref<'mathfield' | 'source'>('mathfield');

const favoriteIds = ref<string[]>(loadStoredIds(FAVORITES_KEY));
const recentIds = ref<string[]>(loadStoredIds(RECENTS_KEY));

function loadStoredIds(key: string): string[] {
    if (typeof window === 'undefined') {
        return [];
    }
    try {
        const raw = window.localStorage.getItem(key);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : [];
    } catch {
        return [];
    }
}

function saveStoredIds(key: string, ids: string[]): void {
    if (typeof window === 'undefined') {
        return;
    }
    try {
        window.localStorage.setItem(key, JSON.stringify(ids));
    } catch {
        // Ignore storage quota errors.
    }
}

watch(
    () => props.open,
    (isOpen) => {
        if (isOpen && props.initialLatex) {
            formula.value = props.initialLatex;
            historyPast.value = [];
            historyFuture.value = [];
        }
    },
);

const filteredSymbols = computed(() =>
    searchSymbols(
        searchQuery.value,
        searchQuery.value.trim() ? 'all' : activeCategory.value,
        favoriteIds.value,
        recentIds.value,
    ),
);

const validation = computed(() => validateEquationLatex(formula.value));

const previewMathMl = computed(() => {
    try {
        return latexToMathML(formula.value || '\\;', insertMode.value !== 'inline' && insertMode.value !== 'inline_parens');
    } catch {
        return '';
    }
});

function updateFormula(nextValue: string): void {
    if (nextValue === formula.value) {
        return;
    }
    historyPast.value = [...historyPast.value.slice(-39), formula.value];
    historyFuture.value = [];
    formula.value = nextValue;
}

function undo(): void {
    if (historyPast.value.length === 0) {
        return;
    }
    const prev = historyPast.value[historyPast.value.length - 1];
    historyPast.value = historyPast.value.slice(0, -1);
    historyFuture.value = [formula.value, ...historyFuture.value];
    formula.value = prev;
}

function redo(): void {
    if (historyFuture.value.length === 0) {
        return;
    }
    const next = historyFuture.value[0];
    historyFuture.value = historyFuture.value.slice(1);
    historyPast.value = [...historyPast.value, formula.value];
    formula.value = next;
}

function getTextareaElement(): HTMLTextAreaElement | null {
    const root = textareaRef.value?.$el;
    if (!root) {
        return null;
    }
    return root instanceof HTMLTextAreaElement ? root : root.querySelector('textarea');
}

function insertAtCursor(snippet: string): void {
    if (editorSurface.value === 'mathfield' && mathfieldRef.value) {
        mathfieldRef.value.insertSnippet(snippet);
        return;
    }

    const el = getTextareaElement();
    if (!el) {
        updateFormula(formula.value ? `${formula.value} ${snippet}` : snippet);
        return;
    }

    const start = el.selectionStart ?? formula.value.length;
    const end = el.selectionEnd ?? formula.value.length;
    const next =
        formula.value.slice(0, start) + snippet + formula.value.slice(end);
    updateFormula(next);

    void nextTick(() => {
        el.focus();
        const cursorPos = start + snippet.length;
        el.setSelectionRange(cursorPos, cursorPos);
    });
}

function handleSymbolClick(sym: MathSymbolEntry): void {
    insertAtCursor(sym.snippet);
    recentIds.value = [sym.id, ...recentIds.value.filter((id) => id !== sym.id)].slice(0, 24);
    saveStoredIds(RECENTS_KEY, recentIds.value);
}

function toggleFavorite(symId: string): void {
    if (favoriteIds.value.includes(symId)) {
        favoriteIds.value = favoriteIds.value.filter((id) => id !== symId);
    } else {
        favoriteIds.value = [symId, ...favoriteIds.value];
    }
    saveStoredIds(FAVORITES_KEY, favoriteIds.value);
}

function handleTemplateClick(tpl: EquationTemplateEntry): void {
    insertAtCursor(tpl.latex);
}

async function copyLatex(): Promise<void> {
    try {
        await navigator.clipboard.writeText(
            wrapEquationForInsertion(formula.value, insertMode.value, equationLabel.value),
        );
        toast.success('Copied LaTeX to clipboard');
    } catch {
        toast.error('Clipboard permission denied');
    }
}

function handleInsertFormula(): void {
    if (!formula.value.trim()) {
        return;
    }
    const wrapped = wrapEquationForInsertion(
        formula.value,
        insertMode.value,
        equationLabel.value,
    );
    emit('insert', wrapped);
    emit('update:open', false);
}

function handleSaveToLibrary(): void {
    if (!formula.value.trim()) {
        return;
    }
    emit('saveAsset', {
        title: equationLabel.value.trim() || 'Equation snippet',
        latex: wrapEquationForInsertion(formula.value, insertMode.value, equationLabel.value),
    });
    toast.success('Saved equation to project library');
}
</script>

<template>
    <Dialog :open="open" @update:open="emit('update:open', $event)">
        <DialogContent class="max-h-[90vh] w-[95vw] max-w-6xl gap-4 overflow-y-auto p-5 sm:max-w-6xl">
            <DialogHeader class="pb-1">
                <div class="flex flex-wrap items-center justify-between gap-2 pr-6">
                    <div class="flex items-center gap-2">
                        <Sigma class="size-5 text-emerald-600" />
                        <DialogTitle class="text-base">LaTeX Equation Laboratory</DialogTitle>
                    </div>
                    <div class="flex items-center gap-1.5">
                        <Button
                            variant="ghost"
                            size="icon"
                            class="size-7"
                            :disabled="historyPast.length === 0"
                            aria-label="Undo formula edit"
                            @click="undo"
                        >
                            <Undo2 class="size-3.5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            class="size-7"
                            :disabled="historyFuture.length === 0"
                            aria-label="Redo formula edit"
                            @click="redo"
                        >
                            <Redo2 class="size-3.5" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            class="h-7 text-xs"
                            @click="copyLatex"
                        >
                            <Copy class="mr-1 size-3" />
                            Copy
                        </Button>
                    </div>
                </div>
                <DialogDescription class="text-xs">
                    Compose equations with searchable symbols, templates, live preview, and structural validation.
                </DialogDescription>
            </DialogHeader>

            <TooltipProvider>
                <!-- Category Tabs & Search -->
                <div class="flex flex-wrap items-start justify-between gap-3">
                    <Tabs v-model="activeCategory" class="min-w-0 flex-1">
                        <TabsList class="h-auto flex-wrap justify-start gap-1 p-1">
                            <TabsTrigger value="greek" class="px-2.5 py-1 text-xs">Greek</TabsTrigger>
                            <TabsTrigger value="arrows" class="px-2.5 py-1 text-xs">Arrows</TabsTrigger>
                            <TabsTrigger value="operators" class="px-2.5 py-1 text-xs">Operators</TabsTrigger>
                            <TabsTrigger value="relations" class="px-2.5 py-1 text-xs">Relations</TabsTrigger>
                            <TabsTrigger
                                v-for="cat in SYMBOL_CATEGORIES.filter((c) => !['greek', 'arrows', 'operators', 'relations'].includes(c.id))"
                                :key="cat.id"
                                :value="cat.id"
                                class="px-2.5 py-1 text-xs"
                            >
                                {{ cat.label }}
                            </TabsTrigger>
                            <TabsTrigger value="favorites" class="px-2.5 py-1 text-xs">Favorites</TabsTrigger>
                            <TabsTrigger value="recent" class="px-2.5 py-1 text-xs">Recent</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <div class="relative w-64 shrink-0">
                        <Search class="pointer-events-none absolute top-2 left-2.5 size-3.5 text-slate-400" />
                        <Input
                            v-model="searchQuery"
                            class="h-8 pl-8 text-xs"
                            placeholder="Search symbols, commands..."
                            aria-label="Search symbols"
                        />
                    </div>
                </div>

                <!-- Main Grid -->
                <div class="grid grid-cols-1 gap-3 lg:grid-cols-12">
                    <!-- Left: Formula Expression, Live Preview, Symbol Grid -->
                    <div class="space-y-3 lg:col-span-8">
                        <div class="flex items-center justify-between">
                            <Tabs v-model="editorSurface">
                                <TabsList class="h-7">
                                    <TabsTrigger value="mathfield" class="px-2.5 text-xs">Visual Mathfield</TabsTrigger>
                                    <TabsTrigger value="source" class="px-2.5 text-xs">Raw LaTeX</TabsTrigger>
                                </TabsList>
                            </Tabs>
                            <div class="flex items-center gap-1.5">
                                <Badge
                                    v-if="validation.valid"
                                    variant="secondary"
                                    class="text-[10px] text-emerald-700"
                                >
                                    <CheckCircle2 class="mr-1 size-3" />
                                    Valid Syntax
                                </Badge>
                                <Badge
                                    v-for="pkg in validation.requiredPackages"
                                    :key="pkg"
                                    variant="outline"
                                    class="text-[10px]"
                                >
                                    {{ pkg }}
                                </Badge>
                            </div>
                        </div>

                        <MathfieldAdapter
                            v-if="editorSurface === 'mathfield'"
                            ref="mathfieldRef"
                            :model-value="formula"
                            :display-mode="insertMode !== 'inline' && insertMode !== 'inline_parens'"
                            :read-only="!canEdit"
                            @update:model-value="updateFormula"
                            @undo="undo"
                            @redo="redo"
                        />

                        <template v-else>
                            <div>
                                <Textarea
                                    ref="textareaRef"
                                    :model-value="formula"
                                    rows="3"
                                    class="font-mono text-xs"
                                    placeholder="Enter LaTeX math expression..."
                                    @update:model-value="updateFormula(String($event))"
                                />
                            </div>
                            <div
                                class="flex min-h-20 items-center justify-center overflow-x-auto rounded-md border border-slate-200 bg-slate-950 px-4 py-3 text-lg text-white"
                                v-html="previewMathMl"
                            />
                        </template>

                        <Alert v-if="validation.issues.some((i) => i.severity === 'error')" variant="destructive" class="py-2">
                            <AlertCircle class="size-4" />
                            <AlertTitle class="text-xs">Syntax Validation</AlertTitle>
                            <AlertDescription class="text-xs">
                                <ul class="list-disc pl-4">
                                    <li v-for="(issue, idx) in validation.issues" :key="idx">
                                        {{ issue.message }}
                                    </li>
                                </ul>
                            </AlertDescription>
                        </Alert>

                        <div>
                            <div class="mb-1 flex items-center justify-between">
                                <Label class="text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
                                    {{ searchQuery.trim() ? `Search Results (${filteredSymbols.length})` : `${activeCategory} Symbols` }}
                                </Label>
                                <span class="text-[10px] text-slate-400">
                                    Click to insert at cursor · Right-click or star to favorite
                                </span>
                            </div>
                            <ScrollArea class="h-44 rounded-md border border-slate-200 bg-slate-50/60 p-2">
                                <div v-if="filteredSymbols.length === 0" class="py-8 text-center text-xs text-slate-400">
                                    No matching symbols found.
                                </div>
                                <div v-else class="grid grid-cols-6 gap-1.5 sm:grid-cols-9">
                                    <Tooltip v-for="sym in filteredSymbols" :key="sym.id">
                                        <TooltipTrigger as-child>
                                            <div class="group relative">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    class="h-9 w-full bg-white px-1 font-serif text-sm hover:border-indigo-300 hover:bg-indigo-50/50"
                                                    :aria-label="`${sym.spokenName} (${sym.latex})`"
                                                    @click="handleSymbolClick(sym)"
                                                    @contextmenu.prevent="toggleFavorite(sym.id)"
                                                >
                                                    {{ sym.glyph }}
                                                </Button>
                                                <button
                                                    type="button"
                                                    class="absolute -top-1 -right-1 hidden rounded-full bg-white p-0.5 shadow-xs group-hover:block"
                                                    :class="favoriteIds.includes(sym.id) ? '!block text-amber-500' : 'text-slate-300'"
                                                    aria-label="Toggle favorite"
                                                    @click.stop="toggleFavorite(sym.id)"
                                                >
                                                    <Star class="size-2.5 fill-current" />
                                                </button>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent class="text-xs">
                                            <p class="font-medium">{{ sym.spokenName }}</p>
                                            <p class="font-mono text-[11px] text-slate-400">{{ sym.latex }}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                            </ScrollArea>
                        </div>
                    </div>

                    <!-- Right: Standard Templates & Insertion Settings -->
                    <div class="flex flex-col justify-between space-y-3 lg:col-span-4">
                        <div>
                            <Label class="text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
                                Standard Templates
                            </Label>
                            <p class="mt-0.5 mb-2 text-[11px] text-slate-500">
                                Click template to insert at cursor without overwriting.
                            </p>
                            <ScrollArea class="h-64 pr-2">
                                <div class="space-y-1.5">
                                    <Button
                                        v-for="tpl in EQUATION_TEMPLATES"
                                        :key="tpl.id"
                                        variant="outline"
                                        size="sm"
                                        class="h-auto w-full flex-col items-start justify-start px-3 py-2 text-left"
                                        @click="handleTemplateClick(tpl)"
                                    >
                                        <span class="text-xs font-medium text-slate-800">{{ tpl.title }}</span>
                                        <span class="text-[10px] font-normal text-slate-500">{{ tpl.description }}</span>
                                    </Button>
                                </div>
                            </ScrollArea>
                        </div>

                        <div class="space-y-2 rounded-md border border-slate-200 bg-slate-50 p-3 text-xs">
                            <div>
                                <Label class="text-[11px]">Insertion Mode</Label>
                                <Select v-model="insertMode">
                                    <SelectTrigger class="mt-1 h-8 bg-white text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="inline">Inline ($...$)</SelectItem>
                                        <SelectItem value="inline_parens">Inline (\(...\))</SelectItem>
                                        <SelectItem value="display">Display (\[...\])</SelectItem>
                                        <SelectItem value="equation">Numbered Equation</SelectItem>
                                        <SelectItem value="equation_star">Unnumbered Equation*</SelectItem>
                                        <SelectItem value="align">Aligned Environment</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div v-if="insertMode === 'equation' || insertMode === 'align'">
                                <Label class="text-[11px]">Optional Label</Label>
                                <Input
                                    v-model="equationLabel"
                                    class="mt-1 h-8 bg-white text-xs"
                                    placeholder="eq:objective"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </TooltipProvider>

            <DialogFooter class="flex items-center justify-between pt-2 sm:justify-between">
                <Button
                    v-if="canEdit"
                    variant="outline"
                    size="sm"
                    :disabled="!formula.trim()"
                    @click="handleSaveToLibrary"
                >
                    <BookmarkPlus class="mr-1.5 size-3.5" />
                    Save to Library
                </Button>
                <div class="flex items-center gap-2">
                    <Button variant="outline" @click="emit('update:open', false)">
                        Cancel
                    </Button>
                    <Button
                        :disabled="!formula.trim() || !canEdit"
                        @click="handleInsertFormula"
                    >
                        Insert Formula
                    </Button>
                </div>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>
