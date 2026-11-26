import {
    cellKey,
    makeId,
    type TableCell,
    type TableColumn,
    type TableDocument,
    type TableRow,
} from '@/types/tableDesigner';

export interface SelectionBounds {
    minRow: number;
    maxRow: number;
    minCol: number;
    maxCol: number;
    isValidRectangle: boolean;
    hasPartialMergeOverlap: boolean;
    cellCount: number;
}

export function analyzeSelection(
    doc: TableDocument,
    selectedKeys: Set<string>,
): SelectionBounds | null {
    if (selectedKeys.size === 0) {
        return null;
    }

    const rowIndexById = new Map(doc.rows.map((r, i) => [r.id, i]));
    const colIndexById = new Map(doc.columns.map((c, i) => [c.id, i]));

    let minRow = Infinity;
    let maxRow = -1;
    let minCol = Infinity;
    let maxCol = -1;

    for (const key of selectedKeys) {
        const [rId, cId] = key.split(':');
        const rIdx = rowIndexById.get(rId);
        const cIdx = colIndexById.get(cId);
        if (rIdx === undefined || cIdx === undefined) {
            continue;
        }
        minRow = Math.min(minRow, rIdx);
        maxRow = Math.max(maxRow, rIdx);
        minCol = Math.min(minCol, cIdx);
        maxCol = Math.max(maxCol, cIdx);
    }

    if (maxRow < 0 || maxCol < 0) {
        return null;
    }

    const expectedCount = (maxRow - minRow + 1) * (maxCol - minCol + 1);
    let isValidRectangle = true;
    let hasPartialMergeOverlap = false;

    for (let r = minRow; r <= maxRow; r++) {
        for (let c = minCol; c <= maxCol; c++) {
            const row = doc.rows[r];
            const col = doc.columns[c];
            if (!row || !col) {
                continue;
            }
            const key = cellKey(row.id, col.id);
            const cell = doc.cells[key];

            if (!selectedKeys.has(key)) {
                // Allow missing keys only if they are non-master cells belonging to a selected master inside the rectangle
                if (!cell?.merge || cell.merge.isMaster) {
                    isValidRectangle = false;
                }
            }

            if (cell?.merge) {
                const masterRowId = cell.merge.isMaster
                    ? row.id
                    : cell.merge.masterRowId;
                const masterColId = cell.merge.isMaster
                    ? col.id
                    : cell.merge.masterColId;
                const mRowIdx = masterRowId ? rowIndexById.get(masterRowId) : undefined;
                const mColIdx = masterColId ? colIndexById.get(masterColId) : undefined;
                const masterCell =
                    masterRowId && masterColId
                        ? doc.cells[cellKey(masterRowId, masterColId)]
                        : undefined;
                if (
                    mRowIdx !== undefined &&
                    mColIdx !== undefined &&
                    masterCell?.merge
                ) {
                    const mMaxRow = mRowIdx + masterCell.merge.rowSpan - 1;
                    const mMaxCol = mColIdx + masterCell.merge.colSpan - 1;
                    if (
                        mRowIdx < minRow ||
                        mColIdx < minCol ||
                        mMaxRow > maxRow ||
                        mMaxCol > maxCol
                    ) {
                        hasPartialMergeOverlap = true;
                    }
                }
            }
        }
    }

    return {
        minRow,
        maxRow,
        minCol,
        maxCol,
        isValidRectangle: isValidRectangle && !hasPartialMergeOverlap,
        hasPartialMergeOverlap,
        cellCount: expectedCount,
    };
}

export function mergeSelectedCells(
    doc: TableDocument,
    selectedKeys: Set<string>,
): boolean {
    const bounds = analyzeSelection(doc, selectedKeys);
    if (!bounds || !bounds.isValidRectangle || bounds.cellCount < 2) {
        return false;
    }

    const masterRow = doc.rows[bounds.minRow];
    const masterCol = doc.columns[bounds.minCol];
    if (!masterRow || !masterCol) {
        return false;
    }

    const rowSpan = bounds.maxRow - bounds.minRow + 1;
    const colSpan = bounds.maxCol - bounds.minCol + 1;

    const combinedParts: string[] = [];
    for (let r = bounds.minRow; r <= bounds.maxRow; r++) {
        for (let c = bounds.minCol; c <= bounds.maxCol; c++) {
            const row = doc.rows[r];
            const col = doc.columns[c];
            if (!row || !col) {
                continue;
            }
            const cell = doc.cells[cellKey(row.id, col.id)];
            if (cell && (!cell.merge || cell.merge.isMaster) && cell.content.trim()) {
                combinedParts.push(cell.content.trim());
            }
        }
    }

    const masterKey = cellKey(masterRow.id, masterCol.id);
    const masterCell = doc.cells[masterKey];
    if (!masterCell) {
        return false;
    }

    masterCell.content = combinedParts.join(' ');
    masterCell.merge = {
        rowSpan,
        colSpan,
        isMaster: true,
        multirowValign: 'c',
        horizontalAlignOverride: 'c',
    };

    for (let r = bounds.minRow; r <= bounds.maxRow; r++) {
        for (let c = bounds.minCol; c <= bounds.maxCol; c++) {
            if (r === bounds.minRow && c === bounds.minCol) {
                continue;
            }
            const row = doc.rows[r];
            const col = doc.columns[c];
            if (!row || !col) {
                continue;
            }
            const k = cellKey(row.id, col.id);
            const cell = doc.cells[k];
            if (cell) {
                cell.content = '';
                cell.merge = {
                    rowSpan: 1,
                    colSpan: 1,
                    isMaster: false,
                    masterRowId: masterRow.id,
                    masterColId: masterCol.id,
                };
            }
        }
    }

    return true;
}

