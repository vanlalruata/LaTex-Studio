<script setup lang="ts">
import { Head, Link, router } from '@inertiajs/vue3';
import {
    ArrowLeft,
    Circle,
    Diamond,
    Eye,
    EyeOff,
    Grid3x3,
    Hand,
    Layers,
    Lock,
    MousePointer2,
    Plus,
    Redo2,
    Save,
    Square,
    Trash2,
    Type,
    Undo2,
    Unlock,
    ZoomIn,
    ZoomOut,
} from '@lucide/vue';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { toast } from 'vue-sonner';
import FigureCanvas from '@/components/figureEditor/FigureCanvas.vue';
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
    createFigureObject,
    generatePhase1TikzStub,
    normalizeFigureScene,
} from '@/services/figureEditor/sceneHistory';
import type {
    CanvasTool,
    FigureLayer,
    FigureObject,
    FigureRecord,
    FigureSceneDocument,
    ViewportState,
} from '@/services/figureEditor/types';

const props = defineProps<{
    project: {
        public_id: string;
        title: string;
        root_file_path: string;
        can_edit: boolean;
    };
    figures: FigureRecord[];
    activeFigure: FigureRecord | null;
}>();

const figuresList = ref<FigureRecord[]>([...props.figures]);
const activePublicId = ref<string | null>(props.activeFigure?.public_id ?? null);

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
const layoutMode = ref<'visual' | 'split'>('split');
const isDirty = ref(false);
const isSaving = ref(false);
const showCreateDialog = ref(false);
const newFigureName = ref('New TikZ Figure');
const showDeleteDialog = ref(false);

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

const generatedTikz = computed(() => generatePhase1TikzStub(scene.value));

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
    shape: Exclude<CanvasTool, 'select' | 'pan'>,
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

function handleDeleteSelected(): void {
    if (selectedIds.value.length === 0) {
        return;
    }
    const toDelete = new Set(selectedIds.value);
    commitSceneMutation((draft) => {
        draft.objects = draft.objects.filter((o) => !toDelete.has(o.id));
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
                mode: 'visual_native',
                scene_json: scene.value,
                tikz_source: generatedTikz.value,
                required_packages_json: ['tikz'],
                required_libraries_json: [],
            }),
        });

        if (!response.ok) {
            throw new Error(`Save failed with HTTP ${response.status}`);
        }

        const data = (await response.json()) as { figure: FigureRecord };
        activePublicId.value = data.figure.public_id;
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
    }
}

onMounted(() => {
    window.addEventListener('keydown', handleGlobalKeydown);
});

onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleGlobalKeydown);
});

const toolItems: Array<{ id: CanvasTool; label: string; shortcut: string; icon: unknown }> = [
    { id: 'select', label: 'Select', shortcut: 'V', icon: MousePointer2 },
    { id: 'pan', label: 'Pan Canvas', shortcut: 'H', icon: Hand },
    { id: 'rectangle', label: 'Rectangle', shortcut: '', icon: Square },
    { id: 'rounded_rectangle', label: 'Rounded Box', shortcut: '', icon: Square },
    { id: 'circle', label: 'Circle', shortcut: '', icon: Circle },
    { id: 'ellipse', label: 'Ellipse', shortcut: '', icon: Circle },
    { id: 'diamond', label: 'Diamond', shortcut: '', icon: Diamond },
    { id: 'text', label: 'Text / Math', shortcut: '', icon: Type },
];
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

                    <Badge variant="secondary" class="text-[11px]">
                        Visual-Native
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

                    <Button
                        variant="outline"
                        size="sm"
                        class="h-8 text-xs"
                        @click="layoutMode = layoutMode === 'split' ? 'visual' : 'split'"
                    >
                        {{ layoutMode === 'split' ? 'Visual Focus' : 'Split View' }}
                    </Button>

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

                <!-- Center Canvas + Bottom Panel -->
                <main class="flex min-w-0 flex-1 flex-col overflow-hidden">
                    <div class="min-h-0 flex-1">
                        <FigureCanvas
                            :scene="scene"
                            :selected-ids="selectedIds"
                            :active-tool="activeTool"
                            :viewport="viewport"
                            :can-edit="project.can_edit"
                            @update:selected-ids="selectedIds = $event"
                            @update:viewport="viewport = $event"
                            @commit-object-patch="handleCommitObjectPatch"
                            @place-object="handlePlaceObject"
                            @delete-selected="handleDeleteSelected"
                            @nudge-selected="handleNudgeSelected"
                        />
                    </div>

                    <div
                        v-if="layoutMode === 'split'"
                        class="h-48 shrink-0 border-t border-slate-200 bg-white"
                    >
                        <Tabs default-value="tikz" class="flex h-full flex-col">
                            <div class="flex items-center justify-between border-b border-slate-200 px-3 py-1">
                                <TabsList class="h-7">
                                    <TabsTrigger value="tikz" class="text-xs">
                                        Generated TikZ (Phase 1)
                                    </TabsTrigger>
                                    <TabsTrigger value="info" class="text-xs">
                                        Scene Summary
                                    </TabsTrigger>
                                </TabsList>
                                <span class="text-[11px] text-slate-500">
                                    Tip: Double-click any shape on the canvas to edit its label.
                                </span>
                            </div>
                            <TabsContent value="tikz" class="m-0 min-h-0 flex-1 overflow-auto p-3">
                                <pre class="font-mono text-xs text-slate-800">{{ generatedTikz }}</pre>
                            </TabsContent>
                            <TabsContent value="info" class="m-0 min-h-0 flex-1 overflow-auto p-3 text-xs text-slate-600">
                                <p>Schema Version: {{ scene.schema_version }}</p>
                                <p>Unit: {{ scene.unit }} | Grid Step: {{ scene.grid.step }}{{ scene.unit }}</p>
                                <p>Objects: {{ scene.objects.length }} | Layers: {{ scene.layers.length }}</p>
                            </TabsContent>
                        </Tabs>
                    </div>
                </main>

                <!-- Right Inspector -->
                <aside class="flex w-72 shrink-0 flex-col border-l border-slate-200 bg-white">
                    <div class="border-b border-slate-200 px-3 py-2.5">
                        <h2 class="text-xs font-semibold tracking-wide text-slate-600 uppercase">
                            {{ selectedObject ? `Object: ${selectedObject.tikzName}` : 'Canvas & Grid' }}
                        </h2>
                    </div>

                    <ScrollArea class="flex-1 p-3">
                        <div v-if="selectedObject" class="space-y-2">
                            <Accordion type="multiple" :default-value="['geometry', 'appearance', 'label']">
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
                                        <div>
                                            <Label class="text-[11px]">Label Text</Label>
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
                                        <Button
                                            v-if="project.can_edit"
                                            variant="destructive"
                                            size="sm"
                                            class="mt-2 w-full text-xs"
                                            @click="handleDeleteSelected"
                                        >
                                            <Trash2 class="mr-1.5 size-3.5" />
                                            Delete Object
                                        </Button>
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>

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
    </div>
</template>
