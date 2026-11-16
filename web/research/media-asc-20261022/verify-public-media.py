import json,urllib.request,hashlib,concurrent.futures,datetime,time
from pathlib import Path
R=Path(__file__).resolve().parent;P=R/'public-media-checkpoint.jsonl';verified={}
if P.exists():
 for line in P.read_text().splitlines():
  x=json.loads(line);verified[x['key']]=x

def run(x):
 for attempt in range(4):
  try:
   u='https://www.cloud-calendars.com/'+x['key'];response=urllib.request.urlopen(u,timeout=30);data=response.read();digest=hashlib.sha256(data).hexdigest();assert len(data)==x['bytes'] and digest==x['sha256'],u
   return {'key':x['key'],'bytes':len(data),'sha256':digest,'contentType':response.headers.get('Content-Type'),'status':response.status}
  except Exception:
   if attempt==3:raise
   time.sleep(2*(attempt+1))
while True:
 objects={}
 for file in ['screenshot-import-checkpoint.jsonl','video-import-checkpoint.jsonl']:
  for line in (R/file).read_text().splitlines():
   try:row=json.loads(line)
   except json.JSONDecodeError:continue
   for x in row['objects']:objects[x['key']]=x
 for key,x in verified.items():
  if key in objects:assert x['sha256']==objects[key]['sha256']
 pending=[x for key,x in objects.items() if key not in verified]
 with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:
  for row in pool.map(run,pending):
   verified[row['key']]=row
   with P.open('a') as f:f.write(json.dumps(row)+'\n')
 print('CDN exact-SHA verified',len(verified),'/1882',flush=True)
 if len(objects)==1882 and len(verified)==1882:break
 time.sleep(20)
(R/'public-media-verification.json').write_text(json.dumps({'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'count':len(verified),'allExactSha256':True,'objects':sorted(verified.values(),key=lambda x:x['key'])},indent=2)+'\n');print('PUBLIC MEDIA VERIFIED',len(verified),flush=True)
