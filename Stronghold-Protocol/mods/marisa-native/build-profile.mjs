import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
const root=path.resolve(import.meta.dirname,'../..');
export const legacy=path.join(import.meta.dirname,'source');
export const game=root;
export const plugin=path.join(game,'plugins/marisa');
const json=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const names=['chess','enemies','tokens','stages','waves','bonds','garrisons','items','bands','effects','choices','config','backups'];
const base=Object.fromEntries(names.map(n=>[n,json(path.join(game,'data',n+'.json'))]));
const full=Object.fromEntries(names.map(n=>[n,json(path.join(legacy,'data/mods/marisa',n+'.json'))]));
// The archived MOD tables include the whole 0.3.0 roster. Rebase only upstream changes whose old value the MOD
// retained; replacing the table wholesale would discard either the 0.3.1 fixes or the author's balance changes.
// The checked-in delta was extracted from the official v0.3.0/v0.3.1 data, so rebuilding needs no Git or network.
const upstream=json(path.join(import.meta.dirname,'upstream-0.3.1.json'));
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
for(const change of upstream.changes){
 let parent=full[change.file];
 for(const key of change.path.slice(0,-1))parent=parent?.[key];
 if(!parent||typeof parent!=='object')continue; // A parent removed by the MOD remains removed.
 const key=change.path.at(-1),present=Object.hasOwn(parent,key),had=Object.hasOwn(change,'before');
 if(present!==had||present&&!same(parent[key],change.before))continue;
 if(Object.hasOwn(change,'after'))parent[key]=structuredClone(change.after);
 else delete parent[key];
}
const prefixes={chess:'chess_x',bonds:'bond_x',garrisons:'garrison_x',bands:'band_x',effects:'effect_x',tokens:'token_x'};
export const aliases={};
for(const [file,prefix]of Object.entries(prefixes))for(const id of Object.keys(full[file]))if(!Object.hasOwn(base[file],id)){
 let suffix=id.replace(/^(chess_char_\d+_|garrison_|token_|aceffect_|bondeffect_|band_)/,'');
 aliases[id]=prefix+'_marisa_'+suffix;
 if(file==='chess')aliases[id.replace(/_[ab]$/,'')]=aliases[id].replace(/_[ab]$/,'');
}
for(const id of Object.keys(full.backups.units))if(!base.backups.units[id])aliases[id]='char_x_marisa_'+id.replace(/^char_\d+_/,'');
const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const pattern=new RegExp('(?<![A-Za-z0-9_])('+Object.keys(aliases).sort((a,b)=>b.length-a.length).map(escape).join('|')+')(?![A-Za-z0-9_])','g');
export const rename=s=>s.replace(pattern,x=>aliases[x]);
const mapped=jsonText=>JSON.parse(rename(JSON.stringify(jsonText)));
const extended=mapped(full);
// Store the aura threshold in hundreds of layers (1 = 100), within native blackboard bounds.
for(const table of [extended.bonds,extended.effects]) for(const rec of Object.values(table)) {
 if(rec.bb?.aura_l_max)rec.bb.aura_l_max/=100;
 for(const buff of rec.buffs??[])if(buff.bb?.aura_l_max)buff.bb.aura_l_max/=100;
}
for(const [id,rec] of Object.entries(extended.garrisons))if(id.startsWith('garrison_x_marisa_')&&rec.eventType==='IN_BATTLE')rec.scriptHandler=true;
for(const [id,rec] of Object.entries(extended.effects))if(id.startsWith('effect_x_marisa_'))rec.scriptHandler='marisa';
const tables={};
for(const n of names)if(JSON.stringify(base[n])!==JSON.stringify(extended[n]))tables[n]=extended[n];
fs.mkdirSync(path.join(plugin,'data'),{recursive:true});
fs.writeFileSync(path.join(plugin,'data/profile.json'),JSON.stringify({profile:1,kind:'marisa',tables}));
fs.writeFileSync(path.join(import.meta.dirname,'aliases.json'),JSON.stringify(aliases,null,2)+'\n');
let profile=rename(fs.readFileSync(path.join(legacy,'shared/mods.js'),'utf8'));
profile='// i18n-ignore-file: generated plugin metadata supplies its own localized labels.\n'+profile;
profile+='\n'+`
// Native plugin settings preserve the old manager's priority rules without storing executable expressions.
export const MARISA_SETTINGS = {
  existing: { type:'boolean', default:true, label:{zh:'启用已有干员改动',en:'Enable existing operator changes'} },
  additions: { type:'boolean', default:true, label:{zh:'启用追加干员',en:'Enable added operators'} },
  bonds: { type:'boolean', default:true, label:{zh:'启用追加盟约',en:'Enable added alliances'} },
  rhode: { type:'boolean', default:true, label:{zh:'罗德岛',en:'Rhodes Island'} },
  strategies: { type:'boolean', default:true, label:{zh:'启用追加策略',en:'Enable added strategies'} },
  kun: { type:'boolean', default:true, label:{zh:'鲲',en:'Kun'} },
};
for(const id of MOD_EXISTING_OPERATOR_IDS) MARISA_SETTINGS['op_'+id.split('_').at(-1)]={type:'enum',options:['mod','original'],default:'mod',label:{zh:id}};
for(const {charId} of MOD_ADDED_OPERATORS) MARISA_SETTINGS['add_'+charId.split('_').at(-1)]={type:'enum',options:['shop','diy','disabled'],default:'shop',label:{zh:charId}};
for(const {bondId,charId} of MOD_ADDED_BOND_MEMBERS) MARISA_SETTINGS['m_'+bondId+'_'+charId.split('_').at(-1)]={type:'boolean',default:true,label:{zh:bondId+' / '+charId}};
for(const {bondId,charId} of MOD_NEW_BOND_MEMBERS) MARISA_SETTINGS['n_'+charId.split('_').at(-1)]={type:'enum',options:['default','yes','no'],default:'default',label:{zh:bondId+' / '+charId}};
export function optionsFromSettings(s={}) {
  const o=defaultModOptions();
  o.existing.enabled=s.existing!==false;
  o.existing.vanillaChars=MOD_EXISTING_OPERATOR_IDS.filter(id=>s['op_'+id.split('_').at(-1)]==='original');
  o.additions.enabled=s.additions!==false;
  o.additions.disabledChars=MOD_ADDED_OPERATORS.filter(({charId})=>s['add_'+charId.split('_').at(-1)]==='disabled').map(x=>x.charId);
  o.additions.diyChars=MOD_ADDED_OPERATORS.filter(({charId})=>s['add_'+charId.split('_').at(-1)]==='diy').map(x=>x.charId);
  o.bonds.enabled=s.bonds!==false;
  o.bonds.disabledIds=s.rhode===false?[...MOD_BOND_IDS]:[];
  o.existingBondMembers.disabledIds=MOD_ADDED_BOND_MEMBERS.filter(({bondId,charId})=>s['m_'+bondId+'_'+charId.split('_').at(-1)]===false).map(({bondId,charId})=>bondId+':'+charId);
  for(const {bondId,charId} of MOD_NEW_BOND_MEMBERS){const v=s['n_'+charId.split('_').at(-1)];if(v==='yes'||v==='no')o.bonds.memberOverrides[bondId+':'+charId]=v==='yes';}
  o.strategies.enabled=s.strategies!==false;
  o.strategies.disabledIds=s.kun===false?[...MOD_STRATEGY_IDS]:[];
  return normalizeModOptions(o);
}
export function settingsFromOptions(raw){
  const o=normalizeModOptions(raw),s={existing:o.existing.enabled,additions:o.additions.enabled,bonds:o.bonds.enabled,rhode:!o.bonds.disabledIds.length,strategies:o.strategies.enabled,kun:!o.strategies.disabledIds.length};
  for(const id of MOD_EXISTING_OPERATOR_IDS)s['op_'+id.split('_').at(-1)]=o.existing.vanillaChars.includes(id)?'original':'mod';
  for(const {charId} of MOD_ADDED_OPERATORS)s['add_'+charId.split('_').at(-1)]=o.additions.disabledChars.includes(charId)?'disabled':o.additions.diyChars.includes(charId)?'diy':'shop';
  for(const {bondId,charId} of MOD_ADDED_BOND_MEMBERS)s['m_'+bondId+'_'+charId.split('_').at(-1)]=!o.existingBondMembers.disabledIds.includes(bondId+':'+charId);
  for(const {bondId,charId} of MOD_NEW_BOND_MEMBERS){const v=o.bonds.memberOverrides[bondId+':'+charId];s['n_'+charId.split('_').at(-1)]=v===undefined?'default':v?'yes':'no';}
  return s;
}
`;
fs.writeFileSync(path.join(game,'shared/plugins/marisaProfile.js'),profile);
const {MARISA_SETTINGS}=await import(pathToFileURL(path.join(game,'shared/plugins/marisaProfile.js')).href);
if(Object.keys(MARISA_SETTINGS).length>32)throw Error('Too many native settings');
const manifest={
 '$schema':'../../schemas/plugin.schema.json',manifest:2,id:'marisa',name:'魔理沙追加 MOD',version:'0.3.1',app:'>=0.3.1 <0.4.0',api:1,class:'script',scope:['room'],
 authors:['Marisa-la','Ruyl114514'],description:{zh:'魔理沙追加干员、罗德岛盟约与鲲策略；原生插件管理器逐项配置。需要配套的 0.3.1 兼容补丁。',en:'Marisa operators, Rhodes Island alliance and Kun strategy. Requires the 0.3.1 compatibility patch.'},
 permissions:['data.add','data.patch','sim.code','meta.code'],budget:1000000,data:['data/profile.json'],settings:MARISA_SETTINGS,entry:{sim:'sim/index.js',meta:'sim/index.js'},
};
fs.writeFileSync(path.join(plugin,'plugin.json'),JSON.stringify(manifest,null,2)+'\n');
console.log('Native profile:',Object.keys(MARISA_SETTINGS).length,'settings;',fs.statSync(path.join(plugin,'data/profile.json')).size,'bytes');

