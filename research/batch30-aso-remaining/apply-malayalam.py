"""Guard one Malayalam description correction in draft1.7.4; never submits."""
from pathlib import Path
import json,sys,datetime,hashlib
sys.path.insert(0,'/Users/minchomilev/work/arte-soft-sites/tools')
import asc_report as asc
root=Path('/Users/minchomilev/cloud-calendars');folder=root/'research/batch30-aso-remaining';apply='--apply' in sys.argv
row=next(r for r in json.loads((folder/'part-a.json').read_text())['locales'] if r['locale']=='ml-IN');p=row['proposals'][0];review=json.loads((folder/'ml-cross-review.json').read_text());assert review['decision']=='pass_narrow_semantic_correction' and not review['requiredChanges'];assert review['beforeExcerpt']==p['beforeExcerpt'] and review['afterExcerpt']==p['afterExcerpt'];assert hashlib.sha256(p['after'].encode()).hexdigest()==review['identityChecks']['afterFullUtf8Sha256']
assert p['before'].count(p['beforeExcerpt'])==1 and p['before'].replace(p['beforeExcerpt'],p['afterExcerpt'])==p['after'];assert len(p['after'])<4000
baseline=json.loads((root/'research/batch29-aso-semantic/applied.json').read_text());snapshot=json.loads((root/'research/aso/asc-readonly-snapshot-20261021.json').read_text());v=next(v for v in snapshot['versions'] if v['attributes']['versionString']=='1.7.4');info=next(x for x in snapshot['appInfos'] if x['attributes']['appStoreState']=='PREPARE_FOR_SUBMISSION')
def guard():
 a=asc.get('/appStoreVersions/'+v['id'])['data']['attributes'];b=asc.get('/appInfos/'+info['id'])['data']['attributes'];assert a['versionString']=='1.7.4' and a['appStoreState']=='PREPARE_FOR_SUBMISSION' and b['appStoreState']=='PREPARE_FOR_SUBMISSION';return a

def current():return {x['attributes']['locale']:x for x in asc.get('/appStoreVersions/'+v['id']+'/appStoreVersionLocalizations?limit=200')['data']}
def appinfos():return {x['attributes']['locale']:x for x in asc.get('/appInfos/'+info['id']+'/appInfoLocalizations?limit=200')['data']}
va=guard();before=current();bi=appinfos();assert len(before)==50
for loc,r in before.items():
 expected=dict(baseline['afterLocalizations'][loc]['attributes'])
 if loc=='ml-IN' and r['attributes']['description']==p['after']:expected['description']=p['after']
 assert r['attributes']==expected,('Concurrent localization change',loc)
assert bi==baseline['afterAppInfoLocalizations'];item=before['ml-IN'];assert item['id']==row['versionLocalizationId'];uri='/appStoreVersionLocalizations/'+item['id'];assert item['attributes']['description'] in [p['before'],p['after']]
report={'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'apply':apply,'app':'6744690319','version':'1.7.4','locale':'ml-IN','state':va['appStoreState'],'proposal':p,'beforeLocalizations':before,'beforeAppInfoLocalizations':bi,'writes':[],'submission':'not_performed'};path=folder/('applied.json' if apply else 'plan.json');path.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
if apply:
 guard();assert asc.get(uri)['data']['attributes']==item['attributes']
 if item['attributes']['description']!=p['after']:
  result=asc.patch(uri,{'data':{'type':'appStoreVersionLocalizations','id':item['id'],'attributes':{'description':p['after']}}});assert '__error' not in result,result;report['writes']=['ml-IN'];path.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
 after=current();ai=appinfos();assert set(after)==set(before);assert ai==bi
 for loc,r in before.items():
  expected=dict(r['attributes'])
  if loc=='ml-IN':expected['description']=p['after']
  assert after[loc]['attributes']==expected,('Unexpected changed attribute',loc)
 assert guard()==va
 report.update({'completedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'allVerified':True,'afterLocalizations':after,'afterAppInfoLocalizations':ai,'scope':'One exact description excerpt changed; all50locale attrs and all app-info localizations compared before/after. No price/build/privacy/submission operation, rankings or native-language certification.'});path.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'apply':apply,'writes':report['writes'],'allVerified':report.get('allVerified',False),'version':'1.7.4','state':va['appStoreState']}))
