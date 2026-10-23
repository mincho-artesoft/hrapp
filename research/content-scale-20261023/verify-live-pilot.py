#!/usr/bin/env python3
"""Read-only public HTML verification; retains metrics, never marketing media."""
import concurrent.futures,datetime,hashlib,json,pathlib,re,urllib.request
from html.parser import HTMLParser
P=pathlib.Path(__file__).resolve().parent;ROOT=P.parent.parent;DIST=ROOT/'dist/arte-calendar/browser'
class Page(HTMLParser):
 def __init__(self):super().__init__(convert_charrefs=True);self.h1=[];self.inh=False;self.canonical=[];self.robots=[]
 def handle_starttag(self,t,attrs):
  a=dict(attrs)
  if t=='h1':self.inh=True
  if t=='link' and a.get('rel')=='canonical':self.canonical.append(a.get('href'))
  if t=='meta' and a.get('name')=='robots':self.robots.append(a.get('content'))
 def handle_endtag(self,t):
  if t=='h1':self.inh=False
 def handle_data(self,d):
  if self.inh:self.h1.append(d)
cohort=json.loads((P/'publication-cohort.json').read_text());selection={r['slug']:r for r in json.loads((P/'priority-selection-final.json').read_text())['selectedArticles']}
def check(row):
 out=dict(row)
 try:
  req=urllib.request.Request(row['url'],headers={'User-Agent':'CloudCalendars-publication-verifier/1.0','Accept-Encoding':'identity'})
  with urllib.request.urlopen(req,timeout=45) as response:data=response.read();out.update(status=response.status,finalUrl=response.url)
  page=Page();page.feed(data.decode('utf-8'));out.update(h1=''.join(page.h1),canonical=page.canonical,robots=page.robots,bytes=len(data),sha256=hashlib.sha256(data).hexdigest())
  local=(DIST/'articles'/row['slug']/'index.html').read_bytes();out['matchesDeployedBuild']=data==local
  out['ok']=out['status']==200 and out['finalUrl']==row['url'] and out['h1']==selection[row['slug']]['title'] and out['canonical']==[row['url']] and out['robots']==['index,follow'] and out['matchesDeployedBuild']
 except Exception as e:out.update(ok=False,error=str(e))
 return out
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as ex:rows=list(ex.map(check,cohort['urls']))
extra=[]
for name in ['sitemap.xml','llms.txt','llms-full.txt']:
 with urllib.request.urlopen('https://www.cloud-calendars.com/'+name,timeout=45) as r:data=r.read()
 text=data.decode('utf-8');missing=[x['url'] for x in cohort['urls'] if x['url'] not in text];extra.append({'path':name,'status':200,'missingNewUrls':missing,'bytes':len(data)})
result={'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'newEnglishPages':len(rows),'passed':sum(r['ok'] for r in rows),'failed':[r['slug'] for r in rows if not r['ok']],'discovery':extra,'records':rows}
(P/'live-publication-verification.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n');print(json.dumps({k:v for k,v in result.items() if k!='records'},indent=2))
raise SystemExit(0 if all(r['ok'] for r in rows) and all(not e['missingNewUrls'] for e in extra) else 1)
