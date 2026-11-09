import sys,json,io,hashlib,base64,urllib.request,concurrent.futures,threading,time,ssl
from pathlib import Path
sys.path.append('/Users/minchomilev/.venvs/aws/lib/python3.14/site-packages')
import boto3
from botocore.config import Config
from PIL import Image
HTTPS_CONTEXT=ssl.create_default_context()
R=Path(__file__).resolve().parent;SOURCE=json.loads((R/'selected-asc-metadata.json').read_text());S3=boto3.client('s3',region_name='eu-central-1',config=Config(max_pool_connections=32,connect_timeout=10,read_timeout=600,request_checksum_calculation='when_required',retries={'max_attempts':3,'mode':'standard'}));BASE='media/panel/asc-174-20261022';NAMES=['01-hook','02-week-left','03-week-right','04-widgets','05-live'];KINDS=['hook','week-left','week-right','widgets','live'];SOURCE_NAMES=['day','week','weather','widgets','live'];DEV={'APP_IPHONE_61':'iPhone','APP_IPAD_PRO_3GEN_129':'iPad','APP_IPHONE_DUO':'iPhoneDuo'};WIDTHS={'iPhone':[340,680],'iPad':[480,960],'iPhoneDuo':[480,960]};J=R/'screenshot-import-checkpoint.jsonl';DONE={}
if J.exists():
 for line in J.read_text().splitlines():
  row=json.loads(line);DONE[row['jobId']]=row

def put(bucket,key,data,ctype):
 sha=hashlib.sha256(data).hexdigest();md5=hashlib.md5(data).hexdigest()
 try:
  prior=S3.head_object(Bucket=bucket,Key=key)
  if prior['ContentLength']==len(data) and prior.get('Metadata',{}).get('sha256')==sha and prior['ETag'].strip('"')==md5:
   return {'bucket':bucket,'key':key,'bytes':len(data),'sha256':sha,'md5':md5,'verified':'Existing S3 object exact length, SHA256metadata and single-part MD5 ETag'}
 except S3.exceptions.ClientError as error:
  if error.response['Error']['Code'] not in ['404','NoSuchKey','NotFound']:raise
 started=time.monotonic();print('PUT start',key,len(data),flush=True)
 response=S3.put_object(Bucket=bucket,Key=key,Body=data,ContentType=ctype,CacheControl='public,max-age=31536000,immutable',ContentMD5=base64.b64encode(bytes.fromhex(md5)).decode(),Metadata={'sha256':sha})
 print('PUT done',key,round(time.monotonic()-started,1),flush=True)
 assert response['ETag'].strip('"')==md5
 return {'bucket':bucket,'key':key,'bytes':len(data),'sha256':sha,'md5':md5,'verified':'Server accepted Content-MD5 and returned matching single-part ETag'}

def job(args):
 locale,device,i,a=args;ident=f'{locale}/{device}/{i}'
 if ident in DONE:
  assert DONE[ident]['assetId']==a['id']
  return DONE[ident]
 x=a['attributes'];assert x['assetDeliveryState']['state']=='COMPLETE' and not x['assetDeliveryState'].get('errors');assert SOURCE_NAMES[i] in x['fileName'],(ident,x['fileName'])
 if device=='iPhoneDuo':
  key=f'1.7.4/duo-2026-10-21/frames/{locale}/{i+1:02}-{SOURCE_NAMES[i]}.png';data=S3.get_object(Bucket='cloud-calendars-appstore-media',Key=key)['Body'].read();assert hashlib.md5(data).hexdigest()==x['sourceFileChecksum'],ident;source={'bucket':'cloud-calendars-appstore-media','key':key,'matchesUploadedChecksum':True}
 else:
  im=x['imageAsset'];url=im['templateUrl'].replace('{w}',str(im['width'])).replace('{h}',str(im['height'])).replace('{f}','png');started=time.monotonic();print('GET start',ident,flush=True);data=urllib.request.urlopen(url,timeout=30,context=HTTPS_CONTEXT).read();print('GET done',ident,len(data),round(time.monotonic()-started,1),flush=True);source=put('cloud-calendars-appstore-media',f'1.7.4/website-import-2026-10-22/{locale}/{device}/{i+1:02}-{SOURCE_NAMES[i]}.png',data,'image/png');source['downloadUrl']=url;source['provenance']='Apple CDN rendered at reported full dimensions; not assumed identical original bytes.'
 image=Image.open(io.BytesIO(data));assert image.size==(x['imageAsset']['width'],x['imageAsset']['height']);image=image.convert('RGB');objects=[]
 for w in WIDTHS[device]:
  im=image.resize((w,round(image.height*w/image.width)),Image.Resampling.LANCZOS)
  for ext in ['webp','avif']:
   out=io.BytesIO();im.save(out,format=ext.upper(),quality=80 if ext=='webp' else 58,**({'speed':8,'max_threads':1} if ext=='avif' else {'method':4}));objects.append(put('cloud-calendars-media',f'{BASE}/{locale}/{device}/{NAMES[i]}-{w}.{ext}',out.getvalue(),'image/'+ext))
 return {'jobId':ident,'locale':locale,'device':device,'index':i,'assetId':a['id'],'name':NAMES[i],'kind':KINDS[i],'width':image.width,'height':image.height,'source':source,'objects':objects}
JOBS=[]
for locale,d in SOURCE.items():
 for s in d['appScreenshotSets']:
  if s['displayType'] in DEV:
   assert len(s['assets'])>=5
   JOBS.extend((locale,DEV[s['displayType']],i,a) for i,a in enumerate(s['assets'][:5]))
JOBS.sort(key=lambda x:(x[0]!='en-US',x[0],x[1],x[2]))
def retry_job(args):
 for attempt in range(4):
  try:return job(args)
  except Exception as error:
   if attempt==3:raise
   print('Retry',args[0],args[1],args[2],type(error).__name__,flush=True)
   time.sleep(2*(attempt+1))
rows=[];errors=[]
with concurrent.futures.ThreadPoolExecutor(max_workers=2) as pool:
 futures={pool.submit(retry_job,args):args for args in JOBS}
 for future in concurrent.futures.as_completed(futures):
  try:row=future.result()
  except Exception as error:
   args=futures[future];errors.append({'locale':args[0],'device':args[1],'index':args[2],'error':str(error)})
   print('FAILED',args[0],args[1],args[2],type(error).__name__,flush=True);continue
  rows.append(row)
  if row['jobId'] not in DONE:
   with J.open('a') as f:f.write(json.dumps(row)+'\n')
  if len(rows)%15==0:print(f'Imported+verified {len(rows)}/{len(JOBS)} screenshots',flush=True)
if errors:
 (R/'screenshot-import-errors.json').write_text(json.dumps(errors,indent=2)+'\n')
 raise RuntimeError(f'{len(errors)} incomplete jobs; successful jobs checkpointed')
rows.sort(key=lambda x:(x['locale'],x['device'],x['index']))
manifest={'base':'/'+BASE,'widths':WIDTHS,'locales':{}}
for row in rows:
 sets=manifest['locales'].setdefault(row['locale'],{});sets.setdefault(row['device'],{'screenshots':[]})['screenshots'].append({k:row[k] for k in ['name','kind','width','height']})
(R/'screenshots-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n');(R/'screenshot-import-summary.json').write_text(json.dumps({'screenshots':len(rows),'publicRenditions':sum(len(r['objects']) for r in rows),'locales':len(manifest['locales']),'verified':'S3 ContentLength+singlepartMD5 and SHA256metadata; public delivery validation follows'},indent=2)+'\n');print('SCREENSHOTS COMPLETE',flush=True)
