// server/match/rhodeMeta.js — the PREP (整备期) half of 【罗德岛】 rhodeShip clause 1 ("干员攻击范围内的其他非【罗德岛】
// 干员叠加任何盟约层数时，同时叠加相等的【罗德岛】层数"), authorised by the owner on 2026-10-08 together with the
// end-of-turn settlement of what it accumulates.
//
// The battle half lives in server/sim/content/bonds/addon/battle.js (rhodeLayerCap / rhodeFieldCount / rhodeMirror,
// installed on the engine's `layerGain` hook): a gain of a friendly non-member standing inside an ON-FIELD member's
// CURRENT attack range is mirrored onto 罗德岛, once per gain whatever the member count. This module is the same rule for
// a player who is NOT in battle, where there is no engine hook: PlayerState.addLayers (player/economy.js) is the one
// prep-side layer-gain choke point (特质, items, bands, 机变 cards, other bonds), so the mirror hangs off it.
//
// Differences from the battle copy, and why:
//   * a prep gain carries a SOURCE PIECE only when the caller can name the operator that gained (a 特质's own piece, an
//     item's target). A gain with no source piece — a strategy, a 机变 card, a bond's own round-start grant — cannot be
//     located in anybody's range and is NOT mirrored (the same rule the battle applies to a `source`-less gain);
//   * only a piece standing ON THE BOARD has a position. A piece in the hand / the 临时整备区 is not mirrored;
//   * the prep mirror never writes layers when it fires. It accumulates `n × eff` in `ps.rhodePrepAcc` and the round's
//     fractional part in `ps.rhodePrepFrac`, and the SETTLE phase (match/settle.js → settlePrepGain below) turns the
//     accumulator into layers with the same zero-carry the battle uses for its fraction;
//   * `eff` is the two-step on-board member curve (owner 2026-10-09): under `bb.field_eff_member_min` (4) members the
//     board stacks at `bb.field_eff_low` (50 %), from 4 members on at `bb.field_eff_max` (100 %), never typed twice;
//     NOTE the two halves read DIFFERENT blackboard copies of the same record, and both carry these keys (2026-10-09):
//     this side reads the bond's top-level `bb` (data/bonds.json `rhodeShip.bb`, via rhodeBb), the battle reads
//     `MOD_bond_rhode` (data/bonds.json `rhodeShip.buffs[0].bb` = data/effects.json `bondeffect_rhode.buffs[0].bb`, via
//     BB_KEY). A key added to only one of them silently falls back to a num() default on the other side;
//   * the round-end cap is the battle's `rhodeLayerCap` rule re-derived from PlayerState (`rhodePrepLayerCap` below):
//     罗德岛 never out-layers the highest ACTIVATED other bond. The battle keeps a `rhodeCapHint` for the bond that
//     triggered a mirror (its own layer write has not happened yet when the mirror reads the cap); here that bond is
//     passed as `over` (its post-gain count), so the two halves agree on what a "+n of X mirrors onto 罗德岛" gain may
//     reach. The OTHER bonds are read at their pre-gain state (`ps.bonds[bondId].layers`), never from the just-written
//     `ps.layers`: a bond that is still inactive does not count yet, exactly as the battle reads `activeBondIds`.

import { layerGainRoom } from '../../shared/constants.js';
import { tileKey, pieceDir, ownerRangeKeys } from './board.js';
import { attackRangeGrid, loadoutRecord, resolveRecordLoadout } from '../../shared/loadoutRecord.js';
import { pieceBonds } from './bondsMeta.js';

export const RHODE_BOND = 'rhodeShip';

const num = (v, d = 0) => (typeof v === 'number' && Number.isFinite(v) ? v : d);

/** The 罗德岛 blackboard (data/bonds.json `rhodeShip.bb` — the same numbers the battle reads through MOD_bond_rhode). */
export function rhodeBb(gd) {
  const bond = gd && typeof gd.bond === 'function' ? gd.bond(RHODE_BOND) : null;
  return (bond && bond.bb) || {};
}

/** Whether a piece counts as a 【罗德岛】 member: its own bonds (变形同构体 pairings included) contain rhodeShip. */
export function isRhodePiece(gd, piece) {
  return !!piece && piece.kind === 'chess' && pieceBonds(gd, piece).includes(RHODE_BOND);
}

/**
 * DISTINCT members on the board (support/baseIdOf — a normal and an elite copy of one operator count once), the same
 * count the battle's rhodeFieldCount takes over its on-field members (`st.members` filtered by onField).
 */
