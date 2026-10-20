// server/sim/content/kits/ops/op-makoto.js — MOD：结城理（chess_char_4217_makoto，阶 V 卫戍棋子（chessIds chess_char_4217_makoto_a normal + _b elite））的 kit。
//
// 来源：server/sim/content/kits/tier3.js 的 `chess_char_4217_makoto` 段（v0.1.4 段本体第 2164-2638 行，共 475 行；
// 其上的说明注释第 2087-2163 行一并带来）**原样**搬来 —— 逻辑一字未改，只改了导入（`./tier1.js` →
// `../shared/tier1.js` + `../shared/mod-tier3.js`，相对路径随目录下沉一级）与默认导出的形状
// （`export default { char_4217_makoto: (bb, chess, def) => … }`，上游 ops 约定；键名是唯一被改写的一行）。
//
// 注册：content/index.js 的 MOD_KIT_KEYS 把默认导出的 charId 键改写成 **bare chessId** `chess_char_4217_makoto`，
// 于是这一个文件既服务 _a（normal）也服务 _b（elite）。因为她是**卫戍棋子**（商店常驻刷新招到），
// **不**写进 kits/index.js 的 OPERATOR_KIT_FILES —— 那会让 charId 进 KITTED_CHARS，从而出现在「自选编队」名单。
//
// 文件级 helper 在 ../shared/mod-tier3.js（两段自研 kit 共用一份）。
import { COLS, PUSH_DIRECTIONAL_MIN_DIST } from '../../../constants.js';
import { canTargetEnemy } from '../../../targeting.js';
import { bodyDist, bodyInKeys, bodyOnTile } from '../../../body.js';
import { normalizeChess, normalizeSkill } from '../../../simdata.js';
import { releaseSkillSummon, TOKEN_IDS } from '../../tokens.js';
import { weaknessRetype } from '../../items/battle.js';
import {
  MASK_SWITCH, NINE, altSkills, copyGrid, defOf, enemiesOn, freeTile, fx, gridKeys, groundTile, num, onTiles, selectedId, skillData, tacticalPoint, talentBb, tileKeyOf, traitBb,
} from '../shared/mod-tier3.js';

