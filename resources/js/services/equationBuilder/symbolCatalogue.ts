export type SymbolCategory =
    | 'greek'
    | 'alphabets'
    | 'operators'
    | 'relations'
    | 'arrows'
    | 'sets'
    | 'logic'
    | 'calculus'
    | 'linear_algebra'
    | 'probability'
    | 'geometry'
    | 'physics'
    | 'misc';

export interface MathSymbolEntry {
    id: string;
    category: SymbolCategory;
    subcategory: string;
    glyph: string;
    latex: string;
    snippet: string;
    spokenName: string;
    aliases: string[];
    keywords: string[];
    unicode?: string;
    requiredPackages: string[];
    mathModeRequired: boolean;
}

export const SYMBOL_CATEGORIES: Array<{ id: SymbolCategory; label: string }> = [
    { id: 'greek', label: 'Greek' },
    { id: 'arrows', label: 'Arrows' },
    { id: 'operators', label: 'Operators' },
    { id: 'relations', label: 'Relations' },
    { id: 'calculus', label: 'Calculus' },
    { id: 'linear_algebra', label: 'Linear Alg' },
    { id: 'sets', label: 'Sets' },
    { id: 'logic', label: 'Logic' },
    { id: 'probability', label: 'Prob/Stats' },
    { id: 'alphabets', label: 'Alphabets' },
    { id: 'geometry', label: 'Geometry' },
    { id: 'physics', label: 'Physics/Chem' },
    { id: 'misc', label: 'Misc' },
];

function sym(
    id: string,
    category: SymbolCategory,
    subcategory: string,
    glyph: string,
    latex: string,
    spokenName: string,
    aliases: string[] = [],
    requiredPackages: string[] = [],
    snippet?: string,
): MathSymbolEntry {
    return {
        id,
        category,
        subcategory,
        glyph,
        latex,
        snippet: snippet ?? latex,
        spokenName,
        aliases,
        keywords: [category, subcategory, spokenName, ...aliases],
        requiredPackages,
        mathModeRequired: true,
    };
}

