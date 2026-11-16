import sys,json,hashlib,datetime
from pathlib import Path
sys.path.insert(0,'/Users/minchomilev/work/arte-soft-sites/tools');import asc_report as asc
p=Path('/Users/minchomilev/cloud-calendars/research/batch39-asc-urls');proposal=json.loads((p/'proposal.json').read_text());review=json.loads((p/'independent-review.json').read_text());digest=hashlib.sha256((p/'proposal.json').read_bytes()).hexdigest();assert digest in json.dumps(review)and 'PASS'in json.dumps(review)
v=next(x for x in asc.get('/apps/6744690319/appStoreVersions?limit=200')['data']if x['attributes']['versionString']=='1.7.4'and x['attributes']['platform']=='IOS');assert v['attributes']['appStoreState']=='PREPARE_FOR_SUBMISSION';path='/appStoreVersions/'+v['id']+'/appStoreVersionLocalizations?limit=200';before={r['attributes']['locale']:r for r in asc.get(path)['data']};assert len(before)==50
rows=[]
for r in proposal['rows']:
 current=before[r['locale']];assert current['id']==r['id'];assert current['attributes'].get('marketingUrl')in[r['before'],r['after']],r['locale']
 if current['attributes'].get('marketingUrl')!=r['after']:
  ack=asc.patch('/appStoreVersionLocalizations/'+r['id'],{'data':{'type':'appStoreVersionLocalizations','id':r['id'],'attributes':{'marketingUrl':r['after']}}});assert '__error'not in ack,ack;assert ack['data']['attributes']['marketingUrl']==r['after'];rows.append({'locale':r['locale'],'id':r['id'],'field':'marketingUrl','before':current['attributes'].get('marketingUrl'),'after':r['after'],'acknowledged':True});(p/'apply-checkpoint.json').write_text(json.dumps(rows,ensure_ascii=False,indent=2)+'\n')
after={r['attributes']['locale']:r for r in asc.get(path)['data']};verified=[]
for r in proposal['rows']:
 a=after[r['locale']]['attributes'];b=before[r['locale']]['attributes'];assert a['marketingUrl']==r['after']
 for k,value in b.items():
  if k!='marketingUrl':assert a.get(k)==value,(r['locale'],k,'unrelatedfieldchanged')
 verified.append({'locale':r['locale'],'marketingUrl':a['marketingUrl'],'targetMatches':True,'allOtherAttributesPreserved':True,'otherAttributesSha256':hashlib.sha256(json.dumps({k:v for k,v in a.items()if k!='marketingUrl'},sort_keys=True).encode()).hexdigest()})
assert asc.get('/appStoreVersions/'+v['id'])['data']['attributes']['appStoreState']=='PREPARE_FOR_SUBMISSION';out={'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'app':'6744690319','version':'1.7.4','state':'PREPARE_FOR_SUBMISSION','fieldOnly':'marketingUrl','writes':len(rows),'localesVerified':50,'allPassed':True,'rows':rows,'readback':verified,'unchanged':'All other localization attributes including text, supportUrl and whatsNew preserved; no appInfo/privacy/build/pricing/release/submission API called.','scope':'Draft URL language alignment and persistence; not live listing or ranking/citation proof.'};(p/'applied-readback.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n');print('MarketingURL writes',len(rows),'all50 fresh readback verified; allotherlocaleattributes preserved')
