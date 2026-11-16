import assert from 'node:assert/strict';
import { sendGuardItems, EmailSendGuard } from '../src/email/send-guard';
async function main() {
 const a=sendGuardItems('guard','prod','one@example.net','Subject','Body',1234567890);
 const b=sendGuardItems('guard','prod','one@example.net','Subject','Body',1234567890);
 assert.equal(a.length,5);assert.deepEqual(a,b);
 assert(!JSON.stringify(a).includes('one@example.net'));
 assert.notDeepEqual(a,sendGuardItems('guard','prod','two@example.net','Subject','Body',1234567890));
 assert.equal((a[1] as any).Update.ExpressionAttributeValues[':limit'].N,'30');
 assert.equal((a[2] as any).Update.ExpressionAttributeValues[':limit'].N,'150');
 assert.equal((a[3] as any).Update.ExpressionAttributeValues[':limit'].N,'5');
 delete process.env.EMAIL_GUARD_TABLE;
 await assert.rejects(new EmailSendGuard().claim('from@example.com','to@example.net','Subject','Body'),/not-configured/);
 console.log('email guard tests passed; no email sent');
}
main().catch(e=>{console.error(e);process.exitCode=1;});
