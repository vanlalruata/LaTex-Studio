# 6. Visual Equation Builder and Mathfield

## 6.1 Recommended interaction model
Evaluate MathLive as the primary interactive mathfield candidate. It offers an editable mathfield, LaTeX-based input, virtual keyboard customization and a broad command set. Validate exact version, Vue integration, accessibility and licensing before adoption.

Keep Monaco as the full raw-source editor. The mathfield is optimized for structured mathematical interaction; Monaco is optimized for arbitrary LaTeX source and environments.

## 6.2 Mathfield capabilities
- Click-to-position caret.
- Keyboard navigation through expression structure.
- Selection and replacement.
- Placeholder navigation.
- Fraction/root/matrix structures.
- Superscript/subscript.
- Delimiter insertion.
- Virtual keyboard.
- Undo/redo.
- Copy/paste LaTeX.
- Configurable keybindings.
- Mobile-friendly touch input.
- Custom macros only from approved, non-executable metadata where feasible.

## 6.3 Structure palette
Provide visual insert cards for:
- fractions
- roots
- powers/subscripts
- sums/products
- integrals
- limits
- matrices
- determinants
- cases
- accents
- brackets
- aligned equations
- derivatives
- vectors
- probability/statistics
- arrows and annotated relations

When inserted, create editable placeholders and move focus to the first required argument.

## 6.4 Equation tree
For supported expressions, show a navigable tree:
- root expression
- operator
- operands
- function
- argument
- relation
- subexpression
- matrix rows/cells
- environment rows/alignment points

Selecting a tree node selects the corresponding mathfield region where supported.

## 6.5 Clipboard
- Copy as LaTeX.
- Copy as Unicode text when meaningful.
- Copy rendered image only as an explicit export.
- Paste LaTeX and attempt safe parsing.
- Paste plain text and preserve literal meaning.
- Never silently convert unknown text to executable macro content.

## 6.6 Visual editor limitations
Not all TeX syntax has a unique visual tree. Unknown commands, custom macros, package-defined constructs and low-confidence parses must remain source-managed.
