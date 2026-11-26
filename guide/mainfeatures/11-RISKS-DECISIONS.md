# 11 — Risk Register and Open Decisions

## 1. Main risks

| Risk | Impact | Mitigation |
|---|---|---|
| Full TeX engine attempted too early | Project scope failure | Keep separate long-term research track |
| Untrusted compilation | Host/data compromise | Isolated workers, no secrets, quotas, shell escape off |
| Conversion overpromised | Source/data loss | Preserve originals, reports, test corpus |
| Package ecosystem too broad | Inconsistent builds | Pinned worker profiles |
| Autosave/build race | Wrong PDF/lost edits | Acknowledged saves, immutable revisions |
| Collaboration conflicts | Lost edits | Comments first, CRDT after semantics |
| AI fabricated claims/citations | Academic integrity risk | Evidence-aware prompts, source references, human approval |
| OAuth token compromise | External account access | Encrypted storage, least scopes, revoke |
| Git sync conflict | Overwrite | Hash/revision checks, conflict copy/merge |
| OCR errors | Wrong formula | Preview and explicit approval |
| Too many product domains | Delayed MVP | Feature tiers and release gates |
| Copyleft licence contamination | Legal obligations | Independent implementation and licence register |
| VPS saturation | Outage | Benchmark, quotas, concurrency controls |
| Single-server failure | Data loss | Off-server backup and restore drills |

## 2. Decisions that must be resolved during Phase 0/1

1. Product name and domain.
2. Single-user initial deployment vs multi-tenant SaaS-ready architecture.
3. Expected user count and simultaneous builds.
4. VPS CPU/RAM/disk and whether a separate worker server is available.
5. Local storage vs S3-compatible object storage.
6. TeX Live image profiles and version retention.
7. Whether Tectonic is needed in first release.
8. Collaboration strategy and persistence protocol.
9. Whether AI provider is local, external or both.
10. Whether OCR must run fully offline.
11. Git provider priorities.
12. Dropbox priority.
13. Zotero first; Mendeley API feasibility.
14. SSO scope for initial deployment.
15. Typst timing.
16. Template redistribution rights.
17. Retention/deletion policy.
18. Backup RPO/RTO.
19. Free/community vs paid/institutional product model.
20. Whether Python execution is needed in first public release (recommendation: no).

## 3. Strategic recommendation

Do not equate “independent” with rebuilding every mature infrastructure component immediately. Build the product, orchestration and data model independently, while using mature components through narrow adapters. Replace components only after evidence shows the first-party implementation is correct, safe and useful.
