# 0.3.1 适配复核现场

## 2026-10-19 游玩反馈修复

用户补充两个此前矩阵未覆盖的问题：默认二技能的结城理没有攻击动画，以及四名罗德岛干员没有给已经激活的主盟约提供人数。

- 罗德岛：`computeBonds` 在 0.3.1 原生迁移时只保留了上游计数，遗漏旧 MOD 的人数捐赠。用当前 profile 的
  阿米娅、凯尔希、华法琳、DIY Mon3tr 及三名阿戈尔复现 `3 !== 7`。已恢复有效人数捐赠，
  `bondList` 与 `bondSnapshot` 同为 7，阿戈尔按真实阈值 3/5/9 为第二档；不赋予捐赠者阿戈尔身份。
  计数测试只使用 Mon3tr 当前 profile 的真实阵营，未依赖本机缺失的可选 DIY 技能/属性表。
  同时检查精锐重复、休整区、第四人离场、原有目标盟约成员不重复捐赠及未激活主盟约不被强行激活。
- 结城理：真实插件形态事件将 `MASK_SWITCH = 0.5` 错用为形态存在时长，客户端因此立即播放
  `Doll_Skill_2_SwitchOut`。在真实生成插件→战斗→形态事件→UnitView 的路径先复现退出片段过早播放，
  再改为 `trait:substitute.timeLeft`。保留原攻击、伤害、替身持续时间和技能规则。已重建、pack 并同步安装插件和 bundle。
- 新增测试：`test/plugins/marisa-playtest.test.js`、`test/render/marisa-makoto.test.js`、
  `test/render/marisa-makoto.browser.test.js`。真实 Chrome 对原皮/P3R、正背面逐帧检查无提前退场，且攻击时实际骨骼发生变化。
- 本轮证据：`.cache/fix-makoto-browser.log` 1/1；`.cache/fix-makoto-author.log` 23/23；
  `.cache/fix-makoto-rhode-regressions.log` 43/43；定向 lint 无输出、无错误。后续最终检查结果见最新交接状态。
  本轮没有执行推送或发布，也没有把旧 CI 结果重新当成本轮全量测试。
- 最终补充：完整 golden 288/288 匹配、零快照变更（`.cache/fix-makoto-rhode-golden.log`）；
  imports/typecheck 通过（`.cache/fix-makoto-rhode-static.log`）；文档 32/32
  （`.cache/fix-makoto-rhode-docs.log`）。本轮未重跑整个 CI；此前的其他待办不在这两项游玩反馈的验收范围内。

以下记录为此前的适配与审计证据，不能替代本轮新增用例。

2026-10-18。本次完成本地源码适配及针对性回归修复，尚未证明全量测试通过。后续维护者应独立核查，不以本文替代测试。

## 已实现并有专项证据

- 上游 v0.3.1 合并；原始本地改动先存于 `151be5d8`，另有备份分支。官方 48 项数据字段变化进入生成插件；API 1 仍可被 API 2 主机接受。
- 罗德岛人数显示、真实战斗效率和溢出伤害来源修复；普通伤害事件格式保持原样，独立盟约伤害可带第六位来源。二维 Chrome 分发回归通过；未完成三维官方粒子的视觉验收。
- 新旧皮肤偏好统一、按座位绘制、原生皮肤目录发布。构建器不再覆盖新版画面文件。
- 音效记录不再深度保留已删除的旧槽位；MOD 两名额外干员通过静态补充获得官方池参数。官方记录逐条与 0.3.1 基线对比；补充十个引用、十个池。
- 保留 MOD `budget` 清单扩展，重新生成 API 表并补充该字段的稳定接口登记；特质显示测试适配 MOD 的多行分组结构，同时继续验证翻译与移除后的恢复。

## 测试证据

日志均在工程 `.cache/`，被 Git 忽略，请在换电脑前另行复制所需日志。

