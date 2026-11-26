import { roundCoord } from './coordinates';
import { cloneScene } from './sceneHistory';
import type {
    ArrowTip,
    ConnectorEndpoint,
    ConnectorRouting,
    EdgeLabelPosition,
    FigureConnector,
    FigureMode,
    FigureObject,
    FigureSceneDocument,
    FigureShapeKind,
    NodeAnchor,
    ProtectedTikzBlock,
    StrokeDash,
} from './types';

export interface TikzParseResult {
    ok: boolean;
    mode: FigureMode;
    scene: FigureSceneDocument;
    unsupportedCount: number;
    warnings: string[];
}

function splitTopLevelStatements(body: string): { statements: string[]; balanced: boolean } {
    const statements: string[] = [];
    let current = '';
    let braceDepth = 0;
    let bracketDepth = 0;
    let inComment = false;
    let scopeDepth = 0;

    for (let i = 0; i < body.length; i++) {
        const ch = body[i];
        const prev = i > 0 ? body[i - 1] : '';

        if (inComment) {
            current += ch;
            if (ch === '\n') {
                inComment = false;
            }
            continue;
        }

        if (ch === '%' && prev !== '\\') {
            inComment = true;
            current += ch;
            continue;
        }

        if (ch === '{' && prev !== '\\') {
            braceDepth++;
        } else if (ch === '}' && prev !== '\\') {
            braceDepth--;
            if (braceDepth < 0) {
                return { statements: [], balanced: false };
            }
        } else if (ch === '[' && prev !== '\\' && braceDepth === 0) {
            bracketDepth++;
        } else if (ch === ']' && prev !== '\\' && braceDepth === 0) {
            bracketDepth = Math.max(0, bracketDepth - 1);
        }

        current += ch;

        if (braceDepth === 0 && bracketDepth === 0) {
            if (current.endsWith('\\begin{scope}')) {
                scopeDepth++;
            } else if (current.endsWith('\\end{scope}')) {
                scopeDepth = Math.max(0, scopeDepth - 1);
                if (scopeDepth === 0) {
                    const trimmed = current.trim();
                    if (trimmed) {
                        statements.push(trimmed);
                    }
                    current = '';
                }
                continue;
            }

            if (ch === ';' && scopeDepth === 0) {
                const trimmed = current.trim();
                if (trimmed) {
                    statements.push(trimmed);
                }
                current = '';
            }
        }
    }

    if (braceDepth !== 0 || scopeDepth !== 0) {
        return { statements: [], balanced: false };
    }

    const trailing = current.trim();
    if (trailing) {
        statements.push(trailing);
    }

    return { statements, balanced: true };
}

function readBracketGroup(input: string, pos: number): { value: string; nextPos: number } | null {
    if (input[pos] !== '[') {
        return null;
    }
    let depth = 0;
    for (let i = pos; i < input.length; i++) {
        if (input[i] === '[') {
            depth++;
        } else if (input[i] === ']') {
            depth--;
            if (depth === 0) {
                return { value: input.slice(pos + 1, i), nextPos: i + 1 };
            }
        }
    }
    return null;
}

function readBraceGroup(input: string, pos: number): { value: string; nextPos: number } | null {
    if (input[pos] !== '{') {
        return null;
    }
    let depth = 0;
    for (let i = pos; i < input.length; i++) {
        const prev = i > 0 ? input[i - 1] : '';
        if (input[i] === '{' && prev !== '\\') {
            depth++;
        } else if (input[i] === '}' && prev !== '\\') {
            depth--;
            if (depth === 0) {
                return { value: input.slice(pos + 1, i), nextPos: i + 1 };
            }
        }
    }
    return null;
}

