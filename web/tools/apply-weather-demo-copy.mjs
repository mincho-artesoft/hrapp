/** Apply reviewed, exact-value guarded weather copy without altering other home fields. */
import fs from 'node:fs';import crypto from 'node:crypto';import ts from 'typescript';
const report=JSON.parse(fs.readFileSync('research/batch06-weather/localized-home-patches.json'));
const labels=JSON.parse(fs.readFileSync('research/batch06-weather/localized-demo-copy.json')).locales;
for(const locale of Object.keys(labels)){
 const patches=report.patches.filter(p=>p.locale===locale);const file=patches[0].file;let source=fs.readFileSync(file,'utf8');
 if(crypto.createHash('sha256').update(source).digest('hex')!==patches[0].sourceSha256)throw Error('Hash changed '+locale);
 const ex={};new Function('exports',ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(ex);const original=Object.values(ex)[0];
 const tree=ts.createSourceFile(file,source,ts.ScriptTarget.Latest,true);let root;function find(n){if(ts.isVariableDeclaration(n)&&n.name.getText(tree).startsWith('HOME_'))root=n.initializer;ts.forEachChild(n,find)}find(tree);
 function nodeAt(path){let node=root;for(const part of path){node=typeof part==='number'?node.elements[part]:node.properties.find(p=>ts.isPropertyAssignment(p)&&p.name.getText(tree).replace(/^['"]|['"]$/g,'')===part)?.initializer;if(!node)throw Error('Missing '+locale+path)}return node;}
 const edits=[];const expected=structuredClone(original);
 for(const p of patches){let obj=original;for(const k of p.path)obj=obj[k];if(JSON.stringify(obj)!==JSON.stringify(p.before))throw Error('Before changed '+locale+p.path);const node=nodeAt(p.path);edits.push({start:node.getStart(tree),end:node.end,text:JSON.stringify(p.after)});let target=expected;for(const k of p.path.slice(0,-1))target=target[k];target[p.path.at(-1)]=p.after;}
 const l=labels[locale];const added={demoLabel:l.demoLabel,loadingLabel:l.loading,tabs:{hourly:l.hourly,daily:l.daily,weekend:l.weekend,range:l.range}};
 const weather=nodeAt(['weather']);edits.push({start:weather.getStart(tree)+1,end:weather.getStart(tree)+1,text:'\n'+Object.entries(added).map(([k,v])=>`${k}: ${JSON.stringify(v)},`).join('\n')+'\n'});Object.assign(expected.weather,added);
 for(const e of edits.sort((a,b)=>b.start-a.start))source=source.slice(0,e.start)+e.text+source.slice(e.end);
 const after={};new Function('exports',ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(after);if(JSON.stringify(Object.values(after)[0])!==JSON.stringify(expected)){
  // Property order differs for the inserted fields; compare recursively by stable keys.
  const sort=x=>Array.isArray(x)?x.map(sort):x&&typeof x==='object'?Object.fromEntries(Object.keys(x).sort().map(k=>[k,sort(x[k])])):x;
  if(JSON.stringify(sort(Object.values(after)[0]))!==JSON.stringify(sort(expected)))throw Error('Unexpected delta '+locale);
 }
 fs.writeFileSync(file,source);
}
console.log('Applied150 exact copy patches and localized demo labels/tabs in30locales; unrelated fields preserved');
