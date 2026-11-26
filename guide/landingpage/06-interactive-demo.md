# 6. Interactive Demo Specification

## 6.1 Purpose

The demo is a product explainer, not a production editor. It should make the writing workflow tangible without running untrusted code or exposing internal services.

## 6.2 Demo layout

Desktop:
- Project/file sidebar (approximately 18%).
- Source editor preview (approximately 42%).
- PDF preview (approximately 40%).
- Compact toolbar above.
- Build/output strip below.

Mobile:
- Tabs: Files / Source / PDF.
- Keep code horizontally scrollable within its own pane.
- Use readable touch targets.

## 6.3 Sample project

Use synthetic project:
`sample-research-paper/`
- `main.tex`
- `sections/introduction.tex`
- `references.bib`
- `figures/workflow-placeholder.svg` (local static asset)
- `sample-preview.pdf` (generated and reviewed static sample, if supplied)

Use fictional title, authors and references. Do not use fake DOI records that look real. Mark sample bibliography as illustrative.

## 6.4 Interactions

- File selection switches displayed source snippet.
- Toolbar compiler selector changes a label only.
- “Compile preview” updates a simulated local status and displays the existing static sample PDF/preview. Clearly label this as a demonstration simulation.
- PDF controls: next/previous page, zoom in/out, fit width, full screen where practical.
- “Reset demo” restores initial state.
- “Open full demo” may navigate to a dedicated demo route.
- No arbitrary source upload, shell commands, network access or actual compilation from anonymous visitors.

## 6.5 Product truthfulness

Use a small visible label: “Interactive preview — sample project”. Add a note that this preview uses sample content and does not compile visitor-provided files.

If a real isolated demo compiler is introduced later, it requires a separate threat model, quotas, anonymous abuse protection, sandboxing and explicit user consent.

## 6.6 Implementation choices

Preferred:
- Vue state for selected file, selected tab, sample page and zoom.
- Static local sample content.
- PDF.js only if the sample PDF is available and licensed/created by the project.
- Otherwise use a designed PDF-page visual representation; do not embed a broken viewer.
- Use syntax-highlighted static source presentation; do not instantiate the full Monaco editor bundle solely for a static marketing preview unless performance budget supports it.
