# LaTeXStudio Implementation Status and Next Steps

This roadmap turns the product, architecture, feature, security, operations, UI, and landing page guides into a repository-aware delivery sequence. The source guides remain the full requirements; this file records implementation order and release gates. Status reflects the repository at commit `595d2f8`.

## Product rules to preserve

- Keep the platform self-hostable and make project ownership and organization membership explicit at every server boundary.
- Treat builds as immutable snapshots. A failed or stale build must never replace the last successful PDF.
- Run TeX and document conversion work in isolated, resource-limited workers; expose queue, timeout, cancellation, retry, and health state to administrators.
- Keep generated LaTeX visible and editable. AI suggestions require a human review and apply step.
- Preserve source files through imports, conversion, OCR, and restore operations; explain lossy conversions.
- Public feature claims must come from the feature catalog. Hide pricing when the configured mode is free or no active public plan exists.
- Use the existing Laravel, Inertia Vue, TypeScript, Wayfinder, and shadcn-vue patterns. Reuse existing models and components before introducing new dependencies.

## Repository status

### Delivered in committed work

- Core Laravel/Inertia application, authentication, projects, organizations, memberships, file workspace, editor/PDF shell, revisions, compile orchestration, diagnostics, SyncTeX, collaboration and AI foundations.
- Public site layout, marketing pages, interactive sample demo, pricing visibility/settings, contact enquiries, SEO routes, and administrator management for those records.
- Seeders for public content and representative project/workspace data.
- Visual table designer, source generation, style presets, template profiles, and workspace insertion.
- Administrator catalog for features and templates.
- Operational administrator pages for overview, users and admin roles, project search/archive, organization quotas, audit events, and usage/build summaries. Routes are under `/admin` and the sidebar exposes the sections.

### Treat as in progress until separately reviewed and committed

The shared worktree contains additional work for revisions, compilation controls, collaboration, research tools, and table design. Do not count it as delivered based solely on files being present; each vertical slice still needs its own review, appropriate tests, and isolated commit.

## Delivery sequence

### 1. Stabilize the core authoring and build workflow

Complete and review project CRUD, file/folder operations, autosave acknowledgements, immutable revisions, restore/diff, compiler settings, build queue state, worker isolation, artifact validation, and last-successful-PDF retention.

**Acceptance:** a multi-file manuscript can be created/imported, edited, saved, built, diagnosed, previewed, downloaded, and restored. Injected compile failures, timeouts, cancellation, and invalid PDFs do not remove the last successful artifact. Workspace and compilation actions enforce membership policies.

### 2. Finish research authoring and navigation

Complete bibliography/BibTeX management, citation/reference completion, parser-backed diagnostics, math hover, SyncTeX navigation, template application, symbol insertion, and document structure navigation. Add feature-specific seed data only where it makes the capability usable in a fresh install; keep seeders idempotent and avoid seeding production credentials or private user content.

**Acceptance:** representative papers using supported packages and bibliography flows pass a maintained corpus. Generated or suggested source remains editable, and every symbol/reference navigation target resolves to the correct file and line.

### 3. Complete collaboration and project management

Finish comments and review threads, suggestions/track changes, membership invitations and roles, tasks, milestones, presence, project activity, Git provider configuration, and conflict recovery. Keep durable revisions as the source of truth before enabling live editing behavior.

**Acceptance:** authorization is tested per role; concurrent edits have explicit conflict behavior; suggestion acceptance/rejection and revision restore are auditable and recoverable.

### 4. Complete visual tools, conversion, and OCR

Extend the table designer; implement the TikZ/figure editor, probability trees, sign/variation tables, and tcolorbox designer as source-generating tools. Add conversion jobs and reports, DOCX/Markdown workflows, and OCR correction/approval flows. Preserve originals and report unsupported constructs instead of silently dropping them.

**Acceptance:** round-trip and source-generation fixtures cover supported structures. Conversion/OCR results include status, warnings, and source retention. OCR quality is measured by formula category and correction workflow, not a blanket accuracy claim.

### 5. Finish administration and platform operations

Extend the current admin pages with queue/worker health, build inspection, quota enforcement, session control, organization bulk operations, feature/template review, and richer usage reporting. Add safe maintenance and retention controls. Ensure role changes cannot remove the final administrator under concurrent requests.

**Acceptance:** administrators can identify queued/stuck/failed work, inspect safe diagnostic metadata, and take audited actions. Quotas are enforced server-side. All admin endpoints reject non-admin users, and audit records exclude secrets and source contents.

### 6. Harden AI and external integrations

Complete provider/model configuration, scoped context selection, diff-based AI proposals, acceptance/rollback, usage accounting, and audit. Finish Git, Zotero, storage sync, SSO, webhooks, and MCP integrations with token lifecycle and revocation handling. Only enable providers whose current API and licensing have been reviewed.

**Acceptance:** AI is read-only until approval; proposals can be inspected and reverted. Integration failures, expired credentials, sync conflicts, and revoked tokens are visible and recoverable without leaking secrets.

### 7. Add Typst and research engines as separate capabilities

Implement Typst as a separate project engine with its own compiler and language support. Keep migration limited to documented supported subsets. Treat a first-party math renderer, broader AST/export, deterministic dependency manifests, and independent typesetting as research projects behind capability flags.

**Acceptance:** capability matrices and differential tests establish what is supported. Do not claim arbitrary LaTeX compatibility or use experimental engines as a replacement for TeX Live builds.

### 8. Release hardening

Review accessibility, responsive behavior, security boundaries, privacy/retention, backups/restores, observability, worker resource limits, performance, licenses, and deployment/rollback. Keep public marketing status synchronized with verified product behavior.

**Acceptance:** release test corpus and security checks pass; backup restoration and worker failure recovery are exercised; every public feature marked available has an implementation owner and passing acceptance evidence.

## Per-slice completion checklist

For each feature/page, keep the commit vertical and include the relevant model/request/policy/controller, Wayfinder route, page/sidebar entry, idempotent demo seeding when needed, and focused regression coverage. Read applicable `.ai/rules` before edits, follow package-version documentation for framework APIs, run the focused tests and type/build checks appropriate to the change, and record any deferred requirement in this roadmap. Do not seed fake operational health, credentials, audit events, or private content into production data.
