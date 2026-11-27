export type MatrixEnv =
    | 'pmatrix'
    | 'bmatrix'
    | 'Bmatrix'
    | 'vmatrix'
    | 'Vmatrix'
    | 'matrix'
    | 'smallmatrix';

export type MultiLineEnv =
    | 'align'
    | 'align*'
    | 'aligned'
    | 'gather'
    | 'gather*'
    | 'multline'
    | 'multline*'
    | 'split';

export interface MatrixBuilderModel {
    env: MatrixEnv;
    cells: string[][];
}

export interface CasesRow {
    expr: string;
    condition: string;
}

export interface AlignedRow {
    lhs: string;
    rhs: string;
    suppressNumber: boolean;
}

export interface AlignedBuilderModel {
    env: MultiLineEnv;
    rows: AlignedRow[];
}

export function serializeMatrix(model: MatrixBuilderModel): string {
    const body = model.cells
        .map((row) => `  ${row.map((c) => c.trim() || '0').join(' & ')}`)
        .join(' \\\\\n');
    return `\\begin{${model.env}}\n${body}\n\\end{${model.env}}`;
}

export function parseSpreadsheetToMatrix(text: string): string[][] {
    const lines = text
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);
    if (lines.length === 0) {
        return [
            ['a', 'b'],
            ['c', 'd'],
        ];
    }
    const rows = lines.map((line) =>
        line.split(/[\t,]/).map((cell) => cell.trim() || '0'),
    );
    const maxCols = Math.max(...rows.map((r) => r.length));
    return rows.map((r) => {
        const padded = [...r];
        while (padded.length < maxCols) {
            padded.push('0');
        }
        return padded;
    });
}

export function serializeCases(rows: CasesRow[]): string {
    const body = rows
        .map(
            (r) =>
                `  ${r.expr.trim() || '0'} & ${r.condition.trim() ? `\\text{${r.condition.trim()}}` : '\\text{otherwise}'}`,
        )
        .join(' \\\\\n');
    return `\\begin{cases}\n${body}\n\\end{cases}`;
}

export function serializeAligned(model: AlignedBuilderModel): string {
    const isNumbered =
        model.env === 'align' || model.env === 'gather';
    const body = model.rows
        .map((r) => {
            const noNum = isNumbered && r.suppressNumber ? ' \\nonumber' : '';
            if (r.rhs.trim()) {
                return `  ${r.lhs.trim()} &= ${r.rhs.trim()}${noNum}`;
            }
            return `  ${r.lhs.trim()}${noNum}`;
        })
        .join(' \\\\\n');
    return `\\begin{${model.env}}\n${body}\n\\end{${model.env}}`;
}
