import sys,json,hashlib,base64,mimetypes,concurrent.futures,threading,datetime
from pathlib import Path
sys.path.append('/Users/minchomilev/.venvs/aws/lib/python3.14/site-packages');import boto3
ROOT=Path('/Users/minchomilev/cloud-calendars');R=ROOT/'research/media-asc-20261022';S3=boto3.client('s3',region_name='eu-central-1');BUCKET='cloud-calendars-media';EXT={'.png','.jpg','.jpeg','.webp','.avif','.gif','.mp4','.mov','.webm','.m4v'};J=R/'local-removal-checkpoint.jsonl';LOCK=threading.Lock();KNOWN={}
# Find exact matching existing delivered renditions with one paginated inventory, not thousands of HEADs.
existing={}
for page in S3.get_paginator('list_objects_v2').paginate(Bucket=BUCKET,Prefix='media/panel/'):
 for x in page.get('Contents',[]):existing[x['Key']]=x
folders=[Path('/tmp/cloud-calendar-asc-en'),ROOT/'media-source',ROOT/'exports',ROOT/'shots',ROOT/'art',ROOT/'public/assets',ROOT/'media-build',ROOT/'dist',Path('/tmp/cloud-calendar-media-release-20261022')]
files=[]
for folder in folders:
 if folder.exists():files += [p for p in folder.rglob('*') if p.is_file() and not p.is_symlink() and p.suffix.lower() in EXT]

def run(p):
 sha=hashlib.sha256();md=hashlib.md5();size=p.stat().st_size
 with p.open('rb') as f:
  for chunk in iter(lambda:f.read(1024*1024),b''):sha.update(chunk);md.update(chunk)
 digest=sha.hexdigest();md5=md.hexdigest();typ=mimetypes.guess_type(p.name)[0] or 'application/octet-stream';key=None;method=''
 if p.is_relative_to(ROOT/'media-build'):
  candidate='media/'+str(p.relative_to(ROOT/'media-build'));x=existing.get(candidate)
  if x and x['Size']==size and x['ETag'].strip('"')==md5:key=candidate;method='Existing S3 rendition exact size+MD5 matched bulk inventory'
 if p.is_relative_to(ROOT/'public/assets'):
  key='media/panel/site-assets-20261022/'+str(p.relative_to(ROOT/'public/assets'))
  # Server-side copy from existing website source; compare result with local exact MD5 before removal.
  response=S3.copy_object(Bucket=BUCKET,Key=key,CopySource={'Bucket':'www.arte-calendar.com','Key':'assets/'+str(p.relative_to(ROOT/'public/assets'))},MetadataDirective='REPLACE',Metadata={'sha256':digest},ContentType=typ,CacheControl='public,max-age=31536000,immutable')
  assert response['CopyObjectResult']['ETag'].strip('"')==md5,p
  h=S3.head_object(Bucket=BUCKET,Key=key);assert h['ContentLength']==size and h['Metadata']['sha256']==digest;method='S3 server-side copy, size+MD5+SHA metadata verified'
 if key is None:
  key='media/local-archive-20261022/sha256/'+digest+p.suffix.lower()
  with LOCK:known=KNOWN.get(digest)
  if known:key=known;method='Same bytes already verified earlier in this run'
  else:
   try:
    h=S3.head_object(Bucket=BUCKET,Key=key)
    reusable=h['ContentLength']==size and h['ETag'].strip('"')==md5 and h.get('Metadata',{}).get('sha256')==digest
   except S3.exceptions.ClientError as e:
    if e.response['Error']['Code'] not in ['404','NoSuchKey','NotFound']:raise
    reusable=False
   if not reusable:
    with p.open('rb') as f:res=S3.put_object(Bucket=BUCKET,Key=key,Body=f,ContentLength=size,ContentType=typ,ContentMD5=base64.b64encode(md.digest()).decode(),Metadata={'sha256':digest})
    assert res['ETag'].strip('"')==md5
    h=S3.head_object(Bucket=BUCKET,Key=key);assert h['ContentLength']==size and h['ETag'].strip('"')==md5 and h['Metadata']['sha256']==digest
   method='Archive upload/existing object verified by size+MD5+SHA metadata'
 with LOCK:KNOWN[digest]=key
 row={'path':str(p),'bytes':size,'sha256':digest,'md5':md5,'s3Bucket':BUCKET,'s3Key':key,'verification':method,'removedAt':datetime.datetime.now(datetime.timezone.utc).isoformat()}
 # Atomic singlepart S3 object exists and has passed checksum verification; remove this local file now.
 p.unlink()
 with LOCK:
  with J.open('a') as f:f.write(json.dumps(row)+'\n')
 return size
count=0;total=0
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
 for size in pool.map(run,files):
  count+=1;total+=size
  if count%20==0:print('Verified S3 then removed',count,'files;',round(total/1024**2,1),'MiB',flush=True)
summary={'completedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'filesRemoved':count,'bytesFreed':total,'roots':[str(p) for p in folders],'remainingMatchingFiles':[str(p) for folder in folders if folder.exists() for p in folder.rglob('*') if p.is_file() and not p.is_symlink() and p.suffix.lower() in EXT],'codeAndNativeResources':'Native HRApp/Xcode assets, git objects, node_modules and app icons outside website marketing folders excluded.','proof':'Every removal follows exact verified existing S3 object or a checksum-verified archive upload; full mapping in local-removal-checkpoint.jsonl.'}
(R/'local-removal-summary.json').write_text(json.dumps(summary,indent=2)+'\n');print('LOCAL MEDIA CLEANUP COMPLETE',count,round(total/1024**2,1),'MiB',flush=True)
# Keep portable path/hash-to-S3 recovery mapping remotely, too.
S3.put_object(Bucket=BUCKET,Key='media/local-archive-20261022/local-removal-checkpoint.jsonl',Body=J.read_bytes(),ContentType='application/x-ndjson')
