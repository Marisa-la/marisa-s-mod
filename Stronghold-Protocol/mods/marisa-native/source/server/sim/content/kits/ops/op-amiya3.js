// server/sim/content/kits/ops/op-amiya3.js — MOD：阿米娅(医疗)（chess_char_1037_amiya3，阶 V 卫戍棋子（chessIds chess_char_1037_amiya3_a normal + _b elite））的 kit。
//
// 来源：server/sim/content/kits/tier3.js 的 `chess_char_1037_amiya3` 段（v0.1.4 段本体第 2696-2826 行，共 131 行；
// 其上的说明注释第 2640-2695 行一并带来）。迁移后补正 S1 技能期/普攻条件、S2 加攻顺序与临时 buff 清理；导入（`./tier1.js` →
// `../shared/tier1.js` + `../shared/mod-tier3.js`，相对路径随目录下沉一级）与默认导出的形状
// （`export default { char_1037_amiya3: (bb, chess, def) => … }`，上游 ops 约定；键名是唯一被改写的一行）。
//
// 注册：content/index.js 的 MOD_KIT_KEYS 把默认导出的 charId 键改写成 **bare chessId** `chess_char_1037_amiya3`，
// 于是这一个文件既服务 _a（normal）也服务 _b（elite）。因为她是**卫戍棋子**（商店常驻刷新招到），
// **不**写进 kits/index.js 的 OPERATOR_KIT_FILES —— 那会让 charId 进 KITTED_CHARS，从而出现在「自选编队」名单。
//
// 文件级 helper 在 ../shared/mod-tier3.js（两段自研 kit 共用一份）。
import { COLS, PUSH_DIRECTIONAL_MIN_DIST } from '../../../constants.js';
import { canTargetEnemy } from '../../../targeting.js';
import { normalizeChess, normalizeSkill } from '../../../simdata.js';
import {
  alive, altSkills, defOf, fx, gridKeys, num, selectedId, skillData, talentBb,
} from '../shared/mod-tier3.js';

