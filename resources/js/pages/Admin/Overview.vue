<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { Activity, Building, Files, FolderOpen, Users } from '@lucide/vue';
import { dashboard } from '@/routes/admin';
import { index as usersIndex } from '@/routes/admin/users';
import { index as projectsIndex } from '@/routes/admin/projects';
import { index as organizationsIndex } from '@/routes/admin/organizations';
import { index as usageIndex } from '@/routes/admin/usage';
import { index as publicSiteIndex } from '@/routes/admin/public-site';
import { index as templatesIndex } from '@/routes/admin/public-site/templates';
import { index as featuresIndex } from '@/routes/admin/public-site/features';
import { index as auditIndex } from '@/routes/admin/audit';
import { index as enquiriesIndex } from '@/routes/admin/public-site/enquiries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface AuditEvent {
    id: number;
    action: string;
    created_at: string;
    user: { id: number; name: string } | null;
    project: { id: number; title: string } | null;
}

const props = defineProps<{
    metrics: {
        users: number;
        organizations: number;
        projects: number;
        templates: number;
        storageBytes: number;
        activeBuilds: number;
    };
    recentEvents: AuditEvent[];
}>();

const formatBytes = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    const units = ['KB', 'MB', 'GB', 'TB'];
    let value = bytes / 1024;
    let unit = 0;
    while (value >= 1024 && unit < units.length - 1) {
        value /= 1024;
        unit++;
    }
    return `${value.toFixed(1)} ${units[unit]}`;
};

const metrics = [
    { label: 'Users', value: props.metrics.users, icon: Users, href: usersIndex() },
    { label: 'Organizations', value: props.metrics.organizations, icon: Building, href: organizationsIndex() },
    { label: 'Projects', value: props.metrics.projects, icon: FolderOpen, href: projectsIndex() },
    { label: 'Templates', value: props.metrics.templates, icon: Files, href: templatesIndex() },
    { label: 'Active builds', value: props.metrics.activeBuilds, icon: Activity, href: usageIndex() },
    { label: 'Project storage', value: formatBytes(props.metrics.storageBytes), icon: FolderOpen, href: usageIndex() },
];

const modules = [
    { title: 'Public site', description: 'Branding, registration, pricing, and public visibility.', href: publicSiteIndex() },
    { title: 'Marketing features', description: 'Set release status and public feature descriptions.', href: featuresIndex() },
    { title: 'Templates', description: 'Govern public and private starter projects.', href: templatesIndex() },
    { title: 'Contact enquiries', description: 'Review and triage incoming messages.', href: enquiriesIndex() },
    { title: 'Audit log', description: 'Search administrator and platform events.', href: auditIndex() },
    { title: 'Usage & builds', description: 'Review recorded usage and build outcomes.', href: usageIndex() },
];
</script>

<template>
    <Head title="Administration overview" />
    <main class="mx-auto w-full max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
        <header class="flex flex-wrap items-end justify-between gap-4">
            <div class="space-y-1">
                <p class="text-sm font-medium text-primary">Platform administration</p>
                <h1 class="text-2xl font-semibold tracking-tight sm:text-3xl">Overview</h1>
                <p class="text-sm text-muted-foreground">Manage access, research projects, templates, public content, and operational usage.</p>
            </div>
            <Button as-child variant="outline"><Link :href="auditIndex()">Open audit log</Link></Button>
        </header>

        <section aria-label="Platform metrics" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <Link v-for="metric in metrics" :key="metric.label" :href="metric.href" class="group">
                <Card class="h-full transition-colors group-hover:border-primary/40">
                    <CardContent class="flex items-center justify-between p-5">
                        <div class="space-y-1"><p class="text-sm text-muted-foreground">{{ metric.label }}</p><p class="text-2xl font-semibold tabular-nums">{{ metric.value }}</p></div>
                        <component :is="metric.icon" class="size-5 text-primary" aria-hidden="true" />
                    </CardContent>
                </Card>
            </Link>
        </section>

        <section class="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <Card>
                <CardHeader><CardTitle>Administration modules</CardTitle><CardDescription>Open a management area to review or update its records.</CardDescription></CardHeader>
                <CardContent class="grid gap-3 sm:grid-cols-2">
                    <Link v-for="module in modules" :key="module.title" :href="module.href" class="rounded-xl border p-4 transition-colors hover:border-primary/40 hover:bg-muted/40">
                        <h2 class="font-medium">{{ module.title }}</h2>
                        <p class="mt-1 text-sm text-muted-foreground">{{ module.description }}</p>
                    </Link>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Recent audit events</CardTitle><CardDescription>Latest recorded administrative activity.</CardDescription></CardHeader>
                <CardContent>
                    <div v-if="props.recentEvents.length === 0" class="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">No audit events recorded yet.</div>
                    <ul v-else class="divide-y">
                        <li v-for="event in props.recentEvents" :key="event.id" class="py-3 first:pt-0 last:pb-0">
                            <p class="text-sm font-medium">{{ event.action.replaceAll('.', ' ') }}</p>
                            <p class="mt-1 text-xs text-muted-foreground">{{ event.user?.name ?? 'System' }} · {{ new Date(event.created_at).toLocaleString() }}<span v-if="event.project"> · {{ event.project.title }}</span></p>
                        </li>
                    </ul>
                </CardContent>
            </Card>
        </section>
    </main>
</template>
