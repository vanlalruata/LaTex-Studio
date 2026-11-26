<script setup lang="ts">
import { Head, router, useForm } from '@inertiajs/vue3';
import { Files, Plus, Save, Trash2 } from '@lucide/vue';
import { computed, ref } from 'vue';
import {
    destroy,
    store,
    update,
} from '@/routes/admin/public-site/templates';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface TemplateFile {
    path: string;
    content: string;
}

interface TemplateRecord {
    id: number;
    slug: string;
    title: string;
    category: string;
    description: string | null;
    compiler_engine: string;
    files_manifest: TemplateFile[];
    is_public: boolean;
    organization: { id: number; name: string } | null;
}

interface TemplateForm {
    slug: string;
    title: string;
    category: string;
    description: string;
    compiler_engine: string;
    files_json: string;
    files_manifest: string;
    is_public: boolean;
}

const props = defineProps<{
    templates: TemplateRecord[];
    engines: Array<{ value: string; label: string }>;
}>();

const selectedId = ref<number | null>(null);
const pendingDelete = ref<TemplateRecord | null>(null);
const selectedTemplate = computed(() =>
    props.templates.find((template) => template.id === selectedId.value) ?? null,
);

const defaultTex = '\\documentclass{article}\n\\begin{document}\nYour template starts here.\n\\end{document}\n';
const defaultForm: TemplateForm = {
    slug: '',
    title: '',
    category: 'article',
    description: '',
    compiler_engine: 'pdflatex',
    files_json: JSON.stringify([{ path: 'main.tex', content: defaultTex }], null, 2),
    files_manifest: '',
    is_public: false,
};

const createForm = useForm<TemplateForm>({ ...defaultForm });
const editForm = useForm<TemplateForm>({ ...defaultForm });

function editTemplate(template: TemplateRecord): void {
    selectedId.value = template.id;
    editForm.defaults({
        slug: template.slug,
        title: template.title,
        category: template.category,
        description: template.description ?? '',
        compiler_engine: template.compiler_engine,
        files_json: JSON.stringify(template.files_manifest, null, 2),
        files_manifest: '',
        is_public: template.is_public,
    });
    editForm.reset();
    editForm.clearErrors();
}

function decodeManifest(source: string): TemplateFile[] | null {
    try {
        const decoded: unknown = JSON.parse(source);

        if (!Array.isArray(decoded) || decoded.length === 0) {
            return null;
        }

        if (!decoded.every((file) =>
            typeof file === 'object' && file !== null &&
            'path' in file && typeof file.path === 'string' &&
            'content' in file && typeof file.content === 'string')) {
            return null;
        }

        return decoded as TemplateFile[];
    } catch {
        return null;
    }
}

function createTemplate(): void {
    const files = decodeManifest(createForm.files_json);
    createForm.clearErrors('files_json');

    if (files === null) {
        createForm.setError('files_json', 'Enter a JSON array of files with path and content fields.');
        return;
    }

    createForm.transform((data) => {
        const { files_json, ...payload } = data;
        return { ...payload, files_manifest: files };
    }).post(store.url(), {
        preserveScroll: true,
        onSuccess: () => createForm.reset(),
    });
}

function saveTemplate(): void {
    if (selectedId.value === null) {
        return;
    }

    const files = decodeManifest(editForm.files_json);
    editForm.clearErrors('files_json');

    if (files === null) {
        editForm.setError('files_json', 'Enter a JSON array of files with path and content fields.');
        return;
    }

    editForm.transform((data) => {
        const { files_json, ...payload } = data;
        return { ...payload, files_manifest: files };
    }).put(update.url(selectedId.value), {
        preserveScroll: true,
    });
}

function deleteTemplate(): void {
    if (pendingDelete.value === null) {
        return;
    }

    router.delete(destroy.url(pendingDelete.value.id), {
        preserveScroll: true,
        onFinish: () => {
            if (selectedId.value === pendingDelete.value?.id) {
                selectedId.value = null;
            }
            pendingDelete.value = null;
        },
    });
}

