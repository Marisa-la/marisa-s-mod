# 罗德岛4人效果测试说明

## 效果描述

**罗德岛盟约的4人效果**：叠层效率提升
- **少于4名罗德岛干员在场**：叠层效率 50%
- **4名及以上罗德岛干员在场**：叠层效率 100%

### 什么是叠层效率？

当其他盟约（如阿戈尔）叠加层数时，罗德岛盟约会"镜像"叠加相同层数，但会受到效率影响：
- 50%效率：阿戈尔+1层 → 罗德岛+0.5层（零头累积，2次后才+1层）
- 100%效率：阿戈尔+1层 → 罗德岛+1层（完整镜像）

## 测试场景

### 推荐测试配置

**干员配置：**
- 4名罗德岛干员（达到100%效率阈值）
- 3名阿戈尔干员（用于触发盟约层数增长）

### 为什么选择阿戈尔？

阿戈尔盟约容易触发层数增长，适合观察罗德岛镜像效果：
- 阿戈尔：需要3名在场激活
- 阿戈尔干员每次攻击/技能都可能叠加层数
- 观察战斗中盟约层数的增长速度

## 测试步骤

### 1. 基线测试（3名罗德岛 - 50%效率）

1. 编队：3名罗德岛干员 + 3名阿戈尔干员
2. 进入战斗
3. 观察盟约层数面板：
   - 记录阿戈尔初始层数
   - 记录罗德岛初始层数
4. 等待10-20秒战斗
5. 再次观察盟约层数：
   - 如果阿戈尔增加了10层
   - 罗德岛应该增加约5层（50%效率，零头可能导致4-5层）

### 2. 4人测试（4名罗德岛 - 100%效率）

1. 编队：4名罗德岛干员 + 3名阿戈尔干员
2. 进入战斗
3. 观察盟约层数面板：
   - 记录阿戈尔初始层数
   - 记录罗德岛初始层数
4. 等待10-20秒战斗（与基线测试相同时长）
5. 再次观察盟约层数：
   - 如果阿戈尔增加了10层
   - 罗德岛应该增加约10层（100%效率，完整镜像）

## 预期结果对比

| 场景 | 罗德岛干员数 | 效率 | 阿戈尔+10层 | 罗德岛增长 |
|------|-------------|------|------------|-----------|
| 基线 | 3名 | 50% | +10层 | +5层左右 |
| 4人效果 | 4名 | 100% | +10层 | +10层左右 |

**差异**：4名罗德岛干员时，罗德岛层数增长速度应该是3名时的2倍。

## 代码验证

相关代码位置：

### 1. 效率计算函数
`mods/marisa-native/source/server/sim/content/bonds/addon/battle.js:373-379`

```javascript
export function rhodeEffOf(bb, count) {
  const b = bb || {};
  const n = Math.max(0, num(count, 0));
  const min = num(b.field_eff_member_min, 0);  // 4
  if (min > 0) return n >= min ? num(b.field_eff_max, 1) : num(b.field_eff_low, 0.5);
  return Math.min(num(b.field_eff_max, 1), Math.max(0, num(b.field_eff_per_member, 0.25) * n));
}
```

### 2. 在场人数计算
`mods/marisa-native/source/server/sim/content/bonds/addon/battle.js:357-361`

```javascript
export function rhodeFieldCount(st) {
  const seen = new Set();
  for (const m of st.members[ID.rhode]) if (onField(m)) seen.add(baseChessId(m));
  return seen.size;
}
```

### 3. 效率应用
`mods/marisa-native/source/server/sim/content/bonds/addon/battle.js:876-888`

```javascript
battle.on('layerGain', (c) => {
  if (c.bondId !== ID.rhode) return;
  const st = byPid[c.playerId];
  if (!st || !st.tiers[ID.rhode]) return;
  const bb = st.bb[ID.rhode] || {};
  const eff = rhodeEffOf(bb, rhodeFieldCount(st));  // 计算效率
  const total = Math.max(0, num(st.rhodeFrac, 0)) + Math.max(0, num(c.n, 0)) * eff;
  let n = Math.floor(total + 1e-9);
  st.rhodeFrac = total - n;
  const room = rhodeLayerCap(battle, st) - L(battle, st, ID.rhode);
  if (n > room) n = Math.max(0, room);
  c.n = n;
}, { priority: -60 });
```

## 数据配置

`mods/marisa-native/source/data/mods/marisa/bonds.json - rhodeShip.bb`

```json
{
  "field_eff_member_min": 4,
  "field_eff_low": 0.5,
  "field_eff_max": 1
}
```

## 注意事项

1. **层数上限**：罗德岛层数不会超过已激活的其他盟约中最高的层数
2. **零头累积**：50%效率下，奇数层增长会产生0.5的零头，累积到1.0才会实际增加1层
3. **同一干员精英/普通**：同一干员的普通和精锐版本只计数一次

## 如果效果不起效

### 检查清单

1. ✅ 确认4名罗德岛干员都已**部署在场**（不是在手牌中）
2. ✅ 确认罗德岛盟约已激活（需要至少1名罗德岛干员）
3. ✅ 确认其他盟约（如阿戈尔）已激活并在叠加层数
4. ✅ 检查层数上限：罗德岛层数是否已达到其他盟约的最高层数

### 调试方法

如果效果确实不起效，可以：
1. 查看战斗日志（如果有）
2. 对比3人和4人情况下的层数增长曲线
3. 检查 `rhodeFieldCount` 函数是否正确计数在场成员
