<script setup lang="ts">
import { Head, Link, router } from '@inertiajs/vue3';
import {
    AlertCircle,
    AlertTriangle,
    ArrowLeft,
    Bold,
    CheckCircle2,
    Columns3,
    Copy,
    Download,
    Italic,
    MoreHorizontal,
    MoveDown,
    MoveLeft,
    MoveRight,
    MoveUp,
    Plus,
    Redo2,
    RotateCw,
    Rows3,
    Save,
    Split,
    TableCellsMerge,
    Trash2,
    Underline,
    Undo2,
} from '@lucide/vue';
import { computed, ref, watch } from 'vue';
import { toast } from 'vue-sonner';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Toaster } from '@/components/ui/sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { latexToMathML } from '@/lib/mathRenderer';
import projectsRoutes from '@/routes/projects';
import {
    analyzeSelection,
    clearCells,
    mergeSelectedCells,
    moveColumn,
    moveRow,
    splitMergedCell,
} from '@/services/tableDesigner/cellOperations';
import { generateTableLatex } from '@/services/tableDesigner/latexGenerator';
import {
    cellKey,
    createDefaultTableDocument,
    makeId,
    type BorderLineStyle,
    type ColumnType,
    type ContentMode,
    type HorizontalAlign,
    type TableColumn,
    type TableDocument,
    type TableRow,
} from '@/types/tableDesigner';

interface SavedDesign {
    public_id: string;
    name: string;
    schema_version: number;
    document_json: TableDocument;
    generated_latex: string;
    status: 'visual' | 'source_only';
    updated_at: string | null;
}

const props = defineProps<{
    project: {
        public_id: string;
        title: string;
        can_edit: boolean;
    };
    tableDesigns: SavedDesign[];
    activeDesign: SavedDesign | null;
}>();

const activePublicId = ref<string | null>(props.activeDesign?.public_id ?? null);
const doc = ref<TableDocument>(
    props.activeDesign?.document_json
        ? structuredClone(props.activeDesign.document_json)
        : createDefaultTableDocument('Table 1'),
);

const undoStack = ref<string[]>([]);
const redoStack = ref<string[]>([]);
const isSaving = ref(false);
const hasUnsavedChanges = ref(false);
const deleteDialogOpen = ref(false);
const splitDialogOpen = ref(false);
const isDraggingRange = ref(false);
const dragAnchor = ref<{ rowIdx: number; colIdx: number } | null>(null);

const selectionMode = ref<'cell' | 'row' | 'column' | 'table'>('cell');
const selectedRowId = ref<string | null>(doc.value.rows[0]?.id ?? null);
const selectedColId = ref<string | null>(doc.value.columns[0]?.id ?? null);
const selectedCellKeys = ref<Set<string>>(
    new Set(
        doc.value.rows[0] && doc.value.columns[0]
            ? [cellKey(doc.value.rows[0].id, doc.value.columns[0].id)]
            : [],
    ),
);

const generated = computed(() => generateTableLatex(doc.value));
const manualSource = ref<string>(
    props.activeDesign?.generated_latex ?? generated.value.latex,
);
const isExternallyModified = ref<boolean>(
    props.activeDesign?.status === 'source_only',
);

watch(
    () => generated.value.latex,
    (newLatex) => {
        if (!isExternallyModified.value) {
            manualSource.value = newLatex;
        }
    },
);

const selectedRow = computed<TableRow | undefined>(() =>
    doc.value.rows.find((r) => r.id === selectedRowId.value),
);
const selectedCol = computed<TableColumn | undefined>(() =>
    doc.value.columns.find((c) => c.id === selectedColId.value),
);
const activeCell = computed(() => {
    if (!selectedRowId.value || !selectedColId.value) {
        return undefined;
    }
    return doc.value.cells[cellKey(selectedRowId.value, selectedColId.value)];
});

const selectionBounds = computed(() =>
    analyzeSelection(doc.value, selectedCellKeys.value),
);

const canMergeSelection = computed(
    () =>
        props.project.can_edit &&
        Boolean(selectionBounds.value?.isValidRectangle) &&
        (selectionBounds.value?.cellCount ?? 0) >= 2,
);

const canSplitSelection = computed(
    () =>
        props.project.can_edit &&
        Boolean(activeCell.value?.merge?.isMaster) &&
        ((activeCell.value?.merge?.rowSpan ?? 1) > 1 ||
            (activeCell.value?.merge?.colSpan ?? 1) > 1),
);

function startRangeDrag(rowIdx: number, colIdx: number, shiftKey: boolean): void {
    if (shiftKey) {
        return;
    }
    isDraggingRange.value = true;
    dragAnchor.value = { rowIdx, colIdx };
}

function updateRangeDrag(rowIdx: number, colIdx: number): void {
    if (!isDraggingRange.value || !dragAnchor.value) {
        return;
    }
    const minR = Math.min(dragAnchor.value.rowIdx, rowIdx);
    const maxR = Math.max(dragAnchor.value.rowIdx, rowIdx);
    const minC = Math.min(dragAnchor.value.colIdx, colIdx);
    const maxC = Math.max(dragAnchor.value.colIdx, colIdx);
    const next = new Set<string>();
    for (let r = minR; r <= maxR; r++) {
        for (let c = minC; c <= maxC; c++) {
            const row = doc.value.rows[r];
            const col = doc.value.columns[c];
            if (row && col) {
                next.add(cellKey(row.id, col.id));
            }
        }
    }
    selectedCellKeys.value = next;
}

function endRangeDrag(): void {
    isDraggingRange.value = false;
}

function handleMergeCells(): void {
    if (!canMergeSelection.value) {
        toast.warning('Select a valid rectangular range of at least 2 cells to merge.');
        return;
    }
    pushUndoSnapshot();
    const ok = mergeSelectedCells(doc.value, selectedCellKeys.value);
    if (!ok) {
        toast.error('Cannot merge overlapping merged regions.');
        return;
    }
    toast.success('Cells merged.');
}

