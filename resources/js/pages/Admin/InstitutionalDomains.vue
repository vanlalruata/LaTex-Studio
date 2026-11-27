<script setup lang="ts">
import { Head, router, useForm } from '@inertiajs/vue3';
import { GraduationCap, Plus, ShieldCheck, Trash2, Users } from '@lucide/vue';
import { bulkGrant, destroy, store, update } from '@/actions/App/Http/Controllers/Admin/InstitutionalDomainController';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface DomainRow {
    id: number;
    domain: string;
    institution_name: string | null;
    is_active: boolean;
    max_users: number | null;
    usage_count: number;
    expires_at: string | null;
    is_expired: boolean;
    notes: string | null;
    creator_name: string | null;
    created_at: string | null;
}

const props = defineProps<{
    domains: DomainRow[];
    totalInstitutionalUsers: number;
}>();

const createForm = useForm({
    domain: '',
    institution_name: '',
    max_users: '' as string | number,
    expires_at: '',
    notes: '',
});

function submitCreate(): void {
    createForm
        .transform((data) => ({
            ...data,
            max_users: data.max_users === '' ? null : Number(data.max_users),
            expires_at: data.expires_at === '' ? null : data.expires_at,
            institution_name: data.institution_name === '' ? null : data.institution_name,
            notes: data.notes === '' ? null : data.notes,
        }))
        .post(store.url(), {
            preserveScroll: true,
            onSuccess: () => createForm.reset(),
        });
}

function toggleActive(domain: DomainRow): void {
    router.put(
        update.url(domain.id),
        {
            institution_name: domain.institution_name,
            is_active: !domain.is_active,
            max_users: domain.max_users,
            expires_at: domain.expires_at,
            notes: domain.notes,
        },
        { preserveScroll: true },
    );
}

function runBulkGrant(domain: DomainRow): void {
    router.post(bulkGrant.url(domain.id), {}, { preserveScroll: true });
}

function removeDomain(domain: DomainRow): void {
    router.delete(destroy.url(domain.id), { preserveScroll: true });
}
</script>

<template>
    <div>
        <Head title="Institutional free access" />
        <main class="mx-auto w-full max-w-6xl space-y-6 p-4 sm:p-6 lg:p-8">
            <header class="flex flex-wrap items-end justify-between gap-4">
                <div class="space-y-1">
                    <p class="text-sm font-medium text-primary">Platform administration</p>
                    <h1 class="text-2xl font-semibold tracking-tight sm:text-3xl">Institutional free access</h1>
                    <p class="text-sm text-muted-foreground">
                        Whitelist university or research email domains (e.g. <code>mzu.edu.in</code>) so matching signups automatically receive free access.
                    </p>
                </div>
                <Card class="px-4 py-3">
                    <div class="flex items-center gap-3 text-sm">
                        <Users class="size-4 text-primary" />
                        <span>
                            <strong class="tabular-nums">{{ props.totalInstitutionalUsers }}</strong> institutional-free user(s)
                        </span>
                    </div>
                </Card>
            </header>

            <Card>
                <CardHeader>
                    <CardTitle>Add institutional domain</CardTitle>
                    <CardDescription>Public email providers (e.g. gmail.com, outlook.com) are blocked automatically.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" @submit.prevent="submitCreate">
                        <div class="space-y-1.5">
                            <Label for="domain">Email domain</Label>
                            <Input id="domain" v-model="createForm.domain" placeholder="mzu.edu.in" required />
                            <p v-if="createForm.errors.domain" class="text-xs text-destructive">{{ createForm.errors.domain }}</p>
                        </div>

                        <div class="space-y-1.5">
                            <Label for="institution_name">Institution name</Label>
                            <Input id="institution_name" v-model="createForm.institution_name" placeholder="Mizoram University" />
                            <p v-if="createForm.errors.institution_name" class="text-xs text-destructive">{{ createForm.errors.institution_name }}</p>
                        </div>

                        <div class="space-y-1.5">
                            <Label for="max_users">Max users (optional)</Label>
                            <Input id="max_users" v-model="createForm.max_users" type="number" min="1" placeholder="Unlimited" />
                            <p v-if="createForm.errors.max_users" class="text-xs text-destructive">{{ createForm.errors.max_users }}</p>
                        </div>

                        <div class="space-y-1.5">
                            <Label for="expires_at">Expires on (optional)</Label>
                            <Input id="expires_at" v-model="createForm.expires_at" type="date" />
                            <p v-if="createForm.errors.expires_at" class="text-xs text-destructive">{{ createForm.errors.expires_at }}</p>
                        </div>

                        <div class="space-y-1.5 sm:col-span-2 lg:col-span-3">
                            <Label for="notes">Admin notes (optional)</Label>
                            <Input id="notes" v-model="createForm.notes" placeholder="Campus-wide academic license" />
                        </div>

                        <div class="flex items-end justify-end">
                            <Button type="submit" class="w-full" :disabled="createForm.processing">
                                <Plus class="mr-2 size-4" />
                                {{ createForm.processing ? 'Adding...' : 'Add domain' }}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Whitelisted domains</CardTitle>
                    <CardDescription>Removing a domain stops new auto-grants; existing institutional users keep their access.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div class="divide-y rounded-lg border">
                        <div
                            v-for="item in props.domains"
                            :key="item.id"
                            class="flex flex-wrap items-center justify-between gap-4 p-4 text-sm"
                        >
                            <div class="space-y-1">
                                <div class="flex flex-wrap items-center gap-2">
                                    <GraduationCap class="size-4 text-primary" />
                                    <span class="font-semibold">{{ item.domain }}</span>
                                    <span v-if="item.institution_name" class="text-muted-foreground">· {{ item.institution_name }}</span>
                                    <Badge v-if="!item.is_active" variant="outline">Inactive</Badge>
                                    <Badge v-else-if="item.is_expired" variant="destructive">Expired</Badge>
                                    <Badge v-else-if="item.max_users !== null && item.usage_count >= item.max_users" variant="secondary">Full</Badge>
                                    <Badge v-else>Active</Badge>
                                </div>
                                <p class="text-xs text-muted-foreground">
                                    {{ item.usage_count }} user(s)
                                    <span v-if="item.max_users !== null"> / {{ item.max_users }} max</span>
                                    <span v-if="item.expires_at"> · Expires {{ item.expires_at }}</span>
                                    <span v-if="item.notes"> · {{ item.notes }}</span>
                                </p>
                            </div>

                            <div class="flex flex-wrap items-center gap-2">
                                <Button size="sm" variant="outline" @click="runBulkGrant(item)">
                                    <ShieldCheck class="mr-1.5 size-3.5" />
                                    Grant existing users
                                </Button>
                                <Button size="sm" variant="outline" @click="toggleActive(item)">
                                    {{ item.is_active ? 'Deactivate' : 'Activate' }}
                                </Button>
                                <Button size="sm" variant="ghost" class="text-destructive" @click="removeDomain(item)">
                                    <Trash2 class="size-4" />
                                </Button>
                            </div>
                        </div>

                        <p v-if="props.domains.length === 0" class="p-6 text-center text-sm text-muted-foreground">
                            No institutional domains have been whitelisted yet.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </main>
    </div>
</template>
