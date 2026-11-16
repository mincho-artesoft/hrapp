// Keep credentials in memory; never pass the Lambda environment through argv.
import { LambdaClient, GetFunctionConfigurationCommand, UpdateFunctionConfigurationCommand } from '@aws-sdk/client-lambda';
import { execFileSync } from 'node:child_process';
const name = 'cloud-calendars-api-debug';
const [bucket, feedHost, endpoint] = process.argv.slice(2);
if (bucket !== 'cloud-calendars-api-debug-303803840503' || !endpoint?.startsWith('https://')
    || new URL(endpoint).host !== feedHost || !feedHost.endsWith('.execute-api.us-east-1.amazonaws.com')) {
  throw new Error('Only the isolated Debug configuration is allowed');
}
const lambda = new LambdaClient({ region: 'us-east-1' });
const apis = JSON.parse(execFileSync('aws', ['apigatewayv2', 'get-apis', '--region', 'us-east-1',
  '--query', "Items[?Name=='cloud-calendars-api-debug'].ApiEndpoint", '--output', 'json'], { encoding: 'utf8' }));
if (apis.length !== 1 || apis[0] !== endpoint) throw new Error('Endpoint does not match the actual Debug API Gateway');
const current = await lambda.send(new GetFunctionConfigurationCommand({ FunctionName: name }));
await lambda.send(new UpdateFunctionConfigurationCommand({
  FunctionName: name, Handler: 'dist/lambda.handler', Runtime: 'nodejs20.x', Timeout: 30, MemorySize: 512,
  Environment: { Variables: {
    ...current.Environment?.Variables, CAL_BUCKET: bucket, FEED_HOST: feedHost, API_URL: endpoint,
    GOOGLE_CLIENT_ID: '540859420644-a5mnvraqupd7l804e0s4e60doddqlktr.apps.googleusercontent.com',
    EMAIL_FROM: 'Cloud Calendars Debug <no-reply@cloud-calendars.com>',
  } },
}));
console.log('Debug configuration updated; existing private environment values preserved.');
