import { test as nodeTest } from 'node:test';
const test = process.env.SP_PLUGIN_TEST_SET ? nodeTest : nodeTest.skip;
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import path from 'node:path';
const enabled=!!process.env.SP_PLUGIN_TEST_SET;
const load=rel=>import(pathToFileURL(path.resolve(rel)).href);
const [{getData},{DataSource},{makeBattle,enemyRec,checkInvariants}]=enabled
 ? await Promise.all(['server/data.js','server/sim/simdata.js','test/helpers/battleHarness.js'].map(load))
 : [{getData:()=>({})},{},{}];



const MOD = getData();
const AMIYA = 'chess_x_marisa_amiya3';
const MAKOTO = 'chess_x_marisa_makoto';
const ANCHOR = 'token_x_marisa_10068_kalts2_mtship';
const approx = (a, b, msg) => assert.ok(Math.abs(a - b) < 1e-6 * Math.max(1, Math.abs(b)), `${msg}: ${a} != ${b}`);
const tags = (c, tag) => c.dmg?.tags?.includes(tag);
const LIFTOFF = 1024; // shared/constants.js UF.LIFTOFF, the snapshot wire flag (not UF.FLYING).
const hasLiftoff = (h, u) => !!(h.snapshot().units.find(t => t[0] === u.id)?.[7] & LIFTOFF);

function field({ id = AMIYA, form = 'a', skill = 0, units = [], enemies = {}, ...opts } = {}) {
  return makeBattle({
    timeLimit: 120, autoFinish: false, captureNoisy: true,
    data: new DataSource({ ...MOD, enemies: {
      dummy: enemyRec({ key: 'dummy', hp: 1e7, atk: 0, speed: 0 }), ...enemies,
    } }, null),
    units: [{ uid: 1, chessId: `${id}_${form}`, skillIndex: skill, row: 10, col: 4 }, ...units],
    ...opts,
  });
}
function cast(u) { u.skill.gainSp(999); assert.equal(u.skill.activate('test'), true); }
function clean(h) { checkInvariants(h.b); assert.deepEqual(h.b.errors, []); }

