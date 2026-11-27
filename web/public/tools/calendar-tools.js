'use strict';
// Calendar inputs are local to this page. Do not put their values in URLs or telemetry.
(() => {
  const el = id => document.getElementById(id);
  const stamp = date => date.toISOString().slice(0,19).replace(/[-:]/g,'')+'Z';
  const dateKey = date => date.toISOString().slice(0,10).replace(/-/g,'');
  const today = new Date();
  const localDate = [today.getFullYear(), String(today.getMonth()+1).padStart(2,'0'), String(today.getDate()).padStart(2,'0')].join('-');
  for (const input of document.querySelectorAll('input[type=date]')) input.value = localDate;
  for (const input of document.querySelectorAll('input[type=datetime-local]')) input.value = localDate+'T15:00';
  if (el('acEnd')) el('acEnd').value = localDate+'T16:00';
  const listen = (ids,run) => { for (const id of ids) el(id).addEventListener('input',run); run(); };
  const escapeText = value => value.replaceAll('\\','\\\\').replace(/\r\n|\r|\n/g,'\\n').replaceAll(';','\\;').replaceAll(',','\\,');
  function fold(line) {
    let out='', length=0;
    for(const char of line){const size=new TextEncoder().encode(char).length;if(length+size>75){out+='\r\n ';length=1;}out+=char;length+=size;}
    return out;
  }
  function calendar(lines){return ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Arte Soft//Cloud Calendars Tools//EN',...lines,'END:VCALENDAR'].map(fold).join('\r\n')+'\r\n';}
  function event(id,lines){return ['BEGIN:VEVENT','UID:'+id+'@cloud-calendars.com','DTSTAMP:'+stamp(new Date()),...lines,'END:VEVENT'];}
  function download(anchor,content,name) {
    if(anchor.href.startsWith('blob:')) URL.revokeObjectURL(anchor.href);
    anchor.href=URL.createObjectURL(new Blob([content],{type:'text/calendar;charset=utf-8'}));
    anchor.download=name;anchor.hidden=false;
  }
  function note(panel){const out=document.createElement('output');out.setAttribute('aria-live','polite');panel.append(out);return out;}
  function addDate(date,days){const next=new Date(date);next.setUTCDate(next.getUTCDate()+days);return next;}

  if(el('shBtn')){
    const generate=()=>{
      const link=el('shDl'),out=el('shPreview'),timed=el('shType').value==='timed';
      el('shHours').hidden=!timed; link.hidden=true;
      const base=new Date(el('shStart').value+'T00:00:00Z'),from=el('shFrom').value,to=el('shTo').value;
      if(isNaN(base)||(timed&&(!from||!to))){out.textContent='Choose a date and both handover times.';return;}
      const pattern=el('shPat').value.split(',').map(Number),lines=[],preview=[];
      let count=0;
      for(let i=0;i<90;i++){
        if(!pattern[i%pattern.length])continue;
        const day=addDate(base,i),ds=dateKey(day),end=dateKey(addDate(day,to<=from?1:0));
        const times=timed?['DTSTART:'+ds+'T'+from.replace(':','')+'00','DTEND:'+end+'T'+to.replace(':','')+'00']:['DTSTART;VALUE=DATE:'+ds,'DTEND;VALUE=DATE:'+dateKey(addDate(day,1))];
        lines.push(...event('shift-'+ds,times.concat('SUMMARY:On Shift')));
        if(count++<3)preview.push(day.toISOString().slice(0,10));
      }
      out.textContent=count+' duty starts in 90 days. First three: '+preview.join(', ')+'.';
      download(link,calendar(lines),'shift-roster-90d.ics');
    };
    for(const id of ['shStart','shPat','shFrom','shTo','shType']) el(id).oninput=()=>{el('shHours').hidden=el('shType').value!=='timed';el('shPreview').textContent='';el('shDl').hidden=true;};
    el('shBtn').onclick=generate;
  }
  const unfold=text=>text.replace(/\r\n?/g,'\n').replace(/\n[ \t]/g,'').split('\n');
  function components(lines,type){
    const groups=[];let part=null;
    for(const line of lines){if(line.toUpperCase()==='BEGIN:'+type)part=[];if(part)part.push(line);if(part&&line.toUpperCase()==='END:'+type){groups.push(part);part=null;}}
    return groups;
  }
  function prop(lines,key){const line=lines.find(s=>s.toUpperCase().startsWith(key+':')||s.toUpperCase().startsWith(key+';'));return line?line.slice(line.indexOf(':')+1):'';}
  if(el('icsBtn')){
    const parse=()=>{
      const raw=unfold(el('icsRaw').value),events=components(raw,'VEVENT'),out=el('icsOut'),warn=[];
      for(const line of ['BEGIN:VCALENDAR','VERSION:2.0','END:VCALENDAR']) if(!raw.includes(line))warn.push('Missing '+line);
      if(!prop(raw,'PRODID')) warn.push('Missing PRODID');
      if(raw.filter(l=>l.toUpperCase()==='BEGIN:VEVENT').length!==events.length)warn.push('Unclosed event');
      events.forEach((ev,i)=>{for(const key of ['UID','DTSTART','DTSTAMP']) if(!prop(ev,key))warn.push('Event '+(i+1)+' has no '+key);});
      out.replaceChildren();const status=document.createElement('p');status.textContent=warn.length?warn.join(' · '):'Basic structure checks passed. Events: '+events.length;out.append(status);
      if(!events.length)return;
      const table=document.createElement('table'),head=table.createTHead().insertRow();
      for(const v of ['Summary','Start','End','Repeat','Location']){const th=document.createElement('th');th.textContent=v;head.append(th);}
      const body=table.createTBody();for(const ev of events){const row=body.insertRow();for(const key of ['SUMMARY','DTSTART','DTEND','RRULE','LOCATION'])row.insertCell().textContent=prop(ev,key)||'—';}
      out.append(table);
    };
    el('icsFile').onchange=async ev=>{const f=ev.target.files[0];if(f){el('icsRaw').value=await f.text();parse();}};
    el('icsBtn').onclick=parse;parse();
  }
  if(el('mgFiles')){let generation=0;el('mgFiles').onchange=async ev=>{
    const version=++generation, files=[...ev.target.files], link=el('mgDl'),status=el('mgStatus');
    link.hidden=true;const events=new Map(),zones=new Map();let duplicates=0;
    try{
      for(const f of files){const lines=unfold(await f.text());if(!lines.includes('BEGIN:VCALENDAR')||!lines.includes('END:VCALENDAR'))throw Error('Select complete calendar files.');
        for(const z of components(lines,'VTIMEZONE')){const tz=prop(z,'TZID');if(zones.has(tz)&&zones.get(tz).join('\n')!==z.join('\n'))throw Error('Conflicting definitions for timezone '+tz+'.');zones.set(tz,z);}
        for(const row of components(lines,'VEVENT')){const uid=prop(row,'UID');if(!uid)throw Error('An event has no UID. Check the file before merging.');
          const key=JSON.stringify([uid,prop(row,'RECURRENCE-ID')]);const old=events.get(key);
          if(old){duplicates++;const a=Number(prop(old,'SEQUENCE')||0),b=Number(prop(row,'SEQUENCE')||0);if(a>b||(a===b&&prop(old,'DTSTAMP')>=prop(row,'DTSTAMP')))continue;}
          events.set(key,row);
        }}
      if(version!==generation)return;if(!events.size)throw Error('No events found.');
      status.textContent='Kept '+events.size+' unique events; removed '+duplicates+' duplicates.';
      download(link,calendar([...zones.values(),...events.values()].flat()),'merged-clean.ics');
    }catch(error){if(version===generation)status.textContent=error.message;}
  };}
  if(el('acTitle')){
    const box=el('acLinks'),ics=document.createElement('a');ics.className='btn-sec';ics.textContent='Download .ics';
    listen(['acTitle','acStart','acEnd','acLoc'],()=>{
      const name=el('acTitle').value,loc=el('acLoc').value,start=new Date(el('acStart').value+'Z'),end=new Date(el('acEnd').value+'Z');
      box.replaceChildren();if(!name.trim()||isNaN(start)||isNaN(end)||end<=start){box.textContent='Enter a title and an end after the start.';return;}
      const endpoints=[['Google Calendar','https://calendar.google.com/calendar/render',{action:'TEMPLATE',text:name,dates:stamp(start)+'/'+stamp(end),location:loc}],['Outlook.com','https://outlook.live.com/calendar/0/deeplink/compose',{path:'/calendar/action/compose',rru:'addevent',subject:name,startdt:start.toISOString(),enddt:end.toISOString(),location:loc}]];
      for(const [label,base,params] of endpoints){const a=document.createElement('a');a.className='btn';a.textContent=label;a.href=base+'?'+new URLSearchParams(params);a.target='_blank';a.rel='noopener noreferrer';box.append(a);}
      download(ics,calendar(event(crypto.randomUUID(),['DTSTART:'+stamp(start),'DTEND:'+stamp(end),'SUMMARY:'+escapeText(name),'LOCATION:'+escapeText(loc)])),'event.ics');box.append(ics);
    });
  }
  if(el('tbGen')){
    const feedback=note(el('tbGen').closest('.tool'));
    for(const id of ['tbDate','tbLines'])el(id).oninput=()=>{el('tbDl').hidden=true;feedback.textContent='';};
    el('tbGen').onclick=()=>{
      const ds=el('tbDate').value.replaceAll('-',''),rows=el('tbLines').value.trim().split(/\n/),lines=[];
      el('tbDl').hidden=true;if(!ds){feedback.textContent='Pick a date.';return;}
      for(const [i,row] of rows.entries()){const m=row.match(/^\s*([01]\d|2[0-3]):([0-5]\d)\s*-\s*([01]\d|2[0-3]):([0-5]\d)\s*\|\s*(.+?)\s*$/);
        if(!m||m[1]+m[2]>=m[3]+m[4]){feedback.textContent='Check line '+(i+1)+'. Use HH:MM-HH:MM | Title with a later end.';return;}
        lines.push(...event('block-'+ds+'-'+i,['DTSTART:'+ds+'T'+m[1]+m[2]+'00','DTEND:'+ds+'T'+m[3]+m[4]+'00','SUMMARY:'+escapeText(m[5])]));
      }
      download(el('tbDl'),calendar(lines),'timeblocks.ics');feedback.textContent=rows.length+' time blocks ready.';
    };
  }
  if(el('rrFreq'))listen(['rrFreq','rrInt','rrDay','rrCnt'],()=>{
    const freq=el('rrFreq').value,interval=el('rrInt').value,count=el('rrCnt').value,days=el('rrDay').value.toUpperCase().trim(),out=el('rrOut');
    const positive=v=>/^\d+$/.test(v)&&+v>0&&+v<=2147483647;
    if(!positive(interval)||(count&&!positive(count))||(days&&!days.split(',').every(day=>{const m=day.match(/^([+-]?\d{1,2})?(MO|TU|WE|TH|FR|SA|SU)$/);return m&&(!m[1]||(['MONTHLY','YEARLY'].includes(freq)&&+m[1]!==0&&Math.abs(+m[1])<=53));}))){out.textContent='Check interval, count and weekday codes. Numbered weekdays require monthly or yearly recurrence.';return;}
    out.textContent='RRULE:'+['FREQ='+freq,+interval>1?'INTERVAL='+interval:'',days?'BYDAY='+days:'',count?'COUNT='+count:''].filter(Boolean).join(';');
  });
  if(el('crIn'))listen(['crIn'],()=>{
    const parts=el('crIn').value.trim().split(/\s+/),out=el('crOut'),names=['minute','hour','day of month','month','weekday'],ranges=[[0,59],[0,23],[1,31],[1,12],[0,7]];
    if(parts.length!==5){out.textContent='Enter five numeric fields: minute hour day-of-month month weekday.';return;}
    const descriptions=[];
    for(const [i,part] of parts.entries()){const [min,max]=ranges[i],pieces=[];
      for(const token of part.split(',')){const m=token.match(/^(\*|\d+(?:-\d+)?)(?:\/(\d+))?$/);
        if(!m){out.textContent='Invalid numeric '+names[i]+' field.';return;}
        const [a,b]=m[1].split('-').map(Number);
        if((m[1]!=='*'&&(a<min||a>max||(b!==undefined&&(b<a||b>max))))||(m[2]&&+m[2]<1)){out.textContent='Out of range: '+names[i]+'.';return;}
        pieces.push((m[1]==='*'?'every value':m[1])+(m[2]?' in steps of '+m[2]:''));
      } descriptions.push(names[i]+': '+pieces.join(', '));
    }
    out.textContent=descriptions.join(' · ')+(parts[2]!=='*'&&parts[4]!=='*'?' · Either day condition may match in traditional cron.':'')+' · Sunday is 0 or 7. The scheduler sets the time zone.';
  });
})();
