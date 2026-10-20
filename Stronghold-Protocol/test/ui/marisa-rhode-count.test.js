import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { data } from '../../public/js/data.js';
import { BondStrip } from '../../public/js/ui/bondStrip.js';

const read = (rel) => JSON.parse(readFileSync(new URL(rel, import.meta.url), 'utf8'));
const vanilla = read('../../data/bonds.json');
const source = read('../../mods/marisa-native/source/data/mods/marisa/bonds.json');
const profile = read('../../mods/marisa-native/bundle/marisa/data/profile.json');
data.setContent({ id: 'rhode-count-test', values: { bonds: {
  ...vanilla, rhodeShip: source.rhodeShip, ...profile.tables.bonds,
} } });

function* walk(v) {
  if (Array.isArray(v)) { for (const x of v) yield* walk(x); return; }
  if (!v || typeof v !== 'object') return;
  yield v;
  yield* walk(v.props?.children);
}
const hasClass = (v, c) => v.props?.class?.split(/\s+/).includes(c);
function textOf(v) {
  if (v == null || typeof v === 'boolean') return '';
  if (typeof v !== 'object') return String(v);
  return Array.isArray(v) ? v.map(textOf).join('') : textOf(v.props?.children);
}

for (const bondId of ['rhodeShip', 'bond_x_marisa_rhodeShip']) {
  for (const count of [1, 2, 3, 4, 5]) {
    test(`Rhodes strip ${bondId}: ${count} members show the four-member efficiency threshold`, () => {
      const tree = BondStrip({ bonds: [{ bondId, count, active: true, tier: count >= 2 ? 2 : 1, layers: 12 }], onOpen() {} });
      const nodes = [...walk(tree)];
      const counter = nodes.find((v) => hasClass(v, 'bslot__count'));
      assert.equal(textOf(counter), `${count}/4`);
      assert.equal(hasClass(counter, 'is-max'), count >= 4);
      assert.ok(nodes.some((v) => v.props?.title === `${data.lookup('bonds', bondId).name} ${count}/4`));
    });
  }
}

test('ordinary bonds retain their next tier threshold and maximum indicator', () => {
  const bondId = 'yanShip';
  const thresholds = vanilla[bondId].thresholds;
  for (const [count, denominator, max] of [[thresholds[0], thresholds[1], false], [thresholds.at(-1), thresholds.at(-1), true]]) {
    const tree = BondStrip({ bonds: [{ bondId, count, thresholds, active: true, tier: max ? thresholds.length : 1 }], onOpen() {} });
    const counter = [...walk(tree)].find((v) => hasClass(v, 'bslot__count'));
    assert.equal(textOf(counter), `${count}/${denominator}`);
    assert.equal(hasClass(counter, 'is-max'), max);
  }
});