function readParenGroup(input: string, pos: number): { value: string; nextPos: number } | null {
    if (input[pos] !== '(') {
        return null;
    }
    let depth = 0;
    for (let i = pos; i < input.length; i++) {
        if (input[i] === '(') {
            depth++;
        } else if (input[i] === ')') {
            depth--;
            if (depth === 0) {
                return { value: input.slice(pos + 1, i), nextPos: i + 1 };
            }
        }
    }
    return null;
}

function skipWhitespace(input: string, pos: number): number {
    while (pos < input.length && /\s/.test(input[pos])) {
        pos++;
    }
    return pos;
}

function parseUnitNumber(raw: string): number | null {
    const match = raw.trim().match(/^(-?\d+(?:\.\d+)?)/);
    return match ? Number(match[1]) : null;
}

function parseCoordinateStatement(
    stmt: string,
    layerId: string,
    zIndex: number,
): FigureObject | null {
    const clean = stmt.replace(/;$/, '').trim();
    if (!clean.startsWith('\\coordinate')) {
        return null;
    }
    let pos = skipWhitespace(clean, '\\coordinate'.length);
    const nameGroup = readParenGroup(clean, pos);
    if (!nameGroup) {
        return null;
    }
    pos = skipWhitespace(clean, nameGroup.nextPos);
    if (!clean.slice(pos).startsWith('at')) {
        return null;
    }
    pos = skipWhitespace(clean, pos + 2);
    const coordGroup = readParenGroup(clean, pos);
    if (!coordGroup) {
        return null;
    }
    const parts = coordGroup.value.split(',').map((s) => Number(s.trim()));
    if (parts.length !== 2 || parts.some((n) => Number.isNaN(n))) {
        return null;
    }

    return {
        id: `obj_${nameGroup.value.trim()}`,
        kind: 'coordinate',
        tikzName: nameGroup.value.trim(),
        layerId,
        zIndex,
        x: roundCoord(parts[0]),
        y: roundCoord(parts[1]),
        width: 0.35,
        height: 0.35,
        rotationDeg: 0,
        shape: 'coordinate',
        label: '',
        style: {
            stroke: '#1e293b',
            strokeWidthPt: 0.8,
            dash: 'solid',
            fill: '#4f46e5',
            fillOpacity: 1,
            textColor: '#0f172a',
            roundedCornersPt: 0,
        },
        visible: true,
        locked: false,
    };
}

