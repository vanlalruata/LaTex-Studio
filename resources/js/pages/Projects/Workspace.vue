<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import {
    AlertCircle,
    ArrowLeftRight,
    Bold,
    CheckCircle2,
    Download,
    FileCode,
    FilePlus,
    Files,
    History,
    Home,
    Italic,
    ListTree,
    Loader2,
    Play,
    Plus,
    Save,
    Search,
    Sigma,
    Terminal,
    Trash2,
    X,
} from '@lucide/vue';
import { computed, onBeforeUnmount, ref } from 'vue';
import MonacoEditor from '@/components/editor/MonacoEditor.vue';
import PdfViewer from '@/components/pdf/PdfViewer.vue';
import { dashboard } from '@/routes';
import compilationsRoutes from '@/routes/compilations';
import projectsRoutes from '@/routes/projects';
import { inferMonacoLanguage } from '@/services/latex/monacoLatexLanguage';

interface ProjectDetail {
    public_id: string;
    title: string;
    description: string | null;
    root_file_path: string;
    compiler_engine: string;
    build_profile: string;
    bibliography_tool: string;
    auto_compile: boolean;
    storage_bytes: number;
    role: string;
    can_edit: boolean;
    can_compile: boolean;
    last_successful_compilation_id: string | null;
}

interface FileNode {
    public_id: string;
    path: string;
    mime_type: string;
    size_bytes: number;
    is_directory: boolean;
    version: number;
}

interface ActiveFileState {
    public_id: string;
    path: string;
    mime_type: string;
    version: number;
    content: string;
}

interface RevisionItem {
    public_id: string;
    revision_hash: string;
    message: string | null;
    creator_name: string;
    created_at: string | null;
}

interface DiagnosticItem {
    severity: string;
    file_path: string | null;
    line: number | null;
    message: string;
}

interface CompilationSummary {
    public_id: string;
    status: string;
    compiler_engine: string;
    duration_ms: number | null;
    error_summary: string | null;
    created_at: string | null;
    diagnostics: DiagnosticItem[];
}

const props = defineProps<{
    project: ProjectDetail;
    files: FileNode[];
    activeFile: ActiveFileState | null;
    revisions: RevisionItem[];
    latestCompilation: CompilationSummary | null;
}>();

const fileList = ref<FileNode[]>([...props.files]);
const currentFile = ref<ActiveFileState | null>(props.activeFile ? { ...props.activeFile } : null);
const openTabs = ref<FileNode[]>(
    props.activeFile
        ? props.files.filter((f) => f.public_id === props.activeFile?.public_id)
        : [],
);
const revisionList = ref<RevisionItem[]>([...props.revisions]);
const fileSearch = ref('');
const leftSidebarTab = ref<'explorer' | 'revisions'>('explorer');
const showBottomDrawer = ref(false);
const saveStatus = ref<'saved' | 'saving' | 'dirty' | 'conflict' | 'error'>('saved');
const cursorPos = ref({ lineNumber: 1, column: 1 });
const newFileName = ref('');
const showNewFileInput = ref(false);
const isStalePdf = ref(false);
const isCompiling = ref(false);
const latestCompilationState = ref<CompilationSummary | null>(props.latestCompilation);
const lastSuccessfulCompilationId = ref<string | null>(
    props.project.last_successful_compilation_id,
);
const editorRef = ref<InstanceType<typeof MonacoEditor> | null>(null);

let autosaveTimer: ReturnType<typeof setTimeout> | null = null;
let compilePollTimer: ReturnType<typeof setTimeout> | null = null;

function getCsrfToken(): string {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
}

const filteredFiles = computed(() => {
    const q = fileSearch.value.trim().toLowerCase();
    if (!q) {
        return fileList.value;
    }
    return fileList.value.filter((f) => f.path.toLowerCase().includes(q));
});

const outlineHeadings = computed(() => {
    const content = currentFile.value?.content ?? '';
    const lines = content.split('\n');
    const headings: Array<{ level: number; title: string; line: number }> = [];

    lines.forEach((line, index) => {
        const match = line.match(/\\(part|chapter|section|subsection|subsubsection)\*?\{([^}]+)\}/);
        if (match) {
            const depthMap: Record<string, number> = {
                part: 0,
                chapter: 0,
                section: 1,
                subsection: 2,
                subsubsection: 3,
            };
            headings.push({
                level: depthMap[match[1]] ?? 1,
                title: match[2],
                line: index + 1,
            });
        }
    });

    return headings;
});