for (const form of ['a', 'b']) {
  test(`Amiya S1 ${form}: extra healing requires an active skill and an ordinary attack hit`, () => {
    const h = field({ form, units: [{ uid: 2, chessId: 'chess_char_1_02_a', row: 11, col: 4 }] });
    h.step(); const u = h.unit(1), ally = h.unit(2);
    const e = h.spawn('dummy', { pos: [10, 5] });
    h.b.loseHp(ally, ally.hp * 0.8);
    h.run(3);
    assert.ok(h.hooksOf('damaged').some(c => c.source === u && c.dmg.isAttack), 'ordinary attack actually landed');
    const extras = () => h.hooksOf('heal').filter(c => c.source === u && c.opts?.tags?.includes('amiya3_s1'));
    assert.equal(extras().length, 0, 'no S1 bonus while inactive');
    cast(u); h.b.loseHp(ally, ally.hp * 0.5); h.run(3);
    assert.ok(extras().length > 0, 'S1 bonus is present during real attack');
    const count = extras().length;
    h.b.dealDamage(u, e, { amount: 100, type: 'arts', tags: ['bond:bond_x_marisa_rhodeShip'] });
    assert.equal(extras().length, count, 'bond damage must not masquerade as an attack');
    u.skill.end('test'); h.b.loseHp(ally, ally.hp * 0.5); h.run(3);
    assert.equal(extras().length, count, 'bonus ends with the skill'); clean(h);
  });

  test(`Amiya S2 ${form}: target stacks strengthen the opening burst and expire with the skill; once per battle`, () => {
    const h = field({ form, skill: 1 }); h.step(); const u = h.unit(1);
    for (let i = 0; i < 7; i++) h.spawn('dummy', { pos: [10, 5] });
    h.step(); // Enemy spatial indexing advances on the simulation tick.
    const baseAtk = u.s.atk, bb = MOD.chess[`${AMIYA}_${form}`].skills[1].bb;
    cast(u);
    const hits = h.hooksOf('damaged').filter(c => c.source === u && tags(c, 'amiya3Burst'));
    assert.equal(hits.length, 7); assert.equal(u.mem.amiya3S2Stacks, bb.max_stack_cnt);
    for (const hit of hits) approx(hit.amount, baseAtk * (1 + bb.atk * bb.max_stack_cnt) * bb.atk_scale, 'opening burst uses capped stacks');
    h.run(3);
    assert.ok(h.hooksOf('damaged').some(c => c.source === u && c.dmg.isAttack && c.type === 'true'), 'subsequent ordinary attacks are true damage');
    u.skill.end('test'); approx(u.s.atk, baseAtk, 'temporary stacks expire');
    u.skill.gainSp(999); assert.equal(u.skill.activate('test'), false, 'second cast refused');
    h.b.retreat(u); assert.equal(h.b.redeploy(u, { free: true }), true);
    u.skill.gainSp(999); assert.equal(u.skill.activate('test'), false, 'redeploy does not reset the battle limit'); clean(h);
  });

  test(`Makoto S3 ${form}: actual attacks choose the weaker physical/arts resistance per enemy`, () => {
    const h = field({ id: MAKOTO, form, skill: 2, enemies: {
      resistArts: enemyRec({ key: 'resistArts', hp: 1e7, atk: 0, def: 0, res: 90, speed: 0 }),
      resistPhys: enemyRec({ key: 'resistPhys', hp: 1e7, atk: 0, def: 1e6, res: 0, speed: 0 }),
    } });
    h.step(); const u = h.unit(1); cast(u); h.run(1.1);
    const physical = h.spawn('resistArts', { pos: [10, 5] });
    const arts = h.spawn('resistPhys', { pos: [11, 4] }); h.run(3);
    const hits = h.hooksOf('damaged').filter(c => c.source === u && c.dmg.isAttack);
    assert.ok(hits.some(c => c.target === physical && c.type === 'phys'), 'high RES target takes physical weakness damage');
    assert.ok(hits.some(c => c.target === arts && c.type === 'arts'), 'high DEF target takes arts weakness damage'); clean(h);
  });

  test(`Makoto ${form}: another unit dying cannot trigger his substitute-end burst`, () => {
    const h = field({ id: MAKOTO, form, skill: 0 }); h.step(); const u = h.unit(1);
    cast(u); h.run(1.1); const victim = h.spawn('dummy', { pos: [10, 5] });
    h.spawn('dummy', { pos: [11, 4] });
    h.b.loseHp(victim, 1e9);
    assert.equal(h.hooksOf('damaged').filter(c => tags(c, 'makotoSees')).length, 0, 'unrelated death is not a state transition');
    h.run(21);
    assert.ok(h.hooksOf('damaged').some(c => tags(c, 'makotoSees')), 'own timed substitute end still bursts'); clean(h);
  });
}

test('Kun activates through the real Egir opening chain, revives each victim once, and attacks/blocks air', () => {
  const h = field({ id: 'chess_char_1_04', skill: 0, bandId: 'band_x_marisa_kun',
    bonds: { egirShip: { active: true, count: 3, tier: 1, layers: 0 } },
    units: [
      { uid: 2, chessId: 'chess_char_2_07_a', row: 10, col: 5 },
      { uid: 3, chessId: 'chess_char_3_09_a', row: 10, col: 6 },
      { uid: 4, chessId: 'chess_char_1_08_a', row: 10, col: 7 },
    ], enemies: { fly: enemyRec({ key: 'fly', hp: 1e7, speed: 0, motion: 'FLY' }) },
  });
  h.step(); const u = h.unit(1);
  const deaths = h.hooksOf('death').filter(c => c.reason === 'killed');
  assert.equal(deaths.length, 3, 'real devour killed exactly the three marked operators');
  assert.ok(u.s.flags.liftoff && u.s.flags.blockFly && u.profile.canHitFly);
  assert.ok(hasLiftoff(h, u), 'Kun takeoff reaches the renderer through the common wire flag');
  for (const uid of [2, 3, 4]) {
    assert.ok(h.unit(uid).alive);
    assert.equal(h.hooksOf('deploy').filter(c => c.unit === h.unit(uid)).length, 2, 'one opening deploy and one revive');
  }
  const fly = h.spawn('fly', { pos: [10, 4.2] }); h.run(3);
  assert.equal(fly.blockedBy, u);
  assert.ok(h.hooksOf('damaged').some(c => c.source === u && c.target === fly), 'air unit actually attacked');
  clean(h);
});

