import * as monaco from 'monaco-editor';
import {
    latexToSvgDataUrl,
    latexToUnicodeFormatted,
} from '@/lib/mathRenderer';
import { parseLatexDocument } from '@/services/latex/latexParser';

export interface ProjectSymbolContext {
    labels: string[];
    citations: string[];
    files: string[];
}

let providersRegistered = false;
let currentContext: ProjectSymbolContext = {
    labels: [],
    citations: [],
    files: [],
};

export function updateProjectSymbolContext(context: ProjectSymbolContext): void {
    currentContext = context;
}

const COMMON_COMMANDS: Array<{ label: string; insertText: string; detail: string }> = [
    { label: '\\section', insertText: '\\section{${1:Title}}', detail: 'Section heading' },
    { label: '\\subsection', insertText: '\\subsection{${1:Title}}', detail: 'Subsection heading' },
    { label: '\\begin{equation}', insertText: '\\begin{equation}\n\t${1:x = y}\n\\end{equation}', detail: 'Numbered equation' },
    { label: '\\begin{align}', insertText: '\\begin{align}\n\t${1:a} &= ${2:b}\n\\end{align}', detail: 'Aligned equations' },
    { label: '\\begin{figure}', insertText: '\\begin{figure}[htbp]\n\t\\centering\n\t\\includegraphics[width=0.8\\linewidth]{${1:figure}}\n\t\\caption{${2:Caption}}\n\t\\label{fig:${3:label}}\n\\end{figure}', detail: 'Figure float' },
    { label: '\\begin{table}', insertText: '\\begin{table}[htbp]\n\t\\centering\n\t\\caption{${1:Caption}}\n\t\\label{tab:${2:label}}\n\\end{table}', detail: 'Table float' },
    { label: '\\frac', insertText: '\\frac{${1:num}}{${2:den}}', detail: 'Fraction' },
    { label: '\\cite', insertText: '\\cite{${1:key}}', detail: 'Citation' },
    { label: '\\ref', insertText: '\\ref{${1:label}}', detail: 'Cross-reference' },
    { label: '\\eqref', insertText: '\\eqref{${1:label}}', detail: 'Equation reference' },
    { label: '\\label', insertText: '\\label{${1:name}}', detail: 'Define label' },
    { label: '\\usepackage', insertText: '\\usepackage{${1:package}}', detail: 'Load package' },
];

