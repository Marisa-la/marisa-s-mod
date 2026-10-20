# 修复计划

## 问题列表

1. **罗德岛盟约图标人数显示错误** - 显示3/2而不是3/4
   - 文件：`public/js/ui/bondStrip.js:85`
   - 原因：显示逻辑使用了下一个阈值而不是效率门槛
   - 修复：对于罗德岛盟约，应该显示 `count/field_eff_member_min`

2. **罗德岛盟约4人起效不生效**
   - 文件：`mods/marisa-native/source/server/sim/content/bonds/addon/battle.js`
   - 需要验证：`rhodeEffOf` 函数（372-379行）和 layerGain 钩子（876-888行）
   - 配置：`field_eff_member_min: 4`, `field_eff_low: 0.5`, `field_eff_max: 1`

3. **技能特效持续显示**
   - 文件：`public/js/render/vfx/skills.js`
   - 原因：可能是技能结束时没有正确清理特效
   - 需要检查：`hold: 'skill'` 的特效清理逻辑

4. **联机客机进入战斗有延迟**
   - 可能是状态同步问题
   - 需要检查整备状态到战斗状态的转换

## 修复步骤

1. 首先修复罗德岛显示人数标签
2. 验证罗德岛4人效率是否正确实现
3. 检查并修复技能特效清理
4. 检查联机状态同步

