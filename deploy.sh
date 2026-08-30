#!/usr/bin/env bash
#
# Package the NestJS API and deploy it. @aws-sdk is a devDependency, so the
# production bundle omits it and relies on the Node 20 Lambda runtime's copy —
# exactly as the original code did (the architecture is preserved).
#
#   bash deploy.sh package       build dist + zip only
#   bash deploy.sh staging       deploy to a scratch function + HTTP API (safe)
#   bash deploy.sh production    cut over the live cloud-calendars-api function
#
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
REGION="us-east-1"
ACCOUNT="303803840503"
ROLE_ARN="arn:aws:iam::${ACCOUNT}:role/cloud-calendars-api"   # reuse the S3-scoped role
PROD_NAME="cloud-calendars-api"
STAGING_NAME="cloud-calendars-api-nest-staging"
HANDLER="dist/lambda.handler"
RUNTIME="nodejs20.x"
BUCKET="cal.cloud-calendars.com"
FEED_HOST="cal.cloud-calendars.com"
ZIP="/tmp/${PROD_NAME}-nest.zip"
STAGE_DIR="/tmp/${PROD_NAME}-nest-build"

log() { printf '\033[36m▸\033[0m %s\n' "$*"; }
MODE="${1:-package}"

package() {
  log "build (tsc)"
  (cd "$HERE" && npx tsc -p tsconfig.json)

  log "staging production dependencies (no @aws-sdk)"
  rm -rf "$STAGE_DIR"; mkdir -p "$STAGE_DIR"
  cp -R "$HERE/dist" "$STAGE_DIR/dist"
  cp "$HERE/package.json" "$HERE/package-lock.json" "$STAGE_DIR/"
  (cd "$STAGE_DIR" && npm ci --omit=dev --no-audit --no-fund >/dev/null 2>&1)

  log "zip"
  rm -f "$ZIP"
  (cd "$STAGE_DIR" && zip -qr "$ZIP" dist node_modules package.json)
  log "package ready: $(du -h "$ZIP" | cut -f1) → $ZIP"
}

deploy_staging() {
  package
  local ENV="Variables={CAL_BUCKET=${BUCKET},FEED_HOST=${FEED_HOST},GOOGLE_CLIENT_ID=540859420644-a5mnvraqupd7l804e0s4e60doddqlktr.apps.googleusercontent.com,EMAIL_FROM=Cloud Calendars <bookings@cloud-calendars.com>}"
  if aws lambda get-function --function-name "$STAGING_NAME" --region "$REGION" >/dev/null 2>&1; then
    log "updating staging function code"
    aws lambda update-function-code --function-name "$STAGING_NAME" --zip-file "fileb://$ZIP" --region "$REGION" >/dev/null
    aws lambda wait function-updated --function-name "$STAGING_NAME" --region "$REGION"
    aws lambda update-function-configuration --function-name "$STAGING_NAME" --region "$REGION" \
      --handler "$HANDLER" --runtime "$RUNTIME" --timeout 30 --memory-size 512 --environment "$ENV" >/dev/null
    aws lambda wait function-updated --function-name "$STAGING_NAME" --region "$REGION"
  else
    log "creating staging function"
    aws lambda create-function --function-name "$STAGING_NAME" \
      --runtime "$RUNTIME" --handler "$HANDLER" --role "$ROLE_ARN" \
      --zip-file "fileb://$ZIP" --timeout 30 --memory-size 512 \
      --environment "$ENV" --region "$REGION" >/dev/null
    aws lambda wait function-active --function-name "$STAGING_NAME" --region "$REGION"
  fi
  local FN_ARN
  FN_ARN=$(aws lambda get-function --function-name "$STAGING_NAME" --region "$REGION" --query Configuration.FunctionArn --output text)
  local API_ID
  API_ID=$(aws apigatewayv2 get-apis --region "$REGION" --query "Items[?Name=='${STAGING_NAME}'].ApiId | [0]" --output text)
  if [[ "$API_ID" == "None" || -z "$API_ID" ]]; then
    log "creating staging HTTP API"
    API_ID=$(aws apigatewayv2 create-api --name "$STAGING_NAME" --protocol-type HTTP --target "$FN_ARN" --region "$REGION" --query ApiId --output text)
    aws lambda add-permission --function-name "$STAGING_NAME" --statement-id apigw-invoke \
      --action lambda:InvokeFunction --principal apigateway.amazonaws.com \
      --source-arn "arn:aws:execute-api:${REGION}:${ACCOUNT}:${API_ID}/*" --region "$REGION" >/dev/null
  fi
  local ENDPOINT
  ENDPOINT=$(aws apigatewayv2 get-api --api-id "$API_ID" --region "$REGION" --query ApiEndpoint --output text)
  log "staging endpoint: ${ENDPOINT}"
  echo "$ENDPOINT" > "$HERE/.staging-endpoint"
}

deploy_production() {
  package
  log "CUTOVER: updating live ${PROD_NAME} code"
  aws lambda update-function-code --function-name "$PROD_NAME" --zip-file "fileb://$ZIP" --region "$REGION" >/dev/null
  aws lambda wait function-updated --function-name "$PROD_NAME" --region "$REGION"
  log "setting handler=${HANDLER} (runtime stays ${RUNTIME}; env untouched)"
  aws lambda update-function-configuration --function-name "$PROD_NAME" --region "$REGION" \
    --handler "$HANDLER" --runtime "$RUNTIME" >/dev/null
  aws lambda wait function-updated --function-name "$PROD_NAME" --region "$REGION"
  log "cutover complete. Live at https://api.cloud-calendars.com"
}

case "$MODE" in
  package)    package ;;
  staging)    deploy_staging ;;
  production) deploy_production ;;
  *) echo "usage: bash deploy.sh [package|staging|production]" >&2; exit 1 ;;
esac