export function rhodeBoardMembers(gd, ps) {
  const seen = new Set();
  for (const p of ps.board.values()) {
    if (!isRhodePiece(gd, p)) continue;
    seen.add(gd.baseIdOf(p.id));
  }
  return seen;
}

/**
 * 叠层效率 (owner 2026-10-09, replacing the 2026-10-08 "per member × 25 %" ramp): a TWO-STEP curve — under
 * `bb.field_eff_member_min` (4) members the board stacks at `bb.field_eff_low` (50 %), and from that many members on at
 * `bb.field_eff_max` (100 %). The floor is applied once, to the layer total (addPrepGain / the battle's `layerGain`
 * clamp), never to the efficiency itself.
 *
 * Falls back to the old ramp (`field_eff_per_member × members`, capped at `field_eff_max`) when `field_eff_member_min`
 * is absent, so a data file that predates the 2026-10-09 curve still resolves.
 */
export function rhodePrepEff(gd, ps) {
  const bb = rhodeBb(gd);
  if (!ps.bonds || !ps.bonds[RHODE_BOND] || !ps.bonds[RHODE_BOND].active) return 0;
  return rhodeEffOf(bb, rhodeBoardMembers(gd, ps).size);
}

/** The shared two-step efficiency curve: `count` members → a multiplier. See rhodePrepEff. */
export function rhodeEffOf(bb, count) {
  const b = bb || {};
  const n = Math.max(0, num(count, 0));
  const min = num(b.field_eff_member_min, 0);
  if (min > 0) return n >= min ? num(b.field_eff_max, 1) : num(b.field_eff_low, 0.5);
  return Math.min(num(b.field_eff_max, 1), Math.max(0, num(b.field_eff_per_member, 0.25) * n));
}

/**
 * 罗德岛's layer cap at the PREP side: the highest layer count among the player's OTHER activated bonds — the battle's
 * rhodeLayerCap over `activeBondIds` (bondLayers > 0 ⇒ the bond counts), re-derived from PlayerState.
 *
 * The cap reads the player's OTHER bonds at their pre-gain state (`ps.bonds[bondId].layers`, the last recompute) and
 * only while they are ACTIVATED — the battle's `activeBondIds`/`bondLayers` pair. `ps.layers` is never read here: the
 * gain being mirrored has already been written by the caller, so a bond that is still inactive must not raise the
 * ceiling that is meant to bound it. `over` is the triggering bond's post-gain count (the battle's `rhodeCapHint`) and
 * counts even when that bond is not activated yet, because its own layers are what the mirror follows.
 * 0 without any other activated bond that holds layers.
 */
export function rhodePrepLayerCap(ps, over = null) {
  let cap = 0;
  for (const [bondId, b] of Object.entries(ps.bonds || {})) {
    if (bondId === RHODE_BOND || !b || !b.active) continue;
    cap = Math.max(cap, num(b.layers, 0));
  }
  if (over && over.bondId && over.bondId !== RHODE_BOND) cap = Math.max(cap, num(over.layers, 0));
  return cap;
}

/** 'r,c' keys of a board piece's CURRENT attack range (placement.js _ownerRangeOf: the loadout-resolved grid, rotated). */
function rangeKeysOf(ps, piece, key, dir) {
  const rec = ps.fieldRecord(ps.gd.chess(piece.id)); // 0.2.0 补位: a stand-in fights (and shows) its own range
  const grid = attackRangeGrid(loadoutRecord(rec, resolveRecordLoadout(rec, ps.loadoutFor(rec)))) || rec.rangeGrid;
  if (!Array.isArray(grid) || !grid.length) return new Set();
  return ownerRangeKeys(grid, key[0], key[1], dir);
}

/**
 * Mirror one PREP layer gain onto the accumulator (clause 1). `source` names the piece that gained (a piece object or a
 * uid); the caller passes null when the gain cannot be attributed to an operator.
 *
 * Returns the amount accumulated (0 when the gain is not mirrored). The mirror is a BOOLEAN cover — any on-board member
 * whose current range holds the gainer's tile qualifies it once, whatever the member count and however their ranges
 * overlap (the same rule as the battle's rhodeMirror).
 *
 * @param {import('./gamedata.js').GameData} gd
 * @param {import('./PlayerState.js').PlayerState} ps
 * @param {{ bondId: string, n: number, source?: any, caps?: number }} ev `caps` overrides the cap 罗德岛 may hold this
 *        round (rhodePrepLayerCap) — an internal seam used by tests, never passed by the game code
 */
