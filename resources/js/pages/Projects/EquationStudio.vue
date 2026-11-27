<script setup lang="ts">
import { Head, Link, router } from '@inertiajs/vue3';
import {
    AlertCircle,
    ArrowLeft,
    CheckCircle2,
    Download,
    FileInput,
    History,
    Play,
    Plus,
    Redo2,
    Save,
    Search,
    Sigma,
    Trash2,
    Undo2,
} from '@lucide/vue';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { toast } from 'vue-sonner';
import MathfieldAdapter from '@/components/editor/MathfieldAdapter.vue';
import MonacoEditor from '@/components/editor/MonacoEditor.vue';
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
import { Textarea } from '@/components/ui/textarea';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { latexToMathML } from '@/lib/mathRenderer';
import projectsRoutes from '@/routes/projects';
import { DOMAIN_EXTRA_SYMBOLS } from '@/services/equationBuilder/customSymbols';
import { EQUATION_TEMPLATES } from '@/services/equationBuilder/equationTemplates';
import {
    type EquationInsertMode,
    validateEquationLatex,
    wrapEquationForInsertion,
} from '@/services/equationBuilder/equationValidator';
import {
    parseLatexToAst,
    toSpokenMathText,
} from '@/services/equationBuilder/latexAstParser';
import {
    type AlignedBuilderModel,
    type CasesRow,
    type MatrixBuilderModel,
    type MatrixEnv,
    type MultiLineEnv,
    parseSpreadsheetToMatrix,
    serializeAligned,
    serializeCases,
    serializeMatrix,
} from '@/services/equationBuilder/structuredBuilders';
import {
    MATH_SYMBOLS,
    type MathSymbolEntry,
    SYMBOL_CATEGORIES,
    type SymbolCategory,
} from '@/services/equationBuilder/symbolCatalogue';

interface EquationRecord {
    public_id: string;
    title: string;
    schema_version: number;
    content_mode: 'structured' | 'hybrid' | 'source';
    math_mode: 'inline' | 'display';
    environment: string;
    structured_document_json: Record<string, unknown> | null;
    latex_source: string;
    package_requirements_json: string[];
    pdf_url: string | null;
    updated_at: string | null;
}

interface EquationRevisionSummary {
    public_id: string;
    summary: string | null;
    content_mode: string;
    author: string;
    created_at: string | null;
}

interface EquationCommentSummary {
    public_id: string;
    body: string;
    author: string;
    is_resolved: boolean;
    created_at: string | null;
}

const props = defineProps<{
    project: {
        public_id: string;
        title: string;
        root_file_path: string;
        can_edit: boolean;
        can_comment?: boolean;
    };
    equations: EquationRecord[];
    activeEquation: EquationRecord | null;
    projectFiles?: Array<{ public_id: string; path: string; version: number }>;
    revisions?: EquationRevisionSummary[];
    comments?: EquationCommentSummary[];
}>();

const equationsList = ref<EquationRecord[]>([...props.equations]);
const activePublicId = ref<string | null>(props.activeEquation?.public_id ?? null);
const title = ref(props.activeEquation?.title ?? 'Objective Equation');
const latexSource = ref(
    props.activeEquation?.latex_source ??
        '\\hat{\\boldsymbol{\\theta}} = \\arg\\min_{\\boldsymbol{\\theta}} \\left\\| \\mathbf{X}\\boldsymbol{\\theta} - \\mathbf{y} \\right\\|_2^2 + \\lambda \\|\\boldsymbol{\\theta}\\|_2^2',
);
const mathMode = ref<'inline' | 'display'>(props.activeEquation?.math_mode ?? 'display');
const environment = ref<EquationInsertMode>(
    (props.activeEquation?.environment as EquationInsertMode) ?? 'equation',
);
const equationLabel = ref('eq:objective');

const historyPast = ref<string[]>([]);
const historyFuture = ref<string[]>([]);
const layoutMode = ref<'visual' | 'split' | 'code'>('split');
const leftTab = ref<'symbols' | 'builders' | 'templates'>('symbols');
const symbolCategory = ref<SymbolCategory | 'all'>('greek');
const symbolQuery = ref('');
const previewZoom = ref(100);

const isDirty = ref(false);
const isSaving = ref(false);
const isCompiling = ref(false);
const compiledPdfUrl = ref<string | null>(props.activeEquation?.pdf_url ?? null);
const compileDiagnostics = ref<Array<{ severity: string; line: number | null; message: string }>>([]);

const revisionsList = ref<EquationRevisionSummary[]>([...(props.revisions ?? [])]);
const commentsList = ref<EquationCommentSummary[]>([...(props.comments ?? [])]);
const newCommentBody = ref('');
const isPostingComment = ref(false);

const showCreateDialog = ref(false);
const newEquationTitle = ref('New Equation');
const showDeleteDialog = ref(false);
const showInsertDialog = ref(false);
const insertFileId = ref(props.projectFiles?.[0]?.public_id ?? '');
const isInserting = ref(false);

const mathfieldRef = ref<InstanceType<typeof MathfieldAdapter> | null>(null);
const monacoRef = ref<InstanceType<typeof MonacoEditor> | null>(null);

