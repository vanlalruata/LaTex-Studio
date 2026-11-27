import { roundCoord } from './coordinates';
import type {
    ArrowTip,
    ConnectorRouting,
    FigureConnector,
    FigureObject,
    FigureShapeKind,
} from './types';

export type AcademicTemplateCategory =
    | 'flowchart'
    | 'architecture'
    | 'neural_network'
    | 'ml_workflow'
    | 'graph'
    | 'math';

export interface AcademicTemplatePreset {
    id: string;
    title: string;
    category: AcademicTemplateCategory;
    description: string;
    tags: string[];
    build: (layerId: string) => {
        objects: FigureObject[];
        connectors: FigureConnector[];
    };
}

let makerSeq = 1;
function uid(prefix: string): string {
    makerSeq += 1;
    return `${prefix}_m${Date.now().toString(36)}_${makerSeq}`;
}

function makeNode(params: {
    tikzName: string;
    layerId: string;
    zIndex: number;
    x: number;
    y: number;
    width?: number;
    height?: number;
    shape?: FigureShapeKind;
    label: string;
    fill?: string;
    stroke?: string;
}): FigureObject {
    const shape = params.shape ?? 'rounded_rectangle';
    return {
        id: uid('obj'),
        kind: shape === 'coordinate' ? 'coordinate' : shape === 'text' ? 'text' : 'shape',
        tikzName: params.tikzName,
        layerId: params.layerId,
        zIndex: params.zIndex,
        x: roundCoord(params.x),
        y: roundCoord(params.y),
        width: params.width ?? (shape === 'circle' ? 1.3 : 2.6),
        height: params.height ?? (shape === 'circle' ? 1.3 : 1.0),
        rotationDeg: 0,
        shape,
        label: params.label,
        style: {
            stroke: params.stroke ?? '#1e293b',
            strokeWidthPt: 0.8,
            dash: 'solid',
            fill: params.fill ?? '#f8fafc',
            fillOpacity: 1,
            textColor: '#0f172a',
            roundedCornersPt: shape === 'rounded_rectangle' ? 4 : 0,
        },
        visible: true,
        locked: false,
    };
}