function requestSplitCell(): void {
    if (!canSplitSelection.value || !activeCell.value) {
        return;
    }
    if (activeCell.value.content.trim().includes(' ')) {
        splitDialogOpen.value = true;
        return;
    }
    executeSplitCell('keep_first');
}

function executeSplitCell(strategy: 'keep_first' | 'distribute_words'): void {
    if (!selectedRowId.value || !selectedColId.value) {
        return;
    }
    pushUndoSnapshot();
    splitMergedCell(doc.value, selectedRowId.value, selectedColId.value, strategy);
    splitDialogOpen.value = false;
    toast.success('Merged cell split.');
}

function handleMoveRow(delta: -1 | 1): void {
    if (!selectedRow.value) {
        return;
    }
    pushUndoSnapshot();
    const ok = moveRow(doc.value, selectedRow.value.index, selectedRow.value.index + delta);
    if (!ok) {
        toast.warning('Cannot move a row across a multirow merge.');
    }
}

function handleMoveColumn(delta: -1 | 1): void {
    if (!selectedCol.value) {
        return;
    }
    pushUndoSnapshot();
    const ok = moveColumn(doc.value, selectedCol.value.index, selectedCol.value.index + delta);
    if (!ok) {
        toast.warning('Cannot move a column across a multicolumn merge.');
    }
}

function handleClearSelectedCells(): void {
    if (selectedCellKeys.value.size === 0) {
        return;
    }
    pushUndoSnapshot();
    clearCells(doc.value, selectedCellKeys.value);
}

function getCsrfToken(): string {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
}

function pushUndoSnapshot(): void {
    undoStack.value.push(JSON.stringify(doc.value));
    if (undoStack.value.length > 40) {
        undoStack.value.shift();
    }
    redoStack.value = [];
    hasUnsavedChanges.value = true;
}

function undo(): void {
    const prev = undoStack.value.pop();
    if (!prev) {
        return;
    }
    redoStack.value.push(JSON.stringify(doc.value));
    doc.value = JSON.parse(prev) as TableDocument;
    hasUnsavedChanges.value = true;
}

function redo(): void {
    const next = redoStack.value.pop();
    if (!next) {
        return;
    }
    undoStack.value.push(JSON.stringify(doc.value));
    doc.value = JSON.parse(next) as TableDocument;
    hasUnsavedChanges.value = true;
}

function selectCell(rowId: string, colId: string, additive = false): void {
    selectionMode.value = 'cell';
    selectedRowId.value = rowId;
    selectedColId.value = colId;
    const key = cellKey(rowId, colId);
    if (additive) {
        const next = new Set(selectedCellKeys.value);
        if (next.has(key)) {
            next.delete(key);
        } else {
            next.add(key);
        }
        selectedCellKeys.value = next;
    } else {
        selectedCellKeys.value = new Set([key]);
    }
}

function selectRow(rowId: string): void {
    selectionMode.value = 'row';
    selectedRowId.value = rowId;
    const next = new Set<string>();
    for (const col of doc.value.columns) {
        next.add(cellKey(rowId, col.id));
    }
    selectedCellKeys.value = next;
}

function selectColumn(colId: string): void {
    selectionMode.value = 'column';
    selectedColId.value = colId;
    const next = new Set<string>();
    for (const row of doc.value.rows) {
        next.add(cellKey(row.id, colId));
    }
    selectedCellKeys.value = next;
}

function addRow(atIndex?: number): void {
    pushUndoSnapshot();
    const insertIdx = atIndex ?? doc.value.rows.length;
    const newRowId = makeId('r');
    const newRow: TableRow = {
        id: newRowId,
        index: insertIdx,
        section: insertIdx === 0 ? 'head' : 'body',
        topBorder: { style: 'none' },
        bottomBorder: { style: 'none' },
    };
    doc.value.rows.splice(insertIdx, 0, newRow);
    doc.value.rows.forEach((r, idx) => {
        r.index = idx;
    });

    for (const col of doc.value.columns) {
        doc.value.cells[cellKey(newRowId, col.id)] = {
            rowId: newRowId,
            colId: col.id,
            contentMode: 'text',
            content: '',
            formatting: {},
            borders: {},
        };
    }
    selectRow(newRowId);
}

function addColumn(atIndex?: number): void {
    pushUndoSnapshot();
    const insertIdx = atIndex ?? doc.value.columns.length;
    const newColId = makeId('c');
    const newCol: TableColumn = {
        id: newColId,
        index: insertIdx,
        type: 'c',
        leftBorder: { style: 'none' },
        rightBorder: { style: 'none' },
    };
    doc.value.columns.splice(insertIdx, 0, newCol);
    doc.value.columns.forEach((c, idx) => {
        c.index = idx;
    });

    for (const row of doc.value.rows) {
        doc.value.cells[cellKey(row.id, newColId)] = {
            rowId: row.id,
            colId: newColId,
            contentMode: 'text',
            content: '',
            formatting: {},
            borders: {},
        };
    }
    selectColumn(newColId);
}

function deleteSelectedRow(): void {
    if (!selectedRowId.value || doc.value.rows.length <= 1) {
        toast.warning('A table must have at least one row.');
        return;
    }
    pushUndoSnapshot();
    const targetId = selectedRowId.value;
    doc.value.rows = doc.value.rows.filter((r) => r.id !== targetId);
    doc.value.rows.forEach((r, idx) => {
        r.index = idx;
    });
    for (const col of doc.value.columns) {
        delete doc.value.cells[cellKey(targetId, col.id)];
    }
    selectedRowId.value = doc.value.rows[0]?.id ?? null;
    if (selectedRowId.value && selectedColId.value) {
        selectCell(selectedRowId.value, selectedColId.value);
    }
}

function deleteSelectedColumn(): void {
    if (!selectedColId.value || doc.value.columns.length <= 1) {
        toast.warning('A table must have at least one column.');
        return;
    }
    pushUndoSnapshot();
    const targetId = selectedColId.value;
    doc.value.columns = doc.value.columns.filter((c) => c.id !== targetId);
    doc.value.columns.forEach((c, idx) => {
        c.index = idx;
    });
    for (const row of doc.value.rows) {
        delete doc.value.cells[cellKey(row.id, targetId)];
    }
    selectedColId.value = doc.value.columns[0]?.id ?? null;
    if (selectedRowId.value && selectedColId.value) {
        selectCell(selectedRowId.value, selectedColId.value);
    }
}

