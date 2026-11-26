import { ref } from 'vue';
import { apiGet, apiSend } from '@/lib/http';
import researchAssetsRoutes from '@/routes/projects/research-assets';
import bibliographyRoutes from '@/routes/projects/bibliography';
import ocrRoutes from '@/routes/projects/ocr';
import conversionsRoutes from '@/routes/projects/conversions';

export type ResearchAssetKind = 'figure' | 'table' | 'equation';

export interface ResearchAssetItem {
    public_id: string;
    kind: ResearchAssetKind;
    title: string;
    label: string | null;
    caption: string | null;
    payload: Record<string, unknown>;
    status: 'draft' | 'ready';
    author_name: string | null;
    created_at: string | null;
}

export interface BibliographyItem {
    public_id: string;
    key: string;
    provider: string;
    title: string;
    authors: string[];
    year: number | null;
    venue: string | null;
    doi: string | null;
    is_imported: boolean;
    citation: string;
    created_at: string | null;
}

export interface OcrJobItem {
    public_id: string;
    status: string;
    source_filename: string;
    mime_type: string | null;
    languages: string | null;
    extracted_latex: string | null;
    confidence: number | null;
    error_message: string | null;
    requested_by: string | null;
    created_at: string | null;
}

export interface ConversionJobItem {
    public_id: string;
    status: string;
    direction: 'docx_to_latex' | 'latex_to_docx' | 'markdown_to_latex';
    engine: string;
    input_filename: string;
    output_filename: string | null;
    log_excerpt: string | null;
    requested_by: string | null;
    created_at: string | null;
}

export function useResearchWorkspace(projectPublicId: string) {
    const assets = ref<ResearchAssetItem[]>([]);
    const sources = ref<BibliographyItem[]>([]);
    const ocrJobs = ref<OcrJobItem[]>([]);
    const conversions = ref<ConversionJobItem[]>([]);
    const error = ref<string | null>(null);

    async function load(): Promise<void> {
        const [assetsRes, sourcesRes, ocrRes, conversionsRes] =
            await Promise.all([
                apiGet<{ assets: ResearchAssetItem[] }>(
                    researchAssetsRoutes.index(projectPublicId).url,
                ),
                apiGet<{ sources: BibliographyItem[] }>(
                    bibliographyRoutes.index(projectPublicId).url,
                ),
                apiGet<{ jobs: OcrJobItem[] }>(
                    ocrRoutes.index(projectPublicId).url,
                ),
                apiGet<{ jobs: ConversionJobItem[] }>(
                    conversionsRoutes.index(projectPublicId).url,
                ),
            ]);

        if (assetsRes.data) {
            assets.value = assetsRes.data.assets;
        }
        if (sourcesRes.data) {
            sources.value = sourcesRes.data.sources;
        }
        if (ocrRes.data) {
            ocrJobs.value = ocrRes.data.jobs;
        }
        if (conversionsRes.data) {
            conversions.value = conversionsRes.data.jobs;
        }
    }

    async function searchSources(term: string): Promise<void> {
        const query = term.trim()
            ? `?q=${encodeURIComponent(term.trim())}`
            : '';
        const result = await apiGet<{ sources: BibliographyItem[] }>(
            `${bibliographyRoutes.index(projectPublicId).url}${query}`,
        );

        if (result.data) {
            sources.value = result.data.sources;
        }
    }

    async function createAsset(payload: {
        kind: ResearchAssetKind;
        title: string;
        label?: string;
        caption?: string;
        latex?: string;
    }): Promise<boolean> {
        const result = await apiSend<{ asset: ResearchAssetItem }>(
            researchAssetsRoutes.store(projectPublicId).url,
            'POST',
            {
                kind: payload.kind,
                title: payload.title,
                label: payload.label ?? null,
                caption: payload.caption ?? null,
                payload: { latex: payload.latex ?? '' },
                status: 'ready',
            },
        );

        if (!result.ok || !result.data) {
            error.value = result.message;

            return false;
        }

        assets.value = [result.data.asset, ...assets.value];

        return true;
    }

    async function deleteAsset(assetId: string): Promise<void> {
        const result = await apiSend<{ deleted: boolean }>(
            researchAssetsRoutes.destroy({
                project: projectPublicId,
                asset: assetId,
            }).url,
            'DELETE',
        );

        if (result.ok) {
            assets.value = assets.value.filter(
                (asset) => asset.public_id !== assetId,
            );
        }
    }

    async function createOcrJob(sourceFilename: string): Promise<boolean> {
        const result = await apiSend<{ job: OcrJobItem }>(
            ocrRoutes.store(projectPublicId).url,
            'POST',
            { source_filename: sourceFilename, languages: 'eng' },
        );

        if (!result.ok || !result.data) {
            error.value = result.message;

            return false;
        }

        ocrJobs.value = [result.data.job, ...ocrJobs.value];

        return true;
    }

    async function deleteOcrJob(jobId: string): Promise<void> {
        const result = await apiSend<{ deleted: boolean }>(
            ocrRoutes.destroy({
                project: projectPublicId,
                ocrJob: jobId,
            }).url,
            'DELETE',
        );

        if (result.ok) {
            ocrJobs.value = ocrJobs.value.filter(
                (job) => job.public_id !== jobId,
            );
        }
    }

    async function createConversion(
        direction: ConversionJobItem['direction'],
        inputFilename: string,
    ): Promise<boolean> {
        const result = await apiSend<{ job: ConversionJobItem }>(
            conversionsRoutes.store(projectPublicId).url,
            'POST',
            { direction, input_filename: inputFilename },
        );

        if (!result.ok || !result.data) {
            error.value = result.message;

            return false;
        }

        conversions.value = [result.data.job, ...conversions.value];

        return true;
    }

    async function deleteConversion(jobId: string): Promise<void> {
        const result = await apiSend<{ deleted: boolean }>(
            conversionsRoutes.destroy({
                project: projectPublicId,
                conversionJob: jobId,
            }).url,
            'DELETE',
        );

        if (result.ok) {
            conversions.value = conversions.value.filter(
                (job) => job.public_id !== jobId,
            );
        }
    }

    return {
        assets,
        sources,
        ocrJobs,
        conversions,
        error,
        load,
        searchSources,
        createAsset,
        deleteAsset,
        createOcrJob,
        deleteOcrJob,
        createConversion,
        deleteConversion,
    };
}