export function registerLatexProviders(): void {
    const globalState = globalThis as { __latexHoverDisposable?: monaco.IDisposable };
    if (providersRegistered && globalState.__latexHoverDisposable) {
        return;
    }

    globalState.__latexHoverDisposable?.dispose();
    providersRegistered = true;

    monaco.languages.registerCompletionItemProvider('latex', {
        triggerCharacters: ['\\', '{', ','],
        provideCompletionItems(model, position) {
            const linePrefix = model.getValueInRange({
                startLineNumber: position.lineNumber,
                startColumn: 1,
                endLineNumber: position.lineNumber,
                endColumn: position.column,
            });

            const word = model.getWordUntilPosition(position);
            const range = {
                startLineNumber: position.lineNumber,
                endLineNumber: position.lineNumber,
                startColumn: word.startColumn,
                endColumn: word.endColumn,
            };

            // 1. Inside \ref{ or \eqref{ -> suggest project labels
            if (/\\(?:eq)?ref\{[^}]*$/.test(linePrefix)) {
                return {
                    suggestions: currentContext.labels.map((label) => ({
                        label,
                        kind: monaco.languages.CompletionItemKind.Reference,
                        insertText: label,
                        detail: 'Project label',
                        range,
                    })),
                };
            }

            // 2. Inside \cite{ -> suggest BibTeX citation keys
            if (/\\cite(?:\[[^\]]*\])?\{[^}]*$/.test(linePrefix)) {
                return {
                    suggestions: currentContext.citations.map((key) => ({
                        label: key,
                        kind: monaco.languages.CompletionItemKind.Value,
                        insertText: key,
                        detail: 'BibTeX entry',
                        range,
                    })),
                };
            }

            // 3. Inside \input{ or \include{ -> suggest project .tex files
            if (/\\(?:input|include)\{[^}]*$/.test(linePrefix)) {
                return {
                    suggestions: currentContext.files
                        .filter((f) => f.endsWith('.tex'))
                        .map((file) => ({
                            label: file,
                            kind: monaco.languages.CompletionItemKind.File,
                            insertText: file.replace(/\.tex$/, ''),
                            detail: 'Project file',
                            range,
                        })),
                };
            }

            // 4. Default LaTeX commands & snippets
            return {
                suggestions: COMMON_COMMANDS.map((cmd) => ({
                    label: cmd.label,
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    insertText: cmd.insertText,
                    insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                    detail: cmd.detail,
                    range,
                })),
            };
        },
    });

    monaco.languages.registerFoldingRangeProvider('latex', {
        provideFoldingRanges(model) {
            const parsed = parseLatexDocument(model.getValue());

            return parsed.environments
                .filter((env) => env.endLine > env.startLine)
                .map((env) => ({
                    start: env.startLine,
                    end: env.endLine,
                    kind: monaco.languages.FoldingRangeKind.Region,
                }));
        },
    });

    const MATH_ENVIRONMENTS = new Set([
        'equation',
        'equation*',
        'align',
        'align*',
        'aligned',
        'gather',
        'gather*',
        'multline',
        'multline*',
        'flalign',
        'flalign*',
        'eqnarray',
        'eqnarray*',
        'split',
        'cases',
        'matrix',
        'pmatrix',
        'bmatrix',
        'Bmatrix',
        'vmatrix',
        'Vmatrix',
    ]);

    const buildMathHover = (
        rawTex: string,
        range: monaco.IRange,
    ): monaco.languages.Hover | null => {
        const svgUrl = latexToSvgDataUrl(rawTex, false);
        const unicode = latexToUnicodeFormatted(rawTex);
        const contents: monaco.IMarkdownString[] = [];

        if (svgUrl) {
            contents.push({
                value: `![Formula Preview](${svgUrl})`,
                isTrusted: true,
            });
        } else if (unicode) {
            contents.push({ value: `\`${unicode}\`` });
        }

        if (contents.length === 0) {
            return null;
        }

        return { range, contents };
    };

    const findMathBlockAtOffset = (
        fullText: string,
        offset: number,
    ): { start: number; end: number; tex: string } | null => {
        // 1. Check multi-line $$...$$ and \[...\]
        const blockDelims = [/\$\$([\s\S]*?)\$\$/g, /\\\[([\s\S]*?)\\\]/g];
        for (const regex of blockDelims) {
            let m: RegExpExecArray | null;
            while ((m = regex.exec(fullText)) !== null) {
                const start = m.index;
                const end = start + m[0].length;
                if (offset >= start && offset <= end) {
                    return { start, end, tex: m[0] };
                }
            }
        }

        // 2. Check \begin{env}...\end{env} math environments (matching outermost container)
        const tokenRegex = /\\(begin|end)\{([a-zA-Z*]+)\}/g;
        const stack: Array<{ env: string; start: number }> = [];
        let outermostMatch: { start: number; end: number; tex: string } | null = null;
        let tok: RegExpExecArray | null;

        while ((tok = tokenRegex.exec(fullText)) !== null) {
            const kind = tok[1];
            const env = tok[2];
            if (!MATH_ENVIRONMENTS.has(env)) {
                continue;
            }
            if (kind === 'begin') {
                stack.push({ env, start: tok.index });
            } else {
                for (let i = stack.length - 1; i >= 0; i--) {
                    if (stack[i].env === env) {
                        const open = stack[i];
                        stack.splice(i);
                        const end = tok.index + tok[0].length;
                        if (i === 0 && offset >= open.start && offset <= end) {
                            outermostMatch = {
                                start: open.start,
                                end,
                                tex: fullText.slice(open.start, end),
                            };
                        }
                        break;
                    }
                }
                if (outermostMatch) {
                    return outermostMatch;
                }
            }
        }

        return null;
    };

    globalState.__latexHoverDisposable = monaco.languages.registerHoverProvider('latex', {
        provideHover(model, position) {
            // 1. Fast path: single-line inline/display math on the hovered line
            const lineContent = model.getLineContent(position.lineNumber);
            const colZero = position.column - 1;

            const mathPatterns = [
                /\$\$([^$]+)\$\$/g,
                /\$([^$]+)\$/g,
                /\\\[([^\]]+)\\\]/g,
                /\\\(([^)]+)\\\)/g,
            ];

            for (const regex of mathPatterns) {
                let m: RegExpExecArray | null;
                while ((m = regex.exec(lineContent)) !== null) {
                    const start = m.index;
                    const end = start + m[0].length;
                    if (colZero >= start && colZero <= end) {
                        const hover = buildMathHover(
                            m[0],
                            new monaco.Range(
                                position.lineNumber,
                                start + 1,
                                position.lineNumber,
                                end + 1,
                            ),
                        );
                        if (hover) {
                            return hover;
                        }
                    }
                }
            }

            // 2. Multi-line math blocks: \begin{equation}...\end{equation}, align, matrix, cases, $$...$$, \[...\]
            const fullText = model.getValue();
            const offset = model.getOffsetAt(position);
            const block = findMathBlockAtOffset(fullText, offset);
            if (block) {
                const startPos = model.getPositionAt(block.start);
                const endPos = model.getPositionAt(block.end);
                const hover = buildMathHover(
                    block.tex,
                    new monaco.Range(
                        startPos.lineNumber,
                        startPos.column,
                        endPos.lineNumber,
                        endPos.column,
                    ),
                );
                if (hover) {
                    return hover;
                }
            }

            const word = model.getWordAtPosition(position);
            if (!word) {
                return null;
            }

            const docs: Record<string, string> = {
                documentclass: 'Defines the document class (e.g. `article`, `report`, `book`).',
                usepackage: 'Loads a LaTeX macro package.',
                section: 'Starts a new numbered section.',
                subsection: 'Starts a new numbered subsection.',
                label: 'Assigns a symbolic label for cross-referencing with `\\ref` or `\\eqref`.',
                cite: 'Inserts a bibliography citation from `.bib` resources.',
                begin: 'Opens a LaTeX environment (must be paired with `\\end{...}`).',
            };

            const help = docs[word.word];
            if (!help) {
                return null;
            }

            return {
                contents: [{ value: `**\\${word.word}** — ${help}` }],
            };
        },
    });
}

export function applyLiveMarkers(model: monaco.editor.ITextModel): void {
    const parsed = parseLatexDocument(
        model.getValue(),
        currentContext.labels,
        currentContext.citations,
    );

    const markers: monaco.editor.IMarkerData[] = parsed.diagnostics.map((d) => ({
        severity:
            d.severity === 'error'
                ? monaco.MarkerSeverity.Error
                : d.severity === 'warning'
                  ? monaco.MarkerSeverity.Warning
                  : monaco.MarkerSeverity.Info,
        message: d.message,
        startLineNumber: d.line,
        startColumn: d.startColumn,
        endLineNumber: d.line,
        endColumn: d.endColumn,
    }));

    monaco.editor.setModelMarkers(model, 'latex-engine', markers);
}
