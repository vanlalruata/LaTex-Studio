export type FigureMode = 'visual_native' | 'hybrid' | 'source_only';

export type FigureUnit = 'cm' | 'mm' | 'pt' | 'in';

export type FigureShapeKind =
    | 'rectangle'
    | 'rounded_rectangle'
    | 'circle'
    | 'ellipse'
    | 'diamond'
    | 'text';

export type CanvasTool =
    | 'select'
    | 'pan'
    | 'rectangle'
    | 'rounded_rectangle'
    | 'circle'
    | 'ellipse'
    | 'diamond'
    | 'text';

export type StrokeDash = 'solid' | 'dashed' | 'dotted';

export interface FigureObjectStyle {
    stroke: string;
    strokeWidthPt: number;
    dash: StrokeDash;
    fill: string;
    fillOpacity: number;
    textColor: string;
    roundedCornersPt: number;
}

export interface FigureObject {
    id: string;
    kind: 'shape' | 'text';
    tikzName: string;
    layerId: string;
    zIndex: number;
    x: number;
    y: number;
    width: number;
    height: number;
    rotationDeg: number;
    shape: FigureShapeKind;
    label: string;
    style: FigureObjectStyle;
    visible: boolean;
    locked: boolean;
}

export interface FigureLayer {
    id: string;
    name: string;
    visible: boolean;
    locked: boolean;
    order: number;
}

export interface FigureGridSettings {
    enabled: boolean;
    step: number;
    snap: boolean;
}

export interface FigureMetadata {
    caption: string;
    label: string;
}

export interface FigureSceneDocument {
    schema_version: 1;
    id: string;
    name: string;
    unit: FigureUnit;
    grid: FigureGridSettings;
    layers: FigureLayer[];
    objects: FigureObject[];
    metadata: FigureMetadata;
}

export interface FigureRecord {
    public_id: string;
    name: string;
    schema_version: number;
    mode: FigureMode;
    scene_json: FigureSceneDocument;
    tikz_source: string;
    required_packages_json: string[];
    required_libraries_json: string[];
    updated_at: string | null;
}

export interface ViewportState {
    zoom: number;
    panX: number;
    panY: number;
}
