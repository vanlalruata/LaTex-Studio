# 01 — Product Scope and Product Strategy

## 1. Product vision

A self-hosted academic writing and research collaboration platform that combines the reliability and depth of source-based LaTeX with the usability of a modern browser editor, project-aware research tools, visual authoring utilities, version control, and optional AI assistance.

The product should serve:
- Individual researchers and faculty.
- Postgraduate and undergraduate students.
- Supervisors and research groups.
- Departments, laboratories and universities.
- Administrators operating a self-hosted installation.

## 2. Product pillars

### A. LaTeX authoring
- Monaco source editor.
- Multi-file projects and file explorer.
- Syntax highlighting, snippets, symbol palette and command completion.
- Project-aware references, labels, citations and file-path completion.
- Formula hover preview and mathematical diagnostics.
- PDF preview and source/PDF navigation.

### B. Compilation and document output
- pdfLaTeX, XeLaTeX, LuaLaTeX.
- latexmk orchestration.
- BibTeX, Biber, MakeIndex, MakeGlossaries and other tools through capability adapters.
- TikZ, PGFPlots, Gnuplot, Asymptote and image workflows, subject to worker image profile.
- PDF build history and reproducible build metadata.
- Optional Typst compiler adapter in a later release.

### C. Research collaboration
- Unlimited or quota-controlled collaborators based on deployment policy, not a hard-coded per-seat assumption.
- Presence and live cursor awareness.
- Comments and review threads anchored to source ranges.
- Track changes / suggestions with accept and reject.
- Project roles, sharing links with expiration and revocation.
- Activity feed and review summaries.
- Version history, restore and compare.

### D. Reference management
- `.bib` editor and validation.
- Search across all BibTeX entries.
- Duplicate and missing-key detection.
- Zotero OAuth/API integration.
- Mendeley integration only after current API support and permissions are verified.
- Import/export RIS, BibTeX and CSL JSON where feasible.
- Citation style and bibliography backend awareness.

### E. Visual academic tools
- Symbol palette.
- Visual table builder producing LaTeX.
- Figure editor producing TikZ/PSTricks or SVG/PNG assets.
- Probability-tree editor producing TikZ.
- Sign/variation table builder.
- Theorem/definition/remark box designer producing tcolorbox source.
- Later: equation editor, diagram/flowchart editor, algorithm editor.

### F. AI-assisted research writing
- AI chat with project-scoped context.
- Compile-log explanation and fix suggestions.
- All proposed source changes displayed as diffs.
- Accept/reject/revert controls.
- Paper review: structure, clarity, missing evidence, methodology, mathematical consistency, reproducibility checklist.
- Reference/citation consistency checks.
- Table/figure review.
- Journal-template and page-limit assistance.
- Activity digest / co-author feedback summary.
- MCP/API interface for approved AI clients and agents.
- AI never silently changes manuscript source or invents citations/results.

### G. Document conversion and multi-format writing
- DOCX to LaTeX and LaTeX to DOCX, with conversion reports.
- Markdown to LaTeX/PDF.
- Quarto/RMarkdown/Obsidian Markdown import pathways.
- HTML, EPUB and ODT as later exporters/importers.
- Typst projects and LaTeX↔Typst migration experiments.
- Keep source and converted output separate.
- Full office suite (XLSX/PPTX editing) is explicitly a later product expansion, not core LaTeX MVP.

### H. External integrations
- GitHub, GitLab, Gitea and generic Git remotes.
- Dropbox or compatible cloud storage provider.
- Zotero and Mendeley.
- Institutional SSO (OIDC/OAuth, SAML, LDAP).
- MCP server and scoped API tokens.
- Webhooks for build status and project events.

### I. Administration and institutional operation
- User, project, organization and template administration.
- Search and bulk actions.
- Session management and forced logout.
- Audit logs.
- Usage/storage/build quotas.
- Worker health and build queue dashboards.
- Template governance.
- Localization / i18n.
- x86_64 and ARM64 deployment support, validated separately.

## 3. Product boundaries

The first product is a research writing platform, not a full office suite or a general-purpose IDE. It may later host office, Python and interactive graphics tools, but those should be separate modules with distinct sandboxing and resource policies.

Do not implement a generic unrestricted terminal. A controlled Python runner is a separate execution product:
- No access to Laravel secrets or database credentials.
- No host mounts or Docker socket.
- Network disabled by default.
- CPU, RAM, time, process and filesystem quotas.
- Project-scoped input/output.
- Explicit package/runtime profiles.
- Auditable execution history.

## 4. Personas and primary workflows

### Researcher
Create a journal manuscript → import template → upload figures/BibTeX → edit → compile → review PDF → fix errors → export source/PDF.

### Co-author
Receive invitation → inspect comments → edit assigned section → propose changes → discuss → merge/accept → view revision history.

### Supervisor
Review draft → comment on specific source spans → request changes → compare revisions → approve a milestone.

### Administrator
Create organization → configure SSO → manage quotas → install templates → inspect queue/worker health → audit access.

### Research automation agent
Receive scoped MCP token → read allowed files → propose patch → show diff → request approval → compile → return diagnostics. Agent must not exceed permissions granted to the user/token.

## 5. Product principles

1. Source fidelity and user control.
2. Build reproducibility and artifact traceability.
3. Human approval for AI modifications.
4. Strong isolation of all execution workloads.
5. Open formats and project portability.
6. Clear distinction between native support, adapter support and experimental support.
7. Progressive enhancement: source editor first, structured visual editing later.
