// server/sim/content/bands/battle.js — battle side of the strategies (bands, data/bands.json; research 01 §11).
//
// Each player of a battle installs the IN_BATTLE parts of its own band, dispatched on the band buff's bbStr.key
// (numbers from the blackboard, never hard-coded). Band buffs apply in every battle kind (normal / 联防 / boss /
// hidden); IN_BATTLE layer gains are no-ops where the match disables them (support.gainLayers).
//
//   act1autochess_band2_buff  阿米娅 众志合一   ≥ value_i active bonds (highest i) ⇒ every operator ATK +atk_i,
//                                               HP +max_hp_i (直接乘算 — support directMods —, bonds snapshot at combat start)
//   act1autochess_band28_buff 埃芒加德 命结之秘 the first max_respawn_cnt operator knock-downs of the battle revive at
//                                               once — PRTS 备注 "“复活”的实现方式为：受益者因移动之外的原因退场时下次部署
//                                               的再部署时间和费用归零": the knock-out stands (被击倒时 effects run) and the
//                                               operator redeploys at once, free, where it lies (部署时 effects run, SP
//                                               reset): items reviveNow, a `death` hook after M3茧甲's and before 阿戈尔
//                                               5 / 不屈 (in place until 0.2.0, community report 「…砾和瑕光这种死亡和部
//                                               署的叠层效果，如果有艾芒加德的3次复活似乎是无法触发」)
//   act1autochess_band13_buff 克莱门莎 崇高牺牲 a <bond_id> operator knocked down ⇒ +its tier (等阶) <bond_id> layers
//                                               (bond_add_type by_charlevel; no "已激活" in the text ⇒ requireActive false)
//   act1autochess_band16_buff 大帝 加急调派     "每次部署后再部署时间减少50%": every deployment of an operator stacks one
//                                               redeploy ×(1 + respawn_time) for the rest of the battle, with no cap (PRTS
//                                               卫戍协议：盟约 下半 / PRTS盟约记录 备注 "※该策略效果可无限叠加"; a 20-stack cap
//                                               until 0.2.2 — GitHub #328, PR #329)
//   act1autochess_band17_buff 桑葚 药枚实验     at combat start the player's units on the front-most (最右边) column: each
//                                               attack has `prob` to gain 1 shield layer (max 1)
//   act1autochess_band18_buff 休谟斯 回收利用   a ground (地面) operator's skill ends ⇒ a random operator on its 4
//                                               neighbouring tiles gains `sp` SP
//   act1autochess_band15_buff 卡莱莎 食腐之蝶   an operator knocked down ⇒ every other unit of the player on the field
//                                               ATK +atk × n, n ≤ max_stack_cnt (+20 % … +200 %, additive stacks),
//                                               until that unit is knocked down itself or the battle ends
//   act1autochess_band19_buff 陈 以己之长       the player's operators' physical / arts damage becomes 弱点伤害
//   act2autochess_band12_buff 夕 墨色真颜       at combat start operators of which ≥ 2 of the same name (same base chess,
//                                               elite or not) stand on the field get ATK +atk
//   act2autochess_band3_buff  伊奥莱塔 统御号令 at combat start n = elite operators on the field ⇒ every elite operator
//                                               ATK +atk_per_cnt × n, HP +max_hp_per_cnt × n (all 直接乘算)
// MOD_band_kun: after three lethal devours, revive the victims and give the last credited devourer liftoff and anti-air.
//   auto_chess_change_map     Touch 外勤医疗    "所有玩家场地上出现一名<预备干员-医疗>": once selected in this match, its
//                                               retained team grant gives every player's field the map character of the
//                                               variant whose common_condition holds for that player's elites on the field
//                                               (condition_golden_chess_le cnt → 预备干员-医疗, _ge cnt → Touch), spawned at
//                                               combat start on its stage slot (tokens.spawnMapChar). [ASSUMED] that slot's
//                                               aggroSeq precedes ordinary initial operators; deploySeq stays the runtime spawn
// Prep-only bands (economy / shop / grants / layers at prep end or round start) live in bands/meta.js.

import {
  num, buffsOf, bandRecord, isOp, onField, isElite, tierOf, unitBonds, activeBondIds, playerOps, passiveBuff, fxOn,
  matchBands, gainLayers, alliesAround, N4, baseChessId, isGroundOp, directMods,
} from '../support/index.js';
import { weaknessRetype, addShieldLayer, PRIO_RESPAWN, reviveNow } from '../items/battle.js';
import { spawnMapChar } from '../tokens.js';

