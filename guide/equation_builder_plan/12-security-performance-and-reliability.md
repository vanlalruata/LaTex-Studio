# 12. Security, Performance and Reliability

## 12.1 Browser preview security
- Do not execute arbitrary TeX macros or JavaScript from formula content.
- Disable or constrain unsafe renderer features.
- Do not enable arbitrary remote resource loading.
- Limit expression length, nesting depth and render time.
- Isolate preview rendering as appropriate.
- Escape text content.
- Do not inject untrusted HTML from formula source.

## 12.2 TeX compilation
- Use isolated TeX Live workers.
- Non-root.
- No Docker socket.
- No application secrets.
- Network disabled by default.
- Shell escape disabled by default.
- CPU, memory, PID, disk, time and output limits.
- Pinned worker image.
- Safe artifact handling.

## 12.3 Data protection
- Project-level authorization.
- Private formula libraries by default.
- Audit shared template changes.
- Validate uploaded/imported formula files.
- Do not expose internal storage paths.

## 12.4 Reliability
- Autosave.
- Explicit save status.
- Offline/connection state.
- Immutable revisions.
- Undo/redo.
- Restore.
- Source export always available.
- Conflict detection before manuscript insertion.
- Preserve last successful PDF on failed compile.

## 12.5 Performance
- Lazy-load symbol categories.
- Index symbol search metadata.
- Virtualize large symbol grids.
- Debounce preview.
- Cache preview by hash.
- Cancel stale render tasks.
- Avoid re-rendering on unrelated UI state changes.
