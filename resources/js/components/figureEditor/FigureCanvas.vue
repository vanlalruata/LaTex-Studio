<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
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
import type {
    CanvasTool,
    FigureLayer,
    FigureObject,
    FigureSceneDocument,
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
    'place-object': [shape: Exclude<CanvasTool, 'select' | 'pan'>, x: number, y: number];
    'delete-selected': [];
    'nudge-selected': [dx: number, dy: number];
}>();

const svgRef = ref<SVGSVGElement | null>(null);
const editingObjectId = ref<string | null>(null);
const editingText = ref('');
const spacePressed = ref(false);

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

const selectedObjects = computed(() => {
    const set = new Set(props.selectedIds);
    return visibleObjects.value.filter((obj) => set.has(obj.id));
});

const gridStepPx = computed(() => {
    const step = Math.max(0.1, props.scene.grid.step);
    return step * PX_PER_UNIT[props.scene.unit];
});

const gridPatternId = computed(() => `tikz-grid-${props.scene.id}`);

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
    const center = tikzToScene(obj.x, obj.y, props.scene.unit);
    const size = tikzSizeToScene(obj.width, obj.height, props.scene.unit);
    return {
        cx: center.sx,
        cy: center.sy,
        left: center.sx - size.sw / 2,
        top: center.sy - size.sh / 2,
        width: size.sw,
        height: size.sh,
    };
}

function getDiamondPoints(obj: FigureObject): string {
    const box = getObjectScreenBox(obj);
    const top = `${box.cx},${box.top}`;
    const right = `${box.left + box.width},${box.cy}`;
    const bottom = `${box.cx},${box.top + box.height}`;
    const left = `${box.left},${box.cy}`;
    return `${top} ${right} ${bottom} ${left}`;
}

function getStrokeDasharray(dash: FigureObject['style']['dash']): string | undefined {
    if (dash === 'dashed') {
        return '6 4';
    }
    if (dash === 'dotted') {
        return '2 3';
    }
    return undefined;
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

    if (props.activeTool !== 'select' && props.canEdit) {
        const { vx, vy } = getSvgPoint(event.clientX, event.clientY);
        const { sx, sy } = screenToScene(vx, vy, props.viewport);
        const tikz = sceneToTikz(sx, sy, props.scene.unit);
        const snappedX = snapToGrid(tikz.x, props.scene.grid.step, props.scene.grid.snap);
        const snappedY = snapToGrid(tikz.y, props.scene.grid.step, props.scene.grid.snap);
        emit('place-object', props.activeTool, snappedX, snappedY);
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
    if (isObjectLocked(obj)) {
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
        class="relative h-full w-full overflow-hidden bg-slate-50 select-none focus:outline-none"
        tabindex="0"
        aria-label="TikZ Visual Canvas"
        @keydown="handleKeyDown"
        @keyup="handleKeyUp"
    >
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
                <line
                    x1="-2000"
                    y1="0"
                    x2="2000"
                    y2="0"
                    stroke="#cbd5e1"
                    :stroke-width="1 / viewport.zoom"
                    stroke-dasharray="4 4"
                    pointer-events="none"
                />
                <line
                    x1="0"
                    y1="-2000"
                    x2="0"
                    y2="2000"
                    stroke="#cbd5e1"
                    :stroke-width="1 / viewport.zoom"
                    stroke-dasharray="4 4"
                    pointer-events="none"
                />
                <circle cx="0" cy="0" r="3" fill="#94a3b8" pointer-events="none" />

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
                    @pointerdown="handleObjectPointerDown($event, obj)"
                    @dblclick.stop="startInlineEdit(obj)"
                >
                    <rect
                        v-if="obj.shape === 'rectangle' || obj.shape === 'rounded_rectangle'"
                        :x="getObjectScreenBox(obj).left"
                        :y="getObjectScreenBox(obj).top"
                        :width="getObjectScreenBox(obj).width"
                        :height="getObjectScreenBox(obj).height"
                        :rx="obj.shape === 'rounded_rectangle' ? obj.style.roundedCornersPt : 0"
                        :ry="obj.shape === 'rounded_rectangle' ? obj.style.roundedCornersPt : 0"
                        :fill="obj.style.fill === 'none' ? 'transparent' : obj.style.fill"
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
                        :fill="obj.style.fill === 'none' ? 'transparent' : obj.style.fill"
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
                        :fill="obj.style.fill === 'none' ? 'transparent' : obj.style.fill"
                        :fill-opacity="obj.style.fillOpacity"
                        :stroke="obj.style.stroke === 'none' ? 'transparent' : obj.style.stroke"
                        :stroke-width="obj.style.strokeWidthPt * 1.33"
                        :stroke-dasharray="getStrokeDasharray(obj.style.dash)"
                    />

                    <polygon
                        v-else-if="obj.shape === 'diamond'"
                        :points="getDiamondPoints(obj)"
                        :fill="obj.style.fill === 'none' ? 'transparent' : obj.style.fill"
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

                    <text
                        v-if="editingObjectId !== obj.id"
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
                </g>
            </g>
        </svg>

        <!-- Canvas HUD -->
        <div
            class="pointer-events-none absolute right-3 bottom-3 flex items-center gap-2 rounded-md border border-slate-200 bg-white/90 px-2.5 py-1 text-[11px] font-medium text-slate-600 shadow-xs backdrop-blur-xs"
        >
            <span>Zoom: {{ Math.round(viewport.zoom * 100) }}%</span>
            <span class="text-slate-300">|</span>
            <span>Unit: {{ scene.unit }}</span>
            <span class="text-slate-300">|</span>
            <span>Objects: {{ scene.objects.length }}</span>
        </div>
    </div>
</template>
