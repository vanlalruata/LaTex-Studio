<script setup lang="ts">
import { Head, Link, usePage } from '@inertiajs/vue3';
import {
    AlertCircle,
    ArrowLeftRight,
    Ban,
    Bold,
    BookOpen,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    Crosshair,
    Download,
    FileCode,
    FilePlus,
    Files,
    FileWarning,
    Folder,
    FolderOpen,
    FolderPlus,
    History,
    Home,
    Italic,
    ListChecks,
    ListTree,
    Loader2,
    MessageCircle,
    MessageSquare,
    Play,
    Plug,
    Plus,
    RefreshCw,
    Save,
    Search,
    Shapes,
    Sigma,
    Sparkles,
    Terminal,
    Trash2,
    Upload,
    Wrench,
    X,
} from '@lucide/vue';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import AiAssistantPanel, {
    type AiActionItem,
    type AiCredentialSummary,
} from '@/components/ai/AiAssistantPanel.vue';
import CollaboratorChatPanel from '@/components/collaboration/CollaboratorChatPanel.vue';
import IntegrationsPanel from '@/components/collaboration/IntegrationsPanel.vue';
import PresenceStrip from '@/components/collaboration/PresenceStrip.vue';
import ReviewPanel, {
    type CommentThreadItem,
    type SuggestionItem,
} from '@/components/collaboration/ReviewPanel.vue';
import TaskBoardPanel from '@/components/collaboration/TaskBoardPanel.vue';
import BibliographyPanel from '@/components/editor/BibliographyPanel.vue';
import EquationLaboratoryDialog from '@/components/editor/EquationLaboratoryDialog.vue';
import MonacoEditor from '@/components/editor/MonacoEditor.vue';
import ResearchToolsPanel from '@/components/editor/ResearchToolsPanel.vue';
import SymbolPalette from '@/components/editor/SymbolPalette.vue';
import VisualLatexEditor from '@/components/editor/VisualLatexEditor.vue';
import PdfViewer from '@/components/pdf/PdfViewer.vue';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { useBuildInspector } from '@/composables/useBuildInspector';
import { useCompilationChannel } from '@/composables/useCompilationChannel';
import { useProjectAnnotations } from '@/composables/useProjectAnnotations';
import { useSynctex } from '@/composables/useSynctex';
import { useProjectIntegrations } from '@/composables/useProjectIntegrations';
import { useProjectTasks } from '@/composables/useProjectTasks';
import { useResearchWorkspace } from '@/composables/useResearchWorkspace';
import { useRevisions } from '@/composables/useRevisions';
import { useWorkspacePresence } from '@/composables/useWorkspacePresence';
import { apiSend } from '@/lib/http';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Toaster } from '@/components/ui/sonner';
import { dashboard } from '@/routes';
import compilationsRoutes from '@/routes/compilations';
import synctexRoutes from '@/routes/compilations/synctex';
import projectsRoutes from '@/routes/projects';
import { parseBibtex, type BibEntry } from '@/services/latex/bibtexParser';
import { inferMonacoLanguage } from '@/services/latex/monacoLatexLanguage';
import { updateProjectSymbolContext } from '@/services/latex/monacoLatexProviders';

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

interface BuildHistoryItem {
    public_id: string;
    status: string;
    compiler_engine: string;
    duration_ms: number | null;
    exit_code: number | null;
    error_summary: string | null;
    created_at: string | null;
    finished_at: string | null;
    error_count: number;
    warning_count: number;
    has_pdf: boolean;
    has_log: boolean;
    has_synctex: boolean;
}

const props = defineProps<{
    project: ProjectDetail;
    files: FileNode[];
    activeFile: ActiveFileState | null;
    revisions: RevisionItem[];
    latestCompilation: CompilationSummary | null;
    buildHistory?: BuildHistoryItem[];
}>();

const fileList = ref<FileNode[]>([...props.files]);
const currentFile = ref<ActiveFileState | null>(
    props.activeFile ? { ...props.activeFile } : null,
);
const openTabs = ref<FileNode[]>(
    props.activeFile
        ? props.files.filter((f) => f.public_id === props.activeFile?.public_id)
        : [],
);
const fileSearch = ref('');
const leftSidebarTab = ref<
    | 'explorer'
    | 'symbols'
    | 'bibliography'
    | 'tools'
    | 'review'
    | 'ai'
    | 'revisions'
    | 'tasks'
    | 'integrations'
>('explorer');
const isLeftSidebarOpen = ref(true);

function toggleLeftSidebarTab(tab: typeof leftSidebarTab.value): void {
    if (leftSidebarTab.value === tab) {
        isLeftSidebarOpen.value = !isLeftSidebarOpen.value;
        return;
    }

    leftSidebarTab.value = tab;
    isLeftSidebarOpen.value = true;
}
const editorMode = ref<'code' | 'visual'>('code');
const previewTab = ref<'pdf' | 'log' | 'warnings' | 'build'>('pdf');
const showRightRail = ref(true);
const rightRailTab = ref<'chat' | 'ai' | 'comments' | 'tools'>('chat');
const bibEntries = ref<BibEntry[]>([]);
const reviewThreads = ref<CommentThreadItem[]>([]);
const reviewSuggestions = ref<SuggestionItem[]>([]);
const aiCredentials = ref<AiCredentialSummary[]>([]);
const aiActions = ref<AiActionItem[]>([]);
const isAiAsking = ref(false);
const aiError = ref<string | null>(null);
const showBottomDrawer = ref(false);
const saveStatus = ref<'saved' | 'saving' | 'dirty' | 'conflict' | 'error'>(
    'saved',
);
const conflictState = ref<{
    server_version: number;
    server_sha256: string | null;
    server_content: string;
    updated_by_name: string | null;
} | null>(null);
const cursorPos = ref({ lineNumber: 1, column: 1 });
const newFileName = ref('');
const showNewFileInput = ref(false);
const isStalePdf = ref(false);
const isCompiling = ref(false);
const latestCompilationState = ref<CompilationSummary | null>(
    props.latestCompilation,
);
const lastSuccessfulCompilationId = ref<string | null>(
    props.project.last_successful_compilation_id,
);
const editorRef = ref<InstanceType<typeof MonacoEditor> | null>(null);
const pdfViewerRef = ref<InstanceType<typeof PdfViewer> | null>(null);

const presence = useWorkspacePresence(props.project.public_id);
const taskBoard = useProjectTasks(props.project.public_id);
const annotationState = useProjectAnnotations(props.project.public_id);
const research = useResearchWorkspace(props.project.public_id);
const integrationState = useProjectIntegrations(props.project.public_id);
const revisionState = useRevisions(props.project.public_id);
const revisionList = revisionState.revisions;
revisionList.value = [...props.revisions];
const inspector = useBuildInspector();

const page = usePage();
const currentUserId = computed(
    () => (page.props.auth as { user?: { id?: number } })?.user?.id ?? null,
);
const { users: presenceUsers } = presence;
const {
    tasks: projectTasks,
    milestones: projectMilestones,
    isLoading: tasksLoading,
    error: tasksError,
    createTask,
    updateTask,
    deleteTask,
    createMilestone,
} = taskBoard;
const {
    annotations,
    create: persistAnnotation,
    resolve: resolveAnnotation,
    remove: removeAnnotation,
} = annotationState;
const {
    assets: researchAssets,
    sources: researchSources,
    ocrJobs,
    conversions,
    createAsset,
    deleteAsset,
    createOcrJob,
    deleteOcrJob,
    createConversion,
    deleteConversion,
} = research;
const {
    integrations,
    connect: connectIntegration,
    setStatus: setIntegrationStatus,
    remove: removeIntegration,
} = integrationState;
const {
    diff: revisionDiff,
    isLoadingDiff,
    isRestoring,
    error: revisionError,
} = revisionState;
const { logText, isLoadingLog, error: logError } = inspector;

const activeRevisionId = ref<string | null>(null);
const restoreTargetId = ref<string | null>(null);
const engine = ref(props.project.compiler_engine);
const commitEngineValue = ref(props.project.compiler_engine);
const activeCompilationId = ref<string | null>(null);

const compilerEngines = ['pdflatex', 'xelatex', 'lualatex'] as const;

let autosaveTimer: ReturnType<typeof setTimeout> | null = null;
let compilePollTimer: ReturnType<typeof setTimeout> | null = null;
let presenceTimer: ReturnType<typeof setTimeout> | null = null;

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

const expandedFolders = ref<Record<string, boolean>>({});

function toggleFolder(path: string): void {
    expandedFolders.value = {
        ...expandedFolders.value,
        [path]: !expandedFolders.value[path],
    };
}

function expandFolder(path: string): void {
    const parts = path.split('/').filter(Boolean);
    const next = { ...expandedFolders.value };
    let current = '';
    for (const part of parts) {
        current = current ? `${current}/${part}` : part;
        next[current] = true;
    }
    expandedFolders.value = next;
}

interface ExplorerTreeRow {
    key: string;
    name: string;
    path: string;
    depth: number;
    isDirectory: boolean;
    isExpanded: boolean;
    file: FileNode | null;
}

