<script setup lang="ts">
import { Copy, FlaskConical, Search, Star } from '@lucide/vue';
import { computed, ref } from 'vue';
import { toast } from 'vue-sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { DOMAIN_EXTRA_SYMBOLS } from '@/services/equationBuilder/customSymbols';
import { EQUATION_TEMPLATES } from '@/services/equationBuilder/equationTemplates';
import {
    MATH_SYMBOLS,
    type MathSymbolEntry,
    SYMBOL_CATEGORIES,
    type SymbolCategory,
} from '@/services/equationBuilder/symbolCatalogue';

const emit = defineEmits<{
    insert: [snippet: string];
    openLab: [];
}>();

const FAVORITES_KEY = 'equation_lab_favorites_v1';
const RECENTS_KEY = 'equation_lab_recents_v1';

const searchQuery = ref('');
const activeCategory = ref<SymbolCategory | 'all' | 'favorites' | 'recent' | 'templates'>('greek');
const hoveredSymbol = ref<MathSymbolEntry | null>(null);

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

const favoriteIds = ref<string[]>(loadStoredIds(FAVORITES_KEY));
const recentIds = ref<string[]>(loadStoredIds(RECENTS_KEY));

const allSymbols = computed<MathSymbolEntry[]>(() => [...MATH_SYMBOLS, ...DOMAIN_EXTRA_SYMBOLS]);

const filteredSymbols = computed(() => {
    const q = searchQuery.value.trim().toLowerCase();
    let pool = allSymbols.value;

    if (!q) {
        if (activeCategory.value === 'favorites') {
            const favSet = new Set(favoriteIds.value);
            pool = allSymbols.value.filter((s) => favSet.has(s.id));
        } else if (activeCategory.value === 'recent') {
            const byId = new Map(allSymbols.value.map((s) => [s.id, s]));
            pool = recentIds.value
                .map((id) => byId.get(id))
                .filter((s): s is MathSymbolEntry => Boolean(s));
        } else if (activeCategory.value !== 'all' && activeCategory.value !== 'templates') {
            pool = allSymbols.value.filter((s) => s.category === activeCategory.value);
        }
        return pool;
    }

    return allSymbols.value.filter(
        (s) =>
            s.spokenName.toLowerCase().includes(q) ||
            s.latex.toLowerCase().includes(q) ||
            s.glyph.toLowerCase().includes(q) ||
            s.aliases.some((a) => a.toLowerCase().includes(q)) ||
            s.keywords.some((k) => k.toLowerCase().includes(q)),
    );
});

const filteredTemplates = computed(() => {
    const q = searchQuery.value.trim().toLowerCase();
    if (!q) {
        return EQUATION_TEMPLATES;
    }
    return EQUATION_TEMPLATES.filter(
        (t) =>
            t.title.toLowerCase().includes(q) ||
            t.description.toLowerCase().includes(q) ||
            t.latex.toLowerCase().includes(q),
    );
});

