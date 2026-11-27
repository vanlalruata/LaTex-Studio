# 15. Phased Implementation Roadmap

## Phase 0 — Repository and technology assessment
- Inspect current editor and shadcn-vue setup.
- Evaluate MathLive integration and licensing.
- Evaluate MathJax 4 preview configuration and extensions.
- Confirm KaTeX role if fast subset rendering is useful.
- Define symbol metadata schema.
- Define AST and source preservation model.
- Define manuscript insertion contract.
- Create UI wireframes and test corpus.
Stop for approval.

## Phase 1 — Advanced version of current Equation Laboratory
- Preserve compact dialog.
- Searchable symbol catalogue.
- Expanded categories.
- Templates.
- Live preview.
- Cursor-aware insertion.
- Inline/display modes.
- Basic validation.

## Phase 2 — Interactive mathfield
- MathLive adapter prototype.
- Virtual keyboard.
- Structural editing.
- Selection/caret support.
- Undo/redo.
- Mobile interaction.

## Phase 3 — Structured equation builder
- Fraction/root/script structures.
- Matrices and arrays.
- Cases and piecewise functions.
- Aligned/multiline environments.
- Calculus and linear algebra templates.
- Equation tree for supported subset.

## Phase 4 — Source editor and parser
- Monaco integration.
- LaTeX tokenizer/parser for supported grammar.
- AST and source spans.
- Hybrid/source-only modes.
- Protected source segments.
- Deterministic serialization.

## Phase 5 — Advanced symbols and domain libraries
- Full metadata catalogue.
- Probability/statistics.
- Logic/set theory.
- Physics/chemistry.
- Topology/abstract algebra.
- User-defined macros/symbol metadata with safe constraints.

## Phase 6 — Manuscript and reference integration
- Inline/display/numbered insertion.
- Labels/tags/references.
- Package requirement handling.
- Existing equation edit.
- Revision conflict detection.

## Phase 7 — Formula library and collaboration
- Personal/project formula library.
- Templates and snippets.
- Comments and revision history.
- Shared formula collections.

## Phase 8 — Accessibility, performance and release hardening
- Screen-reader tests.
- MathML/speech.
- Mobile virtual keyboard.
- Renderer compatibility matrix.
- TeX Live test corpus.
- Security and performance review.

## Release strategy
Use feature flags. Ship each phase only after acceptance tests pass. Avoid claiming “all LaTeX supported”; publish an explicit renderer and structured-editor compatibility matrix.
