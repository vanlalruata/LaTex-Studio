# Advanced Mathematics Equation Builder — Complete Implementation Plan

This package specifies a professional mathematical equation authoring environment for the research-writing platform. It expands the supplied “LaTeX Equation Laboratory” screenshot into a full equation editor, symbol system, structured formula builder, source editor, validation and manuscript integration workflow.

## Required stack
- Laravel 13 / PHP
- Inertia.js 3
- Vue 3.5 + TypeScript
- Tailwind CSS 4.1
- **shadcn-vue as the exclusive UI component system**
- MySQL, Redis where appropriate, Laravel Reverb where collaboration requires it
- Monaco Editor for raw LaTeX source
- MathLive evaluation as the primary interactive mathfield candidate
- MathJax 4 evaluation for broad TeX-oriented preview and MathML/accessibility capabilities
- TeX Live isolated workers for authoritative document compilation

## Key design decision
Do not build a new TeX typesetting engine. Build the platform's own equation-authoring experience, structured equation model, symbol catalogue, template system, validation, insertion and revision workflows. Use specialized libraries behind adapters for interactive editing and preview, while TeX Live remains authoritative for the manuscript output.

## Documents
1. `01-product-vision-and-scope.md`
2. `02-analysis-of-supplied-screenshot.md`
3. `03-workspace-and-user-experience.md`
4. `04-symbol-catalogue-and-search.md`
5. `05-equation-structures-and-mathematical-domains.md`
6. `06-visual-equation-builder-and-mathfield.md`
7. `07-latex-source-and-structured-document-model.md`
8. `08-preview-validation-and-accessibility.md`
9. `09-templates-snippets-and-reusable-library.md`
10. `10-manuscript-integration-and-collaboration.md`
11. `11-architecture-data-and-api.md`
12. `12-security-performance-and-reliability.md`
13. `13-shadcn-vue-ux-and-accessibility.md`
14. `14-testing-and-acceptance.md`
15. `15-phased-roadmap.md`
16. `16-coding-agent-master-prompt.md`
17. `17-technology-evaluation-and-sources.md`

## Non-negotiable principles
- LaTeX source is exportable and remains available to the researcher.
- Visual and source editing are synchronized only where the expression can be represented safely.
- Do not claim support for every possible TeX macro through a browser renderer.
- Keep preview errors distinct from actual TeX compilation errors.
- Never silently replace selected manuscript content.
- Do not execute arbitrary TeX or macros in the browser.
- Package requirements are visible and managed safely.
- All UI components use shadcn-vue; native semantic HTML is allowed for content structure.
- Phase 0 is analysis and approval, not coding.
