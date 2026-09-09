#!/usr/bin/env bash
#
# Package the NestJS API and deploy it. @aws-sdk is a devDependency, so the
# production bundle omits it and relies on the Node 20 Lambda runtime's copy —
# exactly as the original code did (the architecture is preserved).
#
#   bash deploy.sh               deploy to the isolated debug environment
#   bash deploy.sh package       build dist + zip only
#   bash deploy.sh debug         deploy to the isolated debug environment
#   bash deploy.sh production    cut over live only with an explicit safety flag
#
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
REGION="us-east-1"
ACCOUNT="303803840503"
PROD_NAME="cloud-calendars-api"
DEBUG_NAME="cloud-calendars-api-debug"
DEBUG_BUCKET="cloud-calendars-api-debug-${ACCOUNT}"
DEBUG_ROLE_NAME="cloud-calendars-api-debug"
DEBUG_ROLE_ARN="arn:aws:iam::${ACCOUNT}:role/${DEBUG_ROLE_NAME}"
HANDLER="dist/lambda.handler"
RUNTIME="nodejs20.x"
ZIP="/tmp/${PROD_NAME}-nest.zip"
STAGE_DIR="/tmp/${PROD_NAME}-nest-build"

log() { printf '\033[36m▸\033[0m %s\n' "$*"; }
MODE="${1:-debug}"

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

ensure_debug_infrastructure() {
  if ! aws s3api head-bucket --bucket "$DEBUG_BUCKET" >/dev/null 2>&1; then
    log "creating isolated debug bucket ${DEBUG_BUCKET}"
    aws s3api create-bucket --bucket "$DEBUG_BUCKET" --region "$REGION" >/dev/null
    aws s3api put-public-access-block --bucket "$DEBUG_BUCKET" \
      --public-access-block-configuration \
      'BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true'
    aws s3api put-bucket-encryption --bucket "$DEBUG_BUCKET" \
      --server-side-encryption-configuration \
      '{"Rules":[{"ApplyServerSideEncryptionByDefault":{"SSEAlgorithm":"AES256"},"BucketKeyEnabled":true}]}'
    aws s3api put-bucket-tagging --bucket "$DEBUG_BUCKET" \
      --tagging 'TagSet=[{Key=Project,Value=CloudCalendars},{Key=Environment,Value=debug}]'
  fi

  if ! aws iam get-role --role-name "$DEBUG_ROLE_NAME" >/dev/null 2>&1; then
    log "creating isolated debug Lambda role ${DEBUG_ROLE_NAME}"
    aws iam create-role --role-name "$DEBUG_ROLE_NAME" \
      --assume-role-policy-document \
      '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"lambda.amazonaws.com"},"Action":"sts:AssumeRole"}]}' >/dev/null
    aws iam attach-role-policy --role-name "$DEBUG_ROLE_NAME" \
      --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
  fi

  aws iam put-role-policy --role-name "$DEBUG_ROLE_NAME" --policy-name s3-debug-only \
    --policy-document \
    "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Action\":[\"s3:GetObject\",\"s3:PutObject\",\"s3:DeleteObject\",\"s3:ListBucket\"],\"Resource\":[\"arn:aws:s3:::${DEBUG_BUCKET}\",\"arn:aws:s3:::${DEBUG_BUCKET}/*\"]}]}"
  aws iam put-role-policy --role-name "$DEBUG_ROLE_NAME" --policy-name ses-send \
    --policy-document \
    '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Action":["ses:SendEmail"],"Resource":"*"}]}'
}

deploy_debug() {
  ensure_debug_infrastructure
  package
  if aws lambda get-function --function-name "$DEBUG_NAME" --region "$REGION" >/dev/null 2>&1; then
    log "updating debug function code"
    aws lambda update-function-code --function-name "$DEBUG_NAME" --zip-file "fileb://$ZIP" --region "$REGION" >/dev/null
    aws lambda wait function-updated --function-name "$DEBUG_NAME" --region "$REGION"
  else
    log "creating debug function"
    aws lambda create-function --function-name "$DEBUG_NAME" \
      --runtime "$RUNTIME" --handler "$HANDLER" --role "$DEBUG_ROLE_ARN" \
      --zip-file "fileb://$ZIP" --timeout 30 --memory-size 512 \
      --environment "Variables={CAL_BUCKET=${DEBUG_BUCKET},FEED_HOST=invalid.local}" \
      --region "$REGION" >/dev/null
    aws lambda wait function-active --function-name "$DEBUG_NAME" --region "$REGION"
  fi
  local FN_ARN
  FN_ARN=$(aws lambda get-function --function-name "$DEBUG_NAME" --region "$REGION" --query Configuration.FunctionArn --output text)
  local API_ID
  API_ID=$(aws apigatewayv2 get-apis --region "$REGION" --query "Items[?Name=='${DEBUG_NAME}'].ApiId | [0]" --output text)
  if [[ "$API_ID" == "None" || -z "$API_ID" ]]; then
    log "creating debug HTTP API"
    API_ID=$(aws apigatewayv2 create-api --name "$DEBUG_NAME" --protocol-type HTTP --target "$FN_ARN" --region "$REGION" --query ApiId --output text)
    aws lambda add-permission --function-name "$DEBUG_NAME" --statement-id apigw-invoke \
      --action lambda:InvokeFunction --principal apigateway.amazonaws.com \
      --source-arn "arn:aws:execute-api:${REGION}:${ACCOUNT}:${API_ID}/*" --region "$REGION" >/dev/null
  fi
  local ENDPOINT
  ENDPOINT=$(aws apigatewayv2 get-api --api-id "$API_ID" --region "$REGION" --query ApiEndpoint --output text)
  local FEED_HOST="${ENDPOINT#https://}"
  local ENV="Variables={CAL_BUCKET=${DEBUG_BUCKET},FEED_HOST=${FEED_HOST},API_URL=${ENDPOINT},GOOGLE_CLIENT_ID=540859420644-a5mnvraqupd7l804e0s4e60doddqlktr.apps.googleusercontent.com,EMAIL_FROM=Cloud Calendars Debug <no-reply@cloud-calendars.com>}"
  log "configuring debug function for its isolated bucket and endpoint"
  aws lambda update-function-configuration --function-name "$DEBUG_NAME" --region "$REGION" \
    --handler "$HANDLER" --runtime "$RUNTIME" --timeout 30 --memory-size 512 \
    --environment "$ENV" >/dev/null
  aws lambda wait function-updated --function-name "$DEBUG_NAME" --region "$REGION"
  log "debug endpoint: ${ENDPOINT}"
  echo "$ENDPOINT" > "$HERE/.debug-endpoint"
}

deploy_production() {
  if [[ "${ALLOW_PRODUCTION_DEPLOY:-}" != "I_UNDERSTAND_THIS_UPDATES_LIVE" ]]; then
    echo "Production deploy is locked. Set ALLOW_PRODUCTION_DEPLOY=I_UNDERSTAND_THIS_UPDATES_LIVE only after explicit release approval." >&2
    exit 2
  fi
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
  debug)      deploy_debug ;;
  production) deploy_production ;;
  *) echo "usage: bash deploy.sh [debug|package|production]" >&2; exit 1 ;;
esac
