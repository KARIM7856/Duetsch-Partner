#!/usr/bin/env bash
#
# Deploy the DeutschFlow frontend (Next.js, in ./frontend) to Vercel.
# Vercel builds the app remotely, so no local build is required.
#
# The token is read from the VERCEL_TOKEN environment variable and is never
# stored in this file. Optional: VERCEL_PROJECT (link to an existing project),
# PREVIEW=1 (preview deploy), SYNC_ENV=1 (push GEMINI/OPENAI keys from .env).
#
# Usage:
#   export VERCEL_TOKEN="<your-token>"
#   ./deploy.sh
#   VERCEL_PROJECT=deutschflow ./deploy.sh
#   PREVIEW=1 ./deploy.sh
#   SYNC_ENV=1 ./deploy.sh

set -euo pipefail

TOKEN="${VERCEL_TOKEN:-}"
PROJECT="${VERCEL_PROJECT:-}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND="$SCRIPT_DIR/frontend"

if [ -z "$TOKEN" ]; then
  echo "ERROR: set VERCEL_TOKEN, e.g.  export VERCEL_TOKEN=\"<your-token>\"" >&2
  exit 1
fi
if [ ! -f "$FRONTEND/package.json" ]; then
  echo "ERROR: $FRONTEND/package.json not found" >&2
  exit 1
fi

# Deploy from the repo ROOT. The Vercel project's Root Directory is set to
# "frontend", so Vercel builds ./frontend from there. (Deploying from inside
# ./frontend makes Vercel look for frontend/frontend and return a 404.)
cd "$SCRIPT_DIR"

vercel() { npx --yes vercel@latest "$@"; }

# 1. Make sure the repo root is linked. Reuse the known-good link file (copy it
#    up from ./frontend) so `vercel deploy` finds it at the root. `vercel link
#    --yes` is avoided because that CLI path can crash.
if [ ! -f .vercel/project.json ] && [ -f frontend/.vercel/project.json ]; then
  mkdir -p .vercel
  cp frontend/.vercel/project.json .vercel/project.json
fi
if [ ! -f .vercel/project.json ]; then
  echo "ERROR: not linked. Run 'npx vercel@latest link' once, then re-run." >&2
  exit 1
fi
echo "-> Using linked project: $(grep -oE '"projectName":"[^"]+"' .vercel/project.json | cut -d'"' -f4)"

# 2. Optionally push runtime secrets from frontend/.env to the production env.
if [ "${SYNC_ENV:-}" = "1" ]; then
  for name in GEMINI_API_KEY OPENAI_API_KEY; do
    value="$(grep -E "^\s*${name}=" frontend/.env 2>/dev/null | head -n1 | sed -E "s/^\s*${name}=//" | tr -d '"' || true)"
    if [ -n "$value" ]; then
      echo "-> Setting $name (production)"
      vercel env rm "$name" production --yes --token "$TOKEN" >/dev/null 2>&1 || true
      printf '%s' "$value" | vercel env add "$name" production --token "$TOKEN" \
        || echo "   WARNING: could not set $name; set it in the Vercel dashboard." >&2
    else
      echo "   (skipped $name - not found in frontend/.env)"
    fi
  done
fi
#
# 3. Deploy. Vercel builds remotely; the URL is printed on success.
target=(--prod)
[ "${PREVIEW:-}" = "1" ] && target=()
echo "-> Deploying to Vercel"
vercel deploy "${target[@]}" --yes --token "$TOKEN"

echo ""
echo "Deploy finished."
[ "${SYNC_ENV:-}" = "1" ] || echo "Reminder: ensure GEMINI_API_KEY (+ OPENAI_API_KEY for Speak) are set in the Vercel project, or re-run with SYNC_ENV=1."