# TeX Live Worker Image

Isolated, non-root Docker worker image for compiling untrusted LaTeX manuscripts in LaTeX Studio.

## Build locally

```bash
./docker/texlive-worker/build-and-push.sh latexstudio/texlive-worker:latest
```

## Security properties

- Runs as non-root user `texworker` (`UID 10001`).
- Intended to be invoked by `DockerTexLiveAdapter` with `--network=none --read-only --cap-drop=ALL --security-opt=no-new-privileges`.
- Disables shell escape (`-no-shell-escape`) and enforces wall-clock timeout via `timeout`.
