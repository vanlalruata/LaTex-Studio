#!/usr/bin/env bash
set -uo pipefail

WORK_DIR="/work"
SRC_DIR="${WORK_DIR}/src"
OUT_DIR="${WORK_DIR}/out"
REQUEST_FILE="${WORK_DIR}/build-request.v1.json"
RESULT_FILE="${OUT_DIR}/build-result.v1.json"
STDOUT_LOG="${OUT_DIR}/worker-stdout.log"

mkdir -p "${OUT_DIR}"

if [[ ! -f "${REQUEST_FILE}" ]]; then
    echo "Missing build-request.v1.json" > "${STDOUT_LOG}"
    jq -n '{status: "failed", exit_code: 1, error: "Missing build-request.v1.json"}' > "${RESULT_FILE}"
    exit 1
fi

ENGINE="$(jq -r '.engine // "pdflatex"' "${REQUEST_FILE}")"
ROOT_FILE="$(jq -r '.root_file // "main.tex"' "${REQUEST_FILE}")"
BIB_TOOL="$(jq -r '.bibliography_tool // "biber"' "${REQUEST_FILE}")"
ENABLE_SYNCTEX="$(jq -r '.enable_synctex // true' "${REQUEST_FILE}")"
WALL_TIMEOUT="$(jq -r '.limits.wall_timeout_seconds // 60' "${REQUEST_FILE}")"

case "${ENGINE}" in
    pdflatex) ENGINE_FLAG="-pdf" ;;
    xelatex)  ENGINE_FLAG="-xelatex" ;;
    lualatex) ENGINE_FLAG="-lualatex" ;;
    *)
        echo "Unsupported compiler engine: ${ENGINE}" > "${STDOUT_LOG}"
        jq -n --arg err "Unsupported engine: ${ENGINE}" '{status: "failed", exit_code: 1, error: $err}' > "${RESULT_FILE}"
        exit 1
        ;;
esac

SYNCTEX_FLAG="-synctex=1"
if [[ "${ENABLE_SYNCTEX}" != "true" ]]; then
    SYNCTEX_FLAG="-synctex=0"
fi

BIB_FLAG=""
if [[ "${BIB_TOOL}" == "none" ]]; then
    BIB_FLAG="-bibtex-"
fi

START_MS=$(date +%s%3N)

echo "PROGRESS:25"
echo "PASS:1"

cd "${SRC_DIR}"

set +e
if [[ -n "${BIB_FLAG}" ]]; then
    timeout --signal=TERM --kill-after=5s "${WALL_TIMEOUT}s" \
        latexmk "${ENGINE_FLAG}" -interaction=nonstopmode -halt-on-error -file-line-error \
        -latexoption=-no-shell-escape "${SYNCTEX_FLAG}" "${BIB_FLAG}" \
        -outdir="${OUT_DIR}" "${ROOT_FILE}" > "${STDOUT_LOG}" 2>&1
else
    timeout --signal=TERM --kill-after=5s "${WALL_TIMEOUT}s" \
        latexmk "${ENGINE_FLAG}" -interaction=nonstopmode -halt-on-error -file-line-error \
        -latexoption=-no-shell-escape "${SYNCTEX_FLAG}" \
        -outdir="${OUT_DIR}" "${ROOT_FILE}" > "${STDOUT_LOG}" 2>&1
fi
EXIT_CODE=$?
set -e

echo "PROGRESS:90"

END_MS=$(date +%s%3N)
DURATION_MS=$((END_MS - START_MS))
if [[ "${DURATION_MS}" -lt 1 ]]; then
    DURATION_MS=1
fi

STATUS="failed"
if [[ "${EXIT_CODE}" -eq 0 ]]; then
    STATUS="succeeded"
elif [[ "${EXIT_CODE}" -eq 124 ]]; then
    STATUS="timed_out"
fi

jq -n \
    --arg status "${STATUS}" \
    --argjson exit_code "${EXIT_CODE}" \
    --argjson duration_ms "${DURATION_MS}" \
    '{
        protocol_version: "1.0",
        status: $status,
        exit_code: $exit_code,
        metrics: {
            duration_ms: $duration_ms
        }
    }' > "${RESULT_FILE}"

exit "${EXIT_CODE}"
