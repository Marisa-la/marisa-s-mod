import {addPrepGain,settlePrepGain,RHODE_BOND} from './source/server/match/rhodeMeta.js';

export function installPrep(sp) {
  const matches=new WeakMap();
  const state=ctx=>{
    let states=matches.get(ctx.gd);
    if(!states){states=new Map();matches.set(ctx.gd,states);}
    let s=states.get(ctx.playerId);
    if(!s){s={rhodePrepAcc:0,rhodePrepFrac:0};states.set(ctx.playerId,s);}
    const board=ctx.board();
    const gd={bond:id=>ctx.data.bonds[id],baseIdOf:id=>ctx.gd.baseIdOf(id),pieceBonds:uid=>ctx.pieceBonds(uid)};
    return Object.assign(s,{gd,bonds:ctx.bonds(),layers:Object.fromEntries(Object.keys(ctx.data.bonds).map(id=>[id,ctx.layers(id)])),board:new Map(board.map(p=>[p.row+','+p.col,p])),
      find:uid=>{const p=ctx.piece(uid);return p&&{area:p.area,piece:p,key:p.row+','+p.col};},
      rangeKeys:uid=>new Set(ctx.pieceRange(uid)),dirty:()=>{},
    });
  };
  sp.meta.register('global:marisa_rhode',{
    onLayers(ctx,ev){
      if(!['ROUND_START','SP_DRAFT','PREP'].includes(ctx.phase))return;
      addPrepGain(state(ctx).gd,state(ctx),{bondId:ev.bondId,n:ev.to-ev.from,source:ev.source});
    },
    onBattleResult(ctx){
      const n=settlePrepGain(state(ctx));
      if(n>0)ctx.addLayers(RHODE_BOND,n,{reason:'marisa:prep-mirror'});
    },
  });
}
