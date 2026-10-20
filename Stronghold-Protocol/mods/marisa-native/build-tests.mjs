import fs from 'node:fs';
import path from 'node:path';
import {legacy,game,plugin,rename} from './build-profile.mjs';
let test=fs.readFileSync(path.join(legacy,'fixtures/combat-regressions.js'),'utf8');
test=test.replace("import { roomProfile } from '../../server/mods.js';","import {getData} from '../../../server/data.js';").replace("const MOD = roomProfile(['marisa']).data;",'const MOD = getData();');
test=test.replaceAll("'../../server/","'../../../server/").replaceAll("'../helpers/battleHarness.js'","'../../../test/helpers/battleHarness.js'");
// Correct the explicit import added above (the general replacement must not add another level).
test=test.replace("'../../../../server/data.js'","'../../../server/data.js'");
test=test.replace("import { test } from 'node:test';", "import { test as nodeTest } from 'node:test';\nconst test = process.env.SP_PLUGIN_TEST_SET ? nodeTest : nodeTest.skip;");
test=test.replace("import {getData} from '../../../server/data.js';", `import {pathToFileURL} from 'node:url';
import path from 'node:path';
const enabled=!!process.env.SP_PLUGIN_TEST_SET;
const load=rel=>import(pathToFileURL(path.resolve(rel)).href);
const [{getData},{DataSource},{makeBattle,enemyRec,checkInvariants}]=enabled
 ? await Promise.all(['server/data.js','server/sim/simdata.js','test/helpers/battleHarness.js'].map(load))
 : [{getData:()=>({})},{},{}];`)
 .replace("import { DataSource } from '../../../server/sim/simdata.js';",'')
 .replace("import { makeBattle, enemyRec, checkInvariants } from '../../../test/helpers/battleHarness.js';",'');
fs.writeFileSync(path.join(plugin,'test/guard.test.js'),rename(test));
console.log('Ported actual combat regressions to native author harness');
