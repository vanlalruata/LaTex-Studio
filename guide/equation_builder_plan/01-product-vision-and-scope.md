# 1. Product Vision and Scope

## 1.1 Vision
Create an advanced mathematical equation authoring environment for researchers, mathematicians, engineers, computer scientists, educators and students. It must support anything from a simple fraction to long aligned derivations, matrices, tensor notation, multiline systems, chemical equations, commutative diagrams and domain-specific mathematical notation.

The target is not merely a symbol picker. It is a structured mathematical composition environment with visual authoring, direct LaTeX editing, live preview, reusable structures, validation and insertion into academic documents.

## 1.2 Core user journeys
1. Open the equation builder at the current cursor position in Monaco.
2. Type LaTeX directly and see live preview.
3. Construct expressions using visual templates and symbol palettes.
4. Navigate and edit a structured formula with keyboard or pointer.
5. Search all symbol categories by name, command, Unicode glyph or keyword.
6. Build complex environments such as align, cases, matrices and arrays.
7. Validate delimiters, environments and common syntax issues.
8. Insert as inline math, display math, numbered equation or selected environment.
9. Save a reusable formula in personal or project libraries.
10. Reopen and edit an existing supported equation without losing source.
11. Collaborate through comments and version history where project permissions allow.

## 1.3 Scope
### In scope
- Broad mathematical symbol catalogue.
- LaTeX command search and insertion.
- Structured equation templates.
- Interactive mathfield.
- Raw LaTeX source editor.
- Live mathematical preview.
- Multi-line equation/environment builder.
- Matrices, cases, aligned equations and piecewise functions.
- Equation numbering, labels and references.
- Domain-specific symbol categories.
- Formula library, snippets and templates.
- Accessibility and keyboard-first interaction.
- Manuscript insertion and revision-safe editing.
- Preview and compile diagnostics.

### Out of scope initially
- Full symbolic algebra/CAS.
- General-purpose theorem prover.
- Guaranteed rendering of every custom LaTeX package in-browser.
- Arbitrary execution of user-defined TeX macros in the browser.
- A replacement for TeX Live or a custom TeX engine.

## 1.4 Fidelity modes
- **Structured mode:** expression represented by a supported mathematical AST and editable visually.
- **Hybrid mode:** known structures editable, unsupported macros or commands retained as protected source.
- **Source mode:** raw LaTeX is authoritative; preview is best-effort.

Never claim every LaTeX expression can be perfectly reverse-parsed into a visual tree.
