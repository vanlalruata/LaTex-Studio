# 03 — Feature Requirements and Prioritization

Priority labels:
- **P0:** required for first dependable public release.
- **P1:** high-value research workflow after core stability.
- **P2:** advanced differentiator.
- **P3:** long-term expansion/research.

## 1. User accounts and administration

| Feature | Priority | Acceptance notes |
|---|---:|---|
| Registration, login, reset, email verification | P0 | Secure session and rate limits |
| Project-scoped authorization | P0 | Policy checked on every operation |
| Admin user/project search | P1 | Search, bulk action and audit |
| Organization/team accounts | P1 | Membership, invitations and quotas |
| SSO OIDC/OAuth | P1 | Provider adapter and secure token lifecycle |
| SAML / LDAP | P2 | Institutional deployments |
| Session/device management | P1 | Revoke sessions and audit |
| i18n | P2 | Externalized UI strings; test RTL/Unicode if supported |
| ARM64 support | P2 | Multi-arch image tests, not assumed automatically |

## 2. Project and file management

- Create, rename, duplicate, archive and delete project.
- Import/export project ZIP with traversal-safe extraction.
- File/folder create, upload, rename, move, delete, download.
- Root document selection.
- Multi-file project support.
- Project settings: compiler, engine version, build profile, bibliography tool, auto-compile.
- Drag-and-drop assets.
- File history and restore.
- Project templates and private template gallery.
- Project usage and storage display.

## 3. Editor and language services

- Monaco editor with `.tex`, `.bib`, `.cls`, `.sty`, `.bst`, `.md`, `.typ`, `.py`, `.json` language modes.
- Syntax highlighting, brace matching, folding, snippets, search/replace, multi-cursor and configurable keybindings.
- Symbol palette for Greek letters, operators, relations, arrows, delimiters and common commands.
- Project-aware autocomplete for commands, environments, labels, references, citation keys and file paths.
- Hover docs and formula preview.
- Go to definition/reference for labels, macros and inputs where resolvable.
- Outline and document symbols.
- Diagnostics: missing files, duplicate labels, unresolved references, malformed braces/environments and compile log messages.
- Diff editor and review mode.
- Accessible keyboard-first workflows.

## 4. Compilation and PDF

- pdfLaTeX, XeLaTeX, LuaLaTeX.
- latexmk multi-pass compilation.
- BibTeX/Biber, MakeIndex, MakeGlossaries.
- Package profiles: standard, research, extended.
- Version-pinned worker images.
- Logs and normalized diagnostics.
- Timeout/cancel/retry.
- Resource metrics.
- PDF validation and artifact lifecycle.
- Last-successful-PDF retention.
- PDF.js: thumbnails, zoom, search, selection, full-screen and download.
- SyncTeX forward/inverse navigation after validation.
- Compile history and reproducible metadata.
- Optional Typst compiler as separate project engine in later tier.

## 5. Bibliography and reference workflows

- BibTeX editor with syntax validation.
- Search all `.bib` entries by author/title/year/keyword/DOI.
- Duplicate key and missing key detection.
- Citation completion and citation preview.
- BibTeX/Biber build detection.
- Zotero integration with user authorization.
- Mendeley only after API availability, OAuth scopes and terms are checked.
- Import/export BibTeX, RIS and CSL JSON.
- Citation metadata enrichment via trusted external APIs only when enabled.
- Never fabricate references or DOIs in AI-generated suggestions.

## 6. Collaboration and review

- Invite collaborators and define Owner, Editor, Reviewer, Commenter, Viewer roles.
- Presence and active collaborator indicators.
- Comments anchored to line/range or document nodes.
- Resolve/reopen threads.
- Suggestions/track changes.
- Accept/reject/revert changes.
- Revision compare and restore.
- Activity feed and review digest.
- Sharing links with expiry, revocation and access scope.
- Organization-wide project sharing policy.

## 7. Visual academic tools

| Tool | Output | Priority |
|---|---|---:|
| Symbol palette | Inserted LaTeX symbol/command | P1 |
| Visual LaTeX table editor | `tabular`, `tabularx`, `longtable` etc. | P1 |
| TikZ figure builder | TikZ source and preview | P2 |
| PSTricks figure builder | PSTricks source | P3 |
| Probability tree editor | TikZ code | P2 |
| Sign/variation table builder | `tkz-tab` source | P2 |
| tcolorbox designer | Theorem/definition/remark source | P2 |
| Equation builder | LaTeX math source | P2 |
| Flowchart/algorithm visualizer | TikZ/algorithm source | P3 |
| Interactive math graphs | SVG/JSXGraph or TikZ export | P3 |

All visual tools should generate transparent source code. Users must be able to inspect/edit generated code; never lock the user into opaque visual objects.

## 8. AI-assisted authoring

- Project-aware AI chat with explicit selected context.
- Compile-error explanation based on log and source range.
- Proposed fix as a diff; accept/reject/revert.
- Explain a LaTeX command or package.
- Improve grammar/clarity while preserving scientific meaning.
- Structural review and checklist.
- Methodology/statistical consistency checks with warnings, not unsupported assertions.
- Reference/citation consistency check.
- Figure/table caption suggestions.
- Journal formatting/page-limit suggestions.
- Overnight/periodic activity summary only if user opts in.
- MCP server for scoped read/write/compile/comment tools.
- AI usage quotas and audit.
- Provider abstraction (local or external).
- Data minimization and privacy controls.

## 9. Conversion and Typst

- DOCX → LaTeX and LaTeX → DOCX.
- Markdown → LaTeX/PDF.
- Quarto/RMarkdown/Obsidian pathways.
- HTML/EPUB/ODT exporters.
- Conversion report: preserved, transformed, unsupported, omitted.
- Keep original file untouched.
- Typst as a second document language with separate compiler and `.typ` project files.
- LaTeX↔Typst conversion is best-effort and must identify unsupported packages/macros/layout constructs.
- Never imply Typst is a drop-in replacement for arbitrary LaTeX publisher templates.

## 10. Git and cloud integrations

- GitHub, GitLab, Gitea and generic Git remote.
- Clone, pull, push, branch and sync status.
- Conflict detection and explicit merge workflow.
- OAuth app and token scopes.
- Dropbox two-way sync (P2).
- Conflict-safe sync: never overwrite a newer remote/local revision without conflict detection.
- Webhooks for commit/build status.
- Export source ZIP regardless of integration availability.

## 11. Python and research execution

- Per-project Python script runner (P2).
- Isolated execution image with curated dependencies.
- No unrestricted terminal.
- Network disabled by default.
- Explicit project inputs/outputs.
- CPU/RAM/time/file quotas.
- Job logs and generated artifacts.
- Later: R/knitr and Quarto pipeline after separate risk/feasibility tests.

## 12. Office suite decision

A browser-based Word/Excel/PowerPoint suite would materially expand scope and operational burden. Do not build this into the LaTeX MVP. Consider a separate document module or integration only after core research-writing workflows are mature. Office files may initially be imported/exported using conversion services without promising full editing parity.
