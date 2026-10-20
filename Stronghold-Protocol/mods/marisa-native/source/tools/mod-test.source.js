#!/usr/bin/env node
// Single-battle testing through the real sim, replayed by the existing renderer. No room or match is modified.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { roomProfile } from '../server/mods.js';
import { DataSource } from '../server/sim/simdata.js';
import { buildBattleSpec, createBattleFromSpec } from '../server/sim/spec.js';
import { GameData } from '../server/match/gamedata.js';
import { setupMatchWaves, buildNormalWave } from '../server/match/waves.js';
import { createRng } from '../server/sim/rng.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const HELP = `单场 MOD 测试（在工程目录的 PowerShell 中运行）
node tools/mod-test.mjs --scenario kun --operator 乌尔比安 --skill 3 --cast-at 5 --fly-at 10
node tools/mod-test.mjs --scenario skill --operator 予愿安洁莉娜 --skill 3 --cast-at 2
node tools/mod-test.mjs --scenario rhode --layers 100 --injure-at 2
node tools/mod-test.mjs --scenario wave --round 8 --difficulty HARD --operator 结城理 --skill 3
node tools/mod-test.mjs --scenario kun-wave --round 2 --difficulty HARD --operator 乌尔比安 --skill 1 --seed 27 --seconds 40
node tools/mod-test.mjs --list operators

--scenario kun|skill|rhode|wave|kun-wave  --operator 名称或棋子ID  --elite
--stage 地图ID（默认 act1autochess_m01） --skill 1|2|3
--units 名称或ID,名称或ID（仅 skill/wave，可带 * 表示精锐）
--seconds 1..180（默认60） --seed 数字 --cast-at 游戏秒数（给技力并尝试开技能）
--fly-at 游戏秒数 --ground-at 游戏秒数（训练靶；wave 和 kun-wave 场景不添加）
--injure-at 游戏秒数（令主干员损失一半当前生命） --layers 0..10000
--round 1..14 --difficulty FUNNY|NORMAL|HARD|ABYSS --vanilla（对照原版）
--list operators|stages|waves --port 3000（只改变回放链接端口）

