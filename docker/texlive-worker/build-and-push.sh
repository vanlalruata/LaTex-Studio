#!/usr/bin/env bash
set -euo pipefail

IMAGE_NAME="${1:-latexstudio/texlive-worker:latest}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Building ${IMAGE_NAME} from ${SCRIPT_DIR}..."
docker build -t "${IMAGE_NAME}" "${SCRIPT_DIR}"
echo "Done."
