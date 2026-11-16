import sys,json,hashlib,base64,mimetypes,datetime
from pathlib import Path
sys.path.append('/Users/minchomilev/.venvs/aws/lib/python3.14/site-packages');import boto3
ROOT=Path('/Users/minchomilev/cloud-calendars');R=ROOT/'research/media-asc-20261022';s3=boto3.client('s3',region_name='eu-central-1');bucket='cloud-calendars-appstore-media';ext={'.png','.jpg','.jpeg','.webp','.avif','.gif','.mp4','.mov','.webm','.m4v'}
paths=[p for p in Path('/tmp').glob('cloud-calendar*') if p.is_file() and p.suffix.lower() in ext]
for folder in list(Path('/tmp').glob('cc-preview-*'))+[ROOT/'brand']:
 if folder.is_dir():paths += [p for p in folder.rglob('*') if p.is_file() and not p.is_symlink() and p.suffix.lower() in ext]
rows=[]
for p in paths:
 data=p.read_bytes();sha=hashlib.sha256(data).hexdigest();md5=hashlib.md5(data).hexdigest();key='1.7.4/local-media-archive-20261022/sha256/'+sha+p.suffix.lower();res=s3.put_object(Bucket=bucket,Key=key,Body=data,ContentType=mimetypes.guess_type(p.name)[0] or 'application/octet-stream',ContentMD5=base64.b64encode(bytes.fromhex(md5)).decode(),Metadata={'sha256':sha});assert res['ETag'].strip('"')==md5
 h=s3.head_object(Bucket=bucket,Key=key);assert h['ContentLength']==len(data) and h['Metadata']['sha256']==sha;p.unlink();rows.append({'path':str(p),'bytes':len(data),'sha256':sha,'s3Bucket':bucket,'s3Key':key,'removedAt':datetime.datetime.now(datetime.timezone.utc).isoformat()})
 (R/'extra-local-removals.json').write_text(json.dumps(rows,indent=2)+'\n')
print('Extra scratch and brand media archived+removed:',len(rows),'files;',round(sum(r['bytes'] for r in rows)/1024**2,1),'MiB',flush=True)
