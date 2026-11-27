<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import { latexToMathML } from '@/lib/mathRenderer';
import {
    getConnectorSvgPath,
    getObjectAnchorPorts,
} from '@/services/figureEditor/anchors';
import {
    PX_PER_UNIT,
    roundCoord,
    sceneSizeToTikz,
    sceneToTikz,
    screenToScene,
    snapToGrid,
    tikzSizeToScene,
    tikzToScene,
} from '@/services/figureEditor/coordinates';
import { computeFitBoxBounds } from '@/services/figureEditor/sceneHistory';
import type {
    ArrowTip,
    CanvasTool,
    ConnectorEndpoint,
    FigureConnector,
    FigureLayer,
    FigureObject,
    FigureSceneDocument,
    NodeAnchor,
    StrokeDash,
    ViewportState,
} from '@/services/figureEditor/types';

type ResizeHandle = 'nw' | 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w';

const props = defineProps<{
    scene: FigureSceneDocument;
    selectedIds: string[];
    activeTool: CanvasTool;
    viewport: ViewportState;
    canEdit: boolean;
}>();

const emit = defineEmits<{
    'update:selectedIds': [ids: string[]];
    'update:viewport': [viewport: ViewportState];
    'commit-object-patch': [id: string, patch: Partial<FigureObject>];
    'commit-connector-patch': [id: string, patch: Partial<FigureConnector>];
    'place-object': [shape: Exclude<CanvasTool, 'select' | 'pan' | 'connector'>, x: number, y: number];
    'create-connector': [from: ConnectorEndpoint, to: ConnectorEndpoint];
    'delete-selected': [];
    'nudge-selected': [dx: number, dy: number];
}>();

const svgRef = ref<SVGSVGElement | null>(null);
const editingObjectId = ref<string | null>(null);
const editingText = ref('');
const spacePressed = ref(false);
const hoveredObjectId = ref<string | null>(null);

const pendingConnectorStart = ref<ConnectorEndpoint | null>(null);
const pointerScenePos = ref<{ sx: number; sy: number; x: number; y: number } | null>(null);

const dragState = ref<{
    mode: 'pan' | 'move' | 'resize';
    startClientX: number;
    startClientY: number;
    startViewport: ViewportState;
    objectId?: string;
    startObject?: FigureObject;
    handle?: ResizeHandle;
    livePatch?: Partial<FigureObject>;
} | null>(null);

const layerMap = computed(() => {
    const map = new Map<string, FigureLayer>();
    for (const layer of props.scene.layers) {
        map.set(layer.id, layer);
    }
    return map;
});

const visibleObjects = computed(() => {
    return [...props.scene.objects]
        .filter((obj) => {
            if (!obj.visible) {
                return false;
            }
            const layer = layerMap.value.get(obj.layerId);
            return layer ? layer.visible : true;
        })
        .sort((a, b) => a.zIndex - b.zIndex)
        .map((obj) => {
            if (
                dragState.value &&
                dragState.value.objectId === obj.id &&
                dragState.value.livePatch
            ) {
                return { ...obj, ...dragState.value.livePatch };
            }
            return obj;
        });
});

const objectsById = computed(() => {
    return new Map(visibleObjects.value.map((obj) => [obj.id, obj]));
});

const visibleConnectors = computed(() => {
    return [...props.scene.connectors]
        .filter((conn) => {
            if (!conn.visible) {
                return false;
            }
            const layer = layerMap.value.get(conn.layerId);
            return layer ? layer.visible : true;
        })
        .sort((a, b) => a.zIndex - b.zIndex);
});

const selectedObjects = computed(() => {
    const set = new Set(props.selectedIds);
    return visibleObjects.value.filter((obj) => set.has(obj.id));
});

const gridStepPx = computed(() => {
    const step = Math.max(0.1, props.scene.grid.step);
    return step * PX_PER_UNIT[props.scene.unit];
});

const gridPatternId = computed(() => `tikz-grid-${props.scene.id}`);

const activePorts = computed(() => {
    if (props.activeTool !== 'connector' && !pendingConnectorStart.value) {
        return [];
    }
    if (!hoveredObjectId.value) {
        return [];
    }
    const obj = objectsById.value.get(hoveredObjectId.value);
    if (!obj) {
        return [];
    }
    return getObjectAnchorPorts(obj, props.scene.unit).map((p) => ({
        ...p,
        objectId: obj.id,
    }));
});

const pendingStartScene = computed(() => {
    if (!pendingConnectorStart.value) {
        return null;
    }
    const ep = pendingConnectorStart.value;
    if (ep.objectId) {
        const obj = objectsById.value.get(ep.objectId);
        if (obj) {
            const ports = getObjectAnchorPorts(obj, props.scene.unit);
            const matched = ports.find((p) => p.anchor === (ep.anchor ?? 'center'));
            if (matched) {
                return { sx: matched.sx, sy: matched.sy };
            }
            return tikzToScene(obj.x, obj.y, props.scene.unit);
        }
    }
    return tikzToScene(ep.x, ep.y, props.scene.unit);
});

