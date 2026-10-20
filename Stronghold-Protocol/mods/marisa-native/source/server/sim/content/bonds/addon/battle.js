// server/sim/content/bonds/addon/battle.js — battle side of the add-on bonds (research 02 §3.9–§3.23, plus 罗德岛
// rhodeShip from data/bonds.json `rhodeShip` / `spec`).
//
// Every number comes from data/bonds.json (`env_gbuff_new` buff blackboards). ATK / DEF / max HP "+X%" are 直接乘算
// (support directMods: additive with every other percentage, PRTS 盟约记录). Effects only apply to the owning
// player's units (`unit.ownerId === playerId`): two players sharing a boss / 联防 field never buff each other.
// Layer-dependent values read the LIVE layers (`battle.getPlayer(pid).bonds[id].layers`): an IN_BATTLE layer gain
// (engine `layerGain` hook, which fires before the layers are written) schedules one deferred recompute per player.
//
//   精准 preciShip     members ATK +(base_atk + atk_per_stack·L); tier 2 (3 distinct): members + RANGED operators,
//                      which also ignore power_def_penetrate DEF / power_magic_resist_penetrate RES (defIgnorePct / resIgnorePct)
//   迅捷 swiftShip     member skill end → p = min(1, base_prob + prob_per_stack·L): +normal_sp SP; L ≥ power_bond_stack_cnt:
//                      every operator's skill end rolls p again for +power_sp (members roll both, research [ASSUMED])
//   灵巧 skillfulShip  aura: members + operators on their 4 (L ≥ 40: 8) adjacent tiles ASPD +(base + per·L), once per unit;
//                      killed members keep providing it from their body tile until redeploy; retreat / forcedExit do not
//   奥术 arcaneShip    member arts damage → target arts taken ×(base + per·L) for weak_duration s; tier 2: ×power_weak_scale
//                      when the target is below hp_ratio at application. ONE instance per target whatever applies it — the
//                      two players of a pair field compete for it, the strongest wins (battle.applyStrongest, 同名效果取最高:
//                      PRTS 作战机制 "同名buff的默认叠加策略buff只能表现出一个"; 巴哈姆特 12316 first-hand: "共享型buff會跟對面搶
//                      如果對面層數比你高就不需要再特別激活直接吃他的奧術buff"). v2.5 kept one per player, so two players'
//                      instances multiplied (×5.4 × ×5.6 on a leader at ~250 layers, DESIGN §20.10). PRTS 盟约记录's own
//                      note "※同一单位仅可对同一目标同时施加1个该盟约法术伤害提升效果" (one instance per unit and target)
//                      fits it under the engine default (a newer same-named buff waits until the earlier ends, PRTS
//                      常见同名状态); strongest vs earliest is [ASSUMED]. Known deviation [ASSUMED]: an earlier revision
//                      (oldid 386936) forbade a unit re-applying while its own instance lasts; an equal hit here
//                      refreshes it to a fresh 3 s (slightly stronger). Re-measured after the 0.1.0 report
//                      "奥术盟约不生效": it works on the real and the browser path (test/sim/feedback1b-arcane.test.js);
//                      标准 never activates it (modeDataDict inactiveBondIdList)
//   坚守 steadShip     all operators max HP +(base + per·L); tier 2: 40 % of a non-member operator's damage is borne by
//                      the members on the field (split evenly, sourceless true damage — already mitigated), members’ thorns
//                      (base + per·L arts, sourceless but credited to the member hit, ≤ 1 per cd_duration per member;
//                      无来源 damage uses the chance and hits nobody, a 流失 never does — PRTS 备注 / 作战机制)
//                      + 脆弱 ×damage_scale for weak[limit] s
//   助力 deputShip     all operators DEF +(base + per·L), redeploy time ×(1 + respawn_time)
//   突袭 raidShip      member idle ≥ no_attack_duration s (or skill ready — a passive skill that is on counts, GitHub
//                      #49, and so does a deploy-timed skill while it runs, #109) with no enemy in range → "保留技力立即再部署"
//                      next to the most advanced ground enemy it can reach — a 隐匿 (unrevealed) ground enemy too, and one
//                      in its range counts for 「范围内没有敌人」 (the owner's decision of 2026-10-08 from the official game,
//                      GitHub #316; asleep, untargetable and flying ones stay out: raidGroundEnemy): on a free tile of a board of its field
//                      (Battle.onFieldBoard: its own or a teammate's on the same field — the two-helper 联防 field and a
//                      pair field open both halves, the owner's decision of 2026-10-07; #475 also opens an empty half
//                      for multiplayer boss/hidden Raid only, approved 2026-10-10; never a boss field's hand /
//                      临时整备区 rows, never the empty other half of a lone 联防 helper or a single-mode boss field — community
//                      reports of 2026-10-06, items 40 and 16.3) its position may be deployed
//                      on from which its range covers that enemy (GitHub issue #51 [ASSUMED]: the first of the 8 most
//                      advanced that has such a tile; none → it stays and the next poll looks again, never a jump that
//                      hits nothing) — for a melee member that blocks, a tile where its block applies first (ground
//                      units pass it, an enemy path runs through it: not a 围墙 — the owner's decision of 2026-10-06,
//                      GitHub #148); grid.canStand: never the 深水区 (player report #3 after 0.1.0, members dropped
//                      into 战场#08's pool after an enemy wading in it); Battle.isReservedTile: never a tile a knocked-out
//                      operator lies on (player report F5, members landed on a fallen teammate). A real redeployment
//                      (retreat + free redeploy on the landing tile, full HP, `deploy` fires — 部署时 traits such as
//                      史尔特尔, 突袭手雷, 卡西米尔, 叙拉古) with its SP / charges kept (engine redeploy tile + keepSp);
//                      ATK/HP +(base + per·L) until it leaves the field; knocked out after a jump it lies where it fell
//                      and comes back there (the engine's rest tile, Battle._layBody — PRTS 卫戍协议/帮助 "原地留下一个
//                      “倒地干员”…自动部署至该位置"; its own home when it fell on another board piece's home);
//                      L ≥ power_bond_stack_cnt: every operator ASPD +power_attack_speed.
//                      Ordinary polls order candidates by remaining path distance, then id (the 0.2.3 rule). The one
//                      reselect right after a revive — knocked out, and back before the respawn timer (不屈 / 阿戈尔 /
//                      复活, or the same kill + immediate redeploy) — orders by taunt, then that distance, and jumps
//                      while the operator is not blocking. An enemy already standing on its tile counts: the 0.25 s
//                      poll runs before that tick's block pass, so the reselect refreshes contact first. A retreat,
//                      a move, a redeploy that waited out its timer, and Raid's own jump do not arm that reselect.
//   不屈 indomShip     ground operator knocked out → p = min(1, base + per·L) immediate free redeploy where it lies
//                      (the engine's rest tile); tier 2: every operator on the field +sp SP
//   协防 emptyShip     all operators phys/arts taken ×(1 − damage_resistance); members dealt ×damage_scale_normal
//                      (elite ×damage_scale_extra)
//   独行 soloShip      the member(s) ATK +atk, HP +max_hp, +sp SP on every deploy
//   绝技 suntShip      tier 1: elite operators ATK +power_atk; tier 2: elites (and their summons) SP cost ×sp_ratio
//   罗德岛 rhodeShip   tier 1: a friendly non-member standing inside a member's CURRENT attack range gains n layers of ANY
//                      bond → 【罗德岛】 gains n too (hooked on the engine's `layerGain`, keyed on the gain's source unit; the
//                      member itself and other members never trigger it — a gain whose `source` is null cannot be located
//                      [ASSUMED]); every operator's healing received ×(1 + 0.01·floor(L/5)); damage over time landing on
//                      our operators ends 5 s after it landed (clause 3 — see the deviation note below); a healed operator
//                      deals 弱点伤害 to the enemies on the 8 tiles around it: actual heal × L × 0.1, credited to the healed
//                      operator (weaknessRetype, content/items/battle.js — the engine has no `weakness` damage type; the
//                      owner's decision for kill credit). The strike is guarded against re-entering itself: its damage
//                      names the healed operator, so a heal-driven trait it procs (咒愈师: 50 % of the damage dealt heals
//                      an ally — 刺玫's trait) would heal → strike → heal forever (each round × healRatio·L·0.1 ≈ 0.5,
//                      dying only below damage.js's 0.5 floor). Only the outermost strike of a chain fires. tier 2
//                      (2 distinct members on the field): a whole-field heal aura
//                      every interval(L) = 0.5 + 4.5·(1 − sqrt(L/100)) s — 5 s at L 0, 0.5 s at L ≥ 100 — of L HP per
//                      operator; the OVERHEAL (the heal minus the missing HP) becomes actual ATK 1:1 (normalized
//                      `atkFinal`), accumulating per operator up to 100 % of its own ATK and dropped 2 s
//                      after the last overflow. No caster heals the aura, so nothing gets its heal credit [ASSUMED].
//   远见 / 奇迹 / 投资人 / 调和 have no battle effect (prep side, membership in support/index.js).
//
// Hooks registered only when a bond needs them. Priorities: `hit` −20 (坚守 redirect, after other modifiers had their
// say), `death` 10 (不屈, the bond slot of the revive/redeploy convention); everything else 0 — except 罗德岛's
// `layerGain` −50 (clause 1: after 魔王's +n at 0, before the standing-buff re-read at −100) and its `heal` −1000
// (clause 4: after every heal-amount modifier had its say, 明椒's included).
//
// 罗德岛 clause 3 ("我方干员受到的持续性伤害不超过5秒") has NO engine choke point. A damage-over-time effect in this
// engine is any buff with `interval` + an `onTick` that damages its own unit (ab:bleed — arts, tags ['enemyAbility',
// 'bleed']; boss:*Dot — phys; 深水区 / 污染 — true 'dot'), the engine has no hook for a buff being applied and no marker on
// a buff saying whether it deals damage, and enemy zones deal their tick from their own poll instead of a buff at all.
// The closest faithful version: Battle.addBuff — the point where a DoT lands — is wrapped once, every periodic buff with a
// finite declared duration landing on one of our operators is cut to dot_duration_cap s at once, and its first tick
// decides: damage taken (the operator's `stats.taken` rose) keeps it a DoT for good, no damage gives the buff its natural
// remaining time back and it is never cut again. Deviations [ASSUMED], all noted at installRhodeDotCap: a DoT whose
// `interval` is longer than the cap cannot be pre-cut (that would destroy a harmless slow buff before its first tick) and
// is only cut once it has damaged; a tick fully absorbed by a shield / 无敌 proves nothing; a never-expiring periodic buff
// (duration Infinity — 深水区's water, ab:pilot, auras) is presence-based rather than a timed DoT and is left alone.