// Structured Builders State (Phase 3)
const matrixBuilder = ref<MatrixBuilderModel>({
    env: 'pmatrix',
    cells: [
        ['a_{11}', 'a_{12}'],
        ['a_{21}', 'a_{22}'],
    ],
});
const matrixPasteText = ref('');

const casesRows = ref<CasesRow[]>([
    { expr: 'x^2', condition: 'if x >= 0' },
    { expr: '-x', condition: 'if x < 0' },
]);

const alignedBuilder = ref<AlignedBuilderModel>({
    env: 'align',
    rows: [
        { lhs: 'f(x)', rhs: '(x + 1)^2', suppressNumber: false },
        { lhs: '', rhs: 'x^2 + 2x + 1', suppressNumber: false },
    ],
});

const allSymbols = computed<MathSymbolEntry[]>(() => [...MATH_SYMBOLS, ...DOMAIN_EXTRA_SYMBOLS]);

const filteredSymbols = computed(() => {
    const q = symbolQuery.value.trim().toLowerCase();
    const pool =
        q || symbolCategory.value === 'all'
            ? allSymbols.value
            : allSymbols.value.filter((s) => s.category === symbolCategory.value);

    if (!q) {
        return pool;
    }
    return pool.filter(
        (s) =>
            s.spokenName.toLowerCase().includes(q) ||
            s.latex.toLowerCase().includes(q) ||
            s.glyph.toLowerCase().includes(q) ||
            s.aliases.some((a) => a.toLowerCase().includes(q)),
    );
});

const validation = computed(() => validateEquationLatex(latexSource.value));
const astResult = computed(() => parseLatexToAst(latexSource.value));
const spokenPreview = computed(() => toSpokenMathText(latexSource.value));

const previewMathMl = computed(() => {
    try {
        return latexToMathML(latexSource.value || '\\;', mathMode.value === 'display');
    } catch {
        return '';
    }
});

function getCsrfToken(): string {
    const match = document.cookie.match(/XSRF-TOKEN=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : '';
}

function updateSource(next: string): void {
    if (next === latexSource.value) {
        return;
    }
    historyPast.value = [...historyPast.value.slice(-49), latexSource.value];
    historyFuture.value = [];
    latexSource.value = next;
    isDirty.value = true;
}

function undo(): void {
    if (historyPast.value.length === 0) {
        return;
    }
    const prev = historyPast.value[historyPast.value.length - 1];
    historyPast.value = historyPast.value.slice(0, -1);
    historyFuture.value = [latexSource.value, ...historyFuture.value];
    latexSource.value = prev;
    isDirty.value = true;
}

function redo(): void {
    if (historyFuture.value.length === 0) {
        return;
    }
    const next = historyFuture.value[0];
    historyFuture.value = historyFuture.value.slice(1);
    historyPast.value = [...historyPast.value, latexSource.value];
    latexSource.value = next;
    isDirty.value = true;
}

function insertSnippet(snippet: string): void {
    if (layoutMode.value === 'code' && monacoRef.value) {
        monacoRef.value.insertText(snippet);
        return;
    }
    if (mathfieldRef.value) {
        mathfieldRef.value.insertSnippet(snippet);
        return;
    }
    updateSource(latexSource.value ? `${latexSource.value} ${snippet}` : snippet);
}

// Matrix Builder Actions
function addMatrixRow(): void {
    const cols = matrixBuilder.value.cells[0]?.length ?? 2;
    matrixBuilder.value.cells.push(Array.from({ length: cols }, () => '0'));
}

function removeMatrixRow(): void {
    if (matrixBuilder.value.cells.length > 1) {
        matrixBuilder.value.cells.pop();
    }
}

function addMatrixCol(): void {
    for (const row of matrixBuilder.value.cells) {
        row.push('0');
    }
}

function removeMatrixCol(): void {
    if ((matrixBuilder.value.cells[0]?.length ?? 0) > 1) {
        for (const row of matrixBuilder.value.cells) {
            row.pop();
        }
    }
}

function importMatrixFromPaste(): void {
    if (!matrixPasteText.value.trim()) {
        return;
    }
    matrixBuilder.value.cells = parseSpreadsheetToMatrix(matrixPasteText.value);
    matrixPasteText.value = '';
    toast.success('Parsed matrix dimensions from pasted data');
}

function applyMatrixBuilder(): void {
    updateSource(serializeMatrix(matrixBuilder.value));
    toast.success('Applied matrix to equation');
}

function applyCasesBuilder(): void {
    updateSource(serializeCases(casesRows.value));
    toast.success('Applied cases environment');
}

function applyAlignedBuilder(): void {
    updateSource(serializeAligned(alignedBuilder.value));
    toast.success('Applied multi-line aligned environment');
}

async function saveEquation(): Promise<void> {
    if (!props.project.can_edit || isSaving.value) {
        return;
    }
    isSaving.value = true;
    try {
        const isUpdate = activePublicId.value !== null;
        const url = isUpdate
            ? projectsRoutes.equations.update({
                  project: props.project.public_id,
                  equation: activePublicId.value!,
              }).url
            : projectsRoutes.equations.store(props.project.public_id).url;

        const response = await fetch(url, {
            method: isUpdate ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-XSRF-TOKEN': getCsrfToken(),
            },
            body: JSON.stringify({
                title: title.value,
                schema_version: 1,
                content_mode: astResult.value.mode,
                math_mode: mathMode.value,
                environment: environment.value,
                structured_document_json: astResult.value.root,
                latex_source: latexSource.value,
                package_requirements_json: validation.value.requiredPackages,
            }),
        });

        if (!response.ok) {
            throw new Error(`Save failed (${response.status})`);
        }

        const data = (await response.json()) as {
            equation: EquationRecord;
            revisions?: EquationRevisionSummary[];
        };
        activePublicId.value = data.equation.public_id;
        const idx = equationsList.value.findIndex((e) => e.public_id === data.equation.public_id);
        if (idx >= 0) {
            equationsList.value[idx] = data.equation;
        } else {
            equationsList.value.unshift(data.equation);
        }
        if (data.revisions) {
            revisionsList.value = data.revisions;
        }
        isDirty.value = false;
        toast.success('Equation saved');
    } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Unable to save equation.');
    } finally {
        isSaving.value = false;
    }
}

