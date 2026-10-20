// Room-scoped gameplay profiles. IDs and option values are allowlisted, never interpreted as paths.
export const MOD_ID = 'marisa';
export const CONTENT_FILES = Object.freeze(['chess', 'enemies', 'tokens', 'stages', 'waves', 'bonds', 'garrisons', 'items', 'bands', 'effects', 'choices', 'config', 'backups']);
const MOD_OPERATORS = Object.freeze([
  Object.freeze({ charId: 'char_4217_makoto', chessId: 'chess_char_4217_makoto_a', type: 'addition' }),
  Object.freeze({ charId: 'char_1015_aglna2', chessId: 'chess_char_1015_aglna2_a', type: 'existing' }),
  Object.freeze({ charId: 'char_1052_kalts2', chessId: 'chess_char_1052_kalts2_a', type: 'existing' }),
  Object.freeze({ charId: 'char_1037_amiya3', chessId: 'chess_char_1037_amiya3_a', type: 'addition' }),
]);
export const MOD_ADDED_OPERATORS = Object.freeze(MOD_OPERATORS.filter((op) => op.type === 'addition'));
export const MOD_EXISTING_VARIANTS = Object.freeze(MOD_OPERATORS.filter((op) => op.type === 'existing'));
export const MOD_EXISTING_OPERATOR_IDS = Object.freeze([
  'char_171_bldsk', // Warfarin gains the new Rhode Island affiliation.
  'char_003_kalts', 'char_4179_monstr', 'char_4195_radian', 'char_4228_closur', 'char_4230_mcnist', // Existing DIY candidates gain Rhode Island.
  ...MOD_EXISTING_VARIANTS.map((op) => op.charId),
]);
// These base alliances receive additional MOD operators. Membership is independently configurable per operator.
export const MOD_ADDED_BOND_MEMBERS = Object.freeze([
  Object.freeze({ bondId: 'lateranoShip', charId: 'char_4217_makoto' }),
  Object.freeze({ bondId: 'preciShip', charId: 'char_4217_makoto' }),
  Object.freeze({ bondId: 'indomShip', charId: 'char_4217_makoto' }),
  Object.freeze({ bondId: 'siracusaShip', charId: 'char_1015_aglna2' }),
  Object.freeze({ bondId: 'swiftShip', charId: 'char_1015_aglna2' }),
  Object.freeze({ bondId: 'miraShip', charId: 'char_1015_aglna2' }),
  Object.freeze({ bondId: 'visiShip', charId: 'char_1037_amiya3' }),
  Object.freeze({ bondId: 'emptyShip', charId: 'char_1052_kalts2' }),
]);
export const MOD_ADDED_BOND_MEMBER_IDS = Object.freeze(MOD_ADDED_BOND_MEMBERS.map(({ bondId, charId }) => `${bondId}:${charId}`));
// This profile introduces only Rhode Island. Existing alliances are managed via MOD_ADDED_BOND_MEMBERS above.
export const MOD_BOND_IDS = Object.freeze(['rhodeShip']);
export const MOD_NEW_BOND_MEMBERS = Object.freeze([
  'char_171_bldsk', 'char_1052_kalts2', 'char_1037_amiya3',
  'char_003_kalts', 'char_4179_monstr', 'char_4195_radian', 'char_4228_closur', 'char_4230_mcnist',
].map((charId) => Object.freeze({ bondId: 'rhodeShip', charId })));
const NEW_BOND_MEMBER_IDS = new Set(MOD_NEW_BOND_MEMBERS.map(({ bondId, charId }) => `${bondId}:${charId}`));
export const MOD_STRATEGY_IDS = Object.freeze(['band_kun']);

export const validMods = (v) => Array.isArray(v) && v.length <= 1 && (v.length === 0 || v[0] === MOD_ID);
export const profileBase = (mods) => validMods(mods) && mods.length ? '/data/mods/marisa/' : '/data/';

