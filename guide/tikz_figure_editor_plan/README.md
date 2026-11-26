# Advanced TikZ Figure Editor / Maker — Project Plan

A complete product, architecture, feature, security, testing, roadmap and coding-agent specification for a visual TikZ authoring environment integrated into the research-writing platform.

## Target stack
- Laravel 13 / PHP
- Inertia.js 3
- Vue 3.5 / TypeScript
- Tailwind CSS 4.1
- shadcn-vue as the exclusive UI component system
- MySQL, Redis, Laravel Reverb where appropriate
- Monaco Editor for TikZ source
- SVG-based interactive canvas and object model
- TeX Live in isolated Docker workers for authoritative rendering
- PDF.js or SVG preview pipeline for rendered artifacts

## Documents
1. `01-product-vision-and-scope.md`
2. `02-workspace-and-information-architecture.md`
3. `03-feature-catalogue.md`
4. `04-canvas-object-model-and-editing.md`
5. `05-shapes-connectors-and-geometry.md`
6. `06-styling-labels-math-and-layout.md`
7. `07-academic-diagram-makers.md`
8. `08-tikz-code-engine-and-round-tripping.md`
9. `09-rendering-export-and-main-editor-integration.md`
10. `10-architecture-data-and-api.md`
11. `11-security-performance-and-reliability.md`
12. `12-shadcn-vue-ux-and-accessibility.md`
13. `13-testing-and-acceptance.md`
14. `14-phased-implementation-roadmap.md`
15. `15-coding-agent-master-prompt.md`

## Core principles
- TikZ source is the authoritative output format for TikZ figures.
- The visual object model is authoritative only for figures created or fully understood by the visual editor.
- Never silently discard or rewrite unsupported raw TikZ constructs.
- Use a structured scene graph; do not treat arbitrary SVG as the editable source model.
- TeX Live compilation is the authoritative correctness check.
- The canvas preview is an editing aid, not proof that the generated TikZ will compile.
- All compilation is isolated; no TeX execution in the Laravel web process.
- Use shadcn-vue exclusively for UI components.
- Deliver incrementally, with Phase 0 architecture review before coding.