async function createEquation(): Promise<void> {
    if (!props.project.can_edit) {
        return;
    }
    const eqTitle = newEquationTitle.value.trim() || 'Untitled Equation';
    const starter = 'y = mx + b';
    try {
        const response = await fetch(
            projectsRoutes.equations.store(props.project.public_id).url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-XSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify({
                    title: eqTitle,
                    schema_version: 1,
                    content_mode: 'structured',
                    math_mode: 'display',
                    environment: 'equation',
                    latex_source: starter,
                    package_requirements_json: ['amsmath'],
                }),
            },
        );
        if (!response.ok) {
            throw new Error(`Create failed (${response.status})`);
        }
        const data = (await response.json()) as {
            equation: EquationRecord;
            revisions?: EquationRevisionSummary[];
        };
        equationsList.value.unshift(data.equation);
        activePublicId.value = data.equation.public_id;
        title.value = data.equation.title;
        latexSource.value = data.equation.latex_source;
        revisionsList.value = data.revisions ?? [];
        commentsList.value = [];
        isDirty.value = false;
        showCreateDialog.value = false;
        toast.success(`Created "${data.equation.title}"`);
    } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Unable to create equation.');
    }
}

async function deleteActiveEquation(): Promise<void> {
    if (!activePublicId.value || !props.project.can_edit) {
        return;
    }
    const targetId = activePublicId.value;
    try {
        const response = await fetch(
            projectsRoutes.equations.destroy({
                project: props.project.public_id,
                equation: targetId,
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
            throw new Error(`Delete failed (${response.status})`);
        }
        equationsList.value = equationsList.value.filter((e) => e.public_id !== targetId);
        const next = equationsList.value[0] ?? null;
        activePublicId.value = next?.public_id ?? null;
        title.value = next?.title ?? 'Objective Equation';
        latexSource.value = next?.latex_source ?? 'E = mc^2';
        showDeleteDialog.value = false;
        toast.success('Equation deleted');
    } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Unable to delete equation.');
    }
}

async function compileTexPreview(): Promise<void> {
    if (!props.project.can_edit || isCompiling.value) {
        return;
    }
    if (isDirty.value || !activePublicId.value) {
        await saveEquation();
    }
    if (!activePublicId.value) {
        return;
    }

    isCompiling.value = true;
    try {
        const response = await fetch(
            projectsRoutes.equations.compilePreview({
                project: props.project.public_id,
                equation: activePublicId.value,
            }).url,
            {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'X-XSRF-TOKEN': getCsrfToken(),
                },
            },
        );
        const data = (await response.json()) as {
            status: string;
            pdf_url?: string | null;
            error_summary?: string;
            diagnostics?: Array<{ severity: string; line: number | null; message: string }>;
        };
        compileDiagnostics.value = data.diagnostics ?? [];
        if (data.pdf_url) {
            compiledPdfUrl.value = `${data.pdf_url}?t=${Date.now()}`;
        }
        if (response.ok && data.status === 'succeeded') {
            toast.success('TeX Live equation compiled');
        } else {
            toast.error(data.error_summary ?? 'TeX compilation failed');
        }
    } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Compilation failed');
    } finally {
        isCompiling.value = false;
    }
}

async function insertIntoManuscript(): Promise<void> {
    if (!insertFileId.value || !props.project.can_edit || isInserting.value) {
        return;
    }
    const targetFile = props.projectFiles?.find((f) => f.public_id === insertFileId.value);
    isInserting.value = true;
    try {
        const wrapped = wrapEquationForInsertion(
            latexSource.value,
            environment.value,
            equationLabel.value,
        );
        const response = await fetch(
            projectsRoutes.equations.insert(props.project.public_id).url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-XSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify({
                    file_public_id: insertFileId.value,
                    latex: wrapped,
                    expected_file_version: targetFile?.version,
                    packages_to_add: validation.value.requiredPackages,
                }),
            },
        );
        if (response.status === 409) {
            toast.error('Manuscript file changed since page load. Refresh before inserting.');
            return;
        }
        if (!response.ok) {
            throw new Error(`Insert failed (${response.status})`);
        }
        const data = (await response.json()) as { file_path: string };
        showInsertDialog.value = false;
        toast.success(`Inserted equation into ${data.file_path}`);
    } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Unable to insert equation.');
    } finally {
        isInserting.value = false;
    }
}