function getSvgPoint(clientX: number, clientY: number): { vx: number; vy: number } {
    const el = svgRef.value;
    if (!el) {
        return { vx: clientX, vy: clientY };
    }
    const rect = el.getBoundingClientRect();
    return {
        vx: clientX - rect.left,
        vy: clientY - rect.top,
    };
}

function isObjectLocked(obj: FigureObject): boolean {
    if (!props.canEdit || obj.locked) {
        return true;
    }
    const layer = layerMap.value.get(obj.layerId);
    return layer ? layer.locked : false;
}

function getObjectScreenBox(obj: FigureObject): {
    cx: number;
    cy: number;
    left: number;
    top: number;
    width: number;
    height: number;
} {
    let x = obj.x;
    let y = obj.y;
    let width = obj.width;
    let height = obj.height;

    if (obj.kind === 'fit_box' && obj.fitTargetIds && obj.fitTargetIds.length > 0) {
        const bounds = computeFitBoxBounds(props.scene.objects, obj.fitTargetIds);
        if (bounds) {
            x = bounds.x;
            y = bounds.y;
            width = bounds.width;
            height = bounds.height;
        }
    }

    const center = tikzToScene(x, y, props.scene.unit);
    const size = tikzSizeToScene(width, height, props.scene.unit);
    return {
        cx: center.sx,
        cy: center.sy,
        left: center.sx - size.sw / 2,
        top: center.sy - size.sh / 2,
        width: size.sw,
        height: size.sh,
    };
}

function getObjectFill(obj: FigureObject): string {
    if (obj.style.pattern && obj.style.pattern !== 'none') {
        const key = obj.style.pattern.replace(/\s+/g, '-');
        return `url(#tikz-pat-${key})`;
    }
    return obj.style.fill === 'none' ? 'transparent' : obj.style.fill;
}

function getDiamondPoints(obj: FigureObject): string {
    const box = getObjectScreenBox(obj);
    return `${box.cx},${box.top} ${box.left + box.width},${box.cy} ${box.cx},${box.top + box.height} ${box.left},${box.cy}`;
}

function getStrokeDasharray(dash: StrokeDash): string | undefined {
    if (dash === 'dashed') {
        return '6 4';
    }
    if (dash === 'dotted') {
        return '2 3';
    }
    if (dash === 'dashdot') {
        return '6 3 2 3';
    }
    return undefined;
}

function getMarkerUrl(tip: ArrowTip, isStart: boolean): string | undefined {
    if (tip === 'none') {
        return undefined;
    }
    return `url(#arrow-${tip}-${isStart ? 'start' : 'end'})`;
}

function renderLabelHtml(label: string): string | null {
    if (!label.includes('$')) {
        return null;
    }
    const mathMatch = label.match(/\$([^$]+)\$/);
    if (!mathMatch) {
        return null;
    }
    return latexToMathML(mathMatch[1], false);
}

function handlePortPointerDown(
    event: PointerEvent,
    objectId: string,
    anchor: Exclude<NodeAnchor, 'auto'>,
    x: number,
    y: number,
): void {
    if (!props.canEdit) {
        return;
    }
    event.stopPropagation();
    const endpoint: ConnectorEndpoint = { objectId, anchor, x, y };
    if (!pendingConnectorStart.value) {
        pendingConnectorStart.value = endpoint;
    } else {
        emit('create-connector', pendingConnectorStart.value, endpoint);
        pendingConnectorStart.value = null;
    }
}

function handleCanvasPointerDown(event: PointerEvent): void {
    if (editingObjectId.value !== null) {
        commitInlineEdit();
    }

    const isPan =
        props.activeTool === 'pan' ||
        event.button === 1 ||
        spacePressed.value;

    if (isPan) {
        dragState.value = {
            mode: 'pan',
            startClientX: event.clientX,
            startClientY: event.clientY,
            startViewport: { ...props.viewport },
        };
        (event.currentTarget as SVGSVGElement).setPointerCapture(event.pointerId);
        return;
    }

    const { vx, vy } = getSvgPoint(event.clientX, event.clientY);
    const { sx, sy } = screenToScene(vx, vy, props.viewport);
    const tikz = sceneToTikz(sx, sy, props.scene.unit);
    const snappedX = snapToGrid(tikz.x, props.scene.grid.step, props.scene.grid.snap);
    const snappedY = snapToGrid(tikz.y, props.scene.grid.step, props.scene.grid.snap);

    const tool = props.activeTool;
    if (tool === 'connector') {
        if (props.canEdit) {
            const endpoint: ConnectorEndpoint = { x: snappedX, y: snappedY };
            if (!pendingConnectorStart.value) {
                pendingConnectorStart.value = endpoint;
            } else {
                emit('create-connector', pendingConnectorStart.value, endpoint);
                pendingConnectorStart.value = null;
            }
        }
        return;
    }

    if (tool !== 'select' && props.canEdit) {
        emit('place-object', tool, snappedX, snappedY);
        return;
    }

    if (event.target === svgRef.value) {
        emit('update:selectedIds', []);
    }
}

