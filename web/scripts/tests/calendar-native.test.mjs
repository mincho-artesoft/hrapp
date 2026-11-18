import {readFile} from 'node:fs/promises';
import test from 'node:test';
import assert from 'node:assert/strict';
import ts from 'typescript';

async function sourceModule(path) {
  const source = await readFile(new URL(path, import.meta.url), 'utf8');
  const {outputText} = ts.transpileModule(source, {compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}});
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
}
const {webEventDetails,nativeEventDetails,canShareEvent}=await sourceModule('../../src/app/core/calendar-native-model.ts');

const {calendarForecastSeries, appleConditionSymbol} = await sourceModule('../../src/app/core/weatherkit-forecast.ts');
test('WeatherKit timeline keeps wind, hail and sun showers distinct', () => {
  assert.equal(appleConditionSymbol('Windy', true, 'sun.max'), 'wind');
  assert.equal(appleConditionSymbol('Hail', true, 'cloud.sleet'), 'cloud.hail');
  assert.equal(appleConditionSymbol('SunShowers', false, 'cloud.rain'), 'cloud.moon.rain');
  assert.equal(appleConditionSymbol('PartlyCloudy', true, 'cloud.sun'), 'cloud.sun');
});

test('WeatherKit hourly and solar entries follow the selected city across UTC midnight', () => {
  const midnight = '2026-11-17T22:00:00Z';
  const reading = {
    asOf: midnight, forecastStart: midnight, conditionCode: 'PartlyCloudy', daylight: false,
    temperature: 10, temperatureApparent: 8, temperatureDewPoint: 6, humidity: 0.6,
    cloudCover: 0.5, pressure: 1015, windSpeed: 16.09344, windGust: 19, windDirection: 30,
    visibility: 10000, uvIndex: 0, precipitationAmount: 0, precipitationChance: 0.15,
  };
  const day = {
    ...reading, temperatureMax: 15, temperatureMin: 5, maxUvIndex: 3, windSpeedMax: 18,
    sunrise: '2026-11-18T05:22:00Z', moonPhase: 'firstQuarter',
  };
  const forecast = {currentWeather: reading, forecastHourly: {hours: [reading]}, forecastDaily: {days: [day]}};
  const metric = calendarForecastSeries(forecast, 'Europe/Sofia', false);
  assert.equal(metric.current.time, '2026-11-18T00:00');
  assert.deepEqual(metric.daily.time, ['2026-11-18']);
  assert.deepEqual(metric.daily.sunrise, ['2026-11-18T07:22']);
  assert.deepEqual(metric.daily.moonrise, [null]);
  assert.deepEqual(metric.daily.moon_phase, [0.25]);
  assert.deepEqual(metric.hourly.precipitation_probability, [15]);
  const imperial = calendarForecastSeries(forecast, 'Europe/Sofia', true);
  assert.equal(imperial.current.temperature_2m, 50);
  assert.equal(imperial.current.wind_speed_10m, 10);
});

test('native details survive web editing without dropping recurrence or attachments',()=>{
  const native={availability:2,alarms:[{relativeOffset:-900},{relativeOffset:-3600}],recurrenceRules:[{frequency:1,interval:2,daysOfTheWeek:[{weekday:2,weekNumber:0}],occurrenceCount:12}],attachments:[{id:'test',fileName:'notes.txt',contentType:'public.plain-text',dataBase64:'aGVsbG8='}],travelTime:900,attendees:[{email:'test@example.com'}]};
  assert.deepEqual(nativeEventDetails(webEventDetails(native)),native);
  assert.equal(webEventDetails(native).recurrenceRules[0].frequency,'weekly');
  assert.equal(webEventDetails(native).availability,'tentative');
});
test('only owners may expose sharing actions on received data',()=>{
  const event={id:'test',title:'Test',start:'2026-11-17T10:00:00Z',end:'2026-11-17T11:00:00Z'};
  assert.equal(canShareEvent(event),true);
  for(const receivedAccess of ['reader','writer'])assert.equal(canShareEvent({...event,receivedAccess}),false);
  assert.equal(canShareEvent({...event,receivedAccess:'owner'}),true);
  assert.equal(canShareEvent({...event,readOnly:true,receivedAccess:'owner'}),false);
  assert.equal(canShareEvent({...event,sourceKind:'external'}),false);
});

