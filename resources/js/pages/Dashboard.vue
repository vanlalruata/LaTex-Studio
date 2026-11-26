<script setup lang="ts">
import { Head, Link, useForm, usePage } from '@inertiajs/vue3';
import {
    BookOpen,
    Cpu,
    FileCode2,
    FolderPlus,
    HardDrive,
    Layers,
    Plus,
    Search,
    Sparkles,
    Terminal,
} from '@lucide/vue';
import { computed, ref } from 'vue';
import { dashboard } from '@/routes';
import projectsRoutes from '@/routes/projects';

interface ProjectSummary {
    public_id: string;
    title: string;
    description: string | null;
    owner_name: string;
    compiler_engine: string;
    root_file_path: string;
    files_count: number;
    storage_bytes: number;
    role: string;
    updated_at: string | null;
}

interface TemplateSummary {
    public_id: string;
    slug: string;
    title: string;
    category: string;
    description: string | null;
    compiler_engine: string;
}

const props = defineProps<{
    projects: ProjectSummary[];
    templates: TemplateSummary[];
    stats: {
        active_projects: number;
        total_storage_bytes: number;
        templates_count: number;
        recent_builds: number;
    };
}>();

defineOptions({
    layout: {
        breadcrumbs: [
            {
                title: 'Dashboard',
                href: dashboard(),
            },
        ],
    },
});

const page = usePage();
const userName = computed(
    () => (page.props.auth as { user?: { name?: string } })?.user?.name ?? 'Researcher',
);

const searchQuery = ref('');
const showCreateModal = ref(false);

const createForm = useForm({
    title: '',
    description: '',
    template_id: '',
    compiler_engine: 'pdflatex',
});

const filteredProjects = computed(() => {
    const q = searchQuery.value.trim().toLowerCase();
    if (!q) {
        return props.projects;
    }
    return props.projects.filter(
        (p) =>
            p.title.toLowerCase().includes(q) ||
            (p.description ?? '').toLowerCase().includes(q) ||
            p.compiler_engine.toLowerCase().includes(q),
    );
});

