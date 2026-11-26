import { roundCoord } from './coordinates';
import type {
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
    const isCircle = shape === 'circle';
    const width = isCircle ? 1.6 : isText ? 2.4 : 2.6;
    const height = isCircle ? 1.6 : isText ? 0.8 : 1.3;

    return {
        id: makeId('obj'),
        kind: isText ? 'text' : 'shape',
        tikzName: `n${indexHint}`,
        layerId,
        zIndex,
        x: roundCoord(x),
        y: roundCoord(y),
        width,
        height,
        rotationDeg: 0,
        shape,
        label: isText ? 'Label' : `Node ${indexHint}`,
        style: {
            stroke: isText ? 'none' : '#1e293b',
            strokeWidthPt: isText ? 0 : 0.8,
            dash: 'solid',
            fill: isText ? 'none' : '#f8fafc',
            fillOpacity: 1,
            textColor: '#0f172a',
            roundedCornersPt: shape === 'rounded_rectangle' ? 4 : 0,
        },
        visible: true,
        locked: false,
    };
}

export function generatePhase1TikzStub(scene: FigureSceneDocument): string {
    const lines: string[] = ['\\begin{tikzpicture}'];

    const sorted = [...scene.objects]
        .filter((obj) => obj.visible)
        .sort((a, b) => a.zIndex - b.zIndex);

    for (const obj of sorted) {
        const opts: string[] = [];
        if (obj.kind === 'shape') {
            if (obj.style.stroke !== 'none') {
                opts.push('draw');
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
        const x = roundCoord(obj.x);
        const y = roundCoord(obj.y);
        lines.push(`  \\node${optStr} (${obj.tikzName}) at (${x},${y}) {${obj.label}};`);
    }

    lines.push('\\end{tikzpicture}');
    return lines.join('\n');
}
