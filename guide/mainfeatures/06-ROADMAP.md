# 06 — Tier-Wise and Phase-Wise Implementation Roadmap

## 1. Product tiers

Tiers describe product capability maturity. They are not necessarily subscription plans.

### Tier 0 — Feasibility and engineering foundation
- Repository conventions, architecture and threat model.
- Laravel/Inertia/Vue skeleton.
- MySQL, Redis and private storage.
- Docker compiler proof.
- Monaco and PDF.js prototypes.
- Real manuscript compilation and benchmark.

**Exit gate:** a representative multi-file academic project compiles in an isolated worker and its PDF displays in the browser.

### Tier 1 — Core LaTeX authoring
- Authentication and project policies.
- Dashboard, projects, file tree and templates.
- Monaco editor, autosave and revisions.
- TeX Live worker, pdfLaTeX/XeLaTeX/LuaLaTeX.
- latexmk, BibTeX/Biber basics.
- Build logs and PDF.js.
- Last successful PDF retention.
- ZIP import/export and quotas.

**Exit gate:** reliable create/import → edit → save → compile → preview → download workflow.

### Tier 2 — Research-grade authoring
- Project-aware completion and diagnostics.
- LaTeX parser v1.
- Formula hover.
- BibTeX search and bibliography tools.
- SyncTeX.
- Template gallery and private templates.
- Admin panel, audit and project history.
- Symbol palette.
- Common research packages and build profiles.

**Exit gate:** representative journal/thesis projects pass the compatibility corpus.

### Tier 3 — Collaboration and revision management
- Invitations and project roles.
- Comments and review threads.
- Track changes / suggestion diffs.
- Version history, compare and restore.
- Realtime presence.
- Activity feed.
- Conflict-aware collaboration persistence.

**Exit gate:** concurrent editing and conflict recovery pass load/security tests.

### Tier 4 — AI research assistant
- AI chat and project context.
- Compile-error explanation/fix as diff.
- Paper review and checklist.
- Citation consistency checks.
- Table/figure/abstract assistance.
- AI review summaries and optional scheduled digest.
- MCP server and scoped agent tools.

**Exit gate:** no silent source modifications; permissions, audit and privacy tests pass.

### Tier 5 — Visual academic tools and conversion
- Visual tables, TikZ figures, probability trees, sign/variation tables and tcolorbox designer.
- DOCX/LaTeX/Markdown conversion.
- IDM and conversion reports.
- OCR image-to-LaTeX.
- HTML/EPUB/ODT.
- Quarto/RMarkdown/Obsidian workflows.

**Exit gate:** conversion fidelity measured; original preserved; visual tools generate editable source.

### Tier 6 — Integrations and institutional platform
- GitHub/GitLab/Gitea/generic Git.
- Dropbox sync.
- Zotero; Mendeley if API supports.
- OIDC, SAML, LDAP.
- Organization admin, quotas, bulk operations, session control.
- i18n and ARM64.
- Webhooks and MCP policy controls.

**Exit gate:** provider failure, token revocation, sync conflicts and institutional access are handled.

### Tier 7 — Multi-engine and independent-engine research
- Typst project engine and migration experiments.
- Expanded LaTeX analysis.
- First-party math renderer subset.
- More complete document AST/exporters.
- Deterministic dependency manifests.
- Typesetting research prototype.

**Exit gate:** documented capability matrix and differential tests; no false compatibility claims.

## 2. Phase implementation sequence

| Phase | Focus | Key deliverables | Completion gate |
|---|---|---|---|
| P0 | Discovery | Requirements matrix, personas, test corpus, threat model, licence register | Approved scope |
| P1 | Feasibility | Monaco/PDF.js, TeX worker, SyncTeX, conversion/OCR benchmarks | Evidence report |
| P2 | Foundation | Auth, organizations, project policies, storage, Redis, CI | Secure skeleton |
| P3 | Workspace | Dashboard, project/file CRUD, Monaco, autosave, revisions | Editing workflow |
| P4 | Compilation | Snapshot, queue, worker protocol, TeX engines, latexmk | Reproducible builds |
| P5 | PDF/diagnostics | PDF.js, logs, parser, last-successful output | End-to-end core |
| P6 | Editor intelligence | Lexer, syntax tree, completion, labels, citations, diagnostics | Editor QA |
| P7 | Research workflows | Biber, indexes, glossaries, templates, SyncTeX, symbol palette | Corpus pass |
| P8 | Collaboration | Comments, track changes, realtime, restore/compare | Concurrency pass |
| P9 | AI assistant | Chat, error assistant, diff proposals, paper review | Human-approval gate |
| P10 | Visual tools | Tables, figures, probability trees, tcolorbox | Source round-trip tests |
| P11 | Conversion/OCR | IDM, DOCX/Markdown, OCR | Fidelity/accuracy report |
| P12 | Integrations | Git providers, Dropbox, Zotero/Mendeley, SSO, MCP | Provider/security pass |
| P13 | Typst | Typst project type, compiler, editor support, conversion | Separate engine validated |
| P14 | Independent engines | Math renderer, document exporters, typesetting research | Differential tests |

