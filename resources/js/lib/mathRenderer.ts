/**
 * Unified Mathematical Typesetting Engine
 * Renders LaTeX formulas into:
 * 1. Rich MathML HTML with styling for browser-native typeset math (fractions, square roots, integrals, summations, matrices)
 * 2. High-fidelity SVG rendering for pure graphical visual representation (matching Overleaf hover preview)
 * 3. Text/Unicode fallback
 */

const GREEK_AND_SYMBOLS: Record<string, string> = {
    '\\alpha': 'α', '\\beta': 'β', '\\gamma': 'γ', '\\delta': 'δ', '\\epsilon': 'ε', '\\varepsilon': 'ε',
    '\\zeta': 'ζ', '\\eta': 'η', '\\theta': 'θ', '\\vartheta': 'ϑ', '\\iota': 'ι', '\\kappa': 'κ',
    '\\lambda': 'λ', '\\mu': 'μ', '\\nu': 'ν', '\\xi': 'ξ', '\\pi': 'π', '\\varpi': 'ϖ',
    '\\rho': 'ρ', '\\varrho': 'ϱ', '\\sigma': 'σ', '\\varsigma': 'ς', '\\tau': 'τ', '\\upsilon': 'υ',
    '\\phi': 'ϕ', '\\varphi': 'φ', '\\chi': 'χ', '\\psi': 'ψ', '\\omega': 'ω',
    '\\Gamma': 'Γ', '\\Delta': 'Δ', '\\Theta': 'Θ', '\\Lambda': 'Λ', '\\Xi': 'Ξ',
    '\\Pi': 'Π', '\\Sigma': 'Σ', '\\Upsilon': 'Υ', '\\Phi': 'Φ', '\\Psi': 'Ψ', '\\Omega': 'Ω',
    '\\sum': '∑', '\\prod': '∏', '\\coprod': '∐', '\\int': '∫', '\\iint': '∬', '\\iiint': '∭', '\\oint': '∮',
    '\\partial': '∂', '\\nabla': '∇', '\\infty': '∞', '\\emptyset': '∅',
    '\\pm': '±', '\\mp': '∓', '\\times': '×', '\\div': '÷', '\\cdot': '·', '\\circ': '∘',
    '\\leq': '≤', '\\geq': '≥', '\\neq': '≠', '\\ll': '≪', '\\gg': '≫',
    '\\approx': '≈', '\\equiv': '≡', '\\sim': '∼', '\\simeq': '≃', '\\cong': '≅', '\\propto': '∝',
    '\\in': '∈', '\\notin': '∉', '\\ni': '∋', '\\subset': '⊂', '\\supset': '⊃', '\\subseteq': '⊆', '\\supseteq': '⊇',
    '\\cap': '∩', '\\cup': '∪', '\\setminus': '∖',
    '\\land': '∧', '\\lor': '∨', '\\lnot': '¬',
    '\\forall': '∀', '\\exists': '∃', '\\nexists': '∄', '\\neg': '¬', '\\perp': '⊥', '\\parallel': '∥',
    '\\mid': '∣', '\\nmid': '∤', '\\vert': '|', '\\Vert': '‖',
    '\\rightarrow': '→', '\\to': '→', '\\leftarrow': '←', '\\uparrow': '↑', '\\downarrow': '↓', '\\leftrightarrow': '↔',
    '\\Rightarrow': '⇒', '\\Leftarrow': '⇐', '\\Leftrightarrow': '⇔', '\\mapsto': '↦',
    '\\prime': '′',
    '\\ell': 'ℓ', '\\hbar': 'ℏ', '\\imath': 'ı', '\\jmath': 'ȷ',
    '\\Re': 'ℜ', '\\Im': 'ℑ', '\\wp': '℘', '\\aleph': 'ℵ',
    '\\langle': '⟨', '\\rangle': '⟩', '\\lceil': '⌈', '\\rceil': '⌉', '\\lfloor': '⌊', '\\rfloor': '⌋',
    '\\oplus': '⊕', '\\otimes': '⊗', '\\odot': '⊙', '\\dagger': '†', '\\ddagger': '‡',
    '\\square': '□', '\\blacksquare': '■', '\\triangle': '△', '\\angle': '∠', '\\degree': '°',
    '\\implies': '⟹', '\\impliedby': '⟸', '\\iff': '⟺', '\\longrightarrow': '⟶', '\\longleftarrow': '⟵',
    '\\dots': '…', '\\cdots': '⋯', '\\vdots': '⋮', '\\ddots': '⋱',
    '\\{': '{', '\\}': '}', '\\left\\{': '{', '\\right\\}': '}', '\\left': '', '\\right': '',
    '\\min': 'min', '\\max': 'max', '\\inf': 'inf', '\\sup': 'sup', '\\lim': 'lim',
    '\\liminf': 'lim inf', '\\limsup': 'lim sup',
    '\\log': 'log', '\\ln': 'ln', '\\lg': 'lg', '\\exp': 'exp',
    '\\sin': 'sin', '\\cos': 'cos', '\\tan': 'tan', '\\sec': 'sec', '\\csc': 'csc', '\\cot': 'cot',
    '\\sinh': 'sinh', '\\cosh': 'cosh', '\\tanh': 'tanh',
    '\\arcsin': 'arcsin', '\\arccos': 'arccos', '\\arctan': 'arctan',
    '\\arg': 'arg', '\\det': 'det', '\\dim': 'dim', '\\gcd': 'gcd', '\\hom': 'hom', '\\ker': 'ker',
    '\\Pr': 'Pr', '\\deg': 'deg', '\\bmod': 'mod',
};

const UPRIGHT_FUNCTIONS = new Set([
    '\\log', '\\ln', '\\lg', '\\exp',
    '\\sin', '\\cos', '\\tan', '\\sec', '\\csc', '\\cot',
    '\\sinh', '\\cosh', '\\tanh', '\\arcsin', '\\arccos', '\\arctan',
    '\\arg', '\\det', '\\dim', '\\gcd', '\\hom', '\\ker', '\\Pr', '\\deg', '\\bmod',
]);

function escapeXml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

const SUB_DIGITS: Record<string, string> = {
    '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
    '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
    '+': '₊', '-': '₋', '=': '₌', '(': '₍', ')': '₎',
    'a': 'ₐ', 'e': 'ₑ', 'h': 'ₕ', 'i': 'ᵢ', 'j': 'ⱼ', 'k': 'ₖ', 'l': 'ₗ',
    'm': 'ₘ', 'n': 'ₙ', 'o': 'ₒ', 'p': 'ₚ', 'r': 'ᵣ', 's': 'ₛ', 't': 'ₜ', 'u': 'ᵤ', 'v': 'ᵥ', 'x': 'ₓ'
};

