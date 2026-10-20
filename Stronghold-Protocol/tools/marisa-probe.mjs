import {createPluginRegistry} from '../server/plugins/registry.js';
import {buildContentSet} from '../server/plugins/contentSet.js';
import {ROOT} from '../server/data.js';
const registry=createPluginRegistry({publicDir:ROOT+'/public',dataDir:ROOT+'/data',packsDir:ROOT+'/packs',pluginsDir:ROOT+'/plugins'},{scriptMode:'sandbox',scriptHost:'127.0.0.1'});
for(const settings of [{},{existing:false,additions:false,bonds:false,strategies:false},{add_makoto:'diy',add_amiya3:'diy'}]) {
 const s=buildContentSet({registry,ids:[{id:'marisa',settings}]});
 console.log(JSON.stringify({settings,cs:s.cs,problems:s.problems,warnings:s.warnings,chess:s.data&&Object.keys(s.data.chess).length},null,2));
}
