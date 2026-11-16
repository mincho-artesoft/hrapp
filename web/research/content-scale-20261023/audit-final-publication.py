#!/usr/bin/env python3
"""Read-only prerender audit. No build, network requests, source edits or media downloads.
Run --mode provisional for an older dist; --mode final enforces exact pilot membership.
FAQ fidelity is static prerender/JSON-LD parity, not a browser visual test.
/media/panel/ is the established S3-backed path; this audit does not prove live object availability.
"""
import argparse, collections, hashlib, html, json, pathlib, re, sys
from html.parser import HTMLParser
from urllib.parse import urljoin, urlparse
import xml.etree.ElementTree as ET

ORIGIN='https://www.cloud-calendars.com'
VOID={'area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr'}
def norm(x):return ' '.join(html.unescape(x).split())
def route(x):
 p=urlparse(urljoin(ORIGIN+'/',x));return (p.path.rstrip('/') or '/') if p.netloc==urlparse(ORIGIN).netloc else None

def plain(x):
 p=Text();p.feed(str(x));return norm(''.join(p.text))
class Text(HTMLParser):
 def __init__(self):super().__init__(convert_charrefs=True);self.text=[]
 def handle_data(self,data):self.text.append(data)
class Page(HTMLParser):
 def __init__(self):
  super().__init__(convert_charrefs=True);self.stack=[];self.h1=[];self.links=[];self.canonicals=[];self.robots=[];self.jsonld=[];self.jsonErrors=[];self.faqTerms=[];self.media=[]
 def handle_starttag(self,tag,attrs):
  a={k:v or '' for k,v in attrs};hidden=('hidden' in a or a.get('aria-hidden')=='true' or re.search(r'display\s*:\s*none',a.get('style',''),re.I) is not None)
  node={'tag':tag,'attrs':a,'text':[],'hidden':hidden or any(s['hidden'] for s in self.stack)}
  if tag=='meta' and a.get('name','').lower()=='robots':self.robots.append(a.get('content',''))
  if tag=='link' and 'canonical' in a.get('rel','').lower().split():self.canonicals.append(a.get('href',''))
  if tag=='a' and 'href' in a:self.links.append(a['href'])
  if tag in ('img','video','source'):
   for key in ('src','poster'):
    if a.get(key):self.media.append({'tag':tag,'attribute':key,'url':a[key]})
   if a.get('srcset'):
    for item in a['srcset'].split(','):
     if item.strip():self.media.append({'tag':tag,'attribute':'srcset','url':item.strip().split()[0]})
  node['faq']=any('article__faq' in z['attrs'].get('class','').split() for z in self.stack)
  if tag not in VOID:self.stack.append(node)
 def handle_startendtag(self,tag,attrs):
  self.handle_starttag(tag,attrs)
  if tag not in VOID:self.handle_endtag(tag)
 def handle_data(self,data):
  for n in self.stack:
   if n['tag'] in ('h1','dt','dd','script'):n['text'].append(data)
 def handle_endtag(self,tag):
  i=next((i for i in range(len(self.stack)-1,-1,-1) if self.stack[i]['tag']==tag),None)
  if i is None:return
  for n in self.stack[i:]:
   text=''.join(n['text'])
   if n['tag']=='h1' and not n['hidden']:self.h1.append(norm(text))
   if n['tag'] in ('dt','dd') and n['faq'] and not n['hidden']:self.faqTerms.append((n['tag'],norm(text)))
   if n['tag']=='script' and n['attrs'].get('type')=='application/ld+json':
    try:self.jsonld.append(json.loads(text))
    except Exception as e:self.jsonErrors.append(str(e))
  self.stack=self.stack[:i]
 def faq_visible(self):
  out=[];q=None
  for tag,t in self.faqTerms:
   if tag=='dt':q=t
   elif q is not None:out.append((q,t));q=None
  return out

def objects(o):
 if isinstance(o,dict):
  yield o
  for v in o.values():yield from objects(v)
 elif isinstance(o,list):
  for v in o:yield from objects(v)
def faq_schema(p):
 out=[]
 for doc in p.jsonld:
  for o in objects(doc):
   typ=o.get('@type');types=typ if isinstance(typ,list) else [typ]
   if 'FAQPage' in types:
    for q in o.get('mainEntity',[]):
     a=q.get('acceptedAnswer',{});a=a[0] if isinstance(a,list) and a else a
     out.append((plain(q.get('name','')),plain(a.get('text',''))))
 return out

def media_class(u):
 path=urlparse(u).path
 if re.search(r'(?:^|/)(?:icons|favicon)(?:/|\.)',path) or path.endswith(('.svg','.ico')):return 'small_ui_icon'
 if u.startswith('/media/panel/') or u.startswith(ORIGIN+'/media/panel/'):return 's3_backed_panel_route'
 if re.match(r'https://[^/]*(?:amazonaws\.com|cloudfront\.net)/',u):return 'direct_aws_media'
 if path.endswith(('.woff','.woff2','.ttf')):return 'font'
 return 'unapproved_marketing_media_path'

