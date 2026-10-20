import fs from 'node:fs';
import {ROOT} from '../server/data.js';
const labels={
 en:['Marisa MOD manager','After the host applies settings, joining players, spectators and reconnecting players follow the room configuration.'],
 ja:['魔理沙 MOD 管理','ホストが適用すると、参加者・観戦者・再接続したプレイヤーに部屋の設定が適用されます。'],
 ko:['마리사 MOD 관리자','방장이 적용하면 참가자, 관전자 및 재접속한 플레이어가 방 설정을 따릅니다.'],
 'zh-TW':['魔理沙 MOD 管理器','房主套用後，加入者、觀戰者與重新連線者自動跟隨房間設定。'],
};
for(const [lang,values]of Object.entries(labels)){
 const p=ROOT+'/public/i18n/'+lang+'.json',json=JSON.parse(fs.readFileSync(p,'utf8'));
 json['魔理沙 MOD 管理器']=values[0];json['房主应用后，加入者、观战者与重连者自动跟随房间配置。']=values[1];
 fs.writeFileSync(p,JSON.stringify(json,null,2)+'\n');
}