| 日志 | 实际结果 |
| --- | --- |
| upgrade-golden.log | 288/288 匹配，未改快照 |
| upgrade-author-final.log | 23/23，真实 MOD 战斗 |
| upgrade-browser-alone.log | 1/1，最终双 Chrome 联机，约 146 秒 |
| upgrade-fx-browser.log | 1/1，真实 Chrome 特效事件分发 |
| upgrade-skins-final.log | 52/52，皮肤专项 |
| upgrade-audio-final.log | 13/13，音效与素材目录 |
| upgrade-focused-final.log | 20/20，最终数据、特效与皮肤 |
| upgrade-contracts-final.log | 3/3，声明式特质展示与 API 表 |
| upgrade-docs-final.log | 32/32，增补本复核文档前的文档检查 |
| upgrade-i18n-final.log | 四语言各 2170/2170，0 缺失、0 错误 |
| upgrade-ci-final.log | setup/smoke/lint/imports/typecheck 通过；test 失败，详见下方 |

## 完整检查未解决项

原始全量结果：8573 测试，8423 通过，90 失败，1 取消，59 跳过，约 14 分 34 秒。该结果发生在最后音效、显示测试与 API 表调整之前；后续专项通过不能换算为全量已通过。

- Windows symlink EPERM：资源索引、安装、Forge、工作台等测试会创建普通符号链接。本机缺少相关权限；Forge 规则失败曾追踪到该路径，文件与上游基线一致。没有降低路径/链接安全限制。
- Python：`local-extract-operators.test.js` 多项调用返回 9009，尚未配置测试需要的 Python 命令。
- 身份清单：`plugins/identity.test.js` 期望无插件，实际安装了 Marisa，返回 `plugins: 1`；须独立复现并确定测试隔离方式。
- 并发时限：生产沙箱、通知、CLI harness 等有 5000ms 初始化预算超时；生产特质模块树测试 30000ms 超时。应单独运行定位，不能直接放宽预算。
- 性能：heavy 2-player boss field 的 0.5ms/tick 断言失败，须在可比负载下测量。
- Forge、官方表获取、工作台及其他失败仍需分类。详细断言以完整日志为准，不断言这些全是上游问题。
- 两项音效断言已修复，13/13 复查通过；特质树的单块/多行差异和 API budget 表差异已复查 3/3。没有再次执行整套全量检查。

双浏览器曾与完整测试并发时失败于入房插件请求超时，单独重跑最终版本已通过。客机 2–3 秒延迟依然没有跨机测量证据，尚未标记修复。

本轮未发布、未上传、未生成正式 ZIP。旧包及旧 hotfix 的验证记录只适用于各自历史版本。
## 2026-10-19 独立复核：CI 失败 91/91 全量归因（零适配回归）

对上面全量结果的 91 项失败（90 失败 + 1 取消）在当前树上逐组独立重跑，全部归因完毕，上节未解决项逐项闭环：

| 上节未解决项 | 归因结论 |
| --- | --- |
| Windows symlink EPERM（资源索引/安装/Forge/工作台等） | 沙箱符号链接功能障碍。Forge 导入类 ~52 项：暂存目录 symlinkSync 静默"成功"但链接不存在（lstat ENOENT，"幽灵链接"），registry 看不到暂存插件 → 验证视图报 `PLUGIN_UNKNOWN`；直接 EPERM 类 ~14 项；studio.test.js 六项为级联——L359 测试在 L370 抛 EPERM，L382 的 lnk-files 夹具从未创建 → L504 key 测试 L518 与 L416 随之失败（README.md 本身是普通文件，见 server/studio/templates/index.js L132；key 检查 403 先于路径检查所以 L515-517 仍通过）。0.3.0 基线（.cache/handoff-20261018 §14.1）已记录同样三类失败 |
| Python 9009（local-extract-operators） | 沙箱无 python3，测试辅助 spawn 返回 9009。环境问题 |
| 身份清单 identity.test.js | 官方测试期望无插件的纯净服务器，工作树装有 marisa（`plugins: 1`）；本沙箱另有 loopback 禁令（ENETUNREACH 127.0.0.1）。非回归 |
| 并发时限（5000ms 预算 / 30000ms 特质树） | script-sandbox SES 预算、presentationRework L86、studio review L178 单独重跑全部通过——当时环境慢。30000ms 特质树（operator-traits L322）例外，见下方专项 |
| 性能 heavy boss field 0.5ms/tick | 单独跑通过：best 415.3µs/tick；CI 的 934µs 是全量并发 CPU 争抢。非回归 |
| Forge、官方表获取、工作台及其他"仍需分类" | 已全部分类归入上面各行。另有 7 项为过期日志：audio-pools-data / feedback6-leizi2 / surface / theme-notices L393 / plugin-package / operator-traits L295 现全过——data/assets.json(16:06) 与 plugins/marisa(16:08) 在该 15:19 日志生成后 47-49 分钟才重建，日志不反映当前树 |

