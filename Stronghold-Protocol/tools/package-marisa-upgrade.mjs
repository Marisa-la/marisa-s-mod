#!/usr/bin/env node
// One cumulative 0.3.0 -> 0.3.1 overlay, checked against the published full package and both hotfix revisions.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { plan, listTree, playerPackageJson, zipFolder, scanFiles, importProblems, PLAYER_MARKDOWN, rewritePlayerDoc } from './package.mjs';
import { productionModules } from './package-marisa.mjs';
import { readZip, diffBases, manifestText, updateText } from './package-update.mjs';
import { digestFile, inManifest, pathProblem, applyPendingUpdate, checkInstall, listedArtFiles } from '../server/update.js';
import { writePackIndex } from './packs.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const FOLDER = 'Stronghold-Protocol';
const NAME = 'Stronghold-Protocol-0.3.1-marisa-update.zip';
const FULL = 'Stronghold-Protocol-0.3.0-marisa-full.zip';
const FULL_SHA = 'ef016d40ef4df0fd9af7c8d21ddc1f7ff370e900bf8ec1d5f1457cffbd127c4b';
const HOTFIX_SHA = '855d0afd2c0993c8275be7b1c7ec3dbf2a4d882ba2d2788babefeaaf34fb9185';
const OLD_SHA = '44058c31e6d0dfadc255523485d0fb5f675bf5f3f2a3a254a574ef0dca69e508';
const json = value => JSON.stringify(value, null, 2) + '\n';
const put = (root, rel, body) => {
  if (pathProblem(rel)) throw Error('Unsafe package path: ' + rel);
  fs.mkdirSync(path.dirname(path.join(root, rel)), { recursive: true });
  fs.writeFileSync(path.join(root, rel), body);
};
const unzip = (zip, root, visit = () => {}) => readZip(zip, (name, body) => {
  assert.ok(name.startsWith(FOLDER + '/'), name);
  const rel = name.slice(FOLDER.length + 1);
  put(root, rel, body); visit(rel, digestFile(path.join(root, rel)));
});
const run = (root, args) => {
  const r = spawnSync(process.execPath, args, { cwd: root, encoding: 'utf8', timeout: 180000,
    maxBuffer: 8 * 1024 * 1024, env: { ...process.env, SP_PLUGIN_SCRIPTS: 'sandbox' } });
  if (r.error || r.status !== 0) throw Error('Installed verification failed: ' + args.join(' ') + '\n' + (r.error?.message || '') + r.stdout + r.stderr);
  return r.stdout;
};

function readme(bases) {
  return `# 魔理沙 MOD 0.3.1 累计更新包 · 2026-10-19

将已发布的 Marisa 0.3.0 升级到 0.3.1，含上游适配、罗德岛及结城理最新修复；这是增量包，不能独立运行。

## 适用安装

原包必须是 ${FULL}，SHA-256：${FULL_SHA}。可直接覆盖未装补丁、已装 2026-10-16 旧修补1、或已装 2026-10-17 累计修补1的安装。三种基准均独立覆盖验证。
基准完整包：https://github.com/Ruyl114514/marisa-s-mod/releases/tag/marisa-0.3.0-20261016
不适用于干净原版、0.2.x、兼容替换包或自行混装的目录。

## 安装

1. 关闭游戏服务并备份原安装目录。
2. 将包内 Stronghold-Protocol/ 的内容合并覆盖到原同名目录，该目录内应直接有 package.json、server/、plugins/。
3. 运行 scripts/start-marisa.cmd；启动时按 UPDATE.json 校验完整安装并清理字节匹配的旧发布文件。
4. 所有玩家 Ctrl+F5 强刷浏览器，重新建房并开新对局。无需重新安装开发依赖或下载原有素材。

## 更新内容

- 适配官方 0.3.1，保留 MOD 干员、罗德岛、鲲、驻防、皮肤、自选与管理器；保留官方 48 项数据变更。
- 四名不同罗德岛干员向已激活主盟约提供有效人数；图示四名罗德岛加三名阿戈尔应显示阿戈尔 7/9、第二档，不会让捐赠者获得阿戈尔身份。
- 结城理默认二技能不再误把 0.5 秒切换时间当作替身时长而提前播放退场；原皮/P3R 正背面动画已检查。
- 保留治疗溢出伤害来源修复、攻击加成上限与同帧到期修复，兼容 0.3.1 皮肤与音效数据。
- 保留局域网监听修复。客机 2–3 秒进入战斗延迟尚无跨机结论；不声明全量 CI 已全绿。

本包只含与至少一种基准不同的运行文件、依赖、必要新增素材和清单，不包含未变化素材或整套开发环境。
MANIFEST.json 校验更新后运行文件；UPDATE.json 记录增量与可删除旧文件；MOD-UPGRADE.json 记录精确基准。
原作者说明、许可与版权声明随包保留；仅限非商业同人学习及个人使用。

基准：
${bases.map(b => `- ${b.state}: ${b.sha256}`).join('\n')}
`;
}

