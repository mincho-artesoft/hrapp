"""Cross-page canonical/hreflang/schema checks against actual built sitemap HTML."""
import json,re,sys,pathlib,urllib.parse,xml.etree.ElementTree as ET
from html.parser import HTMLParser
root=pathlib.Path(__file__).resolve().parents[1]
dist=root/'dist/arte-calendar/browser'
class Page(HTMLParser):
 def __init__(self,text):
  super().__init__(convert_charrefs=True);self.canonical=[];self.alternates={};self.meta={};self.schemas=[];self.schema_text=None;self.hidden=0;self.text=[];self.h1=[];self.in_h1=False;self.lang=None;self.feed(text)
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag=='html':self.lang=a.get('lang')
  if tag=='link' and a.get('rel')=='canonical':self.canonical.append(a.get('href'))
  if tag=='link' and a.get('rel')=='alternate' and a.get('hreflang'):
   key=a['hreflang'];assert key not in self.alternates,'Duplicate hreflang';self.alternates[key]=a.get('href')
  if tag=='meta':self.meta[a.get('name',a.get('property',''))]=a.get('content')
  if tag=='h1':self.in_h1=True
  if tag in ['script','style']:self.hidden+=1
  if tag=='script' and a.get('type')=='application/ld+json':self.schema_text=''
 def handle_endtag(self,tag):
  if tag=='h1':self.in_h1=False
  if tag=='script' and self.schema_text is not None:
   d=json.loads(self.schema_text);self.schemas.extend(d if isinstance(d,list) else d.get('@graph',[d]));self.schema_text=None
  if tag in ['script','style']:self.hidden=max(0,self.hidden-1)
 def handle_data(self,text):
  if self.schema_text is not None:self.schema_text+=text
  if not self.hidden:
   self.text.append(text)
   if self.in_h1:self.h1.append(text)
norm=lambda s:' '.join(s.split())
ns={'s':'http://www.sitemaps.org/schemas/sitemap/0.9'}
urls=[e.text for e in ET.parse(dist/'sitemap.xml').findall('s:url/s:loc',ns)]
pages={};errors=[];warnings=[];articles=0;app_pages=0;faq_pages=0
facts=(root/'src/app/core/app-facts.ts').read_text()
expected={k:re.search(r'export const '+k+r" = (?:'([^']*)'|([\d.]+));",facts).groups() for k in ['APP_VERSION','APP_SIZE_MB','APP_RATING','APP_RATING_COUNT']}
expected={k:a or b for k,(a,b) in expected.items()}
for url in urls:
 path=urllib.parse.urlparse(url).path
 file=dist/(path.strip('/') if path.endswith('.html') else path.strip('/')+'/index.html' if path!='/' else 'index.html')
 try:
  page=Page(file.read_text());assert page.canonical==[url],f'Canonical {page.canonical}'
  assert page.meta.get('description'), 'Missing description'
  assert page.meta.get('robots')=='index,follow','Unexpected sitemap robots'
  pages[url]=page
  for data in page.schemas:
   typ=data.get('@type')
   if typ=='Article':
    articles+=1
    assert data['mainEntityOfPage']['@id']==url,'Article URL mismatch'
    assert norm(data['headline'])==norm(''.join(page.h1)),'Article headline mismatch'
    assert data['description']==page.meta['description'],'Article description mismatch'
    assert data['inLanguage']==page.lang,'Article language mismatch'
   if typ=='FAQPage':
    faq_pages+=1;visible=norm(' '.join(page.text))
    for item in data['mainEntity']:
     assert norm(item['name']) in visible,'FAQ question absent from page'
     assert norm(item['acceptedAnswer']['text']) in visible,'FAQ answer absent from page'
   if typ=='SoftwareApplication':
    app_pages+=1
    assert str(data.get('softwareVersion'))==expected['APP_VERSION'],'Stale app version'
    assert data.get('fileSize')==expected['APP_SIZE_MB']+' MB','Stale app size'
    assert str(data.get('aggregateRating',{}).get('ratingValue'))==expected['APP_RATING'],'Stale app rating'
    assert str(data.get('aggregateRating',{}).get('ratingCount'))==expected['APP_RATING_COUNT'],'Stale rating count'
 except Exception as e:errors.append({'url':url,'error':str(e)})
for url,page in pages.items():
 if not page.alternates:continue
 try:
  assert url in page.alternates.values(),'Missing self alternate'
  assert page.alternates.get(page.lang)==url,'Self language mismatch'
  for lang,target in page.alternates.items():
   assert target in pages,'Alternate absent from sitemap'
   assert pages[target].alternates==page.alternates,'Nonreciprocal alternate set'
   if lang!='x-default':assert pages[target].lang==lang,'Alternate language mismatch'
 except Exception as e:errors.append({'url':url,'error':str(e)})
report={'sitemapPages':len(urls),'parsedPages':len(pages),'articleSchemas':articles,'faqSchemas':faq_pages,'softwareApplicationSchemas':app_pages,'appFactsExpected':expected,'allPassed':not errors,'errors':errors,'warnings':warnings,'scope':'Built HTML canonical, reciprocal hreflang, schema text/language and shared app facts only. Not indexing, rich-result eligibility, ranking, product runtime or translation certification.'}
out=pathlib.Path(sys.argv[1]) if len(sys.argv)>1 else root/'research/built-metadata-qa.json';out.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps(report,ensure_ascii=False));raise SystemExit(bool(errors))
