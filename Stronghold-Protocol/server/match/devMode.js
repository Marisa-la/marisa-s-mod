// server/match/devMode.js — 开发/测试模式的启动开关（MOD 新增，不属于上游）。
//
// 目前只有一个开关：**无限资金**。整备期开始时把人类玩家的资金补足到 SP_DEV_FUNDS 指定的数额，
// 方便试玩、验收和压测（不用为了看后期内容而反复刷经济）。
//
// ── 为什么资金要经由 onIncome 事件给，而不是直接写 ps.funds ──────────────────────────────
// `server/match/audit.js:159` 有一条强断言：一次 startRound 之后
//     ps.funds - f0 === nn(ev.income) + nn(ev.pending)
// 也就是「资金的变化必须精确等于 onIncome 结算出的收入」。直接给 `ps.funds` 赋值会让这条断言失败，
// 而审计在测试里是开着的（test/match/audit* 与 golden 语料都会跑到）。所以这里在 onIncome 派发**之后**、
// `addFunds` 调用**之前**改写 `ev.income`，资金随后由正常的 addFunds 通道入账：
//   · 审计的算术成立（credited 读的是同一个 ev 对象，是在所有 handler 跑完之后算的）
//   · 走的仍是合法入账路径，`stats.fundsGained` 与结算面板都如实反映
//   · 不需要碰 economy.js 里那 3 处 NO_FUNDS 检查
//
// ── 为什么是「补足」而不是「加固定值」────────────────────────────────────────────────
// `player/round.js` 的 `endPrep()` 会把余额清零（`leftoverKeptBands` 例外），所以每回合给一笔固定值
// 也能用；但「补足到 N」的语义更贴近「无限资金」——玩家花掉多少，下个整备期就回满，不会因为省着花
// 而在中期反而变少。当前资金已高于目标值时不动（避免把玩家自己挣的钱减掉）。
//
// ── 安全边界 ────────────────────────────────────────────────────────────────────────
// · 只对人类玩家生效（`isBot` 跳过）：机器人不需要，且避免改动 AI 的经济行为。
// · 只对单人房间生效（`m.isSolo`）：正式多人局里绝不能出现凭空多出来的资金，否则等于作弊。
//   `isSolo` 由 `Match` 在构造时定好（mode === 'solo' || gd.isSolo），不随局势变化。
// · 默认关闭。开启方式见 docs/DEV-MODE.md。

/** 环境变量名：设为正整数即开启无限资金；未设 / 非法值 = 关闭。 */
export const DEV_FUNDS_ENV = 'SP_DEV_FUNDS';

/** 默认额度。足够把 6 本商店刷满并把调度中心顶到满级，同时远低于 Number.MAX_SAFE_INTEGER。 */
export const DEV_FUNDS_DEFAULT = 9999;

/**
 * 解析 SP_DEV_FUNDS。未设、空串、非数字、非正数一律视为关闭（返回 0）。
 * @param {string|undefined} raw
 * @returns {number} 0 = 关闭；否则为目标资金额
 */
export function parseDevFunds(raw) {
  const s = String(raw ?? '').trim();
  if (!s) return 0;
  const n = Number(s);
  if (!Number.isFinite(n) || n <= 0) return 0;
  return Math.min(Math.trunc(n), Number.MAX_SAFE_INTEGER);
}

/**
 * 本进程的开发模式配置（进程环境在运行期不变，读一次即可）。
 * @param {Record<string, string|undefined>} [env]
 * @returns {{ funds: number }}
 */
export function devMode(env = (typeof process !== 'undefined' ? process.env : {})) {
  return { funds: parseDevFunds(env && env[DEV_FUNDS_ENV]) };
}

/**
 * 本局是否启用无限资金：开关打开 + 单人房间。
 * @param {{ isSolo?: boolean }} m
 * @param {{ funds: number }} [cfg]
 */
export function devFundsOn(m, cfg = devMode()) {
  return cfg.funds > 0 && !!m && m.isSolo === true && m.gd?.raw?.effects?.effect_x_marisa_rhode?.scriptHandler === 'marisa';
}

/**
 * 把一个玩家的资金补足到目标值，返回应**加进 `ev.income`** 的数额（0 = 不需要或不该给）。
 *
 * `income` 是本回合将随 `ev.income` 一起入账的数额（调用时 `addFunds` 还没跑，所以 `ps.funds` 仍是上一回合
 * 结束时的余额）：补足量 = 目标 − 当前余额 − 本次收入，这样 addFunds 跑完之后正好等于目标值。
 * 若不减去本次收入，玩家每回合会多拿一份收入（实测 R1 会得到 781 而不是 777）。
 *
 * 由 `player/round.js` 的 `startRound` 在 onIncome 派发之后、addFunds 之前调用。
 *
 * @param {{ funds: number }} cfg  devMode() 的结果
 * @param {{ isBot?: boolean, funds?: number }} ps
 * @param {number} income 本回合将计入的数额（含 onIncome 改写过的那部分）
 * @returns {number} 本次应加进 ev.income 的数额
 */
export function applyDevFunds(cfg, ps, income = 0) {
  if (!cfg || !(cfg.funds > 0)) return 0;
  if (!ps || ps.isBot) return 0;
  const cur = Number.isFinite(ps.funds) ? ps.funds : 0;
  const inc = Number.isFinite(income) ? income : 0;
  const add = cfg.funds - cur - inc;
  return add > 0 ? add : 0;
}