import { canTargetEnemy, enemyStealthed, extendedGrid } from '../../../targeting.js';
import { normDir, rotateOffset, localOrder, localBefore } from '../../../dir.js';
import { bodyKeys, bodyInRange } from '../../../body.js';
import { applyRedirectCut, isHpLoss, redirectShare } from '../../../damage.js';
// MOD（罗德岛）：clause 4 的「治疗 → 弱点伤害」用到 aggregateMods / weaknessRetype
import { aggregateMods } from '../../../buffs.js';
import { weaknessRetype } from '../../items/battle.js';
import { BOSS_ROW_OFFSET } from '../../../constants.js';
import { GEO } from '../../../../../shared/constants.js';
import {
  num, bondRecord, buffParams, bondTier, bondLayers, activeBondIds, isMember, isElite, isGroundOp, isOp, onField, playerOps,
  passiveBuff, fxOn, gainLayers, inRange, baseChessId, battleStore, N4, N8, directMods, COLS,
} from '../../support/index.js';

export const ID = Object.freeze({
  preci: 'preciShip', swift: 'swiftShip', skillful: 'skillfulShip', arcane: 'arcaneShip', stead: 'steadShip',
  deput: 'deputShip', raid: 'raidShip', indom: 'indomShip', empty: 'emptyShip', solo: 'soloShip', sunt: 'suntShip',
  rhode: 'rhodeShip',
});
export const KEY = Object.freeze({
  preci: 'bond:preciShip', stead: 'bond:steadShip', deput: 'bond:deputShip', skillful: 'bond:skillfulShip',
  raid: 'bond:raidShip', raidAspd: 'bond:raidShip:aspd', empty: 'bond:emptyShip', emptyDmg: 'bond:emptyShip:dmg',
  solo: 'bond:soloShip', sunt: 'bond:suntShip', arcane: 'bond:arcaneShip',
  rhodeHeal: 'bond:rhodeShip:heal', rhodeAtk: 'bond:rhodeShip:overflow',
});
/**
 * 罗德岛's own record buff key — the runtime key `MOD_bond_rhode` (data/bonds.json `rhodeShip.buffs[0]`, the same record in
 * data/effects.json `bondeffect_rhode`). Unlike the other add-on bonds it is not an `env_gbuff_new` record, so its bb has
 * to be read through this key instead of bondBb().
 */
export const RHODE_MOD_KEY = 'MOD_bond_rhode';
const BB_KEY = Object.freeze({ [ID.rhode]: RHODE_MOD_KEY });
/** Bonds whose battle values depend on layers (recomputed on in-battle gains). */
const LAYERED = new Set([ID.preci, ID.swift, ID.skillful, ID.arcane, ID.stead, ID.deput, ID.raid, ID.indom, ID.rhode]);
const STEAD_CD = 'bond:steadShip:cd';
const AURA_POLL = 0.25;
const RAID_POLL = 0.25;
const RAID_SEARCH = 2; // landing tiles within this Chebyshev distance of the target enemy
const RAID_TARGETS = 8; // candidate enemies a poll tries per member, the most advanced first (raidTargets)

/** 奥术 vulnerability mods for a multiplier (battle.applyStrongest). */
const arcaneMods = (v) => ({ artsTakenMul: v });

/** `env_gbuff_new` blackboard of a bond (numbers only). */
export function bondBb(bondId) {
  return buffParams(bondRecord(bondId), 'env_gbuff_new') ?? {};
}
/** 迅捷 / 不屈 proc chance p = min(1, base_prob + prob_per_stack·L). */
export const procChance = (bb, L) => Math.max(0, Math.min(1, num(bb.base_prob) + num(bb.prob_per_stack) * L));
const prob = procChance;

// =====================================================================================================================
// per-player state

function makeState(battle, p) {
  const pid = p.playerId;
  const ops = playerOps(battle, pid);
  const st = { pid, ops, tiers: {}, bb: {}, members: {} };
  for (const id of Object.values(ID)) {
    const t = bondTier(battle, pid, id);
    if (t <= 0) continue;
    st.tiers[id] = t;
    st.bb[id] = BB_KEY[id] ? (buffParams(bondRecord(id), BB_KEY[id]) ?? {}) : bondBb(id);
    st.members[id] = new Set(ops.filter((u) => isMember(battle, u, id)));
  }
  return st;
}
const L = (battle, st, id) => bondLayers(battle, st.pid, id);
/** Same guard as units.js `_recalc` (finite or the fallback) — kept local, units.js does not export it. */
const fin = (v, d) => (Number.isFinite(v) ? v : d);

// =====================================================================================================================
// match-long passives (re-applied on layer changes; passiveBuff replaces by key → idempotent)

function applyPassives(battle, st) {
  const t = st.tiers;
  if (t[ID.preci]) {
    const bb = st.bb[ID.preci];
    const wide = t[ID.preci] >= 2;
    const mods = directMods({ atk: num(bb.base_atk) + num(bb.atk_per_stack) * L(battle, st, ID.preci) });
    if (wide) { mods.defIgnorePct = num(bb.power_def_penetrate); mods.resIgnorePct = num(bb.power_magic_resist_penetrate); }
    for (const u of st.ops) {
      if (st.members[ID.preci].has(u) || (wide && u.def?.position === 'RANGED')) passiveBuff(battle, u, KEY.preci, mods);
    }
  }
  if (t[ID.stead]) {
    const bb = st.bb[ID.stead];
    const mods = directMods({ hp: num(bb.base_max_hp) + num(bb.max_hp_per_stack) * L(battle, st, ID.stead) });
    for (const u of st.ops) passiveBuff(battle, u, KEY.stead, mods);
  }
  if (t[ID.deput]) {
    const bb = st.bb[ID.deput];
    const mods = directMods({ def: num(bb.base_def) + num(bb.def_per_stack) * L(battle, st, ID.deput) }, { redeployMul: Math.max(0, 1 + num(bb.respawn_time)) });
    for (const u of st.ops) passiveBuff(battle, u, KEY.deput, mods);
  }
  if (t[ID.raid]) {
    const bb = st.bb[ID.raid];
    const lv = L(battle, st, ID.raid);
    const milestone = num(bb.power_bond_stack_cnt, Infinity);
    if (lv >= milestone) {
      const mods = { aspd: num(bb.power_attack_speed) };
      for (const u of st.ops) passiveBuff(battle, u, KEY.raidAspd, mods);
      if (!st.raidMilestone) { st.raidMilestone = true; for (const u of st.members[ID.raid]) if (onField(u)) { fxOn(battle, 'bondMilestone', u, KEY.raid, 'aspd'); break; } }
    }
    st.raidMods = raidMods(bb, lv);
    for (const u of st.members[ID.raid]) {
      const b = u.findBuff(KEY.raid);
      if (b) { b.mods = st.raidMods; u.markDirty(); }
    }
  }
  if (t[ID.arcane]) {
    const bb = st.bb[ID.arcane];
    const m = num(bb.base_damage_scale, 1) + num(bb.damage_scale_per_stack) * L(battle, st, ID.arcane);
    st.arcaneMul = Math.max(0, m);
    st.arcaneLowMul = Math.max(0, m * num(bb.power_weak_scale, 1));
  }
  if (t[ID.skillful]) {
    const bb = st.bb[ID.skillful];
    const lv = L(battle, st, ID.skillful);
    const v = num(bb.base_attack_speed) + num(bb.attack_speed_per_stack) * lv;
    if (!st.auraMods || st.auraMods.aspd !== v) st.auraMods = { aspd: v };
    st.auraWide = lv >= num(bb.power_bond_stack_cnt, Infinity);
  }
  if (t[ID.rhode]) {
    // 罗德岛 "场上所有我方干员受治疗效率提升（每5层+1%）": the engine's heal pipeline multiplies by the target's own
    // `healingTakenMul` (sim/damage.js heal(), the same mod 明椒 / 棘刺2 use), so the whole bonus is one standing buff
    // per operator, re-applied (replaced) on every layer change — value 1 while floor(L/5) is 0 keeps a stale value from
    // surviving a layer drop.
    const mul = rhodeHealMul(st.bb[ID.rhode], L(battle, st, ID.rhode));
    for (const u of st.ops) passiveBuff(battle, u, KEY.rhodeHeal, { healingTakenMul: mul });
  }
}