export const AMEDIC_BAND = 'band_amedic';
/**
 * 'death' priority of 埃芒加德's revive: a knock-out (so after every `fatal` saver — kits', 坚固维式重锤's 不死), after the
 * operator's own M3茧甲 (PRIO_RESPAWN 13), before 阿戈尔 5's first-knock-out revive (11) and 不屈 (10).
 */
export const PRIO_BAND_REVIVE = PRIO_RESPAWN - 1;

const keyOf = (bandId, part = '') => `band:${bandId}${part ? `:${part}` : ''}`;
const deployedOps = (battle, pid) => playerOps(battle, pid, { fieldOnly: true });

/** DamageInfo tag the 阿戈尔 devour puts on its 5000 物理流失 (bonds/core.js devour: `battle.loseHp(…, { tags: ['bond:egir:devour'] })`). */
const DEVOUR_TAG = 'bond:egir:devour';

// ---------------------------------------------------------------------------------------------------------------
// band buff behaviours: (battle, ps, params, bandId)

const BY_KEY = {
  // 阿米娅 众志合一
  act1autochess_band2_buff(battle, ps, p, bandId) {
    const n = activeBondIds(battle, ps.playerId).length;
    let atk = 0, hp = 0;
    for (let i = 1; i <= 9 && p[`value_${i}`] != null; i++) {
      if (n >= num(p[`value_${i}`], Infinity)) { atk = num(p[`atk_${i}`]); hp = num(p[`max_hp_${i}`]); }
    }
    if (!(atk > 0 || hp > 0)) return;
    const mods = directMods({ atk, hp });
    for (const u of playerOps(battle, ps.playerId)) passiveBuff(battle, u, keyOf(bandId), mods);
  },

  // 埃芒加德 命结之秘
  act1autochess_band28_buff(battle, ps, p, bandId) {
    const max = Math.floor(num(p.max_respawn_cnt, 3));
    if (!(max > 0)) return;
    let used = 0;
    battle.on('death', (c) => {
      const u = c.unit;
      if (used >= max || !isOp(u) || u.ownerId !== ps.playerId || !reviveNow(battle, c, 'band')) return;
      used++;
      fxOn(battle, 'revive', u, keyOf(bandId), bandId, { left: max - used });
    }, { priority: PRIO_BAND_REVIVE });
  },

  // 克莱门莎 崇高牺牲: PRTS requires the 阿戈尔 bond to be active.
  act1autochess_band13_buff(battle, ps, p, bandId) {
    const bond = typeof p.bond_id === 'string' && p.bond_id ? p.bond_id : null;
    if (!bond) return;
    const byLevel = p.bond_add_type == null || p.bond_add_type === 'by_charlevel';
    battle.on('death', (c) => {
      const u = c.unit;
      if (c.reason !== 'killed' || !isOp(u) || u.ownerId !== ps.playerId || !unitBonds(u).includes(bond)) return;
      const n = byLevel ? tierOf(u) : Math.max(1, Math.floor(num(p.value, 1)));
      if (gainLayers(battle, { playerId: ps.playerId, bonds: bond, n, requireActive: true, source: u, reason: 'band' }) > 0) {
        fxOn(battle, 'layer', u, keyOf(bandId), bandId, { bond, n });
      }
    });
  },

  // 大帝 加急调派
  act1autochess_band16_buff(battle, ps, p, bandId) {
    const mul = Math.max(0, 1 + num(p.respawn_time, 0));
    if (mul === 1) return;
    const key = keyOf(bandId);
    battle.on('deploy', (c) => {
      const u = c.unit;
      if (!isOp(u) || u.ownerId !== ps.playerId) return;
      battle.addBuff(u, { key, mods: { redeployMul: mul }, refresh: 'stack', stacks: 1, maxStacks: Infinity, persist: true, allowDead: true });
    });
  },

  // 桑葚 药枚实验
  act1autochess_band17_buff(battle, ps, p, bandId) {
    const pr = num(p.prob);
    if (!(pr > 0)) return;
    const key = keyOf(bandId, 'shield');
    const chosen = new Set();
    battle.on('battleStart', () => {
      const units = battle.allies(ps.playerId);
      // "最右边的所有我方单位": the rightmost column of the player's own board (a board position, whatever the units'
      // directions; the mirrored Final Assault right side counts from the field's left)
      const boardCol = (u) => (ps.mirror ? -u.tileC : u.tileC);
      let front = -Infinity;
      for (const u of units) front = Math.max(front, boardCol(u));
      for (const u of units) if (boardCol(u) === front) chosen.add(u);
    });
    battle.on('attack', (c) => {
      const u = c.attacker;
      if (!chosen.has(u) || !u.alive) return;
      if (!(pr >= 1 || battle.rng() < pr)) return;
      if (addShieldLayer(battle, u, key, 1)) fxOn(battle, 'shield', u, keyOf(bandId), bandId);
    });
  },

  // 休谟斯 回收利用 ("地面干员技能结束时…": a melee-position operator on any tile — support isGroundOp)
  act1autochess_band18_buff(battle, ps, p, bandId) {
    const sp = num(p.sp);
    if (!(sp > 0)) return;
    battle.on('skillEnd', (c) => {
      const u = c.unit;
      if (!isOp(u) || u.ownerId !== ps.playerId || c.reason === 'death' || !onField(u) || !isGroundOp(u)) return;
      const cands = alliesAround(battle, u, N4).filter((a) => a.kind === 'op' && a.skill && !a.skill.noSkill && a.skill.kind !== 'passive');
      const t = cands.length ? battle.rng.pick(cands) : null;
      if (!t) return;
      t.skill.gainSp(sp, 'band');
      fxOn(battle, 'spGain', t, keyOf(bandId), bandId, { n: sp, from: u.id });
    });
  },

  // 卡莱莎 食腐之蝶
  act1autochess_band15_buff(battle, ps, p, bandId) {
    const step = num(p.atk);
    const cap = Math.max(1, Math.floor(num(p.max_stack_cnt, 10)));
    if (!(step > 0)) return;
    const key = keyOf(bandId);
    battle.on('death', (c) => {
      const d = c.unit;
      if (c.reason !== 'killed' || !isOp(d) || d.ownerId !== ps.playerId) return;
      for (const a of battle.allies(ps.playerId)) {
        if (a === d) continue;
        const cur = a.findBuff(key);
        const n = Math.min(cap, (cur && cur.data ? cur.data.n : 0) + 1);
        battle.addBuff(a, { key, mods: directMods({ atk: step * n }), refresh: 'replace', data: { n }, visible: true });
      }
    });
  },

  // 陈 以己之长
  act1autochess_band19_buff(battle, ps) {
    battle.on('hit', (c) => {
      const s = c.source;
      if (!isOp(s) || s.ownerId !== ps.playerId || !c.target || c.target.side !== 'enemy') return;
      weaknessRetype(c.dmg, s, c.target);
    }, { priority: 5 });
  },

  // 夕 墨色真颜
  act2autochess_band12_buff(battle, ps, p, bandId) {
    const atk = num(p.atk);
    if (!atk) return;
    battle.on('battleStart', () => {
      const groups = new Map();
      for (const u of deployedOps(battle, ps.playerId)) {
        const b = baseChessId(u);
        if (!groups.has(b)) groups.set(b, []);
        groups.get(b).push(u);
      }
      for (const list of groups.values()) {
        if (list.length < 2) continue;
        for (const u of list) passiveBuff(battle, u, keyOf(bandId), directMods({ atk }));
      }
    });
  },

  // 伊奥莱塔 统御号令
  act2autochess_band3_buff(battle, ps, p, bandId) {
    const a = num(p.atk_per_cnt), h = num(p.max_hp_per_cnt);
    if (!(a > 0 || h > 0)) return;
    battle.on('battleStart', () => {
      const elites = deployedOps(battle, ps.playerId).filter(isElite);
      const n = elites.length;
      if (!n) return;
      const mods = directMods({ atk: a * n, hp: h * n });
      for (const u of elites) passiveBuff(battle, u, keyOf(bandId), mods);
    });
  },

  // 鲲 化鲲为鹏（只因）
  //
  // 阿戈尔's devour (bonds/core.js devour: the 5-tier bond's battle-start pass) knocks operators out with a 5000 物理流失
  // whose DamageInfo carries DEVOUR_TAG. The band counts those knock-outs and, on the one that reaches devour_count, (a)
  // revives every one of them in place and (b) makes the 阿戈尔 the devour credits with that knock-out take off.
  //
  // The count hangs on the `damaged` event, never on the `devour` fx: the fx fires for every mark the pass RESOLVES,
  // before the loss lands — a marked unit that survives it (HP, a 战斗中的 不死 …), or one whose remaining marks are
  // cancelled once it is knocked out, is no knock-out (bonds/core.js devour). The damage tag is visible nowhere else:
  // the `death` event carries `{ unit, reason, killer }` only, and the killer alone cannot tell the devour from an
  // attack or a skill of the same 阿戈尔. Lethality is read off `target.hp` in `damaged` (applyHpLoss clamps it to 0
  // before the event and the `kill` follows): every `fatal` saver — items (PRIO_REVIVE / PRIO_RESPAWN), kits, 埃芒加德's
  // band (PRIO_BAND_REVIVE) — has already run and left a saved unit at HP ≥ 1, so a saved unit is never counted.
  // The revive is bond:indomShip's "立刻重新部署" (its own comment: 令受益者下次部署的再部署时间和费用归零), i.e. an immediate
  // `battle.redeploy(u, { free })` on the unit's rest tile — where it fell (Battle.restTile) — so it IS a new deployment
  // (deploySeq++, `deploy { initial: false }`, full HP, SP reset), which is also what opens a new deployment for
  // 坚固维式重锤's lock; `revivedInPlace` (M3茧甲 / 埃芒加德, an in-place 复活 that never leaves the field) is not used
  // here. Down units another mechanism has already picked up are left alone (the hook runs after 阿戈尔 5's own
  // 立刻复活, priority 11, and 不屈's, 10 — the file's convention, 埃芒加德's PRIO_BAND_REVIVE) and the devour's own
  // cancellation rule keeps a revived member's pending marks from knocking it out again.
  // 该【阿戈尔】干员 = the marker `death` credits with the knock-out that reaches the count (bonds/core.js devour:
  // "击杀来源始终为对应标记的付与来源"), not every 阿戈尔 that ate something [ASSUMED: the text names one]. Its 起飞 is the
  // tier2.js LIFTOFF_FLAGS pair on a persisted buff — `liftoff` drops the ground block (Battle._blockerFor; a ground
  // enemy already held lets go, ai.js updateEnemy) and adds 对地规避 (targeting.js evadesGround, the official 起飞 term),
  // `blockFly` is what lets it block air units instead (the unit stays a 地面单位 on its tile). "可同时攻击地面与空中的
  // 敌人" has no buff flag: the attack profile is resolved per unit at setup (professions.resolveProfile — a melee 阿戈尔
  // has canHitFly false, a 要塞 / 炮手 is groundOnly), so the band retypes the live profile (tier5.js replaces profiles
  // the same way).
  // Once per battle, on the knock-out that REACHES the count ("达到3名时"): the count keeps growing afterwards, but the
  // band neither revives nor takes off again — a later devour knock-out stays down [ASSUMED: 本次 = the knock-outs the
  // trigger counted]. The band names no 我方 and the devour itself has no own-side limit (a teammate's operator in front
  // is devoured like an own one): the count, the revive and the take-off follow the devour, whatever the owner.
  MOD_band_kun(battle, ps, p, bandId) {
    const need = Math.max(1, Math.floor(num(p.devour_count, 3)));
    const free = !(num(p.revive_redeploy_cost, 0) > 0);
    const flags = {};
    if (num(p.liftoff, 0) > 0) flags.liftoff = true;
    if (num(p.block_fly, 0) > 0) flags.blockFly = true;
    const hitFly = num(p.hit_fly, 0) > 0;
    const pending = new Set(); // a lethal devour hit is on this unit right now (`damaged` → its `death`)
    const downed = [];         // [{ unit, by }] the devour knock-outs of this battle, in knock-out order
    let fired = false;
    battle.on('damaged', (c) => {
      const t = c.target;
      if (fired || !t || t.side !== 'ally' || t.kind !== 'op' || !t.alive || t.hp > 0) return;
      const dmg = c.dmg;
      if (!dmg || !Array.isArray(dmg.tags) || !dmg.tags.includes(DEVOUR_TAG)) return;
      pending.add(t);
    });
    battle.on('death', (c) => {
      const u = c.unit;
      if (c.reason !== 'killed' || !pending.delete(u) || fired) return;
      downed.push({ unit: u, by: c.killer });
      if (downed.length < need) return;
      fired = true;
      for (const d of downed) {
        if (d.unit.alive || d.unit.removed) continue; // already standing again (阿戈尔 5's 立刻复活, 不屈, M3茧甲 …)
        if (!battle.redeploy(d.unit, { free })) continue;
        fxOn(battle, 'revive', d.unit, keyOf(bandId), bandId);
      }
      const by = downed[downed.length - 1].by;
      if (!by || !isOp(by)) return;
      if (flags.liftoff || flags.blockFly) {
        passiveBuff(battle, by, keyOf(bandId, 'liftoff'), null, { flags, visible: true });
        // `takeoffKun`, not the shared `takeoff` (render/fx.js): this is a once-per-battle moment, and the generic 起飞
        // burst is the same 0.4 s effect 浮空 / 失重 use — it disappeared under the three 复活 summons fired beside it.
        fxOn(battle, 'takeoffKun', by, keyOf(bandId, 'liftoff'), bandId);
      }
      if (hitFly) { by.profile.canHitFly = true; by.profile.groundOnly = false; }
    });
  },
};

