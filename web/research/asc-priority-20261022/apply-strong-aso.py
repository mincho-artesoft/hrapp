import sys,json,pathlib,hashlib,datetime
sys.path.insert(0,'/Users/minchomilev/work/arte-soft-sites/tools');import asc_report as asc
r=pathlib.Path(__file__).resolve().parent
read=lambda n:json.loads((r/n).read_text());sha=lambda n:hashlib.sha256((r/n).read_bytes()).hexdigest()
approved={'descriptions-a.json':'ffaf22c7ae1fc12090375fadcb7b66adca508bdfb94b3b94ca6c3ac5e30c1195','descriptions-b.json':'3c27f77933b8fdd6a4c31beeea954b244184f3018313f5ddb7e85911f3776fb4','descriptions-c.json':'6300ae290a8d706dae01204921865e7ce6b60dba02195d4872bf299acef0c58a','keyword-proposal.json':'88753e6ecc53b7185dd93ea5ff591167d92a74dd16f7d3e89e92f31af45100ad','whatsnew-bugfix-proposal.json':'f244c99cafcb42a8724bd75f57851674cf5a7c6ae18e2a7de5845b46672d933f'}
for name,h in approved.items():assert sha(name)==h,(name,'Editorial-approved file changed')
for group in 'abc':
 d=read('descriptions-'+group+'-review.json');v=str(d.get('decision',d.get('verdict',''))).lower();assert 'pass' in v or 'approv' in v,(group,v)
base=read('applied-readback.json');old={x['attributes']['locale']:x for x in base['versionLocalizations']};infos=read('app-info-localizations.json')['data'];desired={};descs={}
for group in 'abc':
 for loc,text in read('descriptions-'+group+'.json')['values'].items():assert loc not in descs;descs[loc]=text
kw=read('keyword-proposal.json')['values'];news=read('whatsnew-bugfix-proposal.json')['values'];assert set(old)==set(descs)==set(kw)==set(news) and len(old)==50
for loc in old:
 assert 3800<=len(descs[loc])<=4000,(loc,len(descs[loc]))
 assert 97<=len(kw[loc])<=100,(loc,len(kw[loc]))
 assert len(news[loc])<=4000
 assert 'https://www.cloud-calendars.com/privacy-policy' in descs[loc] and 'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/' in descs[loc]
 desired[loc]={'description':descs[loc],'keywords':kw[loc],'whatsNew':news[loc]}
assert descs['en-US']==(r/'description-en-draft.txt').read_text().rstrip()
versions=asc.get('/apps/6744690319/appStoreVersions?limit=200')['data'];v=next(x for x in versions if x['attributes']['versionString']=='1.7.4' and x['attributes']['platform']=='IOS');vid=v['id'];assert v['attributes']['appStoreState']=='PREPARE_FOR_SUBMISSION'
build=asc.get('/appStoreVersions/'+vid+'/build')['data'];assert build['attributes']['version']=='16' and build['attributes']['processingState']=='VALID'
current={x['attributes']['locale']:x for x in asc.get('/appStoreVersions/'+vid+'/appStoreVersionLocalizations?limit=200')['data']};assert set(current)==set(desired)
notes=asc.get('/appStoreVersions/'+vid+'/appStoreReviewDetail')['data'];assert notes['attributes']['notes']==read('review-notes-proposal.json')['after']
for loc,x in current.items():
 assert x['id']==old[loc]['id']
 for k,val in old[loc]['attributes'].items():
  if k in desired[loc]:assert x['attributes'].get(k) in [val,desired[loc][k]],(loc,k,'Unexpected concurrent target change')
  else:assert x['attributes'].get(k)==val,(loc,k,'Unexpected concurrent metadata change')
info_id=next(x['relationships']['appInfo']['data']['id'] for x in infos if x['attributes']['locale']=='en-US') if 'relationships' in infos[0] and 'appInfo' in infos[0]['relationships'] else None
if info_id is None:info_id=next(x for x in read('live-snapshot.json')['infos']['data'] if x['attributes']['appStoreState']=='PREPARE_FOR_SUBMISSION')['id']
info_before=asc.get('/appInfos/'+info_id+'/appInfoLocalizations?limit=200')['data'];assert {x['id']:x['attributes'] for x in info_before}=={x['id']:x['attributes'] for x in infos}
manifest={'app':'6744690319','version':'1.7.4','build':'16','preparedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'editoriallyApprovedHashes':approved,'fields':desired,'preserved':'Names, subtitles, promotional text, marketing/support/privacy URLs, prices, build, release settings and review notes.','scope':'Task/article aligned copy; no measured App Store popularity/ranking/citation guarantee.'};(r/'strong-aso-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
for loc,x in sorted(current.items()):
 change={k:val for k,val in desired[loc].items() if x['attributes'].get(k)!=val}
 if not change:continue
 result=asc.patch('/appStoreVersionLocalizations/'+x['id'],{'data':{'type':'appStoreVersionLocalizations','id':x['id'],'attributes':change}});assert '__error' not in result,(loc,result)
 with (r/'strong-aso-checkpoint.jsonl').open('a') as f:f.write(json.dumps({'at':datetime.datetime.now(datetime.timezone.utc).isoformat(),'locale':loc,'resourceId':x['id'],'fields':list(change),'success':True})+'\n')
final=asc.get('/appStoreVersions/'+vid+'/appStoreVersionLocalizations?limit=200')['data'];final_infos=asc.get('/appInfos/'+info_id+'/appInfoLocalizations?limit=200')['data'];assert {x['id']:x['attributes'] for x in final_infos}=={x['id']:x['attributes'] for x in info_before}
for x in final:
 loc=x['attributes']['locale']
 for k,val in old[loc]['attributes'].items():assert x['attributes'].get(k)==desired[loc].get(k,val),(loc,k)
final_notes=asc.get('/appStoreVersions/'+vid+'/appStoreReviewDetail')['data'];assert final_notes['attributes']==notes['attributes']
final_version=asc.get('/appStoreVersions/'+vid)['data'];assert final_version['attributes']==v['attributes'],'Version attributes changed concurrently; inspect'
final_build=asc.get('/appStoreVersions/'+vid+'/build')['data'];assert final_build['id']==build['id'] and final_build['attributes']['processingState']=='VALID'
report={'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'app':'6744690319','version':'1.7.4','build':'16','state':final_version['attributes']['appStoreState'],'locales':50,'targetFieldsVerified':150,'allPassed':True,'descriptionRange':[min(map(len,descs.values())),max(map(len,descs.values()))],'keywordRange':[min(map(len,kw.values())),max(map(len,kw.values()))],'protectedOtherMetadataPreserved':True,'reviewNotesPreserved':True,'versionLocalizations':final,'appInfoLocalizations':final_infos,'reviewNotes':final_notes['attributes']['notes'],'submission':'not_performed_pending_accurate_privacy'};(r/'strong-aso-readback.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print('50 descriptions + 50 keywords + 50 bug-fix release notes written and readback verified; protected metadata unchanged',flush=True)