export function addPrepGain(gd, ps, ev) {
  const { bondId } = ev;
  if (!bondId || bondId === RHODE_BOND) return 0;             // 罗德岛's own gains never trigger it (nor the mirror's)
  if (!ps.bonds || !ps.bonds[RHODE_BOND] || !ps.bonds[RHODE_BOND].active) return 0;
  const n = Math.floor(num(ev.n, 0));
  if (!(n > 0)) return 0;
  const loc = resolveSource(ps, ev.source);
  if (!loc || loc.area !== 'board' || loc.piece.kind !== 'chess') return 0;   // no position → nothing to locate
  if (isRhodePiece(gd, loc.piece)) return 0;                  // the members themselves never trigger it
  // inside ANY on-board member's current range: boolean, once (a knocked-out member has no board tile in prep — the prep
  // board is exactly the pieces that will be fielded)
  let covered = false;
  for (const [key, m] of ps.board) {
    if (!isRhodePiece(gd, m)) continue;
    if (rangeKeysOf(ps, m, key.split(',').map(Number), pieceDir(m)).has(tileKey(loc.row, loc.col))) { covered = true; break; }
  }
  if (!covered) return 0;
  const eff = rhodePrepEff(gd, ps);
  // `caps` (an internal seam for tests) overrides the cap 罗德岛 would hold this round
  const cap = ev.caps != null ? num(ev.caps, 0) : rhodePrepLayerCap(ps, { bondId, layers: num(ps.layers && ps.layers[bondId], 0) });
  const want = num(ps.rhodePrepAcc, 0) + num(ps.rhodePrepFrac, 0) + n * eff;
  // a round's debt never exceeds the cap 罗德岛 may hold this round (the battle's layerGain clamp at priority −60): the
  // cap clamped here is not carried forward, so a later round cannot cash in layers this round's cap never allowed.
  // (The settlement below reads the cap of ITS round again; only what it refuses — the layers the group cap blocks —
  // waits there for a round whose cap is higher.)
  const total = Math.min(want, cap);
  const add = Math.floor(total + 1e-9);
  ps.rhodePrepAcc = add;
  ps.rhodePrepFrac = total - add;
  ps.dirty();
  return add;
}

/** Where a source piece stands: { area, piece, key?, row?, col?, dir? } — the shape of PlayerState.find. */
function resolveSource(ps, source) {
  if (source == null) return null;
  const uid = typeof source === 'object' ? source.uid : source;
  if (!Number.isInteger(uid) || uid <= 0) return null;
  const loc = ps.find(uid);
  if (!loc || !loc.piece) return null;
  if (loc.area === 'board') {
    const [row, col] = String(loc.key).split(',').map(Number);
    return { area: 'board', piece: loc.piece, key: loc.key, row, col, dir: pieceDir(loc.piece) };
  }
  return loc;
}

/**
 * SETTLE phase (match/settle.js): turn the round's accumulated mirror into 罗德岛 layers, once per round.
 *
 *   total = rhodePrepAcc + rhodePrepFrac; add = floor(total + 1e-9); rhodePrepFrac = total − add
 *
 * `add` is clamped by the cap (rhodePrepLayerCap) and by BOND_LAYER_CAP (layerGainRoom), exactly like the IN_BATTLE
 * gains of the same settlement. What neither cap allowed STAYS in rhodePrepAcc — the owner's standing instruction that
 * an overflow is not lost: a later round whose cap is higher hands it over. The caller writes `ps.layers` and dispatches
 * `onLayers`.
 *
 * @returns {number} the layers the caller has to write (0 when there is nothing to settle)
 */
export function settlePrepGain(ps) {
  const total = Math.max(0, num(ps.rhodePrepAcc, 0) + num(ps.rhodePrepFrac, 0));
  const n = Math.floor(total + 1e-9);
  ps.rhodePrepFrac = total - n;
  if (!(n > 0)) { ps.rhodePrepAcc = 0; return 0; }
  if (!ps.gd.bond(RHODE_BOND)) return 0;
  const before = num(ps.layers[RHODE_BOND], 0);
  const cap = rhodePrepLayerCap(ps);
  const add = Math.max(0, Math.min(n, layerGainRoom(before, cap - before)));
  // what neither cap allowed STAYS in the accumulator (the owner's standing instruction: an overflow is not lost). It
  // is not clamped to the cap here — a later round whose cap is higher hands the backlog over; a later prep gain clamps
  // it back to the cap of that round (addPrepGain).
  ps.rhodePrepAcc = n - add;
  return add;
}
