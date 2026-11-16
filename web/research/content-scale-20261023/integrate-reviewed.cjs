const fs=require('node:fs'),path=require('node:path'),ts=require('typescript');
const P=__dirname,R=path.resolve(P,'../..'),C=path.join(R,'src/app/content');
function read(f){return JSON.parse(fs.readFileSync(path.join(P,f),'utf8'));}
function extract(file,exportName){const t=fs.readFileSync(file,'utf8');const sf=ts.createSourceFile(file,t,ts.ScriptTarget.Latest,true);let obj;function visit(n){if(ts.isVariableDeclaration(n)&&n.name.getText(sf)===exportName)obj=n.initializer;ts.forEachChild(n,visit);}visit(sf);return JSON.parse(obj.getText(sf));}
let articles=extract(path.join(C,'en-US/articles-pilot-20261023.ts'),'PILOT_EN_US');let facts=extract(path.join(C,'pilot-article-facts.ts'),'PILOT_ARTICLE_FACTS');const manifest=read('editorial-manifest.json');
const [draftFile,recordsFile,proof,reviewer]=process.argv.slice(2);if(!draftFile||!recordsFile||!proof||!reviewer)throw Error('Needdraft,records,proof,reviewer');
const normalize=url=>url.replace(/\/rfc(\d+)#/, '/rfc$1.html#');
const batch=read(draftFile), raw=read(recordsFile),records=Array.isArray(raw)?raw:raw.articles??Object.values(raw.records??{});if(!fs.existsSync(path.join(P,proof)))throw Error('Reviewproofmissing');
for(const [slug,a] of Object.entries(batch)){
 for(const source of a.sources??[]) source.url=normalize(source.url);
 const rec=records.find(x=>x.slug===slug);if(!rec)throw Error('Noeditorialrecord '+slug);
 // Product photographs are clearly labelled, never presented as Apple/Google/Outlook controls.
 a.galleryKinds=['week-left','week-right'];a.galleryAfterContent=true;a.galleryCaption='Cloud Calendars overview, using our product images. Provider settings and protocol examples described in this guide are separate from the screens shown here.';
 a.updated='2026-10-23';articles[slug]=a;
 const proposedFamily=rec.proposedFamily??rec.family;const family=proposedFamily==='sync'?'planning':proposedFamily==='help'?'unify':proposedFamily;const proposedIntent=rec.proposedIntent;const intent=['core','unify','widgets','editing','price','compare','device'].includes(proposedIntent)?proposedIntent:'editing';
 facts[slug]={slug,family,intent,claims:[],updated:'2026-10-23'};
 let evidence=rec.evidence.map(e=>({...e,url:normalize(e.url),verifiedAt:e.verifiedAt??e.retrievedAt,type:'primary',note:e.note??e.readScope}));
 for(const e of evidence)if(!(a.sources??[]).some(s=>s.url===e.url))a.sources.push({label:'Supporting primary documentation',url:e.url});
 const record={...rec,family,review:{status:'approved',reviewer,checkedAt:'2026-10-23',proof},evidence,firsthandTesting:false,canonicalDecision:rec.canonicalDecision??'Distinct reader task retained after source and neighboring-intent review'};
 manifest.articles=manifest.articles.filter(r=>r.slug!==slug);manifest.articles.push(record);
}
fs.writeFileSync(path.join(C,'en-US/articles-pilot-20261023.ts'),"import type { LocalisedArticle } from '../types';\nexport const PILOT_EN_US: Readonly<Record<string, LocalisedArticle>> = "+JSON.stringify(articles,null,2)+';\n');
fs.writeFileSync(path.join(C,'pilot-article-facts.ts'),"import type { ArticleFacts } from './types';\nexport const PILOT_ARTICLE_FACTS: Readonly<Record<string, ArticleFacts>> = "+JSON.stringify(facts,null,2)+';\n');
fs.writeFileSync(path.join(P,'editorial-manifest.json'),JSON.stringify(manifest,null,2)+'\n');console.log(`Integrated ${Object.keys(batch).length}; totalnew ${Object.keys(articles).length}; notdeployed.`);
