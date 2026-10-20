import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {legacy,game,plugin,rename} from './build-profile.mjs';
const require=createRequire(import.meta.url);
const esbuild=require('esbuild');
const built=await esbuild.build({metafile:true,entryPoints:[path.join(import.meta.dirname,'runtime-entry.js')],outfile:path.join(plugin,'sim/index.js'),bundle:true,format:'esm',platform:'neutral',target:'es2022',external:['sp:sdk@1'],treeShaking:true,plugins:[{
 name:'native-sdk',setup(build){
  build.onLoad({filter:/\.js$/},async({path:file})=>{
   const p=file.replaceAll('\\','/');
   if(p.endsWith('/server/data.js'))return {contents:'export const getData=()=>({});',loader:'js'};
   if(p.endsWith('/sim/nodeData.js'))return {contents:'export const loadNodeData=()=>({}); export const getNodeData=()=>({});',loader:'js'};
   let source=fs.readFileSync(file,'utf8');
   if(p.endsWith('/sim/detmath.js')) {
    const names=[...source.matchAll(/export (?:function|const) (\w+)/g)].map(m=>m[1]);
    return {contents:"import {math} from 'sp:sdk@1';\n"+names.map(n=>'export const '+n+'=math.'+n+';').join('\n'),loader:'js'};
   }
   if(p.endsWith('/sim/simdata.js')) source=source.replace(/const IS_NODE = [^;]+;/,'const IS_NODE = false;').replace(/if \(IS_NODE\) \{[\s\S]*?\n\}/,'');
   if(p.endsWith('/match/bondsMeta.js')) source='export const pieceBonds=(gd,p)=>gd.pieceBonds(p.uid);';
   if(p.endsWith('/match/rhodeMeta.js')) source=source.replace(/function rangeKeysOf\(ps, piece, key, dir\) \{[\s\S]*?\n\}/,'function rangeKeysOf(ps,piece){return ps.rangeKeys(piece.uid);}');
   if(p.endsWith('/bonds/addon/battle.js'))source=source.replace(/export const ID = Object.freeze\(\{[\s\S]*?\}\);/,"export const ID=Object.freeze({rhode:'rhodeShip'});").replace('num(bb.aura_l_max, 100)','100 * num(bb.aura_l_max, 1)');
   if(p.endsWith('/garrisons/battle.js')) source=source.replace("if (g && g.eventType === 'IN_BATTLE')", "if (g && g.scriptHandler && g.eventType === 'IN_BATTLE')");
   if(p.endsWith('/bands/battle.js'))source=source.replace('const band = ps.bandId ? bandRecord(ps.bandId) : null;',"const band = ps.bandId === 'band_kun' ? bandRecord(ps.bandId) : null;").replace('  installMapChars(battle);','');
   source=rename(source);
   // Preserve deterministic engine arithmetic in the single-file SDK module.
   source=source.replace(/\.localeCompare\(([^()]*)\)/g,'.__compare($1)');
   if(source.includes('.__compare('))source=source.replace(/([\w.]+)\.__compare\(([^()]*)\)/g,'compareText($1,$2)')+'\nfunction compareText(a,b){return a<b?-1:a>b?1:0;}\n';
   return {contents:source,loader:'js'};
  });
 }
}]});
fs.writeFileSync(path.join(import.meta.dirname,'runtime-inputs.json'),JSON.stringify(Object.keys(built.metafile.inputs),null,2));
const {checkScript}=await import('../../shared/plugins/scriptCheck.js');
const source=fs.readFileSync(path.join(plugin,'sim/index.js'),'utf8');
const check=checkScript(source);
for(const p of check.problems)console.log(p,source.slice(Math.max(0,+p.path-60),+p.path+100));
console.log('Runtime:',source.length,'characters;',check.problems.length,'portability problems');
if(check.problems.length)process.exitCode=1;