**operator-traits L322 = 官方 0.3.1 测试的 Windows 路径分隔符 bug，非 MOD 回归**。测试 L339 用 `cpSync('server/sim', …, { filter: src => !src.endsWith('/nodeData.js') })` 排除 Node 专用加载器，但 Windows 上 filter 收到反斜杠路径，POSIX 分隔符检查永不匹配 → nodeData.js 泄漏进临时树（测试自己的注释就警告过：包含它会经 data shim 构成循环）。死锁链：simdata.js L510 顶层 `await import('./nodeData.js')` → `loadGenerated()` 的 `await import('../data.js')`（= 测试写入的 DATA_SHIM_JS）→ shim 静态导入 `getSimData from './sim/simdata.js'` → ESM 顶层 await 循环死锁（nodeData.js 头部第 9 行注释明确记载该机制）。`.cache/probe-cycle.mjs` 三步实证：[1] Windows 上 filter 确实泄漏；[2] 含 nodeData.js 导入死锁（8s 探针超时，与 CI 30158ms 同机制）；[3] 排除后 2ms 导入成功且 nodeLoader 降级 null。代码与官方 b3deebda 逐字一致；151be5d8 无此测试（0.3.1 新增）。修复属上游（filter 需兼容 path.sep）。

**factions.handbookLevels 无需补入 upstream-0.3.1.json**：当前 data/factions.json 与官方 v0.3.1 逐字节一致（git diff b3deebda 为空；151be5d8 无此键）；消费方全为官方代码（public/js/screens/sweep.js、test/ui/sweep.test.js、tools/build-data.mjs）；build-profile.mjs 的 names 刻意不含 factions，upstream 条目对其既不适用也不生效。

**新增修复（已暂存，提交被沙箱拦截）**：mods/marisa-native/build-ui.mjs 幂等化 lobby.css 标记段重建——旧实现 `split(marker)[0] + '\n'` 每次重建追加一个空行导致 lobby.css 永远变脏；新实现按 marker 定位并归一化尾部空白。改动已进暂存区（+7/-2），但沙箱拒绝 git.exe 创建 index.lock（node.exe 创建同一文件却成功；spawnSync/PowerShell 中转/改名 git 副本均绕不过）。下会话直接执行：`git commit -m "修复 build-ui 重复构建时 lobby.css 追加空行的问题 #1"`。

沙箱不可行项（留待真机）：loopback 类测试（ENETUNREACH 127.0.0.1）、双 Chrome E2E（SP_E2E/SP_REAL_E2E）、客机 2-3 秒延迟跨机实测、3D 官方粒子视觉验收。审计与探针脚本保留在 `.cache/`（Git 忽略，换机需另存）：probe-cycle.mjs（L322 实证）、read-log.mjs、audit-ci-failures.mjs、audit-run-full.mjs。临时探针 test/plugins/zz-timing-probe.test.js 与 official-031-tree.tar、cycle-tree 已清理。最终定论仍需一次基于当前树、在无符号链接/loopback/python3 限制的机器上运行的新全量 CI。
## 2026-10-19 执行会话：T0 提交尝试与环境预检

- **T0.1/T0.2 提交尝试（单次纪律）**：`timeout 60 git commit -m "修复 build-ui 重复构建时 lobby.css 追加空行的问题 #1"` 与 `timeout 60 git add docs/UPGRADE-0.3.1-REVIEW.md && … commit` 均退出码 128——`fatal: Unable to create 'D:/AI/codex/Stronghold-Protocol/marisa-s-mod/.git/worktrees/vanilla-0.3.0/index.lock': Permission denied`。与上一会话相同（git.exe 被拒、node.exe 可写同一路径）。未重试、未绕过；暂存修复与未暂存文档增补原样保留，登记入 CODEX-HANDOFF-STATE.json。推送仍携带 `ebf9f730`。
- **T2.0 环境预检（.cache/probe-env-20261019.mjs，四项全受限，与上一会话沙箱一致）**：
  - symlink ❌：临时目录 `symlinkSync` 静默"成功"但 `lstat` ENOENT（幽灵链接，同 Forge ~52 项失败根因）；
  - loopback ❌：HTTP GET 127.0.0.1 临时端口 ENETUNREACH；
  - python3 ❌：exit 9009（缺失）；
  - Chrome ❌：`C:\Program Files\Google\Chrome\Application\chrome.exe` 存在但 `--version` spawnSync ETIMEDOUT（沙箱无法启动外部浏览器）。
