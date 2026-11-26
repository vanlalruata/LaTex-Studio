export interface SourceSpan {
    line: number;
    startColumn: number;
    endColumn: number;
}

export interface LabelSymbol {
    name: string;
    span: SourceSpan;
}

export interface ReferenceUsage {
    name: string;
    kind: 'ref' | 'cite';
    span: SourceSpan;
}

export interface LiveDiagnostic {
    severity: 'error' | 'warning' | 'info';
    message: string;
    line: number;
    startColumn: number;
    endColumn: number;
}

export interface ParsedLatexDocument {
    labels: LabelSymbol[];
    references: ReferenceUsage[];
    environments: Array<{ name: string; startLine: number; endLine: number }>;
    diagnostics: LiveDiagnostic[];
}

export function parseLatexDocument(
    source: string,
    knownProjectLabels: string[] = [],
    knownCitationKeys: string[] = [],
): ParsedLatexDocument {
    const lines = source.split(/\r?\n/);
    const labels: LabelSymbol[] = [];
    const references: ReferenceUsage[] = [];
    const environments: Array<{ name: string; startLine: number; endLine: number }> = [];
    const diagnostics: LiveDiagnostic[] = [];

    const envStack: Array<{ name: string; line: number; col: number }> = [];
    const braceStack: Array<{ line: number; col: number }> = [];
    const seenLocalLabels = new Map<string, number>();

    lines.forEach((rawLine, idx) => {
        const lineNum = idx + 1;
        // Strip unescaped % comments for structural analysis
        const commentIdx = rawLine.search(/(?<!\\)%/);
        const line = commentIdx >= 0 ? rawLine.slice(0, commentIdx) : rawLine;

        // Track brace balance
        for (let c = 0; c < line.length; c++) {
            const ch = line[c];
            if (ch === '\\') {
                c++;
                continue;
            }
            if (ch === '{') {
                braceStack.push({ line: lineNum, col: c + 1 });
            } else if (ch === '}') {
                if (braceStack.length === 0) {
                    diagnostics.push({
                        severity: 'error',
                        message: 'Unmatched closing brace `}`.',
                        line: lineNum,
                        startColumn: c + 1,
                        endColumn: c + 2,
                    });
                } else {
                    braceStack.pop();
                }
            }
        }

        // Match \begin{env} and \end{env}
        const envRegex = /\\(begin|end)\{([^}]+)\}/g;
        let envMatch: RegExpExecArray | null;
        while ((envMatch = envRegex.exec(line)) !== null) {
            const kind = envMatch[1];
            const envName = envMatch[2];
            const startCol = envMatch.index + 1;
            const endCol = startCol + envMatch[0].length;

            if (kind === 'begin') {
                envStack.push({ name: envName, line: lineNum, col: startCol });
            } else {
                const top = envStack.pop();
                if (!top) {
                    diagnostics.push({
                        severity: 'error',
                        message: `Unexpected \\end{${envName}} without matching \\begin{${envName}}.`,
                        line: lineNum,
                        startColumn: startCol,
                        endColumn: endCol,
                    });
                } else if (top.name !== envName) {
                    diagnostics.push({
                        severity: 'error',
                        message: `Mismatched environment: expected \\end{${top.name}}, found \\end{${envName}}.`,
                        line: lineNum,
                        startColumn: startCol,
                        endColumn: endCol,
                    });
                } else {
                    environments.push({
                        name: envName,
                        startLine: top.line,
                        endLine: lineNum,
                    });
                }
            }
        }

        // Match \label{...}
        const labelRegex = /\\label\{([^}]+)\}/g;
        let labelMatch: RegExpExecArray | null;
        while ((labelMatch = labelRegex.exec(line)) !== null) {
            const name = labelMatch[1].trim();
            const startCol = labelMatch.index + 1;
            const endCol = startCol + labelMatch[0].length;

            labels.push({
                name,
                span: { line: lineNum, startColumn: startCol, endColumn: endCol },
            });

            if (seenLocalLabels.has(name)) {
                diagnostics.push({
                    severity: 'warning',
                    message: `Duplicate label "${name}" (first defined on line ${seenLocalLabels.get(name)}).`,
                    line: lineNum,
                    startColumn: startCol,
                    endColumn: endCol,
                });
            } else {
                seenLocalLabels.set(name, lineNum);
            }
        }

        // Match \ref{...} / \eqref{...}
        const refRegex = /\\(?:eq)?ref\{([^}]+)\}/g;
        let refMatch: RegExpExecArray | null;
        while ((refMatch = refRegex.exec(line)) !== null) {
            const name = refMatch[1].trim();
            const startCol = refMatch.index + 1;
            const endCol = startCol + refMatch[0].length;
            references.push({
                name,
                kind: 'ref',
                span: { line: lineNum, startColumn: startCol, endColumn: endCol },
            });
        }

        // Match \cite{...}
        const citeRegex = /\\cite(?:\[[^\]]*\])?\{([^}]+)\}/g;
        let citeMatch: RegExpExecArray | null;
        while ((citeMatch = citeRegex.exec(line)) !== null) {
            const keys = citeMatch[1].split(',').map((k) => k.trim()).filter(Boolean);
            const startCol = citeMatch.index + 1;
            const endCol = startCol + citeMatch[0].length;
            for (const key of keys) {
                references.push({
                    name: key,
                    kind: 'cite',
                    span: { line: lineNum, startColumn: startCol, endColumn: endCol },
                });
            }
        }
    });

    for (const unclosed of envStack) {
        diagnostics.push({
            severity: 'error',
            message: `Unclosed environment \\begin{${unclosed.name}}.`,
            line: unclosed.line,
            startColumn: unclosed.col,
            endColumn: unclosed.col + unclosed.name.length + 8,
        });
    }

    for (const brace of braceStack) {
        diagnostics.push({
            severity: 'error',
            message: 'Unclosed opening brace `{`.',
            line: brace.line,
            startColumn: brace.col,
            endColumn: brace.col + 1,
        });
    }

    // Check unresolved \ref and \cite if project index is available
    const allKnownLabels = new Set([...knownProjectLabels, ...labels.map((l) => l.name)]);
    const allKnownCitations = new Set(knownCitationKeys);

    for (const usage of references) {
        if (usage.kind === 'ref' && allKnownLabels.size > 0 && !allKnownLabels.has(usage.name)) {
            diagnostics.push({
                severity: 'warning',
                message: `Unresolved reference "${usage.name}".`,
                line: usage.span.line,
                startColumn: usage.span.startColumn,
                endColumn: usage.span.endColumn,
            });
        }
        if (usage.kind === 'cite' && allKnownCitations.size > 0 && !allKnownCitations.has(usage.name)) {
            diagnostics.push({
                severity: 'warning',
                message: `Unresolved citation key "${usage.name}".`,
                line: usage.span.line,
                startColumn: usage.span.startColumn,
                endColumn: usage.span.endColumn,
            });
        }
    }

    return {
        labels,
        references,
        environments,
        diagnostics,
    };
}