const explorerTreeRows = computed<ExplorerTreeRow[]>(() => {
    interface TreeNode {
        name: string;
        path: string;
        isDirectory: boolean;
        file: FileNode | null;
        children: Map<string, TreeNode>;
    }

    const rootChildren = new Map<string, TreeNode>();

    for (const file of filteredFiles.value) {
        const parts = file.path.split('/').filter(Boolean);
        if (parts.length === 0) {
            continue;
        }

        let currentMap = rootChildren;
        let currentPath = '';

        for (let i = 0; i < parts.length; i++) {
            const segment = parts[i];
            currentPath = currentPath ? `${currentPath}/${segment}` : segment;
            const isLeaf = i === parts.length - 1;
            const isDir = isLeaf ? file.is_directory : true;

            let node = currentMap.get(segment);
            if (!node) {
                node = {
                    name: segment,
                    path: currentPath,
                    isDirectory: isDir,
                    file: isLeaf ? file : null,
                    children: new Map<string, TreeNode>(),
                };
                currentMap.set(segment, node);
            } else if (isLeaf) {
                node.file = file;
                if (file.is_directory) {
                    node.isDirectory = true;
                }
            }

            currentMap = node.children;
        }
    }

    const isSearching = fileSearch.value.trim() !== '';
    const rows: ExplorerTreeRow[] = [];

    function walk(nodes: Map<string, TreeNode>, depth: number): void {
        const sorted = Array.from(nodes.values()).sort((a, b) => {
            if (a.isDirectory !== b.isDirectory) {
                return a.isDirectory ? -1 : 1;
            }
            return a.name.localeCompare(b.name);
        });

        for (const node of sorted) {
            const isExpanded = isSearching || Boolean(expandedFolders.value[node.path]);
            rows.push({
                key: node.path,
                name: node.name,
                path: node.path,
                depth,
                isDirectory: node.isDirectory,
                isExpanded,
                file: node.file,
            });

            if (node.isDirectory && isExpanded && node.children.size > 0) {
                walk(node.children, depth + 1);
            }
        }
    }

    walk(rootChildren, 0);

    return rows;
});

const outlineHeadings = computed(() => {
    const content = currentFile.value?.content ?? '';
    const lines = content.split('\n');
    const headings: Array<{ level: number; title: string; line: number }> = [];

    lines.forEach((line, index) => {
        const match = line.match(
            /\\(part|chapter|section|subsection|subsubsection)\*?\{([^}]+)\}/,
        );
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

const warningDiagnostics = computed(() =>
    (latestCompilationState.value?.diagnostics ?? []).filter(
        (diagnostic) => diagnostic.severity === 'warning',
    ),
);

const errorDiagnostics = computed(() =>
    (latestCompilationState.value?.diagnostics ?? []).filter(
        (diagnostic) => diagnostic.severity === 'error',
    ),
);

const canSyncTex = computed(() => lastSuccessfulCompilationId.value !== null);

function handleCursorChange(position: { lineNumber: number; column: number }): void {
    cursorPos.value = position;

    if (!currentFile.value) {
        return;
    }

    if (presenceTimer) {
        clearTimeout(presenceTimer);
    }

    presenceTimer = setTimeout(() => {
        if (currentFile.value) {
            void presence.touch({
                file_id: currentFile.value.public_id,
                line: position.lineNumber,
                column: position.column,
            });
        }
    }, 500);
}

async function handlePresenceJump(user: {
    cursor: { file_id: string; line: number } | null;
}): Promise<void> {
    if (!user.cursor) {
        return;
    }

    const file = fileList.value.find(
        (candidate) => candidate.public_id === user.cursor?.file_id,
    );

    if (file) {
        await openFile(file);
        jumpToLine(user.cursor.line);
    }
}

const { forwardLookup: synctexForwardLookup, inverseLookup: synctexInverseLookup } = useSynctex(getCsrfToken);

async function forwardSynctex(targetLine?: number | MouseEvent): Promise<void> {
    if (!currentFile.value || !lastSuccessfulCompilationId.value) {
        return;
    }

    const line = typeof targetLine === 'number' ? targetLine : cursorPos.value.lineNumber;

    const data = await synctexForwardLookup(
        lastSuccessfulCompilationId.value,
        currentFile.value.path,
        line,
    );

    if (data) {
        previewTab.value = 'pdf';
        pdfViewerRef.value?.goToPage(data.page);
    }
}

async function handleInverseSynctex(payload: {
    page: number;
    x: number;
    y: number;
}): Promise<void> {
    if (!lastSuccessfulCompilationId.value) {
        return;
    }

    const data = await synctexInverseLookup(lastSuccessfulCompilationId.value, payload);

    if (!data) {
        return;
    }

    const file = fileList.value.find(
        (candidate) => candidate.public_id === data.file_id,
    );

    if (file) {
        await openFile(file);
        jumpToLine(data.line);
    }
}

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
        projectsRoutes.files.show({
            project: props.project.public_id,
            file: file.public_id,
        }).url,
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
        const conflictData = (await response.json()) as {
            server_version?: number;
            server_sha256?: string | null;
            server_content?: string;
            updated_by_name?: string | null;
        };
        if (typeof conflictData.server_version === 'number') {
            conflictState.value = {
                server_version: conflictData.server_version,
                server_sha256: conflictData.server_sha256 ?? null,
                server_content: conflictData.server_content ?? '',
                updated_by_name: conflictData.updated_by_name ?? null,
            };
        }
        return;
    }

    if (!response.ok) {
        saveStatus.value = 'error';
        return;
    }

    const updated = (await response.json()) as {
        version: number;
        size_bytes: number;
    };
    currentFile.value.version = updated.version;

    const listEntry = fileList.value.find(
        (f) => f.public_id === currentFile.value?.public_id,
    );
    if (listEntry) {
        listEntry.version = updated.version;
        listEntry.size_bytes = updated.size_bytes;
    }

    saveStatus.value = 'saved';
    conflictState.value = null;
    void refreshProjectIndex();
}

function reloadServerConflictVersion(): void {
    if (!currentFile.value || !conflictState.value) {
        return;
    }

    currentFile.value.content = conflictState.value.server_content;
    currentFile.value.version = conflictState.value.server_version;
    conflictState.value = null;
    saveStatus.value = 'saved';
}

async function overwriteConflictWithLocal(): Promise<void> {
    if (!currentFile.value || !conflictState.value) {
        return;
    }

    currentFile.value.version = conflictState.value.server_version;
    conflictState.value = null;
    saveStatus.value = 'dirty';
    await saveCurrentFile();
}

const creationMode = ref<'file' | 'folder'>('file');
const uploadTargetDir = ref<string | null>(null);
const fileUploadInputRef = ref<HTMLInputElement | null>(null);
const uploadProgress = ref<{
    fileName: string;
    percent: number;
    current: number;
    total: number;
} | null>(null);
const uploadError = ref<string | null>(null);

function parentDirOf(path: string): string | undefined {
    const idx = path.lastIndexOf('/');
    return idx > 0 ? path.slice(0, idx) : undefined;
}

function openCreatePrompt(mode: 'file' | 'folder', parentDir?: string): void {
    creationMode.value = mode;
    if (parentDir) {
        expandFolder(parentDir);
    }
    newFileName.value = parentDir ? `${parentDir}/` : '';
    showNewFileInput.value = true;
}

function triggerUploadToFolder(parentDir?: string): void {
    if (!props.project.can_edit) {
        return;
    }
    if (parentDir) {
        expandFolder(parentDir);
    }
    uploadTargetDir.value = parentDir ?? null;
    fileUploadInputRef.value?.click();
}

function uploadSingleFileWithProgress(
    targetPath: string,
    file: File,
    index: number,
    total: number,
): Promise<FileNode & { content: string }> {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', projectsRoutes.files.store(props.project.public_id).url);
        xhr.withCredentials = true;
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('X-XSRF-TOKEN', getCsrfToken());

        xhr.upload.onprogress = (progressEvent) => {
            const percent = progressEvent.lengthComputable
                ? Math.round((progressEvent.loaded / progressEvent.total) * 100)
                : 0;
            uploadProgress.value = {
                fileName: file.name,
                percent,
                current: index + 1,
                total,
            };
        };

        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                try {
                    resolve(JSON.parse(xhr.responseText) as FileNode & { content: string });
                } catch {
                    reject(new Error('Invalid server response during upload.'));
                }
            } else {
                try {
                    const errBody = JSON.parse(xhr.responseText) as { message?: string };
                    reject(new Error(errBody.message ?? `Upload failed (${xhr.status}).`));
                } catch {
                    reject(new Error(`Upload failed (${xhr.status}).`));
                }
            }
        };

        xhr.onerror = () => reject(new Error('Network error while uploading file.'));

        const formData = new FormData();
        formData.append('path', targetPath);
        formData.append('file', file);
        xhr.send(formData);
    });
}

async function handleFileUploadChange(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (!files || files.length === 0 || !props.project.can_edit) {
        return;
    }

    const targetDir = uploadTargetDir.value;
    uploadError.value = null;
    const fileArray = Array.from(files);

    try {
        for (let i = 0; i < fileArray.length; i++) {
            const file = fileArray[i];
            const targetPath = targetDir ? `${targetDir}/${file.name}` : file.name;

            uploadProgress.value = {
                fileName: file.name,
                percent: 0,
                current: i + 1,
                total: fileArray.length,
            };

            const created = await uploadSingleFileWithProgress(
                targetPath,
                file,
                i,
                fileArray.length,
            );

            fileList.value = [...fileList.value, created];

            if (targetDir) {
                expandFolder(targetDir);
            }
        }
    } catch (error) {
        uploadError.value = error instanceof Error ? error.message : 'Upload failed.';
    } finally {
        uploadProgress.value = null;
        input.value = '';
        uploadTargetDir.value = null;
    }
}

