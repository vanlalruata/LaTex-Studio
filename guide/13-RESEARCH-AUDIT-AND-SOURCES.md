# 13 — Research Audit of the Specified Products

**Review date:** 26 November 2026  
**Method:** public website content, public documentation pages and the visible GitHub README/repository metadata. Product pages may be dynamic. This is not a private-app audit or a line-by-line audit of every source file.

## 1. AyakaLeaf Pro website and GitHub repository

Links:
- https://ayakaleaf-pro.ayaka.space/
- https://github.com/ayaka-notes/ayakaleaf-pro
- https://ayakaleaf-pro.ayaka.space/on-premises/

### Publicly documented capabilities
- Full project history, restore and download.
- Comments, review panel and track changes.
- Internal collaboration.
- Private template management and template gallery.
- Git integration and Git bridge.
- GitHub, GitLab and Gitea two-way synchronization.
- Dropbox two-way synchronization.
- Zotero and Mendeley integration.
- Advanced search across bibliography entries.
- Pandoc import/export.
- Python script runner.
- AI chat assistant and compile-error assistant.
- MCP server for agents to edit, compile and comment.
- Admin panel with users, projects, templates, search, bulk actions, sessions and audit logs.
- SSO with LDAP, SAML and OAuth 2.0.
- Adjustable compile limits.
- Optional self-registration/domain restriction and CAPTCHA.
- Sandboxed compilation.
- Symbol palette.
- Internationalization.
- Docker x86_64/ARM64 support.

### Architectural/operational observations
- The repository README identifies the code as based on Overleaf Community Edition and the repository license as AGPL-3.0.
- The project recommends a deployment toolkit and documents Docker-based installation paths.
- Documentation warns that non-sandboxed Community Edition compilation runs with container privileges and can expose filesystem, network and environment variables. This is a critical threat-model lesson.
- The related TeX Live Full image repository is MIT-licensed and documents x86_64/ARM64 images, pinned TeX Live versions, common fonts and tools, and known issues such as font-cache and SyncTeX behavior. This is useful for worker-image planning, but does not mean the platform should depend on that image.
- The README mentions Python execution and MCP; both should be separate, least-privilege execution/API boundaries in our design.

### What to incorporate
1. Full revision history, restore and download.
2. Review comments and track changes.
3. Private template system.
4. Git bridge plus provider sync.
5. Dropbox sync.
6. Zotero and Mendeley connector framework.
7. Advanced BibTeX search.
8. SSO and institutional administration.
9. AI chat/error assistant.
10. MCP tools for authorized agents.
11. Python runner as a separate sandbox.
12. Symbol palette and localization.
13. ARM64 worker image tests.
14. Strong compiler sandbox as a first-class security requirement.

### What not to copy
Do not copy AyakaLeaf source code or base the product on Overleaf CE. The repository explicitly describes itself as an Overleaf CE-derived project and identifies AGPL-3.0. The current project requirement is an independent codebase. Use the feature set and operational lessons as a requirements reference. Any future code reuse requires legal review.

## 2. LetX

Link: https://letx.app/

### Publicly visible product themes
- Collaborative online LaTeX editor.
- Real-time team editing.
- Live editor/PDF experience.
- File and outline panels.
- Share/invite/collaborate/compile workflow.
- Template library and migration messaging.
- Focus on fast compilation and privacy of unpublished work.

### What to incorporate
- Smooth collaboration onboarding.
- Editor, file tree, outline and PDF in one workspace.
- Clear connected/presence status.
- Simple invite/share action.
- Fast feedback from compile.
- Project migration as a first-class workflow.
- Template discovery.

### Design lesson
A collaborative writing environment should feel like one continuous session. Avoid forcing the researcher to navigate separate project, editor, PDF and collaboration applications.

## 3. Sarmate

Link: https://www.sarmate.net/

### Publicly visible capabilities
- Online LaTeX editor with file explorer and cloud storage.
- Drag-and-drop files.
- Syntax highlighting and live PDF preview.
- Multiple compilers: latex, pdfLaTeX, XeLaTeX and LuaLaTeX.
- BibTeX and multi-file include/input support.
- Templates for articles, theses, letters and CVs.
- Visual figure editor with TikZ/PSTricks export.
- Package manager.
- Sign/variation table builder generating `tkz-tab`.
- tcolorbox designer for theorem/definition/remark boxes.
- Visual LaTeX table editor with color, borders, merged cells and formulas.
- Probability tree editor generating TikZ.
- AI/MCP access to read/write/compile LaTeX files.
- Markdown → LaTeX → PDF via Pandoc/XeLaTeX.
- Browser office-suite features (Writer, Calc, Impress), image editor, HTML/CSS/JS editor and interactive graphics.

