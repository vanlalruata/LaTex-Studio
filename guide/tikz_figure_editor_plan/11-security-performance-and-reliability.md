# 11. Security, Performance and Reliability

## 11.1 Untrusted input
Treat TikZ source, imported `.tex`, SVG, PDF, PNG, project ZIPs and external assets as untrusted.

## 11.2 TeX sandbox
- Non-root workers.
- No Docker socket.
- No application secrets.
- Network disabled by default.
- Shell escape disabled by default.
- Read-only base image.
- Per-job workspace.
- CPU, memory, PID, time, disk and output limits.
- Safe archive extraction.
- Strict cleanup.
- Pinned worker image and versioned protocol.

## 11.3 Asset safety
- Validate file types by content, not extension alone.
- Size and dimension limits.
- Reject unsafe SVG scripts/external references or sanitize through a controlled pipeline.
- Prevent path traversal.
- Use private storage and authorized artifact access.
- Do not fetch arbitrary remote image URLs from the worker.

## 11.4 Performance
- Virtualize large object lists where needed.
- Render only visible canvas objects at high detail.
- Debounce preview updates.
- Separate canvas preview from expensive TeX compile.
- Coalesce obsolete render jobs.
- Cache immutable artifacts by revision/checksum.
- Avoid recompiling on every pointer movement.
- Use Web Workers for expensive client-side geometry if justified.

## 11.5 Reliability
- Autosave with explicit sync status.
- Immutable revisions.
- Render status and logs.
- Last successful render retained after failure.
- Recovery after connection interruption.
- Undo/redo.
- Export source at any time.
- Backups and restore tests.
