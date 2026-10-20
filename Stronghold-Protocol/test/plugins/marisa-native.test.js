import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Worker} from 'node:worker_threads';
import {createPluginRegistry} from '../../server/plugins/registry.js';
import {buildContentSet} from '../../server/plugins/contentSet.js';
import {createContentSets} from '../../server/plugins/contentSets.js';
import {createMatchHosts} from '../../server/match/host/index.js';
import {getData,ROOT} from '../../server/data.js';
import {WorkerSimHost} from '../../public/js/battle/simHost.js';
import {fixtureSpec} from '../helpers/simHostFixture.js';
import {defaultModOptions,settingsFromOptions,optionsFromSettings,MOD_ADDED_OPERATORS} from '../../shared/plugins/marisaProfile.js';
import {validateDiyPicks,diySlotIds} from '../../shared/diy.js';

const registry=createPluginRegistry({publicDir:ROOT+'/public',dataDir:ROOT+'/data',packsDir:ROOT+'/packs',pluginsDir:ROOT+'/mods/marisa-native/bundle'},{scriptMode:'sandbox',scriptHost:'127.0.0.1'});
const build=settings=>buildContentSet({registry,ids:[{id:'marisa',settings}]});

test('native settings preserve priorities, candidate exclusivity and deterministic room content',()=>{
 const defaults=defaultModOptions();
 assert.deepEqual(optionsFromSettings(settingsFromOptions(defaults)),defaults);
 const full=build({});assert.deepEqual(full.problems,[]);assert.deepEqual(full.warnings,[]);
 assert.equal(full.execution,'sandbox');assert.equal(Object.keys(full.data.chess).length,274);
 const off=build({existing:false,additions:false,bonds:false,strategies:false});assert.deepEqual(off.problems,[]);
 assert.equal(Object.keys(off.data.chess).length,266);assert.equal(off.data.bonds.bond_x_marisa_rhodeShip,undefined);
 const custom=build({add_makoto:'diy',add_amiya3:'diy',op_kalts2:'original',n_kalts2:'yes',n_bldsk:'no'});assert.deepEqual(custom.problems,[]);
 assert.equal(custom.data.chess.chess_x_marisa_makoto_a.visible,false);
 assert.ok(custom.data.backups.diy.operators.char_1052_kalts2.bonds.includes('bond_x_marisa_rhodeShip'));
 assert.ok(!custom.data.chess.chess_char_4_26_a.bonds.includes('bond_x_marisa_rhodeShip'));
 const slots=diySlotIds(custom.data),byTier=t=>slots.find(id=>custom.data.backups.diy.slots[id].tier===t);
 for(const {charId}of MOD_ADDED_OPERATORS){
  assert.ok(custom.data.backups.diy.prototypes[5].includes(charId));assert.ok(custom.data.backups.diy.prototypes[6].includes(charId));
  assert.ok(validateDiyPicks({[byTier(5)]:{charId},[byTier(6)]:{charId}},{data:custom.data}).error);
 }
 assert.notEqual(custom.cs,full.cs);assert.notEqual(off.cs,full.cs);assert.equal(build({}).cs,full.cs);
});

for(const route of ['shop','diy'])test(`production SES Worker runs native kits via ${route} with no handler errors`,async t=>{
 const s=build({add_makoto:route,add_amiya3:route});assert.deepEqual(s.problems,[]);
 const host=new WorkerSimHost({workerFactory:()=>{
  const w=new Worker(new URL('../helpers/simWorkerNode.mjs',import.meta.url));
  const port={postMessage:m=>w.postMessage(m),terminate:()=>w.terminate()};w.on('message',data=>port.onmessage?.({data}));w.on('error',error=>port.onerror?.({error}));return port;
 }});t.after(()=>host.stop());
 await host.load(s.cs,{cs:s.cs,data:s.data,bounds:s.bounds,hashInput:s.index,scripts:s.scripts});
 const spec=fixtureSpec();spec.cs=s.cs;spec.timeLimit=15;
 spec.players[0].bandId='band_x_marisa_kun';
 spec.players[0].units=['makoto','amiya3','aglna2','kalts2'].map((name,i)=>({uid:i+1,chessId:'chess_x_marisa_'+name+'_a',row:10+i%2,col:4+Math.floor(i/2),skillIndex:Math.min(i,2)}));
 if(route==='diy')for(const [i,name]of ['makoto','amiya3'].entries()){
  spec.players[0].units[i].chessId=`chess_char_${i===0?5:6}_diy1_a`;
  spec.players[0].units[i].diy={charId:'char_x_marisa_'+name};
 }
 await host.start(spec);for(let i=0;i<15;i++)await host.step(30);
 const diag=await host.rpc('budget',['marisa']);assert.deepEqual(diag.errors,[]);
 assert.equal(diag.disabled,false);assert.equal(host.ownerOps('p1').length,4);
 if(route==='diy')for(const name of ['makoto','amiya3'])assert.ok(host.ownerOps('p1').some(u=>u.diy?.charId==='char_x_marisa_'+name));
});

