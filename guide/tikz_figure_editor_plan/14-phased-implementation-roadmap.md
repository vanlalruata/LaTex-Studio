# 14. Phased Implementation Roadmap

## Phase 0 — Repository and technical assessment
- Inspect application and shadcn-vue.
- Evaluate canvas interaction/rendering options.
- Define scene graph and coordinate system.
- Define TikZ supported grammar.
- Design source maps and hybrid mode.
- Define rendering worker contract.
- Prepare wireframes and acceptance corpus.
Stop for approval.

## Phase 1 — Canvas foundation
- Workspace shell.
- Canvas pan/zoom.
- Grid/rulers/guides.
- Selection and object transforms.
- Basic shapes and text.
- Layers and undo/redo.

## Phase 2 — TikZ-native objects
- Nodes and coordinates.
- Paths and connectors.
- Anchors and ports.
- Arrowheads.
- Styles, fills and borders.
- Mathematical labels.

## Phase 3 — Source engine
- Monaco integration.
- TikZ generator.
- Source maps.
- Supported-subset parser.
- Visual-native/hybrid/source-only modes.
- Protected source segments.

## Phase 4 — Rendering and export
- Isolated TeX worker.
- Preview and diagnostics.
- PDF/PNG/SVG export.
- Figure library and revisions.
- Main manuscript insertion.

## Phase 5 — Academic makers
- Flowchart.
- System architecture.
- Neural network.
- ML workflow.
- Graph theory.
- Mathematical diagrams.
- Template gallery.

## Phase 6 — Advanced TikZ features
- Matrices.
- Decorations.
- Patterns.
- Clipping.
- Fit/backgrounds.
- Chains.
- Coordinate calculations.
- Advanced transformations.

## Phase 7 — PGFPlots maker
Separate axis/data model and generator. Add charts, legends, CSV import and scientific plotting.

## Phase 8 — Collaboration and refinement
- Figure comments.
- Shared review.
- Optional real-time editing after concurrency design.
- Accessibility and performance hardening.

## Release gates
- Feature flags.
- TeX compile corpus.
- Security sign-off.
- Export/source round-trip checks.
- User acceptance before enabling broad rollout.