export const MATH_SYMBOLS: MathSymbolEntry[] = [
    // Greek Lowercase & Variants
    sym('g_alpha', 'greek', 'lowercase', 'α', '\\alpha', 'alpha'),
    sym('g_beta', 'greek', 'lowercase', 'β', '\\beta', 'beta'),
    sym('g_gamma', 'greek', 'lowercase', 'γ', '\\gamma', 'gamma'),
    sym('g_delta', 'greek', 'lowercase', 'δ', '\\delta', 'delta'),
    sym('g_epsilon', 'greek', 'lowercase', 'ϵ', '\\epsilon', 'epsilon'),
    sym('g_varepsilon', 'greek', 'variant', 'ε', '\\varepsilon', 'varepsilon'),
    sym('g_zeta', 'greek', 'lowercase', 'ζ', '\\zeta', 'zeta'),
    sym('g_eta', 'greek', 'lowercase', 'η', '\\eta', 'eta'),
    sym('g_theta', 'greek', 'lowercase', 'θ', '\\theta', 'theta'),
    sym('g_vartheta', 'greek', 'variant', 'ϑ', '\\vartheta', 'vartheta'),
    sym('g_iota', 'greek', 'lowercase', 'ι', '\\iota', 'iota'),
    sym('g_kappa', 'greek', 'lowercase', 'κ', '\\kappa', 'kappa'),
    sym('g_lambda', 'greek', 'lowercase', 'λ', '\\lambda', 'lambda'),
    sym('g_mu', 'greek', 'lowercase', 'μ', '\\mu', 'mu'),
    sym('g_nu', 'greek', 'lowercase', 'ν', '\\nu', 'nu'),
    sym('g_xi', 'greek', 'lowercase', 'ξ', '\\xi', 'xi'),
    sym('g_pi', 'greek', 'lowercase', 'π', '\\pi', 'pi'),
    sym('g_varpi', 'greek', 'variant', 'ϖ', '\\varpi', 'varpi'),
    sym('g_rho', 'greek', 'lowercase', 'ρ', '\\rho', 'rho'),
    sym('g_varrho', 'greek', 'variant', 'ϱ', '\\varrho', 'varrho'),
    sym('g_sigma', 'greek', 'lowercase', 'σ', '\\sigma', 'sigma'),
    sym('g_varsigma', 'greek', 'variant', 'ς', '\\varsigma', 'varsigma'),
    sym('g_tau', 'greek', 'lowercase', 'τ', '\\tau', 'tau'),
    sym('g_upsilon', 'greek', 'lowercase', 'υ', '\\upsilon', 'upsilon'),
    sym('g_phi', 'greek', 'lowercase', 'ϕ', '\\phi', 'phi'),
    sym('g_varphi', 'greek', 'variant', 'φ', '\\varphi', 'varphi'),
    sym('g_chi', 'greek', 'lowercase', 'χ', '\\chi', 'chi'),
    sym('g_psi', 'greek', 'lowercase', 'ψ', '\\psi', 'psi'),
    sym('g_omega', 'greek', 'lowercase', 'ω', '\\omega', 'omega'),
    // Greek Uppercase
    sym('g_Gamma', 'greek', 'uppercase', 'Γ', '\\Gamma', 'capital gamma'),
    sym('g_Delta', 'greek', 'uppercase', 'Δ', '\\Delta', 'capital delta'),
    sym('g_Theta', 'greek', 'uppercase', 'Θ', '\\Theta', 'capital theta'),
    sym('g_Lambda', 'greek', 'uppercase', 'Λ', '\\Lambda', 'capital lambda'),
    sym('g_Xi', 'greek', 'uppercase', 'Ξ', '\\Xi', 'capital xi'),
    sym('g_Pi', 'greek', 'uppercase', 'Π', '\\Pi', 'capital pi'),
    sym('g_Sigma', 'greek', 'uppercase', 'Σ', '\\Sigma', 'capital sigma'),
    sym('g_Upsilon', 'greek', 'uppercase', 'Υ', '\\Upsilon', 'capital upsilon'),
    sym('g_Phi', 'greek', 'uppercase', 'Φ', '\\Phi', 'capital phi'),
    sym('g_Psi', 'greek', 'uppercase', 'Ψ', '\\Psi', 'capital psi'),
    sym('g_Omega', 'greek', 'uppercase', 'Ω', '\\Omega', 'capital omega'),

    // Styled Alphabets & Number Systems
    sym('a_R', 'alphabets', 'blackboard', 'ℝ', '\\mathbb{R}', 'blackboard real numbers', ['real'], ['amssymb']),
    sym('a_N', 'alphabets', 'blackboard', 'ℕ', '\\mathbb{N}', 'blackboard natural numbers', ['natural'], ['amssymb']),
    sym('a_Z', 'alphabets', 'blackboard', 'ℤ', '\\mathbb{Z}', 'blackboard integers', ['integer'], ['amssymb']),
    sym('a_Q', 'alphabets', 'blackboard', 'ℚ', '\\mathbb{Q}', 'blackboard rationals', ['rational'], ['amssymb']),
    sym('a_C', 'alphabets', 'blackboard', 'ℂ', '\\mathbb{C}', 'blackboard complex numbers', ['complex'], ['amssymb']),
    sym('a_E', 'alphabets', 'blackboard', '𝔼', '\\mathbb{E}', 'blackboard expectation', ['expected value'], ['amssymb']),
    sym('a_P', 'alphabets', 'blackboard', 'ℙ', '\\mathbb{P}', 'blackboard probability', ['prob'], ['amssymb']),
    sym('a_calL', 'alphabets', 'calligraphic', 'ℒ', '\\mathcal{L}', 'calligraphic L', ['loss', 'lagrangian']),
    sym('a_calO', 'alphabets', 'calligraphic', '𝒪', '\\mathcal{O}', 'big O calligraphic', ['complexity']),
    sym('a_calN', 'alphabets', 'calligraphic', '𝒩', '\\mathcal{N}', 'normal distribution calligraphic', ['gaussian']),
    sym('a_boldtheta', 'alphabets', 'bold', 'θ', '\\boldsymbol{\\theta}', 'bold theta', ['vector parameter'], ['amsmath']),
    sym('a_boldX', 'alphabets', 'bold', 'X', '\\mathbf{X}', 'bold matrix X', ['matrix']),
    sym('a_frakg', 'alphabets', 'fraktur', '𝔤', '\\mathfrak{g}', 'fraktur g', ['lie algebra'], ['amssymb']),

    // Operators
    sym('op_pm', 'operators', 'binary', '±', '\\pm', 'plus or minus'),
    sym('op_mp', 'operators', 'binary', '∓', '\\mp', 'minus or plus'),
    sym('op_times', 'operators', 'binary', '×', '\\times', 'times multiply cross'),
    sym('op_div', 'operators', 'binary', '÷', '\\div', 'divided by'),
    sym('op_cdot', 'operators', 'binary', '·', '\\cdot', 'center dot product'),
    sym('op_ast', 'operators', 'binary', '∗', '\\ast', 'asterisk convolution'),
    sym('op_circ', 'operators', 'binary', '∘', '\\circ', 'function composition'),
    sym('op_oplus', 'operators', 'binary', '⊕', '\\oplus', 'direct sum xor'),
    sym('op_otimes', 'operators', 'binary', '⊗', '\\otimes', 'tensor product kronecker'),
    sym('op_odot', 'operators', 'binary', '⊙', '\\odot', 'hadamard elementwise product'),
    sym('op_sum', 'operators', 'big', '∑', '\\sum_{i=1}^{n}', 'summation', ['sum']),
    sym('op_prod', 'operators', 'big', '∏', '\\prod_{i=1}^{n}', 'product', ['pi product']),
    sym('op_bmod', 'operators', 'modular', 'mod', '\\bmod', 'modulo'),

    // Relations
    sym('rel_eq', 'relations', 'equality', '=', '=', 'equals'),
    sym('rel_neq', 'relations', 'equality', '≠', '\\neq', 'not equal'),
    sym('rel_approx', 'relations', 'approx', '≈', '\\approx', 'approximately equal'),
    sym('rel_equiv', 'relations', 'equivalence', '≡', '\\equiv', 'equivalent congruent'),
    sym('rel_cong', 'relations', 'equivalence', '≅', '\\cong', 'congruent isomorphic'),
    sym('rel_sim', 'relations', 'approx', '∼', '\\sim', 'similar distributed as'),
    sym('rel_propto', 'relations', 'approx', '∝', '\\propto', 'proportional to'),
    sym('rel_leq', 'relations', 'order', '≤', '\\leq', 'less than or equal'),
    sym('rel_geq', 'relations', 'order', '≥', '\\geq', 'greater than or equal'),
    sym('rel_ll', 'relations', 'order', '≪', '\\ll', 'much less than'),
    sym('rel_gg', 'relations', 'order', '≫', '\\gg', 'much greater than'),
    sym('rel_prec', 'relations', 'order', '≺', '\\prec', 'precedes'),
    sym('rel_succ', 'relations', 'order', '≻', '\\succ', 'succeeds'),
    sym('rel_coloneqq', 'relations', 'definition', '≔', '\\coloneqq', 'defined as', ['assign'], ['mathtools']),

    // Arrows
    sym('arr_to', 'arrows', 'basic', '→', '\\to', 'to right arrow', ['rightarrow']),
    sym('arr_leftarrow', 'arrows', 'basic', '←', '\\leftarrow', 'left arrow'),
    sym('arr_leftrightarrow', 'arrows', 'basic', '↔', '\\leftrightarrow', 'left right arrow'),
    sym('arr_Rightarrow', 'arrows', 'implication', '⇒', '\\Rightarrow', 'implies double right arrow'),
    sym('arr_Leftarrow', 'arrows', 'implication', '⇐', '\\Leftarrow', 'implied by'),
    sym('arr_iff', 'arrows', 'implication', '⟺', '\\iff', 'if and only if', ['Leftrightarrow'], ['amsmath']),
    sym('arr_mapsto', 'arrows', 'mapping', '↦', '\\mapsto', 'maps to'),
    sym('arr_hookrightarrow', 'arrows', 'mapping', '↪', '\\hookrightarrow', 'hook right arrow inclusion'),
    sym('arr_rightharpoonup', 'arrows', 'harpoon', '⇀', '\\rightharpoonup', 'right harpoon'),
    sym('arr_xrightarrow', 'arrows', 'extensible', '⟶', '\\xrightarrow{f}', 'labeled arrow', ['annotated'], ['amsmath']),

    // Sets
    sym('set_in', 'sets', 'membership', '∈', '\\in', 'element of in'),
    sym('set_notin', 'sets', 'membership', '∉', '\\notin', 'not an element of'),
    sym('set_subset', 'sets', 'inclusion', '⊂', '\\subset', 'proper subset'),
    sym('set_subseteq', 'sets', 'inclusion', '⊆', '\\subseteq', 'subset or equal'),
    sym('set_notsubset', 'sets', 'inclusion', '⊄', '\\not\\subset', 'not subset'),
    sym('set_cup', 'sets', 'operation', '∪', '\\cup', 'union'),
    sym('set_cap', 'sets', 'operation', '∩', '\\cap', 'intersection'),
    sym('set_setminus', 'sets', 'operation', '∖', '\\setminus', 'set difference'),
    sym('set_emptyset', 'sets', 'constant', '∅', '\\emptyset', 'empty set', ['varnothing']),

    // Logic
    sym('log_forall', 'logic', 'quantifier', '∀', '\\forall', 'for all universal quantifier'),
    sym('log_exists', 'logic', 'quantifier', '∃', '\\exists', 'there exists'),
    sym('log_nexists', 'logic', 'quantifier', '∄', '\\nexists', 'does not exist', [], ['amssymb']),
    sym('log_neg', 'logic', 'connective', '¬', '\\neg', 'logical not negation'),
    sym('log_land', 'logic', 'connective', '∧', '\\land', 'logical and'),
    sym('log_lor', 'logic', 'connective', '∨', '\\lor', 'logical or'),
    sym('log_therefore', 'logic', 'proof', '∴', '\\therefore', 'therefore', [], ['amssymb']),
    sym('log_because', 'logic', 'proof', '∵', '\\because', 'because', [], ['amssymb']),
    sym('log_vdash', 'logic', 'entailment', '⊢', '\\vdash', 'proves turnstile'),
    sym('log_models', 'logic', 'entailment', '⊨', '\\models', 'models entails'),

    // Calculus
    sym('calc_int', 'calculus', 'integral', '∫', '\\int_{a}^{b}', 'definite integral'),
    sym('calc_iint', 'calculus', 'integral', '∬', '\\iint_{D}', 'double integral', [], ['amsmath']),
    sym('calc_oint', 'calculus', 'integral', '∮', '\\oint_{C}', 'contour integral'),
    sym('calc_partial', 'calculus', 'derivative', '∂', '\\partial', 'partial derivative'),
    sym('calc_nabla', 'calculus', 'vector', '∇', '\\nabla', 'nabla gradient divergence curl'),
    sym('calc_lim', 'calculus', 'limit', 'lim', '\\lim_{x \\to \\infty}', 'limit'),
    sym('calc_infty', 'calculus', 'constant', '∞', '\\infty', 'infinity'),

    // Linear Algebra
    sym('la_norm', 'linear_algebra', 'norm', '‖·‖', '\\left\\| x \\right\\|_2', 'L2 norm'),
    sym('la_abs', 'linear_algebra', 'norm', '|·|', '\\left| x \\right|', 'absolute value determinant'),
    sym('la_langle', 'linear_algebra', 'inner', '⟨·,·⟩', '\\langle x, y \\rangle', 'inner product bra ket'),
    sym('la_top', 'linear_algebra', 'transpose', '⊤', '^{\\top}', 'matrix transpose'),
    sym('la_det', 'linear_algebra', 'operator', 'det', '\\det(A)', 'determinant'),
    sym('la_tr', 'linear_algebra', 'operator', 'tr', '\\operatorname{tr}(A)', 'trace', [], ['amsmath']),
    sym('la_argmin', 'linear_algebra', 'optimization', 'argmin', '\\arg\\min_{\\theta}', 'argmin', [], ['amsmath']),

    // Probability & Statistics
    sym('prob_cond', 'probability', 'conditional', 'P(A|B)', 'P(A \\mid B)', 'conditional probability'),
    sym('prob_E', 'probability', 'expectation', '𝔼[X]', '\\mathbb{E}[X]', 'expected value', [], ['amssymb']),
    sym('prob_Var', 'probability', 'variance', 'Var', '\\operatorname{Var}(X)', 'variance', [], ['amsmath']),
    sym('prob_Cov', 'probability', 'covariance', 'Cov', '\\operatorname{Cov}(X, Y)', 'covariance', [], ['amsmath']),
    sym('prob_perp', 'probability', 'independence', '⊥', '\\perp\\!\\!\\!\\perp', 'independent'),

    // Geometry
    sym('geo_angle', 'geometry', 'angle', '∠', '\\angle', 'angle'),
    sym('geo_triangle', 'geometry', 'shape', '△', '\\triangle', 'triangle'),
    sym('geo_parallel', 'geometry', 'relation', '∥', '\\parallel', 'parallel'),
    sym('geo_perp', 'geometry', 'relation', '⊥', '\\perp', 'perpendicular'),
    sym('geo_degree', 'geometry', 'unit', '°', '^\\circ', 'degree'),

    // Physics & Chemistry
    sym('phy_hbar', 'physics', 'quantum', 'ℏ', '\\hbar', 'reduced planck constant'),
    sym('phy_ket', 'physics', 'quantum', '|ψ⟩', '|\\psi\\rangle', 'ket state'),
    sym('phy_bra', 'physics', 'quantum', '⟨φ|', '\\langle\\phi|', 'bra state'),
    sym('chem_ce', 'physics', 'chemistry', 'H₂O', '\\ce{H2O + CO2 -> H2CO3}', 'chemical reaction mhchem', ['chemistry'], ['mhchem']),
    sym('phy_si', 'physics', 'units', 'm/s', '\\SI{9.81}{m/s^2}', 'siunitx physical unit', ['units'], ['siunitx']),

    // Misc
    sym('misc_cdots', 'misc', 'dots', '⋯', '\\cdots', 'center dots'),
    sym('misc_ldots', 'misc', 'dots', '…', '\\ldots', 'lower dots'),
    sym('misc_vdots', 'misc', 'dots', '⋮', '\\vdots', 'vertical dots'),
    sym('misc_ddots', 'misc', 'dots', '⋱', '\\ddots', 'diagonal dots'),
    sym('misc_hat', 'misc', 'accent', 'x̂', '\\hat{x}', 'hat accent'),
    sym('misc_vec', 'misc', 'accent', 'x⃗', '\\vec{x}', 'vector arrow accent'),
    sym('misc_boxed', 'misc', 'highlight', '□', '\\boxed{x}', 'boxed expression', [], ['amsmath']),
];

export function searchSymbols(
    query: string,
    category: SymbolCategory | 'all' | 'favorites' | 'recent',
    favoriteIds: string[] = [],
    recentIds: string[] = [],
): MathSymbolEntry[] {
    let pool = MATH_SYMBOLS;

    if (category === 'favorites') {
        const favSet = new Set(favoriteIds);
        pool = MATH_SYMBOLS.filter((s) => favSet.has(s.id));
    } else if (category === 'recent') {
        const byId = new Map(MATH_SYMBOLS.map((s) => [s.id, s]));
        pool = recentIds
            .map((id) => byId.get(id))
            .filter((s): s is MathSymbolEntry => Boolean(s));
    } else if (category !== 'all') {
        pool = MATH_SYMBOLS.filter((s) => s.category === category);
    }

    const q = query.trim().toLowerCase();
    if (!q) {
        return pool;
    }

    return pool.filter((s) => {
        return (
            s.spokenName.toLowerCase().includes(q) ||
            s.latex.toLowerCase().includes(q) ||
            s.glyph.toLowerCase().includes(q) ||
            s.aliases.some((a) => a.toLowerCase().includes(q)) ||
            s.keywords.some((k) => k.toLowerCase().includes(q))
        );
    });
}
