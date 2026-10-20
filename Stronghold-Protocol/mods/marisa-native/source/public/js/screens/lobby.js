// Lobby screen: pick 独立模拟 / 同盟模拟 and a difficulty (标准/险境/绝境/终极), create a room,
// or join one with a 同盟密钥 (recent codes remembered) — as a player (加入同盟) or in one of its MAX_SPECTATORS
// spectator seats (观战: room.spectate, also while its match runs; community report #26, a remake feature — the
// official room has none). Shows connection status + ping.
//
// Difficulty descriptions come from data/config.json `modes[modeId]` when present, else from the
// official act2autochess `modeDataDict` texts embedded below (desc + effectDescList), so the
// screen is complete before data is generated. Rounds: solo 标准 = 9, everything else 14 (+R15
// hidden core on 险境+), per research 00-INDEX §2. Battlefield pool (`modes[].stages`): 标准 always
// plays 战场#01, 险境 draws one of 8, 绝境 / 终极 one of 7 (m01 excluded).
// Texts go through t() (docs/I18N.md); the module-level tables hold msgids (N_) translated where they are shown, the
// config.json mode texts come localized from data.js.

import { ResumeMatchButton } from '../ui/resumeMatch.js';
import { useEffect, useRef, useState } from '../../vendor/hooks.module.js';
import { DIFFICULTIES, DIFFICULTY_NAMES, DIFFICULTY_COLORS, ROOM_CODE_LEN, MAX_SEATS, MAX_SPECTATORS, modeIdFor, ERR } from '../../../shared/constants.js';
import { html, Button, Icon, MicroLabel, Panel, TextField, PingPill, AvatarFrame, Tooltip, Spinner, DifficultyIcon, doctorNo } from '../ui/components.js';
import { toast, toastError } from '../ui/toasts.js';
import { GuideButton } from '../ui/guide.js';
import { openStats } from './stats.js';
import { SettingsButton } from '../ui/settings.js';
import { PwaInstallButton } from '../ui/device.js';
import { LoadoutButton } from './loadout.js';
import { net, identity } from '../net.js';
import { store, useStore, shallowEqual, loadPref, savePref } from '../store.js';
import { data, getConfig, getMode, getStage, useData } from '../data.js';
import { t, tc, N_ } from '../../../shared/i18n.js';
import {
  defaultModOptions, enabledModBondMembers, MOD_ADDED_OPERATORS, MOD_BOND_IDS,
  MOD_EXISTING_OPERATOR_IDS, MOD_NEW_BOND_MEMBERS, MOD_STRATEGY_IDS, normalizeModOptions,
} from '../../../shared/mods.js';

/** Official mode texts (activity_table act2autochess.modeDataDict), fallback when config.json is absent. */
export const MODE_TEXT = {
  single: {
    FUNNY: { code: 'AC-1', desc: N_('时长较短的模拟训练'), effects: [N_('可以快速完成作战'), N_('常规奖励')] },
    NORMAL: { code: 'AC-2', desc: N_('敌方攻击强度较高的模拟训练'), effects: [N_('可使用盟约数增加'), N_('大幅增加奖励')] },
    HARD: { code: 'AC-3', desc: N_('敌方攻击强度极高的模拟训练'), effects: [N_('作战环境困难'), N_('出现更加危险的敌人')] },
    ABYSS: { code: 'AC-4', desc: N_('敌方攻击强度到达极限的模拟训练'), effects: [N_('作战环境无比困难'), N_('出现极度危险的敌人')] },
  },
  multi: {
    FUNNY: { code: 'AC-1', desc: N_('敌方攻击强度较低的模拟训练'), effects: [N_('作战环境较为温和'), N_('常规奖励')] },
    NORMAL: { code: 'AC-2', desc: N_('敌方攻击强度较高的模拟训练'), effects: [N_('可使用盟约数增加'), N_('大幅增加奖励')] },
    HARD: { code: 'AC-3', desc: N_('敌方攻击强度极高的模拟训练'), effects: [N_('作战环境困难'), N_('出现更加危险的敌人')] },
    ABYSS: { code: 'AC-4', desc: N_('敌方攻击强度到达极限的模拟训练'), effects: [N_('作战环境无比困难'), N_('出现极度危险的敌人')] },
  },
};

/** Battlefield pool per difficulty when config.json is absent (the modes' `stages` lists; same for solo and co-op). */
export const STAGE_POOL = { FUNNY: ['act1autochess_m01'], NORMAL: 8, HARD: 7, ABYSS: 7 };

