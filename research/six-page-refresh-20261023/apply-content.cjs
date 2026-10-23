const fs=require('node:fs'),path=require('node:path'),ts=require('typescript');
const P=__dirname,R=path.resolve(P,'../..'),C=path.join(R,'src/app/content');
const source=JSON.parse(fs.readFileSync(path.join(P,'english-source.json'),'utf8'));
const locales=fs.readdirSync(path.join(C,'article-locales')).filter(x=>x.endsWith('.ts')).map(x=>x.slice(0,-3));const report={};
for(const loc of locales){
 const data=loc==='en-US'?source:JSON.parse(fs.readFileSync(path.join(P,loc+'.json'),'utf8'));
 const agg=path.join(C,'article-locales',loc+'.ts');let aggregate=fs.readFileSync(agg,'utf8');
 const files=[...aggregate.matchAll(/from '\.\.\/[^/]+\/(articles[^']*)'/g)].map(m=>path.join(C,loc,m[1]+'.ts'));
 const found=new Set(),changed=[];
 for(const file of files){
  let text=fs.readFileSync(file,'utf8');const tree=ts.createSourceFile(file,text,ts.ScriptTarget.Latest,true);const edits=[];
  const visit=node=>{
   if(ts.isPropertyAssignment(node)&&ts.isStringLiteral(node.name)&&data[node.name.text]&&ts.isObjectLiteralExpression(node.initializer)){
    found.add(node.name.text);edits.push({start:node.initializer.getStart(tree),end:node.initializer.end,text:JSON.stringify(data[node.name.text],null,2)});return;
   }ts.forEachChild(node,visit);
  };visit(tree);
  if(edits.length){for(const e of edits.sort((a,b)=>b.start-a.start))text=text.slice(0,e.start)+e.text+text.slice(e.end);fs.writeFileSync(file,text);changed.push(path.relative(R,file));}
 }
 const missing=Object.fromEntries(Object.entries(data).filter(([slug])=>!found.has(slug)));
 if(Object.keys(missing).length){
  const name='PRIORITY_'+loc.replace(/[^A-Za-z0-9]/g,'_').toUpperCase();const module=path.join(C,loc,'articles-priority.ts');
  fs.writeFileSync(module,"import type { LocalisedArticle } from '../types';\n\nexport const "+name+': Readonly<Record<string, LocalisedArticle>> = '+JSON.stringify(missing,null,2)+';\n');
  const imp=`import { ${name} } from '../${loc}/articles-priority';\n`;
  if(!aggregate.includes(imp)){aggregate=imp+aggregate;aggregate=aggregate.replace('articles: {','articles: { ...'+name+',');fs.writeFileSync(agg,aggregate);}
 }
 report[loc]={updatedModules:changed,addedSlugs:Object.keys(missing)};
}
fs.writeFileSync(path.join(P,'applied-content.json'),JSON.stringify(report,null,2)+'\n');console.log('Applied six pages in',locales.length,'locales');
