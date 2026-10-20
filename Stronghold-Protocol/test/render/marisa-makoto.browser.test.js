// RENDER_E2E=1 node --test test/render/marisa-makoto.browser.test.js
// Real Persona skeletons, including the outfit: the shipped skill event must keep the model until its real end.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { getData } from '../../server/data.js';
import { applyMarisaProfile } from '../../shared/plugins/profile.js';
import { importScript } from '../../shared/plugins/scriptLoad.js';
import { createSDK } from '../../shared/plugins/sdk.js';
import { DataSource } from '../../server/sim/simdata.js';
import { unitInfo } from '../../server/sim/snapshot.js';
import { makeBattle } from '../helpers/battleHarness.js';
import { fxForm } from '../../shared/protocol.js';

const chrome = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
test('Chrome plays Makoto S2 without premature SwitchOut in either facing or appearance', {
  skip: process.env.RENDER_E2E !== '1' || !existsSync(chrome), timeout: 60000,
}, async t => {
  const read = rel => JSON.parse(readFileSync(new URL(rel, import.meta.url), 'utf8'));
  const manifest = read('../../mods/marisa-native/bundle/marisa/plugin.json');
  const base = getData();
  const { data, problems } = applyMarisaProfile(base, base, read('../../mods/marisa-native/bundle/marisa/data/profile.json'),
    { pluginId: 'marisa', settings: {}, permissions: manifest.permissions });
  assert.deepEqual(problems, []);
  const kit = await importScript(readFileSync(new URL('../../mods/marisa-native/bundle/marisa/sim/index.js', import.meta.url), 'utf8'));
  kit.default(createSDK(manifest));
  const h = makeBattle({ autoFinish: false, data: new DataSource(data, null),
    units: [{ uid: 1, chessId: 'chess_x_marisa_makoto_a', row: 10, col: 4, skillIndex: 1 }] });
  h.step();
  const unit = h.unit(1), info = unitInfo(unit);
  unit.skill.gainSp(999); assert.equal(unit.skill.activate('test'), true); h.step();
  const event = h.events.find(ev => ev[4]?.id === unit.id && fxForm(ev) === 'doll2');
  assert.ok(event);
  const { startServer } = await import('../../server/index.js');
  const puppeteer = (await import('puppeteer-core')).default;
  const srv = await startServer({ port: 0, host: '127.0.0.1', quiet: true });
  t.after(() => srv.close());
  const browser = await puppeteer.launch({ executablePath: chrome, headless: true, args: ['--no-sandbox', '--no-first-run'] });
  t.after(() => browser.close());
  const page = await browser.newPage(), errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(`http://127.0.0.1:${srv.port}/dev/render-demo.html?scene=normal-m01&paused=1&panel=0&board=2d&fx=off`);
  await page.waitForFunction(() => window.__demo?.ready || window.__demo?.error, { timeout: 30000 });
  const samples = await page.evaluate(async (info, event) => {
    const { UnitView } = await import('/js/render/units.js');
    const ctx = window.__demo.view.debug.ctx, cam = window.__demo.view.debug.cam, result = [];
    for (const dir of ['RIGHT', 'UP']) for (const skin of [null, 'char_4217_makoto@p3r#1']) {
      const view = new UnitView(ctx, { ...info, dir, skin });
      try {
        const until = Date.now() + 15000;
        while (!view.actor && Date.now() < until) await new Promise(resolve => setTimeout(resolve, 20));
        if (!view.actor) throw Error('Makoto skeleton did not load');
        view.setSkill(true); view.setForm(event[4].form, event[4]);
        for (let i = 0; i < 90; i++) {
          view.update(1 / 30, cam, i / 30);
          if (view.actor.current.includes('SwitchOut')) throw Error(`active S2 played ${view.actor.current}: ${dir}, ${skin}`);
        }
        view.onAttack(null, 4); view.update(1 / 30, cam, 4);
        const pose = () => view.actor.spine.skeleton.bones.map(b => [b.x, b.y, b.rotation, b.scaleX, b.scaleY]);
        const before = pose();
        for (let i = 0; i < 8; i++) view.update(1 / 30, cam, 4 + i / 30);
        const after = pose();
        result.push({ dir, skin, clip: view.actor.current, changedBones: before.filter((b, i) => JSON.stringify(b) !== JSON.stringify(after[i])).length });
      } finally { view.destroy(); }
    }
    return result;
  }, info, event);
  assert.equal(samples.length, 4);
  for (const row of samples) {
    assert.equal(row.clip, 'Doll_Skill_2_Loop', JSON.stringify(row));
    assert.ok(row.changedBones > 0, `the real attack animation must move: ${JSON.stringify(row)}`);
  }
  assert.deepEqual(errors, []);
});
