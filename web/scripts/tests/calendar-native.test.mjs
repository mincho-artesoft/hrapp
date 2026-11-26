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
const {bookingStatus, slotStatus} = await sourceModule('../../src/app/core/booking-status.ts');
test('booking markers follow the occurrence status and ignore legacy calendar colors', () => {
  const slot = {id: 'slot', end: '2099-01-01T11:00:00Z'};
  const calendar = {color: '#123456', requests: []};
  assert.equal(new Set(Object.values(bookingStatus).map(s => s.color)).size, 5);
  assert.equal(slotStatus(calendar, slot), 'available');
  const request = {...slot, slotId: slot.id, status: 'pending'};
  calendar.requests.push(request);
  assert.equal(slotStatus(calendar, slot), 'pending');
  request.status = 'accepted';
  assert.equal(slotStatus(calendar, slot), 'accepted');
  assert.equal(slotStatus(calendar, {...slot, rule: {frequency: 0}}), 'available');
  request.status = 'declined';
  assert.equal(slotStatus(calendar, slot), 'available');
  calendar.requests.push({...slot, slotId: slot.id, status: 'accepted'});
  assert.equal(slotStatus(calendar, slot), 'accepted');
  assert.equal(slotStatus(calendar, {...slot, end: '2099-02-01T11:00:00Z'}), 'available');
  assert.equal(slotStatus(calendar, {id: 'expired', end: '2000-01-01T11:00:00Z'}), 'past');
});
test('recurring bookings retain the server occurrence ID for fractional-second starts', () => {
  const start = '2026-10-24T06:00:00.275Z';
  const next = '2026-10-25T07:00:00.275Z';
  const slot = {id: 'slot', title: '', start, end: '2026-10-24T07:00:00.275Z',
    details: {timeZone: 'Europe/Sofia', recurrenceRules: [{frequency: 'daily', occurrenceCount: 2}]}};
  const occurrences = calendarOccurrences(slot, new Date('2026-10-24'), new Date('2026-10-26'));
  assert.deepEqual(occurrences.map(o => o.id), ['slot', 'slot@' + Date.parse(next)]);
  assert.deepEqual(occurrences.map(o => o.start), [start, next]);
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

const {forecastGrid, gridCoversViewport, gridCoordinates, makeMapField, mapFrame, mapReading, mapColor, worldY, latitudeAt} =
  await sourceModule('../../src/app/core/weather-map-field.ts');
test('wind map interpolates WeatherKit vectors, temperatures and the local timeline across the date line', () => {
  const now = Date.UTC(2026, 10, 19, 13, 25);
  const hour = Math.floor(now / 3_600_000) * 3_600_000;
  const grid = forecastGrid({x: 0.99, y: worldY(44), width: 0.02, height: worldY(40) - worldY(44)}, 3);
  const coordinates = gridCoordinates(grid);
  assert.equal(coordinates.length, 9);
  assert.ok(coordinates.some(p => p.longitude < 0) && coordinates.some(p => p.longitude > 0));
  const points = coordinates.map(() => Array.from({length: 20}, (_, i) => ({
    forecastStart: new Date(hour + (i - 5) * 3_600_000).toISOString(),
    windSpeed: 36, windDirection: i % 2 ? 350 : 10, temperature: i
  })));
  const field = makeMapField(grid, points, now);
  assert.equal(field.dates.length, 17);
  assert.equal(field.dates[4], hour);
  const wind = mapReading(grid, mapFrame(field, 4.5), grid.latitude, 179.7);
  assert.ok(Math.abs(wind.east) < 1e-8);
  assert.ok(wind.north < -9, 'a northerly wind travels south');
  assert.equal(wind.temperature, 5.5);
  assert.equal(mapReading(grid, field.frames[0], 0, 0), undefined);
  assert.deepEqual(mapColor(25, 'wind'), [10,148,186]);
  assert.deepEqual(mapColor(55, 'temperature'), [107,8,28]);
  assert.ok(Math.abs(latitudeAt(worldY(70)) - 70) < 1e-8);
});

test('preview and fullscreen forecast grids cover every visible edge after resize, pan and zoom', () => {
  for (const [latitude, longitude, width, height] of [
    [42.7, 23.3, 0.04, 0.019], [42.7, 23.3, 0.11, 0.03], [68, 179.8, 0.2, 0.6], [0, -179.8, 1, 1]
  ]) {
    const view = {x: longitude / 360 + 0.5 - width / 2, y: Math.min(1 - height, Math.max(0, worldY(latitude) - height / 2)), width, height};
    for (const side of [3, 7]) {
      const grid = forecastGrid(view, side);
      assert.equal(grid.side, side);
      assert.ok(gridCoversViewport(grid, view));
      const frame = Array(side ** 2).fill({east: 1, north: 2, temperature: 12});
      for (const fx of [0, 0.25, 0.5, 0.75, 1]) {
        for (const fy of [0, 0.5, 1]) {
          assert.ok(mapReading(grid, frame, latitudeAt(view.y + height * fy), (view.x + width * fx) * 360 - 180));
        }
      }
      if (width < 0.5) assert.equal(gridCoversViewport(grid, {...view, x: view.x + 0.5}), false);
    }
  }
});

test('the lunar calendar keeps the native phase boundaries and advances past an exact new or full moon', async () => {
  const {lunarFraction, lunarIllumination, moonPhaseInfo, nextLunarEvent} = await sourceModule('../../src/app/core/weather-moon.ts');
  const reference = 947182440000;
  const period = 29.530588853 * 86400000;
  assert.equal(lunarIllumination(reference), 0);
  assert.equal(lunarIllumination(reference + period / 2), 1);
  assert.equal(moonPhaseInfo(lunarFraction(reference - period / 8)).name, 'Waning Crescent');
  assert.equal(moonPhaseInfo(0.0625).name, 'Waxing Crescent');
  assert.equal(moonPhaseInfo(0.9375).name, 'New Moon');
  assert.equal(moonPhaseInfo(null), undefined);
  for (const phase of [0, 0.5]) {
    const event = nextLunarEvent(Date.UTC(2026, 10, 19), phase);
    assert.equal(nextLunarEvent(event - 1, phase), event);
    assert.ok(Math.abs(nextLunarEvent(event, phase) - event - period) < 1);
  }
});

test('weather details use each metric, preserve local time gaps and exclude the following day from daily totals', async () => {
  const {weatherChart}=await sourceModule('../../src/app/core/weather-detail-chart.ts');
  const day='2026-10-25';
  // In Sofia the 03:00 hour repeats when daylight-saving time ends.
  const start=Date.parse('2026-10-24T21:00Z');
  const times=['00','01','02','03','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','00'];
  const hours=times.map((h,i)=>({iso:(i===25?'2026-10-26':day)+'T'+h+':00', instant:new Date(start+i*3600000).toISOString(),wind:10,gust:21,temperature:12,feelsLike:8,precipitation:25.4,snowfall:2.54,precipitationChance:40,humidity:55,pressure:1000,visibility:5,uv:3}));
  const snapshot={windUnit:'mph',visibilityUnit:'mi',daily:[{iso:day,instant:hours[0].instant},{iso:'2026-10-26',instant:hours[25].instant}],forecastHours:hours};
  const chart=(metric,feels=false)=>weatherChart(snapshot,day,metric,feels);
  assert.deepEqual([chart('temp').max,chart('temp',true).max],[12,8]);
  assert.deepEqual(chart('wind').points.slice(3,5).map(p=>p.x),[12,16]);
  assert.equal(chart('wind').extra[0].value,21);
  assert.equal(chart('temp').points.at(-1).x,100);
  assert.equal(chart('precip').points.length,25);
  assert.equal(chart('precip').points[0].value,1);
  assert.equal(chart('precip').extra[0].value,.1);
  assert.equal(chart('chance').unit,'%');assert.equal(chart('chance').max,40);
  assert.equal(chart('pressure').unit,'inHg');assert.ok(Math.abs(chart('pressure').avg-29.53)<1e-8);
  assert.equal(chart('humidity').high,100);assert.equal(chart('uv').high,12);assert.equal(chart('visibility').unit,'mi');
  hours.splice(5,2);
  assert.equal(chart('temp').paths.length,2);
  assert.equal(weatherChart(snapshot,'2026-10-28','temp'),null);
});

const {calendarDateChoices, calendarDateFormatter, calendarWeekStart, systemWeekStart, calendarHourCycle} =
  await sourceModule('../../src/app/core/calendar-format-preferences.ts');

test('date picker exposes every iOS date format in order and applies it to event dates', () => {
  const date = new Date('2026-12-31T13:45:00Z');
  const labels = calendarDateChoices.map(preference => calendarDateFormatter('en-US', preference, {timeZone: 'UTC'})(date));
  assert.deepEqual(labels, [
    new Intl.DateTimeFormat(undefined, {dateStyle: 'short', timeZone: 'UTC'}).format(date),
    'Dec 31, 2026', 'December 31, 2026', 'Thursday, December 31, 2026',
    '31/12/2026', '12/31/2026', '2026-12-31', '31.12.2026', '12.31.2026', '2026.12.31',
    '31-12-2026', '12-31-2026', '2026/12/31', '31 Dec 2026', 'Dec 31, 2026', '2026 Dec 31',
    '31 December 2026', 'December 31, 2026', '2026 December 31',
  ]);
  assert.equal(calendarDateFormatter('en-US', 'yearMonthDayDot', {timeZone: 'Asia/Tokyo'})(Date.parse('2026-12-31T23:00Z')), '2027.01.01');
  assert.equal(calendarDateFormatter('en-US', 'yearMonthDayDot', {includeYear: false, weekday: 'short', timeZone: 'UTC'})(date), 'Thu, 12.31');
});

test('first weekday and clock settings preserve explicit choices and follow the browser in System mode', () => {
  assert.deepEqual(Array.from({length: 7}, (_, day) => calendarWeekStart(String(day))), [0,1,2,3,4,5,6]);
  assert.equal(systemWeekStart('en-US'), 0);
  assert.equal(systemWeekStart('bg-BG'), 1);
  assert.equal(systemWeekStart('ar-EG'), 6);
  assert.equal(calendarWeekStart('system'), systemWeekStart());
  assert.equal(calendarWeekStart(), systemWeekStart());
  assert.equal(calendarHourCycle('12'), 'h12');
  assert.equal(calendarHourCycle('24'), 'h23');
  assert.equal(calendarHourCycle('system'), new Intl.DateTimeFormat(undefined, {hour:'numeric'}).resolvedOptions().hour12 ? 'h12' : 'h23');
});
