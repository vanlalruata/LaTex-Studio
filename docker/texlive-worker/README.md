# TeX Live Worker Image

Isolated, non-root Docker worker image (`ubuntu:24.04`) for compiling untrusted LaTeX manuscripts in **LaTeX Studio**.

---

## Installed Tooling

- **Compilers & Orchestration**: `latexmk`, `biber`, `pdflatex` (`texlive-latex-base`, `texlive-latex-recommended`, `texlive-latex-extra`), `xelatex` (`texlive-xetex`), `lualatex` (`texlive-luatex`)
- **Packages & Fonts**: `texlive-science`, `texlive-bibtex-extra`, `texlive-pictures`, `texlive-fonts-recommended`, `texlive-fonts-extra`
- **Utilities**: `jq`, `ca-certificates`

---

## Building & Testing Locally

1. **Build the worker image** from the repository root:

   ```bash
   ./docker/texlive-worker/build-and-push.sh latexstudio/texlive-worker:latest
   ```

2. **Verify inside LaTeX Studio**:
   - Sign in as an administrator and open **Admin → Compiler settings** (`/admin/compiler`).
   - Select **Docker Container (Recommended)** and click **Test Docker compile** to confirm the image is detected and builds a sample PDF.

---

## Worker Protocol (`v1` / `v2`)

`DockerTexLiveAdapter` and `DockerStreamingAdapter` mount a per-build workspace at `/work` containing `/work/src` (immutable source snapshot) and `/work/out` (output artifacts):

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

---

## Security Properties

- Runs as non-root user `texworker` (`UID 10001`).
- Invoked with `--network=none --read-only --cap-drop=ALL --security-opt=no-new-privileges --tmpfs /tmp:rw,noexec,nosuid,size=128m`.
- Enforces configurable `--memory`, `--memory-swap`, `--cpus`, and `--pids-limit` quotas from `config/compiler.php` / `/admin/compiler`.
- Disables shell escape (`-latexoption=-no-shell-escape`) to prevent arbitrary command execution from untrusted `.tex` files.

---

## Alternative: Local TeX Live Mode (No Docker)

For local development or trusted single-tenant hosts without Docker:

1. Open **Admin → Compiler settings** (`/admin/compiler`) and select **Local TeX Live (No Docker)** (or set `COMPILER_DRIVER=local` in `.env`).
2. `LocalTexLiveAdapter` automatically detects host TeX Live installations (such as `~/texlive/*/bin/*` or `/usr/local/texlive/*/bin/*`), falls back to direct engine execution (`pdflatex` / `xelatex` / `lualatex` + `biber` / `bibtex`) if `latexmk` is not installed, and can optionally auto-install missing `.sty`/`.cls` packages via `tlmgr`.

---

## Contributing & Community Guidelines

Everyone interested in improving **LaTeX Studio** and its TeX Live worker is warmly welcome to fork, clone, and contribute!

### Community Conduct

- Please be **honest, respectful, and polite** to all fellow contributors, reviewers, and users.
- Constructive feedback is encouraged; personal attacks, harassment, or dishonest claims about authorship or test results will not be tolerated.

### How to Contribute

1. **Fork & Clone** the repository on GitHub, then create a focused feature or bugfix branch from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```
2. **Test Your Changes** before opening a Pull Request:
   - Run the backend test suite, static analysis, and formatter:
     ```bash
     composer test
     ```
   - Run frontend type checking and production build:
     ```bash
     npm run types:check && npm run build
     ```
   - If you modified `docker/texlive-worker/Dockerfile` or `entrypoint.sh`, rebuild the worker image locally and verify it with **Test Docker compile** in `/admin/compiler`.
3. **Open a Pull Request**:
   - Clearly describe *what* changed, *why* it is needed, and *how* you verified it.
   - Pull Requests are very welcome, and every PR will be carefully reviewed, scrutinized for security (especially around container isolation, path validation, and shell-escape safety), and tested before merging.
