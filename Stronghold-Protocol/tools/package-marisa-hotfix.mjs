#!/usr/bin/env node
// One overlay zip for the already published Marisa full package; never build a new full package.
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {listTree, scanFiles, zipFolder} from './package.mjs';
import {manifestText, readZip} from './package-update.mjs';
import {digestFile, inManifest, pathProblem} from '../server/update.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FOLDER = 'Stronghold-Protocol';
const BASE_NAME = 'Stronghold-Protocol-0.3.0-marisa-full.zip';
const BASE_RELEASE = 'marisa-0.3.0-20261016';
const BASE_SHA256 = 'ef016d40ef4df0fd9af7c8d21ddc1f7ff370e900bf8ec1d5f1457cffbd127c4b';
const BASE_SIZE = 501315637;
const NAME = 'Stronghold-Protocol-0.3.0-marisa-hotfix1.zip';
const PREVIOUS_SHA256 = '44058c31e6d0dfadc255523485d0fb5f675bf5f3f2a3a254a574ef0dca69e508';
const digest = (body) => ({size: body.length, sha256: crypto.createHash('sha256').update(body).digest('hex')});
const same = (a, b) => !!a && !!b && a.size === b.size && a.sha256 === b.sha256;
const json = (value) => Buffer.from(JSON.stringify(value, null, 2) + '\n');

function write(root, rel, body) {
  if (pathProblem(rel)) throw Error('Unsafe package path: ' + rel);
  const dest = path.join(root, rel);
  fs.mkdirSync(path.dirname(dest), {recursive: true});
  fs.writeFileSync(dest, body);
}

function unzip(zip, dest, visit) {
  readZip(zip, (entry, body) => {
    if (!entry.startsWith(FOLDER + '/')) throw Error('Unexpected archive root: ' + entry);
    const rel = entry.slice(FOLDER.length + 1);
    if (pathProblem(rel)) throw Error('Unsafe archive path: ' + entry);
    write(dest, rel, body);
    visit?.(rel, body);
  });
}

function readme(files) {
  return Buffer.from(`\ufeff# 魔理沙 MOD 0.3.0 · 累计修补包（2026-10-17）

这是此前完整包的增量修补，只携带发生变化的文件、完整性清单和本说明。不能单独运行。

## 适用安装

适用于以下两种安装状态，可直接覆盖，无需先卸载或补装旧修补包：

1. [${BASE_RELEASE} 发布页](https://github.com/Ruyl114514/marisa-s-mod/releases/tag/${BASE_RELEASE}) 中的 \`${BASE_NAME}\`，尚未安装任何修补。
2. 上述完整包已经覆盖旧版 \`${NAME}\`（2026-10-16，SHA-256：\`${PREVIOUS_SHA256}\`）。

原完整包大小：${BASE_SIZE} 字节；SHA-256：\`${BASE_SHA256}\`。
其他版本、原版 0.3.0、兼容替换包或自行混装的目录不在本次修补范围内。

## 修补作用

- 修正模组启动器固定监听 127.0.0.1 导致朋友无法访问的问题，恢复原版的默认双栈监听及 IPv4 回退，保留 sandbox 模式。朋友使用主机的局域网或 VPN 地址访问；旧服务必须先停止再重启。
- 修正罗德岛溢出治疗攻击加成被百分比攻击加成再次放大的问题；上限为不含罗德岛加成的自身攻击力的 100%，技能结束后重新收紧上限。
- 恢复鲲策略原图的素材映射，沿用原完整包已包含的图片，不重复分发图片。
- 起飞标志按干员当前起飞状态显示，覆盖技能、天赋和鲲起飞，落地后消失。
- 鲲的复活保持原作者效果：达到第三次吞噬实际击倒后免费重新部署前三名被击倒的干员，最后一次击倒的来源起飞。高层阿戈尔的生命提高可能导致击倒不足；吞噬链遇到非阿戈尔成员后停止。

## 安装步骤

1. 停止正在运行的游戏服务（在服务窗口按 Ctrl+C），并备份原安装目录。
2. 解压本修补包，将包内 \`Stronghold-Protocol/\` 中的全部内容合并覆盖到原安装中同名目录；应能在该目录直接看到 \`package.json\`、\`server/\` 和 \`plugins/\`。
3. 同意覆盖同名文件，不需要删除原目录、安装开发依赖或重新下载素材。
4. 重新运行 \`scripts/start-marisa.cmd\`。所有玩家按 Ctrl+F5 强制刷新，重新建房并新建对局；旧对局不会替换已创建的战斗内容。

## 包内内容与校验

实际改变的文件：

${files.map((f) => '- `' + f + '`').join('\n')}

\`HOTFIX.json\` 记录两种安装状态下上述文件覆盖前后的大小和 SHA-256，以及两个基准包的校验值。\`MANIFEST.json\` 更新为覆盖后的完整运行清单；\`MOD-PACKAGE.json\` 标明修补编号、累计修订日期及适用基准。
\`plugins/marisa/test/guard.test.js\` 是原完整包已携带且插件锁声明的文件，随插件锁同步更新；这里未加入工程根目录的 \`test/\`、开发依赖或未改变的素材。

可在 PowerShell 中运行 \`Get-FileHash .\\${BASE_NAME} -Algorithm SHA256\` 核验原完整包。修补包自身的 SHA-256 见本次发布说明，可同样使用 Get-FileHash 核对。
覆盖后可在安装目录运行 \`node tools/doctor.mjs\` 查看安装清单检查，运行 \`node tools/plugin.mjs check marisa --strict\` 查看插件完整性检查。
源码及本修补包仅限非商业同人用途，版权声明沿用原完整包。
`, 'utf8');
}

