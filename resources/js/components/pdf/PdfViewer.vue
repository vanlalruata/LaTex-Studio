<script setup lang="ts">
import {
    AlertTriangle,
    ChevronLeft,
    ChevronRight,
    Download,
    FileText,
    ZoomIn,
    ZoomOut,
} from '@lucide/vue';
import * as pdfjsLib from 'pdfjs-dist';
import { onMounted, ref, watch } from 'vue';

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

const props = withDefaults(
    defineProps<{
        pdfUrl?: string | null;
        isStale?: boolean;
        isCompiling?: boolean;
        synctexEnabled?: boolean;
    }>(),
    {
        pdfUrl: null,
        isStale: false,
        isCompiling: false,
        synctexEnabled: false,
    },
);

const emit = defineEmits<{
    inverse: [payload: { page: number; x: number; y: number }];
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
const currentPage = ref(1);
const totalPages = ref(0);
const scale = ref(1.1);
const loadError = ref<string | null>(null);

let pdfDoc: pdfjsLib.PDFDocumentProxy | null = null;

async function renderPage(pageNumber: number): Promise<void> {
    if (!pdfDoc || !canvasRef.value) {
        return;
    }

    const page = await pdfDoc.getPage(pageNumber);
    const viewport = page.getViewport({ scale: scale.value });
    const canvas = canvasRef.value;
    const context = canvas.getContext('2d');

    if (!context) {
        return;
    }

    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({
        canvasContext: context,
        canvas,
        viewport,
    }).promise;
}

async function loadDocument(url: string | null | undefined): Promise<void> {
    loadError.value = null;

    if (!url) {
        pdfDoc = null;
        totalPages.value = 0;
        return;
    }

    try {
        const loadingTask = pdfjsLib.getDocument({
            url,
            withCredentials: true,
        });
        pdfDoc = await loadingTask.promise;
        totalPages.value = pdfDoc.numPages;
        currentPage.value = Math.min(currentPage.value, totalPages.value) || 1;
        await renderPage(currentPage.value);
    } catch {
        loadError.value = 'Unable to render PDF preview.';
        totalPages.value = 0;
    }
}

function zoomIn(): void {
    scale.value = Math.min(2.5, Number((scale.value + 0.15).toFixed(2)));
}

function zoomOut(): void {
    scale.value = Math.max(0.5, Number((scale.value - 0.15).toFixed(2)));
}

function prevPage(): void {
    if (currentPage.value > 1) {
        currentPage.value -= 1;
    }
}

function nextPage(): void {
    if (currentPage.value < totalPages.value) {
        currentPage.value += 1;
    }
}

async function handleCanvasClick(event: MouseEvent): Promise<void> {
    if (!props.synctexEnabled || !pdfDoc || !canvasRef.value) {
        return;
    }

    const page = await pdfDoc.getPage(currentPage.value);
    const viewport = page.getViewport({ scale: scale.value });
    const rect = canvasRef.value.getBoundingClientRect();
    const [pdfX, pdfY] = viewport.convertToPdfPoint(
        event.clientX - rect.left,
        event.clientY - rect.top,
    );
    const pageHeightPt = viewport.height / scale.value;

    emit('inverse', {
        page: currentPage.value,
        x: Math.max(0, Math.round(pdfX * 100) / 100),
        y: Math.max(0, Math.round((pageHeightPt - pdfY) * 100) / 100),
    });
}

function goToPage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= totalPages.value) {
        currentPage.value = pageNumber;
    }
}

defineExpose({ goToPage });

watch(() => props.pdfUrl, (url) => void loadDocument(url));
watch([currentPage, scale], () => void renderPage(currentPage.value));

onMounted(() => {
    if (props.pdfUrl) {
        void loadDocument(props.pdfUrl);
    }
});
</script>

<template>
    <div class="flex h-full flex-col bg-slate-100">
        <div
            class="flex items-center justify-between border-b border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-600"
        >
            <div class="flex items-center gap-1.5">
                <button
                    type="button"
                    class="rounded p-1 hover:bg-slate-100 disabled:opacity-40"
                    :disabled="currentPage <= 1"
                    title="Previous page"
                    @click="prevPage"
                >
                    <ChevronLeft class="size-3.5" />
                </button>
                <span class="tabular-nums">
                    {{ totalPages > 0 ? `${currentPage} / ${totalPages}` : '0 / 0' }}
                </span>
                <button
                    type="button"
                    class="rounded p-1 hover:bg-slate-100 disabled:opacity-40"
                    :disabled="currentPage >= totalPages"
                    title="Next page"
                    @click="nextPage"
                >
                    <ChevronRight class="size-3.5" />
                </button>
            </div>

            <div class="flex items-center gap-1.5">
                <button
                    type="button"
                    class="rounded p-1 hover:bg-slate-100"
                    title="Zoom out"
                    @click="zoomOut"
                >
                    <ZoomOut class="size-3.5" />
                </button>
                <span class="w-10 text-center tabular-nums">
                    {{ Math.round(scale * 100) }}%
                </span>
                <button
                    type="button"
                    class="rounded p-1 hover:bg-slate-100"
                    title="Zoom in"
                    @click="zoomIn"
                >
                    <ZoomIn class="size-3.5" />
                </button>
                <a
                    v-if="pdfUrl"
                    :href="pdfUrl"
                    download
                    class="ml-1 rounded p-1 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    title="Download PDF"
                >
                    <Download class="size-3.5" />
                </a>
            </div>
        </div>

        <div
            v-if="isStale && pdfUrl"
            class="flex items-center gap-2 border-b border-amber-200 bg-amber-50 px-3 py-1.5 text-xs text-amber-800"
        >
            <AlertTriangle class="size-3.5 shrink-0" />
            <span>Showing last successful PDF — source has unsaved or uncompiled changes.</span>
        </div>

        <div class="flex-1 overflow-auto p-4">
            <div v-if="loadError" class="flex h-full flex-col items-center justify-center text-center text-sm text-rose-600">
                <AlertTriangle class="mb-2 size-8 opacity-80" />
                <p>{{ loadError }}</p>
            </div>

            <div
                v-else-if="!pdfUrl"
                class="flex h-full flex-col items-center justify-center text-center text-slate-500"
            >
                <FileText class="mb-3 size-10 text-slate-300" />
                <p class="text-sm font-medium text-slate-700">No compiled PDF yet</p>
                <p class="mt-1 max-w-xs text-xs text-slate-500">
                    Click <strong class="font-semibold text-emerald-700">Compile</strong> to build your manuscript in an isolated TeX Live worker.
                </p>
            </div>

            <div v-else class="flex justify-center">
                <canvas
                    ref="canvasRef"
                    class="rounded border border-slate-200 bg-white shadow-sm"
                    :class="synctexEnabled ? 'cursor-crosshair' : ''"
                    :title="synctexEnabled ? 'Click to jump to the matching source line' : undefined"
                    @click="handleCanvasClick"
                />
            </div>
        </div>
    </div>
</template>