const SUPER_DIGITS: Record<string, string> = {
    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
    '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
    '+': '⁺', '-': '⁻', '=': '⁼', '(': '⁽', ')': '⁾',
    'n': 'ⁿ', 'i': 'ⁱ', 'M': 'ᴹ', 'N': 'ᴺ', 'T': 'ᵀ', 'k': 'ᵏ', 'm': 'ᵐ'
};

function extractBalancedBraces(str: string, startIndex: number): { content: string; endIndex: number } | null {
    if (str[startIndex] !== '{') return null;
    let depth = 0;
    for (let i = startIndex; i < str.length; i++) {
        if (str[i] === '{') depth++;
        else if (str[i] === '}') {
            depth--;
            if (depth === 0) {
                return { content: str.slice(startIndex + 1, i), endIndex: i };
            }
        }
    }
    return null;
}

function extractBracketAndBraces(str: string, startIndex: number): { opt: string | null; arg: string; endIndex: number } | null {
    let idx = startIndex;
    let opt: string | null = null;
    if (str[idx] === '[') {
        const closeBracket = str.indexOf(']', idx);
        if (closeBracket !== -1) {
            opt = str.slice(idx + 1, closeBracket);
            idx = closeBracket + 1;
        }
    }
    while (idx < str.length && /\s/.test(str[idx])) idx++;
    const brace = extractBalancedBraces(str, idx);
    if (!brace) return null;
    return { opt, arg: brace.content, endIndex: brace.endIndex };
}

/**
 * Converts LaTeX math code into clean MathML with HTML semantic presentation.
 * Modern browsers (Chrome 109+, Firefox, Safari, Edge) render MathML natively
 * with authentic mathematical fractions, radicals, limits, and fonts.
 */
