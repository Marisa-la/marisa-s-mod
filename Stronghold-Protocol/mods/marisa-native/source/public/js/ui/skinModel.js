// Operator skins (外观皮肤) — a purely cosmetic, per-browser choice of the 干员调配 screen (screens/loadout.js).
//
// The MOD's own registry is data/skins.json — `{ _about, [charId]: { charId, name, skins: [{ id, name? }] } }` (one line,
// no trailing newline like every data/*.json) — and it only says WHICH skins an operator has: `skins[].id` is the
// official skinId (`char_4217_makoto@p3r#1`), the same key data/assets.json carries in its top-level `skins` group
// (`skins[<skinId>] = { name, group, portrait, avatar, spine }`, written by the assets executor). The manifest is the
// single source of truth for availability, display name and URLs: a skin counts as available only when
// `m.skins[skinId].portrait` exists, so the day the art lands the option appears without a code change, and while it is
// missing nothing is offered (no 404, no half a skin). `data/skins.json`'s own `name` is only the fallback label.
//
// The choice itself is a browser preference, NOT part of `room.loadout` (that is skills / modules, which the server
// validates; a skin is appearance only — no protocol, no PlayerState change): `sp.pref.skins` =
// `{ v: 1, entries: { [charId]: skinId } }` through store.js loadPref / savePref, like ui/loadoutModel.js and
// ui/diyModel.js.
//
// MATERIALISATION (the single render hook): `assetsFor()` returns the manifest with the chosen skin already written into
// `chars[charId].portrait / portraitE2 / avatar / avatarE2` (and `spine` when the manifest's skin entry carries one).
// Every existing consumer then follows without a single change: ui/assetUrls.js chessPortraitUrl / chessAvatarUrl read
// `chars[...]`, and so do the roster cards, the detail card, the DIY / 干员持有 tabs and the battle view. Nothing is
// mutated in place (data.js hands out the cached object) — the copy is memoised by (manifest, registry, entries).
//
// SPINE: the battle model follows the same manifest entry — a skin with a `spine` the manifest lists is written into
// `chars[charId].spine`, so assets.js spineEntry serves the skin skeleton; a skin without one leaves the default model
// (the battle simply keeps the operator's own art, never a faked skeleton).

import { loadPref, savePref } from '../store.js';
import { data } from '../data.js';
import { useReducer, useEffect } from '../../vendor/hooks.module.js';
import { t, N_ } from '../../../shared/i18n.js';

/** localStorage key (store.js loadPref/savePref prefix `sp.pref.`) and format version. */
export const SKINS_PREF = 'skins';
export const SKINS_VERSION = 1;

/** The most characters one stored preference may carry (junk protection; a real registry has a handful). */
export const SKINS_MAX_CHARS = 64;

/** The data file holding the registry (data/skins.json). */
export const SKINS_FILE = 'skins';

/** Label of the 皮肤 row (msgid: public/i18n/<lang>.json). */
export const SKIN_LABEL = N_('皮肤');
/** Label of the 默认 (no skin) option (already a msgid in every pack for the module / skill rows). */
export const SKIN_DEFAULT_LABEL = N_('默认');

