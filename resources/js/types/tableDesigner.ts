export type HorizontalAlign = 'l' | 'c' | 'r';
export type ColumnType = 'l' | 'c' | 'r' | 'p' | 'm' | 'b' | 'X' | 'S' | 'custom';
export type VerticalAlign = 'top' | 'middle' | 'bottom';
export type ContentMode = 'text' | 'math' | 'latex';

export type BorderLineStyle =
    | 'none'
    | 'single'
    | 'double'
    | 'thick'
    | 'booktabs_top'
    | 'booktabs_mid'
    | 'booktabs_bottom'
    | 'dashed';

export interface BorderStyle {
    style: BorderLineStyle;
    color?: string;
    thickness?: string;
    trim?: 'l' | 'r' | 'lr' | 'none';
}

export interface CellMerge {
    rowSpan: number;
    colSpan: number;
    isMaster: boolean;
    masterRowId?: string;
    masterColId?: string;
    multirowValign?: 't' | 'c' | 'b';
    multirowVoffset?: string;
    horizontalAlignOverride?: HorizontalAlign;
    borderOverride?: string;
}

export interface CellFormatting {
    horizontalAlign?: HorizontalAlign;
    verticalAlign?: 't' | 'c' | 'b';
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    smallCaps?: boolean;
    fontSize?: string;
    textColor?: string;
    backgroundColor?: string;
    rotationDegrees?: number;
    paddingLeft?: string;
    paddingRight?: string;
}

export interface TableCell {
    rowId: string;
    colId: string;
    contentMode: ContentMode;
    content: string;
    merge?: CellMerge;
    formatting: CellFormatting;
    borders: {
        top?: BorderStyle;
        bottom?: BorderStyle;
        left?: BorderStyle;
        right?: BorderStyle;
    };
}

export interface TableColumn {
    id: string;
    index: number;
    type: ColumnType;
    customSpec?: string;
    width?: string;
    minWidth?: string;
    maxWidth?: string;
    verticalAlign?: VerticalAlign;
    backgroundColor?: string;
    textColor?: string;
    bold?: boolean;
    italic?: boolean;
    fontSize?: string;
    leftBorder: BorderStyle;
    rightBorder: BorderStyle;
}

export interface TableRow {
    id: string;
    index: number;
    section: 'head' | 'body' | 'foot';
    height?: string;
    minHeight?: string;
    verticalAlign?: VerticalAlign;
    backgroundColor?: string;
    textColor?: string;
    bold?: boolean;
    italic?: boolean;
    fontSize?: string;
    topPadding?: string;
    bottomPadding?: string;
    topBorder: BorderStyle;
    bottomBorder: BorderStyle;
    repeatOnNewPage?: boolean;
}

export interface TableLayout {
    environment: 'tabular' | 'tabularx' | 'longtable';
    floatingWrapper: 'table' | 'table*' | 'sidewaystable' | 'none';
    orientation: 'portrait' | 'landscape';
    landscapeMethod: 'sidewaystable' | 'pdflscape';
    rotationDegrees: 0 | 90 | 180 | 270;
    alignment: 'center' | 'left' | 'right';
    captionPosition: 'top' | 'bottom';
    fitMode: 'none' | 'textwidth' | 'pagewidth' | 'pageheight' | 'both' | 'custom';
    fitMethod: 'resizebox' | 'adjustbox' | 'tabularx' | 'scalebox';
    maxWidth?: string;
    maxHeight?: string;
    wideTwoColumn: boolean;
    longtableConfig?: {
        repeatFirstHeader: boolean;
        continuationCaption?: string;
        footerText?: string;
        lastFooterText?: string;
    };
}

export interface TableStyle {
    profileId?: string;
    preset:
        | 'standard'
        | 'booktabs'
        | 'ieee'
        | 'springer'
        | 'elsevier'
        | 'thesis'
        | 'custom';
    fontSize:
        | 'tiny'
        | 'scriptsize'
        | 'footnotesize'
        | 'small'
        | 'normalsize'
        | 'large'
        | 'Large'
        | 'custom';
    customFontSizePt?: number;
    fontFamily: 'default' | 'rmfamily' | 'sffamily' | 'ttfamily';
    lineSpacing: '1.0' | '1.15' | '1.5' | '2.0' | 'custom';
    arrayStretch?: number;
    tabColSep?: string;
    extraRowHeight?: string;
    alternatingRowColors?: {
        enabled: boolean;
        oddColor?: string;
        evenColor?: string;
    };
    tableBackgroundColor?: string;
    borderColor?: string;
}

