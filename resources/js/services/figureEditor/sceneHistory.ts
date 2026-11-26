import { roundCoord } from './coordinates';
import type {
    ConnectorEndpoint,
    FigureConnector,
    FigureObject,
    FigureSceneDocument,
    FigureShapeKind,
} from './types';

function makeId(prefix: string): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
    }
    return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function createDefaultFigureScene(name = 'Untitled Figure'): FigureSceneDocument {
    return {
        schema_version: 1,
        id: makeId('fig'),
        name,
        unit: 'cm',
        grid: {
            enabled: true,
            step: 0.5,
            snap: true,
        },
        layers: [
            {
                id: 'layer_main',
                name: 'Main Layer',
                visible: true,
                locked: false,
                order: 0,
            },
        ],
        objects: [],
        connectors: [],
        protectedBlocks: [],
        metadata: {
            caption: '',
            label: 'fig:untitled',
        },
    };
}

export function normalizeFigureScene(
    raw: Partial<FigureSceneDocument> | null | undefined,
    fallbackName = 'Untitled Figure',
): FigureSceneDocument {
    const base = createDefaultFigureScene(fallbackName);
    if (!raw || typeof raw !== 'object') {
        return base;
    }

    return {
        schema_version: 1,
        id: typeof raw.id === 'string' && raw.id.length > 0 ? raw.id : base.id,
        name: typeof raw.name === 'string' && raw.name.length > 0 ? raw.name : base.name,
        unit: raw.unit ?? base.unit,
        grid: {
            enabled: raw.grid?.enabled ?? base.grid.enabled,
            step: typeof raw.grid?.step === 'number' && raw.grid.step > 0 ? raw.grid.step : base.grid.step,
            snap: raw.grid?.snap ?? base.grid.snap,
        },
        layers: Array.isArray(raw.layers) && raw.layers.length > 0 ? raw.layers : base.layers,
        objects: Array.isArray(raw.objects) ? raw.objects : [],
        connectors: Array.isArray(raw.connectors) ? raw.connectors : [],
        protectedBlocks: Array.isArray(raw.protectedBlocks) ? raw.protectedBlocks : [],
        metadata: {
            caption: raw.metadata?.caption ?? '',
            label: raw.metadata?.label ?? 'fig:untitled',
        },
    };
}

export function cloneScene(scene: FigureSceneDocument): FigureSceneDocument {
    return JSON.parse(JSON.stringify(scene)) as FigureSceneDocument;
}

export function createFigureObject(
    shape: FigureShapeKind,
    layerId: string,
    zIndex: number,
    x: number,
    y: number,
    indexHint: number,
): FigureObject {
    const isText = shape === 'text';
    const isCoordinate = shape === 'coordinate';
    const isCircle = shape === 'circle';
    const width = isCoordinate ? 0.35 : isCircle ? 1.6 : isText ? 2.4 : 2.6;
    const height = isCoordinate ? 0.35 : isCircle ? 1.6 : isText ? 0.8 : 1.3;

    return {
        id: makeId('obj'),
        kind: isCoordinate ? 'coordinate' : isText ? 'text' : 'shape',
        tikzName: isCoordinate ? `c${indexHint}` : `n${indexHint}`,
        layerId,
        zIndex,
        x: roundCoord(x),
        y: roundCoord(y),
        width,
        height,
        rotationDeg: 0,
        shape,
        label: isCoordinate ? '' : isText ? 'Label' : `Node ${indexHint}`,
        style: {
            stroke: isText ? 'none' : '#1e293b',
            strokeWidthPt: isText ? 0 : 0.8,
            dash: 'solid',
            fill: isText ? 'none' : isCoordinate ? '#4f46e5' : '#f8fafc',
            fillOpacity: 1,
            textColor: '#0f172a',
            roundedCornersPt: shape === 'rounded_rectangle' ? 4 : 0,
        },
        visible: true,
        locked: false,
    };
}

export function createFigureConnector(
    layerId: string,
    zIndex: number,
    from: ConnectorEndpoint,
    to: ConnectorEndpoint,
): FigureConnector {
    return {
        id: makeId('edge'),
        kind: 'connector',
        layerId,
        zIndex,
        routing: 'straight',
        curveBendDeg: 25,
        from,
        to,
        arrowStart: 'none',
        arrowEnd: 'Stealth',
        label: '',
        labelPosition: 'above',
        style: {
            stroke: '#1e293b',
            strokeWidthPt: 0.8,
            dash: 'solid',
            textColor: '#0f172a',
        },
        visible: true,
        locked: false,
    };
}

