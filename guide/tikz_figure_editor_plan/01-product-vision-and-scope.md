# 1. Product Vision and Scope

## 1.1 Vision
Build a professional visual TikZ figure authoring environment that lets researchers construct diagrams visually, edit TikZ source directly, validate output through real TeX compilation, and reuse figures across manuscripts.

## 1.2 Target users
- Researchers and academics.
- Mathematics, computer science, engineering and physics authors.
- Students writing theses and dissertations.
- Authors of algorithms, workflows, neural networks, system architectures, graphs, plots and mathematical diagrams.
- LaTeX users who want visual assistance without giving up source control.

## 1.3 Core user journeys
1. Create a blank figure and draw shapes/connectors.
2. Start from a diagram template and customize it.
3. Generate a specialized diagram using a guided maker.
4. Import supported TikZ source and edit visually.
5. Edit TikZ code manually and preview the result.
6. Compile and validate the figure.
7. Save it in the project library.
8. Insert it into a manuscript with caption, label and package requirements.
9. Export TikZ source, standalone TeX, PDF, SVG or PNG where supported.

## 1.4 Scope
### In scope
- General-purpose vector-like canvas for TikZ constructs.
- Shapes, paths, connectors, nodes, coordinates, decorations and annotations.
- Mathematical labels and text.
- Styling and geometry inspector.
- Layers, grouping, alignment, distribution, snapping and guides.
- Specialized academic diagram makers.
- TikZ code editor and source preview.
- Import/export and main manuscript integration.
- Templates and reusable styles.
- Real TeX Live rendering and diagnostics.
- Versioning and collaboration hooks.

### Out of scope for initial release
- Full support for every TikZ library and arbitrary macro.
- A replacement for a general-purpose vector design suite.
- A complete PGFPlots GUI for every plot type.
- Arbitrary external shell commands.
- Arbitrary package downloads at render time.
- Guaranteed round-trip editing of all hand-written TikZ.
- A proprietary TeX typesetting engine.

## 1.5 Fidelity modes
Expose three clear modes:
- **Visual-native:** created with the editor's structured object model; round-trip editing supported.
- **Hybrid:** supported TikZ constructs editable, unknown constructs retained as protected source blocks.
- **Source-only:** arbitrary or unsupported TikZ remains editable in code mode, with compiled preview.

Never label a source-only diagram as fully visually editable.
