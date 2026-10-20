// The MOD archive contains complete 0.3.0 tables. A rebuilt profile must keep the 0.3.1 metadata and rewards
// under both default and custom settings, while retaining the author's added operators and Rhodes balance.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { getData } from '../../server/data.js';
import { applyMarisaProfile } from '../../shared/plugins/profile.js';
import { applyFileOverlay } from '../../shared/i18nData.js';
import { attackRangeGrid, loadoutRecord, resolveRecordLoadout, traitRangeExtend } from '../../shared/loadoutRecord.js';

const read = rel => JSON.parse(readFileSync(new URL(rel, import.meta.url), 'utf8'));
const base = getData();
const profile = read('../../mods/marisa-native/bundle/marisa/data/profile.json');
const upgrade = read('../../mods/marisa-native/upstream-0.3.1.json');
const manifest = read('../../mods/marisa-native/bundle/marisa/plugin.json');
const at = (value, path) => path.reduce((record, key) => record?.[key], value);
const compose = (settings = {}) => {
  const result = applyMarisaProfile(base, base, profile, {
    pluginId: 'marisa', settings, permissions: manifest.permissions,
  });
  assert.deepEqual(result.problems, []);
  return result.data;
};

test('rebuilt Marisa profile retains every official 0.3.1 data change for default and disabled settings', () => {
  const before = JSON.stringify(base);
  for (const settings of [{}, { existing: false, additions: false, bonds: false, strategies: false }]) {
    const data = compose(settings);
    for (const change of upgrade.changes) {
      assert.deepEqual(at(data[change.file], change.path), at(base[change.file], change.path),
        `${JSON.stringify(settings)}: ${change.file}.${change.path.join('.')}`);
    }
    assert.equal(data.chess.chess_char_2_03_a.placeOnRanged, true);
    assert.equal(data.chess.chess_char_5_15_a.skills[2].passiveRange, true);
    assert.equal(data.chess.chess_char_4_14_b.trait.rangeExpand, true);
    assert.equal(data.chess.chess_char_3_21_b.modules[2].traitOverride.modeOnly, true);
    assert.deepEqual(data.config.rewards, base.config.rewards);
  }
  assert.equal(JSON.stringify(base), before, 'composition keeps the official baseline intact');
  assert.equal(manifest.version, '0.3.1');
  assert.equal(manifest.app, '>=0.3.1 <0.4.0');
});

test('Marisa room attack previews keep the official range across shipped translations', () => {
  const data = compose();
  const cases = [
    { id: 'chess_char_4_14_b', choice: {}, cells: 10 },
    { id: 'chess_char_5_15_a', choice: { skillIndex: 2 }, cells: 19 },
    { id: 'chess_char_3_21_b', choice: { moduleId: 'uniequip_004_archet' }, cells: 12, extend: 0 },
  ];
  for (const lang of ['zh', 'en', 'ja', 'ko', 'zh-TW']) {
    const chess = lang === 'zh' ? data.chess
      : applyFileOverlay(data.chess, read(`../../data/i18n/${lang}.json`).files.chess).value;
    for (const { id, choice, cells, extend } of cases) {
      const record = loadoutRecord(chess[id], resolveRecordLoadout(chess[id], choice));
      assert.equal(attackRangeGrid(record).length, cells, `${lang}: ${id}`);
      if (extend !== undefined) assert.equal(traitRangeExtend(record), extend, `${lang}: ${id} extend`);
    }
  }
});

test('the data upgrade retains Marisa operator skills and Rhodes thresholds', () => {
  const data = compose();
  const archived = read('../../mods/marisa-native/source/data/mods/marisa/chess.json');
  for (const [name, oldId] of [
    ['makoto', 'chess_char_4217_makoto_a'], ['amiya3', 'chess_char_1037_amiya3_a'],
    ['aglna2', 'chess_char_1015_aglna2_a'], ['kalts2', 'chess_char_1052_kalts2_a'],
  ]) {
    const record = data.chess[`chess_x_marisa_${name}_a`];
    assert.ok(record, `${name} stays available`);
    assert.deepEqual(record.skill, archived[oldId].skill, `${name} default skill`);
    assert.deepEqual(record.rangeGrid, archived[oldId].rangeGrid, `${name} base range`);
  }
  const rhodes = data.bonds.bond_x_marisa_rhodeShip;
  assert.equal(rhodes.bb.field_eff_low, 0.5);
  assert.equal(rhodes.bb.field_eff_member_min, 4);
  assert.equal(rhodes.bb.field_donate_min, 4);
});