const isObject = (v) => !!v && typeof v === 'object' && !Array.isArray(v);
const CHAR_ID = /^char_[A-Za-z0-9_-]{1,56}$/;
const ID = /^[A-Za-z0-9_-]{1,64}$/;
const BOND_MEMBER_ID = /^[A-Za-z0-9_-]{1,64}:[A-Za-z0-9_-]{1,56}$/;
const uniqueStrings = (v, pattern, max) => Array.isArray(v) && v.length <= max
  && v.every((x) => typeof x === 'string' && pattern.test(x)) && new Set(v).size === v.length;
const isBoolOrMissing = (o, k) => o[k] === undefined || typeof o[k] === 'boolean';
const isIdsOrMissing = (o, k, pattern, max, allowed = null) => o[k] === undefined || (uniqueStrings(o[k], pattern, max)
  && (!allowed || o[k].every((x) => allowed.has(x))));

/** Full profile is the backwards-compatible default for old clients that only send mods: ['marisa']. */
export function defaultModOptions() {
  return {
    existing: { enabled: true, vanillaChars: [] },
    additions: { enabled: true, disabledChars: [], diyChars: [] },
    bonds: { enabled: true, disabledIds: [], memberOverrides: {} },
    existingBondMembers: { disabledIds: [] },
    strategies: { enabled: true, disabledIds: [] },
  };
}

/**
 * Validate the room option shape before normalizing it. `base` adds a roster check for the existing-operator list;
 * the wire-level validator can still validate an old client without loading game data.
 */
export function validModOptions(v, base = null) {
  if (v === undefined || v === null) return true;
  if (!isObject(v) || Object.keys(v).some((k) => !['existing', 'additions', 'bonds', 'existingBondMembers', 'strategies'].includes(k))) return false;
  const sections = {
    existing: ['enabled', 'vanillaChars'], additions: ['enabled', 'disabledChars', 'diyChars'],
    bonds: ['enabled', 'disabledIds', 'memberOverrides'], existingBondMembers: ['disabledIds'], strategies: ['enabled', 'disabledIds'],
  };
  for (const [key, fields] of Object.entries(sections)) {
    const section = v[key];
    if (section === undefined) continue;
    if (!isObject(section) || Object.keys(section).some((k) => !fields.includes(k)) || !isBoolOrMissing(section, 'enabled')) return false;
  }
  const existing = v.existing || {};
  const additions = v.additions || {};
  const bonds = v.bonds || {};
  const existingBondMembers = v.existingBondMembers || {};
  const strategies = v.strategies || {};
  if (!isIdsOrMissing(existing, 'vanillaChars', CHAR_ID, 512)) return false;
  if (!isIdsOrMissing(additions, 'disabledChars', CHAR_ID, MOD_ADDED_OPERATORS.length, new Set(MOD_ADDED_OPERATORS.map((x) => x.charId)))) return false;
  if (!isIdsOrMissing(additions, 'diyChars', CHAR_ID, MOD_ADDED_OPERATORS.length, new Set(MOD_ADDED_OPERATORS.map((x) => x.charId)))) return false;
  if (!isIdsOrMissing(bonds, 'disabledIds', ID, MOD_BOND_IDS.length, new Set(MOD_BOND_IDS))) return false;
  if (bonds.memberOverrides !== undefined && (!isObject(bonds.memberOverrides)
    || Object.entries(bonds.memberOverrides).some(([id, enabled]) => !NEW_BOND_MEMBER_IDS.has(id) || typeof enabled !== 'boolean'))) return false;
  if (!isIdsOrMissing(existingBondMembers, 'disabledIds', BOND_MEMBER_ID, MOD_ADDED_BOND_MEMBER_IDS.length, new Set(MOD_ADDED_BOND_MEMBER_IDS))) return false;
  if (!isIdsOrMissing(strategies, 'disabledIds', ID, MOD_STRATEGY_IDS.length, new Set(MOD_STRATEGY_IDS))) return false;
  if (base && Array.isArray(existing.vanillaChars)) {
    const roster = new Set([
      ...Object.values(base.chess || {}).map((c) => c?.charId).filter(Boolean),
      ...Object.keys(base.backups?.diy?.operators || {}),
    ]);
    if (existing.vanillaChars.some((id) => !roster.has(id))) return false;
  }
  return true;
}

