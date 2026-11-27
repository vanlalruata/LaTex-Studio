<script setup lang="ts">
import { Head, useForm } from '@inertiajs/vue3';
import { AlertTriangle, CheckCircle2, Container, Play, Server, Terminal } from '@lucide/vue';
import { ref } from 'vue';
import { testCompile, update } from '@/actions/App/Http/Controllers/Admin/CompilerSettingsController';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CompilerSettings {
    driver: 'docker' | 'local';
    docker_image: string;
    docker_memory_mb: number;
    docker_cpus: number;
    docker_pids_limit: number;
    local_texlive_bin_path: string;
    local_latexmk_path: string;
    wall_timeout: number;
    max_output_mb: number;
}

interface HealthReport {
    docker: {
        available: boolean;
        server_version: string | null;
        image_present: boolean;
        message: string;
    };
    local: {
        available: boolean;
        latexmk_version: string | null;
        pdflatex_version: string | null;
        message: string;
    };
}

const props = defineProps<{
    settings: CompilerSettings;
    health: HealthReport;
}>();

const form = useForm<CompilerSettings>({
    driver: props.settings.driver,
    docker_image: props.settings.docker_image,
    docker_memory_mb: props.settings.docker_memory_mb,
    docker_cpus: props.settings.docker_cpus,
    docker_pids_limit: props.settings.docker_pids_limit,
    local_texlive_bin_path: props.settings.local_texlive_bin_path,
    local_latexmk_path: props.settings.local_latexmk_path,
    wall_timeout: props.settings.wall_timeout,
    max_output_mb: props.settings.max_output_mb,
});

const testingDriver = ref<'docker' | 'local' | null>(null);
const testResult = ref<{ ok: boolean; driver: string; duration_ms: number; message: string } | null>(null);

function submit(): void {
    form.put(update.url(), {
        preserveScroll: true,
    });
}

async function runHealthTest(driver: 'docker' | 'local'): Promise<void> {
    testingDriver.value = driver;
    testResult.value = null;

    try {
        const csrfToken = document.querySelector<HTMLMetaElement>('meta[name="csrf-token"]')?.content ?? '';
        const response = await fetch(testCompile.url(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-CSRF-TOKEN': csrfToken,
                'X-Requested-With': 'XMLHttpRequest',
            },
            body: JSON.stringify({ driver }),
        });

        testResult.value = await response.json();
    } catch {
        testResult.value = {
            ok: false,
            driver,
            duration_ms: 0,
            message: 'Failed to execute health check request.',
        };
    } finally {
        testingDriver.value = null;
    }
}
</script>

