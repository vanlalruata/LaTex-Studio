<script setup lang="ts">
import { Head, Link, useForm } from '@inertiajs/vue3';
import { Search } from '@lucide/vue';
import { index } from '@/routes/admin/audit';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface EventRow { id: number; action: string; user: { name: string; email: string } | null; project: { title: string } | null; subject_type: string | null; subject_id: number | null; metadata: Record<string, unknown> | null; ip_address: string | null; created_at: string; }
interface PageLink { url: string | null; label: string; active: boolean; }
const props = defineProps<{ events: { data: EventRow[]; links: PageLink[]; total: number; last_page: number }; filters: { search: string }; }>();
const form = useForm({ search: props.filters.search });
function searchEvents(): void { form.get(index.url(), { preserveState: true, replace: true }); }
</script>
<template>
    <Head title="Audit log" />
    <main class="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8"><header><p class="text-sm font-medium text-primary">Administration</p><h1 class="text-2xl font-semibold tracking-tight sm:text-3xl">Audit log</h1><p class="text-sm text-muted-foreground">Review administrator and platform activity.</p></header>
        <Card><CardHeader><CardTitle>Recorded events</CardTitle><CardDescription>{{ props.events.total }} events</CardDescription></CardHeader><CardContent class="space-y-4"><form class="flex max-w-lg gap-2" @submit.prevent="searchEvents"><Input v-model="form.search" placeholder="Search action or account" /><Button variant="outline"><Search class="mr-2 size-4" />Search</Button></form>
            <div class="divide-y rounded-lg border"><article v-for="event in props.events.data" :key="event.id" class="grid gap-2 p-4 md:grid-cols-[1fr_auto]"><div><h2 class="font-medium">{{ event.action.replaceAll('.', ' ') }}</h2><p class="mt-1 text-sm text-muted-foreground">{{ event.user?.name ?? 'System' }}<span v-if="event.user"> ({{ event.user.email }})</span><span v-if="event.project"> · {{ event.project.title }}</span><span v-if="event.subject_type"> · {{ event.subject_type.split('\\').pop() }} #{{ event.subject_id }}</span></p><pre v-if="event.metadata && Object.keys(event.metadata).length" class="mt-2 overflow-x-auto rounded bg-muted p-2 text-xs">{{ JSON.stringify(event.metadata, null, 2) }}</pre></div><time class="text-xs text-muted-foreground">{{ new Date(event.created_at).toLocaleString() }}<span v-if="event.ip_address" class="block">{{ event.ip_address }}</span></time></article><p v-if="props.events.data.length === 0" class="p-8 text-center text-sm text-muted-foreground">No audit events match this search.</p></div>
            <nav v-if="props.events.last_page > 1" aria-label="Audit pages" class="flex flex-wrap gap-2"><Link v-for="link in props.events.links" :key="link.label" :href="link.url ?? '# '" :aria-current="link.active ? 'page' : undefined" class="rounded-md border px-3 py-1.5 text-sm" :class="link.active ? 'border-primary bg-primary text-primary-foreground' : 'text-muted-foreground'" v-html="link.label" /></nav>
        </CardContent></Card>
    </main>
</template>