/** Safe local-preference normalization; invalid persisted data falls back to the full profile. */
export function normalizeModOptions(v) {
  if (!validModOptions(v)) return defaultModOptions();
  const fallback = defaultModOptions();
  const section = (key) => isObject(v?.[key]) ? v[key] : {};
  const existing = section('existing'), additions = section('additions'), bonds = section('bonds'), strategies = section('strategies');
  return {
    existing: {
      enabled: existing.enabled ?? fallback.existing.enabled,
      vanillaChars: [...new Set(existing.vanillaChars || [])].sort(),
    },
    additions: {
      enabled: additions.enabled ?? fallback.additions.enabled,
      disabledChars: [...new Set(additions.disabledChars || [])].sort(),
      diyChars: [...new Set(additions.diyChars || [])].sort(),
    },
    bonds: {
      enabled: bonds.enabled ?? fallback.bonds.enabled,
      disabledIds: [...new Set(bonds.disabledIds || [])].sort(),
      memberOverrides: Object.fromEntries(Object.keys(bonds.memberOverrides || {}).sort().map((id) => [id, bonds.memberOverrides[id]])),
    },
    existingBondMembers: { disabledIds: [...new Set(section('existingBondMembers').disabledIds || [])].sort() },
    strategies: {
      enabled: strategies.enabled ?? fallback.strategies.enabled,
      disabledIds: [...new Set(strategies.disabledIds || [])].sort(),
    },
  };
}

/** Existing-alliance additions visible for the selected room options. */
export function enabledModBondMembers(rawOptions) {
  const options = normalizeModOptions(rawOptions);
  const enabled = new Set([
    ...(options.additions.enabled ? MOD_ADDED_OPERATORS.filter((op) => !options.additions.disabledChars.includes(op.charId)).map((op) => op.charId) : []),
    ...(options.existing.enabled ? MOD_EXISTING_VARIANTS.filter((op) => !options.existing.vanillaChars.includes(op.charId)).map((op) => op.charId) : []),
  ]);
  return MOD_ADDED_BOND_MEMBERS.filter((member) => enabled.has(member.charId));
}

export function isDefaultModOptions(v) {
  const options = normalizeModOptions(v);
  return options.existing.enabled && options.existing.vanillaChars.length === 0
    && options.additions.enabled && options.additions.disabledChars.length === 0 && options.additions.diyChars.length === 0
    && options.bonds.enabled && options.bonds.disabledIds.length === 0
    && Object.keys(options.bonds.memberOverrides).length === 0
    && options.existingBondMembers.disabledIds.length === 0
    && options.strategies.enabled && options.strategies.disabledIds.length === 0;
}

const copy = (v) => JSON.parse(JSON.stringify(v));
const list = (v) => Array.isArray(v) ? v.filter((x) => typeof x === 'string') : [];
const addFallback = (record) => {
  if (record && Array.isArray(record.bonds) && record.bonds.length === 0) record.bonds = ['emptyShip'];
};