test('liftoff wire flag covers skill flight, deployment flight and landing without Kun', () => {
  for (const id of ['chess_x_marisa_aglna2', 'chess_char_2_13']) {
    const h = field({ id, skill: 0 }); h.step(); const u = h.unit(1);
    if (!u.skill.active) cast(u);
    assert.ok(u.s.flags.liftoff, `${id}: real skill takes off`);
    assert.ok(hasLiftoff(h, u), `${id}: common flag is set without a band`);
    u.skill.end('test');
    assert.ok(!u.s.flags.liftoff && !hasLiftoff(h, u), `${id}: landing clears the flag`);
    clean(h);
  }
  const h = field({ id: 'chess_x_marisa_kalts2' }); h.step();
  assert.ok(hasLiftoff(h, h.unit(1)), 'Kaltsit talent flight also carries the common flag'); clean(h);
});

for (const layers of [0, 154]) test(`reported bent Egir chain at ${layers} layers preserves original Kun revival`, () => {
  const units = [
    { uid: 1, diy: { slot: 6, charId: 'char_003_kalts', skillIndex: 0 }, row: 5, col: 4, dir: 'DOWN', abs: true },
    ...[
      ['chess_char_4_12_a', 4, 4, 'DOWN'], ['chess_char_1_04_a', 3, 4, 'DOWN'],
      ['chess_char_3_05_a', 2, 4, 'RIGHT'], ['chess_char_6_16_a', 2, 5, 'RIGHT'],
      [`${AMIYA}_a`, 2, 6, 'UP'], ['chess_char_4_21_a', 3, 6, 'LEFT'], ['chess_char_3_21_a', 4, 6, 'LEFT'],
    ].map(([chessId, row, col, dir], i) => ({ uid: i + 2, chessId, row, col, dir, abs: true })),
  ];
  const h = makeBattle({ kind: 'boss', data: new DataSource(MOD), units, autoFinish: false, captureNoisy: true,
    bandId: 'band_x_marisa_kun', bonds: { egirShip: { active: true, count: 3, tier: 1, layers },
      bond_x_marisa_rhodeShip: { active: true, count: 3, tier: 2, layers: 28 } },
  });
  h.step();
  assert.equal(h.hooksOf('death').filter(c => c.reason === 'killed').length, layers ? 2 : 3);
  assert.equal(h.hooksOf('deploy').filter(c => !c.initial).length, layers ? 0 : 3);
  assert.deepEqual(h.allies().filter(u => u.s.flags.liftoff).map(u => u.uid), layers ? [] : [2]);
  assert.ok(!h.hooksOf('damaged').some(c => c.target === h.unit(6) && tags(c, 'bond:egir:devour')),
    'chain stops at non-Egir Lumen and never reaches Amiya');
  clean(h);
});

test('Rhodes feedback is bounded with an injured incantation medic and a real adjacent enemy', () => {
  const h = field({ skill: 0, bonds: { bond_x_marisa_rhodeShip: { active: true, count: 2, tier: 2, layers: 100 }, miraShip: { active: true, count: 2, tier: 1, layers: 100 } },
    units: [{ uid: 2, chessId: 'chess_x_marisa_kalts2_a', row: 11, col: 4 }],
  });
  h.step(); const u = h.unit(1), healer = h.unit(2); h.spawn('dummy', { pos: [10, 5] }); h.step();
  h.b.loseHp(u, u.hp * 0.8); const start = h.hooksOf('damaged').length;
  h.b.heal(healer, u, 50);
  const feedback = h.hooksOf('damaged').slice(start).filter(c => tags(c, 'bond:bond_x_marisa_rhodeShip'));
  assert.equal(feedback.length, 1, 'one outer strike, no recursive extra strike');
  // Keep the renderer's canonical origin intact when build-tests namespaces the gameplay bond ids.
  const origin = 'bond:rhode' + 'Ship';
  assert.ok(h.eventsOf('dmg').some(e => e[5] === origin), 'the real healing strike carries its bond visual origin');
  assert.ok(h.hooksOf('heal').some(c => c.source === u && c.opts?.tags?.includes('incantation')), 'incantation feedback really happened');
  h.run(5); clean(h);
});

