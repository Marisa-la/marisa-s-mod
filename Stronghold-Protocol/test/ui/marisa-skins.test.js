import { test } from 'node:test';
import assert from 'node:assert/strict';
import { skinStore, setSkin as setLegacySkin, selectedSkin, assetsFor } from '../../public/js/ui/skinModel.js';
import { skinsStore, setSkin, setSkins, parseStoredSkins, clearSkin } from '../../public/js/ui/skins.js';
import { data } from '../../public/js/data.js';

test('old and new skin controls preserve one shared selection and migrate the old preference envelope', () => {
  const saved = new Map(), previous = globalThis.localStorage;
  globalThis.localStorage = { getItem: key => saved.get(key) ?? null, setItem: (key, value) => saved.set(key, value) };
  const old = { v: 1, entries: { char_4217_makoto: 'char_4217_makoto@p3r#1' } };
  try {
    assert.deepEqual(parseStoredSkins(old), { ...old.entries, char_x_marisa_makoto: old.entries.char_4217_makoto });
    assert.deepEqual(parseStoredSkins(old.entries), old.entries, 'flat preferences never recreate a cleared alias');
    setSkins(old.entries);
    setSkin('char_498_inside', 'char_498_inside@kitchen#2');
    setLegacySkin('char_4217_makoto', 'char_4217_makoto@p3r#2');
    const expected = { char_4217_makoto: 'char_4217_makoto@p3r#2', char_498_inside: 'char_498_inside@kitchen#2' };
    assert.deepEqual(skinsStore.get().skins, expected);
    assert.deepEqual(skinStore.get(), expected);
    assert.deepEqual(JSON.parse(saved.get('sp.pref.skins')), expected, 'one flat wire-compatible preference');
    setSkin('char_4217_makoto', 'char_4217_makoto@p3r#1');
    assert.equal(selectedSkin('char_4217_makoto'), 'char_4217_makoto@p3r#1');
    setLegacySkin('char_4217_makoto', null);
    assert.deepEqual(skinsStore.get().skins, { char_498_inside: 'char_498_inside@kitchen#2' });
  } finally { setSkins({}); globalThis.localStorage = previous; }
});

test('a local skin choice keeps the base manifest intact so each seat can draw its own appearance', () => {
  const assets = {
    chars: { char_4217_makoto: { portrait: '/assets/default.png', spine: { front: {} } } },
    skins: { 'char_4217_makoto@p3r#1': { portrait: '/assets/skin.png' } },
  };
  const skins = { char_4217_makoto: { charId: 'char_4217_makoto', skins: [{ id: 'char_4217_makoto@p3r#1' }] } };
  data.setContent({ id: 's'.repeat(64), values: { assets, skins } });
  try {
    setLegacySkin('char_4217_makoto', 'char_4217_makoto@p3r#1');
    assert.equal(assetsFor(), assets);
    assert.equal(assetsFor().chars.char_4217_makoto.portrait, '/assets/default.png');
  } finally { setSkins({}); data.setContent(null); }
});
test('a migrated preference survives the persist-and-reload loop without the old envelope overriding new choices', () => {
  const saved = new Map(), previous = globalThis.localStorage;
  globalThis.localStorage = { getItem: key => saved.get(key) ?? null, setItem: (key, value) => saved.set(key, value) };
  const old = { v: 1, entries: { char_4217_makoto: 'char_4217_makoto@p3r#1' } };
  try {
    // First load: the old envelope migrates once and copies the namespaced Makoto alias.
    setSkins(parseStoredSkins(old));
    assert.equal(skinsStore.get().skins.char_x_marisa_makoto, 'char_4217_makoto@p3r#1');
    // The player then clears the alias and picks another operator's skin.
    clearSkin('char_x_marisa_makoto');
    setSkin('char_498_inside', 'char_498_inside@kitchen#2');
    // Reload: what was persisted is the flat map, and parsing it must keep the player's newer choices.
    const reloaded = parseStoredSkins(JSON.parse(saved.get('sp.pref.skins')));
    assert.deepEqual(reloaded, {
      char_4217_makoto: 'char_4217_makoto@p3r#1',
      char_498_inside: 'char_498_inside@kitchen#2',
    });
    assert.equal(reloaded.char_x_marisa_makoto, undefined, 'the cleared alias stays cleared across the reload');
    // Even a second envelope-shaped parse of the persisted flat state never re-copies the alias.
    const persisted = JSON.parse(saved.get('sp.pref.skins'));
    assert.equal(persisted.v, undefined, 'the persisted form is the public flat map, not the old envelope');
    assert.equal(parseStoredSkins(persisted).char_x_marisa_makoto, undefined);
  } finally { setSkins({}); globalThis.localStorage = previous; }
});
