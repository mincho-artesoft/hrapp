import json,pathlib,re,hashlib
from html.parser import HTMLParser
P=pathlib.Path(__file__).resolve().parent;R=P.parents[1];D=R/'dist/arte-calendar/browser'
source=json.loads((P/'english-source.json').read_text());locs=[]
for block in re.findall(r'\{\s*code:.*?\n  \}',(R/'src/app/core/locales.ts').read_text(),re.S):
 locs.append({k:re.search(k+r": '([^']*)'",block).group(1) for k in ['code','slug','media']})
assert len(locs)==30
class Head(HTMLParser):
 def __init__(self):super().__init__();self.meta={};self.links=[];self.img=[]
 def handle_starttag(self,tag,a):
  a=dict(a)
  if tag=='meta' and 'name' in a:self.meta[a['name']]=a.get('content')
  if tag=='link':self.links.append(a)
  if tag=='img':self.img.append(a)
rows=[];discovery=''.join((D/name).read_text() for name in ['sitemap.xml','llms.txt','llms-full.txt'] if(D/name).exists())
for loc in locs:
 data=source if loc['code']=='en-US' else json.loads((P/(loc['code']+'.json')).read_text())
 for slug,a in data.items():
  route='/'+('/'.join([loc['slug'],'articles',slug]).strip('/'))+'/'
  f=D/route.strip('/')/'index.html';assert f.exists(),str(f)
  text=f.read_text();h=Head();h.feed(text)
  expected='index,follow' if loc['code']=='en-US' else 'noindex,follow';assert h.meta.get('robots')==expected,(route,h.meta.get('robots'))
  assert h.meta.get('description')==a['description'],route
  assert len(a['description'])<=160,(route,'description length')
  canonical=[x['href'] for x in h.links if x.get('rel')=='canonical'];assert canonical==['https://www.cloud-calendars.com'+route],(route,canonical)
  assert 'article__comparison' in text and 'article__action' in text,route
  assert text.count('class="article__gallery"')==1,(route,'duplicate gallery')
  gallery=text.split('class="article__gallery"',1)[1].split('</section>',1)[0]
  for kind in a['galleryKinds']:assert kind in gallery,(route,kind)
  assert '/media/panel/asc-174-20261022/'+loc['media']+'/' in gallery,route
  for link in a['articleLinks']:
   target='/'+('/'.join([loc['slug'],'articles',link['slug']]).strip('/'))+'/'
   assert 'href="'+target+'"' in text,(route,target)
  if loc['code']!='en-US':assert 'https://www.cloud-calendars.com'+route not in discovery,(route,'discovery leak')
  alts=[l for l in h.links if l.get('rel')=='alternate' and 'hreflang' in l];assert all(l['hreflang'] in ['en','x-default'] for l in alts),(route,alts)
  rows.append({'locale':loc['code'],'route':route,'robots':expected,'descriptionLength':len(a['description']),'galleryImages':len(a['galleryKinds'])})
privacy=hashlib.sha256((R/'src/app/pages/privacy-policy-page/privacy-policy-page.component.html').read_bytes()).hexdigest();assert privacy=='25ce1d341a18967caf5ef68782358b48e3fb192346ff13aa7712b1935f5b28e4'
held=0
for f in D.rglob('index.html'):
 rel=f.relative_to(D).as_posix()
 if '/articles/' not in '/'+rel:continue
 h=Head();h.feed(f.read_text())
 if h.meta.get('robots')=='noindex,follow':held+=1
report={'passed':True,'pages':len(rows),'locales':len(locs),'translatedPages':sum(r['locale']!='en-US' for r in rows),'heldArticleAndHubRoutes':held,'privacySHA256':privacy,'rows':rows}
(P/'static-audit.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print('PASS',len(rows),'pages;',held,'held article/hub routes; privacy unchanged')
