import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { bandIconUrl } from '../../public/js/ui/assetUrls.js';
import { availableSkins, chosenSkin } from '../../public/js/ui/skins.js';
import { data } from '../../public/js/data.js';

test('official 0.3.1 sound roles replace obsolete slots while MOD-only sounds keep pool metadata', () => {
  const assets = JSON.parse(fs.readFileSync(new URL('../../data/assets.json', import.meta.url), 'utf8'));
  const stock = JSON.parse(fs.readFileSync(new URL('../../mods/marisa-native/base-assets.json', import.meta.url), 'utf8'));
  for (const [id, record] of Object.entries(stock.audio.sfx.units)) {
    assert.deepEqual(assets.audio.sfx.units[id], record, id);
  }
  for (const id of ['char_1037_amiya3', 'char_4217_makoto']) {
    const unit = assets.audio.sfx.units[id];
    assert.ok(assets.audio.sfx.pools[unit.pools.attack]);
    assert.ok(assets.audio.sfx.pools[unit.pools.hit]);
    for (const pool of Object.values(unit.attackPools)) assert.ok(assets.audio.sfx.pools[pool]);
    for (const pool of Object.values(unit.hitPools)) assert.ok(assets.audio.sfx.pools[pool]);
  }
});

test('namespaced Kun strategy resolves the original icon through the UI asset resolver', () => {
  const assets = JSON.parse(fs.readFileSync(new URL('../../data/assets.json', import.meta.url), 'utf8'));
  assert.equal(bandIconUrl(assets, 'band_x_marisa_kun'), '/assets/band/band_kun.png');
  assert.equal(bandIconUrl(assets, 'band_x_marisa_kun'), bandIconUrl(assets, 'band_kun'));
});

test('legacy Marisa skins are published in the 0.3.1 per-operator catalogue including the namespaced Makoto', () => {
  const assets = JSON.parse(fs.readFileSync(new URL('../../data/assets.json', import.meta.url), 'utf8'));
  const registry = JSON.parse(fs.readFileSync(new URL('../../data/skins.json', import.meta.url), 'utf8'));
  data.setContent({ id: 'k'.repeat(64), values: { assets } });
  try {
    for (const [charId, rec] of Object.entries(registry)) {
      for (const skin of rec.skins ?? []) {
        assert.deepEqual(assets.chars[charId]?.skins?.[skin.id], assets.skins[skin.id], `${charId}: ${skin.id}`);
      }
    }
    const makoto = 'char_x_marisa_makoto', skin = 'char_4217_makoto@p3r#1';
    assert.ok(availableSkins(makoto).some(row => row.id === skin && row.playable));
    assert.equal(chosenSkin(makoto, { [makoto]: skin }), skin);
  } finally { data.setContent(null); }
});
