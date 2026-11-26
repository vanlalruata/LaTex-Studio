<script setup lang="ts">
import { Head, Link, router, useForm, usePage } from '@inertiajs/vue3';
import { Search, ShieldCheck, ShieldOff } from '@lucide/vue';
import adminUsersRoutes, { index } from '@/routes/admin/users';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface UserRow {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
    owned_projects_count: number;
    member_projects_count: number;
    created_at: string | null;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

const props = defineProps<{
    users: { data: UserRow[]; links: PaginationLink[]; total: number; current_page: number; last_page: number };
    filters: { search: string };
    adminCount: number;
}>();

const page = usePage();
const form = useForm({ search: props.filters.search });

function searchUsers(): void {
    form.get(index.url(), { preserveState: true, replace: true });
}

function toggleAdminRole(user: UserRow): void {
    router.patch(adminUsersRoutes.adminRole.update.url(user.id), { is_admin: !user.is_admin }, { preserveScroll: true });
}
</script>

<template>
    <Head title="User administration" />
    <main class="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
        <header class="flex flex-wrap items-end justify-between gap-4">
            <div class="space-y-1"><p class="text-sm font-medium text-primary">Administration</p><h1 class="text-2xl font-semibold tracking-tight sm:text-3xl">Users</h1><p class="text-sm text-muted-foreground">Search accounts, review project participation, and manage administrator access.</p></div>
            <div class="rounded-lg border bg-card px-4 py-2 text-sm"><span class="text-muted-foreground">Administrators</span><span class="ml-2 font-semibold tabular-nums">{{ props.adminCount }}</span></div>
        </header>

        <Alert v-if="props.adminCount <= 1" variant="destructive"><ShieldCheck class="size-4" /><AlertDescription>Only one administrator remains. Promote another administrator before changing this account’s access.</AlertDescription></Alert>

        <Card>
            <CardHeader><CardTitle>Account directory</CardTitle><CardDescription>{{ props.users.total }} accounts · administrator access is protected against self-removal and removing the final administrator.</CardDescription></CardHeader>
            <CardContent class="space-y-4">
                <form class="flex max-w-lg gap-2" @submit.prevent="searchUsers">
                    <Input v-model="form.search" aria-label="Search users" placeholder="Search name or email" />
                    <Button type="submit" variant="outline"><Search class="mr-2 size-4" />Search</Button>
                </form>
                <div class="overflow-x-auto rounded-lg border">
                    <Table>
                        <TableHeader><TableRow><TableHead>User</TableHead><TableHead>Projects</TableHead><TableHead>Joined</TableHead><TableHead>Access</TableHead></TableRow></TableHeader>
                        <TableBody>
                            <TableRow v-for="user in props.users.data" :key="user.id">
                                <TableCell><div class="font-medium">{{ user.name }}</div><div class="text-xs text-muted-foreground">{{ user.email }}</div></TableCell>
                                <TableCell>{{ user.owned_projects_count }} owned · {{ user.member_projects_count }} shared</TableCell>
                                <TableCell class="text-sm text-muted-foreground">{{ user.created_at ? new Date(user.created_at).toLocaleDateString() : '—' }}</TableCell>
                                <TableCell>
                                    <Button size="sm" :variant="user.is_admin ? 'outline' : 'secondary'" :disabled="user.is_admin && (props.adminCount <= 1 || user.id === page.props.auth.user.id)" :aria-label="`${user.is_admin ? 'Remove' : 'Grant'} administrator access for ${user.name}`" @click="toggleAdminRole(user)">
                                        <ShieldOff v-if="user.is_admin" class="mr-2 size-4" />
                                        <ShieldCheck v-else class="mr-2 size-4" />
                                        {{ user.is_admin ? 'Remove admin' : 'Make admin' }}
                                    </Button>
                                </TableCell>
                            </TableRow>
                            <TableRow v-if="props.users.data.length === 0"><TableCell colspan="4" class="py-10 text-center text-muted-foreground">No users match this search.</TableCell></TableRow>
                        </TableBody>
                    </Table>
                </div>
                <nav v-if="props.users.last_page > 1" aria-label="User pages" class="flex flex-wrap gap-2">
                    <Link v-for="link in props.users.links" :key="link.label" :href="link.url ?? '# '" :aria-current="link.active ? 'page' : undefined" class="rounded-md border px-3 py-1.5 text-sm" :class="link.active ? 'border-primary bg-primary text-primary-foreground' : 'text-muted-foreground'" v-html="link.label" />
                </nav>
            </CardContent>
        </Card>
    </main>
</template>