async function restoreRevision(revisionPublicId: string): Promise<void> {
    if (!activePublicId.value || !props.project.can_edit) {
        return;
    }
    try {
        const response = await fetch(
            projectsRoutes.equations.revisions.restore({
                project: props.project.public_id,
                equation: activePublicId.value,
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
            equation: EquationRecord;
            revisions?: EquationRevisionSummary[];
        };
        latexSource.value = data.equation.latex_source;
        if (data.revisions) {
            revisionsList.value = data.revisions;
        }
        isDirty.value = false;
        toast.success('Equation revision restored');
    } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Unable to restore revision.');
    }
}

async function postComment(): Promise<void> {
    if (!activePublicId.value || !newCommentBody.value.trim() || isPostingComment.value) {
        return;
    }
    isPostingComment.value = true;
    try {
        const response = await fetch(
            projectsRoutes.equations.comments.store({
                project: props.project.public_id,
                equation: activePublicId.value,
            }).url,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'X-XSRF-TOKEN': getCsrfToken(),
                },
                body: JSON.stringify({ body: newCommentBody.value.trim() }),
            },
        );
        if (!response.ok) {
            throw new Error(`Comment failed (${response.status})`);
        }
        const data = (await response.json()) as { comment: EquationCommentSummary };
        commentsList.value.unshift(data.comment);
        newCommentBody.value = '';
        toast.success('Comment posted');
    } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Unable to post comment.');
    } finally {
        isPostingComment.value = false;
    }
}