function runInstalled(installed, args) {
  const result = spawnSync(process.execPath, args, {
    cwd: installed, encoding: 'utf8', timeout: 180000, maxBuffer: 8 * 1024 * 1024,
    env: {...process.env, SP_PLUGIN_SCRIPTS: 'sandbox'},
  });
  if (result.error || result.status !== 0) throw Error('Installed check failed: ' + args.join(' ') + '\n' + (result.error?.message || '') + result.stdout + result.stderr);
  return {status: result.status, stdout: result.stdout, stderr: result.stderr};
}

/** Build one cumulative overlay and verify both supported installation states. */
export async function packageMarisaHotfix(root = ROOT, {force = false, previousZip = path.join(root, '.cache/hotfix-cumulative/previous-hotfix1.zip'), log = console.log} = {}) {
  const dist = path.join(root, '.cache/dist');
  const baseZip = path.join(dist, BASE_NAME);
  const baseDigest = digestFile(baseZip);
  assert.deepEqual(baseDigest, {size: BASE_SIZE, sha256: BASE_SHA256}, 'The baseline must be the exact previously published full zip');
  const previousDigest = digestFile(previousZip);
  assert.equal(previousDigest.sha256, PREVIOUS_SHA256, 'The second baseline must be the original 2026-10-16 hotfix');
  const zip = path.join(dist, NAME);
  if (fs.existsSync(zip) && !force) throw Error('Hotfix already exists; use --force to replace only this generated hotfix: ' + zip);
  const cache = path.join(root, '.cache/hotfix-package');
  fs.mkdirSync(cache, {recursive: true});
  const work = fs.mkdtempSync(path.join(cache, 'run-'));
  const installed = path.join(work, 'installed', FOLDER);
  const installedPrevious = path.join(work, 'previous-installed', FOLDER);
  const stageParent = path.join(work, 'patch');
  const stage = path.join(stageParent, FOLDER);
  const baseline = new Map();
  log('Reading the published baseline and extracting a fresh verification installation');
  unzip(baseZip, installed, (rel, body) => {
    if (baseline.has(rel)) throw Error('Duplicate baseline path: ' + rel);
    baseline.set(rel, digest(body));
  });
  unzip(baseZip, installedPrevious);
  const previousBaseline = new Map(baseline);
  readZip(previousZip, (entry, body) => {
    assert.ok(entry.startsWith(FOLDER + '/'));
    const rel = entry.slice(FOLDER.length + 1);
    if (pathProblem(rel)) throw Error('Unsafe previous patch path: ' + entry);
    previousBaseline.set(rel, digest(body));
  });
  unzip(previousZip, installedPrevious);
  const manifestBefore = JSON.parse(fs.readFileSync(path.join(installed, 'MANIFEST.json'), 'utf8'));
  const metadata = JSON.parse(fs.readFileSync(path.join(installed, 'MOD-PACKAGE.json'), 'utf8'));
  assert.equal(metadata.kind, 'full');
  assert.equal(metadata.mod, 'marisa');
  assert.equal(metadata.version, '0.3.0');

  const bundle = path.join(root, 'mods/marisa-native/bundle');
  const candidates = new Map(['data/assets.json', 'scripts/start-marisa.cmd'].map(rel => [rel, path.join(root, rel)]));
  for (const rel of listTree(bundle, 'marisa')) candidates.set('plugins/' + rel, path.join(bundle, rel));
  for (const rel of ['docs/MARISA-0.3.0.md', 'docs/MARISA-VALIDATION.md']) {
    if (baseline.has(rel)) candidates.set(rel, path.join(root, rel));
  }
  candidates.set('MARISA-PACKAGE.md', path.join(root, 'docs/MARISA-0.3.0.md'));
  const payload = new Map();
  for (const [rel, source] of candidates) {
    const body = fs.readFileSync(source);
    if (!same(baseline.get(rel), digest(body)) || !same(previousBaseline.get(rel), digest(body))) payload.set(rel, body);
  }
  if (!payload.size) throw Error('No changed files to package');
  for (const rel of baseline.keys()) {
    if (rel.startsWith('plugins/marisa/') && !candidates.has(rel)) throw Error('Plugin file removal needs an explicit plan: ' + rel);
  }
  const base = {release: BASE_RELEASE, name: BASE_NAME, ...baseDigest};
  const previous = {release: BASE_RELEASE + '-hotfix1', name: NAME, ...previousDigest};
  metadata.hotfix = {id: 'hotfix1', revision: '2026-10-17', base, previous};
  payload.set('MOD-PACKAGE.json', json(metadata));
  payload.set('MARISA-HOTFIX1.md', readme([...payload.keys()].sort()));
  const changes = Object.fromEntries([...payload].sort(([a], [b]) => a.localeCompare(b, 'en')).map(([rel, body]) => [rel,
    {before: baseline.get(rel) || null, previous: previousBaseline.get(rel) || null, after: digest(body)}]));
  payload.set('HOTFIX.json', json({format: 1, mod: 'marisa', version: '0.3.0', id: 'hotfix1', revision: '2026-10-17', base, previous, files: changes,
    manifests: ['MANIFEST.json', 'HOTFIX.json'], removed: []}));
  const manifestFiles = new Map(Object.entries(manifestBefore.files));
  for (const [rel, body] of payload) if (inManifest(rel)) manifestFiles.set(rel, digest(body));
  payload.set('MANIFEST.json', Buffer.from(manifestText({app: '0.3.0', files: manifestFiles})));
  for (const [rel, body] of payload) {
    if (same(baseline.get(rel), digest(body)) && same(previousBaseline.get(rel), digest(body))) throw Error('Unchanged file in patch: ' + rel);
    write(stage, rel, body);
  }
  const scans = scanFiles(stage, [...payload.keys()].filter((f) => !['MANIFEST.json', 'HOTFIX.json', 'MOD-PACKAGE.json'].includes(f)), {home: true});
  if (scans.length) throw Error('Unexpected local information in patch: ' + JSON.stringify(scans));
  if (fs.existsSync(zip)) fs.unlinkSync(zip);
  zipFolder(stageParent, zip);

  const shipped = new Map();
  unzip(zip, installed, (rel, body) => {
    if (shipped.has(rel)) throw Error('Duplicate patch path: ' + rel);
    shipped.set(rel, digest(body));
    assert.deepEqual(digest(body), digest(payload.get(rel)), 'The zip must carry the intended bytes: ' + rel);
  });
  assert.equal(shipped.size, payload.size);
  const {checkInstall} = await import(pathToFileURL(path.join(installed, 'server/update.js')).href);
  assert.equal(checkInstall(installedPrevious).state, 'ok', 'The old hotfix baseline must be a valid installation');
  unzip(zip, installedPrevious);
  const installations = [];
  for (const [state, target, beforeFiles] of [
    ['full', installed, baseline], ['previous-hotfix', installedPrevious, previousBaseline],
  ]) {
    log('Checking cumulative overlay on: ' + state);
    const installation = checkInstall(target);
    assert.equal(installation.state, 'ok', JSON.stringify(installation));
    const strict = runInstalled(target, ['tools/plugin.mjs', 'check', 'marisa', '--strict', '--json']);
    const plugin = JSON.parse(strict.stdout);
    assert.equal(plugin.problems, 0);
    assert.equal(plugin.warnings, 0);
    const tests = runInstalled(target, ['tools/plugin.mjs', 'test', 'marisa']);
    const health = runInstalled(target, ['--input-type=module', '-e', `
    import assert from 'node:assert/strict';
    import fs from 'node:fs';
    import {startServer} from './server/index.js';
    import {parseArgs, serverEnv} from './scripts/launch.mjs';
    import {classifyAddresses} from './tools/doctor.mjs';
    import {TestClient} from ${JSON.stringify(pathToFileURL(path.join(root, 'test/helpers/wsClient.js')).href)};
    delete process.env.HOST;
    const command = fs.readFileSync('scripts/start-marisa.cmd','utf8').split(/\\r?\\n/).find(line => line.startsWith('node scripts/launch.mjs '));
    assert.ok(command);
    const args = command.trim().split(/\\s+/).slice(2).filter(arg => arg !== '%*');
    const opts = parseArgs(args);
    assert.equal(opts.host, parseArgs([]).host);
    process.env.SP_PLUGIN_SCRIPTS = serverEnv(opts, {}).SP_PLUGIN_SCRIPTS;
    const server = await startServer({host:opts.host,port:0,quiet:true,studio:false,assetIndex:false});
    const clients = [];
    try {
      const response = await fetch('http://127.0.0.1:' + server.port + '/healthz');
      assert.equal(response.status, 200);
      const health = await response.json();
      assert.equal(health.ok, true);
      const indexResponse = await fetch('http://127.0.0.1:' + server.port + '/plugins/index.json');
      assert.equal(indexResponse.status, 200);
      const index = await indexResponse.json();
      const marisa = index.plugins.find((plugin) => plugin.id === 'marisa');
      assert.ok(marisa, 'The installed Marisa plugin must be advertised');
      assert.equal(marisa.status, 'loaded');
      const host = await TestClient.connect('ws://127.0.0.1:' + server.port + '/ws'); clients.push(host);
      await host.hello('Host');
      assert.equal((await host.request({t:'room.create',mode:'coop',difficulty:'NORMAL'})).t,'ok');
      const room = await host.waitFor('room.state', s => !!s.code);
      const network = [];
      for (const kind of ['lan','vpn']) {
        const address = classifyAddresses().find(a => a.kind === kind && !a.address.includes(':'));
        if (!address) continue;
        const base = address.address + ':' + server.port;
        const response = await fetch('http://' + base + '/healthz', {signal:AbortSignal.timeout(5000)});
        assert.equal(response.status,200);
        assert.equal((await response.json()).ok,true);
        const guest = await TestClient.connect('ws://' + base + '/ws'); clients.push(guest);
        await guest.hello('Guest-' + kind);
        assert.equal((await guest.request({t:'room.join',code:room.code})).t,'ok');
        network.push({kind,http:true,webSocket:true,roomJoin:true});
      }
      assert.ok(network.length, 'At least one real LAN/VPN interface is required for package verification');
      assert.equal((await host.request({t:'room.setPlugins',plugins:[{id:'marisa'}]},15000)).t,'ok');
      for (const guest of clients.slice(1)) {
        const state = await guest.waitFor('room.state',s => s.content?.execution === 'sandbox',15000);
        assert.ok(state.content.plugins.some(p => p.id === 'marisa'));
      }
      console.log(JSON.stringify({health,index,network,execution:'sandbox'}));
    } finally { await Promise.all(clients.map(c => c.terminate())); await server.close(); }
    `]);
    let unchanged = 0;
    for (const [rel, before] of beforeFiles) {
      if (shipped.has(rel)) continue;
      assert.deepEqual(digestFile(path.join(target, rel)), before, 'An unchanged file was modified: ' + state + '/' + rel);
      unchanged++;
    }
    installations.push({state,installed:target,unchangedFiles:unchanged,unchangedModifications:0,installation,plugin,tests,health:JSON.parse(health.stdout)});
  }
  for (const rel of new Set([...baseline.keys(), ...previousBaseline.keys(), ...shipped.keys()])) {
    assert.deepEqual(digestFile(path.join(installed, rel)), digestFile(path.join(installedPrevious, rel)), 'Final installations must match: ' + rel);
  }
  assert.deepEqual(digestFile(baseZip), baseDigest, 'The published baseline zip must remain unchanged');
  assert.deepEqual(digestFile(previousZip), previousDigest, 'The old hotfix baseline must remain unchanged');
  const report = {name: NAME, ...digestFile(zip), base, previous, work, installed, files: Object.fromEntries(shipped),
    installations, identicalFinalInstallations:true};
  const reportPath = path.join(work, 'report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2) + '\n');
  fs.writeFileSync(path.join(cache, 'latest.json'), JSON.stringify({report: reportPath, zip, ...digestFile(zip)}, null, 2) + '\n');
  log(JSON.stringify({name: NAME, ...digestFile(zip), changedFiles: payload.size, states:installations.map(i => ({state:i.state,unchangedFiles:i.unchangedFiles})), report: reportPath}, null, 2));
  return report;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2), options = {};
  while (args.length) {
    const arg = args.shift();
    if (arg === '--force') options.force = true;
    else if (arg === '--previous' && args.length) options.previousZip = path.resolve(args.shift());
    else throw Error('Usage: node tools/package-marisa-hotfix.mjs [--force] [--previous old-hotfix.zip]');
  }
  await packageMarisaHotfix(ROOT, options);
}
