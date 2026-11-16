from pathlib import Path
import re,json,hashlib
from xml.etree import ElementTree as E
r=Path('dist/arte-calendar/browser'); root=E.fromstring((r/'sitemap.xml').read_text());locs=[x.text for x in root.findall('{*}url/{*}loc')];counts={'translatedArticles':0,'translatedHubs':0,'englishArticles':0,'englishHubs':0}
for p in r.rglob('*.html'):
 h=p.read_text(); m=re.search(r'<link rel="canonical" href="([^"]+)"',h)
 if not m:continue
 u=m[1]; path=u.split('cloud-calendars.com')[-1];rm=re.search(r'<meta name="robots" content="([^"]+)"',h);robots=rm.group(1) if rm else 'index,follow'
 if re.match(r'^/[^/]+/articles(?:/|$)',path):
  assert robots=='noindex,follow',(path,robots)
  assert u not in locs,path
  assert not re.search(r'<link rel="alternate" hreflang=',h),path
  counts['translatedHubs' if path.rstrip('/').endswith('/articles') else 'translatedArticles']+=1
 elif path.startswith('/articles/'):
  assert robots=='index,follow' and u in locs,(path,robots)
  counts['englishHubs' if path=='/articles/' else 'englishArticles']+=1
for node in root.iter():
 for v in [node.text or '',*node.attrib.values()]:assert not re.search(r'cloud-calendars.com/[^/]+/articles(?:/|$)',v),v
assert counts=={'translatedArticles':407,'translatedHubs':29,'englishArticles':58,'englishHubs':1},counts
assert len(locs)==92
assert hashlib.sha256(Path('src/app/pages/privacy-policy-page/privacy-policy-page.component.html').read_bytes()).hexdigest()=='25ce1d341a18967caf5ef68782358b48e3fb192346ff13aa7712b1935f5b28e4'
Path('research/indexing-hold-20261022/build-check.json').write_text(json.dumps({'counts':counts,'sitemapURLsBefore':528,'sitemapURLsAfter':len(locs),'noTranslatedSitemapEntriesOrAlternates':True,'privacyUnchanged':True},indent=2)+'\n')
print(counts,'sitemap',len(locs))
