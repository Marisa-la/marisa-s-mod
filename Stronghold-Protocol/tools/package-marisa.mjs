#!/usr/bin/env node
// Reuse the upstream runtime/art selection; explicitly add the native MOD and its player tools.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {plan,listTree,playerPackageJson,zipFolder,importProblems,scanFiles} from './package.mjs';
import {manifestText} from './package-update.mjs';
import {writePackIndex} from './packs.mjs';
import {digestFile,inManifest,listedArtFiles} from '../server/update.js';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export function productionModules(root){
 const lock=JSON.parse(fs.readFileSync(path.join(root,'package-lock.json'),'utf8')),files=new Set();
 for(const [rel,entry]of Object.entries(lock.packages)){
  if(!rel.startsWith('node_modules/')||entry.dev||entry.link)continue;
  const installed=JSON.parse(fs.readFileSync(path.join(root,rel,'package.json'),'utf8'));
  if(installed.version!==entry.version)throw Error('Installed dependency differs from lock: '+rel);
  for(const f of listTree(root,rel))if(!f.slice(rel.length+1).includes('node_modules/'))files.add(f);
 }
 return [...files].sort();
}
const copy=(from,to,rel)=>{const target=path.join(to,rel);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(path.join(from,rel),target);};

export function packageMarisa(root=ROOT){
 const git=spawnSync('git',['ls-files','-z','--cached','--others','--exclude-standard'],{cwd:root,maxBuffer:64*1024*1024});
 if(git.status!==0)throw Error('Cannot enumerate source');
 const paths=[...new Set(git.stdout.toString().split('\0').filter(Boolean))];
 console.log('Planning runtime and referenced art');
 const p=plan(root,{paths,allowDirty:true,scan:false,measure:false});
 if(p.version!=='0.3.1'||p.problems.length)throw Error(p.problems.join('\n')||'Expected game 0.3.1');
 const extras=['scripts/start-marisa.cmd','tools/mod-test.mjs','tools/marisa-test-runtime.mjs',
  'public/dev/render-demo.html','public/dev/render-demo.js','docs/MARISA-0.3.1.md'];
 const pluginRoot=path.join(root,'mods/marisa-native/bundle');
 const pluginFiles=listTree(pluginRoot,'marisa').map(f=>'plugins/'+f);
 const libs=[...productionModules(root),...listTree(root,'public/vendor')];
 const code=[...new Set([...p.tracked,...extras,...pluginFiles])];
 const sources=new Map(code.map(rel=>[rel,rel.startsWith('plugins/marisa/')?path.join(pluginRoot,rel.slice(8)):path.join(root,rel)]));
 const ownScan=scanFiles(root,[...p.tracked,...extras],{home:true});
 if(ownScan.length)throw Error(JSON.stringify(ownScan));
 const dist=path.join(root,'.cache/dist');fs.mkdirSync(dist,{recursive:true});
 const baseArt=listedArtFiles(JSON.parse(fs.readFileSync(path.join(root,'mods/marisa-native/base-assets.json'),'utf8')));
 const results=[];
 for(const kind of ['full','compatibility']){
  const work=fs.mkdtempSync(path.join(dist,'marisa-'+kind+'-')),stage=path.join(work,'Stronghold-Protocol');
  const art=kind==='full'?p.art:p.art.filter(f=>!baseArt.has(f));
  const files=[...new Set([...code,...art,...libs])];
  for(const rel of files){
   const from=sources.get(rel);
   if(from){const target=path.join(stage,rel);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(from,target);}
   else copy(root,stage,rel);
  }
  const pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
  fs.writeFileSync(path.join(stage,'package.json'),JSON.stringify(playerPackageJson(pkg,new Set(files)),null,2)+'\n');
  writePackIndex(stage,path.join(stage,'packs/index.json'));
  fs.writeFileSync(path.join(stage,'MARISA-PACKAGE.md'),fs.readFileSync(path.join(root,'docs/MARISA-0.3.1.md')));
  fs.writeFileSync(path.join(stage,'MOD-PACKAGE.json'),JSON.stringify({format:1,mod:'marisa',version:'0.3.1',kind,upstream:'b3deebdae4a92642c007d217a1a4573e5d3612c5',install:kind==='full'?'fresh-directory':'manual-overlay-on-vanilla-0.3.1',artFiles:art.length},null,2)+'\n');
  const staged=listTree(stage,'',{junk:true});
  const errors=importProblems(stage,staged);
  if(errors.length)throw Error(errors.join('\n'));
  for(const rel of staged)if(/(?:^|\/)\.git(?:\/|$)|(?:^|\/)\.cache\/|\.env$|service\.env\.cmd$/.test(rel))throw Error('Unexpected local file: '+rel);
  const manifest=new Map(staged.filter(inManifest).map(rel=>[rel,digestFile(path.join(stage,rel))]));
  fs.writeFileSync(path.join(stage,'MANIFEST.json'),manifestText({app:'0.3.1',files:manifest}));
  const name='Stronghold-Protocol-0.3.1-marisa-'+kind+'.zip',zip=path.join(dist,name);
  if(fs.existsSync(zip))throw Error('Release already exists: '+zip);
  zipFolder(work,zip);
  results.push({name,...digestFile(zip),files:staged.length+1,artFiles:art.length,stage});
  console.log(name+': '+JSON.stringify(results.at(-1)));
 }
 const pluginName='marisa-0.3.1.zip';fs.copyFileSync(path.join(root,'plugins/_dist',pluginName),path.join(dist,pluginName));
 results.push({name:pluginName,...digestFile(path.join(dist,pluginName))});
 fs.writeFileSync(path.join(dist,'SHA256SUMS.txt'),results.map(r=>r.sha256+'  '+r.name+'\n').join(''));
 fs.writeFileSync(path.join(dist,'packages.json'),JSON.stringify({mod:'marisa',version:'0.3.1',packages:results.map(({stage:_,...r})=>r)},null,2)+'\n');
 return results;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))packageMarisa();
