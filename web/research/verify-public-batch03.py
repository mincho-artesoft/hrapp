import pathlib,json,urllib.request,hashlib,datetime,concurrent.futures
root=pathlib.Path(__file__).parent.parent;q=json.loads((root/'research/batch03-static-qa.json').read_text());targets=[(x['route'],x['sha256'])for x in q['newArticles']]+[('/llms.txt',q['llmsSha256']),('/llms-full.txt',q['fullTextSha256'])]
def read(item):
 path,sha=item
 with urllib.request.urlopen('https://www.cloud-calendars.com'+path,timeout=40)as r:
  body=r.read();return {'path':path,'status':r.status,'contentType':r.headers.get('Content-Type'),'sha256_matches':hashlib.sha256(body).hexdigest()==sha,'bytes':len(body)}
with concurrent.futures.ThreadPoolExecutor(max_workers=4)as e:rows=list(e.map(read,targets))
report={'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'all_passed':all(x['status']==200 and x['sha256_matches']for x in rows),'targets':rows};(root/'research/batch03-public-qa.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({'targets':len(rows),'all_passed':report['all_passed']}));assert report['all_passed']
