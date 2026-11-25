#!/usr/bin/env bash
#
# Package the NestJS API and deploy it. Bundle the pinned SES SDK so inline
# attachments are serialized even when Lambda's runtime SDK is older.
#
#   bash deploy.sh               build the production package locally
#   bash deploy.sh package       build dist + zip only
#   bash deploy.sh production    cut over live only with an explicit safety flag
#
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
PROD_NAME="cloud-calendars-api"
ZIP="/tmp/${PROD_NAME}-nest.zip"
STAGE_DIR="/tmp/${PROD_NAME}-nest-build"

log() { printf '\033[36m▸\033[0m %s\n' "$*"; }
MODE="${1:-package}"

package() {
  log "build (tsc)"
  rm -rf "$HERE/dist"
  (cd "$HERE" && npx tsc -p tsconfig.json)

  log "staging production dependencies (including pinned SES SDK)"
  rm -rf "$STAGE_DIR"; mkdir -p "$STAGE_DIR"
  cp -R "$HERE/dist" "$STAGE_DIR/dist"
  if [[ -d "$HERE/data" ]]; then
    cp -R "$HERE/data" "$STAGE_DIR/data"
  fi
  cp "$HERE/package.json" "$HERE/package-lock.json" "$STAGE_DIR/"
  (cd "$STAGE_DIR" && npm ci --omit=dev --no-audit --no-fund >/dev/null 2>&1)

  log "zip"
  rm -f "$ZIP"
  if [[ -d "$STAGE_DIR/data" ]]; then
    (cd "$STAGE_DIR" && zip -qr "$ZIP" dist data node_modules package.json)
  else
    (cd "$STAGE_DIR" && zip -qr "$ZIP" dist node_modules package.json)
  fi
  log "package ready: $(du -h "$ZIP" | cut -f1) → $ZIP"
}

deploy_production() {
  if [[ "${ALLOW_PRODUCTION_DEPLOY:-}" != "I_UNDERSTAND_THIS_UPDATES_LIVE" ]]; then
    echo "Production deploy is locked. Set ALLOW_PRODUCTION_DEPLOY=I_UNDERSTAND_THIS_UPDATES_LIVE only after explicit release approval." >&2
    exit 2
  fi
  log "checking sharing, legacy web clients and account calendar contracts"
  (cd "$HERE" && npx ts-node test/calendar-sharing.integration.ts && npx ts-node test/native-calendar-sync.ts && npx ts-node test/web-platform.integration.ts && npx ts-node test/ios-qr-totp-billing.integration.ts && npx ts-node test/provider-calendar-workspace.ts && npx ts-node test/native-calendar-route.ts)
  package
  python3 "$HERE/scripts/deploy-production-compatible.py" "$ZIP"
}

case "$MODE" in
  package)    package ;;
  debug)      echo "The remote Debug service was retired on 2026-11-25." >&2; exit 2 ;;
  production) deploy_production ;;
  *) echo "usage: bash deploy.sh [package|production]" >&2; exit 1 ;;
esac