### What to incorporate
- Visual academic tool collection.
- Package discovery/installation workflow, but implemented through controlled worker image profiles rather than arbitrary package downloads at compile time.
- Markdown-to-LaTeX workflow.
- MCP integration.
- Drag-and-drop asset management.
- Optional visual document and office extensions in later phases.

### Scope caution
A full browser office suite would dramatically expand scope. Keep DOCX conversion in the research-writing roadmap; defer full Writer/Calc/Impress editing to a separate product decision.

## 4. Murfy

Link: https://www.murfy.ai/en

### Publicly visible capabilities
- AI-native LaTeX writing for teams.
- Real-time collaboration.
- AI paper review.
- AI compile-error fixes based on compiler logs.
- Suggested fixes are shown as diffs and can be accepted or rejected.
- AI-assisted co-author feedback.
- Activity/overnight summaries.
- Version history and restore.
- Templates for conference, journal and thesis.
- MCP integration enabling connected coding agents to read/write project files.

### What to incorporate
1. Compile error assistant that reads logs and source context.
2. Fixes as explicit diff proposals.
3. Accept/reject/revert.
4. AI paper review with evidence-linked findings.
5. Co-author feedback summary.
6. Activity digest as opt-in.
7. Version history with named milestones.
8. MCP tool access with user-controlled scopes.

### Academic integrity and safety
AI review must distinguish a verified source observation from a model inference. It must not claim a paper is scientifically valid or fabricate results/references. Every code edit must be reviewable and reversible.

## 5. TypeTeX alternatives page

Link: https://www.typetex.app/alternatives/overleaf-alternatives

### Strategic themes
- Researchers seek alternatives because of compile timeouts, collaboration limits, pricing, AI assistance and migration friction.
- Typst offers a faster and simpler authoring route for some new documents.
- LaTeX remains important for publisher templates and existing research projects.
- AI editing should be reviewed as a diff.
- A low-risk migration process tests one real project before migrating a whole lab.
- Local/offline workflows remain important for some users.

### What to incorporate
- Typst as an optional separate engine.
- LaTeX-to-Typst migration experiment for supported subsets.
- Overleaf ZIP import.
- Offline/self-hosted and data-control positioning.
- A migration checklist and project validation report.
- AI changes limited to one section and reviewed before broad application.

### What not to promise
- Do not promise arbitrary LaTeX→Typst or Typst→LaTeX conversion.
- Do not position Typst as a replacement for all journal templates.
- Do not make the LaTeX editor depend on Typst.

## 6. Cross-product feature synthesis

| Capability | AyakaLeaf | LetX | Sarmate | Murfy | TypeTeX | Our priority |
|---|---|---|---|---|---|---|
| Source editor + PDF | Yes | Yes | Yes | Yes | Yes/Typst focus | P0 |
| Project/file management | Yes | Yes | Yes | Yes | Import | P0 |
| Collaboration | Yes | Yes | Yes | Yes | Yes | P1 |
| History/restore | Yes | Product workflow | Backup | Yes | Migration | P1 |
| Track changes | Yes | Not confirmed | Not confirmed | Review diffs | AI diff | P1 |
| Git integrations | Yes | Not confirmed | Not confirmed | MCP | Local Git alternatives | P2 |
| Dropbox | Yes | Not confirmed | Not confirmed | Not confirmed | Not confirmed | P2 |
| Zotero/Mendeley | Yes | Not confirmed | Not confirmed | Not confirmed | Not central | P2 |
| AI compile fixes | Yes | Not a core visible claim | MCP integration | Yes | AI editing | P1 |
| AI paper review | Not clear | Not clear | Not clear | Yes | AI research writing | P2 |
| MCP | Yes | Not clear | Yes | Yes | Not clear | P2 |
| Python runner | Yes | Not clear | HTML/Python editor claims | Agent tooling | Not core | P3 |
| Visual TikZ/table tools | Symbol palette | Not visible | Yes | Not core | Not core | P2 |
| DOCX/Markdown conversion | Pandoc | Import messaging | Markdown→LaTeX | Not central | LaTeX/Typst | P1 |
| Typst | Not core | Not visible | Not core | Not visible | Yes | P3 |
| SSO/admin | Yes | Not public focus | Institution offers | Not visible | Not core | P2 |
| Sandbox | Yes | Cloud-managed | Cloud-managed | Cloud-managed | Cloud | P0 |

## 7. Research limitations

- Marketing pages describe vendor claims; they are not independent performance/security audits.
- Product capabilities may vary by plan and release.
- The LetX page was reviewed as publicly rendered, not through an authenticated product account.
- The TypeTeX page is a vendor comparison article; comparative statements should not be treated as neutral benchmarks.
- AyakaLeaf public docs and README were reviewed, but not every source file or issue/PR was audited.
- Before adopting any dependency, inspect current source, exact commit, license, maintenance status, security posture and integration cost.