const currentLanguage = computed(() =>
    currentFile.value ? inferMonacoLanguage(currentFile.value.path) : 'latex',
);

const pdfUrl = computed(() =>
    lastSuccessfulCompilationId.value
        ? compilationsRoutes.artifacts.show({
              compilation: lastSuccessfulCompilationId.value,
              type: 'pdf',
          }).url
        : null,
);

async function openFile(file: FileNode): Promise<void> {
    if (file.is_directory) {
        return;
    }
    if (currentFile.value?.public_id === file.public_id) {
        return;
    }

    if (saveStatus.value === 'dirty' && currentFile.value) {
        await saveCurrentFile();
    }

    const response = await fetch(
        projectsRoutes.files.show({ project: props.project.public_id, file: file.public_id }).url,
        {
            headers: { Accept: 'application/json' },
            credentials: 'same-origin',
        },
    );

    if (!response.ok) {
        return;
    }

    const data = (await response.json()) as ActiveFileState;
    currentFile.value = data;
    saveStatus.value = 'saved';

    if (!openTabs.value.some((t) => t.public_id === file.public_id)) {
        openTabs.value.push(file);
    }
}

function closeTab(fileId: string): void {
    openTabs.value = openTabs.value.filter((t) => t.public_id !== fileId);
    if (currentFile.value?.public_id === fileId) {
        const next = openTabs.value[openTabs.value.length - 1];
        if (next) {
            void openFile(next);
        } else {
            currentFile.value = null;
        }
    }
}

function handleEditorInput(newContent: string): void {
    if (!currentFile.value) {
        return;
    }

    currentFile.value.content = newContent;
    saveStatus.value = 'dirty';
    isStalePdf.value = true;

    if (autosaveTimer) {
        clearTimeout(autosaveTimer);
    }

    autosaveTimer = setTimeout(() => {
        void saveCurrentFile();
    }, 750);
}

async function saveCurrentFile(): Promise<void> {
    if (!currentFile.value || !props.project.can_edit) {
        return;
    }

    if (autosaveTimer) {
        clearTimeout(autosaveTimer);
        autosaveTimer = null;
    }

    saveStatus.value = 'saving';

    const response = await fetch(
        projectsRoutes.files.update({
            project: props.project.public_id,
            file: currentFile.value.public_id,
        }).url,
        {
            method: 'PUT',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-XSRF-TOKEN': getCsrfToken(),
            },
            body: JSON.stringify({
                content: currentFile.value.content,
                expected_version: currentFile.value.version,
            }),
        },
    );

    if (response.status === 409) {
        saveStatus.value = 'conflict';
        return;
    }

    if (!response.ok) {
        saveStatus.value = 'error';
        return;
    }

    const updated = (await response.json()) as { version: number; size_bytes: number };
    currentFile.value.version = updated.version;

    const listEntry = fileList.value.find((f) => f.public_id === currentFile.value?.public_id);
    if (listEntry) {
        listEntry.version = updated.version;
        listEntry.size_bytes = updated.size_bytes;
    }

    saveStatus.value = 'saved';
}

async function createFile(): Promise<void> {
    const path = newFileName.value.trim();
    if (!path || !props.project.can_edit) {
        return;
    }

    const response = await fetch(
        projectsRoutes.files.store(props.project.public_id).url,
        {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-XSRF-TOKEN': getCsrfToken(),
            },
            body: JSON.stringify({ path, content: '' }),
        },
    );

    if (!response.ok) {
        return;
    }

    const created = (await response.json()) as FileNode & { content: string };
    fileList.value.push(created);
    newFileName.value = '';
    showNewFileInput.value = false;
    await openFile(created);
}

async function deleteFile(file: FileNode): Promise<void> {
    if (!props.project.can_edit || file.path === props.project.root_file_path) {
        return;
    }

    const response = await fetch(
        projectsRoutes.files.destroy({ project: props.project.public_id, file: file.public_id }).url,
        {
            method: 'DELETE',
            credentials: 'same-origin',
            headers: {
                Accept: 'application/json',
                'X-XSRF-TOKEN': getCsrfToken(),
            },
        },
    );

    if (!response.ok) {
        return;
    }

    fileList.value = fileList.value.filter((f) => f.public_id !== file.public_id);
    closeTab(file.public_id);
}

