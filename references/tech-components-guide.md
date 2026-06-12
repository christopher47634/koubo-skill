# 科技感组件使用指南

组件库位置：`E:\Downloads\remotion-ui-library\components\`（51个组件）
音效库：`E:\Downloads\remotion-ui-library\assets\sfx\`（32个音效）

## 典型科技感全屏编排

```tsx
<AbsoluteFill>
  {/* 底层氛围 */}
  <TechBackground color="#08080f" gridOpacity={0.035} />
  <DataStream columns={12} opacity={0.04} />
  <CircuitLines opacity={0.05} />
  <ScanLines opacity={0.025} />

  {/* HUD装饰 */}
  <HudCorners enterFrame={0} exitFrame={9999} color="#00D4FF" />
  <PulseRing x="50%" y="50%" enterFrame={0} exitFrame={9999} color="#A78BFA" />

  {/* 内容组件 */}
  <ListCard side="left" ... />
  <MacTerminal side="right" ... />

  {/* 通知/标签 */}
  <Tag text="SECTION" icon="⚡" enterFrame={30} exitFrame={150} />
  <NotificationToast ... />

  {/* 字幕 */}
  {subtitles.map((sub, i) => (
    <SubtitleOverlay key={i} text={sub.text} en={sub.en}
      startFrame={Math.round(sub.start * fps)}
      endFrame={Math.round(sub.end * fps)} />
  ))}

  {/* 音效 */}
  <Sfx src="sfx/click.mp3" frame={28} />  {/* 领先视觉2帧 */}
</AbsoluteFill>
```

## 组件分类速查

### 底层氛围（全程开启）
- TechBackground — 网格+粒子+暗角，替代纯色背景
- ScanLines — CRT扫描线，opacity 0.02-0.03
- MatrixRain — 数字雨，opacity 0.04-0.08
- DataStream — 数据流竖列
- CircuitLines — 电路线装饰

### HUD装饰（全程开启）
- HudCorners — 四角L形线段，脉冲发光
- PulseRing — 同心圆脉冲扩散

### 文字动效
- GlitchText — RGB色偏+clipPath，用hash不用random
- GlowText — 多层textShadow光晕
- TypewriterText — 逐字+光标闪烁
- NeonBorder — 霓虹边框包内容，内层需minWidth+textAlign:center

### 数据面板
- HudPanel — 多指标条形图，标签13px数值22px
- CircularGauge — SVG圆环仪表
- CounterAnimation — 数字滚动easeOutExpo
- MetricCard — 单指标大卡+趋势箭头
- StatusIndicator — 状态灯组，圆点10px文字14px
- ProgressBar — 进度条8px高

### 卡片/列表
- ListCard — 最常用，每行独立卡片+图标容器
- GlassCard — 通用毛玻璃容器
- ChatBubble — 微信风格聊天窗
- FeatureCard — 网格布局特性卡
- CardStack — 扇形堆叠展开
- HighlightReel — 蓝色圆点+高亮行
- AnimatedChecklist — SVG勾号路径动画

### macOS组件
- MacWindow — 红黄绿灯精确还原
- MacTerminal — 终端+绿色光标
- MacCodeEditor — VS Code+行号+语法高亮
- ScreenRecording — 录屏框架+REC指示器

### 通知/装饰
- Tag — 小标签，任意角落
- LowerThird — 新闻访谈条
- NotificationToast — 系统通知弹入
- Divider — 动画分隔线
- FloatingIcons — 浮动装饰emoji
- GradientBorder — 旋转渐变边框
- LoadingDots — 弹跳三点加载

## 数据面板字号参考（1080p）

| 元素 | 字号 | 字重 |
|------|------|------|
| HudPanel 标签 | 13px | 600 |
| HudPanel 数值 | 22px | 700 |
| HudPanel 进度条 | 8px高 | — |
| StatusIndicator 圆点 | 10px | — |
| StatusIndicator 文字 | 14px | 600 |
| CounterAnimation | 64px | 700 |
| CircularGauge | 180px容器 | — |
| MetricCard 数值 | 42px | 700 |
