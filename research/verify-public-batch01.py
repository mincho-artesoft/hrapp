import concurrent.futures,json,urllib.request,hashlib,datetime,pathlib
root=pathlib.Path(__file__).parent.parent
routes=json.loads((root/'research/home-routes-20261021.json').read_text())+[{'locale':'en-US','path':'/articles/what-calendar-sync-actually-does/'}]
def check(x):
 p=x['path'];local=(root/'dist/arte-calendar/browser'/p.strip('/')/'index.html').read_bytes()
 with urllib.request.urlopen('https://www.cloud-calendars.com'+p,timeout=40) as r:
  b=r.read();return {**x,'status':r.status,'matches_build':hashlib.sha256(b).digest()==hashlib.sha256(local).digest(),'bytes':len(b)}
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as e:rows=list(e.map(check,routes))
report={'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'routes':rows,'all_passed':all(x['status']==200 and x['matches_build']for x in rows)}
(root/'research/batch01-public-qa.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({'routes':len(rows),'all_passed':report['all_passed']}));assert report['all_passed']
