# 17. Technology Evaluation and Sources

This section distinguishes product architecture recommendations from facts documented by the referenced libraries. Verify exact package versions, APIs and licenses during Phase 0 before adding dependencies.

## 17.1 MathLive — interactive mathfield candidate
MathLive describes its `<math-field>` as an editable math input component built around LaTeX, with a virtual keyboard and extensibility. Its site advertises support for a broad set of LaTeX commands and scientific-computing use cases.

Recommended role:
- Interactive visual/structured mathfield.
- Keyboard and virtual keyboard.
- LaTeX serialization.
- Cursor-aware symbol and template insertion.

Do not treat it as a complete arbitrary LaTeX parser or TeX typesetting engine.

Sources:
- https://mathlive.io/mathlive/
- https://mathlive.io/mathlive/guides/getting-started/
- https://mathlive.io/mathfield/api/
- https://mathlive.io/mathfield/changelog/

## 17.2 MathJax 4 — preview and accessibility candidate
MathJax supports TeX input and converts it to an internal mathematical representation, essentially MathML, for output processing. Its documentation explicitly notes that its TeX input is an implementation of a subset of LaTeX macros, not actual full LaTeX, and not all packages/macros are available.

Recommended role:
- Broad browser preview.
- MathML output and accessibility integration.
- Configurable extension set.
- Speech/accessibility enhancements where supported.

Do not claim that MathJax preview guarantees TeX Live compilation.

Sources:
- https://docs.mathjax.org/en/stable/input/tex/index.html
- https://docs.mathjax.org/en/latest/input/tex/extensions/
- https://docs.mathjax.org/en/latest/web/components/input.html
- https://mathjax.github.io/MathJax-a11y/docs/

## 17.3 KaTeX — optional fast renderer
KaTeX provides a fast math renderer and documents its supported commands/environments. Its supported subset differs from full TeX/LaTeX and from other renderers.

Recommended role:
- Optional fast preview for a known supported subset.
- Do not use as the only correctness validator.

Sources:
- https://katex.org/docs/supported
- https://katex.org/docs/autorender

## 17.4 MathQuill — alternative candidate
MathQuill offers editable math fields and LaTeX get/set APIs. It may be evaluated as an alternative, but the architecture should avoid binding the whole product model to one editor library.

Sources:
- https://docs.mathquill.com/en/latest/
- https://docs.mathquill.com/en/latest/Getting_Started/
- https://docs.mathquill.com/en/latest/Config/

## 17.5 Recommended division of responsibility
- MathLive: interactive input candidate.
- Monaco: full raw source editor.
- MathJax: broad preview/accessibility candidate.
- KaTeX: optional fast subset preview.
- TeX Live: authoritative manuscript compilation.
- Platform-owned AST/catalogue/template/insertion/revision systems: product-specific logic.

## 17.6 Licensing and version checks
Before adoption:
- Check current license text and dependency notices.
- Pin exact package versions.
- Check Vue custom-element integration and SSR/Inertia behaviour.
- Check CSP and self-hosting needs.
- Check accessibility and virtual keyboard behaviour.
- Record package versions in a dependency register.
