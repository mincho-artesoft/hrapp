import sys,json,pathlib,hashlib,datetime
sys.path.insert(0,'/Users/minchomilev/work/arte-soft-sites/tools');import asc_report as asc
root=pathlib.Path(__file__).resolve().parent
read=lambda p:json.loads((root/p).read_text())
review=read('final-copy-review.json');assert review['decision'].startswith('APPROVED')
for row in review['approvedFiles']:assert hashlib.sha256((root/row['file']).read_bytes()).hexdigest()==row['sha256']
snap=read('live-snapshot.json');notes=read('review-notes-proposal.json');whats=read('whatsnew-proposal.json');v=snap['version'];vid=v['id'];live=asc.get('/appStoreVersions/'+vid)['data'];assert live['attributes']['versionString']=='1.7.4' and live['attributes']['appStoreState']=='PREPARE_FOR_SUBMISSION'
build=asc.get('/appStoreVersions/'+vid+'/build')['data'];assert build['id']==snap['build']['data']['id'] and build['attributes']['version']=='16' and build['attributes']['processingState']=='VALID'
original={x['attributes']['locale']:x for x in snap['localizations']['data']}
current={x['attributes']['locale']:x for x in asc.get('/appStoreVersions/'+vid+'/appStoreVersionLocalizations?limit=200')['data']};assert set(original)==set(current)==set(whats['values']) and len(current)==50
review_before=asc.get('/appStoreVersions/'+vid+'/appStoreReviewDetail')['data'];assert review_before['id']==notes['resourceId']
assert review_before['attributes']['notes'] in [notes['before'],notes['after']]
for loc,x in current.items():
 assert x['attributes']['whatsNew'] in [original[loc]['attributes']['whatsNew'],whats['values'][loc]]
 for k,val in original[loc]['attributes'].items():
  if k!='whatsNew':assert x['attributes'].get(k)==val,(loc,k,'Unexpected concurrent change')
log=root/'apply-checkpoint.jsonl'
def patch(path,body):
 r=asc.patch(path,body);assert '__error' not in r,r
 with log.open('a') as f:f.write(json.dumps({'time':datetime.datetime.now(datetime.timezone.utc).isoformat(),'path':path,'fields':list(body['data']['attributes']),'result':'success'})+'\n')
 return r
for loc,x in sorted(current.items()):
 if x['attributes']['whatsNew']!=whats['values'][loc]:patch('/appStoreVersionLocalizations/'+x['id'],{'data':{'type':'appStoreVersionLocalizations','id':x['id'],'attributes':{'whatsNew':whats['values'][loc]}}})
if review_before['attributes']['notes']!=notes['after']:patch('/appStoreReviewDetails/'+notes['resourceId'],{'data':{'type':'appStoreReviewDetails','id':notes['resourceId'],'attributes':{'notes':notes['after']}}})
final=asc.get('/appStoreVersions/'+vid+'/appStoreVersionLocalizations?limit=200')['data'];final_review=asc.get('/appStoreVersions/'+vid+'/appStoreReviewDetail')['data'];assert final_review['attributes']['notes']==notes['after']
for x in final:
 loc=x['attributes']['locale'];assert x['attributes']['whatsNew']==whats['values'][loc]
 for k,val in original[loc]['attributes'].items():
  if k!='whatsNew':assert x['attributes'].get(k)==val,(loc,k)
for k,val in review_before['attributes'].items():
 if k!='notes':assert final_review['attributes'].get(k)==val,k
(root/'applied-readback.json').write_text(json.dumps({'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'app':'6744690319','version':'1.7.4','build':'16','all50WhatsNewVerified':True,'reviewNotesVerified':True,'allOtherLocalizationAndReviewAttributesPreserved':True,'versionLocalizations':final,'reviewDetail':final_review,'submission':'not_performed'},ensure_ascii=False,indent=2)+'\n')
print('50/50 release notes and reviewer notes written and readback verified; other metadata preserved',flush=True)