<template>
    <div>
        <Head title="Compiler settings" />
        <main class="mx-auto w-full max-w-5xl space-y-6 p-4 sm:p-6 lg:p-8">
            <header class="space-y-1">
                <p class="text-sm font-medium text-primary">Platform administration</p>
                <h1 class="text-2xl font-semibold tracking-tight sm:text-3xl">TeX Live compiler settings</h1>
                <p class="text-sm text-muted-foreground">
                    Choose whether manuscript builds run inside isolated Docker containers or directly on the host TeX Live installation.
                </p>
            </header>

            <section class="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div>
                            <CardTitle class="text-base">Docker Worker</CardTitle>
                            <CardDescription>Isolated container execution</CardDescription>
                        </div>
                        <Badge :variant="props.health.docker.available && props.health.docker.image_present ? 'default' : 'secondary'">
                            {{ props.health.docker.available ? (props.health.docker.image_present ? 'Ready' : 'Image missing') : 'Unavailable' }}
                        </Badge>
                    </CardHeader>
                    <CardContent class="space-y-3 text-sm">
                        <p class="text-muted-foreground">{{ props.health.docker.message }}</p>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            :disabled="testingDriver !== null"
                            @click="runHealthTest('docker')"
                        >
                            <Play class="mr-2 size-3.5" />
                            {{ testingDriver === 'docker' ? 'Testing Docker...' : 'Test Docker compile' }}
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
                        <div>
                            <CardTitle class="text-base">Local TeX Live</CardTitle>
                            <CardDescription>Direct host binary execution</CardDescription>
                        </div>
                        <Badge :variant="props.health.local.available ? 'default' : 'secondary'">
                            {{ props.health.local.available ? 'Ready' : 'Not detected' }}
                        </Badge>
                    </CardHeader>
                    <CardContent class="space-y-3 text-sm">
                        <p class="text-muted-foreground">{{ props.health.local.message }}</p>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            :disabled="testingDriver !== null"
                            @click="runHealthTest('local')"
                        >
                            <Play class="mr-2 size-3.5" />
                            {{ testingDriver === 'local' ? 'Testing Local...' : 'Test local compile' }}
                        </Button>
                    </CardContent>
                </Card>
            </section>

            <Alert v-if="testResult" :variant="testResult.ok ? 'default' : 'destructive'">
                <CheckCircle2 v-if="testResult.ok" class="size-4" />
                <AlertTriangle v-else class="size-4" />
                <AlertTitle>{{ testResult.ok ? 'Health check passed' : 'Health check failed' }} ({{ testResult.driver }})</AlertTitle>
                <AlertDescription>{{ testResult.message }}</AlertDescription>
            </Alert>

            <form class="space-y-6" @submit.prevent="submit">
                <Card>
                    <CardHeader>
                        <CardTitle>Execution driver</CardTitle>
                        <CardDescription>Select the active compilation backend used by queue workers.</CardDescription>
                    </CardHeader>
                    <CardContent class="grid gap-4 sm:grid-cols-2">
                        <button
                            type="button"
                            class="flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-colors"
                            :class="form.driver === 'docker' ? 'border-primary bg-primary/5' : 'hover:bg-muted/40'"
                            @click="form.driver = 'docker'"
                        >
                            <div class="flex w-full items-center justify-between">
                                <span class="flex items-center gap-2 font-medium">
                                    <Container class="size-4 text-primary" />
                                    Docker Container (Recommended)
                                </span>
                                <Badge v-if="form.driver === 'docker'">Active</Badge>
                            </div>
                            <p class="text-xs text-muted-foreground">
                                Runs each build in a non-root, read-only container with network disabled and strict CPU/RAM quotas.
                            </p>
                        </button>

                        <button
                            type="button"
                            class="flex flex-col items-start gap-2 rounded-xl border p-4 text-left transition-colors"
                            :class="form.driver === 'local' ? 'border-primary bg-primary/5' : 'hover:bg-muted/40'"
                            @click="form.driver = 'local'"
                        >
                            <div class="flex w-full items-center justify-between">
                                <span class="flex items-center gap-2 font-medium">
                                    <Server class="size-4 text-primary" />
                                    Local TeX Live (No Docker)
                                </span>
                                <Badge v-if="form.driver === 'local'">Active</Badge>
                            </div>
                            <p class="text-xs text-muted-foreground">
                                Invokes host-installed latexmk/pdflatex directly. Best for local development or single-tenant hosts.
                            </p>
                        </button>
                    </CardContent>
                </Card>

                <Alert v-if="form.driver === 'local'">
                    <Terminal class="size-4" />
                    <AlertTitle>No container isolation in Local mode</AlertTitle>
                    <AlertDescription>
                        Local mode disables shell-escape (`-no-shell-escape`) but does not provide container-level filesystem or memory isolation.
                    </AlertDescription>
                </Alert>

                <Card>
                    <CardHeader>
                        <CardTitle>Docker worker configuration</CardTitle>
                        <CardDescription>Container image and resource limits enforced when Docker mode is active.</CardDescription>
                    </CardHeader>
                    <CardContent class="grid gap-4 sm:grid-cols-2">
                        <div class="space-y-2 sm:col-span-2">
                            <Label for="docker_image">Worker image</Label>
                            <Input id="docker_image" v-model="form.docker_image" placeholder="latexstudio/texlive-worker:latest" />
                            <p v-if="form.errors.docker_image" class="text-xs text-destructive">{{ form.errors.docker_image }}</p>
                        </div>

                        <div class="space-y-2">
                            <Label for="docker_memory_mb">Memory limit (MB)</Label>
                            <Input id="docker_memory_mb" v-model.number="form.docker_memory_mb" type="number" min="256" max="16384" />
                            <p v-if="form.errors.docker_memory_mb" class="text-xs text-destructive">{{ form.errors.docker_memory_mb }}</p>
                        </div>

                        <div class="space-y-2">
                            <Label for="docker_cpus">CPU limit (cores)</Label>
                            <Input id="docker_cpus" v-model.number="form.docker_cpus" type="number" step="0.25" min="0.25" max="16" />
                            <p v-if="form.errors.docker_cpus" class="text-xs text-destructive">{{ form.errors.docker_cpus }}</p>
                        </div>

                        <div class="space-y-2">
                            <Label for="docker_pids_limit">PIDs limit</Label>
                            <Input id="docker_pids_limit" v-model.number="form.docker_pids_limit" type="number" min="16" max="1024" />
                            <p v-if="form.errors.docker_pids_limit" class="text-xs text-destructive">{{ form.errors.docker_pids_limit }}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Local TeX Live &amp; shared limits</CardTitle>
                        <CardDescription>Binary paths for host TeX Live execution and global timeouts.</CardDescription>
                    </CardHeader>
                    <CardContent class="grid gap-4 sm:grid-cols-2">
                        <div class="space-y-2">
                            <Label for="local_latexmk_path">latexmk executable</Label>
                            <Input id="local_latexmk_path" v-model="form.local_latexmk_path" placeholder="latexmk" />
                            <p v-if="form.errors.local_latexmk_path" class="text-xs text-destructive">{{ form.errors.local_latexmk_path }}</p>
                        </div>

                        <div class="space-y-2">
                            <Label for="local_texlive_bin_path">TeX Live bin directory (optional)</Label>
                            <Input id="local_texlive_bin_path" v-model="form.local_texlive_bin_path" placeholder="/usr/local/texlive/2024/bin/x86_64-linux" />
                            <p v-if="form.errors.local_texlive_bin_path" class="text-xs text-destructive">{{ form.errors.local_texlive_bin_path }}</p>
                        </div>

                        <div class="space-y-2">
                            <Label for="wall_timeout">Wall-clock timeout (seconds)</Label>
                            <Input id="wall_timeout" v-model.number="form.wall_timeout" type="number" min="10" max="600" />
                            <p v-if="form.errors.wall_timeout" class="text-xs text-destructive">{{ form.errors.wall_timeout }}</p>
                        </div>

                        <div class="space-y-2">
                            <Label for="max_output_mb">Max PDF output size (MB)</Label>
                            <Input id="max_output_mb" v-model.number="form.max_output_mb" type="number" min="5" max="1024" />
                            <p v-if="form.errors.max_output_mb" class="text-xs text-destructive">{{ form.errors.max_output_mb }}</p>
                        </div>
                    </CardContent>
                </Card>

                <div class="flex items-center justify-end gap-3">
                    <p v-if="form.recentlySuccessful" class="text-sm text-emerald-600">Settings saved.</p>
                    <Button type="submit" :disabled="form.processing">
                        {{ form.processing ? 'Saving...' : 'Save compiler settings' }}
                    </Button>
                </div>
            </form>
        </main>
    </div>
</template>
