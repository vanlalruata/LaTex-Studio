<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3';
import { reactive, ref } from 'vue';
import adminOrganizationsRoutes from '@/routes/admin/organizations';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface OrganizationRow { id: number; name: string; slug: string; members_count: number; projects_count: number; storage_bytes: number; storage_quota_bytes: number; }
const props = defineProps<{ organizations: { data: OrganizationRow[]; total: number }; }>();
const quotaDrafts = reactive<Record<number, number>>(Object.fromEntries(props.organizations.data.map((organization) => [organization.id, Number((organization.storage_quota_bytes / 1024 ** 3).toFixed(2))])));
const savingOrganizationId = ref<number | null>(null);
function saveQuota(organization: OrganizationRow): void {
    savingOrganizationId.value = organization.id;
    router.patch(adminOrganizationsRoutes.quota.update.url(organization.id), { storage_quota_bytes: Math.round((quotaDrafts[organization.id] ?? 0) * 1024 ** 3) }, { preserveScroll: true, onFinish: () => { savingOrganizationId.value = null; } });
}
</script>
<template>
    <Head title="Organization administration" />
    <main class="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8"><header><p class="text-sm font-medium text-primary">Administration</p><h1 class="text-2xl font-semibold tracking-tight sm:text-3xl">Organizations</h1><p class="text-sm text-muted-foreground">Review memberships, projects, and storage quotas.</p></header>
        <Card><CardHeader><CardTitle>Organization directory</CardTitle><CardDescription>{{ props.organizations.total }} organizations · quota updates are recorded in the audit log.</CardDescription></CardHeader><CardContent><div class="overflow-x-auto rounded-lg border"><Table><TableHeader><TableRow><TableHead>Organization</TableHead><TableHead>Members</TableHead><TableHead>Projects</TableHead><TableHead>Storage used</TableHead><TableHead>Quota (GB)</TableHead><TableHead></TableHead></TableRow></TableHeader><TableBody>
            <TableRow v-for="organization in props.organizations.data" :key="organization.id"><TableCell class="font-medium">{{ organization.name }}<div class="text-xs text-muted-foreground">{{ organization.slug }}</div></TableCell><TableCell>{{ organization.members_count }}</TableCell><TableCell>{{ organization.projects_count }}</TableCell><TableCell>{{ (organization.storage_bytes / 1024 ** 3).toFixed(2) }} GB</TableCell><TableCell><Input v-model.number="quotaDrafts[organization.id]" class="w-36" type="number" min="0" step="0.1" aria-label="Quota in gigabytes" /></TableCell><TableCell><Button size="sm" :disabled="savingOrganizationId === organization.id" @click="saveQuota(organization)">Save quota</Button></TableCell></TableRow>
            <TableRow v-if="props.organizations.data.length === 0"><TableCell colspan="6" class="py-10 text-center text-muted-foreground">No organizations found.</TableCell></TableRow>
        </TableBody></Table></div></CardContent></Card>
    </main>
</template>