/**
 * Display name of a stage: stages.json when it is loaded, else derived from the id (act1 m0N → 战场#0N, act2 m0N → 战场#0(N+4)).
 * From the data name only its 战场#NN part (with a (上半) / (下半) mark) — 'Battlefield #NN (First Half)' in English.
 * @param {string} id e.g. 'act1autochess_m01'
 */
export function stageLabel(id) {
  const rec = getStage(id);
  if (rec && typeof rec.name === 'string' && rec.name) {
    const m = rec.name.match(/^(.*?#\d+(?:\s*[(（][^)）]*[)）])?)/);
    return m ? m[1] : rec.name.split(/\s+/)[0];
  }
  const m = String(id || '').match(/^act(\d)autochess_m(\d+)$/);
  return m ? t('战场#{no}', { no: String(Number(m[2]) + (m[1] === '2' ? 4 : 0)).padStart(2, '0') }) : '';
}

/**
 * The battlefield note of a difficulty (official wording): a single-stage pool is fixed ("战场固定为 战场#01"), a larger
 * one is drawn at random ("战场随机（共8张）").
 * @param {string[] | number | null | undefined} stages the mode's `stages` list (or a count)
 * @returns {string} '' when unknown
 */
export function stageNote(stages) {
  if (Array.isArray(stages)) {
    const ids = stages.filter((s) => typeof s === 'string' && s);
    if (ids.length === 1) { const name = stageLabel(ids[0]); return name ? t('战场固定为 {name}', { name }) : t('战场固定'); }
    return ids.length > 1 ? t('战场随机（共{n}张）', { n: ids.length }) : '';
  }
  return Number.isInteger(stages) && stages > 1 ? t('战场随机（共{stages}张）', { stages }) : '';
}

const MODE_CARDS = [
  {
    id: 'solo', name: N_('独立模拟'), en: 'SOLO SIMULATION', icon: 'user',
    desc: N_('独自调配资金与干员，以自己的节奏完成整场模拟。'),
    points: [N_('1 名博士'), N_('休整期与机变阶段不限时')],
  },
  {
    id: 'coop', name: N_('同盟模拟'), en: 'ALLIANCE SIMULATION', icon: 'users',
    desc: N_('与至多 {n} 名博士组成同盟，共享干员池，联防协作抵御敌潮。'), params: { n: MAX_SEATS - 1 },
    points: [N_('1–{n} 名博士 · 可由 AI 队友补位'), N_('联防阶段 · 最终攻势合并生命值')], pointParams: { n: MAX_SEATS },
  },
];

/**
 * Text for a difficulty card, preferring data/config.json.
 * @param {'solo'|'coop'} roomMode
 * @param {string} difficulty
 * @returns {{ code: string, desc: string, effects: string[], rounds: number, hidden: boolean, stageNote: string }}
 */
export function difficultyInfo(roomMode, difficulty) {
  const fallback = MODE_TEXT[roomMode === 'solo' ? 'single' : 'multi'][difficulty] || { code: '', desc: '', effects: [] };
  // modeIdFor() lower-cases the difficulty: never call it with a value the server did not validate.
  const m = DIFFICULTIES.includes(difficulty) ? getMode(modeIdFor(roomMode, difficulty)) : null;
  const effects = Array.isArray(m?.effectDescList)
    ? m.effectDescList.map((e) => String(e).replace(/^[·•・･\s]+/, '')).filter(Boolean)
    : fallback.effects.map((e) => t(e));
  const rounds = Number.isFinite(m?.lastRound) ? m.lastRound : roomMode === 'solo' && difficulty === 'FUNNY' ? 9 : 14;
  return {
    code: typeof m?.code === 'string' ? m.code : fallback.code,
    desc: typeof m?.desc === 'string' ? m.desc : t(fallback.desc),
    effects,
    rounds,
    hidden: difficulty !== 'FUNNY',
    stageNote: stageNote(Array.isArray(m?.stages) && m.stages.length ? m.stages : STAGE_POOL[difficulty]),
  };
}

const CODE_RE = new RegExp(`^[A-Z0-9]{${ROOM_CODE_LEN}}$`);
/**
 * Normalise user input into a room code: accepts a pasted invite link (`…?room=ABCD`), keeps
 * upper-cased alphanumerics and clamps to the code length.
 * @param {string} v
 * @returns {string}
 */
export function normalizeCode(v) {
  let s = String(v ?? '');
  const m = s.match(/[?&]room=([A-Za-z0-9]+)/);
  if (m) s = m[1];
  return s.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, ROOM_CODE_LEN);
}

/**
 * A handler that Preact binds as `onClick=${fn}` receives the click EVENT as its first argument, and a default
 * parameter only applies to `undefined` — so `fn(c = code)` would normalise the event target into a nonsense code
 * (`String(el)` → `"[object HTMLElement]"` → "OBJE"). Only a string is ever a code; anything else falls back to the
 * input field. Returns null when neither yields a well-formed code.
 * @param {unknown} arg the argument a handler was called with
 * @param {string} field the current input-field value
 * @returns {string|null}
 */
export function codeArg(arg, field) {
  const k = normalizeCode(typeof arg === 'string' ? arg : field);
  return CODE_RE.test(k) ? k : null;
}

/**
 * Room code from a deep link query string (`?room=CODE`), or null when absent/malformed.
 * Accepts ROOM_CODE_LEN..ROOM_CODE_LEN+2 alphanumerics (the protocol's join limit).
 * @param {string} search e.g. location.search
 * @returns {string|null}
 */
export function parseRoomParam(search) {
  try {
    const raw = new URLSearchParams(search || '').get('room');
    if (!raw) return null;
    const code = raw.trim().toUpperCase();
    if (!/^[A-Z0-9]+$/.test(code)) return null;
    return code.length >= ROOM_CODE_LEN && code.length <= ROOM_CODE_LEN + 2 ? code : null;
  } catch {
    return null;
  }
}

/** Recently joined/created co-op room codes (most recent first). */
export function recentRooms() {
  const list = loadPref('recentRooms', []);
  return Array.isArray(list) ? list.filter((c) => typeof c === 'string' && CODE_RE.test(c)).slice(0, 4) : [];
}

/** @param {string} code */
export function rememberRoom(code) {
  if (!CODE_RE.test(code)) return;
  savePref('recentRooms', [code, ...recentRooms().filter((c) => c !== code)].slice(0, 4));
}

const FALLBACK_TIPS = [
  N_('联合模拟在选择策略时可以进行一次跳过'),
  N_('调度中心即使冻结，依然可以主动刷新'),
  N_('两件同名装备可以合成一件更强力的装备'),
  N_('只有达成完美作战的队友可以进行联防'),
];
const TIP_ROTATE_MS = 5000; // matchingTipRotateInterval

/** Rotating tactical tips (config.json `tips`, weighted list of { tip, weight }). */
function TipsPanel() {
  const cfg = getConfig();
  const fallback = FALLBACK_TIPS.map((x) => t(x));
  const tips = Array.isArray(cfg?.tips)
    ? cfg.tips.map((x) => (typeof x === 'string' ? x : x?.tip)).filter((x) => typeof x === 'string' && x)
    : fallback;
  const list = tips.length ? tips : fallback;
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * list.length));
  useEffect(() => {
    const id = setInterval(() => setIdx((i) => i + 1), TIP_ROTATE_MS);
    return () => clearInterval(id);
  }, []);
  const i = ((idx % list.length) + list.length) % list.length;
  return html`<div class="tips brackets">
    <div class="tips__head">
      <${Icon} name="info" />
      <span>${t('作战提示')}</span>
      <${MicroLabel}>TACTICAL TIPS<//>
      <span class="tips__idx num">${String(i + 1).padStart(2, '0')}<span class="t-dim">/${String(list.length).padStart(2, '0')}</span></span>
      <button type="button" class="tips__nav" onClick=${() => setIdx(i - 1 + list.length)} aria-label=${t('上一条')}><${Icon} name="chevronLeft" /></button>
      <button type="button" class="tips__nav" onClick=${() => setIdx(i + 1)} aria-label=${t('下一条')}><${Icon} name="chevronRight" /></button>
    </div>
    <p key=${i} class="tips__text">${list[i]}</p>
  </div>`;
}