export function latexToMathML(latex: string, isBlock = true): string {
    let clean = latex.trim();
    clean = clean.replace(/^\$\$([\s\S]*)\$\$$/, '$1');
    clean = clean.replace(/^\$([\s\S]*)\$$/, '$1');
    clean = clean.replace(/^\\\[([\s\S]*)\\\]$/, '$1');
    clean = clean.replace(/^\\\(([\s\S]*)\\\)$/, '$1');
    clean = clean.replace(/\\label\{[^{}]*\}/g, '');
    clean = clean.replace(/\\tag\*?\{[^{}]*\}/g, '');
    clean = clean.replace(/\\(nonumber|notag)\b/g, '');
    clean = clean.replace(/\\begin\{(equation\*?|gather\*?|multline\*?|flalign\*?|eqnarray\*?|split)\}/g, '');
    clean = clean.replace(/\\end\{(equation\*?|gather\*?|multline\*?|flalign\*?|eqnarray\*?|split)\}/g, '');

    const findLastTag = (str: string): { start: number; fullTag: string } | null => {
        const s = str.trimEnd();
        if (!s.endsWith('>')) return null;
        const lastClose = s.lastIndexOf('</');
        if (lastClose === -1) return null;
        const tagMatch = /^<\/([a-zA-Z0-9]+)>/.exec(s.slice(lastClose));
        if (!tagMatch) return null;
        const tagName = tagMatch[1];

        let depth = 0;
        for (let pos = s.length - 1; pos >= 0; pos--) {
            if (s.slice(pos).startsWith(`</${tagName}>`)) {
                depth++;
            } else if (new RegExp(`^<${tagName}(?:\\s[^>]*)?>`).test(s.slice(pos))) {
                depth--;
                if (depth === 0) {
                    return { start: pos, fullTag: s.slice(pos) };
                }
            }
        }
        return null;
    };

    const extractBalancedLeftRight = (str: string, startIdx: number): { openDelim: string; closeDelim: string; content: string; endIndex: number } | null => {
        if (!str.startsWith('\\left', startIdx)) return null;
        let afterLeft = startIdx + 5;
        while (afterLeft < str.length && /\s/.test(str[afterLeft])) afterLeft++;
        let openDelim = '';
        let contentStart = afterLeft;
        if (str[afterLeft] === '\\') {
            const m = /^\\[a-zA-Z{}|]+/.exec(str.slice(afterLeft));
            if (m) {
                openDelim = m[0];
                contentStart = afterLeft + m[0].length;
            }
        } else {
            openDelim = str[afterLeft] || '';
            contentStart = afterLeft + 1;
        }

        let depth = 1;
        let pos = contentStart;
        while (pos < str.length) {
            if (str.startsWith('\\left', pos)) {
                depth++;
                pos += 5;
            } else if (str.startsWith('\\right', pos)) {
                depth--;
                if (depth === 0) {
                    let afterRight = pos + 6;
                    while (afterRight < str.length && /\s/.test(str[afterRight])) afterRight++;
                    let closeDelim = '';
                    let endIdx = afterRight;
                    if (str[afterRight] === '\\') {
                        const m = /^\\[a-zA-Z{}|]+/.exec(str.slice(afterRight));
                        if (m) {
                            closeDelim = m[0];
                            endIdx = afterRight + m[0].length;
                        }
                    } else {
                        closeDelim = str[afterRight] || '';
                        endIdx = afterRight + 1;
                    }
                    return {
                        openDelim,
                        closeDelim,
                        content: str.slice(contentStart, pos),
                        endIndex: endIdx
                    };
                }
                pos += 6;
            } else {
                pos++;
            }
        }
        return null;
    };

    const convertTokens = (input: string): string => {
        let out = '';
        let i = 0;

        while (i < input.length) {
            if (/\s/.test(input[i])) {
                out += ' ';
                i++;
                continue;
            }

            // \left ... \right dynamic stretchy delimiters
            if (input.startsWith('\\left', i)) {
                const lrMatch = extractBalancedLeftRight(input, i);
                if (lrMatch) {
                    const innerML = convertTokens(lrMatch.content);
                    const mapDelim = (d: string): string => {
                        if (d === '\\{' || d === '{') return '{';
                        if (d === '\\}' || d === '}') return '}';
                        if (d === '\\[' || d === '[') return '[';
                        if (d === '\\]' || d === ']') return ']';
                        if (d === '\\(' || d === '(') return '(';
                        if (d === '\\)' || d === ')') return ')';
                        if (d === '\\vert' || d === '|') return '|';
                        if (d === '\\Vert' || d === '\\|') return '‖';
                        if (d === '.') return ''; // invisible delimiter
                        return d;
                    };
                    const oSym = mapDelim(lrMatch.openDelim);
                    const cSym = mapDelim(lrMatch.closeDelim);

                    const openMo = oSym ? `<mo fence="true" stretchy="true" style="font-size: 1.25em; line-height: 1; vertical-align: -0.1em;">${oSym}</mo>` : '';
                    const closeMo = cSym ? `<mo fence="true" stretchy="true" style="font-size: 1.25em; line-height: 1; vertical-align: -0.1em;">${cSym}</mo>` : '';

                    out += `<mrow>${openMo}<mrow>${innerML}</mrow>${closeMo}</mrow>`;
                    i = lrMatch.endIndex;
                    continue;
                }
            }

            // \sqrt
            if (input.startsWith('\\sqrt', i)) {
                const afterCmd = i + 5;
                const match = extractBracketAndBraces(input, afterCmd);
                if (match) {
                    const innerMathML = convertTokens(match.arg);
                    if (match.opt) {
                        const rootDegMathML = convertTokens(match.opt);
                        out += `<mroot><mrow>${innerMathML}</mrow><mrow>${rootDegMathML}</mrow></mroot>`;
                    } else {
                        out += `<msqrt><mrow>${innerMathML}</mrow></msqrt>`;
                    }
                    i = match.endIndex + 1;
                    continue;
                }
            }

            // \frac, \dfrac, \tfrac
            const fracCmdMatch = /^\\(d|t)?frac\b/.exec(input.slice(i));
            if (fracCmdMatch) {
                let afterCmd = i + fracCmdMatch[0].length;
                while (afterCmd < input.length && /\s/.test(input[afterCmd])) afterCmd++;
                const num = extractBalancedBraces(input, afterCmd);
                if (num) {
                    let afterNum = num.endIndex + 1;
                    while (afterNum < input.length && /\s/.test(input[afterNum])) afterNum++;
                    const den = extractBalancedBraces(input, afterNum);
                    if (den) {
                        const numMathML = convertTokens(num.content);
                        const denMathML = convertTokens(den.content);
                        out += `<mfrac><mrow>${numMathML}</mrow><mrow>${denMathML}</mrow></mfrac>`;
                        i = den.endIndex + 1;
                        continue;
                    }
                }
            }

            // \binom, \dbinom, \tbinom
            const binomCmdMatch = /^\\(d|t)?binom\b/.exec(input.slice(i));
            if (binomCmdMatch) {
                let afterCmd = i + binomCmdMatch[0].length;
                while (afterCmd < input.length && /\s/.test(input[afterCmd])) afterCmd++;
                const top = extractBalancedBraces(input, afterCmd);
                if (top) {
                    let afterTop = top.endIndex + 1;
                    while (afterTop < input.length && /\s/.test(input[afterTop])) afterTop++;
                    const bot = extractBalancedBraces(input, afterTop);
                    if (bot) {
                        out += `<mrow><mo fence="true" stretchy="true">(</mo><mfrac linethickness="0"><mrow>${convertTokens(top.content)}</mrow><mrow>${convertTokens(bot.content)}</mrow></mfrac><mo fence="true" stretchy="true">)</mo></mrow>`;
                        i = bot.endIndex + 1;
                        continue;
                    }
                }
            }

            // \overset, \underset, \stackrel
            const stackCmdMatch = /^\\(overset|underset|stackrel)\b/.exec(input.slice(i));
            if (stackCmdMatch) {
                const kind = stackCmdMatch[1];
                let afterCmd = i + stackCmdMatch[0].length;
                while (afterCmd < input.length && /\s/.test(input[afterCmd])) afterCmd++;
                const firstArg = extractBalancedBraces(input, afterCmd);
                if (firstArg) {
                    let afterFirst = firstArg.endIndex + 1;
                    while (afterFirst < input.length && /\s/.test(input[afterFirst])) afterFirst++;
                    const secondArg = extractBalancedBraces(input, afterFirst);
                    if (secondArg) {
                        const tag = kind === 'underset' ? 'munder' : 'mover';
                        out += `<${tag}><mrow>${convertTokens(secondArg.content)}</mrow><mrow style="font-size: 0.75em;">${convertTokens(firstArg.content)}</mrow></${tag}>`;
                        i = secondArg.endIndex + 1;
                        continue;
                    }
                }
            }

            // \boxed{...}
            if (input.startsWith('\\boxed', i)) {
                let afterCmd = i + 6;
                while (afterCmd < input.length && /\s/.test(input[afterCmd])) afterCmd++;
                const brace = extractBalancedBraces(input, afterCmd);
                if (brace) {
                    out += `<mrow style="border: 1px solid currentColor; padding: 0.15em 0.35em; border-radius: 2px;">${convertTokens(brace.content)}</mrow>`;
                    i = brace.endIndex + 1;
                    continue;
                }
            }

            // Matrices
            if (input.startsWith('\\begin{', i)) {
                const endEnvIdx = input.indexOf('}', i + 7);
                if (endEnvIdx !== -1) {
                    const env = input.slice(i + 7, endEnvIdx);
                    if (env.endsWith('matrix')) {
                        const closeTag = `\\end{${env}}`;
                        const closeIdx = input.indexOf(closeTag, endEnvIdx + 1);
                        if (closeIdx !== -1) {
                            const matrixContent = input.slice(endEnvIdx + 1, closeIdx);
                            const rows = matrixContent.trim().split('\\\\');
                            let tableRows = '';
                            for (const row of rows) {
                                if (!row.trim()) continue;
                                const cells = row.split('&');
                                let rowMathML = '<mtr>';
                                for (const cell of cells) {
                                    rowMathML += `<mtd><mrow>${convertTokens(cell.trim())}</mrow></mtd>`;
                                }
                                rowMathML += '</mtr>';
                                tableRows += rowMathML;
                            }
                            let openFmt = '';
                            let closeFmt = '';
                            if (env === 'pmatrix') {
                                openFmt = '(';
                                closeFmt = ')';
                            } else if (env === 'bmatrix') {
                                openFmt = '[';
                                closeFmt = ']';
                            } else if (env === 'Bmatrix') {
                                openFmt = '{';
                                closeFmt = '}';
                            } else if (env === 'vmatrix') {
                                openFmt = '|';
                                closeFmt = '|';
                            } else if (env === 'Vmatrix') {
                                openFmt = '‖';
                                closeFmt = '‖';
                            }
                            if (openFmt || closeFmt) {
                                out += `<mrow><mo fence="true" stretchy="true">${openFmt}</mo><mtable>${tableRows}</mtable><mo fence="true" stretchy="true">${closeFmt}</mo></mrow>`;
                            } else {
                                out += `<mtable>${tableRows}</mtable>`;
                            }
                            i = closeIdx + closeTag.length;
                            continue;
                        }
                    } else if (env === 'cases') {
                        const closeTag = '\\end{cases}';
                        const closeIdx = input.indexOf(closeTag, endEnvIdx + 1);
                        if (closeIdx !== -1) {
                            const casesContent = input.slice(endEnvIdx + 1, closeIdx);
                            const rows = casesContent.trim().split('\\\\');
                            let tableRows = '';
                            for (const row of rows) {
                                if (!row.trim()) continue;
                                const parts = row.split('&');
                                tableRows += `<mtr><mtd style="text-align: left;"><mrow>${convertTokens(parts[0]?.trim() || '')}</mrow></mtd>`;
                                if (parts.length > 1) {
                                    tableRows += `<mtd style="text-align: left; padding-left: 1em;"><mrow><mtext>&nbsp;if&nbsp;</mtext>${convertTokens(parts.slice(1).join('&').trim())}</mrow></mtd>`;
                                }
                                tableRows += '</mtr>';
                            }
                            const rowCount = rows.filter(r => r.trim()).length;
                            const braceScaleY = Math.max(2.0, rowCount * 1.35);
                            out += `<mrow style="align-items: stretch;"><mo fence="true" stretchy="true" style="display: inline-block; transform: scaleY(${braceScaleY}); transform-origin: center; font-weight: 200; font-family: 'Cambria Math', 'STIX Two Math', 'Times New Roman', serif; padding-right: 0.35em; line-height: 1;">{</mo><mtable style="row-gap: 0.3em;">${tableRows}</mtable></mrow>`;
                            i = closeIdx + closeTag.length;
                            continue;
                        }
                    } else if (
                        env === 'aligned' ||
                        env === 'align' ||
                        env === 'align*' ||
                        env === 'flalign' ||
                        env === 'flalign*' ||
                        env === 'eqnarray' ||
                        env === 'eqnarray*' ||
                        env === 'split'
                    ) {
                        const closeTag = `\\end{${env}}`;
                        const closeIdx = input.indexOf(closeTag, endEnvIdx + 1);
                        if (closeIdx !== -1) {
                            const alignContent = input.slice(endEnvIdx + 1, closeIdx);
                            const rows = alignContent.trim().split('\\\\');
                            let tableRows = '';
                            for (const row of rows) {
                                if (!row.trim()) continue;
                                const parts = row.split('&');
                                let rowMathML = '<mtr>';
                                for (let pIdx = 0; pIdx < parts.length; pIdx++) {
                                    const part = parts[pIdx].trim();
                                    const alignStyle = pIdx % 2 === 0 ? 'text-align: right;' : 'text-align: left; padding-left: 0.15em;';
                                    rowMathML += `<mtd style="${alignStyle} padding-top: 0.25em; padding-bottom: 0.25em;"><mrow>${convertTokens(part)}</mrow></mtd>`;
                                }
                                rowMathML += '</mtr>';
                                tableRows += rowMathML;
                            }
                            out += `<mtable style="row-gap: 0.4em;">${tableRows}</mtable>`;
                            i = closeIdx + closeTag.length;
                            continue;
                        }
                    }
                }
            }

            // Integrals, Summations, Limits & Extremum operators with limits/bounds:
            // e.g. \int_{a}^{b}, \sum_{i=1}^{n}, \lim_{h \to 0}, \min_{x \in X}
            const bigOpMatch = /^\\(int|iint|iiint|oint|sum|prod|coprod|lim|liminf|limsup|min|max|inf|sup)(?![a-zA-Z])/.exec(input.slice(i));
            if (bigOpMatch) {
                const opCmd = '\\' + bigOpMatch[1];
                const opSym = GREEK_AND_SYMBOLS[opCmd] || bigOpMatch[1];
                let cur = i + bigOpMatch[0].length;
                let subContent: string | null = null;
                let supContent: string | null = null;

                // Check for subsequent _ and ^ in either order
                for (let pass = 0; pass < 2; pass++) {
                    while (cur < input.length && /\s/.test(input[cur])) cur++;
                    if (input[cur] === '_') {
                        cur++;
                        while (cur < input.length && /\s/.test(input[cur])) cur++;
                        if (input[cur] === '{') {
                            const b = extractBalancedBraces(input, cur);
                            if (b) {
                                subContent = b.content;
                                cur = b.endIndex + 1;
                            }
                        } else if (cur < input.length) {
                            subContent = input[cur];
                            cur++;
                        }
                    } else if (input[cur] === '^') {
                        cur++;
                        while (cur < input.length && /\s/.test(input[cur])) cur++;
                        if (input[cur] === '{') {
                            const b = extractBalancedBraces(input, cur);
                            if (b) {
                                supContent = b.content;
                                cur = b.endIndex + 1;
                            }
                        } else if (cur < input.length) {
                            supContent = input[cur];
                            cur++;
                        }
                    }
                }

                const isUnderOver = ['\\sum', '\\prod', '\\coprod', '\\lim', '\\liminf', '\\limsup', '\\min', '\\max', '\\inf', '\\sup'].includes(opCmd);
                const isWordOp = ['\\lim', '\\liminf', '\\limsup', '\\min', '\\max', '\\inf', '\\sup'].includes(opCmd);
                const opStyle = isWordOp
                    ? 'font-style: normal; font-size: 1.15em; padding-right: 0.15em;'
                    : 'font-size: 1.6em; line-height: 1;';
                const limitStyle = 'font-size: 0.72em; font-weight: normal;';

                if (subContent !== null && supContent !== null) {
                    const subML = convertTokens(subContent);
                    const supML = convertTokens(supContent);
                    if (isUnderOver) {
                        out += `<munderover><mo style="${opStyle}">${opSym}</mo><mrow style="${limitStyle}">${subML}</mrow><mrow style="${limitStyle}">${supML}</mrow></munderover>`;
                    } else {
                        out += `<msubsup><mo style="font-size: 1.6em; vertical-align: -0.2em;">${opSym}</mo><mrow style="${limitStyle}">${subML}</mrow><mrow style="${limitStyle}">${supML}</mrow></msubsup>`;
                    }
                    i = cur;
                    continue;
                } else if (subContent !== null) {
                    const subML = convertTokens(subContent);
                    if (isUnderOver) {
                        out += `<munder><mo style="${opStyle}">${opSym}</mo><mrow style="${limitStyle}">${subML}</mrow></munder>`;
                    } else {
                        out += `<msub><mo style="font-size: 1.6em; vertical-align: -0.2em;">${opSym}</mo><mrow style="${limitStyle}">${subML}</mrow></msub>`;
                    }
                    i = cur;
                    continue;
                } else if (supContent !== null) {
                    const supML = convertTokens(supContent);
                    if (isUnderOver) {
                        out += `<mover><mo style="${opStyle}">${opSym}</mo><mrow style="${limitStyle}">${supML}</mrow></mover>`;
                    } else {
                        out += `<msup><mo style="font-size: 1.6em; vertical-align: -0.2em;">${opSym}</mo><mrow style="${limitStyle}">${supML}</mrow></msup>`;
                    }
                    i = cur;
                    continue;
                } else {
                    out += `<mo style="${opStyle}">${opSym}</mo>`;
                    i = cur;
                    continue;
                }
            }
            // Math font styles: \mathcal, \mathbf, \boldsymbol, \bm, \mathbb, \mathit, \mathsf, \mathrm, \operatorname, \text
            const mathFontMatch = /^\\(mathcal|mathbb|mathbf|boldsymbol|bm|mathit|mathsf|mathrm|operatorname|text)\s*\{/.exec(input.slice(i));
            if (mathFontMatch) {
                const fontCmd = mathFontMatch[1];
                const braceStart = i + mathFontMatch[0].length - 1;
                const brace = extractBalancedBraces(input, braceStart);
                if (brace) {
                    const innerText = brace.content;
                    if (fontCmd === 'mathcal') {
                        const scriptMap: Record<string, string> = {
                            'A': '𝒜', 'B': 'ℬ', 'C': '𝒞', 'D': '𝒟', 'E': 'ℰ', 'F': 'ℱ', 'G': '𝒢', 'H': 'ℋ', 'I': 'ℐ',
                            'J': '𝒥', 'K': '𝒦', 'L': 'ℒ', 'M': 'ℳ', 'N': '𝒩', 'O': '𝒪', 'P': '𝒫', 'Q': '𝒬', 'R': 'ℛ',
                            'S': '𝒮', 'T': '𝒯', 'U': '𝒰', 'V': '𝒱', 'W': '𝒲', 'X': '𝒳', 'Y': '𝒴', 'Z': '𝒵',
                            'a': '𝒶', 'b': '𝒷', 'c': '𝒸', 'd': '𝒹', 'e': 'ℯ', 'f': '𝒻', 'g': 'ℊ', 'h': '𝒽', 'i': '𝒾',
                            'j': '𝒿', 'k': '𝓀', 'l': '𝓁', 'm': '𝓂', 'n': '𝓃', 'o': 'ℴ', 'p': '𝓅', 'q': '𝓆', 'r': '𝓇',
                            's': '𝓈', 't': '𝓉', 'u': '𝓊', 'v': '𝓋', 'w': '𝓌', 'x': '𝓍', 'y': '𝓎', 'z': '𝓏'
                        };
                        const mapped = innerText.split('').map(ch => scriptMap[ch] || ch).join('');
                        out += `<mi style="font-family: 'Cambria Math', 'Latin Modern Math', 'STIX Two Math', 'Times New Roman', serif; font-style: italic; font-weight: 500;">${mapped}</mi>`;
                    } else if (fontCmd === 'mathbb') {
                        const bbmodMap: Record<string, string> = {
                            'R': 'ℝ', 'N': 'ℕ', 'Z': 'ℤ', 'Q': 'ℚ', 'C': 'ℂ', 'P': 'ℙ', 'E': '𝔼', 'H': 'ℍ'
                        };
                        const mapped = innerText.split('').map(ch => bbmodMap[ch] || ch).join('');
                        out += `<mi style="font-family: 'Cambria Math', 'STIX Two Math', serif;">${mapped}</mi>`;
                    } else if (fontCmd === 'boldsymbol' || fontCmd === 'bm') {
                        out += `<mrow style="font-weight: bold;">${convertTokens(innerText)}</mrow>`;
                    } else if (fontCmd === 'mathbf') {
                        out += `<mrow style="font-weight: bold; font-style: normal;">${convertTokens(innerText)}</mrow>`;
                    } else if (fontCmd === 'mathrm' || fontCmd === 'operatorname') {
                        out += `<mrow style="font-style: normal;">${convertTokens(innerText)}</mrow>`;
                    } else if (fontCmd === 'mathsf') {
                        out += `<mrow style="font-family: ui-sans-serif, system-ui, sans-serif; font-style: normal;">${convertTokens(innerText)}</mrow>`;
                    } else {
                        const preserved = escapeXml(innerText).replace(/ /g, '\u00A0');
                        out += `<mtext>${preserved}</mtext>`;
                    }
                    i = brace.endIndex + 1;
                    continue;
                }
            }

            // Diacritics / Accents: \hat{...}, \widehat{...}, \tilde{...}, \bar{...}, \vec{...}, etc. (supports nested braces)
            const accentCmdMatch = /^\\(widehat|widetilde|overline|underline|hat|tilde|bar|vec|dot|ddot|check|acute|grave)\b/.exec(input.slice(i));
            if (accentCmdMatch) {
                const accType = accentCmdMatch[1];
                let afterCmd = i + accentCmdMatch[0].length;
                while (afterCmd < input.length && /\s/.test(input[afterCmd])) afterCmd++;
                let targetArg = '';
                let nextIndex = -1;
                if (input[afterCmd] === '{') {
                    const brace = extractBalancedBraces(input, afterCmd);
                    if (brace) {
                        targetArg = brace.content;
                        nextIndex = brace.endIndex + 1;
                    }
                } else if (afterCmd < input.length && /[a-zA-Z0-9]/.test(input[afterCmd])) {
                    targetArg = input[afterCmd];
                    nextIndex = afterCmd + 1;
                }
                if (nextIndex !== -1) {
                    const targetMathML = convertTokens(targetArg);
                    const accentSymbols: Record<string, string> = {
                        'hat': '^',
                        'widehat': '^',
                        'tilde': '~',
                        'widetilde': '~',
                        'bar': '¯',
                        'overline': '¯',
                        'underline': '_',
                        'vec': '→',
                        'dot': '˙',
                        'ddot': '¨',
                        'check': 'ˇ',
                        'acute': '´',
                        'grave': '`',
                    };
                    const accGlyph = accentSymbols[accType] || '^';
                    const accStyle = accType === 'hat' || accType === 'widehat'
                        ? 'font-size: 0.7em; line-height: 0.5; vertical-align: 0.1em; transform: scale(0.75, 0.5); display: inline-block;'
                        : (accType === 'bar' || accType === 'overline' ? 'font-size: 0.75em; line-height: 0.5;' : 'font-size: 0.85em; line-height: 0.8; vertical-align: -0.1em;');
                    if (accType === 'underline') {
                        out += `<munder accentunder="true"><mrow>${targetMathML}</mrow><mo>${accGlyph}</mo></munder>`;
                    } else {
                        out += `<mover accent="true"><mrow>${targetMathML}</mrow><mo style="${accStyle}">${accGlyph}</mo></mover>`;
                    }
                    i = nextIndex;
                    continue;
                }
            }

            // Subscripts _ and Superscripts ^
            if (input[i] === '_' || input[i] === '^') {
                const isSub = input[i] === '_';
                let nextIdx = i + 1;
                let scriptContent = '';
                if (input[nextIdx] === '{') {
                    const brace = extractBalancedBraces(input, nextIdx);
                    if (brace) {
                        scriptContent = brace.content;
                        i = brace.endIndex + 1;
                    }
                } else if (nextIdx < input.length) {
                    scriptContent = input[nextIdx];
                    i = nextIdx + 1;
                }

                const scriptMathML = convertTokens(scriptContent);
                const tag = isSub ? 'msub' : 'msup';

                // If previous token was an element like <mi>e</mi> or <mover ...>...</mover>, wrap that single element as base
                const prevTag = findLastTag(out);
                if (prevTag) {
                    const baseElem = prevTag.fullTag;
                    const trimmedOut = out.slice(0, prevTag.start);
                    out = `${trimmedOut}<${tag}>${baseElem}<mrow>${scriptMathML}</mrow></${tag}>`;
                } else {
                    out += `<${tag}><mrow></mrow><mrow>${scriptMathML}</mrow></${tag}>`;
                }
                continue;
            }

            // Prime notation: f'(x) -> f′(x) or f''(x) -> f″(x)
            if (input[i] === "'") {
                let primeCount = 0;
                while (i < input.length && input[i] === "'") {
                    primeCount++;
                    i++;
                }
                const primeSym = primeCount === 1 ? '′' : (primeCount === 2 ? '″' : '‴');
                const prevElemMatch = /(<(mi|mn|mo|mtext|mrow)>[^<]+<\/\2>)$/.exec(out.trimEnd());
                if (prevElemMatch) {
                    const baseElem = prevElemMatch[1];
                    const trimmedOut = out.trimEnd().slice(0, -baseElem.length);
                    out = `${trimmedOut}<msup>${baseElem}<mo style="font-size: 0.85em; font-family: 'Cambria Math', 'Times New Roman', serif;">${primeSym}</mo></msup>`;
                } else {
                    out += `<mo style="font-size: 0.85em;">${primeSym}</mo>`;
                }
                continue;
            }

            // Escaped spacing, norm bars \|, or braces
            if (input[i] === '\\' && input[i + 1] === '|') {
                out += '<mo>‖</mo>';
                i += 2;
                continue;
            }
            if (input[i] === '\\' && (input[i + 1] === ',' || input[i + 1] === ';' || input[i + 1] === ':' || input[i + 1] === '!')) {
                out += '<mspace width="0.22em" />';
                i += 2;
                continue;
            }

            // Commands
            if (input[i] === '\\') {
                const cmdMatch = /^\\[a-zA-Z]+/.exec(input.slice(i));
                if (cmdMatch) {
                    const cmd = cmdMatch[0];
                    if (GREEK_AND_SYMBOLS[cmd]) {
                        const sym = escapeXml(GREEK_AND_SYMBOLS[cmd]);
                        if (UPRIGHT_FUNCTIONS.has(cmd)) {
                            out += `<mi mathvariant="normal" style="font-style: normal; padding-right: 0.15em;">${sym}</mi>`;
                        } else if (cmd === '\\mid' || cmd === '\\vert' || cmd === '\\Vert') {
                            out += `<mo fence="false" stretchy="false" style="padding: 0 0.25em;">${sym}</mo>`;
                        } else if (cmd === '\\langle' || cmd === '\\rangle' || cmd === '\\lceil' || cmd === '\\rceil' || cmd === '\\lfloor' || cmd === '\\rfloor') {
                            out += `<mo stretchy="false">${sym}</mo>`;
                        } else {
                            out += `<mo>${sym}</mo>`;
                        }
                    } else if (cmd === '\\left' || cmd === '\\right') {
                        // ignore wrapper
                    } else {
                        out += `<mi>${escapeXml(cmd.slice(1))}</mi>`;
                    }
                    i += cmd.length;
                    continue;
                } else if (input[i + 1] === '{' || input[i + 1] === '}') {
                    out += `<mo stretchy="false">${input[i + 1]}</mo>`;
                    i += 2;
                    continue;
                } else {
                    i++;
                    continue;
                }
            }

            // Numbers
            const numMatch = /^[0-9]+(\.[0-9]+)?/.exec(input.slice(i));
            if (numMatch) {
                out += `<mn>${numMatch[0]}</mn>`;
                i += numMatch[0].length;
                continue;
            }

            // Operators
            if (/[+\-=*\/=<>≠≤≥≈±×÷]/.test(input[i])) {
                out += `<mo>${escapeXml(input[i])}</mo>`;
                i++;
                continue;
            }

            // Identifiers
            if (/[a-zA-Z]/.test(input[i])) {
                out += `<mi>${input[i]}</mi>`;
                i++;
                continue;
            }

            if (input[i] !== '{' && input[i] !== '}') {
                const ch = input[i];
                if (/[()[\]|]/.test(ch)) {
                    out += `<mo stretchy="false">${ch}</mo>`;
                } else {
                    out += `<mo>${escapeXml(ch)}</mo>`;
                }
            }
            i++;
        }

        return out;
    };

    const mathMLContent = convertTokens(clean);
    const displayAttr = isBlock ? 'display="block"' : 'display="inline"';
    return `<math xmlns="http://www.w3.org/1998/Math/MathML" ${displayAttr} class="tex-mathml">${mathMLContent}</math>`;
}

/**
 * Builds an SVG image data URL or SVG XML string for exact Overleaf-style formula preview
 * Matches media_1795530955207_c26ddefd.png (\sqrt{\frac{5}{12}})
 */
export function latexToSvgDataUrl(latex: string, isDark = false): string | null {
    let clean = latex.trim();
    clean = clean.replace(/^\$\$([\s\S]*)\$\$$/, '$1');
    clean = clean.replace(/^\$([\s\S]*)\$$/, '$1');
    clean = clean.replace(/^\\\[([\s\S]*)\\\]$/, '$1');
    clean = clean.replace(/^\\\(([\s\S]*)\\\)$/, '$1');
    clean = clean.replace(/\\label\{[^{}]*\}/g, '');
    clean = clean.replace(/\\tag\*?\{[^{}]*\}/g, '');
    clean = clean.replace(/\\(nonumber|notag)\b/g, '');
    clean = clean.replace(/\\begin\{(equation\*?|gather\*?|multline\*?|flalign\*?|eqnarray\*?|split)\}/g, '');
    clean = clean.replace(/\\end\{(equation\*?|gather\*?|multline\*?|flalign\*?|eqnarray\*?|split)\}/g, '').trim();

    const fgColor = isDark ? '#f8fafc' : '#0f172a';

    // 1. Check for \sqrt{\frac{A}{B}}
    const sqrtFracMatch = /^\\sqrt\{\s*\\frac\{\s*([^{}]+)\s*\}\{\s*([^{}]+)\s*\}\s*\}$/.exec(clean);
    if (sqrtFracMatch) {
        const num = sqrtFracMatch[1].trim();
        const den = sqrtFracMatch[2].trim();
        const charWidth = 9;
        const maxTextLen = Math.max(num.length, den.length);
        const fracWidth = Math.max(24, maxTextLen * charWidth + 8);
        const totalWidth = fracWidth + 24;
        const totalHeight = 54;

        const numX = 18 + fracWidth / 2;
        const denX = 18 + fracWidth / 2;
        const barStartX = 18;
        const barEndX = 18 + fracWidth;
        const topBarEndX = totalWidth - 2;

        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${totalHeight}" viewBox="0 0 ${totalWidth} ${totalHeight}">
  <style>
    text { font-family: "Cambria Math", "Latin Modern Math", "STIX Two Math", "Times New Roman", serif; font-size: 14px; fill: ${fgColor}; text-anchor: middle; dominant-baseline: middle; }
    line, path { stroke: ${fgColor}; stroke-linecap: round; stroke-linejoin: round; }
  </style>
  <!-- Radical sign -->
  <path d="M 4 33 L 7 30 L 11 46 L 16 7 L ${topBarEndX} 7" fill="none" stroke-width="1.3" />
  <!-- Numerator -->
  <text x="${numX}" y="20">${num}</text>
  <!-- Fraction bar -->
  <line x1="${barStartX}" y1="28" x2="${barEndX}" y2="28" stroke-width="1.2" />
  <!-- Denominator -->
  <text x="${denX}" y="38">${den}</text>
</svg>`;

        return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
    }

    // 2. Check for simple fraction \frac{A}{B}
    const fracMatch = /^\\frac\{\s*([^{}]+)\s*\}\{\s*([^{}]+)\s*\}$/.exec(clean);
    if (fracMatch) {
        const num = fracMatch[1].trim();
        const den = fracMatch[2].trim();
        const charWidth = 9;
        const maxTextLen = Math.max(num.length, den.length);
        const fracWidth = Math.max(22, maxTextLen * charWidth + 8);
        const totalWidth = fracWidth + 8;
        const totalHeight = 46;

        const centerX = totalWidth / 2;

        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${totalHeight}" viewBox="0 0 ${totalWidth} ${totalHeight}">
  <style>
    text { font-family: "Cambria Math", "Latin Modern Math", "STIX Two Math", "Times New Roman", serif; font-size: 14px; fill: ${fgColor}; text-anchor: middle; dominant-baseline: middle; }
    line { stroke: ${fgColor}; stroke-width: 1.2; stroke-linecap: round; }
  </style>
  <text x="${centerX}" y="15">${num}</text>
  <line x1="4" y1="23" x2="${totalWidth - 4}" y2="23" />
  <text x="${centerX}" y="33">${den}</text>
</svg>`;

        return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
    }

    // 3. Check for simple radical \sqrt{X}
    const sqrtMatch = /^\\sqrt\{\s*([^{}]+)\s*\}$/.exec(clean);
    if (sqrtMatch) {
        const inner = sqrtMatch[1].trim();
        const charWidth = 9;
        const textWidth = Math.max(16, inner.length * charWidth + 6);
        const totalWidth = textWidth + 18;
        const totalHeight = 36;
        const topBarEndX = totalWidth - 2;

        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${totalHeight}" viewBox="0 0 ${totalWidth} ${totalHeight}">
  <style>
    text { font-family: "Cambria Math", "Latin Modern Math", "STIX Two Math", "Times New Roman", serif; font-size: 14px; fill: ${fgColor}; text-anchor: middle; dominant-baseline: middle; }
    path { stroke: ${fgColor}; stroke-linecap: round; stroke-linejoin: round; stroke-width: 1.3; }
  </style>
  <path d="M 3 22 L 6 19 L 10 30 L 14 6 L ${topBarEndX} 6" fill="none" />
  <text x="${14 + textWidth / 2}" y="19">${inner}</text>
</svg>`;

        return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
    }

    // 4. Check for integral equations: \int_{a}^{b} f(x)\,dx = ... or \int_a^b ...
    const intEqMatch = /^\\int(_\{([^{}]+)\}|_([a-zA-Z0-9\\]+))(\^\{([^{}]+)\}|\^([a-zA-Z0-9\\]+))\s*(.*)$/.exec(clean);
    if (intEqMatch) {
        let lowerLimit = (intEqMatch[2] || intEqMatch[3] || '').trim();
        let upperLimit = (intEqMatch[5] || intEqMatch[6] || '').trim();
        let integrandRest = (intEqMatch[7] || '').trim();

        // If the equation contains complex elements like fractions or nested radicals,
        // let the full browser MathML engine render it perfectly in 2D instead of a simplified 1D SVG line!
        if (/\\(frac|sqrt|sum|prod|bmatrix|pmatrix|cases)/.test(integrandRest)) {
            return null;
        }

        // Replace command symbols in limits
        for (const [cmd, sym] of Object.entries(GREEK_AND_SYMBOLS)) {
            lowerLimit = lowerLimit.split(cmd).join(sym);
            upperLimit = upperLimit.split(cmd).join(sym);
        }
        lowerLimit = lowerLimit.replace(/\\/g, '');
        upperLimit = upperLimit.replace(/\\/g, '');

        // Format integrand text
        integrandRest = integrandRest.replace(/\\,/g, ' ');
        integrandRest = integrandRest.replace(/\\(text|mathrm|mathbf|mathit)\{([^{}]+)\}/g, '$2');
        for (const [cmd, sym] of Object.entries(GREEK_AND_SYMBOLS)) {
            integrandRest = integrandRest.split(cmd).join(sym);
        }

        // Convert simple exponents in integrand: ^2 -> ² or ^{...}
        integrandRest = integrandRest.replace(/\^\{([^{}]+)\}/g, (_, inner) => {
            return inner.split('').map((c: string) => SUPER_DIGITS[c] || c).join('');
        });
        integrandRest = integrandRest.replace(/\^([0-9a-zA-Z+-=()])/g, (_, ch) => SUPER_DIGITS[ch] || `^${ch}`);

        // Convert simple subscripts in integrand: _1 -> ₁
        integrandRest = integrandRest.replace(/_\{([^{}]+)\}/g, (_, inner) => {
            return inner.split('').map((c: string) => SUB_DIGITS[c] || c).join('');
        });
        integrandRest = integrandRest.replace(/_([0-9a-zA-Z+-=()])/g, (_, ch) => SUB_DIGITS[ch] || `_${ch}`);

        const charWidth = 8.8;
        const integrandWidth = Math.max(30, integrandRest.length * charWidth + 10);
        const totalWidth = 36 + integrandWidth + 12;
        const totalHeight = 56;

        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${totalHeight}" viewBox="0 0 ${totalWidth} ${totalHeight}">
  <style>
    .math-int { font-family: "Cambria Math", "Latin Modern Math", "STIX Two Math", "Times New Roman", serif; font-size: 34px; fill: ${fgColor}; }
    .math-limit { font-family: "Cambria Math", "Latin Modern Math", "STIX Two Math", "Times New Roman", serif; font-size: 13px; font-style: italic; fill: ${fgColor}; text-anchor: start; }
    .math-body { font-family: "Cambria Math", "Latin Modern Math", "STIX Two Math", "Times New Roman", serif; font-size: 17px; fill: ${fgColor}; text-anchor: start; dominant-baseline: central; }
  </style>
  <!-- Tall Slanted Integral Symbol -->
  <text x="6" y="38" class="math-int">∫</text>
  <!-- Upper limit -->
  <text x="21" y="15" class="math-limit">${upperLimit}</text>
  <!-- Lower limit -->
  <text x="17" y="47" class="math-limit">${lowerLimit}</text>
  <!-- Integrand & Equation Body -->
  <text x="36" y="30" class="math-body">${integrandRest}</text>
</svg>`;

        return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
    }

    // 5. Universal high-fidelity MathML-in-SVG vector rendering:
    // Enables identical graphical rendering for ALL mathematical formulas in Monaco hover previews
    try {
        const mathml = latexToMathML(clean, true);
        const visualText = clean
            .replace(/\\(d|t)?(frac|binom)\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g, (_, __, ___, n, d) => (n.length >= d.length ? n : d))
            .replace(/\\(left|right|hat|widehat|tilde|widetilde|bar|overline|underline|vec|dot|ddot|boldsymbol|bm|mathbf|mathrm|mathit|mathsf|mathcal|mathbb|operatorname|text|boxed)\b/g, '')
            .replace(/\\[a-zA-Z]+/g, 'X')
            .replace(/[{}\s]+/g, ' ');
        const visualLen = visualText.trim().length;
        const rowCount = (clean.match(/\\\\/g)?.length ?? 0) + 1;
        const isMultiLine = /\\\\|aligned|align|flalign|eqnarray|split|gather|multline|matrix|cases/.test(clean);
        const hasTallOp = /\\(d|t)?frac|\\(d|t)?binom|\\(sum|prod|coprod|int|iint|iiint|oint|lim|overset|underset|stackrel)/.test(clean);
        const estWidth = Math.min(560, Math.max(120, Math.round(visualLen * 10.5 + 36)));
        const estHeight = isMultiLine ? Math.min(380, Math.max(120, rowCount * 44 + 40)) : hasTallOp ? 104 : 72;

        const universalSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${estWidth}" height="${estHeight}" viewBox="0 0 ${estWidth} ${estHeight}">
  <style>
    .math-hover-wrap {
      font-family: "Cambria Math", "Latin Modern Math", "STIX Two Math", "Times New Roman", serif;
      font-size: 16px;
      color: ${fgColor};
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      box-sizing: border-box;
      padding: 6px 14px;
      overflow: visible;
    }
  </style>
  <foreignObject width="100%" height="100%">
    <div xmlns="http://www.w3.org/1999/xhtml" class="math-hover-wrap">
      ${mathml}
    </div>
  </foreignObject>
</svg>`;

        return 'data:image/svg+xml;utf8,' + encodeURIComponent(universalSvg);
    } catch {
        return null;
    }
}

/**
 * Text/Unicode fallback layout
 */
export function latexToUnicodeFormatted(latex: string): string {
    let p = latex.trim();
    p = p.replace(/^\$\$([\s\S]*)\$\$$/, '$1');
    p = p.replace(/^\$([\s\S]*)\$$/, '$1');
    p = p.replace(/^\\\[([\s\S]*)\\\]$/, '$1');
    p = p.replace(/^\\\(([\s\S]*)\\\)$/, '$1');
    p = p.replace(/\\label\{[^{}]*\}/g, '');

    // Nested \sqrt{\frac{a}{b}}
    const sqrtFracMatch = /\\sqrt\{[^{}]*\\frac\{([^{}]+)\}\{([^{}]+)\}[^{}]*\}/.exec(p);
    if (sqrtFracMatch) {
        const num = sqrtFracMatch[1].trim();
        const den = sqrtFracMatch[2].trim();
        const maxLen = Math.max(num.length, den.length);
        const bar = '─'.repeat(Math.max(3, maxLen + 2));
        const numPad = ' '.repeat(Math.max(0, Math.floor((bar.length - num.length) / 2)));
        const denPad = ' '.repeat(Math.max(0, Math.floor((bar.length - den.length) / 2)));

        const renderedBlock = [
            `  ┌${'─'.repeat(bar.length + 1)}`,
            `√ │ ${numPad}${num}`,
            `  │ ${bar}`,
            `  │ ${denPad}${den}`,
        ].join('\n');

        p = p.replace(sqrtFracMatch[0], '\n' + renderedBlock + '\n');
    }

    p = p.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '($1)/($2)');
    p = p.replace(/\\sqrt\[([^\]]+)\]\{([^{}]+)\}/g, '√[$1]($2)');
    p = p.replace(/\\sqrt\{([^{}]+)\}/g, '√($1)');

    p = p.replace(/\\begin\{(aligned|align\*?|gather\*?|multline\*?|cases)\}/g, '');
    p = p.replace(/\\end\{(aligned|align\*?|gather\*?|multline\*?|cases)\}/g, '');

    // Matrices
    p = p.replace(/\\begin\{([bBpvV]?matrix)\}([\s\S]*?)\\end\{\1\}/g, (_, type, inner) => {
        const rows = inner.trim().split('\\\\').map((r: string) =>
            r.split('&').map((c: string) => c.trim()).join('   ')
        ).filter(Boolean);
        let openBracket = '⎡';
        let closeBracket = '⎤';
        if (type === 'pmatrix') {
            openBracket = '⎛';
            closeBracket = '⎞';
        } else if (type === 'Bmatrix') {
            openBracket = '⎧';
            closeBracket = '⎫';
        } else if (type === 'vmatrix') {
            openBracket = '│';
            closeBracket = '│';
        } else if (type === 'Vmatrix') {
            openBracket = '‖';
            closeBracket = '‖';
        }
        return `\n${openBracket}\n  ` + rows.join('\n  ') + `\n${closeBracket}\n`;
    });

    p = p.replace(/\\\{/g, '⟦L_BRACE⟧');
    p = p.replace(/\\\}/g, '⟦R_BRACE⟧');

    for (const [cmd, sym] of Object.entries(GREEK_AND_SYMBOLS)) {
        p = p.split(cmd).join(sym);
    }

    p = p.replace(/_\{([^{}]+)\}/g, (_, inner) => {
        return inner.split('').map((c: string) => SUB_DIGITS[c] || c).join('');
    });
    p = p.replace(/_([0-9a-zA-Z+-=()])/g, (_, ch) => SUB_DIGITS[ch] || `_${ch}`);

    p = p.replace(/\^\{([^{}]+)\}/g, (_, inner) => {
        return inner.split('').map((c: string) => SUPER_DIGITS[c] || c).join('');
    });
    p = p.replace(/\^([0-9a-zA-Z+-=()])/g, (_, ch) => SUPER_DIGITS[ch] || `^${ch}`);

    p = p.replace(/\\(text|mathrm|mathbf|mathit|mathsf|mathbb|mathcal)\{([^{}]+)\}/g, '$2');
    p = p.replace(/&=/g, ' = ');
    p = p.replace(/&/g, ' ');
    p = p.replace(/\\\\/g, '\n');
    p = p.replace(/\\[,;:! ]/g, ' ');
    p = p.replace(/\\([a-zA-Z]+)/g, '$1');
    p = p.replace(/[{}]/g, '');
    p = p.replace(/⟦L_BRACE⟧/g, '{');
    p = p.replace(/⟦R_BRACE⟧/g, '}');

    return p.trim();
}
