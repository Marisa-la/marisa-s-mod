// Run the installed plugin's real combat regressions, including Rhodes 3/4-member efficiency.
// The former mock imported private/nonexistent modules and could not test a battle.
import {spawnSync} from 'node:child_process';
const result=spawnSync(process.execPath,['tools/plugin.mjs','test','marisa'],{
 cwd:import.meta.dirname,stdio:'inherit',env:process.env,
});
if(result.error)console.error(result.error.message);
process.exitCode=result.status ?? 1;