function parseNodeStatement(
    stmt: string,
    layerId: string,
    zIndex: number,
    existing?: FigureObject,
): FigureObject | null {
    const clean = stmt.replace(/;$/, '').trim();
    if (!clean.startsWith('\\node')) {
        return null;
    }
    let pos = skipWhitespace(clean, '\\node'.length);
    let optionsStr = '';
    const optGroup = readBracketGroup(clean, pos);
    if (optGroup) {
        optionsStr = optGroup.value;
        pos = skipWhitespace(clean, optGroup.nextPos);
    }

    const nameGroup = readParenGroup(clean, pos);
    if (!nameGroup) {
        return null;
    }
    pos = skipWhitespace(clean, nameGroup.nextPos);

    if (!clean.slice(pos).startsWith('at')) {
        return null;
    }
    pos = skipWhitespace(clean, pos + 2);

    const coordGroup = readParenGroup(clean, pos);
    if (!coordGroup) {
        return null;
    }
    const coords = coordGroup.value.split(',').map((s) => Number(s.trim()));
    if (coords.length !== 2 || coords.some((n) => Number.isNaN(n))) {
        return null;
    }
    pos = skipWhitespace(clean, coordGroup.nextPos);

    const labelGroup = readBraceGroup(clean, pos);
    if (!labelGroup) {
        return null;
    }

    const opts = optionsStr
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

    const hasDraw = opts.includes('draw');
    let shape: FigureShapeKind = hasDraw ? 'rectangle' : 'text';
    if (opts.includes('circle')) {
        shape = 'circle';
    } else if (opts.includes('ellipse')) {
        shape = 'ellipse';
    } else if (opts.includes('diamond')) {
        shape = 'diamond';
    } else if (opts.some((o) => o.startsWith('rounded corners'))) {
        shape = 'rounded_rectangle';
    }

    let dash: StrokeDash = 'solid';
    if (opts.includes('dashed')) {
        dash = 'dashed';
    } else if (opts.includes('dotted')) {
        dash = 'dotted';
    } else if (opts.includes('dash dot')) {
        dash = 'dashdot';
    }

    let width = existing?.width ?? (shape === 'circle' ? 1.6 : shape === 'text' ? 2.4 : 2.6);
    let height = existing?.height ?? (shape === 'circle' ? 1.6 : shape === 'text' ? 0.8 : 1.3);
    let rotationDeg = 0;
    let roundedCornersPt = shape === 'rounded_rectangle' ? 4 : 0;

    for (const opt of opts) {
        if (opt.startsWith('minimum width=')) {
            const val = parseUnitNumber(opt.slice('minimum width='.length));
            if (val !== null) {
                width = val;
            }
        } else if (opt.startsWith('minimum height=')) {
            const val = parseUnitNumber(opt.slice('minimum height='.length));
            if (val !== null) {
                height = val;
            }
        } else if (opt.startsWith('rotate=')) {
            const val = parseUnitNumber(opt.slice('rotate='.length));
            if (val !== null) {
                rotationDeg = val;
            }
        } else if (opt.startsWith('rounded corners=')) {
            const val = parseUnitNumber(opt.slice('rounded corners='.length));
            if (val !== null) {
                roundedCornersPt = val;
            }
        }
    }

    const tikzName = nameGroup.value.trim();

    return {
        id: existing?.id ?? `obj_${tikzName}`,
        kind: shape === 'text' ? 'text' : 'shape',
        tikzName,
        layerId: existing?.layerId ?? layerId,
        zIndex,
        x: roundCoord(coords[0]),
        y: roundCoord(coords[1]),
        width,
        height,
        rotationDeg,
        shape,
        label: labelGroup.value,
        style: {
            stroke: hasDraw ? (existing?.style.stroke && existing.style.stroke !== 'none' ? existing.style.stroke : '#1e293b') : 'none',
            strokeWidthPt: existing?.style.strokeWidthPt ?? (hasDraw ? 0.8 : 0),
            dash,
            fill: opts.some((o) => o.startsWith('fill')) ? (existing?.style.fill && existing.style.fill !== 'none' ? existing.style.fill : '#f8fafc') : 'none',
            fillOpacity: existing?.style.fillOpacity ?? 1,
            textColor: existing?.style.textColor ?? '#0f172a',
            roundedCornersPt,
        },
        visible: true,
        locked: existing?.locked ?? false,
    };
}

function parseEndpoint(
    raw: string,
    objectsByName: Map<string, FigureObject>,
): ConnectorEndpoint | null {
    const trimmed = raw.trim();
    if (trimmed.includes(',')) {
        const parts = trimmed.split(',').map((s) => Number(s.trim()));
        if (parts.length !== 2 || parts.some((n) => Number.isNaN(n))) {
            return null;
        }
        return { x: roundCoord(parts[0]), y: roundCoord(parts[1]) };
    }
    const dotIdx = trimmed.indexOf('.');
    const nodeName = dotIdx >= 0 ? trimmed.slice(0, dotIdx) : trimmed;
    const anchor = (dotIdx >= 0 ? trimmed.slice(dotIdx + 1) : 'auto') as NodeAnchor;
    const obj = objectsByName.get(nodeName);
    if (!obj) {
        return null;
    }
    return {
        objectId: obj.id,
        anchor,
        x: obj.x,
        y: obj.y,
    };
}

