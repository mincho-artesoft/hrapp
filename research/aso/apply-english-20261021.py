"""Apply only verified en-US copy to Cloud Calendars draft 1.7.4; never submits."""
import sys,json,pathlib,datetime
sys.path.insert(0,'/Users/minchomilev/work/arte-soft-sites/tools')
import asc_report as asc
root=pathlib.Path(__file__).parent
proposal=json.loads((root/'english-proposal-20261021.json').read_text())
snapshot=json.loads((root/'asc-readonly-snapshot-20261021.json').read_text())
v=next(x for x in snapshot['versions'] if x['attributes']['versionString']=='1.7.4')
i=next(x for x in snapshot['appInfos'] if x['attributes']['appStoreState']=='PREPARE_FOR_SUBMISSION')
vl=next(x for x in v['localizations'] if x['attributes']['locale']=='en-US')
il=next(x for x in i['localizations'] if x['attributes']['locale']=='en-US')
assert asc.get('/appStoreVersions/'+v['id'])['data']['attributes']['appStoreState']=='PREPARE_FOR_SUBMISSION'
assert asc.get('/appInfos/'+i['id'])['data']['attributes']['appStoreState']=='PREPARE_FOR_SUBMISSION'
changes=[(vl,['description','keywords','promotionalText']),(il,['subtitle'])]
report={'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'app':'6744690319','version':'1.7.4','locale':'en-US','apply':'--apply' in sys.argv,'fields':[]}
for item,names in changes:
 path='/'+item['type']+'/'+item['id'];before=asc.get(path)['data'];attrs={k:proposal['fields'][k]['value'] for k in names};delta={k:z for k,z in attrs.items() if before['attributes'].get(k)!=z}
 for k,z in delta.items():assert proposal['fields'][k]['valid']
 if delta and '--apply' in sys.argv:
  result=asc.patch(path,{'data':{'type':item['type'],'id':item['id'],'attributes':delta}})
  if '__error' in result:raise RuntimeError(str(result))
 after=asc.get(path)['data']
 for k,z in attrs.items():
  report['fields'].append({'field':k,'before':before['attributes'].get(k),'after':after['attributes'].get(k),'target':z,'verified':after['attributes'].get(k)==z})
 if '--apply' in sys.argv:
  assert all(after['attributes'].get(k)==z for k,z in attrs.items())
  for k,z in before['attributes'].items():
   if k not in attrs:assert after['attributes'].get(k)==z,(k,'unrelated attribute changed')
assert asc.get('/appStoreVersions/'+v['id'])['data']['attributes']['appStoreState']=='PREPARE_FOR_SUBMISSION'
(root/('english-applied-20261021.json' if '--apply' in sys.argv else 'english-plan-20261021.json')).write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'apply':report['apply'],'fields':[{'name':x['field'],'verified':x['verified']}for x in report['fields']]}))