export function splitMergedCell(
    doc: TableDocument,
    rowId: string,
    colId: string,
    strategy: 'keep_first' | 'distribute_words' = 'keep_first',
): boolean {
    const masterKey = cellKey(rowId, colId);
    const master = doc.cells[masterKey];
    if (!master?.merge?.isMaster) {
        return false;
    }

    const rowIndex = doc.rows.findIndex((r) => r.id === rowId);
    const colIndex = doc.columns.findIndex((c) => c.id === colId);
    if (rowIndex < 0 || colIndex < 0) {
        return false;
    }

    const { rowSpan, colSpan } = master.merge;
    const tokens =
        strategy === 'distribute_words'
            ? master.content.trim().split(/\s+/).filter(Boolean)
            : [];

    let tokenIdx = 0;
    for (let r = rowIndex; r < rowIndex + rowSpan; r++) {
        for (let c = colIndex; c < colIndex + colSpan; c++) {
            const row = doc.rows[r];
            const col = doc.columns[c];
            if (!row || !col) {
                continue;
            }
            const cell = doc.cells[cellKey(row.id, col.id)];
            if (!cell) {
                continue;
            }
            delete cell.merge;
            if (strategy === 'distribute_words') {
                cell.content = tokens[tokenIdx] ?? '';
                tokenIdx++;
            } else if (r !== rowIndex || c !== colIndex) {
                cell.content = '';
            }
        }
    }

    return true;
}

export function insertRowAt(doc: TableDocument, insertIdx: number): TableRow {
    const newRowId = makeId('r');
    const newRow: TableRow = {
        id: newRowId,
        index: insertIdx,
        section: insertIdx === 0 ? 'head' : 'body',
        topBorder: { style: 'none' },
        bottomBorder: { style: 'none' },
    };

    doc.rows.splice(insertIdx, 0, newRow);
    doc.rows.forEach((r, idx) => {
        r.index = idx;
    });

    for (const col of doc.columns) {
        doc.cells[cellKey(newRowId, col.id)] = {
            rowId: newRowId,
            colId: col.id,
            contentMode: 'text',
            content: '',
            formatting: {},
            borders: {},
        };
    }

    return newRow;
}

export function insertColumnAt(
    doc: TableDocument,
    insertIdx: number,
): TableColumn {
    const newColId = makeId('c');
    const newCol: TableColumn = {
        id: newColId,
        index: insertIdx,
        type: 'c',
        leftBorder: { style: 'none' },
        rightBorder: { style: 'none' },
    };

    doc.columns.splice(insertIdx, 0, newCol);
    doc.columns.forEach((c, idx) => {
        c.index = idx;
    });

    for (const row of doc.rows) {
        doc.cells[cellKey(row.id, newColId)] = {
            rowId: row.id,
            colId: newColId,
            contentMode: 'text',
            content: '',
            formatting: {},
            borders: {},
        };
    }

    return newCol;
}

export function moveRow(
    doc: TableDocument,
    fromIdx: number,
    toIdx: number,
): boolean {
    if (
        fromIdx < 0 ||
        toIdx < 0 ||
        fromIdx >= doc.rows.length ||
        toIdx >= doc.rows.length ||
        fromIdx === toIdx
    ) {
        return false;
    }

    const fromRow = doc.rows[fromIdx];
    const toRow = doc.rows[toIdx];
    const hasRowMerge = doc.columns.some((col) => {
        const a = doc.cells[cellKey(fromRow.id, col.id)]?.merge;
        const b = doc.cells[cellKey(toRow.id, col.id)]?.merge;
        return (a && a.rowSpan > 1) || (b && b.rowSpan > 1) || (a && !a.isMaster && a.masterRowId !== fromRow.id) || (b && !b.isMaster && b.masterRowId !== toRow.id);
    });
    if (hasRowMerge) {
        return false;
    }

    const [moved] = doc.rows.splice(fromIdx, 1);
    doc.rows.splice(toIdx, 0, moved);
    doc.rows.forEach((r, idx) => {
        r.index = idx;
    });
    return true;
}

export function moveColumn(
    doc: TableDocument,
    fromIdx: number,
    toIdx: number,
): boolean {
    if (
        fromIdx < 0 ||
        toIdx < 0 ||
        fromIdx >= doc.columns.length ||
        toIdx >= doc.columns.length ||
        fromIdx === toIdx
    ) {
        return false;
    }

    const fromCol = doc.columns[fromIdx];
    const toCol = doc.columns[toIdx];
    const hasColMerge = doc.rows.some((row) => {
        const a = doc.cells[cellKey(row.id, fromCol.id)]?.merge;
        const b = doc.cells[cellKey(row.id, toCol.id)]?.merge;
        return (a && a.colSpan > 1) || (b && b.colSpan > 1) || (a && !a.isMaster && a.masterColId !== fromCol.id) || (b && !b.isMaster && b.masterColId !== toCol.id);
    });
    if (hasColMerge) {
        return false;
    }

    const [moved] = doc.columns.splice(fromIdx, 1);
    doc.columns.splice(toIdx, 0, moved);
    doc.columns.forEach((c, idx) => {
        c.index = idx;
    });
    return true;
}

export function clearCells(doc: TableDocument, keys: Set<string>): void {
    for (const key of keys) {
        const cell: TableCell | undefined = doc.cells[key];
        if (cell) {
            cell.content = '';
        }
    }
}
