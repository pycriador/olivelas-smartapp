#!/usr/bin/env bash
# OPTIONAL helper for adopting projects. Not a standard mandate.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DOCS_ROOT="${DOCS_ROOT:-docs}"
LINT_SCRIPT="${LINT_SCRIPT:-scripts/docs_lint.py}"

if [[ ! -f "$ROOT/$LINT_SCRIPT" ]]; then
  echo "Missing $LINT_SCRIPT — copy docs_lint.py from loft-br/aiops-documentation or set LINT_SCRIPT." >&2
  exit 1
fi

cd "$ROOT"
python3 "$LINT_SCRIPT" validate --root "$DOCS_ROOT" || python3 "$LINT_SCRIPT" validate