export default {
  // ---------------------------------------------------------------------------------------------------------------
  // 阿米娅 (医疗形态) (咒愈师 incantationmedic, 阶 III) — the branch itself is already implemented (professions.js
  // `incantationmedic`: arts damage, `heal: null`, `installIncantation`, trait bb `scale` = healRatio — PRTS 特性
  // "攻击造成法术伤害，攻击敌人时为攻击范围内一名友方干员治疗相当于50%伤害的生命值"), so this kit carries NEITHER the
  // trait's heal NOR its ratio: every number below is a skill / talent clause.
  //   T1 诚挚期许 (talent 0, elite-2 bb `max_hp` / `hp_recovery_per_sec_by_max_hp_ratio`) — TWO auras over every
  //   friendly unit while she is on the field: 最大生命 +max_hp (hpPct, the kit's additive share) for as long as she
  //   stands there, and 每秒恢复 ratio × 最大生命 (hpRegenRatio — an HP-regeneration ATTRIBUTE, not a heal: PRTS 备注
  //   "生命恢复的提供方式为增加目标的'生命回复速度（百分比）'属性（直接加算），不受治疗加成和禁疗影响";
  //   units.js `hpRegen = hpRecoveryPerSec + ΣhpRegen + ΣhpRegenRatio × maxHp`) while ANY of her skills runs. The
  //   shape is 予愿安洁莉娜's 天穹间的舞步 (same file: `battle.every(0.2, …)` + a short buff re-applied), with the
  //   condition "技能期间" = `unit.skill.active` (her own skill) instead of the allies' 起飞 flag.
  //   T2 博士给的零花钱 — a MOD-authored talent (not in PRTS): "整备期结束时，使【远见】盟约叠加3层，整备区同样生效",
  //   bb `{ layer: 3, bond_id: 'visiShip' }`. It runs at EVERY 整备期 end / prep end, once per prep end, and it also
  //   applies while she sits in the 整备区 (hand / bench) — that "整备区同样生效" is what decides its carrier: a GARRISON
  //   (data/garrisons.json `garrison_amiya3_allowance_a`, owners = both her chessIds), because the prep-end dispatcher
  //   (`server/match/effectsMeta.js` `_garrisons`, hook `onPrepEnd`) walks board pieces AND hand pieces; a board-only
  //   hook could not fire for a benched 阿米娅. The record deliberately carries NO `conditionkey`
  //   `character_target_inboard` (the one that keeps every other SERVER_PREP_FIN 特质 off hand pieces), so the trait
  //   fires from the 整备区 too. Its effectKey is the existing `SERVER_ADD_BOND` family: the handler already reads the
  //   blackboard (`bb.count` = layers, `bbStr.bond` = the bond) and the text's "（无需激活盟约）"-free wording makes it
  //   add the layers without requiring 远见 to be active (`requireActiveOf`: only "已激活" / "激活且" sets true).
  //   S1 哀恸共情 (skchr_amiya3_1, MANUAL, 攻击回复 spCost 70, initSp 30 / 40 at M3, duration 50 s, its OWN range
  //   x-1 = the record's `rangeGrid` + `trigger.customRangeGrid`, so the data resolves SKILL_RANGE — "仅在技能范围内
  //   存在敌人（无视其不可选中）时释放技能"): 攻击速度 +attack_speed (a skill mod), and "每次攻击时额外治疗自身周围一定
  //   范围内所有我方相当于攻击力 heal_scale 的生命". PRTS 备注 pins the timing — "于普通攻击命中计算伤害时（先于特性）
  //   触发额外治疗，作用范围为周围十二格（碰撞判定）": the extra heal rides on the attack's DAMAGE (the engine's `damaged`
  //   event of her own attack, registered by the KIT's `install` with a priority ABOVE the trait's own `installIncantation`
  //   handler, which professions.js installs at the default priority 0 — Battle.on inserts by descending priority, so this
  //   one runs first, and a SkillSpec `install` is NOT a contract the engine calls: Battle._setupUnit calls the kit /
  //   talent / trait ones only), and its area is the 12 surrounding tiles: the 8 neighbours (3×3 minus her own tile — the
  //   same body as the 8-cell `x-4` / `SURROUND8` block) PLUS the 4 tiles two steps away along the axes, i.e. the 12
  //   cells of her own `x-1` 13-tile net other than the CENTRE. Her own tile is therefore NOT healed by this clause (that
  //   is what the 备注's own count says: 13 − 1 = 12, "周围十二格"). The engine's `injuredAlliesInKeys` gives the
  //   碰撞判定 a lone dodge roll cannot satisfy; the trait's own heal is untouched and still runs right after (with a
  //   pre-emptive look at it in the test, the two amounts are ATK × heal_scale and damage × trait scale).
  //   S2 慈悲愿景 (skchr_amiya3_2, MANUAL, "整场战斗中该技能只能释放一次" with bb `skill_max_trigger_time` 1, spCost 25 /
  //   20 at M3, initSp 10, duration 32 s, no own range so the data keeps DEFAULT): on the CAST, "立刻对攻击范围内所有敌人
  //   进行一次攻击力 atk_scale 的攻击并使目标在 debuff.duration 秒内攻击速度 -60、移动速度 -60%，该次攻击每击中一个敌人
  //   获得攻击力 +atk（最多叠加 max_stack_cnt 次），接下来的伤害类型变为真实且可以同时攻击2名敌人". The burst resolves
  //   INSIDE `onStart` (one damage instance per enemy of her attack range, arts type + `isAttack` so the trait heal still
  //   answers it, the debuff applied per victim), the stacks follow the number of DISTINCT enemies it hit
  //   (min(max_stack_cnt, hits) × atk, a stacking atkPct buff + `mem.amiya3S2Stacks`), and "接下来的" is the rest of the
  //   skill: an `attack` override `{ dmgType: 'true', maxTargets: 2 }`. `once` is enforced on the SkillRuntime INSTANCE
  //   (`unit.skill.activate`, which is also the path the trigger rules call): the skill is not skipped by "no targetable
  //   enemy in range" — PRTS 备注 "攻击范围内不存在可选目标时，技能可照常开启" — it just opens with an empty burst.
  //
  //   [ASSUMED] the 12 surrounding tiles (PRTS gives the count "周围十二格" and the 备注/range template x-1 — 13 tiles —
  //   but no tile list): read as the x-1 net minus her own tile, the standard "周围十二格" of the game.
  //   [ASSUMED] "该次攻击每击中一个敌人" = the number of DISTINCT enemies the immediate attack hit (the skill then hits
  //   2 at a time). The debuff is authored as TWO mods on one buff (`aspd` and `moveMul = 1 + debuff.move_speed`, the
  //   kit rule for a move-speed fraction: tier3 海霓 / tier4 缪尔赛思…) rather than a catalogue status, because the
  //   catalogue's single-key statuses carry one of the two (停顿 0.2 moveMul, `aspdDown` the ASPD alone).
  //   Not in this kit: the module trait override (uniequip_002_amiya3: 特性 60 % and 诚挚期许 +9 %/+3 % at module 2,
  //   +10 %/+3.5 % at module 3 live in the chess record's trait / talent bb, which the kit reads through `traitBb` /
  //   `talentBb` — no separate code path).
  char_1037_amiya3: (bb, chess, def) => {
    const d = defOf(chess, def);
    const t0 = talentBb(d, 0);
    const sel = selectedId(chess, d);
    const S1 = 'skchr_amiya3_1', S2 = 'skchr_amiya3_2';
    const isS2 = sel === S2;
    const maxHp = num(t0.max_hp);
    const regen = num(t0.hp_recovery_per_sec_by_max_hp_ratio);
    /**
     * 周围十二格 ("around her, 12 tiles"): the 8 neighbours — the body of the official `x-4` 3×3-minus-centre grid —
     * plus the 4 cells two steps away along the axes, i.e. every cell of her own `x-1` 13-tile net except the centre.
     */
    const SURROUND12 = Object.freeze([
      [1, -1], [1, 0], [1, 1], [2, 0], [0, -2], [0, -1], [0, 1], [0, 2], [-1, -1], [-1, 0], [-1, 1], [-2, 0],
    ]);
    /**
     * S1's "每次攻击时额外治疗…": the extra heal of ONE of her attacks, `heal_scale` × ATK, on every ALLY standing on
     * the 12 surrounding tiles (her OWN tile is the centre of that net and therefore not one of them — see SURROUND12).
     * Runs from the `damaged` event of her own attack with a priority above the trait's `installIncantation` — the PRTS
     * 备注's "先于特性". Guards mirror the trait's own (a real HP-hitting instance of hers; the 咒愈师 trait's own heal
     * is tagged 'incantation' and never re-enters).
     */
    const extraHeal = (battle, unit, scale) => (ctx) => {
      if (ctx.source !== unit || !alive(unit) || !unit.skill?.active || !ctx.dmg?.isAttack || !(ctx.amount > 0)) return;
      if (!ctx.target || ctx.target.side !== 'enemy') return;
      if (ctx.type === 'element' || ctx.type === 'elemental') return;
      if (ctx.dmg && Array.isArray(ctx.dmg.tags) && ctx.dmg.tags.includes('incantation')) return;
      if (!(scale > 0)) return;
      const keys = new Set(gridKeys(SURROUND12, unit));
      for (const a of battle.allyUnits) {
        if (!a.alive || !a.deployed || a.hidden || a.kind === 'device') continue;
        if (!keys.has(a.tileR * COLS + a.tileC)) continue;
        if (a !== unit && (a.s.flags.noHeal || a.profile?.noHeal)) continue;
        battle.heal(unit, a, unit.s.atk * scale, { tags: ['incantation', 'amiya3_s1'] });
      }
    };
    /**
     * S2's "该次攻击每击中一个敌人获得攻击力+atk（最多叠加 max_stack_cnt 次）": one stack per enemy the immediate attack
     * hit, capped. The buff itself carries the ATK bonus (atkPct, additive); `mem.amiya3S2Stacks` is the observable
     * count the tests read. Applied AFTER the burst resolved, so "先按范围内敌人数量提升攻击力，后造成…伤害" is the
     * opposite reading of the PRTS 备注 and deliberately NOT taken: the burst's own numbers are atk_scale × the ATK she
     * had when it started.
     */
    const addStacks = (battle, unit, n, atkPer, cap) => {
      if (!(n > 0) || !(atkPer > 0)) return;
      const want = Math.min(cap, Math.max(0, unit.mem.amiya3S2Stacks ?? 0) + n);
      if (want <= (unit.mem.amiya3S2Stacks ?? 0)) return;
      unit.mem.amiya3S2Stacks = want;
      battle.addBuff(unit, { key: 'talent:amiya3_s2_atk', refresh: 'stack', stacks: want, maxStacks: cap, mods: { atkPct: atkPer }, visible: true });
    };
    /** S2's immediate attack: every targetable enemy of her CURRENT attack range takes `atk_scale` × ATK, debuffed. */
    const burst = (battle, unit, s) => {
      const keys = new Set(unit.rangeKeys || []);
      const atkScale = num(s.bb.atk_scale, 1);
      const dur = num(s.bb['amiya3_s_2[debuff].duration']);
      const aspdDown = num(s.bb['amiya3_s_2[debuff].attack_speed']);
      const moveMul = Math.max(0, 1 + num(s.bb['amiya3_s_2[debuff].move_speed'], 0));
      const atkPer = num(s.bb.atk, 0);
      const cap = Math.max(1, Math.floor(num(s.bb.max_stack_cnt, 5)));
      const list = battle.enemiesInKeys([...keys], unit, { canHitFly: true });
      // PRTS: apply the capped target-count ATK bonus before the opening burst.
      addStacks(battle, unit, list.length, atkPer, cap);
      let hits = 0;
      for (const e of list) {
        if (!e.alive) continue;
        battle.dealDamage(unit, e, { amount: unit.s.atk * atkScale, type: 'arts', isAttack: true, isSkill: true, tags: ['skill', 'amiya3Burst'] });
        hits++;
        if (e.alive && dur > 0) {
          battle.addBuff(e, { key: 'amiya3:mercy', duration: dur, refresh: 'replace', source: unit, visible: true, status: 'amiya3Mercy', mods: { aspd: aspdDown, moveMul } });
        }
      }
      fx(battle, 'volley', unit, { skill: 'amiya3_2', n: hits, dmgType: 'arts' });
      return hits;
    };
    const s1 = (s) => ({
      kind: 'duration',
      mods: { aspd: num(s.bb.attack_speed) },
    });
    const s2 = (s) => ({
      kind: 'duration',
      attack: { dmgType: 'true', maxTargets: 2 },
      onStart({ battle, unit }) {
        burst(battle, unit, s);
      },
      onEnd({ battle, unit }) { battle.removeBuff(unit, 'talent:amiya3_s2_atk'); },
    });
    // S1's heal_scale of the SELECTED skill (the kit's `bb`); each spec is built from its own record below.
    const selS1 = skillData(chess, d, bb, S1);
    // `skill` is the spec the kit was built FOR (the SELECTED loadout; an unloaded chess passes the record's default
    // `bb`), and `skills` lists BOTH selectable skills — so every selection resolves through the map, whichever skill a
    // given record calls its default (amiya3_a and _b both default to S1, but the pair is authored together here).
    const build = { [S1]: (s) => s1(s), [S2]: (s) => s2(s) };
    const selNow = selectedId(chess, d) ?? S1;
    return {
      skill: build[selNow] ? build[selNow](skillData(chess, d, bb, selNow)) : null,
      skills: altSkills(chess, d, bb, build),
      talents: [
        { install(battle, unit) { // T1 诚挚期许: the two auras (see the block comment)
          if (!(maxHp > 0) && !(regen > 0)) return;
          battle.every(0.2, () => {
            if (!alive(unit)) return;
            const mods = {};
            if (maxHp > 0) mods.hpPct = maxHp;
            if (regen > 0 && unit.skill?.active) mods.hpRegenRatio = regen;
            if (!Object.keys(mods).length) return;
            for (const a of battle.allyUnits) {
              if (!a.alive || !a.deployed || a.hidden || a.kind === 'device') continue;
              if (!battle.allySelectable(a, unit)) continue; // never a 孤立 unit (炎佑)
              battle.addBuff(a, { key: 'talent:amiya3_hope', duration: 0.5, refresh: 'replace', mods, source: unit, tags: ['aura'] });
            }
          }, { owner: unit });
        } },
      ],
      install(battle, unit) {
        // S1's extra heal rides on her ORDINARY ATTACK's damage (PRTS 备注 "于普通攻击命中计算伤害时…触发"), so it is a
        // `damaged` hook of the KIT's own install (a SkillSpec `install` is not a contract the engine calls — only the
        // kit / talent / trait ones are: Battle._setupUnit), gated on the SELECTED skill and registered with a priority
        // ABOVE the 咒愈师 trait's own handler (professions.js installIncantation, default priority 0 — Battle.on keeps
        // the list in descending priority), which is the 备注's "先于特性".
        if (sel === S1) battle.on('damaged', extraHeal(battle, unit, num(selS1.bb.heal_scale, 0)), { owner: unit, priority: 10 });
        // S2 "整场战斗中该技能只能释放一次" (bb skill_max_trigger_time = 1): the SkillRuntime INSTANCE decides, because the
        // cast PATH is not (a trigger rule, the operation cooldown, a manual cast — all of them end in `activate()`).
        if (!isS2 || !unit.skill) return;
        const rawActivate = unit.skill.activate.bind(unit.skill);
        unit.skill.activate = (reason = 'manual', opts) => {
          if (unit.mem.amiya3S2Used) return false;
          const ok = rawActivate(reason, opts);
          if (ok) unit.mem.amiya3S2Used = true;
          return ok;
        };
      },
    };
  },
};
