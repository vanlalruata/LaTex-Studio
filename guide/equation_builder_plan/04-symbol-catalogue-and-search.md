# 4. Comprehensive Symbol Catalogue and Search

## 4.1 Catalogue principles
The catalogue must be metadata-driven, versioned and searchable. Do not hardcode a few symbol buttons in Vue templates.

Each symbol record should include:
- stable ID
- category and subcategory
- display glyph or preview
- LaTeX command or insertion snippet
- spoken/accessibility name
- keywords and aliases
- package requirement
- math mode requirement
- supported renderer metadata
- examples
- variant relationships
- Unicode code point when applicable
- tags and popularity/frequency

## 4.2 Core symbol categories

### Greek letters
- Lowercase and uppercase Greek.
- Variant forms: varepsilon, vartheta, varphi, varrho, varsigma, varpi.
- Digamma and other supported historical forms.
- Bold Greek and upright Greek where package/command support exists.

### Latin and alphabets
- Latin letters and styled variants.
- Blackboard bold: `\mathbb`.
- Calligraphic: `\mathcal`.
- Script: `\mathscr` where package supported.
- Fraktur: `\mathfrak`.
- Bold: `\mathbf`, `\boldsymbol`, `\bm` where configured.
- Sans serif and monospace math alphabets.
- Upright and italic variants.

### Superscripts and subscripts
- Common Unicode-compatible superscript/subscript characters.
- General LaTeX structural templates for arbitrary expressions.
- Nested sub/superscripts.
- Prescripts and tensor indices where supported.

### Arithmetic and elementary operations
- Plus/minus, times, dot, cross, division.
- Fractions, ratios, modulo.
- Roots, powers, factorials.
- Absolute value, norm, floor, ceiling.
- Big operators and binary operators.

### Relations and comparisons
- Equal/not equal.
- Approximate/equivalent/congruent.
- Less/greater and variants.
- Subset/superset.
- Precedes/succeeds.
- Divides/parallel/perpendicular.
- Proportionality and asymptotic relations.
- Negated relation variants.

### Arrows and mappings
- Left/right/up/down.
- Double arrows.
- Diagonal arrows.
- Harpoons.
- Hook arrows.
- Maps to/from.
- Long arrows.
- Annotated arrows.
- Implies/iff.
- Bidirectional arrows.
- Extensible arrows.

### Set theory
- Membership/non-membership.
- Union/intersection.
- Difference.
- Empty set.
- Subset/superset.
- Cartesian product.
- Power set.
- Set builder structures.
- Complement and symmetric difference.

### Logic and proof
- For all/exists/unique exists.
- Negation.
- And/or.
- Therefore/because.
- Entailment, models and turnstiles.
- Quantifier templates.
- Proof symbols and QED.

### Calculus and analysis
- Derivatives and partial derivatives.
- Higher derivatives.
- Limits and one-sided limits.
- Sums and products.
- Single/multiple/contour/surface integrals.
- Line and volume integrals.
- Gradient, divergence, curl, Laplacian.
- Differential operators.
- Big-O and asymptotic notation.
- Function limits and continuity notation.

### Linear algebra
- Vectors and vector arrows.
- Matrices and determinants.
- Transpose, inverse, rank, trace.
- Eigenvalues/eigenvectors.
- Inner products and norms.
- Tensor products.
- Kronecker products.
- Matrix brackets and augmented matrices.
- Block matrices.

### Probability and statistics
- Probability and conditional probability.
- Expectation, variance, covariance.
- Distributions.
- Independence.
- Estimators and likelihood.
- Confidence intervals.
- Hypothesis tests.
- Summation/statistical notation.
- Set of random variables and sample spaces.

### Geometry and trigonometry
- Angles, degree, parallel/perpendicular.
- Triangles and geometric symbols.
- Sin/cos/tan and hyperbolic functions.
- Inverse trigonometric functions.
- Geometry notation and vectors.

### Number systems
- Natural, integer, rational, real, complex.
- Prime numbers.
- Infinity.
- Cardinality.
- Floor/ceiling and modulo.

### Topology, algebra and abstract structures
- Groups, rings, fields, ideals.
- Homomorphisms and isomorphisms.
- Kernels and images.
- Topological closure/interior/boundary.
- Homeomorphisms.
- Category-theoretic arrows and diagrams where packages support them.

### Physics and engineering
- Units and quantities.
- Vectors and tensors.
- Quantum notation: bra-ket, operators, commutators.
- Electromagnetism symbols.
- Thermodynamics.
- Mechanics.
- Circuit symbols as text notation where applicable.
- Chemical equations and reaction arrows.

### Miscellaneous and typography
- Dots, ellipses, primes.
- Delimiters.
- Braces and brackets.
- Accents and over/under marks.
- Text in math.
- Spacing commands.
- Cancellation and boxing.
- Decorative operators.

## 4.3 Search
Search across:
- visible symbol name
- spoken name
- LaTeX command
- Unicode glyph
- synonyms and aliases
- mathematical domain
- keywords
- package names

Examples:
- Search “not subset” finds `\not\subset` and relevant variants.
- Search “partial derivative” finds `\partial`, derivative templates and examples.
- Search “blackboard real” finds `\mathbb{R}`.
- Search “maps to” finds arrow variants.

## 4.4 Symbol insertion
- Insert at active mathfield cursor.
- Preserve selection semantics.
- Replace selected text only when appropriate.
- Insert structural placeholders and focus first placeholder.
- Show command and description on hover.
- Support favorites and recent symbols.
- Provide copy LaTeX action.
- Do not insert Unicode lookalikes where a semantic LaTeX command is required.

## 4.5 Catalogue governance
- Version catalogue data.
- Record package and renderer compatibility.
- Allow administrator-curated custom symbols and macros at project level.
- Avoid executing arbitrary macro definitions in browser preview.
