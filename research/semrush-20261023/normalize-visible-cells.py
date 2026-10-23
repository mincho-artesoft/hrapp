"""Normalize only the thirty visible Semrush rows captured from rendered grid cells."""
from pathlib import Path
import json
root=Path(__file__).resolve().parent
rows=[]
def number(text):
 text=text.strip().replace(',','')
 if not text:return None
 for suffix,factor in [('K',1000),('M',1000000)]:
  if text.endswith(suffix):return round(float(text[:-1])*factor)
 return float(text) if '.' in text else int(text)
for prefix,domain in [('flexibits','flexibits.com'),('timetree','timetreeapp.com'),('morgen','morgen.so')]:
 source=prefix+'-visible-cell-details.json';data=json.loads((root/source).read_text());assert len(data)==10
 for raw in data:
  cells={c['column']:c for c in raw};position=cells['4'];features=[a['label'].removeprefix('Current position: ') for a in position['links'] if (a.get('label') or '').startswith('Current position: ')]
  rows.append({'domain':domain,'keyword':cells['2']['text'],'intentLabel':cells['3']['text'],'displayedPosition':number(position['text']),'resultTypes':features or ['Organic position'],'monthlyVolumeEstimateUS':number(cells['8']['text']),'keywordDifficultyEstimate':number(cells['9']['text']),'landingUrl':'https://'+cells['10']['text'],'rowUpdatedDisplay':cells['11']['text'],'sourceFile':source,'database':'US','device':'Desktop','reportDate':'2026-10-21'})
result={'method':'Normalized visible rendered grid columns, including position-cell feature labels. No hidden rows retrieved. Volume and KD are third-party estimates; duplicate phrases across SERP features must not be summed.','rowCount':len(rows),'uniquePhrases':len({r['keyword'] for r in rows}),'rows':rows}
(root/'visible-keyword-observations.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(f'{len(rows)} visible rows / {result["uniquePhrases"]} unique phrases; result types retained')
