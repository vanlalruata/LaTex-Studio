<script setup lang="ts">
import { Head, Link, router, useForm } from '@inertiajs/vue3';
import { Archive, Search } from '@lucide/vue';
import { ref } from 'vue';
import { index, archive, bulkArchive } from '@/routes/admin/projects';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ProjectRow { id: number; public_id: string; title: string; owner: { name: string; email: string }; files_count: number; memberships_count: number; storage_bytes: number; archived_at: string | null; }
interface PaginationLink { url: string | null; label: string; active: boolean; }
const props = defineProps<{ projects: { data: ProjectRow[]; links: PaginationLink[]; total: number; last_page: number }; filters: { search: string; archived: string }; }>();
const search = useForm({ search: props.filters.search, archived: props.filters.archived });
const selected = ref<string[]>([]);
function runSearch(): void { search.get(index.url(), { preserveState: true, replace: true }); }
function toggle(id: string, checked: boolean | 'indeterminate'): void { selected.value = checked === true ? [...new Set([...selected.value, id])] : selected.value.filter((item) => item !== id); }
function archiveSelected(): void { router.post(bulkArchive.url(), { project_ids: selected.value }, { preserveScroll: true, onSuccess: () => { selected.value = []; } }); }
function toggleArchive(project: ProjectRow): void { router.patch(archive.url(project.public_id), { archived: !project.archived_at }, { preserveScroll: true }); }
</script>

<template>
    <Head title="Project administration" />
    <main class="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
        <header><p class="text-sm font-medium text-primary">Administration</p><h1 class="text-2xl font-semibold tracking-tight sm:text-3xl">Projects</h1><p class="text-sm text-muted-foreground">Search projects, review ownership and storage, and archive projects in bulk.</p></header>
        <Card><CardHeader><CardTitle>Project directory</CardTitle><CardDescription>{{ props.projects.total }} projects</CardDescription></CardHeader><CardContent class="space-y-4">
            <form class="flex flex-wrap gap-2" @submit.prevent="runSearch"><Input v-model="search.search" class="max-w-sm" placeholder="Search project or owner" /><select v-model="search.archived" aria-label="Project archive status" class="h-10 rounded-md border bg-background px-3 text-sm"><option value="all">All projects</option><option value="active">Active</option><option value="archived">Archived</option></select><Button variant="outline"><Search class="mr-2 size-4" />Search</Button><Button variant="destructive" :disabled="selected.length === 0" @click.prevent="archiveSelected"><Archive class="mr-2 size-4" />Archive selected ({{ selected.length }})</Button></form>
            <div class="overflow-x-auto rounded-lg border"><Table><TableHeader><TableRow><TableHead class="w-10"></TableHead><TableHead>Project</TableHead><TableHead>Owner</TableHead><TableHead>Files</TableHead><TableHead>Storage</TableHead><TableHead>Status</TableHead><TableHead>Action</TableHead></TableRow></TableHeader><TableBody>
                <TableRow v-for="project in props.projects.data" :key="project.id"><TableCell><Checkbox :checked="selected.includes(project.public_id)" @update:checked="(value: boolean | 'indeterminate') => toggle(project.public_id, value)" /></TableCell><TableCell class="font-medium">{{ project.title }}</TableCell><TableCell>{{ project.owner.name }}<div class="text-xs text-muted-foreground">{{ project.owner.email }}</div></TableCell><TableCell>{{ project.files_count }}</TableCell><TableCell>{{ (project.storage_bytes / 1024 / 1024).toFixed(1) }} MB</TableCell><TableCell>{{ project.archived_at ? 'Archived' : 'Active' }}</TableCell><TableCell><Button size="sm" variant="outline" @click="toggleArchive(project)">{{ project.archived_at ? 'Restore' : 'Archive' }}</Button></TableCell></TableRow>
                <TableRow v-if="props.projects.data.length === 0"><TableCell colspan="7" class="py-10 text-center text-muted-foreground">No projects found.</TableCell></TableRow>
            </TableBody></Table></div>
            <nav v-if="props.projects.last_page > 1" aria-label="Project pages" class="flex flex-wrap gap-2"><Link v-for="link in props.projects.links" :key="link.label" :href="link.url ?? '# '" :aria-current="link.active ? 'page' : undefined" class="rounded-md border px-3 py-1.5 text-sm" :class="link.active ? 'border-primary bg-primary text-primary-foreground' : 'text-muted-foreground'" v-html="link.label" /></nav>
        </CardContent></Card>
    </main>
</template>