test('production SES Worker applies and maintains the Rhodes overflow cap', async t => {
 const s=build({});assert.deepEqual(s.problems,[]);
 const host=new WorkerSimHost({workerFactory:()=>{
  const w=new Worker(new URL('../helpers/simWorkerNode.mjs',import.meta.url));
  const port={postMessage:m=>w.postMessage(m),terminate:()=>w.terminate()};
  w.on('message',data=>port.onmessage?.({data}));w.on('error',error=>port.onerror?.({error}));return port;
 }});t.after(()=>host.stop());
 await host.load(s.cs,{cs:s.cs,data:s.data,bounds:s.bounds,hashInput:s.index,scripts:s.scripts});
 const spec=fixtureSpec();spec.cs=s.cs;spec.timeLimit=15;
 spec.players[0].units=[
  {uid:1,chessId:'chess_char_3_21_a',row:10,col:4},
  {uid:2,chessId:'chess_x_marisa_amiya3_a',row:11,col:4},
  {uid:3,chessId:'chess_x_marisa_kalts2_a',row:10,col:7},
 ];
 spec.players[0].bonds={bond_x_marisa_rhodeShip:{active:true,count:2,tier:2,layers:1000}};
 // Keep the battle alive without an enemy entering the operators' skill/attack ranges.
 spec.spawns=[{time:14,enemyKey:'enemy_1001_bigbo',count:1,routeIndex:0}];
 await host.start(spec);for(let i=0;i<8;i++)await host.step(30);
 const unit=host.battle.allyUnits.find(u=>u.uid===1);
 const stats=await host.rpc('unitStats',[unit.id]);
 const diag=await host.rpc('budget',['marisa']);assert.deepEqual(diag.errors,[]);assert.equal(diag.disabled,false);
 assert.equal(stats.atk,stats.base.atk*2,JSON.stringify({time:host.battle.time,bonds:host.packet.players.p1.bonds,stats,diag}));
});

test('native sandbox match child completes real bot rounds including prep hooks', {timeout:120000},async t=>{
 const previous=process.env.SP_PLUGIN_SCRIPTS;process.env.SP_PLUGIN_SCRIPTS='sandbox';
 t.after(()=>{if(previous===undefined)delete process.env.SP_PLUGIN_SCRIPTS;else process.env.SP_PLUGIN_SCRIPTS=previous;});
 const contents=createContentSets({registry,vanillaData:getData()});const r=contents.resolve(['marisa']);assert.ok(r.ok,JSON.stringify(r));
 const quiet={info(){},warn(){},error(...args){console.error(...args);}};
 const hosts=createMatchHosts({contents,log:quiet,options:{virtualTime:true,matchOptions:{botRehearsal:0}}});t.after(()=>hosts.close());
 let finish;const done=new Promise(resolve=>{finish=resolve;});
 const m=hosts.create(r.set.cs,{roomCode:'MARI',mode:'coop',difficulty:'NORMAL',modeId:'mode_multi_normal',
 seats:Array.from({length:4},(_,i)=>({seat:i,playerId:'ai_'+i,name:'Bot '+i,isBot:true,connected:true})),spectators:[],seed:7,matchNo:1,cs:r.set.cs,requireCs:true,
 broadcast(){},send(){return true;},onEnd:finish});m.start();
 const timeout=new Promise((_,reject)=>{const timer=setTimeout(()=>reject(Error('match timeout')),110000);timer.unref();});
 const summary=await Promise.race([done,timeout]);assert.equal(typeof summary.victory,'boolean');
 const diag=await m.diag();assert.equal(diag.errorCount,0,JSON.stringify(diag.errors));assert.equal(diag.simErrors,0);m.dispose();
});
