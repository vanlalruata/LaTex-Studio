import { ref } from 'vue';
import { apiGet, apiSend } from '@/lib/http';
import revisionsRoutes from '@/routes/projects/revisions';

export interface RevisionSummary {
    public_id: string;
    revision_hash: string;
    message: string | null;
    creator_name: string;
    created_at: string | null;
}

export interface RevisionFileDiff {
    path: string;
    status: 'added' | 'removed' | 'modified' | 'unchanged';
    before: string | null;
    after: string | null;
    text_available: boolean;
    size_bytes: number;
}

export interface RevisionDiff {
    revision: RevisionSummary;
    against: RevisionSummary | null;
    counts: {
        added: number;
        removed: number;
        modified: number;
        unchanged: number;
    };
    files: RevisionFileDiff[];
}

export function useRevisions(projectPublicId: string) {
    const revisions = ref<RevisionSummary[]>([]);
    const diff = ref<RevisionDiff | null>(null);
    const isLoadingDiff = ref(false);
    const isRestoring = ref(false);
    const error = ref<string | null>(null);

    async function loadList(): Promise<void> {
        const result = await apiGet<{ revisions: RevisionSummary[] }>(
            revisionsRoutes.index(projectPublicId).url,
        );

        if (result.ok && result.data) {
            revisions.value = result.data.revisions;
        }
    }

    async function loadDiff(
        revisionId: string,
        against: string = 'current',
    ): Promise<void> {
        isLoadingDiff.value = true;
        diff.value = null;
        const query =
            against === 'current'
                ? ''
                : `?against=${encodeURIComponent(against)}`;

        const result = await apiGet<RevisionDiff>(
            `${revisionsRoutes.diff({
                project: projectPublicId,
                revision: revisionId,
            }).url}${query}`,
        );
        isLoadingDiff.value = false;

        if (!result.ok || !result.data) {
            error.value = result.message;

            return;
        }

        diff.value = result.data;
        error.value = null;
    }

    async function restore(revisionId: string): Promise<boolean> {
        isRestoring.value = true;
        const result = await apiSend<{
            restored: number;
            created: number;
            skipped: number;
            revision: RevisionSummary;
        }>(
            revisionsRoutes.restore({
                project: projectPublicId,
                revision: revisionId,
            }).url,
            'POST',
        );
        isRestoring.value = false;

        if (!result.ok) {
            error.value = result.message;

            return false;
        }

        await loadList();
        diff.value = null;

        return true;
    }

    function activeRevisionId(): string | null {
        return diff.value?.revision.public_id ?? null;
    }

    return {
        revisions,
        diff,
        isLoadingDiff,
        isRestoring,
        error,
        loadList,
        loadDiff,
        restore,
        activeRevisionId,
    };
}