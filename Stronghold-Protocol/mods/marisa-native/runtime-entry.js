import makoto from './source/server/sim/content/kits/ops/op-makoto.js';
import amiya from './source/server/sim/content/kits/ops/op-amiya3.js';
import aglna from './source/server/sim/content/kits/ops/mod-aglna2.js';
import kalts, {anchorKit, ANCHOR} from './source/server/sim/content/kits/ops/mod-kalts2.js';
import {markerKit, MARKER} from './source/server/sim/content/kits/ops/mod-aglna2.js';
import {install as rhode} from './source/server/sim/content/bonds/addon/battle.js';
import {install as kun} from './source/server/sim/content/bands/battle.js';
import {install as garrisons} from './source/server/sim/content/garrisons/battle.js';
import {installPrep} from './runtime-prep.js';
import {contentDataOf, setGameData} from './source/server/sim/content/support/index.js';

export default function setup(sp) {
  for (const [id, fn] of [
    ['chess_char_4217_makoto',makoto.char_4217_makoto],
    ['char_4217_makoto',makoto.char_4217_makoto],
    ['chess_char_1037_amiya3',amiya.char_1037_amiya3],
    ['char_1037_amiya3',amiya.char_1037_amiya3],
    ['chess_char_1015_aglna2',aglna.char_1015_aglna2],
    ['chess_char_1052_kalts2',kalts.char_1052_kalts2],
    [ANCHOR,anchorKit],[MARKER,markerKit],
  ]) sp.kits.register(id,fn);
  sp.content.register({id:'marisa:gameplay',install(battle){
    setGameData(contentDataOf(battle.data));
    rhode(battle);
    kun(battle);
    garrisons(battle);
  }});
  installPrep(sp);
}
