// User playtest: four Rhodes operators donate heads to active core bonds; Makoto keeps animating after a skill.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { getData } from '../../server/data.js';
import { applyMarisaProfile } from '../../shared/plugins/profile.js';
import { GameData } from '../../server/match/gamedata.js';
import { diyGameData } from '../../server/match/player/diy.js';
import { computeBonds, bondSnapshot, bondList } from '../../server/match/bondsMeta.js';
import { pieceBonds } from '../../server/match/bondsMeta.js';

const read = rel => JSON.parse(readFileSync(new URL(rel, import.meta.url), 'utf8'));
const base = getData();
const profile = read('../../mods/marisa-native/bundle/marisa/data/profile.json');
const manifest = read('../../mods/marisa-native/bundle/marisa/plugin.json');
const composed = applyMarisaProfile(base, base, profile, { pluginId: 'marisa', settings: {}, permissions: manifest.permissions });
assert.deepEqual(composed.problems, []);
const data = composed.data;
const slot = 'chess_char_6_diy1_a';
// Counting needs the player's resolved DIY factions, not optional outside-roster skill/stat tables.
const mon3tr = { ...data.chess[slot], charId: 'char_4179_monstr', bonds: data.backups.diy.operators.char_4179_monstr.bonds };
assert.ok(mon3tr.bonds.includes('bond_x_marisa_rhodeShip'));
const gd = diyGameData(new GameData(data, 'mode_multi_normal'), new Map([[slot, mon3tr]]));
const roster = ['chess_x_marisa_amiya3_a', 'chess_x_marisa_kalts2_a', 'chess_char_4_26_a', slot,
  'chess_char_5_05_a', 'chess_char_2_07_a', 'chess_char_5_13_a'];
const state = ids => ({ board: new Map(ids.map((id, i) => [`${9 + i % 4},${3 + Math.floor(i / 4)}`, { uid: i + 1, kind: 'chess', id, items: [] }])), hand: [], layers: {} });

test('reported Amiya/Kaltsit/Warfarin/Mon3tr + three Egir roster counts seven Egir heads', () => {
  const bonds = computeBonds(gd, state(roster));
  assert.equal(bonds.bond_x_marisa_rhodeShip.count, 4);
  assert.equal(bonds.egirShip.count, 7, 'three real Egir members plus four distinct Rhodes operators');
  assert.equal(bonds.egirShip.tier, 2); // The shipped Egir thresholds are 3 / 5 / 9.
  assert.equal(bondList(gd, bonds).find(b => b.bondId === 'egirShip').count, 7);
  assert.equal(bondSnapshot(bonds).egirShip.count, 7, 'battle input receives the effective count too');
  for (const p of state(roster.slice(0, 4)).board.values()) {
    assert.ok(!pieceBonds(gd, p).includes('egirShip'), 'donation does not grant Egir effects to Rhodes operators');
  }
});

test('three Rhodes heads or an elite duplicate cannot enable donation; bench members do not count', () => {
  const three = roster.filter(id => id !== slot);
  assert.equal(computeBonds(gd, state(three)).egirShip.count, 3);
  const duplicate = state([...three, 'chess_x_marisa_amiya3_b']);
  duplicate.hand.push({ uid: 100, kind: 'chess', id: slot, items: [] });
  const bonds = computeBonds(gd, duplicate);
  assert.equal(bonds.bond_x_marisa_rhodeShip.count, 3);
  assert.equal(bonds.egirShip.count, 3);
});

test('Rhodes cannot activate an inactive core bond or donate a member that already belongs to it twice', () => {
  const inactive = computeBonds(gd, state(roster.slice(0, 6)));
  assert.equal(inactive.egirShip.count, 2);
  assert.equal(inactive.egirShip.active, false);
  const overlapping = diyGameData(gd, new Map([[slot, { ...mon3tr, bonds: [...mon3tr.bonds, 'egirShip'] }]]));
  assert.equal(computeBonds(overlapping, state(roster)).egirShip.count, 7, 'four native Egir heads plus only three new heads');
  assert.equal(computeBonds(gd, state(roster.filter(id => id !== slot))).egirShip.count, 3, 'removing the fourth member immediately removes donation');
});