def main():
 ap=argparse.ArgumentParser();ap.add_argument('--mode',choices=['provisional','final'],default='provisional');ap.add_argument('--dist',default='dist/arte-calendar/browser');ap.add_argument('--report',default='research/content-scale-20261023/publication-audit-provisional.json');ap.add_argument('--selection',default='research/content-scale-20261023/priority-selection.json');args=ap.parse_args()
 root=pathlib.Path(__file__).resolve().parents[2];dist=(root/args.dist).resolve();selpath=root/args.selection
 selection=json.loads(selpath.read_text());selected={a['slug'] for a in selection['selectedArticles']};manifest=json.loads((root/'research/content-scale-20261023/editorial-manifest.json').read_text());baseline=set(manifest['baselineSlugs'])
 expected=baseline|selected;errors=[];warnings=[];checks=[];pages={}
 def check(name,passed,details=None,final_only=False):
  checks.append({'check':name,'passed':bool(passed),'details':details,'finalOnly':final_only})
  if not passed:(warnings if final_only and args.mode=='provisional' else errors).append(name)
 for f in sorted(dist.rglob('index.html')):
  r='/'+str(f.parent.relative_to(dist)).strip('/');r=r if r!='/.' else '/';p=Page();p.feed(f.read_text());pages[r]=p
 english={r.split('/')[-1] for r in pages if re.fullmatch(r'/articles/[^/]+',r)}
 held={r for r in pages if re.fullmatch(r'/[^/]+/articles(?:/[^/]+)?',r)}
 new=english-baseline;selected_built=selected&english
 check('baseline_count_73',len(baseline)==73,len(baseline));check('selection_count_100',len(selected)==100,len(selected));check('english_count_173',len(english)==173,len(english),True);check('new_count_100',len(new)==100,len(new),True);check('exact_selected_publication_membership',english==expected,{'missing':sorted(expected-english),'unexpected':sorted(english-expected)},True)
 check('held_routes_count_542',len(held)==542,len(held))
 # Sitemap locs and alternate URLs count as discovery; llms URLs parsed separately.
 sitemap_urls=set();sitemap_alternates=set();xml_errors=[]
 for sf in dist.glob('*sitemap*.xml'):
  try:
   tree=ET.parse(sf)
   for n in tree.iter():
    if n.tag.split('}')[-1]=='loc' and n.text:sitemap_urls.add(n.text.strip())
    if n.attrib.get('href'):sitemap_alternates.add(n.attrib['href'])
  except Exception as e:xml_errors.append({'file':str(sf),'error':str(e)})
 check('sitemap_xml_parses',not xml_errors,xml_errors)
 sitemap_routes={route(u) for u in sitemap_urls};alternate_routes={route(u) for u in sitemap_alternates}
 llms_files=sorted(dist.glob('llms*.txt'));llms_urls=set()
 for f in llms_files:llms_urls.update(re.findall(r'https?://[^\s<>\]\)"\']+',f.read_text()))
 llms_routes={route(u.rstrip('.,;')) for u in llms_urls}
 check('llms_discovery_exists',bool(llms_files),[f.name for f in llms_files]);check('selected_routes_in_sitemap',all('/articles/'+s in sitemap_routes for s in selected),sorted(s for s in selected if '/articles/'+s not in sitemap_routes),True);check('selected_routes_in_llms',all('/articles/'+s in llms_routes for s in selected),sorted(s for s in selected if '/articles/'+s not in llms_routes),True)
 check('all_built_english_articles_in_sitemap',all('/articles/'+s in sitemap_routes for s in english));check('all_built_english_articles_in_llms',all('/articles/'+s in llms_routes for s in english))
 check('held_absent_sitemap_and_alternates',not(held&(sitemap_routes|alternate_routes)),sorted(held&(sitemap_routes|alternate_routes)));check('held_absent_llms',not(held&llms_routes),sorted(held&llms_routes))
 page_details=[];image_issues=[];media_counts=collections.Counter();faq_mismatch=[];held_bad=[];english_bad=[]
 for r,p in pages.items():
  robot_tokens={v.strip().lower() for c in p.robots for v in c.split(',')}
  if r in held and not ('noindex' in robot_tokens and 'follow' in robot_tokens and 'nofollow' not in robot_tokens):held_bad.append({'route':r,'robots':p.robots})
  if re.fullmatch(r'/articles/[^/]+',r):
   expected_canonical=ORIGIN+r+'/'
   bad=[]
   if len(p.h1)!=1 or not p.h1[0]:bad.append('exactly_one_nonempty_h1')
   if p.canonicals!=[expected_canonical]:bad.append('exact_canonical')
   if not {'index','follow'}<=robot_tokens or {'noindex','nofollow'}&robot_tokens:bad.append('index_follow')
   v=p.faq_visible();s=faq_schema(p)
   if v!=s or p.jsonErrors:faq_mismatch.append({'route':r,'visible':v,'schema':s,'parseErrors':p.jsonErrors})
   if bad:english_bad.append({'route':r,'errors':bad,'h1':p.h1,'canonical':p.canonicals,'robots':p.robots})
   page_details.append({'route':r,'h1':p.h1,'canonical':p.canonicals,'robots':p.robots,'faqCount':len(v),'faqSchemaEqual':v==s,'new':r.split('/')[-1] not in baseline,'selected':r.split('/')[-1] in selected})
  for m in p.media:
   c=media_class(m['url']);media_counts[c]+=1
   if c=='unapproved_marketing_media_path':image_issues.append({'route':r,**m})
 check('english_h1_canonical_robots',not english_bad,english_bad);check('faq_jsonld_matches_visible_prerender',not faq_mismatch,faq_mismatch);check('all_held_noindex_follow',not held_bad,held_bad);check('marketing_media_uses_s3_backed_paths',not image_issues,image_issues)
 # Graph edges use same-origin prerendered anchor links, not script content.
 graph={r:{v for h in p.links if (v:=route(h)) in pages} for r,p in pages.items()};seen=set();todo=['/articles']
 while todo:
  r=todo.pop()
  if r in seen:continue
  seen.add(r);todo.extend(graph.get(r,set())-seen)
 incoming=collections.defaultdict(set)
 for parent,children in graph.items():
  if re.fullmatch(r'/articles/[^/]+',parent):
   for child in children:
    if child!=parent:incoming[child].add(parent)
 orphaned=[s for s in sorted(selected_built) if not incoming['/articles/'+s]];unreachable=[s for s in sorted(selected_built) if '/articles/'+s not in seen]
 check('all_built_selected_reachable_from_articles',not unreachable,unreachable);check('all_built_selected_have_nonhub_incoming',not orphaned,orphaned)
 context_file=root/'research/content-scale-20261023/context-links-applied.json'
 if context_file.exists():
  applied=json.loads(context_file.read_text()).get('pairs',[])
  missing_pairs=[a for a in applied if '/articles/'+a['newslug'] not in graph.get('/articles/'+a['parentSlug'],set())]
  check('all_authored_context_pairs_present',not missing_pairs,{'pairs':len(applied),'missing':missing_pairs},True)
  check('authored_context_pairs_cover_all_selected',selected<={a['newslug'] for a in applied},sorted(selected-{a['newslug'] for a in applied}),True)
 base_additions={s:sorted(t.split('/')[-1] for t in graph.get('/articles/'+s,set()) if t.split('/')[-1] in selected) for s in baseline}
 check('baseline_parents_at_most_six_selected_links',all(len(v)<=6 for v in base_additions.values()),{s:v for s,v in base_additions.items() if len(v)>6})
 prerender_path=dist.parent/'prerendered-routes.json';prerender=json.loads(prerender_path.read_text()) if prerender_path.exists() else None
 report={'generatedAt':'2026-10-23','mode':args.mode,'result':'FAIL' if errors else 'PASS_PROVISIONAL' if args.mode=='provisional' else 'PASS_FINAL','readOnly':True,'dist':str(dist),'selectionFile':str(selpath),'selectionSha256':hashlib.sha256(selpath.read_bytes()).hexdigest(),'counts':{'htmlPages':len(pages),'prerenderManifestRoutes':len(prerender.get('routes',{})) if prerender else None,'englishArticles':len(english),'baseline':len(baseline),'newBuilt':len(new),'newSelectedBuilt':len(selected_built),'heldLocalizedArticleAndHubRoutes':len(held),'sitemapLocURLs':len(sitemap_urls),'llmsURLs':len(llms_urls)},'errors':errors,'provisionalFinalGateWarnings':warnings,'checks':checks,'mediaClassificationCounts':dict(media_counts),'articlePages':page_details,'incomingNonHubBySelectedBuilt':{s:sorted(incoming['/articles/'+s]) for s in sorted(selected_built)},'limits':['No claim about live S3 object existence or checksum, current deployed CDN, Google indexing or traffic.','/media/panel/ is accepted as the repository’s established S3-backed proxy path; UI SVG/icons are exempt from marketing media checks.','FAQ check compares prerendered non-hidden definition lists with JSON-LD, not computed browser styling.','Provisional mode does not approve final membership; final mode must be rerun after root’s final build.']}
 out=root/args.report;out.parent.mkdir(parents=True,exist_ok=True);out.write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n');print(json.dumps({'result':report['result'],'counts':report['counts'],'errors':errors,'provisionalWarnings':warnings,'report':str(out)},indent=2));return 1 if errors else 0
if __name__=='__main__':sys.exit(main())
