// mods/marisa-native/source/shared/i18nPacks.js
var SOURCE_LANG = "zh";

// mods/marisa-native/source/shared/i18n.js
var SOURCE_META = Object.freeze({
  code: SOURCE_LANG,
  name: "\u4E2D\u6587",
  englishName: "Chinese (Simplified)",
  authors: [],
  credits: "",
  version: "",
  app: "",
  // i18n-ignore: its own name
  base: null,
  fallback: [],
  complete: true,
  machineTranslated: false,
  numberUnits: ["\u4E07", "\u4EBF"],
  builtin: true
  // i18n-ignore: the Chinese number units
});
var PLURAL_CATEGORIES = Object.freeze(["zero", "one", "two", "few", "many", "other"]);
var N_ = (s) => s;

// mods/marisa-native/source/shared/constants.js
var APP_VERSION = "0.3.0";
var DEV_BUILD = /-dev$/.test(APP_VERSION);
var PLUGIN_API = Object.freeze({ current: 1, min: 1 });
var DIFFICULTY_NAMES = { FUNNY: N_("\u6807\u51C6\u6A21\u62DF"), NORMAL: N_("\u9669\u5883\u6A21\u62DF"), HARD: N_("\u7EDD\u5883\u6A21\u62DF"), ABYSS: N_("\u7EC8\u6781\u6A21\u62DF") };
var PHASE = Object.freeze({
  LOBBY: "LOBBY",
  INFO_CHECK: "INFO_CHECK",
  BAND_DRAFT: "BAND_DRAFT",
  BATTLE_CHECK: "BATTLE_CHECK",
  ROUND_START: "ROUND_START",
  SP_DRAFT: "SP_DRAFT",
  PREP: "PREP",
  COMBAT: "COMBAT",
  UNITE: "UNITE",
  SETTLE: "SETTLE",
  FINAL_ASSAULT: "FINAL_ASSAULT",
  HIDDEN_CORE: "HIDDEN_CORE",
  RESULT: "RESULT"
});
var PHASE_NAMES = {
  LOBBY: N_("\u7B49\u5F85\u4E2D"),
  INFO_CHECK: N_("\u786E\u8BA4\u672C\u5C40\u4FE1\u606F"),
  BAND_DRAFT: N_("\u9009\u62E9\u7B56\u7565"),
  BATTLE_CHECK: N_("\u534F\u8BAE\u542F\u52A8"),
  ROUND_START: N_("\u56DE\u5408\u5F00\u59CB"),
  SP_DRAFT: N_("\u673A\u53D8\u9636\u6BB5"),
  PREP: N_("\u4F11\u6574\u671F"),
  COMBAT: N_("\u4F5C\u6218\u4E2D"),
  UNITE: N_("\u8054\u9632\u9636\u6BB5"),
  SETTLE: N_("\u7ED3\u7B97"),
  FINAL_ASSAULT: N_("\u6700\u7EC8\u653B\u52BF"),
  HIDDEN_CORE: N_("\u9690\u79D8\u6838\u5FC3"),
  RESULT: N_("\u6A21\u62DF\u7ED3\u675F")
};
var GEO = Object.freeze({
  ROWS: 19,
  COLS: 21,
  FIELD: { r0: 9, r1: 12, c0: 2, c1: 10 },
  // own deployable board region
  NORMAL_RECT: { r0: 9, r1: 12, c0: 0, c1: 10 },
  // simulation rect for a normal battle
  UNITE_RECT: { r0: 9, r1: 12, c0: 0, c1: 20 },
  BOSS_RECT: { r0: 0, r1: 5, c0: 0, c1: 20 },
  HAND_ROW: 7,
  HAND_SIZE: 10,
  // hand slot idx = col 0..9
  TEMP_ROW: 8,
  TEMP_C0: 4,
  TEMP_SIZE: 5,
  // temp slot idx 0..4 = cols 4..8
  PARTNER_COL_OFFSET: 8
});
var AREA = Object.freeze({ BOARD: "board", HAND: "hand", TEMP: "temp", OUTSIDE: "outside" });
var PIECE_KIND = Object.freeze({ CHESS: "chess", ITEM: "item", TOKEN: "token" });
var BOND_LAYER_CAP = 999;
function layerGainRoom(before, n) {
  if (!(n > 0)) return 0;
  const cap = BOND_LAYER_CAP > 0 ? BOND_LAYER_CAP : Infinity;
  const b = Number.isFinite(before) && before > 0 ? before : 0;
  return Math.max(0, Math.min(n, cap - b));
}
var UF = Object.freeze({
  BLOCKED: 1,
  STUNNED: 2,
  FROZEN: 4,
  STEALTH: 8,
  SKILL: 16,
  SHIELD: 32,
  INVULN: 64,
  COLD: 128,
  SLEEP: 256,
  FLYING: 512,
  LIFTOFF: 1024
  // Active 起飞 buff; distinct from a unit whose intrinsic motion is FLY.
});
var ANIM = Object.freeze({ IDLE: 0, MOVE: 1, ATTACK: 2, SKILL: 3, DIE: 4, STUN: 5, DEPLOY: 6 });
var ERR = Object.freeze({
  BAD_MSG: "BAD_MSG",
  // malformed / unknown message
  SESSION_IN_USE: "SESSION_IN_USE",
  // a local recovery candidate cannot replace the connected holder
  RATE: "RATE",
  // rate limited
  NOT_IN_ROOM: "NOT_IN_ROOM",
  ROOM_NOT_FOUND: "ROOM_NOT_FOUND",
  ROOM_FULL: "ROOM_FULL",
  ROOM_STARTED: "ROOM_STARTED",
  NOT_HOST: "NOT_HOST",
  NOT_READY: "NOT_READY",
  WRONG_PHASE: "WRONG_PHASE",
  NO_FUNDS: "NO_FUNDS",
  HAND_FULL: "HAND_FULL",
  BOARD_FULL: "BOARD_FULL",
  BAD_TILE: "BAD_TILE",
  BAD_TARGET: "BAD_TARGET",
  SOLD_OUT: "SOLD_OUT",
  MAX_LEVEL: "MAX_LEVEL",
  NOT_YOUR_TURN: "NOT_YOUR_TURN",
  ALREADY: "ALREADY",
  TEMP_NOT_EMPTY: "TEMP_NOT_EMPTY",
  ELIMINATED: "ELIMINATED",
  SPECTATOR: "SPECTATOR",
  // a spectator seat only watches (MAX_SPECTATORS)
  // room.setPlugins (DESIGN §32): a plugin this server has not installed; one a room cannot switch on in this version
  // (not a cosmetic or content plugin it loads, not of the room's scope, or not allowed by the server owner's
  // plugins/config.json); a requirement missing or out of range, or a load-order cycle; two plugins in conflict; a set
  // over the art size limit
  PLUGIN_SCRIPT_CONFLICT: "PLUGIN_SCRIPT_CONFLICT",
  PLUGIN_SCRIPT_OVERRIDE: "PLUGIN_SCRIPT_OVERRIDE",
  PLUGIN_SCRIPT_CHECK: "PLUGIN_SCRIPT_CHECK",
  PLUGIN_SCRIPTS_DISABLED: "PLUGIN_SCRIPTS_DISABLED",
  PLUGIN_TRUST_PIN: "PLUGIN_TRUST_PIN",
  PLUGIN_TRUST_PUBLIC: "PLUGIN_TRUST_PUBLIC",
  PLUGIN_CONSENT: "PLUGIN_CONSENT",
  PLUGIN_UNKNOWN: "PLUGIN_UNKNOWN",
  PLUGIN_BLOCKED: "PLUGIN_BLOCKED",
  PLUGIN_DEPENDENCY: "PLUGIN_DEPENDENCY",
  PLUGIN_CONFLICT: "PLUGIN_CONFLICT",
  PLUGIN_LIMIT: "PLUGIN_LIMIT",
  // P1c (DESIGN §32.6): a gameplay plugin made for other game versions or another plugin API (refused unless the server
  // owner allows it: plugins/config.json allowIncompatible); the server already runs as many plugin content sets as its
  // limit allows (plugins/config.json limits.maxSets); room.ready / room.start before every player's page has loaded and
  // checked the room's content (room.contentReady)
  PLUGIN_INCOMPATIBLE: "PLUGIN_INCOMPATIBLE",
  PLUGIN_BUSY: "PLUGIN_BUSY",
  CONTENT_NOT_READY: "CONTENT_NOT_READY",
  INTERNAL: "INTERNAL"
});
var ERR_TEXT = {
  SESSION_IN_USE: N_("\u6B64\u5BF9\u5C40\u4ECD\u5728\u5176\u4ED6\u7A97\u53E3\u4E2D\uFF0C\u6216\u5F53\u524D\u6D4F\u89C8\u5668\u65E0\u6CD5\u5B89\u5168\u6062\u590D\u3002\u8BF7\u5173\u95ED\u539F\u7A97\u53E3\u540E\u91CD\u8BD5\u3002"),
  BAD_MSG: N_("\u65E0\u6548\u7684\u8BF7\u6C42"),
  RATE: N_("\u64CD\u4F5C\u8FC7\u4E8E\u9891\u7E41"),
  NOT_IN_ROOM: N_("\u4F60\u4E0D\u5728\u623F\u95F4\u4E2D"),
  ROOM_NOT_FOUND: N_("\u672A\u627E\u5230\u8BE5\u540C\u76DF\u5BC6\u94A5\u5BF9\u5E94\u7684\u623F\u95F4"),
  ROOM_FULL: N_("\u623F\u95F4\u5DF2\u6EE1"),
  ROOM_STARTED: N_("\u6A21\u62DF\u5DF2\u5F00\u59CB"),
  NOT_HOST: N_("\u53EA\u6709\u623F\u4E3B\u53EF\u4EE5\u64CD\u4F5C"),
  NOT_READY: N_("\u4ECD\u6709\u73A9\u5BB6\u672A\u5C31\u7EEA"),
  WRONG_PHASE: N_("\u5F53\u524D\u9636\u6BB5\u65E0\u6CD5\u8FDB\u884C\u8BE5\u64CD\u4F5C"),
  NO_FUNDS: N_("\u8D44\u91D1\u4E0D\u8DB3"),
  HAND_FULL: N_("\u6574\u5907\u533A\u5DF2\u6EE1"),
  BOARD_FULL: N_("\u5DF2\u8FBE\u5230\u90E8\u7F72\u4E0A\u9650"),
  BAD_TILE: N_("\u65E0\u6CD5\u90E8\u7F72\u5728\u8BE5\u4F4D\u7F6E"),
  BAD_TARGET: N_("\u65E0\u6548\u7684\u76EE\u6807"),
  SOLD_OUT: N_("\u5DF2\u552E\u51FA"),
  MAX_LEVEL: N_("\u8C03\u5EA6\u4E2D\u5FC3\u5DF2\u8FBE\u6700\u9AD8\u7B49\u7EA7"),
  NOT_YOUR_TURN: N_("\u5C1A\u672A\u8F6E\u5230\u4F60"),
  ALREADY: N_("\u5DF2\u5B8C\u6210\u8BE5\u64CD\u4F5C"),
  TEMP_NOT_EMPTY: N_("\u4E34\u65F6\u6574\u5907\u533A\u4E0D\u4E3A\u7A7A"),
  ELIMINATED: N_("\u4F60\u5DF2\u88AB\u6DD8\u6C70"),
  SPECTATOR: N_("\u89C2\u6218\u4E2D\u65E0\u6CD5\u8FDB\u884C\u8BE5\u64CD\u4F5C"),
  INTERNAL: N_("\u670D\u52A1\u5668\u5185\u90E8\u9519\u8BEF"),
  PLUGIN_UNKNOWN: N_("\u672C\u670D\u52A1\u5668\u6CA1\u6709\u5B89\u88C5\u8BE5\u63D2\u4EF6"),
  PLUGIN_BLOCKED: N_("\u8BE5\u63D2\u4EF6\u4E0D\u80FD\u5728\u623F\u95F4\u4E2D\u542F\u7528"),
  PLUGIN_DEPENDENCY: N_("\u7F3A\u5C11\u8BE5\u63D2\u4EF6\u9700\u8981\u7684\u5176\u4ED6\u63D2\u4EF6"),
  PLUGIN_CONFLICT: N_("\u6240\u9009\u63D2\u4EF6\u4E92\u76F8\u51B2\u7A81"),
  PLUGIN_LIMIT: N_("\u6240\u9009\u63D2\u4EF6\u7684\u7D20\u6750\u603B\u91CF\u8D85\u51FA\u672C\u670D\u52A1\u5668\u7684\u4E0A\u9650"),
  PLUGIN_INCOMPATIBLE: N_("\u8BE5\u63D2\u4EF6\u4E0D\u9002\u914D\u672C\u670D\u52A1\u5668\u7684\u6E38\u620F\u7248\u672C"),
  PLUGIN_BUSY: N_("\u672C\u670D\u52A1\u5668\u540C\u65F6\u8FD0\u884C\u7684\u63D2\u4EF6\u7EC4\u5408\u5DF2\u8FBE\u4E0A\u9650\uFF0C\u8BF7\u7A0D\u540E\u518D\u8BD5"),
  PLUGIN_CONSENT: N_("\u8FD8\u6709\u73A9\u5BB6\u672A\u540C\u610F\u8FD0\u884C\u53D7\u4FE1\u4EFB\u63D2\u4EF6"),
  PLUGIN_SCRIPTS_DISABLED: N_("\u670D\u4E3B\u6CA1\u6709\u542F\u7528\u811A\u672C\u63D2\u4EF6"),
  PLUGIN_TRUST_PIN: N_("\u63D2\u4EF6\u7684\u9501\u6587\u4EF6\u6216\u6587\u4EF6\u5185\u5BB9\u4E0E\u670D\u4E3B\u9489\u4F4F\u7684\u54C8\u5E0C\u4E0D\u7B26"),
  PLUGIN_TRUST_PUBLIC: N_("\u516C\u7F51\u76D1\u542C\u9ED8\u8BA4\u7981\u6B62\u53D7\u4FE1\u4EFB\u63D2\u4EF6"),
  PLUGIN_SCRIPT_CONFLICT: N_("\u4E24\u4E2A\u63D2\u4EF6\u6CE8\u518C\u4E86\u540C\u4E00\u4E2A\u6548\u679C"),
  PLUGIN_SCRIPT_OVERRIDE: N_("\u63D2\u4EF6\u672A\u58F0\u660E\u8981\u66FF\u6362\u7684\u5B98\u65B9\u6280\u80FD"),
  PLUGIN_SCRIPT_CHECK: N_("\u811A\u672C\u672A\u901A\u8FC7\u517C\u5BB9\u6027\u68C0\u67E5"),
  CONTENT_NOT_READY: N_("\u4ECD\u6709\u535A\u58EB\u672A\u8F7D\u5165\u623F\u95F4\u7684\u63D2\u4EF6\u5185\u5BB9")
};
var emo = (id, sortId, picId, label) => Object.freeze({ id, sortId, picId, label });
var EMOTE_THEMES = Object.freeze([
  { themeId: "emoticon_autochess_basic", dir: "basic", sortId: 1e5, isBasic: true, name: N_("\u8868\u60C5\u5957\u7EC4\uFF1A\u536B\u620D\u534F\u8BAE"), emotes: [
    emo("autochess_battle_happy", 1001, "pic_happy_battle", N_("\u5F00\u5FC3")),
    emo("autochess_battle_scared", 1002, "pic_scared_battle", N_("\u5BB3\u6015")),
    emo("autochess_battle_sorry", 1003, "pic_sorry_battle", N_("\u5BF9\u4E0D\u8D77")),
    emo("autochess_battle_thanks", 1004, "pic_thanks_battle", N_("\u8C22\u8C22")),
    emo("autochess_battle_thinking", 1005, "pic_thinking_battle", N_("\u601D\u8003")),
    emo("autochess_battle_nice_cooperate", 1006, "pic_cooperate_battle", N_("\u5408\u4F5C\u6109\u5FEB"))
  ] },
  { themeId: "emoticon_originium_slug", dir: "slug", sortId: 1001, isBasic: false, name: N_("\u8868\u60C5\u5957\u7EC4\uFF1A\u866B\u52A8"), emotes: [
    emo("slug_autochess_battle_nice_work", 2001, "pic_nice_work_battle", N_("\u5408\u4F5C\u6109\u5FEB\uFF01")),
    emo("slug_autochess_battle_thanks", 2002, "pic_thanks_battle", N_("\u8C22\u8C22\uFF01")),
    emo("slug_autochess_battle_sorry", 2003, "pic_sorry_battle", N_("\u5BF9\u4E0D\u8D77\uFF01")),
    emo("slug_autochess_battle_bye", 2004, "pic_bye_battle", N_("\u518D\u89C1\uFF01")),
    emo("slug_autochess_battle_distrust", 2005, "pic_distrust_battle", "\uFF1F\uFF1F\uFF1F"),
    emo("slug_autochess_battle_very_soon", 2006, "pic_very_soon_battle", N_("\u5F88\u5FEB\u5C31\u597D\uFF01"))
  ] },
  { themeId: "emoticon_autochess_basic_2", dir: "basic_2", sortId: 100001, isBasic: true, name: N_("\u8868\u60C5\u5957\u7EC4\uFF1A\u536B\u620D\u534F\u8BAE"), emotes: [
    emo("autochess_battle_noproblem", 1007, "pic_noproblem_battle", N_("\u6CA1\u95EE\u9898\uFF01")),
    emo("autochess_battle_respect", 1008, "pic_respect_battle", N_("\u656C\u793C\uFF01")),
    emo("autochess_battle_call", 1009, "pic_call_battle", N_("\u6B22\u547C\uFF01")),
    emo("autochess_battle_playingcool", 1010, "pic_playingcool_battle", N_("\u9177\uFF01")),
    emo("autochess_battle_sad", 1011, "pic_sad_battle", N_("\u4F24\u5FC3")),
    emo("autochess_battle_dying", 1012, "pic_dying_battle", N_("\u5FEB\u6B7B\u4E86"))
  ] },
  { themeId: "emoticon_foolsday_doctor", dir: "fooldoctor", sortId: 1002, isBasic: false, name: N_("\u8868\u60C5\u5957\u7EC4\uFF1A\u535A\u58EB\u58EB"), emotes: [
    emo("autochess_battle_fooldoctor_01", 1020, "pic_fooldoctor_01_battle", N_("\u535A\u58EB\u58EB 1")),
    emo("autochess_battle_fooldoctor_02", 1021, "pic_fooldoctor_02_battle", N_("\u535A\u58EB\u58EB 2")),
    emo("autochess_battle_fooldoctor_03", 1022, "pic_fooldoctor_04_battle", N_("\u535A\u58EB\u58EB 3")),
    emo("autochess_battle_fooldoctor_04", 1023, "pic_fooldoctor_05_battle", N_("\u535A\u58EB\u58EB 4")),
    emo("autochess_battle_fooldoctor_05", 1024, "pic_fooldoctor_06_battle", N_("\u535A\u58EB\u58EB 5")),
    emo("autochess_battle_fooldoctor_06", 1025, "pic_fooldoctor_08_battle", N_("\u535A\u58EB\u58EB 6"))
  ] },
  { themeId: "emoticon_foolsday_amiya", dir: "foolamiya", sortId: 1003, isBasic: false, name: N_("\u8868\u60C5\u5957\u7EC4\uFF1A\u7C73\u7C73\u5B50"), emotes: [
    emo("autochess_battle_foolamiya_01", 1040, "pic_foolamiya_01_battle", N_("\u7C73\u7C73\u5B50 1")),
    emo("autochess_battle_foolamiya_02", 1041, "pic_foolamiya_02_battle", N_("\u7C73\u7C73\u5B50 2")),
    emo("autochess_battle_foolamiya_03", 1042, "pic_foolamiya_03_battle", N_("\u7C73\u7C73\u5B50 3")),
    emo("autochess_battle_foolamiya_04", 1043, "pic_foolamiya_04_battle", N_("\u7C73\u7C73\u5B50 4")),
    emo("autochess_battle_foolamiya_05", 1044, "pic_foolamiya_05_battle", N_("\u7C73\u7C73\u5B50 5")),
    emo("autochess_battle_foolamiya_06", 1045, "pic_foolamiya_06_battle", N_("\u7C73\u7C73\u5B50 6"))
  ] },
  { themeId: "emoticon_foolsday_wisdel", dir: "foolwisdel", sortId: 1004, isBasic: false, name: N_("\u8868\u60C5\u5957\u7EC4\uFF1A\u7EF4\u7EF4\u7F8E"), emotes: [
    emo("autochess_battle_foolwisdel_01", 1060, "pic_foolwisdel_01_battle", N_("\u7EF4\u7EF4\u7F8E 1")),
    emo("autochess_battle_foolwisdel_02", 1061, "pic_foolwisdel_02_battle", N_("\u7EF4\u7EF4\u7F8E 2")),
    emo("autochess_battle_foolwisdel_03", 1062, "pic_foolwisdel_03_battle", N_("\u7EF4\u7EF4\u7F8E 3")),
    emo("autochess_battle_foolwisdel_04", 1063, "pic_foolwisdel_04_battle", N_("\u7EF4\u7EF4\u7F8E 4")),
    emo("autochess_battle_foolwisdel_05", 1064, "pic_foolwisdel_05_battle", N_("\u7EF4\u7EF4\u7F8E 5")),
    emo("autochess_battle_foolwisdel_06", 1065, "pic_foolwisdel_06_battle", N_("\u7EF4\u7EF4\u7F8E 6"))
  ] }
].map((t) => Object.freeze({ ...t, emotes: Object.freeze(t.emotes) })));
var EMOTE_CATALOG = Object.freeze(EMOTE_THEMES.flatMap((t) => t.emotes.map((e) => Object.freeze({ ...e, themeId: t.themeId, dir: t.dir }))));
var EMOTES = Object.freeze(EMOTE_CATALOG.map((e) => e.id));
var EMOTE_INDEX = new Map(EMOTE_CATALOG.map((e) => [e.id, e]));
var emoteMap = (pick) => Object.freeze(Object.assign(/* @__PURE__ */ Object.create(null), Object.fromEntries(EMOTE_CATALOG.map((e) => [e.id, pick(e)]))));
var EMOTE_THEME = emoteMap((e) => e.themeId);
var EMOTE_LABEL = emoteMap((e) => e.label);

// mods/marisa-native/source/server/sim/constants.js
var TICK = 1 / 30;
var ROWS = GEO.ROWS;
var COLS = GEO.COLS;
var MOVE_SCALE = 0.5;
var ENEMY_COLLIDER_RADIUS = 0.1;
var BLOCK_RADIUS = Object.freeze({ ground: 0.70709997, fly: 0.8944, device: 0.4472 });
var BLOCK_RADIUS_SQ = Object.freeze({ ground: 0.49999037, fly: 0.79995137, device: 0.4472 * 0.4472 });
var PROJECTILE_SPEEDS = Object.freeze({ arrow: 14, bolt: 11, bomb: 8, lob: 8, orb: 10, drone: 16, enemy: 10, boomerang: 15, droneBomb: 5 });
var MIN_DAMAGE_RATIO = 0.05;
var ELEMENTS = Object.freeze(["burn", "neural", "necrosis", "apoptosis", "erosion"]);
var ELEMENT = Object.freeze({
  burn: Object.freeze({
    burstDamage: 1200,
    burstType: "arts",
    resDown: 20,
    duration: 10,
    ally: Object.freeze({ damage: 1200, type: "arts", resDown: 20, duration: 10 }),
    enemy: Object.freeze({ elemDamage: 7e3, resDown: 20, duration: 10 })
  }),
  neural: Object.freeze({
    burstDamage: 1e3,
    burstType: "true",
    stun: 10,
    duration: 10,
    ally: Object.freeze({ damage: 1e3, type: "true", stun: 10, duration: 10 }),
    enemy: Object.freeze({ elemDamage: 6e3, palsy: 3, duration: 10 })
  }),
  apoptosis: Object.freeze({
    dps: 100,
    duration: 15,
    ally: Object.freeze({ dps: 100, dpsType: "arts", spLossPerSec: 1, duration: 15 }),
    enemy: Object.freeze({ elemDps: 800, weaken: 0.5, duration: 15 })
  }),
  erosion: Object.freeze({
    ally: Object.freeze({ damage: 800, type: "phys", defDown: 100, duration: 10 }),
    enemy: Object.freeze({ elemDamage: 5e3, defDown: 120, duration: 8 })
  }),
  necrosis: Object.freeze({ dps: 100, duration: 12, atkDownPct: 0.2 })
});
var ELEMENT_ORDER = Object.freeze(["neural", "erosion", "burn", "apoptosis", "necrosis"]);
var PUSH_TILES = Object.freeze({ "-2": 0.12, "-1": 0.44, 0: 1.7, 1: 2.14, 2: 2.96, 3: 3.53 });
var PUSH_TILES_EFFECT = Object.freeze({ "-2": 0.085, "-1": 0.374, 0: 1.562, 1: 1.987, 2: 2.773, 3: 3.331 });
var PUSH_EFFECT_SKILLS = Object.freeze(/* @__PURE__ */ new Set(["skchr_forcer_1", "skchr_forcer_2"]));
var PUSH_UNBALANCE = Object.freeze({ "-2": 0.2, "-1": 0.4, 0: 0.8, 1: 0.9, 2: 32 / 30, 3: 35 / 30 });
var RESIST_DEFAULT = 0.5;
var RESIST_PALSY_DECAY = 5;
var COLD_ASPD = -30;
var FREEZE_RES_DOWN = 15;
var DP_DEFAULTS = Object.freeze({ dpInit: 10, dpPerSec: 1, dpMax: 99 });
var DOWN_STATE = Object.freeze({ COUNTING: 0, WAIT_DP: 1, WAIT_TILE: 2 });
var FORCED_EXIT = "forcedExit";
var OBSTACLE_DEVICES = Object.freeze({ trap_1105_accrate: { hp: 100, name: "\u963B\u9694\u5DE5\u4E8B" } });
var FIELD_EDGE_INSET = 1 / 1048576;
var BOSS_ROW_OFFSET = -7;
var DIRECT_BONUS_STACKING = "add";
var CHAIN_RADIUS = 1.7;

// mods/marisa-native/source/server/sim/dir.js
var DIRS = Object.freeze(["UP", "RIGHT", "DOWN", "LEFT"]);
var DEFAULT_DIR = "RIGHT";
var DIR_VEC = Object.freeze({
  UP: Object.freeze([1, 0]),
  RIGHT: Object.freeze([0, 1]),
  DOWN: Object.freeze([-1, 0]),
  LEFT: Object.freeze([0, -1])
});
var OPPOSITE = Object.freeze({ UP: "DOWN", DOWN: "UP", RIGHT: "LEFT", LEFT: "RIGHT" });
var MIRROR = Object.freeze({ UP: "UP", DOWN: "DOWN", RIGHT: "LEFT", LEFT: "RIGHT" });
var isDir = (d) => d === "UP" || d === "RIGHT" || d === "DOWN" || d === "LEFT";
function normDir(d, fallback = DEFAULT_DIR) {
  if (isDir(d)) return d;
  if (typeof d === "string") {
    const u = d.trim().toUpperCase();
    if (isDir(u)) return u;
  }
  if (typeof d === "number" && Number.isFinite(d) && d !== 0) return d < 0 ? "LEFT" : "RIGHT";
  return isDir(fallback) ? fallback : DEFAULT_DIR;
}
var dirVec = (d) => DIR_VEC[normDir(d)];
function rotateOffset(dr, dc, d) {
  switch (normDir(d)) {
    case "UP":
      return [dc, 0 - dr];
    case "LEFT":
      return [0 - dr, 0 - dc];
    case "DOWN":
      return [0 - dc, dr];
    default:
      return [dr, dc];
  }
}
function toLocal(ar, ac, d) {
  switch (normDir(d)) {
    case "UP":
      return [0 - ac, ar];
    case "LEFT":
      return [0 - ar, 0 - ac];
    case "DOWN":
      return [ac, 0 - ar];
    default:
      return [ar, ac];
  }
}
function offsetTile(r, c, dr, dc, d) {
  const [a, b] = rotateOffset(dr, dc, d);
  return [r + a, c + b];
}
function frontOf(r, c, d, k = 1) {
  const [fr, fc] = dirVec(d);
  return [r + fr * k, c + fc * k];
}
var localOrder = (dRow, dCol, d) => toLocal(dRow, dCol, d);
var localBefore = (a, b) => !b || a[0] < b[0] || a[0] === b[0] && a[1] < b[1];

// mods/marisa-native/source/server/sim/detmath.js
import { math } from "sp:sdk@1";
var hypot = math.hypot;
var roundHalfEven = math.roundHalfEven;
var powi = math.powi;
var sin = math.sin;
var cos = math.cos;
var atan2 = math.atan2;

// mods/marisa-native/source/server/sim/body.js
function hitRect(u) {
  const a = u && u.hitArea;
  if (!a) return null;
  const cx = u.x + a.dx, cy = u.y + a.dy;
  return { x0: cx - a.w / 2, x1: cx + a.w / 2, y0: cy - a.h / 2, y1: cy + a.h / 2 };
}
function posKey(u) {
  const r = roundHalfEven(u.y), c = roundHalfEven(u.x);
  return r < 0 || r >= ROWS || c < 0 || c >= COLS ? -1 : r * COLS + c;
}
function bodyKeys(u) {
  const R = hitRect(u);
  if (!R) {
    const k = posKey(u);
    return k < 0 ? [] : [k];
  }
  const out = [];
  const r0 = Math.max(0, Math.floor(R.y0 + 0.5 + 1e-9)), r1 = Math.min(ROWS - 1, Math.ceil(R.y1 - 0.5 - 1e-9));
  const c0 = Math.max(0, Math.floor(R.x0 + 0.5 + 1e-9)), c1 = Math.min(COLS - 1, Math.ceil(R.x1 - 0.5 - 1e-9));
  for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) out.push(r * COLS + c);
  return out;
}
function bodyOnTile(u, r, c) {
  const R = hitRect(u);
  if (!R) return roundHalfEven(u.y) === r && roundHalfEven(u.x) === c;
  return c + 0.5 > R.x0 + 1e-9 && c - 0.5 < R.x1 - 1e-9 && r + 0.5 > R.y0 + 1e-9 && r - 0.5 < R.y1 - 1e-9;
}
function bodyInKeys(u, keys) {
  if (!u || !keys) return false;
  const has = typeof keys.has === "function" ? (k) => keys.has(k) : (k) => keys.includes(k);
  if (!u.hitArea) {
    const k = posKey(u);
    return k >= 0 && has(k);
  }
  for (const k of bodyKeys(u)) if (has(k)) return true;
  return false;
}
function colliderKeys(u) {
  if (u.hitArea || u.side === "ally") return bodyKeys(u);
  const rho = ENEMY_COLLIDER_RADIUS, x = u.x, y = u.y;
  const r0 = Math.max(0, Math.floor(y - rho + 0.5 + 1e-9)), r1 = Math.min(ROWS - 1, Math.ceil(y + rho - 0.5 - 1e-9));
  const c0 = Math.max(0, Math.floor(x - rho + 0.5 + 1e-9)), c1 = Math.min(COLS - 1, Math.ceil(x + rho - 0.5 - 1e-9));
  const out = [];
  for (let r = r0; r <= r1; r++) {
    const dy = y < r - 0.5 ? r - 0.5 - y : y > r + 0.5 ? y - r - 0.5 : 0;
    for (let c = c0; c <= c1; c++) {
      const dx = x < c - 0.5 ? c - 0.5 - x : x > c + 0.5 ? x - c - 0.5 : 0;
      if (dx > 0 && dy > 0 && dx * dx + dy * dy >= rho * rho) continue;
      out.push(r * COLS + c);
    }
  }
  return out;
}
function bodyInRange(u, keys) {
  if (!u || !keys) return false;
  const has = typeof keys.has === "function" ? (k) => keys.has(k) : (k) => keys.includes(k);
  if (u.hitArea || u.side === "ally") {
    for (const k of bodyKeys(u)) if (has(k)) return true;
    return false;
  }
  const rho = ENEMY_COLLIDER_RADIUS, x = u.x, y = u.y;
  const r0 = Math.max(0, Math.floor(y - rho + 0.5 + 1e-9)), r1 = Math.min(ROWS - 1, Math.ceil(y + rho - 0.5 - 1e-9));
  const c0 = Math.max(0, Math.floor(x - rho + 0.5 + 1e-9)), c1 = Math.min(COLS - 1, Math.ceil(x + rho - 0.5 - 1e-9));
  for (let r = r0; r <= r1; r++) {
    const dy = y < r - 0.5 ? r - 0.5 - y : y > r + 0.5 ? y - r - 0.5 : 0;
    for (let c = c0; c <= c1; c++) {
      const dx = x < c - 0.5 ? c - 0.5 - x : x > c + 0.5 ? x - c - 0.5 : 0;
      if (dx > 0 && dy > 0 && dx * dx + dy * dy >= rho * rho) continue;
      if (has(r * COLS + c)) return true;
    }
  }
  return false;
}
function bodyInRangeTile(u, r, c) {
  if (!u || r < 0 || r >= ROWS || c < 0 || c >= COLS) return false;
  return colliderKeys(u).includes(r * COLS + c);
}
function bodyDist(u, x, y) {
  const R = hitRect(u);
  if (!R) return hypot(u.x - x, u.y - y);
  const dx = x < R.x0 ? R.x0 - x : x > R.x1 ? x - R.x1 : 0;
  const dy = y < R.y0 ? R.y0 - y : y > R.y1 ? y - R.y1 : 0;
  return hypot(dx, dy);
}

// mods/marisa-native/source/shared/potential.js
var POTENTIAL_MIN = 1;
var POTENTIAL_MAX = 6;
var FULL_RANK = POTENTIAL_MAX - 1;
var CULTIVATE_EFFECTS = Object.freeze(["aceffect_char_1", "aceffect_char_2", "aceffect_char_3", "aceffect_char_4"]);
var CULTIVATE_MAX = CULTIVATE_EFFECTS.length - 1;
var isPotential = (v) => Number.isInteger(v) && v >= POTENTIAL_MIN && v <= POTENTIAL_MAX;
var isObj = (v) => !!v && typeof v === "object" && !Array.isArray(v);
var own = (o, k) => isObj(o) && Object.prototype.hasOwnProperty.call(o, k);
function talentAtRank(t, rank) {
  if (!isObj(t) || !(own(t, "potMin") || own(t, "potBelow"))) return t;
  const { potMin: _m, potBelow: _b, ...out } = t;
  let x = t;
  while (isObj(x.potBelow) && rank < (Number.isInteger(x.potMin) ? x.potMin : 0)) {
    x = x.potBelow;
    for (const [k, v] of Object.entries(x)) if (k !== "potMin" && k !== "potBelow") out[k] = v;
  }
  return out;
}
function talentsAtRank(list, rank) {
  return Array.isArray(list) ? list.map((t) => talentAtRank(t, rank)) : list;
}
function applyPotDown(obj, rank) {
  const out = { ...obj };
  delete out.potDown;
  const down = obj.potDown;
  if (!isObj(down)) return out;
  const copied = /* @__PURE__ */ new Set([out]);
  for (let r = FULL_RANK - 1; r >= rank; r--) {
    const step = down[String(r)];
    if (!isObj(step)) continue;
    for (const [path, value] of Object.entries(step)) {
      const keys = path.split(".");
      if (keys.some((k) => k === "dsl" || k === "pluginId")) continue;
      let cur = out;
      for (let i = 0; i < keys.length - 1; i++) {
        const k = Array.isArray(cur) ? Number(keys[i]) : keys[i];
        const next = cur[k];
        if (!next || typeof next !== "object") {
          cur = null;
          break;
        }
        if (!copied.has(next)) {
          cur[k] = Array.isArray(next) ? next.slice() : { ...next };
          copied.add(cur[k]);
        }
        cur = cur[k];
      }
      if (cur) cur[Array.isArray(cur) ? Number(keys[keys.length - 1]) : keys[keys.length - 1]] = value;
    }
  }
  return out;
}
function atRank(obj, rank) {
  if (!isObj(obj) || !(Number.isInteger(rank) && rank >= 0 && rank < FULL_RANK)) return obj;
  const out = applyPotDown(obj, rank);
  for (const k of ["talents", "talentsBase"]) if (Array.isArray(out[k])) out[k] = talentsAtRank(out[k], rank);
  if (Array.isArray(out.modules)) {
    out.modules = out.modules.map((m) => isObj(m) && Array.isArray(m.talentChanges) ? { ...m, talentChanges: talentsAtRank(m.talentChanges, rank) } : m);
  }
  if (isObj(out.byModule)) {
    const bm = {};
    for (const [id, m] of Object.entries(out.byModule)) bm[id] = isObj(m) && Array.isArray(m.talents) ? { ...m, talents: talentsAtRank(m.talents, rank) } : m;
    out.byModule = bm;
  }
  return out;
}
function atPotential(rec, potential) {
  return isPotential(potential) && potential < POTENTIAL_MAX ? atRank(rec, potential - 1) : rec;
}

// mods/marisa-native/source/shared/loadoutRecord.js
function extendedGrid(grid, extend = 0) {
  const out = [];
  const seen = /* @__PURE__ */ new Set();
  const add = (dr, dc) => {
    const k = `${dr},${dc}`;
    if (!seen.has(k)) {
      seen.add(k);
      out.push([dr, dc]);
    }
  };
  if (!Array.isArray(grid)) return out;
  const cells = grid.filter((p) => Array.isArray(p) && Number.isInteger(p[0]) && Number.isInteger(p[1]));
  for (const [dr, dc] of cells) add(dr, dc);
  if (extend > 0 && Number.isFinite(extend)) {
    const maxByRow = /* @__PURE__ */ new Map();
    for (const [dr, dc] of cells) maxByRow.set(dr, Math.max(maxByRow.get(dr) ?? -Infinity, dc));
    for (const [dr, mx] of maxByRow) for (let k = 1; k <= Math.min(extend, GEO.COLS); k++) add(dr, mx + k);
  }
  return out;
}

// mods/marisa-native/source/server/sim/targeting.js
function absoluteRangeKeys(grid, r, c, dir, extend = 0) {
  const keys = [];
  const seen = /* @__PURE__ */ new Set();
  const d = normDir(dir);
  const add = (dr, dc) => {
    const [ar, ac] = rotateOffset(dr, dc, d);
    const rr = r + ar, cc = c + ac;
    if (rr < 0 || rr >= ROWS || cc < 0 || cc >= COLS) return;
    const k = rr * COLS + cc;
    if (!seen.has(k)) {
      seen.add(k);
      keys.push(k);
    }
  };
  if (!Array.isArray(grid) || !Number.isInteger(r) || !Number.isInteger(c)) return keys;
  const cells = grid.filter((p) => Array.isArray(p) && Number.isInteger(p[0]) && Number.isInteger(p[1]));
  for (const [dr, dc] of cells) add(dr, dc);
  if (extend > 0 && Number.isFinite(extend)) {
    const maxByRow = /* @__PURE__ */ new Map();
    for (const [dr, dc] of cells) maxByRow.set(dr, Math.max(maxByRow.get(dr) ?? -Infinity, dc));
    for (const [dr, mx] of maxByRow) for (let k = 1; k <= Math.min(extend, COLS); k++) add(dr, mx + k);
  }
  return keys;
}
var stealthOffKey = (sourceKey) => `stealthOff:${sourceKey}`;
function enemyStealthed(e) {
  const f = e.s.flags;
  if (!f.stealth || f.reveal || e.blockedBy) return false;
  if (!f.stealthOff) return true;
  for (const b of e.buffs) if (b.flags && b.flags.stealth && !e.findBuff(stealthOffKey(b.key))) return true;
  return false;
}
function canTargetEnemy(attacker, e, profile) {
  if (!e.alive || e.hidden || !e.deployed) return false;
  const f = e.s.flags;
  if (f.untargetable || f.sleep && !(profile && profile.hitSleep)) return false;
  if (f.stealth && enemyStealthed(e)) return false;
  if (e.isFlying && !(profile && (profile.canHitFly || profile.dollHitsFly && attacker && attacker.trait && attacker.trait.doll))) return false;
  if (profile && profile.groundOnly && e.isFlying) return false;
  if (profile && typeof profile.skipEnemy === "function" && profile.skipEnemy(e)) return false;
  return true;
}
var PRIORITY_FNS = {
  fly: (e) => e.isFlying ? 0 : 1,
  lowDef: (e) => e.s.def,
  highDef: (e) => -e.s.def,
  ranged: (e) => e.base.rangeRadius > 0 && e.def?.applyWay !== "MELEE" ? 0 : 1,
  lowestHp: (e) => e.hp,
  highestHp: (e) => -e.hp,
  lowestHpRatio: (e) => e.hpRatio,
  highestAtk: (e) => -e.s.atk,
  boss: (e) => e.isBoss ? 0 : 1,
  // "优先攻击精英或领袖敌人" (薇薇安娜 S3: kits/ops/op-vvana.js): an ELITE / BOSS rank enemy or a leader first
  elite: (e) => e.isBoss || e.def?.rank === "ELITE" || e.def?.rank === "BOSS" ? 0 : 1,
  notBurst: (e) => e.s.flags.burstLock ? 1 : 0,
  ground: (e) => e.isFlying ? 1 : 0,
  // 攻城手 trait "优先攻击重量最重的敌人" (早露 / 提丰: kits/ops/op-poca.js, op-typhon.js): the highest current 重量等级
  // (Unit.weight: massLevel with 失重 etc.) first, the usual order after that
  heaviest: (e) => -e.weight
};
function sortEnemyTargets(battle, attacker, cands, priority) {
  if (cands.length <= 1) return cands;
  const pf = priority ? PRIORITY_FNS[priority] || (priority === "nearest" || priority === "farthest" ? null : null) : null;
  const airFirst = priority === "fly";
  const ax = attacker.x, ay = attacker.y;
  const keyed = cands.map((e) => ({
    e,
    b: e.blockedBy === attacker ? 0 : 1,
    p: pf ? pf(e) : priority === "nearest" ? bodyDist(e, ax, ay) : priority === "farthest" ? -bodyDist(e, ax, ay) : 0,
    t: -(e.s.taunt || 0),
    d: battle.remainingDistance(e),
    s: e.spawnSeq
  }));
  keyed.sort((a, b) => (airFirst ? a.p - b.p : 0) || a.b - b.b || a.p - b.p || a.t - b.t || a.d - b.d || a.s - b.s);
  for (let i = 0; i < keyed.length; i++) cands[i] = keyed[i].e;
  return cands;
}

// mods/marisa-native/source/shared/standIn.js
var IDENTITY_FIELDS = Object.freeze([
  "chessId",
  "baseId",
  "goldenId",
  "isGolden",
  "tier",
  "identifier",
  "isHidden",
  "isDiy",
  "visible",
  "chessType",
  "backup",
  "shopSortId",
  "bonds",
  "garrisonIds",
  "price",
  "sellPrice",
  "upgradeNum",
  "upgradeChessId",
  "status",
  "diyRequirement"
]);

// mods/marisa-native/source/shared/diy.js
var DIY_TIERS = Object.freeze([5, 6]);

// mods/marisa-native/source/server/sim/simdata.js
function flattenBlackboard(bb) {
  if (!bb) return {};
  if (!Array.isArray(bb)) return { ...bb };
  const out = {};
  for (const e of bb) {
    if (!e || e.key == null) continue;
    const v = e.valueStr != null && e.valueStr !== "" && (e.value === 0 || e.value == null) ? e.valueStr : e.value;
    out[e.key] = v;
  }
  return out;
}
var num = (v, d = 0) => typeof v === "number" && Number.isFinite(v) ? v : typeof v === "string" && v.trim() !== "" && Number.isFinite(+v) ? +v : d;
function toArrayOfPairs(grid) {
  if (!Array.isArray(grid)) return null;
  const out = [];
  for (const p of grid) {
    if (Array.isArray(p) && p.length >= 2) out.push([num(p[0]), num(p[1])]);
    else if (p && typeof p === "object" && ("row" in p || "r" in p)) out.push([num(p.row ?? p.r), num(p.col ?? p.c)]);
  }
  return out;
}
function normDmgType(v, fallback = "phys") {
  if (v == null) return fallback;
  const s = String(Array.isArray(v) ? v[0] : v).toUpperCase();
  if (s.startsWith("PHYS")) return "phys";
  if (s.startsWith("MAG") || s === "ARTS") return "arts";
  if (s === "HEAL" || s === "HEALING") return "heal";
  if (s === "TRUE" || s === "REAL" || s === "PURE") return "true";
  if (s === "NO_DAMAGE" || s === "NONE" || s === "NO") return "none";
  if (s.startsWith("ELEM")) return "true";
  return fallback;
}
function normSpType(v) {
  const s = String(v ?? "").toUpperCase();
  if (s.includes("TIME")) return "time";
  if (s.includes("ATTACK")) return "attack";
  if (s.includes("DAMAGE") || s.includes("HURT")) return "hurt";
  return "none";
}
function normTriggerRule(v) {
  const s = String(v ?? "DEFAULT").toUpperCase();
  if (s === "ALWAYS" || s === "SP_FULL") return "SP_FULL";
  if (s.startsWith("CUSTOM_RANGE")) return "CUSTOM_RANGE";
  return s;
}
function normalizeSkill(rec) {
  const s = rec && (rec.skill ?? null);
  if (!s || typeof s !== "object") return null;
  const bb = s.bb ? { ...s.bb } : flattenBlackboard(s.blackboard);
  const trig = s.trigger ?? rec.skillTrigger ?? {};
  let rule = normTriggerRule(typeof trig === "string" ? trig : trig.rule);
  const matchedBy = typeof trig === "object" ? String(trig.matchedBy ?? "") : "";
  const skillIndex = s.skillIndex ?? s.index ?? null;
  const skillType = String(s.skillType ?? s.type ?? "MANUAL").toUpperCase();
  if (/^(profession|subProfession)/.test(matchedBy) && skillType !== "MANUAL") rule = "DEFAULT";
  const trigGrid = toArrayOfPairs(typeof trig === "object" && (trig.customRangeGrid ?? trig.rangeGrid ?? trig.grid) || rec.skillTriggerCustomRangeGrid);
  if (/^skcom_withdraw/.test(String(s.skillId ?? s.id ?? ""))) return null;
  const durRaw = s.duration ?? bb.duration ?? 0;
  return {
    id: s.skillId ?? s.id ?? "skill",
    name: s.name ?? "",
    index: skillIndex,
    skillType,
    durationType: String(s.durationType ?? "NONE").toUpperCase(),
    duration: num(durRaw, 0),
    spType: normSpType(s.spType),
    spCost: Math.max(0, num(s.spCost, 0)),
    initSp: Math.max(0, num(s.initSp, 0)),
    maxCharges: Math.max(1, num(s.maxChargeTime ?? s.maxCharges ?? s.charges, 1)),
    rangeGrid: toArrayOfPairs(s.rangeGrid),
    // `allies` (data: an ally row, tools/build-data.mjs TRIGGER_ALLY_RULES — 黍 S3) — skills.js `trigger.allies`
    trigger: typeof trig === "object" && trig.allies === true ? { rule, grid: trigGrid, allies: true } : { rule, grid: trigGrid },
    kind: s.kind ?? null,
    bb,
    description: s.description ?? s.desc ?? ""
  };
}
function normStats(st) {
  st = st || {};
  return {
    maxHp: Math.max(1, num(st.maxHp ?? st.hp, 1e3)),
    atk: Math.max(0, num(st.atk, 0)),
    def: Math.max(0, num(st.def, 0)),
    res: Math.max(0, num(st.magicResistance ?? st.res ?? st.resistance, 0)),
    aspd: num(st.attackSpeed ?? st.aspd, 100) || 100,
    bat: Math.max(0.05, num(st.baseAttackTime ?? st.bat, 1)),
    blockCnt: Math.max(0, num(st.blockCnt ?? st.block, 1)),
    cost: Math.max(0, num(st.cost, 10)),
    respawnTime: Math.max(0, num(st.respawnTime ?? st.redeploy, 70)),
    spRecovery: num(st.spRecoveryPerSec ?? st.spRecovery, 1),
    tauntLevel: num(st.tauntLevel ?? st.taunt, 0),
    massLevel: num(st.massLevel ?? st.mass, 0),
    hpRecoveryPerSec: num(st.hpRecoveryPerSec, 0),
    moveSpeed: num(st.moveSpeed, 1)
  };
}
function normalizeChess(rec) {
  const id = rec.chessId ?? rec.id;
  const golden = !!(rec.isGolden ?? rec.golden ?? /_b$/.test(String(id)));
  const baseId = rec.baseChessId ?? rec.baseId ?? String(id).replace(/_b$/, "_a");
  const skill = normalizeSkill(rec);
  const talents = (rec.talents ?? []).map((t) => ({
    name: t.name ?? "",
    description: t.description ?? t.desc ?? "",
    bb: t.bb ? { ...t.bb } : flattenBlackboard(t.blackboard),
    bbStr: t.bbStr ? { ...t.bbStr } : {},
    rangeGrid: toArrayOfPairs(t.rangeGrid),
    tokenKey: t.tokenKey ?? null
  }));
  return {
    type: "chess",
    id,
    baseId,
    golden,
    name: rec.name ?? id,
    charId: rec.charId ?? null,
    tier: num(rec.tier, 1),
    rarity: num(rec.rarity, 4),
    profession: String(rec.profession ?? "WARRIOR").toUpperCase(),
    subProf: rec.subProfessionId ?? rec.subProfession ?? rec.subProf ?? null,
    position: String(rec.position ?? "MELEE").toUpperCase(),
    bonds: [...rec.bondIds ?? rec.bonds ?? []],
    stats: normStats(rec.stats),
    rangeGrid: toArrayOfPairs(rec.rangeGrid ?? rec.range?.grid) ?? [[0, 0], [0, 1]],
    dmgType: rec.dmgType ? normDmgType(rec.dmgType) : null,
    attackKind: rec.attackKind ?? null,
    projectile: rec.projectile ?? null,
    canHitFly: rec.canHitFly ?? null,
    targetPriority: rec.targetPriority ?? null,
    splashRadius: rec.splashRadius ?? null,
    trait: typeof rec.trait === "string" ? rec.trait : rec.trait?.desc ?? rec.traitText ?? "",
    traitBb: rec.traitBb ?? (rec.trait && typeof rec.trait === "object" ? { ...rec.trait.bb || {} } : flattenBlackboard(rec.traitBlackboard)),
    immune: immuneSet(rec.immunities ?? rec.immune),
    skill,
    talents,
    tokens: rec.tokens ?? [],
    spine: rec.assets?.spine ?? rec.spine ?? rec.charId ?? null,
    avatar: rec.assets?.avatar ?? rec.avatar ?? rec.charId ?? null,
    // a 补位 stand-in (shared/standIn.js): the replaced operator's charId — `charId` is the stand-in's (absent otherwise)
    ...rec.standInFor ? { standInFor: rec.standInFor } : null,
    // a 自选 piece (shared/diy.js): the slot's base id — `charId` is the operator's (absent otherwise)
    ...rec.diyFor ? { diyFor: rec.diyFor } : null,
    raw: rec
  };
}
function immuneSet(v, extra = null) {
  const out = /* @__PURE__ */ new Set();
  const add = (k) => out.add(String(k).replace(/Immune$/, "").toLowerCase());
  if (Array.isArray(v)) v.forEach(add);
  else if (v && typeof v === "object") {
    for (const k of Object.keys(v)) if (v[k]) add(k);
  }
  if (Array.isArray(extra)) extra.forEach(add);
  return out;
}

// mods/marisa-native/source/server/sim/damage.js
var clamp01 = (v) => v < 0 ? 0 : v > 1 ? 1 : v;
function hasHp(u) {
  return !!u && u.alive && (u.bossPool ? u.bossPool.hp > 0 : u.hp > 0);
}
function isHpLoss(dmg) {
  return !!dmg && Array.isArray(dmg.tags) && dmg.tags.includes("hpLoss");
}
function applyRedirectCut(dmg, ratio) {
  const r = ratio < 0 ? 0 : ratio > 1 ? 1 : Number(ratio) || 0;
  if (!(r > 0) || !dmg) return 0;
  const prev = Array.isArray(dmg.redirectCuts) ? dmg.redirectCuts : dmg.redirectCuts = [];
  let prevSum = 0;
  for (const x of prev) prevSum += x;
  const prevKeep = prevSum >= 1 ? 0 : 1 - prevSum;
  prev.push(r);
  const nextSum = prevSum + r;
  const nextKeep = nextSum >= 1 ? 0 : 1 - nextSum;
  if (prevKeep > 1e-12) dmg.mul *= nextKeep / prevKeep;
  else dmg.mul *= 0;
  return r;
}
function redirectShare(amount, own3, cuts) {
  const list = Array.isArray(cuts) ? cuts : [];
  let sum = 0;
  for (const x of list) sum += x;
  const o = own3 > 0 ? own3 : 0;
  if (!(amount > 0) || !(o > 0) || !(sum > 0)) return 0;
  const keep = 1 - sum;
  if (keep > 1e-12) return amount / keep * o;
  return amount * (o / sum);
}
function mitigate(amount, type, target, ign = {}) {
  if (type === "phys") {
    const D = target.def ?? 0;
    const eff = Math.max(0, D * (1 - clamp01(ign.defIgnorePct ?? 0)) - (ign.defIgnoreFlat ?? 0));
    return Math.max(amount - eff, MIN_DAMAGE_RATIO * amount);
  }
  if (type === "arts") {
    const R = target.res ?? 0;
    const eff = Math.max(0, R * (1 - clamp01(ign.resIgnorePct ?? 0)) - (ign.resIgnoreFlat ?? 0));
    return Math.max(amount * (1 - Math.min(100, eff) / 100), MIN_DAMAGE_RATIO * amount);
  }
  if (type === "elemental") {
    const D = Math.max(0, Math.min(100, Number.isFinite(ign.elementalRes) ? ign.elementalRes : 0));
    return Math.max(amount * (1 - D / 100), MIN_DAMAGE_RATIO * amount);
  }
  return amount;
}

// mods/marisa-native/source/shared/plugins/limits.js
var PLUGIN_GAIN_COUNT_KEYS = Object.freeze([
  "global_special_choice_gain_equip",
  "single_special_choice_gain_bond_chess"
]);
var PLUGIN_BOUND_FACTOR = 10;
var PLUGIN_BOUND_FLOOR = 64;
function dataBound(officialMax) {
  const m = Number(officialMax);
  if (!Number.isFinite(m) || m < 0) return PLUGIN_BOUND_FLOOR;
  return Math.max(PLUGIN_BOUND_FACTOR * m, PLUGIN_BOUND_FLOOR);
}

// mods/marisa-native/source/shared/plugins/textPatterns.js
var TEXT_COUNT_PATTERNS = Object.freeze([
  { id: "burst", re: /(\d+)连发/ },
  { id: "attack-times", re: /攻击(\d+)次/ },
  { id: "steal", re: /偷取触发(\d+)次/ },
  { id: "combo", re: /(\d+|[一二两三四五六七八九十])连击/ },
  { id: "chain-attack", re: /连续攻击(\d+|[一二两三四五六七八九十])次/ },
  { id: "total-times", re: /总计(\d+)次/ },
  { id: "extra-targets", re: /额外攻击(\d+)个目标/ },
  { id: "at-most", re: /至多(\d+|[一二两三四五六七八九十])个/ },
  { id: "at-most-pack", re: /至多(\d+|[一二两三四五六七八九十])只/ },
  { id: "initial-pack", re: /初始(\d+|[一二两三四五六七八九十])只/ },
  { id: "jump-ally", re: /在(\d+)个友方单位间跳跃/ },
  { id: "jump-enemy", re: /在(\d+)个敌人间跳跃/ },
  { id: "own-max", re: /最多拥有(\d+)个/ },
  { id: "exist-n", re: /存在\s*(\d+)\s*名/ }
]);

// mods/marisa-native/source/shared/plugins/officialBounds.js
var STEP_TICK = 1 / 30;
var BOUND_TABLES = Object.freeze([
  "chess",
  "backups",
  "enemies",
  "bands",
  "bonds",
  "effects",
  "items",
  "waves",
  "choices",
  "garrisons",
  "tokens"
]);
var SKILL_FIELDS = Object.freeze(["spCost", "initSp", "maxChargeTime", "increment", "charges", "maxCharges"]);
var ENEMY_SP_FIELDS = Object.freeze(["maxSp", "initSp", "increment"]);
var cached = null;
function current() {
  return cached;
}
function officialTextMax(patternId) {
  const map = current()?.text;
  return map && map.has(patternId) ? map.get(patternId) : null;
}

// mods/marisa-native/source/shared/plugins/textNumber.js
var CN_DIGIT = Object.freeze({
  \u4E00: 1,
  \u4E8C: 2,
  \u4E24: 2,
  \u4E09: 3,
  \u56DB: 4,
  \u4E94: 5,
  \u516D: 6,
  \u4E03: 7,
  \u516B: 8,
  \u4E5D: 9,
  \u5341: 10
});
function captured(text, re) {
  if (!(re instanceof RegExp)) return null;
  const copy = new RegExp(re.source, re.flags.replace(/g/g, ""));
  const m = copy.exec(text == null ? "" : String(text));
  return m && m[1] != null && m[1] !== "" ? m[1] : null;
}
function textFinite(text, re, fallback) {
  const raw = captured(text, re);
  if (raw == null) return fallback;
  if (Object.prototype.hasOwnProperty.call(CN_DIGIT, raw)) return CN_DIGIT[raw];
  const n = Number(raw);
  if (Number.isFinite(n)) return n;
  const fb = Number(fallback);
  return Number.isFinite(fb) ? fb : 0;
}
function textCount(text, re, fallback, patternId) {
  const cap = dataBound(officialTextMax(patternId));
  const raw = captured(text, re);
  if (raw != null) {
    if (Object.prototype.hasOwnProperty.call(CN_DIGIT, raw)) return Math.min(cap, CN_DIGIT[raw]);
    const n = Number(raw);
    if (!Number.isFinite(n)) return cap;
    if (n < 0) return 0;
    return Math.min(cap, n);
  }
  const fb = Number(fallback);
  const safe = Number.isFinite(fb) ? fb : 0;
  if (safe < 0) return 0;
  return Math.min(cap, safe);
}

// mods/marisa-native/source/server/sim/content/generic.js
var num2 = (v) => typeof v === "number" && Number.isFinite(v) ? v : typeof v === "string" && v !== "" && Number.isFinite(+v) ? +v : void 0;
function getter(bb) {
  return (k) => {
    for (const key of [k, "attack@" + k, "skill@" + k]) {
      const v = num2(bb[key]);
      if (v !== void 0) return v;
    }
    return void 0;
  };
}
function attackGetter(bb) {
  return (k) => {
    for (const key of ["attack@" + k, k, "skill@" + k]) {
      const v = num2(bb[key]);
      if (v !== void 0) return v;
    }
    return void 0;
  };
}
var ENDLESS = /持续时间无限|无限持续/;
var STOP_ATTACK = /(^|[，；。,;])停止(主动)?攻击(敌人)?([，；。,;]|$)/;
var ELEMENTS2 = [[/凋亡损伤/, "apoptosis"], [/灼燃损伤/, "burn"], [/神经损伤/, "neural"]];
var STATUS_KEYS = [["stun", "stun"], ["cold", "cold"], ["sleep", "sleep"], ["fear", "fear"], ["sluggish", "sluggish"], ["root", "bind"], ["unmovable", "bind"]];
function genericKind(sk, bb = {}) {
  if (!sk) return null;
  const g = getter(bb);
  if (sk.kind) return sk.kind;
  if (sk.skillType === "PASSIVE") return "passive";
  if (!(sk.spCost > 0) && sk.durationType !== "AMMO" && !(sk.duration > 0)) return "passive";
  if (sk.durationType === "AMMO") return "ammo";
  if (sk.duration > 0) return "duration";
  if (sk.duration < 0) {
    if (g("trigger_time") !== void 0 || g("ammo") !== void 0) return "ammo";
    if (ENDLESS.test(String(sk.description || ""))) return "toggle";
  }
  return sk.maxCharges > 1 ? "charges" : "instant";
}
function dmgTypeFromText(text, fallback) {
  if (/法术伤害/.test(text)) return "arts";
  if (/物理伤害/.test(text)) return "phys";
  if (/真实伤害/.test(text)) return "true";
  return fallback === "heal" || fallback === "none" || !fallback ? "phys" : fallback;
}
function enemiesInRange(battle, unit, n) {
  const list = battle.enemiesInKeys(unit.rangeKeys, unit, { canHitFly: true });
  sortEnemyTargets(battle, unit, list, unit.profile?.priority ?? null);
  return n > 0 && list.length > n ? list.slice(0, n) : list;
}
function genericSkillSpec(sk, bb = sk?.bb ?? {}, def = null) {
  if (!sk) return null;
  const g = getter(bb);
  const ga = attackGetter(bb);
  let kind = genericKind(sk, bb);
  const desc = String(sk.description || "");
  const counterCtx = /受到(敌人的)?攻击时/.test(desc);
  const counterText = counterCtx && !/该(角色|干员|单位)受到攻击时/.test(desc);
  const mods = {};
  const debuff = {};
  const set = (k, v) => {
    if (v !== void 0 && Number.isFinite(v) && v !== 0) mods[k] = (mods[k] ?? 0) + v;
  };
  const onEnemies = (stat) => new RegExp(`(\u654C\u4EBA|\u76EE\u6807|\u654C\u65B9)[^\u3002\uFF1B]*${stat}-`).test(desc);
  const pctOrFlat = (v, pctKey, flatKey, target) => {
    if (v === void 0 || v === 0) return;
    if (Math.abs(v) > 5) target[flatKey] = (target[flatKey] ?? 0) + v;
    else target[pctKey] = (target[pctKey] ?? 0) + v;
  };
  const atk = g("atk");
  if (atk !== void 0 && atk < 0 && onEnemies("\u653B\u51FB\u529B")) pctOrFlat(atk, "atkPct", "atkFlat", debuff);
  else pctOrFlat(atk, "atkPct", "atkFlat", mods);
  const defv = g("def");
  if (defv !== void 0 && defv < 0 && onEnemies("\u9632\u5FA1\u529B")) pctOrFlat(defv, "defPct", "defFlat", debuff);
  else pctOrFlat(defv, "defPct", "defFlat", mods);
  pctOrFlat(g("max_hp"), "hpPct", "hpFlat", mods);
  set("aspd", g("attack_speed"));
  const bat = g("base_attack_time");
  if (bat !== void 0 && bat !== 0) mods.batPct = Math.max(-0.9, bat);
  const mr = g("magic_resistance");
  if (mr !== void 0 && mr !== 0) {
    const tgt = mr < 0 && onEnemies("\u6CD5\u672F\u6297\u6027") ? debuff : mods;
    if (Math.abs(mr) < 1) tgt.resMul = (tgt.resMul ?? 1) * Math.max(0, 1 + mr);
    else tgt.resFlat = (tgt.resFlat ?? 0) + mr;
  }
  const ds = g("damage_scale");
  if (ds !== void 0 && ds > 0) mods.dmgDealtMul = ds;
  set("blockCnt", g("block_cnt"));
  set("taunt", g("taunt_level"));
  const dr = g("damage_resistance");
  if (dr !== void 0 && dr > 0 && dr < 1) mods.dmgTakenMul = 1 - dr;
  const hrs = g("hp_recovery_per_sec"), hrr = g("hp_recovery_per_sec_by_max_hp_ratio");
  if (hrs > 0) set("hpRegen", hrs);
  if (hrr > 0) set("hpRegenRatio", hrr);
  set("spRecoveryFlat", g("sp_recovery_per_sec"));
  set("resIgnoreFlat", g("magic_resist_penetrate_fixed"));
  set("defIgnoreFlat", g("def_penetrate_fixed"));
  const passive = kind === "passive";
  const timed = kind === "duration" || kind === "ammo" || kind === "toggle";
  const ownDuration = num2(bb.duration) === void 0 && sk.duration > 0 && /^部署后/.test(desc) ? sk.duration : 0;
  const passiveTimed = passive && Object.keys(mods).length ? num2(bb.duration) > 0 && /\d+(\.\d+)?秒内/.test(desc) ? num2(bb.duration) : ownDuration : 0;
  if (passiveTimed) kind = "duration";
  const targeting = {};
  const attack = {};
  if (passiveTimed && /攻击[^。；]*(造成|变为|变成)[^。；]*法术伤害|伤害类型变为法术/.test(desc)) attack.dmgType = "arts";
  const mt = ga("max_target");
  if (!passive && mt !== void 0 && mt > 0) targeting.maxTargets = Math.floor(mt);
  const ext = g("ability_range_forward_extend");
  if (!passive && ext !== void 0 && ext > 0) targeting.rangeExtend = Math.round(ext);
  if (!passive && sk.rangeGrid && sk.rangeGrid.length) targeting.rangeGrid = sk.rangeGrid;
  const atkAt = num2(bb["attack@atk_scale"]);
  const atkPlain = num2(bb.atk_scale) ?? num2(bb["skill@atk_scale"]);
  const startBurst = timed && atkPlain !== void 0 && /立即[^。]*造成/.test(desc) ? atkPlain : void 0;
  const endBurst = timed && atkPlain !== void 0 && /技能结束时[^。]*造成[^。]*攻击力/.test(desc) ? atkPlain : void 0;
  const counterScale = counterText && atkPlain !== void 0 && atkAt === void 0 ? atkPlain : void 0;
  const isExtra = (v) => v !== void 0 && [...desc.matchAll(/额外(造成|附带)[^。；]*?攻击力(\d+(\.\d+)?)%/g)].some((m) => Math.abs(+m[2] - v * 100) < 1e-6);
  const healerUnit = !!def && (def.dmgType === "heal" || def.profession === "MEDIC");
  const allyHealScale = ga("heal_scale");
  const allyHeal = !passive && !!def && !healerUnit && allyHealScale > 0 && /(恢复|治疗)[^。]*友(方|军)[^。]*生命/.test(desc);
  const allyHealOthersOnly = /其他友(方|军)/.test(desc);
  const allyHealAll = /所有友(方|军)/.test(desc);
  if (!passive) {
    let as = isExtra(atkAt) ? void 0 : atkAt;
    if (as === void 0 && atkAt === void 0 && atkPlain !== void 0 && !counterCtx && !isExtra(atkPlain) && startBurst === void 0 && endBurst === void 0) as = atkPlain;
    if (as !== void 0 && as > 0) attack.atkScale = as;
    const hs = ga("heal_scale");
    if (hs !== void 0 && hs > 0 && !allyHeal) attack.healScale = hs;
    const times = ga("times");
    if (times !== void 0 && times > 1) attack.hits = Math.min(10, Math.floor(times));
    const rr = num2(bb["attack@range_radius"]);
    if (rr !== void 0 && rr > 0 && rr < 5) attack.splashRadius = rr;
    if (kind === "duration" && STOP_ATTACK.test(desc) && !/之后/.test(desc)) attack.noAttack = true;
  }
  const hitStatuses = [];
  const startStatuses = [];
  let selfStunOnEnd = 0;
  if (!passive) {
    for (const [key, status] of STATUS_KEYS) {
      const onAtk = num2(bb["attack@" + key]);
      const plain = num2(bb[key]) ?? num2(bb["skill@" + key]);
      if (onAtk !== void 0 && onAtk > 0) hitStatuses.push({ key: status, duration: onAtk });
      if (plain !== void 0 && plain > 0 && !(onAtk > 0 && plain === onAtk)) {
        if (key === "stun" && /结束后[^，。；]*晕眩/.test(desc)) selfStunOnEnd = plain;
        else if (timed) startStatuses.push({ key: status, duration: plain });
        else if (!(onAtk > 0)) hitStatuses.push({ key: status, duration: plain });
      }
    }
  }
  const prob2 = g("prob");
  const rollProb = (battle) => !(prob2 !== void 0 && prob2 > 0 && prob2 < 1) || battle.rng.chance(prob2);
  let element = null;
  const epr = g("ep_damage_ratio");
  if (epr !== void 0 && epr > 0 && /附带/.test(desc) && !/其他友方/.test(desc)) {
    const el = ELEMENTS2.find(([re]) => re.test(desc));
    if (el) element = { el: el[1], ratio: epr, ofDamage: /伤害\d+(\.\d+)?%的[^。，；]{0,3}损伤/.test(desc) };
  }
  const applyElement = (battle, unit, target, dealt) => {
    if (!element || !target || !target.alive) return;
    const amount = element.ofDamage ? (dealt || 0) * element.ratio : unit.s.atk * element.ratio;
    if (amount > 0) battle.dealDamage(unit, target, { type: "element", element: element.el, amount, tags: ["skill"] });
  };
  const forceRaw = g("force");
  const hasForce = !passive && forceRaw !== void 0;
  const force = forceRaw ?? 0;
  const pull = /拖拽/.test(desc) || !/推开|击退/.test(desc) && def && def.subProf === "hookmaster";
  const directional = !pull && (/攻击方向|朝部署方向|向前|身前方向/.test(desc) || def && def.subProf === "pusher");
  const effectPush = PUSH_EFFECT_SKILLS.has(sk.id);
  const hitElement = element && !counterText;
  const healAlly = (battle, unit) => {
    if (allyHealAll) {
      for (const a of battle.injuredAlliesInKeys(unit.rangeKeys, unit)) if (!(allyHealOthersOnly && a === unit)) battle.heal(unit, a, unit.s.atk * allyHealScale);
      return;
    }
    let best = null;
    for (const a of battle.injuredAlliesInKeys(unit.rangeKeys, unit)) if (!(allyHealOthersOnly && a === unit)) {
      best = a;
      break;
    }
    if (!best) best = battle.alliesInRadius(unit.x, unit.y, 1.5, null).filter((a) => a.hp < a.s.maxHp && !(allyHealOthersOnly && a === unit) && (a === unit || !(a.s.flags.noHeal || a.profile?.noHeal))).sort((a, b) => a.hpRatio - b.hpRatio)[0] ?? null;
    if (best) battle.heal(unit, best, unit.s.atk * allyHealScale);
  };
  const onHit = hitStatuses.length || hasForce || hitElement || allyHeal ? (ctx) => {
    if (allyHeal) healAlly(ctx.battle, ctx.unit);
    if (!ctx.target || !ctx.target.alive) return;
    if (hitElement) applyElement(ctx.battle, ctx.unit, ctx.target, ctx.dealt);
    if (hitStatuses.length && rollProb(ctx.battle)) {
      for (const s of hitStatuses) ctx.battle.applyStatus(ctx.target, s.key, { duration: s.duration, source: ctx.unit });
    }
    if (hasForce && ctx.target.alive && ctx.target.side === "enemy") {
      const u = ctx.unit;
      if (pull) ctx.battle.pullToFront(ctx.target, u, force);
      else ctx.battle.push(ctx.target, force, { from: u, dir: directional && u.fwd ? { x: u.fwd[1], y: u.fwd[0] } : null, effect: effectPush });
    }
  } : null;
  const hasDebuff = Object.keys(debuff).length > 0 && !passive;
  const debuffKey = `generic:debuff:${sk.id ?? "skill"}`;
  const aura = hasDebuff && timed && /攻击范围内[^。；]*敌人/.test(desc);
  const debuffDur = timed ? 5 : num2(bb.duration) > 0 ? num2(bb.duration) : 5;
  let onHitFinal = onHit;
  if (hasDebuff && !aura) {
    const base = onHit;
    onHitFinal = (ctx) => {
      if (base) base(ctx);
      if (ctx.target && ctx.target.alive) ctx.battle.addBuff(ctx.target, { key: debuffKey, duration: debuffDur, mods: { ...debuff }, refresh: "extend", source: ctx.unit });
    };
  }
  if (onHitFinal) attack.onHit = onHitFinal;
  let ammo;
  if (kind === "ammo") ammo = Math.max(1, Math.floor(g("trigger_time") ?? g("ammo") ?? g("cnt") ?? 8));
  const spec = {
    id: sk.id,
    name: sk.name,
    kind,
    duration: kind === "duration" ? passiveTimed || sk.duration : kind === "ammo" && sk.duration > 0 ? sk.duration : void 0,
    ammo
  };
  if (passiveTimed) Object.assign(spec, { activateOnDeploy: true, spCost: 0, spType: "none", trigger: "NEVER" });
  if (Object.keys(mods).length) spec.mods = mods;
  if (Object.keys(targeting).length) spec.targeting = targeting;
  if (!Object.keys(attack).length && (kind === "instant" || kind === "charges") && (spec.mods || spec.targeting)) spec.attack = {};
  if (Object.keys(attack).length) spec.attack = attack;
  const dpGain = !passive && /获得\d+点部署费用/.test(desc) ? g("cost") : void 0;
  const gainsDp = dpGain !== void 0 && dpGain > 0;
  if (gainsDp && sk.skillType === "AUTO" && !spec.mods && !spec.targeting && !spec.attack) spec.trigger = "SP_FULL";
  const starts = [];
  const ends = [];
  if (gainsDp) {
    starts.push(({ battle, unit }) => {
      battle.addDp(unit.ownerId, dpGain);
      battle.fx("dp", { x: unit.x, y: unit.y, n: dpGain, id: unit.id });
    });
  }
  const hr = g("hp_ratio");
  if (hr !== void 0 && hr > 0 && hr <= 1 && /立即流失\d+(\.\d+)?%(的)?当前生命/.test(desc)) {
    starts.push(({ battle, unit }) => {
      const loss = unit.hp * hr;
      if (loss > 0 && unit.hp - loss >= 1) battle.loseHp(unit, loss, { source: unit });
    });
  } else if (hr !== void 0 && hr > 0 && hr <= 1 && /(恢复|回复)[^。，]*生命/.test(desc) && !/流失/.test(desc)) {
    starts.push(({ battle, unit }) => battle.heal(unit, unit, unit.s.maxHp * hr, { self: true }));
  }
  const shieldRatio = /屏障/.test(desc) ? g("shield_max_hp_ratio") ?? (/生命(上限|值)?\d+(\.\d+)?%的屏障/.test(desc) ? hr : void 0) : void 0;
  if (shieldRatio !== void 0 && shieldRatio > 0) {
    const dur = g("shield_max_duration") ?? num2(bb.duration) ?? (sk.duration > 0 ? sk.duration : 0);
    const decays = /衰减/.test(desc) && dur > 0;
    starts.push(({ battle, unit }) => {
      const total = unit.s.maxHp * shieldRatio;
      battle.addBuff(unit, {
        key: `generic:shield:${sk.id ?? "skill"}`,
        shield: total,
        duration: dur > 0 ? dur : Infinity,
        visible: true,
        interval: decays ? 0.5 : 0,
        onTick: decays ? ({ unit: u, buff }) => {
          buff.shield = Math.max(0, buff.shield - total * 0.5 / dur);
          u.markDirty();
        } : null
      });
    });
  }
  const burst2 = (scale) => ({ battle, unit }) => {
    const type = dmgTypeFromText(desc, unit.profile?.dmgType ?? "phys");
    for (const e of enemiesInRange(battle, unit, 0)) {
      const dealt = battle.dealDamage(unit, e, { amount: unit.s.atk * scale, type, isSkill: true, tags: ["skill", "burst"] });
      applyElement(battle, unit, e, dealt);
    }
  };
  if (startBurst !== void 0 && startBurst > 0) starts.push(burst2(startBurst));
  if (startStatuses.length) {
    const n = mt !== void 0 && mt > 0 ? Math.floor(mt) : 0;
    starts.push(({ battle, unit }) => {
      for (const e of enemiesInRange(battle, unit, n)) for (const s of startStatuses) battle.applyStatus(e, s.key, { duration: s.duration, source: unit });
    });
  }
  if (endBurst !== void 0 && endBurst > 0) {
    const b = burst2(endBurst);
    ends.push((ctx) => {
      if (ctx.reason !== "death" && ctx.unit.alive) b(ctx);
    });
  }
  if (selfStunOnEnd > 0) {
    ends.push((ctx) => {
      if (ctx.reason !== "death" && ctx.unit.alive) ctx.battle.applyStatus(ctx.unit, "stun", { duration: selfStunOnEnd, source: ctx.unit });
    });
  }
  if (starts.length) spec.onStart = (ctx) => {
    for (const f of starts) f(ctx);
  };
  if (ends.length) spec.onEnd = (ctx) => {
    for (const f of ends) f(ctx);
  };
  if (aura) {
    const m = { ...debuff };
    spec.onTick = ({ battle, unit }) => {
      for (const e of battle.enemiesInKeys(unit.rangeKeys, unit, { canHitFly: true })) battle.addBuff(e, { key: debuffKey, duration: 0.5, mods: m, refresh: "extend", source: unit });
    };
  }
  if (counterText && (counterScale !== void 0 || element)) {
    const m = desc.match(/受到(敌人的)?攻击时[^。]*?(攻击力|防御力)(\d+(\.\d+)?)%的(物理|法术|真实)伤害/);
    spec.counter = {
      scale: counterScale ?? 0,
      stat: m && m[2] === "\u9632\u5FA1\u529B" ? "def" : "atk",
      type: m ? dmgTypeFromText(m[5] + "\u4F24\u5BB3", "phys") : "phys",
      around: /受到(敌人的)?攻击时对周围/.test(desc),
      groundOnly: /周围的地面敌人/.test(desc),
      cooldown: num2(bb.aoe_cd) ?? 0,
      applyElement: element ? applyElement : null
    };
  }
  return spec;
}
function installGeneric(spec) {
  const c = spec && spec.counter;
  if (!c) return null;
  return (battle, unit) => {
    let readyAt = -Infinity;
    battle.on("damaged", (ctx) => {
      if (ctx.target !== unit || !unit.alive || !unit.skill?.active || battle.time < readyAt) return;
      const src = ctx.source;
      if (!src || src.side !== "enemy" || !ctx.dmg || !ctx.dmg.isAttack) return;
      readyAt = battle.time + c.cooldown;
      const amount = (c.stat === "def" ? unit.s.def : unit.s.atk) * c.scale;
      const victims = c.around ? battle.foesInRadius(unit.x, unit.y, 1.5).filter((e) => !(c.groundOnly && e.isFlying)) : src.alive ? [src] : [];
      for (const e of victims) {
        const dealt = amount > 0 ? battle.dealDamage(unit, e, { amount, type: c.type, canDodge: false, isSkill: true, tags: ["counter"] }) : 0;
        if (c.applyElement) c.applyElement(battle, unit, e, dealt);
      }
    }, { owner: unit });
  };
}
var TALENT_STATS = Object.freeze({
  \u653B\u51FB\u529B: ["atk", "atkPct", "atkFlat"],
  \u9632\u5FA1\u529B: ["def", "defPct", "defFlat"],
  \u751F\u547D\u4E0A\u9650: ["max_hp", "hpPct", "hpFlat"],
  \u653B\u51FB\u901F\u5EA6: ["attack_speed", null, "aspd"]
});
function genericKit(bb, chess, def = null) {
  const sk = def?.skill ?? normalizeSkill(chess);
  if (!sk) return { skill: null, talents: [], generic: true };
  const spec = genericSkillSpec(sk, bb && Object.keys(bb).length ? bb : sk.bb, def);
  const kit = { skill: spec, talents: [], generic: true };
  const inst = installGeneric(spec);
  if (inst) kit.install = inst;
  return kit;
}

// mods/marisa-native/source/server/sim/professions.js
var P = (o) => Object.freeze(o);
var num3 = (v, d) => typeof v === "number" && Number.isFinite(v) ? v : d;
var PROFESSION_DEFAULTS = Object.freeze({
  SNIPER: P({ attack: "ranged", dmgType: "phys", projectile: "arrow", canHitFly: true }),
  CASTER: P({ attack: "ranged", dmgType: "arts", projectile: "bolt", canHitFly: true }),
  MEDIC: P({ attack: "ranged", dmgType: "heal", projectile: "orb", canHitFly: true, heal: { mode: "single" } }),
  SUPPORT: P({ attack: "ranged", dmgType: "arts", projectile: "bolt", canHitFly: true }),
  TANK: P({ attack: "melee", dmgType: "phys", projectile: "none", canHitFly: false }),
  WARRIOR: P({ attack: "melee", dmgType: "phys", projectile: "none", canHitFly: false }),
  PIONEER: P({ attack: "melee", dmgType: "phys", projectile: "none", canHitFly: false }),
  SPECIAL: P({ attack: "melee", dmgType: "phys", projectile: "none", canHitFly: false }),
  TOKEN: P({ attack: "melee", dmgType: "phys", projectile: "none", canHitFly: false })
});
var installMushaHeal = (battle, unit) => {
  battle.on("damaged", (c) => {
    if (c.source !== unit || !unit.alive || !c.target || c.target.side !== "enemy") return;
    const dmg = c.dmg;
    if (!dmg || isHpLoss(dmg) || c.type === "element") return;
    const tags = dmg.tags || [];
    if (tags.includes("talent") || tags.includes("dot") || tags.includes("periodic")) return;
    battle.heal(unit, unit, unit.profile.selfHeal ?? 50, { self: true, ignoreHealFree: true });
  }, { owner: unit, priority: -10 });
};
var installReaperHeal = (battle, unit) => {
  const heal = (n) => {
    if (n > 0 && unit.alive) battle.heal(unit, unit, (unit.profile.selfHeal ?? 50) * n, { self: true, ignoreHealFree: true });
  };
  battle.on("attack", (ctx) => {
    if (ctx.attacker !== unit || !unit.alive) return;
    heal(Math.min(ctx.targets.length, Math.max(1, unit.s.blockCnt)));
  }, { owner: unit, priority: -10 });
  battle.on("damaged", (c) => {
    if (c.source !== unit || !unit.alive || !c.target || c.target.side !== "enemy") return;
    const dmg = c.dmg;
    if (!dmg || dmg.isAttack || isHpLoss(dmg)) return;
    const tags = dmg.tags || [];
    if (tags.includes("talent") || tags.includes("dot") || tags.includes("periodic")) return;
    const mem = unit.mem;
    if (mem.selfHealAt !== battle.time) {
      mem.selfHealAt = battle.time;
      mem.selfHealN = 0;
    }
    if (mem.selfHealN >= Math.max(1, unit.s.blockCnt)) return;
    mem.selfHealN++;
    heal(1);
  }, { owner: unit, priority: -10 });
};
var installIncantation = (battle, unit) => {
  battle.on("damaged", (c) => {
    const t = c.target;
    if (c.source !== unit || !unit.alive || !t || t.side !== "enemy" || !(c.amount > 0)) return;
    if (c.type === "element" || c.type === "elemental") return;
    const ally = c.dmg && c.dmg.traitAlly || battle.lowestHpAllyInRange(unit);
    if (ally) battle.heal(unit, ally, c.amount * (unit.profile.healRatio ?? 0.5), { tags: ["incantation"] });
  }, { owner: unit });
};
var installHpDrain = (battle, unit) => {
  battle.every(1, () => {
    if (!unit.alive || !unit.deployed) return;
    const loss = unit.s.maxHp * (unit.profile.hpDrain ?? 0.03);
    if (unit.hp - loss < 1) unit.hp = Math.min(unit.hp, 1);
    else battle.loseHp(unit, loss, { source: unit, silent: true });
  }, { owner: unit });
};
var installMerchant = (battle, unit) => {
  const iv = unit.profile.merchantInterval ?? 3;
  const cost = unit.profile.merchantCost ?? 3;
  battle.every(iv, () => {
    if (!unit.alive || !unit.deployed) return;
    const pl = battle.getPlayer(unit.ownerId);
    if (!pl) return;
    const ctx = battle.hasHook("merchantPay") ? battle.emit("merchantPay", { unit, cost, cancel: false }) : null;
    if (!unit.alive || !unit.deployed || ctx && ctx.cancel) return;
    const c = ctx && Number.isFinite(ctx.cost) ? Math.max(0, ctx.cost) : cost;
    if (pl.dp >= c) battle.addDp(unit.ownerId, -c);
    else battle.retreat(unit, { reason: "merchant" });
  }, { owner: unit });
};
var installCharger = (battle, unit) => {
  battle.on("kill", (ctx) => {
    if (ctx.killer === unit && ctx.victim.side === "enemy") battle.addDp(unit.ownerId, unit.profile.dpOnKill ?? 1);
  }, { owner: unit });
};
var DOLL_SWITCH = 1;
var DOLL_SWITCH_IMMUNE = /* @__PURE__ */ new Set(["stun", "freeze", "sleep"]);
var installDollkeeper = (battle, unit) => {
  const dollHpMul = () => {
    const tokId = (unit.def.tokens || []).map((t) => typeof t === "string" ? t : t?.tokenId).find((t) => t && /shadow|doll/.test(t));
    const tok = tokId ? battle.data.getToken?.(tokId, unit.defId, unit.def?.loadout ?? null) : null;
    return tok && tok.stats.maxHp > 0 ? Math.max(0.05, tok.stats.maxHp / Math.max(1, unit.base.maxHp)) : 1;
  };
  const at = (extra) => ({ x: unit.x, y: unit.y, id: unit.id, ...extra });
  const startSwitch = () => {
    const sk = unit.skill;
    if (sk && sk.active && sk.kind !== "passive") sk.end("substitute");
    for (const b of unit.buffs.slice()) if (b.status) battle.removeBuff(unit, b);
    unit.trait.dollSwitching = true;
    const done = () => {
      unit.trait.dollSwitching = false;
    };
    const ended = () => {
      done();
      if (!unit.alive || !unit.deployed) return;
      unit.markDirty();
      unit.hp = unit.s.maxHp;
    };
    battle.addBuff(unit, {
      key: "trait:dollSwitching",
      duration: DOLL_SWITCH,
      onExpire: ended,
      onRemove: done,
      // noHeal refuses another unit's heal; healFree is 禁疗 (damage.js: a self-heal is 0 too, regen excepted). The
      // window still ends at full HP — onExpire writes it, it does not heal.
      flags: { invulnerable: true, noSp: true, noHeal: true, healFree: true, isolated: true, disarm: true }
    });
  };
  const leave = () => {
    if (!unit.trait.doll) return;
    unit.trait.doll = false;
    unit.form = null;
    if (!unit.alive || !unit.deployed) return;
    startSwitch();
    unit.markDirty();
    unit.hp = unit.s.maxHp;
    battle.fx("swap", at({ form: null }));
    if (battle.hasHook("dollSwap")) battle.emit("dollSwap", { unit, form: null });
  };
  const enter = () => {
    if (unit.trait.doll || !unit.alive || !unit.deployed) return false;
    unit.trait.doll = true;
    startSwitch();
    const dur = DOLL_SWITCH + (unit.profile.dollDuration ?? 20);
    const mul = dollHpMul();
    battle.addBuff(unit, {
      key: "trait:substitute",
      duration: dur,
      visible: true,
      onExpire: leave,
      onRemove: leave,
      mods: { blockCnt: -99, ...mul !== 1 ? { hpMul: mul } : null },
      // 阻回 for the whole form; a 替身 that makes no normal attack casts no skill either (header)
      flags: { noSp: true, ...unit.profile.dollNoAttack ? { disarm: true, silence: true } : null }
    });
    battle.releaseBlocked(unit);
    unit.form = "doll";
    unit.markDirty();
    unit.hp = unit.s.maxHp;
    battle.fx("substitute", at({ form: "doll", dur }));
    if (battle.hasHook("dollSwap")) battle.emit("dollSwap", { unit, form: "doll" });
    return true;
  };
  battle.on("fatal", (ctx) => {
    if (ctx.unit !== unit || ctx.prevented) return;
    if (unit.trait.dollSwitching) {
      ctx.prevented = true;
      return;
    }
    if (unit.trait.doll) return;
    ctx.prevented = enter();
  }, { owner: unit, priority: -100 });
  battle.on("dollSwitch", (ctx) => {
    if (ctx.unit === unit && !ctx.done) ctx.done = enter();
  }, { owner: unit });
  battle.on("beforeStatus", (ctx) => {
    if (ctx.target === unit && unit.trait.dollSwitching && DOLL_SWITCH_IMMUNE.has(ctx.status)) ctx.cancel = true;
  }, { owner: unit });
  battle.on("death", (ctx) => {
    if (ctx.unit !== unit) return;
    unit.trait.doll = false;
    unit.trait.dollSwitching = false;
    if (unit.form) {
      unit.form = null;
      battle.fx("dollEnd", at({ form: null }));
    }
  }, { owner: unit });
};
var installLibrator = (battle, unit) => {
  const rampMax = unit.profile.rampMax ?? 2;
  const rampTime = unit.profile.rampTime ?? 40;
  const rampInit = Math.min(rampMax, unit.profile.rampInit ?? 0);
  const applyBlock = () => {
    if (unit.skill?.active) battle.removeBuff(unit, "trait:libratorBlock");
    else {
      battle.addBuff(unit, { key: "trait:libratorBlock", mods: { blockCnt: -99 } });
      battle.releaseBlocked(unit);
    }
  };
  unit.trait.ramp = 0;
  battle.every(1, () => {
    if (!unit.alive || !unit.deployed || unit.skill?.active) return;
    unit.trait.ramp = Math.min(rampMax, unit.trait.ramp + rampMax / rampTime);
    battle.addBuff(unit, { key: "trait:libratorRamp", mods: { atkPct: unit.trait.ramp } });
  }, { owner: unit });
  const applyRamp = () => {
    if (unit.trait.ramp > 0) battle.addBuff(unit, { key: "trait:libratorRamp", mods: { atkPct: unit.trait.ramp } });
    else battle.removeBuff(unit, "trait:libratorRamp");
  };
  battle.on("deploy", (ctx) => {
    if (ctx.unit === unit) {
      unit.trait.ramp = rampInit;
      applyRamp();
      applyBlock();
    }
  }, { owner: unit });
  battle.on("skillStart", (ctx) => {
    if (ctx.unit === unit) applyBlock();
  }, { owner: unit });
  battle.on("skillEnd", (ctx) => {
    if (ctx.unit !== unit) return;
    unit.trait.ramp = 0;
    applyRamp();
    applyBlock();
  }, { owner: unit });
};
var installPhalanx = (battle, unit) => {
  const apply = () => {
    if (unit.skill?.active) battle.removeBuff(unit, "trait:phalanxGuard");
    else battle.addBuff(unit, { key: "trait:phalanxGuard", mods: { defPct: unit.profile.guardDef ?? 2, resFlat: unit.profile.guardRes ?? 20 } });
  };
  battle.on("deploy", (ctx) => {
    if (ctx.unit === unit) apply();
  }, { owner: unit });
  battle.on("skillStart", (ctx) => {
    if (ctx.unit === unit) apply();
  }, { owner: unit });
  battle.on("skillEnd", (ctx) => {
    if (ctx.unit === unit) apply();
  }, { owner: unit });
};
var installBearer = (battle, unit) => {
  battle.on("skillStart", (ctx) => {
    if (ctx.unit === unit) {
      battle.addBuff(unit, { key: "trait:bearer", mods: { blockCnt: -99 } });
      battle.releaseBlocked(unit);
    }
  }, { owner: unit });
  battle.on("skillEnd", (ctx) => {
    if (ctx.unit === unit) battle.removeBuff(unit, "trait:bearer");
  }, { owner: unit });
};
var installStalker = (battle, unit) => {
  const p = unit.profile.dodge ?? 0.5;
  battle.addBuff(unit, { key: "trait:stalker", mods: { dodgePhys: p, dodgeArts: p, taunt: -1 }, persist: true, allowDead: true });
};
var installHunter = (battle, unit) => {
  const max = unit.profile.ammoMax ?? 8;
  unit.trait.ammo = max;
  unit.trait.reloadAcc = 0;
  battle.on("tick", (ctx) => {
    if (!unit.alive || !unit.deployed) return;
    if (battle.time - unit.lastAttackAt >= 1 && unit.trait.ammo < max) {
      unit.trait.reloadAcc += ctx.dt;
      if (unit.trait.reloadAcc >= 1) {
        unit.trait.reloadAcc -= 1;
        unit.trait.ammo++;
      }
    } else unit.trait.reloadAcc = 0;
  }, { owner: unit });
  battle.on("deploy", (ctx) => {
    if (ctx.unit === unit) unit.trait.ammo = max;
  }, { owner: unit });
};
var installLoopshooter = (battle, unit) => {
  unit.trait.boomerangsOut = 0;
  battle.on("deploy", (ctx) => {
    if (ctx.unit === unit) unit.trait.boomerangsOut = 0;
  }, { owner: unit });
};
var installTactician = (battle, unit) => {
  const spawn = () => {
    if (!unit.alive || !unit.deployed) return;
    if (unit.trait.reinforcement && unit.trait.reinforcement.alive) return;
    const tile = battle.findTacticalPoint(unit);
    if (!tile) return;
    unit.trait.reinforcement = battle.spawnToken(unit, "token_tactician_reinforce", tile[0], tile[1], {
      def: {
        name: "\u63F4\u519B",
        stats: {
          maxHp: unit.base.maxHp * 0.7,
          atk: unit.base.atk * 0.5,
          def: unit.base.def,
          magicResistance: 0,
          blockCnt: 1,
          baseAttackTime: 1.2,
          attackSpeed: 100,
          respawnTime: 999,
          cost: 0
        },
        rangeGrid: [[0, 0]],
        dmgType: "phys",
        attackKind: "melee",
        profession: "TOKEN"
      }
    });
  };
  battle.on("deploy", (ctx) => {
    if (ctx.unit === unit) spawn();
  }, { owner: unit });
};
var installFunnel = (battle, unit) => {
  const reset = () => {
    unit.trait.funnelTarget = null;
    unit.trait.funnelScale = unit.profile.funnel?.init ?? 0.2;
    unit.trait.funnelMap?.clear();
  };
  reset();
  battle.on("deploy", (ctx) => {
    if (ctx.unit === unit && !ctx.move) reset();
  }, { owner: unit });
};
var installMystic = (battle, unit) => {
  unit.trait.stored = 0;
  battle.on("deploy", (ctx) => {
    if (ctx.unit === unit && !ctx.move) unit.trait.stored = 0;
  }, { owner: unit });
};
var BARD_REGEN_IV = 0.25;
var BARD_REGEN_DUR = 0.5;
function bardRegen(battle, bard, ally, value, duration = BARD_REGEN_DUR) {
  if (!bard || !ally || !ally.alive || !(value > 0)) return;
  let v = value;
  if (battle.hasHook("bardRegen")) v = num3(battle.emit("bardRegen", { unit: bard, target: ally, value: v }).value, 0);
  if (v > 0) battle.addBuff(ally, { key: `trait:bard:${bard.id}`, duration, source: bard, mods: { hpRegen: v } });
}
var installBard = (battle, unit) => {
  battle.every(BARD_REGEN_IV, () => {
    if (!unit.alive || !unit.deployed || unit.hidden) return;
    const v = unit.s.atk * (unit.profile.auraRatio ?? 0.1);
    for (const ally of battle.alliesInGrid(unit)) bardRegen(battle, unit, ally, v);
  }, { owner: unit });
};
var installSkywalker = (battle, unit) => {
  battle.addBuff(unit, { key: "trait:skywalker", flags: { blockFly: true }, persist: true, allowDead: true });
};
var inTraitGrid = (unit, target, grid) => bodyInRange(target, absoluteRangeKeys(grid, unit.tileR, unit.tileC, unit.dir, 0));
var onFrontLine = (unit, target) => {
  const [fr, fc] = unit.fwd;
  const lateral = (r, c) => toLocal(r - unit.tileR, c - unit.tileC, unit.dir)[0];
  if (!target.hitArea) {
    return lateral(Math.round(target.y), Math.round(target.x)) === 0 && (target.x - unit.x) * fc + (target.y - unit.y) * fr >= 0;
  }
  for (const k of bodyKeys(target)) {
    const r = Math.floor(k / COLS), c = k % COLS;
    if (lateral(r, c) === 0 && (c - unit.tileC) * fc + (r - unit.tileR) * fr >= 0) return true;
  }
  return false;
};
var SUB = Object.freeze({
  // --- SNIPER
  fastshot: P({ priority: "fly", dmgMul: (b, u, t) => t.isFlying ? u.profile.flyScale ?? 1 : 1 }),
  closerange: P({}),
  longrange: P({ priority: "lowDef" }),
  aoesniper: P({ splashRadius: 1.1, projectile: "bomb" }),
  // PRTS 溅射半径一览 (特性): 投掷手 0.9, 扩散术师 1.1 (格雷伊 1.0, TUNE below), 链术师 1.7 jumps; 炮手 1.0 (none in the pool)
  bombarder: P({
    splashRadius: 0.9,
    projectile: "bomb",
    groundOnly: true,
    canHitFly: false,
    afterHit: (battle, unit, target, info) => {
      const n = Math.max(1, (unit.profile.shockTimes ?? 2) - 1);
      for (let i = 1; i <= n; i++) {
        battle.after(0.3 * i, () => {
          for (const e of battle.foesInRadius(info.x, info.y, unit.profile.splashRadius || 1, true)) {
            if (e.isFlying) continue;
            battle.dealDamage(unit, e, { amount: unit.s.atk * (unit.profile.shockScale ?? 0.5), type: "phys", isSplash: true, tags: ["aftershock"] });
          }
        });
      }
    }
  }),
  hunter: P({
    install: installHunter,
    canAttack: (battle, unit) => (unit.trait.ammo ?? 8) > 0,
    dmgMul: (b, u) => u.profile.ammoScale ?? 1.2,
    afterAttack: (battle, unit) => {
      unit.trait.ammo = Math.max(0, (unit.trait.ammo ?? 8) - 1);
    }
  }),
  loopshooter: P({
    projectile: "boomerang",
    boomerang: true,
    install: installLoopshooter,
    canAttack: (battle, unit) => !(unit.trait.boomerangsOut > 0)
  }),
  reaperrange: P({
    allInRange: true,
    dmgMul: (battle, unit, target) => {
      const grid = unit.profile.frontGrid;
      const front = grid ? inTraitGrid(unit, target, grid) : onFrontLine(unit, target);
      return front ? unit.profile.frontScale ?? 1.5 : 1;
    }
  }),
  // --- CASTER
  // "群体法术伤害" names two shapes: the 扩散术师 splash 1.1 tiles around the struck target (PRTS 溅射半径一览; Arknights
  // Terra Wiki, Splash Caster), while the 轰击术师 ("超远距离的群体法术伤害") and the 阵法术师 strike every enemy inside the
  // attack range at once, the same damage near and far — community report E3 after 0.1.0. Primary for the 轰击术师: PRTS
  // 作战机制 §AOE伤害判定 names 伊芙利特's 炎爆 a 锁定攻击范围 AoE, and 炎爆 is her next-attack skill ("下次攻击造成…",
  // PRTS 伊芙利特 S2); for the 阵法术师: Terra Wiki, Phalanx Caster (secondary) and PRTS 林 S3 备注. PRTS 溅射半径一览
  // documents no splash radius for either (supporting only: it omits the 撼地者 too)
  splashcaster: P({ splashRadius: 1.1 }),
  blastcaster: P({ rangeAoe: true }),
  chain: P({ chain: { count: 3, falloff: 0.15, radius: CHAIN_RADIUS, sluggish: 0.5 } }),
  funnel: P({
    projectile: "drone",
    install: installFunnel,
    funnelMul: (battle, unit, target) => {
      const f = unit.profile.funnel || { init: 0.2, delta: 0.15, max: 1.1 };
      if (unit.trait.funnelTarget === target.id) unit.trait.funnelScale = Math.min(f.max, (unit.trait.funnelScale ?? f.init) + f.delta);
      else {
        unit.trait.funnelTarget = target.id;
        unit.trait.funnelScale = f.init;
      }
      return unit.trait.funnelScale;
    }
  }),
  mystic: P({
    install: installMystic,
    storeEnergy: (battle, unit) => {
      const n = unit.trait.stored ?? 0;
      if (n >= (unit.profile.storeMax ?? 3)) return false;
      unit.trait.stored = n + 1;
      return true;
    },
    releaseEnergy: (battle, unit) => {
      const n = unit.trait.stored ?? 0;
      unit.trait.stored = 0;
      return n;
    },
    hitsFn: (battle, unit, info) => 1 + (info?.energy ?? 0)
  }),
  phalanx: P({ noAttackUnlessSkill: true, rangeAoe: true, install: installPhalanx }),
  primcaster: P({}),
  corecaster: P({}),
  // --- MEDIC
  physician: P({ heal: { mode: "single" } }),
  ringhealer: P({ heal: { mode: "multi", count: 3 } }),
  chainhealer: P({ heal: { mode: "chain", count: 3, falloff: 0.25 } }),
  healer: P({ heal: { mode: "single", farMul: 0.8, nearDist: 2 } }),
  wandermedic: P({ heal: { mode: "single", elementHealRatio: 0.5 } }),
  incantationmedic: P({ dmgType: "arts", projectile: "bolt", heal: null, install: installIncantation }),
  // --- SUPPORT
  slower: P({ onHitStatus: { key: "sluggish", duration: 0.8 } }),
  underminer: P({}),
  bard: P({ noAttack: true, dmgType: "heal", heal: null, install: installBard }),
  ritualist: P({}),
  craftsman: P({ attack: "melee", dmgType: "phys", projectile: "none", canHitFly: false }),
  summoner: P({}),
  // --- TANK
  protector: P({}),
  guardian: P({}),
  shotprotector: P({ attack: "ranged", canHitFly: true, projectile: "arrow" }),
  primprotector: P({}),
  unyield: P({ noHeal: true }),
  duelist: P({}),
  fortress: P({ fortress: true, splashRadius: 1, projectile: "bomb", canHitFly: false, groundOnly: true }),
  // --- WARRIOR
  centurion: P({ hitAllBlocked: true }),
  crusher: P({ hitAllBlocked: true }),
  fearless: P({}),
  fighter: P({}),
  hammer: P({ splashRadius: 1, splashScale: 0.5, splashOthersOnly: true }),
  instructor: P({ dmgMul: (battle, unit, target) => target.blockedBy === unit ? 1 : unit.profile.unblockedScale ?? 1.2 }),
  librator: P({ noAttackUnlessSkill: true, install: installLibrator }),
  lord: P({
    canHitFly: true,
    dmgMul: (battle, unit, target) => {
      if (target.blockedBy === unit) return 1;
      const [fr, fc] = frontOf(unit.tileR, unit.tileC, unit.dir);
      return bodyInRangeTile(target, unit.tileR, unit.tileC) || bodyInRangeTile(target, fr, fc) ? 1 : unit.profile.rangedScale ?? 0.8;
    }
  }),
  musha: P({ noHeal: true, install: installMushaHeal }),
  reaper: P({ noHeal: true, allInRange: true, install: installReaperHeal }),
  sword: P({ hits: 2 }),
  artsfghter: P({ dmgType: "arts" }),
  swordmaster: P({ hits: 2 }),
  // --- PIONEER
  pioneer: P({}),
  charger: P({ install: installCharger }),
  tactician: P({
    install: installTactician,
    dmgMul: (battle, unit, target) => unit.trait.reinforcement && target.blockedBy === unit.trait.reinforcement ? unit.profile.reinforceScale ?? 1.5 : 1
  }),
  agent: P({ canHitFly: true }),
  counsellor: P({}),
  bearer: P({ install: installBearer }),
  // --- SPECIAL
  alchemist: P({ attack: "ranged", canHitFly: true, projectile: "lob" }),
  dollkeeper: P({ install: installDollkeeper }),
  executor: P({}),
  geek: P({ install: installHpDrain }),
  hookmaster: P({ canHitFly: true }),
  merchant: P({ install: installMerchant }),
  pusher: P({ hitAllBlocked: true }),
  skywalker: P({ canHitFly: true, blockFly: true, install: installSkywalker }),
  stalker: P({ allInRange: true, install: installStalker }),
  traper: P({ attack: "ranged", canHitFly: false, projectile: "none" }),
  // 守望者 (watchman, 凯尔希·思衡托): its trait is "恢复友方单位生命，并且可以起飞". MEDIC's own defaults already give the
  // single-target heal (attack ranged / dmgType heal / projectile orb / heal single); 起飞 is the `liftoff` buff flag
  // that skills and talents set (skywalker / 蒂比 drive it from their skill flags), so the branch itself only has to
  // let the airborne unit keep healing AND block air: `blockFly` is the half of 起飞 that is a unit capability rather
  // than a state (Battle._blockerFor reads it; gamedata_const ba.liftoff "可以阻挡飞行敌人").
  watchman: P({ canHitFly: true, blockFly: true })
});
var KNOWN_SUBPROFESSIONS = Object.freeze(Object.keys(SUB));

// mods/marisa-native/source/server/sim/content/tokens.js
var num4 = (v, d = 0) => typeof v === "number" && Number.isFinite(v) ? v : typeof v === "string" && v.trim() !== "" && Number.isFinite(+v) ? +v : d;
var GRID_3X3 = Object.freeze([[1, -1], [1, 0], [1, 1], [0, -1], [0, 0], [0, 1], [-1, -1], [-1, 0], [-1, 1]]);
var GRID_PLUS = Object.freeze([[1, 0], [0, -1], [0, 0], [0, 1], [-1, 0]]);
var CAT_SHIELD_KEY = "cathy:shield";
var TOKEN_IDS = Object.freeze({
  healDrone: "token_10000_silent_healrb",
  curseDoll: "token_10006_vodfox_doll",
  obelisk: "token_10011_beewax_oblisk",
  rosmonGear: "token_10012_rosmon_shield",
  duskDragon: "token_10015_dusk_drgn",
  seaborn: "token_10017_skadi2_dedant",
  radiantSword: "token_10019_nearl2_sword",
  paperDoll: "token_10022_kazema_shadow",
  wolfPack: "token_10028_vigil_wolf",
  manifold: "token_10030_mlyss_wtrman",
  champagne: "token_10031_swire2_gdtrap",
  ulpiaMarker: "token_10039_ulpia_block",
  goldenOath: "token_10040_siege2_vlion",
  catShield: "token_10041_cathy_catsld",
  makotoMask: "token_x_marisa_makoto_thanatos",
  makotoMask2: "token_x_marisa_makoto_orpheus",
  // MOD 补丁 (战术锚点): 上游没有这个键。锚点是我们加的棋子（data/tokens.json 里早已存在），它的 kit 由
  // kits/ops/op-kalts2.js 的 anchorKit 提供，经 content/index.js 的 MOD_TOKEN_KITS 注入到下面的 kit 解析里。
  anchor: "token_x_marisa_10068_kalts2_mtship",
  // MOD 补丁 (予愿安洁莉娜 S3 的「一会儿见！」标记位): 同上，kit 来自 kits/ops/op-aglna2.js 的 markerKit。
  aglna2Marker: "token_x_marisa_10071_aglna2_agairp",
  deliveryTarget: "token_10056_angel2_target",
  eagle1: "token_10057_svash2_eagle1",
  eagle2: "token_10057_svash2_eagle2",
  eagle3: "token_10057_svash2_eagle3",
  iceTarget: "token_10058_sbell2_icetgt",
  yanyou: "enemy_9012_acloon",
  reserveMedic: "char_605_cmedic",
  touch: "char_613_acmedc"
});
var STATE = /* @__PURE__ */ new WeakMap();
function stateOf(battle) {
  let s = STATE.get(battle);
  if (!s) {
    s = { lastOp: /* @__PURE__ */ new Map(), catTargets: /* @__PURE__ */ new Map() };
    STATE.set(battle, s);
  }
  return s;
}
function withLoadout(v, lo) {
  if (!v || !lo || typeof lo !== "object") return v;
  let out = v;
  if (Number.isInteger(lo.skillIndex) && v.bySkill && v.bySkill[lo.skillIndex]) out = { ...out, ...v.bySkill[lo.skillIndex] };
  if (typeof lo.moduleId === "string" && v.byModule && v.byModule[lo.moduleId]) out = { ...out, ...v.byModule[lo.moduleId] };
  return out;
}
function ownVariant(raw, owner) {
  const vs = raw?.variants;
  const oid = owner?.def?.tokenOwner ?? owner?.defId;
  if (!vs || typeof vs !== "object" || !oid) return null;
  const v = vs[oid] ?? vs[String(oid).replace(/_b$/, "_a")] ?? null;
  return v ? withLoadout(atPotential(v, owner.def?.loadout?.potential), owner.def?.loadout) : null;
}
function variantOf(unit) {
  const vs = unit.def?.raw?.variants;
  if (!vs || typeof vs !== "object") return null;
  return ownVariant(unit.def.raw, unit.ownerUnit) ?? Object.values(vs)[0] ?? null;
}
function talentWith(def, key) {
  for (const t of def?.talents ?? []) if (t && t.bb && t.bb[key] != null) return t;
  return null;
}
var talentBb = (def, key) => talentWith(def, key)?.bb ?? {};
var ownerAtk = (u) => u.ownerUnit && u.ownerUnit.s ? u.ownerUnit.s.atk : u.s.atk;
var ownerOf = (u) => u.ownerUnit && u.ownerUnit.side === "ally" ? u.ownerUnit : null;
var managed = (u) => !!(u.ownerUnit && u.ownerUnit.kit && u.ownerUnit.kit.generic !== true);
function onDeploy(battle, unit, fn, priority = 0) {
  battle.on("deploy", (ctx) => {
    if (ctx.unit === unit) fn(ctx);
  }, { owner: unit, priority });
}
function untargetable(battle, unit) {
  battle.addBuff(unit, { key: "trait:untargetable", flags: { untargetable: true }, persist: true, allowDead: true });
}
var COUNTDOWN_SUMMONS = Object.freeze(/* @__PURE__ */ new Set([
  TOKEN_IDS.healDrone,
  TOKEN_IDS.curseDoll,
  TOKEN_IDS.seaborn,
  "token_10009_weedy_cannon",
  "token_10034_ray_sndbst",
  "token_10026_bgsnow_subbow",
  "token_10054_phatm2_encdool"
]));
var COUNTDOWN_KEY = "token:countdown";
function startCountdown(battle, unit, seconds) {
  const s = num4(seconds, 0);
  if (!unit || !COUNTDOWN_SUMMONS.has(unit.defId) || !(s > 0)) return false;
  unit.countdown = { from: battle.time, until: battle.time + s };
  if (!unit.findBuff(COUNTDOWN_KEY)) battle.addBuff(unit, { key: COUNTDOWN_KEY, flags: { invulnerable: true, noHeal: true, healFree: true }, persist: true, allowDead: true });
  return true;
}
function scheduleLifetime(battle, unit, seconds) {
  const s = num4(seconds, 0);
  if (!(s > 0)) return;
  startCountdown(battle, unit, s);
  const seq = unit.deploySeq;
  unit.mem.expiresAt = battle.time + s;
  battle.after(s, () => {
    if (unit.alive && unit.deploySeq === seq) battle.retreat(unit, { reason: "expired", permanent: true });
  }, { owner: unit });
}
function enemiesOnKeys(battle, keys) {
  const set = keys instanceof Set ? keys : new Set(keys);
  const out = [];
  for (const e of battle.enemies) {
    if (!e.alive || e.hidden) continue;
    if (bodyInRange(e, set)) out.push(e);
  }
  return out;
}
function burst(battle, unit, { grid, amount = 0, type = "phys", stun = 0, hits = 1, source = unit, fx: fx2 = "summonBurst" }) {
  const keys = absoluteRangeKeys(grid || GRID_3X3, unit.tileR, unit.tileC, unit.dir, 0);
  const victims = enemiesOnKeys(battle, keys);
  for (const e of victims) {
    for (let i = 0; i < hits && e.alive && amount > 0; i++) battle.dealDamage(source, e, { amount, type, isSkill: true, canDodge: false, tags: ["summon", "burst"] });
    if (stun > 0 && e.alive) battle.applyStatus(e, "stun", { duration: stun, source });
  }
  battle.fx(fx2, { x: unit.x, y: unit.y, id: unit.id, token: unit.defId, n: victims.length });
  return victims;
}
function enableRespawn(battle, unit, { delay, onExpire = false, unlessManaged = false, requireOwner = false }) {
  battle.on("death", (ctx) => {
    if (ctx.unit !== unit || battle.finished || unit.mem.isClone || unlessManaged && managed(unit)) return;
    if (unit.mem.replaced) {
      unit.mem.replaced = false;
      return;
    }
    const r = ctx.reason;
    if (!(r === "killed" || onExpire && r === "expired")) return;
    const d = num4(typeof delay === "function" ? delay(unit) : delay, -1);
    if (!(d >= 0)) return;
    unit.removed = false;
    unit.mem.respawnAt = battle.time + d;
    battle.every(0.25, (b, sched) => {
      if (unit.alive || unit.removed) {
        sched.cancel();
        return;
      }
      if ((typeof requireOwner === "function" ? requireOwner() : requireOwner) && !(unit.ownerUnit && unit.ownerUnit.alive)) {
        sched.cancel();
        return;
      }
      if (b.time + 1e-9 < unit.mem.respawnAt) return;
      if (b.redeploy(unit, { free: false })) sched.cancel();
    }, { owner: unit });
  }, { owner: unit, priority: -10 });
}
function bindToOwnerSkill(battle, unit) {
  onDeploy(battle, unit, () => {
    const o = ownerOf(unit);
    unit.mem.boundActivation = o && o.skill && o.skill.active && o.skill.isTimed ? o.skill.activations : null;
  });
  battle.on("skillEnd", (ctx) => {
    if (!unit.alive || ctx.unit !== unit.ownerUnit || unit.mem.boundActivation == null) return;
    if (ctx.skill.activations === unit.mem.boundActivation) battle.retreat(unit, { reason: "expired", permanent: true });
  }, { owner: unit });
}
var DOCK_RETRY = 0.5;
function deployDocked(battle, u) {
  const stock = u.ownerUnit?.mem.summonStock;
  if (!stock || !(stock[u.defId] > 0) || u.alive || u.removed || battle.finished || !u.ownerUnit.alive) return false;
  const wait = u.mem.readyAt - battle.time;
  if (wait > 1e-9 || !battle.redeploy(u, { free: true })) {
    if (!u.mem.dockRetry) {
      u.mem.dockRetry = true;
      battle.after(Math.max(wait, DOCK_RETRY), () => {
        u.mem.dockRetry = false;
        deployDocked(battle, u);
      }, { owner: u });
    }
    return false;
  }
  stock[u.defId]--;
  battle.fx("summon", { x: u.x, y: u.y, id: u.id, token: u.defId });
  return true;
}
function releaseSkillSummon(battle, owner, tokenId, { cap = 1 } = {}) {
  if (!owner) return null;
  const pieces = battle.allyUnits.filter((t) => t.kind === "token" && t.defId === tokenId && t.ownerUnit === owner && t.mem.docked);
  if (!pieces.length) return null;
  const stock = owner.mem.summonStock || (owner.mem.summonStock = {});
  stock[tokenId] = Math.min(Math.max(1, Math.floor(num4(cap, 1))), (stock[tokenId] || 0) + 1);
  for (const p of pieces) if (deployDocked(battle, p)) return p;
  return null;
}
function inRectTile(battle, r, c) {
  return Number.isInteger(r) && Number.isInteger(c) && battle.grid.inRect(r, c);
}
function tileFree(battle, r, c) {
  return inRectTile(battle, r, c) && !battle.isReservedTile(r, c);
}
function mostAdvancedEnemy(battle) {
  let best = null, bd = Infinity;
  for (const e of battle.enemies) {
    if (!e.alive || e.hidden) continue;
    const d = battle.remainingDistance(e);
    if (d < bd - 1e-9 || Math.abs(d - bd) <= 1e-9 && best && e.spawnSeq < best.spawnSeq) {
      bd = d;
      best = e;
    }
  }
  return best;
}
function countNear(list, r, c, rad = 1) {
  let n = 0;
  for (const u of list) if (Math.abs(Math.round(u.y) - r) <= rad && Math.abs(Math.round(u.x) - c) <= rad) n++;
  return n;
}
function findSummonTile(battle, owner, placement = "melee", opts = {}) {
  if (!owner || owner.tileR == null) return null;
  let keys;
  if (placement === "adjacent") keys = absoluteRangeKeys(GRID_3X3, owner.tileR, owner.tileC, owner.dir, 0);
  else if (placement === "plus") keys = absoluteRangeKeys(GRID_PLUS, owner.tileR, owner.tileC, owner.dir, 0);
  else if (opts.grid) keys = absoluteRangeKeys(opts.grid, owner.tileR, owner.tileC, owner.dir, 0);
  else keys = owner.rangeKeys || [];
  const melee = opts.melee ?? (placement === "melee" || placement === "adjacent" || placement === "plus");
  const enemies = battle.enemies.filter((e) => e.alive && !e.hidden);
  const focus = opts.at ?? mostAdvancedEnemy(battle) ?? owner;
  const injured = placement === "ally" ? battle.alliesFor(owner, owner.ownerId).filter((a) => a.hp < a.s.maxHp - 1e-6 && !(a.s.flags.noHeal || a.profile?.noHeal)) : null;
  let best = null, bestS = null;
  for (const k of keys) {
    const r = k / COLS | 0, c = k % COLS;
    if (!tileFree(battle, r, c)) continue;
    if (!battle.grid.canStand(r, c, { ranged: !melee })) continue;
    const gp = battle.grid.groundPassable(r, c, true) ? 1 : 0;
    if (placement === "path" && !gp) continue;
    let cover = 0;
    if (placement === "enemy" || placement === "melee") cover = countNear(enemies, r, c, 1);
    else if (placement === "ally") cover = countNear(injured, r, c, 1);
    const d = placement === "ally" ? hypot(c - owner.x, r - owner.y) : hypot(c - focus.x, r - focus.y);
    const [lr, lc] = localOrder(r - owner.tileR, c - owner.tileC, owner.dir);
    const s = [-cover, placement === "ally" || placement === "enemy" || placement === "near" ? 0 : -gp, d, lr, lc];
    let less = !bestS;
    if (!less) for (let i = 0; i < s.length; i++) {
      if (s[i] < bestS[i] - 1e-9) {
        less = true;
        break;
      }
      if (s[i] > bestS[i] + 1e-9) break;
    }
    if (less) {
      best = [r, c];
      bestS = s;
    }
  }
  return best;
}
var inert = ({ hideFromEnemies = false, block = null } = {}) => () => ({
  skill: null,
  trait: { noAttack: true },
  install(battle, unit) {
    if (hideFromEnemies) untargetable(battle, unit);
    if (block != null) battle.addBuff(unit, { key: "token:block", persist: true, allowDead: true, mods: { blockCnt: block } });
  }
});
function maskDisplay() {
  return {
    skill: null,
    trait: { noAttack: true },
    install(battle, unit) {
      untargetable(battle, unit);
    }
  };
}
function healDrone() {
  return {
    skill: null,
    install(battle, unit) {
      const v = variantOf(unit);
      const sk = v?.skill ?? unit.def?.raw?.skill ?? null;
      let life = /^skcom_withdraw/.test(String(sk?.skillId ?? sk?.id ?? "")) ? num4(sk.duration, 0) : 0;
      if (!(life > 0)) {
        const secs = textFinite(String(sk?.desc ?? sk?.description ?? ""), /(\d+(?:\.\d+)?)秒后自动销毁/, NaN);
        if (Number.isFinite(secs)) life = secs;
      }
      onDeploy(battle, unit, () => scheduleLifetime(battle, unit, life));
    }
  };
}
function curseDoll(bb, raw, def) {
  const mods = {};
  if (num4(bb.atk, 0) !== 0) mods.atkPct = num4(bb.atk, 0);
  if (num4(bb.def, 0) !== 0) mods.defPct = num4(bb.def, 0);
  const life = num4(def?.skill?.duration, 0);
  const AURA = 0.2;
  return {
    skill: {
      kind: "passive",
      onStart({ unit }) {
        unit.mem.auraAcc = AURA;
      },
      onTick({ battle, unit, dt }) {
        unit.mem.auraAcc = (unit.mem.auraAcc ?? 0) + (dt ?? battle.dt);
        if (unit.mem.auraAcc < AURA - 1e-9) return;
        unit.mem.auraAcc = 0;
        for (const e of enemiesOnKeys(battle, unit.rangeKeySet || unit.rangeKeys || [])) {
          battle.addBuff(e, { key: "token:curseDoll", duration: AURA + 0.15, refresh: "extend", mods, source: unit });
        }
      }
    },
    trait: { noAttack: true },
    install(battle, unit) {
      onDeploy(battle, unit, () => scheduleLifetime(battle, unit, life));
      battle.on("death", (ctx) => {
        if (ctx.unit === unit.ownerUnit && unit.alive) battle.retreat(unit, { reason: "expired", permanent: true });
      }, { owner: unit });
    }
  };
}
function obelisk(bb, raw, def) {
  const grid = def?.skill?.rangeGrid ?? GRID_3X3;
  const life = num4(talentBb(def, "duration").duration, 0);
  return {
    skill: null,
    trait: { noAttack: true },
    // a blocking pillar (the 蜜蜡 kit's obelisk does not attack either) [ASSUMED]
    install(battle, unit) {
      onDeploy(battle, unit, () => {
        burst(battle, unit, { grid, amount: ownerAtk(unit) * num4(bb.atk_scale, 0), type: "arts", stun: num4(bb.stun, 0), source: unit });
        scheduleLifetime(battle, unit, life);
      });
    }
  };
}
function rosmonGear(bb, raw, def) {
  const t = talentBb(def, "duration");
  const life = num4(t.duration, 0);
  const defFlat = num4(t.def, 0);
  return {
    skill: null,
    trait: { noAttack: true },
    install(battle, unit) {
      onDeploy(battle, unit, () => {
        burst(battle, unit, { grid: def?.skill?.rangeGrid ?? GRID_3X3, stun: num4(bb.stun, 0), fx: "summonStun" });
        scheduleLifetime(battle, unit, life);
      });
      if (defFlat !== 0) {
        battle.on("tick", () => {
          if (!unit.alive || !unit.blocking.length) return;
          for (const e of unit.blocking) if (e.alive) battle.addBuff(e, { key: "token:rosmonGear", duration: 0.2, refresh: "extend", mods: { defFlat }, source: unit });
        }, { owner: unit });
      }
    }
  };
}
function duskDragon(bb, raw, def) {
  const life = num4(talentBb(def, "duration").duration, 0);
  return {
    skill: null,
    install(battle, unit) {
      onDeploy(battle, unit, () => scheduleLifetime(battle, unit, unit.mem.lifeOverride ?? life));
    }
  };
}
function seaborn(bb, raw, def) {
  const life = num4(talentBb(def, "duration").duration, 0);
  const healRatio = num4(def?.traitBb?.["attack@atk_to_hp_recovery_ratio"], 0);
  const dmgScale = num4(bb.atk_scale, 0);
  const inspire = num4(bb.atk, 0);
  return {
    skill: null,
    trait: { noAttack: true },
    install(battle, unit) {
      onDeploy(battle, unit, () => {
        unit.mem.pulseAcc = 0;
        if (!managed(unit)) scheduleLifetime(battle, unit, life);
      });
      enableRespawn(battle, unit, { delay: (u) => u.base.respawnTime, onExpire: true, unlessManaged: true });
      battle.on("tick", ({ dt }) => {
        if (!unit.alive || !unit.deployed || !unit.canAct || managed(unit)) return;
        unit.mem.pulseAcc = (unit.mem.pulseAcc ?? 0) + dt;
        if (unit.mem.pulseAcc < 1 - 1e-9) return;
        unit.mem.pulseAcc -= 1;
        const o = ownerOf(unit);
        const atk = ownerAtk(unit);
        const keys = unit.rangeKeySet || new Set(unit.rangeKeys || []);
        const skillOn3 = !!(o && o.alive && o.skill && o.skill.active && o.skill.kind !== "passive");
        if (skillOn3) {
          for (const e of enemiesOnKeys(battle, keys)) battle.dealDamage(unit, e, { amount: atk * dmgScale, type: "true", isSkill: true, canDodge: false, tags: ["seaborn"] });
          if (inspire > 0) {
            for (const a of battle.alliesInGrid(unit)) {
              if (a === unit || a === o) continue;
              battle.addBuff(a, { key: `inspire:${o.id}`, duration: 1.25, refresh: "replace", mods: { atkFlat: atk * inspire }, source: unit });
            }
          }
        } else if (healRatio > 0) {
          const ownerKeys = o && o.alive && o.deployed ? o.rangeKeySet || new Set(o.rangeKeys || []) : null;
          for (const a of battle.alliesInGrid(unit)) {
            if (a === unit) continue;
            if (ownerKeys && ownerKeys.has(a.tileR * COLS + a.tileC)) continue;
            bardRegen(battle, o ?? unit, a, atk * healRatio, 1.25);
          }
        }
      }, { owner: unit });
    }
  };
}
function radiantSword(bb, raw, def) {
  const grid = def?.skill?.rangeGrid ?? GRID_PLUS;
  const blockedScale = num4(def?.traitBb?.atk_scale, 1);
  return {
    skill: null,
    trait: blockedScale !== 1 ? { dmgMul: (b, u, t) => t && t.blockedBy ? blockedScale : 1 } : {},
    install(battle, unit) {
      bindToOwnerSkill(battle, unit);
      onDeploy(battle, unit, () => {
        const last = stateOf(battle).lastOp.get(unit.ownerId);
        const kaz = !!(last && (last.def?.bonds || []).includes("kazimierzShip"));
        burst(battle, unit, { grid, amount: ownerAtk(unit) * num4(bb.atk_scale, 0), type: "true", stun: num4(bb.stun, 0), hits: kaz ? 2 : 1, source: unit, fx: "radiantSword" });
      });
    }
  };
}
function paperDoll(bb, raw, def) {
  const scale = num4(talentBb(def, "damage_scale").damage_scale, 0);
  return {
    skill: null,
    install(battle, unit) {
      onDeploy(battle, unit, () => {
        if (scale > 0 && !managed(unit)) burst(battle, unit, { grid: GRID_3X3, amount: unit.s.atk * scale, type: "arts", source: unit, fx: "paperDoll" });
      });
    }
  };
}
var WOLF_TAC_EXITS = /* @__PURE__ */ new Set(["killed", "retreat", FORCED_EXIT]);
var WOLF_RETURN_RETRY = 0.25;
var wolfLeader = (def) => talentWith(def, "vigil_wolf_t_1_enhance[trigger].max_stack_cnt") ?? def?.talents?.[0] ?? null;
function wolfShadowInterval(def) {
  const lb = wolfLeader(def)?.bb ?? {};
  return Math.max(0, num4(lb["vigil_wolf_t_1_enhance[trigger].interval"] ?? lb.interval, 0));
}
function wolfTacticalPoint(unit) {
  const tp = unit?.mem?.wolfTac;
  return tp && !unit.alive && !unit.removed ? tp : null;
}
var wolfOwnerStands = (u) => !u.ownerUnit || u.ownerUnit.alive && u.ownerUnit.deployed;
function wolfReturnNow(battle, unit, src = null) {
  const tp = wolfTacticalPoint(unit);
  if (!tp || battle.finished || !wolfOwnerStands(unit)) return false;
  unit.mem.wolfReturn = { src };
  let ok;
  try {
    ok = battle.redeploy(unit, { free: true });
  } finally {
    unit.mem.wolfReturn = null;
  }
  if (!ok) return false;
  if (unit.mem.wolfTac === tp) unit.mem.wolfTac = null;
  if (tp.timer) tp.timer.cancel();
  return true;
}
function wolfTimerReturn(battle, unit, seq) {
  const tp = wolfTacticalPoint(unit);
  if (!tp || tp.seq !== seq || battle.finished) return;
  if (wolfReturnNow(battle, unit)) return;
  tp.timer = battle.after(WOLF_RETURN_RETRY, () => wolfTimerReturn(battle, unit, seq), { owner: unit });
}
function installWolfTacticalPoint(battle, unit, { onEnter = null } = {}) {
  battle.on("death", (ctx) => {
    if (ctx.unit !== unit || battle.finished || !WOLF_TAC_EXITS.has(ctx.reason) || !wolfOwnerStands(unit)) return;
    unit.removed = false;
    const t = wolfShadowInterval(unit.def) || Math.max(0, num4(unit.base.respawnTime, 0));
    const seq = (unit.mem.wolfTacSeq ?? 0) + 1;
    unit.mem.wolfTacSeq = seq;
    const tp = { seq, since: battle.time, until: battle.time + t, timer: null };
    unit.mem.wolfTac = tp;
    if (onEnter) onEnter(battle, unit);
    tp.timer = battle.after(t, () => wolfTimerReturn(battle, unit, seq), { owner: unit });
  }, { owner: unit, priority: -10 });
  battle.on("death", (ctx) => {
    const tp = wolfTacticalPoint(unit);
    if (!tp || !unit.ownerUnit || ctx.unit !== unit.ownerUnit) return;
    unit.mem.wolfTac = null;
    if (tp.timer) tp.timer.cancel();
  }, { owner: unit });
}
function wolfPack(bb, raw, def) {
  const leader = wolfLeader(def);
  const lb = leader?.bb ?? {};
  const interval = wolfShadowInterval(def);
  const perBlock = num4(lb["vigil_wolf_t_1_enhance[trigger].block_cnt"] ?? lb.block_cnt, 1);
  const maxShadows = textCount(leader?.description, /至多(\d+)只/, 1 + num4(lb["vigil_wolf_t_1_enhance[trigger].max_stack_cnt"], 0), "at-most-pack");
  const defPen = num4(talentBb(def, "def_penetrate_fixed").def_penetrate_fixed, 0);
  const guardMul = num4(talentWith(def, "prob")?.bb?.damage_scale, 1);
  const s3Key = Object.keys(bb || {}).find((k) => /atk_scale$/.test(k));
  const s3Scale = s3Key ? num4(bb[s3Key], 0) : 0;
  const setShadows = (battle, unit, n) => {
    unit.mem.shadows = n;
    battle.addBuff(unit, { key: "wolf:shadows", persist: true, allowDead: true, refresh: "replace", mods: { blockCnt: n * perBlock } });
  };
  return {
    skill: null,
    trait: { hitsFn: (b, u) => Math.max(1, u.mem.shadows ?? 1) },
    install(battle, unit) {
      unit.mem.wolfCapacity = maxShadows;
      const ot = (ownerOf(unit)?.def?.talents || []).map((t) => t.description || "").join(" ");
      const initShadows = Math.max(1, Math.min(maxShadows, textCount(ot, /初始(两|二|\d+)只/, maxShadows - 1, "initial-pack")));
      onDeploy(battle, unit, () => {
        const back = unit.mem.wolfReturn;
        setShadows(battle, unit, back ? 1 : initShadows);
        unit.hp = unit.s.maxHp;
        if (back && back.src == null) battle.fx("wolfShadow", { x: unit.x, y: unit.y, id: unit.id, n: 1 });
        const seq = unit.deploySeq;
        if (interval > 0) {
          battle.every(interval, (b, sched) => {
            if (!unit.alive || unit.deploySeq !== seq) {
              sched.cancel();
              return;
            }
            if ((unit.mem.shadows ?? 0) < maxShadows) {
              setShadows(b, unit, (unit.mem.shadows ?? 0) + 1);
              b.fx("wolfShadow", { x: unit.x, y: unit.y, id: unit.id, n: unit.mem.shadows });
            }
          }, { owner: unit });
        }
        const o = ownerOf(unit);
        if (o && o.profile?.sub === "tactician") o.trait.reinforcement = unit;
      }, 20);
      battle.on("fatal", (ctx) => {
        if (ctx.unit !== unit || ctx.prevented || !((unit.mem.shadows ?? 0) > 1)) return;
        ctx.prevented = true;
        setShadows(battle, unit, unit.mem.shadows - 1);
        unit.hp = unit.s.maxHp;
        battle.fx("wolfShadowLost", { x: unit.x, y: unit.y, id: unit.id, n: unit.mem.shadows });
      }, { owner: unit, priority: -50 });
      installWolfTacticalPoint(battle, unit, {
        onEnter: (b, u) => {
          setShadows(b, u, 0);
          b.fx("wolfShadowLost", { x: u.x, y: u.y, id: u.id, n: 0 });
        }
      });
      const packOrOwner = (s) => s === unit || s != null && s === ownerOf(unit);
      if (defPen > 0 || guardMul !== 1) {
        battle.on("hit", (ctx) => {
          const { source, target, dmg } = ctx;
          if (defPen > 0 && target && target.blockedBy === unit && unit.alive && packOrOwner(source) && dmg.isAttack && !managed(unit)) dmg.defIgnoreFlat += defPen;
          if (target === unit && guardMul !== 1 && source && source.blockedBy === unit) dmg.mul *= guardMul;
        }, { owner: unit });
      }
      if (s3Scale > 0) {
        battle.on("damaged", (ctx) => {
          const e = ctx.target, o = ownerOf(unit);
          if (!o || !ctx.dmg?.isAttack || !packOrOwner(ctx.source) || !e || e.side !== "enemy" || !e.alive || e.blockedBy !== unit) return;
          if (!unit.alive || !o.alive || !o.skill?.active || !o.skill.isTimed || managed(unit)) return;
          battle.dealDamage(ctx.source, e, { amount: o.s.atk * s3Scale, type: "arts", isSkill: true, canDodge: false, tags: ["vigil"] });
        }, { owner: unit });
      }
      const tacticianOwner = () => ownerOf(unit)?.profile?.sub === "tactician";
      battle.on("death", (ctx) => {
        if (ctx.unit !== unit.ownerUnit || !unit.alive || managed(unit) || !tacticianOwner()) return;
        battle.retreat(unit, { reason: "expired", permanent: true });
      }, { owner: unit });
    }
  };
}
function pickCopyTarget(battle, unit) {
  let best = null, bs = null;
  for (const a of battle.allyUnits) {
    if (a.kind !== "op" || !a.alive || !a.deployed || a.removed || a.hidden || a === unit.ownerUnit || a.ownerId !== unit.ownerId) continue;
    const d = Math.max(Math.abs(a.tileR - unit.tileR), Math.abs(a.tileC - unit.tileC));
    const s = [d, -a.base.atk, a.id];
    let less = !bs;
    if (!less) for (let i = 0; i < 3; i++) {
      if (s[i] < bs[i]) {
        less = true;
        break;
      }
      if (s[i] > bs[i]) break;
    }
    if (less) {
      best = a;
      bs = s;
    }
  }
  return best;
}
var MANIFOLD_STATS = Object.freeze(["maxHp", "atk", "def", "res", "blockCnt", "bat", "aspd"]);
var MANIFOLD_PROFILE = Object.freeze(["attack", "projectile", "canHitFly", "dmgType", "heal", "noAttack", "noAttackUnlessSkill"]);
function applyManifoldCopy(battle, unit, target, scale) {
  const tb = target.base;
  const b = unit.base;
  b.maxHp = Math.max(1, tb.maxHp * scale);
  b.atk = tb.atk * scale;
  b.def = tb.def * scale;
  b.res = tb.res * scale;
  b.blockCnt = tb.blockCnt;
  b.bat = tb.bat;
  b.aspd = tb.aspd;
  unit.markDirty();
  unit.hp = unit.s.maxHp;
  if (Array.isArray(target.rangeGrid) && target.rangeGrid.length) {
    unit.rangeGrid = target.rangeGrid;
    battle.refreshRange(unit);
  }
  const tp = target.profile || {};
  const ranged = tp.attack === "ranged" || target.def?.position === "RANGED";
  const p = unit.profile;
  if (p) {
    p.attack = ranged ? "ranged" : "melee";
    p.projectile = ranged ? tp.projectile && tp.projectile !== "none" && tp.projectile !== "orb" && tp.projectile !== "beam" ? tp.projectile : "bolt" : "none";
    p.canHitFly = ranged ? true : !!tp.canHitFly;
    if (!(tp.dmgType === "heal" || tp.dmgType === "none" || tp.noAttack || tp.noAttackUnlessSkill)) p.dmgType = tp.dmgType;
    p.heal = null;
    p.noAttack = false;
    p.noAttackUnlessSkill = false;
  }
  battle.removeBuff(unit, "mlyss:steal");
  unit.mem.copy = { id: target.id, defId: target.defId, ranged, scale };
  unit.mem.stolenAtk = 0;
  unit.mem.stolenDef = 0;
  unit.mem.atkCount = 0;
  battle.fx("manifoldCopy", { x: unit.x, y: unit.y, id: unit.id, from: target.id });
}
function cloneManifold(battle, clone, origin) {
  for (const k of MANIFOLD_STATS) clone.base[k] = origin.base[k];
  if (Array.isArray(origin.rangeGrid) && origin.rangeGrid.length) {
    clone.rangeGrid = origin.rangeGrid;
    battle.refreshRange(clone);
  }
  if (clone.profile && origin.profile) for (const k of MANIFOLD_PROFILE) clone.profile[k] = origin.profile[k];
  if (clone.profile) clone.profile.noAttack = false;
  clone.markDirty();
  clone.hp = clone.s.maxHp;
  clone.mem.copy = origin.mem.copy ? { ...origin.mem.copy } : null;
}
function manifold(bb, raw, def) {
  const tCopy = talentBb(def, "scale");
  const tSteal = talentBb(def, "steal_atk");
  const tSp = talentBb(def, "sp");
  const guardMul = num4(talentBb(def, "damage_scale").damage_scale, 1);
  const scale = num4(tCopy.scale, 1);
  const respawn = num4(tCopy.interval, 0);
  const stealAtk = num4(tSteal.steal_atk, 0), stealAtkMax = num4(tSteal.steal_atk_max, 0);
  const stealDef = num4(tSteal.steal_def, 0), stealDefMax = num4(tSteal.steal_def_max, 0);
  const splitEvery = Math.floor(num4(tSteal["mlyss_wtrman_t_2[range].max_stack_cnt"], 0));
  const splitLife = num4(tSteal.interval, 0);
  const sk = def?.skill;
  const spCost = num4(sk?.spCost, 0);
  const initSp = Math.min(spCost, num4(sk?.initSp, 0));
  const firstSp = num4(tSp.sp, 0);
  const split = (battle, unit) => {
    const tile = findSummonTile(battle, unit, "plus", { melee: false });
    if (!tile) return;
    const st = stateOf(battle);
    st.spawningClone = true;
    let c = null;
    try {
      c = battle.spawnToken(unit.ownerUnit ?? unit.ownerId, TOKEN_IDS.manifold, tile[0], tile[1], { duration: splitLife });
    } finally {
      st.spawningClone = false;
    }
    if (!c) return;
    cloneManifold(battle, c, unit);
    battle.fx("manifoldSplit", { x: c.x, y: c.y, id: c.id, from: unit.id });
  };
  return {
    skill: {
      // started by the install tick below only when there is an operator to copy (rule NEVER: no auto-cast on nobody)
      kind: "toggle",
      trigger: "NEVER",
      spType: "time",
      spCost,
      initSp,
      onStart({ battle, unit }) {
        if (unit.mem.noCopy || managed(unit)) return;
        const t = pickCopyTarget(battle, unit);
        if (t) applyManifoldCopy(battle, unit, t, scale);
      }
    },
    // no attack before the first copy (applyManifoldCopy / the 缪尔赛思 kit's copy switch it on)
    trait: {
      noAttack: true,
      afterHit: (b, u, target) => {
        const c = u.mem.copy;
        if (!c || c.ranged || !target || !target.alive || target.side !== "enemy" || managed(u)) return;
        const ga = Math.max(0, Math.min(stealAtk, stealAtkMax - (u.mem.stolenAtk ?? 0)));
        const gd = Math.max(0, Math.min(stealDef, stealDefMax - (u.mem.stolenDef ?? 0)));
        if (!(ga > 0 || gd > 0)) return;
        u.mem.stolenAtk = (u.mem.stolenAtk ?? 0) + ga;
        u.mem.stolenDef = (u.mem.stolenDef ?? 0) + gd;
        b.addBuff(u, { key: "mlyss:steal", refresh: "replace", mods: { atkFlat: u.mem.stolenAtk, defFlat: u.mem.stolenDef } });
        const robbed = target.mem.mlyssRobbed ??= { atk: 0, def: 0 };
        robbed.atk += ga;
        robbed.def += gd;
        b.addBuff(target, { key: "mlyss:stolen", refresh: "replace", mods: { atkFlat: -robbed.atk, defFlat: -robbed.def }, source: u });
      },
      afterAttack: (b, u) => {
        const c = u.mem.copy;
        if (!c || !c.ranged || u.mem.isClone || !(splitEvery > 0) || managed(u)) return;
        u.mem.atkCount = (u.mem.atkCount ?? 0) + 1;
        if (u.mem.atkCount % splitEvery === 0) split(b, u);
      }
    },
    install(battle, unit) {
      if (stateOf(battle).spawningClone) {
        unit.mem.isClone = true;
        unit.mem.noCopy = true;
      }
      const defaults = { base: Object.fromEntries(MANIFOLD_STATS.map((k) => [k, unit.base[k]])), rangeGrid: unit.rangeGrid, profile: {} };
      if (unit.profile) for (const k of MANIFOLD_PROFILE) defaults.profile[k] = unit.profile[k];
      onDeploy(battle, unit, () => {
        if (unit.mem.isClone) return;
        if (unit.mem.copy || unit.mem.mlyss) {
          Object.assign(unit.base, defaults.base);
          if (unit.profile) Object.assign(unit.profile, defaults.profile);
          if (unit.rangeGrid !== defaults.rangeGrid) {
            unit.rangeGrid = defaults.rangeGrid;
            battle.refreshRange(unit);
          }
          battle.removeBuff(unit, "mlyss:steal");
          battle.removeBuff(unit, "mlyss:stolen");
          unit.markDirty();
          unit.hp = unit.s.maxHp;
        }
        unit.mem.copy = null;
        unit.mem.mlyss = null;
        const o = ownerOf(unit);
        if (o && o.profile?.sub === "tactician") o.trait.reinforcement = unit;
        if (firstSp > 0 && !unit.mem.firstSpDone && !managed(unit) && unit.skill) {
          unit.mem.firstSpDone = true;
          unit.skill.gainSp(firstSp, "talent");
        }
      }, 20);
      if (!unit.mem.noCopy) {
        battle.on("tick", () => {
          const sk2 = unit.skill;
          if (!sk2 || !unit.alive || !unit.deployed || sk2.active || !sk2.ready || sk2.opCooling || !unit.canAct || unit.s.flags.silence) return;
          if (pickCopyTarget(battle, unit)) sk2.activate("MLYSS_WTRMAN");
        }, { owner: unit });
      }
      if (guardMul !== 1) {
        battle.on("hit", (ctx) => {
          if (ctx.target === unit && ctx.source && ctx.source.blockedBy === unit) ctx.dmg.mul *= guardMul;
        }, { owner: unit });
      }
      if (respawn > 0) enableRespawn(battle, unit, { delay: respawn, unlessManaged: true, requireOwner: () => !!unit.ownerUnit });
    }
  };
}
function champagneHold(battle, bomb) {
  battle.addBuff(bomb, { key: "token:champagneHold", flags: { noHeal: true, healFree: true, isolated: true }, persist: true, allowDead: true });
  battle.on("hit", (ctx) => {
    if (ctx.target === bomb) ctx.dmg.cancel = true;
  }, { owner: bomb, priority: 1e3 });
  battle.on("elementHit", (ctx) => {
    if (ctx.target === bomb) ctx.dmg.cancel = true;
  }, { owner: bomb, priority: 1e3 });
  battle.on("damaged", (ctx) => {
    if (ctx.target === bomb && bomb.alive) bomb.hp = bomb.s.maxHp;
  }, { owner: bomb, priority: 1e3 });
}
var CHAMPAGNE_TRIGGER = Object.freeze({ canHitFly: false, groundOnly: true });
function champagne(bb) {
  const scale = num4(bb["attack@atk_scale"] ?? bb.atk_scale, 0);
  const slug = num4(bb["attack@sluggish"] ?? bb.sluggish, 0);
  const extraAfter = num4(bb.duration_switch, Infinity);
  return {
    skill: {
      kind: "passive",
      onTick({ battle, unit }) {
        if (!unit.alive) return;
        let hit = null;
        for (const e of battle.enemies) {
          if (!canTargetEnemy(unit, e, CHAMPAGNE_TRIGGER)) continue;
          const on = e.hitArea ? bodyOnTile(e, unit.tileR, unit.tileC) : Math.abs(e.x - unit.tileC) <= 0.5 && Math.abs(e.y - unit.tileR) <= 0.5;
          if (on && (!hit || e.spawnSeq < hit.spawnSeq)) hit = e;
        }
        if (!hit) return;
        const hits = battle.time - unit.deployedAt >= extraAfter - 1e-9 ? 2 : 1;
        const amount = ownerAtk(unit) * scale;
        for (let i = 0; i < hits && hit.alive; i++) battle.dealDamage(unit, hit, { amount, type: "phys", isSkill: true, tags: ["summon", "trap"] });
        if (hit.alive && slug > 0) battle.applyStatus(hit, "sluggish", { duration: slug, source: unit });
        battle.fx("champagneBomb", { x: unit.x, y: unit.y, id: unit.id, target: hit.id, hits, consumed: true });
        battle.retreat(unit, { reason: "expired", permanent: true });
      }
    },
    trait: { noAttack: true },
    install(battle, unit) {
      untargetable(battle, unit);
      champagneHold(battle, unit);
    }
  };
}
function ulpiaMarker() {
  return {
    skill: null,
    trait: { noAttack: true },
    install(battle, unit) {
      untargetable(battle, unit);
      bindToOwnerSkill(battle, unit);
      const home = () => {
        if (!unit.alive) return;
        const r = unit.tileR, c = unit.tileC;
        battle.retreat(unit, { reason: "expired", permanent: true });
        const o = ownerOf(unit);
        if (o && o.alive && o.deployed && (o.tileR !== r || o.tileC !== c) && battle.moveRedeploy(o, r, c, { clearSp: true })) battle.fx("ulpiaReturn", { x: c, y: r, id: o.id });
      };
      battle.on("skillEnd", (ctx) => {
        if (ctx.unit === unit.ownerUnit && unit.mem.boundActivation != null && ctx.skill.activations === unit.mem.boundActivation) home();
      }, { owner: unit, priority: 10 });
      battle.on("death", (ctx) => {
        if (ctx.unit === unit.ownerUnit && unit.alive) battle.retreat(unit, { reason: "expired", permanent: true });
      }, { owner: unit });
    }
  };
}
function goldenOath(bb, raw, def) {
  const trueDmg = /真实伤害/.test(String(def?.trait ?? ""));
  return {
    skill: null,
    trait: trueDmg ? { dmgType: "true" } : {},
    install(battle, unit) {
      bindToOwnerSkill(battle, unit);
    }
  };
}
function catShield(bb, raw, def) {
  const t = talentBb(def, "max_shield_ratio");
  const idle = num4(t.interval, 0);
  const every = num4(t["catsld_t_1[timer][interval].interval"], 1);
  const maxRatio = num4(t.max_shield_ratio, 0);
  const refill = num4(t.shield_ratio_each_trigger, 0);
  return {
    skill: null,
    trait: { noAttack: true },
    install(battle, unit) {
      const st = stateOf(battle);
      battle.addBuff(unit, { key: "token:catDevice", flags: { invulnerable: true }, persist: true, allowDead: true });
      const ownerHp = () => {
        const o = ownerOf(unit);
        return o ? o.s.maxHp : unit.s.maxHp;
      };
      const valid = (a) => a && a.alive && a.deployed && a.kind === "op";
      const pick = () => {
        let best = null;
        for (const k of unit.rangeKeys || []) {
          const a = battle.unitAt(k / COLS | 0, k % COLS);
          if (!valid(a) || a.ownerId !== unit.ownerId) continue;
          const holder = st.catTargets.get(a.id);
          if (holder && holder !== unit && holder.alive) continue;
          best = a;
          break;
        }
        if (unit.mem.target && st.catTargets.get(unit.mem.target.id) === unit) st.catTargets.delete(unit.mem.target.id);
        unit.mem.target = best;
        if (best) st.catTargets.set(best.id, unit);
        return best;
      };
      const give = (a, amount) => {
        const cap = ownerHp() * maxRatio;
        if (!(cap > 0) || !(amount > 0)) return;
        const b = a.findBuff(CAT_SHIELD_KEY);
        if (b) {
          b.shield = Math.min(cap, (b.shield || 0) + amount);
          a.markDirty();
        } else battle.addBuff(a, { key: CAT_SHIELD_KEY, shield: Math.min(cap, amount), duration: Infinity, visible: true, source: unit });
      };
      const connect = () => {
        const a = pick();
        if (a) {
          give(a, ownerHp() * maxRatio);
          battle.fx("catShield", { x: a.x, y: a.y, id: a.id, from: unit.id });
        }
        return a;
      };
      onDeploy(battle, unit, connect);
      battle.every(every, () => {
        if (!unit.alive || !unit.deployed) return;
        const a = unit.mem.target;
        if (!valid(a)) {
          connect();
          return;
        }
        const o = ownerOf(unit);
        const skillOn3 = !!(o && o.alive && o.skill && o.skill.active && o.skill.isTimed);
        const rate = skillOn3 ? num4(o.skill.bb?.overwrite_ratio, refill) : refill;
        if (skillOn3 || battle.time - a.lastHitAt >= idle - 1e-9) give(a, ownerHp() * rate * every);
      }, { owner: unit });
      battle.on("death", (ctx) => {
        if (ctx.unit === unit && unit.mem.target && st.catTargets.get(unit.mem.target.id) === unit) st.catTargets.delete(unit.mem.target.id);
      }, { owner: unit });
    }
  };
}
var YANYOU_STOP = 0.25;
var YANYOU_FRAGILE_RADIUS = 1.5;
var YANYOU_AURA_EVERY = 0.2;
var YANYOU_PROFILE = Object.freeze({ canHitFly: true });
function topAggroEnemy(battle, u) {
  let best = null, bk = null;
  for (const e of battle.enemies) {
    if (!canTargetEnemy(u, e, YANYOU_PROFILE)) continue;
    const k = [-(e.s.taunt || 0), battle.remainingDistance(e), e.spawnSeq];
    if (!bk || k[0] < bk[0] || k[0] === bk[0] && (k[1] < bk[1] - 1e-9 || Math.abs(k[1] - bk[1]) <= 1e-9 && k[2] < bk[2])) {
      best = e;
      bk = k;
    }
  }
  return best;
}
function yanyouKit(bb, raw) {
  const tal = raw?.talents && !Array.isArray(raw.talents) ? raw.talents.bb ?? {} : raw?.talent ?? {};
  const skills = Array.isArray(raw?.skills) ? raw.skills : [];
  const sk = skills.find((s) => s.prefabKey === "Skill_2") ?? skills.find((s) => s.prefabKey === "Skill") ?? skills[0] ?? {};
  const maxTargets = Math.max(1, Math.floor(num4(tal["1.attack@max_target"], 1)));
  const epRatio = num4(tal["2.ep_damage_ratio"], 0);
  const fragMul = num4(tal["2.damage_scale"], 1);
  const radius = num4(raw?.stats?.rangeRadius, 0) > 0 ? num4(raw.stats.rangeRadius, 0) : 2;
  const moveSpeed = num4(raw?.stats?.moveSpeed, 1);
  const cd = num4(sk.cooldown, 0);
  const initCd = num4(sk.initCooldown, cd);
  const flameScale = num4(sk.bb?.atk_scale, 0);
  const flameDur = num4(sk.bb?.hit_duration, 0);
  const flameR = num4(sk.bb?.range_radius, 0);
  const lockOf = (u) => {
    const t = u.mem.flame?.target;
    return t && t.alive && canTargetEnemy(u, t, YANYOU_PROFILE) ? t : null;
  };
  const refreshKeys = (u) => {
    if (u.mem.keysAt && u.rangeKeys === u.mem.keysRef && Math.abs(u.mem.keysAt.x - u.x) < 0.05 && Math.abs(u.mem.keysAt.y - u.y) < 0.05) return;
    const keys = [];
    const r0 = Math.floor(u.y - radius), r1 = Math.ceil(u.y + radius), c0 = Math.floor(u.x - radius), c1 = Math.ceil(u.x + radius);
    for (let r = Math.max(0, r0); r <= Math.min(ROWS - 1, r1); r++) {
      for (let c = Math.max(0, c0); c <= Math.min(COLS - 1, c1); c++) if (hypot(c - u.x, r - u.y) <= radius + 1e-9) keys.push(r * COLS + c);
    }
    u.rangeKeys = keys;
    u.rangeKeySet = new Set(keys);
    u.baseRangeKeys = keys;
    u.mem.keysRef = keys;
    u.mem.keysAt = { x: u.x, y: u.y };
  };
  return {
    skill: cd > 0 && flameDur > 0 ? {
      kind: "duration",
      duration: flameDur,
      spType: "time",
      spCost: cd,
      initSp: Math.max(0, cd - initCd),
      trigger: "DEFAULT",
      attack: { noAttack: true },
      // channelling: no normal attacks
      onStart({ battle, unit }) {
        const list = battle.enemiesInKeys(unit.rangeKeys, unit, YANYOU_PROFILE);
        sortEnemyTargets(battle, unit, list, null);
        unit.mem.flame = { target: list[0] ?? null, acc: 1 };
        if (!list[0]) unit.skill.end("noTarget");
      },
      onTick({ battle, unit, dt }) {
        const f = unit.mem.flame;
        if (!f) return;
        if (unit.s.flags.silence) {
          unit.skill.end("silence");
          return;
        }
        const t = lockOf(unit);
        if (!t) {
          unit.skill.end("targetLost");
          return;
        }
        if (!unit.canAct) return;
        f.acc += dt ?? battle.dt;
        if (f.acc < 1 - 1e-9) return;
        f.acc -= 1;
        const hit = flameR > 0 ? battle.foesInRadius(t.x, t.y, flameR) : [];
        if (!hit.includes(t)) hit.unshift(t);
        for (const e of hit) battle.dealDamage(unit, e, { amount: unit.s.atk * flameScale, type: "arts", isSkill: true, tags: ["flame"] });
        battle.fx("yanyouFlame", { x: t.x, y: t.y, id: unit.id, target: t.id, r: flameR, n: hit.length, dur: 1 });
      },
      onEnd({ unit }) {
        unit.mem.flame = null;
      }
    } : null,
    trait: { attack: "ranged", dmgType: "arts", projectile: "bolt", canHitFly: true, maxTargets, heal: null, noAttack: false },
    install(battle, unit) {
      unit.motion = "FLY";
      if (!(unit.base.spRecovery > 0)) unit.base.spRecovery = 1;
      unit.base.blockCnt = 0;
      const speed = moveSpeed * MOVE_SCALE;
      onDeploy(battle, unit, () => {
        unit.mem.keysAt = null;
        refreshKeys(unit);
      });
      if (epRatio > 0) {
        battle.on("damaged", (ctx) => {
          const t = ctx.target;
          if (ctx.source !== unit || !t || t.side !== "enemy" || !hasHp(t)) return;
          if (ctx.type === "element" || ctx.type === "elemental" || !(ctx.amount > 0)) return;
          battle.dealDamage(unit, ctx.target, { type: "element", element: "burn", amount: unit.s.atk * epRatio, tags: ["yanyou"] });
        }, { owner: unit });
      }
      battle.on("elementHit", (ctx) => {
        if (ctx.target === unit) ctx.dmg.cancel = true;
      }, { owner: unit });
      let auraAcc = YANYOU_AURA_EVERY;
      battle.on("tick", ({ dt }) => {
        if (!unit.alive || !unit.deployed) return;
        if (unit.canAct && !unit.s.flags.noMove && speed > 0) {
          const tgt = lockOf(unit) ?? topAggroEnemy(battle, unit);
          if (tgt) {
            const dx = tgt.x - unit.x, dy = tgt.y + num4(unit.mem.hoverDy, 0) - unit.y;
            const d = hypot(dx, dy);
            if (d > YANYOU_STOP + 1e-6) {
              const step = Math.min(d - YANYOU_STOP, speed * dt);
              const R = battle.rect;
              unit.x = Math.max(R.c0, Math.min(R.c1, unit.x + dx / d * step));
              unit.y = Math.max(R.r0, Math.min(R.r1, unit.y + dy / d * step));
            }
          }
        }
        refreshKeys(unit);
        auraAcc += dt;
        if (fragMul > 1 && auraAcc >= YANYOU_AURA_EVERY - 1e-9) {
          auraAcc = 0;
          for (const e of battle.foesInRadius(unit.x, unit.y, YANYOU_FRAGILE_RADIUS)) {
            battle.applyStatus(e, "elemFragile", { duration: 2 * YANYOU_AURA_EVERY, value: fragMul - 1, source: unit });
          }
        }
      }, { owner: unit });
    }
  };
}
var touchExitCounts = (ctx) => ctx.reason === "killed" || ctx.reason === "retreat" && !!ctx.dying;
function mapCharTalents(def) {
  const out = [];
  for (const t of def?.talents ?? []) {
    const bb = t?.bb ?? {};
    const text = String(t?.description ?? "");
    const sp = num4(bb.sp, 0);
    if (sp > 0 && /治疗.*技力/.test(text)) {
      out.push({ install(battle, unit) {
        battle.on("heal", (ctx) => {
          const tg = ctx.target;
          if (ctx.source !== unit || ctx.opts?.regen || !tg || tg.kind === "device" || !tg.skill || tg.skill.noSkill) return;
          tg.skill.gainSp(sp, "talent");
        }, { owner: unit, priority: -200 });
      } });
    } else if (sp > 0 && /被击倒/.test(text)) {
      out.push({ install(battle, unit) {
        battle.on("death", (ctx) => {
          const d = ctx.unit;
          if (!touchExitCounts(ctx) || !unit.alive || !unit.deployed || !unit.skill || !d || d === unit || d.kind !== "op" || d.ownerId !== unit.ownerId) return;
          if ((unit.rangeKeySet || new Set(unit.rangeKeys || [])).has(d.tileR * COLS + d.tileC)) {
            unit.skill.gainSp(sp, "talent");
            battle.fx("spGain", { x: unit.x, y: unit.y, id: unit.id, n: sp });
          }
        }, { owner: unit });
      } });
    } else if (!/时|每|若|当/.test(text)) {
      const mods = {};
      if (num4(bb.atk, 0)) mods.atkPct = num4(bb.atk, 0);
      if (num4(bb.def, 0)) mods.defPct = num4(bb.def, 0);
      if (num4(bb.max_hp, 0)) mods.hpPct = num4(bb.max_hp, 0);
      if (num4(bb.attack_speed, 0)) mods.aspd = num4(bb.attack_speed, 0);
      if (Object.keys(mods).length) {
        out.push({ install(battle, unit) {
          battle.addBuff(unit, { key: `talent:${t.name || "stat"}`, persist: true, allowDead: true, mods, tags: ["talent"] });
        } });
      }
    }
  }
  return out;
}
function reserveMedicKit(bb, raw, def) {
  const k = def?.skill ? genericKit(bb, raw, def) : { skill: null, talents: [] };
  return { ...k, talents: [...k.talents ?? [], ...mapCharTalents(def)] };
}
function touchGospel(bb, skill) {
  const hpRatio = num4(bb.hp_ratio, 0), boost = num4(bb.heal_scale, 1), extra = num4(bb["attack@addition_heal_scale"], 0);
  const targeting = {};
  if (num4(bb["attack@max_target"], 0) > 1) targeting.maxTargets = Math.floor(num4(bb["attack@max_target"], 1));
  if (skill.rangeGrid && skill.rangeGrid.length) targeting.rangeGrid = skill.rangeGrid;
  return {
    skill: {
      kind: skill.duration > 0 ? "duration" : "instant",
      heal: true,
      mods: num4(bb.atk, 0) ? { atkPct: num4(bb.atk, 0) } : void 0,
      targeting,
      onHit({ battle, unit, target, heal }) {
        if (!(extra > 0) || !target || !(heal > 0)) return;
        const n = unit.stats.attacks;
        if (unit.mem.touchExtraAt === n) return;
        unit.mem.touchExtraAt = n;
        let best = target;
        for (const a of battle.alliesInRadius(target.x, target.y, 1)) {
          if (a === target || !battle.allySelectable(a, unit) || a.s.flags.noHeal || a.profile?.noHeal) continue;
          if (Math.abs(a.tileR - target.tileR) + Math.abs(a.tileC - target.tileC) !== 1) continue;
          if (a.hpRatio < best.hpRatio - 1e-9) best = a;
        }
        battle.heal(unit, best, heal * extra);
      }
    },
    install(battle, unit) {
      battle.on("heal", (ctx) => {
        if (ctx.source !== unit || ctx.opts?.regen || !unit.skill?.active) return;
        if (boost !== 1 && hpRatio > 0 && ctx.target.hpRatio < hpRatio - 1e-9) ctx.amount *= boost;
      }, { owner: unit });
    }
  };
}
function touchKit(bb, raw, def) {
  const sk = def?.skill;
  if (!sk) return { skill: null, talents: mapCharTalents(def) };
  const g = touchGospel(bb, sk);
  if (sk.rangeGrid && sk.rangeGrid.length) g.skill.trigger = { rule: "ACTIVE_RANGE", grid: sk.rangeGrid };
  return { talents: mapCharTalents(def), skill: g.skill, install: g.install };
}
var RAW_KITS = {
  [TOKEN_IDS.healDrone]: healDrone,
  [TOKEN_IDS.curseDoll]: curseDoll,
  [TOKEN_IDS.obelisk]: obelisk,
  [TOKEN_IDS.rosmonGear]: rosmonGear,
  [TOKEN_IDS.duskDragon]: duskDragon,
  [TOKEN_IDS.seaborn]: seaborn,
  [TOKEN_IDS.radiantSword]: radiantSword,
  [TOKEN_IDS.paperDoll]: paperDoll,
  [TOKEN_IDS.wolfPack]: wolfPack,
  [TOKEN_IDS.manifold]: manifold,
  [TOKEN_IDS.champagne]: champagne,
  [TOKEN_IDS.ulpiaMarker]: ulpiaMarker,
  [TOKEN_IDS.goldenOath]: goldenOath,
  [TOKEN_IDS.catShield]: catShield,
  [TOKEN_IDS.makotoMask]: maskDisplay,
  [TOKEN_IDS.makotoMask2]: maskDisplay,
  [TOKEN_IDS.deliveryTarget]: inert({ hideFromEnemies: true }),
  [TOKEN_IDS.eagle1]: inert({ hideFromEnemies: true }),
  [TOKEN_IDS.eagle2]: inert({ hideFromEnemies: true }),
  [TOKEN_IDS.eagle3]: inert({ hideFromEnemies: true }),
  [TOKEN_IDS.iceTarget]: inert(),
  [TOKEN_IDS.yanyou]: yanyouKit,
  [TOKEN_IDS.reserveMedic]: reserveMedicKit,
  [TOKEN_IDS.touch]: touchKit
};
var kits = Object.freeze(Object.fromEntries(Object.entries(RAW_KITS).map(([id, f]) => [id, (bb, raw, def) => {
  const k = f(bb ?? {}, raw ?? {}, def ?? null);
  if (k && typeof k === "object") k.fromTokens = true;
  return k;
}])));
var SKILL_SUMMONS = Object.freeze({
  [TOKEN_IDS.healDrone]: "ally",
  [TOKEN_IDS.curseDoll]: "enemy",
  [TOKEN_IDS.obelisk]: "melee",
  [TOKEN_IDS.paperDoll]: "adjacent",
  [TOKEN_IDS.goldenOath]: "adjacent",
  [TOKEN_IDS.radiantSword]: "plus",
  [TOKEN_IDS.rosmonGear]: "melee"
});
var SKILL_SUMMON_PER_CAST = Object.freeze({ [TOKEN_IDS.rosmonGear]: 2, [TOKEN_IDS.goldenOath]: 8 });
var SKILL_SUMMON_UNCAPPED = /* @__PURE__ */ new Set([TOKEN_IDS.goldenOath]);
var TACTICIAN_TOKENS = /* @__PURE__ */ new Set([TOKEN_IDS.wolfPack, TOKEN_IDS.manifold]);

// mods/marisa-native/source/server/data.js
var getData = () => ({});

// mods/marisa-native/source/server/sim/content/support/index.js
var num5 = (v, d = 0) => typeof v === "number" && Number.isFinite(v) ? v : typeof v === "string" && v.trim() !== "" && Number.isFinite(+v) ? +v : d;
var own2 = (o, k) => o && typeof o === "object" && typeof k === "string" && Object.prototype.hasOwnProperty.call(o, k) ? o[k] : null;
var QUIET = Object.freeze({ warn() {
}, error() {
}, info() {
} });
var DATA = null;
var SOURCES = /* @__PURE__ */ new WeakMap();
function contentDataOf(source) {
  if (!source || typeof source !== "object") return gameData();
  if (SOURCES.has(source)) return SOURCES.get(source);
  const parent = source.fallback ? contentDataOf(source.fallback) : gameData();
  const out = { ...parent, ...source.contentRaw };
  for (const [name, value] of Object.entries(source.raw || {})) {
    if (value == null) continue;
    out[name] = value && typeof value === "object" && !Array.isArray(value) ? { ...out[name] || {}, ...value } : value;
  }
  SOURCES.set(source, out);
  return out;
}
function gameData() {
  if (!DATA) {
    try {
      DATA = getData({ log: QUIET }) || {};
    } catch {
      DATA = {};
    }
  }
  return DATA;
}
function setGameData(d) {
  DATA = d ?? null;
  CORE = null;
}
var bondRecord = (id) => own2(gameData().bonds, id);
var itemRecord = (id) => own2(gameData().items, id);
var garrisonRecord = (id) => own2(gameData().garrisons, id);
var bandRecord = (id) => own2(gameData().bands, id);
var isGoldenId = (id) => /_b$/.test(String(id ?? ""));
function buffsOf(rec) {
  const out = [];
  for (const b of rec && Array.isArray(rec.buffs) ? rec.buffs : []) {
    if (!b || typeof b !== "object") continue;
    out.push({ key: b.key ?? null, bbKey: b.bbStr && typeof b.bbStr.key === "string" ? b.bbStr.key : null, p: { ...b.bb || {}, ...b.bbStr || {} } });
  }
  return out;
}
function buffParams(rec, key) {
  for (const b of buffsOf(rec)) {
    const hit = key instanceof RegExp ? key.test(b.key ?? "") || key.test(b.bbKey ?? "") : b.key === key || b.bbKey === key;
    if (hit) return b.p;
  }
  return null;
}
var CORE = null;
function coreBondIds() {
  if (!CORE) {
    CORE = /* @__PURE__ */ new Set();
    for (const [id, b] of Object.entries(gameData().bonds || {})) if (b && b.isCore) CORE.add(id);
  }
  return CORE;
}
var isCoreBond = (id) => coreBondIds().has(id);
var player = (battle, pid) => battle && pid != null ? battle.getPlayer(pid) : null;
function bondState(battle, pid, bondId) {
  const b = player(battle, pid)?.bonds?.[bondId];
  return b && typeof b === "object" ? b : null;
}
function bondTier(battle, pid, bondId) {
  const b = bondState(battle, pid, bondId);
  return b && b.active ? Math.max(1, Math.floor(num5(b.tier, 1))) : 0;
}
var bondActive = (battle, pid, bondId, minTier = 1) => bondTier(battle, pid, bondId) >= minTier;
var bondLayers = (battle, pid, bondId) => Math.max(0, num5(bondState(battle, pid, bondId)?.layers, 0));
function activeBondIds(battle, pid) {
  const out = [];
  const bonds = player(battle, pid)?.bonds;
  if (bonds && typeof bonds === "object") {
    for (const [id, b] of Object.entries(bonds)) if (b && b.active) out.push(id);
  }
  return out;
}
function topActiveBond(battle, pid) {
  let best = null, bl = -1;
  for (const id of Object.keys(gameData().bonds || {})) {
    if (!bondActive(battle, pid, id)) continue;
    const l = bondLayers(battle, pid, id);
    if (l > bl) {
      bl = l;
      best = id;
    }
  }
  return best;
}
var EMPTY = Object.freeze([]);
var isOp = (u) => !!u && u.kind === "op";
var onField = (u) => !!u && u.alive && u.deployed;
var isElite = (u) => !!(u && u.def && (u.def.golden || isGoldenId(u.def.id)));
function tierOf(u) {
  if (!u) return 1;
  if (u.kind === "op") return Math.max(1, Math.floor(num5(u.def?.tier ?? u.def?.raw?.tier, 1)));
  if (u.ownerUnit) return tierOf(u.ownerUnit);
  return 1;
}
var isGroundOp = (u) => isOp(u) && u.def?.position === "MELEE";
var baseChessId = (u) => String(u?.def?.baseId ?? u?.defId ?? "").replace(/_b$/, "_a");
var itemsOf = (u) => u && Array.isArray(u.items) ? u.items : EMPTY;
var BONDS = /* @__PURE__ */ new WeakMap();
function unitBonds(u) {
  if (!isOp(u)) return EMPTY;
  const cached2 = BONDS.get(u);
  const items = itemsOf(u);
  const key = items.join("|");
  if (cached2 && cached2.key === key) return cached2.bonds;
  const out = [...Array.isArray(u.def?.bonds) ? u.def.bonds : Array.isArray(u.def?.raw?.bonds) ? u.def.raw.bonds : []];
  if (items.length >= 2) {
    const recs = items.map((id) => itemRecord(id)).filter(Boolean);
    if (recs.some((r) => r.canGiveBond)) {
      for (const r of recs) {
        if (r.canGiveBond) continue;
        if (typeof r.giveBondId === "string" && bondRecord(r.giveBondId) && !out.includes(r.giveBondId)) out.push(r.giveBondId);
      }
    }
  }
  const bonds = Object.freeze(out);
  BONDS.set(u, { key, bonds });
  return bonds;
}
function isMember(battle, u, bondId) {
  const own3 = unitBonds(u);
  if (own3.includes(bondId)) return true;
  return isCoreBond(bondId) && own3.includes("maniShip") && bondActive(battle, u.ownerId, "maniShip");
}
function bondMembers(battle, pid, bondId, { fieldOnly = false, tokens = false } = {}) {
  const out = [];
  for (const u of battle.allyUnits) {
    if (u.ownerId !== pid) continue;
    if (u.kind !== "op" && !(tokens && u.kind === "token")) continue;
    if (fieldOnly && !onField(u)) continue;
    const who = u.kind === "token" ? u.ownerUnit : u;
    if (who && isMember(battle, who, bondId)) out.push(u);
  }
  return out;
}
function playerOps(battle, pid, { fieldOnly = false } = {}) {
  const out = [];
  for (const u of battle.allyUnits) if (u.kind === "op" && u.ownerId === pid && (!fieldOnly || onField(u))) out.push(u);
  return out;
}
var N4 = Object.freeze([[1, 0], [-1, 0], [0, 1], [0, -1]]);
var N8 = Object.freeze([[1, -1], [1, 0], [1, 1], [0, -1], [0, 1], [-1, -1], [-1, 0], [-1, 1]]);
function allyAt(battle, r, c, pid = null) {
  if (!Number.isInteger(r) || !Number.isInteger(c)) return null;
  const u = battle.unitAt(r, c);
  if (!u || u.side !== "ally" || !u.alive || u.kind === "device") return null;
  return pid == null || u.ownerId === pid ? u : null;
}
function alliesAround(battle, u, offsets = N4) {
  const out = [];
  for (const [dr, dc] of offsets) {
    const [r, c] = offsetTile(u.tileR, u.tileC, dr, dc, u.dir);
    const a = allyAt(battle, r, c, u.ownerId);
    if (a && a !== u) out.push(a);
  }
  return out;
}
function rowMates(battle, u) {
  const out = [];
  for (const a of battle.allyUnits) if (a.kind === "op" && a.ownerId === u.ownerId && onField(a) && a.tileR === u.tileR) out.push(a);
  return out;
}
var tileKey = (u) => u.side === "ally" ? u.tileR * COLS + u.tileC : Math.round(u.y) * COLS + Math.round(u.x);
var onKeys = (target, keys) => {
  if (!target || !keys) return false;
  if (target.side !== "ally") return bodyInRange(target, keys);
  const k = tileKey(target);
  return keys instanceof Set ? keys.has(k) : keys.includes(k);
};
var inRange = (u, target) => !!(u && target && u.rangeKeySet && onKeys(target, u.rangeKeySet));
function directMods({ atk = 0, def = 0, hp = 0 } = {}, extra = null) {
  const m = {};
  const put = (pct, mul, v) => {
    if (!(typeof v === "number" && Number.isFinite(v)) || v === 0) return;
    if (DIRECT_BONUS_STACKING === "multiply") m[mul] = Math.max(0, 1 + v);
    else m[pct] = v;
  };
  put("atkPct", "atkMul", atk);
  put("defPct", "defMul", def);
  put("hpPct", "hpMul", hp);
  return extra ? Object.assign(m, extra) : m;
}
function passiveBuff(battle, u, key, mods, extra = {}) {
  return battle.addBuff(u, { key, mods, persist: true, allowDead: true, refresh: "replace", ...extra });
}
function fxOn(battle, kind, u, src, key, extra = {}) {
  if (!u) return;
  battle.fx(kind, { x: u.x, y: u.y, id: u.id, src, key, ...extra });
}
var STORES = /* @__PURE__ */ new WeakMap();
function battleStore(battle, ns, init = () => ({})) {
  let m = STORES.get(battle);
  if (!m) {
    m = /* @__PURE__ */ new Map();
    STORES.set(battle, m);
  }
  let s = m.get(ns);
  if (s === void 0) {
    s = init();
    m.set(ns, s);
  }
  return s;
}
function gainLayers(battle, { playerId, bonds, n, requireActive = true, source = null, reason = "content", cap = Infinity, capKey = null } = {}) {
  if (!battle || !battle.flags || !battle.flags.layerGainsEnabled || playerId == null) return 0;
  const k0 = Math.floor(num5(n, 0));
  if (!(k0 > 0)) return 0;
  const list = Array.isArray(bonds) ? bonds : [bonds];
  const caps = capKey != null && Number.isFinite(cap) ? battleStore(battle, "support:layerCaps", () => /* @__PURE__ */ new Map()) : null;
  let total = 0;
  for (const b of list) {
    if (typeof b !== "string" || !b) continue;
    if (requireActive && !bondActive(battle, playerId, b)) continue;
    let k = k0;
    let ck = null;
    if (caps) {
      ck = `${capKey}|${b}`;
      const used = caps.get(ck) ?? 0;
      k = Math.min(k, Math.max(0, Math.floor(cap) - used));
      if (!(k > 0)) continue;
    }
    const added = battle.addLayers(playerId, b, k, reason, { source });
    if (added > 0) {
      total += added;
      if (ck) caps.set(ck, (caps.get(ck) ?? 0) + k);
    }
  }
  return total;
}

// mods/marisa-native/source/server/sim/content/items/battle.js
var PRIO_REVIVE = -100;
var PRIO_UNDYING_HELD = PRIO_REVIVE + 1;
var PRIO_RESPAWN = 13;
function reviveNow(battle, c, by) {
  const u = c && c.unit;
  if (!u || c.reason !== "killed" || c.revivedBy || !isOp(u) || u.alive || u.removed) return false;
  if (!battle.redeploy(u, { free: true })) return false;
  c.revivedBy = by;
  return true;
}
function mitigated(amount, type, target, source, dmg) {
  const ss = source && source.s ? source.s : null;
  return mitigate(amount, type, target.s, {
    defIgnorePct: (dmg.defIgnorePct || 0) + (ss ? ss.defIgnorePct : 0),
    defIgnoreFlat: (dmg.defIgnoreFlat || 0) + (ss ? ss.defIgnoreFlat : 0),
    resIgnorePct: (dmg.resIgnorePct || 0) + (ss ? ss.resIgnorePct : 0),
    resIgnoreFlat: (dmg.resIgnoreFlat || 0) + (ss ? ss.resIgnoreFlat : 0)
  });
}
function weaknessRetype(dmg, source, target) {
  if (!dmg || !target || !target.s || dmg.type !== "phys" && dmg.type !== "arts") return;
  const ph = mitigated(dmg.amount, "phys", target, source, dmg);
  const ar = mitigated(dmg.amount, "arts", target, source, dmg);
  const best = ar > ph + 1e-9 ? "arts" : ph > ar + 1e-9 ? "phys" : dmg.type;
  if (best !== dmg.type) dmg.type = best;
}
function addShieldLayer(battle, target, key, cap = 1) {
  if (!target || !target.alive) return false;
  const cur = target.findBuff(key);
  const have = cur ? cur.shieldHits || 0 : 0;
  if (have >= cap) return false;
  battle.addBuff(target, { key, shieldHits: have + 1, visible: true, refresh: "replace" });
  return true;
}

// mods/marisa-native/source/server/sim/content/kits/shared/mod-tier3.js
var MASK_SWITCH = 0.5;
var num6 = (v, d = 0) => typeof v === "number" && Number.isFinite(v) ? v : d;
var defOf = (chess, def) => def ?? normalizeChess(chess);
var talentBb2 = (d, i) => d?.talents?.[i]?.bb ?? {};
var traitBb = (d) => d?.traitBb ?? {};
var selectedId = (chess, d) => d?.skill?.id ?? chess?.skill?.skillId ?? null;
function skillData(chess, d, bb, id) {
  if (id != null && selectedId(chess, d) === id && d?.skill) return { ...d.skill, bb: bb ?? d.skill.bb ?? {} };
  const rec = (chess?.skills ?? []).find((s) => s && s.skillId === id);
  return rec && normalizeSkill({ skill: rec }) || { id, bb: {}, rangeGrid: null, maxCharges: 1, duration: 0, description: "" };
}
function altSkills(chess, d, bb, builders) {
  const out = {};
  for (const [id, build] of Object.entries(builders)) out[id] = build(skillData(chess, d, bb, id));
  return out;
}
var alive = (u) => !!(u && u.alive && u.deployed);
var tileKeyOf = (u) => u.side === "ally" ? u.tileR * COLS + u.tileC : Math.round(u.y) * COLS + Math.round(u.x);
var onTiles = (x, set) => x.side === "ally" ? set.has(tileKeyOf(x)) : bodyInKeys(x, set);
var gridKeys = (grid, u, ext = 0) => absoluteRangeKeys(grid || [[0, 0]], u.tileR, u.tileC, u.dir, ext);
var fx = (battle, kind, u, extra = {}) => battle.fx(kind, { x: u.x, y: u.y, id: u.id, ...extra });
var copyGrid = (g) => Array.isArray(g) && g.length ? g.map((p) => [p[0], p[1]]) : null;
var NINE = [[1, -1], [1, 0], [1, 1], [0, -1], [0, 0], [0, 1], [-1, -1], [-1, 0], [-1, 1]];
function enemiesOn(battle, unit, keys, n = 0, profile = null) {
  const list = battle.enemiesInKeys(keys, unit, profile ?? { canHitFly: true });
  sortEnemyTargets(battle, unit, list, (profile ?? unit.profile)?.priority ?? null);
  return n > 0 && list.length > n ? list.slice(0, n) : list;
}

// mods/marisa-native/source/server/sim/content/kits/ops/op-makoto.js
var op_makoto_default = {
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
  //   emits the renderer's 'phase' fx with `form` (render/units.js FORMS `char_x_marisa_makoto`).
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
  //   NONE) — the 20 s belong to 特性 char_x_marisa_makoto.trait ("持续20秒后自身再次替换<替身>"). The client's skill bar
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
  char_x_marisa_makoto: (bb, chess, def) => {
    const d = defOf(chess, def);
    const t0 = talentBb2(d, 0), t1 = talentBb2(d, 1);
    const stats = { atk: num6(t0.atk, 0.4), bat: num6(t0.base_attack_time, 0.4), hp: num6(t0.max_hp_t1, 0.35), sluggish: num6(t0.sluggish, 0) };
    const sees = num6(t1.atk_scale, 1.8);
    const sid = selectedId(chess, d);
    const baseBat = Math.max(0.1, num6(chess?.stats?.bat, 1) || 1);
    const bodyGrid = copyGrid(d.rangeGrid) ?? copyGrid(chess?.rangeGrid) ?? null;
    const dollRaw = num6(traitBb(d).duration, num6(d?.raw?.trait?.bb?.duration, 20));
    const dollDuration = dollRaw > 0 ? dollRaw : 20;
    const maskToken = (m) => m === "orpheus" ? TOKEN_IDS.makotoMask2 : TOKEN_IDS.makotoMask;
    const maskForm = (m) => sid === "skchr_makoto_1" ? "doll1" : sid === "skchr_makoto_3" ? m === "orpheus" ? "doll3p2" : "doll3p1" : "doll2";
    const maskNets = () => {
      const cands = [d.skill?.rangeGrid, ...(d.skills ?? []).map((s) => s?.rangeGrid), d.talents?.[0]?.rangeGrid, d.talents?.[1]?.rangeGrid].filter((g) => Array.isArray(g) && g.length);
      return cands.reduce((a, b) => b.length > (a?.length ?? 0) ? b : a, null) ?? copyGrid(d.talents?.[0]?.rangeGrid) ?? NINE;
    };
    const maskTargets = (battle, unit, n) => enemiesOn(battle, unit, [...new Set(gridKeys(maskNets(), unit))], Math.max(1, n), unit.profile);
    const auraTargets = (battle, unit) => [...new Set(gridKeys(maskNets(), unit))];
    const showMask = (battle, unit) => {
      const f = maskForm(unit.mem.makotoMask);
      if (unit.mem.makotoForm === f) return;
      unit.mem.makotoForm = f;
      unit.form = f;
      const dur = num6(unit.findBuff("trait:substitute")?.timeLeft, dollDuration);
      battle.fx("phase", { x: unit.x, y: unit.y, id: unit.id, kind: f, form: f, dur });
      fx(battle, "summon", unit, { token: maskToken(unit.mem.makotoMask), skill: "makoto" });
    };
    const hideMask = (battle, unit) => {
      if (unit.mem.makotoForm == null) return;
      unit.mem.makotoForm = null;
      unit.form = null;
      battle.fx("phase", { x: unit.x, y: unit.y, id: unit.id, kind: "base", form: null, dur: MASK_SWITCH });
    };
    const applyMask = (battle, unit) => {
      if (unit.trait.doll && unit.alive) {
        unit.mem.makotoSaw = true;
        showMask(battle, unit);
        if (!unit.findBuff("makoto:mask")) {
          const mods = {};
          if (stats.atk) mods.atkPct = stats.atk;
          if (stats.bat) mods.batPct = stats.bat / baseBat;
          if (stats.hp > 0 && stats.hp < 5) {
            const sub = unit.findBuff("trait:substitute");
            const share = num6(sub?.mods?.hpMul, 1) || 1;
            if (share > 0) mods.hpMul = (1 + stats.hp) / share;
          }
          battle.addBuff(unit, { key: "makoto:mask", mods });
        }
      } else {
        if (unit.findBuff("makoto:mask")) battle.removeBuff(unit, "makoto:mask");
        hideMask(battle, unit);
      }
    };
    const allOutAttack = (battle, unit) => {
      if (!(sees > 0) || !unit.alive) return;
      const list = battle.enemiesInRadius(unit.x, unit.y, 1.5);
      if (!list.length) return;
      fx(battle, "aoe", unit, { radius: 1.5, skill: "makotoSees" });
      for (const e of list) {
        battle.dealDamage(unit, e, { amount: unit.s.atk * sees, type: "true", isSkill: true, tags: ["talent", "makotoSees"] });
      }
    };
    const use = (battle, unit, m, initial = true) => {
      if (initial && sid === "skchr_makoto_3" && unit.mem.makotoMask === "thanatos" && unit.trait.doll) m = "orpheus";
      battle.emit("dollSwitch", { unit, reason: "skill", done: false });
      if (unit.rangeGrid !== maskNets()) {
        unit.rangeGrid = maskNets();
        battle.refreshRange(unit);
      }
      unit.mem.makotoMask = m;
      if (m === "orpheus") unit.mem.makotoRelay = 2;
      else if (unit.mem.makotoRelay !== 2) unit.mem.makotoRelay = 1;
      const prev = unit.findBuff("makoto:dollBlock");
      if (prev) battle.removeBuff(unit, prev);
      if (m === "orpheus" && sid === "skchr_makoto_3") {
        battle.addBuff(unit, { key: "makoto:dollBlock", mods: { blockCnt: num6(bb["attack@block_cnt"], 2) } });
      }
      applyMask(battle, unit);
    };
    const restartBar = (battle, unit, reason = "relay") => {
      const sk = unit.skill;
      if (!sk || sk.noSkill || sk.kind !== "duration") return false;
      if (sk.active) {
        sk.timeLeft = sk.duration;
        return true;
      }
      sk.sp = 0;
      return sk.activate(reason, { free: true });
    };
    const relayToOrpheus = (battle, unit) => {
      unit.mem.makotoRelay = 2;
      use(battle, unit, "orpheus", false);
      if (unit.rangeGrid !== maskNets()) {
        unit.rangeGrid = maskNets();
        battle.refreshRange(unit);
      }
      showMask(battle, unit);
      restartBar(battle, unit);
    };
    const hurtAllyInRange = (battle, unit, lim) => {
      const keys = new Set(gridKeys(maskNets(), unit));
      return battle.injuredAlliesInKeys(keys, unit).find((a) => a.hpRatio < lim) ?? null;
    };
    const orpheusRegen = (battle, unit, heal, healN) => {
      if (!(heal > 0)) return;
      const hurt = battle.injuredAlliesInKeys(new Set(gridKeys(maskNets(), unit)), unit).slice(0, healN);
      for (const a of hurt) battle.heal(unit, a, unit.s.atk * heal, a === unit ? { ignoreHealFree: true } : void 0);
    };
    const openAttack = (m) => m === "orpheus";
    const thanatosAttack = (s, o) => {
      const scv = num6(s.bb["attack@atk_scale"], 2);
      const fear = num6(o.fear, 0), p = num6(o.prob, 0), killAt = num6(o.killAt, 0), kill = num6(o.kill, 0);
      const spec = {
        atkScale: scv,
        dmgType: "arts",
        // the target cap rides on the ATTACK override (ai.js merges every `attack` key onto the profile; `maxTargets` is
        // the key `acquireTargets` counts with — `targeting.maxTargets` only exists for a spec that also carries a
        // `targeting` block, and S2/S1 must keep `targeting` undefined, see the range regression's assert D).
        maxTargets: o.maxTargets ?? void 0,
        tags: ["skill", "makoto"],
        onEachHit({ battle, unit, target }) {
          if (!target || !target.alive) return;
          if (!fear || !(p > 0)) return;
          const wasFeared = !!target.findBuff("fear");
          let feared = false;
          if (battle.rng.chance(p)) {
            battle.applyStatus(target, "fear", { duration: fear, source: unit });
            feared = true;
          }
          if (!target.alive || !(wasFeared || feared)) return;
          if (kill > 0 && target.hp < unit.s.atk * killAt) {
            battle.dealDamage(unit, target, { amount: kill, type: "true", isSkill: true, tags: ["skill", "makotoExecute"] });
          }
        }
      };
      return new Proxy(spec, {
        // `noAttack` is TRUE from the start and stays true: this override exists only for the 塔纳托斯 half's skills (S2 /
        // S3), and 俄耳甫斯 — their relay's P2 half — never uses it. The live mask decision belongs to `trait.canAttack`
        // (a resolved-profile value), because a Proxy getter cannot see the unit.
        get: (t, k) => k === "noAttack" ? true : t[k]
      });
    };
    const hurtLowAlly = (battle, unit) => hurtAllyInRange(battle, unit, 0.5);
    const healLowAlly = (battle, unit, hs) => {
      const a = hurtLowAlly(battle, unit);
      if (!a || !(hs > 0)) return null;
      battle.heal(unit, a, unit.s.atk * hs, a === unit ? { ignoreHealFree: true } : void 0);
      return a;
    };
    const s1 = (s) => ({
      // S1's bar is the same <替身> timer; S1 enters 俄耳甫斯 directly, so nothing relays after it and its own expiry is
      // what returns him to the 本体 (mem.makotoRelay stays 2, relayMask null).
      kind: "duration",
      duration: dollDuration,
      attack: {
        atkScale: num6(s.bb["attack@atk_scale"], 2.1),
        dmgType: "arts",
        // single target ("攻击对敌人" — no 至多N名): `targeting` stays undefined (the range regression's assert D).
        maxTargets: 1,
        tags: ["skill", "makoto"]
      },
      onStart({ battle, unit, reason }) {
        if (reason === "relay") return;
        use(battle, unit, "orpheus");
      }
    });
    const s2 = (s) => ({
      // the bar IS the <替身> timer (block header): `duration` from the 特性, not the 瞬发 record the data ships
      kind: "duration",
      duration: dollDuration,
      relayMask: "orpheus",
      // 塔纳托斯 → 俄耳甫斯 (the user's chain)
      attack: thanatosAttack(s, {
        maxTargets: Math.max(1, Math.floor(num6(s.bb["attack@max_target"], 4))),
        fear: num6(s.bb["attack@fear"], 1.5),
        prob: num6(s.bb["attack@prob"], 0.35),
        killAt: num6(s.bb["attack@kill_atk_scale"], 2.5),
        kill: num6(s.bb["attack@kill_damage"], 1e7)
      }),
      onStart({ battle, unit, reason }) {
        if (reason === "relay") return;
        use(battle, unit, "thanatos");
      }
    });
    const s3 = (s) => {
      const heal = num6(s.bb["attack@heal_scale"], 0.3), healN = Math.max(1, Math.floor(num6(s.bb["attack@max_target_heal"], 4)));
      const dodge = num6(s.bb["attack@prob"], 0.35);
      return {
        // NOT ammo (block header): the data has no `attack@trigger_time` for 结城理 — the old `?? 31` fallback was an
        // invented bar — and the passive runs "直到<替身>状态结束", the state's own 20 s. Same bar as S2's.
        kind: "duration",
        duration: dollDuration,
        relayMask: "orpheus",
        // 塔纳托斯 → 俄耳甫斯 (the user's chain)
        mods: { aspd: num6(s.bb["talent@attack_speed"], 45) },
        // the mask's own x-1 net while the bar runs (the engine's live range; S1/S2 gate the same net on `trait.doll`
        // through their addTriggerRange instead) — the range regression's assert A/C reads this grid, and assert D reads
        // its `maxTargets` (the same attack@max_target the attack override carries: ai.js writes the key from both places
        // onto the resolved profile, so the cap is the data's either way).
        targeting: { rangeGrid: maskNets(), maxTargets: Math.max(1, Math.floor(num6(s.bb["attack@max_target"], 4))), allInRange: false },
        // 塔纳托斯's ordinary attack: attack@atk_scale × ATK as 弱点伤害 (the retype above), up to attack@max_target enemies
        attack: thanatosAttack(s, {
          weakness: true,
          maxTargets: Math.max(1, Math.floor(num6(s.bb["attack@max_target"], 4)))
        }),
        onStart({ battle, unit, reason }) {
          if (reason !== "relay") use(battle, unit, "thanatos");
          const near = new Set(gridKeys(maskNets(), unit));
          for (const a of battle.alliesFor(unit, unit.ownerId)) {
            if (!unit.alive || a.kind !== "op" || !onTiles(a, near)) continue;
            a.mem.makotoDodge = Math.max(num6(a.mem.makotoDodge, 0), dodge);
          }
        },
        onTick({ battle, unit, skill, dt }) {
          if (unit.mem.makotoMask !== "orpheus" || !skill.active) return;
          unit.mem.makotoHeal = (unit.mem.makotoHeal ?? 0) + (dt || 0);
          if (unit.mem.makotoHeal < 1) return;
          unit.mem.makotoHeal = 0;
          orpheusRegen(battle, unit, heal, healN);
        }
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
          return !(m === "orpheus" && sid === "skchr_makoto_3");
        }
      },
      skill: s2(skillData(chess, d, bb, "skchr_makoto_2")),
      skills: altSkills(chess, d, bb, {
        skchr_makoto_1: s1,
        skchr_makoto_3: s3
      }),
      talents: [
        { install(battle, unit) {
          battle.on("fatal", (ctx) => {
            if (ctx.unit === unit && unit.mem.makotoMask == null) unit.mem.makotoMask = "thanatos";
          }, { owner: unit, priority: -200 });
          battle.on("fatal", (ctx) => {
            if (ctx.unit !== unit || ctx.prevented) return;
            if (!unit.trait.doll || unit.mem.makotoMask !== "thanatos") return;
            ctx.prevented = true;
            relayToOrpheus(battle, unit);
            unit.hp = unit.s.maxHp;
            unit.markDirty();
          }, { owner: unit, priority: -100 });
          if (stats.sluggish > 0) {
            battle.on("fatal", (ctx) => {
              if (ctx.unit !== unit || !ctx.prevented) return;
              const keys = new Set(auraTargets(battle, unit));
              for (const e of battle.enemies) {
                if (!e.alive || e.hidden) continue;
                if (!keys.has(`${e.tileR},${e.tileC}`) && !bodyInKeys(e, keys)) continue;
                battle.applyStatus(e, "sluggish", { duration: stats.sluggish, source: unit });
              }
              fx(battle, "aoe", unit, { radius: 1.5, skill: "makotoSluggish" });
            }, { owner: unit, priority: -210 });
          }
        } }
      ],
      install(battle, unit) {
        if (sid === "skchr_makoto_3") battle.on("hit", (ctx) => {
          if (ctx.source === unit && ctx.dmg?.isAttack && unit.trait.doll && unit.mem.makotoMask === "thanatos") {
            weaknessRetype(ctx.dmg, unit, ctx.target);
          }
        }, { owner: unit, priority: 5 });
        if (unit.skill && sid !== "skchr_makoto_3") unit.skill.addTriggerRange((battle2, u) => u.trait.doll ? [gridKeys(maskNets(), u)] : []);
        if (sid === "skchr_makoto_1") {
          const hs = num6(skillData(chess, d, bb, "skchr_makoto_1").bb["attack@heal_scale"], 0.5);
          battle.on("beforeAttack", (ctx) => {
            if (ctx.attacker !== unit || !unit.skill?.active || !unit.alive) return;
            if (unit.mem.makotoMask !== "orpheus") return;
            if (!hurtLowAlly(battle, unit)) return;
            healLowAlly(battle, unit, hs);
            ctx.targets = [];
            ctx.cancel = true;
          }, { owner: unit, priority: -100 });
        }
        battle.on("tick", () => {
          if (unit.alive && unit.trait.doll && unit.mem.makotoFatalRelay) {
            unit.mem.makotoFatalRelay = false;
            unit.mem.makotoMask = "orpheus";
            unit.mem.makotoRelay = 2;
            applyMask(battle, unit);
          }
          if (!unit.trait.doll && unit.alive && unit.mem.makotoRelay === 1 && (unit.skill?.spec?.relayMask ?? null)) {
            relayToOrpheus(battle, unit);
            return;
          }
          if (unit.trait.doll && unit.alive) unit.mem.makotoSaw = true;
          else if (unit.mem.makotoSaw) {
            unit.mem.makotoSaw = false;
            allOutAttack(battle, unit);
          }
          applyMask(battle, unit);
          if (unit.trait.doll && unit.alive && unit.skill && !unit.skill.active && !unit.findBuff("trait:dollSwitching")) {
            restartBar(battle, unit, "relay");
          }
          if (!unit.trait.doll && bodyGrid && unit.rangeGrid !== bodyGrid) {
            unit.rangeGrid = bodyGrid;
            battle.refreshRange(unit);
          }
          if (!unit.trait.doll && unit.mem.makotoMask != null) {
            unit.mem.makotoMask = null;
            unit.mem.makotoRelay = 0;
          }
        }, { owner: unit });
        battle.on("death", (ctx) => {
          if (ctx.unit !== unit || !unit.mem.makotoSaw) return;
          unit.mem.makotoSaw = false;
          allOutAttack(battle, unit);
        }, { owner: unit });
        if (sid === "skchr_makoto_3") {
          battle.on("fatal", (ctx) => {
            if (ctx.unit !== unit || ctx.prevented || !unit.alive) return;
            if (!unit.trait.doll || unit.mem.makotoMask !== "thanatos") return;
            ctx.prevented = true;
            unit.mem.makotoFatalRelay = true;
          }, { owner: unit, priority: -150 });
        }
        battle.on("hit", (ctx) => {
          const t = ctx.target;
          if (!t || t.side !== "ally" || !(num6(t.mem.makotoDodge, 0) > 0) || !unit.skill?.active) return;
          if (unit.mem.makotoMask !== "orpheus") return;
          if (ctx.dmg && (ctx.dmg.type === "phys" || ctx.dmg.type === "arts") && battle.rng.chance(num6(t.mem.makotoDodge))) {
            ctx.dmg.cancel = true;
            fx(battle, "dodge", t);
          }
        }, { owner: unit });
        battle.on("skillEnd", (ctx) => {
          if (ctx.unit !== unit) return;
          for (const a of battle.alliesFor(unit, unit.ownerId)) a.mem.makotoDodge = 0;
        }, { owner: unit });
      }
    };
    return kit;
  }
};

// mods/marisa-native/source/server/sim/content/kits/ops/op-amiya3.js
var op_amiya3_default = {
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
  //   (data/garrisons.json `garrison_x_marisa_amiya3_allowance_a`, owners = both her chessIds), because the prep-end dispatcher
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
  char_x_marisa_amiya3: (bb, chess, def) => {
    const d = defOf(chess, def);
    const t0 = talentBb2(d, 0);
    const sel = selectedId(chess, d);
    const S13 = "skchr_amiya3_1", S23 = "skchr_amiya3_2";
    const isS2 = sel === S23;
    const maxHp = num6(t0.max_hp);
    const regen = num6(t0.hp_recovery_per_sec_by_max_hp_ratio);
    const SURROUND12 = Object.freeze([
      [1, -1],
      [1, 0],
      [1, 1],
      [2, 0],
      [0, -2],
      [0, -1],
      [0, 1],
      [0, 2],
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [-2, 0]
    ]);
    const extraHeal = (battle, unit, scale) => (ctx) => {
      if (ctx.source !== unit || !alive(unit) || !unit.skill?.active || !ctx.dmg?.isAttack || !(ctx.amount > 0)) return;
      if (!ctx.target || ctx.target.side !== "enemy") return;
      if (ctx.type === "element" || ctx.type === "elemental") return;
      if (ctx.dmg && Array.isArray(ctx.dmg.tags) && ctx.dmg.tags.includes("incantation")) return;
      if (!(scale > 0)) return;
      const keys = new Set(gridKeys(SURROUND12, unit));
      for (const a of battle.allyUnits) {
        if (!a.alive || !a.deployed || a.hidden || a.kind === "device") continue;
        if (!keys.has(a.tileR * COLS + a.tileC)) continue;
        if (a !== unit && (a.s.flags.noHeal || a.profile?.noHeal)) continue;
        battle.heal(unit, a, unit.s.atk * scale, { tags: ["incantation", "amiya3_s1"] });
      }
    };
    const addStacks = (battle, unit, n, atkPer, cap) => {
      if (!(n > 0) || !(atkPer > 0)) return;
      const want = Math.min(cap, Math.max(0, unit.mem.amiya3S2Stacks ?? 0) + n);
      if (want <= (unit.mem.amiya3S2Stacks ?? 0)) return;
      unit.mem.amiya3S2Stacks = want;
      battle.addBuff(unit, { key: "talent:amiya3_s2_atk", refresh: "stack", stacks: want, maxStacks: cap, mods: { atkPct: atkPer }, visible: true });
    };
    const burst2 = (battle, unit, s) => {
      const keys = new Set(unit.rangeKeys || []);
      const atkScale = num6(s.bb.atk_scale, 1);
      const dur = num6(s.bb["amiya3_s_2[debuff].duration"]);
      const aspdDown = num6(s.bb["amiya3_s_2[debuff].attack_speed"]);
      const moveMul = Math.max(0, 1 + num6(s.bb["amiya3_s_2[debuff].move_speed"], 0));
      const atkPer = num6(s.bb.atk, 0);
      const cap = Math.max(1, Math.floor(num6(s.bb.max_stack_cnt, 5)));
      const list = battle.enemiesInKeys([...keys], unit, { canHitFly: true });
      addStacks(battle, unit, list.length, atkPer, cap);
      let hits = 0;
      for (const e of list) {
        if (!e.alive) continue;
        battle.dealDamage(unit, e, { amount: unit.s.atk * atkScale, type: "arts", isAttack: true, isSkill: true, tags: ["skill", "amiya3Burst"] });
        hits++;
        if (e.alive && dur > 0) {
          battle.addBuff(e, { key: "amiya3:mercy", duration: dur, refresh: "replace", source: unit, visible: true, status: "amiya3Mercy", mods: { aspd: aspdDown, moveMul } });
        }
      }
      fx(battle, "volley", unit, { skill: "amiya3_2", n: hits, dmgType: "arts" });
      return hits;
    };
    const s1 = (s) => ({
      kind: "duration",
      mods: { aspd: num6(s.bb.attack_speed) }
    });
    const s2 = (s) => ({
      kind: "duration",
      attack: { dmgType: "true", maxTargets: 2 },
      onStart({ battle, unit }) {
        burst2(battle, unit, s);
      },
      onEnd({ battle, unit }) {
        battle.removeBuff(unit, "talent:amiya3_s2_atk");
      }
    });
    const selS1 = skillData(chess, d, bb, S13);
    const build = { [S13]: (s) => s1(s), [S23]: (s) => s2(s) };
    const selNow = selectedId(chess, d) ?? S13;
    return {
      skill: build[selNow] ? build[selNow](skillData(chess, d, bb, selNow)) : null,
      skills: altSkills(chess, d, bb, build),
      talents: [
        { install(battle, unit) {
          if (!(maxHp > 0) && !(regen > 0)) return;
          battle.every(0.2, () => {
            if (!alive(unit)) return;
            const mods = {};
            if (maxHp > 0) mods.hpPct = maxHp;
            if (regen > 0 && unit.skill?.active) mods.hpRegenRatio = regen;
            if (!Object.keys(mods).length) return;
            for (const a of battle.allyUnits) {
              if (!a.alive || !a.deployed || a.hidden || a.kind === "device") continue;
              if (!battle.allySelectable(a, unit)) continue;
              battle.addBuff(a, { key: "talent:amiya3_hope", duration: 0.5, refresh: "replace", mods, source: unit, tags: ["aura"] });
            }
          }, { owner: unit });
        } }
      ],
      install(battle, unit) {
        if (sel === S13) battle.on("damaged", extraHeal(battle, unit, num6(selS1.bb.heal_scale, 0)), { owner: unit, priority: 10 });
        if (!isS2 || !unit.skill) return;
        const rawActivate = unit.skill.activate.bind(unit.skill);
        unit.skill.activate = (reason = "manual", opts) => {
          if (unit.mem.amiya3S2Used) return false;
          const ok = rawActivate(reason, opts);
          if (ok) unit.mem.amiya3S2Used = true;
          return ok;
        };
      }
    };
  }
};

// mods/marisa-native/source/server/sim/content/kits/shared/tier1.js
var num7 = (v, d = 0) => typeof v === "number" && Number.isFinite(v) ? v : typeof v === "string" && v.trim() !== "" && Number.isFinite(+v) ? +v : d;
function talentAt(chess, i) {
  const list = (chess?.talents ?? []).filter((t) => t && t.index !== -1);
  return list[i] ?? null;
}
var talentBb3 = (chess, i = 0) => talentAt(chess, i)?.bb ?? {};
var up = (u) => !!u && u.alive && u.deployed;
var PROTECT_TICK_HOLD = 1.5 * TICK;
function toggleBuff(battle, unit, key, cond, mods, extra = {}) {
  const check = () => {
    const want = up(unit) && !!cond();
    const has = unit.findBuff(key);
    if (want && !has) battle.addBuff(unit, { key, mods: typeof mods === "function" ? mods() : mods, tags: ["talent"], ...extra });
    else if (!want && has) battle.removeBuff(unit, key);
  };
  battle.on("tick", check, { owner: unit });
  battle.on("battleStart", check, { owner: unit });
  battle.on("deploy", (ctx) => {
    if (ctx.unit === unit && battle.started) check();
  }, { owner: unit });
}
function installAura(battle, unit, { key, select, mods, value = 0, interval = 0.5 }) {
  battle.every(interval, () => {
    if (!up(unit)) return;
    for (const a of battle.alliesFor(unit)) {
      if (!select(a)) continue;
      const cur = a.findBuff(key);
      if (cur && cur.source !== unit && (cur.data?.v ?? 0) > value && cur.timeLeft > 0.05) continue;
      battle.addBuff(a, { key, duration: interval + 0.1, mods: typeof mods === "function" ? mods(a) : mods, source: unit, data: { v: value }, tags: ["aura"] });
    }
  }, { owner: unit, immediate: true });
}
function skillRec(chess, skillId) {
  if (chess?.skill && (chess.skill.skillId ?? chess.skill.id) === skillId) return chess.skill;
  return (chess?.skills ?? []).find((s) => s && s.skillId === skillId) ?? null;
}
function batMod(v, chess = null, desc = "") {
  const x = num7(v, 0);
  if (!x) return 0;
  if (x > 0 && x < 1 && /间隔[^，。；]*缩短/.test(desc)) return x - 1;
  const bat = num7(chess?.stats?.bat, 1) || 1;
  return Math.max(-0.9, x / bat);
}

// mods/marisa-native/source/server/sim/buffs.js
function resistPalsyDecay({ battle, unit }) {
  const p = unit.findBuff("palsy");
  if (!p) return;
  if (--p.stacks <= 0) battle.removeBuff(unit, p);
  else unit.markDirty();
}
var ADD_KEYS = Object.freeze([
  "atkFlat",
  "atkPct",
  "atkFinal",
  "defFlat",
  "defPct",
  "hpFlat",
  "hpPct",
  "resFlat",
  "aspd",
  "batPct",
  "blockCnt",
  "rangeExtend",
  "defIgnoreFlat",
  "defIgnorePct",
  "resIgnoreFlat",
  "resIgnorePct",
  "dodgePhys",
  "dodgeArts",
  "spRecoveryFlat",
  "maxTargets",
  "taunt",
  "hpRegen",
  "hpRegenRatio",
  "spCostFlat",
  "moveFlat",
  "massFlat",
  // 阻挡半径倍率 (PRTS 数值范围 BLOCK_RADIUS_SCALE, default 1): the air-block radius 0.8944 × (1 + Σ) — Battle._checkBlock
  "blockRadiusScale"
]);
var MUL_KEYS = Object.freeze([
  "atkMul",
  "defMul",
  "hpMul",
  "resMul",
  "moveMul",
  "dmgDealtMul",
  "dmgTakenMul",
  "physTakenMul",
  "artsTakenMul",
  "trueTakenMul",
  "elemTakenMul",
  "elementalTakenMul",
  "healingDealtMul",
  "healingTakenMul",
  "spRecoveryMul",
  "redeployMul",
  "atkScaleMul",
  "physDealtMul",
  "artsDealtMul"
]);
var FLAG_KEYS = Object.freeze([
  "stun",
  "freeze",
  "sleep",
  "silence",
  "disarm",
  "stealth",
  "invulnerable",
  "unblockable",
  "levitate",
  "fear",
  "cold",
  "reveal",
  "bind",
  "noHeal",
  "untargetable",
  "blockFly",
  "noMove",
  "noSp",
  "burstLock",
  "hidden",
  "noBlock",
  "tremble",
  "hitCount",
  "hitCountArts",
  "attract",
  "float",
  "noDisplace",
  "isolated",
  "camou",
  "liftoff",
  // 自缚 (the unit's own immobility: 守墓石像's 转换模式, the 自缚 leaders) beside its `noMove` — 束缚 sets noMove too, and
  // only 自缚 makes a unit "不视为可达目标" for 余 S2's teleport (PRTS 余 S2 备注)
  "selfBound",
  "healFree",
  "stealthOff",
  // 缚地 (status `groundbind`): an enemy air unit counts as a ground unit meanwhile (Unit.isFlying)
  "groundbind"
]);
var STATUS = Object.freeze({
  // 晕眩: 无法移动、阻挡、攻击及使用技能 (a stunned operator releases the enemies it blocks)
  stun: { flags: { stun: true, noBlock: true }, immune: "stun" },
  // 冻结: 无法移动、攻击及使用技能; 敌方被冻结时，法术抗性-15 (the RES cut applies to enemies only)
  freeze: { flags: { freeze: true, stun: true }, mods: { resFlat: -FREEZE_RES_DOWN }, enemyOnlyMods: true, immune: "frozen" },
  // 寒冷: ASPD −30. A second cold while this one remains applies 冻结 for max(remaining, incoming)
  // (Battle.applyStatus; PRTS 术语释义 寒冷 「持续时间取双方之中最高」).
  cold: { flags: { cold: true }, mods: { aspd: COLD_ASPD } },
  // 沉睡: 无敌且无法行动 (untargetable, takes no damage — except from `hitSleep` attackers — and blocks nothing); PRTS 异常效果
  // SLEEPING = 无法行动+无敌+不可阻挡: an enemy asleep is not blocked either — its blocker lets go and the slot frees, it
  // stays put until it wakes (the `sleep` flag: Battle._checkBlock / applyStatus, ai.js updateEnemy; DESIGN §24.9)
  sleep: { flags: { sleep: true, noBlock: true }, immune: "sleep" },
  // value = fraction of speed removed (0.8 ⇒ moveMul 0.2). Default 0.5.
  slow: { mods: (v) => ({ moveMul: 1 - clamp012(v ?? 0.5) }), valued: 0.5 },
  // 停顿 (sluggish): −80 % move speed.
  sluggish: { mods: { moveMul: 0.2 } },
  bind: { flags: { bind: true, noMove: true }, mods: { moveMul: 0 } },
  // value = extra damage taken (0.3 ⇒ ×1.3). Default 0.3.
  fragile: { mods: (v) => ({ dmgTakenMul: 1 + (v ?? 0.3) }), valued: 0.3 },
  artsFragile: { mods: (v) => ({ artsTakenMul: 1 + (v ?? 0.3) }), valued: 0.3 },
  physFragile: { mods: (v) => ({ physTakenMul: 1 + (v ?? 0.3) }), valued: 0.3 },
  // 元素脆弱 (ba.elementfragile "受到的元素伤害提升相应比例（同名效果取最高）"): 元素伤害 (the 'elemental' HP damage) only —
  // never the element gauge (元素损伤 has its own multiplier, `elemTakenMul`; damage.js)
  elemFragile: { mods: (v) => ({ elementalTakenMul: 1 + (v ?? 0.2) }), valued: 0.2 },
  silence: { flags: { silence: true }, immune: "silence" },
  // 恐惧: 无法被阻挡并四散逃跑 (no attacks, unblockable; leaves its route and runs to random tiles of the fan away from the
  // source — fear.js, stamped by Battle.applyStatus)
  fear: { flags: { fear: true, unblockable: true }, immune: "feared" },
  // 战栗: 被阻挡后无法进行普通攻击
  tremble: { flags: { tremble: true }, immune: "feared" },
  disarm: { flags: { disarm: true } },
  // 隐匿 (ba.invisible): 不阻挡时不成为敌方攻击的目标 (an ally: only the enemy it blocks attacks it — targeting.js)
  stealth: { flags: { stealth: true } },
  // 迷彩 (ba.camou): "不阻挡时不成为敌方普通攻击的目标（无法躲避溅射类攻击）" — an ally's camouflage keeps the enemies off
  // it like 隐匿 (only the enemy it blocks attacks it: targeting.js canTargetAlly; shown the same way, snapshot.js), but
  // it is not 隐匿 (叙拉古 / 家族徽章 read `stealth` only) and has its own buff keys
  camou: { flags: { camou: true } },
  reveal: { flags: { reveal: true } },
  invulnerable: { flags: { invulnerable: true } },
  // 浮空: 变为空中单位 (Unit.isFlying)，无法移动、攻击及使用技能; 对重量大于3的单位持续时间减半; the state holds 不可阻挡 +
  // 失衡免疫 (noDisplace: "不会被位移影响", PRTS 异常效果)
  levitate: { flags: { levitate: true, stun: true, unblockable: true, noDisplace: true }, immune: "levitate" },
  // 缚地 (gamedata_const ba.groundbind "目标变为地面单位，无法移动；使部分近地悬浮敌人掉落；对重量大于3的单位持续时间减半"):
  // an air unit (data flyer, 近地悬浮) counts as a ground unit (Unit.isFlying: melee operators hit it, ground blockers
  // block it) and cannot move; half duration on units with massLevel > 3 (Battle.applyStatus, as 浮空); a 浮空 still
  // lands on it (PRTS 异常效果 "若单位数据上为飞行单位且不持有缚地异常…则Buff取消"). 予愿安洁莉娜 S2 (kits/ops/op-aglna2.js)
  groundbind: { flags: { groundbind: true, noMove: true }, mods: { moveMul: 0 } },
  // 麻痹: value = stacks (default 1, max 3); each stack cancels one enemy normal attack; lasts until consumed; honours
  // 麻痹免疫 (enemy_database palsyImmune, e.g. 假想敌：铳 — PRTS 元素: a 神经 burst gives 麻痹 only "若单位不具有麻痹免疫")
  palsy: { palsy: true, immune: "palsy" },
  // value = taunt level delta (default +1)
  taunt: { mods: (v) => ({ taunt: v ?? 1 }) },
  // value = ATK fraction removed (default 0.3)
  weaken: { mods: (v) => ({ atkMul: 1 - clamp012(v ?? 0.3) }), valued: 0.3 },
  // value = aspd delta (negative slows attacks), default −30
  aspdDown: { mods: (v) => ({ aspd: v ?? -30 }), valued: -30 },
  // value = DEF fraction removed (default 0.3)
  defDown: { mods: (v) => ({ defMul: 1 - clamp012(v ?? 0.3) }), valued: 0.3 },
  // value = RES flat removed (default 20)
  resDown: { mods: (v) => ({ resFlat: -(v ?? 20) }), valued: 20 },
  unblockable: { flags: { unblockable: true } },
  // 诱导 (ba.attract): 无法被阻挡并向目标位置移动 — the engine walks the enemy (own speed, grid path; flyers straight)
  // to `opts.point` (default: the source's tile) and keeps it there until the status ends, then it resumes its route
  attract: { flags: { attract: true, unblockable: true }, attract: true },
  // 抵抗 (ba.buffres): the RESIST_STATUSES applied to the unit last (1 − value) as long, value default 0.5 (减半);
  // 同名效果不叠加 — several sources never compound (strongest value wins, a weaker one resumes if it outlasts it);
  // a resisting unit also loses one 麻痹 stack every RESIST_PALSY_DECAY s (Battle.applyStatus)
  resist: { resist: true, mods: () => null, valued: RESIST_DEFAULT, buff: Object.freeze({ interval: RESIST_PALSY_DECAY, onTick: resistPalsyDecay }) },
  // element burst states (engine-managed; listed for immunity/visibility)
  burnBurst: { flags: { burstLock: true } },
  neuralBurst: { flags: { burstLock: true } },
  necrosisBurst: { flags: { burstLock: true } },
  apoptosisBurst: { flags: { burstLock: true } },
  erosionBurst: { flags: { burstLock: true } }
});
var RESIST_STATUSES = Object.freeze(/* @__PURE__ */ new Set([
  "stun",
  "freeze",
  "cold",
  "sleep",
  "fear",
  "tremble",
  "attract",
  "levitate",
  "bind",
  "silence",
  "disarm",
  "sluggish",
  "slow",
  "groundbind"
]));
var VISIBLE_STATUS = new Set(Object.keys(STATUS));
function clamp012(v) {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}
function aggregateMods(buffs) {
  const add = /* @__PURE__ */ Object.create(null);
  const mul = /* @__PURE__ */ Object.create(null);
  const flags = /* @__PURE__ */ Object.create(null);
  let shield = 0;
  let permRangeExtend = 0;
  const dodge = { dodgePhys: null, dodgeArts: null };
  for (let i = 0; i < buffs.length; i++) {
    const b = buffs[i];
    const st = b.stacks;
    const m = b.mods;
    if (m) {
      for (const k in m) {
        const v = m[k];
        if (typeof v !== "number" || !Number.isFinite(v)) continue;
        if (k === "shield") continue;
        if (k.endsWith("Mul")) mul[k] = (mul[k] ?? 1) * (st === 1 ? v : powi(v, st));
        else if ((k === "dodgePhys" || k === "dodgeArts") && v > 0) {
          const p = Math.min(1, v);
          const d = dodge[k];
          if (!d) dodge[k] = { n: st, p, miss: powi(1 - p, st) };
          else {
            d.n += st;
            d.miss *= powi(1 - p, st);
          }
        } else {
          add[k] = (add[k] ?? 0) + v * st;
          if (k === "rangeExtend" && b.persist && b.duration === Infinity) permRangeExtend += v * st;
        }
      }
    }
    if (b.flags) {
      for (const k in b.flags) if (b.flags[k]) flags[k] = true;
    }
    if (b.shield > 0) shield += b.shield;
  }
  for (const k of ["dodgePhys", "dodgeArts"]) {
    const d = dodge[k];
    if (d) add[k] = (add[k] ?? 0) + (d.n === 1 ? d.p : 1 - d.miss);
  }
  return { add, mul, flags, shield, permRangeExtend };
}

// mods/marisa-native/source/server/sim/content/kits/ops/mod-aglna2.js
var S1 = "skchr_aglna2_1";
var S2 = "skchr_aglna2_2";
var S3 = "skchr_aglna2_3";
var MARKER = "token_x_marisa_10071_aglna2_agairp";
var LIFTOFF = Object.freeze({ liftoff: true, blockFly: true });
var X4 = Object.freeze([[1, -1], [1, 0], [1, 1], [0, -1], [0, 0], [0, 1], [-1, -1], [-1, 0], [-1, 1]]);
var ANY = Object.freeze({ canHitFly: true });
var GLIDE_SPEED = 6;
var GLIDE_DIST = 4;
var GLIDE_HALF_WIDTH = 1.5;
var GLIDE_HALF_THICK = 0.65;
var MOVE_SPEED = 2;
var MOVE_CHECK = 0.1;
var DANCE_IV = 0.2;
var CHANT_KEY = "aglna2:chant";
var RANGED_FORM = /* @__PURE__ */ new Set(["SNIPER", "CASTER", "MEDIC", "SUPPORT"]);
var MOVE_KEY = "aglna2:move";
var TAG_EXTRA = "aglna2:extra";
var bbOf = (chess, id) => skillRec(chess, id)?.bb ?? {};
var skillOn = (unit, id) => !!(unit.skill && unit.skill.active && unit.skill.id === id);
var keyOf = (r, c) => `${r},${c}`;
function takeOff(battle, unit) {
  battle.releaseBlocked(unit);
  battle.fx("takeoff", { x: unit.x, y: unit.y, id: unit.id });
}
function land(battle, unit) {
  battle.releaseBlocked(unit);
}
function markerKit() {
  return {
    skill: null,
    trait: { noAttack: true },
    install(battle, t) {
      battle.addBuff(t, { key: "trait:aglna2:marker", flags: { invulnerable: true, untargetable: true, isolated: true, noBlock: true, noHeal: true }, persist: true, allowDead: true });
    }
  };
}
function glide(battle, unit, lev, gb) {
  const [fr, fc] = unit.fwd;
  const x0 = unit.x, y0 = unit.y, t0 = battle.time;
  const hit = /* @__PURE__ */ new Set();
  const sweep = () => {
    const lead = Math.min(GLIDE_DIST, (battle.time - t0) * GLIDE_SPEED);
    for (const e of battle.enemies) {
      if (hit.has(e) || !canTargetEnemy(unit, e, ANY)) continue;
      const dx = e.x - x0, dy = e.y - y0;
      const along = dx * fc + dy * fr, side = Math.abs(dx * fr - dy * fc);
      if (side > GLIDE_HALF_WIDTH + 1e-9 || along < -GLIDE_HALF_THICK - 1e-9 || along > lead + GLIDE_HALF_THICK + 1e-9) continue;
      hit.add(e);
      if (e.isFlying) battle.applyStatus(e, "groundbind", { duration: gb, source: unit });
      else battle.applyStatus(e, "levitate", { duration: lev, source: unit });
    }
    return lead >= GLIDE_DIST;
  };
  battle.fx("dash", { x: x0, y: y0, id: unit.id, tx: x0 + fc * GLIDE_DIST, ty: y0 + fr * GLIDE_DIST, t: GLIDE_DIST / GLIDE_SPEED });
  if (sweep()) return;
  battle.every(TICK, (b, sched) => {
    if (sweep()) sched.cancel();
  });
}
var mod_aglna2_default = {
  char_1015_aglna2: (bb, chess) => {
    const t0 = talentBb3(chess, 0);
    const t1 = talentBb3(chess, 1);
    const b1 = bbOf(chess, S1), b2 = bbOf(chess, S2), b3 = bbOf(chess, S3);
    const r1 = skillRec(chess, S1), r2 = skillRec(chess, S2), r3 = skillRec(chess, S3);
    const g39 = (r3?.rangeGrid ?? []).map((p) => [p[0], p[1]]);
    const seen = new Set(g39.map(([r, c]) => keyOf(r, c)));
    const g39x4 = [...g39, ...X4.filter(([r, c]) => !seen.has(keyOf(r, c))).map((p) => [p[0], p[1]])];
    const maxT3 = Math.max(1, Math.floor(num7(b3["attack@max_target"], 4)));
    const maxWalk3 = Math.max(0, Math.floor(num7(b3["attack@max_walk_target"], maxT3)));
    const maxFly3 = Math.max(0, maxT3 - Math.min(maxWalk3, maxT3));
    const s3Targeting = { rangeGrid: g39x4, maxTargets: maxT3 };
    let st = null;
    const keys39 = (unit) => absoluteRangeKeys(g39, st.r0, st.c0, st.dir0, unit.s.baseRangeExtend || 0);
    const atHome = (unit) => !!st && unit.tileR === st.r0 && unit.tileC === st.c0;
    const blockable = (unit, e) => !e.blockedBy && !e.s.flags.unblockable && !e.s.flags.levitate && !e.s.flags.fear && !e.s.flags.attract && (e.blockWeight ?? 1) <= unit.s.blockCnt;
    const standable = (battle, r, c) => battle.grid.inRect(r, c) && battle.grid.canStand(r, c, { ranged: RANGED_FORM.has(chess?.profession) || chess?.position === "RANGED" });
    function tileOk(battle, unit, r, c) {
      if (!battle.grid.inRect(r, c) || r === unit.tileR && c === unit.tileC) return false;
      const tile = battle.grid.tile(r, c);
      if (tile.pass === "NONE" || tile.special) return false;
      if (!standable(battle, r, c)) return false;
      if (battle.downOn(r, c)) return false;
      const occ = battle.unitAt(r, c);
      return !occ || !occ.alive || !!st && occ === st.marker;
    }
    function moveTarget(battle, unit) {
      const cands = battle.enemiesInKeys(keys39(unit), unit, ANY).filter((e) => e.isFlying && blockable(unit, e));
      sortEnemyTargets(battle, unit, cands, null);
      for (const e of cands) {
        const r = Math.round(e.y), c = Math.round(e.x);
        if (tileOk(battle, unit, r, c)) return { e, r, c };
      }
      return null;
    }
    function placeMarker(battle, unit) {
      if (!st || st.marker && st.marker.alive) return;
      st.marker = battle.spawnToken(unit, MARKER, st.r0, st.c0, { kit: markerKit() });
    }
    function dropMarker(battle) {
      const m = st && st.marker;
      if (m && m.alive) battle.retreat(m, { reason: "expired", permanent: true });
      if (st) st.marker = null;
    }
    function anchorRange(battle, unit) {
      s3Targeting.rangeGrid = g39x4;
      battle.setExtraRange(unit, null);
    }
    function moveTo(battle, unit, r, c) {
      const home = r === st.r0 && c === st.c0;
      if (home) dropMarker(battle);
      const from = { x: unit.x, y: unit.y };
      if (!battle.moveRedeploy(unit, r, c)) return false;
      battle.fx("blink", { x: unit.x, y: unit.y, id: unit.id, fx: from.x, fy: from.y });
      if (!home) placeMarker(battle, unit);
      anchorRange(battle, unit);
      return true;
    }
    return {
      trait: { blockFly: false },
      // the profession's permanent air block: only while airborne here
      skills: {
        [S1]: {
          // MOD（负责人 2026-10-08 裁决，走 W2）：S1 极速送达是**部署被动**——技能文本「部署后立刻起飞，攻击范围扩大，
          // 攻击力+75%，同时攻击两个目标」+ 官方 operator 记录（data/backups.json）的 PASSIVE / ON_DEPLOY。
          // 我们的 data/chess.json 原来写成 `skillType MANUAL` + 数值 `spType 8`（DATA.md §数据约定：skill_table 的
          // 数值 8 = 被动，→ 归一为 ON_DEPLOY；public/js/ui/loadoutModel.js:374 也正是按 `spType === 8` 判被动），
          // 那会让引擎把它当成「spCost 0 的手动技能」：一有敌人就自动施放、56 s 后还能无限续放，与文本的「部署后立刻」
          // 不符。所以**数据已按官方写法改正**（skills[0].skillType → PASSIVE、spType → 'ON_DEPLOY'），本段随之恢复
          // 上游的部署被动写法：`activateOnDeploy` + `trigger NEVER`（部署即起飞、56 s 后落地，不再重复施放）。
          kind: "duration",
          spCost: 0,
          spType: "none",
          activateOnDeploy: true,
          trigger: "NEVER",
          mods: { atkPct: num7(b1.atk) },
          flags: LIFTOFF,
          targeting: { rangeGrid: r1?.rangeGrid ?? null, maxTargets: Math.max(1, Math.floor(num7(b1["attack@max_target"], 1))) },
          onStart({ battle, unit }) {
            takeOff(battle, unit);
          },
          onEnd({ battle, unit }) {
            land(battle, unit);
          }
        },
        [S2]: {
          // MOD: `levitate: true` 是**给引擎读的 spec 字段**，不是 skill flag —— content/garrisons/battle.js 的
          // MOD_TRIGGER_levitate_skill_cast 就是按这个字段判定「这次施放能施加浮空」并付 visiShip / miraShip 的
          // 盟约层（上游原实现只在 onStart 里 glide() 直接施加 status，没有这个字段，于是这次施法不再计入盟约）。
          // 它不会落到她身上：units.js 的 stun 是由 `flags.levitate` 推出来的，字段本身不影响 caster。
          kind: "duration",
          levitate: true,
          mods: { atkPct: num7(b2.atk), batPct: batMod(b2.base_attack_time, chess) },
          flags: LIFTOFF,
          targeting: { rangeGrid: r2?.rangeGrid ?? null, maxTargets: Math.max(1, Math.floor(num7(b2["attack@max_target"], 1))) },
          attack: { dmgType: "arts" },
          onStart({ battle, unit }) {
            takeOff(battle, unit);
            const chant = num7(b2.chant_duration);
            if (chant > 0) battle.addBuff(unit, { key: CHANT_KEY, duration: chant, flags: { disarm: true, invulnerable: true }, tags: ["skill"] });
            glide(battle, unit, num7(b2.buff_duration_levitate), num7(b2.buff_duration_ground_bound));
          },
          onEnd({ battle, unit }) {
            battle.removeBuff(unit, CHANT_KEY);
            land(battle, unit);
          }
        },
        [S3]: {
          kind: "ammo",
          // The skill's initial attack area includes the eight surrounding tiles as well as its 3-9 grid.
          trigger: { rule: "ACTIVE_RANGE", grid: g39x4 },
          ammo: Math.max(1, Math.floor(num7(b3["attack@trigger_time"], 1))),
          mods: { atkPct: num7(b3.atk) },
          flags: LIFTOFF,
          targeting: s3Targeting,
          attack: { atkScale: num7(b3["attack@atk_scale"], 1) },
          onStart({ battle, unit, skill }) {
            takeOff(battle, unit);
            st = { r0: unit.tileR, c0: unit.tileC, dir0: unit.dir, act: skill.activations, flight: null, marker: null };
            s3Targeting.rangeGrid = g39x4;
          },
          onEnd({ battle, unit, reason }) {
            if (st) st.flight = null;
            battle.removeBuff(unit, MOVE_KEY);
            dropMarker(battle);
            if (reason !== "death" && st && !atHome(unit) && unit.alive && unit.deployed && standable(battle, st.r0, st.c0)) {
              const from = { x: unit.x, y: unit.y };
              if (battle.moveRedeploy(unit, st.r0, st.c0)) battle.fx("blink", { x: unit.x, y: unit.y, id: unit.id, fx: from.x, fy: from.y });
            }
            st = null;
            s3Targeting.rangeGrid = g39x4;
            battle.setExtraRange(unit, null);
            land(battle, unit);
          }
        }
      },
      talents: [
        { install(battle, unit) {
          battle.removeBuff(unit, "trait:skywalker");
          const hi = num7(t0.atk_scale_hi), lo = num7(t0.atk_scale_lo), mass = num7(t0.mass_level, 3);
          const extra = (target, dmg) => {
            if (!up(unit) || !target || target.side !== "enemy" || !target.alive || !hasHp(target) || !dmg) return;
            if (dmg.type === "element" || dmg.type === "elemental" || dmg.tags && (dmg.tags.includes(TAG_EXTRA) || dmg.tags.includes("dot"))) return;
            const s = target.weight <= mass ? hi : lo;
            if (s > 0) battle.dealDamage(unit, target, { amount: unit.s.atk * s, type: "arts", tags: ["talent", TAG_EXTRA] });
          };
          battle.on("damaged", (ctx) => {
            if (ctx.source === unit && ctx.type !== "element") extra(ctx.target, ctx.dmg);
          }, { owner: unit });
          battle.on("dodge", (ctx) => {
            if (ctx.source === unit) extra(ctx.target, ctx.dmg);
          }, { owner: unit });
          const myKey = `aglna2:weightless:${unit.id}`;
          battle.on("tick", () => {
            const on = up(unit) && !!unit.s.flags.liftoff;
            const inRange2 = on ? new Set(battle.enemiesInKeys(unit.rangeKeys, unit, ANY)) : null;
            for (const e of battle.enemies) {
              const mine = e.findBuff(myKey);
              const want = on && e.alive && inRange2.has(e) && !e.buffs.some((b) => b.status === "weightless" && b.key !== myKey);
              if (want && !mine) battle.addBuff(e, { key: myKey, status: "weightless", visible: true, mods: { massFlat: -1 }, source: unit });
              else if (!want && mine) battle.removeBuff(e, mine);
            }
          }, { owner: unit });
        } },
        { install(battle, unit) {
          const atk = num7(t1.atk), regen = num7(t1.hp_recovery_per_sec_by_max_hp_ratio);
          if (!(atk > 0) && !(regen > 0)) return;
          installAura(battle, unit, {
            key: "talent:aglna2:dance",
            value: atk,
            interval: DANCE_IV,
            select: (a) => a.kind === "op" && !!a.s.flags.liftoff,
            mods: (a) => regen > 0 && a.blocking.length > 0 ? { atkPct: atk, hpRegenRatio: regen } : { atkPct: atk }
          });
        } }
      ],
      install(battle, unit) {
        const sid = unit.skill?.id;
        battle.on("beforeStatus", (ctx) => {
          if (ctx.target !== unit || !RESIST_STATUSES.has(ctx.status) || ctx.source && ctx.source.side === "ally") return;
          if (unit.findBuff(CHANT_KEY) || unit.findBuff(MOVE_KEY)) ctx.cancel = true;
        }, { owner: unit });
        if (sid !== S3) return;
        const dr = num7(b3.damage_resistance), slow = -num7(b3.move_speed);
        const aspdB = num7(b3["aglna2_s_3[blocked].attack_speed"]), aspdU = num7(b3["aglna2_s_3[unblocked].attack_speed"]);
        if (aspdB) toggleBuff(battle, unit, "skill:aglna2:blocked", () => skillOn(unit, S3) && unit.blocking.length > 0, { aspd: aspdB });
        if (aspdU) toggleBuff(battle, unit, "skill:aglna2:unblocked", () => skillOn(unit, S3) && unit.blocking.length === 0, { aspd: aspdU });
        if (dr > 0) {
          battle.on("hit", (ctx) => {
            const s = ctx.source, d = ctx.dmg;
            if (ctx.target !== unit || !skillOn(unit, S3) || !s || !s.isFlying || !d || d.type !== "phys" && d.type !== "arts") return;
            if (d.tags && d.tags.includes("dot")) return;
            d.mul = (d.mul ?? 1) * (1 - dr);
          }, { owner: unit });
        }
        battle.on("beforeAttack", (ctx) => {
          if (ctx.attacker !== unit || !skillOn(unit, S3)) return;
          const prof = ctx.profile || unit.profile;
          const cands = battle.enemiesInKeys(unit.rangeKeys, unit, prof);
          for (const e of battle.blockedTargets(unit, prof)) if (!cands.includes(e)) cands.push(e);
          if (!cands.length) return;
          sortEnemyTargets(battle, unit, cands, prof.priority);
          let g = 0, f = 0;
          const out = [];
          for (const e of cands) {
            if (out.length >= maxT3) break;
            if (e.isFlying) {
              if (f >= maxFly3) continue;
              f++;
            } else {
              if (g >= maxWalk3) continue;
              g++;
            }
            out.push(e);
          }
          if (out.length) ctx.targets = out;
        }, { owner: unit });
        battle.on("tick", () => {
          if (!skillOn(unit, S3) || !up(unit)) return;
          if (slow > 0) {
            const keys = unit.rangeKeySet;
            for (const e of battle.enemies) {
              if (!e.alive || e.hidden || !e.isFlying || !keys || !bodyInKeys(e, keys)) continue;
              battle.applyStrongest(e, "aglna2:airSlow", { duration: MOVE_CHECK * 2, value: slow, mods: (v) => ({ moveMul: 1 - v }), source: unit });
            }
          }
        }, { owner: unit });
        battle.every(MOVE_CHECK, () => {
          if (!st || !skillOn(unit, S3) || !up(unit) || st.flight || !unit.canAct || unit.blocking.length) return;
          const tgt = moveTarget(battle, unit);
          if (!tgt) return;
          const dur = hypot(tgt.r - unit.tileR, tgt.c - unit.tileC) / MOVE_SPEED;
          const act = unit.skill.activations;
          st.flight = tgt;
          battle.releaseBlocked(unit);
          battle.addBuff(unit, { key: MOVE_KEY, duration: dur + 1, flags: { disarm: true, invulnerable: true, noHeal: true, noBlock: true }, tags: ["skill"] });
          battle.fx("dash", { x: unit.x, y: unit.y, id: unit.id, tx: tgt.c, ty: tgt.r, t: dur });
          battle.after(dur, () => {
            battle.removeBuff(unit, MOVE_KEY);
            if (!st || !skillOn(unit, S3) || unit.skill.activations !== act || !up(unit)) return;
            st.flight = null;
            const now = moveTarget(battle, unit);
            if (now) moveTo(battle, unit, now.r, now.c);
          }, { owner: unit });
        }, { owner: unit });
        battle.on("death", (ctx) => {
          if (ctx.unit !== unit) return;
          dropMarker(battle);
          battle.setExtraRange(unit, null);
        }, { owner: unit });
      }
    };
  }
};

// mods/marisa-native/source/server/sim/content/kits/ops/mod-kalts2.js
var S12 = "skchr_kalts2_1";
var S22 = "skchr_kalts2_2";
var S32 = "skchr_kalts2_3";
var ANCHOR = "token_x_marisa_10068_kalts2_mtship";
var KALTS_MON3TR = "token_10002_kalts_mon3tr";
var S2_RADIUS = 1.5;
var S1_AURA_IV = 0.3;
var TRANSPORT_CHECK = 0.1;
var TRANSPORT_SPEED = 3.5;
var TRANSPORT_RADIUS = 2.2;
var WITHDRAW_DELAY = 0.6;
var WITHDRAW_MAX = 2;
var T1_KEY = "talent:kalts2:t1";
var T2_SHIELD = "talent:kalts2:shield";
var T2_REGEN = "talent:kalts2:regen";
var S1_KEY = "skill:kalts2:blockRadius";
var ANCHOR_KEY = "kalts2:anchor";
var TAG_S2 = "kalts2:s2";
var bbOf2 = (chess, id) => skillRec(chess, id)?.bb ?? {};
var skillOn2 = (unit, id) => !!(unit.skill && unit.skill.active && unit.skill.id === id);
var isAnchorOf = (t, unit) => !!t && t.kind === "token" && t.defId === ANCHOR && t.ownerUnit === unit;
var anchorsOf = (battle, unit) => battle.allyUnits.filter((t) => isAnchorOf(t, unit));
var isRhodes = (a) => (a?.def?.raw?.nationId ?? a?.def?.nationId) === "rhodes";
var otherOp = (a, unit) => a !== unit && a.kind === "op" && up(a) && !a.hidden;
function setStock(unit, n) {
  const s = unit.mem.summonStock || (unit.mem.summonStock = {});
  s[ANCHOR] = n;
}
function anchorKit() {
  return {
    skill: null,
    talents: [],
    trait: { noAttack: true },
    install(battle, t) {
      battle.addBuff(t, { key: ANCHOR_KEY, flags: { invulnerable: true, untargetable: true, noBlock: true }, persist: true, allowDead: true });
    }
  };
}
function enterT2(battle, unit, a, t1) {
  if (!a.findBuff(T2_SHIELD)) battle.addBuff(a, { key: T2_SHIELD, shieldHits: 1, source: unit, tags: ["talent"] });
  const v = num7(t1.hp_recovery_per_sec) * (isRhodes(a) ? num7(t1.rhodes_bonus, 1) : 1);
  const d = num7(t1.buff_duration);
  if (v > 0 && d > 0) battle.applyStrongest(a, T2_REGEN, { duration: d, value: v, mods: (x) => ({ hpRegen: x }), source: unit });
  battle.fx("shield", { x: a.x, y: a.y, id: a.id });
}
function s2Burst(battle, unit, target, attackId, b2) {
  const x = target.x, y = target.y;
  const atk = unit.s.atk;
  const dmgAmt = atk * num7(b2["attack@atk_scale"], 1);
  const healAmt = atk * num7(b2["attack@heal_scale"], 1);
  const slug = num7(b2["attack@sluggish"]);
  const onEnemy = target.side === "enemy";
  const hurt = () => {
    for (const e of battle.foesInRadius(x, y, S2_RADIUS, true)) {
      if (!e.alive) continue;
      battle.dealDamage(unit, e, { amount: dmgAmt, type: "true", isAttack: true, isSkill: true, attackId, tags: [TAG_S2] });
      if (onEnemy && slug > 0 && e.alive) battle.applyStatus(e, "sluggish", { duration: slug, source: unit });
    }
  };
  const mend = () => {
    for (const a of battle.alliesInRadius(x, y, S2_RADIUS)) if (battle.allySelectable(a, unit)) battle.heal(unit, a, healAmt, { ignoreHealFree: true });
  };
  battle.fx("aoe", { x, y, radius: S2_RADIUS, id: unit.id, skill: TAG_S2 });
  battle.fx("healAoe", { x, y, radius: S2_RADIUS, id: unit.id });
  if (onEnemy) {
    hurt();
    mend();
  } else {
    mend();
    hurt();
  }
}
function s2CanAttack(battle, unit) {
  const prof = { canHitFly: true };
  if (battle.enemiesInKeys(unit.rangeKeys, unit, prof).length || battle.blockedTargets(unit, prof).length) return true;
  const ally = battle.injuredAlliesInKeys(unit.rangeKeys, unit)[0];
  if (ally && battle.forceAttack(unit, [ally])) unit.atkCd = Math.max(unit.atkCd, unit.s.interval);
  return false;
}
function flightPoint(battle, f) {
  const k = f.T > 0 ? Math.min(1, Math.max(0, (battle.time - f.t0) / f.T)) : 1;
  return { x: f.from.x + (f.to.x - f.from.x) * k, y: f.from.y + (f.to.y - f.from.y) * k };
}
function collide(battle, unit, f) {
  const enter = unit.mem.kalts2Enter;
  if (!enter) return;
  const p = flightPoint(battle, f);
  const r2 = TRANSPORT_RADIUS * TRANSPORT_RADIUS + 1e-9;
  for (const a of battle.allyUnits) {
    if (!otherOp(a, unit) || f.hit.has(a)) continue;
    if ((a.x - p.x) * (a.x - p.x) + (a.y - p.y) * (a.y - p.y) > r2) continue;
    f.hit.add(a);
    enter(a);
  }
}
function land2(battle, unit) {
  const f = unit.mem.k2flight;
  if (!f) return;
  unit.mem.k2flight = null;
  unit.hidden = false;
  if (!unit.alive || !unit.deployed) return;
  collide(battle, unit, f);
  unit.mem.k2landed = true;
  setStock(unit, 0);
  if (f.anchor.alive) battle.retreat(f.anchor, { reason: "expired" });
  const dir0 = unit.dir;
  unit.dir = f.dir;
  if (!battle.moveRedeploy(unit, f.r, f.c)) {
    unit.dir = dir0;
    battle.refreshRange(unit);
  }
  battle.fx("teleport", { x: unit.x, y: unit.y, id: unit.id, fromX: f.from.x, fromY: f.from.y });
}
function startTransport(battle, unit, anchor) {
  const picks = battle.allyUnits.filter((a) => otherOp(a, unit) && a.ownerId === unit.ownerId && unit.rangeKeySet?.has(a.tileR * COLS + a.tileC)).sort((a, b) => b.deploySeq - a.deploySeq).slice(0, WITHDRAW_MAX);
  for (const a of picks) {
    const seq = a.deploySeq;
    battle.after(WITHDRAW_DELAY, () => {
      if (!up(a) || a.deploySeq !== seq || !unit.alive || !skillOn2(unit, S32)) return;
      battle.retreat(a, { reason: "retreat" });
      if (a.alive) return;
      if (!battle.redeploy(a, { free: true })) a.respawnAt = Math.min(a.respawnAt, battle.time);
    }, { owner: unit });
  }
  const from = { x: unit.x, y: unit.y }, to = { x: anchor.x, y: anchor.y };
  const T = hypot(to.x - from.x, to.y - from.y) / TRANSPORT_SPEED;
  const f = { t0: battle.time, T, from, to, hit: /* @__PURE__ */ new Set(), anchor, r: anchor.tileR, c: anchor.tileC, dir: anchor.dir };
  unit.mem.k2flight = f;
  battle.releaseBlocked(unit);
  unit.hidden = true;
  battle.fx("disappear", { x: unit.x, y: unit.y, id: unit.id });
  collide(battle, unit, f);
  battle.after(T, () => land2(battle, unit), { owner: unit });
}
function tryTransport(battle, unit) {
  const m = unit.mem;
  if (!skillOn2(unit, S32) || m.k2flight || m.k2landed || !up(unit) || unit.hidden) return;
  const a = m.k2link;
  if (!a || !up(a) || !isAnchorOf(a, unit)) return;
  startTransport(battle, unit, a);
}
var mod_kalts2_default = {
  char_1052_kalts2: (bb, chess) => {
    const t0 = talentBb3(chess, 0);
    const t1 = talentBb3(chess, 1);
    const b1 = bbOf2(chess, S12), b2 = bbOf2(chess, S22), b3 = bbOf2(chess, S32);
    const s2 = skillRec(chess, S22);
    const picked = chess?.skill?.skillId ?? null;
    return {
      trait: { healThrough: (healer, a) => !!a && a.kind === "token" && a.defId === KALTS_MON3TR },
      skills: {
        [S12]: { kind: "duration", mods: { atkPct: num7(b1.atk), aspd: num7(b1.attack_speed) } },
        [S22]: {
          kind: "ammo",
          // The larger active range contains attack targets as well as patients (#406).
          trigger: { rule: "ACTIVE_RANGE", grid: s2?.rangeGrid, enemies: true },
          ammo: Math.max(1, Math.floor(num7(b2["attack@trigger_time"], 10))),
          mods: { atkPct: num7(b2.atk) },
          targeting: s2?.rangeGrid ? { rangeGrid: s2.rangeGrid } : void 0,
          attack: {
            dmgType: "true",
            canHitFly: true,
            hitsFn: () => 0,
            // the damage is the 医疗单元's burst (s2Burst), not a hit on the target itself
            canAttack: (battle, unit) => s2CanAttack(battle, unit),
            onEachHit: (ctx) => {
              if (ctx.kind === "main" && ctx.target) s2Burst(ctx.battle, ctx.unit, ctx.target, ctx.attackId, b2);
            }
          }
        },
        [S32]: {
          kind: "duration",
          mods: { atkPct: num7(b3.atk), batPct: batMod(b3.base_attack_time, chess) },
          targeting: { maxTargets: 2 },
          // 额外治疗1个目标 (her s3 heal trigger `_maxNum` 2)
          onStart({ battle, unit }) {
            unit.mem.k2landed = false;
            releaseSkillSummon(battle, unit, ANCHOR);
            battle.after(TRANSPORT_CHECK, () => tryTransport(battle, unit), { owner: unit });
          },
          onTick({ unit, skill, dt }) {
            if (unit.mem.k2flight) skill.timeLeft += dt;
          },
          // 技能剩余时间暂停消耗 while flying
          onEnd({ battle, unit }) {
            setStock(unit, 0);
            for (const t of anchorsOf(battle, unit)) if (t.alive) battle.retreat(t, { reason: "expired" });
            if (unit.mem.k2flight) {
              unit.mem.k2flight = null;
              unit.hidden = false;
            }
          }
        }
      },
      talents: [
        { install(battle, unit) {
          const mods = {};
          for (const [k, v] of [["hpPct", num7(t0.max_hp)], ["defPct", num7(t0.def)], ["blockCnt", num7(t0.block_cnt)], ["blockRadiusScale", num7(t0.block_radius_scale)]]) if (v) mods[k] = v;
          battle.addBuff(unit, { key: T1_KEY, mods, flags: { liftoff: true, blockFly: true }, persist: true, allowDead: true, tags: ["talent"] });
          battle.on("deploy", (c) => {
            if (c.unit === unit && !c.move) battle.fx("takeoff", { x: unit.x, y: unit.y, id: unit.id });
          }, { owner: unit });
        } },
        { install(battle, unit) {
          if (!(num7(t1.buff_duration) > 0)) return;
          const enter = (a) => enterT2(battle, unit, a, t1);
          unit.mem.kalts2Enter = enter;
          let inside = /* @__PURE__ */ new Set();
          battle.on("deploy", (c) => {
            if (c.unit === unit) inside = /* @__PURE__ */ new Set();
          }, { owner: unit });
          battle.on("tick", () => {
            if (!up(unit) || !unit.rangeKeySet) return;
            const now = /* @__PURE__ */ new Set();
            for (const a of battle.allyUnits) {
              if (!otherOp(a, unit) || !unit.rangeKeySet.has(a.tileR * COLS + a.tileC)) continue;
              now.add(a);
              if (!inside.has(a)) enter(a);
            }
            inside = now;
          }, { owner: unit });
        } }
      ],
      install(battle, unit) {
        for (const t of battle.allyUnits) {
          if (!isAnchorOf(t, unit) || t.alive || t.deployed) continue;
          if (t.kit) battle.offOwner(t);
          battle._setupUnit(t, anchorKit());
        }
        battle.on("deploy", (c) => {
          if (!isAnchorOf(c.unit, unit)) return;
          if (up(unit)) unit.mem.k2link = c.unit;
          tryTransport(battle, unit);
        }, { owner: unit });
        battle.on("death", (c) => {
          if (c.unit === unit || c.unit === unit.mem.k2link) unit.mem.k2link = null;
        }, { owner: unit });
        battle.on("tick", () => {
          const f = unit.mem.k2flight;
          if (f && unit.alive) collide(battle, unit, f);
        }, { owner: unit });
        const v1 = num7(b1["attack@block_radius_scale"]);
        if (picked === S12 && v1 > 0) {
          battle.every(S1_AURA_IV, () => {
            if (!up(unit) || !skillOn2(unit, S12)) return;
            for (const a of battle.allyUnits) {
              if (!otherOp(a, unit) || !a.s.flags.liftoff) continue;
              const cur = a.findBuff(S1_KEY);
              const own3 = (a.s.blockRadiusScale || 0) - (cur ? num7(cur.mods?.blockRadiusScale) : 0);
              if (own3 >= v1 - 1e-9 || cur && cur.source !== unit && num7(cur.data?.v) > v1 && cur.timeLeft > 0.05) continue;
              battle.addBuff(a, { key: S1_KEY, duration: S1_AURA_IV + 0.1, mods: { blockRadiusScale: v1 }, source: unit, data: { v: v1 }, tags: ["skill"] });
            }
          }, { owner: unit, immediate: true });
        }
      }
    };
  }
};

// mods/marisa-native/source/server/sim/content/bonds/addon/battle.js
var ID = Object.freeze({ rhode: "bond_x_marisa_rhodeShip" });
var KEY = Object.freeze({
  preci: "bond:preciShip",
  stead: "bond:steadShip",
  deput: "bond:deputShip",
  skillful: "bond:skillfulShip",
  raid: "bond:raidShip",
  raidAspd: "bond:raidShip:aspd",
  empty: "bond:emptyShip",
  emptyDmg: "bond:emptyShip:dmg",
  solo: "bond:soloShip",
  sunt: "bond:suntShip",
  arcane: "bond:arcaneShip",
  rhodeHeal: "bond:bond_x_marisa_rhodeShip:heal",
  rhodeAtk: "bond:bond_x_marisa_rhodeShip:overflow"
});
var RHODE_MOD_KEY = "MOD_bond_rhode";
var BB_KEY = Object.freeze({ [ID.rhode]: RHODE_MOD_KEY });
var LAYERED = /* @__PURE__ */ new Set([ID.preci, ID.swift, ID.skillful, ID.arcane, ID.stead, ID.deput, ID.raid, ID.indom, ID.rhode]);
var STEAD_CD = "bond:steadShip:cd";
var AURA_POLL = 0.25;
var RAID_POLL = 0.25;
var RAID_SEARCH = 2;
var RAID_TARGETS = 8;
var arcaneMods = (v) => ({ artsTakenMul: v });
function bondBb(bondId) {
  return buffParams(bondRecord(bondId), "env_gbuff_new") ?? {};
}
var procChance = (bb, L2) => Math.max(0, Math.min(1, num5(bb.base_prob) + num5(bb.prob_per_stack) * L2));
var prob = procChance;
function makeState(battle, p) {
  const pid = p.playerId;
  const ops = playerOps(battle, pid);
  const st = { pid, ops, tiers: {}, bb: {}, members: {} };
  for (const id of Object.values(ID)) {
    const t = bondTier(battle, pid, id);
    if (t <= 0) continue;
    st.tiers[id] = t;
    st.bb[id] = BB_KEY[id] ? buffParams(bondRecord(id), BB_KEY[id]) ?? {} : bondBb(id);
    st.members[id] = new Set(ops.filter((u) => isMember(battle, u, id)));
  }
  return st;
}
var L = (battle, st, id) => bondLayers(battle, st.pid, id);
var fin = (v, d) => Number.isFinite(v) ? v : d;
function applyPassives(battle, st) {
  const t = st.tiers;
  if (t[ID.preci]) {
    const bb = st.bb[ID.preci];
    const wide = t[ID.preci] >= 2;
    const mods = directMods({ atk: num5(bb.base_atk) + num5(bb.atk_per_stack) * L(battle, st, ID.preci) });
    if (wide) {
      mods.defIgnorePct = num5(bb.power_def_penetrate);
      mods.resIgnorePct = num5(bb.power_magic_resist_penetrate);
    }
    for (const u of st.ops) {
      if (st.members[ID.preci].has(u) || wide && u.def?.position === "RANGED") passiveBuff(battle, u, KEY.preci, mods);
    }
  }
  if (t[ID.stead]) {
    const bb = st.bb[ID.stead];
    const mods = directMods({ hp: num5(bb.base_max_hp) + num5(bb.max_hp_per_stack) * L(battle, st, ID.stead) });
    for (const u of st.ops) passiveBuff(battle, u, KEY.stead, mods);
  }
  if (t[ID.deput]) {
    const bb = st.bb[ID.deput];
    const mods = directMods({ def: num5(bb.base_def) + num5(bb.def_per_stack) * L(battle, st, ID.deput) }, { redeployMul: Math.max(0, 1 + num5(bb.respawn_time)) });
    for (const u of st.ops) passiveBuff(battle, u, KEY.deput, mods);
  }
  if (t[ID.raid]) {
    const bb = st.bb[ID.raid];
    const lv = L(battle, st, ID.raid);
    const milestone = num5(bb.power_bond_stack_cnt, Infinity);
    if (lv >= milestone) {
      const mods = { aspd: num5(bb.power_attack_speed) };
      for (const u of st.ops) passiveBuff(battle, u, KEY.raidAspd, mods);
      if (!st.raidMilestone) {
        st.raidMilestone = true;
        for (const u of st.members[ID.raid]) if (onField(u)) {
          fxOn(battle, "bondMilestone", u, KEY.raid, "aspd");
          break;
        }
      }
    }
    st.raidMods = raidMods(bb, lv);
    for (const u of st.members[ID.raid]) {
      const b = u.findBuff(KEY.raid);
      if (b) {
        b.mods = st.raidMods;
        u.markDirty();
      }
    }
  }
  if (t[ID.arcane]) {
    const bb = st.bb[ID.arcane];
    const m = num5(bb.base_damage_scale, 1) + num5(bb.damage_scale_per_stack) * L(battle, st, ID.arcane);
    st.arcaneMul = Math.max(0, m);
    st.arcaneLowMul = Math.max(0, m * num5(bb.power_weak_scale, 1));
  }
  if (t[ID.skillful]) {
    const bb = st.bb[ID.skillful];
    const lv = L(battle, st, ID.skillful);
    const v = num5(bb.base_attack_speed) + num5(bb.attack_speed_per_stack) * lv;
    if (!st.auraMods || st.auraMods.aspd !== v) st.auraMods = { aspd: v };
    st.auraWide = lv >= num5(bb.power_bond_stack_cnt, Infinity);
  }
  if (t[ID.rhode]) {
    const mul = rhodeHealMul(st.bb[ID.rhode], L(battle, st, ID.rhode));
    for (const u of st.ops) passiveBuff(battle, u, KEY.rhodeHeal, { healingTakenMul: mul });
  }
}
function raidMods(bb, lv) {
  const mods = directMods({
    atk: num5(bb.base_atk) + num5(bb.atk_per_stack) * lv,
    hp: num5(bb.base_max_hp) + num5(bb.max_hp_per_stack) * lv
  });
  const aspd = num5(bb.base_attack_speed) + num5(bb.attack_speed_per_stack) * lv;
  if (aspd) mods.aspd = aspd;
  return mods;
}
function applyStatic(battle, st) {
  const t = st.tiers;
  if (t[ID.empty]) {
    const bb = st.bb[ID.empty];
    const taken = Math.max(0, 1 - num5(bb.damage_resistance));
    for (const u of st.ops) {
      passiveBuff(battle, u, KEY.empty, { physTakenMul: taken, artsTakenMul: taken });
      if (st.members[ID.empty].has(u)) {
        passiveBuff(battle, u, KEY.emptyDmg, { dmgDealtMul: num5(isElite(u) ? bb.damage_scale_extra : bb.damage_scale_normal, 1) });
      }
    }
  }
  if (t[ID.solo]) {
    const bb = st.bb[ID.solo];
    const mods = directMods({ atk: num5(bb.atk), hp: num5(bb.max_hp) });
    for (const u of st.members[ID.solo]) passiveBuff(battle, u, KEY.solo, mods);
  }
  if (t[ID.sunt]) {
    const bb = st.bb[ID.sunt];
    const mods = directMods({ atk: num5(bb.power_atk) });
    for (const u of st.ops) {
      if (!isElite(u)) continue;
      passiveBuff(battle, u, KEY.sunt, mods);
      if (t[ID.sunt] >= 2) suntSpCost(u, bb);
    }
  }
}
function suntSpCost(u, bb) {
  const sk = u && u.skill;
  if (!sk || sk.noSkill || u.mem[KEY.sunt]) return;
  u.mem[KEY.sunt] = true;
  sk.spCostMul = sk.spCostMul * num5(bb.sp_ratio, 1);
}
function updateAura(battle, st) {
  const mods = st.auraMods;
  if (!mods) return;
  const next = st.auraNext ?? (st.auraNext = /* @__PURE__ */ new Set());
  next.clear();
  const offs = st.auraWide ? N8 : N4;
  for (const m of st.members[ID.skillful]) {
    const active = onField(m);
    if (!active && (m.removeReason !== "killed" || !battle.isDown(m))) continue;
    if (active) next.add(m);
    const [r, c] = active ? [m.tileR, m.tileC] : battle.restTile(m);
    for (const [dr, dc] of offs) {
      const a = battle.unitAt(r + dr, c + dc);
      if (a && a.kind === "op" && a.ownerId === st.pid && onField(a)) next.add(a);
    }
  }
  const cur = st.aura ?? (st.aura = /* @__PURE__ */ new Set());
  for (const u of cur) if (!next.has(u)) battle.removeBuff(u, KEY.skillful);
  for (const u of next) {
    const b = u.findBuff(KEY.skillful);
    if (!b) battle.addBuff(u, { key: KEY.skillful, mods });
    else if (b.mods !== mods) {
      b.mods = mods;
      u.markDirty();
    }
  }
  st.aura = next;
  st.auraNext = cur;
}
function rhodeHealMul(bb, L2) {
  const step = Math.max(1, Math.floor(num5(bb.heal_eff_step, 5)));
  return 1 + num5(bb.heal_eff_per_step, 0.01) * Math.floor(Math.max(0, num5(L2, 0)) / step);
}
function rhodeAuraInterval(bb, L2) {
  const min = num5(bb.aura_interval_min, 0.5), max = num5(bb.aura_interval_max, 5);
  const lMax = Math.max(1e-9, 100 * num5(bb.aura_l_max, 1));
  const l = Math.max(0, Math.min(lMax, num5(L2, 0)));
  return Math.max(0, min + (max - min) * (1 - Math.sqrt(l / lMax)));
}
function rhodeLayerCap(battle, st) {
  let cap = 0;
  for (const id of activeBondIds(battle, st.pid)) {
    if (id === ID.rhode) continue;
    cap = Math.max(cap, bondLayers(battle, st.pid, id));
  }
  return Math.max(cap, num5(st.rhodeCapHint, 0));
}
function rhodeFieldCount(st) {
  const seen = /* @__PURE__ */ new Set();
  for (const m of st.members[ID.rhode]) if (onField(m)) seen.add(baseChessId(m));
  return seen.size;
}
function rhodeEffOf(bb, count) {
  const b = bb || {};
  const n = Math.max(0, num5(count, 0));
  const min = num5(b.field_eff_member_min, 0);
  if (min > 0) return n >= min ? num5(b.field_eff_max, 1) : num5(b.field_eff_low, 0.5);
  return Math.min(num5(b.field_eff_max, 1), Math.max(0, num5(b.field_eff_per_member, 0.25) * n));
}
function rhodeMirror(battle, st, c) {
  const src = c.source;
  if (!src || src.kind !== "op" || src.ownerId !== st.pid || !onField(src)) return 0;
  if (st.members[ID.rhode].has(src)) return 0;
  let covered = false;
  for (const m of st.members[ID.rhode]) if (onField(m) && inRange(m, src)) {
    covered = true;
    break;
  }
  if (!covered) return 0;
  const n = Math.floor(num5(c.n, 0));
  if (!(n > 0)) return 0;
  const hint = st.rhodeCapHint;
  st.rhodeCapHint = bondLayers(battle, st.pid, c.bondId) + n;
  let added;
  try {
    added = gainLayers(battle, { playerId: st.pid, bonds: ID.rhode, n, requireActive: true, source: src, reason: "bond" });
  } finally {
    st.rhodeCapHint = hint;
  }
  if (added > 0) fxOn(battle, "bondProc", src, "bond:bond_x_marisa_rhodeShip", "mirror", { n: added });
  return added;
}
function rhodeHealStrike(battle, st, t, amount) {
  const bb = st.bb[ID.rhode];
  const lv = L(battle, st, ID.rhode);
  const dmgAmount = amount * lv * num5(bb.weakness_scale, 0.1);
  if (!(dmgAmount > 0)) return 0;
  const radius = Math.max(1, Math.floor(num5(bb.weakness_radius, 1)));
  const keys = [];
  for (let dr = -radius; dr <= radius; dr++) {
    for (let dc = -radius; dc <= radius; dc++) {
      if (Math.max(Math.abs(dr), Math.abs(dc)) !== radius) continue;
      const r = t.tileR + dr, c = t.tileC + dc;
      if (battle.grid.inRect(r, c)) keys.push(r * COLS + c);
    }
  }
  let hit = 0;
  for (const e of battle.enemiesInKeys(keys, t, t.profile)) {
    if (!e.alive) continue;
    const d = battle.makeDamage({ amount: dmgAmount, type: "arts", canDodge: false, tags: ["bond:bond_x_marisa_rhodeShip", "weakness"] });
    weaknessRetype(d, t, e);
    battle.dealDamage(t, e, d);
    hit++;
    fxOn(battle, "strike", e, "bond:bond_x_marisa_rhodeShip", "weakness", { from: t.id, n: Math.round(dmgAmount) });
  }
  return hit;
}
function rhodeAuraOn(battle, st) {
  const seen = /* @__PURE__ */ new Set();
  for (const m of st.members[ID.rhode]) if (onField(m)) seen.add(baseChessId(m));
  return seen.size >= 2;
}
function rhodeAtkBasis(u) {
  const { add: m, mul } = aggregateMods(u.buffs.filter((b) => b.key !== KEY.rhodeAtk));
  const finalMul = (mul.atkMul ?? 1) * (u.cultMul?.atk ?? 1);
  const b0 = u.base;
  const own3 = Math.max(0, fin(((b0.atk + (m.atkFlat ?? 0)) * Math.max(0, 1 + (m.atkPct ?? 0)) + (m.atkFinal ?? 0)) * finalMul, fin(b0.atk, 0)));
  return { own: own3, finalMul };
}
function rhodeAtkTick({ unit: u, buff }) {
  const { own: own3, finalMul } = rhodeAtkBasis(u);
  buff.data.amount = Math.min(buff.data.amount, own3 * buff.data.capRatio);
  const value = finalMul > 0 ? buff.data.amount / finalMul : 0;
  if (buff.mods.atkFinal !== value) {
    buff.mods.atkFinal = value;
    u.markDirty();
  }
}
function rhodeOverflowAtk(battle, u, overflow, bb, decay) {
  const cur = u.findBuff(KEY.rhodeAtk);
  const { own: own3, finalMul } = rhodeAtkBasis(u);
  if (!(finalMul > 0)) {
    battle.removeBuff(u, KEY.rhodeAtk);
    return 0;
  }
  const prev = cur ? num5(cur.data.amount, 0) : 0;
  const capRatio = Math.max(0, num5(bb.aura_atk_cap_ratio, 1));
  const cap = capRatio * own3;
  const next = Math.min(cap, prev + overflow);
  if (!(next > 0)) return 0;
  battle.addBuff(u, {
    key: KEY.rhodeAtk,
    duration: decay,
    refresh: "replace",
    mods: { atkFinal: next / finalMul },
    data: { amount: next, capRatio },
    onTick: rhodeAtkTick
  });
  return next;
}
var rhodeHealRefused = (u) => !!(u.s.flags.noHeal || u.s.flags.healFree || u.profile && u.profile.noHeal);
function rhodePulse(battle, st) {
  const bb = st.bb[ID.rhode];
  const decay = num5(bb.aura_decay_sec, 2);
  const lv = L(battle, st, ID.rhode);
  const interval = rhodeAuraInterval(bb, lv);
  if (rhodeAuraOn(battle, st)) {
    let anchor = null;
    for (const u of st.ops) {
      if (!onField(u)) continue;
      anchor ??= u;
      if (rhodeHealRefused(u)) continue;
      st.probe = u;
      st.probeAmt = null;
      const actual = battle.heal(null, u, lv);
      st.probe = null;
      const amount = st.probeAmt != null ? st.probeAmt : lv * num5(u.s.healingTakenMul, 1);
      const overflow = Math.max(0, amount - actual);
      if (overflow > 0 && decay > 0) rhodeOverflowAtk(battle, u, overflow, bb, decay);
    }
    if (anchor) fxOn(battle, "bondProc", anchor, "bond:bond_x_marisa_rhodeShip", "aura", { L: lv, interval });
    battle.emit("rhodeAura", { playerId: st.pid, layers: lv, interval, heal: lv });
  }
  return interval;
}
function installRhodeAura(battle, st) {
  const arm = () => {
    if (battle.finished) return;
    st.auraAt = (st.auraAt ?? battle.time) + rhodeAuraInterval(st.bb[ID.rhode], L(battle, st, ID.rhode));
    battle.after(Math.max(0, st.auraAt - battle.time), () => {
      if (battle.finished) return;
      rhodePulse(battle, st);
      arm();
    });
  };
  arm();
}
function installRhodeDotCap(battle, isOurOp, cap) {
  if (!(cap > 0)) return;
  const store = battleStore(battle, "bonds:addon:rhode", () => ({ patched: false, watched: /* @__PURE__ */ new WeakSet(), state: /* @__PURE__ */ new WeakMap() }));
  if (store.patched) return;
  store.patched = true;
  const add = battle.addBuff;
  battle.addBuff = function(unit, desc) {
    const b = add.call(this, unit, desc);
    if (!b || !isOurOp(unit)) return b;
    if (!(b.interval > 0) || typeof b.onTick !== "function" || !Number.isFinite(b.duration) || !(b.duration > cap)) return b;
    let st = store.state.get(b);
    if (!st) {
      st = { start: this.time, preCut: b.interval <= cap, dot: false };
      store.state.set(b, st);
      const tick = b.onTick;
      b.onTick = function(ctx) {
        const u = ctx && ctx.unit;
        const before = num5(u && u.stats ? u.stats.taken : 0, 0);
        try {
          return tick.call(this, ctx);
        } finally {
          const s = store.state.get(b);
          if (!s || !u) return;
          const elapsed = Math.max(0, battle.time - s.start);
          if (num5(u.stats ? u.stats.taken : 0, 0) > before + 1e-9) {
            s.dot = true;
            s.preCut = false;
          } else if (s.preCut) {
            if (b.timeLeft < b.duration - elapsed) b.timeLeft = Math.max(0, b.duration - elapsed);
            s.preCut = false;
          }
          if (s.dot) {
            const left = Math.max(0, cap - elapsed);
            if (b.timeLeft > left) b.timeLeft = left;
          }
        }
      };
    }
    if (st.preCut) b.timeLeft = Math.min(b.timeLeft, cap);
    return b;
  };
}
function raidReach(u) {
  const d = normDir(u.dir);
  const out = [];
  for (const [dr, dc] of extendedGrid(u.rangeGrid || [[0, 0]], num5(u.s.rangeExtend))) out.push(...rotateOffset(dr, dc, d));
  return out;
}
function raidBoard(battle, r, c) {
  if (battle.onFieldBoard(r, c)) return true;
  return battle.modeId?.startsWith("mode_multi_") && (battle.kind === "boss" || battle.kind === "hidden") && r >= GEO.FIELD.r0 + BOSS_ROW_OFFSET && r <= GEO.FIELD.r1 + BOSS_ROW_OFFSET && c >= GEO.FIELD.c0 && c <= COLS - 1 - GEO.FIELD.c0;
}
function raidTile(battle, u, e, reach) {
  const er = Math.round(e.y), ec = Math.round(e.x);
  const ranged = u.def?.position === "RANGED";
  const body = bodyKeys(e);
  let bR0 = Infinity, bR1 = -1, bC0 = Infinity, bC1 = -1;
  for (const k of body) {
    const br = Math.floor(k / COLS), bc = k - br * COLS;
    bR0 = Math.min(bR0, br);
    bR1 = Math.max(bR1, br);
    bC0 = Math.min(bC0, bc);
    bC1 = Math.max(bC1, bc);
  }
  const path = !ranged && u.s.blockCnt > 0 ? battle.groundPathTiles() : null;
  let best = null, bp = 2, bd = Infinity, bo = null;
  for (const k of body) {
    const br = Math.floor(k / COLS), bc = k - br * COLS;
    for (let i = 0; i < reach.length; i += 2) {
      const r = br - reach[i], c = bc - reach[i + 1], dr = r - er, dc = c - ec;
      const wr = Math.min(Math.max(r, bR0), bR1) - r, wc = Math.min(Math.max(c, bC0), bC1) - c;
      if (Math.abs(wr) > RAID_SEARCH || Math.abs(wc) > RAID_SEARCH) continue;
      if (!battle.grid.inRect(r, c) || !raidBoard(battle, r, c) || !battle.grid.canStand(r, c, { ranged }) || battle.isReservedTile(r, c)) continue;
      const t = r * COLS + c;
      const p = path && battle.grid.tile(r, c).pass === "ALL" && (path.has(t) || body.includes(t)) ? 0 : 1;
      const d = Math.max(Math.abs(dr), Math.abs(dc)) + 0.01 * (Math.abs(dr) + Math.abs(dc));
      const o = localOrder(dr, dc, u.dir);
      if (p < bp || p === bp && (d < bd - 1e-9 || Math.abs(d - bd) <= 1e-9 && localBefore(o, bo))) {
        best = [r, c];
        bp = p;
        bd = d;
        bo = o;
      }
    }
  }
  return best;
}
function raidGroundEnemy(u, e) {
  if (!e || e.isFlying) return false;
  if (canTargetEnemy(u, e, { canHitFly: false })) return true;
  if (!e.alive || e.hidden || !e.deployed || !enemyStealthed(e)) return false;
  const f = e.s.flags;
  if (f.untargetable || f.sleep) return false;
  const skip = u.profile && u.profile.skipEnemy;
  return !(typeof skip === "function" && skip(e));
}
function raidStealthInRange(battle, u) {
  const keys = u.rangeKeySet || u.rangeKeys;
  if (!keys) return false;
  for (const e of battle.enemies) if (e.alive && enemyStealthed(e) && raidGroundEnemy(u, e) && bodyInRange(e, keys)) return true;
  return false;
}
function raidTargets(battle, u, pid, { taunt = false } = {}) {
  const own3 = [], other = [];
  for (const e of battle.enemies) {
    if (!raidGroundEnemy(u, e)) continue;
    (e.ownerId === pid ? own3 : other).push(e);
  }
  const list = own3.length ? own3 : other;
  const dist = new Map(list.map((e) => [e, num5(battle.remainingDistance ? battle.remainingDistance(e) : 0)]));
  list.sort((a, b) => (taunt ? num5(b.s.taunt) - num5(a.s.taunt) : 0) || dist.get(a) - dist.get(b) || a.id - b.id);
  return list;
}
function raidRefreshContact(battle, u) {
  for (const e of battle.enemies) {
    if (!e.alive || e.blockedBy || e.hidden) continue;
    if (Math.abs(Math.round(e.y) - u.tileR) > 1 || Math.abs(Math.round(e.x) - u.tileC) > 1) continue;
    battle._checkBlock(e);
  }
}
function raidPoll(battle, st) {
  const bb = st.bb[ID.raid];
  const idle = num5(bb.no_attack_duration, 10);
  let plain = null, taunted = null;
  for (const u of st.members[ID.raid]) {
    if (!onField(u) || !u.canAct) continue;
    const revived = u.mem.raidReviveSeq === u.deploySeq;
    if (revived) {
      u.mem.raidReviveSeq = 0;
      raidRefreshContact(battle, u);
    }
    if (revived && u.blocking.some((e) => e.alive && e.blockedBy === u)) continue;
    const since = Math.max(u.lastAttackAt ?? -Infinity, u.deployedAt ?? -Infinity, u.mem[KEY.raid] ?? -Infinity);
    const sk = u.skill;
    const deploySkillOn = !!(sk && sk.active && (sk.kind === "passive" || sk.spType === "none"));
    const ready = !!(sk && !sk.noSkill && (sk.ready && !(sk.active && sk.isTimed) || deploySkillOn));
    const idleOk = battle.time - since >= idle - 1e-9;
    if (!(revived || ready || idleOk)) continue;
    if (!revived && (battle.enemiesInKeys(u.rangeKeys || [], u, u.profile).length || raidStealthInRange(battle, u))) continue;
    const list = revived ? taunted ??= raidTargets(battle, u, st.pid, { taunt: true }) : plain ??= raidTargets(battle, u, st.pid);
    if (!list.length) continue;
    const reach = raidReach(u);
    for (let i = 0; i < list.length && i < RAID_TARGETS; i++) {
      const tile = raidTile(battle, u, list[i], reach);
      if (!tile) continue;
      plain = taunted = null;
      const res = raidRedeploy(battle, u, tile[0], tile[1]);
      u.mem.raidReviveSeq = 0;
      if (!res) continue;
      u.mem[KEY.raid] = battle.time;
      if (res === "raid") {
        battle.addBuff(u, { key: KEY.raid, mods: st.raidMods });
        fxOn(battle, "blink", u, KEY.raid, "relocate", { target: list[i].id });
      }
      break;
    }
  }
}
function raidRedeploy(battle, u, r, c) {
  battle.retreat(u, { reason: "raid" });
  if (u.alive) return false;
  if (battle.redeploy(u, { free: true, tile: [r, c], keepSp: true })) return "raid";
  return battle.redeploy(u, { free: true, keepSp: true }) ? "home" : false;
}
function install(battle) {
  if (!battle || !Array.isArray(battle.players) || !battle.players.length) return;
  const states = [];
  for (const p of battle.players) {
    const st = makeState(battle, p);
    if (Object.keys(st.tiers).length) states.push(st);
  }
  if (!states.length) return;
  const byPid = /* @__PURE__ */ Object.create(null);
  for (const st of states) {
    byPid[st.pid] = st;
    applyPassives(battle, st);
    applyStatic(battle, st);
  }
  const has = (id, tier = 1) => states.some((st) => (st.tiers[id] ?? 0) >= tier);
  if (states.some((st) => Object.keys(st.tiers).some((id) => LAYERED.has(id)))) {
    battle.on("layerGain", (c) => {
      const st = byPid[c.playerId];
      if (!st || !st.tiers[c.bondId] || !LAYERED.has(c.bondId) || st.pending) return;
      st.pending = true;
      battle.after(0, () => {
        st.pending = false;
        applyPassives(battle, st);
        if (st.tiers[ID.skillful]) updateAura(battle, st);
      });
    });
  }
  const rhode = states.filter((st) => st.tiers[ID.rhode]);
  if (rhode.length) {
    battle.on("layerGain", (c) => {
      if (c.bondId === ID.rhode) return;
      const st = byPid[c.playerId];
      if (!st || !st.tiers[ID.rhode]) return;
      rhodeMirror(battle, st, c);
    }, { priority: -50 });
    battle.on("layerGain", (c) => {
      if (c.bondId !== ID.rhode) return;
      const st = byPid[c.playerId];
      if (!st || !st.tiers[ID.rhode]) return;
      const bb = st.bb[ID.rhode] || {};
      const eff = rhodeEffOf(bb, rhodeFieldCount(st));
      const total = Math.max(0, num5(st.rhodeFrac, 0)) + Math.max(0, num5(c.n, 0)) * eff;
      let n = Math.floor(total + 1e-9);
      st.rhodeFrac = total - n;
      const room = rhodeLayerCap(battle, st) - L(battle, st, ID.rhode);
      if (n > room) n = Math.max(0, room);
      c.n = n;
    }, { priority: -60 });
    const rhodePids = new Set(rhode.map((st) => st.pid));
    const refreshOverflow = (u) => {
      if (!u || !rhodePids.has(u.ownerId)) return;
      const buff = u.findBuff(KEY.rhodeAtk);
      if (buff) rhodeAtkTick({ unit: u, buff });
    };
    battle.on("skillEnd", ({ unit }) => refreshOverflow(unit), { priority: -1e3 });
    battle.on("beforeAttack", ({ attacker }) => refreshOverflow(attacker), { priority: -1e3 });
    battle.on("tick", () => {
      for (const st of rhode) for (const u of st.ops) refreshOverflow(u);
    }, { priority: -1e3 });
    installRhodeDotCap(battle, (u) => !!(u && u.side === "ally" && u.kind === "op" && rhodePids.has(u.ownerId)), num5(rhode[0].bb[ID.rhode].dot_duration_cap, 5));
    battle.on("heal", (c) => {
      const t = c.target;
      if (!t || t.side !== "ally" || !isOp(t) || !t.alive || !t.deployed) return;
      const st = byPid[t.ownerId];
      if (!st || !st.tiers[ID.rhode]) return;
      if (st.probe === t) st.probeAmt = num5(c.amount, 0);
      if (st.striking) return;
      const actual = Math.max(0, Math.min(num5(c.amount, 0), t.s.maxHp - t.hp));
      if (!(actual > 0)) return;
      st.striking = true;
      try {
        rhodeHealStrike(battle, st, t, actual);
      } finally {
        st.striking = false;
      }
    }, { priority: -1e3 });
    for (const st of rhode) if (st.tiers[ID.rhode] >= 2) installRhodeAura(battle, st);
  }
  if (has(ID.skillful)) {
    const aura = states.filter((st) => st.tiers[ID.skillful]);
    const refresh = (pid) => {
      for (const st of aura) if (pid == null || st.pid === pid) updateAura(battle, st);
    };
    battle.on("battleStart", () => refresh(null));
    battle.on("deploy", (c) => {
      if (c.unit && c.unit.kind === "op" && byPid[c.unit.ownerId]?.tiers[ID.skillful]) refresh(c.unit.ownerId);
    });
    battle.on("death", (c) => {
      if (c.unit && c.unit.kind === "op" && byPid[c.unit.ownerId]?.tiers[ID.skillful]) refresh(c.unit.ownerId);
    });
    battle.every(AURA_POLL, () => refresh(null));
  }
  if (has(ID.raid)) {
    const raid = states.filter((st) => st.tiers[ID.raid] && st.members[ID.raid].size);
    if (raid.length) {
      battle.on("deploy", (c) => {
        const u = c.unit;
        if (!u || c.initial || c.move || u.removeReason !== "killed" || !(u.respawnAt > battle.time + 1e-9)) return;
        if (raid.some((st) => st.members[ID.raid].has(u))) u.mem.raidReviveSeq = u.deploySeq;
      });
      battle.every(RAID_POLL, () => {
        for (const st of raid) raidPoll(battle, st);
      });
    }
  }
  if (has(ID.swift)) {
    battle.on("skillEnd", (c) => {
      const u = c.unit;
      if (!u || u.kind !== "op" || c.reason === "death" || !u.alive || !u.skill) return;
      const st = byPid[u.ownerId];
      if (!st || !st.tiers[ID.swift]) return;
      const bb = st.bb[ID.swift];
      const lv = L(battle, st, ID.swift);
      const p = prob(bb, lv);
      let gained = 0;
      if (st.members[ID.swift].has(u) && battle.rng() < p) gained += u.skill.gainSp(num5(bb.normal_sp), "bond");
      if (lv >= num5(bb.power_bond_stack_cnt, Infinity) && battle.rng() < p) gained += u.skill.gainSp(num5(bb.power_sp), "bond");
      if (gained > 0) fxOn(battle, "sp", u, "bond:swiftShip", "proc", { n: gained });
    });
  }
  const soloOrSunt = has(ID.solo) || has(ID.sunt, 2);
  if (soloOrSunt) {
    battle.on("deploy", (c) => {
      const u = c.unit;
      if (!u || u.kind !== "op" && u.kind !== "token") return;
      const st = byPid[u.ownerId];
      if (!st) return;
      if (u.kind === "op" && st.tiers[ID.solo] && st.members[ID.solo].has(u) && u.skill) {
        const n = num5(st.bb[ID.solo].sp);
        if (n > 0) u.skill.gainSp(n, "init");
      }
      if (u.kind === "token" && (st.tiers[ID.sunt] ?? 0) >= 2 && isElite(u.ownerUnit)) suntSpCost(u, st.bb[ID.sunt]);
    });
  }
  if (has(ID.indom)) {
    const INDOM_EXITS = /* @__PURE__ */ new Set(["killed", "retreat", "merchant"]);
    const stOf = (u) => {
      const st = isGroundOp(u) ? byPid[u.ownerId] : null;
      return st && st.tiers[ID.indom] ? st : null;
    };
    battle.on("death", (c) => {
      const u = c.unit;
      const banked = !!(u && u.mem && u.mem.indomFreeDeploy);
      if (!INDOM_EXITS.has(c.reason) || !(stOf(u) || banked && u.kind === "op")) return;
      const st = stOf(u);
      const bb = st ? st.bb[ID.indom] : null;
      if (st && c.reason === "killed" && st.tiers[ID.indom] >= 2) {
        const sp = num5(bb.sp);
        if (sp > 0) {
          for (const o of st.ops) if (onField(o) && o.skill) o.skill.gainSp(sp, "bond");
        }
      }
      if (u.alive || u.removed || u.mem[ID.indom] === battle.time) return;
      if (banked || st && battle.rng() < prob(bb, L(battle, st, ID.indom))) {
        u.mem[ID.indom] = battle.time;
        if (battle.redeploy(u, { free: true })) fxOn(battle, "revive", u, "bond:indomShip", "redeploy");
      }
    }, { priority: 10 });
    battle.on("dollSwap", ({ unit: u }) => {
      const st = stOf(u);
      if (!st || !u.alive || u.mem.indomFreeDeploy) return;
      if (battle.rng() < prob(st.bb[ID.indom], L(battle, st, ID.indom))) u.mem.indomFreeDeploy = true;
    });
    battle.on("deploy", ({ unit: u }) => {
      if (u && u.mem && u.mem.indomFreeDeploy) u.mem.indomFreeDeploy = false;
    });
  }
  const stead = has(ID.stead, 2);
  const arcane = has(ID.arcane);
  if (stead) {
    battle.on("hit", (c) => {
      const t = c.target, dmg = c.dmg;
      if (!t || t.side !== "ally" || t.kind !== "op" || !dmg || dmg.cancel || dmg.steadShare || dmg.steadCut || dmg.tags?.includes("bond:stead:share") || dmg.type === "element") return;
      const st = byPid[t.ownerId];
      if (!st || (st.tiers[ID.stead] ?? 0) < 2 || st.members[ID.stead].has(t)) return;
      let any = false;
      for (const m of st.members[ID.stead]) if (onField(m)) {
        any = true;
        break;
      }
      if (!any) return;
      const ratio = Math.max(0, Math.min(1, num5(st.bb[ID.stead].damage_resistance)));
      if (!(ratio > 0) || ratio >= 1) return;
      applyRedirectCut(dmg, ratio);
      dmg.steadCut = ratio;
    }, { priority: -20 });
  }
  if (stead || arcane) {
    battle.on("damaged", (c) => {
      const t = c.target, dmg = c.dmg;
      if (!t || !dmg) return;
      if (t.side === "ally") {
        if (!stead || t.kind !== "op") return;
        const st2 = byPid[t.ownerId];
        if (!st2 || (st2.tiers[ID.stead] ?? 0) < 2) return;
        if (dmg.steadCut) {
          const ratio = dmg.steadCut;
          dmg.steadCut = 0;
          const share = redirectShare(num5(c.amount), ratio, dmg.redirectCuts);
          if (!(share > 0)) return;
          const on = [];
          for (const m of st2.members[ID.stead]) if (onField(m)) on.push(m);
          for (const m of on) {
            const d2 = battle.makeDamage({
              amount: share / on.length,
              type: "true",
              canDodge: false,
              tags: ["bond:stead:share", ...dmg.tags?.includes("transfer") ? ["transfer"] : []]
            });
            d2.steadShare = true;
            battle.dealDamage(null, m, d2);
          }
          return;
        }
        if (dmg.steadShare || dmg.steadThorn || c.type === "element" || isHpLoss(dmg) || !st2.members[ID.stead].has(t)) return;
        const bb2 = st2.bb[ID.stead];
        const last = t.mem[STEAD_CD] ?? -Infinity;
        if (battle.time - last < num5(bb2.cd_duration) - 1e-9) return;
        t.mem[STEAD_CD] = battle.time;
        const src2 = c.source;
        if (!src2 || src2.side !== "enemy" || !src2.alive) return;
        const d = battle.makeDamage({ amount: num5(bb2.base_damage_value) + num5(bb2.damage_value_per_stack) * L(battle, st2, ID.stead), type: "arts", canDodge: false, sourceless: true });
        d.steadThorn = true;
        battle.dealDamage(t, src2, d);
        if (src2.alive) battle.applyStatus(src2, "fragile", { duration: num5(bb2["weak[limit]"], 5), value: num5(bb2.damage_scale, 1) - 1, source: t });
        return;
      }
      if (!arcane || c.type !== "arts" || t.side !== "enemy" || !t.alive) return;
      const src = c.source;
      if (!src || src.kind !== "op") return;
      const st = byPid[src.ownerId];
      if (!st || !st.tiers[ID.arcane] || !st.members[ID.arcane].has(src)) return;
      const bb = st.bb[ID.arcane];
      const low = st.tiers[ID.arcane] >= 2 && t.hpRatio < num5(bb.hp_ratio);
      battle.applyStrongest(t, KEY.arcane, { duration: num5(bb.weak_duration, 3), value: low ? st.arcaneLowMul : st.arcaneMul, mods: arcaneMods, source: src });
    });
  }
}

// mods/marisa-native/source/server/sim/content/bands/battle.js
var PRIO_BAND_REVIVE = PRIO_RESPAWN - 1;
var keyOf2 = (bandId, part = "") => `band:${bandId}${part ? `:${part}` : ""}`;
var deployedOps = (battle, pid) => playerOps(battle, pid, { fieldOnly: true });
var DEVOUR_TAG = "bond:egir:devour";
var BY_KEY = {
  // 阿米娅 众志合一
  act1autochess_band2_buff(battle, ps, p, bandId) {
    const n = activeBondIds(battle, ps.playerId).length;
    let atk = 0, hp = 0;
    for (let i = 1; i <= 9 && p[`value_${i}`] != null; i++) {
      if (n >= num5(p[`value_${i}`], Infinity)) {
        atk = num5(p[`atk_${i}`]);
        hp = num5(p[`max_hp_${i}`]);
      }
    }
    if (!(atk > 0 || hp > 0)) return;
    const mods = directMods({ atk, hp });
    for (const u of playerOps(battle, ps.playerId)) passiveBuff(battle, u, keyOf2(bandId), mods);
  },
  // 埃芒加德 命结之秘
  act1autochess_band28_buff(battle, ps, p, bandId) {
    const max = Math.floor(num5(p.max_respawn_cnt, 3));
    if (!(max > 0)) return;
    let used = 0;
    battle.on("death", (c) => {
      const u = c.unit;
      if (used >= max || !isOp(u) || u.ownerId !== ps.playerId || !reviveNow(battle, c, "band")) return;
      used++;
      fxOn(battle, "revive", u, keyOf2(bandId), bandId, { left: max - used });
    }, { priority: PRIO_BAND_REVIVE });
  },
  // 克莱门莎 崇高牺牲: PRTS requires the 阿戈尔 bond to be active.
  act1autochess_band13_buff(battle, ps, p, bandId) {
    const bond = typeof p.bond_id === "string" && p.bond_id ? p.bond_id : null;
    if (!bond) return;
    const byLevel = p.bond_add_type == null || p.bond_add_type === "by_charlevel";
    battle.on("death", (c) => {
      const u = c.unit;
      if (c.reason !== "killed" || !isOp(u) || u.ownerId !== ps.playerId || !unitBonds(u).includes(bond)) return;
      const n = byLevel ? tierOf(u) : Math.max(1, Math.floor(num5(p.value, 1)));
      if (gainLayers(battle, { playerId: ps.playerId, bonds: bond, n, requireActive: true, source: u, reason: "band" }) > 0) {
        fxOn(battle, "layer", u, keyOf2(bandId), bandId, { bond, n });
      }
    });
  },
  // 大帝 加急调派
  act1autochess_band16_buff(battle, ps, p, bandId) {
    const mul = Math.max(0, 1 + num5(p.respawn_time, 0));
    if (mul === 1) return;
    const key = keyOf2(bandId);
    battle.on("deploy", (c) => {
      const u = c.unit;
      if (!isOp(u) || u.ownerId !== ps.playerId) return;
      battle.addBuff(u, { key, mods: { redeployMul: mul }, refresh: "stack", stacks: 1, maxStacks: Infinity, persist: true, allowDead: true });
    });
  },
  // 桑葚 药枚实验
  act1autochess_band17_buff(battle, ps, p, bandId) {
    const pr = num5(p.prob);
    if (!(pr > 0)) return;
    const key = keyOf2(bandId, "shield");
    const chosen = /* @__PURE__ */ new Set();
    battle.on("battleStart", () => {
      const units = battle.allies(ps.playerId);
      const boardCol = (u) => ps.mirror ? -u.tileC : u.tileC;
      let front = -Infinity;
      for (const u of units) front = Math.max(front, boardCol(u));
      for (const u of units) if (boardCol(u) === front) chosen.add(u);
    });
    battle.on("attack", (c) => {
      const u = c.attacker;
      if (!chosen.has(u) || !u.alive) return;
      if (!(pr >= 1 || battle.rng() < pr)) return;
      if (addShieldLayer(battle, u, key, 1)) fxOn(battle, "shield", u, keyOf2(bandId), bandId);
    });
  },
  // 休谟斯 回收利用 ("地面干员技能结束时…": a melee-position operator on any tile — support isGroundOp)
  act1autochess_band18_buff(battle, ps, p, bandId) {
    const sp = num5(p.sp);
    if (!(sp > 0)) return;
    battle.on("skillEnd", (c) => {
      const u = c.unit;
      if (!isOp(u) || u.ownerId !== ps.playerId || c.reason === "death" || !onField(u) || !isGroundOp(u)) return;
      const cands = alliesAround(battle, u, N4).filter((a) => a.kind === "op" && a.skill && !a.skill.noSkill && a.skill.kind !== "passive");
      const t = cands.length ? battle.rng.pick(cands) : null;
      if (!t) return;
      t.skill.gainSp(sp, "band");
      fxOn(battle, "spGain", t, keyOf2(bandId), bandId, { n: sp, from: u.id });
    });
  },
  // 卡莱莎 食腐之蝶
  act1autochess_band15_buff(battle, ps, p, bandId) {
    const step = num5(p.atk);
    const cap = Math.max(1, Math.floor(num5(p.max_stack_cnt, 10)));
    if (!(step > 0)) return;
    const key = keyOf2(bandId);
    battle.on("death", (c) => {
      const d = c.unit;
      if (c.reason !== "killed" || !isOp(d) || d.ownerId !== ps.playerId) return;
      for (const a of battle.allies(ps.playerId)) {
        if (a === d) continue;
        const cur = a.findBuff(key);
        const n = Math.min(cap, (cur && cur.data ? cur.data.n : 0) + 1);
        battle.addBuff(a, { key, mods: directMods({ atk: step * n }), refresh: "replace", data: { n }, visible: true });
      }
    });
  },
  // 陈 以己之长
  act1autochess_band19_buff(battle, ps) {
    battle.on("hit", (c) => {
      const s = c.source;
      if (!isOp(s) || s.ownerId !== ps.playerId || !c.target || c.target.side !== "enemy") return;
      weaknessRetype(c.dmg, s, c.target);
    }, { priority: 5 });
  },
  // 夕 墨色真颜
  act2autochess_band12_buff(battle, ps, p, bandId) {
    const atk = num5(p.atk);
    if (!atk) return;
    battle.on("battleStart", () => {
      const groups = /* @__PURE__ */ new Map();
      for (const u of deployedOps(battle, ps.playerId)) {
        const b = baseChessId(u);
        if (!groups.has(b)) groups.set(b, []);
        groups.get(b).push(u);
      }
      for (const list of groups.values()) {
        if (list.length < 2) continue;
        for (const u of list) passiveBuff(battle, u, keyOf2(bandId), directMods({ atk }));
      }
    });
  },
  // 伊奥莱塔 统御号令
  act2autochess_band3_buff(battle, ps, p, bandId) {
    const a = num5(p.atk_per_cnt), h = num5(p.max_hp_per_cnt);
    if (!(a > 0 || h > 0)) return;
    battle.on("battleStart", () => {
      const elites = deployedOps(battle, ps.playerId).filter(isElite);
      const n = elites.length;
      if (!n) return;
      const mods = directMods({ atk: a * n, hp: h * n });
      for (const u of elites) passiveBuff(battle, u, keyOf2(bandId), mods);
    });
  },
  // 鲲 化鲲为鹏（只因）
  //
  // 阿戈尔's devour (bonds/core.js devour: the 5-tier bond's battle-start pass) knocks operators out with a 5000 物理流失
  // whose DamageInfo carries DEVOUR_TAG. The band counts those knock-outs and, on the one that reaches devour_count, (a)
  // revives every one of them in place and (b) makes the 阿戈尔 the devour credits with that knock-out take off.
  //
  // The count hangs on the `damaged` event, never on the `devour` fx: the fx fires for every mark the pass RESOLVES,
  // before the loss lands — a marked unit that survives it (HP, a 战斗中的 不死 …), or one whose remaining marks are
  // cancelled once it is knocked out, is no knock-out (bonds/core.js devour). The damage tag is visible nowhere else:
  // the `death` event carries `{ unit, reason, killer }` only, and the killer alone cannot tell the devour from an
  // attack or a skill of the same 阿戈尔. Lethality is read off `target.hp` in `damaged` (applyHpLoss clamps it to 0
  // before the event and the `kill` follows): every `fatal` saver — items (PRIO_REVIVE / PRIO_RESPAWN), kits, 埃芒加德's
  // band (PRIO_BAND_REVIVE) — has already run and left a saved unit at HP ≥ 1, so a saved unit is never counted.
  // The revive is bond:indomShip's "立刻重新部署" (its own comment: 令受益者下次部署的再部署时间和费用归零), i.e. an immediate
  // `battle.redeploy(u, { free })` on the unit's rest tile — where it fell (Battle.restTile) — so it IS a new deployment
  // (deploySeq++, `deploy { initial: false }`, full HP, SP reset), which is also what opens a new deployment for
  // 坚固维式重锤's lock; `revivedInPlace` (M3茧甲 / 埃芒加德, an in-place 复活 that never leaves the field) is not used
  // here. Down units another mechanism has already picked up are left alone (the hook runs after 阿戈尔 5's own
  // 立刻复活, priority 11, and 不屈's, 10 — the file's convention, 埃芒加德's PRIO_BAND_REVIVE) and the devour's own
  // cancellation rule keeps a revived member's pending marks from knocking it out again.
  // 该【阿戈尔】干员 = the marker `death` credits with the knock-out that reaches the count (bonds/core.js devour:
  // "击杀来源始终为对应标记的付与来源"), not every 阿戈尔 that ate something [ASSUMED: the text names one]. Its 起飞 is the
  // tier2.js LIFTOFF_FLAGS pair on a persisted buff — `liftoff` drops the ground block (Battle._blockerFor; a ground
  // enemy already held lets go, ai.js updateEnemy) and adds 对地规避 (targeting.js evadesGround, the official 起飞 term),
  // `blockFly` is what lets it block air units instead (the unit stays a 地面单位 on its tile). "可同时攻击地面与空中的
  // 敌人" has no buff flag: the attack profile is resolved per unit at setup (professions.resolveProfile — a melee 阿戈尔
  // has canHitFly false, a 要塞 / 炮手 is groundOnly), so the band retypes the live profile (tier5.js replaces profiles
  // the same way).
  // Once per battle, on the knock-out that REACHES the count ("达到3名时"): the count keeps growing afterwards, but the
  // band neither revives nor takes off again — a later devour knock-out stays down [ASSUMED: 本次 = the knock-outs the
  // trigger counted]. The band names no 我方 and the devour itself has no own-side limit (a teammate's operator in front
  // is devoured like an own one): the count, the revive and the take-off follow the devour, whatever the owner.
  MOD_band_kun(battle, ps, p, bandId) {
    const need = Math.max(1, Math.floor(num5(p.devour_count, 3)));
    const free = !(num5(p.revive_redeploy_cost, 0) > 0);
    const flags = {};
    if (num5(p.liftoff, 0) > 0) flags.liftoff = true;
    if (num5(p.block_fly, 0) > 0) flags.blockFly = true;
    const hitFly = num5(p.hit_fly, 0) > 0;
    const pending = /* @__PURE__ */ new Set();
    const downed = [];
    let fired = false;
    battle.on("damaged", (c) => {
      const t = c.target;
      if (fired || !t || t.side !== "ally" || t.kind !== "op" || !t.alive || t.hp > 0) return;
      const dmg = c.dmg;
      if (!dmg || !Array.isArray(dmg.tags) || !dmg.tags.includes(DEVOUR_TAG)) return;
      pending.add(t);
    });
    battle.on("death", (c) => {
      const u = c.unit;
      if (c.reason !== "killed" || !pending.delete(u) || fired) return;
      downed.push({ unit: u, by: c.killer });
      if (downed.length < need) return;
      fired = true;
      for (const d of downed) {
        if (d.unit.alive || d.unit.removed) continue;
        if (!battle.redeploy(d.unit, { free })) continue;
        fxOn(battle, "revive", d.unit, keyOf2(bandId), bandId);
      }
      const by = downed[downed.length - 1].by;
      if (!by || !isOp(by)) return;
      if (flags.liftoff || flags.blockFly) {
        passiveBuff(battle, by, keyOf2(bandId, "liftoff"), null, { flags, visible: true });
        fxOn(battle, "takeoffKun", by, keyOf2(bandId, "liftoff"), bandId);
      }
      if (hitFly) {
        by.profile.canHitFly = true;
        by.profile.groundOnly = false;
      }
    });
  }
};
var BATTLE_BUFF_KEYS = Object.freeze([...Object.keys(BY_KEY), "auto_chess_change_map"]);
function install2(battle) {
  for (const ps of battle.players) {
    const band = ps.bandId === "band_x_marisa_kun" ? bandRecord(ps.bandId) : null;
    if (!band) continue;
    for (const b of buffsOf(band)) {
      const f = b.bbKey ? BY_KEY[b.bbKey] : null;
      if (!f) continue;
      try {
        f(battle, ps, b.p, ps.bandId);
      } catch (e) {
        battle._handlerError?.(`band:${ps.bandId}`, null, e);
      }
    }
  }
}

// mods/marisa-native/source/server/sim/content/garrisons/battle.js
var ids = (s) => String(s ?? "").split(",").map((x) => x.trim()).filter(Boolean);
var EMPTY2 = Object.freeze([]);
var AB_FLAG_STATUS = Object.freeze({ 16: "freeze" });
function garrisonIdsOf(u) {
  const list = u?.def?.raw?.garrisonIds ?? u?.def?.garrisonIds;
  return Array.isArray(list) ? list : EMPTY2;
}
function install3(battle) {
  const all = [];
  const owned = /* @__PURE__ */ new Map();
  const add = (unit, g, grantedBy = null) => {
    let set = owned.get(unit);
    if (!set) {
      set = /* @__PURE__ */ new Set();
      owned.set(unit, set);
    }
    if (set.has(g.garrisonId)) return null;
    set.add(g.garrisonId);
    const bb = g.bb || {};
    const cap = num5(bb.max_add_count_per_battle, 0) > 0 ? num5(bb.max_add_count_per_battle) : Infinity;
    const it = {
      // The battle rune of the record (bbStr.key, e.g. the MOD_TRIGGER_* of the MOD chess, DATA §4) wins over the
      // generic effectKey: it is what selects the handler, while effectKey stays the data's coarse family
      // (act1autochess_gar_event_selfdead covers every MOD_TRIGGER_* record).
      unit,
      g,
      gid: g.garrisonId,
      key: g.bbStr && g.bbStr.key || g.effectKey,
      bb,
      bbStr: g.bbStr || {},
      grantedBy,
      cap,
      capKey: `gar:${g.garrisonId}:${unit.id}`,
      cnt: 0,
      k: -1
    };
    all.push(it);
    return it;
  };
  for (const u of battle.allyUnits) {
    if (!isOp(u)) continue;
    for (const gid of garrisonIdsOf(u)) {
      const g = garrisonRecord(gid);
      if (g && g.scriptHandler && g.eventType === "IN_BATTLE") add(u, g);
    }
  }
  if (!all.length) return;
  const grants = [];
  for (const it of all.slice()) {
    if (it.key !== "ADD_BOND") continue;
    const g2 = garrisonRecord(it.bbStr.give_garrison_id);
    if (!g2 || g2.eventType !== "IN_BATTLE") continue;
    for (const t of grantTargets(battle, it)) {
      const got = add(t, g2, it);
      if (got) grants.push(got);
    }
  }
  const by = /* @__PURE__ */ new Map();
  for (const it of all) {
    let arr = by.get(it.key);
    if (!arr) {
      arr = [];
      by.set(it.key, arr);
    }
    arr.push(it);
  }
  for (const [key, list] of by) {
    const inst = INSTALLERS[key];
    if (inst) inst(battle, list);
  }
  installHitMods(battle, by);
  installReaders(battle, by);
  if (grants.length) {
    battle.on("battleStart", () => {
      for (const it of grants) fxOn(battle, "garrisonGrant", it.unit, `gar:${it.grantedBy.gid}`, it.gid, { from: it.grantedBy.unit.id });
    });
  }
}
function opsOf(battle, pid) {
  const out = [];
  for (const u of battle.allyUnits) if (isOp(u) && u.ownerId === pid && !u.removed) out.push(u);
  return out;
}
function opAtHome(battle, pid, r, c) {
  for (const u of battle.allyUnits) if (isOp(u) && u.ownerId === pid && !u.removed && u.homeR === r && u.homeC === c) return u;
  return null;
}
function grantTargets(battle, it) {
  const u = it.unit;
  const desc = it.g.desc || "";
  const need = it.bbStr.check_bond_id || null;
  const ok = (t) => !!t && (!need || isMember(battle, t, need));
  const front = () => {
    const [fr, fc] = frontOf(u.homeR, u.homeC, u.dir);
    return opAtHome(battle, u.ownerId, fr, fc);
  };
  if (desc.includes("\u6240\u6709")) return opsOf(battle, u.ownerId).filter(ok);
  if (desc.includes("\u540C\u4E00\u884C\u6700\u53F3\u8FB9")) {
    let best = null;
    for (const t of opsOf(battle, u.ownerId)) {
      if (t.homeR !== u.homeR) continue;
      const col = (x) => x.player && x.player.mirror ? -x.homeC : x.homeC;
      if (!best || col(t) > col(best)) best = t;
    }
    return ok(best) ? [best] : [];
  }
  const out = [];
  if (desc.includes("\u81EA\u8EAB\u548C\u8EAB\u524D") && ok(u)) out.push(u);
  const f = front();
  if (ok(f)) out.push(f);
  return out;
}
function targetBonds(battle, it) {
  const u = it.unit;
  switch (it.bbStr.bond_type) {
    case "bond_self":
      return unitBonds(u).filter((b) => bondActive(battle, u.ownerId, b));
    case "bond_actived_maxstack": {
      const b = topActiveBond(battle, u.ownerId);
      return b ? [b] : EMPTY2;
    }
    default:
      return ids(it.bbStr.bond_id);
  }
}
function amountOf(battle, it) {
  const bb = it.bb;
  switch (it.bbStr.bond_add_type) {
    case "by_charcount_samerow":
      return rowMates(battle, it.unit).length * num5(bb.bond_add_count_multi, num5(bb.bond_add_count, 1));
    case "by_charlevel":
      return tierOf(it.unit) * num5(bb.bond_add_count, 1);
    default:
      return num5(bb.bond_add_count, 0);
  }
}
function conditionMet(battle, it) {
  const ck = it.bbStr.conditionkey;
  const need = num5(it.bb.check_count, 0);
  if (ck === "character_same_row") return rowMates(battle, it.unit).length >= need;
  if (ck === "character_same_col") {
    let n = 0;
    for (const a of battle.allyUnits) if (isOp(a) && a.ownerId === it.unit.ownerId && onField(a) && a.tileC === it.unit.tileC) n++;
    return n >= need;
  }
  return true;
}
function capOf(battle, it) {
  const bondId = it.bb.cap_by_bond;
  if (!bondId) return it.cap;
  const elite = !!(it.unit.def && it.unit.def.raw && it.unit.def.raw.isGolden);
  const min = elite ? num5(it.bb.cap_min_elite, num5(it.bb.cap_min, 3)) : num5(it.bb.cap_min, 3);
  return Math.max(min, bondMembers(battle, it.unit.ownerId, bondId, { fieldOnly: true }).length);
}
function fireGain(battle, it) {
  if (!conditionMet(battle, it)) return 0;
  const bonds = targetBonds(battle, it);
  if (!bonds.length) return 0;
  let n = amountOf(battle, it);
  const whole = it.bbStr.bond_type === "bond_actived_maxstack" && Number.isFinite(it.cap);
  if (whole) {
    n = Math.min(Math.floor(n), Math.max(0, Math.floor(it.cap) - (it.wholeUsed ?? 0)));
    if (!(n > 0)) return 0;
  }
  const added = gainLayers(battle, {
    playerId: it.unit.ownerId,
    bonds,
    n,
    requireActive: true,
    source: it.unit,
    reason: "garrison",
    cap: whole ? Infinity : capOf(battle, it),
    capKey: whole ? null : it.capKey
  });
  if (whole && added > 0) it.wholeUsed = (it.wholeUsed ?? 0) + n;
  if (added > 0) fxOn(battle, "garrison", it.unit, `gar:${it.gid}`, it.key, { n: added });
  return added;
}
var byUnit = (list) => {
  const m = /* @__PURE__ */ new Map();
  for (const it of list) {
    let a = m.get(it.unit);
    if (!a) {
      a = [];
      m.set(it.unit, a);
    }
    a.push(it);
  }
  return m;
};
function isFrontOf(holder, u) {
  if (!u || u === holder || u.ownerId !== holder.ownerId || !onField(u)) return false;
  const [fr, fc] = frontOf(holder.tileR, holder.tileC, holder.dir);
  return u.tileR === fr && u.tileC === fc;
}
function sourceInFront(holder, u, tile) {
  if (!u || u === holder || u.ownerId !== holder.ownerId || !isOp(u) || !Array.isArray(tile)) return false;
  const [fr, fc] = frontOf(holder.tileR, holder.tileC, holder.dir);
  return tile[0] === fr && tile[1] === fc;
}
function ammoScope(it, u) {
  const h = it.unit;
  switch (it.bbStr.range_id) {
    case "1-1":
      return onField(h) && isFrontOf(h, u);
    case "x-5":
      return u === h || onField(h) && onField(u) && u.ownerId === h.ownerId && isOp(u) && Math.abs(u.tileR - h.tileR) + Math.abs(u.tileC - h.tileC) === 1;
    default:
      return u === h;
  }
}
function altSkillsOf(u) {
  const m = u.kit?.skills;
  return m && typeof m === "object" ? m : null;
}
function levitateCast(u, skill) {
  if (specAppliesLevitate(skill?.spec)) return true;
  const id = skill?.id;
  return !!(id && specAppliesLevitate(altSkillsOf(u)?.[id]));
}
function specAppliesLevitate(spec) {
  return !!(spec && (spec.levitate === true || spec.flags && spec.flags.levitate));
}
var INSTALLERS = {
  act1autochess_gar_event_useskill(battle, list) {
    const m = byUnit(list);
    battle.on("skillStart", ({ unit }) => {
      const arr = m.get(unit);
      if (arr) for (const it of arr) fireGain(battle, it);
    });
  },
  act1autochess_gar_event_selfkillenemy(battle, list) {
    const m = byUnit(list);
    for (const it of list) it.allies = /我方干员/.test(it.g.desc || "");
    battle.on("kill", ({ killer, victim }) => {
      const arr = killer ? m.get(killer) : null;
      if (!arr || !victim) return;
      for (const it of arr) {
        if (!(victim.side === "enemy" || it.allies && victim.side === "ally" && victim.kind === "op")) continue;
        it.cnt++;
        if (it.cnt % Math.max(1, num5(it.bb.check_cnt, 1)) === 0) fireGain(battle, it);
      }
    });
  },
  act1autochess_gar_event_selfdead(battle, list) {
    const m = byUnit(list);
    battle.on("death", ({ unit, reason }) => {
      if (reason !== "killed") return;
      const arr = m.get(unit);
      if (arr) for (const it of arr) fireGain(battle, it);
    });
    const swaps = list.filter((it) => /替身/.test(it.g.desc || ""));
    if (!swaps.length) return;
    for (const it of swaps) it.doll = false;
    battle.on("tick", () => {
      for (let i = 0; i < swaps.length; i++) {
        const it = swaps[i];
        const u = it.unit;
        const doll = !!(u.trait && u.trait.doll);
        if (doll === it.doll) continue;
        it.doll = doll;
        if (u.alive && u.deployed) fireGain(battle, it);
      }
    });
  },
  act1autochess_gar_event_consume_ammo(battle, list) {
    battle.on("ammoUsed", ({ unit }) => {
      if (!unit) return;
      for (let i = 0; i < list.length; i++) {
        const it = list[i];
        if (!ammoScope(it, unit)) continue;
        it.cnt++;
        if (it.cnt % Math.max(1, num5(it.bb.consume_count, 1)) === 0) fireGain(battle, it);
      }
    });
  },
  act1autochess_gar_event_enemy_abflag_inrange(battle, list) {
    const watched = new Set(list.map((it) => AB_FLAG_STATUS[num5(it.bb.check_ab_flag, 16)] ?? "freeze"));
    battle.on("statusApplied", ({ target, status, entered }) => {
      if (!target || !watched.has(status) || !entered || target.side !== "enemy") return;
      for (const it of list) {
        if (status !== (AB_FLAG_STATUS[num5(it.bb.check_ab_flag, 16)] ?? "freeze")) continue;
        if (!onField(it.unit) || !inRange(it.unit, target)) continue;
        if (battle.rng() < num5(it.bb.prob, 1)) fireGain(battle, it);
      }
    });
  },
  act2autochess_gar_event_onstart(battle, list) {
    const m = byUnit(list);
    battle.on("deploy", ({ unit }) => {
      const arr = m.get(unit);
      if (arr) for (const it of arr) fireGain(battle, it);
    });
    const farTooth = byUnit(list.filter((it) => it.gid === "garrison_108_a" || it.gid === "garrison_108_b"));
    if (farTooth.size) battle.on("dollSwap", ({ unit }) => {
      const arr = farTooth.get(unit);
      if (arr) for (const it of arr) fireGain(battle, it);
    });
  },
  act2autochess_gar_event_allyenemy_sleepstun_inrange(battle, list) {
    battle.on("statusApplied", ({ target, status, entered }) => {
      if (!target || status !== "sleep" && status !== "stun" || !entered) return;
      if (!(target.side === "enemy" || target.side === "ally" && target.kind === "op")) return;
      for (const it of list) if (onField(it.unit) && inRange(it.unit, target)) fireGain(battle, it);
    });
  },
  /**
   * 予愿安洁莉娜 "己方任意干员起飞时（含自身），使已激活的【叙拉古】【迅捷】层数各+1": 起飞 is the skill flag
   * `liftoff` of the airborne allies (蒂比 / 予愿安洁莉娜's skills, gamedata_const ba.liftoff) — the engine has no 起飞
   * event, the flag is read off `u.s.flags.liftoff` and polled here: a false → true change is one take-off (the take-off
   * of a unit already listed at install time counts too: previous = false).
   */
  MOD_TRIGGER_ally_liftoff(battle, list) {
    const prev = /* @__PURE__ */ new Map();
    battle.on("tick", () => {
      for (const u of battle.allyUnits) {
        const air = !!(u.s.flags.liftoff && u.alive && u.deployed);
        if (air === (prev.get(u) ?? false)) continue;
        prev.set(u, air);
        if (air) for (const it of list) fireGain(battle, it);
      }
    });
  },
  /**
   * 予愿安洁莉娜 "每次释放可施加浮空的技能时，使已激活的【远见】层数+1": the cast itself is the trigger (skillStart),
   * the condition is that the cast skill can apply 浮空. A kit declares that with the skill flag `levitate` on the spec
   * (tier3 予愿安洁莉娜 S2 重力自定义) — the same spec-flag route as 起飞. The keys are marked so that a skill spec of
   * the very chess carrying the garrison (its own take-off flag) can never satisfy the check by accident.
   */
  MOD_TRIGGER_levitate_skill_cast(battle, list) {
    const m = byUnit(list);
    battle.on("skillStart", ({ unit, skill }) => {
      const arr = m.get(unit);
      if (!arr || !levitateCast(unit, skill)) return;
      for (const it of arr) if (onField(it.unit)) fireGain(battle, it);
    });
  },
  act1autochess_gar_event_addition_cnt(battle, list) {
    battle.on("layerGain", (ctx) => {
      if (ctx.reason !== "garrison" || !ctx.source) return;
      for (const it of list) {
        const h = it.unit;
        if (h.ownerId !== ctx.playerId || !onField(h)) continue;
        if (it.bbStr.range_id && it.bbStr.range_id !== "1-1") continue;
        if (sourceInFront(h, ctx.source, ctx.tile)) ctx.n += num5(it.bb.extra_cnt, 0);
      }
    });
  },
  GAIN_BUFF(battle, list) {
    for (const it of list) {
      const mods = {};
      if (num5(it.bb.atk, 0) > 0) mods.atkMul = num5(it.bb.atk);
      if (num5(it.bb.max_hp, 0) > 0) mods.hpMul = num5(it.bb.max_hp);
      if (num5(it.bb.def, 0) > 0) mods.defMul = num5(it.bb.def);
      passiveBuff(battle, it.unit, `gar:${it.gid}`, mods);
    }
  },
  attr_common_global_buff(battle, list) {
    for (const it of list) {
      const mods = {};
      if (num5(it.bb.sp_recovery_per_sec, 0)) mods.spRecoveryFlat = num5(it.bb.sp_recovery_per_sec);
      Object.assign(mods, directMods({ atk: num5(it.bb.atk, 0), hp: num5(it.bb.max_hp, 0) }));
      if (num5(it.bb.attack_speed, 0)) mods.aspd = num5(it.bb.attack_speed);
      passiveBuff(battle, it.unit, `gar:${it.gid}`, mods);
    }
  },
  // grants are resolved in install(); 风丸's rule lives in the prep economy
  ADD_BOND() {
  },
  NONE() {
  }
};
var READERS = /* @__PURE__ */ new Set([
  "act1autochess_gar_eff_attrByBond",
  "act1autochess_gar_eff_respawnTimeByBond",
  "act2autochess_gar_eff_attrByBond_add_onstart",
  "act2autochess_gar_eff_ab_damageScaleByBond"
]);
function stepsOf(battle, it) {
  const div = Math.max(1, num5(it.bb.divide_num, 1));
  let sum = 0;
  for (const b of it.bonds ?? (it.bonds = ids(it.bbStr.bond_id))) if (bondActive(battle, it.unit.ownerId, b)) sum += bondLayers(battle, it.unit.ownerId, b);
  return Math.floor(sum / div);
}
function attrMods(bb, k) {
  const m = directMods({ atk: num5(bb.atk, 0) * k, hp: num5(bb.max_hp, 0) * k, def: num5(bb.def, 0) * k });
  if (num5(bb.attack_speed, 0)) m.aspd = num5(bb.attack_speed) * k;
  if (num5(bb.hp_recovery_per_sec, 0)) m.hpRegen = num5(bb.hp_recovery_per_sec) * k;
  if (num5(bb.sp_recovery_per_sec, 0)) m.spRecoveryFlat = num5(bb.sp_recovery_per_sec) * k;
  return m;
}
function applyReader(battle, it) {
  const k = stepsOf(battle, it);
  if (k === it.k) return;
  it.k = k;
  const u = it.unit;
  const key = `gar:${it.gid}`;
  switch (it.key) {
    case "act1autochess_gar_eff_attrByBond":
      if (k > 0) passiveBuff(battle, u, key, attrMods(it.bb, k));
      else battle.removeBuff(u, key);
      break;
    case "act1autochess_gar_eff_respawnTimeByBond":
      if (k > 0) passiveBuff(battle, u, key, { redeployMul: Math.max(0, 1 + num5(it.bb.respawn_time, 0) * k) });
      else battle.removeBuff(u, key);
      break;
    case "act2autochess_gar_eff_attrByBond_add_onstart": {
      const b = u.findBuff(key);
      if (b && b.timeLeft > 0) onstartBuff(battle, it, b.timeLeft);
      break;
    }
    default:
      break;
  }
}
function onstartBuff(battle, it, duration) {
  const k = Math.max(0, it.k);
  const key = `gar:${it.gid}`;
  if (!(k > 0) || !(duration > 0)) {
    battle.removeBuff(it.unit, key);
    return;
  }
  battle.addBuff(it.unit, { key, duration, refresh: "replace", mods: { atkFlat: num5(it.bb.atk, 0) * k, hpFlat: num5(it.bb.max_hp, 0) * k } });
}
function installReaders(battle, by) {
  const list = [];
  for (const key of READERS) for (const it of by.get(key) ?? EMPTY2) list.push(it);
  if (!list.length) return;
  const recompute = () => {
    for (const it of list) applyReader(battle, it);
  };
  recompute();
  let pending = false;
  battle.on("layerGain", () => {
    if (pending) return;
    pending = true;
    battle.after(0, () => {
      pending = false;
      recompute();
    });
  });
  const onstart = by.get("act2autochess_gar_eff_attrByBond_add_onstart");
  if (onstart) {
    const m = byUnit(onstart);
    battle.on("deploy", ({ unit }) => {
      const arr = m.get(unit);
      if (!arr) return;
      for (const it of arr) {
        it.k = stepsOf(battle, it);
        onstartBuff(battle, it, num5(it.bb.duration, 0));
      }
    });
  }
}
function weaknessType(source, target, dmg) {
  const ss = source && source.s ? source.s : null;
  const ign = {
    defIgnorePct: num5(dmg.defIgnorePct, 0) + (ss ? num5(ss.defIgnorePct, 0) : 0),
    defIgnoreFlat: num5(dmg.defIgnoreFlat, 0) + (ss ? num5(ss.defIgnoreFlat, 0) : 0),
    resIgnorePct: num5(dmg.resIgnorePct, 0) + (ss ? num5(ss.resIgnorePct, 0) : 0),
    resIgnoreFlat: num5(dmg.resIgnoreFlat, 0) + (ss ? num5(ss.resIgnoreFlat, 0) : 0)
  };
  const ph = mitigate(dmg.amount, "phys", target.s, ign) * (ss ? num5(ss.physDealtMul, 1) : 1) * num5(target.s.physTakenMul, 1);
  const ar = mitigate(dmg.amount, "arts", target.s, ign) * (ss ? num5(ss.artsDealtMul, 1) : 1) * num5(target.s.artsTakenMul, 1);
  if (ar > ph + 1e-9) return "arts";
  if (ph > ar + 1e-9) return "phys";
  return dmg.type;
}
var bound = (t) => !!(t.s && t.s.flags && t.s.flags.bind) || !!t.findBuff("bind");
var WEAKNESS_PRIORITY = -10;
function installHitMods(battle, by) {
  const m = /* @__PURE__ */ new Map();
  const push = (it, kind) => {
    let a = m.get(it.unit);
    if (!a) {
      a = [];
      m.set(it.unit, a);
    }
    a.push({ it, kind });
  };
  for (const it of by.get("act1autochess_gar_eff_attack_enemy") ?? EMPTY2) push(it, "tag");
  for (const it of by.get("act2autochess_gar_eff_ab_damageScaleByBond") ?? EMPTY2) push(it, "ab");
  if (m.size) {
    battle.on("hit", ({ source, target, dmg }) => {
      const arr = source ? m.get(source) : null;
      if (!arr || !target || target.side !== "enemy" || !dmg || dmg.type === "element") return;
      for (let i = 0; i < arr.length; i++) {
        const { it, kind } = arr[i];
        if (kind === "tag") {
          if (Array.isArray(dmg.tags) && dmg.tags.includes("dot")) continue;
          const tags = target.def && target.def.tags;
          if (Array.isArray(tags) && tags.includes(it.bbStr.check_tag)) dmg.amount *= num5(it.bb.atk, 1);
        } else if (it.k > 0) {
          const hit = num5(it.bb.check_ab_flag, 0) && bound(target) || num5(it.bb.check_sluggish, 0) && !!target.findBuff("sluggish");
          if (hit) dmg.mul = num5(dmg.mul, 1) * (1 + num5(it.bb.damage_scale_per_stack, 0) * it.k);
        }
      }
    });
  }
  const chaos = new Set((by.get("act1autochess_gar_eff_chaos") ?? EMPTY2).map((it) => it.unit));
  if (chaos.size) {
    battle.on("hit", ({ source, target, dmg }) => {
      if (!source || !chaos.has(source) || !target || target.side !== "enemy" || !dmg) return;
      if (dmg.type === "phys" || dmg.type === "arts") dmg.type = weaknessType(source, target, dmg);
    }, { priority: WEAKNESS_PRIORITY });
  }
}

// mods/marisa-native/source/server/match/board.js
var FIELD = GEO.FIELD;
var tileKey2 = (r, c) => `${r},${c}`;
var pieceDir = (piece) => piece && isDir(piece.dir) ? piece.dir : DEFAULT_DIR;
var DEPLOY_FIELDS = Object.freeze(["normal", "bossL", "bossR"]);
var BOARD_ROWS_ABOVE_BOSS = -BOSS_ROW_OFFSET;
var BOSS_MIRROR_COL = COLS - 1;

// mods/marisa-native/source/server/match/bondsMeta.js
var pieceBonds = (gd, p) => gd.pieceBonds(p.uid);

// mods/marisa-native/source/server/match/rhodeMeta.js
var RHODE_BOND = "bond_x_marisa_rhodeShip";
var num8 = (v, d = 0) => typeof v === "number" && Number.isFinite(v) ? v : d;
function rhodeBb(gd) {
  const bond = gd && typeof gd.bond === "function" ? gd.bond(RHODE_BOND) : null;
  return bond && bond.bb || {};
}
function isRhodePiece(gd, piece) {
  return !!piece && piece.kind === "chess" && pieceBonds(gd, piece).includes(RHODE_BOND);
}
function rhodeBoardMembers(gd, ps) {
  const seen = /* @__PURE__ */ new Set();
  for (const p of ps.board.values()) {
    if (!isRhodePiece(gd, p)) continue;
    seen.add(gd.baseIdOf(p.id));
  }
  return seen;
}
function rhodePrepEff(gd, ps) {
  const bb = rhodeBb(gd);
  if (!ps.bonds || !ps.bonds[RHODE_BOND] || !ps.bonds[RHODE_BOND].active) return 0;
  return rhodeEffOf2(bb, rhodeBoardMembers(gd, ps).size);
}
function rhodeEffOf2(bb, count) {
  const b = bb || {};
  const n = Math.max(0, num8(count, 0));
  const min = num8(b.field_eff_member_min, 0);
  if (min > 0) return n >= min ? num8(b.field_eff_max, 1) : num8(b.field_eff_low, 0.5);
  return Math.min(num8(b.field_eff_max, 1), Math.max(0, num8(b.field_eff_per_member, 0.25) * n));
}
function rhodePrepLayerCap(ps, over = null) {
  let cap = 0;
  for (const [bondId, b] of Object.entries(ps.bonds || {})) {
    if (bondId === RHODE_BOND || !b || !b.active) continue;
    cap = Math.max(cap, num8(b.layers, 0));
  }
  if (over && over.bondId && over.bondId !== RHODE_BOND) cap = Math.max(cap, num8(over.layers, 0));
  return cap;
}
function rangeKeysOf(ps, piece) {
  return ps.rangeKeys(piece.uid);
}
function addPrepGain(gd, ps, ev) {
  const { bondId } = ev;
  if (!bondId || bondId === RHODE_BOND) return 0;
  if (!ps.bonds || !ps.bonds[RHODE_BOND] || !ps.bonds[RHODE_BOND].active) return 0;
  const n = Math.floor(num8(ev.n, 0));
  if (!(n > 0)) return 0;
  const loc = resolveSource(ps, ev.source);
  if (!loc || loc.area !== "board" || loc.piece.kind !== "chess") return 0;
  if (isRhodePiece(gd, loc.piece)) return 0;
  let covered = false;
  for (const [key, m] of ps.board) {
    if (!isRhodePiece(gd, m)) continue;
    if (rangeKeysOf(ps, m, key.split(",").map(Number), pieceDir(m)).has(tileKey2(loc.row, loc.col))) {
      covered = true;
      break;
    }
  }
  if (!covered) return 0;
  const eff = rhodePrepEff(gd, ps);
  const cap = ev.caps != null ? num8(ev.caps, 0) : rhodePrepLayerCap(ps, { bondId, layers: num8(ps.layers && ps.layers[bondId], 0) });
  const want = num8(ps.rhodePrepAcc, 0) + num8(ps.rhodePrepFrac, 0) + n * eff;
  const total = Math.min(want, cap);
  const add = Math.floor(total + 1e-9);
  ps.rhodePrepAcc = add;
  ps.rhodePrepFrac = total - add;
  ps.dirty();
  return add;
}
function resolveSource(ps, source) {
  if (source == null) return null;
  const uid = typeof source === "object" ? source.uid : source;
  if (!Number.isInteger(uid) || uid <= 0) return null;
  const loc = ps.find(uid);
  if (!loc || !loc.piece) return null;
  if (loc.area === "board") {
    const [row, col] = String(loc.key).split(",").map(Number);
    return { area: "board", piece: loc.piece, key: loc.key, row, col, dir: pieceDir(loc.piece) };
  }
  return loc;
}
function settlePrepGain(ps) {
  const total = Math.max(0, num8(ps.rhodePrepAcc, 0) + num8(ps.rhodePrepFrac, 0));
  const n = Math.floor(total + 1e-9);
  ps.rhodePrepFrac = total - n;
  if (!(n > 0)) {
    ps.rhodePrepAcc = 0;
    return 0;
  }
  if (!ps.gd.bond(RHODE_BOND)) return 0;
  const before = num8(ps.layers[RHODE_BOND], 0);
  const cap = rhodePrepLayerCap(ps);
  const add = Math.max(0, Math.min(n, layerGainRoom(before, cap - before)));
  ps.rhodePrepAcc = n - add;
  return add;
}

// mods/marisa-native/runtime-prep.js
function installPrep(sp) {
  const matches = /* @__PURE__ */ new WeakMap();
  const state = (ctx) => {
    let states = matches.get(ctx.gd);
    if (!states) {
      states = /* @__PURE__ */ new Map();
      matches.set(ctx.gd, states);
    }
    let s = states.get(ctx.playerId);
    if (!s) {
      s = { rhodePrepAcc: 0, rhodePrepFrac: 0 };
      states.set(ctx.playerId, s);
    }
    const board = ctx.board();
    const gd = { bond: (id) => ctx.data.bonds[id], baseIdOf: (id) => ctx.gd.baseIdOf(id), pieceBonds: (uid) => ctx.pieceBonds(uid) };
    return Object.assign(s, {
      gd,
      bonds: ctx.bonds(),
      layers: Object.fromEntries(Object.keys(ctx.data.bonds).map((id) => [id, ctx.layers(id)])),
      board: new Map(board.map((p) => [p.row + "," + p.col, p])),
      find: (uid) => {
        const p = ctx.piece(uid);
        return p && { area: p.area, piece: p, key: p.row + "," + p.col };
      },
      rangeKeys: (uid) => new Set(ctx.pieceRange(uid)),
      dirty: () => {
      }
    });
  };
  sp.meta.register("global:marisa_rhode", {
    onLayers(ctx, ev) {
      if (!["ROUND_START", "SP_DRAFT", "PREP"].includes(ctx.phase)) return;
      addPrepGain(state(ctx).gd, state(ctx), { bondId: ev.bondId, n: ev.to - ev.from, source: ev.source });
    },
    onBattleResult(ctx) {
      const n = settlePrepGain(state(ctx));
      if (n > 0) ctx.addLayers(RHODE_BOND, n, { reason: "marisa:prep-mirror" });
    }
  });
}

// mods/marisa-native/runtime-entry.js
function setup(sp) {
  for (const [id, fn] of [
    ["chess_x_marisa_makoto", op_makoto_default.char_x_marisa_makoto],
    ["char_x_marisa_makoto", op_makoto_default.char_x_marisa_makoto],
    ["chess_x_marisa_amiya3", op_amiya3_default.char_x_marisa_amiya3],
    ["char_x_marisa_amiya3", op_amiya3_default.char_x_marisa_amiya3],
    ["chess_x_marisa_aglna2", mod_aglna2_default.char_1015_aglna2],
    ["chess_x_marisa_kalts2", mod_kalts2_default.char_1052_kalts2],
    [ANCHOR, anchorKit],
    [MARKER, markerKit]
  ]) sp.kits.register(id, fn);
  sp.content.register({ id: "marisa:gameplay", install(battle) {
    setGameData(contentDataOf(battle.data));
    install(battle);
    install2(battle);
    install3(battle);
  } });
  installPrep(sp);
}
export {
  setup as default
};
