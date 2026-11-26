# 14 — Implementation Checklist and Acceptance Matrix

## 1. First milestone: compile a real research project

- [ ] Select a multi-file manuscript with figures and bibliography.
- [ ] Create pinned TeX Live worker image.
- [ ] Create worker request/response schema.
- [ ] Snapshot project files immutably.
- [ ] Validate project paths and archive import.
- [ ] Dispatch build via Redis queue.
- [ ] Run latexmk inside sandbox.
- [ ] Collect logs, PDF and SyncTeX.
- [ ] Validate PDF and publish artifact.
- [ ] Display PDF in PDF.js.
- [ ] Force a failed build and verify previous PDF remains.
- [ ] Record CPU/RAM/time/disk metrics.
- [ ] Test worker cleanup and timeout.
- [ ] Test cross-project artifact denial.

## 2. First public release checklist

### Identity and authorization
- [ ] Registration/login/reset.
- [ ] Email verification.
- [ ] Project roles.
- [ ] Policy tests on every resource.
- [ ] Session security and rate limits.

### Project and editor
- [ ] Dashboard.
- [ ] Project CRUD.
- [ ] File/folder CRUD.
- [ ] ZIP import/export.
- [ ] Monaco tabs and preferences.
- [ ] Autosave acknowledgement.
- [ ] Revision snapshots.
- [ ] Root file and compiler settings.

### Compiler/PDF
- [ ] pdfLaTeX.
- [ ] XeLaTeX.
- [ ] LuaLaTeX.
- [ ] latexmk.
- [ ] BibTeX/Biber.
- [ ] Worker quotas.
- [ ] Logs and diagnostics.
- [ ] PDF.js.
- [ ] Last-successful-PDF retention.
- [ ] Artifact authorization.

### Operations
- [ ] Database backup.
- [ ] Artifact backup.
- [ ] Restore drill.
- [ ] Queue monitoring.
- [ ] Worker health.
- [ ] Resource metrics.
- [ ] Security review.
- [ ] Deployment documentation.

## 3. Later tier checklist

### Research-grade editor
- [ ] LaTeX parser v1.
- [ ] Completion.
- [ ] Citation/reference index.
- [ ] Symbol palette.
- [ ] Formula hover.
- [ ] SyncTeX.
- [ ] Private templates.
- [ ] Project history.

### Collaboration
- [ ] Invites.
- [ ] Roles.
- [ ] Comments.
- [ ] Track changes.
- [ ] Compare/restore.
- [ ] Presence.
- [ ] Conflict recovery.

### AI
- [ ] Chat.
- [ ] Compile-error assistant.
- [ ] Diff proposal.
- [ ] Paper review.
- [ ] Citation consistency.
- [ ] MCP scoped tools.
- [ ] Audit and quota.
- [ ] Privacy controls.

### Visual and conversion
- [ ] Visual table editor.
- [ ] TikZ figure editor.
- [ ] Probability tree.
- [ ] Sign/variation table.
- [ ] tcolorbox designer.
- [ ] DOCX conversion.
- [ ] Markdown/Quarto.
- [ ] OCR equation recognition.
- [ ] Conversion reports.

### Integrations
- [ ] GitHub.
- [ ] GitLab.
- [ ] Gitea.
- [ ] Generic Git.
- [ ] Dropbox.
- [ ] Zotero.
- [ ] Mendeley API verification.
- [ ] OIDC.
- [ ] SAML/LDAP.
- [ ] Webhooks.

### Advanced engines
- [ ] Typst project type.
- [ ] Typst compile.
- [ ] LaTeX/Typst conversion subset.
- [ ] Math renderer subset.
- [ ] Document exporters.
- [ ] Typesetting prototype.