async function createSnapshot(): Promise<void> {
    if (!props.project.can_edit) {
        return;
    }
    if (saveStatus.value === 'dirty') {
        await saveCurrentFile();
    }

    const response = await fetch(
        projectsRoutes.revisions.store(props.project.public_id).url,
        {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-XSRF-TOKEN': getCsrfToken(),
            },
            body: JSON.stringify({ message: 'Workspace checkpoint' }),
        },
    );

    if (response.ok) {
        const rev = (await response.json()) as RevisionItem;
        if (!revisionList.value.some((r) => r.public_id === rev.public_id)) {
            revisionList.value.unshift({
                ...rev,
                creator_name: 'You',
            });
        }
    }
}

function insertSnippet(snippet: string): void {
    editorRef.value?.insertText(snippet);
}

function jumpToLine(line: number): void {
    editorRef.value?.revealLine(line);
}

async function triggerCompile(): Promise<void> {
    if (!props.project.can_compile || isCompiling.value) {
        return;
    }

    if (saveStatus.value === 'dirty') {
        await saveCurrentFile();
    }

    isCompiling.value = true;

    const response = await fetch(
        projectsRoutes.compilations.store(props.project.public_id).url,
        {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-XSRF-TOKEN': getCsrfToken(),
            },
            body: JSON.stringify({}),
        },
    );

    if (!response.ok) {
        isCompiling.value = false;
        showBottomDrawer.value = true;
        return;
    }

    const created = (await response.json()) as { public_id: string };
    await pollCompilation(created.public_id);
}

async function pollCompilation(compilationId: string): Promise<void> {
    const response = await fetch(compilationsRoutes.show(compilationId).url, {
        headers: { Accept: 'application/json' },
        credentials: 'same-origin',
    });

    if (!response.ok) {
        isCompiling.value = false;
        return;
    }

    const data = (await response.json()) as CompilationSummary & {
        is_terminal: boolean;
        last_successful_compilation_id: string | null;
    };

    latestCompilationState.value = data;

    if (!data.is_terminal) {
        compilePollTimer = setTimeout(() => {
            void pollCompilation(compilationId);
        }, 800);
        return;
    }

    isCompiling.value = false;

    if (data.status === 'published' && data.last_successful_compilation_id) {
        lastSuccessfulCompilationId.value = data.last_successful_compilation_id;
        isStalePdf.value = false;
    } else {
        // Failed/timed out: preserve previous PDF and surface diagnostics
        showBottomDrawer.value = true;
    }
}

onBeforeUnmount(() => {
    if (autosaveTimer) {
        clearTimeout(autosaveTimer);
    }
    if (compilePollTimer) {
        clearTimeout(compilePollTimer);
    }
});
</script>