for (const [label, fourth, expected] of [
  ['three members', null, [0, 1, 1, 2, 2, 3]],
  ['four distinct members', 'chess_char_5_04_a', [1, 2, 3, 4, 5, 6]],
  ['three members plus an elite duplicate', `${AMIYA}_b`, [0, 1, 1, 2, 2, 3]],
]) test(`Rhodes mirror applies field stacking efficiency: ${label}`, () => {
  const h = field({
    bonds: {
      bond_x_marisa_rhodeShip: { active: true, count: fourth ? 4 : 3, tier: 2, layers: 0 },
      lateranoShip: { active: true, count: 2, tier: 1, layers: 0 },
    },
    units: [
      { uid: 2, chessId: 'chess_char_4_26_a', row: 11, col: 4 },
      { uid: 3, chessId: 'chess_x_marisa_kalts2_a', row: 10, col: 7 },
      { uid: 9, chessId: 'chess_char_3_21_a', row: 10, col: 5 },
      ...(fourth ? [{ uid: 4, chessId: fourth, row: 11, col: 7 }] : []),
    ],
  });
  h.step();
  const source = h.unit(9), state = h.b.getPlayer('p1');
  assert.ok(source.alive && source.deployed, 'the non-member source is actually on the field');
  const observed = [];
  for (let i = 0; i < 6; i++) {
    assert.equal(h.b.addLayers('p1', 'lateranoShip', 1, 'test', { source }), 1);
    observed.push(state.bonds.bond_x_marisa_rhodeShip.layers);
  }
  assert.deepEqual(observed, expected, 'real mirrored gains retain half-layer fractions below four members');
  assert.equal(state.bonds.lateranoShip.layers, 6, 'the triggering bond gains the same six layers in every lineup');
  if (fourth === 'chess_char_5_04_a') {
    h.b.retreat(h.unit(4));
    assert.equal(h.b.addLayers('p1', 'lateranoShip', 2, 'test', { source }), 2);
    assert.equal(state.bonds.bond_x_marisa_rhodeShip.layers, 7, 'withdrawing the fourth member immediately restores 50% efficiency');
  }
  clean(h);
});

for (const [label, mods, cultivate] of [
  ['ATK +50%', { atkPct: 0.5 }, 1],
  ['ATK +100%', { atkPct: 1 }, 1],
  ['ATK +200%', { atkPct: 2 }, 1],
  ['final multiplier and cultivation', { atkPct: 1, atkMul: 1.5 }, 0.8],
]) test(`Rhodes overflow is 1:1 and capped at actual own ATK: ${label}`, () => {
  const h = field({ id: 'chess_char_3_21', bonds: { bond_x_marisa_rhodeShip: { active: true, count: 2, tier: 2, layers: 100 } },
    units: [{ uid: 2, chessId: `${AMIYA}_a`, row: 11, col: 4 },
      { uid: 3, chessId: 'chess_x_marisa_kalts2_a', row: 10, col: 5 }],
  });
  h.step(); const u = h.unit(1);
  u.cultMul = { hp: 1, atk: cultivate, def: 1 };
  h.b.addBuff(u, { key: 'test:atk', mods, duration: 100 });
  const own = u.s.atk;
  h.run(0.6);
  // At full HP the first pulse overflows in full. The aura heals 100 layers × healingTakenMul.
  approx(u.s.atk - own, 100 * u.s.healingTakenMul, 'overflow converts to actual ATK 1:1');
  h.run(8);
  approx(u.s.atk - own, own, 'actual bonus is capped at 100% of own ATK');
  h.b.removeBuff(u, 'test:atk'); h.step();
  const afterSkill = u.base.atk * cultivate;
  approx(u.s.atk - afterSkill, afterSkill, 'losing a skill buff lowers the cap without waiting for another heal');
  h.b.addBuff(u, { key: 'test:atk', mods, duration: 100 });
  h.b.addBuff(u, { key: 'test:noheal', flags: { noHeal: true }, duration: 10 });
  h.run(2.2);
  approx(u.s.atk, own, 'bonus expires without another overflow');
  clean(h);
});

