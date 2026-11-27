export type MathAstNodeType =
    | 'Root'
    | 'Symbol'
    | 'Identifier'
    | 'Number'
    | 'Text'
    | 'Operator'
    | 'Relation'
    | 'Fraction'
    | 'Sqrt'
    | 'Superscript'
    | 'Subscript'
    | 'Accent'
    | 'Delimiter'
    | 'Matrix'
    | 'Cases'
    | 'AlignedGroup'
    | 'Environment'
    | 'Label'
    | 'Tag'
    | 'ProtectedLatex';

export interface MathAstNode {
    id: string;
    type: MathAstNodeType;
    label: string;
    raw: string;
    span: { start: number; end: number };
    children: MathAstNode[];
}

export interface MathParseResult {
    ok: boolean;
    mode: 'structured' | 'hybrid' | 'source';
    confidence: number;
    root: MathAstNode;
    protectedSegments: string[];
}

const KNOWN_COMMANDS = new Set([
    'frac', 'dfrac', 'tfrac', 'sqrt', 'hat', 'widehat', 'tilde', 'widetilde',
    'bar', 'overline', 'underline', 'vec', 'dot', 'ddot', 'boldsymbol', 'bm',
    'mathbf', 'mathbb', 'mathcal', 'mathfrak', 'mathrm', 'mathit', 'mathsf',
    'operatorname', 'text', 'textbf', 'textit', 'left', 'right', 'begin', 'end',
    'label', 'tag', 'nonumber', 'notag', 'arg', 'min', 'max', 'sup', 'inf',
    'lim', 'sum', 'prod', 'int', 'iint', 'oint', 'partial', 'nabla', 'infty',
    'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'varepsilon', 'zeta', 'eta',
    'theta', 'vartheta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'pi',
    'rho', 'sigma', 'tau', 'upsilon', 'phi', 'varphi', 'chi', 'psi', 'omega',
    'Gamma', 'Delta', 'Theta', 'Lambda', 'Xi', 'Pi', 'Sigma', 'Phi', 'Psi', 'Omega',
    'pm', 'mp', 'times', 'div', 'cdot', 'ast', 'circ', 'oplus', 'otimes', 'odot',
    'neq', 'approx', 'equiv', 'cong', 'sim', 'propto', 'leq', 'geq', 'll', 'gg',
    'to', 'leftarrow', 'rightarrow', 'leftrightarrow', 'Rightarrow', 'Leftarrow',
    'iff', 'mapsto', 'in', 'notin', 'subset', 'subseteq', 'cup', 'cap', 'emptyset',
    'forall', 'exists', 'neg', 'land', 'lor', 'therefore', 'because', 'langle', 'rangle',
    'mid', 'parallel', 'perp', 'sin', 'cos', 'tan', 'log', 'ln', 'exp', 'det',
    'cdots', 'ldots', 'vdots', 'ddots', 'boxed', 'binom',
]);

let nodeCounter = 1;
function makeAstId(): string {
    nodeCounter += 1;
    return `ast_${nodeCounter}`;
}

function readBraced(input: string, pos: number): { content: string; end: number } | null {
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
                return { content: input.slice(pos + 1, i), end: i + 1 };
            }
        }
    }
    return null;
}

