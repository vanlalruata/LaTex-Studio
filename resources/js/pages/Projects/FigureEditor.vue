<script setup lang="ts">
import { Head, Link, router } from '@inertiajs/vue3';
import {
    ArrowLeft,
    ArrowUpRight,
    Circle,
    Crosshair,
    Diamond,
    Download,
    Eye,
    EyeOff,
    FileInput,
    Grid3x3,
    Hand,
    History,
    Layers,
    Lock,
    MousePointer2,
    Play,
    Plus,
    Redo2,
    RefreshCw,
    Save,
    Square,
    Trash2,
    Type,
    Undo2,
    Unlock,
    ZoomIn,
    ZoomOut,
} from '@lucide/vue';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { toast } from 'vue-sonner';
import MonacoEditor from '@/components/editor/MonacoEditor.vue';
import FigureCanvas from '@/components/figureEditor/FigureCanvas.vue';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Toaster } from '@/components/ui/sonner';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import projectsRoutes from '@/routes/projects';
import { roundCoord } from '@/services/figureEditor/coordinates';
import {
    cloneScene,
    createDefaultFigureScene,
    createFigureConnector,
    createFigureObject,
    generatePhase1TikzStub,
    normalizeFigureScene,
} from '@/services/figureEditor/sceneHistory';
import { generateTikzWithSourceMap } from '@/services/figureEditor/tikzGenerator';
import { parseTikzSourceToScene } from '@/services/figureEditor/tikzParser';
import type {
    ArrowTip,
    CanvasTool,
    ConnectorEndpoint,
    ConnectorRouting,
    EdgeLabelPosition,
    FigureConnector,
    FigureLayer,
    FigureMode,
    FigureObject,
    FigureRecord,
    FigureSceneDocument,
    NodeAnchor,
    StrokeDash,
    ViewportState,
} from '@/services/figureEditor/types';

interface FigureRevisionSummary {
    public_id: string;
    summary: string | null;
    mode: string;
    author: string;
    created_at: string | null;
}

interface FigureRenderSummary {
    public_id: string;
    engine: string;
    status: string;
    is_terminal: boolean;
    exit_code: number | null;
    duration_ms: number | null;
    error_summary: string | null;
    diagnostics: Array<{
        severity: string;
        file_path: string;
        line: number | null;
        message: string;
        raw_excerpt: string | null;
    }>;
    artifacts: string[];
    pdf_url: string | null;
    log_url: string | null;
    finished_at: string | null;
}

const props = defineProps<{
    project: {
        public_id: string;
        title: string;
        root_file_path: string;
        can_edit: boolean;
    };
    figures: FigureRecord[];
    activeFigure: FigureRecord | null;
    projectFiles?: Array<{ public_id: string; path: string }>;
    revisions?: FigureRevisionSummary[];
    lastRender?: FigureRenderSummary | null;
}>();

const figuresList = ref<FigureRecord[]>([...props.figures]);
const activePublicId = ref<string | null>(props.activeFigure?.public_id ?? null);
const revisionsList = ref<FigureRevisionSummary[]>([...(props.revisions ?? [])]);
const latestRender = ref<FigureRenderSummary | null>(props.lastRender ?? null);
const lastSuccessfulPdfUrl = ref<string | null>(props.lastRender?.pdf_url ?? null);
const isRendering = ref(false);
const activeBottomTab = ref('tikz');
const showInsertDialog = ref(false);
const insertFileId = ref<string>(props.projectFiles?.[0]?.public_id ?? '');
const insertMode = ref<'inline' | 'external'>('external');
const insertPlacement = ref('htbp');
const insertCaption = ref('');
const insertLabel = ref('');
const isInserting = ref(false);
let renderPollTimer: number | null = null;

const scene = ref<FigureSceneDocument>(
    props.activeFigure
        ? normalizeFigureScene(props.activeFigure.scene_json, props.activeFigure.name)
        : createDefaultFigureScene('Figure 1'),
);

const historyPast = ref<FigureSceneDocument[]>([]);
const historyFuture = ref<FigureSceneDocument[]>([]);

const selectedIds = ref<string[]>([]);
const activeLayerId = ref<string>(scene.value.layers[0]?.id ?? 'layer_main');
const activeTool = ref<CanvasTool>('select');
const layoutMode = ref<'visual' | 'split' | 'code'>('split');
const figureMode = ref<FigureMode>(props.activeFigure?.mode ?? 'visual_native');
const isDirty = ref(false);
const isSaving = ref(false);
const showCreateDialog = ref(false);
const newFigureName = ref('New TikZ Figure');
const showDeleteDialog = ref(false);
const showResetSourceDialog = ref(false);

const monacoRef = ref<InstanceType<typeof MonacoEditor> | null>(null);
const sourceDirty = ref(false);
const parseWarnings = ref<string[]>([]);

const generatedResult = computed(() => generateTikzWithSourceMap(scene.value));
const generatedTikz = computed(() => generatedResult.value.code);
const sourceMap = computed(() => generatedResult.value.sourceMap);
const requiredPackages = computed(() => generatedResult.value.requiredPackages);
const requiredLibraries = computed(() => generatedResult.value.requiredLibraries);

const editableSource = ref<string>(
    props.activeFigure?.tikz_source && props.activeFigure.mode === 'source_only'
        ? props.activeFigure.tikz_source
        : generatedTikz.value,
);

watch(generatedTikz, (nextCode) => {
    if (!sourceDirty.value && figureMode.value !== 'source_only') {
        editableSource.value = nextCode;
    }
});

const viewport = ref<ViewportState>({
    zoom: 1,
    panX: 360,
    panY: 220,
});

const selectedObject = computed<FigureObject | null>(() => {
    if (selectedIds.value.length !== 1) {
        return null;
    }
    return scene.value.objects.find((obj) => obj.id === selectedIds.value[0]) ?? null;
});

const selectedConnector = computed<FigureConnector | null>(() => {
    if (selectedIds.value.length !== 1) {
        return null;
    }
    return scene.value.connectors.find((c) => c.id === selectedIds.value[0]) ?? null;
});

function handleSourceChange(nextVal: string): void {
    editableSource.value = nextVal;
    sourceDirty.value = true;
    isDirty.value = true;
}

function syncSourceToVisual(): void {
    const result = parseTikzSourceToScene(editableSource.value, scene.value);
    parseWarnings.value = result.warnings;

    if (!result.ok) {
        figureMode.value = 'source_only';
        toast.warning('Switched to Source-Only mode: manual TikZ could not be parsed visually.');
        return;
    }

    commitSceneMutation((draft) => {
        draft.objects = result.scene.objects;
        draft.connectors = result.scene.connectors;
        draft.protectedBlocks = result.scene.protectedBlocks;
    });
    figureMode.value = result.mode;
    sourceDirty.value = false;
    selectedIds.value = [];

    if (result.mode === 'hybrid') {
        toast.info(`Synced in Hybrid mode (${result.unsupportedCount} protected block(s) preserved).`);
    } else {
        toast.success('Synced TikZ source to visual canvas.');
    }
}

function resetSourceFromVisual(): void {
    editableSource.value = generatedTikz.value;
    sourceDirty.value = false;
    parseWarnings.value = [];
    figureMode.value = scene.value.protectedBlocks.length > 0 ? 'hybrid' : 'visual_native';
    showResetSourceDialog.value = false;
    toast.success('Restored TikZ source from visual scene.');
}

function handleCanvasSelectionChange(ids: string[]): void {
    selectedIds.value = ids;
    if (ids.length === 1 && !sourceDirty.value && layoutMode.value !== 'visual') {
        const entry = sourceMap.value.find((m) => m.itemId === ids[0]);
        if (entry) {
            monacoRef.value?.revealLine(entry.startLine);
        }
    }
}