- **T2.4 判定**：本环境不支持全量 CI 直跑（symlink/loopback/python3/Chrome 四项均缺），按计划转**真机待办**，不在受限环境硬跑制造环境性失败。T1.3（真实 Chrome 分发）与 T2.3（双浏览器 E2E）同样待真机；本会话以非浏览器守护套件与源码对账先行。
## 2026-10-19 执行会话：T1.1 构建管线完整性与幂等性验证

在 HEAD `ebf9f730` + 暂存 build-ui.mjs 幂等修复上全链重跑，全部通过：

- **重建链**：build-runtime（Runtime 286011 字符、0 可移植性问题；esbuild service 进程在本沙箱不随主脚本退出，产物正常生成，进程需外部终止——环境现象非回归）→ build-ui（"Native manager and presentation migrated"）→ build-tests（"Ported actual combat regressions to native author harness"）→ prepare-assets（"Generated shared art references: 214 characters"），四步产物全部落盘。
- **幂等性断言**：连续两次 `build-ui.mjs` 后 `git diff -- public/css/screens/lobby.css` 为空；lobby.css 不出现在 status 中。暂存的幂等修复（+7/-2）实际生效，旧版"每次重建追加空行导致 lobby.css 永远变脏"的问题已消除。
- **pack/check/test**：`plugin.mjs pack marisa` 写 plugin.lock.json（6 文件）内置 check ok；`check marisa --strict --json` problems 0 / warnings 0；`test marisa` **23/23**（含 Rhodes overflow 1:1 封顶、自然技能结束 tick 前降帽、同帧后加攻击 buff 到期降帽、四套 kit 跨 12 种子×3 场地确定性）。
- **bundle 一致性**：`plugins/marisa/` 与 `mods/marisa-native/bundle/marisa/` 8 文件（.studio.json、plugin.json、plugin.lock.json、guard.json、README.md、data/profile.json、sim/index.js、test/guard.test.js）SHA-256 逐文件一致；重建后未产生任何产物 diff（生产插件/bundle/lock 三方一致且重建后仍一致）。
- **升级增量与自定义平衡守护**：`node --test test/plugins/marisa-upgrade.test.js test/plugins/marisa-native.test.js` **8/8**：重建 profile 保留全部官方 0.3.1 数据变化（默认与禁用设置两路）、房间攻击预览保持官方射程（全部已发布翻译）、数据升级保留魔理沙干员技能与罗德岛阈值、生产 SES Worker 三项（shop/diy 跑原生 kit 无 handler 错误、罗德岛溢出上限维持）、沙箱 match 子进程跑完整 bot 局含 prep 钩子。
- **无意外入树**：重建后 `git status --short` 仅剩已知两项（暂存 build-ui.mjs 修复 + 未暂存本 REVIEW.md 增补），public/assets/、.cache/、plugins/ 保持 Git 忽略状态。
## 2026-10-19 执行会话：T1.2 罗德岛人数与效率覆盖矩阵复核

七项全部有专项证据，无缺口、无需补用例：

