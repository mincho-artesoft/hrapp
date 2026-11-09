import sys,json,urllib.request,re,subprocess,hashlib,base64,tempfile,concurrent.futures
from pathlib import Path
sys.path.append('/Users/minchomilev/.venvs/aws/lib/python3.14/site-packages');import boto3
R=Path(__file__).resolve().parent;DATA=json.loads((R/'selected-asc-metadata.json').read_text());S3=boto3.client('s3',region_name='eu-central-1');BASE='media/panel/asc-174-20261022';DEV={'IPHONE_61':'iPhone','IPAD_PRO_3GEN_129':'iPad','IPHONE_DUO':'iPhoneDuo'};J=R/'video-import-checkpoint.jsonl';DONE={}
if J.exists():
 for line in J.read_text().splitlines():
  x=json.loads(line);DONE[x['jobId']]=x

def put(key,data,typ):
 sha=hashlib.sha256(data).hexdigest();md5=hashlib.md5(data).hexdigest();S3.put_object(Bucket='cloud-calendars-media',Key=key,Body=data,ContentType=typ,CacheControl='public,max-age=31536000,immutable',ContentMD5=base64.b64encode(bytes.fromhex(md5)).decode(),Metadata={'sha256':sha});h=S3.head_object(Bucket='cloud-calendars-media',Key=key);assert h['ContentLength']==len(data) and h['ETag'].strip('"')==md5;return {'key':key,'bytes':len(data),'sha256':sha}

def run(job):
 locale,device,a=job;ident=locale+'/'+device
 if ident in DONE:
  assert DONE[ident]['assetId']==a['id']
  return DONE[ident]
 x=a['attributes'];assert x['assetDeliveryState']['state']=='COMPLETE';source={}
 if device=='iPhoneDuo':
  key=f'1.7.4/duo-2026-10-21/videos/{locale}/duo-preview-appstore.mp4';raw=S3.get_object(Bucket='cloud-calendars-appstore-media',Key=key)['Body'].read();assert hashlib.md5(raw).hexdigest()==x['sourceFileChecksum'];source={'bucket':'cloud-calendars-appstore-media','key':key,'matchesUploadedChecksum':True}
  poster=S3.get_object(Bucket='cloud-calendars-appstore-media',Key=f'1.7.4/duo-2026-10-21/videos/{locale}/poster.jpg')['Body'].read()
 else:
  text=urllib.request.urlopen(x['videoUrl'],timeout=60).read().decode();lines=text.splitlines();variants=[]
  for i,line in enumerate(lines):
   if line.startswith('#EXT-X-STREAM-INF:'):
    w,h=map(int,re.search(r'RESOLUTION=(\d+)x(\d+)',line).groups());variants.append((w*h,lines[i+1]))
  video=max(variants)[1];audio=re.search(r'#EXT-X-MEDIA:TYPE=AUDIO[^\n]*URI="([^"]+)"',text).group(1)
  result=subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-i',video,'-i',audio,'-map','0:v:0','-map','1:a:0','-c','copy','-movflags','frag_keyframe+empty_moov','-f','mp4','pipe:1'],capture_output=True,check=True);raw=result.stdout
  source={'url':x['videoUrl'],'variant':video,'provenance':'Apple-delivered video/audio remux, processed in memory; not original uploaded bytes.'}
  check=subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-i','pipe:0','-f','null','-'],input=raw,capture_output=True)
  if check.returncode or check.stderr:raise RuntimeError(ident+' decode '+check.stderr.decode()[:500])
  poster=subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-i','pipe:0','-ss','1','-frames:v','1','-q:v','2','-f','image2pipe','-vcodec','mjpeg','pipe:1'],input=raw,capture_output=True,check=True).stdout
 probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json','pipe:0'],input=raw));v=next(x for x in probe['streams'] if x['codec_type']=='video')
 video=put(f'{BASE}/{locale}/{device}/preview.mp4',raw,'video/mp4');image=put(f'{BASE}/{locale}/{device}/preview-poster.jpg',poster,'image/jpeg')
 if device=='iPhoneDuo':
  check=subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-i','https://www.cloud-calendars.com/'+video['key'],'-f','null','-'],capture_output=True)
  if check.returncode or check.stderr:raise RuntimeError(ident+' public decode '+check.stderr.decode()[:500])
 durationValue=probe.get('format',{}).get('duration') or v.get('duration') or 0
 duration=float(durationValue) if str(durationValue) not in ['N/A',''] else 0
 return {'jobId':ident,'locale':locale,'device':device,'assetId':a['id'],'source':source,'width':v['width'],'height':v['height'],'duration':duration,'codec':v['codec_name'],'fullDecode':'PASS no errors','localMediaFilesWritten':0,'objects':[video,image],'video':{'src':'/'+video['key'],'poster':'/'+image['key'],'width':v['width'],'height':v['height']}}

JOBS=[]
for l,d in DATA.items():
 for s in d['appPreviewSets']:
  if s['displayType'] in DEV and s['assets']:JOBS.append((l,DEV[s['displayType']],s['assets'][0]))
rows=[]
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
 for row in pool.map(run,JOBS):
  rows.append(row)
  if row['jobId'] not in DONE:
   with J.open('a') as f:f.write(json.dumps(row)+'\n')
  print('Imported+decoded video',len(rows),'/',len(JOBS),row['jobId'],flush=True)
(R/'video-import-summary.json').write_text(json.dumps({'videos':len(rows),'locales':len(DATA),'allDecodePass':True},indent=2)+'\n');print('VIDEOS COMPLETE',flush=True)
