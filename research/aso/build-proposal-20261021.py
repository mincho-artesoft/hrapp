import json,pathlib,datetime
p=pathlib.Path(__file__).parent
snap=json.loads((p/'asc-readonly-snapshot-20261021.json').read_text())
def field(value,limit):
 return {'value':value,'characters':len(value),'utf8Bytes':len(value.encode()),'limit':limit,'valid':len(value)<=limit and (limit!=100 or len(value.encode())<=100)}
name='Cloud Calendars: Sync & Widget'
subtitle='Google, Microsoft & iCloud'
keywords='weather,schedule,planner,agenda,forecast,month,week,reminder,event,meeting,shared,invite,appointment'
promo='Plan with your calendars and weather together. Explore Home Screen widgets, flexible calendar views and local calendars you can start without an account.'
description='''Bring your calendars and weather into one planning app for iPhone and iPad. See work and personal plans together, check the forecast and choose a calendar view that fits your day.

YOUR CALENDARS, TOGETHER
Use iCloud calendars and connect Google Calendar. Premium adds Microsoft Calendar support. Or start with a local calendar on your device without creating an account. Connecting providers and sharing require sign-in where applicable.

A VIEW FOR EVERY PLAN
Switch between Day, Week, Month, Year and List views. Use multiple calendars to keep different parts of your schedule visible in one place.

WEATHER WHILE YOU PLAN
Check weather forecasts alongside your plans, explore detailed weather views and use the interactive weather map with wind and temperature layers. Forecast availability depends on your location and the weather provider.

HOME SCREEN WIDGETS
See calendar information and weather from your Home Screen, with small, medium and large widget options.

MEETINGS AND SHARING
Use Google Meet support with Google Calendar. Premium adds Microsoft Teams support. Share events and calendars, and send invitations by email, QR code or App Clip. Sharing access depends on the calendar and invitation type.

CHOOSE YOUR PLAN
The free Base plan includes Google Calendar sync, Google Meet support, multiple calendar views, weather and widgets.
Advanced includes Base features and removes ads.
Premium includes Advanced features and adds Microsoft Calendar and Microsoft Teams support.

Cloud Calendars is free to download with optional auto-renewing subscriptions. Check current local prices in the app or App Store. Payment is charged to your Apple ID account at purchase confirmation. Subscriptions renew automatically unless canceled at least 24 hours before the current period ends. Your account is charged for renewal within 24 hours before that period ends. Manage or cancel subscriptions in your App Store account settings.

Privacy Policy: https://www.cloud-calendars.com/privacy-policy
Terms of Use: https://www.apple.com/legal/internet-services/itunes/dev/stdeula/'''
proposal={
 'date':'2026-10-21','status':'proposal_only_not_applied','appId':'6744690319','identityDecision':'Retain current exact app name. No bundle/display-name or native changes.',
 'target':{'version':'1.7.4','state':'PREPARE_FOR_SUBMISSION','locale':'en-US','otherEnglishLocales':'en-CA, en-GB and en-AU may reuse keyword allocation after locale spelling review; no automatic locale writes.'},
 'fields':{'name':field(name,30),'subtitle':field(subtitle,30),'keywords':field(keywords,100),'promotionalText':field(promo,170),'description':field(description,4000)},
 'allocation':[
  {'field':'name','tokens':['cloud','calendars','sync','widget'],'purpose':'Retain identity and existing sync/widget positioning.'},
  {'field':'subtitle','tokens':['Google','Microsoft','iCloud'],'purpose':'Preserve visible provider relevance; remove repeated sync. Supported integrations, not an affiliation claim. Existing subtitle already uses these names.'},
  {'field':'keywords','tokens':keywords.split(','),'purpose':'Calendar planning, weather, views, reminders, event sharing and meetings. Deliberately exactly 100 ASCII bytes; no competing app names.'}
 ],
 'changesFromCurrent':[
  'Name unchanged. Subtitle drops repeated sync and uses an ampersand; no measured performance benefit is claimed.',
  'Keep weather, schedule, planner, agenda, forecast, month, week and reminder.',
  'Remove day planner because planner is already present; this does not assert how Apple combines every query token.',
  'Remove sync because name contains it. Remove lock/screen until standalone Lock Screen widget support is verified; Live Activity support alone is not that claim.',
  'Replace broad rain/today terms with event, meeting, shared, invite and appointment to test stronger calendar intent. This is editorial prioritization, not volume/rank evidence.',
  'Description distinguishes free Google and paid Microsoft features, replaces instant widget wording, and qualifies sign-in and sharing requirements.',
  'Draft 1.7.4 currently has null promotionalText and whatsNew. Proposed promotional text is evergreen. What is New must come from actual 1.7.4 release scope, not this ASO exercise.'
 ],
 'evidence':{
  'currentMetadata':'asc-readonly-snapshot-20261021.json',
  'product':'../product-facts.json: platforms, views, google, premium, advanced, local, weather, widgets, sharing, accounts; public 1.7.3 confirms weather map.',
  'competitors':'../competitors/primary-page-review-20261021-batch01.json and ../competitors/intent-clusters-20261021-batch01.json; language/intent inspiration only, no app ranking or volumes.',
  'appleProductPage':'https://developer.apple.com/app-store/product-page/',
  'appleFieldReference':'https://developer.apple.com/help/app-store-connect/reference/app-information/platform-version-information/'
 },
 'claimGates':[
  'Tier statements are supported by inspected local source and partly current public copy, not a runtime purchase test. Release owner should confirm they match build 1.7.4 before submission.',
  'No promise of universal Exchange support, cloud-to-cloud event transfer, conflict resolution, AI planning, task management, always-live widgets or server-free sharing.',
  'No changes to privacy declarations. Existing Data Not Collected versus policy/server-processing discrepancy requires separate review.',
  'App description is rewritten for clarity/conversion; do not promise an App Store ranking boost from keyword repetition in it.'
 ],
 'measurement':{'rank':None,'searchVolume':None,'chatgptCitationEvidence':None,'plan':'Capture release timestamp and unchanged/control metadata, then compare App Store Search impressions, product-page views and first-time downloads by territory/device over comparable 28-day periods, accounting for version changes, seasonality and traffic source. No causal lift claim from an uncontrolled before/after comparison.'}
}
assert all(x['valid'] for x in proposal['fields'].values())
(p/'english-proposal-20261021.json').write_text(json.dumps(proposal,indent=2,ensure_ascii=False)+'\n')
(p/'english-description-proposed-20261021.txt').write_text(description+'\n')
summary={
 'date':'2026-10-21','scope':'Authenticated metadata read and English proposal only. No ASC write, submission, deployment, native edit or simulator action.',
 'access':{'status':'success','mechanism':'Established tools/asc_report.py token/get helpers; credentials not printed or copied. GET only.','snapshot':'asc-readonly-snapshot-20261021.json','retrievedAt':snap['retrievedAt']},
 'currentPublic':{'source':'https://apps.apple.com/us/app/cloud-calendars-sync-widget/id6744690319','storefront':'US','version':'1.7.3','releaseDisplay':'Oct 4','rating':4.5,'ratingCount':12,'sizeMB':49.8,'qualification':'Public page retrieved 2026-10-21. Volatile values should not become evergreen copy.'},
 'currentAsc':{'liveVersion':'1.7.3','liveState':'READY_FOR_SALE','editableVersion':'1.7.4','editableState':'PREPARE_FOR_SUBMISSION','note':'Historical versions also report READY_FOR_SALE; newest public page plus version order identify current live version. Do not classify every READY_FOR_SALE row as a separate current release.','appInfoStates':[i['attributes']['appStoreState'] for i in snap['appInfos']]},
 'englishCurrent':[],
 'findings':[
  {'priority':'high','issue':'Saved product-facts public snapshot is stale','detail':'Fresh public and authenticated reads identify live 1.7.3; existing 1.7.2/11 ratings/45.5 MB snapshot is historical.'},
  {'priority':'high','issue':'Historical local metadata document is not current ASC','detail':'Current ASC English keywords differ substantially, four English locales exist, public page lists 46 languages, and provider-specific integration code is documented in product-facts. Do not apply old EventKit-only or seven-language assumptions.'},
  {'priority':'medium','issue':'Repeated keyword budget and uncertain lock screen intent','detail':'Current list contains planner and day planner, plus sync repeated in title and subtitle. Product facts substantiate Home Screen widgets and Live Activities, not a standalone Lock Screen widget.'},
  {'priority':'medium','issue':'Conversion copy lacks paid tier clarity','detail':'Current description lists the Free Plan but omits Advanced/Premium explanations despite foregrounding Microsoft support.'},
  {'priority':'medium','issue':'Draft promotional and release notes are blank','detail':'1.7.4 English promotionalText and whatsNew are null. Fill promotional copy deliberately and use actual release changes for release notes.'},
  {'priority':'medium','issue':'Support URL uses homepage','detail':'All English current/draft metadata points supportUrl and marketingUrl to https://www.cloud-calendars.com/. Support destination must offer actual contact information. Verify rendered website before changing it.'},
  {'priority':'separate_review','issue':'Privacy declaration discrepancy','detail':'Carry forward product-facts privacy concern; ASO changes do not resolve legal or data-flow declarations.'}
 ],
 'limits':{'name':30,'subtitle':30,'keywords':100,'note':'Apple product-page guide describes 100 keyword characters; platform reference describes 100 bytes. Proposed English is ASCII and meets both. Do not repeat historical assertion that all non-Latin locales carry no byte penalty without validation.'},
 'notDone':['No keyword popularity or rank measurement','No analytics report creation or performance-data extraction','No screenshot visual audit','No locale translation rollout','No ASC mutation'],
 'sources':['https://apps.apple.com/us/app/cloud-calendars-sync-widget/id6744690319','https://developer.apple.com/app-store/product-page/','https://developer.apple.com/help/app-store-connect/reference/app-information/platform-version-information/','../product-facts.json','../competitors/primary-page-review-20261021-batch01.json','../competitors/intent-clusters-20261021-batch01.json']
}
for v in snap['versions']:
 if v['attributes']['versionString'] in ['1.7.3','1.7.4']:
  for l in v['localizations']:
   a=l['attributes']
   if a['locale'].startswith('en'):
    summary['englishCurrent'].append({'version':v['attributes']['versionString'],'locale':a['locale'],'name':field(name,30),'subtitle':field('Google, Microsoft, iCloud sync',30),'keywords':field(a['keywords'],100),'promotionalText':a['promotionalText'],'whatsNew':a['whatsNew']})
(p/'audit-20261021.json').write_text(json.dumps(summary,indent=2,ensure_ascii=False)+'\n')
print(json.dumps({k:{'characters':v['characters'],'utf8Bytes':v['utf8Bytes'],'valid':v['valid']} for k,v in proposal['fields'].items()},indent=2))
