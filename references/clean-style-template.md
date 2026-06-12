# 干净风模板参考 v2

## 与赛博风的参数对比

| 参数 | 赛博风 | 干净风 v2 |
|------|--------|--------|
| 背景色 | `#0A0A0A` | `#0A0A0A` |
| 字幕颜色 | `#E0E0E0` | `#F0F0F0` |
| 字幕底 | `rgba(0,0,0,0.35)` + 青色边框 | `rgba(0,0,0,0.42)` + blur(16px) 无边框 |
| 字幕圆角 | 4px | 14px |
| 字幕字号 | 60px 单行 | 44px 中文 + 26px 英文双行 |
| 毛玻璃 | 无 | `blur(40px) saturate(180%)` + 渐变边框 + inset高光 |
| 边框 | 2px 发光 | 0.5px 精细 |
| 列表项 | 整块卡片 | 每行独立卡片 + 图标容器(36x36) |
| HUD | 有 | 无 |
| 音效 | 无 | 1.2 音量 |
| macOS组件 | 无 | MacWindow/MacTerminal/MacCodeEditor |

## 毛玻璃 v2 设计规范

```css
/* 外层：渐变边框 */
border-radius: 20px; padding: 1px;
background: linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.03));

/* 内层：毛玻璃主体 */
background: rgba(15,15,20,0.75);
backdrop-filter: blur(40px) saturate(180%);
border-radius: 19px;
box-shadow: 0 24px 64px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.1);
```

## 列表项 v2（Linear/Vercel 风格）

每行独立卡片：`padding:12px 14px; border-radius:10px; background:rgba(255,255,255,0.03); border:0.5px solid rgba(255,255,255,0.06)`
图标容器：`36x36, borderRadius:8, background:${accent}22`

## macOS 窗口规范

红黄绿灯：`#FF5F57/#FEBC2E/#28C840` + `inset 0 0 0 0.5px rgba(0,0,0,0.12)`
窗口：`rgba(30,30,30,0.88)` + `blur(40px) saturate(180%)` + `border-radius:10px`
标题栏：`height:52px` + `rgba(50,50,50,0.6)` + `border-bottom:0.5px solid rgba(255,255,255,0.08)`
终端字体：`'SF Mono', 'Fira Code', 'JetBrains Mono', monospace`

## 尺寸规则

- 右侧：width=640px（1/3画面），right:40px
- 左侧：width=480px（1/4画面），left:40px
- 高度：自适应内容，最多拉满屏幕
- 智能布局：内容互补一左一右，冲突才错开

## Spring 配置

| 场景 | damping | stiffness | mass |
|------|---------|-----------|------|
| 卡片弹入 | 15 | 100 | 1.0 |
| 标签弹入 | 18 | 120 | - |
| 聊天窗弹入 | 14 | 85 | 1.1 |

子项交错：每项4帧延迟，`clamp((local - delay) / 10, 0, 1)`

## 科技感全屏组合（Tech Aesthetic）

当需要科技感全屏时，用以下分层：

```
z:0-5   TechBackground（网格+粒子+暗角）
z:2     DataStream / CircuitLines / MatrixRain（数据流装饰）
z:3-4   HudCorners + PulseRing（HUD装饰）
z:62-70 内容组件（卡片/窗口/列表）
z:85    NotificationToast
z:90    SubtitleOverlay
z:95    ScanLines（扫描线，最顶层装饰）
```

配色：赛博蓝 `#00D4FF` 主色 + `#7DD3FC` 辅色 + `#A78BFA` 点缀。禁用品红/粉色。

GlitchText 用确定性 hash 代替 Math.random()：
```typescript
const hash = (n: number) => ((n * 9301 + 49297) % 233280) / 233280;
```

NeonBorder 内容居中防裁剪：
```tsx
<NeonBorder color="#00D4FF">
  <div style={{ padding: "36px 60px", minWidth: 700, textAlign: "center" }}>
    ...内容...
  </div>
</NeonBorder>
```

## SFX 音效（音量 1.2）

| 元素 | SFX |
|------|-----|
| Tag | click.mp3 |
| ListCard | slide.mp3 |
| ChatBubble | notification.mp3 |
| MacWindow | slide.mp3 |
| MacCodeEditor | typing.mp3 |
| FeatureCard | pop.mp3 |
