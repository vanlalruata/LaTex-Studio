#!/usr/bin/env bash
set -euo pipefail

REQUEST_FILE="/work/build-request.v1.json"
OUT_DIR="/work/out"
RESULT_FILE="${OUT_DIR}/build-result.v1.json"

mkdir -p "${OUT_DIR}"

if [[ ! -f "${REQUEST_FILE}" ]]; then
    echo "Missing build-request.v1.json" >&2
    exit 2
fi

COMPILATION_ID=$(jq -r '.compilation_id // ""' "${REQUEST_FILE}")
ENGINE=$(jq -r '.engine // "pdflatex"' "${REQUEST_FILE}")
ROOT_FILE=$(jq -r '.root_file // "main.tex"' "${REQUEST_FILE}")
SYNCTEX=$(jq -r '.enable_synctex // true' "${REQUEST_FILE}")

# Allow-list compiler engine
case "${ENGINE}" in
    pdflatex)
        LATEXMK_ENGINE_FLAG="-pdf"
        ;;
    xelatex)
        LATEXMK_ENGINE_FLAG="-xelatex"
        ;;
    lualatex)
        LATEXMK_ENGINE_FLAG="-lualatex"
        ;;
    *)
        jq -n --arg id "${COMPILATION_ID}" --arg err "Unsupported engine: ${ENGINE}" \
            '{protocol_version:"1.0",compilation_id:$id,status:"failed",exit_code:2,error:$err}' > "${RESULT_FILE}"
        exit 2
        ;;
esac

# Validate root_file stays relative inside /work/src
if [[ "${ROOT_FILE}" = /* || "${ROOT_FILE}" == *".."* ]]; then
    jq -n --arg id "${COMPILATION_ID}" --arg err "Invalid root_file path" \
        '{protocol_version:"1.0",compilation_id:$id,status:"failed",exit_code:2,error:$err}' > "${RESULT_FILE}"
    exit 2
fi

cd /work/src

SYNCTEX_FLAG="-synctex=0"
if [[ "${SYNCTEX}" == "true" ]]; then
    SYNCTEX_FLAG="-synctex=1"
fi

START_NS=$(date +%s%N)
set +e
latexmk \
    "${LATEXMK_ENGINE_FLAG}" \
    -no-shell-escape \
    -interaction=nonstopmode \
    -file-line-error \
    "${SYNCTEX_FLAG}" \
    -outdir="${OUT_DIR}" \
    "${ROOT_FILE}" > "${OUT_DIR}/worker-stdout.log" 2>&1
EXIT_CODE=$?
set -e
END_NS=$(date +%s%N)
DURATION_MS=$(( (END_NS - START_NS) / 1000000 ))

BASE_NAME=$(basename "${ROOT_FILE}" .tex)
PDF_PATH="${OUT_DIR}/${BASE_NAME}.pdf"
LOG_PATH="${OUT_DIR}/${BASE_NAME}.log"
SYNCTEX_PATH="${OUT_DIR}/${BASE_NAME}.synctex.gz"

STATUS="failed"
if [[ ${EXIT_CODE} -eq 0 && -f "${PDF_PATH}" ]]; then
    STATUS="succeeded"
fi

PDF_REL=""
LOG_REL=""
SYNCTEX_REL=""
OUTPUT_BYTES=0

if [[ -f "${PDF_PATH}" ]]; then
    PDF_REL="out/${BASE_NAME}.pdf"
    OUTPUT_BYTES=$(wc -c < "${PDF_PATH}")
fi
if [[ -f "${LOG_PATH}" ]]; then
    LOG_REL="out/${BASE_NAME}.log"
fi
if [[ -f "${SYNCTEX_PATH}" ]]; then
    SYNCTEX_REL="out/${BASE_NAME}.synctex.gz"
fi

jq -n \
    --arg id "${COMPILATION_ID}" \
    --arg status "${STATUS}" \
    --argjson exit_code "${EXIT_CODE}" \
    --argjson duration_ms "${DURATION_MS}" \
    --argjson output_bytes "${OUTPUT_BYTES}" \
    --arg pdf "${PDF_REL}" \
    --arg log "${LOG_REL}" \
    --arg synctex "${SYNCTEX_REL}" \
    '{
        protocol_version: "1.0",
        compilation_id: $id,
        status: $status,
        exit_code: $exit_code,
        metrics: {
            duration_ms: $duration_ms,
            output_bytes: $output_bytes
        },
        artifacts: {
            pdf: (if $pdf == "" then null else $pdf end),
            log: (if $log == "" then null else $log end),
            synctex: (if $synctex == "" then null else $synctex end)
        }
    }' > "${RESULT_FILE}"

exit "${EXIT_CODE}"
