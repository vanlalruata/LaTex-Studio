# TeX Live Worker Image

Isolated, non-root Docker worker image (`ubuntu:24.04`) for compiling untrusted LaTeX manuscripts in LaTeX Studio.

## Installed Tooling

- **Compilers & Orchestration**: `latexmk`, `biber`, `pdflatex` (`texlive-latex-base`, `texlive-latex-recommended`, `texlive-latex-extra`), `xelatex` (`texlive-xetex`), `lualatex` (`texlive-luatex`)
- **Packages & Fonts**: `texlive-science`, `texlive-bibtex-extra`, `texlive-pictures`, `texlive-fonts-recommended`, `texlive-fonts-extra`
- **Utilities**: `jq`, `ca-certificates`

## Build & Tag Locally

```bash
./docker/texlive-worker/build-and-push.sh latexstudio/texlive-worker:latest
```

To verify the image is detected by LaTeX Studio, open **Admin → Compiler settings** (`/admin/compiler`) and click **Test Docker compile**.

## Worker Protocol (`v1` / `v2`)

`DockerTexLiveAdapter` and `DockerStreamingAdapter` mount a per-build workspace at `/work` with `/work/src` (immutable source snapshot) and `/work/out` (build artifacts):

1. **Input (`/work/build-request.v1.json`)**:
   - `engine`: `pdflatex` | `xelatex` | `lualatex`
   - `root_file`: normalized relative path (default `main.tex`)
   - `bibliography_tool`: `biber` | `bibtex` | `none`
   - `enable_synctex`: `true` | `false`
   - `limits.wall_timeout_seconds`: wall-clock timeout enforced via `timeout --signal=TERM --kill-after=5s`

2. **Streaming Output (`stdout`)**:
   - `entrypoint.sh` emits `PROGRESS:25`, `PASS:1`, and `PROGRESS:90` markers for `DockerStreamingAdapter`.
   - Full `latexmk` output is captured in `/work/out/worker-stdout.log`.

3. **Result (`/work/out/build-result.v1.json`)**:
   - Reports `protocol_version`, `status` (`succeeded` | `failed` | `timed_out`), `exit_code`, and `metrics.duration_ms`.
   - Artifacts written to `/work/out/`: `<root>.pdf`, `<root>.log`, and `<root>.synctex.gz`.

## Security Properties

- Runs as non-root user `texworker` (`UID 10001`).
- Invoked with `--network=none --read-only --cap-drop=ALL --security-opt=no-new-privileges --tmpfs /tmp:rw,noexec,nosuid,size=128m`.
- Enforces configurable `--memory`, `--memory-swap`, `--cpus`, and `--pids-limit` quotas from `config/compiler.php` / `/admin/compiler`.
- Disables shell escape (`-latexoption=-no-shell-escape`).

## Alternative: Local TeX Live Mode (No Docker)

For local development or single-tenant hosts without Docker, switch **Execution driver** to **Local TeX Live (No Docker)** in `/admin/compiler` (or set `COMPILER_DRIVER=local` in `.env`). `LocalTexLiveAdapter` auto-detects host TeX Live installations (such as `~/texlive/*/bin/*` or `/usr/local/texlive/*/bin/*`), falls back to direct engine execution if `latexmk` is not installed, and optionally auto-installs missing `.sty`/`.cls` packages via `tlmgr`.