| 覆盖项 | 证据用例 | 结果 |
| --- | --- | --- |
| ① 3/4 显示分母 | test/ui/marisa-rhode-count.test.js：rhodeShip 与 bond_x_marisa_rhodeShip 两变体 × 1–5 人断言 `${count}/4`、is-max 于 ≥4；普通盟约（yanShip）保留原阈值分母 | 重跑 **11/11** |
| ② 三人 50% | combat-regressions 'three members'：六次加层观察 [0,1,1,2,2,3]（半层分数） | 23/23 内 ✅ |
| ③ 四名不同干员 100% | 'four distinct members'：[1,2,3,4,5,6] | 23/23 内 ✅ |
| ④ 普通/精锐不重复计数 | 'three members plus an elite duplicate'（第四人为 AMIYA_b 精锐重复）：仍 [0,1,1,2,2,3] | 23/23 内 ✅ |
| ⑤ 攻击加成上限 | 'Rhodes overflow is 1:1 and capped at actual own ATK'（ATK +50/+100/+200% × final multiplier/cultivation 四变体；own 基准、100% own 封顶、失去技能 buff 立即降帽、无新溢出时到期归零） | 23/23 内 ✅ |
| ⑥ 同帧到期回归 | 'cap drops before an attack on the natural skill-ending tick' + 'cap drops when a later-added ATK buff expires before a same-tick attack'（同帧攻击与帧末均用降后上限） | 23/23 内 ✅ |
| ⑦ **第四人离场立即降效** | combat-regressions.js:192-196：'four distinct members' 变体内 `h.b.retreat(h.unit(4))` 后下一次加层断言 rhodeShip.layers 6→7（2 层 × 50% = 1），标题 "withdrawing the fourth member immediately restores 50% efficiency" | 23/23 内 ✅（design.md §六-3 所记证据缺口不存在，守护已具备） |
## 2026-10-19 执行会话：T1.4 皮肤迁移幂等复核

- **迁移机制源码对账**（public/js/ui/skins.js parseStoredSkins L61-79）：旧信封 `{v:1, entries}` 仅在 `source !== raw` 分支（L65）走到 alias 复制（L75-77，且仅在 `!out.char_x_marisa_makoto` 时）；flat 输入（迁移后的持久化格式）`source === raw` 永不复制——注释明确 "flat preferences must never recreate an alias choice the player has subsequently cleared"。setSkins 持久化输出即 flat map（savePref 写清洗后结果），重载路径天然不重复迁移。**"旧数据迁移不反复覆盖新选择"机制成立**。
- **补齐端到端幂等用例**（design.md §六-4 证据缺口）：test/ui/marisa-skins.test.js 新增 'a migrated preference survives the persist-and-reload loop without the old envelope overriding new choices'——旧信封迁移一次（alias 复制）→ 玩家清除 alias 并改选其他干员 → 读回持久化的 flat map（断言非信封格式）→ 再次 parseStoredSkins 断言清除的 alias 不复活、新选择保留。原两单元断言（信封迁移一次 / flat 不重建 alias）保留。
- **座位独立显示与去除恢复**：原用例 'a local skin choice keeps the base manifest intact so each seat can draw its own appearance'（assetsFor 返回原 manifest、默认 portrait 不变）与 'one shared selection…'（setLegacySkin(null) 后条目移除）继续通过。
- **专项重跑**：官方 test/skins.test.js + test/ui/marisa-skins.test.js（3 用例，含新增）+ test/ui/skin-picker.test.js + test/ui/fieldHost-skins.test.js 共 **43/43、9 suites 全过**（与历史 52/52 同 9 suites；差值 9 项为 test/lobby-skins.test.js loopback 类，沙箱 ENETUNREACH 不可行，与上轮分类一致，**待真机**）。
## 2026-10-19 执行会话：T1.5 音效清单与来源合规复核