先启动 npm start，再生成测试，打开输出的链接。每次命令覆盖上一次本地测试回放。
暂停、拖动进度条、0.25倍慢放均在回放右上角。它是实际单场战斗记录，不会修改线上房间。`;

export function parseTestArgs(args) {
  const flags = new Set(['elite', 'vanilla', 'help']);
  const values = new Set(['scenario', 'operator', 'stage', 'skill', 'units', 'seconds', 'seed', 'cast-at', 'fly-at', 'ground-at', 'injure-at', 'layers', 'round', 'difficulty', 'list', 'port']);
  const out = {};
  for (let i = 0; i < args.length; i++) {
    const key = args[i].replace(/^--/, '');
    if (!args[i].startsWith('--') || (!flags.has(key) && !values.has(key))) throw new Error(`未知参数：${args[i]}；使用 --help 查看帮助`);
    if (flags.has(key)) out[key] = true;
    else {
      if (!args[i + 1] || args[i + 1].startsWith('--')) throw new Error(`缺少 --${key} 的值`);
      out[key] = args[++i];
    }
  }
  return out;
}

function number(o, key, fallback, min, max) {
  const v = Number(o[key] ?? fallback);
  if (!Number.isFinite(v) || v < min || v > max) throw new Error(`--${key} 必须在 ${min}..${max} 范围内`);
  return v;
}

export function resolveTestChess(data, requested, elite = false) {
  const r = data.chess[requested] || Object.values(data.chess).find((c) => !c.isGolden && c.visible !== false && (c.name === requested || c.charId === requested));
  if (!r) throw new Error(`找不到干员：${requested}；用 --list operators 查询当前版本名称/ID`);
  const id = elite && !r.isGolden ? r.goldenId : r.chessId;
  if (!data.chess[id]) throw new Error(`没有精锐记录：${requested}`);
  return data.chess[id];
}

export function createTestRecording(o = {}) {
  const profile = roomProfile(o.vanilla ? [] : ['marisa']);
  const data = profile.data, scenario = o.scenario || 'kun';
  if (!['kun', 'skill', 'rhode', 'wave', 'kun-wave'].includes(scenario)) throw new Error('场景应为 kun、skill、rhode、wave 或 kun-wave');
  if (o.vanilla && ['kun', 'rhode', 'kun-wave'].includes(scenario)) throw new Error('原版没有鲲或罗德岛，请使用 skill 或 wave 场景');
  const name = o.operator || (scenario === 'rhode' ? '阿米娅' : '乌尔比安');
  const main = o.operator ? resolveTestChess(data, name, !!o.elite) : resolveTestChess(data, scenario === 'rhode' ? 'chess_char_1037_amiya3_a' : 'chess_char_5_05_a', !!o.elite);
  const skill = o.skill == null ? (main.skill?.index ?? main.skillIndex ?? 0) : number(o, 'skill', 1, 1, main.skills.length) - 1;
  if (!Number.isInteger(skill)) throw new Error('--skill 必须是整数');
  const stageId = o.stage || 'act1autochess_m01', stage = data.stages[stageId];
  if (!stage) throw new Error(`未知地图：${stageId}；使用 --list stages 查询`);
  const seed = number(o, 'seed', 1, 1, 4294967295) >>> 0;
  const seconds = number(o, 'seconds', 60, 1, 180);
  const round = number(o, 'round', 1, 1, 14);
  if (!Number.isInteger(round)) throw new Error('--round 必须是整数');
  const difficulty = o.difficulty || 'NORMAL';
  if (!['FUNNY', 'NORMAL', 'HARD', 'ABYSS'].includes(difficulty)) throw new Error('难度应为 FUNNY、NORMAL、HARD 或 ABYSS');
  const modeId = `mode_single_${difficulty.toLowerCase()}`;
  const melee = stage.deployTiles?.normal?.melee || [], ranged = stage.deployTiles?.normal?.rangedOnly || [];
  const used = new Set();
  const units = [];
  const add = (rec, tile, index = rec.skillIndex, dir = 'RIGHT') => {
    used.add(tile.join(','));
    units.push({ uid: units.length + 1, kind: 'chess', chessId: rec.chessId, skillIndex: index, row: tile[0], col: tile[1], dir });
  };
  const place = (rec, index) => {
    const tiles = rec.position === 'RANGED' ? [...ranged, ...melee] : melee;
    const sorted = [...tiles].sort((a, b) => Math.abs(a[0] - 10) - Math.abs(b[0] - 10) || a[1] - b[1]);
    const tile = sorted.find((t) => !used.has(t.join(',')));
    if (!tile) throw new Error(`地图没有可用部署格：${rec.name}`);
    add(rec, tile, index);
  };
  let bonds = {}, bandId = null;
  const layers = number(o, 'layers', 100, 0, 10000);
  if (scenario === 'kun' || scenario === 'kun-wave') {
    if (!main.bonds.includes('egirShip')) throw new Error('鲲场景的主干员必须拥有阿戈尔盟约');
    const keys = new Set(melee.map((t) => t.join(',')));
    const first = [...melee].sort((a, b) => Math.abs(a[0] - 12) - Math.abs(b[0] - 12) || a[1] - b[1]).find(([r, c]) => [0, 1, 2, 3].every((i) => keys.has(`${r},${c + i}`)));
    if (!first) throw new Error('此地图没有连续四个地面部署格，鲲场景建议使用 act1autochess_m01');
    const chain = [main, ...['chess_char_2_07_a', 'chess_char_3_09_a', 'chess_char_1_08_a'].map((id) => data.chess[id])];
    chain.forEach((rec, i) => {
      if (scenario === 'kun-wave') add(rec, [first[0], first[1] + 4 - i], i === 0 ? skill : rec.skillIndex, 'LEFT');
      else add(rec, [first[0], first[1] + i], i === 0 ? skill : rec.skillIndex);
    });
    bonds = { egirShip: { active: true, count: 3, tier: 1, layers: 0 } }; bandId = 'band_kun';
  } else {
    place(main, skill);
    const others = o.units ? o.units.split(',') : scenario === 'rhode' ? ['chess_char_1052_kalts2_a', 'chess_char_4_26_a'] : [];
    if (others.length > 11) throw new Error('--units 最多添加 11 名干员');
    for (const raw of others) place(resolveTestChess(data, raw.replace(/\*$/, ''), raw.endsWith('*')));
    if (scenario === 'rhode') bonds = { rhodeShip: { active: true, count: 3, tier: 2, layers }, miraShip: { active: true, count: 2, tier: 1, layers } };
  }
  let wave = { spawns: [], routes: [], overrides: {} };
  if (scenario === 'wave' || scenario === 'kun-wave') {
    const gd = new GameData(data, modeId), rng = createRng(seed);
    const setup = setupMatchWaves(gd, rng);
    wave = buildNormalWave(gd, createRng(seed + round), setup.factions, round);
    if (!wave.spawns?.length) throw new Error('该回合不是常规波次；请换常规回合，首领/联防回归可用文档内测试命令');
  }
  const spec = buildBattleSpec({ kind: 'normal', fieldId: 'mod-test', battleId: 'mod-test', mods: profile.mods, contentHash: profile.contentHash,
    modeId, round, stageId, seed, timeLimit: seconds, waveId: wave.templateId, spawns: wave.spawns, routes: wave.routes, enemyOverrides: wave.overrides,
    flags: { startOpCooldown: 0, dpInit: 99, dpMax: 99, layerGainsEnabled: true }, players: [{ playerId: 'test', seat: 0, side: 'L', colOffset: 0, units, bonds, bandId }] });
  const b = createBattleFromSpec(spec, new DataSource(data)); b.autoFinish = false;
  const frames = [], states = [], actions = [];
  let airHits = 0, groundHits = 0, revives = 0;
  const blockedAir = new Set(), blockedGround = new Set();
  const blockedAirWhileAirborne = new Set(), blockedGroundWhileAirborne = new Set();
  const waveComposition = { air: 0, ground: 0 };
  for (const spawn of wave.spawns) {
    const isAir = !!(data.enemies[spawn.enemyKey]?.isFlyEnemy || data.enemies[spawn.enemyKey]?.stats?.motion === 'FLY');
    waveComposition[isAir ? 'air' : 'ground'] += spawn.count;
  }
  b.on('damaged', (ctx) => {
    if (ctx.source?.uid !== 1 || ctx.target?.side !== 'enemy' || !(ctx.amount > 0)) return;
    if (ctx.target.motion === 'FLY') airHits++; else groundHits++;
  });
  b.on('deploy', (ctx) => { if (!ctx.initial && !ctx.move && ctx.unit?.kind === 'op') revives++; });
  const at = (key, fallback) => o[key] == null && fallback == null ? null : number(o, key, fallback, 0, seconds);
  const pending = [
    ['cast', at('cast-at', null)], ['injure', at('injure-at', null)],
    ['fly', ['wave', 'kun-wave'].includes(scenario) ? null : at('fly-at', 2)], ['ground', ['wave', 'kun-wave'].includes(scenario) ? null : at('ground-at', 2)],
  ].filter((a) => a[1] != null).map(([type, t]) => ({ type, t, done: false }));
  let field = null, ticks = 0, lastState = '';
  while (!b.finished) {
    b.step(); ticks++;
    const u = b.allyUnits.find((x) => x.uid === 1);
    if (!u?.deployed) throw new Error('主干员未能部署，请检查地图部署格');
    if (!field) field = b.fieldMeta();
    for (const enemy of u.blocking) {
      if (!enemy.alive) continue;
      const flying = enemy.motion === 'FLY';
      (flying ? blockedAir : blockedGround).add(enemy.id);
      if (u.s.flags.liftoff) (flying ? blockedAirWhileAirborne : blockedGroundWhileAirborne).add(enemy.id);
    }
    for (const a of pending) {
      if (a.done || b.time + 1e-9 < a.t) continue;
      a.done = true;
      if (a.type === 'cast') { u.skill.gainSp(999); actions.push({ t: b.time, action: 'cast', activated: u.skill.activate('mod-test') }); }
      else if (a.type === 'injure') { b.loseHp(u, u.hp / 2); actions.push({ t: b.time, action: 'injure' }); }
      else {
        const flying = a.type === 'fly';
        const rec = Object.values(data.enemies).find((e) => e.rank !== 'BOSS' && !!(e.isFlyEnemy || e.stats?.motion === 'FLY') === flying);
        if (!rec) throw new Error('缺少训练目标数据');
        const pos = [u.tileR, u.tileC + 0.25];
        b.spawnEnemy(rec.key, { pos, route: { motion: flying ? 'FLY' : 'WALK', start: pos, end: [u.tileR, 2], checkpoints: [] }, mods: { hpMul: 10000, speedMul: 0 } });
        actions.push({ t: b.time, action: a.type, enemy: rec.key });
      }
    }
    const state = `${u.alive}:${!!u.s.flags.liftoff}:${!!u.profile.canHitFly}:${u.tileR},${u.tileC}`;
    if (state !== lastState) { states.push({ t: Math.round(b.time * 1000) / 1000, alive: u.alive, liftoff: !!u.s.flags.liftoff, canHitFly: !!u.profile.canHitFly, tile: [u.tileR, u.tileC] }); lastState = state; }
    if (ticks % 3 === 0) frames.push({ snap: b.snapshot(), ev: b.drainEvents() });
  }
  const tail = { snap: b.snapshot(), ev: b.drainEvents() };
  if (frames.at(-1)?.snap.t === tail.snap.t) frames.at(-1).ev.push(...tail.ev); else frames.push(tail);
  if (b.errors.length) throw new Error(`战斗错误：${JSON.stringify(b.errors)}`);
  const result = b.result();
  const report = { scenario, mods: profile.mods, stageId, modeId, round, seed, operator: main.name, chessId: main.chessId, skill: skill + 1, states, actions,
    errors: b.errors.length, killed: result.killed, waveComposition, airHits, groundHits,
    blockedAir: blockedAir.size, blockedGround: blockedGround.size,
    blockedAirWhileAirborne: blockedAirWhileAirborne.size, blockedGroundWhileAirborne: blockedGroundWhileAirborne.size, revives,
    allies: b.allyUnits.map((u) => ({ name: u.name, uid: u.uid, alive: u.alive, liftoff: !!u.s.flags.liftoff, canHitFly: !!u.profile.canHitFly, damage: u.stats.dmg })) };
  return { recording: { version: 1, name: 'mod-test', title: `${main.name} S${skill + 1} · ${scenario}`, kind: 'normal', stageId, modeId, round, field, frames, duration: b.time, result: { errors: 0, killed: result.killed }, report }, report };
}

function main(args) {
  const o = parseTestArgs(args);
  if (o.help) { console.log(HELP); return; }
  if (o.list) {
    const data = roomProfile(o.vanilla ? [] : ['marisa']).data;
    if (o.list === 'operators') for (const c of Object.values(data.chess).filter((c) => !c.isGolden && c.visible !== false)) console.log(`${c.chessId}\t${c.name}\t${c.skills?.map((s, i) => `S${i + 1}:${s.name}`).join(' / ')}`);
    else if (o.list === 'stages') for (const [id, s] of Object.entries(data.stages)) console.log(`${id}\t${s.name}`);
    else if (o.list === 'waves') for (const [id, w] of Object.entries(data.waves)) console.log(`${id}\t${w.kind}\t${w.usedBy?.map((u) => `${u.modeId}:R${u.round}`).join(',')}`);
    else throw new Error('--list 应为 operators、stages 或 waves');
    return;
  }
  const { recording, report } = createTestRecording(o);
  const dir = path.join(ROOT, 'public', 'dev', 'recordings'); fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'mod-test.json'), JSON.stringify(recording));
  fs.writeFileSync(path.join(dir, 'mod-test-report.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  const port = number(o, 'port', 3000, 1, 65535);
  console.log(`回放：http://localhost:${port}/dev/render-demo.html?scene=mod-test&mods=${o.vanilla ? 'vanilla' : 'marisa'}&board=2d`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(process.argv.slice(2)); } catch (e) { console.error(`单场测试失败：${e.message}`); process.exitCode = 1; }
}
