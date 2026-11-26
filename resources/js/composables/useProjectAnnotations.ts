import { ref } from 'vue';
import { apiGet, apiSend } from '@/lib/http';
import annotationsRoutes from '@/routes/projects/annotations';

export type AnnotationKind = 'note' | 'highlight' | 'task';
export type AnnotationColor = 'yellow' | 'green' | 'blue' | 'rose' | 'violet';

export interface AnnotationItem {
    public_id: string;
    file_id: string | null;
    file_path: string | null;
    kind: AnnotationKind;
    start_line: number;
    end_line: number;
    color: AnnotationColor;
    body: string | null;
    status: 'open' | 'resolved';
    author_name: string;
    created_at: string | null;
}

export function useProjectAnnotations(projectPublicId: string) {
    const annotations = ref<AnnotationItem[]>([]);
    const error = ref<string | null>(null);

    async function load(fileId?: string | null): Promise<void> {
        const query = fileId ? `?file_id=${encodeURIComponent(fileId)}` : '';
        const result = await apiGet<{ annotations: AnnotationItem[] }>(
            `${annotationsRoutes.index(projectPublicId).url}${query}`,
        );

        if (!result.ok || !result.data) {
            error.value = result.message;

            return;
        }

        annotations.value = result.data.annotations;
        error.value = null;
    }

    async function create(payload: {
        fileId: string;
        startLine: number;
        endLine?: number;
        kind?: AnnotationKind;
        color?: AnnotationColor;
        body?: string;
    }): Promise<boolean> {
        const result = await apiSend<{ annotation: AnnotationItem }>(
            annotationsRoutes.store(projectPublicId).url,
            'POST',
            {
                file_id: payload.fileId,
                start_line: payload.startLine,
                end_line: payload.endLine ?? payload.startLine,
                kind: payload.kind ?? 'note',
                color: payload.color ?? 'yellow',
                body: payload.body ?? null,
            },
        );

        if (!result.ok || !result.data) {
            error.value = result.message;

            return false;
        }

        annotations.value = [result.data.annotation, ...annotations.value];

        return true;
    }

    async function resolve(annotationId: string): Promise<void> {
        const result = await apiSend<{ annotation: AnnotationItem }>(
            annotationsRoutes.update({
                project: projectPublicId,
                annotation: annotationId,
            }).url,
            'PATCH',
            { status: 'resolved' },
        );

        if (result.ok && result.data) {
            const updated = result.data.annotation;
            annotations.value = annotations.value.map((annotation) =>
                annotation.public_id === updated.public_id
                    ? updated
                    : annotation,
            );
        }
    }

    async function remove(annotationId: string): Promise<void> {
        const result = await apiSend<{ deleted: boolean }>(
            annotationsRoutes.destroy({
                project: projectPublicId,
                annotation: annotationId,
            }).url,
            'DELETE',
        );

        if (result.ok) {
            annotations.value = annotations.value.filter(
                (annotation) => annotation.public_id !== annotationId,
            );
        }
    }

    return { annotations, error, load, create, resolve, remove };
}