function handleMonacoCursorChange(position: { lineNumber: number; column: number }): void {
    if (sourceDirty.value || figureMode.value === 'source_only') {
        return;
    }
    const match = sourceMap.value.find(
        (m) => position.lineNumber >= m.startLine && position.lineNumber <= m.endLine,
    );
    if (match && !selectedIds.value.includes(match.itemId)) {
        selectedIds.value = [match.itemId];
    }
}

const canUndo = computed(() => historyPast.value.length > 0);
const canRedo = computed(() => historyFuture.value.length > 0);

function getCsrfToken(): string {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
}

function commitSceneMutation(mutator: (draft: FigureSceneDocument) => void): void {
    historyPast.value = [...historyPast.value.slice(-49), cloneScene(scene.value)];
    historyFuture.value = [];

    const draft = cloneScene(scene.value);
    mutator(draft);
    scene.value = draft;
    isDirty.value = true;
}

function undo(): void {
    if (!canUndo.value) {
        return;
    }
    const previous = historyPast.value[historyPast.value.length - 1];
    historyPast.value = historyPast.value.slice(0, -1);
    historyFuture.value = [cloneScene(scene.value), ...historyFuture.value];
    scene.value = previous;
    selectedIds.value = [];
    isDirty.value = true;
}

function redo(): void {
    if (!canRedo.value) {
        return;
    }
    const next = historyFuture.value[0];
    historyFuture.value = historyFuture.value.slice(1);
    historyPast.value = [...historyPast.value, cloneScene(scene.value)];
    scene.value = next;
    selectedIds.value = [];
    isDirty.value = true;
}

function handlePlaceObject(
    shape: Exclude<CanvasTool, 'select' | 'pan' | 'connector'>,
    x: number,
    y: number,
): void {
    let createdId = '';
    commitSceneMutation((draft) => {
        const nextIndex = draft.objects.length + 1;
        const maxZ = draft.objects.reduce((acc, o) => Math.max(acc, o.zIndex), 0);
        const targetLayer =
            draft.layers.find((l) => l.id === activeLayerId.value)?.id ??
            draft.layers[0]?.id ??
            'layer_main';
        const obj = createFigureObject(shape, targetLayer, maxZ + 1, x, y, nextIndex);
        createdId = obj.id;
        draft.objects.push(obj);
    });
    selectedIds.value = createdId ? [createdId] : [];
    activeTool.value = 'select';
}

function handleCreateConnector(
    from: ConnectorEndpoint,
    to: ConnectorEndpoint,
): void {
    let createdId = '';
    commitSceneMutation((draft) => {
        const maxZ = draft.connectors.reduce((acc, c) => Math.max(acc, c.zIndex), 0);
        const targetLayer =
            draft.layers.find((l) => l.id === activeLayerId.value)?.id ??
            draft.layers[0]?.id ??
            'layer_main';
        const conn = createFigureConnector(targetLayer, maxZ + 1, from, to);
        createdId = conn.id;
        draft.connectors.push(conn);
    });
    selectedIds.value = createdId ? [createdId] : [];
    activeTool.value = 'select';
}

function handleCommitObjectPatch(id: string, patch: Partial<FigureObject>): void {
    commitSceneMutation((draft) => {
        const idx = draft.objects.findIndex((o) => o.id === id);
        if (idx === -1) {
            return;
        }
        draft.objects[idx] = {
            ...draft.objects[idx],
            ...patch,
            style: patch.style
                ? { ...draft.objects[idx].style, ...patch.style }
                : draft.objects[idx].style,
        };
    });
}

function handleCommitConnectorPatch(id: string, patch: Partial<FigureConnector>): void {
    commitSceneMutation((draft) => {
        const idx = draft.connectors.findIndex((c) => c.id === id);
        if (idx === -1) {
            return;
        }
        draft.connectors[idx] = {
            ...draft.connectors[idx],
            ...patch,
            style: patch.style
                ? { ...draft.connectors[idx].style, ...patch.style }
                : draft.connectors[idx].style,
            from: patch.from
                ? { ...draft.connectors[idx].from, ...patch.from }
                : draft.connectors[idx].from,
            to: patch.to
                ? { ...draft.connectors[idx].to, ...patch.to }
                : draft.connectors[idx].to,
        };
    });
}

function handleDeleteSelected(): void {
    if (selectedIds.value.length === 0) {
        return;
    }
    const toDelete = new Set(selectedIds.value);
    commitSceneMutation((draft) => {
        draft.objects = draft.objects.filter((o) => !toDelete.has(o.id));
        draft.connectors = draft.connectors.filter(
            (c) =>
                !toDelete.has(c.id) &&
                (!c.from.objectId || !toDelete.has(c.from.objectId)) &&
                (!c.to.objectId || !toDelete.has(c.to.objectId)),
        );
    });
    selectedIds.value = [];
}

function handleNudgeSelected(dx: number, dy: number): void {
    if (selectedIds.value.length === 0 || !props.project.can_edit) {
        return;
    }
    const toMove = new Set(selectedIds.value);
    commitSceneMutation((draft) => {
        for (const obj of draft.objects) {
            if (toMove.has(obj.id) && !obj.locked) {
                obj.x = roundCoord(obj.x + dx);
                obj.y = roundCoord(obj.y + dy);
            }
        }
    });
}

function addLayer(): void {
    commitSceneMutation((draft) => {
        const order = draft.layers.length;
        const id = `layer_${Date.now().toString(36)}`;
        draft.layers.push({
            id,
            name: `Layer ${order + 1}`,
            visible: true,
            locked: false,
            order,
        });
        activeLayerId.value = id;
    });
}

function toggleLayerVisibility(layer: FigureLayer): void {
    commitSceneMutation((draft) => {
        const target = draft.layers.find((l) => l.id === layer.id);
        if (target) {
            target.visible = !target.visible;
        }
    });
}

function toggleLayerLock(layer: FigureLayer): void {
    commitSceneMutation((draft) => {
        const target = draft.layers.find((l) => l.id === layer.id);
        if (target) {
            target.locked = !target.locked;
        }
    });
}

function zoomBy(factor: number): void {
    viewport.value = {
        ...viewport.value,
        zoom: Math.min(4, Math.max(0.25, roundCoord(viewport.value.zoom * factor, 2))),
    };
}

function resetViewport(): void {
    viewport.value = { zoom: 1, panX: 360, panY: 220 };
}

async function saveFigure(): Promise<void> {
    if (!props.project.can_edit || isSaving.value) {
        return;
    }

    isSaving.value = true;
    try {
        const isUpdate = activePublicId.value !== null;
        const url = isUpdate
            ? projectsRoutes.figures.update({
                  project: props.project.public_id,
                  figure: activePublicId.value!,
              }).url
            : projectsRoutes.figures.store(props.project.public_id).url;

        const response = await fetch(url, {
            method: isUpdate ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-XSRF-TOKEN': getCsrfToken(),
            },
            body: JSON.stringify({
                name: scene.value.name,
                schema_version: 1,
                mode: figureMode.value,
                scene_json: scene.value,
                tikz_source: editableSource.value,
                required_packages_json: requiredPackages.value,
                required_libraries_json: requiredLibraries.value,
            }),
        });

        if (!response.ok) {
            throw new Error(`Save failed with HTTP ${response.status}`);
        }

        const data = (await response.json()) as {
            figure: FigureRecord;
            revisions?: FigureRevisionSummary[];
        };
        activePublicId.value = data.figure.public_id;
        if (data.revisions) {
            revisionsList.value = data.revisions;
        }
        const existingIdx = figuresList.value.findIndex(
            (f) => f.public_id === data.figure.public_id,
        );
        if (existingIdx >= 0) {
            figuresList.value[existingIdx] = data.figure;
        } else {
            figuresList.value.unshift(data.figure);
        }
        isDirty.value = false;
        toast.success('Figure saved');
    } catch (error) {
        toast.error(
            error instanceof Error ? error.message : 'Unable to save figure.',
        );
    } finally {
        isSaving.value = false;
    }
}