function ModeCard({ card, selected, onSelect }) {
  return html`<button type="button" class=${`mode-card brackets${selected ? ' is-selected' : ''}`} onClick=${() => onSelect(card.id)}
      aria-pressed=${selected ? 'true' : 'false'}>
    <span class="mode-card__bg" aria-hidden="true"></span>
    <span class="mode-card__icon"><${Icon} name=${card.icon} /></span>
    <span class="mode-card__text">
      <${MicroLabel} tone=${selected ? 'mint' : undefined}>${card.en}<//>
      <span class="mode-card__name">${t(card.name)}</span>
      <span class="mode-card__desc">${t(card.desc, card.params)}</span>
      <span class="mode-card__points">${card.points.map((p) => html`<span key=${p}>${t(p, card.pointParams)}</span>`)}</span>
    </span>
    <span class="mode-card__check" aria-hidden="true"><${Icon} name="check" />${t('已选定')}</span>
  </button>`;
}

function DifficultyCard({ roomMode, difficulty, selected, onSelect }) {
  const info = difficultyInfo(roomMode, difficulty);
  return html`<button type="button" class=${`diff-card${selected ? ' is-selected' : ''}`}
      style=${`--d-color:${DIFFICULTY_COLORS[difficulty]}`} onClick=${() => onSelect(difficulty)} aria-pressed=${selected ? 'true' : 'false'}>
    <span class="diff-card__bar" aria-hidden="true"></span>
    <span class="diff-card__head">
      <${DifficultyIcon} difficulty=${difficulty} class="diff-card__glyph" />
      <span class="diff-card__name">${t(DIFFICULTY_NAMES[difficulty])}</span>
      <span class="diff-card__code num">${info.code}</span>
      <span class="diff-card__meta">
        <span class="num">${info.rounds}</span> ${tc('rounds', '回合')}${info.hidden ? html`<span class="diff-card__hidden">${t('+ 隐秘核心')}</span>` : null}
      </span>
    </span>
    <span class="diff-card__desc">${info.desc}</span>
    <span class="diff-card__effects">${info.effects.map((e) => html`<span key=${e}>${e}</span>`)}${info.stageNote ? html`<span key="stage" class="diff-card__stage"><${Icon} name="rook" />${info.stageNote}</span>` : null}</span>
    <span class="diff-card__check" aria-hidden="true"><${Icon} name="check" /><span>${t('已选定')}</span></span>
  </button>`;
}

