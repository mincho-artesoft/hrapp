"""Export visible English article text; never execute HTML or infer missing content."""
from html.parser import HTMLParser
import pathlib,json,re,sys
ROOT=pathlib.Path(__file__).resolve().parent.parent
DIST=ROOT/'dist/arte-calendar/browser'
class ArticleText(HTMLParser):
 def __init__(self):
  super().__init__(convert_charrefs=True);self.active=False;self.article_depth=0;self.skip=0;self.block=None;self.buf=[];self.lines=[];self.links=[]
 def handle_starttag(self,tag,attrs):
  attrs=dict(attrs)
  if tag=='article':self.article_depth+=1;self.active=True
  if not self.active:return
  if self.skip:
   if tag not in ['img','br','hr','input','source','meta','link','wbr']:self.skip+=1
   return
  if tag=='cc-more-apps' or(tag=='section'and'__gallery'in attrs.get('class','')):
   self.skip=1;return
  if tag in ['h1','h2','p','dt','dd','li'] and self.block is None:self.block=tag;self.buf=[]
  if tag=='a'and self.block:self.links.append(attrs.get('href',''))
 def handle_startendtag(self,tag,attrs):
  self.handle_starttag(tag,attrs)
  if tag not in ['img','br','hr','input','source','meta','link','wbr']:self.handle_endtag(tag)
 def handle_endtag(self,tag):
  if not self.active:return
  if self.skip:
   self.skip-=1;return
  if tag=='a'and self.block and self.links:
   url=self.links.pop()
   if url:
    if url.startswith('/'):url='https://www.cloud-calendars.com'+url
    self.buf.append(' ('+url+')')
  if tag==self.block:
   text=re.sub(r'\s+',' ',''.join(self.buf)).strip()
   if text:self.lines.append(({'h1':'# ','h2':'## ','dt':'### ','li':'- '}.get(tag,'')+text))
   self.block=None;self.buf=[]
  if tag=='article':
   self.article_depth-=1
   if self.article_depth==0:self.active=False
 def handle_data(self,data):
  if self.active and not self.skip and self.block:self.buf.append(data)
selection=json.loads((ROOT/'tools/guide-text-selection.json').read_text());sections=[];proof=[]
for slug in selection:
 path=DIST/'articles'/slug/'index.html';s=path.read_text();parser=ArticleText();parser.feed(s)
 heading=next((i for i,line in enumerate(parser.lines)if line.startswith('# ')),None)
 assert heading is not None,slug
 parser.lines=parser.lines[heading:]
 canonical='https://www.cloud-calendars.com/articles/'+slug+'/'
 assert canonical in s,slug
 text='\n\n'.join(parser.lines);sections.append('Source: '+canonical+'\n\n'+text)
 proof.append({'slug':slug,'source':canonical,'blocks':len(parser.lines),'characters':len(text)})
full='# Cloud Calendars — selected English guide text\n\nExported from the published HTML for the guides listed below. Arte Soft develops Cloud Calendars and publishes these guides. They include product-source checks and provider references; they are not independent device benchmarks. Other English guides and translations remain available through llms.txt.\n\n'+'\n\n---\n\n'.join(sections)+'\n'
(DIST/'llms-full.txt').write_text(full)
(ROOT/'research/guide-text-export-qa.json').write_text(json.dumps({'guides':len(proof),'selection':'tools/guide-text-selection.json','extraction':'Visible article headings, paragraphs, lists, FAQs and source links; gallery/other-app cards excluded.','exportedCharacters':len(full),'records':proof},indent=2)+'\n')
print('guide text export:',len(proof),'English guides,',len(full),'characters')
