import sys,json,pathlib,hashlib,datetime,concurrent.futures,collections
sys.path.insert(0,'/Users/minchomilev/work/arte-soft-sites/tools');import asc_report as asc
p=pathlib.Path(__file__).resolve().parent;source=p/'strong-aso-readback.json';j=json.loads(source.read_text());sample=json.loads((p/'media-sample-readback.json').read_text());out={}
def fetch(path):
 pages=[];data=[]
 while path:
  res=asc.get(path);pages.append(res);data.extend(res.get('data',[]));path=res.get('links',{}).get('next')
 return {'data':data,'pages':len(pages),'responseSha256':hashlib.sha256(json.dumps(pages,sort_keys=True).encode()).hexdigest()}
def run(x):
 l=x['attributes']['locale'];rels={}
 for rel,child in [('appScreenshotSets','appScreenshots'),('appPreviewSets','appPreviews')]:
  if l in sample:
   sets=sample[l][rel]['data']
  else:sets=fetch('/appStoreVersionLocalizations/'+x['id']+'/'+rel+'?limit=200')['data']
  records=[]
  for s in sets:
   data=s.get('auditedAssets') or fetch('/'+rel+'/'+s['id']+'/'+child+'?limit=200')
   items=[]
   for a in data['data']:
    attrs=a['attributes'];items.append({'id':a['id'],'fileName':attrs.get('fileName'),'fileSize':attrs.get('fileSize'),'assetDeliveryState':attrs.get('assetDeliveryState'),'sourceFileChecksum':attrs.get('sourceFileChecksum')})
   records.append({'id':s['id'],'displayType':s['attributes'].get('screenshotDisplayType',s['attributes'].get('previewType')),'count':len(items),'assets':items,'states':dict(collections.Counter((a['assetDeliveryState'] or {}).get('state','UNAVAILABLE') for a in items))})
  rels[rel]=records
 return l,{'localizationId':x['id'],'screenshotCount':sum(s['count'] for s in rels['appScreenshotSets']),'previewCount':sum(s['count'] for s in rels['appPreviewSets']),'sets':rels}
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
 for l,result in pool.map(run,j['versionLocalizations']):
  out[l]=result
  if len(out)%10==0:print('Audited',len(out),'locales',flush=True)
  (p/'media-counts-checkpoint.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
issues=[];totals=collections.Counter();empty=[]
for l,r in out.items():
 for kind,sets in r['sets'].items():
  for s in sets:
   if not s['count']:empty.append({'locale':l,'kind':kind,'displayType':s['displayType']})
   for a in s['assets']:
    d=a['assetDeliveryState'] or {};state=d.get('state','UNAVAILABLE');totals[state]+=1
    if state!='COMPLETE' or d.get('errors'):issues.append({'locale':l,'kind':kind,'displayType':s['displayType'],'assetId':a['id'],'delivery':d})
report={'app':'6744690319','version':'1.7.4','build':'16','checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'sourceReadbackSha256':hashlib.sha256(source.read_bytes()).hexdigest(),'scope':'Read-only authenticated GETs of screenshot/preview set relationships and all existing asset children for exactly50 version-localization IDs from strong-aso-readback. Sample3 reused from same audit. Pagination followed where returned. No image/video content downloaded or visually reviewed.','localeCount':len(out),'locales':dict(sorted(out.items())),'deliveryStateTotals':dict(totals),'nonCompleteOrErrorAssets':issues,'emptySets':empty,'concreteBlockers':issues,'interpretation':['COMPLETE establishes API delivery processing state, not visual/text accuracy, freshness, reviewer acceptance or correspondence to uploaded build.','Empty API sets do not establish a missing asset requirement: Asset Library/inherited Using Existing Assets UI can supply media; no deletion/upload recommendation follows from a zero.','Root previously observed an English preview in the UI; this audit independently confirms API records and delivery, not video language by playback.','Display-type coverage is recorded exactly; this audit does not infer which device families Apple currently requires or whether scaling/inheritance applies.','No App Store submission attempted; this is not final overall review readiness or privacy approval.'],'operations':'GET only; no metadata, upload, deletion, campaign, build, account or customer-data writes.'}
(p/'media-readiness.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps({'locales':len(out),'states':dict(totals),'issues':len(issues),'screenshotCounts':dict(collections.Counter(r['screenshotCount'] for r in out.values())),'previewCounts':dict(collections.Counter(r['previewCount'] for r in out.values()))}),flush=True)