/** Run the two reported fixes and an HTTP/WebSocket room smoke test from an extracted installation. */
export function verifyInstalledUpgrade(installed) {
  const source = `
    import assert from 'node:assert/strict';
    import fs from 'node:fs';
    import path from 'node:path';
    import {createPluginRegistry} from './server/plugins/registry.js';
    import {buildContentSet} from './server/plugins/contentSet.js';
    import {GameData} from './server/match/gamedata.js';
    import {diyGameData} from './server/match/player/diy.js';
    import {computeBonds,bondSnapshot} from './server/match/bondsMeta.js';
    import {DataSource} from './server/sim/simdata.js';
    import {createSDK} from './shared/plugins/sdk.js';
    import {importScript} from './shared/plugins/scriptLoad.js';
    import {makeBattle} from './test/helpers/battleHarness.js';
    import {startServer} from './server/index.js';
    import {TestClient} from ${JSON.stringify(pathToFileURL(path.join(ROOT, 'test/helpers/wsClient.js')).href)};
    const root=process.cwd();
    const registry=createPluginRegistry({publicDir:path.join(root,'public'),dataDir:path.join(root,'data'),packsDir:path.join(root,'packs'),pluginsDir:path.join(root,'plugins')},{scriptMode:'sandbox',scriptHost:'127.0.0.1'});
    const set=buildContentSet({registry,ids:['marisa']}); assert.deepEqual(set.problems,[]);
    const slot='chess_char_6_diy1_a',record={...set.data.chess[slot],charId:'char_4179_monstr',bonds:set.data.backups.diy.operators.char_4179_monstr.bonds};
    const gd=diyGameData(new GameData(set.data,'mode_multi_normal'),new Map([[slot,record]]));
    const ids=['chess_x_marisa_amiya3_a','chess_x_marisa_kalts2_a','chess_char_4_26_a',slot,'chess_char_5_05_a','chess_char_2_07_a','chess_char_5_13_a'];
    const state={board:new Map(ids.map((id,i)=>[String(i),{uid:i+1,id,kind:'chess',items:[]}])),hand:[],layers:{}};
    const bonds=computeBonds(gd,state); assert.equal(bonds.egirShip.count,7);assert.equal(bondSnapshot(bonds).egirShip.count,7);
    const manifest=JSON.parse(fs.readFileSync('plugins/marisa/plugin.json'));
    const kit=await importScript(fs.readFileSync('plugins/marisa/sim/index.js','utf8'));kit.default(createSDK(manifest));
    const h=makeBattle({autoFinish:false,data:new DataSource(set.data,null),units:[{uid:1,chessId:'chess_x_marisa_makoto_a',row:10,col:4,skillIndex:1}]});
    h.step();const u=h.unit(1);u.skill.gainSp(999);assert.equal(u.skill.activate('test'),true);h.step();
    const form=h.events.find(e=>e[0]==='fx'&&e[4]?.id===u.id&&e[4]?.form==='doll2');assert.ok(form);assert.ok(form[4].dur>20);assert.deepEqual(h.b.errors,[]);
    const server=await startServer({host:'127.0.0.1',port:0,quiet:true,studio:false,assetIndex:false});const clients=[];
    try{
      assert.equal((await (await fetch(server.url+'/healthz')).json()).ok,true);
      const host=await TestClient.connect(server.url.replace('http:','ws:')+'/ws');clients.push(host);await host.hello('Host');
      assert.equal((await host.request({t:'room.create',mode:'coop',difficulty:'NORMAL'})).t,'ok');
      const room=await host.waitFor('room.state',s=>!!s.code);
      const guest=await TestClient.connect(server.url.replace('http:','ws:')+'/ws');clients.push(guest);await guest.hello('Guest');
      assert.equal((await guest.request({t:'room.join',code:room.code})).t,'ok');
      assert.equal((await host.request({t:'room.setPlugins',plugins:[{id:'marisa'}]},20000)).t,'ok');
      await guest.waitFor('room.state',s=>s.content?.execution==='sandbox',20000);
      console.log(JSON.stringify({rhodesCount:7,rhodesTier:bonds.egirShip.tier,makotoFormLifetime:form[4].dur,http:true,webSocket:true,guestRoomJoin:true,execution:'sandbox'}));
    }finally{await Promise.all(clients.map(c=>c.terminate()));await server.close();}
  `;
  return JSON.parse(run(installed, ['--input-type=module', '-e', source]));
}