// ---------------------------------------------------------------------------------------------------------------
// Touch 外勤医疗 (auto_chess_change_map, every player's field)

/** Map-character variants of band_amedic: [{ cond, cnt, chars: [tokenId…] }]. */
export function amedicVariants(bandId = AMEDIC_BAND) {
  const out = [];
  for (const b of buffsOf(bandRecord(bandId))) {
    if (b.key !== 'auto_chess_change_map') continue;
    const chars = new Set();
    for (const [k, v] of Object.entries(b.p)) if (k.includes('#') && num(v) > 0) chars.add(k.split('#')[0]);
    out.push({ cond: String(b.p.common_condition || ''), cnt: num(b.p.cnt, 0), chars: [...chars] });
  }
  return out;
}

/** Map characters for a player with `elites` elite operators on the field. */
export function amedicCharsFor(elites, variants = amedicVariants()) {
  for (const v of variants) {
    const ok = /_ge$/.test(v.cond) ? elites >= v.cnt : /_le$/.test(v.cond) ? elites <= v.cnt : false;
    if (ok) return v.chars;
  }
  return [];
}

function installMapChars(battle) {
  const variants = amedicVariants();
  if (!variants.length) return;
  const holders = battle.players.filter((ps) => matchBands(battle, ps.playerId).includes(AMEDIC_BAND));
  if (!holders.length) return;
  battle.on('battleStart', () => {
    const chars = [];
    for (const ps of holders) {
      const elites = deployedOps(battle, ps.playerId).filter(isElite).length;
      for (const id of amedicCharsFor(elites, bandRecord(ps.bandId)?.effectRef === AMEDIC_BAND ? amedicVariants(ps.bandId) : variants)) chars.push({ playerId: ps.playerId, id });
    }
    for (const [i, { playerId, id }] of chars.entries()) {
      // The reserve medic occupies this stage slot in preparation; Touch replaces it at battle start. [ASSUMED]
      // Replacement preserves the slot's priority before ordinary deployments. Shared-field ordering between
      // prepared characters follows player order, as for other initial placements (lifecycle.js).
      const u = spawnMapChar(battle, playerId, id, { preBattleAggroSeq: i - chars.length });
      if (u) fxOn(battle, 'summon', u, keyOf(AMEDIC_BAND), AMEDIC_BAND);
    }
  });
}

// ---------------------------------------------------------------------------------------------------------------

/** Band buff keys with a battle part (tests / tooling). */
export const BATTLE_BUFF_KEYS = Object.freeze([...Object.keys(BY_KEY), 'auto_chess_change_map']);

/** Does this band have a battle part? */
export function hasBattlePart(bandId) {
  return buffsOf(bandRecord(bandId)).some((b) => (b.bbKey && BY_KEY[b.bbKey]) || b.key === 'auto_chess_change_map');
}

export function install(battle) {
  for (const ps of battle.players) {
    const band = ps.bandId ? bandRecord(ps.bandId) : null;
    if (!band) continue;
    for (const b of buffsOf(band)) {
      const f = b.bbKey ? BY_KEY[b.bbKey] : null;
      if (!f) continue;
      try { f(battle, ps, b.p, ps.bandId); } catch (e) { battle._handlerError?.(`band:${ps.bandId}`, null, e); }
    }
  }
  installMapChars(battle);
}
