import sys,json,concurrent.futures
from pathlib import Path
sys.path.insert(0,'/Users/minchomilev/work/arte-soft-sites/tools');import asc_report as asc
r=Path(__file__).resolve().parent;locales=json.loads((r/'site-media-locales.json').read_text());audit=json.loads((r.parent/'asc-priority-20261022/media-readiness.json').read_text());out={}
def run(l):
 row=audit['locales'][l];d={}
 for kind,sets in row['sets'].items():
  child='appScreenshots' if kind=='appScreenshotSets' else 'appPreviews';d[kind]=[]
  for s in sets:
   if not s['count']:continue
   data=asc.get('/'+kind+'/'+s['id']+'/'+child+'?limit=200')['data'];d[kind].append({'id':s['id'],'displayType':s['displayType'],'assets':data})
 return l,d
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
 for l,d in pool.map(run,locales):
  out[l]=d;(r/'selected-asc-metadata-checkpoint.json').write_text(json.dumps(out,indent=2)+'\n');print('Fetched',l,flush=True)
(r/'selected-asc-metadata.json').write_text(json.dumps(out,indent=2)+'\n')