- **计数断言重跑**：`node --test test/audio-pools-data.test.js test/ui/audio.test.js` **39/39**（7 suites）。audio-pools-data.test.js L55-56 断言攻击/命中引用 **962**、池 **951**，注释明确"Official 0.3.1: 952 / 941; Marisa's medic Amiya and Makoto retain ten extra roles"——官方口径 952/941 与用户要求一致。
- **JSON 级精确对账**（`.cache/cmp-sfx.mjs`，HEAD vs 官方 b3deebda）：`audio.sfx.pools` 官方 **941 池 changed=0（逐字节一致）**，added=10 池——char_1037_amiya3（医疗阿米娅）4 个 + char_4217_makoto（结城理）6 个，951=941+10；`audio.sfx.units` added=2（同两名干员）、removed=0、changed=0。官方音效记录未被触碰，MOD 附加与"保留医疗阿米娅/结城理 MOD 音效"完全吻合；extra-audio-0.3.1.json 的十个官方音效池补充与官方 0.3.1 fetch-assets 系列（5ded26b3/7c7a8e52/281851fb/98d6947b）叠加生效。
- **来源合规**：git 历史 data/assets.json 每笔变更均伴随输入侧改动（官方 fetch-assets 提交或 MOD 生成器/extra-audio 输入）；T1.1 已验证 prepare-assets 重建后 assets.json 与 HEAD **零 diff**（生成器可完整复现，无手改生成物痕迹）。
- **voice 三语言差异定性**（`.cache/cmp-voice-pre.mjs`）：相对官方基线的 voiceEn 95 / voiceKr 182 / voiceNative 44 个空条目差异在**升级前 151be5d8 已完全相同**（151be5d8 → HEAD：added=0 removed=0 changed=0）——系本地素材包不含语音文件的历史既有状态（生成器如实输出空条目，客户端不请求本地不存在的文件），**非本次适配引入、非手改**。
## 2026-10-19 执行会话：T1.6 客机进入战斗延迟分段埋点（本方案唯一新增代码）

- **实现**（S1–S6 全落地，`performance.now()` 差值）：新增 `public/js/battle/timing.js`（记录器；`battleTimingEnabled` 开关 + `createBattleTiming` 工厂）+ `public/js/battle/runner.js` 12 处空安全标记（`timing?.`）：S1 于 `room.state`（含内容集 `cs`）→ 首个 `b.start`；S2 `b.start` → prepare 开始加载仿真（`noteLoad`，同时记 `cold`——该场战斗才发起加载为 true，仿真已缓存/预热为 false）；S3 加载完成（Worker 宿主含 `host.load()`；页内为 `loadBrowserSim`）；S4 `host.start`（内含 `createBattleFromSpec`）；S5 构建完成 → `show()` 首帧提交；S6 Silent catch-up 循环时长（参照）。ensureSim 仅提取 `simWant(cs)` 纯函数复用（行为等价）。
- **记录与输出**：每 battleId 恰一条 `{ cs, fieldId, battleId, cold, seg: { s1..s6 } }`（段缺失记 `null`，不抛错不阻断）；首帧提交时经 `console` 结构化日志（`spBattleTiming`）输出，被取代/失败场由 prepare `finally` 兜底输出，页面卸载（pagehide）flush 未完成记录。重发 b.start 不重开记录（仅新条目创建时 `noteStart`）。
- **开关（会话级，默认关闭）**：`?SP_BATTLE_TIMING=1`（URL）或 `globalThis.SP_BATTLE_TIMING='1'`；不持久化、不写入设置存储；关闭时记录器为 `null`，所有标记为无操作。
- **边界自检（2.6.4）**：`git status`/`diff` 确认改动仅 `public/js/battle/timing.js`（新增）、`public/js/battle/runner.js`（宿主/加载/渲染编排层）、`test/match/runner.test.js`（测试）——**零触碰 `server/sim/`（确定性铁律）与 `shared/protocol.js`**；输出仅走 console（不入协议、不落盘）；simHost.js/simLoader.js/simWorker.js/clientCombat.js 均未改动（clientCombat 的 `b.start` 携带 `startAt/serverNow/elapsed` 已足够参照）。
- **专项用例**（test/match/runner.test.js 新增）：默认关闭（`_timing === null`）；固定开启（`deps.battleTiming`）下一个 Worker 宿主场产出恰好一条全零（手动时钟）六段记录、重发不新增、线上流量仍只有 `b.progress`。**30/30 通过**（runner.test.js + runner-pending.test.js，即关闭态默认回归——2.6.6 关闭状态零影响验证）。ESLint（`node node_modules/eslint/bin/eslint.js` 三文件）0 问题。
- **首份分段报告**（`.cache/upgrade-t16-timing-20261019.log`，harness `node .cache/upgrade-t16-timing-20261019.mjs`）：真实时钟 + 真实 /sim spec/DataSource 驱动 createBattleRunner，四场景——A 冷加载页内（cold=true，s4=1.7ms 真实构建）、B 同 rig 第二场（cold=false，s3=0 缓存）、C 落后 20s 场（**s6=10.4ms 真实追赶 600 tick ≈17µs/tick**，s5=11.1ms）、D Worker 式内容集场（s1=0.1ms、s3=79.9ms 合成下载延迟、s4=0.9ms 真实构建、cs 正确记录）。s3 的下载部分为合成（沙箱 loopback 不可达）；真实冷下载与真 Worker 数字待 **T2.3 双浏览器 E2E / T4.1 跨机实测**（T3.1 根因分析的数据源）。
## 2026-10-19 执行会话：T1.3 医疗特效复核（降级路径：源码对账 + 非浏览器守护）

