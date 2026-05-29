#!/usr/bin/env bash
# Render the Atlanta Seller's Guide HTML source to PDF.
#
# Usage:
#   ./scripts/build-seller-guide.sh
#
# Requires `chromium` (or chrome) on PATH. Outputs the PDF to
# public/assets/guides/jsong-atlanta-sellers-guide.pdf — the path
# referenced by public/assets/js/api-config.js.

set -euo pipefail

cd "$(dirname "$0")/.."

SRC="$(pwd)/scripts/seller-guide.html"
OUT="$(pwd)/public/assets/guides/jsong-atlanta-sellers-guide.pdf"

if [ ! -f "$SRC" ]; then
  echo "Source HTML not found at $SRC" >&2
  exit 1
fi

mkdir -p "$(dirname "$OUT")"

BIN="${CHROMIUM_BIN:-}"
if [ -z "$BIN" ]; then
  for candidate in chromium chromium-browser google-chrome chrome; do
    if command -v "$candidate" >/dev/null 2>&1; then
      BIN="$candidate"
      break
    fi
  done
fi

if [ -z "$BIN" ]; then
  echo "No chromium/chrome binary found on PATH. Set CHROMIUM_BIN=/path/to/chromium." >&2
  exit 1
fi

echo "Rendering with $BIN..."
"$BIN" \
  --headless \
  --disable-gpu \
  --no-sandbox \
  --hide-scrollbars \
  --no-pdf-header-footer \
  --print-to-pdf-no-header \
  --print-to-pdf="$OUT" \
  --virtual-time-budget=10000 \
  "file://$SRC"

echo "Wrote $OUT"
ls -lh "$OUT"