function setEngine(form: TemplateForm, value: unknown): void {
    form.compiler_engine = String(value);
}
</script>

<template>
    <Head title="Template Catalog Administration" />

    <main class="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
        <header class="space-y-1">
            <p class="text-sm font-medium text-primary">Administration</p>
            <h1 class="text-2xl font-semibold tracking-tight sm:text-3xl">Template catalog</h1>
            <p class="max-w-2xl text-sm text-muted-foreground">
                Manage starter projects, their source files, compiler defaults, and public availability.
                Every template keeps editable LaTeX source in its manifest.
            </p>
        </header>

        <div class="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(25rem,1fr)]">
            <Card>
                <CardHeader>
                    <CardTitle>Templates</CardTitle>
                    <CardDescription>Private templates remain available to workspace owners only.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div v-if="props.templates.length === 0" class="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                        No templates are configured. Add a starter template to begin the catalog.
                    </div>
                    <ul v-else class="divide-y rounded-lg border">
                        <li v-for="template in props.templates" :key="template.id" class="flex flex-wrap items-center justify-between gap-3 p-4">
                            <div class="min-w-0 space-y-1">
                                <div class="flex flex-wrap items-center gap-2">
                                    <h2 class="font-medium">{{ template.title }}</h2>
                                    <span class="rounded-full border px-2 py-0.5 text-xs capitalize">{{ template.category }}</span>
                                    <span class="rounded-full px-2 py-0.5 text-xs" :class="template.is_public ? 'bg-emerald-100 text-emerald-800' : 'bg-muted text-muted-foreground'">{{ template.is_public ? 'Public' : 'Private' }}</span>
                                </div>
                                <p class="text-sm text-muted-foreground">{{ template.compiler_engine }} · {{ template.files_manifest.length }} source files<span v-if="template.organization"> · {{ template.organization.name }}</span></p>
                            </div>
                            <div class="flex shrink-0 gap-2">
                                <Button type="button" variant="outline" size="sm" @click="editTemplate(template)">{{ selectedId === template.id ? 'Editing' : 'Edit' }}</Button>
                                <Button type="button" variant="ghost" size="icon" :aria-label="`Delete ${template.title}`" @click="pendingDelete = template"><Trash2 class="size-4" /></Button>
                            </div>
                        </li>
                    </ul>
                </CardContent>
            </Card>

            <div class="space-y-6">
                <Card v-if="selectedTemplate">
                    <CardHeader>
                        <CardTitle>Edit {{ selectedTemplate.title }}</CardTitle>
                        <CardDescription>Publishing exposes this template and its summary on the public templates page.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form class="space-y-4" @submit.prevent="saveTemplate">
                            <div class="grid gap-4 sm:grid-cols-2">
                                <div class="space-y-2"><Label for="edit-template-title">Title</Label><Input id="edit-template-title" v-model="editForm.title" required maxlength="255" /><p v-if="editForm.errors.title" class="text-sm text-destructive">{{ editForm.errors.title }}</p></div>
                                <div class="space-y-2"><Label for="edit-template-slug">Slug</Label><Input id="edit-template-slug" v-model="editForm.slug" required maxlength="120" /><p v-if="editForm.errors.slug" class="text-sm text-destructive">{{ editForm.errors.slug }}</p></div>
                            </div>
                            <div class="grid gap-4 sm:grid-cols-2">
                                <div class="space-y-2"><Label for="edit-template-category">Category</Label><Input id="edit-template-category" v-model="editForm.category" required maxlength="64" /></div>
                                <div class="space-y-2"><Label>Compiler engine</Label><Select :model-value="editForm.compiler_engine" @update:model-value="setEngine(editForm, $event)"><SelectTrigger class="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem v-for="engine in props.engines" :key="engine.value" :value="engine.value">{{ engine.label }}</SelectItem></SelectContent></Select></div>
                            </div>
                            <div class="space-y-2"><Label for="edit-template-description">Description</Label><Textarea id="edit-template-description" v-model="editForm.description" rows="2" maxlength="2000" /><p v-if="editForm.errors.description" class="text-sm text-destructive">{{ editForm.errors.description }}</p></div>
                            <div class="space-y-2"><Label for="edit-template-files">Source manifest (JSON)</Label><Textarea id="edit-template-files" v-model="editForm.files_json" class="min-h-48 font-mono text-xs" spellcheck="false" /><p class="text-xs text-muted-foreground">Each entry contains a relative path and its source content. Paths are normalized and traversal is rejected.</p><p v-if="editForm.errors.files_json" class="text-sm text-destructive">{{ editForm.errors.files_json }}</p><p v-if="editForm.errors.files_manifest" class="text-sm text-destructive">{{ editForm.errors.files_manifest }}</p></div>
                            <label class="flex items-center gap-2 text-sm"><Checkbox v-model:checked="editForm.is_public" /> Publish on the public templates page</label>
                            <Button type="submit" :disabled="editForm.processing"><Save class="mr-2 size-4" />Save template</Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle class="flex items-center gap-2"><Plus class="size-4" />Create a template</CardTitle>
                        <CardDescription>Use synthetic or licensed starter content. Keep files portable and self-contained.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form class="space-y-4" @submit.prevent="createTemplate">
                            <div class="grid gap-4 sm:grid-cols-2">
                                <div class="space-y-2"><Label for="new-template-title">Title</Label><Input id="new-template-title" v-model="createForm.title" required maxlength="255" /><p v-if="createForm.errors.title" class="text-sm text-destructive">{{ createForm.errors.title }}</p></div>
                                <div class="space-y-2"><Label for="new-template-slug">Slug</Label><Input id="new-template-slug" v-model="createForm.slug" required maxlength="120" /><p v-if="createForm.errors.slug" class="text-sm text-destructive">{{ createForm.errors.slug }}</p></div>
                            </div>
                            <div class="grid gap-4 sm:grid-cols-2">
                                <div class="space-y-2"><Label for="new-template-category">Category</Label><Input id="new-template-category" v-model="createForm.category" required maxlength="64" /></div>
                                <div class="space-y-2"><Label>Compiler engine</Label><Select :model-value="createForm.compiler_engine" @update:model-value="setEngine(createForm, $event)"><SelectTrigger class="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem v-for="engine in props.engines" :key="engine.value" :value="engine.value">{{ engine.label }}</SelectItem></SelectContent></Select></div>
                            </div>
                            <div class="space-y-2"><Label for="new-template-description">Description</Label><Textarea id="new-template-description" v-model="createForm.description" rows="2" maxlength="2000" /></div>
                            <div class="space-y-2"><Label for="new-template-files">Source manifest (JSON)</Label><Textarea id="new-template-files" v-model="createForm.files_json" class="min-h-48 font-mono text-xs" spellcheck="false" /><p class="text-xs text-muted-foreground">Maximum 40 files and 5 MB combined source. Use forward-slash relative paths.</p><p v-if="createForm.errors.files_json" class="text-sm text-destructive">{{ createForm.errors.files_json }}</p><p v-if="createForm.errors.files_manifest" class="text-sm text-destructive">{{ createForm.errors.files_manifest }}</p></div>
                            <label class="flex items-center gap-2 text-sm"><Checkbox v-model:checked="createForm.is_public" /> Publish on the public templates page</label>
                            <Alert v-if="createForm.errors.compiler_engine || createForm.errors.files_manifest" variant="destructive"><AlertDescription>Check the compiler engine and source manifest values.</AlertDescription></Alert>
                            <Button type="submit" :disabled="createForm.processing"><Files class="mr-2 size-4" />Create template</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>

        <AlertDialog :open="pendingDelete !== null" @update:open="(open) => !open && (pendingDelete = null)">
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete this template?</AlertDialogTitle>
                    <AlertDialogDescription>This permanently removes “{{ pendingDelete?.title }}” and its starter files from the catalog.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel @click="pendingDelete = null">Cancel</AlertDialogCancel>
                    <AlertDialogAction @click="deleteTemplate">Delete template</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </main>
</template>