const recurrenceSource=await readFile(new URL('../../src/app/core/calendar-recurrence.ts',import.meta.url),'utf8');
const {createRequire}=await import('node:module');const {pathToFileURL}=await import('node:url');
const require=createRequire(import.meta.url);
const {outputText:recurrenceJS}=ts.transpileModule(recurrenceSource,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}});
const recurrenceModule=recurrenceJS.replace(/import \{ RRule, Weekday \} from ['"]rrule['"];[ \n]*/,`import rrule from '${pathToFileURL(require.resolve('rrule')).href}'; const {RRule,Weekday}=rrule;`);
const {calendarOccurrences,calendarSeries,wallDate,instant}=await import(`data:text/javascript;base64,${Buffer.from(recurrenceModule).toString('base64')}`);
test('recurrence keeps event wall time across daylight-saving changes',()=>{
  const event={id:'series',title:'Standup',start:'2026-03-27T07:00:00Z',end:'2026-03-27T08:00:00Z',details:{timeZone:'Europe/Sofia',recurrenceRules:[{frequency:'daily',interval:1,occurrenceCount:5}]}};
  const values=calendarOccurrences(event,new Date('2026-03-27'),new Date('2026-04-02'));
  assert.equal(values.length,5);assert.equal(values[2].start,'2026-03-29T06:00:00.000Z');
  assert.equal(values[2].occurrenceOf,'series');assert.equal(event.start,'2026-03-27T07:00:00Z');
});
test('monthly recurrence skips dates that do not exist',()=>{
  const event={id:'month',title:'Month end',start:'2026-01-31T10:00:00Z',end:'2026-01-31T11:00:00Z',details:{timeZone:'UTC',recurrenceRules:[{frequency:'monthly',interval:1,occurrenceCount:3}]}};
  const values=calendarOccurrences(event,new Date('2026-01-01'),new Date('2026-07-01'));
  assert.deepEqual(values.map(v=>v.start.slice(0,10)),['2026-01-31','2026-03-31','2026-05-31']);
});
test('all-day recurrence preserves calendar days across DST',()=>{
 const event={id:'day',title:'All day',allDay:true,start:'2026-03-28T22:00:00Z',end:'2026-03-29T21:00:00Z',details:{timeZone:'Europe/Sofia',recurrenceRules:[{frequency:'daily',occurrenceCount:2}]}};
 const values=calendarOccurrences(event,new Date('2026-03-28'),new Date('2026-04-01'));
 assert.equal(values[1].start,'2026-03-29T21:00:00.000Z');assert.equal(values[1].end,'2026-03-30T21:00:00.000Z');
});

test('sharing a later occurrence preserves the series identity and dates',()=>{
  const master={id:'native.calendar.event',title:'Daily',start:'2026-11-17T10:00:00Z',end:'2026-11-17T11:00:00Z',details:{timeZone:'UTC',recurrenceRules:[{frequency:'daily',occurrenceCount:3}]}};
  const later=calendarOccurrences(master,new Date('2026-11-18'),new Date('2026-11-20'))[0];
  assert.notEqual(later.id,master.id);
  assert.deepEqual(calendarSeries(later),master);
});

const {nativeTimelineLayout}=await sourceModule('../../src/app/core/calendar-timeline-layout.ts');
const block=(id,startMinutes,endMinutes)=>({id,startMinutes,endMinutes,data:{title:id}});
test('timeline nests contained events while keeping equal-start siblings side by side',()=>{
 const result=nativeTimelineLayout([block('parent',60,300),block('a',120,180),block('b',120,150)]);
 const parent=result.find(v=>v.id==='parent'),a=result.find(v=>v.id==='a'),b=result.find(v=>v.id==='b');
 assert.equal(parent.depth,0);assert.equal(parent.widthPct,100);assert.equal(parent.contentEndMinutes,120);
 assert.equal(a.depth,1);assert.equal(b.depth,1);assert.ok(a.leftPct+a.widthPct<=b.leftPct);assert.ok(b.leftPct+b.widthPct<=100);
});
test('timeline partial overlaps remain siblings and separated intervals regain full width',()=>{
 const result=nativeTimelineLayout([block('a',0,60),block('b',30,90),block('c',120,180)]);
 assert.ok(result.find(v=>v.id==='a').widthPct<50);assert.equal(result.find(v=>v.id==='b').depth,0);assert.equal(result.find(v=>v.id==='c').widthPct,100);
});
test('event editor converts wall times and rejects daylight-saving gaps',()=>{
 assert.equal(instant(new Date('2026-11-17T09:00:00Z'),'Europe/Sofia').toISOString(),'2026-11-17T07:00:00.000Z');
 assert.equal(instant(new Date('2026-03-29T03:30:00Z'),'Europe/Sofia'),null);
 assert.equal(wallDate(new Date('2026-11-17T07:00:00Z'),'Europe/Sofia').toISOString(),'2026-11-17T09:00:00.000Z');
});
test('custom monthly repeat follows native weekday and set-position fields',()=>{
 const event={id:'last-friday',title:'Review',start:'2026-01-30T10:00:00Z',end:'2026-01-30T11:00:00Z',details:{timeZone:'UTC',recurrenceRules:[{frequency:'monthly',daysOfTheWeek:[{weekday:6}],setPositions:[-1],occurrenceCount:3}]}};
 assert.deepEqual(calendarOccurrences(event,new Date('2026-01-01'),new Date('2026-04-01')).map(v=>v.start.slice(0,10)),['2026-01-30','2026-02-27','2026-03-27']);
});

const {timelinePlacement, minuteOnDay, timelineDay} = await sourceModule('../../src/app/core/calendar-timeline-gesture.ts');

test('timeline creation is one hour, centered on the pointer, in the destination column', () => {
  const day = new Date(2026, 10, 17), next = timelineDay(day, 1);
  const original = {start: +day, end: +next, allDay: true};
  const created = timelinePlacement('create', original, day, next, 567 - 30, false);
  assert.equal(created.start, +new Date(2026, 10, 18, 9));
  assert.equal(created.end, +new Date(2026, 10, 18, 10));
  assert.equal(timelinePlacement('create', original, day, next, 1430, false).end, +timelineDay(next, 1));
  assert.deepEqual(timelinePlacement('create', original, day, next, 0, true), {start:+next, end:+timelineDay(next,1), allDay:true});
});

test('moving an overnight event by its continuation preserves the whole interval', () => {
  const start = new Date(2026, 10, 17, 23), end = new Date(2026, 10, 18, 2);
  const day = timelineDay(end), target = timelineDay(day, 1);
  const original = {start:+start, end:+end, allDay:false};
  const moved = timelinePlacement('move', original, day, target, 0, false);
  assert.equal(moved.start, +new Date(2026, 10, 18, 23));
  assert.equal(moved.end, +new Date(2026, 10, 19, 2));
  const allDay = timelinePlacement('move', original, day, target, 0, true);
  assert.equal(allDay.start, +day);
  assert.equal(allDay.end, +timelineDay(day, 2));
  assert.equal(timelinePlacement('move', allDay, day, target, 600, false).end, +new Date(2026, 10, 19, 11));
  assert.equal(timelinePlacement('resize-end', original, day, target, 80, false).start, +start);
  assert.deepEqual(timelinePlacement('resize-start', original, day, target, 0, false), original);
  assert.equal(timelinePlacement('resize-start', original, day, target, 0, true), null);
  assert.equal(minuteOnDay(+timelineDay(day, 1), day), 1440);
});
