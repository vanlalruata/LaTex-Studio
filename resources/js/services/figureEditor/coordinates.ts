import type { FigureUnit, ViewportState } from './types';

const PX_PER_INCH = 96;

export const PX_PER_UNIT: Record<FigureUnit, number> = {
    in: PX_PER_INCH,
    cm: PX_PER_INCH / 2.54,
    mm: PX_PER_INCH / 25.4,
    pt: PX_PER_INCH / 72.27,
};

export function roundCoord(value: number, decimals = 3): number {
    const factor = 10 ** decimals;
    const rounded = Math.round(value * factor) / factor;
    return Object.is(rounded, -0) ? 0 : rounded;
}

export function snapToGrid(value: number, step: number, enabled: boolean): number {
    if (!enabled || step <= 0) {
        return roundCoord(value);
    }
    return roundCoord(Math.round(value / step) * step);
}

export function tikzToScene(
    x: number,
    y: number,
    unit: FigureUnit,
): { sx: number; sy: number } {
    const scale = PX_PER_UNIT[unit];
    return {
        sx: x * scale,
        sy: -y * scale,
    };
}

export function sceneToTikz(
    sx: number,
    sy: number,
    unit: FigureUnit,
): { x: number; y: number } {
    const scale = PX_PER_UNIT[unit];
    return {
        x: roundCoord(sx / scale),
        y: roundCoord(-sy / scale),
    };
}

export function tikzSizeToScene(
    width: number,
    height: number,
    unit: FigureUnit,
): { sw: number; sh: number } {
    const scale = PX_PER_UNIT[unit];
    return {
        sw: Math.max(4, width * scale),
        sh: Math.max(4, height * scale),
    };
}

export function sceneSizeToTikz(
    sw: number,
    sh: number,
    unit: FigureUnit,
): { width: number; height: number } {
    const scale = PX_PER_UNIT[unit];
    return {
        width: Math.max(0.2, roundCoord(sw / scale)),
        height: Math.max(0.2, roundCoord(sh / scale)),
    };
}

export function screenToScene(
    vx: number,
    vy: number,
    viewport: ViewportState,
): { sx: number; sy: number } {
    return {
        sx: (vx - viewport.panX) / viewport.zoom,
        sy: (vy - viewport.panY) / viewport.zoom,
    };
}

export function sceneToScreen(
    sx: number,
    sy: number,
    viewport: ViewportState,
): { vx: number; vy: number } {
    return {
        vx: sx * viewport.zoom + viewport.panX,
        vy: sy * viewport.zoom + viewport.panY,
    };
}
