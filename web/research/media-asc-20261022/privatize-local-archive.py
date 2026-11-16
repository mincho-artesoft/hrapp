import sys,json,concurrent.futures
from pathlib import Path
sys.path.append('/Users/minchomilev/.venvs/aws/lib/python3.14/site-packages');import boto3
R=Path(__file__).resolve().parent;J=R/'local-removal-checkpoint.jsonl';rows=[json.loads(x) for x in J.read_text().splitlines()];s3=boto3.client('s3',region_name='eu-central-1');dest='cloud-calendars-appstore-media';prefix='media/local-archive-20261022/';jobs={x['s3Key']:x for x in rows if x['s3Bucket']=='cloud-calendars-media' and x['s3Key'].startswith(prefix)}
def run(pair):
 key,row=pair;new='1.7.4/local-media-archive-20261022/'+key.removeprefix(prefix);res=s3.copy_object(Bucket=dest,Key=new,CopySource={'Bucket':'cloud-calendars-media','Key':key});assert res['CopyObjectResult']['ETag'].strip('"')==row['md5'];h=s3.head_object(Bucket=dest,Key=new);assert h['ContentLength']==row['bytes'] and h['Metadata']['sha256']==row['sha256'];return key,new
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:mapped=dict(pool.map(run,jobs.items()))
for row in rows:
 if row['s3Key'] in mapped:row['s3Key']=mapped[row['s3Key']];row['s3Bucket']=dest
J.write_text(''.join(json.dumps(x)+'\n' for x in rows));s3.put_object(Bucket=dest,Key='1.7.4/local-media-archive-20261022/local-removal-checkpoint.jsonl',Body=J.read_bytes(),ContentType='application/x-ndjson')
# Remove only this task's redundant public-origin archive objects after private checksums pass.
keys=list(mapped)+[prefix+'local-removal-checkpoint.jsonl']
for i in range(0,len(keys),1000):
 res=s3.delete_objects(Bucket='cloud-calendars-media',Delete={'Objects':[{'Key':k} for k in keys[i:i+1000]],'Quiet':True});assert not res.get('Errors'),res.get('Errors')
(R/'private-archive-verification.json').write_text(json.dumps({'privateBucket':dest,'privatePrefix':'1.7.4/local-media-archive-20261022/','verifiedObjects':len(mapped),'allSizeMd5ShaMetadataPass':True,'redundantPublicArchiveCopiesRemoved':len(keys),'websitePublicMediaUnchanged':True},indent=2)+'\n');print('Archive verified in private app-store media bucket; redundant public-origin archive copies removed:',len(mapped),flush=True)