export function detectRequiredTikzLibraries(scene: FigureSceneDocument): string[] {
    const libs = new Set<string>();

    for (const obj of scene.objects) {
        if (obj.shape === 'diamond') {
            libs.add('shapes.geometric');
        }
    }

    for (const conn of scene.connectors) {
        if (
            conn.arrowStart === 'Stealth' ||
            conn.arrowStart === 'Latex' ||
            conn.arrowEnd === 'Stealth' ||
            conn.arrowEnd === 'Latex' ||
            conn.arrowStart === 'Circle' ||
            conn.arrowEnd === 'Circle' ||
            conn.arrowStart === 'Bar' ||
            conn.arrowEnd === 'Bar'
        ) {
            libs.add('arrows.meta');
        }
    }

    return [...libs].sort();
}

export function detectRequiredPackages(scene: FigureSceneDocument): string[] {
    const pkgs = new Set<string>(['tikz']);
    const hasMath =
        scene.objects.some((o) => o.label.includes('$')) ||
        scene.connectors.some((c) => c.label.includes('$'));
    if (hasMath) {
        pkgs.add('amsmath');
    }
    return [...pkgs];
}

function formatEndpointTikz(
    ep: ConnectorEndpoint,
    objectsById: Map<string, FigureObject>,
): string {
    const target = ep.objectId ? objectsById.get(ep.objectId) : undefined;
    if (!target) {
        return `(${roundCoord(ep.x)},${roundCoord(ep.y)})`;
    }
    if (target.kind === 'coordinate' || !ep.anchor || ep.anchor === 'auto' || ep.anchor === 'center') {
        return `(${target.tikzName})`;
    }
    return `(${target.tikzName}.${ep.anchor})`;
}

export function generatePhase1TikzStub(scene: FigureSceneDocument): string {
    const libs = detectRequiredTikzLibraries(scene);
    const header =
        libs.length > 0
            ? `% Requires \\usetikzlibrary{${libs.join(', ')}}\n\\begin{tikzpicture}`
            : '\\begin{tikzpicture}';

    const lines: string[] = [header];
    const objectsById = new Map(scene.objects.map((o) => [o.id, o]));

    const sortedObjects = [...scene.objects]
        .filter((obj) => obj.visible)
        .sort((a, b) => a.zIndex - b.zIndex);

    for (const obj of sortedObjects) {
        const x = roundCoord(obj.x);
        const y = roundCoord(obj.y);

        if (obj.kind === 'coordinate') {
            lines.push(`  \\coordinate (${obj.tikzName}) at (${x},${y});`);
            continue;
        }

        const opts: string[] = [];
        if (obj.kind === 'shape') {
            if (obj.style.stroke !== 'none') {
                opts.push('draw');
            }
            if (obj.style.dash !== 'solid') {
                opts.push(obj.style.dash === 'dashdot' ? 'dash dot' : obj.style.dash);
            }
            if (obj.style.fill !== 'none') {
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

        const optStr = opts.length > 0 ? `[${opts.join(', ')}]` : '';
        lines.push(`  \\node${optStr} (${obj.tikzName}) at (${x},${y}) {${obj.label}};`);
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

        const optStr = opts.length > 0 ? `[${opts.join(', ')}]` : '';
        const fromStr = formatEndpointTikz(conn.from, objectsById);
        const toStr = formatEndpointTikz(conn.to, objectsById);

        let pathOp = '--';
        if (conn.routing === 'orthogonal_hv') {
            pathOp = '-|';
        } else if (conn.routing === 'orthogonal_vh') {
            pathOp = '|-';
        } else if (conn.routing === 'curved') {
            const bend = conn.curveBendDeg >= 0 ? `bend left=${conn.curveBendDeg}` : `bend right=${Math.abs(conn.curveBendDeg)}`;
            pathOp = `to[${bend}]`;
        }

        const labelPart = conn.label.trim()
            ? ` node[${conn.labelPosition}, midway] {${conn.label}}`
            : '';

        lines.push(`  \\draw${optStr} ${fromStr} ${pathOp}${labelPart} ${toStr};`);
    }

    lines.push('\\end{tikzpicture}');
    return lines.join('\n');
}
