# UI Component Library v4 — 完整参考

保存位置：`E:\Downloads\remotion-ui-library\`
- 组件：`components/`（51个 .tsx 文件）
- 音效：`assets/sfx/`（32个 .mp3 文件）
- README：`README.md`

## 设计规范速查

### 毛玻璃（所有卡片通用）
```css
backdrop-filter: blur(40px) saturate(180%);
background: rgba(15,15,20,0.75);
border: 0.5px solid rgba(255,255,255,0.1);
box-shadow:
  0 24px 64px rgba(0,0,0,0.3),
  inset 0 1px 0 rgba(255,255,255,0.12),
  inset 0 -1px 0 rgba(0,0,0,0.1);
```

### 渐变边框（外层容器）
```css
border-radius: 20px;
padding: 1px;
background: linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.03));
```

### macOS 窗口
```css
/* 红黄绿灯颜色 */
#FF5F57 (红, border: #E14640)
#FEBC2E (黄, border: #DFA123)
#28C840 (绿, border: #1DAD2B)
/* 每个灯加 inset box-shadow */
box-shadow: inset 0 0 0 0.5px rgba(0,0,0,0.12);
```

### Spring 配置档位
```js
// 卡片/窗口弹入
spring({ frame, fps, config: { damping: 15, stiffness: 100, mass: 1.0 } })
// 标签弹入
spring({ frame, fps, config: { damping: 18, stiffness: 120 } })
// 聊天窗弹入（较慢，有重量感）
spring({ frame, fps, config: { damping: 14, stiffness: 85, mass: 1.1 } })
// 通知弹入
spring({ frame, fps, config: { damping: 14, stiffness: 100, mass: 0.9 } })
// 数据/进度条
spring({ frame, fps, config: { damping: 20, stiffness: 60 } })
```

### 最佳缓动曲线
```js
cubic-bezier(0.16, 1, 0.3, 1)     // Apple 平滑减速
cubic-bezier(0.22, 0.68, 0, 1)    // 快启动慢停止
cubic-bezier(0.34, 1.56, 0.64, 1) // 微过冲
```

### 暗色配色方案
| 名称 | 背景 | 玻璃色 | 强调色 |
|------|------|--------|--------|
| Void | #0a0a0f | rgba(255,255,255,0.06) | #6366f1 |
| Midnight | #0f172a | rgba(255,255,255,0.08) | #38bdf8 |
| Obsidian | #111111 | rgba(255,255,255,0.04) | #a78bfa |
| Carbon | #1a1a2e | rgba(255,255,255,0.07) | #e94560 |
| Deep Ocean | #0b1120 | rgba(255,255,255,0.05) | #06b6d4 |

### 字体推荐
- 技术/数据：JetBrains Mono, SF Mono, Fira Code
- 系统/UI：SF Pro Text, -apple-system
- 标题：Space Grotesk, ChakraPetch, Outfit, Sora
- 中文正文：LXGW WenKai

## 科技感全屏组合模式

```tsx
// 典型科技感视频底层
<TechBackground color="#0a0a14" gridOpacity={0.04} />
<CircuitLines color="#00D4FF" opacity={0.06} />
<HudCorners color="#00D4FF" size={40} />
<ScanLines opacity={0.03} />

// 内容层
<Tag text="INTRO" enterFrame={0} exitFrame={60} />
<ListCard title="AI MODELS" items={[...]} side="left" enterFrame={30} exitFrame={150} />

// 最顶层
<SubtitleOverlay ... />
```

## 智能布局规则

1. 每句话分析语义 → 匹配最合适的组件类型
2. 能搭配的（内容互补）→ 一左一右同时出现
3. 冲突的（同类内容）→ 错开时间
4. 右侧宽度 = 画面 1/3（640px），左侧 = 1/4（480px）
5. 卡片内容必须严格对应口播内容，不允许泛泛占位

## 常见组件组合

| 场景 | 左侧 | 右侧 |
|------|------|------|
| 介绍多个产品 | ListCard(产品列表) | — |
| 展示产品优势 | ListCard(功能列表) | ChatBubble(实战对话) |
| 代码演示 | MacTerminal(命令行) | — |
| 代码+解释 | MacCodeEditor(代码) | ListCard(要点) |
| 数据对比 | MetricCard(指标) | CircularGauge(仪表) |
| 步骤说明 | AnimatedChecklist | — |
| 时间线回顾 | TimelineCard | — |
| HUD数据 | HudPanel(多指标) | StatusIndicator(状态) |

## 音效生成命令

所有 32 个音效已保存在 `E:\Downloads\remotion-ui-library\assets\sfx\`。
如需重新生成，用 ffmpeg（详见 SKILL.md SFX 章节）。

## 完整组件清单（51个）

### 科技氛围底层（7）
TechBackground, ScanLines, MatrixRain, DataStream, CircuitLines, HudCorners, PulseRing

### 科技感文字/边框（4）
GlitchText, GlowText, NeonBorder, GradientBorder

### 基础卡片（17）
Tag, GlassCard, ListCard, ChatBubble, PhoneFrame, TextBlock, Badge, QuoteCard, StatCard, ProgressBar, ComparisonCard, StepIndicator, ImageShowcase, TimelineCard, FeatureCard, HighlightReel, AnimatedChecklist

### 数据/图表（6）
HudPanel, StatusIndicator, Waveform, CircularGauge, CounterAnimation, MetricCard

### 动效/通知（8）
TypewriterText, CardStack, NotificationToast, LowerThird, LoadingDots, FloatingIcons, Divider, GradientBorder

### macOS（7）
MacWindow, MacTerminal, MacCodeEditor, MacBrowser, MacNotification, CodeBlock, ScreenRecording

### 工具（4）
SfxTrigger, SubtitleOverlay, FontLoader, highlight
