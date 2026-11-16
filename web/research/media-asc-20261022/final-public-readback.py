import json,re,hashlib,urllib.request,concurrent.futures,datetime,html as html_lib
from pathlib import Path
R=Path(__file__).resolve().parent;ROOT=R.parent.parent
m=json.loads((ROOT/'src/app/core/store-media-manifest.json').read_text())
s=(ROOT/'src/app/core/locales.ts').read_text()
locales=[dict(re.findall(r"(code|slug|media): '([^']*)'",b)) for b in re.findall(r'\{([^{}]*?code: [^{}]*?)\}',s,re.S)]
locales=[l for l in locales if 'code' in l]
assert len(locales)==30,len(locales)
def check(l):
 url='https://www.cloud-calendars.com/'+(l['slug']+'/' if l['slug'] else '')
 with urllib.request.urlopen(url,timeout=45) as response:html=response.read().decode();status=response.status
 assert 'id="store-media-title"' in html,url
 sets=m['locales'][l['media']];images=[];videos=[]
 for device,media in sets.items():
  for shot in media['screenshots']:
   path=f"{m['base']}/{l['media']}/{device}/{shot['name']}-{max(m['widths'][device])}.webp"
   assert path in html,(url,path);images.append(path)
  if 'video' in media:
   for field in ['src','poster']:assert media['video'][field] in html,(url,field)
   videos.append(media['video']['src'])
 assert len(images)==15
 return {'locale':l['code'],'url':url,'status':status,'all15ScreenshotLinksPresent':True,'videoCount':len(videos),'expectedVideoSourcesPresent':True,'htmlSHA256':hashlib.sha256(html.encode()).hexdigest()}
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as p:rows=list(p.map(check,locales))
assert hashlib.sha256((ROOT/'src/app/pages/privacy-policy-page/privacy-policy-page.component.html').read_bytes()).hexdigest()=='25ce1d341a18967caf5ef68782358b48e3fb192346ff13aa7712b1935f5b28e4'
with urllib.request.urlopen('https://www.cloud-calendars.com/privacy-policy/',timeout=45) as response:policy=response.read().decode()
def policy_text(markup):
 body=re.search(r'<article[^>]*class="legal__body"[^>]*>(.*?)</article>',markup,re.S).group(1)
 return ' '.join(html_lib.unescape(re.sub(r'<[^>]*>',' ',body)).split())
assert policy_text(policy)==policy_text((ROOT/'src/app/pages/privacy-policy-page/privacy-policy-page.component.html').read_text())
(R/'final-public-readback.json').write_text(json.dumps({'checkedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'manifestSHA256':hashlib.sha256((ROOT/'src/app/core/store-media-manifest.json').read_bytes()).hexdigest(),'rows':rows,'scope':'All30 public homepage HTML responses reference complete15-image device galleries and exactly available video sources. Actual objectSHA checks are recorded separately; representative browser playback is a separate review.','privacySourcePreserved':True,'publicPolicyBodyMatchesPreservedSource':True},indent=2)+'\n')
print('All30 public galleries reference complete image sets and available videos')
