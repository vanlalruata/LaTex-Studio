export type EquationInsertMode =
    | 'inline'
    | 'inline_parens'
    | 'display'
    | 'equation'
    | 'equation_star'
    | 'align';

export interface EquationValidationIssue {
    severity: 'error' | 'warning';
    message: string;
}

export interface EquationValidationResult {
    valid: boolean;
    issues: EquationValidationIssue[];
    requiredPackages: string[];
}

const MAX_EXPRESSION_LENGTH = 50000;

export function detectEquationPackages(latex: string): string[] {
    const packages = new Set<string>();

    if (
        /\\(begin\{(align|aligned|gather|gathered|multline|cases|pmatrix|bmatrix|Bmatrix|vmatrix|Vmatrix|split)\}|text|operatorname|boldsymbol|xrightarrow|boxed)/.test(
            latex,
        )
    ) {
        packages.add('amsmath');
    }
    if (/\\(mathbb|mathfrak|therefore|because|nexists|varnothing)/.test(latex)) {
        packages.add('amssymb');
    }
    if (/\\bm\b/.test(latex)) {
        packages.add('bm');
    }
    if (/\\coloneqq\b/.test(latex)) {
        packages.add('mathtools');
    }
    if (/\\ce\s*\{/.test(latex)) {
        packages.add('mhchem');
    }
    if (/\\SI\s*\{|\\si\s*\{/.test(latex)) {
        packages.add('siunitx');
    }

    return [...packages].sort();
}

export function validateEquationLatex(latex: string): EquationValidationResult {
    const issues: EquationValidationIssue[] = [];
    const trimmed = latex.trim();

    if (trimmed.length === 0) {
        issues.push({ severity: 'warning', message: 'Expression is empty.' });
        return { valid: false, issues, requiredPackages: [] };
    }

    if (trimmed.length > MAX_EXPRESSION_LENGTH) {
        issues.push({
            severity: 'error',
            message: `Expression exceeds maximum length (${MAX_EXPRESSION_LENGTH} characters).`,
        });
        return { valid: false, issues, requiredPackages: detectEquationPackages(trimmed) };
    }

    // Check balanced braces
    let braceDepth = 0;
    for (let i = 0; i < trimmed.length; i++) {
        const ch = trimmed[i];
        const prev = i > 0 ? trimmed[i - 1] : '';
        if (ch === '{' && prev !== '\\') {
            braceDepth++;
        } else if (ch === '}' && prev !== '\\') {
            braceDepth--;
            if (braceDepth < 0) {
                issues.push({ severity: 'error', message: 'Unmatched closing brace "}".' });
                break;
            }
        }
    }
    if (braceDepth > 0) {
        issues.push({ severity: 'error', message: `Missing ${braceDepth} closing brace(s) "}".` });
    }

    // Check \left and \right balance
    const leftCount = trimmed.match(/\\left\b/g)?.length ?? 0;
    const rightCount = trimmed.match(/\\right\b/g)?.length ?? 0;
    if (leftCount !== rightCount) {
        issues.push({
            severity: 'error',
            message: `Mismatched \\left (${leftCount}) and \\right (${rightCount}) delimiters.`,
        });
    }

    // Check \begin{env}...\end{env} stack
    const envRegex = /\\(begin|end)\{([a-zA-Z*]+)\}/g;
    const stack: string[] = [];
    let m: RegExpExecArray | null;
    while ((m = envRegex.exec(trimmed)) !== null) {
        if (m[1] === 'begin') {
            stack.push(m[2]);
        } else {
            const top = stack.pop();
            if (top !== m[2]) {
                issues.push({
                    severity: 'error',
                    message: top
                        ? `Mismatched environment: expected \\end{${top}}, found \\end{${m[2]}}. `
                        : `Unexpected \\end{${m[2]}} without matching \\begin.`,
                });
                break;
            }
        }
    }
    if (stack.length > 0) {
        issues.push({
            severity: 'error',
            message: `Unclosed environment(s): ${stack.join(', ')}.`,
        });
    }

    return {
        valid: !issues.some((i) => i.severity === 'error'),
        issues,
        requiredPackages: detectEquationPackages(trimmed),
    };
}

export function wrapEquationForInsertion(
    latex: string,
    mode: EquationInsertMode,
    label = '',
): string {
    const clean = latex.trim();
    const cleanLabel = label.trim();
    const labelLine = cleanLabel ? `  \\label{${cleanLabel}}\n` : '';

    switch (mode) {
        case 'inline':
            return `$${clean}$`;
        case 'inline_parens':
            return `\\(${clean}\\)`;
        case 'display':
            return `\\[\n  ${clean}\n\\]`;
        case 'equation':
            if (clean.startsWith('\\begin{equation')) {
                return clean;
            }
            return `\\begin{equation}\n${labelLine}  ${clean}\n\\end{equation}`;
        case 'equation_star':
            return `\\begin{equation*}\n  ${clean}\n\\end{equation*}`;
        case 'align':
            if (clean.startsWith('\\begin{align')) {
                return clean;
            }
            return `\\begin{align}\n${labelLine}  ${clean}\n\\end{align}`;
    }
}