export default {
  // ---------------------------------------------------------------------------------------------------------------
  // 结城理 (dollkeeper, 阶 III) — 不羁之力's <替身> state carries one of his two 人格面具, the one the state was entered
  // with: 俄耳甫斯 (S1, ranged) / 塔纳托斯 (S2 / S3, melee). The mask is the skill's own state: the kit re-picks it at
  // every cast and drops it with the skill (spec `onStart` / `onEnd`). The <替身> state itself (duration 20, blockCnt 0,
  // its HP) is the dollkeeper profession's — 不羁之力 adds ATK +atk and 攻击间隔增大 +base_attack_time while a mask runs.
  //   The mod's DEFAULT skill in the data is S2 (o.skill = skchr_makoto_2, like every 卫戍 chess), so `skill` below is
  //   S2's spec and S1 / S3 are authored as `skills` alts — each built from its OWN blackboard.
  //   S1 俄耳甫斯的竖琴 (alt): the mask attacks with arts damage (attack@atk_scale), and an ally below half HP in range
  //   is healed attack@heal_scale × ATK instead (PRTS 被动 text).
  //   S2 塔纳托斯的囚锁 (default): up to attack@max_target enemies of the mask's range take attack@atk_scale × ATK arts,
  //   each with attack@prob to be feared attack@fear s; a feared enemy below attack@kill_atk_scale × ATK is knocked out
  //   (attack@kill_damage true damage).
  //   S3 开辟明日的剑刃 (alt, ammo attack@trigger_time): 塔纳托斯, ASPD +talent@attack_speed, up to attack@max_target
  //   enemies take attack@atk_scale × ATK arts + the 1-tile splash of the same scale, nearby allies dodge attack@prob of
  //   a phys/arts hit, and up to attack@max_target_heal allies in range are healed attack@heal_scale × ATK per second.
  //   [ASSUMED / not in this kit] the masks as separate board pieces (their own attacks, 总攻击 of S.E.E.S.队长), the S3
  //   弱点伤害 conversion (its own damage type is not broken out by the data) and the "塔纳托斯在场时改为召唤俄耳甫斯" swap.
  // ---------------------------------------------------------------------------------------------------------------
  // 结城理 (dollkeeper, 阶 III) — 不羁之力's <替身> state carries one of his two 人格面具, the one the state was entered
  // with: 俄耳甫斯 (S1, ranged) / 塔纳托斯 (S2 / S3, melee). The mask is the skill's own state; the <替身> state itself
  // (duration 20, blockCnt 0, its HP) is the dollkeeper profession's.
  //   不羁之力 at 阶 III (E2): entering the <替身> state 停顿 (sluggish, −80 % move speed) every enemy on his own range
  //   row (range_table x-1, the official 13-tile grid of 结城理 / both his masks — NOT the generic 傀儡师 3×3 风丸 and
  //   归溟幽灵鲨 use, x-4) for bb.sluggish = 8 s, and while the state runs 攻击力+atk (0.8 at E2, additive
  //   atkPct), 攻击间隔增大 base_attack_time (a FLAT +0.4 s of BAT → batPct = 0.4 / the chess's BAT 1.2, the kits' rule
  //   for a seconds blackboard — NOT the raw 0.4 multiplier) and 生命值+max_hp_t1 (hpMul 0.7 over the profession's own
  //   0.5 substitute multiplier ⇒ ×1.35 of the base max HP).
  //   S.E.E.S.队长 at 阶 III: when the <替身> state ENDS (the substitute buff expires, or he is knocked out inside it),
  //   总攻击 — atk_scale 4.3 × ATK true damage to every enemy within 1.5 tiles (PRTS: 可叠加, one burst per S.E.E.S.
  //   member in range; the sim applies 结城理's own burst once).
  //   The mask FIGHTS as him: the dollkeeper substitution keeps his own board piece (blockCnt 0) and the mask's attacks
  //   are his own attacks / skill ticks, exactly like the other dollkeepers (风丸 tier2, 归溟幽灵鲨 tier5). The mask is
  //   never a second board piece: `token_makoto_*` are display-only in tokens.json, and what shows 塔纳托斯 / 俄耳甫斯
  //   is the clip-set change of his OWN Spine (Doll_Skill_1_* / Doll_Skill_2_* / Doll_Skill_3_P1_* / P2_*): the kit
  //   emits the renderer's 'phase' fx with `form` (render/units.js FORMS `char_4217_makoto`).
  //   The mod's DEFAULT skill in the data is S2 (o.skill = skchr_makoto_2, like every 卫戍 chess), so `skill` below is
  //   S2's spec and S1 / S3 are authored as `skills` alts — each built from its OWN blackboard.
  //   S1 俄耳甫斯的竖琴 (alt, 俄耳甫斯, enters the P2 half directly): the mask's ordinary attack deals attack@atk_scale ×
  //   ATK arts, and "范围内有生命值低于50%的友方干员时，改为对其治疗" — that condition is judged per mask attack (its
  //   `beforeAttack` hook): with a hurt ally under half HP in the mask net, the same attack heals attack@heal_scale × ATK
  //   INSTEAD of dealing damage. S1's 俄耳甫斯 still attacks (only S3's does not).
  //   S2 塔纳托斯的囚锁 (default, 塔纳托斯): the ordinary attack strikes up to attack@max_target enemies of the mask's range
  //   for attack@atk_scale × ATK **arts** damage, EACH of them with attack@prob to be feared attack@fear s, and a feared
  //   enemy below attack@kill_atk_scale × ATK is knocked out (attack@kill_damage true damage) — the execute rider runs per
  //   victim of the attack, not once per cast.
  //   S3 开辟明日的剑刃 (alt, 塔纳托斯 → 俄耳甫斯): 塔纳托斯's ordinary attack deals attack@atk_scale × ATK **弱点伤害** to
  //   up to attack@max_target enemies (弱点 is a retype, not a damage type: `weaknessRetype`, items/battle.js, turns a
  //   phys/arts instance into whichever of the two the victim resists less — the sim has no 'weakness' dmgType, so the
  //   instance is authored as arts and retyped per victim), with ASPD +talent@attack_speed while the mask is up. The P2
  //   half (俄耳甫斯) is S3's own passive tail: attack@block_cnt more block count, allies in range dodge attack@prob of a
  //   phys/arts hit (the user's 口径 includes 结城理 himself), and up to attack@max_target_heal allies in range are healed
  //   attack@heal_scale × ATK per second (自身 included) until the <替身> ends — and, as the same passive says, 俄耳甫斯
  //   does not attack. "塔纳托斯在场时，开启技能或受到致命伤时改为召唤俄耳甫斯": with the 塔纳托斯 mask already up, the next
  //   cast — or the lethal hit that would have knocked him out — switches the mask to 俄耳甫斯 instead of ending the state.
  //   THE PASSIVE IS THE NORMAL ATTACK REWRITTEN, NOT A BURST (user's 口径, PRTS 被动 wording): every 结城理 skill's
  //   description puts the damage / heal / fear / execute / dodge / regen in its **被动** half and leaves the **主动** half
  //   as the single sentence "立即切换为<替身>状态作战". So a mask's passive is carried by the 人格面具's ORDINARY attack
  //   while the <替身> state runs — the engine's own attack loop at its own 攻击间隔 — and never by an extra hit fired the
  //   moment the skill is cast. Mechanically: `trait.canAttack` (the profile's own hook, ai.js `updateAlly`, read off
  //   `effectiveProfile`) carries "不能攻击" for S3's 俄耳甫斯 half and the switch animation, while the skill's `attack`
  //   override ({ atkScale, dmgType, maxTargets, onEachHit }) is the 塔纳托斯 half's rewritten attack (`resolveHit`, ai.js).
  //   技能条 = <替身> 剩余时间 (the user's 口径): all three skills are AUTHORED as `duration` skills whose duration is the
  //   特性's own bb.duration (`dollDuration`, 20 s) even though the DATA declares them 瞬发 (duration 0, durationType
  //   NONE) — the 20 s belong to 特性 char_4217_makoto.trait ("持续20秒后自身再次替换<替身>"). The client's skill bar
  //   fills `sp / spCost` and only TINTS it with `UF.SKILL` (public/js/render/units.js), so an instant skill (whose
  //   `activate` zeroes sp) paints an empty, idle bar while the <替身> state runs — measured before this change: at
  //   t=20 s `skill.active false`, snapshot `UF.SKILL false`, sp creeping 0.03 → 2.0 and a SECOND auto-cast of S2 at
  //   t≈36 s inside the 俄耳甫斯 half (SP had regrown: no 阻回 for an instant skill). As a `duration` skill the bar IS
  //   the state's timer: `UF.SKILL` stays set for the whole <替身>, snapshot.js unitTuple sends `spCost × timeLeft /
  //   duration` (a draining bar) and skills.js stops SP gain while a timed skill runs (阻回 — the official 特性 has it,
  //   "替身"期间不回复技力). The CAST is unchanged: it is the switch itself ("主动：立即切换为<替身>状态作战"), and the
  //   塔纳托斯→俄耳甫斯 relay re-activates the same skill for the FRESH 20 s (relayToOrpheus → restartBar), so the
  //   second bar is that phase's own timer and only the LAST phase's expiry leaves him in the 本体.
  //   S3 is NOT ammo: its data carries no `attack@trigger_time` at all (the old `?? 31` fallback was invented — the key
  //   belongs to 安洁莉娜 S3, which stays ammo), and its passive runs "直到<替身>状态结束", i.e. the state's own 20 s.
  //   [ASSUMED] the two 人格面具 tokens' base_attack_time 1.1 s (no mask stats in the local gamedata dump) and the
  //   per-S.E.E.S.-member multiplication of 总攻击 (one burst; the sim has no squad model).
  char_4217_makoto: (bb, chess, def) => {
    const d = defOf(chess, def);
    const t0 = talentBb(d, 0), t1 = talentBb(d, 1);
    const stats = { atk: num(t0.atk, 0.4), bat: num(t0.base_attack_time, 0.4), hp: num(t0.max_hp_t1, 0.35), sluggish: num(t0.sluggish, 0) };
    const sees = num(t1.atk_scale, 1.8);
    const sid = selectedId(chess, d);
    const baseBat = Math.max(0.1, num(chess?.stats?.bat, 1) || 1);
    /** 本体's own attack range (傀儡师 1-1 = 2 tiles, the 职业统一口径): restored when the <替身> state ends. */
    const bodyGrid = copyGrid(d.rangeGrid) ?? copyGrid(chess?.rangeGrid) ?? null;
    /**
     * <替身> duration: the 特性's own `duration` — professions.js `dollkeeper: (tb) => ({ dollDuration: num(tb.duration,
     * 20) })`, the number the `dollSwitch` handler's `enter()` creates the `trait:substitute` buff with. The bar must run
     * as long as that state, so it is the ONE number the three skills take their own `duration` from — never a literal 20
     * (another 特性 bb / a module would move both together). Read with the file's own helpers (`traitBb` = def.traitBb,
     * the raw `trait.bb` as the fallback for a record whose normalised slot is missing).
     */
    const dollRaw = num(traitBb(d).duration, num(d?.raw?.trait?.bb?.duration, 20));
    const dollDuration = dollRaw > 0 ? dollRaw : 20;
    const maskToken = (m) => (m === 'orpheus' ? TOKEN_IDS.makotoMask2 : TOKEN_IDS.makotoMask);
    const maskForm = (m) => (sid === 'skchr_makoto_1' ? 'doll1' : sid === 'skchr_makoto_3' ? (m === 'orpheus' ? 'doll3p2' : 'doll3p1') : 'doll2');
    /**
     * 结城理's 人格面具 / 不羁之力 range net: the OFFICIAL range_table grid `x-1` = **13 tiles** (the 菱形 3-3-3-3 plus the
     * centring row's 5, 正前方 2nd tile [0,2] included) — his OWN range, unlike the generic 傀儡师 3×3: 风丸 and 归溟幽灵鲨
     * carry the same 本体 `1-1` (2 tiles, 职业统一口径, NOT a bug, never touched here) but their <替身> form uses `x-4`
     * (3×3), while 结城理's three skills AND both his talents are `rangeId` x-1. Derived from the data, never hand-written:
     *   - `s.rangeGrid` of each skill's own record (skchr_makoto_1/2/3 all 13 tiles): the widest grid the data offers is
     *     the mask's range whichever skill is selected (`skillData` gives a non-default skill its own normalised record);
     *   - `d.skills[].rangeGrid` (all three, same x-1) — the record of a skill other than the selected one;
     *   - talent 0 不羁之力 bb.range_id / talent 1 S.E.E.S.队长 bb.range_id are BOTH x-1, whose `talent.rangeGrid` slot
     *     holds the same 13-tile grid whenever the data fills it (null in data/chess.json today, so it is only a candidate).
     * The 9-tile `NINE` (file-level, shared with other operators' kits — never redefined/deleted) is only the LAST-resort
     * [FALLBACK] here, for a hypothetical data set in which no skill record has a grid wider than the 3×3 <替身> form.
     */
    const maskNets = () => {
      const cands = [d.skill?.rangeGrid, ...(d.skills ?? []).map((s) => s?.rangeGrid), d.talents?.[0]?.rangeGrid, d.talents?.[1]?.rangeGrid]
        .filter((g) => Array.isArray(g) && g.length);
      return cands.reduce((a, b) => (b.length > (a?.length ?? 0) ? b : a), null) ?? copyGrid(d.talents?.[0]?.rangeGrid) ?? NINE;
    };
    /** 人格面具's own attack range (range_table x-1, 13 tiles): at most `n` enemies of it, best targets first. */
    const maskTargets = (battle, unit, n) => enemiesOn(battle, unit, [...new Set(gridKeys(maskNets(), unit))], Math.max(1, n), unit.profile);
    /** 不羁之力's range (talent bb range_id x-1, the same 13 tiles): the switch's 停顿. */
    const auraTargets = (battle, unit) => [...new Set(gridKeys(maskNets(), unit))];
    /**
     * Show the entered mask on his own model: his Spine carries the Persona clips, so the <替身> state switches the
     * view's clip set exactly like an enemy's 模式 ('phase' fx carrying \`form\`, render/units.js FORMS).
     */
    const showMask = (battle, unit) => {
      const f = maskForm(unit.mem.makotoMask);
      if (unit.mem.makotoForm === f) return;
      unit.mem.makotoForm = f;
      unit.form = f;
      // A form event's dur is its remaining lifetime, not the switch clip's length. Sending MASK_SWITCH here
      // scheduled SwitchOut immediately, hiding the Persona while its real attacks and skill were still running.
      const dur = num(unit.findBuff('trait:substitute')?.timeLeft, dollDuration);
      battle.fx('phase', { x: unit.x, y: unit.y, id: unit.id, kind: f, form: f, dur });
      fx(battle, 'summon', unit, { token: maskToken(unit.mem.makotoMask), skill: 'makoto' });
    };
    const hideMask = (battle, unit) => {
      if (unit.mem.makotoForm == null) return;
      unit.mem.makotoForm = null;
      unit.form = null;
      battle.fx('phase', { x: unit.x, y: unit.y, id: unit.id, kind: 'base', form: null, dur: MASK_SWITCH });
    };
    /**
     * 不羁之力 of the entered mask: while he fights as the <替身> — ATK +atk (additive atkPct), 攻击间隔增大
     * +base_attack_time SECONDS (batPct = seconds / this chess's BAT), 生命值 +max_hp_t1 (hpMul over the profession's
     * substitute 0.5). Also owns S.E.E.S.队长's 总攻击, which fires when the state ENDS.
     */
    const applyMask = (battle, unit) => {
      if (unit.trait.doll && unit.alive) {
        unit.mem.makotoSaw = true;
        showMask(battle, unit);
        if (!unit.findBuff('makoto:mask')) {
          const mods = {};
          if (stats.atk) mods.atkPct = stats.atk;
          if (stats.bat) mods.batPct = stats.bat / baseBat;
          if (stats.hp > 0 && stats.hp < 5) {
            // 生命值+35 % is OF the operator's own max HP; the profession's substitute buff only carries a `hpMul` when the
            // operator owns a real 替身 token (风丸's 纸偶 — professions.js `dollHpMul`), and 结城理's `token_makoto_*` are
            // display-only, so his <替身> max HP is his OWN (professions.js header) and the share to cancel out is 1:
            // 1.35 / 1 over upstream v0.1.3's `enter()` — the old 1.35 / 0.5 belonged to the profession helper this
            // migration removed (v0.1.1's exported `enter`-doll-state entry point).
            const sub = unit.findBuff('trait:substitute');
            const share = num(sub?.mods?.hpMul, 1) || 1;
            if (share > 0) mods.hpMul = (1 + stats.hp) / share;
          }
          battle.addBuff(unit, { key: 'makoto:mask', mods });
        }
      } else {
        if (unit.findBuff('makoto:mask')) battle.removeBuff(unit, 'makoto:mask');
        hideMask(battle, unit);
      }
    };
    /** S.E.E.S.队长 总攻击: atk_scale × ATK true damage around him when the <替身> state ends. */
    const allOutAttack = (battle, unit) => {
      if (!(sees > 0) || !unit.alive) return;
      const list = battle.enemiesInRadius(unit.x, unit.y, 1.5);
      if (!list.length) return;
      fx(battle, 'aoe', unit, { radius: 1.5, skill: 'makotoSees' });
      for (const e of list) {
        battle.dealDamage(unit, e, { amount: unit.s.atk * sees, type: 'true', isSkill: true, tags: ['talent', 'makotoSees'] });
      }
    };
    /**
     * Enter the mask state of the cast ("主动：立即切换为<替身>状态作战"): the ACTIVE half of every 结城理 skill is the
     * switch itself, so the cast fires the profession's own `dollSwitch` hook (upstream v0.1.3's official extension
     * point — the same call 归溟幽灵鲨's S2 `onEnd` makes) and only then does the mask exist to fight. The alternative
     * entry — a fatal hit — is the profession's own hook and stays untouched; `enter()` refuses while `trait.doll` is
     * already up, so a re-entry from inside the state (S3's 塔纳托斯→俄耳甫斯 switch) neither restarts the state nor
     * re-fires the switch animation. NB `enter()` → `startSwitch()` ends a running skill (`sk.end('substitute')`,
     * professions.js) and `use()` runs inside `onStart`, where the bar is already active (skills.js `activate`).
     */
    const use = (battle, unit, m, initial = true) => {
      // S3: "塔纳托斯在场时，开启技能或受到致命伤时改为召唤俄耳甫斯"
      if (initial && sid === 'skchr_makoto_3' && unit.mem.makotoMask === 'thanatos' && unit.trait.doll) m = 'orpheus';
      // 优先遵循上游 v0.1.3：傀儡师机制由 professions.js 的 `dollSwitch` hook 提供（官方扩展点；tier5.js 归溟幽灵鲨
      // S2 同款用法），内建 1 s 切换动画、阻回、禁疗、替身满血与切换期免疫。`enter()` 自带状态判断与幂等处理。
      battle.emit('dollSwitch', { unit, reason: 'skill', done: false });
      // 技能条不在这里拉：上游的切换动画（1 s）结束后替身态才成立，拉早了条会比替身早 1 s（错位）。
      // 拉条在 install 的 tick 钩子里做 —— 检测到"替身态已开始但技能没在跑"的那一刻。
      // never the 本体 1-1 (2 tiles) — the mask fights with the skill's `rangeId`. `Battle.relocate`/`refreshRange` rebuild
      // the absolute net from whatever tile he stands on, so the range travels with him.
      if (unit.rangeGrid !== maskNets()) { unit.rangeGrid = maskNets(); battle.refreshRange(unit); }
      unit.mem.makotoMask = m;
      // the relay phase: 塔纳托斯 is the form that chains into 俄耳甫斯 (1), anything already in the P2 half stays 2
      // (S3's own 塔纳托斯→俄耳甫斯 switch enters the P2 half directly and must not be re-chained)
      if (m === 'orpheus') unit.mem.makotoRelay = 2;
      else if (unit.mem.makotoRelay !== 2) unit.mem.makotoRelay = 1;
      const prev = unit.findBuff('makoto:dollBlock');
      if (prev) battle.removeBuff(unit, prev);
      if (m === 'orpheus' && sid === 'skchr_makoto_3') { // P2 阻挡数+2 while 俄耳甫斯 runs
        battle.addBuff(unit, { key: 'makoto:dollBlock', mods: { blockCnt: num(bb['attack@block_cnt'], 2) } });
      }
      applyMask(battle, unit);
    };
    /**
     * Start the skill's own timer for the <替身> phase just entered (the relay's P2 half): the bar of a `duration` skill
     * IS the state's remaining time (snapshot.js drains sp by `timeLeft / duration`), and the cast's `activate` spent the
     * charge — so the same skill is re-activated FOR FREE (`{ free: true }`: no charge, no sp bookkeeping) with reason
     * 'relay', which every `onStart` uses to skip the cast's own work (the mask entry — the state entry itself ran in
     * `use()`, which `relayToOrpheus` calls before this).
     * `sp` is zeroed like the cast's own `activate` does when it spends the charge: 阻回 (skills.js `gainSp` returns 0
     * while a timed skill runs) keeps it there, so the phase-2 bar never shows a leftover SP from the one tick between
     * the P1 expiry and this relay, and the next real cast still starts from 0. A skill that is somehow still running
     * (it should not be: both timers start in the same tick) only has its timer reset instead.
     */
    const restartBar = (battle, unit, reason = 'relay') => {
      const sk = unit.skill;
      if (!sk || sk.noSkill || sk.kind !== 'duration') return false;
      if (sk.active) { sk.timeLeft = sk.duration; return true; }
      sk.sp = 0;
      return sk.activate(reason, { free: true });
    };
    /**
     * 塔纳托斯 → 俄耳甫斯 relay (the user's rule, off the data): 塔纳托斯 fights for his 20 s of <替身>, and when that
     * state ends he is NOT done — the mask switches to 俄耳甫斯 (the healing / non-attacking form) for a FRESH 20 s of
     * <替身>, and only when THAT ends does 结城理 return to the 本体. The 20 s come from the same `trait:substitute`
     * duration the profession uses (bb.duration / dollDuration), so the relay is one more entry, never a new timer.
     * S3's own "塔纳托斯在场时…改为召唤俄耳甫斯" switch is a different door into the same form (a cast / fatal hit while
     * 塔纳托斯 is up). `mem.makotoRelay` marks the phase: 1 = 塔纳托斯 ran, 2 = the 俄耳甫斯 half, 0 = nothing to chain.
     * The relay is reached from the `tick` hook on the tick the `trait:substitute` buff expired — the buffs phase runs
     * before the allies phase in Battle.step, so `doll` is already false here and the hook's `enter()` accepts (its
     * `trait.doll` guard keeps the FIRST cast from resetting a running state; it is never in the way here).
     */
    const relayToOrpheus = (battle, unit) => {
      unit.mem.makotoRelay = 2;
      use(battle, unit, 'orpheus', false);    // emit `dollSwitch` (a fresh DOLL_SWITCH + dollDuration state), mask = P2
      if (unit.rangeGrid !== maskNets()) { unit.rangeGrid = maskNets(); battle.refreshRange(unit); }
      showMask(battle, unit);                 // applyMask re-runs on the next tick; the clip set switches right here
      restartBar(battle, unit);               // the user's "这时候是新的技能条": the P2 half gets its own 20 s bar
    };
    /** The mask's least-healthy hurt ally on its own range net, under `lim` of max HP (null: none) — 结城理 included. */
    const hurtAllyInRange = (battle, unit, lim) => {
      const keys = new Set(gridKeys(maskNets(), unit));
      return battle.injuredAlliesInKeys(keys, unit).find((a) => a.hpRatio < lim) ?? null;
    };
    /**
     * 俄耳甫斯's heal of S3's P2 half: "每秒治疗范围内最多…名友方干员" attack@heal_scale × ATK.
     * **自身 included**（用户口径「对自身以及范围内队友提供治疗」），并且**自身免疫禁疗**：
     * upstream 的 <替身> buff 带 `healFree`（禁疗；PRTS 异常效果「受到的治疗量变为0」，professions.js L151），
     * 它会把结城理自己的这份治疗清零。`opts.ignoreHealFree` 是引擎自带的逃生口
     * （damage.js L513；史尔特尔 S3 的起手治疗用的是同一个，PRTS「无视禁疗」）—— 用户 2026-10-06 决定：
     * 俄耳甫斯形态对自身免疫禁疗。
     */
    const orpheusRegen = (battle, unit, heal, healN) => {
      if (!(heal > 0)) return;
      const hurt = battle.injuredAlliesInKeys(new Set(gridKeys(maskNets(), unit)), unit).slice(0, healN);
      for (const a of hurt) battle.heal(unit, a, unit.s.atk * heal, a === unit ? { ignoreHealFree: true } : undefined);
    };
    /**
     * The mask's rewritten ORDINARY attack (block header): while the <替身> runs, 塔纳托斯 hits up to attack@max_target
     * enemies on the mask's 13-tile net for attack@atk_scale × ATK — as arts for S2, as the 弱点 retype for S3 — and S2's
     * rider runs on EVERY victim of EVERY attack: attack@prob to fear it attack@fear s, and a feared enemy below
     * attack@kill_atk_scale × ATK is knocked out (attack@kill_damage true damage; PRTS "范围内恐惧中的敌人若生命值低于
     * 结城理攻击力的250%则立刻倒下").
     */
    const openAttack = (m) => m === 'orpheus';
    const thanatosAttack = (s, o) => {
      const scv = num(s.bb['attack@atk_scale'], 2);
      const fear = num(o.fear, 0), p = num(o.prob, 0), killAt = num(o.killAt, 0), kill = num(o.kill, 0);
      const spec = {
        atkScale: scv,
        dmgType: 'arts',
        // the target cap rides on the ATTACK override (ai.js merges every `attack` key onto the profile; `maxTargets` is
        // the key `acquireTargets` counts with — `targeting.maxTargets` only exists for a spec that also carries a
        // `targeting` block, and S2/S1 must keep `targeting` undefined, see the range regression's assert D).
        maxTargets: o.maxTargets ?? undefined,
        tags: ['skill', 'makoto'],
        onEachHit({ battle, unit, target }) {
          if (!target || !target.alive) return;
          // S3 弱点伤害: no 'weakness' dmgType exists in the engine — 弱点 retypes a phys/arts instance to the one the victim
          // resists less (weaknessRetype, items/battle.js), so it is applied per victim here.
          if (!fear || !(p > 0)) return;
          const wasFeared = !!target.findBuff('fear');   // "范围内恐惧中的敌人" — the state before this hit's own roll
          let feared = false;
          if (battle.rng.chance(p)) { battle.applyStatus(target, 'fear', { duration: fear, source: unit }); feared = true; }
          if (!target.alive || !(wasFeared || feared)) return;
          if (kill > 0 && target.hp < unit.s.atk * killAt) {
            battle.dealDamage(unit, target, { amount: kill, type: 'true', isSkill: true, tags: ['skill', 'makotoExecute'] });
          }
        },
      };
      return new Proxy(spec, {
        // `noAttack` is TRUE from the start and stays true: this override exists only for the 塔纳托斯 half's skills (S2 /
        // S3), and 俄耳甫斯 — their relay's P2 half — never uses it. The live mask decision belongs to `trait.canAttack`
        // (a resolved-profile value), because a Proxy getter cannot see the unit.
        get: (t, k) => (k === 'noAttack' ? true : t[k]),
      });
    };
    /**
     * 俄耳甫斯's rewritten ordinary attack of S1: "攻击对敌人造成攻击力210%的法术伤害，范围内有生命值低于50%的友方干员
     * 时，改为对其治疗相当于结城理攻击力50%的生命值" — the condition is judged when the attack RESOLVES, on the mask's own
     * net: a hurt ally under half HP takes the heal **instead of** the damage ("改为"), otherwise the attack is arts damage
     * at attack@atk_scale. "Instead" is exact: the `beforeAttack` hook (install, below) heals that ally and cancels the
     * whole attack before any damage instance of it exists, so the enemy on a tile of the same net takes nothing that
     * tick — the mask heals or it strikes, never both (the PRTS sentence has no "并"). There is no 庇护 / damage
     * reduction anywhere in the three 被动 texts, so none is added.
     */
    const hurtLowAlly = (battle, unit) => hurtAllyInRange(battle, unit, 0.5);
    const healLowAlly = (battle, unit, hs) => {
      const a = hurtLowAlly(battle, unit);
      if (!a || !(hs > 0)) return null;
      // same "自身免疫禁疗" rule as orpheusRegen: the <替身> buff's `healFree` must not zero 结城理's own heal
      battle.heal(unit, a, unit.s.atk * hs, a === unit ? { ignoreHealFree: true } : undefined);
      return a;
    };
    const s1 = (s) => ({
      // S1's bar is the same <替身> timer; S1 enters 俄耳甫斯 directly, so nothing relays after it and its own expiry is
      // what returns him to the 本体 (mem.makotoRelay stays 2, relayMask null).
      kind: 'duration',
      duration: dollDuration,
      attack: {
        atkScale: num(s.bb['attack@atk_scale'], 2.1),
        dmgType: 'arts',
        // single target ("攻击对敌人" — no 至多N名): `targeting` stays undefined (the range regression's assert D).
        maxTargets: 1,
        tags: ['skill', 'makoto'],
      },
      onStart({ battle, unit, reason }) {
        if (reason === 'relay') return;
        use(battle, unit, 'orpheus');
      },
    });
    const s2 = (s) => ({
      // the bar IS the <替身> timer (block header): `duration` from the 特性, not the 瞬发 record the data ships
      kind: 'duration',
      duration: dollDuration,
      relayMask: 'orpheus',                  // 塔纳托斯 → 俄耳甫斯 (the user's chain)
      attack: thanatosAttack(s, {
        maxTargets: Math.max(1, Math.floor(num(s.bb['attack@max_target'], 4))),
        fear: num(s.bb['attack@fear'], 1.5), prob: num(s.bb['attack@prob'], 0.35),
        killAt: num(s.bb['attack@kill_atk_scale'], 2.5), kill: num(s.bb['attack@kill_damage'], 1e7),
      }),
      onStart({ battle, unit, reason }) {
        if (reason === 'relay') return;      // the relay's fresh bar: the state entry already ran in relayToOrpheus
        use(battle, unit, 'thanatos');
      },
    });
    const s3 = (s) => {
      const heal = num(s.bb['attack@heal_scale'], 0.3), healN = Math.max(1, Math.floor(num(s.bb['attack@max_target_heal'], 4)));
      const dodge = num(s.bb['attack@prob'], 0.35);
      return {
        // NOT ammo (block header): the data has no `attack@trigger_time` for 结城理 — the old `?? 31` fallback was an
        // invented bar — and the passive runs "直到<替身>状态结束", the state's own 20 s. Same bar as S2's.
        kind: 'duration',
        duration: dollDuration,
        relayMask: 'orpheus',                 // 塔纳托斯 → 俄耳甫斯 (the user's chain)
        mods: { aspd: num(s.bb['talent@attack_speed'], 45) },
        // the mask's own x-1 net while the bar runs (the engine's live range; S1/S2 gate the same net on `trait.doll`
        // through their addTriggerRange instead) — the range regression's assert A/C reads this grid, and assert D reads
        // its `maxTargets` (the same attack@max_target the attack override carries: ai.js writes the key from both places
        // onto the resolved profile, so the cap is the data's either way).
        targeting: { rangeGrid: maskNets(), maxTargets: Math.max(1, Math.floor(num(s.bb['attack@max_target'], 4))), allInRange: false },
        // 塔纳托斯's ordinary attack: attack@atk_scale × ATK as 弱点伤害 (the retype above), up to attack@max_target enemies
        attack: thanatosAttack(s, {
          weakness: true,
          maxTargets: Math.max(1, Math.floor(num(s.bb['attack@max_target'], 4))),
        }),
        onStart({ battle, unit, reason }) {
          if (reason !== 'relay') use(battle, unit, 'thanatos');
          // The 俄耳甫斯 half's aura is S3's OWN passive ("使范围内友方干员获得…闪避并每秒治疗…，直到<替身>状态结束"), so it
          // runs from the FIRST bar and re-runs on the relay's fresh bar — including 结城理 himself (user's 口径: "自身
          // 获得闪避"; PRTS says 范围内友方干员 and he stands on his own range net).
          const near = new Set(gridKeys(maskNets(), unit));
          for (const a of battle.alliesFor(unit, unit.ownerId)) {
            if (!unit.alive || a.kind !== 'op' || !onTiles(a, near)) continue;
            a.mem.makotoDodge = Math.max(num(a.mem.makotoDodge, 0), dodge);
          }
        },
        onTick({ battle, unit, skill, dt }) {
          // the regen is 俄耳甫斯's ("并每秒治疗…"): 塔纳托斯 does not heal — the user's rule "塔纳托斯 = 仅能攻击"
          if (unit.mem.makotoMask !== 'orpheus' || !skill.active) return;
          unit.mem.makotoHeal = (unit.mem.makotoHeal ?? 0) + (dt || 0);
          if (unit.mem.makotoHeal < 1) return;
          unit.mem.makotoHeal = 0;
          orpheusRegen(battle, unit, heal, healN);
        },
      };
    };
    const kit = {
      // `trait.canAttack` (the PROFILE's own hook, ai.js `updateAlly` — it is read off `effectiveProfile(unit)`, so the
      // skill's `attack` override merges onto it) carries the two states in which the mask does not fight with its
      // rewritten attack: the 1 s `dollSwitch` animation (the passive applies "在<替身>状态下", after the switch — without
      // this the animation's own attack landed unreduced, measured 1326.6 = 737 × 1.8) and the 俄耳甫斯 half of S3, whose
      // own 被动 says it does not attack at all ("不能攻击"; its `attack` override's `noAttack` covers it too). S1's
      // 俄耳甫斯 DOES attack — its 被动 is "攻击对敌人造成攻击力210%的法术伤害，…改为对其治疗…" — so `sid`, not the mask,
      // decides that half. The 本体 (no mask) must keep attacking: the DEFAULT 技能策略 casts "about to attack" (skills.js
      // `onAboutToAttack`), so a false there would make all three skills impossible to cast (measured: S2 never cast).
      trait: {
        canAttack: (battle, u) => {
          const m = u.mem.makotoMask ?? null;
          if (m == null) return true;
          if (u.trait.dollSwitching) return false;
          return !(m === 'orpheus' && sid === 'skchr_makoto_3');
        },
      },
      skill: s2(skillData(chess, d, bb, 'skchr_makoto_2')),
      skills: altSkills(chess, d, bb, {
        skchr_makoto_1: s1,
        skchr_makoto_3: s3,
      }),
      talents: [
        { install(battle, unit) {
          // the <替身> state entered by a fatal hit carries the mask its skill picked (S2 / S3 default: 塔纳托斯)
          battle.on('fatal', (ctx) => { if (ctx.unit === unit && unit.mem.makotoMask == null) unit.mem.makotoMask = 'thanatos'; }, { owner: unit, priority: -200 });
          // S3's own passive: "塔纳托斯在场时，开启技能**或受到致命伤**时改为召唤俄耳甫斯". A lethal hit taken while
          // 塔纳托斯 is the running mask因此 **does not knock him out** (user's decision 2026-10-06, "读法 A: 不死,
          // 改为切俄耳甫斯", following the PRTS wording). `ctx.prevented` short-circuits the profession's own
          // dollkeeper `fatal` hook (professions.js), which would otherwise treat it as "the 替身 was knocked out";
          // `enter()` then re-runs for a FRESH 20 s as 俄耳甫斯 (it accepts: `startSwitch` expired the old buff).
          // Only the 塔纳托斯 half is intercepted — in the 俄耳甫斯 half nothing is, so the 替身 can be knocked out
          // there and the operator retreats, which is the one way this state still ends by death.
          battle.on('fatal', (ctx) => {
            if (ctx.unit !== unit || ctx.prevented) return;
            if (!unit.trait.doll || unit.mem.makotoMask !== 'thanatos') return;
            ctx.prevented = true;                       // 不死：这一击不击倒他
            relayToOrpheus(battle, unit);               // 改为召唤俄耳甫斯（全新的 20 s）
            unit.hp = unit.s.maxHp;                     // 切换重设生命至最大值（PRTS 傀儡师特性）
            unit.markDirty();
          }, { owner: unit, priority: -100 });
          // 不羁之力: "切换为<替身>状态时停顿周围一定范围内敌人sluggish秒" — 停顿 = the engine's sluggish (−80 % move)
          if (stats.sluggish > 0) {
            battle.on('fatal', (ctx) => {
              if (ctx.unit !== unit || !ctx.prevented) return;
              const keys = new Set(auraTargets(battle, unit));
              for (const e of battle.enemies) {
                if (!e.alive || e.hidden) continue;
                if (!keys.has(`${e.tileR},${e.tileC}`) && !bodyInKeys(e, keys)) continue;
                battle.applyStatus(e, 'sluggish', { duration: stats.sluggish, source: unit });
              }
              fx(battle, 'aoe', unit, { radius: 1.5, skill: 'makotoSluggish' });
            }, { owner: unit, priority: -210 });
          }
        } },
      ],
      install(battle, unit) {
        if (sid === 'skchr_makoto_3') battle.on('hit', (ctx) => {
          if (ctx.source === unit && ctx.dmg?.isAttack && unit.trait.doll && unit.mem.makotoMask === 'thanatos') {
            weaknessRetype(ctx.dmg, unit, ctx.target);
          }
        }, { owner: unit, priority: 5 });
        /**
         * S1 / S2 keep the MASK's own range x-1 as their DEFAULT trigger range, gated on `unit.trait.doll`: their
         * 人格面具's attack resolves inside `onStart` (the cast is what enters <替身>), so the data's ordinary rule
         * (DEFAULT on the 本体 1-1) must NOT be widened by the net — an enemy 3 tiles ahead stays unable to auto-cast
         * them, exactly as before ("the skill is what puts him into <替身>"). The three skills are `duration` now, so
         * this trigger is inert while the bar runs (skills.js skips every trigger check for a running timed skill) and
         * stays what it always was for the state's OTHER door: a fatal hit enters <替身> with no cast, and the trigger is
         * then what lets the mask fight with its own 13-tile net. S3 carries the same net in its own
         * `targeting.rangeGrid` instead (as it did in the ammo form: unchanged), so it registers none.
         */
        if (unit.skill && sid !== 'skchr_makoto_3') unit.skill.addTriggerRange((battle, u) => (u.trait.doll ? [gridKeys(maskNets(), u)] : []));
        /**
         * S1's "改为对其治疗" is a REPLACEMENT, not an addition ("改为": the heal takes the attack's place). The judgement
         * is made on `beforeAttack` — the engine's own point for "the attack about to be made is replaced" (the same hook
         * 塞雷娅 S1's "触发时会替换当次攻击" / 拉普兰德 S2 use) — BEFORE a damage instance of this attack exists, so the
         * enemy in reach takes nothing that tick. The heal picks the mask net's least-healthy <50 % ally, 结城理 included.
         */
        if (sid === 'skchr_makoto_1') {
          const hs = num(skillData(chess, d, bb, 'skchr_makoto_1').bb['attack@heal_scale'], 0.5);
          battle.on('beforeAttack', (ctx) => {
            if (ctx.attacker !== unit || !unit.skill?.active || !unit.alive) return;
            if (unit.mem.makotoMask !== 'orpheus') return;      // only 俄耳甫斯 heals ("范围内…改为对其治疗")
            if (!hurtLowAlly(battle, unit)) return;             // no ally below half HP on the net ⇒ the attack stands
            healLowAlly(battle, unit, hs);
            ctx.targets = [];
            ctx.cancel = true;                                  // the damage of this attack does not happen
          }, { owner: unit, priority: -100 });
        }
        // 不羁之力 runs while the <替身> state does; its END (the substitute expiring with him alive) is the
        // S.E.E.S.队长 总攻击. A fatal hit inside the state runs the 死亡 path instead, which fires it from there.
        battle.on('tick', () => {
          // "受致命伤时改为召唤俄耳甫斯" (S3's own 被动) was marked by the fatal handler while 塔纳托斯 was up: the state is
          // still running (its own 20 s were not restarted), the mask switches to 俄耳甫斯.
          if (unit.alive && unit.trait.doll && unit.mem.makotoFatalRelay) {
            unit.mem.makotoFatalRelay = false;
            unit.mem.makotoMask = 'orpheus';
            unit.mem.makotoRelay = 2;
            applyMask(battle, unit);
          }
          // the relay: 塔纳托斯's 20 s just ran out with him alive and still on the field → 俄耳甫斯 takes over for a
          // FRESH 20 s (relayToOrpheus re-enters the state; `doll` is already false here, so the dollSwitch `enter()`
          // accepts), and only 俄耳甫斯's own expiry falls through to the 本体 restore below (its spec carries no relay).
          if (!unit.trait.doll && unit.alive && unit.mem.makotoRelay === 1 && (unit.skill?.spec?.relayMask ?? null)) {
            relayToOrpheus(battle, unit);
            return;
          }
          if (unit.trait.doll && unit.alive) unit.mem.makotoSaw = true;
          else if (unit.mem.makotoSaw) { unit.mem.makotoSaw = false; allOutAttack(battle, unit); }
          applyMask(battle, unit);
          // 技能条 = 本次 <替身> 的剩余时间（用户口径）。上游 `dollSwitch` 先跑 1 s 切换动画，提前拉条会让条与替身计时错位；
          // `trait:dollSwitching` 消失即替身态真正开始（`restartBar` 把条重置为完整时长）。reason 必须用 'relay'：各技能的
          // `onStart` 只对该 reason early-return（跳过"进状态"那一施放工作）。
          if (unit.trait.doll && unit.alive && unit.skill && !unit.skill.active && !unit.findBuff('trait:dollSwitching')) {
            restartBar(battle, unit, 'relay');
          }
          // back in the 本体 form the ordinary 1-1 (2 tiles) range returns (the <替身> form's x-1 is dropped with the
          // state): restored once per transition, and only while `bodyGrid` is what the data gave the chess. The mask of
          // the state that just ended too: the NEXT lethal hit is a <本体> hit, which picks 塔纳托斯 again.
          if (!unit.trait.doll && bodyGrid && unit.rangeGrid !== bodyGrid) { unit.rangeGrid = bodyGrid; battle.refreshRange(unit); }
          if (!unit.trait.doll && unit.mem.makotoMask != null) { unit.mem.makotoMask = null; unit.mem.makotoRelay = 0; }
        }, { owner: unit });
        battle.on('death', (ctx) => {
          if (ctx.unit !== unit || !unit.mem.makotoSaw) return;
          unit.mem.makotoSaw = false;
          allOutAttack(battle, unit);   // the <替身> state ended by the knock-out: the squad still strikes
        }, { owner: unit });
        /**
         * "塔纳托斯在场时，开启技能或受到致命伤时改为召唤俄耳甫斯" (S3's own 被动): while 塔纳托斯 is the running mask, the
         * LETHAL hit does not knock him out — it switches the mask to 俄耳甫斯. The dollkeeper's own fatal hook (−100)
         * refuses a hit inside the state (the 替身 is the form that can be knocked out), so this guard holds the hit at 1
         * HP (`applyHpLoss` writes `prevented` back as ≥1 HP) and the `tick` hook below performs the switch — the same
         * `applyMask` / clip-set path the timed relay uses, with the state's own remaining 20 s, not a fresh entry.
         */
        if (sid === 'skchr_makoto_3') {
          battle.on('fatal', (ctx) => {
            if (ctx.unit !== unit || ctx.prevented || !unit.alive) return;
            if (!unit.trait.doll || unit.mem.makotoMask !== 'thanatos') return;
            ctx.prevented = true;
            unit.mem.makotoFatalRelay = true;
          }, { owner: unit, priority: -150 });
        }
        // S3's 闪避 for the allies of the mask net — 结城理 HIMSELF included (user's 口径: "自身获得闪避"; PRTS's "范围内友方
        // 干员" covers him, he stands on his own range). The aura is granted in the S3 spec's `onStart` (both bars), so
        // here only the roll itself, while that skill runs and 俄耳甫斯 is the mask.
        battle.on('hit', (ctx) => {
          const t = ctx.target;
          if (!t || t.side !== 'ally' || !(num(t.mem.makotoDodge, 0) > 0) || !unit.skill?.active) return;
          if (unit.mem.makotoMask !== 'orpheus') return;
          if (ctx.dmg && (ctx.dmg.type === 'phys' || ctx.dmg.type === 'arts') && battle.rng.chance(num(t.mem.makotoDodge))) {
            ctx.dmg.cancel = true;
            fx(battle, 'dodge', t);
          }
        }, { owner: unit });
        battle.on('skillEnd', (ctx) => {
          if (ctx.unit !== unit) return;
          for (const a of battle.alliesFor(unit, unit.ownerId)) a.mem.makotoDodge = 0;
        }, { owner: unit });
      },
    };
    return kit;
  },
};
