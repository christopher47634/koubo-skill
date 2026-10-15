# 模板规格（默认基线）

以下参数写入 `templates/Composition.tsx` 后不随内容改变。

## 视频参数

1920x1080 横屏、30fps、H.264、背景 `#0A0A0A`，时长由口播视频决定（ffprobe 检测）。

## 层级规范

| z-index | 内容 |
|---------|------|
| 0-10 | 背景、底部渐变（10）、TechBackground / MatrixRain / DataStream / CircuitLines |
| 3-4 | HudCorners、PulseRing（组件内部装饰层） |
| 60-85 | 图片、视频、所有内容组件；NotificationToast 85 |
| 90-100 | HudCorner、ScanLines、RecIndicator、帧数 |
| 1000 | `SUBTITLE_Z_INDEX`（`components/SubtitleOverlay.tsx`），任何元素不得超过 |

## 字幕（中英双语玻璃模板）

由 `SubtitleOverlay` 组件实现，不要在 Composition 里另写：

- 字体 LXGW WenKai（中文）+ ChakraPetch SemiBold（英文/数字），由 `FontLoader` 注册
- 中文 `ui.font.subtitle`(44px)，line-height 1.5，letter-spacing 1.5px，`#F0F0F0`
- 英文 `ui.font.en`(26px)，line-height 1.4，`rgba(255,255,255,0.46)`，上边距 3px；无 `en` 时只显示中文
- 位置底部居中 `bottom: 50px`；背景 `rgba(0,0,0,0.42)` + `blur(16px)`；圆角 14px；内边距 `14px 44px 10px`
- 句末句号去掉；入场 translateY(6px→0) + opacity，5 帧
- 字幕数据：`text` + 可选 `en`，见 `subtitle-layout-contract.md`

## 关键词高亮

分类色定义在 `components/highlight.ts` 的 `HIGHLIGHT_COLORS`：

| 分类 | 颜色 | 内容 |
|------|------|------|
| tool | `#7DD3FC` | 产品名、工具名、技术名词 |
| concept | `#FCD34D` | 抽象概念、理念、趋势 |
| platform | `#C4B5FD` | 平台名、场景、地点 |
| trap | `#FCA5A5` | 负面词汇、讽刺、骗局 |
| money | `#86EFAC` | 金额、数字、收入 |

匹配规则：按长度降序、逐字符扫描；样式 color + `textShadow: 0 0 8px 同色44` + fontWeight 600。Composition 里的 `KW` 由 AI 按稿子填充，通过 `highlightKeywords(text, KW)` 使用。

## 赛博装饰层（HUD）

指视频上的装饰元素，不是内容本身。与用户沟通时用「赛博装饰」或直接描述元素，不要假设对方懂 HUD 一词。

- 四角框 `HudCorner`：80px、`#00F0FF`、opacity 0.5、距边缘 20px
- `RecIndicator`：右上角红点 + REC + 计时，`#FF0040`，每 15 帧闪烁
- `ScanLines`：全屏横线，青色，4px 间距
- 帧数：左上角 ChakraPetch，`ui.font.micro`，`#00F0FF` opacity 0.4

## 图片与视频叠加

- 尺寸默认 540x405；右侧参考区约 1/3 画宽（`right: 100`、`top: 340`），左侧约 1/4（`left: 40-50`）
- 保持组件固有尺寸，不为凑比例强制压缩；空间不足时调整人物视频
- 双图序列：第一张立即弹入，第二张 `delay` 1.0~1.2s；共用同一个 exitFrame；垂直偏移 -200px / +200px
- 淡出：紧凑节奏 `extraHold` 0.8s（用户要求慢一点用 1.5s），淡出 8-10 帧，子项交错 3-4 帧
- 入场 spring：`damping 13-16, stiffness 100-160`；悬浮 `sin(local*0.05)*2`
- 视频叠加：尺寸位置同图片，`muted` + `loop`
- 干净风：边框 `1px solid rgba(255,255,255,0.06-0.08)`，阴影 `0 20px 60px rgba(0,0,0,0.35)`，圆角 14-18px，不加图片滤镜

## 底部渐变

透明 → 55% → `rgba(0,0,0,0.5)`@75% → `rgba(0,0,0,0.8)`@100%，zIndex 10。

## 配色

- 主色 `#00D4FF`（电光蓝），辅色 `#7DD3FC`、`#A78BFA`
- 禁用 `#FF006E`（品红/粉）；GlitchText 色偏层用 `#00D4FF` + `#A78BFA`；发光与阴影统一蓝色系

## 两种视觉风格

| 风格 | 适用 | 差异 |
|------|------|------|
| 赛博风（默认） | 科技/硬核 | 带 HUD 角框、REC、扫描线、帧数 |
| 干净风 | 商务/科普/日常 | 去掉上述装饰；柔和圆角与阴影；标签白色半透明大写 |

切换方式：保持 SCHEDULE / subtitles 结构，替换装饰层。参数对比见 `clean-style-template.md`。

## 组件设计规范（v5.1）

- 共享令牌 `components/designTokens.ts`：背景、玻璃表面、文字层级、圆角、强调色、字号 `ui.font`
- 毛玻璃：深色渐变透明底 + `blur(36-40px) saturate(175-180%)` + 0.5px 边框 + 顶部 inset 高光
- 渐变边框：外层 `padding:1px` + `linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.03))`
- macOS 窗口红黄绿灯 `#FF5F57 / #FEBC2E / #28C840`
- Spring：卡片 `{damping 15, stiffness 100, mass 1.0}`；标签 `{damping 18, stiffness 120}`；聊天窗 `{damping 14, stiffness 85, mass 1.1}`；子项交错每项 4 帧
- 多段展示合成必须用 `Series.Sequence` / `Sequence` 提供局部帧号，不要按全局帧手动切页面
- 组件内部禁用 `Math.random()`（帧间闪烁），用基于帧号的确定性 sine hash
- NeonBorder 是 inline 元素，包文字时内层 div 必须加 `padding` 和 `minWidth`，否则文字被裁
- 组件字号基线：HudPanel 数值 22 / StatusIndicator 14 / CircularGauge 180px / Counter 72 / GlitchText·GlowText·TypewriterText 56 / ProgressBar 宽 500 条 8

## 整体缩放

需要整体放大/缩小组件，改 `components/designTokens.ts` 的 `scale = { font, space }`，不要批量改源码。