function formatBytes(bytes: number): string {
    if (bytes < 1024) {
        return `${bytes} B`;
    }
    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function openCreateWithTemplate(template?: TemplateSummary): void {
    createForm.reset();
    if (template) {
        createForm.template_id = template.public_id;
        createForm.compiler_engine = template.compiler_engine;
        createForm.title = `${template.title} Copy`;
    }
    showCreateModal.value = true;
}

function submitCreateProject(): void {
    createForm.post(projectsRoutes.store().url, {
        onSuccess: () => {
            showCreateModal.value = false;
            createForm.reset();
        },
    });
}
</script>

<template>
    <div class="flex flex-1 flex-col gap-6 bg-slate-50/60 p-6">
        <Head title="Research Dashboard" />

        <!-- Welcome Banner -->
        <div
            class="flex flex-col justify-between gap-4 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50 via-blue-50 to-white p-6 shadow-xs md:flex-row md:items-center"
        >
            <div>
                <p class="text-xs font-semibold tracking-wider text-indigo-600 uppercase">
                    Independent Research Writing Platform
                </p>
                <h1 class="mt-1 text-2xl font-bold tracking-tight text-slate-900">
                    Welcome back, {{ userName }}
                </h1>
                <p class="mt-1 text-sm text-slate-600">
                    Streamline your manuscripts from structured LaTeX authoring to isolated reproducible PDF builds.
                </p>
            </div>
            <div class="flex items-center gap-3">
                <button
                    type="button"
                    class="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-xs transition hover:bg-indigo-700"
                    @click="openCreateWithTemplate()"
                >
                    <Plus class="size-4" />
                    New Project
                </button>
            </div>
        </div>

        <!-- KPI Summary Cards -->
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-slate-500">Active Projects</span>
                    <div class="rounded-lg bg-blue-50 p-2 text-blue-600">
                        <FileCode2 class="size-4" />
                    </div>
                </div>
                <p class="mt-3 text-3xl font-bold text-slate-900 tabular-nums">
                    {{ stats.active_projects }}
                </p>
                <p class="mt-1 text-xs text-slate-500">Owned & collaborated manuscripts</p>
            </div>

            <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-slate-500">Recent Builds (30d)</span>
                    <div class="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                        <Cpu class="size-4" />
                    </div>
                </div>
                <p class="mt-3 text-3xl font-bold text-slate-900 tabular-nums">
                    {{ stats.recent_builds }}
                </p>
                <p class="mt-1 text-xs text-slate-500">Isolated TeX worker jobs</p>
            </div>

            <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-slate-500">Starter Templates</span>
                    <div class="rounded-lg bg-amber-50 p-2 text-amber-600">
                        <BookOpen class="size-4" />
                    </div>
                </div>
                <p class="mt-3 text-3xl font-bold text-slate-900 tabular-nums">
                    {{ stats.templates_count }}
                </p>
                <p class="mt-1 text-xs text-slate-500">Ready-to-compile structures</p>
            </div>

            <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-slate-500">Private Storage</span>
                    <div class="rounded-lg bg-violet-50 p-2 text-violet-600">
                        <HardDrive class="size-4" />
                    </div>
                </div>
                <p class="mt-3 text-3xl font-bold text-slate-900 tabular-nums">
                    {{ formatBytes(stats.total_storage_bytes) }}
                </p>
                <p class="mt-1 text-xs text-slate-500">Encrypted & revision-tracked</p>
            </div>
        </div>

        <!-- Main Grid: Active Projects + Quick Templates -->
        <div class="grid gap-6 lg:grid-cols-3">
            <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-xs lg:col-span-2">
                <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 class="text-base font-semibold text-slate-900">Active Projects</h2>
                        <p class="text-xs text-slate-500">
                            Select a project to open the Monaco + PDF.js workspace
                        </p>
                    </div>
                    <div class="relative">
                        <Search class="pointer-events-none absolute top-2.5 left-3 size-4 text-slate-400" />
                        <input
                            v-model="searchQuery"
                            type="search"
                            placeholder="Filter projects..."
                            class="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pr-3 pl-9 text-sm text-slate-800 outline-none focus:border-indigo-500 focus:bg-white sm:w-56"
                        />
                    </div>
                </div>

                <div v-if="filteredProjects.length === 0" class="rounded-lg border border-dashed border-slate-200 py-12 text-center">
                    <FolderPlus class="mx-auto mb-2 size-8 text-slate-300" />
                    <p class="text-sm font-medium text-slate-700">No projects found</p>
                    <p class="mt-1 text-xs text-slate-500">
                        Create a new LaTeX manuscript or start from a template.
                    </p>
                </div>

                <div v-else class="overflow-x-auto">
                    <table class="w-full text-left text-sm">
                        <thead>
                            <tr class="border-b border-slate-100 text-xs font-medium text-slate-500 uppercase">
                                <th class="pb-3">Project Title</th>
                                <th class="pb-3">Engine</th>
                                <th class="pb-3">Role</th>
                                <th class="pb-3">Files</th>
                                <th class="pb-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            <tr
                                v-for="project in filteredProjects"
                                :key="project.public_id"
                                class="transition hover:bg-slate-50/80"
                            >
                                <td class="py-3 pr-4">
                                    <Link
                                        :href="projectsRoutes.show(project.public_id).url"
                                        class="font-medium text-slate-900 hover:text-indigo-600"
                                    >
                                        {{ project.title }}
                                    </Link>
                                    <p v-if="project.description" class="line-clamp-1 text-xs text-slate-500">
                                        {{ project.description }}
                                    </p>
                                </td>
                                <td class="py-3 pr-4">
                                    <span
                                        class="inline-flex rounded-md bg-slate-100 px-2 py-0.5 font-mono text-xs text-slate-700"
                                    >
                                        {{ project.compiler_engine }}
                                    </span>
                                </td>
                                <td class="py-3 pr-4">
                                    <span
                                        class="inline-flex rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700 capitalize"
                                    >
                                        {{ project.role }}
                                    </span>
                                </td>
                                <td class="py-3 pr-4 text-xs text-slate-600 tabular-nums">
                                    {{ project.files_count }} ({{ formatBytes(project.storage_bytes) }})
                                </td>
                                <td class="py-3 text-right">
                                    <Link
                                        :href="projectsRoutes.show(project.public_id).url"
                                        class="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:border-indigo-300 hover:text-indigo-600"
                                    >
                                        Open IDE
                                    </Link>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Starter Templates & Quick Access -->
            <div class="flex flex-col gap-6">
                <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                    <div class="mb-3 flex items-center justify-between">
                        <h2 class="text-base font-semibold text-slate-900">Starter Templates</h2>
                        <Sparkles class="size-4 text-indigo-500" />
                    </div>
                    <div class="space-y-3">
                        <button
                            v-for="template in templates"
                            :key="template.public_id"
                            type="button"
                            class="flex w-full items-start gap-3 rounded-lg border border-slate-200 p-3 text-left transition hover:border-indigo-300 hover:bg-indigo-50/40"
                            @click="openCreateWithTemplate(template)"
                        >
                            <div class="rounded-md bg-indigo-50 p-2 text-indigo-600">
                                <Layers class="size-4" />
                            </div>
                            <div class="min-w-0 flex-1">
                                <div class="flex items-center justify-between gap-2">
                                    <p class="truncate text-sm font-medium text-slate-900">
                                        {{ template.title }}
                                    </p>
                                    <span class="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] text-slate-600">
                                        {{ template.compiler_engine }}
                                    </span>
                                </div>
                                <p class="mt-0.5 line-clamp-2 text-xs text-slate-500">
                                    {{ template.description }}
                                </p>
                            </div>
                        </button>
                    </div>
                </div>

                <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-xs">
                    <div class="flex items-center gap-2 text-sm font-semibold text-slate-900">
                        <Terminal class="size-4 text-emerald-600" />
                        <span>Sandbox Security Guarantee</span>
                    </div>
                    <p class="mt-2 text-xs leading-relaxed text-slate-600">
                        Every compilation runs in an unprivileged, network-isolated TeX Live container against an immutable revision snapshot. Failed builds never overwrite your last successful PDF.
                    </p>
                </div>
            </div>
        </div>

        <!-- Create Project Modal -->
        <div
            v-if="showCreateModal"
            class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs"
        >
            <div class="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
                <h3 class="text-lg font-semibold text-slate-900">Create New LaTeX Project</h3>
                <p class="mt-1 text-xs text-slate-500">
                    Initialize a private workspace with revision tracking and isolated compilation.
                </p>

                <form class="mt-4 space-y-4" @submit.prevent="submitCreateProject">
                    <div>
                        <label class="block text-xs font-medium text-slate-700">Project Title</label>
                        <input
                            v-model="createForm.title"
                            type="text"
                            required
                            placeholder="e.g. Neural Scaling Laws Manuscript"
                            class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500"
                        />
                        <p v-if="createForm.errors.title" class="mt-1 text-xs text-rose-600">
                            {{ createForm.errors.title }}
                        </p>
                    </div>

                    <div>
                        <label class="block text-xs font-medium text-slate-700">Description (optional)</label>
                        <textarea
                            v-model="createForm.description"
                            rows="2"
                            class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500"
                        />
                    </div>

                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-xs font-medium text-slate-700">Template</label>
                            <select
                                v-model="createForm.template_id"
                                class="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500"
                            >
                                <option value="">Blank Article</option>
                                <option v-for="t in templates" :key="t.public_id" :value="t.public_id">
                                    {{ t.title }}
                                </option>
                            </select>
                        </div>

                        <div>
                            <label class="block text-xs font-medium text-slate-700">Compiler Engine</label>
                            <select
                                v-model="createForm.compiler_engine"
                                class="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500"
                            >
                                <option value="pdflatex">pdfLaTeX</option>
                                <option value="xelatex">XeLaTeX</option>
                                <option value="lualatex">LuaLaTeX</option>
                            </select>
                        </div>
                    </div>

                    <div class="flex items-center justify-end gap-2 pt-2">
                        <button
                            type="button"
                            class="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                            @click="showCreateModal = false"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            :disabled="createForm.processing"
                            class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {{ createForm.processing ? 'Creating...' : 'Create Project' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
