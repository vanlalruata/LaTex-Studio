import {
    cellKey,
    type TableDocument,
    type ValidationIssue,
} from '@/types/tableDesigner';

export function validateTableDocument(doc: TableDocument): ValidationIssue[] {
    const issues: ValidationIssue[] = [];

    if (doc.rows.length === 0 || doc.columns.length === 0) {
        issues.push({
            id: 'empty-grid',
            severity: 'error',
            message: 'Table must contain at least one row and one column.',
        });
        return issues;
    }

    if (doc.label && !/^[a-zA-Z0-9:_-]+$/.test(doc.label)) {
        issues.push({
            id: 'invalid-label',
            severity: 'warning',
            message:
                'Label contains characters that may cause LaTeX reference issues. Prefer letters, digits, colons, or hyphens.',
        });
    }

    const hasVerticalRule = doc.columns.some(
        (c) =>
            c.leftBorder.style !== 'none' || c.rightBorder.style !== 'none',
    );
    const usesBooktabs =
        doc.style.preset === 'booktabs' ||
        doc.rows.some(
            (r) =>
                r.topBorder.style.startsWith('booktabs_') ||
                r.bottomBorder.style.startsWith('booktabs_'),
        );

    if (usesBooktabs && hasVerticalRule) {
        issues.push({
            id: 'booktabs-vertical-conflict',
            severity: 'warning',
            message:
                'Booktabs style discourages vertical borders because \\toprule/\\midrule leave small vertical gaps.',
        });
    }

    if (
        doc.layout.environment === 'longtable' &&
        doc.layout.floatingWrapper !== 'none'
    ) {
        issues.push({
            id: 'longtable-float-conflict',
            severity: 'error',
            message:
                'longtable cannot be wrapped inside a floating table environment.',
        });
    }

    if (
        doc.layout.fitMode !== 'none' &&
        (doc.style.fontSize === 'tiny' || doc.style.fontSize === 'scriptsize')
    ) {
        issues.push({
            id: 'tiny-font-with-scaling',
            severity: 'warning',
            message:
                'Combining Fit-to-Page scaling with \\tiny or \\scriptsize may produce unreadable text.',
        });
    }

    if (doc.layout.fitMode !== 'none' && doc.columns.length > 8) {
        issues.push({
            id: 'wide-table-scaling',
            severity: 'info',
            message:
                'Wide table with many columns may scale aggressively; consider landscape orientation or smaller \\tabcolsep.',
        });
    }

    // Check cells for unbalanced braces in raw latex/math mode
    for (const row of doc.rows) {
        for (const col of doc.columns) {
            const cell = doc.cells[cellKey(row.id, col.id)];
            if (!cell || cell.contentMode === 'text') {
                continue;
            }
            const open = (cell.content.match(/\{/g) || []).length;
            const close = (cell.content.match(/\}/g) || []).length;
            if (open !== close) {
                issues.push({
                    id: `unbalanced-braces-${row.id}-${col.id}`,
                    severity: 'error',
                    message: `Unbalanced curly braces in Row ${row.index + 1}, Column ${col.index + 1}.`,
                    rowId: row.id,
                    colId: col.id,
                });
            }
        }
    }

    return issues;
}
