# 05 — Data Model, APIs and Integrations

## 1. Core entities

| Entity | Responsibility |
|---|---|
| User | Identity, profile, preferences, security state |
| Organization | Research group, department or institution |
| OrganizationMember | Organization role and membership |
| Project | Owner, organization, title, root file, settings |
| ProjectMember | Project-scoped role |
| ProjectFile | Logical path, storage key, size, checksum, MIME |
| ProjectRevision | Immutable revision/snapshot manifest |
| Compilation | Revision, engine, image digest, status, timing |
| BuildArtifact | PDF, log, SyncTeX and auxiliary artifacts |
| Diagnostic | Normalized errors/warnings with source range |
| Template | Versioned template metadata and files |
| CommentThread | Review thread anchored to source or document node |
| Comment | Individual message in a thread |
| ChangeSuggestion | Proposed patch/diff and review status |
| IntegrationConnection | Provider, account, encrypted token reference, scopes |
| SyncJob | Remote/local synchronization state |
| BibliographySource | Zotero/Mendeley/import source |
| ConversionJob | Source, target, provider, report and output |
| OcrJob | Image, provider, candidate output and review status |
| AiConversation | User/project scope and retention policy |
| AiAction | Proposed patch/tool call and approval state |
| AuditEvent | Security/admin event |
| UsageRecord | Storage, builds, AI, conversion and OCR consumption |
| TemplateVersion | Immutable template version |
| WebhookSubscription | Scoped event subscription and secret reference |

Store file bytes in private object/file storage, not in MySQL blobs. Store checksums and revision manifests. Never expose physical storage paths.

## 2. Authorization model

Global roles and organization roles can use Spatie Laravel Permission. Project access must be checked through project membership and Laravel Policies.

Example roles:
- Owner: project ownership and membership administration.
- Admin: organization-level management, policy-dependent.
- Editor: modify files and compile.
- Reviewer: comment and suggest changes.
- Commenter: comment only.
- Viewer: read project and PDF.

Every endpoint must enforce resource authorization, including download, preview, compile, restore, conversion, OCR and integration operations.

## 3. API groups

```text
/api/v1/auth/*
/api/v1/organizations
/api/v1/projects
/api/v1/projects/{project}/members
/api/v1/projects/{project}/files
/api/v1/projects/{project}/revisions
/api/v1/projects/{project}/compilations
/api/v1/compilations/{compilation}
/api/v1/compilations/{compilation}/artifacts/{artifact}
/api/v1/projects/{project}/templates
/api/v1/projects/{project}/comments
/api/v1/projects/{project}/suggestions
/api/v1/projects/{project}/conversions
/api/v1/projects/{project}/ocr-jobs
/api/v1/projects/{project}/integrations
/api/v1/integrations/{provider}/callback
/api/v1/projects/{project}/git/sync
/api/v1/admin/*
/api/v1/mcp/*
```

All endpoints require versioned request/response schemas, authorization, validation, rate limits and audit where appropriate.

## 4. Realtime event catalogue

- CompilationQueued / Started / Progress / Completed / Failed.
- ProjectFileUpdated.
- RevisionCreated / RevisionRestored.
- CollaboratorJoined / Left / CursorUpdated.
- CommentCreated / ThreadResolved.
- SuggestionCreated / Accepted / Rejected.
- ConversionCompleted / Failed.
- OcrCompleted.
- IntegrationSyncStarted / Completed / Conflict.
- AdminNotice.

Private channels must be authorized. Do not broadcast source text, provider tokens or permanent artifact URLs.

## 5. Git provider integration

Provider abstraction:
- `GitProviderInterface`
- GitHubAdapter
- GitLabAdapter
- GiteaAdapter
- GenericGitAdapter

Features:
- OAuth/app authorization.
- Select repository and branch.
- Clone/import.
- Pull and push.
- Commit history.
- Branch selection.
- Conflict detection and merge review.
- Sync status and logs.

Do not allow a Git sync to overwrite unsaved editor buffers. Use revision IDs and explicit conflict resolution. Protect against malicious Git submodules, symlinks and oversized repositories.

## 6. Dropbox integration

Two-way sync is a later tier:
- OAuth and minimal scopes.
- Project-to-folder mapping.
- Change cursor tracking.
- Hash-based change detection.
- Conflict copies instead of silent overwrite.
- User-visible sync status.
- Disconnect and token revocation.
- Provider outage/retry behavior.

## 7. Zotero and Mendeley

Zotero:
- OAuth/API authorization.
- Select library/collection.
- Import citation records to `.bib` or internal reference cache.
- Refresh metadata without changing manuscript citations.
- Keep source attribution and provider identifiers.

Mendeley:
- Verify current API availability, OAuth policy and product terms before committing.
- If API is restricted or unstable, support user file import/export rather than promising continuous sync.

## 8. SSO

Use a standards-based identity abstraction:
- OIDC/OAuth 2.0 first.
- SAML for institutional deployments.
- LDAP/Active Directory as a later enterprise connector.

Support account linking, domain restrictions, just-in-time provisioning, role mapping and emergency local admin access. Avoid locking the only administrator out during provider failure.

## 9. MCP and AI agent API

MCP tools should be scoped and auditable:
- `list_projects`
- `list_project_files`
- `read_file`
- `propose_file_patch`
- `apply_approved_patch`
- `compile_project`
- `read_build_diagnostics`
- `read_pdf_metadata`
- `create_comment`
- `search_bibliography`

Default AI workflow:
1. Agent reads only authorized project context.
2. Agent proposes a patch, not direct overwrite.
3. User reviews diff.
4. User approves.
5. Patch is applied as a new revision.
6. Build is run and results are reported.

Use short-lived or revocable scoped tokens. Never expose arbitrary filesystem or shell tools.
