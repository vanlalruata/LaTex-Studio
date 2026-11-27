<script setup lang="ts">
import { Head, Link, router } from '@inertiajs/vue3';
import { AlertTriangle, Ban, CheckCircle2, Clock, Cpu, RefreshCw, XCircle } from '@lucide/vue';
import { cancel, index as buildQueueIndex } from '@/routes/admin/build-queue';
import { index as compilerIndex } from '@/routes/admin/compiler';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface BuildSummary {
    queued: number;
    running: number;
    succeeded_24h: number;
    failed_24h: number;
    pending_jobs: number;
    failed_jobs: number;
}

interface CompilationRow {
    public_id: string;
    project_title: string;
    project_public_id: string | null;
    triggered_by: string | null;
    engine: string;
    status: string;
    is_terminal: boolean;
    duration_ms: number | null;
    worker_image_digest: string | null;
    error_summary: string | null;
    started_at: string | null;
    created_at: string | null;
}

interface StuckCompilation {
    public_id: string;
    project_title: string;
    engine: string;
    status: string;
    started_at: string | null;
    created_at: string | null;
}

const props = defineProps<{
    driver: string;
    summary: BuildSummary;
    stuckCompilations: StuckCompilation[];
    recentCompilations: CompilationRow[];
}>();

function refresh(): void {
    router.reload({ only: ['summary', 'stuckCompilations', 'recentCompilations'] });
}

function forceCancel(publicId: string): void {
    router.post(cancel.url(publicId), {}, { preserveScroll: true });
}

function statusVariant(status: string): 'default' | 'secondary' | 'destructive' | 'outline' {
    if (status === 'published' || status === 'succeeded') return 'default';
    if (status === 'failed' || status === 'timed_out') return 'destructive';
    if (status === 'cancelled') return 'outline';
    return 'secondary';
}
</script>

<template>
    <div>
        <Head title="Build queue monitor" />
        <main class="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
            <header class="flex flex-wrap items-end justify-between gap-4">
                <div class="space-y-1">
                    <p class="text-sm font-medium text-primary">Platform administration</p>
                    <h1 class="text-2xl font-semibold tracking-tight sm:text-3xl">Build queue &amp; workers</h1>
                    <p class="text-sm text-muted-foreground">
                        Monitor active compilations, queue depth, and stuck builds. Active driver:
                        <Badge variant="outline" class="ml-1 uppercase">{{ props.driver }}</Badge>
                    </p>
                </div>
                <div class="flex items-center gap-2">
                    <Button variant="outline" as-child>
                        <Link :href="compilerIndex()">Compiler settings</Link>
                    </Button>
                    <Button variant="outline" @click="refresh">
                        <RefreshCw class="mr-2 size-4" />
                        Refresh
                    </Button>
                </div>
            </header>

            <section class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                <Card>
                    <CardContent class="p-4">
                        <div class="flex items-center justify-between text-sm text-muted-foreground">
                            <span>Queued</span>
                            <Clock class="size-4 text-primary" />
                        </div>
                        <p class="mt-2 text-2xl font-semibold tabular-nums">{{ props.summary.queued }}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent class="p-4">
                        <div class="flex items-center justify-between text-sm text-muted-foreground">
                            <span>Running</span>
                            <Cpu class="size-4 text-primary" />
                        </div>
                        <p class="mt-2 text-2xl font-semibold tabular-nums">{{ props.summary.running }}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent class="p-4">
                        <div class="flex items-center justify-between text-sm text-muted-foreground">
                            <span>Succeeded (24h)</span>
                            <CheckCircle2 class="size-4 text-emerald-600" />
                        </div>
                        <p class="mt-2 text-2xl font-semibold tabular-nums">{{ props.summary.succeeded_24h }}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent class="p-4">
                        <div class="flex items-center justify-between text-sm text-muted-foreground">
                            <span>Failed (24h)</span>
                            <XCircle class="size-4 text-destructive" />
                        </div>
                        <p class="mt-2 text-2xl font-semibold tabular-nums">{{ props.summary.failed_24h }}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent class="p-4">
                        <div class="flex items-center justify-between text-sm text-muted-foreground">
                            <span>Queue jobs</span>
                            <Clock class="size-4" />
                        </div>
                        <p class="mt-2 text-2xl font-semibold tabular-nums">{{ props.summary.pending_jobs }}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent class="p-4">
                        <div class="flex items-center justify-between text-sm text-muted-foreground">
                            <span>Failed jobs</span>
                            <AlertTriangle class="size-4 text-amber-500" />
                        </div>
                        <p class="mt-2 text-2xl font-semibold tabular-nums">{{ props.summary.failed_jobs }}</p>
                    </CardContent>
                </Card>
            </section>

            <Alert v-if="props.stuckCompilations.length > 0" variant="destructive">
                <AlertTriangle class="size-4" />
                <AlertTitle>{{ props.stuckCompilations.length }} stuck compilation(s) detected</AlertTitle>
                <AlertDescription>
                    These builds have exceeded the configured wall-clock timeout plus grace period and may require force cancellation.
                </AlertDescription>
            </Alert>

            <Card v-if="props.stuckCompilations.length > 0">
                <CardHeader>
                    <CardTitle>Stuck builds</CardTitle>
                    <CardDescription>Force-cancel builds that are no longer progressing.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div class="divide-y rounded-lg border">
                        <div
                            v-for="item in props.stuckCompilations"
                            :key="item.public_id"
                            class="flex flex-wrap items-center justify-between gap-3 p-3 text-sm"
                        >
                            <div>
                                <p class="font-medium">{{ item.project_title }}</p>
                                <p class="text-xs text-muted-foreground">
                                    {{ item.engine }} · {{ item.status }} · started {{ item.started_at ? new Date(item.started_at).toLocaleString() : 'pending' }}
                                </p>
                            </div>
                            <Button size="sm" variant="destructive" @click="forceCancel(item.public_id)">
                                <Ban class="mr-1.5 size-3.5" />
                                Force cancel
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Recent compilations</CardTitle>
                    <CardDescription>Latest 30 compilation requests across all projects.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div class="divide-y rounded-lg border">
                        <div
                            v-for="build in props.recentCompilations"
                            :key="build.public_id"
                            class="flex flex-wrap items-center justify-between gap-3 p-3 text-sm"
                        >
                            <div class="space-y-0.5">
                                <div class="flex items-center gap-2">
                                    <span class="font-medium">{{ build.project_title }}</span>
                                    <Badge :variant="statusVariant(build.status)">{{ build.status }}</Badge>
                                    <Badge variant="outline">{{ build.engine }}</Badge>
                                </div>
                                <p class="text-xs text-muted-foreground">
                                    Triggered by {{ build.triggered_by ?? 'System' }}
                                    <span v-if="build.worker_image_digest"> · {{ build.worker_image_digest }}</span>
                                    <span v-if="build.duration_ms !== null"> · {{ build.duration_ms }} ms</span>
                                </p>
                                <p v-if="build.error_summary" class="text-xs text-destructive">{{ build.error_summary }}</p>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="text-xs text-muted-foreground">
                                    {{ build.created_at ? new Date(build.created_at).toLocaleString() : '' }}
                                </span>
                                <Button
                                    v-if="!build.is_terminal"
                                    size="sm"
                                    variant="outline"
                                    @click="forceCancel(build.public_id)"
                                >
                                    Cancel
                                </Button>
                            </div>
                        </div>
                        <p v-if="props.recentCompilations.length === 0" class="p-6 text-center text-sm text-muted-foreground">
                            No compilations have been recorded yet.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </main>
    </div>
</template>
