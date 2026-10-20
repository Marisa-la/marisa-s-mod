import {test} from 'node:test';
import assert from 'node:assert/strict';
import childProcess from 'node:child_process';
import {syncBuiltinESMExports} from 'node:module';
import {scriptFixture} from '../helpers/scriptFixtures.js';
import {buildContentSet} from '../../server/plugins/contentSet.js';

test('a timed-out script preflight can recover when the host reapplies the same DIY settings',t=>{
 const f=scriptFixture(t,{mode:'sandbox'});
 f.put('demo','export default sp => sp.kits.register("char_x_demo_guard",()=>({}));',{
  settings:{route:{type:'enum',options:['shop','diy'],default:'shop'}},
 });
 const spawn=childProcess.spawnSync;
 let attempts=0;
 t.mock.method(childProcess,'spawnSync',(...args)=>{
  attempts++;
  // Deterministically reproduce a cold child exceeding its startup watchdog.
  return attempts===1?{error:Object.assign(Error('startup timeout'),{code:'ETIMEDOUT'}),signal:'SIGKILL',status:null,output:[]} : spawn(...args);
 });
 syncBuiltinESMExports();
 t.after(()=>{t.mock.restoreAll();syncBuiltinESMExports();});
 const options={registry:f.registry,ids:[{id:'demo',settings:{route:'diy'}}]};
 const failed=buildContentSet(options);
 assert.equal(failed.problems[0].code,'PLUGIN_SCRIPT_CHECK');
 assert.match(failed.problems[0].message,/exceeded/);
 const retried=buildContentSet(options);
 assert.deepEqual(retried.problems,[],'reapply must retry a terminated process, rather than permanently reject valid settings');
 assert.equal(attempts,2);
 assert.equal(buildContentSet(options).cs,retried.cs);assert.equal(attempts,2,'successful probes remain cached');
});