async function createFigure(): Promise<void> {
    if (!props.project.can_edit) {
        return;
    }
    const name = newFigureName.value.trim() || 'Untitled Figure';
    const freshScene = createDefaultFigureScene(name);

    try {
        const response = await fetch(
            projectsRoutes.figures.store(props.project.public_id).url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-XSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify({
                    name,
                    schema_version: 1,
                    mode: 'visual_native',
                    scene_json: freshScene,
                    tikz_source: generatePhase1TikzStub(freshScene),
                    required_packages_json: ['tikz'],
                    required_libraries_json: [],
                }),
            },
        );
        if (!response.ok) {
            throw new Error(`Create failed with HTTP ${response.status}`);
        }
        const data = (await response.json()) as { figure: FigureRecord };
        figuresList.value.unshift(data.figure);
        activePublicId.value = data.figure.public_id;
        scene.value = normalizeFigureScene(data.figure.scene_json, data.figure.name);
        historyPast.value = [];
        historyFuture.value = [];
        selectedIds.value = [];
        isDirty.value = false;
        showCreateDialog.value = false;
        toast.success(`Created "${data.figure.name}"`);
    } catch (error) {
        toast.error(
            error instanceof Error ? error.message : 'Unable to create figure.',
        );
    }
}

async function deleteActiveFigure(): Promise<void> {
    if (!activePublicId.value || !props.project.can_edit) {
        return;
    }
    try {
        const targetId = activePublicId.value;
        const response = await fetch(
            projectsRoutes.figures.destroy({
                project: props.project.public_id,
                figure: targetId,
            }).url,
            {
                method: 'DELETE',
                headers: {
                    Accept: 'application/json',
                    'X-XSRF-TOKEN': getCsrfToken(),
                },
            },
        );
        if (!response.ok) {
            throw new Error(`Delete failed with HTTP ${response.status}`);
        }
        figuresList.value = figuresList.value.filter((f) => f.public_id !== targetId);
        const next = figuresList.value[0] ?? null;
        activePublicId.value = next?.public_id ?? null;
        scene.value = next
            ? normalizeFigureScene(next.scene_json, next.name)
            : createDefaultFigureScene('Figure 1');
        historyPast.value = [];
        historyFuture.value = [];
        selectedIds.value = [];
        isDirty.value = false;
        showDeleteDialog.value = false;
        toast.success('Figure deleted');
    } catch (error) {
        toast.error(
            error instanceof Error ? error.message : 'Unable to delete figure.',
        );
    }
}

function switchFigure(publicId: string): void {
    const target = figuresList.value.find((f) => f.public_id === publicId);
    if (!target) {
        return;
    }
    router.visit(
        projectsRoutes.figures.show({
            project: props.project.public_id,
            figure: target.public_id,
        }).url,
    );
}

function handleGlobalKeydown(event: KeyboardEvent): void {
    if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
    ) {
        return;
    }
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'z') {
        event.preventDefault();
        if (event.shiftKey) {
            redo();
        } else {
            undo();
        }
        return;
    }
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'y') {
        event.preventDefault();
        redo();
        return;
    }
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
        event.preventDefault();
        void saveFigure();
        return;
    }
    if (event.key.toLowerCase() === 'v') {
        activeTool.value = 'select';
    } else if (event.key.toLowerCase() === 'h') {
        activeTool.value = 'pan';
    } else if (event.key.toLowerCase() === 'c') {
        activeTool.value = 'connector';
    }
}

async function triggerTexRender(): Promise<void> {
    if (!props.project.can_edit || isRendering.value) {
        return;
    }
    if (isDirty.value || !activePublicId.value) {
        await saveFigure();
    }
    if (!activePublicId.value) {
        return;
    }

    isRendering.value = true;
    activeBottomTab.value = 'preview';
    try {
        const response = await fetch(
            projectsRoutes.figures.renders.store({
                project: props.project.public_id,
                figure: activePublicId.value,
            }).url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-XSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify({ engine: 'pdflatex' }),
            },
        );
        if (!response.ok) {
            throw new Error(`Render request failed (${response.status})`);
        }
        const data = (await response.json()) as { renderJob: FigureRenderSummary };
        latestRender.value = data.renderJob;
        pollRenderJob(activePublicId.value, data.renderJob.public_id);
    } catch (error) {
        isRendering.value = false;
        toast.error(error instanceof Error ? error.message : 'Unable to start render.');
    }
}

function pollRenderJob(figurePublicId: string, renderPublicId: string): void {
    if (renderPollTimer !== null) {
        window.clearTimeout(renderPollTimer);
    }
    const tick = async (): Promise<void> => {
        try {
            const response = await fetch(
                projectsRoutes.figures.renders.show({
                    project: props.project.public_id,
                    figure: figurePublicId,
                    renderJob: renderPublicId,
                }).url,
                { headers: { Accept: 'application/json' } },
            );
            if (!response.ok) {
                throw new Error(`Poll failed (${response.status})`);
            }
            const data = (await response.json()) as { renderJob: FigureRenderSummary };
            latestRender.value = data.renderJob;

            if (data.renderJob.is_terminal) {
                isRendering.value = false;
                if (data.renderJob.status === 'succeeded' && data.renderJob.pdf_url) {
                    lastSuccessfulPdfUrl.value = `${data.renderJob.pdf_url}?t=${Date.now()}`;
                    toast.success('TeX figure rendered');
                } else {
                    toast.error(data.renderJob.error_summary || 'TeX figure render failed.');
                }
                return;
            }

            renderPollTimer = window.setTimeout(() => void tick(), 1200);
        } catch {
            isRendering.value = false;
        }
    };
    renderPollTimer = window.setTimeout(() => void tick(), 900);
}

async function restoreRevision(revisionPublicId: string): Promise<void> {
    if (!activePublicId.value || !props.project.can_edit) {
        return;
    }
    try {
        const response = await fetch(
            projectsRoutes.figures.revisions.restore({
                project: props.project.public_id,
                figure: activePublicId.value,
                revision: revisionPublicId,
            }).url,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'X-XSRF-TOKEN': getCsrfToken(),
                },
            },
        );
        if (!response.ok) {
            throw new Error(`Restore failed (${response.status})`);
        }
        const data = (await response.json()) as {
            figure: FigureRecord;
            revisions?: FigureRevisionSummary[];
        };
        scene.value = normalizeFigureScene(data.figure.scene_json, data.figure.name);
        figureMode.value = data.figure.mode;
        editableSource.value = data.figure.tikz_source;
        sourceDirty.value = false;
        isDirty.value = false;
        if (data.revisions) {
            revisionsList.value = data.revisions;
        }
        toast.success('Revision restored');
    } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Unable to restore revision.');
    }
}

function openInsertDialog(): void {
    insertCaption.value = scene.value.metadata.caption || scene.value.name;
    insertLabel.value = scene.value.metadata.label || 'fig:diagram';
    if (!insertFileId.value && props.projectFiles && props.projectFiles.length > 0) {
        insertFileId.value = props.projectFiles[0].public_id;
    }
    showInsertDialog.value = true;
}

async function insertIntoManuscript(): Promise<void> {
    if (!insertFileId.value || !props.project.can_edit || isInserting.value) {
        return;
    }
    isInserting.value = true;
    try {
        const response = await fetch(
            projectsRoutes.figures.insert(props.project.public_id).url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-XSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify({
                    figure_public_id: activePublicId.value,
                    file_public_id: insertFileId.value,
                    mode: insertMode.value,
                    tikz_source: editableSource.value,
                    figure_slug: scene.value.name,
                    caption: insertCaption.value,
                    label: insertLabel.value,
                    placement: insertPlacement.value,
                    packages_to_add: requiredPackages.value,
                    libraries_to_add: requiredLibraries.value,
                }),
            },
        );
        if (!response.ok) {
            throw new Error(`Insert failed (${response.status})`);
        }
        const data = (await response.json()) as {
            file_path: string;
            external_file_path: string | null;
        };
        showInsertDialog.value = false;
        toast.success(
            data.external_file_path
                ? `Saved ${data.external_file_path} and inserted \\input into ${data.file_path}`
                : `Inserted TikZ figure into ${data.file_path}`,
        );
    } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Unable to insert figure.');
    } finally {
        isInserting.value = false;
    }
}