/** Lobby screen component. */
export function LobbyScreen() {
  const me = useStore((s) => s.me, shallowEqual);
  const conn = useStore((s) => s.connection, shallowEqual);
  useData('config');
  const managerDataReady = useData('chess', 'backups', 'bonds');
  const [roomMode, setRoomMode] = useState(() => (loadPref('lobby.mode', 'coop') === 'solo' ? 'solo' : 'coop'));
  const [difficulty, setDifficulty] = useState(() => {
    const d = loadPref('lobby.difficulty', 'FUNNY');
    return DIFFICULTIES.includes(d) ? d : 'FUNNY';
  });
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(null);
  const [modEnabled, setModEnabled] = useState(() => loadPref('mods.marisa', false) === true);
  const [modOptions, setModOptions] = useState(() => normalizeModOptions(loadPref('mods.marisa.options', defaultModOptions())));
  const [managerSearch, setManagerSearch] = useState('');
  useEffect(() => { data.setProfile(modEnabled ? ['marisa'] : [], modEnabled ? modOptions : null); }, [modEnabled, modOptions]);
  const [recent] = useState(recentRooms);
  const alive = useRef(true);
  const inFlight = useRef(false); // synchronous guard against double clicks (state updates are async)
  useEffect(() => () => { alive.current = false; }, []);

  const online = conn.status === 'online';
  const codeOk = CODE_RE.test(code);

  const pickMode = (m) => { setRoomMode(m); savePref('lobby.mode', m); };
  const pickDifficulty = (d) => { setDifficulty(d); savePref('lobby.difficulty', d); };
  const updateModOptions = (fn) => setModOptions((prev) => {
    const next = normalizeModOptions(fn(prev));
    savePref('mods.marisa.options', next);
    return next;
  });
  const baseOperators = (() => {
    const changed = new Set(MOD_EXISTING_OPERATOR_IDS);
    const found = new Map();
    for (const c of data.list('chess')) {
      if (!c?.charId || c.isGolden || c.isDiy || !changed.has(c.charId)) continue;
      if (!found.has(c.charId)) found.set(c.charId, { charId: c.charId, name: c.name || c.charId });
    }
    const diyOps = data.get('backups')?.diy?.operators || {};
    const units = data.get('backups')?.units || {};
    for (const [charId, op] of Object.entries(diyOps)) {
      if (!changed.has(charId) || found.has(charId)) continue;
      found.set(charId, { charId, name: units[charId]?.name || op.name || charId });
    }
    return [...found.values()].sort((a, b) => a.name.localeCompare(b.name));
  })();
  const diyOperators = data.get('backups')?.units || {};
  const renderBaseOperators = baseOperators;
  const modOperatorName = (charId) => diyOperators[charId]?.name
    || data.list('chess').find((c) => c?.charId === charId)?.name
    || charId;
  const existingBondMemberGroups = new Map();
  for (const member of enabledModBondMembers(modOptions)) {
    const members = existingBondMemberGroups.get(member.bondId) || [];
    members.push(member);
    existingBondMemberGroups.set(member.bondId, members);
  }

  const run = async (kind, fn) => {
    if (inFlight.current) return;
    if (!online) { toast(t('尚未连接到服务器，请稍候'), 'warn'); return; }
    inFlight.current = true;
    setBusy(kind);
    try { await fn(); } catch (err) { toastError(err); } finally {
      inFlight.current = false;
      if (alive.current) setBusy(null);
    }
  };
  const create = () => run('create', () => net.request('room.create', {
    mode: roomMode, difficulty, mods: modEnabled ? ['marisa'] : [], ...(modEnabled ? { modOptions } : {}),
  }));
  const join = (c = code) => {
    // `onClick=${join}` hands the click EVENT as the first argument, and a default parameter only applies to
    // `undefined` — codeArg keeps an event target out of the key and falls back to the input field
    const k = codeArg(c, code);
    if (!k) { toast(t('同盟密钥为 {ROOM_CODE_LEN} 位字母或数字', { ROOM_CODE_LEN }), 'warn'); return; }
    run('join', () => net.request('room.join', { code: k }));
  };
  // a spectator seat: no player seat taken, nothing to do but watch (also a match already running)
  const spectate = (c = code) => {
    // same guard as join: `onClick=${spectate}` passes the click event, not a code
    const k = codeArg(c, code);
    if (!k) { toast(t('同盟密钥为 {ROOM_CODE_LEN} 位字母或数字', { ROOM_CODE_LEN }), 'warn'); return; }
    run('spectate', () => net.request('room.spectate', { code: k }).catch((err) => {
      // Clearer than the bare ERR_TEXT: the usual cause is a code that is not the host's (a remembered one from an
      // earlier room, or another machine's) — the server can only answer "no such room".
      if (err?.code === ERR.ROOM_NOT_FOUND) {
        toast(t('没有找到密钥 {k} 对应的同盟：请和房主核对密钥（同盟结束后密钥即失效）', { k }), 'warn');
        return;
      }
      if (err?.code === ERR.ALREADY) {
        toast(t('你已经是该同盟的博士：先离开同盟，才能以观战身份进入'), 'warn');
        return;
      }
      throw err;
    }));
  };
  const backToTitle = () => {
    identity.setEntered(false);
    store.set((s) => ({ session: { ...s.session, entered: false } }));
  };

  return html`<div class="screen lobby-screen">
    <header class="topbar">
      <div class="topbar__left">
        <${Button} variant="ghost" size="sm" icon="chevronLeft" onClick=${backToTitle} title=${t('返回标题')}>${t('返回')}<//>
        <${PingPill} ms=${conn.ping} online=${online} />
        <span class="topbar__sep" aria-hidden="true"></span>
        <div class="topbar__tools">
          <${SettingsButton} class="lobby-settings" variant="secondary" square=${true} />
          <${GuideButton} class="lobby-guide" variant="secondary" square=${true} />
          <${PwaInstallButton} class="lobby-pwa" square=${true} />
        </div>
      </div>
      <div class="topbar__center">
        <${MicroLabel} tone="mint">SIMULATION PROTOCOL SELECT<//>
        <h1 class="topbar__title">${t('选择模拟协议')}</h1>
      </div>
      <div class="topbar__right">
        <${ResumeMatchButton} />
        <${LoadoutButton} from="lobby" size="sm" class="lobby-loadout" label=${t('干员调配')} />
        <button type="button" class="me-chip me-chip--btn stats-entry" onClick=${openStats} title=${t('统计数据')} aria-label=${t('统计数据')}>
          <${AvatarFrame} size="sm" name=${me.name} seat=${0} self=${true} />
          <span class="me-chip__text">
            <span class="me-chip__name">${me.name || t('博士')}</span>
            <${MicroLabel}>${me.playerId != null ? `DOCTOR #${doctorNo(me.playerId)}` : 'DOCTOR'}<//>
          </span>
          <${Icon} name="chart" class="me-chip__stats" />
        </button>
      </div>
    </header>

    <div class="lobby-body screen__scroll">
      <section class="lobby-left">
        <div class="section-label"><span class="section-label__idx num">01</span>${t('模拟方式')}<${MicroLabel}>MODE<//></div>
        <div class="mode-cards">
          ${MODE_CARDS.map((c) => html`<${ModeCard} key=${c.id} card=${c} selected=${roomMode === c.id} onSelect=${pickMode} />`)}
        </div>

        <div class="section-label"><span class="section-label__idx num">03</span>${t('加入同盟')}<${MicroLabel}>JOIN WITH ALLIANCE KEY<//></div>
        <${Panel} class="join-panel" tone="amber">
          <div class="join-row">
            <${TextField} size="code" icon="key" value=${code} placeholder=${t('输入同盟密钥 / 粘贴邀请链接')}
              transform=${normalizeCode} onInput=${(v) => setCode(normalizeCode(v))} onEnter=${() => join()} />
            <${Button} variant="amber" size="lg" icon="users" loading=${busy === 'join'} disabled=${!codeOk || !online} onClick=${() => join()}>${t('加入同盟')}<//>
            <${Tooltip} text=${t('以观战者身份进入：不占博士席位，只能观看（每个同盟最多 {MAX_SPECTATORS} 名，模拟进行中也可进入）', { MAX_SPECTATORS })}>
              <${Button} variant="secondary" size="lg" icon="eye" class="join-spectate" loading=${busy === 'spectate'} disabled=${!codeOk || !online} onClick=${spectate}>${t('观战')}<//>
            <//>
          </div>
          <div class="join-foot">
            ${recent.length ? html`<span class="t-lo">${t('最近的同盟')}</span>
              ${recent.map((c) => html`<button key=${c} type="button" class="code-chip num" title=${t('填入密钥（不会直接加入）')}
                onClick=${() => setCode(c)}>${c}</button>`)}`
              : html`<span class="t-dim">${t('向同伴索取 {ROOM_CODE_LEN} 位同盟密钥，或直接打开邀请链接', { ROOM_CODE_LEN })}</span>`}
          </div>
        <//>
        <${TipsPanel} />
      </section>

      <section class="lobby-right">
        <div class="section-label"><span class="section-label__idx num">02</span>${t('模拟难度')}<${MicroLabel}>DIFFICULTY<//></div>
        <div class="diff-list">
          ${DIFFICULTIES.map((d) => html`<${DifficultyCard} key=${d} roomMode=${roomMode} difficulty=${d} selected=${difficulty === d} onSelect=${pickDifficulty} />`)}
        </div>
        <div class="create-box">
          <details class="mod-manager">
            <summary>${t('MOD 管理器')}</summary>
            <label class="mod-manager__master"><input type="checkbox" checked=${modEnabled} onChange=${(ev) => { const on = ev.target.checked; setModEnabled(on); savePref('mods.marisa', on); }} /> ${t('启用魔理沙追加 MOD')}</label>
            ${modEnabled && html`
            <p>${t('创建房间时生效；加入者与观战者自动使用房间配置。')}</p>
            <p>${t('魔理沙追加 MOD 与干员装备模组是两种不同设置；这里不会更改干员装备模组。')}</p>
            <details class="mod-manager__group">
              <summary>${t('已有干员的魔理沙 MOD 改动')} <span>${renderBaseOperators.length}</span></summary>
              <label><input type="checkbox" checked=${modOptions.existing.enabled} disabled=${!modEnabled} onChange=${(ev) => updateModOptions((p) => ({ ...p, existing: { ...p.existing, enabled: ev.target.checked } }))} /> ${t('启用已有干员的魔理沙 MOD 改动')}</label>
              <p>${t('仅列出当前数据中受魔理沙 MOD 改动的原版干员。')}</p>
              <input class="mod-manager__search" type="search" placeholder=${t('搜索干员')} disabled=${!modEnabled} value=${managerSearch} onInput=${(ev) => setManagerSearch(ev.target.value)} />
              ${managerDataReady ? html`<div class="mod-manager__list">
                ${renderBaseOperators.filter((op) => !managerSearch || op.name.toLowerCase().includes(managerSearch.toLowerCase()) || op.charId.toLowerCase().includes(managerSearch.toLowerCase())).map((op) => html`
                  <label key=${op.charId} title=${op.charId}>
                    <span>${op.name}</span>
                    <select disabled=${!modEnabled || !modOptions.existing.enabled} value=${modOptions.existing.vanillaChars.includes(op.charId) ? 'original' : 'mod'} onChange=${(ev) => updateModOptions((p) => ({
                      ...p, existing: { ...p.existing, vanillaChars: ev.target.value === 'original'
                        ? [...new Set([...p.existing.vanillaChars, op.charId])]
                        : p.existing.vanillaChars.filter((id) => id !== op.charId) },
                    }))}>
                      <option value="original">${t('原版效果')}</option><option value="mod">${t('魔理沙 MOD 改动')}</option>
                    </select>
                  </label>`)}
              </div>` : html`<p>${t('正在读取干员数据…')}</p>`}
            </details>
            <details class="mod-manager__group">
              <summary>${t('追加干员')} <span>${MOD_ADDED_OPERATORS.length}</span></summary>
              <label><input type="checkbox" checked=${modOptions.additions.enabled} disabled=${!modEnabled} onChange=${(ev) => updateModOptions((p) => ({ ...p, additions: { ...p.additions, enabled: ev.target.checked } }))} /> ${t('启用追加干员')}</label>
              <p>${t('自选候选在 V、VI 阶均可选择，同一干员只能编入一个位置；不会进入普通商店。')}</p>
              <div class="mod-manager__list mod-manager__list--operators">
                ${MOD_ADDED_OPERATORS.map((op) => html`<label key=${op.charId} title=${op.charId}>
                  <input type="checkbox" checked=${!modOptions.additions.disabledChars.includes(op.charId)} disabled=${!modEnabled || !modOptions.additions.enabled} aria-label=${t('启用此干员')} onChange=${(ev) => updateModOptions((p) => ({
                    ...p, additions: { ...p.additions, disabledChars: ev.target.checked
                      ? p.additions.disabledChars.filter((id) => id !== op.charId)
                      : [...new Set([...p.additions.disabledChars, op.charId])].sort() },
                  }))} />
                  <span>${modOperatorName(op.charId)}</span>
                  <select disabled=${!modEnabled || !modOptions.additions.enabled || modOptions.additions.disabledChars.includes(op.charId)} value=${modOptions.additions.diyChars.includes(op.charId) ? 'diy' : 'shop'} onChange=${(ev) => updateModOptions((p) => ({
                    ...p, additions: { ...p.additions, diyChars: ev.target.value === 'diy'
                      ? [...new Set([...p.additions.diyChars, op.charId])]
                      : p.additions.diyChars.filter((id) => id !== op.charId) },
                  }))}>
                    <option value="shop">${t('按魔理沙 MOD 默认方式从商店获取')}</option><option value="diy">${t('加入自选候选名单')}</option>
                  </select>
                </label>`)}
              </div>
            </details>
            <details class="mod-manager__group">
              <summary>${t('现有盟约追加干员')} <span>${existingBondMemberGroups.size}</span></summary>
              <p>${t('选择是否将已启用的魔理沙 MOD 干员加入对应的原版盟约；关闭干员后会隐藏它的盟约选项。')}</p>
              ${existingBondMemberGroups.size ? [...existingBondMemberGroups.entries()].map(([bondId, members]) => html`
                <details class="mod-manager__group mod-manager__group--nested" key=${bondId}>
                  <summary>${data.lookup('bonds', bondId)?.name || bondId} <span>${members.length}</span></summary>
                  <div class="mod-manager__list mod-manager__list--checks">
                    ${members.map(({ charId }) => {
                      const memberId = `${bondId}:${charId}`;
                      return html`<label key=${memberId} title=${memberId}>
                        <span>${modOperatorName(charId)}</span>
                        <input type="checkbox" checked=${!modOptions.existingBondMembers.disabledIds.includes(memberId)} disabled=${!modEnabled} aria-label=${t('加入此盟约')} onChange=${(ev) => updateModOptions((p) => ({
                          ...p, existingBondMembers: { disabledIds: ev.target.checked
                            ? p.existingBondMembers.disabledIds.filter((id) => id !== memberId)
                            : [...new Set([...p.existingBondMembers.disabledIds, memberId])].sort() },
                        }))} />
                      </label>`;
                    })}
                  </div>
                </details>`)
                : html`<p>${t('当前没有已启用的干员可加入原版盟约。')}</p>`}
            </details>
            <details class="mod-manager__group">
              <summary>${t('追加盟约')} <span>${MOD_BOND_IDS.length}</span></summary>
              <label><input type="checkbox" checked=${modOptions.bonds.enabled} disabled=${!modEnabled} onChange=${(ev) => updateModOptions((p) => ({ ...p, bonds: { ...p.bonds, enabled: ev.target.checked } }))} /> ${t('启用追加盟约')}</label>
              <p>${t('关闭选项只会移除魔理沙 MOD 新增的盟约归属；无盟约的在场干员自动使用协防干员。')}</p>
              <p>${t('成员开关优先于干员的原版或 MOD 选择，只改变盟约归属；盟约总开关关闭时所有成员均不生效。')}</p>
              ${MOD_BOND_IDS.map((id) => html`<div class="mod-manager__bond" key=${id}>
                <label title=${id}>
                  <span>${data.lookup('bonds', id)?.name || (id === 'rhodeShip' ? t('罗德岛') : id)}</span>
                  <input type="checkbox" checked=${modOptions.bonds.enabled && !modOptions.bonds.disabledIds.includes(id)} disabled=${!modEnabled || !modOptions.bonds.enabled} onChange=${(ev) => updateModOptions((p) => ({
                    ...p, bonds: { ...p.bonds, disabledIds: ev.target.checked ? p.bonds.disabledIds.filter((x) => x !== id) : [...new Set([...p.bonds.disabledIds, id])].sort() },
                  }))} />
                </label>
                <div class="mod-manager__list mod-manager__list--checks mod-manager__members">
                  ${MOD_NEW_BOND_MEMBERS.filter((member) => member.bondId === id
                    && (!MOD_ADDED_OPERATORS.some((op) => op.charId === member.charId)
                      || (modOptions.additions.enabled && !modOptions.additions.disabledChars.includes(member.charId)))).map(({ charId }) => {
                    const memberId = `${id}:${charId}`;
                    const checked = modOptions.bonds.memberOverrides[memberId]
                      ?? !!(data.list('chess').some((rec) => rec.charId === charId && rec.bonds?.includes(id))
                        || data.get('backups')?.diy?.operators?.[charId]?.bonds?.includes(id));
                    return html`<label key=${memberId} title=${memberId}>
                      <span>${modOperatorName(charId)}</span>
                      <input type="checkbox" checked=${checked} disabled=${!modEnabled || !modOptions.bonds.enabled || modOptions.bonds.disabledIds.includes(id)} aria-label=${t('加入此盟约')} onChange=${(ev) => updateModOptions((p) => ({
                        ...p, bonds: { ...p.bonds, memberOverrides: { ...p.bonds.memberOverrides, [memberId]: ev.target.checked } },
                      }))} />
                    </label>`;
                  })}
                </div>
              </div>`)}
            </details>
            <details class="mod-manager__group">
              <summary>${t('追加策略')} <span>${MOD_STRATEGY_IDS.length}</span></summary>
              <label><input type="checkbox" checked=${modOptions.strategies.enabled} disabled=${!modEnabled} onChange=${(ev) => updateModOptions((p) => ({ ...p, strategies: { ...p.strategies, enabled: ev.target.checked } }))} /> ${t('启用追加策略')}</label>
              <div class="mod-manager__list mod-manager__list--checks">
                ${MOD_STRATEGY_IDS.map((id) => html`<label key=${id} title=${id}>
                  <span>${data.lookup('bands', id)?.name || (id === 'band_kun' ? t('鲲') : id)}</span>
                  <input type="checkbox" checked=${modOptions.strategies.enabled && !modOptions.strategies.disabledIds.includes(id)} disabled=${!modEnabled || !modOptions.strategies.enabled} onChange=${(ev) => updateModOptions((p) => ({
                    ...p, strategies: { ...p.strategies, disabledIds: ev.target.checked ? p.strategies.disabledIds.filter((x) => x !== id) : [...new Set([...p.strategies.disabledIds, id])].sort() },
                  }))} />
                </label>`)}
              </div>
            </details>
            `}
          </details>
          <${Tooltip} block=${true} text=${online ? null : t('正在连接服务器…')}>
            <${Button} variant="primary" size="xl" block=${true} iconRight="chevrons" loading=${busy === 'create'} disabled=${!online} onClick=${create}>
              ${roomMode === 'solo' ? t('开始独立模拟') : t('创建同盟')}
            <//>
          <//>
          <div class="create-box__hint">
            ${online
              ? html`<span>${roomMode === 'solo' ? t('创建后即可开始模拟') : t('创建后可邀请好友或添加 AI 队友')}</span>`
              : html`<${Spinner} size="sm" label="CONNECTING" />`}
          </div>
        </div>
      </section>
    </div>
  </div>`;
}
