import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeLogs, parseArgs } from './crawler-log.mjs';
const now = new Date('2026-10-21T12:00:00Z');
const fields = ['date','time','sc-bytes','c-ip','cs-uri-stem','cs-uri-query','sc-status','cs(User-Agent)'];
const header = '#Version: 1.0\n#Fields: '+fields.join(' ');
const row = (o = {}, order = fields) => order.map(f => ({date:'2026-10-21',time:'10:00:00','sc-bytes':'200','c-ip':'192.0.2.45','cs-uri-stem':'/llms.txt','cs-uri-query':'secret=private','sc-status':'404','cs(User-Agent)':'Mozilla/5.0%20OAI-SearchBot/1.0',...o})[f]).join('\t');
const run = text => analyzeLogs([text], {now,days:30});
test('field order and status use named TSV columns, not byte count',()=>{
 const order=[...fields].reverse();const r=run('#Fields: '+order.join(' ')+'\n'+row({},order));
 assert.equal(r.declaredUserAgents['OAI-SearchBot'].statuses['404'],1);
 assert.equal(r.declaredUserAgents['OAI-SearchBot'].statuses['200'],undefined);
});
test('only UA field matches; token boundaries; spoof remains explicitly unverified',()=>{
 const r=run(header+'\n'+row({'cs(User-Agent)':'browser','cs-uri-stem':'/GPTBot/private','cs-uri-query':'OAI-SearchBot'})+'\n'+row({'cs(User-Agent)':'FakeGPTBotExtra'})+'\n'+row({'cs(User-Agent)':'GPTBot/1.0'}));
 assert.equal(r.counts.matchedRows,1);assert.match(r.interpretation[0],/spoofable and unverified/);
 assert.match(r.declaredUserAgents.GPTBot.kind,/training/);
});
test('stale logs report available dates but zero window coverage',()=>{
 const r=run(header+'\n'+row({date:'2026-07-01'}));assert.equal(r.coverage.availableMinDate,'2026-07-01');
 assert.equal(r.coverage.state,'no-valid-rows-in-window');assert.equal(r.counts.olderRows,1);
 assert.equal(r.window.startDateInclusive,'2026-09-22');
});
test('file headers never leak across files; unsupported formats and invalid rows counted',()=>{
 const r=analyzeLogs([header+'\n'+row(),row(),'S3 unsupported access record','#Fields: date time\n2026-10-21\t10:00:00',header+'\n'+row({date:'2026-02-30'})+'\nnot TSV'],{now});
 assert.equal(r.counts.parsedRows,1);assert.equal(r.counts.unsupportedFormatRows,3);assert.equal(r.counts.malformedRows,2);assert.equal(r.counts.invalidFieldHeaders,1);
});
test('all watch files, privacy, unknown UA and ambiguous UA handling',()=>{
 const secret='invitation-token-PRIVATE';const r=run(header+'\n'+row({'cs-uri-stem':'/llms-full.txt?token='+secret,'sc-status':'200'})+'\n'+row({'cs-uri-stem':'/event-invites/open/'+secret})+'\n'+row({'cs-uri-stem':'/articles/'+secret})+'\n'+row({'cs(User-Agent)':'Google-Extended'})+'\n'+row({'cs(User-Agent)':'GPTBot/1.0 ChatGPT-User/1.0'}));
 assert.equal(r.watchedPaths['/llms-full.txt'].trackedStatuses['200'],1);
 assert.equal(r.counts.ambiguousDeclaredUARows,1);assert.equal(r.declaredUserAgents['Google-Extended'],undefined);
 const output=JSON.stringify(r);for(const value of [secret,'192.0.2.45','secret=private','Mozilla/5.0']) assert.ok(!output.includes(value));
 assert.equal(r.watchedPaths['/llms.txt'].allRequests,2);
});
test('window boundaries, future dates and zero status',()=>{
 const r=run(header+'\n'+row({date:'2026-09-22','sc-status':'000'})+'\n'+row({date:'2026-09-21'})+'\n'+row({date:'2026-10-22'}));
 assert.equal(r.counts.windowRows,1);assert.equal(r.counts.futureRows,1);assert.equal(r.counts.olderRows,1);
 assert.equal(r.declaredUserAgents['OAI-SearchBot'].statuses['000'],1);
});
test('legacy and spaced days flags, JSON, invalid arguments',()=>{
 assert.deepEqual(parseArgs(['logs','--days=7','--json']),{dir:'logs',days:7,json:true});
 assert.equal(parseArgs(['logs','--days','7']).days,7);
 for(const args of [[],['logs','--days=NaN'],['logs','--days','0'],['logs','--wat']]) assert.throws(()=>parseArgs(args));
});

test('CLI reads gzip, counts unreadable files, emits sanitized JSON and safe text',async()=>{
 const {mkdtempSync,writeFileSync,rmSync}=await import('node:fs');
 const {tmpdir}=await import('node:os');const {join}=await import('node:path');
 const {gzipSync}=await import('node:zlib');const {spawnSync}=await import('node:child_process');
 const dir=mkdtempSync(join(tmpdir(),'crawler-log-test-'));
 try {
  const date=new Date().toISOString().slice(0,10);
  writeFileSync(join(dir,'sample.gz'),gzipSync(header+'\n'+row({date,'cs-uri-stem':'/event-invites/secret-ABC?token=XYZ'})));
  writeFileSync(join(dir,'bad.gz'),'not gzip');
  writeFileSync(join(dir,'unsupported.log'),'legacy S3 format with private-token');
  const args=['ai-visibility/crawler-log.mjs',dir,'--days','1'];
  const result=spawnSync(process.execPath,[...args,'--json'],{encoding:'utf8'});
  assert.equal(result.status,0);const report=JSON.parse(result.stdout);
  assert.equal(report.counts.unreadableFiles,1);assert.equal(report.counts.unsupportedFormatRows,1);assert.equal(report.counts.windowRows,1);
  const text=spawnSync(process.execPath,args,{encoding:'utf8'});
  assert.equal(text.status,0);assert.match(text.stdout,/unverified/);
  for(const value of ['secret-ABC','token=XYZ','private-token','192.0.2.45',dir]) {
   assert.ok(!result.stdout.includes(value));assert.ok(!text.stdout.includes(value));assert.ok(!result.stderr.includes(value));
  }
 } finally {rmSync(dir,{recursive:true,force:true});}
});