function downloadTex(standalone: boolean): void {
    if (!activePublicId.value) {
        return;
    }
    const base = projectsRoutes.figures.export({
        project: props.project.public_id,
        figure: activePublicId.value,
    }).url;
    window.open(standalone ? `${base}?standalone=1` : base, '_blank');
}

function openRenderedPdf(): void {
    if (lastSuccessfulPdfUrl.value) {
        window.open(lastSuccessfulPdfUrl.value, '_blank');
    }
}

function downloadSceneJson(): void {
    const blob = new Blob([JSON.stringify(scene.value, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${scene.value.name.toLowerCase().replace(/\s+/g, '-') || 'figure'}.tikz-scene.json`;
    a.click();
    URL.revokeObjectURL(url);
}

onMounted(() => {
    window.addEventListener('keydown', handleGlobalKeydown);
});

onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleGlobalKeydown);
    if (renderPollTimer !== null) {
        window.clearTimeout(renderPollTimer);
    }
});

const toolItems: Array<{ id: CanvasTool; label: string; icon: unknown }> = [
    { id: 'select', label: 'Select', icon: MousePointer2 },
    { id: 'pan', label: 'Pan', icon: Hand },
    { id: 'connector', label: 'Connector', icon: ArrowUpRight },
    { id: 'coordinate', label: 'Coord', icon: Crosshair },
    { id: 'rectangle', label: 'Rectangle', icon: Square },
    { id: 'rounded_rectangle', label: 'Rounded', icon: Square },
    { id: 'circle', label: 'Circle', icon: Circle },
    { id: 'ellipse', label: 'Ellipse', icon: Circle },
    { id: 'diamond', label: 'Diamond', icon: Diamond },
    { id: 'text', label: 'Text/Math', icon: Type },
];

const anchorOptions: NodeAnchor[] = [
    'auto',
    'center',
    'north',
    'south',
    'east',
    'west',
    'north east',
    'north west',
    'south east',
    'south west',
];

const arrowTipOptions: ArrowTip[] = ['none', 'Stealth', 'Latex', 'To', 'Circle', 'Bar'];
</script>

<template>
    <div class="flex h-screen flex-col overflow-hidden bg-slate-100 text-slate-900">
        <Head :title="`TikZ Figure Editor - ${project.title}`" />
        <Toaster position="bottom-right" />

        <TooltipProvider>
            <!-- Top Toolbar -->
            <header class="flex h-12 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-3">
                <div class="flex items-center gap-2">
                    <Button variant="ghost" size="sm" as-child>
                        <Link :href="projectsRoutes.show(project.public_id).url">
                            <ArrowLeft class="mr-1.5 size-4" />
                            Project
                        </Link>
                    </Button>

                    <Separator orientation="vertical" class="h-5" />

                    <Select
                        v-if="figuresList.length > 0"
                        :model-value="activePublicId ?? ''"
                        @update:model-value="switchFigure(String($event))"
                    >
                        <SelectTrigger class="h-8 w-44 text-xs">
                            <SelectValue placeholder="Select figure" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem
                                v-for="fig in figuresList"
                                :key="fig.public_id"
                                :value="fig.public_id"
                            >
                                {{ fig.name }}
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    <Input
                        v-model="scene.name"
                        :disabled="!project.can_edit"
                        class="h-8 w-44 text-xs font-medium"
                        aria-label="Figure name"
                        @change="isDirty = true"
                    />

                    <Badge
                        :variant="figureMode === 'source_only' ? 'destructive' : figureMode === 'hybrid' ? 'outline' : 'secondary'"
                        class="text-[11px]"
                    >
                        {{
                            figureMode === 'source_only'
                                ? 'Source-Only'
                                : figureMode === 'hybrid'
                                  ? `Hybrid (${scene.protectedBlocks.length} protected)`
                                  : 'Visual-Native'
                        }}
                    </Badge>
                    <Badge v-if="sourceDirty" variant="outline" class="border-indigo-300 text-indigo-700 text-[11px]">
                        Source Modified
                    </Badge>
                    <Badge v-if="isDirty" variant="outline" class="border-amber-300 text-amber-700 text-[11px]">
                        Unsaved
                    </Badge>
                </div>

                <div class="flex items-center gap-1.5">
                    <Tooltip>
                        <TooltipTrigger as-child>
                            <Button
                                variant="ghost"
                                size="icon"
                                class="size-8"
                                :disabled="!canUndo || !project.can_edit"
                                aria-label="Undo"
                                @click="undo"
                            >
                                <Undo2 class="size-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger as-child>
                            <Button
                                variant="ghost"
                                size="icon"
                                class="size-8"
                                :disabled="!canRedo || !project.can_edit"
                                aria-label="Redo"
                                @click="redo"
                            >
                                <Redo2 class="size-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Redo (Ctrl+Shift+Z)</TooltipContent>
                    </Tooltip>

                    <Separator orientation="vertical" class="mx-1 h-5" />

                    <Tooltip>
                        <TooltipTrigger as-child>
                            <Button
                                variant="ghost"
                                size="icon"
                                class="size-8"
                                aria-label="Zoom out"
                                @click="zoomBy(0.85)"
                            >
                                <ZoomOut class="size-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Zoom Out</TooltipContent>
                    </Tooltip>

                    <Button variant="ghost" size="sm" class="h-8 px-2 text-xs" @click="resetViewport">
                        {{ Math.round(viewport.zoom * 100) }}%
                    </Button>

                    <Tooltip>
                        <TooltipTrigger as-child>
                            <Button
                                variant="ghost"
                                size="icon"
                                class="size-8"
                                aria-label="Zoom in"
                                @click="zoomBy(1.15)"
                            >
                                <ZoomIn class="size-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Zoom In</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger as-child>
                            <Button
                                :variant="scene.grid.enabled ? 'secondary' : 'ghost'"
                                size="icon"
                                class="size-8"
                                aria-label="Toggle grid"
                                @click="commitSceneMutation((d) => { d.grid.enabled = !d.grid.enabled; })"
                            >
                                <Grid3x3 class="size-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Toggle Grid</TooltipContent>
                    </Tooltip>

                    <Separator orientation="vertical" class="mx-1 h-5" />

                    <div class="flex items-center rounded-md border border-slate-200 p-0.5">
                        <Button
                            :variant="layoutMode === 'visual' ? 'secondary' : 'ghost'"
                            size="sm"
                            class="h-7 px-2 text-xs"
                            @click="layoutMode = 'visual'"
                        >
                            Visual
                        </Button>
                        <Button
                            :variant="layoutMode === 'split' ? 'secondary' : 'ghost'"
                            size="sm"
                            class="h-7 px-2 text-xs"
                            @click="layoutMode = 'split'"
                        >
                            Split
                        </Button>
                        <Button
                            :variant="layoutMode === 'code' ? 'secondary' : 'ghost'"
                            size="sm"
                            class="h-7 px-2 text-xs"
                            @click="layoutMode = 'code'"
                        >
                            Code
                        </Button>
                    </div>

                    <Button
                        v-if="project.can_edit"
                        variant="outline"
                        size="sm"
                        class="h-8 text-xs"
                        :disabled="isRendering"
                        @click="triggerTexRender"
                    >
                        <Play class="mr-1 size-3.5" />
                        {{ isRendering ? 'Rendering...' : 'Render TeX' }}
                    </Button>

                    <Button
                        v-if="project.can_edit && (projectFiles?.length ?? 0) > 0"
                        variant="outline"
                        size="sm"
                        class="h-8 text-xs"
                        @click="openInsertDialog"
                    >
                        <FileInput class="mr-1 size-3.5" />
                        Insert
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger as-child>
                            <Button variant="outline" size="sm" class="h-8 text-xs">
                                <Download class="mr-1 size-3.5" />
                                Export
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem :disabled="!activePublicId" @click="downloadTex(false)">
                                Download .tex Snippet
                            </DropdownMenuItem>
                            <DropdownMenuItem :disabled="!activePublicId" @click="downloadTex(true)">
                                Download Standalone .tex
                            </DropdownMenuItem>
                            <DropdownMenuItem :disabled="!lastSuccessfulPdfUrl" @click="openRenderedPdf">
                                Open Rendered PDF
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem @click="downloadSceneJson">
                                Export Scene JSON
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button
                        v-if="project.can_edit"
                        variant="outline"
                        size="sm"
                        class="h-8 text-xs"
                        @click="showCreateDialog = true"
                    >
                        <Plus class="mr-1 size-3.5" />
                        New
                    </Button>

                    <Button
                        v-if="project.can_edit && activePublicId"
                        variant="ghost"
                        size="icon"
                        class="size-8 text-red-600 hover:text-red-700"
                        aria-label="Delete figure"
                        @click="showDeleteDialog = true"
                    >
                        <Trash2 class="size-4" />
                    </Button>

                    <Button
                        v-if="project.can_edit"
                        size="sm"
                        class="h-8 text-xs"
                        :disabled="isSaving"
                        @click="saveFigure"
                    >
                        <Save class="mr-1.5 size-3.5" />
                        {{ isSaving ? 'Saving...' : 'Save' }}
                    </Button>
                </div>
            </header>

            <!-- Main Workspace -->
            <div class="flex min-h-0 flex-1 overflow-hidden">
                <!-- Left Rail: Tools & Layers -->
                <aside class="flex w-60 shrink-0 flex-col border-r border-slate-200 bg-white">
                    <div class="border-b border-slate-200 p-3">
                        <p class="mb-2 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                            Drawing Tools
                        </p>
                        <div class="grid grid-cols-2 gap-1.5">
                            <Button
                                v-for="item in toolItems"
                                :key="item.id"
                                :variant="activeTool === item.id ? 'default' : 'outline'"
                                size="sm"
                                class="h-8 justify-start px-2 text-xs"
                                :disabled="!project.can_edit && item.id !== 'select' && item.id !== 'pan'"
                                @click="activeTool = item.id"
                            >
                                <component :is="item.icon" class="mr-1.5 size-3.5 shrink-0" />
                                <span class="truncate">{{ item.label }}</span>
                            </Button>
                        </div>
                    </div>

                    <div class="flex min-h-0 flex-1 flex-col p-3">
                        <div class="mb-2 flex items-center justify-between">
                            <span class="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                                <Layers class="size-3.5" />
                                Layers
                            </span>
                            <Button
                                v-if="project.can_edit"
                                variant="ghost"
                                size="icon"
                                class="size-6"
                                aria-label="Add layer"
                                @click="addLayer"
                            >
                                <Plus class="size-3.5" />
                            </Button>
                        </div>

                        <ScrollArea class="flex-1">
                            <div class="space-y-1">
                                <div
                                    v-for="layer in scene.layers"
                                    :key="layer.id"
                                    class="flex items-center justify-between rounded-md border px-2 py-1.5 text-xs"
                                    :class="
                                        activeLayerId === layer.id
                                            ? 'border-indigo-300 bg-indigo-50/70'
                                            : 'border-slate-200 bg-white'
                                    "
                                    @click="activeLayerId = layer.id"
                                >
                                    <span class="truncate font-medium">{{ layer.name }}</span>
                                    <div class="flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            class="size-6"
                                            aria-label="Toggle layer visibility"
                                            @click.stop="toggleLayerVisibility(layer)"
                                        >
                                            <Eye v-if="layer.visible" class="size-3.5" />
                                            <EyeOff v-else class="size-3.5 text-slate-400" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            class="size-6"
                                            aria-label="Toggle layer lock"
                                            @click.stop="toggleLayerLock(layer)"
                                        >
                                            <Lock v-if="layer.locked" class="size-3.5 text-amber-600" />
                                            <Unlock v-else class="size-3.5 text-slate-400" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </ScrollArea>
                    </div>
                </aside>

                <!-- Center Canvas + Bottom/Code Panel -->
                <main class="flex min-w-0 flex-1 flex-col overflow-hidden">
                    <div v-show="layoutMode !== 'code'" class="relative min-h-0 flex-1">
                        <div
                            v-if="figureMode === 'source_only'"
                            class="absolute inset-x-3 top-3 z-10 flex items-center justify-between rounded-md border border-amber-300 bg-amber-50/95 px-3 py-1.5 text-xs text-amber-900 shadow-xs"
                        >
                            <span>Canvas locked in Source-Only mode. Sync source or reset to resume visual editing.</span>
                            <Button variant="outline" size="sm" class="h-7 text-xs" @click="showResetSourceDialog = true">
                                Reset from Visual
                            </Button>
                        </div>
                        <FigureCanvas
                            :scene="scene"
                            :selected-ids="selectedIds"
                            :active-tool="activeTool"
                            :viewport="viewport"
                            :can-edit="project.can_edit && figureMode !== 'source_only'"
                            @update:selected-ids="handleCanvasSelectionChange"
                            @update:viewport="viewport = $event"
                            @commit-object-patch="handleCommitObjectPatch"
                            @commit-connector-patch="handleCommitConnectorPatch"
                            @place-object="handlePlaceObject"
                            @create-connector="handleCreateConnector"
                            @delete-selected="handleDeleteSelected"
                            @nudge-selected="handleNudgeSelected"
                        />
                    </div>

                    <div
                        v-if="layoutMode !== 'visual'"
                        :class="layoutMode === 'code' ? 'min-h-0 flex-1' : 'h-60 shrink-0 border-t border-slate-200'"
                        class="flex flex-col bg-white"
                    >
                        <Tabs v-model="activeBottomTab" class="flex h-full flex-col">
                            <div class="flex items-center justify-between border-b border-slate-200 px-3 py-1">
                                <TabsList class="h-7">
                                    <TabsTrigger value="tikz" class="text-xs">
                                        TikZ Source (Monaco)
                                    </TabsTrigger>
                                    <TabsTrigger value="preview" class="text-xs">
                                        TeX Preview
                                    </TabsTrigger>
                                    <TabsTrigger value="diagnostics" class="text-xs">
                                        Diagnostics ({{ latestRender?.diagnostics.length ?? 0 }})
                                    </TabsTrigger>
                                    <TabsTrigger value="revisions" class="text-xs">
                                        Revisions ({{ revisionsList.length }})
                                    </TabsTrigger>
                                    <TabsTrigger value="packages" class="text-xs">
                                        Packages &amp; Libraries
                                    </TabsTrigger>
                                    <TabsTrigger v-if="parseWarnings.length > 0" value="warnings" class="text-xs text-amber-700">
                                        Warnings ({{ parseWarnings.length }})
                                    </TabsTrigger>
                                </TabsList>
                                <div class="flex items-center gap-1.5">
                                    <Button
                                        v-if="project.can_edit"
                                        variant="outline"
                                        size="sm"
                                        class="h-7 text-xs"
                                        :disabled="!sourceDirty && figureMode !== 'source_only'"
                                        @click="syncSourceToVisual"
                                    >
                                        <RefreshCw class="mr-1 size-3" />
                                        Sync to Visual
                                    </Button>
                                    <Button
                                        v-if="sourceDirty || figureMode === 'source_only'"
                                        variant="ghost"
                                        size="sm"
                                        class="h-7 text-xs text-slate-600"
                                        @click="showResetSourceDialog = true"
                                    >
                                        Discard Manual Edits
                                    </Button>
                                </div>
                            </div>
                            <TabsContent value="tikz" class="m-0 min-h-0 flex-1 overflow-hidden">
                                <MonacoEditor
                                    ref="monacoRef"
                                    :model-value="editableSource"
                                    language="latex"
                                    :read-only="!project.can_edit"
                                    @update:model-value="handleSourceChange"
                                    @cursor-change="handleMonacoCursorChange"
                                    @save="saveFigure"
                                />
                            </TabsContent>
                            <TabsContent value="preview" class="m-0 min-h-0 flex-1 overflow-hidden p-2">
                                <div class="flex h-full flex-col gap-2">
                                    <Alert v-if="latestRender && latestRender.status === 'failed'" variant="destructive" class="py-1.5">
                                        <AlertTitle class="text-xs">Latest TeX Render Failed (showing last successful PDF if available)</AlertTitle>
                                        <AlertDescription class="text-xs">
                                            {{ latestRender.error_summary || 'Check Diagnostics tab for details.' }}
                                        </AlertDescription>
                                    </Alert>
                                    <iframe
                                        v-if="lastSuccessfulPdfUrl"
                                        :src="lastSuccessfulPdfUrl"
                                        class="h-full w-full rounded border border-slate-200 bg-slate-50"
                                        title="Rendered TikZ PDF Preview"
                                    />
                                    <div v-else class="flex h-full items-center justify-center text-xs text-slate-400">
                                        Click "Render TeX" to compile this figure with the isolated TeX Live worker.
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="diagnostics" class="m-0 min-h-0 flex-1 overflow-auto p-3 text-xs">
                                <div v-if="!latestRender || latestRender.diagnostics.length === 0" class="text-slate-400">
                                    No compiler diagnostics recorded.
                                </div>
                                <div v-else class="space-y-1.5">
                                    <div
                                        v-for="(diag, idx) in latestRender.diagnostics"
                                        :key="idx"
                                        class="rounded border border-slate-200 p-2"
                                    >
                                        <div class="flex items-center gap-2 font-medium">
                                            <Badge :variant="diag.severity === 'error' ? 'destructive' : 'secondary'">
                                                {{ diag.severity }}
                                            </Badge>
                                            <span>{{ diag.file_path }}<span v-if="diag.line">:L{{ diag.line }}</span></span>
                                        </div>
                                        <p class="mt-1 text-slate-700">{{ diag.message }}</p>
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="revisions" class="m-0 min-h-0 flex-1 overflow-auto p-3 text-xs">
                                <div v-if="revisionsList.length === 0" class="text-slate-400">
                                    Save the figure to create immutable revision snapshots.
                                </div>
                                <div v-else class="space-y-1.5">
                                    <div
                                        v-for="rev in revisionsList"
                                        :key="rev.public_id"
                                        class="flex items-center justify-between rounded border border-slate-200 px-2.5 py-1.5"
                                    >
                                        <div>
                                            <p class="font-medium text-slate-800">{{ rev.summary || 'Snapshot' }}</p>
                                            <p class="text-[11px] text-slate-500">{{ rev.author }} · {{ rev.mode }} · {{ rev.created_at }}</p>
                                        </div>
                                        <Button
                                            v-if="project.can_edit"
                                            variant="outline"
                                            size="sm"
                                            class="h-7 text-xs"
                                            @click="restoreRevision(rev.public_id)"
                                        >
                                            <History class="mr-1 size-3" />
                                            Restore
                                        </Button>
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="packages" class="m-0 min-h-0 flex-1 overflow-auto p-3 text-xs">
                                <div class="flex flex-wrap items-center gap-2">
                                    <span class="font-medium text-slate-600">Packages:</span>
                                    <Badge v-for="pkg in requiredPackages" :key="pkg" variant="secondary">
                                        {{ '\\usepackage{' + pkg + '}' }}
                                    </Badge>
                                </div>
                                <div class="mt-2 flex flex-wrap items-center gap-2">
                                    <span class="font-medium text-slate-600">TikZ Libraries:</span>
                                    <span v-if="requiredLibraries.length === 0" class="text-slate-400">None</span>
                                    <Badge v-for="lib in requiredLibraries" :key="lib" variant="outline">
                                        {{ lib }}
                                    </Badge>
                                </div>
                            </TabsContent>
                            <TabsContent v-if="parseWarnings.length > 0" value="warnings" class="m-0 min-h-0 flex-1 overflow-auto p-3">
                                <Alert>
                                    <AlertTitle class="text-xs">Hybrid / Parser Notes</AlertTitle>
                                    <AlertDescription class="text-xs">
                                        <ul class="mt-1 list-disc pl-4 space-y-0.5">
                                            <li v-for="(w, idx) in parseWarnings" :key="idx">{{ w }}</li>
                                        </ul>
                                    </AlertDescription>
                                </Alert>
                            </TabsContent>
                        </Tabs>
                    </div>
                </main>

                <!-- Right Inspector -->
                <aside class="flex w-72 shrink-0 flex-col border-l border-slate-200 bg-white">
                    <div class="border-b border-slate-200 px-3 py-2.5">
                        <h2 class="text-xs font-semibold tracking-wide text-slate-600 uppercase">
                            {{
                                selectedObject
                                    ? `Node: ${selectedObject.tikzName}`
                                    : selectedConnector
                                      ? 'Connector / Edge'
                                      : 'Canvas & Grid'
                            }}
                        </h2>
                    </div>

                    <ScrollArea class="flex-1 p-3">
                        <!-- Node / Shape Inspector -->
                        <div v-if="selectedObject" class="space-y-2">
                            <Accordion type="multiple" :default-value="['label', 'geometry', 'appearance']">
                                <AccordionItem value="label">
                                    <AccordionTrigger class="py-2 text-xs font-semibold">
                                        Label &amp; TikZ ID
                                    </AccordionTrigger>
                                    <AccordionContent class="space-y-2 pt-1">
                                        <div>
                                            <Label class="text-[11px]">TikZ Name</Label>
                                            <Input
                                                :model-value="selectedObject.tikzName"
                                                :disabled="!project.can_edit"
                                                class="mt-1 h-8 text-xs"
                                                @change="handleCommitObjectPatch(selectedObject.id, { tikzName: ($event.target as HTMLInputElement).value })"
                                            />
                                        </div>
                                        <div v-if="selectedObject.kind !== 'coordinate'">
                                            <Label class="text-[11px]">Label Text / Math ($...$)</Label>
                                            <Input
                                                :model-value="selectedObject.label"
                                                :disabled="!project.can_edit"
                                                class="mt-1 h-8 text-xs"
                                                @change="handleCommitObjectPatch(selectedObject.id, { label: ($event.target as HTMLInputElement).value })"
                                            />
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="geometry">
                                    <AccordionTrigger class="py-2 text-xs font-semibold">
                                        Geometry ({{ scene.unit }})
                                    </AccordionTrigger>
                                    <AccordionContent class="grid grid-cols-2 gap-2 pt-1">
                                        <div>
                                            <Label class="text-[11px]">X</Label>
                                            <Input
                                                type="number"
                                                step="0.25"
                                                :model-value="selectedObject.x"
                                                :disabled="!project.can_edit"
                                                class="mt-1 h-8 text-xs"
                                                @change="handleCommitObjectPatch(selectedObject.id, { x: Number(($event.target as HTMLInputElement).value) })"
                                            />
                                        </div>
                                        <div>
                                            <Label class="text-[11px]">Y</Label>
                                            <Input
                                                type="number"
                                                step="0.25"
                                                :model-value="selectedObject.y"
                                                :disabled="!project.can_edit"
                                                class="mt-1 h-8 text-xs"
                                                @change="handleCommitObjectPatch(selectedObject.id, { y: Number(($event.target as HTMLInputElement).value) })"
                                            />
                                        </div>
                                        <template v-if="selectedObject.kind !== 'coordinate'">
                                            <div>
                                                <Label class="text-[11px]">Width</Label>
                                                <Input
                                                    type="number"
                                                    step="0.25"
                                                    min="0.2"
                                                    :model-value="selectedObject.width"
                                                    :disabled="!project.can_edit"
                                                    class="mt-1 h-8 text-xs"
                                                    @change="handleCommitObjectPatch(selectedObject.id, { width: Math.max(0.2, Number(($event.target as HTMLInputElement).value)) })"
                                                />
                                            </div>
                                            <div>
                                                <Label class="text-[11px]">Height</Label>
                                                <Input
                                                    type="number"
                                                    step="0.25"
                                                    min="0.2"
                                                    :model-value="selectedObject.height"
                                                    :disabled="!project.can_edit"
                                                    class="mt-1 h-8 text-xs"
                                                    @change="handleCommitObjectPatch(selectedObject.id, { height: Math.max(0.2, Number(($event.target as HTMLInputElement).value)) })"
                                                />
                                            </div>
                                            <div class="col-span-2">
                                                <Label class="text-[11px]">Rotation (deg)</Label>
                                                <Input
                                                    type="number"
                                                    step="15"
                                                    :model-value="selectedObject.rotationDeg"
                                                    :disabled="!project.can_edit"
                                                    class="mt-1 h-8 text-xs"
                                                    @change="handleCommitObjectPatch(selectedObject.id, { rotationDeg: Number(($event.target as HTMLInputElement).value) })"
                                                />
                                            </div>
                                        </template>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="appearance">
                                    <AccordionTrigger class="py-2 text-xs font-semibold">
                                        Appearance
                                    </AccordionTrigger>
                                    <AccordionContent class="space-y-2 pt-1">
                                        <div class="grid grid-cols-2 gap-2">
                                            <div>
                                                <Label class="text-[11px]">Stroke</Label>
                                                <Input
                                                    type="color"
                                                    :model-value="selectedObject.style.stroke === 'none' ? '#1e293b' : selectedObject.style.stroke"
                                                    :disabled="!project.can_edit"
                                                    class="mt-1 h-8 p-1"
                                                    @input="handleCommitObjectPatch(selectedObject.id, { style: { ...selectedObject.style, stroke: ($event.target as HTMLInputElement).value } })"
                                                />
                                            </div>
                                            <div>
                                                <Label class="text-[11px]">Fill</Label>
                                                <Input
                                                    type="color"
                                                    :model-value="selectedObject.style.fill === 'none' ? '#f8fafc' : selectedObject.style.fill"
                                                    :disabled="!project.can_edit"
                                                    class="mt-1 h-8 p-1"
                                                    @input="handleCommitObjectPatch(selectedObject.id, { style: { ...selectedObject.style, fill: ($event.target as HTMLInputElement).value } })"
                                                />
                                            </div>
                                        </div>
                                        <div class="grid grid-cols-2 gap-2">
                                            <div>
                                                <Label class="text-[11px]">Line Width (pt)</Label>
                                                <Input
                                                    type="number"
                                                    step="0.2"
                                                    min="0.2"
                                                    :model-value="selectedObject.style.strokeWidthPt"
                                                    :disabled="!project.can_edit"
                                                    class="mt-1 h-8 text-xs"
                                                    @change="handleCommitObjectPatch(selectedObject.id, { style: { ...selectedObject.style, strokeWidthPt: Math.max(0.2, Number(($event.target as HTMLInputElement).value)) } })"
                                                />
                                            </div>
                                            <div>
                                                <Label class="text-[11px]">Dash</Label>
                                                <Select
                                                    :model-value="selectedObject.style.dash"
                                                    :disabled="!project.can_edit"
                                                    @update:model-value="handleCommitObjectPatch(selectedObject.id, { style: { ...selectedObject.style, dash: $event as StrokeDash } })"
                                                >
                                                    <SelectTrigger class="mt-1 h-8 text-xs">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="solid">Solid</SelectItem>
                                                        <SelectItem value="dashed">Dashed</SelectItem>
                                                        <SelectItem value="dotted">Dotted</SelectItem>
                                                        <SelectItem value="dashdot">Dash-Dot</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <Button
                                            v-if="project.can_edit"
                                            variant="destructive"
                                            size="sm"
                                            class="mt-2 w-full text-xs"
                                            @click="handleDeleteSelected"
                                        >
                                            <Trash2 class="mr-1.5 size-3.5" />
                                            Delete Node
                                        </Button>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>

                        <!-- Connector Inspector -->
                        <div v-else-if="selectedConnector" class="space-y-2">
                            <Accordion type="multiple" :default-value="['routing', 'arrows', 'edge-label']">
                                <AccordionItem value="routing">
                                    <AccordionTrigger class="py-2 text-xs font-semibold">
                                        Routing &amp; Anchors
                                    </AccordionTrigger>
                                    <AccordionContent class="space-y-2 pt-1">
                                        <div>
                                            <Label class="text-[11px]">Path Type</Label>
                                            <Select
                                                :model-value="selectedConnector.routing"
                                                :disabled="!project.can_edit"
                                                @update:model-value="handleCommitConnectorPatch(selectedConnector.id, { routing: $event as ConnectorRouting })"
                                            >
                                                <SelectTrigger class="mt-1 h-8 text-xs">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="straight">Straight (--)</SelectItem>
                                                    <SelectItem value="orthogonal_hv">Orthogonal (-|)</SelectItem>
                                                    <SelectItem value="orthogonal_vh">Orthogonal (|-)</SelectItem>
                                                    <SelectItem value="curved">Curved (bend)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div v-if="selectedConnector.routing === 'curved'">
                                            <Label class="text-[11px]">Bend Angle (deg)</Label>
                                            <Input
                                                type="number"
                                                step="5"
                                                :model-value="selectedConnector.curveBendDeg"
                                                :disabled="!project.can_edit"
                                                class="mt-1 h-8 text-xs"
                                                @change="handleCommitConnectorPatch(selectedConnector.id, { curveBendDeg: Number(($event.target as HTMLInputElement).value) })"
                                            />
                                        </div>
                                        <div v-if="selectedConnector.from.objectId">
                                            <Label class="text-[11px]">From Anchor</Label>
                                            <Select
                                                :model-value="selectedConnector.from.anchor ?? 'auto'"
                                                :disabled="!project.can_edit"
                                                @update:model-value="handleCommitConnectorPatch(selectedConnector.id, { from: { ...selectedConnector.from, anchor: $event as NodeAnchor } })"
                                            >
                                                <SelectTrigger class="mt-1 h-8 text-xs">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem v-for="a in anchorOptions" :key="a" :value="a">
                                                        {{ a }}
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div v-if="selectedConnector.to.objectId">
                                            <Label class="text-[11px]">To Anchor</Label>
                                            <Select
                                                :model-value="selectedConnector.to.anchor ?? 'auto'"
                                                :disabled="!project.can_edit"
                                                @update:model-value="handleCommitConnectorPatch(selectedConnector.id, { to: { ...selectedConnector.to, anchor: $event as NodeAnchor } })"
                                            >
                                                <SelectTrigger class="mt-1 h-8 text-xs">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem v-for="a in anchorOptions" :key="a" :value="a">
                                                        {{ a }}
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="arrows">
                                    <AccordionTrigger class="py-2 text-xs font-semibold">
                                        Arrows &amp; Stroke
                                    </AccordionTrigger>
                                    <AccordionContent class="space-y-2 pt-1">
                                        <div class="grid grid-cols-2 gap-2">
                                            <div>
                                                <Label class="text-[11px]">Start Tip</Label>
                                                <Select
                                                    :model-value="selectedConnector.arrowStart"
                                                    :disabled="!project.can_edit"
                                                    @update:model-value="handleCommitConnectorPatch(selectedConnector.id, { arrowStart: $event as ArrowTip })"
                                                >
                                                    <SelectTrigger class="mt-1 h-8 text-xs">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem v-for="tip in arrowTipOptions" :key="tip" :value="tip">
                                                            {{ tip }}
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <Label class="text-[11px]">End Tip</Label>
                                                <Select
                                                    :model-value="selectedConnector.arrowEnd"
                                                    :disabled="!project.can_edit"
                                                    @update:model-value="handleCommitConnectorPatch(selectedConnector.id, { arrowEnd: $event as ArrowTip })"
                                                >
                                                    <SelectTrigger class="mt-1 h-8 text-xs">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem v-for="tip in arrowTipOptions" :key="tip" :value="tip">
                                                            {{ tip }}
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div class="grid grid-cols-2 gap-2">
                                            <div>
                                                <Label class="text-[11px]">Dash</Label>
                                                <Select
                                                    :model-value="selectedConnector.style.dash"
                                                    :disabled="!project.can_edit"
                                                    @update:model-value="handleCommitConnectorPatch(selectedConnector.id, { style: { ...selectedConnector.style, dash: $event as StrokeDash } })"
                                                >
                                                    <SelectTrigger class="mt-1 h-8 text-xs">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="solid">Solid</SelectItem>
                                                        <SelectItem value="dashed">Dashed</SelectItem>
                                                        <SelectItem value="dotted">Dotted</SelectItem>
                                                        <SelectItem value="dashdot">Dash-Dot</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <Label class="text-[11px]">Width (pt)</Label>
                                                <Input
                                                    type="number"
                                                    step="0.2"
                                                    min="0.2"
                                                    :model-value="selectedConnector.style.strokeWidthPt"
                                                    :disabled="!project.can_edit"
                                                    class="mt-1 h-8 text-xs"
                                                    @change="handleCommitConnectorPatch(selectedConnector.id, { style: { ...selectedConnector.style, strokeWidthPt: Math.max(0.2, Number(($event.target as HTMLInputElement).value)) } })"
                                                />
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>

                                <AccordionItem value="edge-label">
                                    <AccordionTrigger class="py-2 text-xs font-semibold">
                                        Edge Label
                                    </AccordionTrigger>
                                    <AccordionContent class="space-y-2 pt-1">
                                        <div>
                                            <Label class="text-[11px]">Label ($...$ for math)</Label>
                                            <Input
                                                :model-value="selectedConnector.label"
                                                :disabled="!project.can_edit"
                                                class="mt-1 h-8 text-xs"
                                                @change="handleCommitConnectorPatch(selectedConnector.id, { label: ($event.target as HTMLInputElement).value })"
                                            />
                                        </div>
                                        <div>
                                            <Label class="text-[11px]">Placement</Label>
                                            <Select
                                                :model-value="selectedConnector.labelPosition"
                                                :disabled="!project.can_edit"
                                                @update:model-value="handleCommitConnectorPatch(selectedConnector.id, { labelPosition: $event as EdgeLabelPosition })"
                                            >
                                                <SelectTrigger class="mt-1 h-8 text-xs">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="above">Above</SelectItem>
                                                    <SelectItem value="below">Below</SelectItem>
                                                    <SelectItem value="left">Left</SelectItem>
                                                    <SelectItem value="right">Right</SelectItem>
                                                    <SelectItem value="midway">Midway</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <Button
                                            v-if="project.can_edit"
                                            variant="destructive"
                                            size="sm"
                                            class="mt-2 w-full text-xs"
                                            @click="handleDeleteSelected"
                                        >
                                            <Trash2 class="mr-1.5 size-3.5" />
                                            Delete Connector
                                        </Button>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>

                        <!-- Canvas & Grid Inspector -->
                        <div v-else class="space-y-4 text-xs">
                            <div class="flex items-center justify-between">
                                <Label>Show Grid</Label>
                                <Switch
                                    :model-value="scene.grid.enabled"
                                    @update:model-value="commitSceneMutation((d) => { d.grid.enabled = Boolean($event); })"
                                />
                            </div>
                            <div class="flex items-center justify-between">
                                <Label>Snap to Grid</Label>
                                <Switch
                                    :model-value="scene.grid.snap"
                                    @update:model-value="commitSceneMutation((d) => { d.grid.snap = Boolean($event); })"
                                />
                            </div>
                            <div>
                                <Label class="text-[11px]">Grid Step ({{ scene.unit }})</Label>
                                <Input
                                    type="number"
                                    step="0.25"
                                    min="0.1"
                                    :model-value="scene.grid.step"
                                    class="mt-1 h-8 text-xs"
                                    @change="commitSceneMutation((d) => { d.grid.step = Math.max(0.1, Number(($event.target as HTMLInputElement).value)); })"
                                />
                            </div>
                        </div>
                    </ScrollArea>
                </aside>
            </div>
        </TooltipProvider>

        <!-- Create Figure Dialog -->
        <Dialog v-model:open="showCreateDialog">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New TikZ Figure</DialogTitle>
                    <DialogDescription>
                        Create a new visual TikZ figure in {{ project.title }}.
                    </DialogDescription>
                </DialogHeader>
                <div class="space-y-2 py-2">
                    <Label for="new-figure-name">Figure Name</Label>
                    <Input
                        id="new-figure-name"
                        v-model="newFigureName"
                        @keydown.enter="createFigure"
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" @click="showCreateDialog = false">
                        Cancel
                    </Button>
                    <Button @click="createFigure">
                        Create Figure
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <!-- Delete Confirmation Dialog -->
        <AlertDialog v-model:open="showDeleteDialog">
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Figure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will permanently remove "{{ scene.name }}" from the project.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction @click="deleteActiveFigure">
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        <!-- Reset Source Confirmation Dialog -->
        <AlertDialog v-model:open="showResetSourceDialog">
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Discard Manual TikZ Edits?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will replace the Monaco TikZ buffer with the code generated from the current visual scene.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Keep Manual Edits</AlertDialogCancel>
                    <AlertDialogAction @click="resetSourceFromVisual">
                        Reset from Visual
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        <!-- Insert into Manuscript Dialog -->
        <Dialog v-model:open="showInsertDialog">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Insert Figure into Manuscript</DialogTitle>
                    <DialogDescription>
                        Insert this TikZ figure into a project .tex file and automatically inject required packages.
                    </DialogDescription>
                </DialogHeader>
                <div class="space-y-3 py-2 text-xs">
                    <div>
                        <Label class="text-xs">Target .tex File</Label>
                        <Select v-model="insertFileId">
                            <SelectTrigger class="mt-1 h-8 text-xs">
                                <SelectValue placeholder="Select target file" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem
                                    v-for="file in projectFiles ?? []"
                                    :key="file.public_id"
                                    :value="file.public_id"
                                >
                                    {{ file.path }}
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label class="text-xs">Insertion Mode</Label>
                        <Select v-model="insertMode">
                            <SelectTrigger class="mt-1 h-8 text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="external">External file (figures/*.tex + \input)</SelectItem>
                                <SelectItem value="inline">Inline tikzpicture environment</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div class="grid grid-cols-2 gap-2">
                        <div>
                            <Label class="text-xs">Label</Label>
                            <Input v-model="insertLabel" class="mt-1 h-8 text-xs" placeholder="fig:diagram" />
                        </div>
                        <div>
                            <Label class="text-xs">Placement</Label>
                            <Input v-model="insertPlacement" class="mt-1 h-8 text-xs" placeholder="htbp" />
                        </div>
                    </div>
                    <div>
                        <Label class="text-xs">Caption</Label>
                        <Input v-model="insertCaption" class="mt-1 h-8 text-xs" placeholder="Figure caption" />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" @click="showInsertDialog = false">
                        Cancel
                    </Button>
                    <Button :disabled="isInserting || !insertFileId" @click="insertIntoManuscript">
                        {{ isInserting ? 'Inserting...' : 'Insert into Document' }}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
</template>
