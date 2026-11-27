export type FigureMode = 'visual_native' | 'hybrid' | 'source_only';

export type FigureUnit = 'cm' | 'mm' | 'pt' | 'in';

export type FigureShapeKind =
    | 'rectangle'
    | 'rounded_rectangle'
    | 'circle'
    | 'ellipse'
    | 'diamond'
    | 'coordinate'
    | 'text'
    | 'fit_box'
    | 'matrix';

export type CanvasTool =
    | 'select'
    | 'pan'
    | 'rectangle'
    | 'rounded_rectangle'
    | 'circle'
    | 'ellipse'
    | 'diamond'
    | 'coordinate'
    | 'text'
    | 'fit_box'
    | 'matrix'
    | 'connector';

export type StrokeDash = 'solid' | 'dashed' | 'dotted' | 'dashdot';

export type TikzPattern =
    | 'none'
    | 'north east lines'
    | 'north west lines'
    | 'grid'
    | 'dots'
    | 'crosshatch';

export type PathDecoration = 'none' | 'snake' | 'zigzag' | 'brace';

export type NodeAnchor =
    | 'auto'
    | 'center'
    | 'north'
    | 'south'
    | 'east'
    | 'west'
    | 'north east'
    | 'north west'
    | 'south east'
    | 'south west';

export type ArrowTip = 'none' | 'Stealth' | 'Latex' | 'To' | 'Circle' | 'Bar';

export type ConnectorRouting =
    | 'straight'
    | 'orthogonal_hv'
    | 'orthogonal_vh'
    | 'curved';

export type EdgeLabelPosition =
    | 'above'
    | 'below'
    | 'left'
    | 'right'
    | 'midway';

export interface FigureObjectStyle {
    stroke: string;
    strokeWidthPt: number;
    dash: StrokeDash;
    fill: string;
    fillOpacity: number;
    textColor: string;
    roundedCornersPt: number;
    pattern?: TikzPattern;
    scaleX?: number;
    scaleY?: number;
}

export interface FigureObject {
    id: string;
    kind: 'shape' | 'text' | 'coordinate' | 'fit_box' | 'matrix';
    tikzName: string;
    layerId: string;
    groupId?: string | null;
    zIndex: number;
    x: number;
    y: number;
    width: number;
    height: number;
    rotationDeg: number;
    shape: FigureShapeKind;
    label: string;
    fitTargetIds?: string[];
    onBackgroundLayer?: boolean;
    matrixCells?: string[][];
    style: FigureObjectStyle;
    visible: boolean;
    locked: boolean;
}

export interface ConnectorEndpoint {
    objectId?: string;
    anchor?: NodeAnchor;
    x: number;
    y: number;
}

export interface FigureConnector {
    id: string;
    kind: 'connector';
    layerId: string;
    zIndex: number;
    routing: ConnectorRouting;
    curveBendDeg: number;
    decoration?: PathDecoration;
    from: ConnectorEndpoint;
    to: ConnectorEndpoint;
    arrowStart: ArrowTip;
    arrowEnd: ArrowTip;
    label: string;
    labelPosition: EdgeLabelPosition;
    style: {
        stroke: string;
        strokeWidthPt: number;
        dash: StrokeDash;
        textColor: string;
    };
    visible: boolean;
    locked: boolean;
}

export type AnySceneItem = FigureObject | FigureConnector;

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

export interface ProtectedTikzBlock {
    id: string;
    anchorAfterObjectId: string | null;
    rawTikz: string;
}

export interface SourceMapEntry {
    itemId: string;
    startLine: number;
    endLine: number;
}

export interface FigureSceneDocument {
    schema_version: 1;
    id: string;
    name: string;
    unit: FigureUnit;
    grid: FigureGridSettings;
    layers: FigureLayer[];
    objects: FigureObject[];
    connectors: FigureConnector[];
    protectedBlocks: ProtectedTikzBlock[];
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
