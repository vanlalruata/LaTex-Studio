import { validateTableDocument } from '@/services/tableDesigner/tableValidator';
import {
    cellKey,
    type BorderLineStyle,
    type PackageRequirement,
    type TableCell,
    type TableColumn,
    type TableDocument,
    type TableRow,
    type ValidationIssue,
} from '@/types/tableDesigner';

export interface GeneratedTableOutput {
    latex: string;
    packages: PackageRequirement[];
    issues: ValidationIssue[];
}

function escapeLatexText(input: string): string {
    return input
        .replace(/\\/g, '\\textbackslash{}')
        .replace(/([&%$#_{}])/g, '\\$1')
        .replace(/~/g, '\\textasciitilde{}')
        .replace(/\^/g, '\\textasciicircum{}');
}

function borderToToken(style: BorderLineStyle): string {
    switch (style) {
        case 'single':
        case 'thick':
            return '|';
        case 'double':
            return '||';
        default:
            return '';
    }
}

function columnSpecString(columns: TableColumn[]): string {
    return columns
        .map((col, idx) => {
            const left = borderToToken(col.leftBorder.style);
            const right = borderToToken(col.rightBorder.style);
            let spec: string = col.type;
            if (col.type === 'p' || col.type === 'm' || col.type === 'b') {
                spec = `${col.type}{${col.width || '3cm'}}`;
            } else if (col.type === 'custom' && col.customSpec) {
                spec = col.customSpec;
            }
            return `${idx === 0 ? left : ''}${spec}${right}`;
        })
        .join('');
}

function hexToLatexColor(hex: string): string {
    return hex.replace(/^#/, '').toUpperCase();
}

function formatCellContent(
    cell: TableCell | undefined,
    row: TableRow,
    col: TableColumn,
    escapePlainText: boolean,
): string {
    if (!cell) {
        return '';
    }

    let text = cell.content;
    if (cell.contentMode === 'text' && escapePlainText) {
        text = escapeLatexText(text);
    } else if (cell.contentMode === 'math') {
        const trimmed = text.trim();
        if (trimmed && !trimmed.startsWith('$')) {
            text = `$${trimmed}$`;
        }
    }

    const isBold = cell.formatting.bold ?? row.bold ?? col.bold ?? false;
    const isItalic = cell.formatting.italic ?? row.italic ?? col.italic ?? false;

    if (isBold && text) {
        text = `\\textbf{${text}}`;
    }
    if (isItalic && text) {
        text = `\\textit{${text}}`;
    }
    if (cell.formatting.underline && text) {
        text = `\\underline{${text}}`;
    }
    if (cell.formatting.smallCaps && text) {
        text = `\\textsc{${text}}`;
    }

    const textColor = cell.formatting.textColor ?? row.textColor ?? col.textColor;
    if (textColor && text) {
        text = `\\textcolor[HTML]{${hexToLatexColor(textColor)}}{${text}}`;
    }

    if (cell.formatting.rotationDegrees && cell.formatting.rotationDegrees !== 0 && text) {
        text = `\\rotatebox{${cell.formatting.rotationDegrees}}{${text}}`;
    }

    const bgColor = cell.formatting.backgroundColor;
    const cellColorPrefix = bgColor ? `\\cellcolor[HTML]{${hexToLatexColor(bgColor)}}` : '';

    if (cell.merge && cell.merge.isMaster) {
        const hasMultirow = cell.merge.rowSpan > 1;
        const hasMulticol = cell.merge.colSpan > 1;

        if (hasMultirow) {
            const vAlign = cell.merge.multirowValign
                ? `[${cell.merge.multirowValign}]`
                : '';
            const vOffset = cell.merge.multirowVoffset
                ? `[${cell.merge.multirowVoffset}]`
                : '';
            const width = col.width || '*';
            text = `\\multirow${vAlign}{${cell.merge.rowSpan}}{${width}}${vOffset}{${text}}`;
        }
        if (hasMulticol) {
            const align = cell.merge.horizontalAlignOverride || 'c';
            const border = cell.merge.borderOverride ?? align;
            text = `\\multicolumn{${cell.merge.colSpan}}{${border}}{${cellColorPrefix}${text}}`;
            return text;
        }
    } else if (cell.formatting.horizontalAlign && cell.formatting.horizontalAlign !== col.type) {
        return `\\multicolumn{1}{${cell.formatting.horizontalAlign}}{${cellColorPrefix}${text}}`;
    }

    return `${cellColorPrefix}${text}`;
}

function horizontalRuleCommand(style: BorderLineStyle): string | null {
    switch (style) {
        case 'booktabs_top':
            return '\\toprule';
        case 'booktabs_mid':
            return '\\midrule';
        case 'booktabs_bottom':
            return '\\bottomrule';
        case 'single':
        case 'thick':
            return '\\hline';
        case 'double':
            return '\\hline\\hline';
        default:
            return null;
    }
}

export function resolveTablePackages(doc: TableDocument): PackageRequirement[] {
    const reqs = new Map<string, PackageRequirement>();

    const usesBooktabs =
        doc.style.preset === 'booktabs' ||
        doc.rows.some(
            (r) =>
                r.topBorder.style.startsWith('booktabs_') ||
                r.bottomBorder.style.startsWith('booktabs_'),
        );

    if (usesBooktabs) {
        reqs.set('booktabs', {
            packageName: 'booktabs',
            reason: 'Required for \\toprule, \\midrule, and \\bottomrule',
            required: true,
        });
    }

    const hasMultirow = Object.values(doc.cells).some(
        (c) => c.merge?.isMaster && c.merge.rowSpan > 1,
    );
    if (hasMultirow) {
        reqs.set('multirow', {
            packageName: 'multirow',
            reason: 'Required for \\multirow cells',
            required: true,
        });
    }

    if (doc.layout.environment === 'tabularx') {
        reqs.set('tabularx', {
            packageName: 'tabularx',
            reason: 'Required for tabularx full-width X columns',
            required: true,
        });
    }

    if (doc.layout.environment === 'longtable') {
        reqs.set('longtable', {
            packageName: 'longtable',
            reason: 'Required for multi-page longtable environment',
            required: true,
        });
    }

    const usesArrayCols =
        doc.columns.some((c) => c.type === 'm' || c.type === 'b') ||
        Boolean(doc.style.extraRowHeight);
    if (usesArrayCols) {
        reqs.set('array', {
            packageName: 'array',
            reason: 'Required for m{}/b{} column types or \\extrarowheight',
            required: true,
        });
    }

    if (doc.layout.orientation === 'landscape') {
        if (doc.layout.landscapeMethod === 'pdflscape') {
            reqs.set('pdflscape', {
                packageName: 'pdflscape',
                reason: 'Required for landscape page environment',
                required: true,
            });
        } else {
            reqs.set('rotating', {
                packageName: 'rotating',
                reason: 'Required for sidewaystable environment',
                required: true,
            });
        }
    }

    const usesGraphicx =
        doc.layout.rotationDegrees !== 0 ||
        Object.values(doc.cells).some((c) => Boolean(c.formatting.rotationDegrees)) ||
        (doc.layout.fitMode !== 'none' &&
            (doc.layout.fitMethod === 'resizebox' || doc.layout.fitMethod === 'scalebox'));
    if (usesGraphicx) {
        reqs.set('graphicx', {
            packageName: 'graphicx',
            reason: 'Required for \\resizebox, \\scalebox, or \\rotatebox',
            required: true,
        });
    }

    if (doc.layout.fitMode !== 'none' && doc.layout.fitMethod === 'adjustbox') {
        reqs.set('adjustbox', {
            packageName: 'adjustbox',
            reason: 'Required for adjustbox fit-to-page wrapper',
            required: true,
        });
    }

    const usesColor =
        Boolean(doc.style.borderColor) ||
        Boolean(doc.style.alternatingRowColors?.enabled) ||
        doc.rows.some((r) => Boolean(r.backgroundColor) || Boolean(r.textColor)) ||
        Object.values(doc.cells).some(
            (c) => Boolean(c.formatting.backgroundColor) || Boolean(c.formatting.textColor),
        );
    if (usesColor) {
        reqs.set('xcolor', {
            packageName: 'xcolor',
            options: ['table'],
            reason: 'Required for cell/row/border colors (use \\usepackage[table]{xcolor})',
            required: true,
        });
    }

    return Array.from(reqs.values());
}

export function generateTableLatex(doc: TableDocument): GeneratedTableOutput {
    const issues = validateTableDocument(doc);
    const packages = resolveTablePackages(doc);
    const indent = ' '.repeat(doc.generationOptions.indentSpaces);
    const lines: string[] = [];

    const useFloat =
        doc.layout.environment !== 'longtable' &&
        doc.layout.floatingWrapper !== 'none';
    const isPdflscape =
        doc.layout.orientation === 'landscape' &&
        doc.layout.landscapeMethod === 'pdflscape';
    const floatEnv =
        doc.layout.orientation === 'landscape' &&
        doc.layout.landscapeMethod === 'sidewaystable'
            ? 'sidewaystable'
            : doc.layout.wideTwoColumn
              ? 'table*'
              : doc.layout.floatingWrapper;

    if (isPdflscape) {
        lines.push('\\begin{landscape}');
    }

    if (useFloat) {
        lines.push(`\\begin{${floatEnv}}[htbp]`);
        if (doc.layout.alignment === 'center') {
            lines.push(`${indent}\\centering`);
        }
        if (doc.style.fontFamily !== 'default') {
            lines.push(`${indent}\\${doc.style.fontFamily}`);
        }
        if (doc.style.fontSize === 'custom' && doc.style.customFontSizePt) {
            const skip = Math.round(doc.style.customFontSizePt * 1.2);
            lines.push(`${indent}\\fontsize{${doc.style.customFontSizePt}pt}{${skip}pt}\\selectfont`);
        } else if (doc.style.fontSize !== 'normalsize' && doc.style.fontSize !== 'custom') {
            lines.push(`${indent}\\${doc.style.fontSize}`);
        }
        if (doc.style.borderColor) {
            lines.push(`${indent}\\arrayrulecolor[HTML]{${hexToLatexColor(doc.style.borderColor)}}`);
        }
        if (doc.style.alternatingRowColors?.enabled) {
            const odd = hexToLatexColor(doc.style.alternatingRowColors.oddColor || '#F8FAFC');
            const even = hexToLatexColor(doc.style.alternatingRowColors.evenColor || '#FFFFFF');
            lines.push(`${indent}\\rowcolors{2}{${odd}!100}{${even}!100}`);
        }
        if (doc.style.tabColSep) {
            lines.push(`${indent}\\setlength{\\tabcolsep}{${doc.style.tabColSep}}`);
        }
        const stretch =
            doc.style.arrayStretch ??
            (doc.style.lineSpacing !== '1.0' && doc.style.lineSpacing !== 'custom'
                ? Number(doc.style.lineSpacing)
                : undefined);
        if (stretch && stretch !== 1) {
            lines.push(`${indent}\\renewcommand{\\arraystretch}{${stretch}}`);
        }
        if (doc.style.extraRowHeight) {
            lines.push(`${indent}\\setlength{\\extrarowheight}{${doc.style.extraRowHeight}}`);
        }
        if (doc.layout.captionPosition === 'top' && doc.caption) {
            const shortPart = doc.shortCaption ? `[${doc.shortCaption}]` : '';
            lines.push(`${indent}\\caption${shortPart}{${doc.caption}}`);
            if (doc.label) {
                lines.push(`${indent}\\label{${doc.label}}`);
            }
        }
    }

    const colSpec = columnSpecString(doc.columns);
    const tabIndent = useFloat ? indent : '';
    const innerIndent = useFloat ? indent.repeat(2) : indent;

    const hasFitWrapper =
        doc.layout.environment !== 'longtable' &&
        doc.layout.fitMode !== 'none' &&
        doc.layout.fitMethod !== 'tabularx';

    if (hasFitWrapper) {
        if (doc.layout.fitMethod === 'adjustbox') {
            lines.push(`${tabIndent}\\begin{adjustbox}{max width=\\textwidth}`);
        } else {
            const widthArg =
                doc.layout.fitMode === 'pageheight' ? '!' : doc.layout.maxWidth || '\\textwidth';
            const heightArg =
                doc.layout.fitMode === 'pageheight' || doc.layout.fitMode === 'both'
                    ? doc.layout.maxHeight || '\\textheight'
                    : '!';
            lines.push(`${tabIndent}\\resizebox{${widthArg}}{${heightArg}}{%`);
        }
    }

    if (doc.layout.rotationDegrees !== 0 && doc.layout.environment !== 'longtable') {
        lines.push(`${tabIndent}\\rotatebox{${doc.layout.rotationDegrees}}{%`);
    }

    if (doc.layout.environment === 'tabularx') {
        lines.push(`${tabIndent}\\begin{tabularx}{\\textwidth}{${colSpec}}`);
    } else if (doc.layout.environment === 'longtable') {
        lines.push(`${tabIndent}\\begin{longtable}{${colSpec}}`);
        if (doc.caption) {
            const shortPart = doc.shortCaption ? `[${doc.shortCaption}]` : '';
            lines.push(`${innerIndent}\\caption${shortPart}{${doc.caption}}\\\\`);
        }
        if (doc.label) {
            lines.push(`${innerIndent}\\label{${doc.label}}\\\\`);
        }
    } else {
        lines.push(`${tabIndent}\\begin{tabular}{${colSpec}}`);
    }

    doc.rows.forEach((row, rIdx) => {
        const topRule = horizontalRuleCommand(row.topBorder.style);
        if (topRule && (rIdx === 0 || doc.rows[rIdx - 1]?.bottomBorder.style !== row.topBorder.style)) {
            lines.push(`${innerIndent}${topRule}`);
        }

        const cellStrings: string[] = [];
        for (let cIdx = 0; cIdx < doc.columns.length; cIdx++) {
            const col = doc.columns[cIdx];
            const cell = doc.cells[cellKey(row.id, col.id)];
            if (cell?.merge && !cell.merge.isMaster) {
                // Skip spanned columns horizontally; keep empty placeholder for multirow-only spans
                const master = cell.merge.masterRowId && cell.merge.masterColId
                    ? doc.cells[cellKey(cell.merge.masterRowId, cell.merge.masterColId)]
                    : undefined;
                if (master?.merge && master.merge.colSpan > 1 && cell.merge.masterColId !== col.id) {
                    continue;
                }
                cellStrings.push('');
                continue;
            }
            cellStrings.push(
                formatCellContent(
                    cell,
                    row,
                    col,
                    doc.generationOptions.escapePlainText,
                ),
            );
        }

        const rowColorCmd = row.backgroundColor
            ? `\\rowcolor[HTML]{${hexToLatexColor(row.backgroundColor)}} `
            : '';
        const rowEnd = row.height ? `\\\\[${row.height}]` : '\\\\';
        lines.push(`${innerIndent}${rowColorCmd}${cellStrings.join(' & ')} ${rowEnd}`);

        const bottomRule = horizontalRuleCommand(row.bottomBorder.style);
        if (bottomRule) {
            lines.push(`${innerIndent}${bottomRule}`);
        }
    });

    lines.push(`${tabIndent}\\end{${doc.layout.environment}}`);

    if (doc.layout.rotationDegrees !== 0 && doc.layout.environment !== 'longtable') {
        lines.push(`${tabIndent}}`);
    }

    if (hasFitWrapper) {
        if (doc.layout.fitMethod === 'adjustbox') {
            lines.push(`${tabIndent}\\end{adjustbox}`);
        } else {
            lines.push(`${tabIndent}}`);
        }
    }

    if (useFloat) {
        if (doc.layout.captionPosition === 'bottom' && doc.caption) {
            const shortPart = doc.shortCaption ? `[${doc.shortCaption}]` : '';
            lines.push(`${indent}\\caption${shortPart}{${doc.caption}}`);
            if (doc.label) {
                lines.push(`${indent}\\label{${doc.label}}`);
            }
        }
        lines.push(`\\end{${floatEnv}}`);
    }

    if (isPdflscape) {
        lines.push('\\end{landscape}');
    }

    return {
        latex: lines.join('\n'),
        packages,
        issues,
    };
}
