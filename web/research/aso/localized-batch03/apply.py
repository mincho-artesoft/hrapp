"""Targeted copy-only writes to Cloud Calendars draft1.7.4. Default dry-run; no submission."""
import json,pathlib,sys,datetime
sys.path.insert(0,'/Users/minchomilev/work/arte-soft-sites/tools')
import asc_report as asc
root=pathlib.Path(__file__).parent
app='6744690319';target='1.7.4';apply='--apply' in sys.argv
v=next(x for x in asc.get('/apps/'+app+'/appStoreVersions?limit=200')['data'] if x['attributes']['versionString']==target and x['attributes']['platform']=='IOS')
i=next(x for x in asc.get('/apps/'+app+'/appInfos?limit=200')['data'] if x['attributes'].get('appStoreState')=='PREPARE_FOR_SUBMISSION')
assert v['attributes']['appStoreState']=='PREPARE_FOR_SUBMISSION'
vl={x['attributes']['locale']:x for x in asc.get('/appStoreVersions/'+v['id']+'/appStoreVersionLocalizations?limit=200')['data']}
il={x['attributes']['locale']:x for x in asc.get('/appInfos/'+i['id']+'/appInfoLocalizations?limit=200')['data']}
report={'date':datetime.datetime.now(datetime.timezone.utc).isoformat(),'app':app,'version':target,'apply':apply,'locales':[],'submission':'not_performed'}
# Save after each finished locale, including partial success; reruns compare state and skip matching fields.
path=root/('applied.json' if apply else 'plan.json')
for loc in ['nl-NL', 'pt-BR', 'pt-PT', 'pl', 'sv', 'tr', 'zh-Hans', 'zh-Hant']:
 p=json.loads((root/(loc+'-proposal.json')).read_text());assert p['appId']==app
 assert p['nameAction']=='preserve_exact_current_draft_name',p['nameAction']
 assert vl[loc]['id']==p['versionLocalizationId'] and il[loc]['id']==p['appInfoLocalizationId']
 row={'locale':loc,'fields':[]}
 for typ,obj,fields in [('appStoreVersionLocalizations',vl[loc],['description','keywords','promotionalText']),('appInfoLocalizations',il[loc],['subtitle'])]:
  endpoint='/'+typ+'/'+obj['id'];before=asc.get(endpoint)['data'];assert before['attributes']['locale']==loc
  attrs={k:p['fields'][k]['value']for k in fields}
  for k,value in attrs.items():assert len(value)<=p['fields'][k]['characterLimit']
  delta={k:value for k,value in attrs.items() if before['attributes'].get(k)!=value}
  if delta and apply:
   assert asc.get('/appStoreVersions/'+v['id'])['data']['attributes']['appStoreState']=='PREPARE_FOR_SUBMISSION'
   r=asc.patch(endpoint,{'data':{'type':typ,'id':obj['id'],'attributes':delta}})
   if '__error'in r:raise RuntimeError(str(r))
  after=asc.get(endpoint)['data']
  for k,value in attrs.items():row['fields'].append({'field':k,'before':before['attributes'].get(k),'after':after['attributes'].get(k),'target':value,'verified':after['attributes'].get(k)==value})
  if apply:
   assert all(after['attributes'].get(k)==value for k,value in attrs.items())
   assert all(after['attributes'].get(k)==value for k,value in before['attributes'].items() if k not in attrs)
 row['verified']=all(f['verified']for f in row['fields']);report['locales'].append(row);path.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
 print(json.dumps({'locale':loc,'apply':apply,'verified':row['verified']}),flush=True)
assert asc.get('/appStoreVersions/'+v['id'])['data']['attributes']['appStoreState']=='PREPARE_FOR_SUBMISSION'
