#!/usr/bin/env bash
#
# scan_secrets.sh — fast first-pass scan for secrets / session material before you commit
# or share anything from a recon repo or workspace.
#
# Usage:   skills/recon/scripts/scan_secrets.sh [path]   (defaults to current directory)
#
# recon captures live-product data — cookies, tokens, storageState, signed URLs — which
# must NEVER be committed. This is a heuristic grep, NOT a SAST tool: it over-reports
# (example keys in docs) and under-reports (novel formats). Confirm every hit by eye.
# The real defense is .gitignore (.recon/, .auth/, *storageState*); this is the backstop.
#
set -euo pipefail

ROOT="${1:-.}"

EXCLUDES=(--exclude-dir=.git --exclude-dir=node_modules --exclude-dir=.venv
          --exclude-dir=venv --exclude-dir=__pycache__ --exclude-dir=dist
          --exclude-dir=build --exclude-dir=.mypy_cache --exclude-dir=.pytest_cache)

# description|pattern
PATTERNS=(
  'Playwright storageState (session!)|"cookies"\s*:\s*\[|"origins"\s*:\s*\[.*"localStorage"'
  'Cookie header / Set-Cookie|(?i)(set-)?cookie["'"'"' :=]+[A-Za-z0-9_-]+=[^;"'"'"' \n]{8,}'
  'Session/JWT token|eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{6,}'
  'Bearer token literal|[Bb]earer [0-9A-Za-z._-]{16,}'
  'Slack token|xox[baprs]-[0-9A-Za-z-]{10,}'
  'AWS access key|AKIA[0-9A-Z]{16}'
  'Private key block|-----BEGIN [A-Z ]*PRIVATE KEY-----'
  'Generic api key assignment|(?i)(api[_-]?key|x-api-key|apikey)["'"'"' :=]+[0-9A-Za-z._-]{12,}'
  'Password/secret assignment|(?i)(password|passwd|secret|token)["'"'"' :=]+[^"'"'"' \n]{6,}'
  'Signed URL (aws/gcs style)|[?&](X-Amz-Signature|Signature|sig|token)=[A-Za-z0-9%._-]{16,}'
  'Connection string with creds|[a-z]+://[^:@/ ]+:[^@/ ]+@'
)

echo "scan_secrets.sh — heuristic scan of: $ROOT"
echo "recon captures are sensitive. Confirm every hit by eye; masking output != removing a leak (rotate + scrub history)."
echo

found=0
for entry in "${PATTERNS[@]}"; do
  desc="${entry%%|*}"
  pat="${entry#*|}"
  if hits=$(grep -rInE "${EXCLUDES[@]}" -- "$pat" "$ROOT" 2>/dev/null); then
    if [ -n "$hits" ]; then
      echo "== $desc =="
      echo "$hits"
      echo
      found=1
    fi
  fi
done

if [ "$found" -eq 0 ]; then
  echo "No heuristic matches. (Absence of matches is not proof of absence — confirm .recon/ and .auth/ are gitignored.)"
fi