async function toggleResolveComment(commentPublicId: string): Promise<void> {
    if (!activePublicId.value) {
        return;
    }
    try {
        const response = await fetch(
            projectsRoutes.equations.comments.resolve({
                project: props.project.public_id,
                equation: activePublicId.value,
                comment: commentPublicId,
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
            throw new Error(`Resolve failed (${response.status})`);
        }
        const data = (await response.json()) as { comment: EquationCommentSummary };
        const idx = commentsList.value.findIndex((c) => c.public_id === data.comment.public_id);
        if (idx >= 0) {
            commentsList.value[idx] = data.comment;
        }
    } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Unable to update comment.');
    }
}

function exportLatexFile(): void {
    const content = wrapEquationForInsertion(latexSource.value, environment.value, equationLabel.value);
    const blob = new Blob([content + '\n'], { type: 'application/x-tex' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.value.toLowerCase().replace(/\s+/g, '-') || 'equation'}.tex`;
    a.click();
    URL.revokeObjectURL(url);
}

function switchEquation(publicId: string): void {
    router.visit(
        projectsRoutes.equations.show({
            project: props.project.public_id,
            equation: publicId,
        }).url,
    );
}

function handleGlobalKeydown(event: KeyboardEvent): void {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 's') {
        event.preventDefault();
        void saveEquation();
    }
}

onMounted(() => {
    window.addEventListener('keydown', handleGlobalKeydown);
});

onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleGlobalKeydown);
});
</script>

<template>
    <div class="flex h-screen flex-col overflow-hidden bg-slate-100 text-slate-900">
        <Head :title="`Equation Studio - ${project.title}`" />
        <Toaster position="bottom-right" />

        <TooltipProvider>
            <!-- Top Header -->
            <header class="flex h-12 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-3">
                <div class="flex items-center gap-2">
                    <Button variant="ghost" size="sm" as-child>
                        <Link :href="projectsRoutes.show(project.public_id).url">
                            <ArrowLeft class="mr-1.5 size-4" />
                            Project
                        </Link>
                    </Button>
                    <Separator orientation="vertical" class="h-5" />
                    <Sigma class="size-4 text-emerald-600" />
                    <Select
                        v-if="equationsList.length > 0"
                        :model-value="activePublicId ?? ''"
                        @update:model-value="switchEquation(String($event))"
                    >
                        <SelectTrigger class="h-8 w-44 text-xs">
                            <SelectValue placeholder="Select equation" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem v-for="eq in equationsList" :key="eq.public_id" :value="eq.public_id">
                                {{ eq.title }}
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    <Input
                        v-model="title"
                        :disabled="!project.can_edit"
                        class="h-8 w-44 text-xs font-medium"
                        aria-label="Equation title"
                        @change="isDirty = true"
                    />
                    <Badge :variant="astResult.mode === 'source' ? 'destructive' : astResult.mode === 'hybrid' ? 'outline' : 'secondary'" class="text-[11px] capitalize">
                        {{ astResult.mode }}
                    </Badge>
                    <Badge v-if="isDirty" variant="outline" class="border-amber-300 text-[11px] text-amber-700">
                        Unsaved
                    </Badge>
                </div>

                <div class="flex items-center gap-1.5">
                    <Tooltip>
                        <TooltipTrigger as-child>
                            <Button variant="ghost" size="icon" class="size-8" :disabled="historyPast.length === 0" aria-label="Undo" @click="undo">
                                <Undo2 class="size-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Undo</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger as-child>
                            <Button variant="ghost" size="icon" class="size-8" :disabled="historyFuture.length === 0" aria-label="Redo" @click="redo">
                                <Redo2 class="size-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Redo</TooltipContent>
                    </Tooltip>

                    <div class="flex items-center rounded-md border border-slate-200 p-0.5">
                        <Button :variant="layoutMode === 'visual' ? 'secondary' : 'ghost'" size="sm" class="h-7 px-2 text-xs" @click="layoutMode = 'visual'">Visual</Button>
                        <Button :variant="layoutMode === 'split' ? 'secondary' : 'ghost'" size="sm" class="h-7 px-2 text-xs" @click="layoutMode = 'split'">Split</Button>
                        <Button :variant="layoutMode === 'code' ? 'secondary' : 'ghost'" size="sm" class="h-7 px-2 text-xs" @click="layoutMode = 'code'">Code</Button>
                    </div>

                    <Button v-if="project.can_edit" variant="outline" size="sm" class="h-8 text-xs" :disabled="isCompiling" @click="compileTexPreview">
                        <Play class="mr-1 size-3.5" />
                        {{ isCompiling ? 'Compiling...' : 'Render TeX' }}
                    </Button>
                    <Button v-if="project.can_edit && (projectFiles?.length ?? 0) > 0" variant="outline" size="sm" class="h-8 text-xs" @click="showInsertDialog = true">
                        <FileInput class="mr-1 size-3.5" />
                        Insert
                    </Button>
                    <Button variant="outline" size="sm" class="h-8 text-xs" @click="exportLatexFile">
                        <Download class="mr-1 size-3.5" />
                        .tex
                    </Button>
                    <Button v-if="project.can_edit" variant="outline" size="sm" class="h-8 text-xs" @click="showCreateDialog = true">
                        <Plus class="mr-1 size-3.5" />
                        New
                    </Button>
                    <Button v-if="project.can_edit && activePublicId" variant="ghost" size="icon" class="size-8 text-red-600" aria-label="Delete equation" @click="showDeleteDialog = true">
                        <Trash2 class="size-4" />
                    </Button>
                    <Button v-if="project.can_edit" size="sm" class="h-8 text-xs" :disabled="isSaving" @click="saveEquation">
                        <Save class="mr-1.5 size-3.5" />
                        {{ isSaving ? 'Saving...' : 'Save' }}
                    </Button>
                </div>
            </header>

            <!-- Workspace Body -->
            <div class="flex min-h-0 flex-1 overflow-hidden">
                <!-- Left Panel: Symbols, Builders & Templates -->
                <aside class="flex w-72 shrink-0 flex-col border-r border-slate-200 bg-white">
                    <Tabs v-model="leftTab" class="flex h-full flex-col">
                        <TabsList class="m-2 grid h-8 grid-cols-3">
                            <TabsTrigger value="symbols" class="text-xs">Symbols</TabsTrigger>
                            <TabsTrigger value="builders" class="text-xs">Builders</TabsTrigger>
                            <TabsTrigger value="templates" class="text-xs">Templates</TabsTrigger>
                        </TabsList>

                        <TabsContent value="symbols" class="m-0 flex min-h-0 flex-1 flex-col px-2 pb-2">
                            <div class="relative mb-2">
                                <Search class="pointer-events-none absolute top-2 left-2.5 size-3.5 text-slate-400" />
                                <Input v-model="symbolQuery" class="h-8 pl-8 text-xs" placeholder="Search symbols..." />
                            </div>
                            <Select v-model="symbolCategory">
                                <SelectTrigger class="mb-2 h-8 text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Categories</SelectItem>
                                    <SelectItem v-for="c in SYMBOL_CATEGORIES" :key="c.id" :value="c.id">
                                        {{ c.label }}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <ScrollArea class="flex-1">
                                <div class="grid grid-cols-5 gap-1">
                                    <Tooltip v-for="sym in filteredSymbols" :key="sym.id">
                                        <TooltipTrigger as-child>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                class="h-8 px-1 font-serif text-sm"
                                                :aria-label="sym.spokenName"
                                                @click="insertSnippet(sym.snippet)"
                                            >
                                                {{ sym.glyph }}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent class="text-xs">
                                            <p>{{ sym.spokenName }}</p>
                                            <p class="font-mono text-[10px] text-slate-400">{{ sym.latex }}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </div>
                            </ScrollArea>
                        </TabsContent>

                        <TabsContent value="builders" class="m-0 min-h-0 flex-1 overflow-auto px-2 pb-2 text-xs">
                            <div class="space-y-4">
                                <!-- Matrix Builder -->
                                <div class="space-y-2 rounded-md border border-slate-200 p-2.5">
                                    <p class="font-semibold text-slate-700">Matrix Builder</p>
                                    <Select v-model="matrixBuilder.env">
                                        <SelectTrigger class="h-7 text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem v-for="env in (['pmatrix', 'bmatrix', 'Bmatrix', 'vmatrix', 'Vmatrix', 'matrix', 'smallmatrix'] as MatrixEnv[])" :key="env" :value="env">
                                                {{ env }}
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <div class="flex gap-1">
                                        <Button variant="outline" size="sm" class="h-6 flex-1 text-[11px]" @click="addMatrixRow">+ Row</Button>
                                        <Button variant="outline" size="sm" class="h-6 flex-1 text-[11px]" @click="removeMatrixRow">- Row</Button>
                                        <Button variant="outline" size="sm" class="h-6 flex-1 text-[11px]" @click="addMatrixCol">+ Col</Button>
                                        <Button variant="outline" size="sm" class="h-6 flex-1 text-[11px]" @click="removeMatrixCol">- Col</Button>
                                    </div>
                                    <div class="space-y-1 overflow-x-auto">
                                        <div v-for="(row, rIdx) in matrixBuilder.cells" :key="rIdx" class="flex gap-1">
                                            <Input
                                                v-for="(_, cIdx) in row"
                                                :key="cIdx"
                                                v-model="matrixBuilder.cells[rIdx][cIdx]"
                                                class="h-7 min-w-12 px-1.5 text-center font-mono text-[11px]"
                                            />
                                        </div>
                                    </div>
                                    <Textarea v-model="matrixPasteText" rows="2" class="font-mono text-[10px]" placeholder="Paste CSV/TSV cells..." />
                                    <div class="flex gap-1">
                                        <Button variant="outline" size="sm" class="h-7 flex-1 text-[11px]" @click="importMatrixFromPaste">Parse</Button>
                                        <Button size="sm" class="h-7 flex-1 text-[11px]" @click="applyMatrixBuilder">Apply Matrix</Button>
                                    </div>
                                </div>

                                <!-- Cases Builder -->
                                <div class="space-y-2 rounded-md border border-slate-200 p-2.5">
                                    <div class="flex items-center justify-between">
                                        <p class="font-semibold text-slate-700">Cases Builder</p>
                                        <Button variant="ghost" size="sm" class="h-6 px-1.5 text-[11px]" @click="casesRows.push({ expr: '0', condition: 'otherwise' })">+ Branch</Button>
                                    </div>
                                    <div v-for="(row, idx) in casesRows" :key="idx" class="grid grid-cols-2 gap-1">
                                        <Input v-model="row.expr" class="h-7 font-mono text-[11px]" placeholder="expr" />
                                        <Input v-model="row.condition" class="h-7 text-[11px]" placeholder="condition" />
                                    </div>
                                    <Button size="sm" class="h-7 w-full text-[11px]" @click="applyCasesBuilder">Apply Cases</Button>
                                </div>

                                <!-- Multi-line Aligned Builder -->
                                <div class="space-y-2 rounded-md border border-slate-200 p-2.5">
                                    <div class="flex items-center justify-between">
                                        <p class="font-semibold text-slate-700">Aligned Equations</p>
                                        <Button variant="ghost" size="sm" class="h-6 px-1.5 text-[11px]" @click="alignedBuilder.rows.push({ lhs: '', rhs: '', suppressNumber: false })">+ Line</Button>
                                    </div>
                                    <Select v-model="alignedBuilder.env">
                                        <SelectTrigger class="h-7 text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem v-for="env in (['align', 'align*', 'aligned', 'gather', 'gather*', 'multline', 'split'] as MultiLineEnv[])" :key="env" :value="env">
                                                {{ env }}
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <div v-for="(row, idx) in alignedBuilder.rows" :key="idx" class="space-y-1 rounded border border-slate-100 p-1">
                                        <div class="grid grid-cols-2 gap-1">
                                            <Input v-model="row.lhs" class="h-7 font-mono text-[11px]" placeholder="LHS" />
                                            <Input v-model="row.rhs" class="h-7 font-mono text-[11px]" placeholder="RHS" />
                                        </div>
                                        <div v-if="alignedBuilder.env === 'align' || alignedBuilder.env === 'gather'" class="flex items-center justify-between text-[10px] text-slate-500">
                                            <span>Suppress number (\nonumber)</span>
                                            <Switch v-model:model-value="row.suppressNumber" />
                                        </div>
                                    </div>
                                    <Button size="sm" class="h-7 w-full text-[11px]" @click="applyAlignedBuilder">Apply Aligned</Button>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="templates" class="m-0 min-h-0 flex-1 overflow-auto px-2 pb-2">
                            <div class="space-y-1.5">
                                <Button
                                    v-for="tpl in EQUATION_TEMPLATES"
                                    :key="tpl.id"
                                    variant="outline"
                                    size="sm"
                                    class="h-auto w-full flex-col items-start px-2.5 py-2 text-left"
                                    @click="updateSource(tpl.latex)"
                                >
                                    <span class="text-xs font-medium">{{ tpl.title }}</span>
                                    <span class="text-[10px] text-slate-500">{{ tpl.description }}</span>
                                </Button>
                            </div>
                        </TabsContent>
                    </Tabs>
                </aside>

                <!-- Center: Mathfield + Monaco + Bottom Tabs -->
                <main class="flex min-w-0 flex-1 flex-col overflow-hidden">
                    <div class="min-h-0 flex-1 overflow-auto p-3 space-y-3">
                        <MathfieldAdapter
                            v-if="layoutMode !== 'code'"
                            ref="mathfieldRef"
                            :model-value="latexSource"
                            :display-mode="mathMode === 'display'"
                            :read-only="!project.can_edit"
                            @update:model-value="updateSource"
                            @undo="undo"
                            @redo="redo"
                        />

                        <div v-if="layoutMode !== 'visual'" class="h-64 overflow-hidden rounded-md border border-slate-200 bg-white">
                            <MonacoEditor
                                ref="monacoRef"
                                :model-value="latexSource"
                                language="latex"
                                :read-only="!project.can_edit"
                                @update:model-value="updateSource"
                                @save="saveEquation"
                            />
                        </div>
                    </div>

                    <!-- Bottom Panel -->
                    <div class="h-48 shrink-0 border-t border-slate-200 bg-white">
                        <Tabs default-value="validation" class="flex h-full flex-col">
                            <div class="flex items-center justify-between border-b border-slate-200 px-3 py-1">
                                <TabsList class="h-7">
                                    <TabsTrigger value="validation" class="text-xs">Validation &amp; A11y</TabsTrigger>
                                    <TabsTrigger value="tex-preview" class="text-xs">TeX PDF</TabsTrigger>
                                    <TabsTrigger value="revisions" class="text-xs">Revisions ({{ revisionsList.length }})</TabsTrigger>
                                    <TabsTrigger value="comments" class="text-xs">Comments ({{ commentsList.length }})</TabsTrigger>
                                </TabsList>
                            </div>
                            <TabsContent value="validation" class="m-0 min-h-0 flex-1 overflow-auto p-3 text-xs space-y-2">
                                <div class="flex flex-wrap items-center gap-1.5">
                                    <Badge :variant="validation.valid ? 'secondary' : 'destructive'">
                                        <CheckCircle2 v-if="validation.valid" class="mr-1 size-3" />
                                        <AlertCircle v-else class="mr-1 size-3" />
                                        {{ validation.valid ? 'Balanced & Valid' : 'Syntax Issues Detected' }}
                                    </Badge>
                                    <Badge v-for="pkg in validation.requiredPackages" :key="pkg" variant="outline">
                                        {{ '\\usepackage{' + pkg + '}' }}
                                    </Badge>
                                </div>
                                <Alert v-if="validation.issues.length > 0" variant="destructive" class="py-1.5">
                                    <AlertTitle class="text-xs">Validation Notes</AlertTitle>
                                    <AlertDescription class="text-xs">
                                        <ul class="list-disc pl-4">
                                            <li v-for="(issue, i) in validation.issues" :key="i">{{ issue.message }}</li>
                                        </ul>
                                    </AlertDescription>
                                </Alert>
                                <div class="rounded border border-slate-200 bg-slate-50 p-2">
                                    <p class="text-[10px] font-semibold text-slate-500 uppercase">Screen-Reader Spoken Form</p>
                                    <p class="mt-0.5 text-slate-700">{{ spokenPreview || 'Empty expression' }}</p>
                                </div>
                            </TabsContent>
                            <TabsContent value="tex-preview" class="m-0 min-h-0 flex-1 overflow-hidden p-2">
                                <iframe v-if="compiledPdfUrl" :src="compiledPdfUrl" class="h-full w-full rounded border border-slate-200" title="Compiled Equation PDF" />
                                <div v-else class="flex h-full items-center justify-center text-xs text-slate-400">
                                    Click "Render TeX" to compile with the isolated TeX Live worker.
                                </div>
                            </TabsContent>
                            <TabsContent value="revisions" class="m-0 min-h-0 flex-1 overflow-auto p-3 text-xs">
                                <div v-if="revisionsList.length === 0" class="text-slate-400">No revisions yet.</div>
                                <div v-else class="space-y-1.5">
                                    <div v-for="rev in revisionsList" :key="rev.public_id" class="flex items-center justify-between rounded border border-slate-200 px-2.5 py-1.5">
                                        <div>
                                            <p class="font-medium">{{ rev.summary || 'Snapshot' }}</p>
                                            <p class="text-[10px] text-slate-500">{{ rev.author }} · {{ rev.content_mode }} · {{ rev.created_at }}</p>
                                        </div>
                                        <Button v-if="project.can_edit" variant="outline" size="sm" class="h-7 text-xs" @click="restoreRevision(rev.public_id)">
                                            <History class="mr-1 size-3" />
                                            Restore
                                        </Button>
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="comments" class="m-0 min-h-0 flex-1 overflow-auto p-3 text-xs">
                                <div v-if="project.can_comment && activePublicId" class="mb-2 flex gap-2">
                                    <Input v-model="newCommentBody" class="h-8 text-xs" placeholder="Add review comment..." @keydown.enter="postComment" />
                                    <Button size="sm" class="h-8 text-xs" :disabled="isPostingComment" @click="postComment">Post</Button>
                                </div>
                                <div v-if="commentsList.length === 0" class="text-slate-400">No comments yet.</div>
                                <div v-else class="space-y-1.5">
                                    <div v-for="c in commentsList" :key="c.public_id" class="flex items-start justify-between rounded border border-slate-200 px-2.5 py-1.5" :class="c.is_resolved ? 'opacity-60' : ''">
                                        <div>
                                            <span class="font-medium">{{ c.author }}</span>
                                            <p class="text-slate-700">{{ c.body }}</p>
                                        </div>
                                        <Button v-if="project.can_comment" variant="ghost" size="sm" class="h-7 text-[11px]" @click="toggleResolveComment(c.public_id)">
                                            {{ c.is_resolved ? 'Reopen' : 'Resolve' }}
                                        </Button>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </main>

                <!-- Right Panel: Live Preview, Settings & AST Tree -->
                <aside class="flex w-80 shrink-0 flex-col border-l border-slate-200 bg-white">
                    <div class="border-b border-slate-200 px-3 py-2">
                        <div class="flex items-center justify-between">
                            <span class="text-xs font-semibold tracking-wide text-slate-600 uppercase">Preview &amp; Structure</span>
                            <div class="flex items-center gap-1 text-[11px]">
                                <Button variant="ghost" size="sm" class="h-6 px-1.5" @click="previewZoom = Math.max(70, previewZoom - 15)">-</Button>
                                <span>{{ previewZoom }}%</span>
                                <Button variant="ghost" size="sm" class="h-6 px-1.5" @click="previewZoom = Math.min(180, previewZoom + 15)">+</Button>
                            </div>
                        </div>
                    </div>

                    <ScrollArea class="flex-1 p-3">
                        <div class="space-y-4 text-xs">
                            <div
                                class="flex min-h-24 items-center justify-center overflow-x-auto rounded-md border border-slate-200 bg-slate-950 p-3 text-white"
                                :style="{ fontSize: `${Math.round(16 * (previewZoom / 100))}px` }"
                                v-html="previewMathMl"
                            />

                            <div class="space-y-2 rounded-md border border-slate-200 p-2.5">
                                <Label class="text-[11px]">Environment</Label>
                                <Select v-model="environment">
                                    <SelectTrigger class="h-8 text-xs">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="inline">Inline ($...$)</SelectItem>
                                        <SelectItem value="inline_parens">Inline (\(...\))</SelectItem>
                                        <SelectItem value="display">Display (\[...\])</SelectItem>
                                        <SelectItem value="equation">Numbered Equation</SelectItem>
                                        <SelectItem value="equation_star">Unnumbered Equation*</SelectItem>
                                        <SelectItem value="align">Aligned (align)</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Label class="text-[11px]">Label (\label)</Label>
                                <Input v-model="equationLabel" class="h-8 text-xs" placeholder="eq:objective" />
                            </div>

                            <div class="space-y-1.5">
                                <div class="flex items-center justify-between">
                                    <span class="text-[11px] font-semibold tracking-wide text-slate-500 uppercase">
                                        Expression AST ({{ astResult.root.children.length }} nodes)
                                    </span>
                                    <Badge variant="outline" class="text-[10px]">
                                        {{ Math.round(astResult.confidence * 100) }}%
                                    </Badge>
                                </div>
                                <div class="max-h-48 space-y-1 overflow-auto rounded-md border border-slate-200 bg-slate-50 p-2 font-mono text-[11px]">
                                    <div
                                        v-for="node in astResult.root.children"
                                        :key="node.id"
                                        class="flex items-center justify-between rounded bg-white px-2 py-1"
                                    >
                                        <span class="truncate text-slate-800">{{ node.label }}</span>
                                        <Badge :variant="node.type === 'ProtectedLatex' ? 'destructive' : 'secondary'" class="text-[9px]">
                                            {{ node.type }}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollArea>
                </aside>
            </div>
        </TooltipProvider>

        <!-- Create Dialog -->
        <Dialog v-model:open="showCreateDialog">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Equation</DialogTitle>
                    <DialogDescription>Save a new mathematical equation in {{ project.title }}.</DialogDescription>
                </DialogHeader>
                <div class="py-2">
                    <Label>Title</Label>
                    <Input v-model="newEquationTitle" class="mt-1.5" @keydown.enter="createEquation" />
                </div>
                <DialogFooter>
                    <Button variant="outline" @click="showCreateDialog = false">Cancel</Button>
                    <Button @click="createEquation">Create</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

        <!-- Delete Dialog -->
        <AlertDialog v-model:open="showDeleteDialog">
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Equation?</AlertDialogTitle>
                    <AlertDialogDescription>This will permanently remove "{{ title }}".</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction @click="deleteActiveEquation">Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

        <!-- Insert Dialog -->
        <Dialog v-model:open="showInsertDialog">
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Insert Equation into Manuscript</DialogTitle>
                    <DialogDescription>Inserts at the end of the selected file and injects missing packages.</DialogDescription>
                </DialogHeader>
                <div class="space-y-3 py-2 text-xs">
                    <div>
                        <Label>Target .tex File</Label>
                        <Select v-model="insertFileId">
                            <SelectTrigger class="mt-1 h-8 text-xs">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem v-for="file in projectFiles ?? []" :key="file.public_id" :value="file.public_id">
                                    {{ file.path }} (v{{ file.version }})
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" @click="showInsertDialog = false">Cancel</Button>
                    <Button :disabled="isInserting || !insertFileId" @click="insertIntoManuscript">
                        {{ isInserting ? 'Inserting...' : 'Insert into Document' }}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
</template>