function raidMods(bb, lv) {
  const mods = directMods({
    atk: num(bb.base_atk) + num(bb.atk_per_stack) * lv,
    hp: num(bb.base_max_hp) + num(bb.max_hp_per_stack) * lv,
  });
  const aspd = num(bb.base_attack_speed) + num(bb.attack_speed_per_stack) * lv;
  if (aspd) mods.aspd = aspd;
  return mods;
}

/** Layer-independent passives (协防 / 独行 / 绝技), applied once. */
function applyStatic(battle, st) {
  const t = st.tiers;
  if (t[ID.empty]) {
    const bb = st.bb[ID.empty];
    const taken = Math.max(0, 1 - num(bb.damage_resistance));
    for (const u of st.ops) {
      passiveBuff(battle, u, KEY.empty, { physTakenMul: taken, artsTakenMul: taken });
      if (st.members[ID.empty].has(u)) {
        passiveBuff(battle, u, KEY.emptyDmg, { dmgDealtMul: num(isElite(u) ? bb.damage_scale_extra : bb.damage_scale_normal, 1) });
      }
    }
  }
  if (t[ID.solo]) {
    const bb = st.bb[ID.solo];
    const mods = directMods({ atk: num(bb.atk), hp: num(bb.max_hp) });
    for (const u of st.members[ID.solo]) passiveBuff(battle, u, KEY.solo, mods);
  }
  if (t[ID.sunt]) {
    const bb = st.bb[ID.sunt];
    const mods = directMods({ atk: num(bb.power_atk) });
    for (const u of st.ops) {
      if (!isElite(u)) continue;
      passiveBuff(battle, u, KEY.sunt, mods);
      if (t[ID.sunt] >= 2) suntSpCost(u, bb);
    }
  }
}

function suntSpCost(u, bb) {
  const sk = u && u.skill;
  if (!sk || sk.noSkill || u.mem[KEY.sunt]) return;
  u.mem[KEY.sunt] = true;
  sk.spCostMul = sk.spCostMul * num(bb.sp_ratio, 1);
}

// =====================================================================================================================
// 灵巧 aura

function updateAura(battle, st) {
  const mods = st.auraMods;
  if (!mods) return;
  const next = st.auraNext ?? (st.auraNext = new Set());
  next.clear();
  const offs = st.auraWide ? N8 : N4;
  for (const m of st.members[ID.skillful]) {
    const active = onField(m);
    // isDown also covers voluntary / forced exits since v0.1.2. Only a kill keeps the aura.
    if (!active && (m.removeReason !== 'killed' || !battle.isDown(m))) continue;
    if (active) next.add(m);
    // A knocked-out member still covers neighbours around the tile where it waits to redeploy.
    const [r, c] = active ? [m.tileR, m.tileC] : battle.restTile(m);
    for (const [dr, dc] of offs) {
      const a = battle.unitAt(r + dr, c + dc);
      if (a && a.kind === 'op' && a.ownerId === st.pid && onField(a)) next.add(a);
    }
  }
  const cur = st.aura ?? (st.aura = new Set());
  for (const u of cur) if (!next.has(u)) battle.removeBuff(u, KEY.skillful);
  for (const u of next) {
    const b = u.findBuff(KEY.skillful);
    if (!b) battle.addBuff(u, { key: KEY.skillful, mods });
    else if (b.mods !== mods) { b.mods = mods; u.markDirty(); }
  }
  st.aura = next;
  st.auraNext = cur;
}

// =====================================================================================================================
// 罗德岛 rhodeShip (data/bonds.json `rhodeShip`, `spec.tiers`; bb = MOD_bond_rhode, see RHODE_MOD_KEY)

/** "受治疗效率提升（每5层+1%）": the target-side multiplier of the heal pipeline, 1 + 0.01·floor(L / 5). */
export function rhodeHealMul(bb, L) {
  const step = Math.max(1, Math.floor(num(bb.heal_eff_step, 5)));
  return 1 + num(bb.heal_eff_per_step, 0.01) * Math.floor(Math.max(0, num(L, 0)) / step);
}

/**
 * "治疗光环频次受层数影响［间隔(L) = MIN + (MAX − MIN) × (1 − sqrt(L / L_max))］": 5 s at L 0, 0.5 s at L 100 (the
 * formula's own domain — layers above aura_l_max are clamped, BOND_LAYER_CAP 999 would drive it negative otherwise).
 */
export function rhodeAuraInterval(bb, L) {
  const min = num(bb.aura_interval_min, 0.5), max = num(bb.aura_interval_max, 5);
  const lMax = Math.max(1e-9, num(bb.aura_l_max, 100));
  const l = Math.max(0, Math.min(lMax, num(L, 0)));
  return Math.max(0, min + (max - min) * (1 - Math.sqrt(l / lMax)));
}

/**
 * MOD（负责人 2026-10-07 追加的设定）：【罗德岛】的层数不会超过**已激活的其他盟约**中最高的层数。
 * 上限在每次加层时现算：没有任何其他已激活盟约（或它们都还是 0 层）时上限为 0，罗德岛也就不再叠层。
 * 这是加层入口 `layerGain` 上的钳制（见 installRhodeCap），所以不分来源 —— 镜像、驻防、道具、盟约之币、
 * 其它盟约的加成一律受限。
 */
export function rhodeLayerCap(battle, st) {
  let cap = 0;
  for (const id of activeBondIds(battle, st.pid)) {
    if (id === ID.rhode) continue;
    cap = Math.max(cap, bondLayers(battle, st.pid, id));
  }
  // The bond that TRIGGERED a mirror has not been written yet when the nested 罗德岛 gain fires (addLayers emits
  // `layerGain` before it writes the layers), so the mirror path carries the post-gain count in as `rhodeCapHint`.
  return Math.max(cap, num(st.rhodeCapHint, 0));
}

/**
 * 在场【罗德岛】干员数（负责人 2026-10-08 的叠层效率按这个数算）：同一干员的普通/精锐只算一名，与该盟约的
 * BOARD 计数一致（`st.members` = 自己的 bonds 含 rhodeShip 的干员，含已倒下/未部署的，所以这里按 `onField` 过滤）。
 */
export function rhodeFieldCount(st) {
  const seen = new Set();
  for (const m of st.members[ID.rhode]) if (onField(m)) seen.add(baseChessId(m));
  return seen.size;
}

/**
 * 叠层效率 (owner 2026-10-09, replacing the 2026-10-08 "per member × 25 %" ramp): a TWO-STEP curve — under
 * `bb.field_eff_member_min` (4) members the board stacks at `bb.field_eff_low` (50 %), and from that many members on at
 * `bb.field_eff_max` (100 %). The floor is applied once, to the layer total (the `layerGain` clamp below), never to the
 * efficiency itself. The PREP side mirrors this curve in server/match/rhodeMeta.js (rhodeEffOf) — the two halves of
 * clause 1 have to agree.
 *
 * Falls back to the old ramp (`field_eff_per_member × members`, capped at `field_eff_max`) when `field_eff_member_min`
 * is absent, so a data file that predates the 2026-10-09 curve still resolves.
 */
export function rhodeEffOf(bb, count) {
  const b = bb || {};
  const n = Math.max(0, num(count, 0));
  const min = num(b.field_eff_member_min, 0);
  if (min > 0) return n >= min ? num(b.field_eff_max, 1) : num(b.field_eff_low, 0.5);
  return Math.min(num(b.field_eff_max, 1), Math.max(0, num(b.field_eff_per_member, 0.25) * n));
}

/**
 * 【罗德岛】clause 1: "干员攻击范围内的其他非【罗德岛】干员叠加任何盟约层数时，同时叠加相等的【罗德岛】层数".
 * The engine's `layerGain` hook is the single layer-gain choke point (support.gainLayers → Battle.addLayers emits it for
 * every source: garrisons, traits, bands, items, choices, other bonds), and its ctx carries the gain's source unit —
 * the operator that gained. The grant itself is a plain support.gainLayers call, so the caps, the 魔王-style `layerGain`
 * modifiers (ctx.n) and the `layer` event of the nested gain all behave as they do for any other content.
 * The mirrored gain is skipped when the trigger is 罗德岛's own (it would feed itself) — the hook fires again for it.
 */