function parseDrawConnector(
    stmt: string,
    layerId: string,
    zIndex: number,
    objectsByName: Map<string, FigureObject>,
): FigureConnector | null {
    const clean = stmt.replace(/;$/, '').trim();
    if (!clean.startsWith('\\draw')) {
        return null;
    }
    let pos = skipWhitespace(clean, '\\draw'.length);
    let optionsStr = '';
    const optGroup = readBracketGroup(clean, pos);
    if (optGroup) {
        optionsStr = optGroup.value;
        pos = skipWhitespace(clean, optGroup.nextPos);
    }

    const fromGroup = readParenGroup(clean, pos);
    if (!fromGroup) {
        return null;
    }
    const from = parseEndpoint(fromGroup.value, objectsByName);
    if (!from) {
        return null;
    }
    pos = skipWhitespace(clean, fromGroup.nextPos);

    let routing: ConnectorRouting = 'straight';
    let curveBendDeg = 25;

    if (clean.slice(pos).startsWith('--')) {
        routing = 'straight';
        pos = skipWhitespace(clean, pos + 2);
    } else if (clean.slice(pos).startsWith('-|')) {
        routing = 'orthogonal_hv';
        pos = skipWhitespace(clean, pos + 2);
    } else if (clean.slice(pos).startsWith('|-')) {
        routing = 'orthogonal_vh';
        pos = skipWhitespace(clean, pos + 2);
    } else if (clean.slice(pos).startsWith('to')) {
        routing = 'curved';
        pos = skipWhitespace(clean, pos + 2);
        const bendGroup = readBracketGroup(clean, pos);
        if (bendGroup) {
            if (bendGroup.value.includes('bend right=')) {
                curveBendDeg = -(parseUnitNumber(bendGroup.value.split('bend right=')[1]) ?? 25);
            } else if (bendGroup.value.includes('bend left=')) {
                curveBendDeg = parseUnitNumber(bendGroup.value.split('bend left=')[1]) ?? 25;
            }
            pos = skipWhitespace(clean, bendGroup.nextPos);
        }
    } else {
        return null;
    }

    let label = '';
    let labelPosition: EdgeLabelPosition = 'above';
    if (clean.slice(pos).startsWith('node')) {
        pos = skipWhitespace(clean, pos + 4);
        const nodeOpt = readBracketGroup(clean, pos);
        if (nodeOpt) {
            if (nodeOpt.value.includes('below')) {
                labelPosition = 'below';
            } else if (nodeOpt.value.includes('left')) {
                labelPosition = 'left';
            } else if (nodeOpt.value.includes('right')) {
                labelPosition = 'right';
            } else if (nodeOpt.value.includes('midway')) {
                labelPosition = 'midway';
            }
            pos = skipWhitespace(clean, nodeOpt.nextPos);
        }
        const labelBrace = readBraceGroup(clean, pos);
        if (!labelBrace) {
            return null;
        }
        label = labelBrace.value;
        pos = skipWhitespace(clean, labelBrace.nextPos);
    }

    const toGroup = readParenGroup(clean, pos);
    if (!toGroup) {
        return null;
    }
    const to = parseEndpoint(toGroup.value, objectsByName);
    if (!to) {
        return null;
    }

    const opts = optionsStr
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

    let arrowStart: ArrowTip = 'none';
    let arrowEnd: ArrowTip = 'none';
    let dash: StrokeDash = 'solid';
    let strokeWidthPt = 0.8;

    for (const opt of opts) {
        if (opt.includes('-')) {
            const [s, e] = opt.split('-').map((p) => p.trim());
            if (s) {
                arrowStart = s as ArrowTip;
            }
            if (e) {
                arrowEnd = e as ArrowTip;
            }
        } else if (opt === 'dashed' || opt === 'dotted') {
            dash = opt;
        } else if (opt === 'dash dot') {
            dash = 'dashdot';
        } else if (opt.startsWith('line width=')) {
            strokeWidthPt = parseUnitNumber(opt.slice('line width='.length)) ?? 0.8;
        }
    }

    return {
        id: `edge_${zIndex}_${from.objectId ?? 'pt'}_${to.objectId ?? 'pt'}`,
        kind: 'connector',
        layerId,
        zIndex,
        routing,
        curveBendDeg,
        from,
        to,
        arrowStart,
        arrowEnd,
        label,
        labelPosition,
        style: {
            stroke: '#1e293b',
            strokeWidthPt,
            dash,
            textColor: '#0f172a',
        },
        visible: true,
        locked: false,
    };
}