test('Rhodes cap drops before an attack on the natural skill-ending tick', () => {
  const h = field({ id: 'chess_char_3_21', skill: 2,
    bonds: { bond_x_marisa_rhodeShip: { active: true, count: 2, tier: 2, layers: 1000 } },
    units: [{ uid: 2, chessId: `${AMIYA}_a`, row: 11, col: 4 },
      { uid: 3, chessId: 'chess_x_marisa_kalts2_a', row: 10, col: 5 }],
  });
  h.step(); const u = h.unit(1); cast(u); h.run(0.6);
  h.spawn('dummy', { pos: [10, 5] }); h.step();
  u.skill.timeLeft = h.b.dt; u.atkCd = 0;
  let attackAtk = null;
  h.b.on('beforeAttack', ({ attacker }) => { if (attacker === u) attackAtk = u.s.atk; }, { priority: -2000 });
  h.step();
  assert.equal(u.skill.active, false, 'real S3 ends naturally in the ally phase');
  assert.notEqual(attackAtk, null, 'an ordinary attack follows the skill ending in the same tick');
  approx(attackAtk, u.base.atk * 2, 'same-tick attack uses the reduced Rhodes cap');
  approx(u.s.atk, u.base.atk * 2, 'end-of-tick stats use the reduced Rhodes cap');
  clean(h);
});

test('Rhodes cap drops when a later-added ATK buff expires before a same-tick attack', () => {
  const h = field({ id: 'chess_char_3_21', skill: 2,
    bonds: { bond_x_marisa_rhodeShip: { active: true, count: 2, tier: 2, layers: 1000 } },
    units: [{ uid: 2, chessId: `${AMIYA}_a`, row: 11, col: 4 },
      { uid: 3, chessId: 'chess_x_marisa_kalts2_a', row: 10, col: 5 }],
  });
  h.step(); const u = h.unit(1); h.run(0.6);
  h.b.addBuff(u, { key: 'test:late-atk', mods: { atkPct: 2 }, duration: 100 }); h.run(0.6);
  h.spawn('dummy', { pos: [10, 5] }); h.step();
  u.findBuff('test:late-atk').timeLeft = h.b.dt; u.atkCd = 0;
  let attackAtk = null;
  h.b.on('beforeAttack', ({ attacker }) => { if (attacker === u) attackAtk = u.s.atk; }, { priority: -2000 });
  h.step();
  assert.equal(u.findBuff('test:late-atk'), null, 'later buff expires after the earlier Rhodes onTick');
  assert.notEqual(attackAtk, null, 'an ordinary attack follows the buff expiry in the same tick');
  approx(attackAtk, u.base.atk * 2, 'same-tick attack uses the reduced Rhodes cap');
  approx(u.s.atk, u.base.atk * 2, 'end-of-tick stats use the reduced Rhodes cap');
  clean(h);
});

test('all four kits plus placed anchor stay deterministic across twelve seeds and three field kinds', () => {
  const run = (seed, kind) => {
    const h = field({ id: MAKOTO, form: seed % 2 ? 'a' : 'b', skill: seed % 3, seed, kind,
      units: [
        { uid: 2, chessId: `chess_char_1015_aglna2_${seed % 2 ? 'a' : 'b'}`, skillIndex: seed % 3, row: 11, col: 4 },
        { uid: 3, chessId: 'chess_x_marisa_kalts2_b', skillIndex: 2, row: 10, col: 6 },
        { uid: 4, chessId: 'chess_x_marisa_amiya3_b', skillIndex: seed % 2, row: 11, col: 6 },
        { uid: 5, kind: 'token', tokenId: ANCHOR, ownerUid: 3, row: 10, col: 7 },
      ],
    });
    h.step();
    const r = kind === 'boss' ? 3 : 10;
    for (let i = 0; i < 4; i++) h.spawn('dummy', { pos: [r + i % 2, 5 + i % 3] });
    for (const u of h.allies()) if (u.kind === 'op') u.skill.gainSp(999);
    for (let i = 0; i < 30; i++) { h.run(1); clean(h); }
    return [h.result(), h.snapshot(), h.events];
  };
  for (const kind of ['normal', 'unite', 'boss']) {
    for (let seed = 1; seed <= 12; seed++) assert.deepEqual(run(seed, kind), run(seed, kind), `${kind} seed=${seed}`);
  }
});