function handleObjectPointerDown(event: PointerEvent, obj: FigureObject): void {
    if (props.activeTool === 'pan' || spacePressed.value || event.button === 1) {
        return;
    }
    event.stopPropagation();

    if (props.activeTool === 'connector' && props.canEdit) {
        const endpoint: ConnectorEndpoint = {
            objectId: obj.id,
            anchor: obj.kind === 'coordinate' ? 'center' : 'auto',
            x: obj.x,
            y: obj.y,
        };
        if (!pendingConnectorStart.value) {
            pendingConnectorStart.value = endpoint;
        } else {
            emit('create-connector', pendingConnectorStart.value, endpoint);
            pendingConnectorStart.value = null;
        }
        return;
    }

    if (event.shiftKey) {
        const exists = props.selectedIds.includes(obj.id);
        const next = exists
            ? props.selectedIds.filter((id) => id !== obj.id)
            : [...props.selectedIds, obj.id];
        emit('update:selectedIds', next);
    } else {
        emit('update:selectedIds', [obj.id]);
    }

    if (isObjectLocked(obj)) {
        return;
    }

    dragState.value = {
        mode: 'move',
        startClientX: event.clientX,
        startClientY: event.clientY,
        startViewport: { ...props.viewport },
        objectId: obj.id,
        startObject: { ...obj },
    };
    svgRef.value?.setPointerCapture(event.pointerId);
}

function handleConnectorPointerDown(event: PointerEvent, conn: FigureConnector): void {
    if (props.activeTool === 'pan' || spacePressed.value || event.button === 1) {
        return;
    }
    event.stopPropagation();
    emit('update:selectedIds', [conn.id]);
}

function handleResizePointerDown(
    event: PointerEvent,
    obj: FigureObject,
    handle: ResizeHandle,
): void {
    if (isObjectLocked(obj)) {
        return;
    }
    event.stopPropagation();

    dragState.value = {
        mode: 'resize',
        startClientX: event.clientX,
        startClientY: event.clientY,
        startViewport: { ...props.viewport },
        objectId: obj.id,
        startObject: { ...obj },
        handle,
    };
    svgRef.value?.setPointerCapture(event.pointerId);
}

function handlePointerMove(event: PointerEvent): void {
    const { vx, vy } = getSvgPoint(event.clientX, event.clientY);
    const scenePt = screenToScene(vx, vy, props.viewport);
    const tikzPt = sceneToTikz(scenePt.sx, scenePt.sy, props.scene.unit);
    pointerScenePos.value = { sx: scenePt.sx, sy: scenePt.sy, x: tikzPt.x, y: tikzPt.y };

    const state = dragState.value;
    if (!state) {
        return;
    }

    const dxScreen = event.clientX - state.startClientX;
    const dyScreen = event.clientY - state.startClientY;

    if (state.mode === 'pan') {
        emit('update:viewport', {
            ...state.startViewport,
            panX: state.startViewport.panX + dxScreen,
            panY: state.startViewport.panY + dyScreen,
        });
        return;
    }

    if (!state.startObject || !state.objectId) {
        return;
    }

    const dxScene = dxScreen / state.startViewport.zoom;
    const dyScene = dyScreen / state.startViewport.zoom;
    const scale = PX_PER_UNIT[props.scene.unit];

    if (state.mode === 'move') {
        const rawX = state.startObject.x + dxScene / scale;
        const rawY = state.startObject.y - dyScene / scale;
        const x = snapToGrid(rawX, props.scene.grid.step, props.scene.grid.snap);
        const y = snapToGrid(rawY, props.scene.grid.step, props.scene.grid.snap);
        state.livePatch = { x, y };
        return;
    }

    if (state.mode === 'resize' && state.handle) {
        const startBox = getObjectScreenBox(state.startObject);
        let left = startBox.left;
        let right = startBox.left + startBox.width;
        let top = startBox.top;
        let bottom = startBox.top + startBox.height;

        if (state.handle.includes('w')) {
            left += dxScene;
        }
        if (state.handle.includes('e')) {
            right += dxScene;
        }
        if (state.handle.includes('n')) {
            top += dyScene;
        }
        if (state.handle.includes('s')) {
            bottom += dyScene;
        }

        const minPx = 14;
        if (right - left < minPx) {
            if (state.handle.includes('w')) {
                left = right - minPx;
            } else {
                right = left + minPx;
            }
        }
        if (bottom - top < minPx) {
            if (state.handle.includes('n')) {
                top = bottom - minPx;
            } else {
                bottom = top + minPx;
            }
        }

        const sw = right - left;
        const sh = bottom - top;
        const cx = left + sw / 2;
        const cy = top + sh / 2;

        const tikzPos = sceneToTikz(cx, cy, props.scene.unit);
        const tikzSize = sceneSizeToTikz(sw, sh, props.scene.unit);

        if (state.startObject.shape === 'circle') {
            const diameter = Math.max(tikzSize.width, tikzSize.height);
            tikzSize.width = diameter;
            tikzSize.height = diameter;
        }

        state.livePatch = {
            x: snapToGrid(tikzPos.x, props.scene.grid.step, props.scene.grid.snap),
            y: snapToGrid(tikzPos.y, props.scene.grid.step, props.scene.grid.snap),
            width: roundCoord(tikzSize.width),
            height: roundCoord(tikzSize.height),
        };
    }
}

