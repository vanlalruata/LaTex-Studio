import {
    cellKey,
    createDefaultTableDocument,
    makeId,
    type TableColumn,
    type TableDocument,
    type TableRow,
} from '@/types/tableDesigner';

export interface TableTemplateDefinition {
    id: string;
    name: string;
    category: string;
    description: string;
    build: () => TableDocument;
}

function buildGrid(
    name: string,
    caption: string,
    label: string,
    colTypes: Array<'l' | 'c' | 'r' | 'S'>,
    headers: string[],
    bodyRows: string[][],
): TableDocument {
    const doc = createDefaultTableDocument(name);
    doc.caption = caption;
    doc.label = label;

    const colIds = colTypes.map(() => makeId('c'));
    const columns: TableColumn[] = colTypes.map((type, idx) => ({
        id: colIds[idx],
        index: idx,
        type,
        leftBorder: { style: 'none' },
        rightBorder: { style: 'none' },
    }));

    const allRowData = [headers, ...bodyRows];
    const rowIds = allRowData.map(() => makeId('r'));
    const rows: TableRow[] = allRowData.map((_, idx) => ({
        id: rowIds[idx],
        index: idx,
        section: idx === 0 ? 'head' : 'body',
        bold: idx === 0,
        topBorder: { style: idx === 0 ? 'booktabs_top' : 'none' },
        bottomBorder: {
            style:
                idx === 0
                    ? 'booktabs_mid'
                    : idx === allRowData.length - 1
                      ? 'booktabs_bottom'
                      : 'none',
        },
    }));

    const cells: TableDocument['cells'] = {};
    rows.forEach((row, rIdx) => {
        columns.forEach((col, cIdx) => {
            cells[cellKey(row.id, col.id)] = {
                rowId: row.id,
                colId: col.id,
                contentMode: 'text',
                content: allRowData[rIdx]?.[cIdx] ?? '',
                formatting: {},
                borders: {},
            };
        });
    });

    doc.rows = rows;
    doc.columns = columns;
    doc.cells = cells;
    return doc;
}

export const BUILT_IN_TABLE_TEMPLATES: TableTemplateDefinition[] = [
    {
        id: 'booktabs-basic',
        name: 'Three-Line Booktabs',
        category: 'Academic Standard',
        description: 'Classic three-rule academic comparison table.',
        build: () => createDefaultTableDocument('Academic Comparison'),
    },
    {
        id: 'ablation-study',
        name: 'Ablation Study',
        category: 'Machine Learning',
        description: 'Component ablation matrix with metric deltas.',
        build: () =>
            buildGrid(
                'Ablation Study',
                'Ablation analysis across model components on the validation split.',
                'tab:ablation',
                ['l', 'c', 'c', 'c'],
                ['Variant', 'Attention', 'Regularizer', 'Accuracy (%)'],
                [
                    ['Baseline', 'No', 'No', '84.2'],
                    ['+ Attention', 'Yes', 'No', '87.6'],
                    ['Full Model', 'Yes', 'Yes', '90.4'],
                ],
            ),
    },
    {
        id: 'statistical-siunitx',
        name: 'Statistical Results (siunitx)',
        category: 'Scientific',
        description: 'Decimal-aligned scientific results using siunitx S columns.',
        build: () => {
            const doc = buildGrid(
                'Statistical Results',
                'Mean performance and standard deviation across benchmarks.',
                'tab:stats',
                ['l', 'S', 'S'],
                ['Dataset', 'RMSE', 'MAE'],
                [
                    ['Corpus A', '0.142', '0.098'],
                    ['Corpus B', '0.215', '0.164'],
                ],
            );
            doc.notes = [
                {
                    id: makeId('note'),
                    kind: 'significance',
                    text: 'Lower values indicate better predictive calibration.',
                },
            ];
            return doc;
        },
    },
    {
        id: 'confusion-matrix',
        name: 'Confusion Matrix',
        category: 'Classification',
        description: 'Predicted vs actual class counts.',
        build: () =>
            buildGrid(
                'Confusion Matrix',
                'Classification confusion matrix on test evaluation.',
                'tab:confusion',
                ['l', 'c', 'c', 'c'],
                ['Actual \\ Predicted', 'Class A', 'Class B', 'Class C'],
                [
                    ['Class A', '142', '8', '2'],
                    ['Class B', '5', '128', '7'],
                    ['Class C', '1', '6', '151'],
                ],
            ),
    },
    {
        id: 'longtable-supplementary',
        name: 'Multi-Page Longtable',
        category: 'Multi-page',
        description: 'Supplementary table configured for multi-page longtable output.',
        build: () => {
            const doc = buildGrid(
                'Supplementary Results',
                'Extended per-sample evaluation across all experimental runs.',
                'tab:supplementary',
                ['l', 'c', 'c', 'c'],
                ['Sample ID', 'Condition', 'Metric A', 'Metric B'],
                [
                    ['S-001', 'Control', '0.84', '0.79'],
                    ['S-002', 'Treatment', '0.91', '0.88'],
                    ['S-003', 'Treatment', '0.93', '0.90'],
                ],
            );
            doc.layout.environment = 'longtable';
            doc.layout.floatingWrapper = 'none';
            doc.layout.longtableConfig = {
                repeatFirstHeader: true,
                continuationCaption: '\\tablename\\ \\thetable\\ -- Continued from previous page',
                footerText: 'Continued on next page',
            };
            return doc;
        },
    },
];

export function applyStyleProfileConfig(
    doc: TableDocument,
    config: Record<string, unknown>,
): void {
    if (typeof config.preset === 'string') {
        doc.style.preset = config.preset as TableDocument['style']['preset'];
    }
    if (typeof config.fontSize === 'string') {
        doc.style.fontSize = config.fontSize as TableDocument['style']['fontSize'];
    }
    if (typeof config.lineSpacing === 'string') {
        doc.style.lineSpacing = config.lineSpacing as TableDocument['style']['lineSpacing'];
    }
    if (typeof config.tabColSep === 'string') {
        doc.style.tabColSep = config.tabColSep;
    }
    if (typeof config.captionPosition === 'string') {
        doc.layout.captionPosition =
            config.captionPosition as TableDocument['layout']['captionPosition'];
    }
}