- **标记链路源码对账（全链一致）**：产生方 mods/…/server/sim/content/bonds/addon/battle.js——L128 罗德岛 tag 常量（rhodeHeal/rhodeAtk）、L448 伤害事件追加第六位 `bond:rhodeShip`、L411/L452/L533 fxOn 携带 origin；消费方 public/js/render/app.js:1743（`e[5] === 'bond:rhodeShip'` 特效分支）与 public/js/render/vfx/wiring.js:1337（`origin === 'bond:rhodeShip'` 早退——**不消耗 pending blow、不喂 skill-hit 推断**）。两消费端判据同源同值。
- **三项证据矩阵**（沙箱无 Chrome，`test/render/rhode-hit.browser.test.js` 视觉维度不可行，走非浏览器守护）：

| 证据项 | 守护用例 | 结果 |
| --- | --- | --- |
| ① 真实治疗反馈路径 | combat-regressions.js:149 'Rhodes feedback is bounded with an injured incantation medic and a real adjacent enemy'（fixture rhodeShip active+真实相邻敌人：`e[5] === 'bond:rhodeShip'` 视觉 origin、反馈恰一次无递归、`incantation` tag 真实发生）；另 Amiya S1 用例（combat-regressions.js:42）断言 bond 伤害不得伪装为攻击（服务端侧） | 23/23 内 ✅ |
| ② 普通伤害兼容 | test/sim/rhode-hit-provenance.test.js 'only Rhodes strikes append the display provenance; ordinary damage keeps its four-element tuple'（普通伤害保持四元组、仅罗德岛伤害追加第六位、红字保留槽位） | **12/12** 内 ✅ |
| ③ 技能命中保留 | test/render/vfx-skill-casts.test.js R13：'Rhodes healing damage in an open skill window never inherits its hit or target buff' + 'Rhodes healing damage does not consume a pending attack and still triggers damage-taken effects' | **12/12** 内 ✅ |

- **专项重跑**：`node --test test/sim/rhode-hit-provenance.test.js test/render/vfx-skill-casts.test.js` **12/12**（3 suites）；作者套件 `node tools/plugin.mjs test marisa` **23/23**（含确定性十二种子守护），退出码 0。
- **视觉维度（浏览器级特效播放/渲染时序）**：rhode-hit.browser.test.js 需 Chrome，沙箱不可行——判 **T4.2 真机待办**（与 T1.4 loopback 类、T2.3 双浏览器同类归因）。
## 2026-10-19 执行会话：T2.1 六组专项重跑（用户点名组，逐组单独执行）

每组命令、退出码、结果与环境性标注（日志 `.cache/upgrade-t21-<组名>-20261019.log`）：

