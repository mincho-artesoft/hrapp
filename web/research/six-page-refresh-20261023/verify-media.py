import json,pathlib,concurrent.futures,urllib.request,re,time
R=pathlib.Path(__file__).resolve().parents[2];P=pathlib.Path(__file__).resolve().parent
m=json.loads((R/'src/app/core/store-media-manifest.json').read_text());src=json.loads((P/'english-source.json').read_text());urls=set()
for lang,devices in m['locales'].items():
 for a in src.values():
  device=a.get('galleryDevice','iPhone');shots=devices[device]['screenshots'];selected=[s for s in shots if s['kind'] in a['galleryKinds']];assert len(selected)==len(a['galleryKinds']),(lang,device)
  for shot in selected:
   for w in m['widths'][device]:
    for ext in ['avif','webp']:urls.add(f"https://www.cloud-calendars.com{m['base']}/{lang}/{device}/{shot['name']}-{w}.{ext}")
def check(url):
 for attempt in range(4):
  try:
   with urllib.request.urlopen(urllib.request.Request(url,method='HEAD'),timeout=60) as r:
    assert r.status==200 and int(r.headers['Content-Length'])>0,(url,r.status)
    return {'url':url,'bytes':int(r.headers['Content-Length']),'type':r.headers['Content-Type']}
  except Exception:
   if attempt==3:raise
   time.sleep(1)
with concurrent.futures.ThreadPoolExecutor(max_workers=12) as pool:rows=list(pool.map(check,sorted(urls)))
(P/'media-head-check.json').write_text(json.dumps({'passed':True,'count':len(rows),'objects':rows},indent=2)+'\n');print('PASS',len(rows),'S3-backed image renditions')
