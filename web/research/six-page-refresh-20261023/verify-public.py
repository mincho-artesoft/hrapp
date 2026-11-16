import json,pathlib,concurrent.futures,urllib.request,hashlib,time
from html.parser import HTMLParser
P=pathlib.Path(__file__).resolve().parent;plan=json.loads((P/'static-audit.json').read_text())
class H(HTMLParser):
 def __init__(self):super().__init__();self.meta={};self.canon=[]
 def handle_starttag(self,t,attrs):
  a=dict(attrs)
  if t=='meta' and 'name'in a:self.meta[a['name']]=a.get('content','')
  if t=='link' and a.get('rel')=='canonical':self.canon.append(a['href'])
def check(row):
 url='https://www.cloud-calendars.com'+row['route']
 for n in range(4):
  try:
   with urllib.request.urlopen(url,timeout=60) as r:raw=r.read();status=r.status
   text=raw.decode();h=H();h.feed(text)
   assert status==200 and h.meta.get('robots')==row['robots'],(url,status,h.meta)
   assert h.canon==[url],(url,h.canon)
   assert 'article__comparison' in text and 'article__action' in text,(url,'old content')
   assert '/media/panel/asc-174-20261022/' in text,(url,'missing S3 media')
   return {'url':url,'robots':h.meta['robots'],'bytes':len(raw),'sha256':hashlib.sha256(raw).hexdigest(),'status':status}
  except Exception:
   if n==3:raise
   time.sleep(2)
with concurrent.futures.ThreadPoolExecutor(max_workers=8) as pool:rows=list(pool.map(check,plan['rows']))
(P/'public-audit.json').write_text(json.dumps({'passed':True,'pages':len(rows),'englishIndexable':sum(r['robots']=='index,follow'for r in rows),'translatedNoindex':sum(r['robots']=='noindex,follow'for r in rows),'rows':rows},indent=2)+'\n');print('PASS',len(rows),'published pages verified')