async function createFile(): Promise<void> {
    const path = newFileName.value.trim().replace(/\/+$/, '');
    if (!path || !props.project.can_edit) {
        return;
    }

    const isDirectory = creationMode.value === 'folder';

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
            body: JSON.stringify({
                path,
                content: '',
                is_directory: isDirectory,
            }),
        },
    );

    if (!response.ok) {
        return;
    }

    const created = (await response.json()) as FileNode & { content: string };
    fileList.value = [...fileList.value, created];
    const parent = parentDirOf(created.path);
    if (parent) {
        expandFolder(parent);
    }
    if (created.is_directory) {
        expandFolder(created.path);
    }
    newFileName.value = '';
    showNewFileInput.value = false;

    if (!created.is_directory) {
        await openFile(created);
    }
}

const fileToDelete = ref<FileNode | null>(null);

async function deleteFile(file: FileNode): Promise<void> {
    if (!props.project.can_edit || file.path === props.project.root_file_path) {
        return;
    }

    const response = await fetch(
        projectsRoutes.files.destroy({
            project: props.project.public_id,
            file: file.public_id,
        }).url,
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

    fileList.value = fileList.value.filter(
        (f) => f.public_id !== file.public_id,
    );
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

const showEquationLab = ref(false);

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
    activeCompilationId.value = created.public_id;
    await pollCompilation(created.public_id);
}

async function cancelBuild(): Promise<void> {
    if (!activeCompilationId.value) {
        return;
    }

    const result = await apiSend<{ public_id: string }>(
        compilationsRoutes.cancel(activeCompilationId.value).url,
        'POST',
    );

    if (result.ok && activeCompilationId.value) {
        await pollCompilation(activeCompilationId.value);
    }
}

async function retryBuild(compilationId: string): Promise<void> {
    const result = await apiSend<{ public_id: string; status: string }>(
        compilationsRoutes.retry(compilationId).url,
        'POST',
    );

    if (!result.ok || !result.data) {
        return;
    }

    isCompiling.value = true;
    activeCompilationId.value = result.data.public_id;
    previewTab.value = 'log';
    await pollCompilation(result.data.public_id);
}

async function commitEngine(): Promise<void> {
    const next = engine.value;
    const previous = commitEngineValue.value;

    if (next === previous || !props.project.can_compile) {
        return;
    }

    const result = await apiSend<{ compiler_engine: string }>(
        projectsRoutes.engine.update(props.project.public_id).url,
        'PUT',
        { compiler_engine: next },
    );

    if (!result.ok) {
        engine.value = previous;

        return;
    }

    commitEngineValue.value = next;
}

async function openLogTab(compilationId?: string | null): Promise<void> {
    const target = compilationId ?? latestCompilationState.value?.public_id ?? null;

    if (!target) {
        return;
    }

    previewTab.value = 'log';
    await inspector.loadLog(target);
}

async function selectRevision(revisionId: string): Promise<void> {
    if (activeRevisionId.value === revisionId) {
        activeRevisionId.value = null;
        revisionState.diff.value = null;

        return;
    }

    activeRevisionId.value = revisionId;
    await revisionState.loadDiff(revisionId);
}

async function restoreRevision(): Promise<void> {
    const target = restoreTargetId.value;
    restoreTargetId.value = null;

    if (!target) {
        return;
    }

    const restored = await revisionState.restore(target);

    if (!restored) {
        return;
    }

    activeRevisionId.value = null;

    if (currentFile.value) {
        const file = fileList.value.find(
            (candidate) => candidate.public_id === currentFile.value?.public_id,
        );
        currentFile.value = null;
        if (file) {
            await openFile(file);
        }
    }
}

async function handleCreateAnnotation(body: string): Promise<void> {
    if (!currentFile.value) {
        return;
    }

    await persistAnnotation({
        fileId: currentFile.value.public_id,
        startLine: cursorPos.value.lineNumber,
        body,
    });
}

async function handleResolveAnnotation(annotationId: string): Promise<void> {
    const annotation = annotations.value.find(
        (candidate) => candidate.public_id === annotationId,
    );

    if (annotation?.status === 'resolved') {
        return;
    }

    await resolveAnnotation(annotationId);
}

function openReviewPanel(): void {
    showRightRail.value = true;
    rightRailTab.value = 'comments';
    leftSidebarTab.value = 'review';
    isLeftSidebarOpen.value = true;
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
        }, isCompilationChannelConnected.value ? 3000 : 800);
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

const { isConnected: isCompilationChannelConnected } = useCompilationChannel(
    props.project.public_id,
    {
        onStatusChanged(payload) {
            if (activeCompilationId.value && payload.public_id !== activeCompilationId.value) {
                return;
            }

            if (latestCompilationState.value) {
                latestCompilationState.value = {
                    ...latestCompilationState.value,
                    status: payload.status,
                    error_summary: payload.error_summary,
                };
            }

            if (payload.is_terminal) {
                if (compilePollTimer) {
                    clearTimeout(compilePollTimer);
                    compilePollTimer = null;
                }
                void pollCompilation(payload.public_id);
            }
        },
    },
);

async function refreshProjectIndex(): Promise<void> {
    const response = await fetch(
        projectsRoutes.index(props.project.public_id).url,
        {
            headers: { Accept: 'application/json' },
            credentials: 'same-origin',
        },
    );

    if (!response.ok) {
        return;
    }

    const data = (await response.json()) as {
        labels: string[];
        citations: string[];
        files: string[];
        bib_source: string;
    };

    updateProjectSymbolContext({
        labels: data.labels,
        citations: data.citations,
        files: data.files,
    });
    bibEntries.value = parseBibtex(data.bib_source);
    editorRef.value?.refreshMarkers();
}

async function loadCollaborationData(): Promise<void> {
    const [commentsRes, suggestionsRes, aiRes] = await Promise.all([
        fetch(projectsRoutes.comments.index(props.project.public_id).url, {
            headers: { Accept: 'application/json' },
            credentials: 'same-origin',
        }),
        fetch(projectsRoutes.suggestions.index(props.project.public_id).url, {
            headers: { Accept: 'application/json' },
            credentials: 'same-origin',
        }),
        fetch(projectsRoutes.ai.index(props.project.public_id).url, {
            headers: { Accept: 'application/json' },
            credentials: 'same-origin',
        }),
    ]);

    if (commentsRes.ok) {
        const cData = (await commentsRes.json()) as {
            threads: CommentThreadItem[];
        };
        reviewThreads.value = cData.threads;
    }
    if (suggestionsRes.ok) {
        const sData = (await suggestionsRes.json()) as {
            suggestions: SuggestionItem[];
        };
        reviewSuggestions.value = sData.suggestions;
    }
    if (aiRes.ok) {
        const aData = (await aiRes.json()) as {
            credentials: AiCredentialSummary[];
            actions: AiActionItem[];
        };
        aiCredentials.value = aData.credentials;
        aiActions.value = aData.actions;
    }
}

async function handleCreateThread(body: string): Promise<void> {
    if (!currentFile.value) {
        return;
    }

    const res = await fetch(
        projectsRoutes.comments.store(props.project.public_id).url,
        {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-XSRF-TOKEN': getCsrfToken(),
            },
            body: JSON.stringify({
                file_id: currentFile.value.public_id,
                start_line: cursorPos.value.lineNumber,
                end_line: cursorPos.value.lineNumber,
                body,
            }),
        },
    );

    if (res.ok) {
        await loadCollaborationData();
    }
}

async function handleResolveThread(threadId: string): Promise<void> {
    const res = await fetch(
        projectsRoutes.comments.resolve({
            project: props.project.public_id,
            thread: threadId,
        }).url,
        {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                Accept: 'application/json',
                'X-XSRF-TOKEN': getCsrfToken(),
            },
        },
    );
    if (res.ok) {
        await loadCollaborationData();
    }
}

async function handleAcceptSuggestion(suggestionId: string): Promise<void> {
    const res = await fetch(
        projectsRoutes.suggestions.accept({
            project: props.project.public_id,
            suggestion: suggestionId,
        }).url,
        {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                Accept: 'application/json',
                'X-XSRF-TOKEN': getCsrfToken(),
            },
        },
    );

    if (res.ok) {
        await loadCollaborationData();
        if (currentFile.value) {
            const active = fileList.value.find(
                (f) => f.public_id === currentFile.value?.public_id,
            );
            if (active) {
                currentFile.value = null;
                await openFile(active);
            }
        }
    }
}

async function handleRejectSuggestion(suggestionId: string): Promise<void> {
    const res = await fetch(
        projectsRoutes.suggestions.reject({
            project: props.project.public_id,
            suggestion: suggestionId,
        }).url,
        {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                Accept: 'application/json',
                'X-XSRF-TOKEN': getCsrfToken(),
            },
        },
    );
    if (res.ok) {
        await loadCollaborationData();
    }
}

async function handleAskAi(payload: {
    credentialId: string;
    kind: 'chat' | 'compile_fix' | 'paper_review';
    prompt: string;
}): Promise<void> {
    isAiAsking.value = true;
    aiError.value = null;

    const res = await fetch(
        projectsRoutes.ai.ask(props.project.public_id).url,
        {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-XSRF-TOKEN': getCsrfToken(),
            },
            body: JSON.stringify({
                credential_id: payload.credentialId || null,
                file_id: currentFile.value?.public_id ?? null,
                kind: payload.kind,
                prompt: payload.prompt,
                context_excerpt:
                    currentFile.value?.content.slice(0, 6000) ?? null,
            }),
        },
    );

    isAiAsking.value = false;

    if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as {
            message?: string;
        };
        aiError.value = err.message ?? 'AI request failed.';
        return;
    }

    const action = (await res.json()) as AiActionItem;
    aiActions.value.unshift(action);
    await loadCollaborationData();
}

