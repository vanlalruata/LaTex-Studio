import { roundCoord } from './coordinates';
import {
    detectRequiredPackages,
    detectRequiredTikzLibraries,
} from './sceneHistory';
import type {
    ConnectorEndpoint,
    FigureObject,
    FigureSceneDocument,
    ProtectedTikzBlock,
    SourceMapEntry,
} from './types';

export interface TikzGenerationResult {
    code: string;
    sourceMap: SourceMapEntry[];
    requiredPackages: string[];
    requiredLibraries: string[];
}

function formatEndpointTikz(
    ep: ConnectorEndpoint,
    objectsById: Map<string, FigureObject>,
): string {
    const target = ep.objectId ? objectsById.get(ep.objectId) : undefined;
    if (!target) {
        return `(${roundCoord(ep.x)},${roundCoord(ep.y)})`;
    }
    if (
        target.kind === 'coordinate' ||
        !ep.anchor ||
        ep.anchor === 'auto' ||
        ep.anchor === 'center'
    ) {
        return `(${target.tikzName})`;
    }
    return `(${target.tikzName}.${ep.anchor})`;
}

export function generateTikzWithSourceMap(
    scene: FigureSceneDocument,
): TikzGenerationResult {
    const requiredLibraries = detectRequiredTikzLibraries(scene);
    const requiredPackages = detectRequiredPackages(scene);

    const lines: string[] = [];
    const sourceMap: SourceMapEntry[] = [];

    if (requiredLibraries.length > 0) {
        lines.push(`% Requires \\usetikzlibrary{${requiredLibraries.join(', ')}}`);
    }
    lines.push('\\begin{tikzpicture}');

    const objectsById = new Map(scene.objects.map((o) => [o.id, o]));
    const blocksByAnchor = new Map<string, ProtectedTikzBlock[]>();
    const unanchoredBlocks: ProtectedTikzBlock[] = [];

    for (const block of scene.protectedBlocks) {
        if (block.anchorAfterObjectId && objectsById.has(block.anchorAfterObjectId)) {
            const list = blocksByAnchor.get(block.anchorAfterObjectId) ?? [];
            list.push(block);
            blocksByAnchor.set(block.anchorAfterObjectId, list);
        } else {
            unanchoredBlocks.push(block);
        }
    }

    const pushMapped = (itemId: string, stmtLines: string[]): void => {
        const startLine = lines.length + 1;
        lines.push(...stmtLines);
        const endLine = lines.length;
        sourceMap.push({ itemId, startLine, endLine });
    };

    const sortedObjects = [...scene.objects]
        .filter((obj) => obj.visible)
        .sort((a, b) => a.zIndex - b.zIndex);

    for (const obj of sortedObjects) {
        const x = roundCoord(obj.x);
        const y = roundCoord(obj.y);

        if (obj.kind === 'coordinate') {
            pushMapped(obj.id, [`  \\coordinate (${obj.tikzName}) at (${x},${y});`]);
        } else if (obj.kind === 'matrix') {
            const rows = (obj.matrixCells ?? [['A', 'B']]).map(
                (r) => `    ${r.join(' & ')} \\\\`,
            );
            pushMapped(obj.id, [
                `  \\matrix (${obj.tikzName}) [matrix of nodes, nodes={draw, minimum width=1.2cm, minimum height=0.7cm}, column sep=2mm, row sep=2mm] at (${x},${y}) {`,
                ...rows,
                '  };',
            ]);
        } else if (obj.kind === 'fit_box') {
            const fitNames = (obj.fitTargetIds ?? [])
                .map((id) => objectsById.get(id)?.tikzName)
                .filter(Boolean)
                .map((n) => `(${n})`)
                .join(' ');
            const opts: string[] = ['draw'];
            if (obj.style.dash !== 'solid') {
                opts.push(obj.style.dash === 'dashdot' ? 'dash dot' : obj.style.dash);
            }
            if (obj.style.roundedCornersPt > 0) {
                opts.push(`rounded corners=${obj.style.roundedCornersPt}pt`);
            }
            if (obj.style.fill !== 'none') {
                opts.push('fill=black!5');
            }
            if (fitNames) {
                opts.push(`fit=${fitNames}`);
            } else {
                opts.push(`minimum width=${roundCoord(obj.width)}${scene.unit}`);
                opts.push(`minimum height=${roundCoord(obj.height)}${scene.unit}`);
            }
            if (obj.label.trim()) {
                opts.push(`label=above:{${obj.label}}`);
            }
            const nodeLine = fitNames
                ? `  \\node[${opts.join(', ')}] (${obj.tikzName}) {};`
                : `  \\node[${opts.join(', ')}] (${obj.tikzName}) at (${x},${y}) {};`;
            if (obj.onBackgroundLayer) {
                pushMapped(obj.id, [
                    '  \\begin{scope}[on background layer]',
                    `  ${nodeLine}`,
                    '  \\end{scope}',
                ]);
            } else {
                pushMapped(obj.id, [nodeLine]);
            }
        } else {
            const opts: string[] = [];
            if (obj.kind === 'shape') {
                if (obj.style.stroke !== 'none') {
                    opts.push('draw');
                }
                if (obj.style.dash !== 'solid') {
                    opts.push(obj.style.dash === 'dashdot' ? 'dash dot' : obj.style.dash);
                }
                if (obj.style.pattern && obj.style.pattern !== 'none') {
                    opts.push(`pattern=${obj.style.pattern}`);
                } else if (obj.style.fill !== 'none') {
                    opts.push('fill=black!5');
                }
                if (obj.shape === 'circle') {
                    opts.push('circle');
                } else if (obj.shape === 'ellipse') {
                    opts.push('ellipse');
                } else if (obj.shape === 'diamond') {
                    opts.push('diamond');
                } else if (obj.shape === 'rounded_rectangle') {
                    opts.push(`rounded corners=${obj.style.roundedCornersPt}pt`);
                }
                opts.push(`minimum width=${roundCoord(obj.width)}${scene.unit}`);
                opts.push(`minimum height=${roundCoord(obj.height)}${scene.unit}`);
            }
            if (obj.rotationDeg !== 0) {
                opts.push(`rotate=${roundCoord(obj.rotationDeg)}`);
            }
            if (obj.style.scaleX !== undefined && obj.style.scaleX !== 1) {
                opts.push(`xscale=${roundCoord(obj.style.scaleX)}`);
            }
            if (obj.style.scaleY !== undefined && obj.style.scaleY !== 1) {
                opts.push(`yscale=${roundCoord(obj.style.scaleY)}`);
            }

            const optStr = opts.length > 0 ? `[${opts.join(', ')}]` : '';
            pushMapped(obj.id, [
                `  \\node${optStr} (${obj.tikzName}) at (${x},${y}) {${obj.label}};`,
            ]);
        }

        const anchored = blocksByAnchor.get(obj.id);
        if (anchored) {
            for (const block of anchored) {
                pushMapped(block.id, block.rawTikz.split('\n'));
            }
        }
    }

    const sortedConnectors = [...scene.connectors]
        .filter((c) => c.visible)
        .sort((a, b) => a.zIndex - b.zIndex);

    for (const conn of sortedConnectors) {
        const opts: string[] = [];
        const startTip = conn.arrowStart === 'none' ? '' : conn.arrowStart;
        const endTip = conn.arrowEnd === 'none' ? '' : conn.arrowEnd;
        if (startTip || endTip) {
            opts.push(`${startTip}-${endTip}`);
        }
        if (conn.style.dash !== 'solid') {
            opts.push(conn.style.dash === 'dashdot' ? 'dash dot' : conn.style.dash);
        }
        if (conn.style.strokeWidthPt !== 0.8) {
            opts.push(`line width=${roundCoord(conn.style.strokeWidthPt)}pt`);
        }
        if (conn.decoration && conn.decoration !== 'none') {
            opts.push(`decorate, decoration={${conn.decoration}}`);
        }

        const optStr = opts.length > 0 ? `[${opts.join(', ')}]` : '';
        const fromStr = formatEndpointTikz(conn.from, objectsById);
        const toStr = formatEndpointTikz(conn.to, objectsById);

        let pathOp = '--';
        if (conn.routing === 'orthogonal_hv') {
            pathOp = '-|';
        } else if (conn.routing === 'orthogonal_vh') {
            pathOp = '|-';
        } else if (conn.routing === 'curved') {
            const bend =
                conn.curveBendDeg >= 0
                    ? `bend left=${conn.curveBendDeg}`
                    : `bend right=${Math.abs(conn.curveBendDeg)}`;
            pathOp = `to[${bend}]`;
        }

        const labelPart = conn.label.trim()
            ? ` node[${conn.labelPosition}, midway] {${conn.label}}`
            : '';

        pushMapped(conn.id, [
            `  \\draw${optStr} ${fromStr} ${pathOp}${labelPart} ${toStr};`,
        ]);
    }

    for (const block of unanchoredBlocks) {
        pushMapped(block.id, block.rawTikz.split('\n'));
    }

    lines.push('\\end{tikzpicture}');

    return {
        code: lines.join('\n'),
        sourceMap,
        requiredPackages,
        requiredLibraries,
    };
}
