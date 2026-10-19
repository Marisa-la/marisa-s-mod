# 魔理沙 MOD · Stronghold-Protocol 0.3.1

2026-10-18。本次从既有 Marisa 0.3.0 开发状态升级到官方 `v0.3.1`，上游固定提交为
`b3deebdae4a92642c007d217a1a4573e5d3612c5`。保留四名干员、罗德岛盟约、鲲策略、驻防、人格面具、
商店/自选候选切换、房间管理器和回放。插件保持 API 1；0.3.1 的 API 2 继续接受 API 1。

## 启动与升级范围

当前可运行工程仍在 `vanilla-0.3.0/`，目录名属于历史名称，`package.json` 和游戏显示版本已是 0.3.1。
Windows 从工程内运行 `scripts/start-marisa.cmd`。该入口启用 sandbox 插件，默认监听方式与上游相同，支持局域网。
重启已有服务器，浏览器强制刷新后新建房间/对局；正在进行的旧对局不作为升级验收。

本次提供 `Stronghold-Protocol-0.3.1-marisa-update.zip` 累计更新包：停止服务、备份后，合并覆盖此前发布的
Marisa 0.3.0 完整包；未装补丁、已装 2026-10-16 旧修补1、已装 2026-10-17 累计修补1均可使用。
精确基准摘要和安装步骤见包内 `MARISA-UPDATE.md`、`MOD-UPGRADE.json`；新安装先下载原 0.3.0 完整包再覆盖更新。
旧 `0.3.0-marisa-hotfix1.zip` 不能单独把游戏升级到 0.3.1。`tools/package-marisa-hotfix.mjs` 保留为历史工具；
本次构建使用 `tools/package-marisa-upgrade.mjs`，只生成一个差异 ZIP，不重新生成完整包或兼容替换包。
0.3.1 的完整源码依然需要本工程兼容改动，单独把插件放入未修改的官方游戏不代表全部功能兼容。

## 改动与问题核验

- 罗德岛人数：修复此前显示改动中的语法错误，显示 `3/4`，四人时达到满员样式。
- 罗德岛效率：三人时每次其他盟约 `+1` 镜像 `+0.5`，四名不同干员时镜像 `+1`；不是增加激活盟约数量。
  普通/精锐副本不重复计数，第四人离场后立即回到 50%。攻击上限与同帧到期修复继续保留。
- 罗德岛人数捐赠（2026-10-19 修复漏迁）：至少四名不同的罗德岛干员在场时，分别为已经激活的主盟约
  增加有效人数，原本属于该主盟约的成员不重复加；不赋予盟约身份或让未激活盟约自行启动。
  阿米娅、凯尔希、华法琳、Mon3tr 加三名阿戈尔的阵容应为阿戈尔 `7/9`（第二档），而非 `3/5`。
- 结城理二技能动画（2026-10-19）：形态事件的 `dur` 改为真实替身状态的剩余时间；此前误传 0.5 秒切换耗时，
  导致画面立即播放替身退场。原皮与 P3R 时装的正背面均通过真实 Chrome 动画检查。
- 罗德岛伤害特效：治疗溢出转化的额外伤害保留独立来源，避免被阿米娅/凯尔希正在使用的技能命中推断吸收，
  从而给敌人挂上持续技能特效。伤害数值、归属和真实技能命中特效不变。
- 官方数据：生成插件时应用官方 0.3.0→0.3.1 的 48 项字段增量，保留 MOD 自定义平衡；
  覆盖高台部署、范围、模组特质和奖励配置，避免旧整表数据覆盖上游修复。
- 上游规则：保留琳琅诗怀雅三技能、凯瑟琳单局突变细胞限制和联防出生敌人结算修复。
- 客机进战斗延迟：本次没有足够跨机测量证明 2–3 秒延迟已消除；Worker 冷启动及加载路径仍需实际网络环境测量。

## 重建插件

构建工具依赖安装在 `mods/marisa-native/`。在工程根按顺序执行：

```text
node mods/marisa-native/build-runtime.mjs
node mods/marisa-native/build-ui.mjs
node mods/marisa-native/build-tests.mjs
node mods/marisa-native/prepare-assets.mjs
node tools/plugin.mjs pack marisa
node tools/plugin.mjs check marisa --strict
node tools/plugin.mjs test marisa
```

生成的本机安装目录是 `plugins/marisa/`。提交前将它同步到 `mods/marisa-native/bundle/marisa/`，
包括重新生成的 `plugin.lock.json`。`build-ui.mjs` 只生成管理器等派生内容，不再把冻结的 0.3.0
画面文件复制回来覆盖新版本。官方数据增量输入在 `mods/marisa-native/upstream-0.3.1.json`；重建无需 Git 或网络。

验证结果及限制见 [MARISA-VALIDATION.md](MARISA-VALIDATION.md)。

完整检查未全绿，待继续独立复核的断言、环境问题和日志位置见 [UPGRADE-0.3.1-REVIEW.md](UPGRADE-0.3.1-REVIEW.md)。
