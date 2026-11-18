/** Payload parity with native/Mac/MacCalendarProviderEventWire.swift. */
export function providerDate(iso:string,zone='UTC'):string {
 const parts=new Intl.DateTimeFormat('en-CA',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date(iso));
 return ['year','month','day'].map(k=>parts.find(p=>p.type===k)!.value).join('-');
}
export function providerInstant(day:string,zone='UTC'):string {
 const wall=Date.parse(day+'T00:00:00Z');let result=wall;
 for(let i=0;i<4;i++){
  const parts=new Intl.DateTimeFormat('en-CA',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(new Date(result));
  const n=(k:string)=>Number(parts.find(p=>p.type===k)?.value);
  const delta=wall-Date.UTC(n('year'),n('month')-1,n('day'),n('hour'),n('minute'),n('second'));if(!delta)return new Date(result).toISOString();result+=delta;
 }
 throw new Error('Invalid calendar day.');
}
export function providerRecurrence(rules:any[],google:boolean,start:string,zone='UTC'):any {
 const fail=()=>{throw new Error('This repeat pattern is not supported by the selected calendar provider.');};
 if(!Array.isArray(rules)||rules.length>10)return fail();
 if(!rules.length)return google?[]:null;
 const frequencies=['daily','weekly','monthly','yearly'],weekdays=['','sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
 const validated=rules.map(r=>{
  const f=typeof r.frequency==='number'?r.frequency:frequencies.indexOf(r.frequency);const interval=r.interval??1;
  if(f<0||f>3||!Number.isInteger(interval)||interval<1||interval>999)return fail();
  const days=r.daysOfTheWeek??[];if(!Array.isArray(days)||!days.every((d:any)=>Number.isInteger(d.weekday)&&d.weekday>=1&&d.weekday<=7&&Number.isInteger(d.weekNumber??0)&&Math.abs(d.weekNumber??0)<=53))return fail();
  for(const [field,max] of [['daysOfTheMonth',31],['monthsOfTheYear',12],['weeksOfTheYear',53],['daysOfTheYear',366],['setPositions',366]] as const){const a=r[field]??[];if(!Array.isArray(a)||a.length>366||!a.every((v:any)=>Number.isInteger(v)&&v!==0&&Math.abs(v)<=max&&(field!=='monthsOfTheYear'||v>0)))return fail();}
  if(r.occurrenceCount!==undefined&&(!Number.isInteger(r.occurrenceCount)||r.occurrenceCount<1))return fail();
  if(r.endDate&&!Number.isFinite(Date.parse(r.endDate)))return fail();
  return {...r,f,interval,days};
 });
 if(google)return validated.map(r=>{
  const parts=['FREQ='+frequencies[r.f].toUpperCase(),'INTERVAL='+r.interval];
  if(r.days.length)parts.push('BYDAY='+r.days.map((d:any)=>(d.weekNumber||'')+['','SU','MO','TU','WE','TH','FR','SA'][d.weekday]).join(','));
  for(const [key,field] of [['BYMONTHDAY','daysOfTheMonth'],['BYMONTH','monthsOfTheYear'],['BYWEEKNO','weeksOfTheYear'],['BYYEARDAY','daysOfTheYear'],['BYSETPOS','setPositions']])if(r[field]?.length)parts.push(key+'='+r[field].join(','));
  if(r.occurrenceCount)parts.push('COUNT='+r.occurrenceCount);else if(r.endDate)parts.push('UNTIL='+new Date(r.endDate).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,''));
  return 'RRULE:'+parts.join(';');
 });
 if(validated.length!==1)return fail();const r=validated[0],date=providerDate(start,zone),day=Number(date.slice(8)),month=Number(date.slice(5,7)),weekday=new Date(date+'T12:00:00Z').getUTCDay()+1;
 if(r.weeksOfTheYear?.length||r.daysOfTheYear?.length||(r.daysOfTheMonth?.length??0)>1||(r.monthsOfTheYear?.length??0)>1)return fail();
 const pattern:any={interval:r.interval};
 if(r.f===0)pattern.type='daily';else if(r.f===1){pattern.type='weekly';pattern.firstDayOfWeek='sunday';pattern.daysOfWeek=r.days.length?r.days.map((d:any)=>weekdays[d.weekday]):[weekdays[weekday]];}
 else {const yearly=r.f===3;if(yearly)pattern.month=r.monthsOfTheYear?.[0]??month;
  if(!r.days.length){pattern.type=yearly?'absoluteYearly':'absoluteMonthly';pattern.dayOfMonth=r.daysOfTheMonth?.[0]??day;if(pattern.dayOfMonth<1)return fail();}
  else{pattern.type=yearly?'relativeYearly':'relativeMonthly';pattern.daysOfWeek=r.days.map((d:any)=>weekdays[d.weekday]);const positions=[...new Set([...r.days.map((d:any)=>d.weekNumber).filter(Boolean),...(r.setPositions??[])])];const index=({1:'first',2:'second',3:'third',4:'fourth','-1':'last'} as any)[positions[0] as any];if(positions.length!==1||!index)return fail();pattern.index=index;}
 }
 const range:any={startDate:date,recurrenceTimeZone:zone};if(r.occurrenceCount){range.type='numbered';range.numberOfOccurrences=r.occurrenceCount;}else if(r.endDate){range.type='endDate';range.endDate=providerDate(r.endDate,zone);}else range.type='noEnd';return {pattern,range};
}