// Some appended shop characters already existed as original owned DIY candidates. Preserve their original forms,
// module choices and slot-status summon variants; root token records take precedence over backups in DataSource.
function restoreOriginalDiy(out, base, charId) {
  const original = base.backups?.diy?.operators?.[charId];
  const diy = out.backups?.diy;
  if (!original || !diy) return;
  diy.operators[charId] = copy(original);
  if (base.backups.units?.[charId]) out.backups.units[charId] = copy(base.backups.units[charId]);
  const basePool = list(base.backups.diy.ownedPool);
  if (basePool.includes(charId)) {
    const current = list(diy.ownedPool), keep = new Set([...current, charId]), originalIds = new Set(basePool);
    diy.ownedPool = [...basePool.filter((id) => keep.has(id)), ...current.filter((id) => !originalIds.has(id))];
  }
  out.backups.tokens ||= {};
  for (const [tokenId, token] of Object.entries(base.backups.tokens || {})) {
    const variants = Object.fromEntries(Object.entries(token.variants || {}).filter(([owner]) => owner.startsWith(`${charId}@`)));
    if (!Object.keys(variants).length) continue;
    const target = out.backups.tokens[tokenId] ||= copy(token);
    target.variants = { ...target.variants, ...copy(variants) };
    if (out.tokens?.[tokenId]) out.tokens[tokenId].variants = { ...out.tokens[tokenId].variants, ...copy(variants) };
  }
}
const naturalCompare = (a, b) => {
  const aa = String(a).match(/\d+|\D+/g) || [], bb = String(b).match(/\d+|\D+/g) || [];
  const n = Math.min(aa.length, bb.length);
  for (let i = 0; i < n; i++) {
    if (aa[i] === bb[i]) continue;
    const an = /^\d+$/.test(aa[i]), bn = /^\d+$/.test(bb[i]);
    if (an && bn) return Number(aa[i]) - Number(bb[i]);
    return aa[i] < bb[i] ? -1 : 1;
  }
  return aa.length - bb.length;
};

