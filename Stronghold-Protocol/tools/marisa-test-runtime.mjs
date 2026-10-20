import {createPluginRegistry} from '../server/plugins/registry.js';
import {buildContentSet} from '../server/plugins/contentSet.js';
import {getData,ROOT} from '../server/data.js';
import {loadScripts} from '../shared/plugins/scriptLoad.js';
import fs from 'node:fs';

// Explicit local author command, using the same composed snapshot as plugin.mjs test.
export async function prepareMarisaTest(){
 const pluginsDir=fs.existsSync(ROOT+'/plugins/marisa/plugin.json')?ROOT+'/plugins':ROOT+'/mods/marisa-native/bundle';
 const registry=createPluginRegistry({publicDir:ROOT+'/public',dataDir:ROOT+'/data',packsDir:ROOT+'/packs',pluginsDir});
 const lookup=registry.plugin;
 const author={...registry,plugin:id=>{const p=lookup(id);return p?{...p,status:'loaded',...(p.script?{script:{...p.script,execution:'trusted'}}:{})}:null;}};
 const set=buildContentSet({registry:author,ids:['marisa']});
 if(!set.cs)throw Error(JSON.stringify(set.problems));
 await loadScripts(set.scripts,{hashInput:set.index});
 return mods=>mods.length?{data:set.data,cs:set.cs,mods:['marisa']}:{data:getData(),mods:[]};
}
