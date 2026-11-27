<script setup lang="ts">
import { Upload } from '@lucide/vue';
import { ref } from 'vue';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const props = defineProps<{
    open: boolean;
    importUrl: string;
    getCsrfToken: () => string;
}>();

const emit = defineEmits<{
    'update:open': [value: boolean];
    imported: [];
}>();

const bibtex = ref('');
const loading = ref(false);
const resultMessage = ref<string | null>(null);
const errors = ref<string[]>([]);

async function submitImport(): Promise<void> {
    if (!bibtex.value.trim()) {
        return;
    }

    loading.value = true;
    resultMessage.value = null;
    errors.value = [];

    try {
        const response = await fetch(props.importUrl, {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-XSRF-TOKEN': props.getCsrfToken(),
            },
            body: JSON.stringify({ bibtex: bibtex.value }),
        });

        if (!response.ok) {
            resultMessage.value = 'Failed to import BibTeX entries.';
            return;
        }

        const data = (await response.json()) as {
            imported_count: number;
            errors: string[];
        };

        errors.value = data.errors;
        resultMessage.value = `Imported ${data.imported_count} entry(s).`;

        if (data.imported_count > 0) {
            emit('imported');
            if (data.errors.length === 0) {
                bibtex.value = '';
                emit('update:open', false);
            }
        }
    } finally {
        loading.value = false;
    }
}
</script>

<template>
    <Dialog :open="props.open" @update:open="emit('update:open', $event)">
        <DialogContent class="sm:max-w-xl">
            <DialogHeader>
                <DialogTitle>Import BibTeX (.bib)</DialogTitle>
                <DialogDescription>
                    Paste raw BibTeX entries below to add them to your project bibliography.
                </DialogDescription>
            </DialogHeader>

            <form class="space-y-4" @submit.prevent="submitImport">
                <div class="space-y-2">
                    <Label for="bib-import-textarea">BibTeX entries</Label>
                    <Textarea
                        id="bib-import-textarea"
                        v-model="bibtex"
                        rows="8"
                        class="font-mono text-xs"
                        placeholder="@article{vaswani2017attention, title={Attention Is All You Need}, author={Vaswani, Ashish}, year={2017}}"
                    />
                </div>

                <p v-if="resultMessage" class="text-sm text-muted-foreground">{{ resultMessage }}</p>
                <ul v-if="errors.length > 0" class="list-disc pl-5 text-xs text-destructive">
                    <li v-for="(err, idx) in errors" :key="idx">{{ err }}</li>
                </ul>

                <div class="flex justify-end">
                    <Button type="submit" :disabled="loading">
                        <Upload class="mr-1.5 size-4" />
                        {{ loading ? 'Importing...' : 'Import entries' }}
                    </Button>
                </div>
            </form>
        </DialogContent>
    </Dialog>
</template>