| 组 | 套件与命令 | 结果 | 退出码 | 归因 |
| --- | --- | --- | --- | --- |
| identity | `node --test test/plugins/identity.test.js`（timeout 120 包装） | 16 tests / **13 pass / 3 fail** | 124（统计已完整输出后进程挂起，测试 server 句柄不退出） | 3 失败全部 `connect ENETUNREACH 127.0.0.1:9119`（loopback 禁令）——**环境性**，与 91/91 归因一致 |
| operator-traits | `node --test test/plugins/operator-traits.test.js`（timeout 300 包装） | 56 tests / **55 pass / 0 fail / 1 cancelled** | 统计完整落盘后挂起 | 唯一 cancelled = L323 'production match host and an isolated browser module tree agree' **30280ms 超时**——上游 Windows 分隔符 bug 死锁（cpSync filter `endsWith('/nodeData.js')` 不匹配反斜杠 → nodeData.js 泄漏 → ESM 顶层 await 循环，与 CI 30158ms 同机制）——**上游问题**；L295（过期日志项）本轮通过 |
| 脚本预算 SES | `node --test test/plugins/script-sandbox-integration.test.js` | **3/3**（含 'production SDK budget in SES…'） | 0 | 全过 |
| Forge | `node --test test/plugins/forgeImport.test.js` | 47 tests / **8 pass / 39 fail** | 1 | EPERM 标记 ×46（沙箱 symlink 功能障碍：直接 EPERM / 幽灵链接 → registry 空转）+ 连锁 ERR_ASSERTION ×38——**环境性**，与 91/91 归因一致，真机应通过 |
| 官方素材引用 | `node --test test/plugins/official-art.test.js` | **3/3** | 0 | 全过 |
| 性能（单独运行，无并发） | `node --test test/sim/robustness.test.js` + `test/sim/perf.test.js` + `test/perfbench.test.js` | **35/35 + 2/2 + 13/13** | 0 / 0（robustness 统计落盘后挂起） | heavy 2-player boss field（18 ops、peak 135 alive、1800 ticks）avg 266.4/269.9/257.4 **µs/tick，best 257.4**（门槛 0.5ms；上轮 best 415.3）；70 敌 +10 干两基准均过 |

**T2.1 定论**：六组执行完毕；全部失败/取消项均为环境性（loopback、symlink）或上游问题（L323 分隔符死锁），**无非环境/非上游失败——零适配回归在六组专项层面成立**。identity 与 operator-traits 的"挂起"系测试自身 server/子进程句柄在失败后不退出（node --test 已输出完整统计），由 timeout 包装终止并照实登记，非结果缺失。
## 2026-10-19 执行会话：T2.2 golden 全量守护

- **命令**：`npm run golden`（`node tools/golden.mjs`），日志 `.cache/upgrade-t22-golden-20261019.log`，退出码 **0**，耗时 66.5s（jobs 4）。
- **结果**：六类 **288/288 全部 match**——roster 49 + bonds 46 + fields 22 + matches 21 + standins 10 + diy 140；`git status` 确认 `test/golden/*.json` **零快照变更**。
- **定论**：T1.2（用例）、T1.4（用例）、T1.6（埋点，纯观测层）等全部改动未产生任何行为性结果变化——黄金结果守护通过。
## 2026-10-19 执行会话：T2.3/T2.4 判定（环境预检复核后转真机待办）

- **Chrome 探针复核（修正交接记录）**：`C:\Program Files\Google\Chrome\Application\chrome.exe` **存在且可启动**（进程产出真实 Chrome 内部日志），但 `--version` 快速探测在该环境挂起（updater named pipe 拒绝访问 0x5 重试循环）——此前 T2.0 判"无 Chrome"实为"--version 探测失败"；Chrome 本体并非缺失。
- **loopback 探针复核（决定性）**：`.cache/probe-loopback-recheck.mjs`——bind 127.0.0.1 监听 **OK**（port=12152），但自连 **FAIL ENETUNREACH** 且沙箱网络层显式报 `Sandbox Network Error: hit restricted [127.0.0.1:12152]`。**沙箱网络策略主动拦截 loopback 连接**，与 ENETUNREACH 归因一致。
- **T2.3 双浏览器 E2E → 真机待办**：即使 Chrome 可启动，E2E 链路（测试框架经 CDP 连 127.0.0.1:port、页面加载 http://127.0.0.1:port 的本地服务器）全部命中 loopback 拦截，不可行。跳过不算通过，照实登记；真机执行命令见 tasks.md 3.4.1（`SP_E2E=1 CHROME_PATH=… node --test test/ui/marisa-native.e2e.test.js`，顺路采集 SP_BATTLE_TIMING=1 分段）。
- **T2.4 新全量 CI → 真机待办**：T2.0 四项预检（symlink/loopback/python3/Chrome--version）在当前沙箱均不支持全量直跑（本轮 T2.1 已实证：Forge 39 项 EPERM、identity 3 项 ENETUNREACH）；按 tasks.md 3.5.1 转真机待办。定论表述维持"待新全量 CI"；当前树的分组证据链（T2.1 六组 + T2.2 golden 288/288 + T1 各专项）已覆盖全部可本机执行项，零适配回归。

