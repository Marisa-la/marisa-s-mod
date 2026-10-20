// SP_E2E=1 node --test test/ui/marisa-native.e2e.test.js (coordinator: run this file alone).
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {Client,hasChrome,sleep,ROOT} from '../e2e/client.mjs';
import {scriptFixture} from '../helpers/scriptFixtures.js';
import {startServer} from '../../server/index.js';
const enabled=process.env.SP_E2E==='1' && hasChrome();
test('both added operators can switch between shop and DIY through the manager and start a verified sandbox battle', {skip:!enabled,timeout:300000},async t=>{
 const previous=process.env.SP_PLUGIN_SCRIPTS;process.env.SP_PLUGIN_SCRIPTS='sandbox';
 t.after(()=>{if(previous===undefined)delete process.env.SP_PLUGIN_SCRIPTS;else process.env.SP_PLUGIN_SCRIPTS=previous;});
 const srv=await startServer({port:0,host:'127.0.0.1',quiet:true,pluginsDir:ROOT+'/plugins',assetIndex:false,matchHost:{matchOptions:{verify:'all',timerScale:0.1,combatSpeed:16,botRehearsal:0}}});
 t.after(()=>srv.close());
 const policy=(await fetch(srv.url)).headers.get('content-security-policy');
 assert.match(policy,/connect-src 'self';/);assert.ok(!/script-src[^;]*(?:data:|blob:|unsafe-eval)/.test(policy));
 const P=(await import('puppeteer-core')).default;
 const host=new Client(P,srv.url,'host',{prefix:'marisa-native',w:1600,h:900}), guest=new Client(P,srv.url,'guest',{prefix:'marisa-native',w:1600,h:900});
 t.after(async()=>{await host.close();await guest.close();});
 await host.open();await host.enter('凯尔希');await host.click('.mode-card','同盟模拟');await host.click('.diff-card','标准模拟');await host.click('.create-box button','创建同盟');
 const code=(await host.waitFor(s=>!!s.room?.code,'room created')).room.code;
 await guest.open();await guest.enter('阿米娅');await guest.click('.join-row input');await guest.page.keyboard.type(code);await guest.click('.join-row button','加入同盟');await guest.page.waitForSelector('.room-screen');
 await host.page.evaluate(()=>globalThis.__SP__.net.request('room.setPlugins',{plugins:[{id:'marisa'}]}));
 for(const c of [host,guest])await c.page.waitForFunction(()=>globalThis.__SP__.store.get().room?.content?.execution==='sandbox');
 await host.click('[data-testid="plugin-tag"]');
 await host.page.waitForSelector('[data-plugin="marisa"]');
 assert.match(await host.page.$eval('[data-plugin="marisa"]',e=>e.textContent),/脚本（沙箱）/);
 await host.page.waitForSelector('[data-testid="marisa-settings"]');
 await host.page.evaluate(()=>{for(const e of document.querySelectorAll('.mod-manager__group'))e.open=true;});
 const route='[data-testid="marisa-settings"] .mod-manager__list--operators select';
 for(const [makoto,amiya]of [['diy','shop'],['shop','diy'],['diy','diy']]){
  const selects=await host.page.$$(route);assert.equal(selects.length,2);
  await selects[0].select(makoto);await selects[1].select(amiya);
  await host.page.waitForFunction(()=>!document.querySelector('[data-testid="marisa-settings"] button[type="submit"]').disabled);
  await host.page.$eval('[data-testid="marisa-settings"] button[type="submit"]',e=>e.scrollIntoView({block:'center'}));
  await host.click('[data-testid="marisa-settings"] button','应用设置');
  for(const c of [host,guest])await c.page.waitForFunction((m,a)=>{
   const p=globalThis.__SP__.store.get().room.content.plugins.find(p=>p.id==='marisa');
   return p?.settings?.add_makoto===m&&p?.settings?.add_amiya3===a;
  },{timeout:30000},makoto,amiya);
 }
 await host.page.screenshot({path:ROOT+'/test/e2e/out/marisa-native-manager.png'});

 await host.click('.modal__actions button','完成');
 for(const c of [host,guest]) {
  assert.equal(await c.page.$('[data-testid="trusted-banner"]'),null);
  assert.equal(await c.page.evaluate(()=>globalThis.__SP__.store.get().room.content.trusted),undefined);
 }
 for(const c of [host,guest])await c.page.waitForFunction(()=>globalThis.__SP__.store.get().room.seats.filter(s=>s&&!s.isBot).every(s=>s.content==='ready'));
 await guest.click('.room-bar__right button','准备就绪');await host.click('.room-bar__right button','开始模拟');
 await host.waitFor(s=>s.phase==='COMBAT','battle',120000);
 await host.page.waitForFunction(()=>[...globalThis.__SP_RUNNER__._entries.values()].some(e=>
   e.host?.remote && e.host.worker instanceof Worker && !e.battle.step && !e.battle.data));
 assert.equal(srv.lobby.getRoom(code).content.execution,'sandbox');
 const match=srv.lobby.getRoom(code).match;let accepted=false,last;
 for(const begin=Date.now();Date.now()-begin<90000;){last=await match.diag();if(last.verifyStats?.verified>0 || last.fields?.some(f=>f.done&&f.resultSource==='client')){accepted=true;break;}await sleep(100);}
 assert.ok(accepted,JSON.stringify(last));assert.equal(last.verifyStats.rejected,0);
 for(const c of [host,guest])assert.equal(await c.page.$('[data-testid="trusted-banner"]'),null);
});
