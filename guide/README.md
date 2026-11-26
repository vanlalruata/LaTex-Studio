# Independent Research Writing Platform
## Complete Product Blueprint, Architecture, Implementation Roadmap and Master Development Prompt

**Document version:** 2.0  
**Prepared:** 26 November 2026  
**Status:** Consolidated planning baseline — subject to Phase 0 approval  
**Target stack:** Laravel 13 · Inertia.js 3 · Vue 3.5 · TypeScript · Tailwind CSS 4.1 · MySQL · Redis · Monaco · PDF.js · Docker

> **Project identity:** Working title only. The product name has not yet been selected.

---

## 1. What this project is

Build an independent, self-hosted, browser-based research-writing environment for LaTeX and adjacent document workflows. It should become more than an online LaTeX editor: a researcher should be able to create and organize a project, write and compile LaTeX, inspect a PDF, manage citations, collaborate with co-authors, review revisions, import/export documents, create figures and tables, use carefully controlled AI assistance, and connect external research tools.

The product must be developed as its own codebase and application. The team may research public products and repositories for feature discovery, workflow analysis, and technical lessons. Do not fork, clone, or copy a complete competitor's application as the implementation strategy.

## 2. Consolidated technical decisions

| Area | Decision |
|---|---|
| Backend | Laravel 13 / PHP |
| Frontend | Inertia.js 3, Vue 3.5, TypeScript |
| Styling | Tailwind CSS 4.1 |
| Authorization | Laravel Policies + Spatie Laravel Permission for global/organization roles; project membership remains explicitly scoped |
| Database | MySQL |
| Queue/cache/locks | Redis |
| Realtime | Laravel Reverb, introduced after persistence semantics are reliable |
| Code editor | Monaco Editor |
| PDF viewer | Mozilla PDF.js |
| Compiler compatibility | TeX Live in isolated, version-pinned Docker workers; optional Tectonic adapter after validation |
| Build orchestration | First-party Laravel domain services and worker protocol |
| Document conversion | First-party conversion framework and document model; optional Pandoc adapter |
| OCR | Provider interface; optional isolated Python service for model ecosystem compatibility |
| Deployment | Ubuntu VPS, Nginx/TLS, Docker workers, private storage and tested backups |
| Source editing | Monaco; do not replace with CodeMirror |
| Collaboration | Design later, after reliable revision and conflict semantics |
| Long-term objective | First-party LaTeX analysis, mathematics engine, document model, conversion services, and eventually a limited independent typesetting engine |

## 3. Core architectural position

“Independent engine” has several meanings and must not be conflated:

1. **Platform/orchestration engine:** projects, files, revisions, build scheduling, diagnostics, worker lifecycle, artifact management, quotas and audit. Build this first.
2. **LaTeX language engine:** lexer, parser, source-preserving syntax tree, command/environment metadata, references, citations, diagnostics and editor intelligence. Build incrementally.
3. **Mathematics engine:** math-region detection, math lexer/parser, AST, validation and rendering. Build incrementally.
4. **Document engine:** structured academic document model, importers/exporters and loss-aware conversion. Build incrementally.
5. **Typesetting engine:** TeX-compatible macro expansion, catcodes, layout, fonts, line/page breaking, mathematics layout and PDF output. This is a long-term research programme, not an MVP requirement.

Use TeX Live as the initial compatibility backend. This does not make the product a clone or a dependent application: the platform owns the workflow, orchestration, APIs, data model and user experience. A home-grown parser cannot compile arbitrary LaTeX, and the plan must never claim otherwise.

## 4. New feature discoveries incorporated

The additional product research expands the earlier plan with the following capabilities:

- GitHub, GitLab and Gitea synchronization; generic Git bridge; Dropbox synchronization.
- Zotero and Mendeley integrations; advanced BibTeX library search.
- SSO with OIDC/OAuth 2.0, SAML and LDAP where required.
- Track changes, suggestions, comments, review threads and full project history.
- Private template gallery, organization templates, symbol palette and internationalization.
- AI chat, AI compile-error assistant, AI paper review, suggested changes as reviewable diffs, overnight activity summaries and MCP tools.
- Controlled Python/script execution for research projects, isolated from the web and compiler control plane.
- Visual editors for TikZ/PSTricks figures, tables, probability trees, sign/variation tables and theorem/tcolorbox structures.
- Markdown/Quarto/RMarkdown/Obsidian-to-LaTeX/PDF pathways.
- Office document workflows, with DOCX/ODT first and XLSX/ODS/PPTX only as a separate later document-suite decision.
- Typst as an additional document engine and migration path, not a replacement for native LaTeX.
- Bulk project administration, user/session administration, audit logs, usage quotas and multi-architecture deployment.

These features are not all first-release requirements. See `06-ROADMAP.md` for sequencing.

## 5. The first public release

The first public release should prioritize the dependable core:

- Secure registration/login and project-level authorization.
- Project dashboard, folders/files, import/export ZIP and templates.
- Monaco editor with autosave and source revisions.
- Isolated TeX Live compilation for pdfLaTeX, XeLaTeX and LuaLaTeX.
- latexmk multi-pass orchestration and BibTeX/Biber where supported.
- Build logs, normalized diagnostics and queue-aware compilation.
- PDF.js preview and download.
- Last-successful-PDF retention after failed builds.
- Security quotas, backups, audit basics and admin operations.

AI, visual editors, cloud integrations, collaboration and Typst follow after the core has passed real-manuscript tests.

## 6. How to use this specification

1. Read `01-PRODUCT-SCOPE.md` and approve the product boundary.
2. Read `02-ARCHITECTURE.md` and approve service boundaries.
3. Review `03-FEATURE-REQUIREMENTS.md` and `04-ENGINE-DESIGN.md`.
4. Complete Phase 0 and Phase 1 in `06-ROADMAP.md` before broad implementation.
5. Use `12-MASTER-DEVELOPMENT-PROMPT.md` with an AI coding agent only after the first architecture review.
6. Implement one vertical slice at a time. Do not ask an agent to generate the entire platform in one pass.

## 7. Important research and licensing caution

AyakaLeaf Pro is explicitly described by its repository as an enhanced Overleaf Community Edition codebase and the repository identifies AGPL-3.0. Its feature set and operational documentation are useful references, but copying/adapting its code would change the legal and architectural character of this project. The selected direction is an independent application. Treat its source as feature/architecture research only unless a separate legal review authorizes reuse.

The public websites reviewed are dynamic products. This audit reflects content publicly visible and retrievable on 26 November 2026; it is not a source-code audit of private application backends, authenticated product areas, or every page ever published. Product claims and prices may change.

See `13-RESEARCH-AUDIT-AND-SOURCES.md`.
