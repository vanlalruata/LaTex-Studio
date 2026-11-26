<script setup lang="ts">
import { Head, router, useForm } from '@inertiajs/vue3';
import { Plus, Save, Trash2 } from '@lucide/vue';
import { computed, ref } from 'vue';
import {
    destroy,
    store,
    update,
} from '@/routes/admin/public-site/features';
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

interface MarketingFeature {
    id: number;
    slug: string;
    title: string;
    summary: string;
    description: string;
    category: string;
    availability_status: 'available' | 'beta' | 'planned' | 'disabled';
    icon_key: string;
    is_featured: boolean;
    is_public: boolean;
    sort_order: number;
}

interface MarketingFeatureForm {
    slug: string;
    title: string;
    summary: string;
    description: string;
    category: string;
    availability_status: MarketingFeature['availability_status'];
    icon_key: string;
    is_featured: boolean;
    is_public: boolean;
    sort_order: number;
}

const props = defineProps<{
    features: MarketingFeature[];
    iconKeys: string[];
}>();

const selectedFeatureId = ref<number | null>(null);
const pendingDelete = ref<MarketingFeature | null>(null);
const selectedFeature = computed(() =>
    props.features.find((feature) => feature.id === selectedFeatureId.value) ?? null,
);

const emptyFeature: MarketingFeatureForm = {
    slug: '',
    title: '',
    summary: '',
    description: '',
    category: 'Writing environment',
    availability_status: 'planned',
    icon_key: 'code',
    is_featured: false,
    is_public: true,
    sort_order: 0,
};

const createForm = useForm<MarketingFeatureForm>({ ...emptyFeature });
const editForm = useForm<MarketingFeatureForm>({ ...emptyFeature });

function editFeature(feature: MarketingFeature): void {
    selectedFeatureId.value = feature.id;
    editForm.defaults({
        slug: feature.slug,
        title: feature.title,
        summary: feature.summary,
        description: feature.description,
        category: feature.category,
        availability_status: feature.availability_status,
        icon_key: feature.icon_key,
        is_featured: feature.is_featured,
        is_public: feature.is_public,
        sort_order: feature.sort_order,
    });
    editForm.reset();
    editForm.clearErrors();
}

function createFeature(): void {
    createForm.post(store.url(), {
        preserveScroll: true,
        onSuccess: () => createForm.reset(),
    });
}

function saveFeature(): void {
    if (selectedFeatureId.value === null) {
        return;
    }

    editForm.put(update.url(selectedFeatureId.value), {
        preserveScroll: true,
    });
}

function deleteFeature(): void {
    if (pendingDelete.value === null) {
        return;
    }

    router.delete(destroy.url(pendingDelete.value.id), {
        preserveScroll: true,
        onFinish: () => {
            if (selectedFeatureId.value === pendingDelete.value?.id) {
                selectedFeatureId.value = null;
            }
            pendingDelete.value = null;
        },
    });
}

function setStatus(form: MarketingFeatureForm, value: unknown): void {
    form.availability_status = String(value) as MarketingFeatureForm['availability_status'];
}

function setIcon(form: MarketingFeatureForm, value: unknown): void {
    form.icon_key = String(value);
}
</script>