function handleInsertSymbol(sym: MathSymbolEntry): void {
    emit('insert', sym.snippet);
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

async function copyCommand(latex: string): Promise<void> {
    try {
        await navigator.clipboard.writeText(latex);
        toast.success(`Copied ${latex}`);
    } catch {
        toast.error('Unable to copy');
    }
}
</script>

<template>
    <div class="flex h-full flex-col overflow-hidden bg-white">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-slate-100 px-3 py-2">
            <span class="text-xs font-semibold tracking-wider text-slate-500 uppercase">
                Symbol Palette
            </span>
            <Button
                variant="ghost"
                size="sm"
                class="h-6 px-1.5 text-[11px] text-emerald-700 hover:bg-emerald-50"
                title="Open LaTeX Equation Laboratory"
                @click="emit('openLab')"
            >
                <FlaskConical class="mr-1 size-3" />
                Lab
            </Button>
        </div>

        <!-- Search & Category Selector -->
        <div class="space-y-1.5 border-b border-slate-100 p-2">
            <div class="relative">
                <Search class="pointer-events-none absolute top-2 left-2.5 size-3.5 text-slate-400" />
                <Input
                    v-model="searchQuery"
                    class="h-7 pl-7 text-xs"
                    placeholder="Search glyph, \cmd, alias..."
                    aria-label="Search symbols in palette"
                />
            </div>

            <Select v-model="activeCategory">
                <SelectTrigger class="h-7 text-xs">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="greek">Greek Letters</SelectItem>
                    <SelectItem value="operators">Operators</SelectItem>
                    <SelectItem value="relations">Relations</SelectItem>
                    <SelectItem value="arrows">Arrows</SelectItem>
                    <SelectItem
                        v-for="cat in SYMBOL_CATEGORIES.filter((c) => !['greek', 'operators', 'relations', 'arrows'].includes(c.id))"
                        :key="cat.id"
                        :value="cat.id"
                    >
                        {{ cat.label }}
                    </SelectItem>
                    <SelectItem value="templates">Equation Templates</SelectItem>
                    <SelectItem value="favorites">Favorites ({{ favoriteIds.length }})</SelectItem>
                    <SelectItem value="recent">Recent ({{ recentIds.length }})</SelectItem>
                    <SelectItem value="all">All Symbols ({{ allSymbols.length }})</SelectItem>
                </SelectContent>
            </Select>
        </div>

        <!-- Symbol Grid or Templates -->
        <ScrollArea class="min-h-0 flex-1 p-2">
            <div v-if="activeCategory === 'templates' && !searchQuery.trim()" class="space-y-1.5">
                <button
                    v-for="tpl in filteredTemplates"
                    :key="tpl.id"
                    type="button"
                    class="w-full rounded-md border border-slate-200 bg-slate-50/60 p-2 text-left transition hover:border-indigo-300 hover:bg-indigo-50/40"
                    @click="emit('insert', tpl.latex)"
                >
                    <p class="text-xs font-medium text-slate-800">{{ tpl.title }}</p>
                    <p class="mt-0.5 truncate font-mono text-[10px] text-slate-500">{{ tpl.latex }}</p>
                </button>
            </div>

            <div v-else-if="filteredSymbols.length === 0" class="py-6 text-center text-xs text-slate-400">
                No matching symbols found.
            </div>

            <div v-else class="grid grid-cols-4 gap-1.5">
                <div
                    v-for="sym in filteredSymbols"
                    :key="sym.id"
                    class="group relative"
                    @mouseenter="hoveredSymbol = sym"
                >
                    <button
                        type="button"
                        class="flex h-9 w-full items-center justify-center rounded-md border border-slate-200 bg-white font-serif text-sm text-slate-800 transition hover:border-indigo-300 hover:bg-indigo-50/60 hover:text-indigo-700"
                        :aria-label="`${sym.spokenName} (${sym.latex})`"
                        :title="`${sym.spokenName} — ${sym.latex}`"
                        @click="handleInsertSymbol(sym)"
                        @contextmenu.prevent="toggleFavorite(sym.id)"
                    >
                        {{ sym.glyph }}
                    </button>
                    <button
                        type="button"
                        class="absolute -top-1 -right-1 hidden rounded-full bg-white p-0.5 shadow-xs group-hover:block"
                        :class="favoriteIds.includes(sym.id) ? '!block text-amber-500' : 'text-slate-300'"
                        aria-label="Toggle favorite symbol"
                        @click.stop="toggleFavorite(sym.id)"
                    >
                        <Star class="size-2.5 fill-current" />
                    </button>
                </div>
            </div>
        </ScrollArea>

        <!-- Inspector Footer for Hovered Symbol -->
        <div class="shrink-0 border-t border-slate-100 bg-slate-50/80 px-2.5 py-2 text-[11px]">
            <template v-if="hoveredSymbol">
                <div class="flex items-center justify-between gap-1">
                    <span class="truncate font-medium text-slate-800">{{ hoveredSymbol.spokenName }}</span>
                    <button
                        type="button"
                        class="rounded p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                        title="Copy LaTeX command"
                        @click="copyCommand(hoveredSymbol.latex)"
                    >
                        <Copy class="size-3" />
                    </button>
                </div>
                <div class="mt-0.5 flex items-center justify-between gap-1">
                    <code class="truncate font-mono text-[10px] text-indigo-700">{{ hoveredSymbol.latex }}</code>
                    <div class="flex gap-1">
                        <Badge
                            v-for="pkg in hoveredSymbol.requiredPackages"
                            :key="pkg"
                            variant="outline"
                            class="h-4 px-1 text-[9px]"
                        >
                            {{ pkg }}
                        </Badge>
                    </div>
                </div>
            </template>
            <p v-else class="text-[10px] text-slate-400">
                Hover a symbol to inspect command &amp; package · Right-click to favorite.
            </p>
        </div>
    </div>
</template>
