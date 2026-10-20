import fs from 'node:fs';
import path from 'node:path';
import {legacy,game,rename} from './build-profile.mjs';
let source=fs.readFileSync(path.join(legacy,'tools/mod-test.source.js'),'utf8');
source=source.replace("import { roomProfile } from '../server/mods.js';",`import {prepareMarisaTest} from './marisa-test-runtime.mjs';
const roomProfile=await prepareMarisaTest();`);
source=source.replace("mods: profile.mods, contentHash: profile.contentHash,","cs: profile.cs,");
source=source.replace("return { recording: { version: 1,", "return { recording: { data, cs: profile.cs, version: 1,");
fs.writeFileSync(path.join(game,'tools/mod-test.mjs'),rename(source));
let demo=fs.readFileSync(path.join(game,'public/dev/render-demo.js'),'utf8');
demo=demo.replace("  await data.loadAll('chess',",`  if(q.get('scene')==='mod-test'){
    const rec=await fetch('/dev/recordings/mod-test.json').then(r=>r.json());
    if(rec.data)data.setContent({id:rec.cs,values:rec.data});
  }
  await data.loadAll('chess',`);
demo=demo.replace("  const scenes = [{ name: 'prep'", "  const generated=q.get('scene')==='mod-test'?[{name:'mod-test',title:t('单场测试'),rec:{file:'mod-test.json'}}]:[];\n  const scenes = [...generated,{ name: 'prep'");
fs.writeFileSync(path.join(game,'public/dev/render-demo.js'),demo);
console.log('Native single-battle tool migrated');
