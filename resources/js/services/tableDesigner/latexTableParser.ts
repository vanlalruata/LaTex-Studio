import {
    cellKey,
    createDefaultTableDocument,
    makeId,
    type ColumnType,
    type TableColumn,
    type TableDocument,
    type TableRow,
} from '@/types/tableDesigner';

export interface ParseTableResult {
    ok: boolean;
    document?: TableDocument;
    reason?: string;
    rawLatex: string;
}

function parseColumnSpec(spec: string): ColumnType[] | null {
    const cleaned = spec.replace(/\|/g, '').trim();
    const cols: ColumnType[] = [];
    let i = 0;

    while (i < cleaned.length) {
        const ch = cleaned[i];
        if (ch === ' ' || ch === '\t') {
            i++;
            continue;
        }
        if (
            ch === 'l' ||
            ch === 'c' ||
            ch === 'r' ||
            ch === 'X' ||
            ch === 'S'
        ) {
            cols.push(ch);
            i++;
            continue;
        }
        if (ch === 'p' || ch === 'm' || ch === 'b') {
            const rest = cleaned.slice(i + 1);
            const braceMatch = rest.match(/^\{[^}]*\}/);
            if (!braceMatch) {
                return null;
            }
            cols.push(ch);
            i += 1 + braceMatch[0].length;
            continue;
        }
        return null;
    }

    return cols.length > 0 ? cols : null;
}

export function parseLatexTable(rawLatex: string): ParseTableResult {
    const trimmed = rawLatex.trim();
    if (!trimmed) {
        return {
            ok: false,
            reason: 'Empty LaTeX selection.',
            rawLatex,
        };
    }

    // Reject nested tabulars or unsupported custom environments
    const tabularMatches =
        trimmed.match(/\\begin\{(tabular|tabularx|longtable)\}/g) ?? [];
    if (tabularMatches.length !== 1) {
        return {
            ok: false,
            reason:
                tabularMatches.length === 0
                    ? 'No tabular, tabularx, or longtable environment found.'
                    : 'Nested tabular environments are only editable in source-only mode.',
            rawLatex,
        };
    }

    const envMatch = trimmed.match(
        /\\begin\{(tabular|tabularx|longtable)\}(?:\{[^}]*\})?\{([^}]+)\}([\s\S]*?)\\end\{\1\}/,
    );
    if (!envMatch) {
        return {
            ok: false,
            reason: 'Could not parse table environment boundaries.',
            rawLatex,
        };
    }

    const environment = envMatch[1] as 'tabular' | 'tabularx' | 'longtable';
    const colTypes = parseColumnSpec(envMatch[2]);
    if (!colTypes) {
        return {
            ok: false,
            reason: `Unsupported column specification "${envMatch[2]}". Opened in source-only mode.`,
            rawLatex,
        };
    }

    const body = envMatch[3];
    const captionMatch = trimmed.match(/\\caption(?:\[[^\]]*\])?\{([^}]*)\}/);
    const labelMatch = trimmed.match(/\\label\{([^}]*)\}/);

    const rawLines = body
        .split('\\\\')
        .map((chunk) => chunk.trim())
        .filter(
            (chunk) =>
                chunk.length > 0 &&
                !/^\\(bottomrule|hline|endfirsthead|endhead|endfoot|endlastfoot)$/.test(
                    chunk,
                ),
        );

    if (rawLines.length === 0) {
        return {
            ok: false,
            reason: 'No table rows found in LaTeX source.',
            rawLatex,
        };
    }

    const doc = createDefaultTableDocument('Imported Table');
    doc.layout.environment = environment;
    if (environment === 'longtable') {
        doc.layout.floatingWrapper = 'none';
    }
    doc.caption = captionMatch ? captionMatch[1] : '';
    doc.label = labelMatch ? labelMatch[1] : '';

    const columns: TableColumn[] = colTypes.map((type, index) => ({
        id: makeId('c'),
        index,
        type,
        leftBorder: { style: 'none' },
        rightBorder: { style: 'none' },
    }));

    const rows: TableRow[] = [];
    const cells: TableDocument['cells'] = {};

    rawLines.forEach((rawLine, rIdx) => {
        const hasTop = /\\toprule|\\hline/.test(rawLine);
        const hasMid = /\\midrule/.test(rawLine);
        const cleanedLine = rawLine
            .replace(
                /\\(toprule|midrule|bottomrule|hline|caption(?:\[[^\]]*\])?\{[^}]*\}|label\{[^}]*\})/g,
                '',
            )
            .trim();

        if (!cleanedLine) {
            return;
        }

        const rowId = makeId('r');
        const row: TableRow = {
            id: rowId,
            index: rows.length,
            section: rows.length === 0 ? 'head' : 'body',
            bold: rows.length === 0,
            topBorder: {
                style: hasTop
                    ? 'booktabs_top'
                    : hasMid
                      ? 'booktabs_mid'
                      : 'none',
            },
            bottomBorder: {
                style:
                    rIdx === rawLines.length - 1 ? 'booktabs_bottom' : 'none',
            },
        };
        rows.push(row);

        const parts = cleanedLine.split('&').map((p) => p.trim());
        columns.forEach((col, cIdx) => {
            const rawCell = parts[cIdx] ?? '';
            const isMath = rawCell.startsWith('$') && rawCell.endsWith('$');
            cells[cellKey(rowId, col.id)] = {
                rowId,
                colId: col.id,
                contentMode: isMath ? 'math' : 'text',
                content: isMath ? rawCell.slice(1, -1) : rawCell,
                formatting: {},
                borders: {},
            };
        });
    });

    if (rows.length === 0) {
        return {
            ok: false,
            reason: 'Could not extract data rows from LaTeX table.',
            rawLatex,
        };
    }

    doc.rows = rows;
    doc.columns = columns;
    doc.cells = cells;

    return {
        ok: true,
        document: doc,
        rawLatex,
    };
}