onMounted(() => {
    void refreshProjectIndex();
    void loadCollaborationData();
    void taskBoard.load();
    void annotationState.load();
    void research.load();
    void integrationState.load();
    void revisionState.loadList();
    presence.start();
});

onBeforeUnmount(() => {
    if (autosaveTimer) {
        clearTimeout(autosaveTimer);
    }
    if (compilePollTimer) {
        clearTimeout(compilePollTimer);
    }
    if (presenceTimer) {
        clearTimeout(presenceTimer);
    }
});
</script>

<template>
    <div
        class="flex h-screen w-screen flex-col overflow-hidden bg-slate-50 text-slate-900"
    >
        <Head :title="`${project.title} — Workspace`" />

        <!-- Top IDE Header -->
        <header
            class="flex h-11 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-3"
        >
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
                <h1
                    class="max-w-xs truncate text-sm font-semibold text-slate-900"
                >
                    {{ project.title }}
                </h1>
                <span
                    class="rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-600 capitalize"
                >
                    {{ project.role }}
                </span>
            </div>

            <div class="flex items-center gap-2">
                <PresenceStrip
                    :users="presenceUsers"
                    :current-file-id="currentFile?.public_id ?? null"
                    @jump="handlePresenceJump"
                />

                <label
                    v-if="project.can_compile"
                    class="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-600"
                    title="Switch the TeX engine for future builds"
                >
                    <span class="text-[10px] font-medium tracking-wide text-slate-400 uppercase">Engine</span>
                    <select
                        v-model="engine"
                        class="bg-transparent text-xs font-medium outline-none"
                        @change="commitEngine"
                    >
                        <option
                            v-for="engineOption in compilerEngines"
                            :key="engineOption"
                            :value="engineOption"
                        >
                            {{ engineOption }}
                        </option>
                    </select>
                </label>

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

                <Link
                    :href="projectsRoutes.tables.index(project.public_id).url"
                    class="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                    <Wrench class="size-3.5" />
                    <span>Table Designer</span>
                </Link>

                <Link
                    :href="projectsRoutes.figures.index(project.public_id).url"
                    class="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                    <Shapes class="size-3.5" />
                    <span>TikZ Editor</span>
                </Link>

                <Link
                    :href="projectsRoutes.equations.index(project.public_id).url"
                    class="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                    <Sigma class="size-3.5" />
                    <span>Equation Studio</span>
                </Link>

                <button
                    type="button"
                    class="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                    @click="showBottomDrawer = !showBottomDrawer"
                >
                    <Terminal class="size-3.5" />
                    <span>Logs</span>
                </button>

                <button
                    type="button"
                    class="inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition"
                    :class="
                        showRightRail
                            ? 'border-indigo-200 bg-indigo-50 text-indigo-700'
                            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    "
                    @click="showRightRail = !showRightRail"
                >
                    <MessageCircle class="size-3.5" />
                    <span>Chat &amp; AI</span>
                </button>

                <button
                    v-if="project.can_compile && isCompiling"
                    type="button"
                    class="inline-flex items-center gap-1.5 rounded-md border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-700 hover:bg-rose-100"
                    title="Cancel the running compilation"
                    @click="cancelBuild"
                >
                    <Ban class="size-3.5" />
                    <span>Cancel</span>
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
            <aside
                class="flex w-11 shrink-0 flex-col items-center gap-2 border-r border-slate-200 bg-slate-100/70 py-2"
            >
                <button
                    type="button"
                    class="rounded-lg p-2 transition"
                    :class="
                        isLeftSidebarOpen && leftSidebarTab === 'explorer'
                            ? 'bg-white text-indigo-600 shadow-xs'
                            : 'text-slate-500 hover:text-slate-900'
                    "
                    title="Explorer & Outline"
                    @click="toggleLeftSidebarTab('explorer')"
                >
                    <Files class="size-4" />
                </button>
                <button
                    type="button"
                    class="rounded-lg p-2 transition"
                    :class="
                        isLeftSidebarOpen && leftSidebarTab === 'symbols'
                            ? 'bg-white text-indigo-600 shadow-xs'
                            : 'text-slate-500 hover:text-slate-900'
                    "
                    title="Symbol Palette"
                    @click="toggleLeftSidebarTab('symbols')"
                >
                    <Sigma class="size-4" />
                </button>
                <button
                    type="button"
                    class="rounded-lg p-2 transition"
                    :class="
                        isLeftSidebarOpen && leftSidebarTab === 'bibliography'
                            ? 'bg-white text-indigo-600 shadow-xs'
                            : 'text-slate-500 hover:text-slate-900'
                    "
                    title="Bibliography Search"
                    @click="toggleLeftSidebarTab('bibliography')"
                >
                    <BookOpen class="size-4" />
                </button>
                <button
                    type="button"
                    class="rounded-lg p-2 transition"
                    :class="
                        isLeftSidebarOpen && leftSidebarTab === 'tools'
                            ? 'bg-white text-indigo-600 shadow-xs'
                            : 'text-slate-500 hover:text-slate-900'
                    "
                    title="Research Tools (Tables, TikZ, Math, Snippets)"
                    @click="toggleLeftSidebarTab('tools')"
                >
                    <Wrench class="size-4" />
                </button>
                <button
                    type="button"
                    class="rounded-lg p-2 transition"
                    :class="
                        isLeftSidebarOpen && leftSidebarTab === 'review'
                            ? 'bg-white text-indigo-600 shadow-xs'
                            : 'text-slate-500 hover:text-slate-900'
                    "
                    title="Comments & Track Changes"
                    @click="toggleLeftSidebarTab('review')"
                >
                    <MessageSquare class="size-4" />
                </button>
                <button
                    type="button"
                    class="rounded-lg p-2 transition"
                    :class="
                        isLeftSidebarOpen && leftSidebarTab === 'ai'
                            ? 'bg-white text-indigo-600 shadow-xs'
                            : 'text-slate-500 hover:text-slate-900'
                    "
                    title="AI Research Assistant"
                    @click="toggleLeftSidebarTab('ai')"
                >
                    <Sparkles class="size-4" />
                </button>
                <button
                    type="button"
                    class="rounded-lg p-2 transition"
                    :class="
                        isLeftSidebarOpen && leftSidebarTab === 'revisions'
                            ? 'bg-white text-indigo-600 shadow-xs'
                            : 'text-slate-500 hover:text-slate-900'
                    "
                    title="Revision History"
                    @click="toggleLeftSidebarTab('revisions')"
                >
                    <History class="size-4" />
                </button>
                <button
                    type="button"
                    class="rounded-lg p-2 transition"
                    :class="
                        isLeftSidebarOpen && leftSidebarTab === 'tasks'
                            ? 'bg-white text-indigo-600 shadow-xs'
                            : 'text-slate-500 hover:text-slate-900'
                    "
                    title="Project tasks & milestones"
                    @click="toggleLeftSidebarTab('tasks')"
                >
                    <ListChecks class="size-4" />
                </button>
                <button
                    type="button"
                    class="rounded-lg p-2 transition"
                    :class="
                        isLeftSidebarOpen && leftSidebarTab === 'integrations'
                            ? 'bg-white text-indigo-600 shadow-xs'
                            : 'text-slate-500 hover:text-slate-900'
                    "
                    title="Integrations"
                    @click="toggleLeftSidebarTab('integrations')"
                >
                    <Plug class="size-4" />
                </button>
            </aside>

            <!-- Left Explorer + Outline Panel -->
            <aside
                v-if="isLeftSidebarOpen"
                class="flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white"
            >
                <template v-if="leftSidebarTab === 'explorer'">
                    <div
                        class="flex items-center justify-between border-b border-slate-100 px-3 py-2"
                    >
                        <span
                            class="text-xs font-semibold tracking-wider text-slate-500 uppercase"
                            >Explorer</span
                        >
                        <div v-if="project.can_edit" class="flex items-center gap-0.5">
                            <button
                                type="button"
                                class="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                                title="New file"
                                @click="openCreatePrompt('file')"
                            >
                                <FilePlus class="size-3.5" />
                            </button>
                            <button
                                type="button"
                                class="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                                title="New folder"
                                @click="openCreatePrompt('folder')"
                            >
                                <FolderPlus class="size-3.5" />
                            </button>
                            <button
                                type="button"
                                class="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                                title="Upload file"
                                @click="triggerUploadToFolder()"
                            >
                                <Upload class="size-3.5" />
                            </button>
                            <input
                                ref="fileUploadInputRef"
                                type="file"
                                multiple
                                class="hidden"
                                @change="handleFileUploadChange"
                            />
                        </div>
                    </div>

                    <div class="border-b border-slate-100 p-2">
                        <div class="relative">
                            <Search
                                class="pointer-events-none absolute top-2 left-2.5 size-3.5 text-slate-400"
                            />
                            <input
                                v-model="fileSearch"
                                type="search"
                                placeholder="Search files..."
                                class="w-full rounded-md border border-slate-200 bg-slate-50 py-1 pr-2 pl-7 text-xs outline-none focus:border-indigo-500 focus:bg-white"
                            />
                        </div>
                        <form
                            v-if="showNewFileInput"
                            class="mt-2 flex gap-1"
                            @submit.prevent="createFile"
                        >
                            <input
                                v-model="newFileName"
                                type="text"
                                :placeholder="creationMode === 'folder' ? 'figures' : 'chapters/sec2.tex'"
                                class="min-w-0 flex-1 rounded border border-indigo-300 px-2 py-1 text-xs outline-none"
                            />
                            <button
                                type="submit"
                                class="rounded bg-indigo-600 px-2 py-1 text-xs font-medium text-white hover:bg-indigo-700"
                                :title="creationMode === 'folder' ? 'Create folder' : 'Create file'"
                            >
                                <Plus class="size-3.5" />
                            </button>
                        </form>
                        <div
                            v-if="uploadProgress"
                            class="mt-2 space-y-1 rounded-md border border-indigo-200 bg-indigo-50/70 p-2 text-[11px]"
                        >
                            <div class="flex items-center justify-between gap-2 text-indigo-900">
                                <span class="truncate font-medium">
                                    Uploading {{ uploadProgress.fileName }}
                                    <span v-if="uploadProgress.total > 1">
                                        ({{ uploadProgress.current }}/{{ uploadProgress.total }})
                                    </span>
                                </span>
                                <span class="shrink-0 tabular-nums">{{ uploadProgress.percent }}%</span>
                            </div>
                            <div class="h-1.5 w-full overflow-hidden rounded-full bg-indigo-200">
                                <div
                                    class="h-full bg-indigo-600 transition-all duration-150"
                                    :style="{ width: `${uploadProgress.percent}%` }"
                                />
                            </div>
                        </div>
                        <p v-if="uploadError" class="mt-2 text-[11px] text-rose-600">
                            {{ uploadError }}
                        </p>
                    </div>

                    <div class="flex flex-1 flex-col overflow-y-auto p-1.5">
                        <ContextMenu v-for="row in explorerTreeRows" :key="row.key">
                            <ContextMenuTrigger as-child>
                                <div
                                    class="group flex items-center justify-between rounded-md py-1.5 pr-2 text-xs transition"
                                    :style="{ paddingLeft: `${8 + row.depth * 14}px` }"
                                    :class="
                                        row.file && currentFile?.public_id === row.file.public_id
                                            ? 'bg-indigo-50 font-medium text-indigo-700'
                                            : 'text-slate-700 hover:bg-slate-100'
                                    "
                                >
                                    <button
                                        type="button"
                                        class="flex min-w-0 flex-1 items-center gap-1.5 text-left"
                                        @click="row.isDirectory ? toggleFolder(row.path) : (row.file && openFile(row.file))"
                                    >
                                        <template v-if="row.isDirectory">
                                            <ChevronDown
                                                v-if="row.isExpanded"
                                                class="size-3.5 shrink-0 text-slate-400"
                                            />
                                            <ChevronRight
                                                v-else
                                                class="size-3.5 shrink-0 text-slate-400"
                                            />
                                            <FolderOpen
                                                v-if="row.isExpanded"
                                                class="size-3.5 shrink-0 text-amber-500"
                                            />
                                            <Folder
                                                v-else
                                                class="size-3.5 shrink-0 text-amber-500"
                                            />
                                        </template>
                                        <FileCode
                                            v-else
                                            class="ml-5 size-3.5 shrink-0 text-slate-400"
                                        />
                                        <span class="truncate">{{ row.name }}</span>
                                    </button>
                                    <button
                                        v-if="
                                            project.can_edit &&
                                            row.file &&
                                            row.file.path !== project.root_file_path
                                        "
                                        type="button"
                                        class="hidden rounded p-0.5 text-slate-400 group-hover:block hover:text-rose-600"
                                        :title="row.isDirectory ? 'Delete folder' : 'Delete file'"
                                        @click="fileToDelete = row.file"
                                    >
                                        <Trash2 class="size-3" />
                                    </button>
                                </div>
                            </ContextMenuTrigger>
                            <ContextMenuContent v-if="project.can_edit" class="w-48">
                                <ContextMenuItem
                                    @select="
                                        openCreatePrompt(
                                            'file',
                                            row.isDirectory ? row.path : parentDirOf(row.path),
                                        )
                                    "
                                >
                                    <FilePlus class="mr-2 size-3.5" />
                                    New file
                                </ContextMenuItem>
                                <ContextMenuItem
                                    @select="
                                        openCreatePrompt(
                                            'folder',
                                            row.isDirectory ? row.path : parentDirOf(row.path),
                                        )
                                    "
                                >
                                    <FolderPlus class="mr-2 size-3.5" />
                                    New folder
                                </ContextMenuItem>
                                <ContextMenuItem
                                    @select="
                                        triggerUploadToFolder(
                                            row.isDirectory ? row.path : parentDirOf(row.path),
                                        )
                                    "
                                >
                                    <Upload class="mr-2 size-3.5" />
                                    Upload any file
                                </ContextMenuItem>
                                <template v-if="row.file && row.file.path !== project.root_file_path">
                                    <ContextMenuSeparator />
                                    <ContextMenuItem
                                        class="text-rose-600 focus:text-rose-600"
                                        @select="fileToDelete = row.file"
                                    >
                                        <Trash2 class="mr-2 size-3.5" />
                                        {{ row.isDirectory ? 'Delete folder' : 'Delete file' }}
                                    </ContextMenuItem>
                                </template>
                            </ContextMenuContent>
                        </ContextMenu>

                        <ContextMenu>
                            <ContextMenuTrigger as-child>
                                <div class="min-h-12 flex-1" />
                            </ContextMenuTrigger>
                            <ContextMenuContent v-if="project.can_edit" class="w-48">
                                <ContextMenuItem @select="openCreatePrompt('file')">
                                    <FilePlus class="mr-2 size-3.5" />
                                    New file
                                </ContextMenuItem>
                                <ContextMenuItem @select="openCreatePrompt('folder')">
                                    <FolderPlus class="mr-2 size-3.5" />
                                    New folder
                                </ContextMenuItem>
                                <ContextMenuItem @select="triggerUploadToFolder()">
                                    <Upload class="mr-2 size-3.5" />
                                    Upload any file
                                </ContextMenuItem>
                            </ContextMenuContent>
                        </ContextMenu>
                    </div>

                    <!-- Document Outline -->
                    <div class="flex h-48 flex-col border-t border-slate-200">
                        <div
                            class="flex items-center gap-1.5 border-b border-slate-100 px-3 py-1.5"
                        >
                            <ListTree class="size-3.5 text-slate-400" />
                            <span
                                class="text-xs font-semibold tracking-wider text-slate-500 uppercase"
                                >Outline</span
                            >
                        </div>
                        <div class="flex-1 overflow-y-auto p-2">
                            <p
                                v-if="outlineHeadings.length === 0"
                                class="text-xs text-slate-400"
                            >
                                No section headings in current file.
                            </p>
                            <button
                                v-for="(h, idx) in outlineHeadings"
                                :key="idx"
                                type="button"
                                class="block w-full truncate rounded px-2 py-1 text-left text-xs text-slate-700 hover:bg-slate-100"
                                :style="{
                                    paddingLeft: `${8 + h.level * 10}px`,
                                }"
                                @click="jumpToLine(h.line)"
                            >
                                {{ h.title }}
                            </button>
                        </div>
                    </div>
                </template>

                <!-- Symbol Palette -->
                <SymbolPalette
                    v-else-if="leftSidebarTab === 'symbols'"
                    @insert="insertSnippet"
                    @open-lab="showEquationLab = true"
                />

                <!-- Bibliography Search -->
                <BibliographyPanel
                    v-else-if="leftSidebarTab === 'bibliography'"
                    :entries="bibEntries"
                    :can-edit="project.can_edit"
                    :lookup-url="projectsRoutes.bibliography.lookup(project.public_id).url"
                    :store-url="projectsRoutes.bibliography.store(project.public_id).url"
                    :import-url="projectsRoutes.bibliography.import(project.public_id).url"
                    :export-url="projectsRoutes.bibliography.export(project.public_id).url"
                    :get-csrf-token="getCsrfToken"
                    @insert-cite="insertSnippet"
                    @refresh="refreshProjectIndex"
                />

                <!-- Research Tools -->
                <ResearchToolsPanel
                    v-else-if="leftSidebarTab === 'tools'"
                    :assets="researchAssets"
                    :sources="researchSources"
                    :ocr-jobs="ocrJobs"
                    :conversions="conversions"
                    :can-edit="project.can_edit"
                    @insert="insertSnippet"
                    @create-asset="createAsset"
                    @delete-asset="deleteAsset"
                    @insert-citation="insertSnippet"
                    @create-ocr="createOcrJob"
                    @delete-ocr="deleteOcrJob"
                    @create-conversion="createConversion"
                    @delete-conversion="deleteConversion"
                />

                <!-- Review & Track Changes -->
                <ReviewPanel
                    v-else-if="leftSidebarTab === 'review'"
                    :threads="reviewThreads"
                    :suggestions="reviewSuggestions"
                    :annotations="annotations"
                    :can-comment="project.role !== 'viewer'"
                    :can-edit="project.can_edit"
                    @create-thread="handleCreateThread"
                    @resolve-thread="handleResolveThread"
                    @accept-suggestion="handleAcceptSuggestion"
                    @reject-suggestion="handleRejectSuggestion"
                    @create-annotation="handleCreateAnnotation"
                    @resolve-annotation="handleResolveAnnotation"
                    @remove-annotation="removeAnnotation"
                    @jump-to-line="jumpToLine"
                />

                <!-- AI Research Assistant -->
                <AiAssistantPanel
                    v-else-if="leftSidebarTab === 'ai'"
                    :credentials="aiCredentials"
                    :actions="aiActions"
                    :is-asking="isAiAsking"
                    :error-message="aiError"
                    @ask="handleAskAi"
                    @open-review="openReviewPanel"
                />

                <!-- Project tasks & milestones -->
                <TaskBoardPanel
                    v-else-if="leftSidebarTab === 'tasks'"
                    :tasks="projectTasks"
                    :milestones="projectMilestones"
                    :can-edit="project.can_edit"
                    :is-loading="tasksLoading"
                    :error="tasksError"
                    @create-task="(title, priority) => createTask({ title, priority })"
                    @update-task="(taskId, status) => updateTask(taskId, { status })"
                    @delete-task="deleteTask"
                    @create-milestone="createMilestone"
                />

                <!-- Integrations -->
                <IntegrationsPanel
                    v-else-if="leftSidebarTab === 'integrations'"
                    :integrations="integrations"
                    :can-edit="project.can_edit"
                    @connect="connectIntegration"
                    @set-status="setIntegrationStatus"
                    @remove="removeIntegration"
                />

                <!-- Revisions Sidebar -->
                <template v-else-if="leftSidebarTab === 'revisions'">
                    <div class="border-b border-slate-100 px-3 py-2">
                        <span
                            class="text-xs font-semibold tracking-wider text-slate-500 uppercase"
                            >Revisions</span
                        >
                    </div>
                    <div class="flex-1 space-y-2 overflow-y-auto p-2">
                        <p
                            v-if="revisionList.length === 0"
                            class="py-4 text-center text-xs text-slate-400"
                        >
                            No revisions yet.
                        </p>

                        <div
                            v-for="rev in revisionList"
                            :key="rev.public_id"
                            class="rounded-lg border border-slate-200 bg-slate-50/70 p-2.5 text-xs"
                            :class="
                                activeRevisionId === rev.public_id
                                    ? 'border-indigo-300 ring-1 ring-indigo-200'
                                    : ''
                            "
                        >
                            <button
                                type="button"
                                class="w-full text-left"
                                @click="selectRevision(rev.public_id)"
                            >
                                <p class="font-medium text-slate-800">
                                    {{ rev.message || 'Snapshot' }}
                                </p>
                                <p
                                    class="mt-1 font-mono text-[10px] text-slate-500"
                                >
                                    {{ rev.revision_hash.slice(0, 12) }} ·
                                    {{ rev.creator_name }}
                                </p>
                                <p class="mt-0.5 text-[10px] text-slate-400">
                                    {{ rev.created_at }}
                                </p>
                            </button>

                            <div
                                v-if="activeRevisionId === rev.public_id"
                                class="mt-2 border-t border-slate-200 pt-2"
                            >
                                <p
                                    v-if="isLoadingDiff"
                                    class="text-[11px] text-slate-500"
                                >
                                    Comparing with current source…
                                </p>

                                <template v-else-if="revisionDiff">
                                    <div class="flex gap-1 text-[10px] font-medium">
                                        <span class="rounded bg-emerald-50 px-1.5 py-0.5 text-emerald-700">
                                            +{{ revisionDiff.counts.added }}
                                        </span>
                                        <span class="rounded bg-rose-50 px-1.5 py-0.5 text-rose-700">
                                            −{{ revisionDiff.counts.removed }}
                                        </span>
                                        <span class="rounded bg-amber-50 px-1.5 py-0.5 text-amber-700">
                                            ~{{ revisionDiff.counts.modified }}
                                        </span>
                                    </div>

                                    <p
                                        v-if="revisionDiff.files.length === 0"
                                        class="mt-1.5 text-[11px] text-slate-500"
                                    >
                                        No differences against current source.
                                    </p>

                                    <div
                                        v-for="fileDiff in revisionDiff.files"
                                        :key="fileDiff.path"
                                        class="mt-2"
                                    >
                                        <p class="font-mono text-[10px] font-medium text-slate-600">
                                            {{ fileDiff.status }} · {{ fileDiff.path }}
                                        </p>
                                        <template v-if="fileDiff.text_available">
                                            <p class="mt-1 text-[9px] font-semibold tracking-wide text-rose-600 uppercase">
                                                Snapshot
                                            </p>
                                            <pre class="max-h-20 overflow-auto rounded bg-rose-950/90 p-1.5 font-mono text-[10px] whitespace-pre-wrap text-rose-50">{{ fileDiff.before ?? '(empty)' }}</pre>
                                            <p class="mt-1 text-[9px] font-semibold tracking-wide text-emerald-600 uppercase">
                                                Current
                                            </p>
                                            <pre class="max-h-20 overflow-auto rounded bg-slate-900 p-1.5 font-mono text-[10px] whitespace-pre-wrap text-emerald-50">{{ fileDiff.after ?? '(deleted)' }}</pre>
                                        </template>
                                    </div>

                                    <button
                                        v-if="project.can_edit"
                                        type="button"
                                        class="mt-2 w-full rounded bg-amber-600 px-2 py-1 text-[11px] font-semibold text-white hover:bg-amber-700 disabled:opacity-50"
                                        :disabled="isRestoring"
                                        @click="restoreTargetId = rev.public_id"
                                    >
                                        {{ isRestoring ? 'Restoring…' : 'Restore this snapshot' }}
                                    </button>
                                </template>

                                <p
                                    v-else-if="revisionError"
                                    class="text-[11px] text-rose-600"
                                >
                                    {{ revisionError }}
                                </p>
                            </div>
                        </div>
                    </div>
                </template>
            </aside>

            <!-- Center Monaco Editor Column -->
            <main
                class="flex min-w-0 flex-1 flex-col border-r border-slate-200 bg-white"
            >
                <!-- Tabs + Formatting Toolbar -->
                <div
                    class="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-2"
                >
                    <div class="flex items-center overflow-x-auto">
                        <div
                            class="mr-2 flex items-center rounded-md border border-slate-200 bg-slate-100 p-0.5 text-[11px]"
                        >
                            <button
                                type="button"
                                class="rounded px-2 py-0.5 font-medium transition"
                                :class="
                                    editorMode === 'code'
                                        ? 'bg-white text-slate-900 shadow-2xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                "
                                @click="editorMode = 'code'"
                            >
                                Code
                            </button>
                            <button
                                type="button"
                                class="rounded px-2 py-0.5 font-medium transition"
                                :class="
                                    editorMode === 'visual'
                                        ? 'bg-white text-slate-900 shadow-2xs'
                                        : 'text-slate-600 hover:text-slate-900'
                                "
                                @click="editorMode = 'visual'"
                            >
                                Visual
                            </button>
                        </div>
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

                    <div
                        v-if="project.can_edit"
                        class="flex items-center gap-1 py-1"
                    >
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
                            class="inline-flex items-center gap-1 rounded px-1.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-200"
                            title="LaTeX Equation Laboratory"
                            @click="showEquationLab = true"
                        >
                            <Sigma class="size-3.5 text-emerald-600" />
                            <span>Equation Lab</span>
                        </button>
                        <button
                            v-if="canSyncTex"
                            type="button"
                            class="rounded p-1 text-slate-600 hover:bg-slate-200"
                            title="SyncTeX: jump to this source position in the PDF"
                            @click="forwardSynctex"
                        >
                            <Crosshair class="size-3.5" />
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

                <!-- Monaco / Visual Editor Surface -->
                <div class="min-h-0 flex-1">
                    <template v-if="currentFile">
                        <MonacoEditor
                            v-if="editorMode === 'code'"
                            ref="editorRef"
                            :model-value="currentFile.content"
                            :language="currentLanguage"
                            :read-only="!project.can_edit"
                            :remote-cursors="presenceUsers"
                            :current-file-id="currentFile.public_id"
                            :current-user-id="currentUserId"
                            @update:model-value="handleEditorInput"
                            @cursor-change="handleCursorChange"
                            @synctex-jump="forwardSynctex"
                            @save="saveCurrentFile"
                        />
                        <VisualLatexEditor
                            v-else
                            :model-value="currentFile.content"
                            :can-edit="project.can_edit"
                            @update:model-value="handleEditorInput"
                            @insert-snippet="insertSnippet"
                        />
                    </template>
                    <div
                        v-else
                        class="flex h-full items-center justify-center text-sm text-slate-400"
                    >
                        Select a file from the explorer to begin editing.
                    </div>
                </div>

                <!-- Bottom Logs & Diagnostics Drawer -->
                <div
                    v-if="showBottomDrawer"
                    class="flex h-48 shrink-0 flex-col border-t border-slate-200 bg-slate-50"
                >
                    <div
                        class="flex items-center justify-between border-b border-slate-200 bg-white px-3 py-1.5 text-xs"
                    >
                        <div
                            class="flex items-center gap-2 font-semibold text-slate-700"
                        >
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
                    <div
                        class="flex-1 overflow-y-auto p-3 font-mono text-xs text-slate-700"
                    >
                        <p
                            v-if="!latestCompilationState"
                            class="text-slate-500"
                        >
                            No compilation runs recorded for this project yet.
                            Click Compile to run an isolated build.
                        </p>
                        <div v-else class="space-y-2">
                            <div class="flex items-center justify-between">
                                <p>
                                    Build
                                    <span class="font-semibold">{{
                                        latestCompilationState.public_id.slice(
                                            0,
                                            8,
                                        )
                                    }}</span>
                                    · Status:
                                    <strong class="uppercase">{{
                                        latestCompilationState.status
                                    }}</strong>
                                    <span
                                        v-if="
                                            latestCompilationState.duration_ms
                                        "
                                    >
                                        ({{
                                            latestCompilationState.duration_ms
                                        }}
                                        ms)</span
                                    >
                                </p>
                                <a
                                    :href="
                                        compilationsRoutes.artifacts.show({
                                            compilation:
                                                latestCompilationState.public_id,
                                            type: 'log',
                                        }).url
                                    "
                                    target="_blank"
                                    class="text-indigo-600 hover:underline"
                                >
                                    Raw Log
                                </a>
                            </div>
                            <p
                                v-if="latestCompilationState.error_summary"
                                class="rounded bg-rose-50 p-2 text-rose-700"
                            >
                                {{ latestCompilationState.error_summary }}
                            </p>
                            <button
                                v-for="(
                                    diag, i
                                ) in latestCompilationState.diagnostics"
                                :key="i"
                                type="button"
                                class="block w-full rounded border border-slate-200 bg-white p-2 text-left transition hover:border-indigo-300"
                                @click="
                                    diag.line
                                        ? jumpToLine(diag.line)
                                        : undefined
                                "
                            >
                                <span
                                    class="font-semibold uppercase"
                                    :class="
                                        diag.severity === 'error'
                                            ? 'text-rose-600'
                                            : 'text-amber-600'
                                    "
                                >
                                    {{ diag.severity }}
                                </span>
                                <span
                                    v-if="diag.file_path || diag.line"
                                    class="text-slate-500"
                                >
                                    · {{ diag.file_path ?? 'source' }}:{{
                                        diag.line ?? '?'
                                    }}
                                </span>
                                — {{ diag.message }}
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            <!-- Right PDF & Build Preview Column -->
            <section
                class="hidden min-w-0 flex-1 flex-col border-r border-slate-200 bg-slate-100 lg:flex"
            >
                <div
                    class="flex items-center gap-1 border-b border-slate-200 bg-white px-3 py-1.5 text-xs"
                >
                    <button
                        type="button"
                        class="rounded-md px-2.5 py-1 font-medium transition"
                        :class="
                            previewTab === 'pdf'
                                ? 'bg-indigo-50 text-indigo-700'
                                : 'text-slate-600 hover:bg-slate-100'
                        "
                        @click="previewTab = 'pdf'"
                    >
                        PDF
                    </button>
                    <button
                        type="button"
                        class="rounded-md px-2.5 py-1 font-medium transition"
                        :class="
                            previewTab === 'log'
                                ? 'bg-indigo-50 text-indigo-700'
                                : 'text-slate-600 hover:bg-slate-100'
                        "
                        @click="openLogTab()"
                    >
                        Log
                    </button>
                    <button
                        type="button"
                        class="flex items-center gap-1 rounded-md px-2.5 py-1 font-medium transition"
                        :class="
                            previewTab === 'warnings'
                                ? 'bg-indigo-50 text-indigo-700'
                                : 'text-slate-600 hover:bg-slate-100'
                        "
                        @click="previewTab = 'warnings'"
                    >
                        Warnings
                        <span
                            v-if="warningDiagnostics.length > 0"
                            class="rounded-full bg-amber-100 px-1.5 text-[10px] font-semibold text-amber-800"
                        >
                            {{ warningDiagnostics.length }}
                        </span>
                    </button>
                    <button
                        type="button"
                        class="rounded-md px-2.5 py-1 font-medium transition"
                        :class="
                            previewTab === 'build'
                                ? 'bg-indigo-50 text-indigo-700'
                                : 'text-slate-600 hover:bg-slate-100'
                        "
                        @click="previewTab = 'build'"
                    >
                        Build History
                    </button>

                    <a
                        v-if="latestCompilationState"
                        :href="
                            compilationsRoutes.artifacts.show({
                                compilation: latestCompilationState.public_id,
                                type: 'log',
                            }).url
                        "
                        target="_blank"
                        class="ml-auto text-[11px] font-medium text-indigo-600 hover:underline"
                    >
                        Raw log
                    </a>
                </div>

                <div v-if="previewTab === 'pdf'" class="min-h-0 flex-1">
                    <PdfViewer
                        ref="pdfViewerRef"
                        :pdf-url="pdfUrl"
                        :is-stale="isStalePdf"
                        :is-compiling="isCompiling"
                        :synctex-enabled="canSyncTex"
                        @inverse="handleInverseSynctex"
                    />
                </div>

                <div
                    v-else-if="previewTab === 'log'"
                    class="flex flex-1 flex-col overflow-hidden bg-slate-950"
                >
                    <div
                        class="flex items-center justify-between border-b border-slate-800 px-3 py-1.5 text-[11px] text-slate-300"
                    >
                        <span class="font-mono">
                            {{
                                latestCompilationState
                                    ? `build ${latestCompilationState.public_id.slice(0, 8)} · ${latestCompilationState.status}`
                                    : 'No build yet'
                            }}
                        </span>
                        <button
                            v-if="latestCompilationState"
                            type="button"
                            class="inline-flex items-center gap-1 rounded px-1.5 py-0.5 hover:bg-slate-800"
                            @click="openLogTab(latestCompilationState.public_id)"
                        >
                            <RefreshCw class="size-3" /> Refresh
                        </button>
                    </div>
                    <div class="flex-1 overflow-auto p-3 font-mono text-[11px] whitespace-pre-wrap text-slate-200">
                        <p v-if="isLoadingLog" class="text-slate-400">Loading build log…</p>
                        <pre v-else-if="logText" class="font-mono whitespace-pre-wrap">{{ logText }}</pre>
                        <p v-else class="text-slate-400">
                            {{ logError ?? 'No log artifact recorded for this build.' }}
                        </p>
                    </div>
                </div>

                <div
                    v-else-if="previewTab === 'warnings'"
                    class="flex-1 space-y-2 overflow-y-auto p-3 text-xs"
                >
                    <p
                        v-if="errorDiagnostics.length === 0 && warningDiagnostics.length === 0"
                        class="py-8 text-center text-slate-500"
                    >
                        No errors or warnings in the latest build.
                    </p>

                    <div v-if="errorDiagnostics.length > 0" class="space-y-1.5">
                        <p class="flex items-center gap-1 text-[11px] font-semibold tracking-wide text-rose-600 uppercase">
                            <AlertCircle class="size-3.5" /> Errors ({{ errorDiagnostics.length }})
                        </p>
                        <button
                            v-for="(diagnostic, index) in errorDiagnostics"
                            :key="`error-${index}`"
                            type="button"
                            class="block w-full rounded border border-rose-200 bg-rose-50/60 p-2 text-left hover:border-rose-300"
                            @click="diagnostic.line ? jumpToLine(diagnostic.line) : undefined"
                        >
                            <span class="font-mono text-[10px] text-rose-700">
                                {{ diagnostic.file_path ?? 'source' }}:{{ diagnostic.line ?? '?' }}
                            </span>
                            <span class="mt-0.5 block text-slate-700">{{ diagnostic.message }}</span>
                        </button>
                    </div>

                    <div v-if="warningDiagnostics.length > 0" class="space-y-1.5 pt-1">
                        <p class="flex items-center gap-1 text-[11px] font-semibold tracking-wide text-amber-600 uppercase">
                            <FileWarning class="size-3.5" /> Warnings ({{ warningDiagnostics.length }})
                        </p>
                        <button
                            v-for="(diagnostic, index) in warningDiagnostics"
                            :key="`warning-${index}`"
                            type="button"
                            class="block w-full rounded border border-amber-200 bg-amber-50/60 p-2 text-left hover:border-amber-300"
                            @click="diagnostic.line ? jumpToLine(diagnostic.line) : undefined"
                        >
                            <span class="font-mono text-[10px] text-amber-700">
                                {{ diagnostic.file_path ?? 'source' }}:{{ diagnostic.line ?? '?' }}
                            </span>
                            <span class="mt-0.5 block text-slate-700">{{ diagnostic.message }}</span>
                        </button>
                    </div>
                </div>

                <div
                    v-else
                    class="flex-1 space-y-2 overflow-y-auto p-4 text-xs"
                >
                    <p
                        v-if="
                            !props.buildHistory ||
                            props.buildHistory.length === 0
                        "
                        class="text-slate-500"
                    >
                        No builds recorded yet.
                    </p>
                    <div
                        v-for="item in props.buildHistory"
                        :key="item.public_id"
                        class="rounded-lg border border-slate-200 bg-white p-3"
                    >
                        <div class="flex items-start justify-between gap-2">
                            <div class="min-w-0">
                                <p class="font-mono font-semibold text-slate-800">
                                    {{ item.public_id.slice(0, 8) }} ·
                                    {{ item.compiler_engine }}
                                </p>
                                <p class="mt-0.5 text-[11px] text-slate-500">
                                    {{ item.created_at }}
                                    <span v-if="item.duration_ms"> · {{ item.duration_ms }} ms</span>
                                </p>
                                <div class="mt-1 flex flex-wrap items-center gap-1 text-[10px]">
                                    <span
                                        v-if="item.error_count > 0"
                                        class="rounded bg-rose-50 px-1.5 py-0.5 font-medium text-rose-700"
                                    >
                                        {{ item.error_count }} errors
                                    </span>
                                    <span
                                        v-if="item.warning_count > 0"
                                        class="rounded bg-amber-50 px-1.5 py-0.5 font-medium text-amber-700"
                                    >
                                        {{ item.warning_count }} warnings
                                    </span>
                                    <span
                                        v-if="item.has_pdf"
                                        class="rounded bg-emerald-50 px-1.5 py-0.5 font-medium text-emerald-700"
                                    >
                                        PDF
                                    </span>
                                    <span
                                        v-if="item.has_synctex"
                                        class="rounded bg-sky-50 px-1.5 py-0.5 font-medium text-sky-700"
                                    >
                                        SyncTeX
                                    </span>
                                    <span
                                        v-if="item.exit_code !== null"
                                        class="rounded bg-slate-100 px-1.5 py-0.5 text-slate-600"
                                    >
                                        exit {{ item.exit_code }}
                                    </span>
                                </div>
                                <p
                                    v-if="item.error_summary"
                                    class="mt-1 line-clamp-2 text-[11px] text-rose-700"
                                >
                                    {{ item.error_summary }}
                                </p>
                            </div>
                            <div class="flex shrink-0 flex-col items-end gap-1">
                                <span
                                    class="rounded-full px-2 py-0.5 text-[11px] font-medium capitalize"
                                    :class="
                                        item.status === 'published'
                                            ? 'bg-emerald-50 text-emerald-700'
                                            : item.status === 'cancelled'
                                              ? 'bg-slate-100 text-slate-600'
                                              : item.status === 'timed_out'
                                                ? 'bg-amber-50 text-amber-700'
                                                : item.status === 'queued' || item.status === 'compiling'
                                                  ? 'bg-sky-50 text-sky-700'
                                                  : 'bg-rose-50 text-rose-700'
                                    "
                                >
                                    {{ item.status }}
                                </span>
                                <div class="flex gap-1">
                                    <button
                                        v-if="item.has_log"
                                        type="button"
                                        class="rounded border border-slate-200 px-1.5 py-0.5 text-[10px] text-slate-600 hover:bg-slate-50"
                                        @click="openLogTab(item.public_id)"
                                    >
                                        Log
                                    </button>
                                    <button
                                        v-if="item.status !== 'queued' && item.status !== 'compiling'"
                                        type="button"
                                        class="rounded border border-slate-200 px-1.5 py-0.5 text-[10px] text-slate-600 hover:bg-slate-50 disabled:opacity-40"
                                        :disabled="isCompiling"
                                        @click="retryBuild(item.public_id)"
                                    >
                                        Retry
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Right Docked Collaboration, Chat & AI Rail -->
            <aside
                v-if="showRightRail"
                class="hidden w-80 shrink-0 flex-col bg-white xl:flex"
            >
                <div
                    class="grid grid-cols-4 border-b border-slate-200 bg-slate-50 text-[11px] font-medium"
                >
                    <button
                        type="button"
                        class="py-2 transition"
                        :class="
                            rightRailTab === 'chat'
                                ? 'border-b-2 border-indigo-600 bg-white text-indigo-700'
                                : 'text-slate-600 hover:text-slate-900'
                        "
                        @click="rightRailTab = 'chat'"
                    >
                        Chat
                    </button>
                    <button
                        type="button"
                        class="py-2 transition"
                        :class="
                            rightRailTab === 'ai'
                                ? 'border-b-2 border-indigo-600 bg-white text-indigo-700'
                                : 'text-slate-600 hover:text-slate-900'
                        "
                        @click="rightRailTab = 'ai'"
                    >
                        AI
                    </button>
                    <button
                        type="button"
                        class="py-2 transition"
                        :class="
                            rightRailTab === 'comments'
                                ? 'border-b-2 border-indigo-600 bg-white text-indigo-700'
                                : 'text-slate-600 hover:text-slate-900'
                        "
                        @click="rightRailTab = 'comments'"
                    >
                        Review
                    </button>
                    <button
                        type="button"
                        class="py-2 transition"
                        :class="
                            rightRailTab === 'tools'
                                ? 'border-b-2 border-indigo-600 bg-white text-indigo-700'
                                : 'text-slate-600 hover:text-slate-900'
                        "
                        @click="rightRailTab = 'tools'"
                    >
                        Tools
                    </button>
                </div>

                <div class="min-h-0 flex-1">
                    <CollaboratorChatPanel
                        v-if="rightRailTab === 'chat'"
                        :project-public-id="project.public_id"
                    />
                    <AiAssistantPanel
                        v-else-if="rightRailTab === 'ai'"
                        :credentials="aiCredentials"
                        :actions="aiActions"
                        :is-asking="isAiAsking"
                        :error-message="aiError"
                        @ask="handleAskAi"
                    />
                    <ReviewPanel
                        v-else-if="rightRailTab === 'comments'"
                        :threads="reviewThreads"
                        :suggestions="reviewSuggestions"
                        :annotations="annotations"
                        :can-comment="project.role !== 'viewer'"
                        :can-edit="project.can_edit"
                        @create-thread="handleCreateThread"
                        @resolve-thread="handleResolveThread"
                        @accept-suggestion="handleAcceptSuggestion"
                        @reject-suggestion="handleRejectSuggestion"
                        @create-annotation="handleCreateAnnotation"
                        @resolve-annotation="handleResolveAnnotation"
                        @remove-annotation="removeAnnotation"
                        @jump-to-line="jumpToLine"
                    />
                    <ResearchToolsPanel
                        v-else
                        :assets="researchAssets"
                        :sources="researchSources"
                        :ocr-jobs="ocrJobs"
                        :conversions="conversions"
                        :can-edit="project.can_edit"
                        @insert="insertSnippet"
                        @create-asset="createAsset"
                        @delete-asset="deleteAsset"
                        @insert-citation="insertSnippet"
                        @create-ocr="createOcrJob"
                        @delete-ocr="deleteOcrJob"
                        @create-conversion="createConversion"
                        @delete-conversion="deleteConversion"
                    />
                </div>
            </aside>
        </div>

        <!-- Bottom Status Bar -->
        <footer
            class="flex h-6 shrink-0 items-center justify-between border-t border-slate-200 bg-white px-3 text-[11px] text-slate-600"
        >
            <div class="flex items-center gap-4">
                <span class="font-mono">{{
                    currentFile?.path ?? 'No file'
                }}</span>
                <span class="flex items-center gap-1">
                    <Loader2
                        v-if="saveStatus === 'saving'"
                        class="size-3 animate-spin text-indigo-600"
                    />
                    <CheckCircle2
                        v-else-if="saveStatus === 'saved'"
                        class="size-3 text-emerald-600"
                    />
                    <AlertCircle v-else class="size-3 text-amber-600" />
                    <span class="capitalize">{{ saveStatus }}</span>
                </span>
            </div>

            <div class="flex items-center gap-4 tabular-nums">
                <span
                    >Ln {{ cursorPos.lineNumber }}, Col
                    {{ cursorPos.column }}</span
                >
                <span>UTF-8</span>
                <span class="flex items-center gap-1">
                    <ArrowLeftRight class="size-3 text-emerald-600" />
                    <span>SyncTeX Ready</span>
                </span>
                <span class="font-mono">{{ project.compiler_engine }}</span>
            </div>
        </footer>

        <AlertDialog
            :open="fileToDelete !== null"
            @update:open="
                (open) => {
                    if (!open) fileToDelete = null;
                }
            "
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete project file</AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete
                        <strong class="font-mono">{{
                            fileToDelete?.path
                        }}</strong
                        >? This action cannot be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        class="bg-destructive text-white hover:bg-destructive/90"
                        @click="
                            () => {
                                const target = fileToDelete;
                                fileToDelete = null;
                                if (target) {
                                    void deleteFile(target);
                                }
                            }
                        "
                    >
                        Delete file
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        <AlertDialog
            :open="restoreTargetId !== null"
            @update:open="
                (open) => {
                    if (!open) restoreTargetId = null;
                }
            "
        >
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Restore snapshot</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will replace the current project files with the
                        selected snapshot and save a new restore revision so you
                        can roll back again if needed.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        class="bg-amber-600 text-white hover:bg-amber-700"
                        @click="restoreRevision"
                    >
                        {{ isRestoring ? 'Restoring…' : 'Restore snapshot' }}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        <EquationLaboratoryDialog
            v-model:open="showEquationLab"
            :can-edit="project.can_edit"
            @insert="insertSnippet"
            @save-asset="
                (payload) =>
                    createAsset({
                        kind: 'equation',
                        title: payload.title,
                        latex: payload.latex,
                    })
            "
        />

        <!-- File Save Conflict Resolution Modal -->
        <div
            v-if="conflictState"
            class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
        >
            <div class="w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
                <h2 class="text-base font-semibold text-slate-900">
                    Save conflict detected
                </h2>
                <p class="mt-1 text-sm text-slate-600">
                    This file was updated on the server
                    <span v-if="conflictState.updated_by_name">by {{ conflictState.updated_by_name }}</span>
                    (revision v{{ conflictState.server_version }}). Choose how to resolve your unsaved changes:
                </p>

                <div class="mt-5 flex flex-wrap justify-end gap-2">
                    <button
                        type="button"
                        class="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        @click="reloadServerConflictVersion"
                    >
                        Reload server version
                    </button>
                    <button
                        type="button"
                        class="rounded-md bg-rose-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-rose-700"
                        @click="overwriteConflictWithLocal"
                    >
                        Overwrite with my changes
                    </button>
                </div>
            </div>
        </div>

        <Toaster />
    </div>
</template>
