<script setup lang="ts">
import { AlertTriangle, BookOpen, Download, Globe, Plus, Search, Upload } from '@lucide/vue';
import { computed, ref } from 'vue';
import ImportBibDialog from '@/components/bibliography/ImportBibDialog.vue';
import LookupDialog from '@/components/bibliography/LookupDialog.vue';
import type { BibEntry } from '@/services/latex/bibtexParser';

const props = defineProps<{
    entries: BibEntry[];
    canEdit?: boolean;
    lookupUrl?: string;
    storeUrl?: string;
    importUrl?: string;
    exportUrl?: string;
    getCsrfToken?: () => string;
}>();

const emit = defineEmits<{
    insertCite: [key: string];
    refresh: [];
}>();

const query = ref('');
const showLookupDialog = ref(false);
const showImportDialog = ref(false);

const filteredEntries = computed(() => {
    const q = query.value.trim().toLowerCase();
    if (!q) {
        return props.entries;
    }

    return props.entries.filter(
        (e) =>
            e.key.toLowerCase().includes(q) ||
            e.title.toLowerCase().includes(q) ||
            e.author.toLowerCase().includes(q) ||
            e.year.toLowerCase().includes(q) ||
            e.doi.toLowerCase().includes(q),
    );
});
</script>

<template>
    <div class="flex h-full flex-col">
        <div class="flex items-center justify-between border-b border-slate-100 px-3 py-2">
            <span class="text-xs font-semibold tracking-wider text-slate-500 uppercase">Bibliography</span>
            <div class="flex items-center gap-1">
                <button
                    v-if="canEdit && lookupUrl && storeUrl"
                    type="button"
                    class="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                    title="Lookup DOI / arXiv / CrossRef"
                    @click="showLookupDialog = true"
                >
                    <Globe class="size-3.5" />
                </button>
                <button
                    v-if="canEdit && importUrl"
                    type="button"
                    class="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                    title="Import .bib"
                    @click="showImportDialog = true"
                >
                    <Upload class="size-3.5" />
                </button>
                <a
                    v-if="exportUrl"
                    :href="exportUrl"
                    class="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                    title="Export references.bib"
                >
                    <Download class="size-3.5" />
                </a>
            </div>
        </div>

        <div class="border-b border-slate-100 p-2">
            <div class="relative">
                <Search class="pointer-events-none absolute top-2 left-2.5 size-3.5 text-slate-400" />
                <input
                    v-model="query"
                    type="search"
                    placeholder="Search author, title, key, DOI..."
                    class="w-full rounded-md border border-slate-200 bg-slate-50 py-1 pr-2 pl-7 text-xs outline-none focus:border-indigo-500 focus:bg-white"
                />
            </div>
        </div>

        <div class="flex-1 space-y-2 overflow-y-auto p-2">
            <div v-if="filteredEntries.length === 0" class="py-8 text-center text-xs text-slate-400">
                <BookOpen class="mx-auto mb-2 size-6 text-slate-300" />
                <p>No `.bib` entries found.</p>
            </div>

            <div
                v-for="entry in filteredEntries"
                :key="entry.key"
                class="rounded-lg border border-slate-200 bg-white p-2.5 text-xs"
            >
                <div class="flex items-start justify-between gap-2">
                    <span class="font-mono font-semibold text-indigo-700">{{ entry.key }}</span>
                    <button
                        type="button"
                        class="inline-flex items-center gap-0.5 rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] font-medium text-indigo-700 hover:bg-indigo-100"
                        title="Insert \\cite{key}"
                        @click="emit('insertCite', `\\cite{${entry.key}}`)"
                    >
                        <Plus class="size-3" />
                        <span>Cite</span>
                    </button>
                </div>

                <p class="mt-1 line-clamp-2 font-medium text-slate-800">{{ entry.title }}</p>
                <p class="mt-0.5 truncate text-[11px] text-slate-500">
                    {{ entry.author }} ({{ entry.year }})
                </p>

                <div
                    v-if="entry.isDuplicate"
                    class="mt-1.5 flex items-center gap-1 text-[10px] font-medium text-amber-700"
                >
                    <AlertTriangle class="size-3" />
                    <span>Duplicate citation key</span>
                </div>
            </div>
        </div>

        <LookupDialog
            v-if="lookupUrl && storeUrl && getCsrfToken"
            v-model:open="showLookupDialog"
            :lookup-url="lookupUrl"
            :store-url="storeUrl"
            :get-csrf-token="getCsrfToken"
            @imported="emit('refresh')"
        />

        <ImportBibDialog
            v-if="importUrl && getCsrfToken"
            v-model:open="showImportDialog"
            :import-url="importUrl"
            :get-csrf-token="getCsrfToken"
            @imported="emit('refresh')"
        />
    </div>
</template>