function rhodeMirror(battle, st, c) {
  const src = c.source;
  if (!src || src.kind !== 'op' || src.ownerId !== st.pid || !onField(src)) return 0;
  if (st.members[ID.rhode].has(src)) return 0; // the member itself and other members never trigger it
  // CURRENT attack range of ANY on-field member of the player (support.inRange reads unit.rangeKeySet, refreshed with the
  // member's own range / direction changes); a knocked-out member has no range to stand in.
  let covered = false;
  for (const m of st.members[ID.rhode]) if (onField(m) && inRange(m, src)) { covered = true; break; }
  if (!covered) return 0;
  const n = Math.floor(num(c.n, 0));
  if (!(n > 0)) return 0;
  // MOD (owner 2026-10-07): 罗德岛 may not out-layer the ACTIVE other bonds, and the triggering bond has not been
  // written yet (addLayers emits `layerGain` before it writes), so carry its post-gain count in as the cap hint for the
  // nested 罗德岛 gain this mirror is about to make.
  const hint = st.rhodeCapHint;
  st.rhodeCapHint = bondLayers(battle, st.pid, c.bondId) + n;
  let added;
  try {
    added = gainLayers(battle, { playerId: st.pid, bonds: ID.rhode, n, requireActive: true, source: src, reason: 'bond' });
  } finally {
    st.rhodeCapHint = hint;
  }
  if (added > 0) fxOn(battle, 'bondProc', src, 'bond:rhodeShip', 'mirror', { n: added });
  return added;
}

/**
 * 【罗德岛】clause 4: "我方干员被治疗时，按实际被治疗的量对其周围8格造成弱点伤害（治疗量×层数×10%）". Hooked on the
 * engine's `heal` event, which fires before the HP is written and carries the amount after every multiplier (the source's
 * `healingDealtMul`, the target's `healingTakenMul` — clause 2's included), so "the amount actually restored" is the
 * engine's own clamp min(amount, missing HP) computed here exactly as damage.js does it. Priority −1000: every heal
 * amount modifier (明椒's talent …) has had its say by then.
 * 弱点伤害 has no damage type of its own: the instance is a phys/arts one retyped to whatever the victim resists less
 * (weaknessRetype, content/items/battle.js — 结城理's S3 uses the same helper), credited to the healed operator: that is
 * the owner's decision for the kill credit, and it is what makes the operator's 造成伤害 / the player's tally count it.
 * Being the healed operator's own damage instance, it rides that operator's own damage-dealt modifiers (as any damage it
 * deals does) on top of the fixed `healed × L × 0.1`.
 */
function rhodeHealStrike(battle, st, t, amount) {
  const bb = st.bb[ID.rhode];
  const lv = L(battle, st, ID.rhode);
  const dmgAmount = amount * lv * num(bb.weakness_scale, 0.1);
  if (!(dmgAmount > 0)) return 0;
  // "周围8格" = the ring of Chebyshev radius weakness_radius (1 in the record: the 8 neighbours, the tile it stands on
  // excluded), clipped to the field
  const radius = Math.max(1, Math.floor(num(bb.weakness_radius, 1)));
  const keys = [];
  for (let dr = -radius; dr <= radius; dr++) {
    for (let dc = -radius; dc <= radius; dc++) {
      if (Math.max(Math.abs(dr), Math.abs(dc)) !== radius) continue;
      const r = t.tileR + dr, c = t.tileC + dc;
      if (battle.grid.inRect(r, c)) keys.push(r * COLS + c);
    }
  }
  let hit = 0;
  // the engine's ally-side area selection (enemiesInKeys: no untargetable / 隐匿 enemy, no ground-only miss for a member
  // that cannot hit flyers — the same selector every other "周围" effect of this module uses)
  for (const e of battle.enemiesInKeys(keys, t, t.profile)) {
    if (!e.alive) continue;
    const d = battle.makeDamage({ amount: dmgAmount, type: 'arts', canDodge: false, tags: ['bond:rhodeShip', 'weakness'] });
    weaknessRetype(d, t, e);
    battle.dealDamage(t, e, d);
    hit++;
    fxOn(battle, 'strike', e, 'bond:rhodeShip', 'weakness', { from: t.id, n: Math.round(dmgAmount) });
  }
  return hit;
}

/** "场上同时存在两名罗德岛干员": 2 DISTINCT members on the board (support.baseChessId — a copy of one member is one). */
function rhodeAuraOn(battle, st) {
  const seen = new Set();
  for (const m of st.members[ID.rhode]) if (onField(m)) seen.add(baseChessId(m));
  return seen.size >= 2;
}

/**
 * 【罗德岛】clause 5: "当场上同时存在两名罗德岛干员时，全场获得治疗光环。每5秒对全场施加一次治疗，治疗量为【罗德岛】
 * 层数；溢出的治疗量等量转化为攻击力（不超过自身攻击力的100%，2秒内不再溢出则消失），治疗光环频次受层数影响。"
 * The scheduler re-arms itself with the interval of the LIVE layer count at each pulse (`interval(L)`, rhodeAuraInterval):
 * the pulse is due at the nominal time, so the poll's 1/30 s granularity never accumulates.
 * The heal itself goes through battle.heal (禁疗 / noHeal units are refused by the pipeline, as for any other heal — a unit
 * that cannot receive the heal gets neither HP nor the overflow, so it is skipped); it is 无来源 (source null) — no caster
 * exists, so no unit's heal stat and no player's healingDone counts it [ASSUMED].
 * "全场" = the player's own operators on the field (the bond's 干员 vocabulary; a token / summon is not a 干员).
 * The overheal is `amount − actual`, with `actual` what battle.heal restored and `amount` the engine's own amount for this
 * heal — L × the target's healingTakenMul (clause 2's bonus included), or whatever a later `heal` handler made of it
 * (captured by the clause 4 hook at priority −1000, 明椒's talent included). It is 0 while the unit is missing HP.
 */
function rhodeAtkBasis(u) {
  // Exclude this bonus from its own cap. atkFlat would multiply the overflow by every ATK% skill again;
  // atkFinal bypasses ATK%, and dividing by the final multipliers preserves the promised actual ATK 1:1.
  const { add: m, mul } = aggregateMods(u.buffs.filter((b) => b.key !== KEY.rhodeAtk));
  const finalMul = (mul.atkMul ?? 1) * (u.cultMul?.atk ?? 1);
  const b0 = u.base;
  const own = Math.max(0, fin(((b0.atk + (m.atkFlat ?? 0)) * Math.max(0, 1 + (m.atkPct ?? 0)) + (m.atkFinal ?? 0)) * finalMul, fin(b0.atk, 0)));
  return { own, finalMul };
}

function rhodeAtkTick({ unit: u, buff }) {
  const { own, finalMul } = rhodeAtkBasis(u);
  // Skill endings and expiring buffs can lower the cap between aura pulses. Do not refresh the expiry here.
  buff.data.amount = Math.min(buff.data.amount, own * buff.data.capRatio);
  const value = finalMul > 0 ? buff.data.amount / finalMul : 0;
  if (buff.mods.atkFinal !== value) { buff.mods.atkFinal = value; u.markDirty(); }
}

function rhodeOverflowAtk(battle, u, overflow, bb, decay) {
  const cur = u.findBuff(KEY.rhodeAtk);
  const { own, finalMul } = rhodeAtkBasis(u);
  if (!(finalMul > 0)) { battle.removeBuff(u, KEY.rhodeAtk); return 0; }
  const prev = cur ? num(cur.data.amount, 0) : 0;
  const capRatio = Math.max(0, num(bb.aura_atk_cap_ratio, 1));
  const cap = capRatio * own;
  const next = Math.min(cap, prev + overflow);
  if (!(next > 0)) return 0;
  // one buff per operator, replaced by every overflow: its own `duration` is the "2秒内不再溢出则消失" timer, and reading
  // the total back from its data means an expiry (or a death, which drops non-persistent buffs) starts from 0 again
  battle.addBuff(u, { key: KEY.rhodeAtk, duration: decay, refresh: 'replace', mods: { atkFinal: next / finalMul },
    data: { amount: next, capRatio }, onTick: rhodeAtkTick });
  return next;
}

/** 禁疗: the heal pipeline refuses this unit (damage.js heal, source null ⇒ not `self`). */
const rhodeHealRefused = (u) => !!(u.s.flags.noHeal || u.s.flags.healFree || (u.profile && u.profile.noHeal));

function rhodePulse(battle, st) {
  const bb = st.bb[ID.rhode];
  const decay = num(bb.aura_decay_sec, 2);
  const lv = L(battle, st, ID.rhode);
  const interval = rhodeAuraInterval(bb, lv);
  if (rhodeAuraOn(battle, st)) {
    let anchor = null;
    for (const u of st.ops) {
      if (!onField(u)) continue;
      anchor ??= u;
      if (rhodeHealRefused(u)) continue;
      st.probe = u;
      st.probeAmt = null;
      const actual = battle.heal(null, u, lv);
      st.probe = null;
      const amount = st.probeAmt != null ? st.probeAmt : lv * num(u.s.healingTakenMul, 1);
      const overflow = Math.max(0, amount - actual);
      if (overflow > 0 && decay > 0) rhodeOverflowAtk(battle, u, overflow, bb, decay);
    }
    if (anchor) fxOn(battle, 'bondProc', anchor, 'bond:rhodeShip', 'aura', { L: lv, interval });
    // content event: the aura pulsed (the client's own heal numbers ride on the engine's heal events)
    battle.emit('rhodeAura', { playerId: st.pid, layers: lv, interval, heal: lv });
  }
  return interval;
}