function handlePointerUp(event: PointerEvent): void {
    const state = dragState.value;
    if (!state) {
        return;
    }

    if (
        (state.mode === 'move' || state.mode === 'resize') &&
        state.objectId &&
        state.livePatch
    ) {
        emit('commit-object-patch', state.objectId, state.livePatch);
    }

    dragState.value = null;
    try {
        svgRef.value?.releasePointerCapture(event.pointerId);
    } catch {
        // Ignore if pointer capture was not active.
    }
}

function handleWheel(event: WheelEvent): void {
    event.preventDefault();
    const { vx, vy } = getSvgPoint(event.clientX, event.clientY);
    const zoomFactor = event.deltaY < 0 ? 1.1 : 0.9;
    const nextZoom = Math.min(4, Math.max(0.25, roundCoord(props.viewport.zoom * zoomFactor, 3)));
    const scaleRatio = nextZoom / props.viewport.zoom;

    emit('update:viewport', {
        zoom: nextZoom,
        panX: vx - (vx - props.viewport.panX) * scaleRatio,
        panY: vy - (vy - props.viewport.panY) * scaleRatio,
    });
}

function startInlineEdit(obj: FigureObject): void {
    if (isObjectLocked(obj) || obj.kind === 'coordinate') {
        return;
    }
    editingObjectId.value = obj.id;
    editingText.value = obj.label;
}

function commitInlineEdit(): void {
    if (editingObjectId.value === null) {
        return;
    }
    emit('commit-object-patch', editingObjectId.value, {
        label: editingText.value,
    });
    editingObjectId.value = null;
}

function handleKeyDown(event: KeyboardEvent): void {
    if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
    ) {
        return;
    }

    if (event.key === 'Escape' && pendingConnectorStart.value) {
        pendingConnectorStart.value = null;
        return;
    }

    if (event.code === 'Space') {
        spacePressed.value = true;
    }

    if (
        (event.key === 'Delete' || event.key === 'Backspace') &&
        props.selectedIds.length > 0 &&
        props.canEdit
    ) {
        event.preventDefault();
        emit('delete-selected');
        return;
    }

    const step = event.shiftKey
        ? props.scene.grid.step * 2
        : Math.max(0.1, props.scene.grid.step / 2);

    if (event.key === 'ArrowLeft') {
        event.preventDefault();
        emit('nudge-selected', -step, 0);
    } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        emit('nudge-selected', step, 0);
    } else if (event.key === 'ArrowUp') {
        event.preventDefault();
        emit('nudge-selected', 0, step);
    } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        emit('nudge-selected', 0, -step);
    }
}

function handleKeyUp(event: KeyboardEvent): void {
    if (event.code === 'Space') {
        spacePressed.value = false;
    }
}

onBeforeUnmount(() => {
    dragState.value = null;
});

function getHandles(obj: FigureObject): Array<{ id: ResizeHandle; x: number; y: number; cursor: string }> {
    const box = getObjectScreenBox(obj);
    return [
        { id: 'nw', x: box.left, y: box.top, cursor: 'nwse-resize' },
        { id: 'n', x: box.cx, y: box.top, cursor: 'ns-resize' },
        { id: 'ne', x: box.left + box.width, y: box.top, cursor: 'nesw-resize' },
        { id: 'e', x: box.left + box.width, y: box.cy, cursor: 'ew-resize' },
        { id: 'se', x: box.left + box.width, y: box.top + box.height, cursor: 'nwse-resize' },
        { id: 's', x: box.cx, y: box.top + box.height, cursor: 'ns-resize' },
        { id: 'sw', x: box.left, y: box.top + box.height, cursor: 'nesw-resize' },
        { id: 'w', x: box.left, y: box.cy, cursor: 'ew-resize' },
    ];
}
</script>