/** Compose a room-specific profile from generated base and Marisa data without mutating either input. */
export function composeModData(base, extended, rawOptions = null) {
  if (!base || !extended || typeof base !== 'object' || typeof extended !== 'object') throw new Error('missing mod profile data');
  if (!validModOptions(rawOptions, base)) throw new Error('invalid mod manager options');
  const options = normalizeModOptions(rawOptions);
  if (isDefaultModOptions(options)) return extended;

  const out = copy(extended);
  const vanillaChars = new Set(options.existing.vanillaChars);
  if (!options.existing.enabled) {
    for (const id of MOD_EXISTING_OPERATOR_IDS) vanillaChars.add(id);
  }
  const existingVariantChars = new Set(MOD_EXISTING_VARIANTS.map((op) => op.charId));
  for (const [id, rec] of Object.entries(out.chess || {})) {
    if (existingVariantChars.has(rec.charId) && vanillaChars.has(rec.charId) && !base.chess?.[id]) delete out.chess[id];
  }
  for (const [id, rec] of Object.entries(out.chess || {})) {
    if (rec?.charId && vanillaChars.has(rec.charId) && base.chess?.[id]) out.chess[id] = copy(base.chess[id]);
  }
  for (const id of vanillaChars) {
    restoreOriginalDiy(out, base, id);
  }

  const diy = out.backups?.diy;
  if (diy) {
    diy.prototypes ||= {};
    diy.locked ||= {};
    for (const tier of ['5', '6']) {
      diy.prototypes[tier] ||= [];
      diy.locked[tier] ||= {};
    }
    diy.operators ||= {};
  }
  const disabledAddedChars = new Set(options.additions.enabled ? options.additions.disabledChars : MOD_ADDED_OPERATORS.map((op) => op.charId));
  if (disabledAddedChars.size) {
    for (const [id, rec] of Object.entries(out.chess || {})) if (disabledAddedChars.has(rec?.charId) && !base.chess?.[id]) delete out.chess[id];
    if (diy) {
      for (const id of disabledAddedChars) {
        for (const tier of Object.keys(diy.prototypes)) diy.prototypes[tier] = diy.prototypes[tier].filter((x) => x !== id);
        for (const tier of Object.keys(diy.locked)) delete diy.locked[tier]?.[id];
        if (base.backups?.diy?.operators?.[id]) restoreOriginalDiy(out, base, id);
        else {
          delete diy.operators[id];
          if (Array.isArray(diy.ownedPool)) diy.ownedPool = diy.ownedPool.filter((x) => x !== id);
        }
      }
    }
  }
  if (options.additions.enabled && diy) {
    for (const charId of options.additions.diyChars.filter((id) => !disabledAddedChars.has(id))) {
      const source = Object.values(extended.chess || {}).find((c) => c?.charId === charId && !c.isGolden && !c.isDiy);
      const unit = extended.backups?.units?.[charId];
      if (!source || !unit) throw new Error(`missing DIY source for ${charId}`);
      const sourceId = source.chessId;
      const row = out.chess[sourceId];
      if (row) row.visible = false;
      restoreOriginalDiy(out, base, charId);
      for (const tier of ['5', '6']) {
        if (!diy.prototypes[tier].includes(charId)) diy.prototypes[tier].push(charId);
        diy.locked[tier][charId] = {
          skillIndex: source.backup?.skillIndex ?? 0, uniEquipId: null, from: [sourceId], exclusive: true,
          modKitId: `chess_${charId}`, bonds: list(row?.bonds || source.bonds), displayTokens: list(source.tokens),
        };
      }
      if (!base.backups?.diy?.operators?.[charId]) diy.operators[charId] = {
        name: unit.name || source.name, rarity: unit.rarity ?? source.rarity,
        profession: unit.profession || source.profession, subProfessionId: unit.subProfessionId || source.subProfessionId,
        obtainable: false, powers: [], bonds: list(row?.bonds || source.bonds),
      };
    }
  }

  const disabledBonds = new Set(options.bonds.enabled ? options.bonds.disabledIds : MOD_BOND_IDS);
  const disabledExistingMembers = new Set(options.existingBondMembers.disabledIds);
  for (const [id, rec] of Object.entries(out.chess || {})) {
    const original = base.chess?.[id];
    const originalBonds = new Set(list(original?.bonds));
    rec.bonds = list(rec.bonds).filter((bondId) => !disabledBonds.has(bondId) || originalBonds.has(bondId));
    const explicitlyRemovedFallback = !original && disabledExistingMembers.has(`emptyShip:${rec.charId}`);
    if (!rec.isDiy && !explicitlyRemovedFallback) addFallback(rec);
  }
  for (const [charId, rec] of Object.entries(out.backups?.diy?.operators || {})) {
    const original = base.backups?.diy?.operators?.[charId];
    const originalBonds = new Set(list(original?.bonds));
    rec.bonds = list(rec.bonds).filter((bondId) => !disabledBonds.has(bondId) || originalBonds.has(bondId));
    addFallback(rec);
  }
  for (const { bondId, charId } of MOD_ADDED_BOND_MEMBERS) {
    if (!disabledExistingMembers.has(`${bondId}:${charId}`)) continue;
    for (const [id, rec] of Object.entries(out.chess || {})) {
      if (rec?.charId !== charId || base.chess?.[id]?.bonds?.includes(bondId)) continue;
      rec.bonds = list(rec.bonds).filter((x) => x !== bondId);
      if (!rec.isDiy && !(bondId === 'emptyShip' && !base.chess?.[id])) addFallback(rec);
    }
    const diyRecord = out.backups?.diy?.operators?.[charId];
    if (diyRecord && !base.backups?.diy?.operators?.[charId]?.bonds?.includes(bondId)) {
      diyRecord.bonds = list(diyRecord.bonds).filter((x) => x !== bondId);
      addFallback(diyRecord);
    }
  }
  // Explicit new-alliance membership choices are applied last, after operator original/MOD selection.
  // They change affiliations only; an alliance disabled as a whole still cannot grant membership.
  for (const { bondId, charId } of MOD_NEW_BOND_MEMBERS) {
    const override = options.bonds.memberOverrides[`${bondId}:${charId}`];
    if (override === undefined) continue;
    const enabled = override && !disabledBonds.has(bondId);
    for (const [id, rec] of Object.entries(out.chess || {})) {
      if (rec.charId !== charId) continue;
      rec.bonds = list(rec.bonds).filter((x) => x !== bondId);
      if (enabled) rec.bonds.push(bondId);
      if (!rec.isDiy && !(!base.chess?.[id] && disabledExistingMembers.has(`emptyShip:${charId}`))) addFallback(rec);
    }
    const operator = diy?.operators?.[charId];
    if (operator) {
      operator.bonds = list(operator.bonds).filter((x) => x !== bondId);
      if (enabled) operator.bonds.push(bondId);
      addFallback(operator);
    }
  }
  // Appended prototypes carry the MOD affiliations independently of any original owned-candidate metadata.
  if (options.additions.enabled && diy) for (const charId of options.additions.diyChars.filter((id) => !disabledAddedChars.has(id))) {
    const row = Object.values(out.chess || {}).find((c) => c?.charId === charId && !c.isGolden);
    for (const tier of ['5', '6']) if (row && diy.locked[tier][charId]) diy.locked[tier][charId].bonds = list(row.bonds);
    if (row && diy.operators[charId] && !base.backups?.diy?.operators?.[charId]) diy.operators[charId].bonds = list(row.bonds);
  }

  if (out.bonds) {
    if (disabledBonds.has('rhodeShip') && !base.bonds?.rhodeShip) delete out.bonds.rhodeShip;
    for (const [bondId, bond] of Object.entries(out.bonds)) {
      const prior = list(bond.members);
      const members = prior.filter((id) => {
        const rec = out.chess?.[id];
        return !!rec && list(rec.bonds).includes(bondId);
      });
      const seen = new Set(members);
      const newMembers = Object.values(out.chess || {})
        .filter((rec) => rec && !rec.isGolden && rec.bonds?.includes(bondId) && !seen.has(rec.chessId))
        .map((rec) => rec.chessId).sort(naturalCompare);
      bond.members = [...members, ...newMembers];
      bond.visibleMembers = bond.members.filter((id) => !!out.chess?.[id]?.visible);
    }
  }

  if (out.garrisons) {
    const addedChessIds = new Set(Object.keys(extended.chess || {}).filter((id) => !base.chess?.[id]));
    for (const [id, rec] of Object.entries(out.garrisons)) {
      if (base.garrisons?.[id]) continue;
      rec.owners = list(rec.owners).filter((owner) => out.chess?.[owner]);
      if (!rec.owners.length && addedChessIds.size) delete out.garrisons[id];
    }
  }
  if (out.tokens) {
    const usedTokens = new Set(Object.values(out.chess || {}).flatMap((c) => list(c?.tokens)));
    for (const id of Object.keys(out.tokens)) if (!base.tokens?.[id] && !usedTokens.has(id)) delete out.tokens[id];
  }

  if (out.effects && out.bonds && disabledBonds.has('rhodeShip') && !base.effects?.bondeffect_rhode) delete out.effects.bondeffect_rhode;
  const disabledStrategies = new Set(options.strategies.enabled ? options.strategies.disabledIds : MOD_STRATEGY_IDS);
  for (const id of disabledStrategies) {
    const band = out.bands?.[id];
    if (!band || base.bands?.[id]) continue;
    delete out.bands[id];
    if (band.effectId && !base.effects?.[band.effectId]) delete out.effects?.[band.effectId];
  }
  return out;
}

// Deterministic content identity, not a security/authentication primitive. Two independent
// 32-bit streams work in Node and on HTTP LAN browsers without WebCrypto.
export function contentHash(data) {
  let a = 2166136261, b = 5381;
  for (const name of CONTENT_FILES) {
    const text = name + JSON.stringify(data[name] ?? null);
    for (let i = 0; i < text.length; i++) {
      const c = text.charCodeAt(i);
      a = Math.imul(a ^ c, 16777619) >>> 0;
      b = (Math.imul(b, 33) ^ c) >>> 0;
    }
  }
  return a.toString(16).padStart(8, '0') + b.toString(16).padStart(8, '0');
}