function installRhodeAura(battle, st) {
  const arm = () => {
    if (battle.finished) return;
    st.auraAt = (st.auraAt ?? battle.time) + rhodeAuraInterval(st.bb[ID.rhode], L(battle, st, ID.rhode));
    battle.after(Math.max(0, st.auraAt - battle.time), () => {
      if (battle.finished) return;
      rhodePulse(battle, st);
      arm();
    });
  };
  arm();
}

/**
 * 【罗德岛】clause 3 ("我方干员受到的持续性伤害不超过5秒"). The file header explains why the engine offers no choke point for
 * a DoT: this is the closest faithful version. Battle.addBuff is the point where a DoT lands on one of our operators, so it
 * is wrapped (once per battle) and every PERIODIC buff with a finite declared duration lands already cut:
 *   * `interval <= dot_duration_cap` — the buff is cut at once (`timeLeft = min(timeLeft, cap)`), so a 10 s DoT is a 5 s
 *     one from the moment it is applied;
 *   * not yet proven to be a DoT — the first tick decides. A tick that leaves the operator's `stats.taken` untouched (a
 *     heal-over-time, an aura, 抵抗's 麻痹 decay …) gives the buff its natural remaining time back and it is never cut
 *     again; a tick that did damage (a shield absorbed it: nothing was taken, so it stays unproven) marks the buff a DoT
 *     for good, and every later tick re-cuts it so it ends `dot_duration_cap` s after it was APPLIED.
 * Deviations [ASSUMED], see the header: a DoT whose `interval` is longer than the cap cannot be pre-cut (the operator
 * would lose a harmless buff before it ever ticked) and is only cut once it has damaged, and a tick fully absorbed by a
 * shield / 无敌 proves nothing. `duration` keeps the declared value; only `timeLeft` (what the engine expires buffs by) is
 * capped.
 */
function installRhodeDotCap(battle, isOurOp, cap) {
  if (!(cap > 0)) return;
  const store = battleStore(battle, 'bonds:addon:rhode', () => ({ patched: false, watched: new WeakSet(), state: new WeakMap() }));
  if (store.patched) return;
  store.patched = true;
  const add = battle.addBuff;
  battle.addBuff = function (unit, desc) {
    const b = add.call(this, unit, desc);
    if (!b || !isOurOp(unit)) return b;
    if (!(b.interval > 0) || typeof b.onTick !== 'function' || !Number.isFinite(b.duration) || !(b.duration > cap)) return b;
    let st = store.state.get(b);
    if (!st) {
      st = { start: this.time, preCut: b.interval <= cap, dot: false };
      store.state.set(b, st);
      const tick = b.onTick;
      b.onTick = function (ctx) {
        const u = ctx && ctx.unit;
        const before = num(u && u.stats ? u.stats.taken : 0, 0);
        try {
          return tick.call(this, ctx);
        } finally {
          const s = store.state.get(b);
          // 这个 return 只是「没有记账对象」的守卫。它会顺带吞掉 tick 抛出的异常，而这是**有意**的：DoT 上限是尽力
          // 而为的收尾记账，不该让一次记账失败把整场战斗判成超时（引擎对钩子抛错的处理正是 force-end，见
          // test/sim/robustness.test.js）。改成 `if (s && u) { … }` 会让异常外泄，语义不同 —— 所以显式保留并说明。
          // eslint-disable-next-line no-unsafe-finally
          if (!s || !u) return;
          const elapsed = Math.max(0, battle.time - s.start);
          if (num(u.stats ? u.stats.taken : 0, 0) > before + 1e-9) {
            s.dot = true;
            s.preCut = false;
          } else if (s.preCut) {
            // not a DoT (yet): give back the natural remaining time of the declared duration, once
            if (b.timeLeft < b.duration - elapsed) b.timeLeft = Math.max(0, b.duration - elapsed);
            s.preCut = false;
          }
          if (s.dot) {
            const left = Math.max(0, cap - elapsed);
            if (b.timeLeft > left) b.timeLeft = left; // the engine's own buff tick removes it once timeLeft runs out
          }
        }
      };
    }
    if (st.preCut) b.timeLeft = Math.min(b.timeLeft, cap);
    return b;
  };
}

// =====================================================================================================================
// 突袭 relocation
//
// Either trigger (技能就绪, or no attack for no_attack_duration s) jumps only to a landing tile from which the member's
// attack range covers the enemy it jumps to: the first candidate (raidTargets order, the RAID_TARGETS most advanced)
// that has one; when none has, the member stays where it is and the next poll looks again (its idle time keeps
// counting, so it jumps as soon as one can be reached). The official text only says "再部署至一名地面敌人周围" —
// "never a useless landing" is [ASSUMED] after GitHub issue #51 (up to 0.1.1 the idle trigger landed where nothing was
// in range, hopped between such tiles every 10 s and ignored a second enemy it could have reached; DESIGN §22.2).

/**
 * The member's attack range as offsets from its tile: its own grid + rangeExtend (targeting.js extendedGrid, the
 * relative form of absoluteRangeKeys) turned by its direction — flat [dRow, dCol, dRow, dCol, …].
 */
function raidReach(u) {
  const d = normDir(u.dir);
  const out = [];
  for (const [dr, dc] of extendedGrid(u.rangeGrid || [[0, 0]], num(u.s.rangeExtend))) out.push(...rotateOffset(dr, dc, d));
  return out;
}

/** #475: multiplayer boss/hidden Raid may use an absent partner's deployment half (maintainer-approved, §29.13).
 * Keep this exception local to Raid: onFieldBoard/onOwnBoard still describe actual players' deployment regions.
 */
function raidBoard(battle, r, c) {
  if (battle.onFieldBoard(r, c)) return true;
  return battle.modeId?.startsWith('mode_multi_') && (battle.kind === 'boss' || battle.kind === 'hidden')
    && r >= GEO.FIELD.r0 + BOSS_ROW_OFFSET && r <= GEO.FIELD.r1 + BOSS_ROW_OFFSET
    && c >= GEO.FIELD.c0 && c <= COLS - 1 - GEO.FIELD.c0;
}

/**
 * Landing tile [row, col] of a jump to enemy `e`, or null: a tile from which the member's range (`reach`, raidReach)
 * covers the enemy's body (a huge enemy: any tile it occupies — body.js) — and is within RAID_SEARCH tiles (Chebyshev) of
 * that body, measured as the gap to the body's nearest tile, never to the tile the enemy's position rounds to: the
 * anchor tile is not the body, and a huge leader's hitArea offset plus its route anchor split one body differently
 * (community report of 2026-10-13), which moved the window and, in the hidden round's leader alone, lost every landing
 * on the far side of that body — inside the field rect and on a board of its field (Battle.onFieldBoard — "再部署" goes
 * where a player of the field deploys: its own board or a teammate's half when both halves are taken, the two-helper
 * 联防 field and a pair field — the owner's decision of 2026-10-07, DESIGN §26.1; never a boss field's hand row 0 or
 * 临时整备区 row 1, both inside BOSS_RECT and buildable high ground, nor the empty other half of the one-helper 联防
 * map or a single-mode boss field;
 * community reports of 2026-10-06, items 40 and 16.3: a ranged member landed on the 临时整备区 row of a solo leader
 * round, and on the right half of the one-helper 联防 map). #475 additionally opens the empty deployment half only
 * in multiplayer boss/hidden battles (raidBoard, approved 2026-10-10, §29.13). The tile must be one that the member's
 * position may be deployed on (grid.canStand: never the 深水区 —
 * player report #3 after 0.1.0 —, and for a melee member low ground only, never a 高台: GitHub #148) and that is free
 * (Battle.isReservedTile: no living unit, no knocked-out operator's body — player report F5 —, no waiting piece's tile).
 * A melee member that blocks takes a tile where its block applies first — ground units pass it (not a 围墙 / 围栏 tile,
 * where a unit blocks no ground enemy: Battle._blockerFor) and an enemy ground path runs through it
 * (Battle.groundPathTiles) or its enemy stands on it — over one where it would block nothing (the owner's decision of
 * 2026-10-06 after GitHub
 * #148: a member landed on a 围墙 tile, drawn raised, while a road tile covered its enemy too [ASSUMED: the official
 * landing picks among the legal tiles at random]); then the nearest (Chebyshev, then 0.01·Manhattan); last tie-break
 * the offset in the member's facing-RIGHT frame (sim/dir.js localOrder; for a RIGHT-facing unit the plain tile-key
 * order), so the landing tile turns with its direction. Only the tiles a range offset leads back to from a body tile
 * are looked at, so a search that finds nothing stays cheap.
 */