const ID_RE = /^[A-Za-z0-9_\-.:]{1,64}$/;
/** Skin ids are official skinIds: `char_4217_makoto@p3r#1` (the `@` and `#` of the official form). */
const SKIN_ID_RE = /^[A-Za-z0-9_\-.:@#]{1,96}$/;
const UNSAFE_IDS = new Set(['__proto__', 'constructor', 'prototype']);
const isObj = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const isId = (v) => typeof v === 'string' && ID_RE.test(v);
const isSkinId = (v) => typeof v === 'string' && SKIN_ID_RE.test(v) && !UNSAFE_IDS.has(v);
/** A manifest URL: a site-absolute /assets/... path (what data/assets.json and assetUrls.js deal in). */
const isAssetUrl = (v) => typeof v === 'string' && v.startsWith('/assets/') && !/\s/.test(v);

// ---- registry (data/skins.json) ----------------------------------------------------------------------------------

/**
 * The registry as stored: charId → `{ charId, name, skins: [{ id, name? }] }`, only structurally valid records (ids and
 * at least one skin). Junk and the `_about` note are dropped. What a skin IS (name, group, art, spine) comes from the
 * manifest's own `skins[skinId]` group — this file only lists which skins belong to which operator.
 * @param {any} json data/skins.json
 * @returns {Record<string, { charId: string, name: string, skins: Array<{ id: string, name?: string }> }>}
 */
export function parseSkins(json) {
  const out = {};
  if (!isObj(json)) return out;
  for (const [charId, rec] of Object.entries(json)) {
    if (charId.startsWith('_') || UNSAFE_IDS.has(charId) || !isId(charId) || !isObj(rec)) continue;
    const skins = [];
    const seen = new Set();
    for (const s of Array.isArray(rec.skins) ? rec.skins : []) {
      if (!isObj(s) || !isSkinId(s.id) || seen.has(s.id)) continue;
      const skin = { id: s.id };
      if (typeof s.name === 'string' && s.name.trim()) skin.name = s.name;
      skins.push(skin);
      seen.add(s.id);
    }
    if (!skins.length) continue;
    out[charId] = { charId, name: typeof rec.name === 'string' && rec.name ? rec.name : charId, skins };
  }
  return out;
}

/**
 * The loaded registry (empty until data/skins.json has arrived, or when it is missing). Memoised by the raw JSON object
 * (data.js hands out one cached object), so the render paths that read the manifest through assetsFor() do not re-parse
 * it on every render.
 */
let skinsMemo = { raw: null, value: {} };
export function skinsData() {
  const raw = data.get(SKINS_FILE);
  if (skinsMemo.raw === raw) return skinsMemo.value;
  skinsMemo = { raw, value: parseSkins(raw) };
  return skinsMemo.value;
}

/** data/skins.json is settled (ready or missing) — the row must not appear before the registry can be answered. */
export function skinsReady() {
  const s = data.status(SKINS_FILE);
  return s === 'ready' || s === 'missing';
}

/** Every skin of one charId in the registry, chosen or not (`{ charId, name, skins }`), or null. */
export function skinsOf(skins, charId) {
  if (typeof charId !== 'string' || !charId) return null;
  const rec = isObj(skins) ? skins[charId] : null;
  if (!rec || !Array.isArray(rec.skins) || !rec.skins.length) return null;
  return rec;
}

/** The manifest's own entry of a skin id (`m.skins[skinId]`), or null. */
export function manifestSkin(m, skinId) {
  if (!skinId || !isSkinId(skinId)) return null;
  const s = isObj(m) && isObj(m.skins) ? m.skins[skinId] : null;
  return isObj(s) ? s : null;
}

/**
 * The available skins of a charId, in registry order: each entry merged with the manifest's own record —
 * `{ id, name, group, portrait, avatar, spine }`. Availability is decided by the manifest itself: the entry must be
 * there and carry a `/assets/…` portrait, which is exactly the contract of data/assets.json (every URL it lists is a
 * file the asset pipeline produced — test/assets.test.js proves each one exists on disk). A skin the manifest does not
 * know is not offered: no row, no request.
 * @param {any} m assets manifest (data.get('assets'))
 * @param {any} skins data/skins.json (parseSkins / skinsData())
 * @param {string} charId
 * @returns {Array<{ id: string, name: string, group: string|null, portrait: string, avatar: string|null, spine: any }>}
 *   [] when the character has no skin (the screen then draws no 皮肤 row)
 */
export function availableSkins(m, skins, charId) {
  const rec = skinsOf(skins, charId);
  if (!rec) return [];
  const out = [];
  for (const s of rec.skins) {
    const man = manifestSkin(m, s.id);
    if (!man || !isAssetUrl(man.portrait)) continue;
    out.push({
      id: s.id,
      // the manifest is authoritative for what the player sees; the registry's own name only fills the gap
      name: typeof man.name === 'string' && man.name ? man.name : s.name || s.id,
      group: typeof man.group === 'string' && man.group ? man.group : null,
      portrait: man.portrait,
      avatar: isAssetUrl(man.avatar) ? man.avatar : null,
      spine: isObj(man.spine) ? man.spine : null,
    });
  }
  return out;
}

/**
 * The available skin record by id, or null.
 * @param {any} m @param {any} skins @param {string} charId @param {string|null} skinId
 */
export function skinEntry(m, skins, charId, skinId) {
  if (!skinId) return null;
  return availableSkins(m, skins, charId).find((s) => s.id === skinId) || null;
}

const urlCache = new WeakMap();
/**
 * Every `/assets/…` URL data/assets.json lists (chars, skins, ui, skills, spine textures …). What the client may ever
 * request is exactly this set — test/assets.test.js proves each listed path exists on disk — so callers (and the tests)
 * use it to check that a URL handed to <img> / the Spine loader is one the manifest produced. A WeakMap keeps one Set
 * per manifest object: the client has exactly one, so this is built once per page.
 * @param {any} node
 * @returns {Set<string>}
 */
export function manifestUrls(node) {
  const root = isObj(node) ? node : null;
  if (!root) return new Set();
  const hit = urlCache.get(root);
  if (hit) return hit;
  const out = new Set();
  const walk = (v) => {
    if (typeof v === 'string') { if (v.startsWith('/assets/')) out.add(v); return; }
    if (Array.isArray(v)) { for (const x of v) walk(x); return; }
    if (isObj(v)) for (const x of Object.values(v)) walk(x);
  };
  walk(root);
  urlCache.set(root, out);
  return out;
}

// ---- stored preference (sp.pref.skins) ----------------------------------------------------------------------------

/**
 * Parse a stored preference (any junk → {}): `{ v, entries }` (or a bare `{ [charId]: skinId }` map from an older
 * build). Only safe ids and non-empty string values are kept.
 * @param {any} raw
 * @returns {Record<string, string>}
 */
export function parseStoredSkins(raw) {
  const src = isObj(raw) && isObj(raw.entries) ? raw.entries : isObj(raw) && raw.v == null ? raw : null;
  const out = {};
  if (!src) return out;
  for (const [charId, skinId] of Object.entries(src)) {
    if (Object.keys(out).length >= SKINS_MAX_CHARS) break;
    if (UNSAFE_IDS.has(charId) || !isId(charId) || !isSkinId(skinId)) continue;
    out[charId] = skinId;
  }
  return out;
}

/** Serialised form for localStorage. */
export const toStoredSkins = (entries) => ({ v: SKINS_VERSION, entries: cleanSkinIds(entries) });

/** The structurally clean entries map of a raw one (parseStoredSkins on a bare map). */
export const cleanSkinIds = (entries) => parseStoredSkins(entries);

/**
 * The chosen skin id of a charId under an entries map, or null (default art). This is only the STORED choice: whether
 * it is available is resolved against the manifest by skinEntry / availableSkins.
 * @param {Record<string, string>} entries
 * @param {string} charId
 * @returns {string|null}
 */
export function skinOf(entries, charId) {
  if (!isObj(entries) || typeof charId !== 'string' || !charId) return null;
  const id = entries[charId];
  return typeof id === 'string' && id ? id : null;
}

// ---- materialisation ----------------------------------------------------------------------------------------------

const copies = new WeakMap();

/**
 * The assets manifest with every chosen skin already materialised (see the header). Returns the manifest itself when
 * nothing applies, so callers can pass it on unconditionally.
 * @param {any} m assets manifest (data.get('assets'))
 * @param {any} skins data/skins.json
 * @param {Record<string, string>} entries the stored choice
 * @returns {any}
 */
export function materializeAssets(m, skins, entries) {
  if (!isObj(m) || !isObj(skins) || !isObj(entries)) return m;
  const chars0 = isObj(m.chars) ? m.chars : null;
  if (!chars0) return m;
  const list = [];
  for (const [charId, skinId] of Object.entries(entries)) {
    const s = skinEntry(m, skins, charId, skinId);
    // the charId must be an operator the manifest knows, else nothing could resolve the skin
    if (!s || !isObj(chars0[charId])) continue;
    list.push([charId, s]);
  }
  if (!list.length) return m;
  const key = JSON.stringify(list.map(([id, s]) => [id, s.id, s.portrait, s.avatar]));
  const hit = copies.get(m);
  if (hit && hit.key === key && hit.skins === skins) return hit.value;

  const chars = { ...chars0 };
  for (const [charId, s] of list) {
    const rec = chars[charId];
    const next = { ...rec };
    next.portrait = s.portrait;
    if (typeof rec.portraitE2 === 'string') next.portraitE2 = s.portrait;   // the elite gets the skin too
    if (s.avatar) {
      next.avatar = s.avatar;
      if (typeof rec.avatarE2 === 'string') next.avatarE2 = s.avatar;
    }
    if (isObj(s.spine) && isObj(rec.spine)) {
      // assets.js spineEntry reads chars[charId].spine: the skin's own skeleton when the manifest carries one, else the
      // operator's (a skin without a battle model keeps the default one — the portrait / avatar change is the effect)
      const spine = { ...rec.spine };
      const front = validSpineEntry(s.spine.front) ? s.spine.front : null;
      if (front) spine.front = { ...front };
      const back = validSpineEntry(s.spine.back) ? s.spine.back : null;
      if (back) spine.back = { ...back };
      next.spine = spine;
    }
    chars[charId] = next;
  }
  const value = { ...m, chars };
  copies.set(m, { key, skins, value });
  return value;
}

/** assets.js validSpine, local: a skeleton + an atlas + an animation role set (`chars[].spine.front|back` shape). */
function validSpineEntry(sp) {
  return isObj(sp) && typeof sp.skel === 'string' && /^\/[^\s]*\.skel$/.test(sp.skel)
    && typeof sp.atlas === 'string' && isObj(sp.anims);
}

/**
 * The charId a chess's / elite's own art resolves through: the elite record's own charId when it has one (usually the
 * same as its base's), else the chess's. A skin is registered per charId, so this is what the screen, the DIY tab and
 * the battle view all key on.
 * @param {any} chess @param {any} [golden]
 */
export function skinCharId(chess, golden = null) {
  const g = typeof golden?.charId === 'string' && golden.charId ? golden.charId : null;
  if (g) return g;
  return typeof chess?.charId === 'string' && chess.charId ? chess.charId : null;
}

/**
 * The small square picture of a skin option: its avatar when the manifest lists one, else its portrait (the same size
 * rule the roster uses), else null (the option shows its name alone).
 */
export const skinIconUrl = (s) => (isAssetUrl(s?.avatar) ? s.avatar : isAssetUrl(s?.portrait) ? s.portrait : null);

/**
 * The portrait a card shows for one chess under the registry: the chosen skin's portrait when it is available, else
 * exactly what ui/assetUrls.js chessPortraitUrl would draw (the manifest's own portrait, its E2 one for `golden`).
 * @param {any} m materialised manifest
 * @param {any} chess @param {{ golden?: boolean, charId?: string|null, skinId?: string|null, skins?: any }} [o]
 * @returns {string|null}
 */
export function skinPortraitUrl(m, chess, { golden = false, charId = null, skinId = null, skins = null } = {}) {
  const id = charId || skinCharId(chess);
  const s = skinEntry(m, skins, id, skinId);
  if (s) return s.portrait;
  const rec = m?.chars?.[id];
  if (!rec) return null;
  return (golden ? rec.portraitE2 : null) || rec.portrait || null;
}

/**
 * The avatar a card shows for one chess under the registry: the chosen skin's avatar when it is available, else the
 * manifest's own (its E2 one for `golden`). Mirrors ui/assetUrls.js chessAvatarUrl.
 * @param {any} m materialised manifest
 * @param {any} chess @param {{ golden?: boolean, charId?: string|null, skinId?: string|null, skins?: any }} [o]
 * @returns {string|null}
 */
export function skinAvatarUrl(m, chess, { golden = false, charId = null, skinId = null, skins = null } = {}) {
  const id = charId || skinCharId(chess);
  const s = skinEntry(m, skins, id, skinId);
  if (s?.avatar) return s.avatar;
  const rec = m?.chars?.[id];
  if (!rec) return null;
  return (golden ? rec.avatarE2 : null) || rec.avatar || null;
}

/**
 * The battle model of one chess under the registry: the skin's Spine entry when the manifest carries one (its skeleton
 * is written into `chars[charId].spine` by materializeAssets, which assets.js spineEntry then serves). Null when the
 * skin has no battle model — the unit keeps the operator's own, the skin being portrait / avatar only.
 * @returns {{ skel: string, atlas: string, textures: string[] }|null}
 */
export function skinSpine(m, skins, charId, skinId) {
  const s = skinEntry(m, skins, charId, skinId);
  const front = s?.spine?.front;
  return validSpineEntry(front) ? front : null;
}

// ---- browser preference store -------------------------------------------------------------------------------------

function readStored() {
  try { return parseStoredSkins(loadPref(SKINS_PREF, null)); } catch { return {}; }
}

/** The chosen skins, shared by the 干员调配 screen (and anything else that wants to react to a change). */
export const skinStore = {
  entries: readStored(),
  /** @type {Set<(entries: Record<string, string>) => void>} */
  listeners: new Set(),
  get() { return this.entries; },
  /**
   * Choose a skin for a charId (null / '' / unknown id = back to the default art). Persists and notifies.
   * @param {string} charId @param {string|null} skinId
   * @returns {Record<string, string>} the new entries map
   */
  setSkin(charId, skinId) {
    if (!isId(charId) || UNSAFE_IDS.has(charId)) return this.entries;
    const next = { ...this.entries };
    if (isSkinId(skinId)) next[charId] = skinId;
    else delete next[charId];
    this.entries = next;
    savePref(SKINS_PREF, toStoredSkins(next));
    for (const fn of [...this.listeners]) {
      try { fn(next); } catch (err) { console.error('[skins] listener failed', err); }
    }
    return next;
  },
  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  },
};