## 3. Detailed phase gates

### P0 — Discovery and requirements
- Decide project name later; do not block architecture.
- Define personas and workflows.
- Approve product boundaries and MVP.
- Create requirement IDs and traceability matrix.
- Inventory public feature references.
- Record licensing decisions.
- Collect actual manuscripts and templates.
- Identify target VPS capacity and expected concurrent users.
- Define backup, retention and privacy requirements.

Deliverables:
- Product requirements.
- System context diagram.
- Threat model.
- Initial ERD.
- Feature priority matrix.
- Test corpus.
- Licence register.
- Risk register.

### P1 — Feasibility prototypes
1. Monaco embedded in Vue with LaTeX mode.
2. PDF.js rendering and artifact loading.
3. TeX Live container compiling multi-file research paper.
4. pdfLaTeX, XeLaTeX, LuaLaTeX proof.
5. latexmk + BibTeX/Biber + cross references.
6. TikZ/PGFPlots and minted capability tests.
7. SyncTeX forward/inverse navigation.
8. Test a real Springer/Elsevier/IEEE-style project.
9. DOCX ↔ LaTeX conversion quality test.
10. CPU OCR benchmark.
11. Concurrent build, memory, storage and runtime benchmark.
12. Test failure preservation and worker termination.

Do not base architecture on a trivial hello-world compile.

### P2 — Application foundation
- Authentication, email verification, reset, optional MFA.
- User, organization, membership, project and project-member entities.
- Laravel Policies and Spatie roles.
- Private storage abstraction.
- Redis queues and locks.
- Audit trail.
- CI, test suite, static analysis and deployment workflow.

### P3 — Workspace
- Project dashboard and project CRUD.
- File/folder tree and safe operations.
- Monaco tabs and preferences.
- Autosave acknowledgement.
- Revision snapshots.
- Import/export ZIP.
- Root document and compiler settings.

### P4/P5 — Compilation and PDF
- Versioned worker protocol.
- Immutable snapshots.
- Build state machine.
- Compiler adapters.
- Timeouts, cancellation, retries and quotas.
- Logs and normalized diagnostics.
- PDF validation and artifact publishing.
- PDF.js viewer.
- Last successful build pointer.
- Stale preview indicator.

### P6/P7 — Language intelligence and research
- Lexer/parser subset.
- Source spans and diagnostics.
- Project symbol index.
- Citation/reference completion.
- Formula hover.
- BibTeX/Biber.
- MakeIndex/MakeGlossaries.
- Templates and symbol palette.
- SyncTeX.
- Compatibility corpus.

### P8 — Collaboration
- Comments and review threads first.
- Track changes as patch/diff model.
- Revision compare and restore.
- Realtime presence.
- CRDT/collaborative editing only after durable persistence and conflict semantics.

### P9 — AI
- Provider abstraction and model configuration.
- Context selection.
- Read-only analysis by default.
- Proposed diffs.
- User approval and rollback.
- Usage accounting and audit.
- No fabricated citations or experimental results.
- Optional local provider.

### P10 — Visual tools
Start with visual tables because they are common and easier to validate. Then tcolorbox, probability trees, sign/variation tables and TikZ figure builder. Generated code must be visible and editable.

### P11 — Conversion and OCR
- IDM v1.
- DOCX/LaTeX/Markdown conversion.
- Conversion report and source retention.
- Image upload, crop, preprocessing, OCR, preview, correction and approval.
- Measure OCR by formula category, not a single unsupported accuracy percentage.

### P12 — Integrations
- Git providers and generic Git.
- Zotero.
- Dropbox.
- SSO.
- MCP.
- Mendeley after API review.
- Audit and token lifecycle.

### P13 — Typst
- Separate `.typ` project mode.
- Typst compiler adapter.
- Syntax services.
- Shared project storage and collaboration.
- LaTeX↔Typst migration only for supported subsets.
- Do not claim arbitrary LaTeX conversion.

### P14 — Independent engine R&D
- Expand parser.
- Math AST and renderer.
- Document import/export.
- Package/dependency analysis.
- Limited typesetting prototype.
- Differential comparison with TeX Live.

## 4. First public release definition

The first public release is successful when:
- users can register and securely create/import projects;
- project membership is enforced on all routes;
- users can edit and reliably autosave files;
- common multi-file research projects compile with the selected TeX engines;
- bibliography and cross-reference workflows pass the test corpus;
- PDF preview displays the latest successful build;
- errors are actionable and linked to source where possible;
- failed builds do not destroy previous successful PDFs;
- workers run isolated with enforced resource limits;
- backups and restores are tested.

Do not make AI, collaboration, Typst, visual editors or independent typesetting prerequisites for this first release.