function raidTile(battle, u, e, reach) {
  const er = Math.round(e.y), ec = Math.round(e.x);
  const ranged = u.def?.position === 'RANGED';
  const body = bodyKeys(e);
  // The window is measured to the tiles the enemy occupies, never to the tile its position rounds to: a huge unit's
  // hitArea offset and its route anchor split the same body differently (enemy_9021_acduml dx 0 from col 10 and
  // enemy_9021_acduml_2 dx 1 from col 9 are one body, cols 8–12), and the anchor-relative window dropped every landing
  // on the far side of that body — the hidden round's leader then stopped being jumped to at all.
  let bR0 = Infinity, bR1 = -1, bC0 = Infinity, bC1 = -1;
  for (const k of body) {
    const br = Math.floor(k / COLS), bc = k - br * COLS;
    bR0 = Math.min(bR0, br); bR1 = Math.max(bR1, br); bC0 = Math.min(bC0, bc); bC1 = Math.max(bC1, bc);
  }
  const path = !ranged && u.s.blockCnt > 0 ? battle.groundPathTiles() : null;
  let best = null, bp = 2, bd = Infinity, bo = null;
  for (const k of body) {
    const br = Math.floor(k / COLS), bc = k - br * COLS;
    for (let i = 0; i < reach.length; i += 2) {
      const r = br - reach[i], c = bc - reach[i + 1], dr = r - er, dc = c - ec;
      const wr = Math.min(Math.max(r, bR0), bR1) - r, wc = Math.min(Math.max(c, bC0), bC1) - c;   // gap to the body
      if (Math.abs(wr) > RAID_SEARCH || Math.abs(wc) > RAID_SEARCH) continue;
      if (!battle.grid.inRect(r, c) || !raidBoard(battle, r, c) || !battle.grid.canStand(r, c, { ranged }) || battle.isReservedTile(r, c)) continue;
      const t = r * COLS + c;
      const p = path && battle.grid.tile(r, c).pass === 'ALL' && (path.has(t) || body.includes(t)) ? 0 : 1;   // its block applies
      const d = Math.max(Math.abs(dr), Math.abs(dc)) + 0.01 * (Math.abs(dr) + Math.abs(dc));
      const o = localOrder(dr, dc, u.dir);
      if (p < bp || (p === bp && (d < bd - 1e-9 || (Math.abs(d - bd) <= 1e-9 && localBefore(o, bo))))) { best = [r, c]; bp = p; bd = d; bo = o; }
    }
  }
  return best;
}

/**
 * A ground enemy 突袭 jumps toward, and that counts for 「范围内没有敌人」 while it stands in a member's range: one an
 * operator may target (canTargetEnemy, ground), or a 隐匿 one that only its 隐匿 keeps out — the owner's decision of
 * 2026-10-08 from the official game (GitHub #316 "Raid operator doesn't deploy to invisible enemy units, it does in
 * official"; the bond text says 敌人 / 地面敌人). Asleep, untargetable and flying enemies stay out, as before.
 */
function raidGroundEnemy(u, e) {
  if (!e || e.isFlying) return false;
  if (canTargetEnemy(u, e, { canHitFly: false })) return true;
  if (!e.alive || e.hidden || !e.deployed || !enemyStealthed(e)) return false;
  const f = e.s.flags;
  if (f.untargetable || f.sleep) return false;
  const skip = u.profile && u.profile.skipEnemy;
  return !(typeof skip === 'function' && skip(e));
}

/** A 隐匿 ground enemy (raidGroundEnemy) on `u`'s range: enemiesInKeys leaves 隐匿 out, so the poll checks this too. */
function raidStealthInRange(battle, u) {
  const keys = u.rangeKeySet || u.rangeKeys;
  if (!keys) return false;
  for (const e of battle.enemies) if (e.alive && enemyStealthed(e) && raidGroundEnemy(u, e) && bodyInRange(e, keys)) return true;
  return false;
}

/**
 * Jump candidates of player `pid`: the ground enemies of raidGroundEnemy (visible, or 隐匿; not flying, asleep or
 * untargetable) — those of the player's own field (`ownerId`), the others only when it has none. Ordinary polls sort
 * by remaining path distance, then stable id. `taunt` is only the one reselect after a revive (maintainer 2026-10-10):
 * highest taunt, then that distance, then id. The two orders are not one shared list.
 */
function raidTargets(battle, u, pid, { taunt = false } = {}) {
  const own = [], other = [];
  for (const e of battle.enemies) {
    if (!raidGroundEnemy(u, e)) continue;
    (e.ownerId === pid ? own : other).push(e);
  }
  const list = own.length ? own : other;
  const dist = new Map(list.map((e) => [e, num(battle.remainingDistance ? battle.remainingDistance(e) : 0)]));
  list.sort((a, b) => (taunt ? num(b.s.taunt) - num(a.s.taunt) : 0) || dist.get(a) - dist.get(b) || a.id - b.id);
  return list;
}

/**
 * The block pass has not run yet this tick (the poll is in the scheduled phase, and `_deploy` clears `blocking`).
 * Refresh contact the same way `updateEnemy` does before an enemy moves: an enemy already on this tile is blocked
 * now, so a revive does not treat that tile as empty and jump away.
 */
function raidRefreshContact(battle, u) {
  for (const e of battle.enemies) {
    if (!e.alive || e.blockedBy || e.hidden) continue;
    if (Math.abs(Math.round(e.y) - u.tileR) > 1 || Math.abs(Math.round(e.x) - u.tileC) > 1) continue;
    battle._checkBlock(e);
  }
}

function raidPoll(battle, st) {
  const bb = st.bb[ID.raid];
  const idle = num(bb.no_attack_duration, 10);
  // Ordinary and post-revive orders stay separate: one poll can hold a member of each.
  let plain = null, taunted = null;
  for (const u of st.members[ID.raid]) {
    if (!onField(u) || !u.canAct) continue;
    // Maintainer 2026-10-10: one fresh target check after revival when unblocked, even with enemies in attack range.
    // Ordinary later polls retain their original empty-range rule and distance order. A Raid jump cannot arm another check.
    const revived = u.mem.raidReviveSeq === u.deploySeq;
    if (revived) {
      u.mem.raidReviveSeq = 0;
      raidRefreshContact(battle, u);
    }
    if (revived && u.blocking.some((e) => e.alive && e.blockedBy === u)) continue;
    const since = Math.max(u.lastAttackAt ?? -Infinity, u.deployedAt ?? -Infinity, u.mem[KEY.raid] ?? -Infinity);
    // 技能就绪: a charged skill, or a passive skill that is on (GitHub #49: skills.js `ready` is false for every passive,
    // so 缄默德克萨斯 / 宴 … only ever jumped on the idle trigger; the reporter's footage of the official game shows
    // 缄默德克萨斯 jumping within her passive's 10 s with no enemy in range). The engine keeps a passive on for the whole
    // deployment, so such a member may jump whenever nothing is in its range [ASSUMED: "技能就绪" of a passive = the
    // skill being on]; the landing rule below keeps it from hopping. Here only — the global `ready` stays as it is.
    // A deploy-timed skill (#109: kind 'duration' with no SP — spType 'none' — run from the deployment: 宴 S2, 斯卡蒂 S2,
    // 伊内丝 S3, 缄默德克萨斯 S1–S3, 耀骑士临光 S2, the generic "部署后…N秒内" passives) counts the same way while its
    // window runs — the 10 s of the reporter's footage; once it has ended only the idle trigger is left.
    const sk = u.skill;
    const deploySkillOn = !!(sk && sk.active && (sk.kind === 'passive' || sk.spType === 'none'));
    const ready = !!(sk && !sk.noSkill && ((sk.ready && !(sk.active && sk.isTimed)) || deploySkillOn));
    const idleOk = battle.time - since >= idle - 1e-9;
    if (!(revived || ready || idleOk)) continue;
    // 「若范围内没有敌人」: a targetable enemy, or a 隐匿 ground one (the owner's decision of 2026-10-08, raidGroundEnemy)
    if (!revived && (battle.enemiesInKeys(u.rangeKeys || [], u, u.profile).length || raidStealthInRange(battle, u))) continue;
    const list = revived ? (taunted ??= raidTargets(battle, u, st.pid, { taunt: true })) : (plain ??= raidTargets(battle, u, st.pid));
    if (!list.length) continue;
    // either trigger: raidTile only offers tiles with the target in range (without that a ready skill that finds no
    // target would redeploy — firing every 部署时 effect — at every poll; the idle trigger, which lacked it up to
    // 0.1.1, hopped every 10 s: issue #51)
    const reach = raidReach(u);
    for (let i = 0; i < list.length && i < RAID_TARGETS; i++) {
      const tile = raidTile(battle, u, list[i], reach);
      if (!tile) continue;
      plain = taunted = null; // the retreat / redeploy handlers (部署时 effects) may change the enemies: the next member re-sorts
      const res = raidRedeploy(battle, u, tile[0], tile[1]);
      u.mem.raidReviveSeq = 0;
      if (!res) continue;
      u.mem[KEY.raid] = battle.time; // with deployedAt: the idle time starts again from the landing
      if (res === 'raid') {
        battle.addBuff(u, { key: KEY.raid, mods: st.raidMods });
        fxOn(battle, 'blink', u, KEY.raid, 'relocate', { target: list[i].id });
      }
      break;
    }
  }
}

