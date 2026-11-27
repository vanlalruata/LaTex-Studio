export type PgfPlotChartType = 'line' | 'scatter' | 'bar';

export type PgfPlotMark = '*' | 'square*' | 'triangle*' | 'diamond*' | 'x' | 'none';

export type PgfPlotLineStyle = 'solid' | 'dashed' | 'dotted';

export interface PgfPlotPoint {
    x: number;
    y: number;
    yErr?: number;
}

export interface PgfPlotSeries {
    id: string;
    label: string;
    color: string;
    mark: PgfPlotMark;
    lineStyle: PgfPlotLineStyle;
    points: PgfPlotPoint[];
}

export interface PgfPlotsAxisConfig {
    title: string;
    xlabel: string;
    ylabel: string;
    chartType: PgfPlotChartType;
    grid: 'none' | 'major' | 'both';
    legendPos: 'north west' | 'north east' | 'south west' | 'south east' | 'outer north east';
    widthCm: number;
    heightCm: number;
    series: PgfPlotSeries[];
}

const DEFAULT_COLORS = ['blue!75!black', 'red!75!black', 'green!60!black', 'orange!85!black', 'purple!75!black'];
const DEFAULT_MARKS: PgfPlotMark[] = ['*', 'square*', 'triangle*', 'diamond*', 'x'];

export const SVG_COLOR_MAP: Record<string, string> = {
    'blue!75!black': '#1d4ed8',
    'red!75!black': '#b91c1c',
    'green!60!black': '#15803d',
    'orange!85!black': '#c2410c',
    'purple!75!black': '#7e22ce',
};

export function createDefaultPgfPlotsConfig(): PgfPlotsAxisConfig {
    return {
        title: 'Model Performance Comparison',
        xlabel: 'Epoch',
        ylabel: 'Accuracy (\\%)',
        chartType: 'line',
        grid: 'major',
        legendPos: 'south east',
        widthCm: 11,
        heightCm: 7,
        series: [
            {
                id: 's1',
                label: 'Proposed (CNN-BiLSTM)',
                color: 'blue!75!black',
                mark: 'square*',
                lineStyle: 'solid',
                points: [
                    { x: 0, y: 72.5 },
                    { x: 10, y: 84.1 },
                    { x: 20, y: 91.8 },
                    { x: 30, y: 95.4 },
                    { x: 40, y: 96.7 },
                ],
            },
            {
                id: 's2',
                label: 'Baseline',
                color: 'red!75!black',
                mark: 'triangle*',
                lineStyle: 'dashed',
                points: [
                    { x: 0, y: 68.0 },
                    { x: 10, y: 77.2 },
                    { x: 20, y: 82.9 },
                    { x: 30, y: 85.1 },
                    { x: 40, y: 86.0 },
                ],
            },
        ],
    };
}

export function parseCsvToSeries(csvText: string): PgfPlotSeries[] {
    const rawLines = csvText
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);

    if (rawLines.length === 0) {
        return [];
    }

    const rows = rawLines.map((line) => line.split(',').map((cell) => cell.trim()));
    const firstRowHasHeader = rows[0].some((cell) => Number.isNaN(Number(cell)));
    const headers = firstRowHasHeader ? rows[0] : rows[0].map((_, idx) => (idx === 0 ? 'x' : `Series ${idx}`));
    const dataRows = firstRowHasHeader ? rows.slice(1) : rows;

    const colCount = headers.length;
    if (colCount < 2) {
        return [];
    }

    const seriesList: PgfPlotSeries[] = [];
    for (let c = 1; c < colCount; c++) {
        const points: PgfPlotPoint[] = [];
        for (const row of dataRows) {
            const x = Number(row[0]);
            const y = Number(row[c]);
            if (!Number.isNaN(x) && !Number.isNaN(y)) {
                points.push({ x, y });
            }
        }
        seriesList.push({
            id: `csv_${c}`,
            label: headers[c] || `Series ${c}`,
            color: DEFAULT_COLORS[(c - 1) % DEFAULT_COLORS.length],
            mark: DEFAULT_MARKS[(c - 1) % DEFAULT_MARKS.length],
            lineStyle: 'solid',
            points,
        });
    }

    return seriesList;
}

export function generatePgfPlotsTikz(config: PgfPlotsAxisConfig): string {
    const axisOpts: string[] = [
        `width=${config.widthCm}cm`,
        `height=${config.heightCm}cm`,
    ];

    if (config.title.trim()) {
        axisOpts.push(`title={${config.title.trim()}}`);
    }
    if (config.xlabel.trim()) {
        axisOpts.push(`xlabel={${config.xlabel.trim()}}`);
    }
    if (config.ylabel.trim()) {
        axisOpts.push(`ylabel={${config.ylabel.trim()}}`);
    }
    if (config.grid !== 'none') {
        axisOpts.push(`grid=${config.grid}`);
    }
    if (config.chartType === 'bar') {
        axisOpts.push('ybar');
        axisOpts.push('bar width=8pt');
    }
    axisOpts.push(`legend pos=${config.legendPos}`);

    const lines: string[] = [
        '% Requires \\usepackage{pgfplots} and \\pgfplotsset{compat=1.18}',
        '\\begin{tikzpicture}',
        '  \\begin{axis}[',
        ...axisOpts.map((opt, idx) => `    ${opt}${idx < axisOpts.length - 1 ? ',' : ''}`),
        '  ]',
    ];

    for (const s of config.series) {
        const plotOpts: string[] = [s.color];
        if (config.chartType === 'scatter') {
            plotOpts.push('only marks');
        } else if (config.chartType === 'line' && s.lineStyle !== 'solid') {
            plotOpts.push(s.lineStyle);
        }
        if (s.mark !== 'none' && config.chartType !== 'bar') {
            plotOpts.push(`mark=${s.mark}`);
        } else if (config.chartType === 'line') {
            plotOpts.push('no markers');
        }

        const coords = s.points.map((p) => `(${p.x},${p.y})`).join(' ');
        lines.push(`    \\addplot+[${plotOpts.join(', ')}] coordinates { ${coords} };`);
        lines.push(`    \\addlegendentry{${s.label}}`);
    }

    lines.push('  \\end{axis}');
    lines.push('\\end{tikzpicture}');
    return lines.join('\n');
}