<template>
    <div class="flex h-screen w-screen flex-col overflow-hidden bg-slate-50 text-slate-900">
        <Head :title="`${project.title} — Workspace`" />

        <!-- Top IDE Header -->
        <header class="flex h-11 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-3">
            <div class="flex items-center gap-3">
                <Link
                    :href="dashboard().url"
                    class="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    title="Back to Dashboard"
                >
                    <Home class="size-3.5" />
                    <span>Projects</span>
                </Link>
                <span class="text-slate-300">/</span>
                <h1 class="max-w-xs truncate text-sm font-semibold text-slate-900">
                    {{ project.title }}
                </h1>
                <span class="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-600 capitalize">
                    {{ project.role }}
                </span>
            </div>

            <div class="flex items-center gap-2">
                <button
                    v-if="project.can_edit"
                    type="button"
                    class="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    @click="createSnapshot"
                >
                    <History class="size-3.5" />
                    <span>Snapshot</span>
                </button>

                <a
                    :href="projectsRoutes.export(project.public_id).url"
                    class="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                    <Download class="size-3.5" />
                    <span>ZIP</span>
                </a>

                <button
                    type="button"
                    class="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    @click="showBottomDrawer = !showBottomDrawer"
                >
                    <Terminal class="size-3.5" />
                    <span>Logs</span>
                </button>

                <button
                    v-if="project.can_compile"
                    type="button"
                    :disabled="isCompiling"
                    class="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow-xs transition hover:bg-emerald-700 disabled:opacity-60"
                    title="Compile manuscript in isolated TeX Live worker"
                    @click="triggerCompile"
                >
                    <Loader2 v-if="isCompiling" class="size-3.5 animate-spin" />
                    <Play v-else class="size-3.5 fill-current" />
                    <span>{{ isCompiling ? 'Compiling...' : 'Compile' }}</span>
                </button>
            </div>
        </header>

        <!-- Main 3-Pane Workspace -->
        <div class="flex min-h-0 flex-1">
            <!-- Activity Bar -->
            <aside class="flex w-11 shrink-0 flex-col items-center gap-2 border-r border-slate-200 bg-slate-100/70 py-2">
                <button
                    type="button"
                    class="rounded-lg p-2 transition"
                    :class="leftSidebarTab === 'explorer' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'"
                    title="Explorer & Outline"
                    @click="leftSidebarTab = 'explorer'"
                >
                    <Files class="size-4" />
                </button>
                <button
                    type="button"
                    class="rounded-lg p-2 transition"
                    :class="leftSidebarTab === 'revisions' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'"
                    title="Revision History"
                    @click="leftSidebarTab = 'revisions'"
                >
                    <History class="size-4" />
                </button>
            </aside>

            <!-- Left Explorer + Outline Panel -->
            <aside class="flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
                <template v-if="leftSidebarTab === 'explorer'">
                    <div class="flex items-center justify-between border-b border-slate-100 px-3 py-2">
                        <span class="text-xs font-semibold tracking-wider text-slate-500 uppercase">Explorer</span>
                        <button
                            v-if="project.can_edit"
                            type="button"
                            class="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                            title="New file"
                            @click="showNewFileInput = !showNewFileInput"
                        >
                            <FilePlus class="size-3.5" />
                        </button>
                    </div>

                    <div class="border-b border-slate-100 p-2">
                        <div class="relative">
                            <Search class="pointer-events-none absolute top-2 left-2.5 size-3.5 text-slate-400" />
                            <input
                                v-model="fileSearch"
                                type="search"
                                placeholder="Search files..."
                                class="w-full rounded-md border border-slate-200 bg-slate-50 py-1 pr-2 pl-7 text-xs outline-none focus:border-indigo-500 focus:bg-white"
                            />
                        </div>
                        <form v-if="showNewFileInput" class="mt-2 flex gap-1" @submit.prevent="createFile">
                            <input
                                v-model="newFileName"
                                type="text"
                                placeholder="chapters/sec2.tex"
                                class="min-w-0 flex-1 rounded border border-indigo-300 px-2 py-1 text-xs outline-none"
                            />
                            <button
                                type="submit"
                                class="rounded bg-indigo-600 px-2 py-1 text-xs font-medium text-white hover:bg-indigo-700"
                            >
                                <Plus class="size-3.5" />
                            </button>
                        </form>
                    </div>

                    <div class="flex-1 overflow-y-auto p-1.5">
                        <div
                            v-for="file in filteredFiles"
                            :key="file.public_id"
                            class="group flex items-center justify-between rounded-md px-2 py-1.5 text-xs transition"
                            :class="
                                currentFile?.public_id === file.public_id
                                    ? 'bg-indigo-50 font-medium text-indigo-700'
                                    : 'text-slate-700 hover:bg-slate-100'
                            "
                        >
                            <button
                                type="button"
                                class="flex min-w-0 flex-1 items-center gap-2 text-left"
                                @click="openFile(file)"
                            >
                                <FileCode class="size-3.5 shrink-0 text-slate-400" />
                                <span class="truncate">{{ file.path }}</span>
                            </button>
                            <button
                                v-if="project.can_edit && file.path !== project.root_file_path"
                                type="button"
                                class="hidden rounded p-0.5 text-slate-400 hover:text-rose-600 group-hover:block"
                                title="Delete file"
                                @click="deleteFile(file)"
                            >
                                <Trash2 class="size-3" />
                            </button>
                        </div>
                    </div>

                    <!-- Document Outline -->
                    <div class="flex h-48 flex-col border-t border-slate-200">
                        <div class="flex items-center gap-1.5 border-b border-slate-100 px-3 py-1.5">
                            <ListTree class="size-3.5 text-slate-400" />
                            <span class="text-xs font-semibold tracking-wider text-slate-500 uppercase">Outline</span>
                        </div>
                        <div class="flex-1 overflow-y-auto p-2">
                            <p v-if="outlineHeadings.length === 0" class="text-xs text-slate-400">
                                No section headings in current file.
                            </p>
                            <button
                                v-for="(h, idx) in outlineHeadings"
                                :key="idx"
                                type="button"
                                class="block w-full truncate rounded px-2 py-1 text-left text-xs text-slate-700 hover:bg-slate-100"
                                :style="{ paddingLeft: `${8 + h.level * 10}px` }"
                                @click="jumpToLine(h.line)"
                            >
                                {{ h.title }}
                            </button>
                        </div>
                    </div>
                </template>

                <!-- Revisions Sidebar -->
                <template v-else>
                    <div class="border-b border-slate-100 px-3 py-2">
                        <span class="text-xs font-semibold tracking-wider text-slate-500 uppercase">Revisions</span>
                    </div>
                    <div class="flex-1 space-y-2 overflow-y-auto p-2">
                        <div
                            v-for="rev in revisionList"
                            :key="rev.public_id"
                            class="rounded-lg border border-slate-200 bg-slate-50/70 p-2.5 text-xs"
                        >
                            <p class="font-medium text-slate-800">{{ rev.message || 'Snapshot' }}</p>
                            <p class="mt-1 font-mono text-[10px] text-slate-500">
                                {{ rev.revision_hash.slice(0, 12) }} · {{ rev.creator_name }}
                            </p>
                        </div>
                    </div>
                </template>
            </aside>

            <!-- Center Monaco Editor Column -->
            <main class="flex min-w-0 flex-1 flex-col border-r border-slate-200 bg-white">
                <!-- Tabs + Formatting Toolbar -->
                <div class="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-2">
                    <div class="flex items-center overflow-x-auto">
                        <div
                            v-for="tab in openTabs"
                            :key="tab.public_id"
                            class="flex items-center gap-1.5 border-r border-slate-200 px-3 py-1.5 text-xs"
                            :class="
                                currentFile?.public_id === tab.public_id
                                    ? 'border-b-2 border-b-indigo-600 bg-white font-medium text-slate-900'
                                    : 'text-slate-600 hover:bg-slate-100'
                            "
                        >
                            <button type="button" @click="openFile(tab)">
                                {{ tab.path }}
                            </button>
                            <button
                                type="button"
                                class="rounded p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                                @click="closeTab(tab.public_id)"
                            >
                                <X class="size-3" />
                            </button>
                        </div>
                    </div>

                    <div v-if="project.can_edit" class="flex items-center gap-1 py-1">
                        <button
                            type="button"
                            class="rounded p-1 text-slate-600 hover:bg-slate-200"
                            title="Bold (\\textbf{})"
                            @click="insertSnippet('\\textbf{}')"
                        >
                            <Bold class="size-3.5" />
                        </button>
                        <button
                            type="button"
                            class="rounded p-1 text-slate-600 hover:bg-slate-200"
                            title="Italic (\\textit{})"
                            @click="insertSnippet('\\textit{}')"
                        >
                            <Italic class="size-3.5" />
                        </button>
                        <button
                            type="button"
                            class="rounded p-1 text-slate-600 hover:bg-slate-200"
                            title="Equation environment"
                            @click="insertSnippet('\\begin{equation}\n    \n\\end{equation}\n')"
                        >
                            <Sigma class="size-3.5" />
                        </button>
                        <button
                            type="button"
                            class="ml-1 inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium text-slate-600 hover:bg-slate-200"
                            title="Save now (Ctrl+S)"
                            @click="saveCurrentFile"
                        >
                            <Save class="size-3.5" />
                        </button>
                    </div>
                </div>

                <!-- Monaco Editor Surface -->
                <div class="min-h-0 flex-1">
                    <MonacoEditor
                        v-if="currentFile"
                        ref="editorRef"
                        :model-value="currentFile.content"
                        :language="currentLanguage"
                        :read-only="!project.can_edit"
                        @update:model-value="handleEditorInput"
                        @cursor-change="cursorPos = $event"
                        @save="saveCurrentFile"
                    />
                    <div
                        v-else
                        class="flex h-full items-center justify-center text-sm text-slate-400"
                    >
                        Select a file from the explorer to begin editing.
                    </div>
                </div>

                <!-- Bottom Logs & Diagnostics Drawer -->
                <div v-if="showBottomDrawer" class="flex h-48 shrink-0 flex-col border-t border-slate-200 bg-slate-50">
                    <div class="flex items-center justify-between border-b border-slate-200 bg-white px-3 py-1.5 text-xs">
                        <div class="flex items-center gap-2 font-semibold text-slate-700">
                            <Terminal class="size-3.5" />
                            <span>Build Logs & Normalized Diagnostics</span>
                        </div>
                        <button
                            type="button"
                            class="rounded p-0.5 text-slate-400 hover:text-slate-700"
                            @click="showBottomDrawer = false"
                        >
                            <X class="size-3.5" />
                        </button>
                    </div>
                    <div class="flex-1 overflow-y-auto p-3 font-mono text-xs text-slate-700">
                        <p v-if="!latestCompilationState" class="text-slate-500">
                            No compilation runs recorded for this project yet. Click Compile to run an isolated build.
                        </p>
                        <div v-else class="space-y-2">
                            <div class="flex items-center justify-between">
                                <p>
                                    Build <span class="font-semibold">{{ latestCompilationState.public_id.slice(0, 8) }}</span> · Status:
                                    <strong class="uppercase">{{ latestCompilationState.status }}</strong>
                                    <span v-if="latestCompilationState.duration_ms"> ({{ latestCompilationState.duration_ms }} ms)</span>
                                </p>
                                <a
                                    :href="compilationsRoutes.artifacts.show({ compilation: latestCompilationState.public_id, type: 'log' }).url"
                                    target="_blank"
                                    class="text-indigo-600 hover:underline"
                                >
                                    Raw Log
                                </a>
                            </div>
                            <p v-if="latestCompilationState.error_summary" class="rounded bg-rose-50 p-2 text-rose-700">
                                {{ latestCompilationState.error_summary }}
                            </p>
                            <button
                                v-for="(diag, i) in latestCompilationState.diagnostics"
                                :key="i"
                                type="button"
                                class="block w-full rounded border border-slate-200 bg-white p-2 text-left transition hover:border-indigo-300"
                                @click="diag.line ? jumpToLine(diag.line) : undefined"
                            >
                                <span
                                    class="font-semibold uppercase"
                                    :class="diag.severity === 'error' ? 'text-rose-600' : 'text-amber-600'"
                                >
                                    {{ diag.severity }}
                                </span>
                                <span v-if="diag.file_path || diag.line" class="text-slate-500">
                                    · {{ diag.file_path ?? 'source' }}:{{ diag.line ?? '?' }}
                                </span>
                                — {{ diag.message }}
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <!-- Right PDF Preview Column -->
            <section class="hidden w-[42%] shrink-0 flex-col bg-slate-100 lg:flex">
                <PdfViewer :pdf-url="pdfUrl" :is-stale="isStalePdf" />
            </section>
        </div>

        <!-- Bottom Status Bar -->
        <footer
            class="flex h-6 shrink-0 items-center justify-between border-t border-slate-200 bg-white px-3 text-[11px] text-slate-600"
        >
            <div class="flex items-center gap-4">
                <span class="font-mono">{{ currentFile?.path ?? 'No file' }}</span>
                <span class="flex items-center gap-1">
                    <Loader2 v-if="saveStatus === 'saving'" class="size-3 animate-spin text-indigo-600" />
                    <CheckCircle2 v-else-if="saveStatus === 'saved'" class="size-3 text-emerald-600" />
                    <AlertCircle v-else class="size-3 text-amber-600" />
                    <span class="capitalize">{{ saveStatus }}</span>
                </span>
            </div>

            <div class="flex items-center gap-4 tabular-nums">
                <span>Ln {{ cursorPos.lineNumber }}, Col {{ cursorPos.column }}</span>
                <span>UTF-8</span>
                <span class="flex items-center gap-1">
                    <ArrowLeftRight class="size-3 text-emerald-600" />
                    <span>SyncTeX Ready</span>
                </span>
                <span class="font-mono">{{ project.compiler_engine }}</span>
            </div>
        </footer>
    </div>
</template>
