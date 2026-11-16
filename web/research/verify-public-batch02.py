"""Verify every changed article response against the final built HTML bytes."""
import pathlib,json,urllib.request,concurrent.futures,hashlib,datetime
root=pathlib.Path(__file__).parent.parent
manifest=json.loads((root/'research/batch02-static-qa.json').read_text())
def get(x):
 u='https://www.cloud-calendars.com'+x['route']
 with urllib.request.urlopen(u,timeout=40) as r:
  b=r.read();return {'locale':x['locale'],'slug':x['slug'],'url':u,'status':r.status,'html_matches_build':hashlib.sha256(b).hexdigest()==x['sha256']}
with concurrent.futures.ThreadPoolExecutor(max_workers=4)as pool:rows=list(pool.map(get,manifest['articles']))
report={'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'scope':'All113changedarticles; exact fullHTML byte comparison, not ranking or native-speaker approval.','all_passed':all(x['status']==200 and x['html_matches_build']for x in rows),'articles':rows}
(root/'research/batch02-public-qa.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps({'count':len(rows),'all_passed':report['all_passed']}));assert report['all_passed']
