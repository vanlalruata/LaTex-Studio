# 13. Testing and Acceptance

## 13.1 Canvas tests
- Create, select, move, resize, rotate, delete objects.
- Multi-select and grouping.
- Layer order.
- Alignment and distribution.
- Snap and guides.
- Undo/redo.
- Named anchors and connectors.
- Large diagram performance.

## 13.2 Code generation tests
- Deterministic output.
- Correct node and coordinate syntax.
- Paths and connectors.
- Arrow tips.
- Styles and scopes.
- Math labels.
- Libraries and package requirements.
- Source map offsets.
- Escaping and brace handling.

## 13.3 Import/parser tests
- Supported constructs parse correctly.
- Unknown commands preserved.
- Nested braces and options.
- Protected source blocks survive edits.
- Hybrid mode reports unsupported sections.
- Source revision conflicts are detected.

## 13.4 Compilation tests
Compile representative diagrams using the actual worker image:
- Basic flowchart.
- System architecture.
- Neural network.
- Mathematical geometry.
- Graph.
- Decorations and patterns.
- Rotated labels.
- External image inclusion.
- Custom styles.
- Supported imported TikZ.

Verify output artifacts and logs. Use PDF/SVG visual regression where feasible.

## 13.5 Security tests
- Malicious TeX.
- Shell escape attempts.
- ZIP traversal.
- Unsafe SVG.
- Remote resource references.
- Resource exhaustion.
- Unauthorized project/figure access.
- Oversized geometry and payloads.

## 13.6 Acceptance criteria
A feature is complete only when:
- UI state and persisted model agree.
- Source generation is deterministic.
- Unsupported code is preserved.
- TeX compilation test passes for supported feature.
- Permissions are enforced.
- Error and recovery states exist.
- Keyboard/accessibility review is performed.
