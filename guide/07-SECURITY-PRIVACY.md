# 07 — Security, Privacy and Reliability

## 1. Threat model

Treat LaTeX source, uploaded archives, figures, bibliography files, imported repositories, Python scripts, conversion inputs and OCR images as untrusted.

Potential threats:
- Shell escape and arbitrary process execution.
- Malicious package/class/style files.
- File-system traversal and symlink attacks.
- Access to host/container environment variables.
- Network exfiltration.
- Resource exhaustion via infinite loops, huge images or pathological TeX.
- Malicious ZIP archives and decompression bombs.
- Cross-tenant artifact access.
- OAuth token theft.
- Git submodule and remote URL abuse.
- Prompt injection in manuscript text or imported documents.
- AI agent overreach.
- Data leakage to external AI/OCR providers.

## 2. Compiler sandbox controls

Mandatory:
- Non-root worker user.
- No Docker socket.
- No Laravel `.env`, database credentials or provider tokens.
- Network disabled by default.
- Shell escape disabled by default.
- Read-only base image.
- Per-build writable workspace.
- CPU quota.
- Memory and swap limit.
- Process/PID limit.
- Wall-clock timeout.
- Temporary disk and output-size quota.
- File count and archive expansion limits.
- Restricted mount points.
- Worker cleanup after job.
- Version-pinned image digest.
- Audit build ID and resource usage.

Do not assume that merely running Docker makes compilation safe. Container isolation configuration must be reviewed and tested. For stronger multi-tenant threat models, evaluate an additional sandbox runtime or microVM boundary.

## 3. Python/script runner

Separate worker class and policy:
- Explicit opt-in per project.
- Curated runtime images.
- No network by default.
- No host filesystem.
- No Docker socket.
- No inherited environment secrets.
- Time/memory/CPU/process/disk quotas.
- Explicit input/output directory.
- Package installation only from reviewed allow-list or controlled package cache.
- Record script, image version, outputs and logs.
- Do not execute Python in the Laravel web process.

## 4. Web application security

- Laravel Policies for every project/file/revision/build/artifact/comment/integration resource.
- Prevent IDOR.
- Validate file names, extensions, content, sizes and paths.
- Secure ZIP extraction.
- CSRF protection and secure sessions.
- Rate limiting for auth, uploads, compile and AI.
- Secure headers and output encoding.
- Token encryption and rotation.
- OAuth state/PKCE where applicable.
- Audit sensitive actions.
- Avoid exposing internal storage keys and host paths.

## 5. AI security

- Treat manuscript contents as untrusted data, not system instructions.
- Keep AI tools least-privilege and project-scoped.
- Tool calls require schema validation.
- Read-only analysis default.
- Changes are proposed as diffs.
- User approval required before applying changes.
- Maintain undo/rollback.
- Audit tool calls and affected files.
- Prevent AI from accessing secrets, other projects or arbitrary network.
- Clearly identify external data transfer and retention.
- Do not fabricate citations, DOIs, datasets, results or claims.
- AI paper review is advisory, not peer review or a guarantee of correctness.

## 6. OAuth/integration security

- Store encrypted tokens.
- Use minimum provider scopes.
- Provide disconnect/revoke.
- Avoid long-lived access tokens in browser storage.
- Audit sync events.
- Detect conflicts and never silently overwrite.
- Validate webhook signatures.
- Restrict outbound URLs to reduce SSRF.
- Review Git remote URL and submodule behavior.

## 7. Reliability

- Database backups and off-server artifact backups.
- Restore drills.
- Queue retry with bounded attempts.
- Idempotency keys.
- Dead-letter handling.
- Artifact orphan cleanup.
- Worker health checks.
- Queue-depth monitoring.
- Build failure and timeout metrics.
- Storage capacity alerts.
- Graceful worker restart.
- Disaster recovery runbook.

## 8. Privacy

- Projects private by default.
- User can export complete source and artifacts.
- Clear retention and deletion policies.
- External AI/OCR providers are opt-in and disclosed.
- Send only necessary context; for formula OCR, prefer the cropped image rather than the whole project.
- Define log redaction and retention.
- Provide institution-controlled deployment options.
