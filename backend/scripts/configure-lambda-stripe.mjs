#!/usr/bin/env node
/**
 * Syncs Stripe Live environment variables from .local-secrets/stripe-live.env (or .env)
 * directly into AWS Lambda's encrypted Environment.Variables via @aws-sdk/client-lambda.
 * Never prints secrets, never passes secrets in argv, and preserves all existing variables.
 *
 * Usage:
 *   node scripts/configure-lambda-stripe.mjs debug
 *   ALLOW_PRODUCTION_DEPLOY=I_UNDERSTAND_THIS_UPDATES_LIVE node scripts/configure-lambda-stripe.mjs production
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  LambdaClient,
  GetFunctionConfigurationCommand,
  UpdateFunctionConfigurationCommand,
  waitUntilFunctionUpdated,
} from '@aws-sdk/client-lambda';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const REGION = 'us-east-1';

const target = (process.argv[2] || 'debug').trim();
if (target !== 'debug' && target !== 'production') {
  console.error('Usage: node scripts/configure-lambda-stripe.mjs [debug|production]');
  process.exit(1);
}

if (target === 'production' && process.env.ALLOW_PRODUCTION_DEPLOY !== 'I_UNDERSTAND_THIS_UPDATES_LIVE') {
  console.error(
    'Production Lambda update is locked. Set ALLOW_PRODUCTION_DEPLOY=I_UNDERSTAND_THIS_UPDATES_LIVE to update live cloud-calendars-api.',
  );
  process.exit(2);
}

const fnName = target === 'production' ? 'cloud-calendars-api' : 'cloud-calendars-api-debug';

function readEnvFile() {
  const candidates = [
    path.join(ROOT_DIR, '.local-secrets', 'stripe-live.env'),
    path.join(ROOT_DIR, '.env'),
  ];
  for (const filePath of candidates) {
    if (!fs.existsSync(filePath)) continue;
    const out = {};
    for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq <= 0) continue;
      const k = trimmed.slice(0, eq).trim();
      const v = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, '');
      if (k) out[k] = v;
    }
    return { filePath, values: out };
  }
  throw new Error('Missing .local-secrets/stripe-live.env or .env');
}

const { filePath, values } = readEnvFile();
const requiredKeys = [
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'STRIPE_PRICE_MONTHLY_ID',
  'STRIPE_PRICE_YEARLY_ID',
];
for (const key of requiredKeys) {
  if (!values[key]) {
    throw new Error(`Missing required key ${key} in ${path.basename(filePath)}`);
  }
}

if (!/^(rk|sk)_(live|test)_/.test(values.STRIPE_SECRET_KEY)) {
  throw new Error('STRIPE_SECRET_KEY has unexpected prefix');
}
if (!/^whsec_/.test(values.STRIPE_WEBHOOK_SECRET)) {
  throw new Error('STRIPE_WEBHOOK_SECRET has unexpected prefix');
}

const lambda = new LambdaClient({ region: REGION });
const current = await lambda.send(new GetFunctionConfigurationCommand({ FunctionName: fnName }));
const mergedVariables = {
  ...(current.Environment?.Variables ?? {}),
  STRIPE_SECRET_KEY: values.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: values.STRIPE_WEBHOOK_SECRET,
  STRIPE_PRICE_MONTHLY_ID: values.STRIPE_PRICE_MONTHLY_ID,
  STRIPE_PRICE_YEARLY_ID: values.STRIPE_PRICE_YEARLY_ID,
  ...(values.STRIPE_PORTAL_CONFIGURATION_ID
    ? { STRIPE_PORTAL_CONFIGURATION_ID: values.STRIPE_PORTAL_CONFIGURATION_ID }
    : {}),
};

if (Buffer.byteLength(JSON.stringify(mergedVariables)) > 4096) {
  throw new Error('Merged Lambda Environment.Variables exceeds 4 KB limit');
}

await lambda.send(
  new UpdateFunctionConfigurationCommand({
    FunctionName: fnName,
    Environment: { Variables: mergedVariables },
  }),
);

await waitUntilFunctionUpdated(
  { client: lambda, maxWaitTime: 60 },
  { FunctionName: fnName },
);

console.log(
  `Updated encrypted Stripe environment on ${fnName} (${REGION}); keys now present: ${Object.keys(mergedVariables).sort().join(', ')}`,
);