<template>
    <div
        class="relative h-full w-full overflow-hidden bg-slate-50 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
        tabindex="0"
        role="region"
        aria-label="TikZ Visual Canvas"
        @keydown="handleKeyDown"
        @keyup="handleKeyUp"
    >
        <div class="sr-only" aria-live="polite">
            {{
                selectedObjects.length === 1
                    ? `Selected ${selectedObjects[0].tikzName} at (${selectedObjects[0].x}, ${selectedObjects[0].y})`
                    : `${selectedIds.length} items selected`
            }}
        </div>
        <svg
            ref="svgRef"
            class="h-full w-full"
            :class="
                activeTool === 'pan' || spacePressed
                    ? 'cursor-grab active:cursor-grabbing'
                    : activeTool !== 'select'
                      ? 'cursor-crosshair'
                      : 'cursor-default'
            "
            @pointerdown="handleCanvasPointerDown"
            @pointermove="handlePointerMove"
            @pointerup="handlePointerUp"
            @wheel.prevent="handleWheel"
        >
            <defs>
                <pattern
                    v-if="scene.grid.enabled"
                    :id="gridPatternId"
                    :width="gridStepPx"
                    :height="gridStepPx"
                    patternUnits="userSpaceOnUse"
                    :patternTransform="`translate(${viewport.panX} ${viewport.panY}) scale(${viewport.zoom})`"
                >
                    <path
                        :d="`M ${gridStepPx} 0 L 0 0 0 ${gridStepPx}`"
                        fill="none"
                        stroke="#e2e8f0"
                        :stroke-width="1 / viewport.zoom"
                    />
                </pattern>

                <!-- TikZ Fill Patterns -->
                <pattern id="tikz-pat-north-east-lines" width="8" height="8" patternUnits="userSpaceOnUse">
                    <path d="M 0 8 L 8 0 M -2 2 L 2 -2 M 6 10 L 10 6" stroke="#475569" stroke-width="1" />
                </pattern>
                <pattern id="tikz-pat-north-west-lines" width="8" height="8" patternUnits="userSpaceOnUse">
                    <path d="M 0 0 L 8 8 M -2 6 L 2 10 M 6 -2 L 10 2" stroke="#475569" stroke-width="1" />
                </pattern>
                <pattern id="tikz-pat-grid" width="8" height="8" patternUnits="userSpaceOnUse">
                    <path d="M 8 0 L 0 0 0 8" fill="none" stroke="#475569" stroke-width="0.8" />
                </pattern>
                <pattern id="tikz-pat-dots" width="8" height="8" patternUnits="userSpaceOnUse">
                    <circle cx="4" cy="4" r="1.2" fill="#475569" />
                </pattern>
                <pattern id="tikz-pat-crosshatch" width="8" height="8" patternUnits="userSpaceOnUse">
                    <path d="M 0 8 L 8 0 M 0 0 L 8 8" stroke="#475569" stroke-width="0.8" />
                </pattern>

                <!-- Arrowhead Markers -->
                <marker id="arrow-Stealth-end" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                    <path d="M 0 1 L 10 5 L 0 9 L 2.5 5 z" fill="context-stroke" />
                </marker>
                <marker id="arrow-Stealth-start" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="7" markerHeight="7" orient="auto">
                    <path d="M 10 1 L 0 5 L 10 9 L 7.5 5 z" fill="context-stroke" />
                </marker>
                <marker id="arrow-Latex-end" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                    <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="context-stroke" />
                </marker>
                <marker id="arrow-Latex-start" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="7" markerHeight="7" orient="auto">
                    <path d="M 10 1.5 L 0 5 L 10 8.5 z" fill="context-stroke" />
                </marker>
                <marker id="arrow-To-end" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                    <path d="M 1 1.5 L 9 5 L 1 8.5" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" />
                </marker>
                <marker id="arrow-To-start" viewBox="0 0 10 10" refX="2" refY="5" markerWidth="7" markerHeight="7" orient="auto">
                    <path d="M 9 1.5 L 1 5 L 9 8.5" fill="none" stroke="context-stroke" stroke-width="1.5" stroke-linecap="round" />
                </marker>
                <marker id="arrow-Circle-end" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                    <circle cx="5" cy="5" r="3" fill="context-stroke" />
                </marker>
                <marker id="arrow-Circle-start" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                    <circle cx="5" cy="5" r="3" fill="context-stroke" />
                </marker>
                <marker id="arrow-Bar-end" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="8" orient="auto">
                    <line x1="5" y1="1" x2="5" y2="9" stroke="context-stroke" stroke-width="2" />
                </marker>
                <marker id="arrow-Bar-start" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="8" orient="auto">
                    <line x1="5" y1="1" x2="5" y2="9" stroke="context-stroke" stroke-width="2" />
                </marker>
            </defs>

            <rect
                v-if="scene.grid.enabled"
                width="100%"
                height="100%"
                :fill="`url(#${gridPatternId})`"
                pointer-events="none"
            />

            <g :transform="`translate(${viewport.panX} ${viewport.panY}) scale(${viewport.zoom})`">
                <!-- TikZ Origin Axes -->
                <line x1="-2000" y1="0" x2="2000" y2="0" stroke="#cbd5e1" :stroke-width="1 / viewport.zoom" stroke-dasharray="4 4" pointer-events="none" />
                <line x1="0" y1="-2000" x2="0" y2="2000" stroke="#cbd5e1" :stroke-width="1 / viewport.zoom" stroke-dasharray="4 4" pointer-events="none" />
                <circle cx="0" cy="0" r="3" fill="#94a3b8" pointer-events="none" />

                <!-- Connectors -->
                <g
                    v-for="conn in visibleConnectors"
                    :key="conn.id"
                    class="cursor-pointer"
                    @pointerdown="handleConnectorPointerDown($event, conn)"
                >
                    <path
                        :d="getConnectorSvgPath(conn, objectsById, scene.unit).d"
                        fill="none"
                        stroke="transparent"
                        stroke-width="12"
                    />
                    <path
                        :d="getConnectorSvgPath(conn, objectsById, scene.unit).d"
                        fill="none"
                        :stroke="selectedIds.includes(conn.id) ? '#4f46e5' : conn.style.stroke"
                        :stroke-width="conn.style.strokeWidthPt * 1.4"
                        :stroke-dasharray="getStrokeDasharray(conn.style.dash)"
                        :marker-start="getMarkerUrl(conn.arrowStart, true)"
                        :marker-end="getMarkerUrl(conn.arrowEnd, false)"
                    />
                    <g v-if="conn.label.trim().length > 0">
                        <foreignObject
                            v-if="renderLabelHtml(conn.label)"
                            :x="getConnectorSvgPath(conn, objectsById, scene.unit).mid.sx - 45"
                            :y="getConnectorSvgPath(conn, objectsById, scene.unit).mid.sy - (conn.labelPosition === 'below' ? -4 : 24)"
                            width="90"
                            height="24"
                            class="pointer-events-none"
                        >
                            <div
                                class="flex h-full items-center justify-center rounded bg-white/85 px-1 text-[11px] font-medium"
                                :style="{ color: conn.style.textColor }"
                                v-html="renderLabelHtml(conn.label)"
                            />
                        </foreignObject>
                        <text
                            v-else
                            :x="getConnectorSvgPath(conn, objectsById, scene.unit).mid.sx"
                            :y="getConnectorSvgPath(conn, objectsById, scene.unit).mid.sy + (conn.labelPosition === 'below' ? 14 : -8)"
                            text-anchor="middle"
                            :fill="conn.style.textColor"
                            class="pointer-events-none text-[11px] font-medium"
                        >
                            {{ conn.label }}
                        </text>
                    </g>
                </g>

                <!-- Pending Connector Preview -->
                <line
                    v-if="pendingStartScene && pointerScenePos"
                    :x1="pendingStartScene.sx"
                    :y1="pendingStartScene.sy"
                    :x2="pointerScenePos.sx"
                    :y2="pointerScenePos.sy"
                    stroke="#4f46e5"
                    stroke-width="1.5"
                    stroke-dasharray="4 4"
                    pointer-events="none"
                />

                <!-- Scene Objects -->
                <g
                    v-for="obj in visibleObjects"
                    :key="obj.id"
                    :transform="
                        obj.rotationDeg !== 0
                            ? `rotate(${-obj.rotationDeg} ${getObjectScreenBox(obj).cx} ${getObjectScreenBox(obj).cy})`
                            : undefined
                    "
                    class="cursor-move"
                    @pointerenter="hoveredObjectId = obj.id"
                    @pointerleave="hoveredObjectId === obj.id && (hoveredObjectId = null)"
                    @pointerdown="handleObjectPointerDown($event, obj)"
                    @dblclick.stop="startInlineEdit(obj)"
                >
                    <g v-if="obj.kind === 'coordinate'">
                        <circle
                            :cx="getObjectScreenBox(obj).cx"
                            :cy="getObjectScreenBox(obj).cy"
                            r="5"
                            :fill="obj.style.fill"
                            stroke="#ffffff"
                            stroke-width="1.5"
                        />
                        <text
                            :x="getObjectScreenBox(obj).cx + 8"
                            :y="getObjectScreenBox(obj).cy - 6"
                            class="pointer-events-none font-mono text-[10px] fill-indigo-700"
                        >
                            ({{ obj.tikzName }})
                        </text>
                    </g>

                    <g v-else-if="obj.kind === 'fit_box'">
                        <rect
                            :x="getObjectScreenBox(obj).left"
                            :y="getObjectScreenBox(obj).top"
                            :width="getObjectScreenBox(obj).width"
                            :height="getObjectScreenBox(obj).height"
                            :rx="obj.style.roundedCornersPt"
                            :ry="obj.style.roundedCornersPt"
                            :fill="getObjectFill(obj)"
                            :fill-opacity="obj.style.fillOpacity"
                            :stroke="obj.style.stroke === 'none' ? 'transparent' : obj.style.stroke"
                            :stroke-width="obj.style.strokeWidthPt * 1.33"
                            :stroke-dasharray="getStrokeDasharray(obj.style.dash)"
                        />
                        <text
                            v-if="obj.label"
                            :x="getObjectScreenBox(obj).left + 8"
                            :y="getObjectScreenBox(obj).top + 14"
                            :fill="obj.style.textColor"
                            class="pointer-events-none text-[11px] font-semibold"
                        >
                            {{ obj.label }}
                        </text>
                    </g>

                    <g v-else-if="obj.kind === 'matrix'">
                        <rect
                            :x="getObjectScreenBox(obj).left"
                            :y="getObjectScreenBox(obj).top"
                            :width="getObjectScreenBox(obj).width"
                            :height="getObjectScreenBox(obj).height"
                            fill="#ffffff"
                            fill-opacity="0.9"
                            stroke="#64748b"
                            stroke-dasharray="3 2"
                            stroke-width="1"
                        />
                        <foreignObject
                            :x="getObjectScreenBox(obj).left + 4"
                            :y="getObjectScreenBox(obj).top + 4"
                            :width="Math.max(20, getObjectScreenBox(obj).width - 8)"
                            :height="Math.max(20, getObjectScreenBox(obj).height - 8)"
                            class="pointer-events-none"
                        >
                            <div class="flex h-full w-full flex-col justify-center gap-1">
                                <div
                                    v-for="(row, rIdx) in obj.matrixCells ?? [['A', 'B']]"
                                    :key="rIdx"
                                    class="flex flex-1 gap-1"
                                >
                                    <div
                                        v-for="(cell, cIdx) in row"
                                        :key="cIdx"
                                        class="flex flex-1 items-center justify-center rounded border border-slate-300 bg-slate-50 text-[10px]"
                                    >
                                        {{ cell }}
                                    </div>
                                </div>
                            </div>
                        </foreignObject>
                    </g>

                    <rect
                        v-else-if="obj.shape === 'rectangle' || obj.shape === 'rounded_rectangle'"
                        :x="getObjectScreenBox(obj).left"
                        :y="getObjectScreenBox(obj).top"
                        :width="getObjectScreenBox(obj).width"
                        :height="getObjectScreenBox(obj).height"
                        :rx="obj.shape === 'rounded_rectangle' ? obj.style.roundedCornersPt : 0"
                        :ry="obj.shape === 'rounded_rectangle' ? obj.style.roundedCornersPt : 0"
                        :fill="getObjectFill(obj)"
                        :fill-opacity="obj.style.fillOpacity"
                        :stroke="obj.style.stroke === 'none' ? 'transparent' : obj.style.stroke"
                        :stroke-width="obj.style.strokeWidthPt * 1.33"
                        :stroke-dasharray="getStrokeDasharray(obj.style.dash)"
                    />

                    <circle
                        v-else-if="obj.shape === 'circle'"
                        :cx="getObjectScreenBox(obj).cx"
                        :cy="getObjectScreenBox(obj).cy"
                        :r="Math.min(getObjectScreenBox(obj).width, getObjectScreenBox(obj).height) / 2"
                        :fill="getObjectFill(obj)"
                        :fill-opacity="obj.style.fillOpacity"
                        :stroke="obj.style.stroke === 'none' ? 'transparent' : obj.style.stroke"
                        :stroke-width="obj.style.strokeWidthPt * 1.33"
                        :stroke-dasharray="getStrokeDasharray(obj.style.dash)"
                    />

                    <ellipse
                        v-else-if="obj.shape === 'ellipse'"
                        :cx="getObjectScreenBox(obj).cx"
                        :cy="getObjectScreenBox(obj).cy"
                        :rx="getObjectScreenBox(obj).width / 2"
                        :ry="getObjectScreenBox(obj).height / 2"
                        :fill="getObjectFill(obj)"
                        :fill-opacity="obj.style.fillOpacity"
                        :stroke="obj.style.stroke === 'none' ? 'transparent' : obj.style.stroke"
                        :stroke-width="obj.style.strokeWidthPt * 1.33"
                        :stroke-dasharray="getStrokeDasharray(obj.style.dash)"
                    />

                    <polygon
                        v-else-if="obj.shape === 'diamond'"
                        :points="getDiamondPoints(obj)"
                        :fill="getObjectFill(obj)"
                        :fill-opacity="obj.style.fillOpacity"
                        :stroke="obj.style.stroke === 'none' ? 'transparent' : obj.style.stroke"
                        :stroke-width="obj.style.strokeWidthPt * 1.33"
                        :stroke-dasharray="getStrokeDasharray(obj.style.dash)"
                    />

                    <rect
                        v-else
                        :x="getObjectScreenBox(obj).left"
                        :y="getObjectScreenBox(obj).top"
                        :width="getObjectScreenBox(obj).width"
                        :height="getObjectScreenBox(obj).height"
                        fill="transparent"
                        stroke="transparent"
                    />

                    <template v-if="obj.kind !== 'coordinate'">
                        <foreignObject
                            v-if="editingObjectId !== obj.id && renderLabelHtml(obj.label)"
                            :x="getObjectScreenBox(obj).left + 4"
                            :y="getObjectScreenBox(obj).top + 4"
                            :width="Math.max(20, getObjectScreenBox(obj).width - 8)"
                            :height="Math.max(20, getObjectScreenBox(obj).height - 8)"
                            class="pointer-events-none"
                        >
                            <div
                                class="flex h-full w-full items-center justify-center text-center text-xs font-medium"
                                :style="{ color: obj.style.textColor }"
                                v-html="renderLabelHtml(obj.label)"
                            />
                        </foreignObject>

                        <text
                            v-else-if="editingObjectId !== obj.id"
                            :x="getObjectScreenBox(obj).cx"
                            :y="getObjectScreenBox(obj).cy"
                            text-anchor="middle"
                            dominant-baseline="central"
                            :fill="obj.style.textColor"
                            class="pointer-events-none text-xs font-medium"
                        >
                            {{ obj.label }}
                        </text>

                        <foreignObject
                            v-else
                            :x="getObjectScreenBox(obj).left + 4"
                            :y="getObjectScreenBox(obj).cy - 14"
                            :width="Math.max(40, getObjectScreenBox(obj).width - 8)"
                            height="28"
                        >
                            <input
                                v-model="editingText"
                                type="text"
                                autofocus
                                class="h-full w-full rounded border border-indigo-500 bg-white px-1.5 text-center text-xs text-slate-900 outline-none"
                                @keydown.enter.stop="commitInlineEdit"
                                @keydown.escape.stop="editingObjectId = null"
                                @blur="commitInlineEdit"
                            />
                        </foreignObject>
                    </template>
                </g>

                <!-- Anchor Ports when drawing connectors -->
                <g v-for="port in activePorts" :key="`port-${port.objectId}-${port.anchor}`">
                    <circle
                        :cx="port.sx"
                        :cy="port.sy"
                        :r="4.5 / viewport.zoom"
                        fill="#ffffff"
                        stroke="#4f46e5"
                        :stroke-width="1.5 / viewport.zoom"
                        class="cursor-crosshair hover:fill-indigo-600"
                        @pointerdown="handlePortPointerDown($event, port.objectId, port.anchor, port.x, port.y)"
                    />
                </g>

                <!-- Selection Outlines & Resize Handles -->
                <g v-for="obj in selectedObjects" :key="`sel-${obj.id}`">
                    <rect
                        :x="getObjectScreenBox(obj).left"
                        :y="getObjectScreenBox(obj).top"
                        :width="getObjectScreenBox(obj).width"
                        :height="getObjectScreenBox(obj).height"
                        fill="none"
                        stroke="#4f46e5"
                        :stroke-width="1.5 / viewport.zoom"
                        :stroke-dasharray="`${4 / viewport.zoom} ${2 / viewport.zoom}`"
                        pointer-events="none"
                    />
                    <template v-if="obj.kind !== 'coordinate'">
                        <rect
                            v-for="handle in getHandles(obj)"
                            :key="handle.id"
                            :x="handle.x - 4 / viewport.zoom"
                            :y="handle.y - 4 / viewport.zoom"
                            :width="8 / viewport.zoom"
                            :height="8 / viewport.zoom"
                            fill="#ffffff"
                            stroke="#4f46e5"
                            :stroke-width="1.5 / viewport.zoom"
                            :style="{ cursor: handle.cursor }"
                            @pointerdown="handleResizePointerDown($event, obj, handle.id)"
                        />
                    </template>
                </g>
            </g>
        </svg>

        <!-- Canvas HUD -->
        <div
            class="pointer-events-none absolute right-3 bottom-3 flex items-center gap-2 rounded-md border border-slate-200 bg-white/90 px-2.5 py-1 text-[11px] font-medium text-slate-600 shadow-xs backdrop-blur-xs"
        >
            <span v-if="pendingConnectorStart" class="font-semibold text-indigo-600">
                Click target node/port (Esc to cancel)
            </span>
            <span v-if="pendingConnectorStart" class="text-slate-300">|</span>
            <span>Zoom: {{ Math.round(viewport.zoom * 100) }}%</span>
            <span class="text-slate-300">|</span>
            <span>Unit: {{ scene.unit }}</span>
            <span class="text-slate-300">|</span>
            <span>Nodes: {{ scene.objects.length }} · Edges: {{ scene.connectors.length }}</span>
        </div>
    </div>
</template>
