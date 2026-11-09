"""Summarise saved consumer-UI observations, not API responses or inferred ranks."""
from pathlib import Path
import json,re
root=Path(__file__).resolve().parent
patterns={
 'Weather Events':(r'(?:Weather Events\s*[—–-]\s*for Calendar|Weather Events\s*\(by Dejal\)|\bWeather Events\b(?!\s+in\b)(?!\s+can\b))',0),
 'Dejal':(r'\bDejal\b',re.I),
 'Skylight':(r'\bSkylight\b',re.I),
 'Hearth':(r'\bHearth\b',re.I),
 'DAKboard':(r'\bDAKboard\b',re.I),
 'gtsync':(r'\bgtsync\b',re.I),
 'SyncBridge':(r'\bSyncBridge\b',re.I),
 'Cloud Calendars':(r'(?<![iI])(?<!iCloud\s)\bCloud\s+Calendars\b',re.I),
 'Fantastical':(r'\bFantastical\b',re.I),
 'Calendars by Readdle':(r'\bCalendars\s+by\s+Readdle\b|\bReaddle\s+Calendars\b',re.I),
 'Calendar 366':(r'\bCalendar\s+366\b',re.I),
 'WeekCal':(r'\bWeekCal\b',re.I),
 'easyDays':(r'\beasyDays\b',re.I),
 'Apple Calendar':(r'\bApple\s+Calendar\b',re.I),
 'Google Calendar':(r'\bGoogle\s+Calendar\b',re.I),
 'Outlook':(r'\bOutlook\b',re.I),
 'OneCal':(r'\bOneCal\b(?!endar)',re.I),
 'CalendarBridge':(r'\bCalendarBridge\b',re.I),
 'Supershift':(r'\bSupershift\b',re.I),
 'My Shift Planner':(r'\bMy\s*Shift\s*Planner\b',re.I),
 'TimeTree':(r'\bTimeTree\b',re.I),
 'Cozi':(r'\bCozi\b',re.I),
 'FamilyWall':(r'\bFamilyWall\b',re.I),
 'Howbout':(r'\bHowbout\b',re.I),
 'Structured':(r'\bStructured\b',re.I),
 'Motion':(r'\bMotion\b',re.I),
 'Morgen':(r'\bMorgen\b',re.I),
 'Tiimo':(r'\bTiimo\b',re.I),
 'Amie':(r'\bAmie\b',re.I),
 'Notion Calendar':(r'\bNotion\s+Calendar\b',re.I),
 'Timepage':(r'\bTimepage\b',re.I),
 'FlowSavvy':(r'\bFlowSavvy\b',re.I),
 'Reclaim':(r'\bReclaim(?:\.ai)?\b',re.I),
 'SkedPal':(r'\bSkedPal\b',re.I),
 'Sunsama':(r'\bSunsama\b',re.I),
 'BusyCal':(r'\bBusyCal\b',re.I),
 'TickTick':(r'\bTickTick\b',re.I),
 'OneCalendar':(r'\bOneCalendar\b',re.I),
}
records=[]
for file in sorted(root.glob('chatgpt-*.json')):
 data=json.loads(file.read_text())
 if 'visibleText' not in data:continue
 answer=data['visibleText'].split('ChatGPT said:',1)[-1].split('ChatGPT can make mistakes.',1)[0]
 mentioned=[n for n,(pat,fl) in patterns.items() if re.search(pat,answer,fl)]
 records.append({'id':data['id'],'prompt':data['prompt'],'promptClass':'seeded-comparison' if data['id']=='auto-scheduling' else 'unseeded-product-discovery','file':file.name,'mentionedBrands':mentioned,'cloudMentioned':'Cloud Calendars' in mentioned,'directSourceUrls':list(dict.fromkeys(x['url'] for x in data['visibleLinks'] if not x['url'].startswith('https://chatgpt.com'))),'limitation':'Mention detection supports manual review; it is not recommendation ranking. Citation popup sources were not expanded.'})
result={'sampleSize':len(records),'independentConversations':True,'backendModel':'not exposed','accountPersonalization':'not controlled','records':records,'notProven':['Representative recommendation share','Stable positions','Search volume','Causal publication improvement']}
(root/'chatgpt-summary.json').write_text(json.dumps(result,indent=2)+'\n')
print('Saved',len(records),'actual consumer observations')