export async function packageMarisaUpgrade(root = ROOT) {
  const dist = path.join(root, '.cache/dist'), zip = path.join(dist, NAME);
  if (fs.existsSync(zip)) throw Error('Generated update already exists: ' + zip);
  const full = path.join(dist, FULL), hotfix = path.join(dist, 'Stronghold-Protocol-0.3.0-marisa-hotfix1.zip');
  const old = path.join(root, '.cache/hotfix-cumulative/previous-hotfix1.zip');
  const bases = [
    { state: 'full', name: FULL, file: full, expected: FULL_SHA },
    { state: 'old-hotfix1', name: 'hotfix1-20261016', file: old, expected: OLD_SHA },
    { state: 'cumulative-hotfix1', name: 'hotfix1-20261017', file: hotfix, expected: HOTFIX_SHA },
  ];
  for (const b of bases) { Object.assign(b, digestFile(b.file)); assert.equal(b.sha256, b.expected, b.state); }
  fs.mkdirSync(path.join(root, '.cache/upgrade-release'), { recursive: true });
  const work = fs.mkdtempSync(path.join(root, '.cache/upgrade-release/run-'));
  const target = path.join(work, 'target', FOLDER), patchParent = path.join(work, 'patch'), patch = path.join(patchParent, FOLDER);
  const tracked = spawnSync('git', ['ls-files', '-z', '--cached', '--others', '--exclude-standard'], { cwd: root, maxBuffer: 64 * 1024 * 1024 });
  assert.equal(tracked.status, 0);
  const p = plan(root, { paths: tracked.stdout.toString().split('\0').filter(Boolean), allowDirty: true,
    scan: false, measure: false, jpVoice: true, optionalVoice: true });
  assert.equal(p.version, '0.3.1'); assert.deepEqual(p.problems, []);
  const extras = ['scripts/start-marisa.cmd', 'tools/mod-test.mjs', 'tools/marisa-test-runtime.mjs',
    'public/dev/render-demo.html', 'public/dev/render-demo.js', 'docs/MARISA-0.3.0.md', 'docs/MARISA-0.3.1.md',
    'docs/MARISA-VALIDATION.md', 'docs/UPGRADE-0.3.1-REVIEW.md'];
  const bundle = path.join(root, 'mods/marisa-native/bundle');
  const pluginFiles = listTree(bundle, 'marisa').map(f => 'plugins/' + f);
  const files = [...new Set([...p.tracked, ...extras, ...pluginFiles, ...p.art, ...productionModules(root), ...listTree(root, 'public/vendor')])];
  console.log('Staging the exact new runtime (no full or compatibility ZIP)');
  for (const rel of files) {
    const from = rel.startsWith('plugins/marisa/') ? path.join(bundle, rel.slice(8)) : path.join(root, rel);
    put(target, rel, fs.readFileSync(from));
  }
  put(target, 'package.json', json(playerPackageJson(JSON.parse(fs.readFileSync(path.join(root, 'package.json'))), new Set(files))));
  writePackIndex(target, path.join(target, 'packs/index.json'));
  const shipped = new Set([...files, 'packs/index.json']);
  for (const rel of PLAYER_MARKDOWN) if (shipped.has(rel)) {
    put(target, rel, rewritePlayerDoc(fs.readFileSync(path.join(target, rel), 'utf8'), rel, shipped, '0.3.1'));
  }
  put(target, 'MARISA-PACKAGE.md', fs.readFileSync(path.join(root, 'docs/MARISA-0.3.1.md')));
  const publicBases = bases.map(({ state, name, size, sha256 }) => ({ state, name, size, sha256 }));
  put(target, 'MOD-PACKAGE.json', json({ format: 1, mod: 'marisa', version: '0.3.1', kind: 'cumulative-update',
    upstream: 'b3deebdae4a92642c007d217a1a4573e5d3612c5', install: 'manual-overlay-on-Marisa-0.3.0-full', bases: publicBases }));
  put(target, 'MOD-UPGRADE.json', json({ format: 1, mod: 'marisa', from: '0.3.0', to: '0.3.1', revision: '2026-10-19', bases: publicBases }));
  put(target, 'MARISA-UPDATE.md', readme(publicBases));
  const nextFiles = listTree(target, '', { junk: true });
  assert.deepEqual(importProblems(target, nextFiles), []);
  const own = nextFiles.filter(f => !f.startsWith('node_modules/') && !f.startsWith('public/vendor/') && !f.startsWith('public/assets/') && !f.startsWith('public/fonts/'));
  assert.deepEqual(scanFiles(target, own, { home: true }), []);
  // As in the upstream packager, dependency fixtures/SES path-taming regexes are not local home-path leaks.
  assert.deepEqual(scanFiles(target, nextFiles.filter(f => f.startsWith('node_modules/') || f.startsWith('public/vendor/')), { home: false }), []);
  const next = new Map(nextFiles.map(f => [f, digestFile(path.join(target, f))]));
  const manifest = new Map([...next].filter(([f]) => inManifest(f)));
  put(target, 'MANIFEST.json', manifestText({ app: '0.3.1', files: manifest }));

  console.log('Extracting and checking all three published baselines');
  for (const b of bases) { b.root = path.join(work, b.state, FOLDER); b.files = new Map(); b.version = '0.3.0'; }
  readZip(full, (name, body) => {
    assert.ok(name.startsWith(FOLDER + '/')); const rel = name.slice(FOLDER.length + 1);
    for (const b of bases) { put(b.root, rel, body); b.files.set(rel, digestFile(path.join(b.root, rel))); }
  });
  for (const b of bases.slice(1)) unzip(b.file, b.root, (rel, d) => b.files.set(rel, d));
  const diff = diffBases(next, bases, { removable: inManifest });
  for (const rel of diff.ship) {
    assert.ok(bases.some(b => JSON.stringify(b.files.get(rel)) !== JSON.stringify(next.get(rel))), rel);
    put(patch, rel, fs.readFileSync(path.join(target, rel)));
  }
  put(patch, 'MANIFEST.json', fs.readFileSync(path.join(target, 'MANIFEST.json')));
  put(patch, 'UPDATE.json', updateText({ app: '0.3.1', from: ['0.3.0'], files: new Map(diff.ship.map(f => [f, next.get(f)])), removed: diff.removed }));
  zipFolder(patchParent, zip);
  const results = [], allShipped = new Set([...diff.ship, 'MANIFEST.json', 'UPDATE.json']);
  for (const b of bases) {
    console.log('Verifying installed update:', b.state);
    unzip(zip, b.root);
    const applied = applyPendingUpdate(b.root, { log: { log() {}, warn() {}, error: console.error } });
    assert.equal(applied.state, 'applied', JSON.stringify(applied));
    const installation = checkInstall(b.root); assert.equal(installation.state, 'ok', JSON.stringify(installation));
    for (const [rel, d] of next) assert.deepEqual(digestFile(path.join(b.root, rel)), d, b.state + '/' + rel);
    for (const rel of listedArtFiles(JSON.parse(fs.readFileSync(path.join(b.root, 'data/assets.json'))))) assert.ok(fs.existsSync(path.join(b.root, rel)), rel);
    const strict = JSON.parse(run(b.root, ['tools/plugin.mjs', 'check', 'marisa', '--strict', '--json']));
    assert.equal(strict.problems, 0); assert.equal(strict.warnings, 0);
    const tests = run(b.root, ['tools/plugin.mjs', 'test', 'marisa']); assert.match(tests, /pass 23/);
    let unchanged = 0;
    for (const [rel, d] of b.files) if (!allShipped.has(rel) && !diff.removed.some(r => r.path === rel)) {
      assert.deepEqual(digestFile(path.join(b.root, rel)), d, 'Unchanged file modified: ' + rel); unchanged++;
    }
    const gameplayAndNetwork = verifyInstalledUpgrade(b.root);
    results.push({ state: b.state, installation, strict: { problems: 0, warnings: 0 }, authorTests: 23, gameplayAndNetwork, unchanged, root: b.root });
  }
  const canonical = new Map(listTree(bases[0].root, '', { junk: true }).map(f => [f, digestFile(path.join(bases[0].root, f))]));
  for (const b of bases.slice(1)) {
    const actual = new Map(listTree(b.root, '', { junk: true }).map(f => [f, digestFile(path.join(b.root, f))]));
    assert.deepEqual(actual, canonical, 'Final installations differ: ' + b.state);
  }
  for (const b of bases) assert.equal(digestFile(b.file).sha256, b.expected, 'Baseline archive changed');
  const report = { name: NAME, ...digestFile(zip), zip, work, bases: publicBases, diff, installations: results,
    identicalFinalInstallations: true, payloadFiles: allShipped.size, goldenSnapshotsChanged: false };
  const reportFile = path.join(work, 'report.json'); fs.writeFileSync(reportFile, json(report));
  fs.writeFileSync(path.join(root, '.cache/upgrade-release/latest.json'), json({ report: reportFile, zip, ...digestFile(zip) }));
  console.log(json({ name: NAME, ...digestFile(zip), payloadFiles: allShipped.size, states: results.map(r => r.state), report: reportFile }));
  return report;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await packageMarisaUpgrade();
