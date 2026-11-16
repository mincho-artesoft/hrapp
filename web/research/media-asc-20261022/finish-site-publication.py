import json,time,subprocess,os
from pathlib import Path
R=Path(__file__).resolve().parent;ROOT=R.parent.parent
while True:
 a=R/'screenshots-manifest.json';b=R/'public-media-verification.json'
 if a.exists() and b.exists():
  try:
   m=json.loads(a.read_text());v=json.loads(b.read_text())
   if sum(len(s['screenshots']) for d in m['locales'].values() for s in d.values())==435 and v['count']==1882:break
  except (ValueError,KeyError):pass
 time.sleep(20)
subprocess.run(['python3',str(R/'finalize-manifest.py')],cwd=ROOT,check=True)
subprocess.run(['npm','run','build'],cwd=ROOT,check=True)
env=os.environ.copy();env.update(USE_AWS_PROFILE='1',AWS_PROFILE='default',AWS_BIN='/tmp/cloud-calendar-batch12-aws',SKIP_BUILD='1')
subprocess.run(['bash','scripts/deploy.sh'],cwd=ROOT,env=env,check=True)
print('FULL MEDIA SITE PUBLICATION COMPLETED',flush=True)