/** The chosen skin id of a charId (the stored preference; availability is decided against the manifest). */
export const selectedSkin = (charId) => skinOf(skinStore.get(), charId);

/** Choose a skin (null = default art). The screen's click handler. */
export function setSkin(charId, skinId) {
  return skinStore.setSkin(charId, skinId);
}

/**
 * Preact hook: re-render on every skin change (the screen's roster cards, its detail card and the other cards that
 * show the same operator all read the materialised manifest, so one subscription at the screen root is enough).
 * @returns {number} the current preference revision
 */
export function useSkins() {
  const [rev, bump] = useReducer((c) => c + 1, 0);
  useEffect(() => skinStore.subscribe(() => bump()), []);
  return rev;
}

/**
 * `data.get('assets')` with the chosen skins materialised — what every card in the 干员调配 overlay must read.
 * Loads data/skins.json (once) so the registry is there even when no screen asked for it.
 * @returns {any} the manifest (or null while it has not loaded)
 */
export function assetsFor() {
  data.load(SKINS_FILE);
  return materializeAssets(data.get('assets'), skinsData(), skinStore.get());
}

/**
 * The 皮肤 row of one chess: the options the detail card draws (默认 + each available skin), or null when the operator
 * has no available skin — then the row must not appear at all (not even an empty one). The chosen id comes from the
 * browser preference (skinStore), the availability from the manifest.
 * @param {any} m manifest (raw or materialised: availability reads the manifest's own `skins` group either way)
 * @param {string} charId
 * @param {any} [skins] the registry; default: the loaded data/skins.json (skinsData())
 * @returns {{ label: string, value: string|null, options: Array<{ id: string|null, name: string, group: string|null, icon: string|null, isDefault: boolean }> } | null}
 */
export function skinSelectorProps(m, charId, skins = null) {
  const list = availableSkins(m, skins || skinsData(), charId);
  if (!list.length) return null;
  const value = selectedSkin(charId);
  return {
    label: t(SKIN_LABEL),
    value: list.some((s) => s.id === value) ? value : null,   // a stored id the manifest no longer offers shows 默认
    options: [
      { id: null, name: t(SKIN_DEFAULT_LABEL), group: null, icon: null, isDefault: true },
      ...list.map((s) => ({ id: s.id, name: s.name, group: s.group, icon: skinIconUrl(s), isDefault: false })),
    ],
  };
}
