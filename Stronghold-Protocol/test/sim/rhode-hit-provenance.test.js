// Rhodes heals deal a separate bond strike: preserve its visual origin without changing damage or credit.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { makeBattle, chessRec, enemyRec } from '../helpers/battleHarness.js';

test('only Rhodes strikes append the display provenance; ordinary damage keeps its four-element tuple', () => {
  const h = makeBattle({
    defs: {
      chess: { test_healed: chessRec({ id: 'test_healed', skill: null }) },
      enemies: { enemy_test_target: enemyRec({ key: 'enemy_test_target', hp: 1e6, speed: 0, def: 0, res: 0 }) },
    },
    units: [{ chessId: 'test_healed', row: 9, col: 5 }],
    enemies: [{ key: 'enemy_test_target', pos: [9, 6] }], content: 'none',
  });
  h.step();
  const source = h.unit('test_healed'), target = h.enemy('enemy_test_target');
  h.b.drainEvents();
  for (const tag of ['bond:rhodeShip', 'bond:bond_x_marisa_rhodeShip']) {
    const before = source.stats.dmg;
    h.b.dealDamage(source, target, { amount: 100, type: 'arts', canDodge: false, tags: [tag, 'weakness'] });
    const marked = h.b.drainEvents().find(e => e[0] === 'dmg');
    assert.deepEqual(marked, ['dmg', target.id, 100, 'arts', null, 'bond:rhodeShip'], tag);
    assert.equal(source.stats.dmg - before, 100, 'damage remains credited to the healed operator');
  }
  h.b.dealDamage(source, target, { amount: 100, type: 'arts', canDodge: false });
  const plain = h.b.drainEvents().find(e => e[0] === 'dmg');
  assert.deepEqual(plain, ['dmg', target.id, 100, 'arts']);
  h.b.addBuff(source, { key: 'test:red', mods: { dmgDealtMul: 2 } });
  h.b.dealDamage(source, target, { amount: 100, type: 'arts', canDodge: false, tags: ['bond:bond_x_marisa_rhodeShip'] });
  const red = h.b.drainEvents().find(e => e[0] === 'dmg');
  assert.deepEqual(red, ['dmg', target.id, 200, 'arts', 'r', 'bond:rhodeShip'], 'the existing red number keeps its slot');
});
