// Battle-entry latency segmentation (SP_BATTLE_TIMING; docs/UPGRADE-0.3.1-REVIEW.md §T1.6): one structured console
// record per battle of this page's way into it, for the client-entry delay analysis (design §2.1.3(b)). Purely
// observational — default off (a null recorder makes every mark in the runner a no-op), session level only (never
// persisted, never a setting), output solely as a console log (never a wire message) — and it never touches
// server/sim or shared/protocol.js: the marks live entirely in the runner's host / load / render orchestration.
// A segment that never happened stays null; nothing throws, nothing blocks the battle.
//
//   S1 a room.state carrying the room's content set → the battle's first b.start | S2 b.start → the runner starts
//   loading the simulation (prepare) | S3 the simulation is ready — the module / data cold load, a Worker host's
//   load() included | S4 the battle object is built (host.start — createBattleFromSpec inside) | S5 built → the
//   first frame submitted (show's first snap) | S6 (reference) the silent catch-up's duration before it is shown

const SWITCH = 'SP_BATTLE_TIMING';

/**
 * The switch, read once when the runner is created (session level): `?SP_BATTLE_TIMING=1` in the URL, or
 * `SP_BATTLE_TIMING = '1'` on globalThis (a console-set global before the page's runner loads; a Node harness).
 * Any other value — including a typo — is off.
 */
export function battleTimingEnabled() {
  let asked = null;
  try { asked = new URLSearchParams(globalThis.location?.search || '').get(SWITCH); } catch { /* not a windowed context */ }
  if (asked != null) return asked === '1';
  const g = globalThis[SWITCH];
  return g === '1' || g === 1 || g === true;
}

/** One decimal of a millisecond: readable console numbers, no 15-digit floats. */
const ms = (x) => Math.round(x * 10) / 10;

/**
 * The per-runner recorder: null unless the switch is on. `log` receives `('spBattleTiming', record)` — exactly one
 * record per battleId, logged when its first frame is submitted, or when it is dropped without one (superseded,
 * failed: the missing segments stay null), or when the page goes away mid-preparation (flush).
 * @param {{ now?: () => number, enabled?: () => boolean, log?: (...args: any[]) => void }} [deps]
 * @returns {{ noteRoomState(msg: any): void, noteStart(msg: any): void, noteLoad(battleId: string, cold: boolean): void,
 *   noteSim(battleId: string): void, noteBuilt(battleId: string): void, noteCatchup(battleId: string): void,
 *   noteCatchupEnd(battleId: string): void, noteShown(battleId: string): void, drop(battleId: string): void,
 *   flush(): void } | null}
 */
export function createBattleTiming(deps = {}) {
  let on = false;
  try { on = (deps.enabled ? deps.enabled() : battleTimingEnabled()) === true; } catch { return null; }
  if (!on) return null;
  const now = deps.now || (() => (globalThis.performance ? performance.now() : Date.now()));
  const log = deps.log || ((...args) => console.info(...args));
  /** when the page last saw a room.state carrying a content-set `cs`, and that cs (S1's start). */
  let roomAt = null;
  let roomCs = null;
  /** battleId → the record under construction (the underscored fields are the raw marks; the output drops them). */
  const live = new Map();

  const output = (r) => log('spBattleTiming', { cs: r.cs, fieldId: r.fieldId, battleId: r.battleId, cold: r.cold, seg: r.seg });

  return {
    /** S1 opens: a room.state carrying a content set arrived (the latest such frame wins). */
    noteRoomState(msg) {
      const c = msg && typeof msg === 'object' ? msg.content : null;
      const cs = c && typeof c === 'object' && typeof c.cs === 'string' ? c.cs : null;
      if (cs) { roomAt = now(); roomCs = cs; }
    },
    /** S1 closes / S2 opens: the battle's first b.start (a resend or a second b.start never restarts the record). */
    noteStart(msg) {
      if (!msg || typeof msg !== 'object' || typeof msg.battleId !== 'string' || live.has(msg.battleId)) return;
      const spec = msg.spec && typeof msg.spec === 'object' ? msg.spec : null;
      const cs = spec && typeof spec.cs === 'string' ? spec.cs : null;
      const t0 = now();
      live.set(msg.battleId, {
        cs, fieldId: msg.fieldId || spec?.fieldId || null, battleId: msg.battleId, cold: null,
        seg: { s1: null, s2: null, s3: null, s4: null, s5: null, s6: null },
        _t0: t0, _tLoad: null, _tSim: null, _tBuilt: null, _tCatch: null, _s1from: cs && roomCs === cs ? roomAt : null,
      });
    },
    /** S2 closes (the runner starts loading the sim). `cold`: this load began with the battle (a warm sim: false). */
    noteLoad(battleId, cold) {
      const r = live.get(battleId);
      if (!r || r._tLoad != null) return;
      r.cold = cold === true;
      r._tLoad = now();
      r.seg.s2 = ms(r._tLoad - r._t0);
      if (r._s1from != null) r.seg.s1 = ms(Math.max(0, r._t0 - r._s1from));
    },
    /** S3 closes: the simulation is ready (a Worker host's load() included). */
    noteSim(battleId) {
      const r = live.get(battleId);
      if (!r || r._tLoad == null || r._tSim != null) return;
      r._tSim = now();
      r.seg.s3 = ms(r._tSim - r._tLoad);
    },
    /** S4 closes: the battle object is built (host.start — createBattleFromSpec inside). */
    noteBuilt(battleId) {
      const r = live.get(battleId);
      if (!r || r._tSim == null || r._tBuilt != null) return;
      r._tBuilt = now();
      r.seg.s4 = ms(r._tBuilt - r._tSim);
    },
    /** S6 opens where the silent catch-up loop begins (it closes at the loop's exit). */
    noteCatchup(battleId) {
      const r = live.get(battleId);
      if (!r || r._tCatch != null) return;
      r._tCatch = now();
    },
    /** S6 closes after the silent catch-up loop (≈ 0 when none was needed). */
    noteCatchupEnd(battleId) {
      const r = live.get(battleId);
      if (!r || r._tCatch == null) return;
      const t = r._tCatch;
      r._tCatch = null;
      r.seg.s6 = ms(now() - t);
    },
    /** S5 closes at the first frame submitted (show's first snap) — the record is final: log it. */
    noteShown(battleId) {
      const r = live.get(battleId);
      if (!r || r._tBuilt == null) return;
      r.seg.s5 = ms(now() - r._tBuilt);
      live.delete(battleId);
      output(r);
    },
    /** The battle never got its first frame (superseded, failed): log what was measured, the rest stays null. */
    drop(battleId) {
      const r = live.get(battleId);
      if (!r) return;
      live.delete(battleId);
      output(r);
    },
    /** The page is going away mid-preparation: log everything still open. */
    flush() { for (const r of live.values()) output(r); live.clear(); },
  };
}