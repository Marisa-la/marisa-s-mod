import fs from 'node:fs';
import path from 'node:path';
import {legacy,game,aliases} from './build-profile.mjs';
import {tidyVoiceTrees} from '../../tools/fetch-assets.mjs';
const read=p=>JSON.parse(fs.readFileSync(path.join(legacy,p),'utf8'));
const stock=JSON.parse(fs.readFileSync(path.join(import.meta.dirname,'base-assets.json'),'utf8'));
const merge=(a,b)=>{
 if(!a||!b||typeof a!=='object'||typeof b!=='object'||Array.isArray(a)||Array.isArray(b))return b;
 const out={...a};for(const [k,v]of Object.entries(b))out[k]=merge(a[k],v);return out;
};
const art=merge(read('data/assets.json'),stock),skins=read('mods/marisa/content.json').skins;
// Audio roles are complete records: a removed 0.3.0 skill slot must not survive a deep merge.
// Keep the two MOD-only operators with their official bank parameters in a checked-in supplement.
const extraAudio=JSON.parse(fs.readFileSync(path.join(import.meta.dirname,'extra-audio-0.3.1.json'),'utf8'));
art.audio.sfx={...stock.audio.sfx,units:{...stock.audio.sfx.units,...extraAudio.units},pools:{...stock.audio.sfx.pools,...extraAudio.pools}};
// Only advertise optional dubs actually present in this build. Primary CN/JP art remains required.
const trimOptional=v=>{
 if(typeof v==='string'&&/^\/assets\/audio\/voice\/(en|kr|native)\//.test(v))return fs.existsSync(path.join(game,'public',v))?v:undefined;
 if(Array.isArray(v))return v.map(trimOptional).filter(x=>x!==undefined);
 if(v&&typeof v==='object')return Object.fromEntries(Object.entries(v).map(([k,x])=>[k,trimOptional(x)]).filter(([,x])=>x!==undefined));
 return v;
};
art.audio=trimOptional(art.audio);tidyVoiceTrees(art);
// 0.3.1 resolves skin choices per seat from the operator's own catalogue. Keep the old top-level art/registry for
// existing tools, while publishing the same skin records through the native picker and renderer.
for(const [charId,record]of Object.entries(skins))if(art.chars[charId]){
 const catalogue={...art.chars[charId].skins};
 for(const skin of record.skins??[])if(art.skins?.[skin.id])catalogue[skin.id]=art.skins[skin.id];
 art.chars[charId]={...art.chars[charId],skins:catalogue};
}
for(const [id,alias]of Object.entries(aliases))if(id.startsWith('char_')&&art.chars[id]){
 art.chars[alias]={...art.chars[id]};
 if(skins[id])skins[alias]={...skins[id],charId:alias};
}
// New strategy ids are namespaced by build-profile, while the borrowed art keeps its original key.
for(const [id,alias]of Object.entries(aliases))if(id.startsWith('band_')&&art.bands[id])art.bands[alias]=art.bands[id];
for(const key of ['chars','enemies','tokens','bonds','items','bands','skills','modules','ui'])art.stats[key]=Object.keys(art[key]||{}).length;
for(const [key,tree]of Object.entries({voiceChars:'voice',voiceJpChars:'voiceJp',voiceEnChars:'voiceEn',voiceKrChars:'voiceKr',voiceNativeChars:'voiceNative'}))art.stats[key]=Object.keys(art.audio?.[tree]||{}).length;
fs.writeFileSync(path.join(game,'data/assets.json'),JSON.stringify(art));
fs.writeFileSync(path.join(game,'data/skins.json'),JSON.stringify(skins));
console.log('Generated shared art references:',Object.keys(art.chars).length,'characters');
