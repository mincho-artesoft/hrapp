/** Source inventory, not editorial or native-speaker approval. Does not mutate content. */
import fs from 'node:fs';import path from 'node:path';import ts from 'typescript';
const base=path.resolve('src/app/content');
function moduleAt(file){const source=fs.readFileSync(file,'utf8');const result=ts.transpileModule(source,{reportDiagnostics:true,compilerOptions:{module:ts.ModuleKind.CommonJS}});const errors=(result.diagnostics??[]).filter(x=>x.category===ts.DiagnosticCategory.Error);if(errors.length)throw Error(file+':'+errors.map(x=>ts.flattenDiagnosticMessageText(x.messageText,' ')).join('\n'));const m={exports:{}};new Function('require','exports','module',result.outputText)(n=>moduleAt(path.resolve(path.dirname(file),n)+'.ts'),m.exports,m);return m.exports;}
const facts=moduleAt(path.join(base,'article-facts.ts')).ARTICLE_FACTS;
const rows=[];
for(const loc of fs.readdirSync(base)){
 const dir=path.join(base,loc);if(!fs.statSync(dir).isDirectory()||loc==='home')continue;
 for(const name of fs.readdirSync(dir).filter(x=>/^articles.*\.ts$/.test(x))){
  for(const record of Object.values(moduleAt(path.join(dir,name)))){
   if(!record||typeof record!=='object')continue;
   for(const [slug,a]of Object.entries(record)){
    if(!a||typeof a!=='object'||!a.title||!Array.isArray(a.sections))throw Error('Unexpected article shape '+loc+'/'+slug);
    if(!facts[slug])throw Error('Missing route facts '+slug);
    const text=[a.title,a.lede,a.commonBelief,...a.sections.flatMap(s=>[s.heading,...s.body]),...(a.practical??[]),...(a.faq??[]).flatMap(f=>[f.q,f.a])].filter(Boolean).join(' ');
    rows.push({locale:loc,slug,title:a.title,description:a.description,descriptionCharacters:[...a.description].length,sections:a.sections.length,faq:(a.faq??[]).length,words:text.split(/\s+/u).length,source:name,sources:(a.sources??[]).map(x=>x.url),updated:a.updated??facts[slug].updated});
   }
  }
 }
}
const duplicate=rows.filter((r,i)=>rows.findIndex(x=>x.locale===r.locale&&x.slug===r.slug)!==i);if(duplicate.length)throw Error('Duplicate article keys');
const out={date:new Date().toISOString(),status:'source_inventory_not_quality_approval',articles:rows};fs.writeFileSync('research/content-inventory-20261021.json',JSON.stringify(out,null,2)+'\n');console.log(JSON.stringify({articles:rows.length,locales:new Set(rows.map(r=>r.locale)).size,english:rows.filter(r=>r.locale==='en-US').length,overlongDescriptions:rows.filter(r=>r.descriptionCharacters>160).map(r=>({locale:r.locale,slug:r.slug,count:r.descriptionCharacters}))}));