<template>
    <Head title="Marketing Features" />

    <main class="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
        <header class="flex flex-wrap items-end justify-between gap-4">
            <div class="space-y-1">
                <p class="text-sm font-medium text-primary">Administration</p>
                <h1 class="text-2xl font-semibold tracking-tight sm:text-3xl">
                    Marketing features
                </h1>
                <p class="max-w-2xl text-sm text-muted-foreground">
                    Control the capability labels and descriptions shown on the public website.
                    “Available” should only be used for features verified in this release.
                </p>
            </div>
            <span class="rounded-full border px-3 py-1 text-sm text-muted-foreground">
                {{ props.features.length }} items
            </span>
        </header>

        <div class="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(20rem,0.7fr)]">
            <Card>
                <CardHeader>
                    <CardTitle>Feature catalog</CardTitle>
                    <CardDescription>
                        Public items appear in the Features page. Featured items also appear on Home.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div v-if="props.features.length === 0" class="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                        No feature entries yet. Add the seeded catalog or create the first item.
                    </div>
                    <ul v-else class="divide-y rounded-lg border">
                        <li v-for="feature in props.features" :key="feature.id" class="flex flex-wrap items-center justify-between gap-3 p-4">
                            <div class="min-w-0 space-y-1">
                                <div class="flex flex-wrap items-center gap-2">
                                    <h2 class="font-medium">{{ feature.title }}</h2>
                                    <span class="rounded-full border px-2 py-0.5 text-xs capitalize">{{ feature.availability_status }}</span>
                                    <span v-if="!feature.is_public" class="rounded-full bg-muted px-2 py-0.5 text-xs">Hidden</span>
                                </div>
                                <p class="line-clamp-2 text-sm text-muted-foreground">{{ feature.summary }}</p>
                            </div>
                            <div class="flex shrink-0 gap-2">
                                <Button type="button" variant="outline" size="sm" @click="editFeature(feature)">
                                    {{ selectedFeatureId === feature.id ? 'Editing' : 'Edit' }}
                                </Button>
                                <Button type="button" variant="ghost" size="icon" :aria-label="`Delete ${feature.title}`" @click="pendingDelete = feature">
                                    <Trash2 class="size-4" />
                                </Button>
                            </div>
                        </li>
                    </ul>
                </CardContent>
            </Card>

            <div class="space-y-6">
                <Card v-if="selectedFeature">
                    <CardHeader>
                        <CardTitle>Edit feature</CardTitle>
                        <CardDescription>Changes are logged and reflected on public pages.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form class="space-y-4" @submit.prevent="saveFeature">
                            <div class="grid gap-4 sm:grid-cols-2">
                                <div class="space-y-2">
                                    <Label for="edit-title">Title</Label>
                                    <Input id="edit-title" v-model="editForm.title" required maxlength="255" />
                                    <p v-if="editForm.errors.title" class="text-sm text-destructive">{{ editForm.errors.title }}</p>
                                </div>
                                <div class="space-y-2">
                                    <Label for="edit-slug">Slug</Label>
                                    <Input id="edit-slug" v-model="editForm.slug" required maxlength="120" />
                                    <p v-if="editForm.errors.slug" class="text-sm text-destructive">{{ editForm.errors.slug }}</p>
                                </div>
                            </div>
                            <div class="space-y-2">
                                <Label for="edit-summary">Summary</Label>
                                <Input id="edit-summary" v-model="editForm.summary" required maxlength="500" />
                                <p v-if="editForm.errors.summary" class="text-sm text-destructive">{{ editForm.errors.summary }}</p>
                            </div>
                            <div class="space-y-2">
                                <Label for="edit-description">Description</Label>
                                <Textarea id="edit-description" v-model="editForm.description" required rows="3" maxlength="5000" />
                                <p v-if="editForm.errors.description" class="text-sm text-destructive">{{ editForm.errors.description }}</p>
                            </div>
                            <div class="grid gap-4 sm:grid-cols-2">
                                <div class="space-y-2">
                                    <Label for="edit-category">Category</Label>
                                    <Input id="edit-category" v-model="editForm.category" required maxlength="100" />
                                </div>
                                <div class="space-y-2">
                                    <Label>Status</Label>
                                    <Select :model-value="editForm.availability_status" @update:model-value="setStatus(editForm, $event)">
                                        <SelectTrigger class="w-full"><SelectValue placeholder="Choose status" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem v-for="status in ['available', 'beta', 'planned', 'disabled']" :key="status" :value="status" class="capitalize">{{ status }}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div class="grid gap-4 sm:grid-cols-2">
                                <div class="space-y-2">
                                    <Label>Icon</Label>
                                    <Select :model-value="editForm.icon_key" @update:model-value="setIcon(editForm, $event)">
                                        <SelectTrigger class="w-full"><SelectValue placeholder="Choose icon" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem v-for="icon in props.iconKeys" :key="icon" :value="icon">{{ icon }}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div class="space-y-2">
                                    <Label for="edit-order">Order</Label>
                                    <Input id="edit-order" v-model.number="editForm.sort_order" type="number" min="0" max="65535" required />
                                </div>
                            </div>
                            <div class="flex flex-wrap gap-5">
                                <label class="flex items-center gap-2 text-sm"><Checkbox v-model:checked="editForm.is_featured" /> Featured on Home</label>
                                <label class="flex items-center gap-2 text-sm"><Checkbox v-model:checked="editForm.is_public" /> Visible publicly</label>
                            </div>
                            <Alert v-if="editForm.errors.availability_status || editForm.errors.icon_key || editForm.errors.sort_order" variant="destructive">
                                <AlertDescription>Check the status, icon, and order values.</AlertDescription>
                            </Alert>
                            <Button type="submit" :disabled="editForm.processing"><Save class="mr-2 size-4" />Save changes</Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle class="flex items-center gap-2"><Plus class="size-4" />Add a feature</CardTitle>
                        <CardDescription>New roadmap items default to Planned and can be published when ready.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form class="space-y-4" @submit.prevent="createFeature">
                            <div class="grid gap-4 sm:grid-cols-2">
                                <div class="space-y-2"><Label for="new-title">Title</Label><Input id="new-title" v-model="createForm.title" required maxlength="255" /><p v-if="createForm.errors.title" class="text-sm text-destructive">{{ createForm.errors.title }}</p></div>
                                <div class="space-y-2"><Label for="new-slug">Slug</Label><Input id="new-slug" v-model="createForm.slug" required maxlength="120" /><p v-if="createForm.errors.slug" class="text-sm text-destructive">{{ createForm.errors.slug }}</p></div>
                            </div>
                            <div class="space-y-2"><Label for="new-summary">Summary</Label><Input id="new-summary" v-model="createForm.summary" required maxlength="500" /><p v-if="createForm.errors.summary" class="text-sm text-destructive">{{ createForm.errors.summary }}</p></div>
                            <div class="space-y-2"><Label for="new-description">Description</Label><Textarea id="new-description" v-model="createForm.description" required rows="3" maxlength="5000" /></div>
                            <div class="grid gap-4 sm:grid-cols-2">
                                <div class="space-y-2"><Label for="new-category">Category</Label><Input id="new-category" v-model="createForm.category" required maxlength="100" /></div>
                                <div class="space-y-2"><Label>Status</Label><Select :model-value="createForm.availability_status" @update:model-value="setStatus(createForm, $event)"><SelectTrigger class="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem v-for="status in ['available', 'beta', 'planned', 'disabled']" :key="status" :value="status" class="capitalize">{{ status }}</SelectItem></SelectContent></Select></div>
                            </div>
                            <div class="grid gap-4 sm:grid-cols-2">
                                <div class="space-y-2"><Label>Icon</Label><Select :model-value="createForm.icon_key" @update:model-value="setIcon(createForm, $event)"><SelectTrigger class="w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem v-for="icon in props.iconKeys" :key="icon" :value="icon">{{ icon }}</SelectItem></SelectContent></Select></div>
                                <div class="space-y-2"><Label for="new-order">Order</Label><Input id="new-order" v-model.number="createForm.sort_order" type="number" min="0" max="65535" required /></div>
                            </div>
                            <div class="flex flex-wrap gap-5"><label class="flex items-center gap-2 text-sm"><Checkbox v-model:checked="createForm.is_featured" /> Featured on Home</label><label class="flex items-center gap-2 text-sm"><Checkbox v-model:checked="createForm.is_public" /> Visible publicly</label></div>
                            <Button type="submit" :disabled="createForm.processing"><Plus class="mr-2 size-4" />Add feature</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>

        <AlertDialog :open="pendingDelete !== null" @update:open="(open) => !open && (pendingDelete = null)">
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete this marketing feature?</AlertDialogTitle>
                    <AlertDialogDescription>This removes “{{ pendingDelete?.title }}” from the catalog and public site.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel @click="pendingDelete = null">Cancel</AlertDialogCancel>
                    <AlertDialogAction @click="deleteFeature">Delete feature</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </main>
</template>