function updateCellContent(rowId: string, colId: string, value: string): void {
    const key = cellKey(rowId, colId);
    const cell = doc.value.cells[key];
    if (!cell || cell.content === value) {
        return;
    }
    pushUndoSnapshot();
    cell.content = value;
}

function toggleCellFormatting(
    prop: 'bold' | 'italic' | 'underline' | 'smallCaps',
): void {
    if (selectedCellKeys.value.size === 0) {
        return;
    }
    pushUndoSnapshot();
    for (const key of selectedCellKeys.value) {
        const cell = doc.value.cells[key];
        if (cell) {
            cell.formatting[prop] = !cell.formatting[prop];
        }
    }
}

function setCellContentMode(mode: ContentMode): void {
    if (selectedCellKeys.value.size === 0) {
        return;
    }
    pushUndoSnapshot();
    for (const key of selectedCellKeys.value) {
        const cell = doc.value.cells[key];
        if (cell) {
            cell.contentMode = mode;
        }
    }
}

function handleCellKeydown(
    event: KeyboardEvent,
    rowIdx: number,
    colIdx: number,
): void {
    let nextRow = rowIdx;
    let nextCol = colIdx;
    if (event.key === 'ArrowDown' || event.key === 'Enter') {
        nextRow = Math.min(doc.value.rows.length - 1, rowIdx + 1);
    } else if (event.key === 'ArrowUp') {
        nextRow = Math.max(0, rowIdx - 1);
    } else if (event.key === 'Tab') {
        event.preventDefault();
        if (event.shiftKey) {
            nextCol = colIdx - 1;
            if (nextCol < 0) {
                nextCol = doc.value.columns.length - 1;
                nextRow = Math.max(0, rowIdx - 1);
            }
        } else {
            nextCol = colIdx + 1;
            if (nextCol >= doc.value.columns.length) {
                nextCol = 0;
                nextRow = Math.min(doc.value.rows.length - 1, rowIdx + 1);
            }
        }
    } else {
        return;
    }

    const r = doc.value.rows[nextRow];
    const c = doc.value.columns[nextCol];
    if (r && c) {
        selectCell(r.id, c.id);
        const el = document.querySelector<HTMLInputElement>(
            `[data-cell-input="${r.id}:${c.id}"]`,
        );
        el?.focus();
    }
}

function onManualSourceInput(value: string | number): void {
    manualSource.value = String(value);
    isExternallyModified.value = manualSource.value !== generated.value.latex;
    hasUnsavedChanges.value = true;
}

function resyncFromVisual(): void {
    manualSource.value = generated.value.latex;
    isExternallyModified.value = false;
    toast.info('Synchronized LaTeX source from visual table model.');
}

async function saveDesign(): Promise<void> {
    if (!props.project.can_edit || isSaving.value) {
        return;
    }
    isSaving.value = true;
    try {
        const payload = {
            name: doc.value.name || 'Untitled Table',
            schema_version: doc.value.schemaVersion,
            document_json: doc.value,
            generated_latex: manualSource.value,
            status: isExternallyModified.value ? 'source_only' : 'visual',
        };

        const url = activePublicId.value
            ? projectsRoutes.tables.update({
                  project: props.project.public_id,
                  tableDesign: activePublicId.value,
              }).url
            : projectsRoutes.tables.store(props.project.public_id).url;

        const method = activePublicId.value ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-XSRF-TOKEN': getCsrfToken(),
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            toast.error('Failed to save table design.');
            return;
        }

        const data = (await response.json()) as { tableDesign: SavedDesign };
        activePublicId.value = data.tableDesign.public_id;
        hasUnsavedChanges.value = false;
        toast.success('Table design saved.');
    } finally {
        isSaving.value = false;
    }
}

function createNewDesign(): void {
    pushUndoSnapshot();
    activePublicId.value = null;
    doc.value = createDefaultTableDocument(
        `Table ${props.tableDesigns.length + 1}`,
    );
    isExternallyModified.value = false;
    manualSource.value = generated.value.latex;
}

function confirmDeleteDesign(): void {
    if (!activePublicId.value) {
        return;
    }
    router.delete(
        projectsRoutes.tables.destroy({
            project: props.project.public_id,
            tableDesign: activePublicId.value,
        }).url,
        {
            onFinish: () => {
                deleteDialogOpen.value = false;
            },
        },
    );
}

async function copyLatex(): Promise<void> {
    await navigator.clipboard.writeText(manualSource.value);
    toast.success('LaTeX table code copied to clipboard.');
}

