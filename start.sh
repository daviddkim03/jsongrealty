#!/usr/bin/env bash
# One-command dev startup for the Astro static site.
# Usage: ./start.sh

set -euo pipefail

cd "$(dirname "$0")"

if [ ! -d node_modules ]; then
  echo "→ Installing dependencies (first run only, ~1 min)"
  npm install
fi

URL="http://localhost:4321/"

echo "→ Starting Astro dev server"
echo "  Open: $URL"
echo ""

open_browser() {
  if command -v xdg-open >/dev/null 2>&1; then xdg-open "$1" >/dev/null 2>&1 &
  elif command -v open >/dev/null 2>&1; then open "$1" >/dev/null 2>&1 &
  elif command -v wslview >/dev/null 2>&1; then wslview "$1" >/dev/null 2>&1 &
  else echo "  (no browser opener found — visit $1 manually)"; fi
}

(
  for _ in $(seq 1 30); do
    if curl -sf -o /dev/null "$URL"; then
      open_browser "$URL"
      exit 0
    fi
    sleep 0.5
  done
  echo "  (server didn't come up within 15s — open $URL manually)"
) &

exec npm run dev
