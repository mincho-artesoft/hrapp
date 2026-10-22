import sys,json,pathlib,datetime
sys.path.insert(0,'/Users/minchomilev/work/arte-soft-sites/tools')
import asc_report as asc
root=pathlib.Path('/Users/minchomilev/cloud-calendars/research/aso');app='6744690319'
v=next(v for v in asc.get('/apps/'+app+'/appStoreVersions?limit=200')['data'] if v['attributes']['versionString']=='1.7.4' and v['attributes']['platform']=='IOS');assert v['attributes']['appStoreState']=='PREPARE_FOR_SUBMISSION'
i=next(v for v in asc.get('/apps/'+app+'/appInfos?limit=200')['data'] if v['attributes']['appStoreState']=='PREPARE_FOR_SUBMISSION')
vl={v['attributes']['locale']:v for v in asc.get('/appStoreVersions/'+v['id']+'/appStoreVersionLocalizations?limit=200')['data']};il={v['attributes']['locale']:v for v in asc.get('/appInfos/'+i['id']+'/appInfoLocalizations?limit=200')['data']}
proposals={'en-US':json.loads((root/'english-proposal-20261021.json').read_text())}
for batch in ['02','03','04','05','06']:
 for p in (root/('localized-batch'+batch)).glob('*-proposal.json'):
  d=json.loads(p.read_text());assert d['locale'] not in proposals;proposals[d['locale']]=d
# Preserve historical proposals; apply only the separately reviewed description overlay.
overlay_path=root/'description-overrides-batch30.json'
overlay=json.loads(overlay_path.read_text());assert overlay['app']==app and overlay['version']=='1.7.4' and overlay['field']=='description'
expected_descriptions={}
for row in overlay['overrides']:
 assert row['locale'] not in expected_descriptions
 assert proposals[row['locale']]['fields']['description']['value']==row['before']
 expected_descriptions[row['locale']]=row['after']
assert len(expected_descriptions)==8
assert set(vl)==set(proposals) and len(vl)==50
rows=[]
for loc,p in sorted(proposals.items()):
 checks={}
 for field in ['description','keywords','promotionalText','subtitle','name']:
  source=il if field in ['subtitle','name'] else vl
  expected=expected_descriptions.get(loc,p['fields'][field]['value']) if field=='description' else p['fields'][field]['value']
  checks[field]=source[loc]['attributes'].get(field)==expected
 rows.append({'locale':loc,'verified':all(checks.values()),'checks':checks})
assert all(r['verified'] for r in rows),[r for r in rows if not r['verified']]
out={'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'app':app,'version':'1.7.4','state':v['attributes']['appStoreState'],'locales':rows,'totalLocales':50,'allVerified':True,'writesInThisCheck':False,'scope':'Fresh full APIreadback of four targeted text fields and exact preserved app names across all50draftlocales. Does not certify translation quality, rankings or released copy.','descriptionOverlay':'description-overrides-batch30.json','submission':'not_performed'}
(root/'all-locales-readback-20261021.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n')
r=json.loads((root/'remaining-locales.json').read_text());r['appliedAndReadbackVerified']=sorted(proposals);r['remaining']=[];r['finalReadback']='all-locales-readback-20261021.json';r['translationCaveat']='No independent native-speaker review; batch06 Indic/Urdu lower confidence noted in audit.';(root/'remaining-locales.json').write_text(json.dumps(r,ensure_ascii=False,indent=2)+'\n')
print('50/50locales,200targetfields+50preservednames exactAPIreadback;draftonly')
