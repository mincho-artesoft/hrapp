"""Summarise saved consumer-UI observations, not API responses or inferred ranks."""
from pathlib import Path
import json,re
root=Path(__file__).resolve().parent
names=['Cloud Calendars','Fantastical','Calendars by Readdle','Calendar 366','WeekCal','easyDays','Apple Calendar','Google Calendar','Outlook','OneCal','CalendarBridge','Supershift','My Shift Planner','MyShiftPlanner','TimeTree','Cozi','FamilyWall','Howbout','Structured','Motion','Morgen','Tiimo','Amie','Notion Calendar','Timepage','FlowSavvy','Reclaim','SkedPal','Sunsama','BusyCal','TickTick','OneCalendar']
records=[]
for file in sorted(root.glob('chatgpt-*.json')):
 data=json.loads(file.read_text())
 if 'visibleText' not in data:continue
 answer=data['visibleText'].split('ChatGPT said:',1)[-1].split('ChatGPT can make mistakes.',1)[0]
 records.append({'id':data['id'],'prompt':data['prompt'],'promptClass':'seeded-comparison' if data['id']=='auto-scheduling' else 'unseeded-product-discovery','file':file.name,'mentionedBrands':[n for n in names if re.search(re.escape(n),answer,re.I)],'cloudMentioned':bool(re.search(r'Cloud\s*Calendars',answer,re.I)),'directSourceUrls':list(dict.fromkeys(x['url'] for x in data['visibleLinks'] if not x['url'].startswith('https://chatgpt.com'))),'limitation':'Mention detection supports manual review; it is not recommendation ranking. Citation popup sources were not expanded.'})
result={'sampleSize':len(records),'independentConversations':True,'backendModel':'not exposed','accountPersonalization':'not controlled','records':records,'notProven':['Representative recommendation share','Stable positions','Search volume','Causal publication improvement']}
(root/'chatgpt-summary.json').write_text(json.dumps(result,indent=2)+'\n')
print('Saved',len(records),'actual consumer observations')