function makeEdge(params: {
    layerId: string;
    zIndex: number;
    fromObj: FigureObject;
    toObj: FigureObject;
    routing?: ConnectorRouting;
    curveBendDeg?: number;
    arrowStart?: ArrowTip;
    arrowEnd?: ArrowTip;
    label?: string;
    labelPosition?: 'above' | 'below' | 'left' | 'right' | 'midway';
}): FigureConnector {
    return {
        id: uid('edge'),
        kind: 'connector',
        layerId: params.layerId,
        zIndex: params.zIndex,
        routing: params.routing ?? 'straight',
        curveBendDeg: params.curveBendDeg ?? 20,
        from: {
            objectId: params.fromObj.id,
            anchor: 'auto',
            x: params.fromObj.x,
            y: params.fromObj.y,
        },
        to: {
            objectId: params.toObj.id,
            anchor: 'auto',
            x: params.toObj.x,
            y: params.toObj.y,
        },
        arrowStart: params.arrowStart ?? 'none',
        arrowEnd: params.arrowEnd ?? 'Stealth',
        label: params.label ?? '',
        labelPosition: params.labelPosition ?? 'above',
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

export function buildFlowchartDiagram(
    layerId: string,
    steps: string[] = ['Start', 'Preprocess', 'Evaluate', 'End'],
): { objects: FigureObject[]; connectors: FigureConnector[] } {
    const cleanSteps = steps.map((s) => s.trim()).filter(Boolean);
    const list = cleanSteps.length > 0 ? cleanSteps : ['Start', 'Process', 'End'];
    const objects: FigureObject[] = [];
    const connectors: FigureConnector[] = [];

    list.forEach((step, idx) => {
        const isFirst = idx === 0;
        const isLast = idx === list.length - 1;
        const isDecision = step.endsWith('?');
        const node = makeNode({
            tikzName: `step${idx + 1}`,
            layerId,
            zIndex: idx + 1,
            x: 0,
            y: roundCoord(3 - idx * 2.1),
            width: isDecision ? 2.6 : 2.8,
            height: isDecision ? 1.5 : 1.0,
            shape: isDecision ? 'diamond' : isFirst || isLast ? 'rounded_rectangle' : 'rectangle',
            label: step,
            fill: isFirst || isLast ? '#dcfce7' : isDecision ? '#fef9c3' : '#eff6ff',
        });
        objects.push(node);
        if (idx > 0) {
            connectors.push(
                makeEdge({
                    layerId,
                    zIndex: list.length + idx,
                    fromObj: objects[idx - 1],
                    toObj: node,
                    label: objects[idx - 1].shape === 'diamond' ? 'yes' : '',
                    labelPosition: 'right',
                }),
            );
        }
    });

    return { objects, connectors };
}

export function buildNeuralNetworkDiagram(
    layerId: string,
    layers: string[] = ['Input ($x_t$)', 'CNN Layer', 'BiLSTM Layer', 'Attention ($\\alpha_i$)', 'Output ($F_k$)'],
): { objects: FigureObject[]; connectors: FigureConnector[] } {
    const cleanLayers = layers.map((s) => s.trim()).filter(Boolean);
    const list = cleanLayers.length > 0 ? cleanLayers : ['Input', 'Hidden', 'Output'];
    const palette = ['#dbeafe', '#dcfce7', '#fce7f3', '#e0f2fe', '#ffedd5'];
    const objects: FigureObject[] = [];
    const connectors: FigureConnector[] = [];

    list.forEach((name, idx) => {
        const node = makeNode({
            tikzName: `nn${idx + 1}`,
            layerId,
            zIndex: idx + 1,
            x: 0,
            y: roundCoord(-3.2 + idx * 1.8),
            width: 4.4,
            height: 1.05,
            shape: 'rounded_rectangle',
            label: name,
            fill: palette[idx % palette.length],
        });
        objects.push(node);
        if (idx > 0) {
            connectors.push(
                makeEdge({
                    layerId,
                    zIndex: list.length + idx,
                    fromObj: objects[idx - 1],
                    toObj: node,
                }),
            );
        }
    });

    return { objects, connectors };
}

export function buildGraphTheoryDiagram(
    layerId: string,
    nodeCount = 5,
    directed = true,
): { objects: FigureObject[]; connectors: FigureConnector[] } {
    const count = Math.min(10, Math.max(3, nodeCount));
    const radius = 2.6;
    const objects: FigureObject[] = [];
    const connectors: FigureConnector[] = [];

    for (let i = 0; i < count; i++) {
        const angle = (Math.PI / 2) - (2 * Math.PI * i) / count;
        const x = roundCoord(radius * Math.cos(angle));
        const y = roundCoord(radius * Math.sin(angle));
        objects.push(
            makeNode({
                tikzName: `v${i + 1}`,
                layerId,
                zIndex: i + 1,
                x,
                y,
                width: 1.0,
                height: 1.0,
                shape: 'circle',
                label: `$v_${i + 1}$`,
                fill: '#eef2ff',
            }),
        );
    }

    for (let i = 0; i < count; i++) {
        const next = (i + 1) % count;
        connectors.push(
            makeEdge({
                layerId,
                zIndex: count + i + 1,
                fromObj: objects[i],
                toObj: objects[next],
                arrowEnd: directed ? 'Stealth' : 'none',
                label: `$w_{${i + 1}}$`,
            }),
        );
    }

    return { objects, connectors };
}

export const ACADEMIC_TEMPLATES: AcademicTemplatePreset[] = [
    {
        id: 'decision-flowchart',
        title: 'Decision Tree / Flowchart',
        category: 'flowchart',
        description: 'Classic branching decision flow with yes/no edges and math conditions.',
        tags: ['flowchart', 'decision', 'algorithm'],
        build: (layerId) => {
            const q1 = makeNode({ tikzName: 'q1', layerId, zIndex: 1, x: 0, y: 2.5, width: 2.5, height: 1.4, shape: 'diamond', label: '$x > 0$?', fill: '#fef9c3' });
            const q2 = makeNode({ tikzName: 'q2', layerId, zIndex: 2, x: -2.4, y: 0, width: 2.5, height: 1.4, shape: 'diamond', label: '$y > 0$?', fill: '#fef9c3' });
            const c = makeNode({ tikzName: 'C', layerId, zIndex: 3, x: 2.4, y: 0, width: 2.2, height: 1.0, shape: 'rounded_rectangle', label: 'No Action', fill: '#dcfce7' });
            const a = makeNode({ tikzName: 'A', layerId, zIndex: 4, x: -3.8, y: -2.6, width: 2.0, height: 0.9, shape: 'rounded_rectangle', label: 'Accept', fill: '#dcfce7' });
            const b = makeNode({ tikzName: 'B', layerId, zIndex: 5, x: -1.0, y: -2.6, width: 2.0, height: 0.9, shape: 'rounded_rectangle', label: 'Review', fill: '#dcfce7' });

            return {
                objects: [q1, q2, c, a, b],
                connectors: [
                    makeEdge({ layerId, zIndex: 6, fromObj: q1, toObj: q2, label: 'yes', labelPosition: 'left' }),
                    makeEdge({ layerId, zIndex: 7, fromObj: q1, toObj: c, label: 'no', labelPosition: 'right' }),
                    makeEdge({ layerId, zIndex: 8, fromObj: q2, toObj: a, label: 'yes', labelPosition: 'left' }),
                    makeEdge({ layerId, zIndex: 9, fromObj: q2, toObj: b, label: 'no', labelPosition: 'right' }),
                ],
            };
        },
    },
    {
        id: 'cnn-bilstm-attention',
        title: 'CNN-BiLSTM-Attention Architecture',
        category: 'neural_network',
        description: 'Deep learning sequence architecture with input, CNN, BiLSTM, attention, and output layers.',
        tags: ['deep learning', 'CNN', 'BiLSTM', 'Attention'],
        build: (layerId) =>
            buildNeuralNetworkDiagram(layerId, [
                'Input Layer ($x_1, \\dots, x_t$)',
                'CNN + Pooling Layer',
                'BiLSTM Layer ($h_1, \\dots, h_t$)',
                'Attention Layer ($\\alpha_i$)',
                'Output Layer ($F_1, \\dots, F_k$)',
            ]),
    },
    {
        id: 'transformer-block',
        title: 'Transformer Encoder Block',
        category: 'neural_network',
        description: 'Self-attention, Add & Norm, and Feed-Forward sublayers with residual skip connection.',
        tags: ['Transformer', 'Attention', 'NLP'],
        build: (layerId) => {
            const inp = makeNode({ tikzName: 'inp', layerId, zIndex: 1, x: 0, y: -3.2, width: 3.6, height: 0.9, shape: 'rounded_rectangle', label: 'Input Embeddings', fill: '#f1f5f9' });
            const mha = makeNode({ tikzName: 'mha', layerId, zIndex: 2, x: 0, y: -1.4, width: 3.6, height: 1.0, shape: 'rounded_rectangle', label: 'Multi-Head Attention', fill: '#ffedd5' });
            const norm1 = makeNode({ tikzName: 'norm1', layerId, zIndex: 3, x: 0, y: 0.3, width: 3.6, height: 0.85, shape: 'rounded_rectangle', label: 'Add \\& Norm', fill: '#fef9c3' });
            const ffn = makeNode({ tikzName: 'ffn', layerId, zIndex: 4, x: 0, y: 2.0, width: 3.6, height: 1.0, shape: 'rounded_rectangle', label: 'Feed Forward', fill: '#dbeafe' });
            const norm2 = makeNode({ tikzName: 'norm2', layerId, zIndex: 5, x: 0, y: 3.6, width: 3.6, height: 0.85, shape: 'rounded_rectangle', label: 'Add \\& Norm', fill: '#fef9c3' });

            return {
                objects: [inp, mha, norm1, ffn, norm2],
                connectors: [
                    makeEdge({ layerId, zIndex: 6, fromObj: inp, toObj: mha }),
                    makeEdge({ layerId, zIndex: 7, fromObj: mha, toObj: norm1 }),
                    makeEdge({ layerId, zIndex: 8, fromObj: norm1, toObj: ffn }),
                    makeEdge({ layerId, zIndex: 9, fromObj: ffn, toObj: norm2 }),
                    makeEdge({ layerId, zIndex: 10, fromObj: inp, toObj: norm1, routing: 'curved', curveBendDeg: 40, label: 'residual', labelPosition: 'right' }),
                ],
            };
        },
    },
    {
        id: 'system-architecture',
        title: 'Distributed System Architecture',
        category: 'architecture',
        description: 'Client, API Gateway, Queue, Worker, and Database with orthogonal routing.',
        tags: ['system', 'backend', 'worker', 'IoT'],
        build: (layerId) => {
            const client = makeNode({ tikzName: 'client', layerId, zIndex: 1, x: -4.2, y: 1.2, width: 2.4, height: 1.0, shape: 'rounded_rectangle', label: 'Research Client', fill: '#eff6ff' });
            const api = makeNode({ tikzName: 'api', layerId, zIndex: 2, x: 0, y: 1.2, width: 2.6, height: 1.0, shape: 'rectangle', label: 'API Gateway', fill: '#dcfce7' });
            const queue = makeNode({ tikzName: 'queue', layerId, zIndex: 3, x: 4.2, y: 1.2, width: 2.4, height: 1.0, shape: 'rectangle', label: 'Redis Queue', fill: '#fef9c3' });
            const db = makeNode({ tikzName: 'db', layerId, zIndex: 4, x: 0, y: -1.6, width: 2.6, height: 1.0, shape: 'rounded_rectangle', label: 'MySQL Store', fill: '#f3e8ff' });
            const worker = makeNode({ tikzName: 'worker', layerId, zIndex: 5, x: 4.2, y: -1.6, width: 2.6, height: 1.0, shape: 'rectangle', label: 'TeX Worker', fill: '#fee2e2' });

            return {
                objects: [client, api, queue, db, worker],
                connectors: [
                    makeEdge({ layerId, zIndex: 6, fromObj: client, toObj: api, label: 'HTTPS', labelPosition: 'above' }),
                    makeEdge({ layerId, zIndex: 7, fromObj: api, toObj: queue, label: 'dispatch', labelPosition: 'above' }),
                    makeEdge({ layerId, zIndex: 8, fromObj: api, toObj: db, arrowStart: 'Stealth', arrowEnd: 'Stealth' }),
                    makeEdge({ layerId, zIndex: 9, fromObj: queue, toObj: worker, label: 'job', labelPosition: 'right' }),
                    makeEdge({ layerId, zIndex: 10, fromObj: worker, toObj: db, routing: 'orthogonal_hv', label: 'artifacts', labelPosition: 'below' }),
                ],
            };
        },
    },
    {
        id: 'ml-pipeline',
        title: 'ML Experimental Workflow',
        category: 'ml_workflow',
        description: 'End-to-end machine learning pipeline from dataset ingestion to evaluation.',
        tags: ['ML', 'intrusion detection', 'pipeline'],
        build: (layerId) => {
            const d1 = makeNode({ tikzName: 'data', layerId, zIndex: 1, x: -5.0, y: 0, width: 2.2, height: 1.0, shape: 'rounded_rectangle', label: 'Raw Dataset', fill: '#eff6ff' });
            const d2 = makeNode({ tikzName: 'prep', layerId, zIndex: 2, x: -1.7, y: 0, width: 2.4, height: 1.0, shape: 'rectangle', label: 'Preprocessing', fill: '#f0fdf4' });
            const d3 = makeNode({ tikzName: 'train', layerId, zIndex: 3, x: 1.7, y: 0, width: 2.4, height: 1.0, shape: 'rectangle', label: 'Model Training', fill: '#fefce8' });
            const d4 = makeNode({ tikzName: 'eval', layerId, zIndex: 4, x: 5.0, y: 0, width: 2.2, height: 1.0, shape: 'rounded_rectangle', label: 'Evaluation', fill: '#fdf2f8' });

            return {
                objects: [d1, d2, d3, d4],
                connectors: [
                    makeEdge({ layerId, zIndex: 5, fromObj: d1, toObj: d2 }),
                    makeEdge({ layerId, zIndex: 6, fromObj: d2, toObj: d3 }),
                    makeEdge({ layerId, zIndex: 7, fromObj: d3, toObj: d4 }),
                ],
            };
        },
    },
    {
        id: 'directed-cycle-graph',
        title: 'Directed Cycle Graph ($C_5$)',
        category: 'graph',
        description: '5-vertex directed graph with weighted edges.',
        tags: ['graph', 'network', 'vertices'],
        build: (layerId) => buildGraphTheoryDiagram(layerId, 5, true),
    },
    {
        id: 'geometry-axes',
        title: 'Coordinate Geometry Triangle',
        category: 'math',
        description: 'Origin, coordinate vertices, and labeled geometric segments.',
        tags: ['geometry', 'math', 'coordinates'],
        build: (layerId) => {
            const o = makeNode({ tikzName: 'O', layerId, zIndex: 1, x: 0, y: 0, shape: 'coordinate', label: '' });
            const p1 = makeNode({ tikzName: 'P1', layerId, zIndex: 2, x: 3.5, y: 0, shape: 'coordinate', label: '' });
            const p2 = makeNode({ tikzName: 'P2', layerId, zIndex: 3, x: 3.5, y: 2.5, shape: 'coordinate', label: '' });
            const lbl = makeNode({ tikzName: 'lbl', layerId, zIndex: 4, x: 1.75, y: -0.6, shape: 'text', label: '$c^2 = a^2 + b^2$' });

            return {
                objects: [o, p1, p2, lbl],
                connectors: [
                    makeEdge({ layerId, zIndex: 5, fromObj: o, toObj: p1, arrowEnd: 'none', label: '$a$', labelPosition: 'below' }),
                    makeEdge({ layerId, zIndex: 6, fromObj: p1, toObj: p2, arrowEnd: 'none', label: '$b$', labelPosition: 'right' }),
                    makeEdge({ layerId, zIndex: 7, fromObj: o, toObj: p2, arrowEnd: 'none', label: '$c$', labelPosition: 'above' }),
                ],
            };
        },
    },
];
