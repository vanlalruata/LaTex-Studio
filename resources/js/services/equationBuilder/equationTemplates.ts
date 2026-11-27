export interface EquationTemplateEntry {
    id: string;
    title: string;
    category: 'core' | 'calculus' | 'linear_algebra' | 'probability' | 'ml_cs' | 'physics';
    latex: string;
    description: string;
    requiredPackages: string[];
}

export const EQUATION_TEMPLATES: EquationTemplateEntry[] = [
    {
        id: 'tpl_fraction',
        title: 'Fraction',
        category: 'core',
        latex: '\\frac{a}{b}',
        description: 'Standard display/inline fraction',
        requiredPackages: [],
    },
    {
        id: 'tpl_sqrt',
        title: 'Square Root',
        category: 'core',
        latex: '\\sqrt{x^2 + y^2}',
        description: 'Radical expression',
        requiredPackages: [],
    },
    {
        id: 'tpl_quadratic',
        title: 'Quadratic Formula',
        category: 'core',
        latex: 'x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
        description: 'Roots of a quadratic equation',
        requiredPackages: [],
    },
    {
        id: 'tpl_sum',
        title: 'Summation',
        category: 'calculus',
        latex: '\\sum_{i=1}^{n} x_i',
        description: 'Indexed summation with bounds',
        requiredPackages: [],
    },
    {
        id: 'tpl_integral',
        title: 'Definite Integral',
        category: 'calculus',
        latex: '\\int_{a}^{b} f(x)\\,dx',
        description: 'Definite integral over [a, b]',
        requiredPackages: [],
    },
    {
        id: 'tpl_limit',
        title: 'Limit Definition',
        category: 'calculus',
        latex: '\\frac{\\partial f}{\\partial x} = \\lim_{h \\to 0} \\frac{f(x + h) - f(x)}{h}',
        description: 'Partial derivative limit definition',
        requiredPackages: [],
    },
    {
        id: 'tpl_matrix',
        title: 'Matrix (2x2)',
        category: 'linear_algebra',
        latex: '\\begin{pmatrix}\n  a & b \\\\\n  c & d\n\\end{pmatrix}',
        description: 'Parenthesized 2x2 matrix',
        requiredPackages: ['amsmath'],
    },
    {
        id: 'tpl_cases',
        title: 'Cases / Piecewise',
        category: 'core',
        latex: 'f(x) = \\begin{cases}\n  x^2 & \\text{if } x \\geq 0 \\\\\n  -x & \\text{if } x < 0\n\\end{cases}',
        description: 'Piecewise function definition',
        requiredPackages: ['amsmath'],
    },
    {
        id: 'tpl_align',
        title: 'Aligned Derivation',
        category: 'core',
        latex: '\\begin{aligned}\n  f(x) &= (x + 1)^2 \\\\\n       &= x^2 + 2x + 1\n\\end{aligned}',
        description: 'Multi-line aligned equations',
        requiredPackages: ['amsmath'],
    },
    {
        id: 'tpl_bayes',
        title: 'Bayes Theorem',
        category: 'probability',
        latex: 'P(A \\mid B) = \\frac{P(B \\mid A) P(A)}{P(B)}',
        description: 'Conditional posterior probability',
        requiredPackages: ['amsmath'],
    },
    {
        id: 'tpl_ridge',
        title: 'Ridge Objective',
        category: 'ml_cs',
        latex: '\\hat{\\boldsymbol{\\theta}} = \\arg\\min_{\\boldsymbol{\\theta}} \\left\\| \\mathbf{X}\\boldsymbol{\\theta} - \\mathbf{y} \\right\\|_2^2 + \\lambda \\|\\boldsymbol{\\theta}\\|_2^2',
        description: 'L2-regularized least squares objective',
        requiredPackages: ['amsmath'],
    },
    {
        id: 'tpl_attention',
        title: 'Scaled Dot-Product Attention',
        category: 'ml_cs',
        latex: '\\operatorname{Attention}(Q, K, V) = \\operatorname{softmax}\\left(\\frac{QK^{\\top}}{\\sqrt{d_k}}\\right) V',
        description: 'Transformer attention mechanism',
        requiredPackages: ['amsmath'],
    },
    {
        id: 'tpl_schrodinger',
        title: 'Schrödinger Equation',
        category: 'physics',
        latex: 'i\\hbar \\frac{\\partial}{\\partial t} \\Psi(r, t) = \\hat{H} \\Psi(r, t)',
        description: 'Time-dependent quantum wave equation',
        requiredPackages: [],
    },
];
