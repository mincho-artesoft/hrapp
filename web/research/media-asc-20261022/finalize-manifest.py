import json,hashlib
from pathlib import Path
R=Path(__file__).resolve().parent;ROOT=R.parent.parent
m=json.loads((R/'screenshots-manifest.json').read_text());rows=[json.loads(x) for x in (R/'video-import-checkpoint.jsonl').read_text().splitlines()];videos={x['jobId']:x for x in rows}
assert len(m['locales'])==29
assert sum(len(s['screenshots']) for d in m['locales'].values() for s in d.values())==435
assert len(videos)==71
for row in videos.values():
 m['locales'][row['locale']][row['device']]['video']=row['video']
objects={x['key']:x for f in ['screenshot-import-checkpoint.jsonl','video-import-checkpoint.jsonl'] for line in (R/f).read_text().splitlines() for x in json.loads(line)['objects']}
assert len(objects)==1882
public=json.loads((R/'public-media-verification.json').read_text());assert public['count']==1882 and public['allExactSha256']
assert {x['key']:x['sha256'] for x in public['objects']}=={k:x['sha256'] for k,x in objects.items()}
assert hashlib.sha256((ROOT/'src/app/pages/privacy-policy-page/privacy-policy-page.component.html').read_bytes()).hexdigest()=='25ce1d341a18967caf5ef68782358b48e3fb192346ff13aa7712b1935f5b28e4'
out=ROOT/'src/app/core/store-media-manifest.json';out.write_text(json.dumps(m,ensure_ascii=False,indent=2)+'\n')
(R/'manifest-completion.json').write_text(json.dumps({'screenshots':435,'renditions':1740,'videos':71,'posters':71,'mediaLocales':29,'siteLocales':30,'bulgarian':'existingen-USmediafallback','manifestSHA256':hashlib.sha256(out.read_bytes()).hexdigest(),'all1882ObjectsPublicSHA256Verified':True,'privacyUnchanged':True},indent=2)+'\n')
print('Complete manifest:435screenshots,71videos,29mediafolders,1882verifiedobjects')