function downloadTex(): void {
    const blob = new Blob([manualSource.value], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${doc.value.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'table'}.tex`;
    link.click();
    URL.revokeObjectURL(url);
}

function renderCellMath(tex: string): string {
    try {
        return latexToMathML(tex, false);
    } catch {
        return tex;
    }
}
</script>

<template>
    <TooltipProvider>
        <div class="flex h-screen flex-col overflow-hidden bg-slate-50 text-slate-900">
            <Head :title="`Table Designer — ${project.title}`" />

            <!-- 3.1 Top Toolbar -->
            <header class="flex h-12 shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-3">
                <div class="flex items-center gap-2.5">
                    <Button variant="ghost" size="sm" as-child>
                        <Link :href="projectsRoutes.show(project.public_id).url">
                            <ArrowLeft class="size-4" />
                            <span>Back to project</span>
                        </Link>
                    </Button>

                    <Input
                        v-model="doc.name"
                        class="h-8 w-48 text-sm font-semibold"
                        :readonly="!project.can_edit"
                        aria-label="Table name"
                        @change="hasUnsavedChanges = true"
                    />

                    <Badge variant="outline" class="text-[11px]">
                        {{ isSaving ? 'Saving...' : hasUnsavedChanges ? 'Unsaved' : 'Saved' }}
                    </Badge>
                </div>

                <div class="flex items-center gap-1.5">
                    <Tooltip>
                        <TooltipTrigger as-child>
                            <Button
                                variant="outline"
                                size="icon-sm"
                                :disabled="undoStack.length === 0"
                                @click="undo"
                            >
                                <Undo2 class="size-3.5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Undo</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger as-child>
                            <Button
                                variant="outline"
                                size="icon-sm"
                                :disabled="redoStack.length === 0"
                                @click="redo"
                            >
                                <Redo2 class="size-3.5" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Redo</TooltipContent>
                    </Tooltip>

                    <Button variant="outline" size="sm" :disabled="!project.can_edit" @click="addRow()">
                        <Rows3 class="size-3.5" />
                        <span>+ Row</span>
                    </Button>

                    <Button variant="outline" size="sm" :disabled="!project.can_edit" @click="addColumn()">
                        <Columns3 class="size-3.5" />
                        <span>+ Column</span>
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        :disabled="!canMergeSelection"
                        @click="handleMergeCells"
                    >
                        <TableCellsMerge class="size-3.5" />
                        <span>Merge</span>
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        :disabled="!canSplitSelection"
                        @click="requestSplitCell"
                    >
                        <Split class="size-3.5" />
                        <span>Split</span>
                    </Button>

                    <Button
                        :variant="doc.layout.orientation === 'landscape' ? 'default' : 'outline'"
                        size="sm"
                        @click="doc.layout.orientation = doc.layout.orientation === 'landscape' ? 'portrait' : 'landscape'"
                    >
                        <RotateCw class="size-3.5" />
                        <span>Landscape</span>
                    </Button>

                    <Button variant="outline" size="sm" @click="downloadTex">
                        <Download class="size-3.5" />
                        <span>Export .tex</span>
                    </Button>

                    <Button v-if="project.can_edit" size="sm" :disabled="isSaving" @click="saveDesign">
                        <Save class="size-3.5" />
                        <span>Save</span>
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger as-child>
                            <Button variant="outline" size="icon-sm" aria-label="More actions">
                                <MoreHorizontal class="size-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem @click="createNewDesign">
                                <Plus class="mr-2 size-3.5" /> New Table
                            </DropdownMenuItem>
                            <DropdownMenuItem @click="copyLatex">
                                <Copy class="mr-2 size-3.5" /> Copy LaTeX
                            </DropdownMenuItem>
                            <DropdownMenuSeparator v-if="activePublicId && project.can_edit" />
                            <DropdownMenuItem
                                v-if="activePublicId && project.can_edit"
                                class="text-destructive"
                                @click="deleteDialogOpen = true"
                            >
                                <Trash2 class="mr-2 size-3.5" /> Delete Table
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>

            <!-- Main 3-Column Designer Body -->
            <div class="flex min-h-0 flex-1">
                <!-- 3.2 Left Sidebar: Table Structure -->
                <aside class="flex w-60 shrink-0 flex-col border-r border-slate-200 bg-white">
                    <div class="border-b border-slate-100 px-3 py-2 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                        Table Structure
                    </div>
                    <ScrollArea class="flex-1 p-2">
                        <div class="space-y-4 text-xs">
                            <div>
                                <button
                                    type="button"
                                    class="flex w-full items-center justify-between rounded-md px-2 py-1.5 font-medium hover:bg-slate-100"
                                    :class="selectionMode === 'table' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-700'"
                                    @click="selectionMode = 'table'"
                                >
                                    <span>Table Overview</span>
                                    <span class="font-mono text-[10px] text-slate-400">
                                        {{ doc.rows.length }}x{{ doc.columns.length }}
                                    </span>
                                </button>
                            </div>

                            <div>
                                <p class="px-2 pb-1 text-[11px] font-semibold text-slate-400 uppercase">
                                    Rows ({{ doc.rows.length }})
                                </p>
                                <div class="space-y-0.5">
                                    <button
                                        v-for="row in doc.rows"
                                        :key="row.id"
                                        type="button"
                                        class="flex w-full items-center justify-between rounded px-2 py-1 text-left hover:bg-slate-100"
                                        :class="selectionMode === 'row' && selectedRowId === row.id ? 'bg-indigo-50 font-medium text-indigo-700' : 'text-slate-600'"
                                        @click="selectRow(row.id)"
                                    >
                                        <span>Row {{ row.index + 1 }}</span>
                                        <span class="text-[10px] text-slate-400 capitalize">{{ row.section }}</span>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <p class="px-2 pb-1 text-[11px] font-semibold text-slate-400 uppercase">
                                    Columns ({{ doc.columns.length }})
                                </p>
                                <div class="space-y-0.5">
                                    <button
                                        v-for="col in doc.columns"
                                        :key="col.id"
                                        type="button"
                                        class="flex w-full items-center justify-between rounded px-2 py-1 text-left hover:bg-slate-100"
                                        :class="selectionMode === 'column' && selectedColId === col.id ? 'bg-indigo-50 font-medium text-indigo-700' : 'text-slate-600'"
                                        @click="selectColumn(col.id)"
                                    >
                                        <span>Col {{ col.index + 1 }}</span>
                                        <span class="font-mono text-[10px] text-slate-400">{{ col.type }}</span>
                                    </button>
                                </div>
                            </div>

                            <div v-if="tableDesigns.length > 0">
                                <p class="px-2 pb-1 text-[11px] font-semibold text-slate-400 uppercase">
                                    Saved Tables
                                </p>
                                <div class="space-y-0.5">
                                    <Link
                                        v-for="saved in tableDesigns"
                                        :key="saved.public_id"
                                        :href="projectsRoutes.tables.show({ project: project.public_id, tableDesign: saved.public_id }).url"
                                        class="block truncate rounded px-2 py-1 hover:bg-slate-100"
                                        :class="saved.public_id === activePublicId ? 'bg-slate-100 font-medium text-slate-900' : 'text-slate-600'"
                                    >
                                        {{ saved.name }}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                </aside>

                <!-- 3.3 Center: Visual Table Canvas + 3.5 Bottom Panel -->
                <main class="flex min-w-0 flex-1 flex-col">
                    <!-- Quick Formatting Bar -->
                    <div class="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-white px-3 py-1.5">
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            :disabled="!project.can_edit"
                            title="Bold"
                            @click="toggleCellFormatting('bold')"
                        >
                            <Bold class="size-3.5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            :disabled="!project.can_edit"
                            title="Italic"
                            @click="toggleCellFormatting('italic')"
                        >
                            <Italic class="size-3.5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            :disabled="!project.can_edit"
                            title="Underline"
                            @click="toggleCellFormatting('underline')"
                        >
                            <Underline class="size-3.5" />
                        </Button>

                        <div class="mx-2 h-4 w-px bg-slate-200" />

                        <Button
                            variant="ghost"
                            size="sm"
                            :disabled="!project.can_edit || !selectedRowId"
                            @click="deleteSelectedRow"
                        >
                            Delete Row
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            :disabled="!project.can_edit || !selectedColId"
                            @click="deleteSelectedColumn"
                        >
                            Delete Col
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            :disabled="!project.can_edit || !selectedRow"
                            title="Move row up"
                            @click="handleMoveRow(-1)"
                        >
                            <MoveUp class="size-3.5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            :disabled="!project.can_edit || !selectedRow"
                            title="Move row down"
                            @click="handleMoveRow(1)"
                        >
                            <MoveDown class="size-3.5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            :disabled="!project.can_edit || !selectedCol"
                            title="Move column left"
                            @click="handleMoveColumn(-1)"
                        >
                            <MoveLeft class="size-3.5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            :disabled="!project.can_edit || !selectedCol"
                            title="Move column right"
                            @click="handleMoveColumn(1)"
                        >
                            <MoveRight class="size-3.5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            :disabled="!project.can_edit || selectedCellKeys.size === 0"
                            @click="handleClearSelectedCells"
                        >
                            Clear
                        </Button>
                    </div>

                    <!-- Interactive Grid Canvas -->
                    <div class="min-h-0 flex-1 overflow-auto bg-slate-100/70 p-6">
                        <div class="inline-block min-w-full rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
                            <p v-if="doc.caption" class="mb-3 text-center text-sm font-medium text-slate-800">
                                {{ doc.caption }}
                            </p>

                            <table class="w-full border-collapse text-sm">
                                <thead>
                                    <tr>
                                        <th class="w-10 border border-slate-200 bg-slate-50 p-1.5 text-[10px] text-slate-400">
                                            #
                                        </th>
                                        <th
                                            v-for="col in doc.columns"
                                            :key="col.id"
                                            class="cursor-pointer border border-slate-200 bg-slate-50 px-3 py-1.5 text-center text-xs font-medium text-slate-600 hover:bg-slate-100"
                                            :class="{ 'bg-indigo-50 text-indigo-700': selectionMode === 'column' && selectedColId === col.id }"
                                            @click="selectColumn(col.id)"
                                        >
                                            C{{ col.index + 1 }} ({{ col.type }})
                                        </th>
                                    </tr>
                                </thead>
                                <tbody @mouseup="endRangeDrag" @mouseleave="endRangeDrag">
                                    <tr v-for="row in doc.rows" :key="row.id">
                                        <td
                                            class="cursor-pointer border border-slate-200 bg-slate-50 px-2 py-1 text-center text-xs font-medium text-slate-500 hover:bg-slate-100"
                                            :class="{ 'bg-indigo-50 text-indigo-700': selectionMode === 'row' && selectedRowId === row.id }"
                                            @click="selectRow(row.id)"
                                        >
                                            R{{ row.index + 1 }}
                                        </td>
                                        <template v-for="col in doc.columns" :key="col.id">
                                            <td
                                                v-if="!doc.cells[cellKey(row.id, col.id)]?.merge || doc.cells[cellKey(row.id, col.id)]?.merge?.isMaster"
                                                :rowspan="doc.cells[cellKey(row.id, col.id)]?.merge?.isMaster ? doc.cells[cellKey(row.id, col.id)]?.merge?.rowSpan : 1"
                                                :colspan="doc.cells[cellKey(row.id, col.id)]?.merge?.isMaster ? doc.cells[cellKey(row.id, col.id)]?.merge?.colSpan : 1"
                                                class="relative border border-slate-200 p-0 transition-colors"
                                                :style="{
                                                    backgroundColor:
                                                        doc.cells[cellKey(row.id, col.id)]?.formatting.backgroundColor ||
                                                        row.backgroundColor ||
                                                        undefined,
                                                }"
                                                :class="[
                                                    selectedCellKeys.has(cellKey(row.id, col.id))
                                                        ? 'ring-2 ring-indigo-500 ring-inset bg-indigo-50/30'
                                                        : 'bg-white',
                                                    row.topBorder.style !== 'none' ? 'border-t-2 border-t-slate-800' : '',
                                                    row.bottomBorder.style !== 'none' ? 'border-b-2 border-b-slate-800' : '',
                                                    col.leftBorder.style !== 'none' ? 'border-l-2 border-l-slate-800' : '',
                                                    col.rightBorder.style !== 'none' ? 'border-r-2 border-r-slate-800' : '',
                                                ]"
                                                @mousedown="startRangeDrag(row.index, col.index, $event.shiftKey)"
                                                @mouseenter="updateRangeDrag(row.index, col.index)"
                                                @click="selectCell(row.id, col.id, $event.shiftKey)"
                                            >
                                                <input
                                                    :data-cell-input="`${row.id}:${col.id}`"
                                                    :value="doc.cells[cellKey(row.id, col.id)]?.content ?? ''"
                                                    :readonly="!project.can_edit"
                                                    class="w-full bg-transparent px-3 py-2 text-sm outline-none"
                                                    :class="[
                                                        doc.cells[cellKey(row.id, col.id)]?.formatting.bold || row.bold ? 'font-bold' : '',
                                                        doc.cells[cellKey(row.id, col.id)]?.formatting.italic || row.italic ? 'italic' : '',
                                                        doc.cells[cellKey(row.id, col.id)]?.formatting.underline ? 'underline' : '',
                                                        (doc.cells[cellKey(row.id, col.id)]?.merge?.horizontalAlignOverride || doc.cells[cellKey(row.id, col.id)]?.formatting.horizontalAlign || col.type) === 'c' ? 'text-center' : (doc.cells[cellKey(row.id, col.id)]?.merge?.horizontalAlignOverride || doc.cells[cellKey(row.id, col.id)]?.formatting.horizontalAlign || col.type) === 'r' ? 'text-right' : 'text-left',
                                                    ]"
                                                    @input="updateCellContent(row.id, col.id, ($event.target as HTMLInputElement).value)"
                                                    @keydown="handleCellKeydown($event, row.index, col.index)"
                                                />
                                            </td>
                                        </template>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- 3.5 Bottom Panel: Source, Preview, Packages, Validation -->
                    <div class="flex h-64 shrink-0 flex-col border-t border-slate-200 bg-white">
                        <Tabs default-value="source" class="flex h-full flex-col gap-0">
                            <div class="flex items-center justify-between border-b border-slate-200 px-3 py-1.5">
                                <TabsList class="h-8">
                                    <TabsTrigger value="source" class="text-xs">LaTeX Source</TabsTrigger>
                                    <TabsTrigger value="preview" class="text-xs">Rendered Preview</TabsTrigger>
                                    <TabsTrigger value="packages" class="text-xs">
                                        Packages ({{ generated.packages.length }})
                                    </TabsTrigger>
                                    <TabsTrigger value="validation" class="text-xs">
                                        Validation ({{ generated.issues.length }})
                                    </TabsTrigger>
                                </TabsList>

                                <Button variant="outline" size="sm" @click="copyLatex">
                                    <Copy class="size-3.5" />
                                    <span>Copy LaTeX</span>
                                </Button>
                            </div>

                            <TabsContent value="source" class="flex min-h-0 flex-1 flex-col p-3">
                                <Alert v-if="isExternallyModified" class="mb-2 border-amber-300 bg-amber-50 text-amber-900">
                                    <AlertTriangle class="size-4 text-amber-700" />
                                    <AlertTitle>Source externally modified</AlertTitle>
                                    <AlertDescription class="flex items-center justify-between gap-2 text-xs">
                                        <span>Manual edits are preserved in source mode.</span>
                                        <Button variant="outline" size="sm" @click="resyncFromVisual">
                                            Synchronize from Visual
                                        </Button>
                                    </AlertDescription>
                                </Alert>
                                <Textarea
                                    :model-value="manualSource"
                                    class="min-h-0 flex-1 resize-none font-mono text-xs"
                                    @update:model-value="onManualSourceInput"
                                />
                            </TabsContent>

                            <TabsContent value="preview" class="min-h-0 flex-1 overflow-auto p-4">
                                <div class="mx-auto max-w-2xl rounded border border-slate-200 bg-white p-5">
                                    <p v-if="doc.caption" class="mb-3 text-center font-serif text-sm font-medium">
                                        Table 1: {{ doc.caption }}
                                    </p>
                                    <table class="w-full border-collapse font-serif text-sm">
                                        <tbody>
                                            <tr
                                                v-for="row in doc.rows"
                                                :key="row.id"
                                                :class="[
                                                    row.topBorder.style !== 'none' ? 'border-t-2 border-slate-900' : '',
                                                    row.bottomBorder.style !== 'none' ? 'border-b border-slate-900' : '',
                                                ]"
                                            >
                                                <td
                                                    v-for="col in doc.columns"
                                                    :key="col.id"
                                                    class="px-3 py-1.5"
                                                    :class="[
                                                        row.bold || doc.cells[cellKey(row.id, col.id)]?.formatting.bold ? 'font-bold' : '',
                                                        col.type === 'c' ? 'text-center' : col.type === 'r' ? 'text-right' : 'text-left',
                                                    ]"
                                                >
                                                    <span
                                                        v-if="doc.cells[cellKey(row.id, col.id)]?.contentMode === 'math'"
                                                        v-html="renderCellMath(doc.cells[cellKey(row.id, col.id)]?.content ?? '')"
                                                    />
                                                    <span v-else>{{ doc.cells[cellKey(row.id, col.id)]?.content }}</span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </TabsContent>

                            <TabsContent value="packages" class="min-h-0 flex-1 overflow-auto p-3">
                                <div v-if="generated.packages.length === 0" class="text-xs text-slate-500">
                                    No additional LaTeX packages required beyond standard tabular.
                                </div>
                                <div v-else class="space-y-2">
                                    <div
                                        v-for="pkg in generated.packages"
                                        :key="pkg.packageName"
                                        class="flex items-center justify-between rounded-lg border border-slate-200 p-2.5 text-xs"
                                    >
                                        <div>
                                            <span class="font-mono font-semibold text-indigo-700">
                                                \usepackage&#123;{{ pkg.packageName }}&#125;
                                            </span>
                                            <p class="mt-0.5 text-slate-500">{{ pkg.reason }}</p>
                                        </div>
                                        <Badge variant="secondary">Required</Badge>
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="validation" class="min-h-0 flex-1 overflow-auto p-3">
                                <Alert v-if="generated.issues.length === 0" class="border-emerald-200 bg-emerald-50 text-emerald-900">
                                    <CheckCircle2 class="size-4 text-emerald-600" />
                                    <AlertTitle>No structural issues detected</AlertTitle>
                                    <AlertDescription class="text-xs">
                                        The table model and generated LaTeX passed all validation checks.
                                    </AlertDescription>
                                </Alert>
                                <div v-else class="space-y-2">
                                    <Alert
                                        v-for="issue in generated.issues"
                                        :key="issue.id"
                                        :variant="issue.severity === 'error' ? 'destructive' : 'default'"
                                    >
                                        <AlertCircle class="size-4" />
                                        <AlertTitle class="capitalize">{{ issue.severity }}</AlertTitle>
                                        <AlertDescription class="text-xs">{{ issue.message }}</AlertDescription>
                                    </Alert>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </main>

                <!-- 3.4 Right Sidebar: Context-Sensitive Properties Inspector -->
                <aside class="flex w-72 shrink-0 flex-col border-l border-slate-200 bg-white">
                    <div class="border-b border-slate-100 px-3 py-2 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                        Properties Inspector
                    </div>
                    <ScrollArea class="flex-1 px-3 py-2">
                        <Accordion type="multiple" :default-value="['context', 'table']" class="w-full">
                            <AccordionItem v-if="selectionMode === 'cell' && activeCell" value="context">
                                <AccordionTrigger>Cell Properties</AccordionTrigger>
                                <AccordionContent class="space-y-3">
                                    <div>
                                        <Label class="text-[11px]">Content Mode</Label>
                                        <select
                                            :value="activeCell.contentMode"
                                            class="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs"
                                            @change="setCellContentMode(($event.target as HTMLSelectElement).value as ContentMode)"
                                        >
                                            <option value="text">Plain text (auto-escaped)</option>
                                            <option value="math">LaTeX math ($...$)</option>
                                            <option value="latex">Raw LaTeX source</option>
                                        </select>
                                    </div>
                                    <div v-if="activeCell.merge?.isMaster" class="space-y-2 border-t pt-2">
                                        <p class="text-[11px] font-semibold text-slate-600">
                                            Merged Cell ({{ activeCell.merge.rowSpan }}x{{ activeCell.merge.colSpan }})
                                        </p>
                                        <div>
                                            <Label class="text-[11px]">Merged Alignment</Label>
                                            <select
                                                v-model="activeCell.merge.horizontalAlignOverride"
                                                class="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs"
                                            >
                                                <option value="l">Left (l)</option>
                                                <option value="c">Center (c)</option>
                                                <option value="r">Right (r)</option>
                                            </select>
                                        </div>
                                        <div v-if="activeCell.merge.rowSpan > 1">
                                            <Label class="text-[11px]">Multirow Vertical Align</Label>
                                            <select
                                                v-model="activeCell.merge.multirowValign"
                                                class="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs"
                                            >
                                                <option value="t">Top (t)</option>
                                                <option value="c">Middle (c)</option>
                                                <option value="b">Bottom (b)</option>
                                            </select>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem v-if="selectionMode === 'row' && selectedRow" value="context">
                                <AccordionTrigger>Row {{ selectedRow.index + 1 }} Properties</AccordionTrigger>
                                <AccordionContent class="space-y-3">
                                    <div>
                                        <Label class="text-[11px]">Section</Label>
                                        <select
                                            v-model="selectedRow.section"
                                            class="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs"
                                        >
                                            <option value="head">Header</option>
                                            <option value="body">Body</option>
                                            <option value="foot">Footer</option>
                                        </select>
                                    </div>
                                    <div>
                                        <Label class="text-[11px]">Top Border</Label>
                                        <select
                                            v-model="selectedRow.topBorder.style"
                                            class="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs"
                                        >
                                            <option value="none">None</option>
                                            <option value="booktabs_top">Booktabs \toprule</option>
                                            <option value="booktabs_mid">Booktabs \midrule</option>
                                            <option value="single">Single \hline</option>
                                            <option value="double">Double \hline\hline</option>
                                        </select>
                                    </div>
                                    <div>
                                        <Label class="text-[11px]">Bottom Border</Label>
                                        <select
                                            v-model="selectedRow.bottomBorder.style"
                                            class="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs"
                                        >
                                            <option value="none">None</option>
                                            <option value="booktabs_mid">Booktabs \midrule</option>
                                            <option value="booktabs_bottom">Booktabs \bottomrule</option>
                                            <option value="single">Single \hline</option>
                                            <option value="double">Double \hline\hline</option>
                                        </select>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem v-if="selectionMode === 'column' && selectedCol" value="context">
                                <AccordionTrigger>Column {{ selectedCol.index + 1 }} Properties</AccordionTrigger>
                                <AccordionContent class="space-y-3">
                                    <div>
                                        <Label class="text-[11px]">Alignment / Type</Label>
                                        <select
                                            v-model="selectedCol.type"
                                            class="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs"
                                        >
                                            <option value="l">Left (l)</option>
                                            <option value="c">Center (c)</option>
                                            <option value="r">Right (r)</option>
                                            <option value="p">Paragraph top (p{})</option>
                                            <option value="m">Paragraph middle (m{})</option>
                                            <option value="b">Paragraph bottom (b{})</option>
                                        </select>
                                    </div>
                                    <div v-if="['p', 'm', 'b'].includes(selectedCol.type)">
                                        <Label class="text-[11px]">Column Width</Label>
                                        <Input v-model="selectedCol.width" placeholder="3cm" class="mt-1 h-7 text-xs" />
                                    </div>
                                    <div>
                                        <Label class="text-[11px]">Left Border</Label>
                                        <select
                                            v-model="selectedCol.leftBorder.style"
                                            class="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs"
                                        >
                                            <option value="none">None</option>
                                            <option value="single">Single (|)</option>
                                            <option value="double">Double (||)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <Label class="text-[11px]">Right Border</Label>
                                        <select
                                            v-model="selectedCol.rightBorder.style"
                                            class="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs"
                                        >
                                            <option value="none">None</option>
                                            <option value="single">Single (|)</option>
                                            <option value="double">Double (||)</option>
                                        </select>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="table">
                                <AccordionTrigger>Table &amp; Caption</AccordionTrigger>
                                <AccordionContent class="space-y-3">
                                    <div>
                                        <Label class="text-[11px]">Caption</Label>
                                        <Textarea v-model="doc.caption" rows="2" class="mt-1 text-xs" />
                                    </div>
                                    <div>
                                        <Label class="text-[11px]">Label</Label>
                                        <Input v-model="doc.label" placeholder="tab:results" class="mt-1 h-7 font-mono text-xs" />
                                    </div>
                                    <div>
                                        <Label class="text-[11px]">Caption Position</Label>
                                        <select
                                            v-model="doc.layout.captionPosition"
                                            class="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs"
                                        >
                                            <option value="top">Above table</option>
                                            <option value="bottom">Below table</option>
                                        </select>
                                    </div>
                                    <div class="grid grid-cols-2 gap-2">
                                        <div>
                                            <Label class="text-[11px]">\tabcolsep</Label>
                                            <Input v-model="doc.style.tabColSep" placeholder="6pt" class="mt-1 h-7 font-mono text-xs" />
                                        </div>
                                        <div>
                                            <Label class="text-[11px]">\arraystretch</Label>
                                            <Input v-model.number="doc.style.arrayStretch" type="number" step="0.1" min="0.5" max="3" placeholder="1.0" class="mt-1 h-7 font-mono text-xs" />
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="layout">
                                <AccordionTrigger>Layout &amp; Fit to Page</AccordionTrigger>
                                <AccordionContent class="space-y-3">
                                    <div>
                                        <Label class="text-[11px]">Orientation</Label>
                                        <select
                                            v-model="doc.layout.orientation"
                                            class="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs"
                                        >
                                            <option value="portrait">Portrait</option>
                                            <option value="landscape">Landscape</option>
                                        </select>
                                    </div>
                                    <div v-if="doc.layout.orientation === 'landscape'">
                                        <Label class="text-[11px]">Landscape Method</Label>
                                        <select
                                            v-model="doc.layout.landscapeMethod"
                                            class="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs"
                                        >
                                            <option value="sidewaystable">sidewaystable (rotating)</option>
                                            <option value="pdflscape">landscape page (pdflscape)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <Label class="text-[11px]">Fit to Page</Label>
                                        <select
                                            v-model="doc.layout.fitMode"
                                            class="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs"
                                        >
                                            <option value="none">Natural width</option>
                                            <option value="textwidth">Fit to text width</option>
                                            <option value="pagewidth">Fit to page width</option>
                                            <option value="pageheight">Fit to page height</option>
                                            <option value="both">Fit to width &amp; height</option>
                                        </select>
                                    </div>
                                    <div v-if="doc.layout.fitMode !== 'none'">
                                        <Label class="text-[11px]">Scaling Method</Label>
                                        <select
                                            v-model="doc.layout.fitMethod"
                                            class="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs"
                                        >
                                            <option value="resizebox">\resizebox (graphicx)</option>
                                            <option value="adjustbox">adjustbox</option>
                                            <option value="tabularx">tabularx</option>
                                        </select>
                                    </div>
                                    <div>
                                        <Label class="text-[11px]">Table Rotation</Label>
                                        <select
                                            v-model.number="doc.layout.rotationDegrees"
                                            class="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs"
                                        >
                                            <option :value="0">0&deg; (None)</option>
                                            <option :value="90">90&deg;</option>
                                            <option :value="180">180&deg;</option>
                                            <option :value="270">270&deg;</option>
                                        </select>
                                    </div>
                                    <label class="flex items-center gap-2 text-xs">
                                        <input v-model="doc.layout.wideTwoColumn" type="checkbox" />
                                        <span>Two-column span (table*)</span>
                                    </label>
                                </AccordionContent>
                            </AccordionItem>

                            <AccordionItem value="typography">
                                <AccordionTrigger>Typography &amp; Colors</AccordionTrigger>
                                <AccordionContent class="space-y-3">
                                    <div class="grid grid-cols-2 gap-2">
                                        <div>
                                            <Label class="text-[11px]">Font Size</Label>
                                            <select
                                                v-model="doc.style.fontSize"
                                                class="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs"
                                            >
                                                <option value="tiny">\tiny</option>
                                                <option value="scriptsize">\scriptsize</option>
                                                <option value="footnotesize">\footnotesize</option>
                                                <option value="small">\small</option>
                                                <option value="normalsize">\normalsize</option>
                                                <option value="large">\large</option>
                                            </select>
                                        </div>
                                        <div>
                                            <Label class="text-[11px]">Font Family</Label>
                                            <select
                                                v-model="doc.style.fontFamily"
                                                class="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs"
                                            >
                                                <option value="default">Default</option>
                                                <option value="rmfamily">Roman</option>
                                                <option value="sffamily">Sans</option>
                                                <option value="ttfamily">Mono</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <Label class="text-[11px]">Line Spacing</Label>
                                        <select
                                            v-model="doc.style.lineSpacing"
                                            class="mt-1 w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs"
                                        >
                                            <option value="1.0">Single (1.0)</option>
                                            <option value="1.15">1.15x</option>
                                            <option value="1.5">1.5x</option>
                                            <option value="2.0">Double (2.0)</option>
                                        </select>
                                    </div>
                                    <div v-if="activeCell" class="flex items-center justify-between gap-2">
                                        <Label class="text-[11px]">Cell Background</Label>
                                        <input
                                            v-model="activeCell.formatting.backgroundColor"
                                            type="color"
                                            class="h-7 w-12 cursor-pointer rounded border border-slate-200"
                                        />
                                    </div>
                                    <div class="flex items-center justify-between gap-2">
                                        <Label class="text-[11px]">Border Color</Label>
                                        <input
                                            v-model="doc.style.borderColor"
                                            type="color"
                                            class="h-7 w-12 cursor-pointer rounded border border-slate-200"
                                        />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </ScrollArea>
                </aside>
            </div>

            <AlertDialog :open="splitDialogOpen" @update:open="splitDialogOpen = $event">
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Split merged cell</AlertDialogTitle>
                        <AlertDialogDescription>
                            This merged cell contains multiple words. Choose how to preserve its content when splitting:
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction @click="executeSplitCell('keep_first')">
                            Keep in top-left cell
                        </AlertDialogAction>
                        <AlertDialogAction @click="executeSplitCell('distribute_words')">
                            Distribute words
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog :open="deleteDialogOpen" @update:open="deleteDialogOpen = $event">
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete table design</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete <strong>{{ doc.name }}</strong>?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction class="bg-destructive text-white hover:bg-destructive/90" @click="confirmDeleteDesign">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Toaster />
        </div>
    </TooltipProvider>
</template>
