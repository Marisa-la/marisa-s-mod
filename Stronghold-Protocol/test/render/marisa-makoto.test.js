import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { installFakePixi, fakeViewCtx } from './fakepixi.js';
import { presetCamera } from '../../public/js/render/projection.js';
import { spineEntry, hasBackSpine } from '../../public/js/assets.js';
import { importScript } from '../../shared/plugins/scriptLoad.js';
import { createSDK } from '../../shared/plugins/sdk.js';
import { applyMarisaProfile } from '../../shared/plugins/profile.js';
import { getData } from '../../server/data.js';
import { DataSource } from '../../server/sim/simdata.js';
import { unitInfo } from '../../server/sim/snapshot.js';
import { makeBattle, enemyRec } from '../helpers/battleHarness.js';
import { fxForm } from '../../shared/protocol.js';

const assets = JSON.parse(readFileSync(new URL('../../data/assets.json', import.meta.url), 'utf8'));
let fake, UnitView;
before(async () => { fake = installFakePixi(); ({ UnitView } = await import('../../public/js/render/units.js')); });
after(() => fake.restore());
const cam = () => presetCamera('normal', { width: 1280, height: 720 });
const tick = () => new Promise(resolve => setImmediate(resolve));

test('the shipped Makoto kit sends a playable form and attacks through the actual view event path', async () => {
  const read = rel => JSON.parse(readFileSync(new URL(rel, import.meta.url), 'utf8'));
  const manifest = read('../../mods/marisa-native/bundle/marisa/plugin.json');
  const base = getData();
  const composed = applyMarisaProfile(base, base, read('../../mods/marisa-native/bundle/marisa/data/profile.json'),
    { pluginId: 'marisa', settings: {}, permissions: manifest.permissions });
  const kit = await importScript(readFileSync(new URL('../../mods/marisa-native/bundle/marisa/sim/index.js', import.meta.url), 'utf8'));
  kit.default(createSDK(manifest));
  const h = makeBattle({ autoFinish: false, captureNoisy: true,
    data: new DataSource({ ...composed.data, enemies: { dummy: enemyRec({ key: 'dummy', hp: 1e8, atk: 0, speed: 0 }) } }, null),
    units: [{ uid: 1, chessId: 'chess_x_marisa_makoto_a', row: 10, col: 4, skillIndex: 1 }],
  });
  h.step();
  const u = h.unit(1);
  const info = unitInfo(u);
  const store = { picture: () => null, image: async () => null,
    hasBack: id => hasBackSpine(assets, id), spineEntry: (id, opts) => spineEntry(assets, id, opts),
    spine: { acquire: async entry => ({ animations: Object.keys(entry.animations).map(name => ({ name })) }), release() {} } };
  const view = new UnitView(fakeViewCtx(fake.P, { assets: store, cam }), info);
  await tick(); await tick();
  u.skill.gainSp(999);
  assert.equal(u.skill.activate('test'), true);
  h.spawn('dummy', { pos: [10, 5] });
  h.run(4);
  const form = h.events.find(ev => ev[4]?.id === u.id && fxForm(ev) === 'doll2');
  assert.ok(form, 'the real skill emits the Persona change');
  view.setSkill(true);
  view.setForm(fxForm(form), form[4]);
  for (let i = 0; i < 120; i++) {
    view.update(1 / 60, cam(), i / 60);
    assert.notEqual(view.actor.current, 'Doll_Skill_2_SwitchOut', 'the active Persona must not play its exit before attacking');
  }
  assert.ok(h.hooksOf('damaged').some(c => c.source === u && c.dmg.isAttack), 'the real Persona attacks');
  view.onAttack(null, 4);
  assert.equal(view.actor.current, 'Doll_Skill_2_Loop');
  assert.deepEqual(h.b.errors, []);
  view.destroy();
});

for (const [index, form, attack] of [[0, 'doll1', 'Doll_Skill_1_Attack'], [1, 'doll2', 'Doll_Skill_2_Loop'], [2, 'doll3p1', 'Doll_Skill_3_P1_Attack_A']]) {
  test(`Makoto S${index + 1} switches from his base pose to the Persona attack clip`, async () => {
    const store = { picture: () => null, image: async () => null,
      hasBack: id => hasBackSpine(assets, id), spineEntry: (id, opts) => spineEntry(assets, id, opts),
      spine: { acquire: async entry => ({ animations: Object.keys(entry.animations).map(name => ({ name })) }), release() {} } };
    const view = new UnitView(fakeViewCtx(fake.P, { assets: store, cam }), {
      id: 1, kind: 'op', side: 'ally', defId: 'chess_x_marisa_makoto_a', spine: 'char_x_marisa_makoto',
      tier: 5, x: 4, y: 10, maxHp: 3000, dir: 'RIGHT', skillIndex: index,
    });
    await tick(); await tick();
    assert.ok(view.actor);
    view.setSkill(true);
    view.setForm(form);
    for (let i = 0; i < 120; i++) view.update(1 / 60, cam(), i / 60);
    view.onAttack(null, 3);
    assert.equal(view.actor.current, attack);
    view.destroy();
  });
}
