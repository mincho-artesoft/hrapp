// Debug-only provisioning. Uses the existing AWS CLI credential chain. Never
// prints a private key or puts it in argv. The user chose to keep the original
// .p8 in this private backend repository, outside the deployment package.
// The user chose Lambda's encrypted environment over a separate secret service.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createPrivateKey } from 'node:crypto';
import { LambdaClient, UpdateFunctionConfigurationCommand } from '@aws-sdk/client-lambda';

const region = 'us-east-1';
const name = 'cloud-calendars-api-debug';
function aws(args, input) {
  return JSON.parse(execFileSync('aws', [...args, '--region', region, '--output', 'json'], {
    encoding: 'utf8', input, stdio: ['pipe', 'pipe', 'pipe'],
  }) || '{}');
}
const account = aws(['sts', 'get-caller-identity']).Account;
if (account !== '303803840503') throw new Error('Not the Cloud Calendars AWS account');
const fn = aws(['lambda', 'get-function-configuration', '--function-name', name]);
if (fn.Environment?.Variables?.CAL_BUCKET !== `${name}-${account}`) throw new Error('Not the isolated Debug bucket');

const [keyFile, keyId, teamId] = process.argv.slice(2);
const variables = { ...fn.Environment.Variables };
if (keyFile) {
  if (!/^[A-Z0-9]{10}$/.test(keyId ?? '') || teamId !== '8293TNMX6S') throw new Error('Invalid key metadata');
  const privateKey = readFileSync(keyFile, 'utf8');
  const parsed = createPrivateKey(privateKey);
  if (parsed.asymmetricKeyType !== 'ec' || parsed.asymmetricKeyDetails?.namedCurve !== 'prime256v1') throw new Error('Expected APNs P-256 key');
  Object.assign(variables, { APNS_KEY_ID: keyId, APNS_TEAM_ID: teamId, APNS_PRIVATE_KEY: privateKey });
}
if (!variables.APNS_PRIVATE_KEY) throw new Error('Supply the existing APNs-enabled key file first');
const dlqName = `${name}-push-dlq`;
const dlq = aws(['sqs', 'create-queue', '--queue-name', dlqName, '--attributes', JSON.stringify({
  MessageRetentionPeriod: '1209600', SqsManagedSseEnabled: 'true',
})]).QueueUrl;
const dlqArn = aws(['sqs', 'get-queue-attributes', '--queue-url', dlq, '--attribute-names', 'QueueArn']).Attributes.QueueArn;
const queue = aws(['sqs', 'create-queue', '--queue-name', `${name}-push`, '--attributes', JSON.stringify({
  VisibilityTimeout: '180', MessageRetentionPeriod: '345600', SqsManagedSseEnabled: 'true',
  RedrivePolicy: JSON.stringify({ deadLetterTargetArn: dlqArn, maxReceiveCount: 5 }),
})]).QueueUrl;
const queueArn = aws(['sqs', 'get-queue-attributes', '--queue-url', queue, '--attribute-names', 'QueueArn']).Attributes.QueueArn;
aws(['iam', 'put-role-policy', '--role-name', name, '--policy-name', 'invitation-push-debug-only', '--policy-document', JSON.stringify({
  Version: '2012-10-17', Statement: [
    { Effect: 'Allow', Action: ['sqs:SendMessage', 'sqs:ReceiveMessage', 'sqs:DeleteMessage', 'sqs:GetQueueAttributes'], Resource: queueArn },
  ],
})]);
Object.assign(variables, { PUSH_QUEUE_URL: queue, APNS_ALLOWED_ENVIRONMENTS: 'sandbox' });
if (Buffer.byteLength(JSON.stringify(variables)) > 4096) throw new Error('Lambda environment exceeds 4 KB');
// Send directly through the SDK, never a command-line argument or a temp file.
await new LambdaClient({ region }).send(new UpdateFunctionConfigurationCommand({
  FunctionName: name, Environment: { Variables: variables },
}));
aws(['lambda', 'wait', 'function-updated', '--function-name', name]);
const mappings = aws(['lambda', 'list-event-source-mappings', '--function-name', name, '--event-source-arn', queueArn]);
if (!mappings.EventSourceMappings.length) {
  aws(['lambda', 'create-event-source-mapping', '--function-name', name, '--event-source-arn', queueArn,
    '--batch-size', '1', '--function-response-types', 'ReportBatchItemFailures', '--enabled']);
}
aws(['cloudwatch', 'put-metric-alarm', '--alarm-name', `${name}-undelivered-invitations`,
  '--namespace', 'AWS/SQS', '--metric-name', 'ApproximateNumberOfMessagesVisible',
  '--dimensions', `Name=QueueName,Value=${dlqName}`, '--statistic', 'Maximum', '--period', '60',
  '--evaluation-periods', '1', '--threshold', '0', '--comparison-operator', 'GreaterThanThreshold',
  '--treat-missing-data', 'notBreaching']);
const bucket = fn.Environment.Variables.CAL_BUCKET;
let lifecycle = { Rules: [] };
try { lifecycle = aws(['s3api', 'get-bucket-lifecycle-configuration', '--bucket', bucket]); }
catch (error) { if (!String(error.stderr).includes('NoSuchLifecycleConfiguration')) throw error; }
const rules = lifecycle.Rules.filter((rule) => rule.ID !== 'expire-push-delivery-receipts');
rules.push({ ID: 'expire-push-delivery-receipts', Status: 'Enabled', Filter: { Prefix: 'push/receipts/' }, Expiration: { Days: 7 } });
aws(['s3api', 'put-bucket-lifecycle-configuration', '--bucket', bucket, '--lifecycle-configuration', JSON.stringify({ Rules: rules })]);
console.log('Debug APNs encrypted Lambda environment, retry queue, dead-letter queue and alarm configured. Production unchanged.');