export interface TableNote {
    id: string;
    kind: 'note' | 'source' | 'significance';
    text: string;
}

export interface TableFootnote {
    id: string;
    marker: string;
    text: string;
}

export interface PackageRequirement {
    packageName: string;
    options?: string[];
    reason: string;
    required: boolean;
}

export interface GenerationOptions {
    indentSpaces: 2 | 4;
    includeComments: boolean;
    escapePlainText: boolean;
}

export interface ValidationIssue {
    id: string;
    severity: 'error' | 'warning' | 'info';
    message: string;
    rowId?: string;
    colId?: string;
}

export interface TableDocument {
    schemaVersion: 1;
    id: string;
    name: string;
    caption?: string;
    shortCaption?: string;
    label?: string;
    layout: TableLayout;
    style: TableStyle;
    rows: TableRow[];
    columns: TableColumn[];
    cells: Record<string, TableCell>;
    notes: TableNote[];
    footnotes: TableFootnote[];
    packageRequirements: PackageRequirement[];
    generationOptions: GenerationOptions;
}

export function cellKey(rowId: string, colId: string): string {
    return `${rowId}:${colId}`;
}

export function makeId(prefix = 'id'): string {
    return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function createDefaultTableDocument(name = 'Untitled Table'): TableDocument {
    const rowIds = [makeId('r'), makeId('r'), makeId('r')];
    const colIds = [makeId('c'), makeId('c'), makeId('c')];

    const rows: TableRow[] = rowIds.map((id, index) => ({
        id,
        index,
        section: index === 0 ? 'head' : 'body',
        bold: index === 0,
        topBorder: {
            style: index === 0 ? 'booktabs_top' : 'none',
        },
        bottomBorder: {
            style:
                index === 0
                    ? 'booktabs_mid'
                    : index === rowIds.length - 1
                      ? 'booktabs_bottom'
                      : 'none',
        },
    }));

    const columns: TableColumn[] = colIds.map((id, index) => ({
        id,
        index,
        type: index === 0 ? 'l' : 'c',
        leftBorder: { style: 'none' },
        rightBorder: { style: 'none' },
    }));

    const sampleHeaders = ['Method', 'Precision', 'Recall'];
    const sampleRows = [
        ['Baseline', '0.81', '0.78'],
        ['Proposed', '0.92', '0.89'],
    ];

    const cells: Record<string, TableCell> = {};
    rows.forEach((row, rIdx) => {
        columns.forEach((col, cIdx) => {
            const content =
                rIdx === 0
                    ? (sampleHeaders[cIdx] ?? `Header ${cIdx + 1}`)
                    : (sampleRows[rIdx - 1]?.[cIdx] ?? '');
            cells[cellKey(row.id, col.id)] = {
                rowId: row.id,
                colId: col.id,
                contentMode: 'text',
                content,
                formatting: {},
                borders: {},
            };
        });
    });

    return {
        schemaVersion: 1,
        id: makeId('tbl'),
        name,
        caption: 'Experimental comparison across evaluation metrics.',
        label: 'tab:comparison',
        layout: {
            environment: 'tabular',
            floatingWrapper: 'table',
            orientation: 'portrait',
            landscapeMethod: 'sidewaystable',
            rotationDegrees: 0,
            alignment: 'center',
            captionPosition: 'top',
            fitMode: 'none',
            fitMethod: 'resizebox',
            wideTwoColumn: false,
        },
        style: {
            preset: 'booktabs',
            fontSize: 'normalsize',
            fontFamily: 'default',
            lineSpacing: '1.0',
        },
        rows,
        columns,
        cells,
        notes: [],
        footnotes: [],
        packageRequirements: [
            {
                packageName: 'booktabs',
                reason: 'Used for \\toprule, \\midrule, and \\bottomrule',
                required: true,
            },
        ],
        generationOptions: {
            indentSpaces: 4,
            includeComments: false,
            escapePlainText: true,
        },
    };
}