/**
 * "保留技力立即再部署": retreat the unit and redeploy it for free on (r, c) with its SP / charges kept (engine redeploy
 * `tile` + `keepSp`: restored before the `deploy` handlers run; the board tile stays its home). Should the landing fail
 * (raidTile skips taken, reserved and body tiles, so only content refusing it), the unit goes straight back to its home
 * tile (never stranded off the field).
 * Returns 'raid' | 'home' | false.
 */
function raidRedeploy(battle, u, r, c) {
  battle.retreat(u, { reason: 'raid' });
  if (u.alive) return false;
  if (battle.redeploy(u, { free: true, tile: [r, c], keepSp: true })) return 'raid';
  return battle.redeploy(u, { free: true, keepSp: true }) ? 'home' : false;
}

// =====================================================================================================================
// install

export function install(battle) {
  if (!battle || !Array.isArray(battle.players) || !battle.players.length) return;
  const states = [];
  for (const p of battle.players) {
    const st = makeState(battle, p);
    if (Object.keys(st.tiers).length) states.push(st);
  }
  if (!states.length) return;
  const byPid = Object.create(null);
  for (const st of states) { byPid[st.pid] = st; applyPassives(battle, st); applyStatic(battle, st); }
  const has = (id, tier = 1) => states.some((st) => (st.tiers[id] ?? 0) >= tier);

  // live layers
  if (states.some((st) => Object.keys(st.tiers).some((id) => LAYERED.has(id)))) {
    battle.on('layerGain', (c) => {
      const st = byPid[c.playerId];
      if (!st || !st.tiers[c.bondId] || !LAYERED.has(c.bondId) || st.pending) return;
      st.pending = true;
      battle.after(0, () => {
        st.pending = false;
        applyPassives(battle, st);
        if (st.tiers[ID.skillful]) updateAura(battle, st);
      });
    });
  }

  // 罗德岛 (clauses 1, 3, 4 always at tier 1; the whole-field heal aura needs tier 2 = 2 distinct members)
  const rhode = states.filter((st) => st.tiers[ID.rhode]);
  if (rhode.length) {
    // clause 1: mirror any layer gain of a friendly non-member inside a member's current range onto 罗德岛. −50: after the
    // 魔王-style `layerGain` modifiers (priority 0, they raise ctx.n — support.gainLayers documents the ctx.n contract),
    // before the standing-buff re-read at −100.
    battle.on('layerGain', (c) => {
      if (c.bondId === ID.rhode) return; // 罗德岛's own layers (incl. this mirror) never trigger it again
      const st = byPid[c.playerId];
      if (!st || !st.tiers[ID.rhode]) return;
      rhodeMirror(battle, st, c);
    }, { priority: -50 });
    // MOD（负责人 2026-10-09）：【罗德岛】的叠层效率是两档曲线 —— 在场成员少于 4 名时 50%，4 名及以上 100%
    // （`bb.field_eff_low` / `bb.field_eff_member_min` / `bb.field_eff_max`，rhodeEffOf），再受「不超过已激活的其他
    // 盟约中最高的层数」的上限约束。
    // −60：在魔王式加成（priority 0）与镜像（−50，它会为罗德岛再发一次 layerGain）之后运行，保证连镜像加进来的
    // 那份也一并按效率折算；早于常驻 buff 重读（−100）。钳制只改 ctx.n，超出部分不计入层数、也不触发 `layer` 事件。
    // 效率不足 1 层时把零头攒在 st.rhodeFrac 里（同技力回复的做法），长期不失真。
    battle.on('layerGain', (c) => {
      if (c.bondId !== ID.rhode) return;
      const st = byPid[c.playerId];
      if (!st || !st.tiers[ID.rhode]) return;
      const bb = st.bb[ID.rhode] || {};
      const eff = rhodeEffOf(bb, rhodeFieldCount(st));
      const total = Math.max(0, num(st.rhodeFrac, 0)) + Math.max(0, num(c.n, 0)) * eff;
      let n = Math.floor(total + 1e-9);
      st.rhodeFrac = total - n;
      const room = rhodeLayerCap(battle, st) - L(battle, st, ID.rhode);
      if (n > room) n = Math.max(0, room);
      c.n = n;
    }, { priority: -60 });
    const rhodePids = new Set(rhode.map((st) => st.pid));
    const refreshOverflow = (u) => {
      if (!u || !rhodePids.has(u.ownerId)) return;
      const buff = u.findBuff(KEY.rhodeAtk);
      if (buff) rhodeAtkTick({ unit: u, buff });
    };
    // Skills and later-added buffs can expire after this buff's own onTick. Clamp before damage reads ATK,
    // and at the end of the tick so a unit that did not attack also exports the current cap to the snapshot.
    battle.on('skillEnd', ({ unit }) => refreshOverflow(unit), { priority: -1000 });
    battle.on('beforeAttack', ({ attacker }) => refreshOverflow(attacker), { priority: -1000 });
    battle.on('tick', () => { for (const st of rhode) for (const u of st.ops) refreshOverflow(u); }, { priority: -1000 });
    installRhodeDotCap(battle, (u) => !!(u && u.side === 'ally' && u.kind === 'op' && rhodePids.has(u.ownerId)), num(rhode[0].bb[ID.rhode].dot_duration_cap, 5));
    // clause 4: the engine's heal event (fired before the HP is written) sees the final amount
    battle.on('heal', (c) => {
      const t = c.target;
      if (!t || t.side !== 'ally' || !isOp(t) || !t.alive || !t.deployed) return;
      const st = byPid[t.ownerId];
      if (!st || !st.tiers[ID.rhode]) return;
      // the aura's own heal (rhodePulse): remember the engine's final amount for its overflow
      if (st.probe === t) st.probeAmt = num(c.amount, 0);
      // Re-entrancy guard: while this strike's own damage resolves, a heal-driven trait it sets off (咒愈师's
      // "every damage dealt heals an ally for 50 % of it" — 刺玫's trait and its INC-X 60 % module) heals again and
      // would strike again. The damage instance names the healed operator as its source, so the trait fires inside the
      // strike itself and each round multiplies by healRatio × L × 0.1 (~0.5): a geometric cascade that only dies below
      // damage.js's 0.5 event floor — tens of thousands of emissions inside a single tick, which is what made the
      // golden match corpus stop converging. Firing only the outermost strike ends it at the first round.
      if (st.striking) return;
      const actual = Math.max(0, Math.min(num(c.amount, 0), t.s.maxHp - t.hp)); // damage.js heal(): the clamp it will apply
      if (!(actual > 0)) return;
      st.striking = true;
      try { rhodeHealStrike(battle, st, t, actual); } finally { st.striking = false; }
    }, { priority: -1000 });
    for (const st of rhode) if (st.tiers[ID.rhode] >= 2) installRhodeAura(battle, st);
  }

  // 灵巧 aura (deploy / death immediately, relocations through a cheap poll)
  if (has(ID.skillful)) {
    const aura = states.filter((st) => st.tiers[ID.skillful]);
    const refresh = (pid) => { for (const st of aura) if (pid == null || st.pid === pid) updateAura(battle, st); };
    battle.on('battleStart', () => refresh(null));
    battle.on('deploy', (c) => { if (c.unit && c.unit.kind === 'op' && byPid[c.unit.ownerId]?.tiers[ID.skillful]) refresh(c.unit.ownerId); });
    battle.on('death', (c) => { if (c.unit && c.unit.kind === 'op' && byPid[c.unit.ownerId]?.tiers[ID.skillful]) refresh(c.unit.ownerId); });
    battle.every(AURA_POLL, () => refresh(null));
  }

  // 突袭
  if (has(ID.raid)) {
    const raid = states.filter((st) => st.tiers[ID.raid] && st.members[ID.raid].size);
    if (raid.length) {
      battle.on('deploy', (c) => {
        const u = c.unit;
        // Only a revive: the previous exit was a knock-out and the operator is back before its respawn timer.
        // A retreat (宴 / 史尔特尔 / 伊内丝 / 耀骑士临光), a move, a timer redeploy and the initial deploy stay on the old poll.
        if (!u || c.initial || c.move || u.removeReason !== 'killed' || !(u.respawnAt > battle.time + 1e-9)) return;
        if (raid.some((st) => st.members[ID.raid].has(u))) u.mem.raidReviveSeq = u.deploySeq;
      });
      battle.every(RAID_POLL, () => { for (const st of raid) raidPoll(battle, st); });
    }
  }

  // 迅捷
  if (has(ID.swift)) {
    battle.on('skillEnd', (c) => {
      const u = c.unit;
      if (!u || u.kind !== 'op' || c.reason === 'death' || !u.alive || !u.skill) return;
      const st = byPid[u.ownerId];
      if (!st || !st.tiers[ID.swift]) return;
      const bb = st.bb[ID.swift];
      const lv = L(battle, st, ID.swift);
      const p = prob(bb, lv);
      let gained = 0;
      if (st.members[ID.swift].has(u) && battle.rng() < p) gained += u.skill.gainSp(num(bb.normal_sp), 'bond');
      if (lv >= num(bb.power_bond_stack_cnt, Infinity) && battle.rng() < p) gained += u.skill.gainSp(num(bb.power_sp), 'bond');
      if (gained > 0) fxOn(battle, 'sp', u, 'bond:swiftShip', 'proc', { n: gained });
    });
  }

  // 独行 (SP on every deploy) / 绝技 (summons of elites)
  const soloOrSunt = has(ID.solo) || has(ID.sunt, 2);
  if (soloOrSunt) {
    battle.on('deploy', (c) => {
      const u = c.unit;
      if (!u || (u.kind !== 'op' && u.kind !== 'token')) return;
      const st = byPid[u.ownerId];
      if (!st) return;
      if (u.kind === 'op' && st.tiers[ID.solo] && st.members[ID.solo].has(u) && u.skill) {
        const n = num(st.bb[ID.solo].sp);
        if (n > 0) u.skill.gainSp(n, 'init');
      }
      if (u.kind === 'token' && (st.tiers[ID.sunt] ?? 0) >= 2 && isElite(u.ownerUnit)) suntSpCost(u, st.bb[ID.sunt]);
    });
  }

  // 不屈 (PRTS 卫戍协议：盟约 下半/PRTS盟约记录, its 修正: "地面干员被击倒、撤退、切换<替身>与<本体>时，有(18+0.4×层数)%概率立刻
  // 重新部署"; "※“立刻重新部署”的实现方式为：令受益者下次部署的再部署时间和费用归零"; owner's decision 2026-10-04 to follow it).
  // Rolls on a knock-out ('killed') and on a 撤退 ('retreat' — 史尔特尔's 余烬, 耀骑士临光 S2, 伊内丝 S3 … — and 行商's
  // 'merchant' withdrawal): a hit redeploys it at once, free, where it lies (engine rest tile, §22.15). Not on the 突袭
  // retreat ('raid': it redeploys at once and free anyway — the zeroed next deployment would change nothing [ASSUMED: no
  // roll]) nor on the 联防 forced exit (FORCED_EXIT: the battle's setup, not a 撤退 — §19.3). A 傀儡师 switch (hook
  // `dollSwap`, to the 替身 and back) rolls too; she stays on the field, so a hit only zeroes her NEXT deployment: the
  // next time she leaves the field (knocked out, withdrawn) she is back at once and free (`u.mem.indomFreeDeploy`)
  // [ASSUMED: one such deployment at a time, spent by her next deployment whatever brings it]. Tier 2 (+sp SP to every
  // operator on the field) stays a knock-out effect: its own line ("地面干员被击倒时使场上所有干员技力+5") was not corrected.
  // Both lines take a 地面干员 = a melee-position operator on any tile (support isGroundOp: 歌蕾蒂娅 on a 高台 counts, a
  // ranged operator on a melee tile does not — community report 「不屈盟约效果高台干员也错误的吃到了」, 0.1.3).
  if (has(ID.indom)) {
    const INDOM_EXITS = new Set(['killed', 'retreat', 'merchant']);
    const stOf = (u) => { const st = isGroundOp(u) ? byPid[u.ownerId] : null; return st && st.tiers[ID.indom] ? st : null; };
    battle.on('death', (c) => {
      const u = c.unit;
      const banked = !!(u && u.mem && u.mem.indomFreeDeploy);
      if (!INDOM_EXITS.has(c.reason) || !(stOf(u) || (banked && u.kind === 'op'))) return;
      const st = stOf(u);
      const bb = st ? st.bb[ID.indom] : null;
      if (st && c.reason === 'killed' && st.tiers[ID.indom] >= 2) {
        const sp = num(bb.sp);
        if (sp > 0) for (const o of st.ops) if (onField(o) && o.skill) o.skill.gainSp(sp, 'bond');
      }
      if (u.alive || u.removed || u.mem[ID.indom] === battle.time) return;
      if (banked || (st && battle.rng() < prob(bb, L(battle, st, ID.indom)))) {
        u.mem[ID.indom] = battle.time;
        if (battle.redeploy(u, { free: true })) fxOn(battle, 'revive', u, 'bond:indomShip', 'redeploy');
      }
    }, { priority: 10 });
    battle.on('dollSwap', ({ unit: u }) => {
      const st = stOf(u);
      if (!st || !u.alive || u.mem.indomFreeDeploy) return;
      if (battle.rng() < prob(st.bb[ID.indom], L(battle, st, ID.indom))) u.mem.indomFreeDeploy = true;
    });
    // the zeroed deployment is the next one, whatever brings it (this redeploy, the 阿戈尔 revive, the 突袭 jump …)
    battle.on('deploy', ({ unit: u }) => { if (u && u.mem && u.mem.indomFreeDeploy) u.mem.indomFreeDeploy = false; });
  }

  // 坚守 (tier 2) redirect + thorns, 奥术 vulnerability
  const stead = has(ID.stead, 2);
  const arcane = has(ID.arcane);
  if (stead) {
    battle.on('hit', (c) => {
      const t = c.target, dmg = c.dmg;
      if (!t || t.side !== 'ally' || t.kind !== 'op' || !dmg || dmg.cancel || dmg.steadShare || dmg.steadCut
        || dmg.tags?.includes('bond:stead:share') || dmg.type === 'element') return;
      const st = byPid[t.ownerId];
      if (!st || (st.tiers[ID.stead] ?? 0) < 2 || st.members[ID.stead].has(t)) return;
      let any = false;
      for (const m of st.members[ID.stead]) if (onField(m)) { any = true; break; }
      if (!any) return;
      const ratio = Math.max(0, Math.min(1, num(st.bb[ID.stead].damage_resistance)));
      if (!(ratio > 0) || ratio >= 1) return;
      // Both redirects take their share from the pre-redirect hit (applyRedirectCut). The victim keeps the rest.
      applyRedirectCut(dmg, ratio);
      dmg.steadCut = ratio;
    }, { priority: -20 });
  }
  if (stead || arcane) {
    battle.on('damaged', (c) => {
      const t = c.target, dmg = c.dmg;
      if (!t || !dmg) return;
      if (t.side === 'ally') {
        if (!stead || t.kind !== 'op') return;
        const st = byPid[t.ownerId];
        if (!st || (st.tiers[ID.stead] ?? 0) < 2) return;
        if (dmg.steadCut) {
          const ratio = dmg.steadCut;
          dmg.steadCut = 0;
          const share = redirectShare(num(c.amount), ratio, dmg.redirectCuts);
          if (!(share > 0)) return;
          const on = [];
          for (const m of st.members[ID.stead]) if (onField(m)) on.push(m);
          // the share is already mitigated and already carries the attacker's damage multipliers: deal it sourceless
          // (the member's own damage-taken modifiers and shields still apply), never re-scaled by the attacker
          for (const m of on) {
            // Preserve sharing ancestry across Skadi's redirect, so neither sharing effect revisits its own output.
            const d = battle.makeDamage({ amount: share / on.length, type: 'true', canDodge: false,
              tags: ['bond:stead:share', ...(dmg.tags?.includes('transfer') ? ['transfer'] : [])] });
            d.steadShare = true;
            battle.dealDamage(null, m, d);
          }
          return;
        }
        // a 流失 never uses a thorn chance (PRTS 作战机制 "生命流失不会触发反伤"); 无来源 damage does, hitting nobody (备注
        // "可被无来源伤害消耗反伤机会")
        if (dmg.steadShare || dmg.steadThorn || c.type === 'element' || isHpLoss(dmg) || !st.members[ID.stead].has(t)) return;
        const bb = st.bb[ID.stead];
        const last = t.mem[STEAD_CD] ?? -Infinity;
        if (battle.time - last < num(bb.cd_duration) - 1e-9) return;
        t.mem[STEAD_CD] = battle.time;
        const src = c.source;
        if (!src || src.side !== 'enemy' || !src.alive) return;
        // "伤害来源受到(850+10×L)点法术伤害": 无来源 (no attacker multipliers, hooks see no source) but credited to the
        // member hit — its player's stats and shared-pool tally count it, like an element burst (v2.5: no credit at all,
        // up to 19 % of a co-op leader's pool and 88 % of a solo one went unattributed, DESIGN §20.10)
        const d = battle.makeDamage({ amount: num(bb.base_damage_value) + num(bb.damage_value_per_stack) * L(battle, st, ID.stead), type: 'arts', canDodge: false, sourceless: true });
        d.steadThorn = true;
        battle.dealDamage(t, src, d);
        if (src.alive) battle.applyStatus(src, 'fragile', { duration: num(bb['weak[limit]'], 5), value: num(bb.damage_scale, 1) - 1, source: t });
        return;
      }
      if (!arcane || c.type !== 'arts' || t.side !== 'enemy' || !t.alive) return;
      const src = c.source;
      if (!src || src.kind !== 'op') return;
      const st = byPid[src.ownerId];
      if (!st || !st.tiers[ID.arcane] || !st.members[ID.arcane].has(src)) return;
      const bb = st.bb[ID.arcane];
      const low = st.tiers[ID.arcane] >= 2 && t.hpRatio < num(bb.hp_ratio);
      // one 奥术 instance per target, the strongest (both players of a pair field included): see the header
      battle.applyStrongest(t, KEY.arcane, { duration: num(bb.weak_duration, 3), value: low ? st.arcaneLowMul : st.arcaneMul, mods: arcaneMods, source: src });
    });
  }
}
