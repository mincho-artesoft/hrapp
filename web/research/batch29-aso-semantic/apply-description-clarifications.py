"""Seven guarded description-only draft edits; no submission, names, URLs or prices."""
from pathlib import Path
import sys,json,datetime,hashlib
sys.path.insert(0,'/Users/minchomilev/work/arte-soft-sites/tools')
import asc_report as asc
root=Path('/Users/minchomilev/cloud-calendars');out=root/'research/batch29-aso-semantic';audit=json.loads((out/'audit.json').read_text());facts=json.loads((out/'appclip-facts.json').read_text());apply='--apply' in sys.argv
snap=json.loads((root/'research/aso/asc-readonly-snapshot-20261021.json').read_text());v=next(v for v in snap['versions'] if v['attributes']['versionString']=='1.7.4');info=next(x for x in snap['appInfos'] if x['attributes']['appStoreState']=='PREPARE_FOR_SUBMISSION')
version_id=v['id'];info_id=info['id']
def guard():
 va=asc.get('/appStoreVersions/'+version_id)['data']['attributes'];ia=asc.get('/appInfos/'+info_id)['data']['attributes'];assert va['versionString']=='1.7.4' and va['appStoreState']=='PREPARE_FOR_SUBMISSION';assert ia['appStoreState']=='PREPARE_FOR_SUBMISSION';return va

def locales():return {r['attributes']['locale']:r for r in asc.get('/appStoreVersions/'+version_id+'/appStoreVersionLocalizations?limit=200')['data']}
def infos():return {r['attributes']['locale']:r for r in asc.get('/appInfos/'+info_id+'/appInfoLocalizations?limit=200')['data']}
plans=[]
for r in audit['assessments']:
 p=r['proposals'][0];assert p['before'].count(p['beforeExcerpt'])==1 and p['before'].replace(p['beforeExcerpt'],p['afterExcerpt'])==p['after'];plans.append({'locale':r['locale'],'before':p['before'],'after':p['after'],'beforeExcerpt':p['beforeExcerpt'],'afterExcerpt':p['afterExcerpt']})
en=json.loads((root/'research/aso/english-proposal-20261021.json').read_text())['fields']['description']['value'];old=facts['descriptionEvidence']['exactBefore'];new=facts['alternativeNarrower'];assert en.count(old)==1;plans.append({'locale':'en-US','before':en,'after':en.replace(old,new),'beforeExcerpt':old,'afterExcerpt':new})
assert len(plans)==7 and len({p['locale'] for p in plans})==7 and all(len(p['after'])<=4000 for p in plans)
va=guard();before=locales();before_info=infos();assert len(before)==50
for p in plans:assert before[p['locale']]['attributes']['description'] in [p['before'],p['after']],('Concurrent description mismatch',p['locale'])
report={'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'app':'6744690319','version':'1.7.4','state':va['appStoreState'],'apply':apply,'plans':plans,'beforeVersionAttributes':va,'beforeLocalizations':before,'beforeAppInfoLocalizations':before_info,'writes':[],'noSubmission':True}
path=out/('applied.json' if apply else 'plan.json');path.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
if apply:
 for p in plans:
  guard();item=before[p['locale']];uri='/appStoreVersionLocalizations/'+item['id'];current=asc.get(uri)['data'];assert current['attributes']==item['attributes'],('Concurrent attribute mismatch',p['locale'])
  if current['attributes']['description']!=p['after']:
   result=asc.patch(uri,{'data':{'type':'appStoreVersionLocalizations','id':item['id'],'attributes':{'description':p['after']}}});assert '__error' not in result,(p['locale'],result);report['writes'].append(p['locale']);path.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
 after=locales();after_info=infos();assert set(after)==set(before);assert after_info==before_info;target={p['locale']:p['after'] for p in plans}
 for loc,row in before.items():
  expected=dict(row['attributes'])
  if loc in target:expected['description']=target[loc]
  assert after[loc]['attributes']==expected,('Unexpected changed attribute',loc)
 assert guard()==va
 report.update({'completedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'allVerified':True,'afterLocalizations':after,'afterAppInfoLocalizations':after_info,'preserved':{'all50LocaleSets':True,'allNamesAndSubtitles':True,'allKeywordsPromotionalTextAndUrls':True,'all43UntargetedLocaleAttributes':True,'versionAttributesAndDraftState':True},'scope':'Seven description-only clarifications, exact current API readback; no submission/build/price/privacy changes, release-runtime or ranking claim.'});path.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'apply':apply,'targetLocales':[p['locale'] for p in plans],'writes':report['writes'],'allVerified':report.get('allVerified',False),'version':'1.7.4','state':va['appStoreState']}))
