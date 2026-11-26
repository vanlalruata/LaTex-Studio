import { roundCoord, tikzSizeToScene, tikzToScene } from './coordinates';
import type {
    ConnectorEndpoint,
    FigureConnector,
    FigureObject,
    FigureUnit,
    NodeAnchor,
} from './types';

export const STANDARD_ANCHORS: Exclude<NodeAnchor, 'auto'>[] = [
    'north',
    'north east',
    'east',
    'south east',
    'south',
    'south west',
    'west',
    'north west',
];

export function resolveAnchorTikzPoint(
    obj: FigureObject,
    anchor: NodeAnchor = 'center',
): { x: number; y: number } {
    if (obj.kind === 'coordinate' || anchor === 'center' || anchor === 'auto') {
        return { x: obj.x, y: obj.y };
    }

    const hw = obj.width / 2;
    const hh = obj.height / 2;

    switch (anchor) {
        case 'north':
            return { x: obj.x, y: roundCoord(obj.y + hh) };
        case 'south':
            return { x: obj.x, y: roundCoord(obj.y - hh) };
        case 'east':
            return { x: roundCoord(obj.x + hw), y: obj.y };
        case 'west':
            return { x: roundCoord(obj.x - hw), y: obj.y };
        case 'north east':
            return { x: roundCoord(obj.x + hw), y: roundCoord(obj.y + hh) };
        case 'north west':
            return { x: roundCoord(obj.x - hw), y: roundCoord(obj.y + hh) };
        case 'south east':
            return { x: roundCoord(obj.x + hw), y: roundCoord(obj.y - hh) };
        case 'south west':
            return { x: roundCoord(obj.x - hw), y: roundCoord(obj.y - hh) };
    }
}

export function resolveAutoAnchor(
    source: FigureObject,
    targetX: number,
    targetY: number,
): Exclude<NodeAnchor, 'auto'> {
    if (source.kind === 'coordinate') {
        return 'center';
    }
    const dx = targetX - source.x;
    const dy = targetY - source.y;
    if (Math.abs(dx) >= Math.abs(dy)) {
        return dx >= 0 ? 'east' : 'west';
    }
    return dy >= 0 ? 'north' : 'south';
}

export function resolveEndpointScenePoint(
    endpoint: ConnectorEndpoint,
    otherEndpoint: ConnectorEndpoint,
    objectsById: Map<string, FigureObject>,
    unit: FigureUnit,
): { sx: number; sy: number; x: number; y: number } {
    const obj = endpoint.objectId ? objectsById.get(endpoint.objectId) : undefined;
    if (!obj) {
        const sc = tikzToScene(endpoint.x, endpoint.y, unit);
        return { sx: sc.sx, sy: sc.sy, x: endpoint.x, y: endpoint.y };
    }

    let anchor = endpoint.anchor ?? 'auto';
    if (anchor === 'auto') {
        const otherObj = otherEndpoint.objectId
            ? objectsById.get(otherEndpoint.objectId)
            : undefined;
        const tx = otherObj ? otherObj.x : otherEndpoint.x;
        const ty = otherObj ? otherObj.y : otherEndpoint.y;
        anchor = resolveAutoAnchor(obj, tx, ty);
    }

    const pt = resolveAnchorTikzPoint(obj, anchor);
    const sc = tikzToScene(pt.x, pt.y, unit);
    return { sx: sc.sx, sy: sc.sy, x: pt.x, y: pt.y };
}

export function getConnectorSvgPath(
    connector: FigureConnector,
    objectsById: Map<string, FigureObject>,
    unit: FigureUnit,
): {
    d: string;
    start: { sx: number; sy: number };
    end: { sx: number; sy: number };
    mid: { sx: number; sy: number };
} {
    const start = resolveEndpointScenePoint(
        connector.from,
        connector.to,
        objectsById,
        unit,
    );
    const end = resolveEndpointScenePoint(
        connector.to,
        connector.from,
        objectsById,
        unit,
    );

    if (connector.routing === 'orthogonal_hv') {
        const cornerX = end.sx;
        const cornerY = start.sy;
        return {
            d: `M ${start.sx} ${start.sy} L ${cornerX} ${cornerY} L ${end.sx} ${end.sy}`,
            start,
            end,
            mid: {
                sx: (start.sx + end.sx) / 2,
                sy: (start.sy + end.sy) / 2,
            },
        };
    }

    if (connector.routing === 'orthogonal_vh') {
        const cornerX = start.sx;
        const cornerY = end.sy;
        return {
            d: `M ${start.sx} ${start.sy} L ${cornerX} ${cornerY} L ${end.sx} ${end.sy}`,
            start,
            end,
            mid: {
                sx: (start.sx + end.sx) / 2,
                sy: (start.sy + end.sy) / 2,
            },
        };
    }

    if (connector.routing === 'curved') {
        const dx = end.sx - start.sx;
        const dy = end.sy - start.sy;
        const len = Math.hypot(dx, dy) || 1;
        const bendFactor = (connector.curveBendDeg || 25) / 45;
        const offset = Math.min(140, len * 0.35) * bendFactor;
        const nx = -dy / len;
        const ny = dx / len;
        const cx = (start.sx + end.sx) / 2 + nx * offset;
        const cy = (start.sy + end.sy) / 2 + ny * offset;

        return {
            d: `M ${start.sx} ${start.sy} Q ${cx} ${cy} ${end.sx} ${end.sy}`,
            start,
            end,
            mid: {
                sx: 0.25 * start.sx + 0.5 * cx + 0.25 * end.sx,
                sy: 0.25 * start.sy + 0.5 * cy + 0.25 * end.sy,
            },
        };
    }

    return {
        d: `M ${start.sx} ${start.sy} L ${end.sx} ${end.sy}`,
        start,
        end,
        mid: {
            sx: (start.sx + end.sx) / 2,
            sy: (start.sy + end.sy) / 2,
        },
    };
}

export function getObjectAnchorPorts(
    obj: FigureObject,
    unit: FigureUnit,
): Array<{ anchor: Exclude<NodeAnchor, 'auto'>; sx: number; sy: number; x: number; y: number }> {
    if (obj.kind === 'coordinate') {
        const sc = tikzToScene(obj.x, obj.y, unit);
        return [{ anchor: 'center', sx: sc.sx, sy: sc.sy, x: obj.x, y: obj.y }];
    }

    const center = tikzToScene(obj.x, obj.y, unit);
    const size = tikzSizeToScene(obj.width, obj.height, unit);
    const hw = size.sw / 2;
    const hh = size.sh / 2;

    return STANDARD_ANCHORS.map((anchor) => {
        const pt = resolveAnchorTikzPoint(obj, anchor);
        let sx = center.sx;
        let sy = center.sy;
        if (anchor.includes('east')) {
            sx = center.sx + hw;
        } else if (anchor.includes('west')) {
            sx = center.sx - hw;
        }
        if (anchor.includes('north')) {
            sy = center.sy - hh;
        } else if (anchor.includes('south')) {
            sy = center.sy + hh;
        }
        return { anchor, sx, sy, x: pt.x, y: pt.y };
    });
}