export function parseTikzSourceToScene(
    source: string,
    previousScene: FigureSceneDocument,
): TikzParseResult {
    const startMatch = source.match(/\\begin\{tikzpicture\}(?:\[[^\]]*\])?/);
    const endIdx = source.lastIndexOf('\\end{tikzpicture}');

    if (!startMatch || startMatch.index === undefined || endIdx === -1 || endIdx <= startMatch.index) {
        return {
            ok: false,
            mode: 'source_only',
            scene: cloneScene(previousScene),
            unsupportedCount: 1,
            warnings: ['Missing or invalid \\begin{tikzpicture}...\\end{tikzpicture} environment.'],
        };
    }

    const body = source.slice(startMatch.index + startMatch[0].length, endIdx);
    const { statements, balanced } = splitTopLevelStatements(body);
    if (!balanced) {
        return {
            ok: false,
            mode: 'source_only',
            scene: cloneScene(previousScene),
            unsupportedCount: 1,
            warnings: ['Unbalanced braces or scope environment detected.'],
        };
    }

    const nextScene = cloneScene(previousScene);
    const defaultLayerId = nextScene.layers[0]?.id ?? 'layer_main';
    const prevByName = new Map(previousScene.objects.map((o) => [o.tikzName, o]));

    const parsedObjects: FigureObject[] = [];
    const parsedConnectors: FigureConnector[] = [];
    const protectedBlocks: ProtectedTikzBlock[] = [];
    const warnings: string[] = [];

    let zCounter = 1;
    let lastObjectId: string | null = null;

    for (const stmt of statements) {
        const stripped = stmt
            .split('\n')
            .filter((line) => !line.trim().startsWith('%'))
            .join('\n')
            .trim();

        if (!stripped) {
            continue;
        }

        if (stripped.startsWith('\\coordinate')) {
            const coord = parseCoordinateStatement(stripped, defaultLayerId, zCounter++);
            if (coord) {
                parsedObjects.push(coord);
                lastObjectId = coord.id;
                continue;
            }
        } else if (stripped.startsWith('\\node')) {
            const namePeek = stripped.match(/\\node(?:\[[^\]]*\])?\s*\(([^)]+)\)/);
            const existing = namePeek ? prevByName.get(namePeek[1].trim()) : undefined;
            const node = parseNodeStatement(stripped, defaultLayerId, zCounter++, existing);
            if (node) {
                parsedObjects.push(node);
                lastObjectId = node.id;
                continue;
            }
        } else if (stripped.startsWith('\\draw')) {
            const objectsByName = new Map(parsedObjects.map((o) => [o.tikzName, o]));
            const conn = parseDrawConnector(stripped, defaultLayerId, zCounter++, objectsByName);
            if (conn) {
                parsedConnectors.push(conn);
                continue;
            }
        }

        protectedBlocks.push({
            id: `prot_${protectedBlocks.length + 1}`,
            anchorAfterObjectId: lastObjectId,
            rawTikz: stmt,
        });
        warnings.push(`Preserved unsupported TikZ statement as protected block (${stmt.slice(0, 42)}...).`);
    }

    nextScene.objects = parsedObjects;
    nextScene.connectors = parsedConnectors;
    nextScene.protectedBlocks = protectedBlocks;

    return {
        ok: true,
        mode: protectedBlocks.length > 0 ? 'hybrid' : 'visual_native',
        scene: nextScene,
        unsupportedCount: protectedBlocks.length,
        warnings,
    };
}
