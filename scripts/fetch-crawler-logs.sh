#!/usr/bin/env bash
#
# Fetch CloudFront access logs into the gitignored local analysis directory.
#
#   ./scripts/fetch-crawler-logs.sh
#   node ai-visibility/crawler-log.mjs .crawler-logs/cloudfront --days=30
#
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ENV_FILE:-$ROOT_DIR/.env}"

die() { printf '\033[31m✗\033[0m %s\n' "$*" >&2; exit 1; }
log() { printf '\033[36m▸\033[0m %s\n' "$*"; }

[[ -f "$ENV_FILE" ]] || die "No env file at $ENV_FILE."

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

for var in NG_DEPLOY_AWS_ACCESS_KEY_ID NG_DEPLOY_AWS_SECRET_ACCESS_KEY \
           NG_DEPLOY_AWS_REGION CRAWLER_LOG_BUCKET; do
  [[ -n "${!var:-}" ]] || die "$var is required. Set it in $ENV_FILE."
done

AWS_BIN="${AWS_BIN:-$(command -v aws || true)}"
[[ -n "$AWS_BIN" ]] || die "AWS CLI not found."

prefix="${CRAWLER_LOG_PREFIX:-cloudfront/}"
prefix="${prefix#/}"
[[ -z "$prefix" || "$prefix" == */ ]] || prefix="$prefix/"
destination="${CRAWLER_LOG_DIR:-$ROOT_DIR/.crawler-logs/cloudfront}"
remote="s3://$CRAWLER_LOG_BUCKET/$prefix"

mkdir -p "$destination"
log "Syncing $remote → $destination"
AWS_ACCESS_KEY_ID="$NG_DEPLOY_AWS_ACCESS_KEY_ID" \
AWS_SECRET_ACCESS_KEY="$NG_DEPLOY_AWS_SECRET_ACCESS_KEY" \
AWS_DEFAULT_REGION="$NG_DEPLOY_AWS_REGION" \
  "$AWS_BIN" s3 sync "$remote" "$destination" --only-show-errors

count="$(find "$destination" -type f | wc -l | tr -d ' ')"
log "Fetched $count log file(s)."