export function parseLatexToAst(source: string): MathParseResult {
    const trimmed = source.trim();
    const protectedSegments: string[] = [];
    const children: MathAstNode[] = [];

    if (!trimmed) {
        return {
            ok: true,
            mode: 'structured',
            confidence: 1,
            root: {
                id: makeAstId(),
                type: 'Root',
                label: 'Empty Expression',
                raw: '',
                span: { start: 0, end: 0 },
                children: [],
            },
            protectedSegments: [],
        };
    }

    let i = 0;
    let unbalanced = false;

    while (i < trimmed.length) {
        const ch = trimmed[i];
        if (/\s/.test(ch)) {
            i++;
            continue;
        }

        if (ch === '%' ) {
            const nl = trimmed.indexOf('\n', i);
            const end = nl === -1 ? trimmed.length : nl;
            const raw = trimmed.slice(i, end);
            protectedSegments.push(raw);
            children.push({
                id: makeAstId(),
                type: 'ProtectedLatex',
                label: 'Comment',
                raw,
                span: { start: i, end },
                children: [],
            });
            i = end;
            continue;
        }

        if (ch === '\\') {
            if (trimmed.slice(i).startsWith('\\begin{')) {
                const envMatch = /^\\begin\{([a-zA-Z*]+)\}/.exec(trimmed.slice(i));
                if (envMatch) {
                    const env = envMatch[1];
                    const endTag = `\\end{${env}}`;
                    const closeIdx = trimmed.indexOf(endTag, i + envMatch[0].length);
                    if (closeIdx === -1) {
                        unbalanced = true;
                        break;
                    }
                    const end = closeIdx + endTag.length;
                    const inner = trimmed.slice(i + envMatch[0].length, closeIdx);
                    const type: MathAstNodeType = env.endsWith('matrix')
                        ? 'Matrix'
                        : env === 'cases'
                          ? 'Cases'
                          : env.startsWith('align') || env.startsWith('gather') || env.startsWith('multline') || env === 'split'
                            ? 'AlignedGroup'
                            : 'Environment';

                    const innerParsed = parseLatexToAst(inner);
                    protectedSegments.push(...innerParsed.protectedSegments);
                    children.push({
                        id: makeAstId(),
                        type,
                        label: `\\begin{${env}}`,
                        raw: trimmed.slice(i, end),
                        span: { start: i, end },
                        children: innerParsed.root.children,
                    });
                    i = end;
                    continue;
                }
            }

            const cmdMatch = /^\\([a-zA-Z]+|.)/.exec(trimmed.slice(i));
            if (cmdMatch) {
                const cmdName = cmdMatch[1];
                let end = i + cmdMatch[0].length;

                if (cmdName === 'frac' || cmdName === 'dfrac' || cmdName === 'tfrac' || cmdName === 'binom') {
                    while (end < trimmed.length && /\s/.test(trimmed[end])) end++;
                    const num = readBraced(trimmed, end);
                    if (num) {
                        end = num.end;
                        while (end < trimmed.length && /\s/.test(trimmed[end])) end++;
                        const den = readBraced(trimmed, end);
                        if (den) {
                            end = den.end;
                            const numAst = parseLatexToAst(num.content);
                            const denAst = parseLatexToAst(den.content);
                            protectedSegments.push(...numAst.protectedSegments, ...denAst.protectedSegments);
                            children.push({
                                id: makeAstId(),
                                type: cmdName === 'binom' ? 'Delimiter' : 'Fraction',
                                label: `\\${cmdName}`,
                                raw: trimmed.slice(i, end),
                                span: { start: i, end },
                                children: [numAst.root, denAst.root],
                            });
                            i = end;
                            continue;
                        }
                    }
                }

                if (cmdName === 'label' || cmdName === 'tag') {
                    const arg = readBraced(trimmed, end);
                    if (arg) {
                        end = arg.end;
                        children.push({
                            id: makeAstId(),
                            type: cmdName === 'label' ? 'Label' : 'Tag',
                            label: `\\${cmdName}{${arg.content}}`,
                            raw: trimmed.slice(i, end),
                            span: { start: i, end },
                            children: [],
                        });
                        i = end;
                        continue;
                    }
                }

                if (cmdName === 'sqrt' || cmdName === 'hat' || cmdName === 'vec' || cmdName === 'bar' || cmdName === 'tilde') {
                    while (end < trimmed.length && /\s/.test(trimmed[end])) end++;
                    const arg = readBraced(trimmed, end);
                    if (arg) {
                        end = arg.end;
                        const innerAst = parseLatexToAst(arg.content);
                        protectedSegments.push(...innerAst.protectedSegments);
                        children.push({
                            id: makeAstId(),
                            type: cmdName === 'sqrt' ? 'Sqrt' : 'Accent',
                            label: `\\${cmdName}`,
                            raw: trimmed.slice(i, end),
                            span: { start: i, end },
                            children: innerAst.root.children,
                        });
                        i = end;
                        continue;
                    }
                }

                if (!KNOWN_COMMANDS.has(cmdName) && /^[a-zA-Z]+$/.test(cmdName)) {
                    const raw = trimmed.slice(i, end);
                    protectedSegments.push(raw);
                    children.push({
                        id: makeAstId(),
                        type: 'ProtectedLatex',
                        label: `Protected: ${raw}`,
                        raw,
                        span: { start: i, end },
                        children: [],
                    });
                    i = end;
                    continue;
                }

                children.push({
                    id: makeAstId(),
                    type: 'Symbol',
                    label: `\\${cmdName}`,
                    raw: trimmed.slice(i, end),
                    span: { start: i, end },
                    children: [],
                });
                i = end;
                continue;
            }
        }

        if (ch === '^' || ch === '_') {
            let end = i + 1;
            let content = '';
            if (trimmed[end] === '{') {
                const brace = readBraced(trimmed, end);
                if (!brace) {
                    unbalanced = true;
                    break;
                }
                content = brace.content;
                end = brace.end;
            } else if (end < trimmed.length) {
                content = trimmed[end];
                end++;
            }
            const innerAst = parseLatexToAst(content);
            protectedSegments.push(...innerAst.protectedSegments);
            children.push({
                id: makeAstId(),
                type: ch === '^' ? 'Superscript' : 'Subscript',
                label: ch === '^' ? 'Superscript' : 'Subscript',
                raw: trimmed.slice(i, end),
                span: { start: i, end },
                children: innerAst.root.children,
            });
            i = end;
            continue;
        }

        if (ch === '{') {
            const brace = readBraced(trimmed, i);
            if (!brace) {
                unbalanced = true;
                break;
            }
            const innerAst = parseLatexToAst(brace.content);
            protectedSegments.push(...innerAst.protectedSegments);
            children.push(...innerAst.root.children);
            i = brace.end;
            continue;
        }

        if (/[0-9]/.test(ch)) {
            const numMatch = /^[0-9]+(?:\.[0-9]+)?/.exec(trimmed.slice(i));
            const raw = numMatch ? numMatch[0] : ch;
            children.push({
                id: makeAstId(),
                type: 'Number',
                label: raw,
                raw,
                span: { start: i, end: i + raw.length },
                children: [],
            });
            i += raw.length;
            continue;
        }

        if (/[a-zA-Z]/.test(ch)) {
            children.push({
                id: makeAstId(),
                type: 'Identifier',
                label: ch,
                raw: ch,
                span: { start: i, end: i + 1 },
                children: [],
            });
            i++;
            continue;
        }

        const opType: MathAstNodeType = ['=', '<', '>'].includes(ch) ? 'Relation' : 'Operator';
        children.push({
            id: makeAstId(),
            type: opType,
            label: ch,
            raw: ch,
            span: { start: i, end: i + 1 },
            children: [],
        });
        i++;
    }

    if (unbalanced) {
        return {
            ok: false,
            mode: 'source',
            confidence: 0,
            root: {
                id: makeAstId(),
                type: 'Root',
                label: 'Source Mode (Unbalanced)',
                raw: trimmed,
                span: { start: 0, end: trimmed.length },
                children: [],
            },
            protectedSegments: [trimmed],
        };
    }

    const mode = protectedSegments.length > 0 ? 'hybrid' : 'structured';
    return {
        ok: true,
        mode,
        confidence: mode === 'structured' ? 1 : 0.75,
        root: {
            id: makeAstId(),
            type: 'Root',
            label: 'Equation Root',
            raw: trimmed,
            span: { start: 0, end: trimmed.length },
            children,
        },
        protectedSegments,
    };
}

export function toSpokenMathText(latex: string): string {
    return latex
        .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, 'fraction $1 over $2')
        .replace(/\\sqrt\{([^{}]+)\}/g, 'square root of $1')
        .replace(/\\sum_\{([^{}]+)\}\^\{([^{}]+)\}/g, 'sum from $1 to $2 of')
        .replace(/\\int_\{([^{}]+)\}\^\{([^{}]+)\}/g, 'integral from $1 to $2 of')
        .replace(/\\partial/g, 'partial')
        .replace(/\\theta/g, 'theta')
        .replace(/\\alpha/g, 'alpha')
        .replace(/\\beta/g, 'beta')
        .replace(/\\lambda/g, 'lambda')
        .replace(/\\infty/g, 'infinity')
        .replace(/\\to/g, 'approaches')
        .replace(/\\leq/g, 'less than or equal to')
        .replace(/\\geq/g, 'greater than or equal to')
        .replace(/\\neq/g, 'not equal to')
        .replace(/\\pm/g, 'plus or minus')
        .replace(/\\cdot/g, 'times')
        .replace(/\\times/g, 'times')
        .replace(/[\\{}]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}
