<script setup lang="ts">
import { Plus, Search } from '@lucide/vue';
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface LookupResultItem {
    title: string;
    authors: string[];
    year: number | null;
    venue: string | null;
    doi: string | null;
    url: string | null;
    raw_bibtex: string | null;
}

const props = defineProps<{
    open: boolean;
    lookupUrl: string;
    storeUrl: string;
    getCsrfToken: () => string;
}>();

const emit = defineEmits<{
    'update:open': [value: boolean];
    imported: [];
}>();

const provider = ref<'doi' | 'arxiv' | 'crossref'>('doi');
const query = ref('');
const loading = ref(false);
const errorMessage = ref<string | null>(null);
const results = ref<LookupResultItem[]>([]);

async function runLookup(): Promise<void> {
    if (!query.value.trim()) {
        return;
    }

    loading.value = true;
    errorMessage.value = null;
    results.value = [];

    try {
        const response = await fetch(props.lookupUrl, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-XSRF-TOKEN': props.getCsrfToken(),
            },
            body: JSON.stringify({
                provider: provider.value,
                mode: provider.value === 'crossref' ? 'search' : 'lookup',
                query: query.value.trim(),
            }),
        });

        if (!response.ok) {
            errorMessage.value = 'Lookup failed. Check the identifier or try again.';
            return;
        }

        const data = (await response.json()) as { results: LookupResultItem[] };
        results.value = data.results;
        if (results.value.length === 0) {
            errorMessage.value = 'No matching references found.';
        }
    } catch {
        errorMessage.value = 'Network error while querying reference provider.';
    } finally {
        loading.value = false;
    }
}

async function addSource(item: LookupResultItem): Promise<void> {
    const response = await fetch(props.storeUrl, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-XSRF-TOKEN': props.getCsrfToken(),
        },
        body: JSON.stringify({
            ...item,
            provider: provider.value,
        }),
    });

    if (response.ok) {
        emit('imported');
        emit('update:open', false);
    }
}
</script>

<template>
    <Dialog :open="props.open" @update:open="emit('update:open', $event)">
        <DialogContent class="sm:max-w-xl">
            <DialogHeader>
                <DialogTitle>Lookup reference by DOI, arXiv, or CrossRef</DialogTitle>
                <DialogDescription>
                    Fetch structured bibliographic metadata and add it directly to your project.
                </DialogDescription>
            </DialogHeader>

            <form class="space-y-4" @submit.prevent="runLookup">
                <div class="flex gap-2">
                    <Button
                        v-for="p in (['doi', 'arxiv', 'crossref'] as const)"
                        :key="p"
                        type="button"
                        size="sm"
                        :variant="provider === p ? 'default' : 'outline'"
                        @click="provider = p"
                    >
                        {{ p === 'doi' ? 'DOI' : p === 'arxiv' ? 'arXiv' : 'CrossRef Search' }}
                    </Button>
                </div>

                <div class="flex gap-2">
                    <div class="flex-1">
                        <Label for="bib-lookup-query" class="sr-only">Identifier or search query</Label>
                        <Input
                            id="bib-lookup-query"
                            v-model="query"
                            :placeholder="provider === 'doi' ? '10.1038/nature12373' : provider === 'arxiv' ? '2301.00001' : 'Attention is all you need'"
                        />
                    </div>
                    <Button type="submit" :disabled="loading">
                        <Search class="mr-1.5 size-4" />
                        {{ loading ? 'Searching...' : 'Search' }}
                    </Button>
                </div>
            </form>

            <p v-if="errorMessage" class="text-sm text-destructive">{{ errorMessage }}</p>

            <div v-if="results.length > 0" class="max-h-72 space-y-2 overflow-y-auto">
                <div
                    v-for="(item, idx) in results"
                    :key="idx"
                    class="flex items-start justify-between gap-3 rounded-lg border p-3 text-sm"
                >
                    <div class="space-y-0.5">
                        <p class="font-medium">{{ item.title }}</p>
                        <p class="text-xs text-muted-foreground">
                            {{ item.authors.join(', ') || 'Unknown authors' }}
                            <span v-if="item.year">({{ item.year }})</span>
                            <span v-if="item.venue"> · {{ item.venue }}</span>
                        </p>
                    </div>
                    <Button size="sm" variant="outline" @click="addSource(item)">
                        <Plus class="mr-1 size-3.5" />
                        Add
                    </Button>
                </div>
            </div>
        </DialogContent>
    </Dialog>
</template>
