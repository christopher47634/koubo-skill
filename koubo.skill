---
name: remotion-oral-video
description: "Mode1 口播视频生产：用户提供真人口播视频和稿子，AI 自动完成转码、Whisper 时间戳对齐、真实素材调研、Remotion 组件排期、中英双语字幕、HUD、BGM、SFX、渲染和质检。适用于口播视频、口播 Skill、Mode1、mode one、model one、真人视频加字幕和信息组件等请求。沿用已验证的 Remotion 组件固有尺寸，空间不足时优先缩放或重构人物画面；字幕必须位于全局最高层。不要用于只有稿子的 Mode2。"
---

# 口播视频生产模板 (Remotion)

## 两种视频模式

Chris 有两种视频生产模式，本 skill 只覆盖 Mode1：

| 模式 | 输入 | 工具 | Skill |
|------|------|------|-------|
| **Mode1: 口播+稿子** | 口播视频 + 稿子文本 | Remotion | 本 skill（remotion-oral-video） |
| **Mode2: 纯稿子** | 只有稿子文本 | HyperFrames | mode2-hyperframes |

| **Mode2 已建管线**：项目在 `/mnt/e/Downloads/mode2-hyperframes/`，skill 为 `mode2-hyperframes`。

## 本地母版与 GitHub 发布关系

- **本地研发母版**：`/home/chris47634/.hermes/skills/creative/remotion-oral-video/`
- **组件库母版**：`E:\Downloads\remotion-ui-library\`
- **GitHub 发布仓库**：`https://github.com/christopher47634/koubo-skill`
- 正确流程：先在本地 Mode1 中调研、开发、跑通和验证，再把 Skill、references、scripts、templates、components 和 SFX 同步到 `koubo-skill`。
- 禁止只改 GitHub README 而不更新本地母版；也禁止只改本地却声称已经发布。
- 推送前必须检查本地母版与发布仓库的关键规则一致。

## 人物、组件与字幕布局（最高优先级）

真人口播画面是 Mode1 的主体，但已验证的 Remotion 组件库尺寸同样是设计资产，不能为了套用固定比例而随意压缩组件。

1. **尊重组件固有尺寸**：直接使用组件库已经确认的宽高、字号、内边距和动画参数。除非用户明确要求改组件本身，否则不要批量缩放或重写组件尺寸。
2. **空间不足先调整人物**：允许对真人视频做缩放、裁切、位移或重新构图，为组件留出空间；不得压缩字幕字号来迁就画面。
3. **左 1/4、右 1/3 是布局参考区**：默认优先把左侧组件放在约 1/4 画宽区域、右侧组件放在约 1/3 画宽区域，但它们不是强制裁切组件的宽度上限。
4. **人物位置决定组件侧边**：人物偏左时优先放右侧，人物偏右时优先放左侧；左右组件可以同时出现，只要信息互补且人物仍可识别。
5. **字幕全局最高层**：`SubtitleOverlay` 使用统一常量 `SUBTITLE_Z_INDEX = 1000`。REC、扫描线、通知、组件、图片和视频都必须低于字幕层。
6. **字幕不可被遮挡**：字幕容器可覆盖组件；若字幕压住人物嘴部或关键内容，应调整人物构图或字幕纵向位置，而不是降低字幕层级。

默认层级：

```ts
export const SUBTITLE_Z_INDEX = 1000;
// 背景 0-10；内容组件 60-85；HUD/扫描线/REC 90-100；字幕 1000。
```

## 两种视觉风格

| 风格 | 适用场景 | 模板文件 |
|------|----------|----------|
| **赛博风（默认）** | 科技/硬核内容 | `src/Composition.tsx`（原版） |
| **干净风** | 商务/科普/日常内容 | `src/Composition.tsx`（干净版） |

| **干净风 vs 赛博风差异**：
- 去掉 HUD 角框、REC 指示灯、扫描线、帧数显示
- 字幕：白字 `#F0F0F0` + 毛玻璃底 `rgba(0,0,0,0.42)` blur(16px)，无霓虹描边
- **字幕支持中英双行**：中文 44px 上方 + 英文 26px 下方半透明 `rgba(255,255,255,0.46)`，居中排列
- 图片叠加：柔和圆角 + 淡阴影，无发光边框，标签白色半透明大写
- 关键词高亮：柔和色系（天蓝 `#7DD3FC` / 暖黄 `#FCD34D` / 淡紫 `#C4B5FD`）
- 背景：`#0A0A0A`
- 底部渐变：从 55% 开始
- **毛玻璃 v2**：`blur(40px) saturate(180%)` + 渐变边框外层 + `inset` 高光/阴影 + 0.5px 精细边框
- **列表项 v2**：每行独立卡片背景 + 图标容器(36x36) + Linear/Vercel 风格
- **macOS 组件**：MacWindow/MacTerminal/MacCodeEditor/MacBrowser/MacNotification
- **动画规律**：spring 物理弹入 + 子元素交错 4 帧延迟 + sin 波浮动

**切换方式**：替换 `src/Composition.tsx` 内容，保留 SCHEDULE/subtitles 结构不变。完整参数对比表见 `references/clean-style-template.md`。

**字幕双行格式**：subtitles.json 需要 `en` 字段：
```json
{"index": 0, "text": "中文内容", "en": "English translation", "start": 0.0, "end": 2.5}
```
subtitles.ts 的 Subtitle 接口需加 `en?: string`。英文行用 ChakraPetch 26px，color `rgba(255,255,255,0.46)`，marginTop 3px；未提供英文时只显示中文行。

### UI 组件库 v5.1（51 个组件 + 32 个音效）

完整组件库保存在 **E盘**：`E:\Downloads\remotion-ui-library\components\`
README + 设计规范：`E:\Downloads\remotion-ui-library\README.md`
音效库：`E:\Downloads\remotion-ui-library\assets\sfx\`

**v5.1 设计规范（2026-06-12 更新）**：
- 共享设计令牌：`components/designTokens.ts` 统一背景、玻璃表面、文字层级、圆角和强调色。
- 玻璃表面：深色渐变透明底 + blur(36px) + saturate(175%) + 0.5px 边框 + 顶部高光。
- 科技强调：青色 `#7DD3FC` 与淡紫 `#C4B5FD`，只用于层级、状态和微光，不做满屏霓虹。
- 组件原有外部尺寸保持不变；升级材质、对比度与内部信息层级，不破坏现有排版。
- 多段验收或展示合成必须用 `Series.Sequence` / `Sequence` 提供局部帧号，禁止按全局帧手动切 React 页面，否则后续组件会超过 `exitFrame` 变成空画面。
- 毛玻璃：`blur(40px) saturate(180%)` + `inset 0 1px 0 rgba(255,255,255,0.12)` 顶部高光 + `inset 0 -1px 0 rgba(0,0,0,0.1)` 底部阴影
- 渐变边框：外层容器 `padding:1px` + `background: linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.03))`
- 精细边框：`0.5px solid rgba(255,255,255,0.1)`（不是1px）
- 列表项：每行独立卡片 `rgba(255,255,255,0.03)` + 0.5px边框 + 图标容器(36x36, borderRadius:8)
- macOS窗口：精确红黄绿灯 `#FF5F57/#FEBC2E/#28C840` + `inset box-shadow` + `border: 0.5px solid`

**科技氛围底层（7个）**：

| 组件 | 用途 | 关键细节 |
|------|------|----------|
| **TechBackground** | 科技底板 | 网格(60px)+径向渐变+20个浮动粒子+暗角。替代纯色背景 |
| **ScanLines** | CRT扫描线 | repeating-linear-gradient, 3px间距, opacity 0.03, 持续滚动 |
| **MatrixRain** | 矩阵数字雨 | 01+日文片假名, 绿色下落, 20列, vertical-rl |
| **DataStream** | 数据流竖列 | 多列字符滚动, 速度可调 |
| **CircuitLines** | 电路线装饰 | SVG虚线+节点, strokeDashoffset动画 |
| **HudCorners** | 四角HUD角标 | L形线段, 脉冲发光, opacity 0.3 |
| **PulseRing** | 脉冲扩散光环 | 多层同心圆向外扩散+中心发光点 |

**科技感文字/边框（4个）**：

| 组件 | 用途 | 关键细节 |
|------|------|----------|
| **GlitchText** | 故障文字 | RGB色偏(#FF006E/#00D4FF)+clipPath随机切割, 每30帧大故障 |
| **GlowText** | 发光文字 | 脉冲textShadow+字影, 适用于标题/关键词 |
| **NeonBorder** | 霓虹边框 | conic-gradient旋转+脉冲发光box-shadow |
| **GradientBorder** | 渐变旋转边框 | conic-gradient(from angle), 角度随帧旋转 |

**基础卡片（16个）**：

| 组件 | 位置 | 动画 | 用途 |
|------|------|------|------|
| **Tag** | 任意角落 | spring(damping:18,stiffness:120) + 微脉冲 | 标签/章节标记 |
| **GlassCard** | 左/右 | spring(damping:15,stiffness:100,mass:1.0) + 渐变边框 | 通用毛玻璃容器 |
| **ListCard** | 左/右 | 继承GlassCard + 每行独立卡片交错4帧 | **最常用**：列表信息 |
| **ChatBubble** | 左/右 | spring(damping:14,stiffness:85,mass:1.1) + 渐变气泡 | 微信风格聊天窗 |
| **PhoneFrame** | 左/右 | spring(damping:13,stiffness:85) + 金色边框 | 手机浮窗 |
| **TextBlock** | 左上 | spring(damping:16,stiffness:110) | 图标+标题+副标题+徽章 |
| **Badge** | 任意 | scale spring(damping:12,stiffness:150) | 小徽章 |
| **QuoteCard** | 左/右 | 继承GlassCard + 大引号装饰 | 引用/金句 |
| **StatCard** | 左/右 | 继承GlassCard + 图标容器+数字弹入 | 数据/统计 |
| **ProgressBar** | 内嵌 | spring(damping:20,stiffness:60) + 百分比显示 | 进度条 |
| **ComparisonCard** | 居中 | 左右两侧分别spring弹入 | 对比卡片 |
| **StepIndicator** | 内嵌 | scale spring + 交错 | 步骤指示器 |
| **ImageShowcase** | 左/右 | scale spring + 浮动 | 大图展示 |
| **TimelineCard** | 左/右 | 继承GlassCard + 竖线+圆点+交错 | 时间线 |
| **FeatureCard** | 左/右 | 继承GlassCard + 网格布局+交错弹入 | 特性网格(1-2列) |
| **HighlightReel** | 左/右 | 继承GlassCard + 蓝色圆点指示器+高亮行 | 要点高亮列表 |
| **AnimatedChecklist** | 任意 | SVG勾号路径动画+弹性缩放 | 勾选动画列表 |

**数据/图表（6个）**：

| 组件 | 用途 | 关键细节 |
|------|------|----------|
| **HudPanel** | HUD数据面板 | 条形图+数值+monospace, 适用于多指标并排 |
| **StatusIndicator** | 状态指示灯 | active脉冲发光/warning/error/idle |
| **Waveform** | 音频波形 | sin波随机高度, 40根竖条 |
| **CircularGauge** | SVG圆形仪表 | strokeDashoffset动画+中心数值 |
| **CounterAnimation** | 数字滚动 | 0→1000 easeOutExpo, 大字号+文字阴影 |
| **MetricCard** | 单指标大卡 | 图标容器+大数字+趋势箭头↑↓+发光边框 |

**动效/通知（6个）**：

| 组件 | 用途 | 关键细节 |
|------|------|----------|
| **TypewriterText** | 打字机 | 逐字显示+光标闪烁, monospace字体 |
| **CardStack** | 堆叠卡片扇形展开 | 每张偏转角度+位移, 适用于多选项 |
| **NotificationToast** | 系统通知 | 从顶部弹性滑入, macOS风格 |
| **LowerThird** | 新闻/访谈条 | 侧边强调条+名字+头衔错开弹入 |
| **LoadingDots** | 加载动画 | 弹跳三点 |
| **FloatingIcons** | 浮动装饰图标 | sin波漂移+旋转+透明度 0.15 |

**macOS 组件（7个）**：

| 组件 | 用途 | 关键细节 |
|------|------|----------|
| **MacWindow** | macOS窗口框架 | 红黄绿灯(#FF5F57/#FEBC2E/#28C840)+0.5px边框+blur(40px)+标题栏52px |
| **MacTerminal** | 终端 | 继承MacWindow+绿色光标带阴影+SF Mono字体+4种文字颜色 |
| **MacCodeEditor** | VS Code编辑器 | 行号背景+高亮行左边框+语法高亮色 |
| **MacBrowser** | 浏览器 | 地址栏+🔒+内容区 |
| **MacNotification** | 通知弹窗 | 右上角+blur(24px)+app名+标题+正文 |
| **CodeBlock** | 代码片段 | 打字效果+光标闪烁 |
| **ScreenRecording** | 屏幕录制框架 | 地址栏+REC闪烁指示器+渐变边框光晕 |

**工具组件（4个）**：SfxTrigger(默认1.2) / SubtitleOverlay / FontLoader / highlight

**组件分层 z-index 规范**：
- z:0-5 — TechBackground, MatrixRain, DataStream, CircuitLines（氛围底层）
- z:3-4 — HudCorners, PulseRing（HUD装饰层）
- z:62-70 — 所有内容组件（卡片/窗口/列表）
- z:85 — NotificationToast（通知弹窗，高于内容）
- z:90-100 — ScanLines、REC、帧数等装饰层
- z:1000 — SubtitleOverlay（字幕，全局最高层，任何组件不得超过）

**科技感全屏组合用法**：`TechBackground` 打底 → `HudCorners` + `ScanLines` 叠加 → 内容组件放上层。整套下来就是科技感全屏。详见 `references/ui-component-library.md` 和 `references/tech-components-guide.md`。

**Spring 配置参考**：
- 卡片/窗口：`{ damping: 15, stiffness: 100, mass: 1.0 }`
- 标签：`{ damping: 18, stiffness: 120 }`
- 聊天窗：`{ damping: 14, stiffness: 85, mass: 1.1 }`
- 子项交错：每项 4 帧延迟，`clamp((local - delay) / 10, 0, 1)`

**ChatWindow 堆叠**：stackIndex 控制扇形展开，每层偏移 20px + scale 缩减 0.03 + opacity 衰减 0.15。

**Chris 要求（2026-06-11，2026-06-12 修订）**：
- **组件尺寸已经确认**：保留组件库当前字号、内边距、图标容器和宽高；不要再批量放大或缩小。空间不足时优先调整人物视频。
- **字号基线（已验证 2026-06-12）**：HudPanel 数值 22px 加粗 / StatusIndicator 圆点 10px + 字号 14px / CircularGauge 180px / Counter 64px / GlitchText 56px / GlowText 56px / TypewriterText 56px / ListCard 行高 17px / ProgressBar 宽 500px + 条 8px
- 组件不要固定大小，根据内容自适应
- **侧边区域参考**：右侧约画面 1/3、左侧约画面 1/4；这是排版参考，不是强制修改组件固有宽度的规则。
- **智能布局**：不是死规矩"一个时间段只放一个"。根据内容判断——能搭配的就一左一右同时出现，冲突的才错开。例如：左侧放技能列表 + 右侧放聊天窗实战演示（内容互补不冲突）
- **卡片内容必须和稿子内容严格对应**：不允许用泛泛的占位文字，每个卡片/列表项都要直接反映口播说的内容
- **动画慢一点也可以**：不要衔接太紧，留呼吸空间。默认紧凑（0.8秒余量），但用户要求慢一点时用 1.5 秒
- 动效和 UI 都要精致，不要粗糙的占位感
- 参考视频的 UI 元素是根据真实 UI 设计的，不是简单加边框
- **调研清楚再做**是硬性要求：逐段截图分析参考视频的动画/音效/节奏/UI，不调研就动手会被骂
- 字幕格式：中英双行，中文44px上方，英文26px下方半透明
- **先扩充组件库再做视频**：Chris 会要求"扩充组件库"而非直接渲染，此时只更新 E 盘组件库文件，不渲染
- **音效音量要大**：默认 1.2（从 0.3 翻 4 倍）
- **macOS 风格组件是重点**：终端、代码编辑器、浏览器等实景操作内容用 MacBook 风格
- **GitHub 调研**：做组件前先搜 GitHub 看别人怎么实现的
- **科技感是硬性要求**：所有组件都要有科技感（毛玻璃+精细边框+发光+monospace字体），不是简单的白底卡片
- **音效对应组件**：每种组件都有对应音效，音效也要科技感（短促、高频、干净）
- **先扩充组件库再做视频**：Chris 会要求"扩充组件库"而非直接渲染，此时只更新 E 盘组件库文件，不渲染
- **调研 GitHub 再出结果**：做组件前搜 GitHub 看最佳实现，不是凭自己想象做
- **音效对应组件**：每种组件都有对应音效，音效也要科技感（短促、高频、干净）

**渲染踩坑（2026-06-12）**：
- **GlitchText 禁用 Math.random()**：React render 中用 `Math.random()` 会导致每次渲染结果不同，帧间闪烁。必须用确定性 hash（基于 `local` 帧数的 sine 函数）
- **Sfx 组件不能用 `require("remotion")`**：必须在文件顶部 `import { useCurrentFrame } from "remotion"`，否则报错 `inputRange must contain only numbers`
- **SubtitleOverlay 需要传参**：不能 `<SubtitleOverlay />` 无参调用，必须传 `text`/`startFrame`/`endFrame` 或映射 subtitles 数组
- **heredoc 写文件会损坏行号**：execute_code 中 `cat > file << 'XEOF'` 可能带入行号前缀。写入后需 `sed -i 's/^[0-9]*|//' file` 修复
详细代码实现见 `references/clean-style-template.md`。GitHub 调研笔记见 `references/component-design-notes.md`。批量缩放脚本见 `scripts/scale_components.py`。

## 管线验证流程（洗模板）

当用户说"洗模板"或"跑通管线"时，目标是**验证流程**而非做成品：
1. 用测试稿子（5句左右）+ edge-tts 生成测试音频
2. FFmpeg 合成纯色背景测试视频作为"口播视频"
3. 手写测试 subtitles.json（带 `en` 字段做中英双行）
4. 跑 Whisper → 字幕对齐 → 素材排期 → 渲染
5. 输出到 Desktop 给用户确认
6. 备份到 E盘
7. 根据用户反馈迭代（字幕字号、UI样式等），**每次只改一个变量**

**Chris 确认（2026-06-11）**："洗模板而并不是在给你真的是看开始做视频的最主要的是把它的管线给跑通了"

验证成功标志：全链路输出 H.264 MP4 到 Desktop，字幕/素材/UI元素都可见。
- HyperFrames（HeyGen 开源）：HTML/CSS → MP4，更轻量，AI agent 友好
- 不需要 React 组件树，GSAP 动画直觉，渲染链路短
- 16 种内置字幕动画 + VFX 特效 + 社媒组件
- 详见 `references/hyperframes-comparison.md`

---

## 核心原则

**用户只提供两样东西**：
1. 稿子（纯文本）
2. 口播视频（MP4）

**其他一切由 AI 自动完成**：搜图、字幕对齐、插入点分析、渲染。
**所有视觉参数锁死在模板里**，永远不因内容而改变。

### 两种工作模式（必须区分）

| Chris 说 | 你做什么 | 不做什么 |
|----------|---------|---------|
| "扩充组件库" | 只更新 E 盘组件文件 + 音效 | 不渲染视频 |
| "做个视频看看" | 渲染验证 + 拷贝到桌面 | — |
| "检查一下效果" | ffmpeg 抽帧 + vision_analyze 逐帧检查 | 不要截图桌面，直接从视频抽帧 |
| "调研一下" | 搜 GitHub + 截图分析参考视频 | 不动手做 |

**Chris 原话（2026-06-11）**："我让你扩充组件库，不是让你现在做视频"

### GitHub 调研是硬性前置

做任何新组件/新风格前，先搜 GitHub 看最佳实现：
- `remotion template` — 模板和组件模式
- `glassmorphism react` — 毛玻璃实现
- `macos window css` — macOS 窗口还原
- `spring animation config` — 弹簧参数调优
- `video overlay design` — 视频叠加设计

Chris 原话："给你100亿token随便挥霍，不管是验证还是什么全部做好"

---

## 设计原则

- **不搞创造性**：借鉴成熟科普视频的排版和比例，不玩花活
- **内容严格对应**：卡片/列表/聊天窗的内容必须直接反映口播稿子的每一句话，不允许泛泛占位
- **先出初版再迭代**：先渲染一版给用户看，根据反馈微调
- **每次渲染都备份**：渲染完立刻 `cp` 到 E盘 `/mnt/e/Downloads/`，覆盖上一版
- **每次改完参数都重新渲染**：不攒改动，改一个参数渲一版让用户确认

---

## 规划层：脚本审计 & 生产策略

收到课程脚本后，**先读 `references/course-video-planning.md`** 再开工。它覆盖：
- 脚本格式审计（录屏/实拍/AI生成 占比统计）
- 生产方式选择决策树（纯动画 vs 录屏 vs 混合）
- 冲突检测（脚本标注与用户方案不匹配时必须报告）
- 课程漏斗结构（引流视频 vs 付费课的生产优先级）

---

## 反馈迭代流程

用户看成品后可能要求调整。常见反馈及处理：

1. **字幕不准** → 修改 subtitles.json 中对应句子的时间戳，cp 到 src/，重新渲染
2. **图片不对** → 替换 public/images/ 中的图片，更新 SCHEDULE 中的 src 路径，重新渲染
3. **图片太小/太大** → 修改 Composition.tsx 中 width/height（锁死参数已定，一般不改）
4. **图片位置偏了** → 修改 right/top 值（锁死参数已定，一般不改）
5. **BGM 太响/太轻** → 修改 volume 值（锁死参数已定，一般不改）
6. **加图/减图** → 修改 SCHEDULE 数组，重新渲染
7. **字幕拆分** → 在 subtitles.json 中插入新条目，更新所有后续 index，同步更新 SCHEDULE subIdx

**关键**：每次只改一个变量，渲染确认后再改下一个。不要一次改太多。

---

## 输入要求

1. **口播视频**：任意格式，放入 `input/` 目录
2. **稿子**：纯文本，每句话一行或自然分段

用户不提供图片。图片由 AI 搜索下载。
用户不提供字幕时间戳。时间戳由 whisper 提取 + AI 手动校准。
BGM 默认用 E盘 `/mnt/e/Downloads/bgm/track-32.mp3`，用户可指定替换。

---

## 完整工作流（7步）

### Step 1: 环境准备

项目固定在 `/tmp/remotion-demo/`。如果目录不存在或 node_modules 丢失：

```bash
cd /tmp/remotion-demo
npm install --registry=https://registry.npmmirror.com
```

如果项目目录完全不存在，从 E盘备份恢复：
```bash
cp -r /mnt/e/Downloads/remotion-project /tmp/remotion-demo
cd /tmp/remotion-demo && npm install --registry=https://registry.npmmirror.com
```

确认字体文件存在：
```bash
ls public/fonts/LXGWWenKai-Regular.ttf public/fonts/ChakraPetch-SemiBold.ttf
```

确认 BGM 存在（从 E盘复制）：
```bash
cp /mnt/e/Downloads/bgm/track-32.mp3 public/music/
```

确认 edge-tts 可用（中文 TTS 备选方案）：
```bash
which edge-tts || pip install edge-tts
```

### Step 2: 视频转码

H.265 视频在浏览器/Remotion 中不兼容，必须转 H.264：

```bash
ffmpeg -i input/*.mp4 -c:v libx264 -crf 18 -preset fast -c:a aac -b:a 128k public/input-video.mp4
```

转码后检测视频时长（用于 Root.tsx 的 durationInFrames）：

```bash
ffprobe -v error -show_entries format=duration -of csv=p=0 public/input-video.mp4
```

记录时长（秒），后续写入 Root.tsx：`durationInFrames = Math.ceil(秒数 * 30)`

### Step 3: Whisper 提取时间戳

```bash
pip install faster-whisper
```

```python
from faster_whisper import WhisperModel
model = WhisperModel("base", device="cuda")  # GPU可用时
segments, info = model.transcribe("public/input-video.mp4", language="zh")
result = [{"start": s.start, "end": s.end, "text": s.text} for s in segments]
import json
with open("whisper_output.json", "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=2)
```

**注意**：base 模型中文识别可能不准，但时间戳基本可用。用时间戳做锚点，文字用稿子。

**踩坑提醒**：execute_code 中 read_file 的 key 是 `content_returned` 不是 `content`；heredoc 写入时注意行号前缀损坏；批量 sed 后需验证文件完整性。详见 `references/pitfalls.md`。

生成对比文件便于调试：
```python
# whisper_vs_script.txt：左列 whisper 识别，右列稿子原文
# 用于快速判断哪些句子 whisper 识别对了（当锚点），哪些错了（需插值）
```

### Step 4: 字幕对齐（锚点+插值法）

**核心思路**：whisper 识别对的句子当锚点，识别错的按字数在锚点间插值。

**字幕单位规则**：以当前显示一页为单位。如果一句太长或包含两个独立语义，拆成两句分别跟踪。每句持续时间 >= 0.3s，无重叠。

1. 对比 whisper_output.json 和稿子，找出 whisper 识别正确的句子
2. 这些句子直接用 whisper 的 start/end 作为锚点
3. 两个锚点之间的句子，按字数比例分配时间
4. 确保每句最小 0.3s，无重叠
5. 长句拆分：按语义断点拆成两条独立字幕，各自有独立时间戳

脚本模板（align_subtitles.py）：

```python
import json

alignment = [
    # (稿子文字, whisper_start, whisper_end)
    # whisper识别对的 → 用真实时间戳
    # whisper识别错的 → 估算时间，后续手动校准
    ("第一句内容。", 0.0, 3.1),
    ("第二句内容。", 3.6, 7.1),
    # ...全部句子
]

subtitles = []
for i, (text, start, end) in enumerate(alignment):
    if end <= start:
        end = start + 0.3
    subtitles.append({"index": i, "text": text, "start": round(start, 2), "end": round(end, 2)})

# 修复重叠
for i in range(1, len(subtitles)):
    if subtitles[i]["start"] < subtitles[i-1]["end"]:
        mid = (subtitles[i-1]["end"] + subtitles[i]["start"]) / 2
        subtitles[i-1]["end"] = round(mid - 0.02, 2)
        subtitles[i]["start"] = round(mid + 0.02, 2)

with open("subtitles.json", "w", encoding="utf-8") as f:
    json.dump(subtitles, f, ensure_ascii=False, indent=2)
```

生成后**必须复制到 src/ 目录**（Remotion 从 src/subtitles.json 导入）：

```bash
cp subtitles.json src/subtitles.json
```

### Step 5: AI 分析插入点 + 自动搜图

**这是核心智能环节，完全由 AI 自动完成**。

#### 5a. 分析稿子，确定插入点

AI 通读稿子，为每句话判断：
- **是否需要配图**：不是每句都有，只在关键句触发
- **单图还是双图**：
  - 单图：概念明确，一张图能说明（如"豆包"→豆包界面截图）
  - 双图序列：两个相关概念对比/递进（如"健身房卖课"→健身房+钱，先后弹入同时淡出）
  - 视频素材：需要动态效果（如"写文案"→AI屏幕录制）
- **后半段插入频率更高**（节奏加快，视频越往后图越密）
- **图片指向性要强**：必须和说的话完美对应，不能用泛泛的图

#### 5b. 自动搜索下载图片

**图片完全由 AI 搜索，用户不提供**。

搜索策略：
1. **具体品牌/产品** → 直接搜品牌名（"豆包AI"、"星巴克logo"）
2. **具体人物/角色** → 搜人物描述（"奶奶用手机"、"健身房教练"）
3. **抽象概念** → 搜视觉隐喻（"被骗"→诈骗警告、"改命"→成功学海报）
4. **场景描述** → 搜对应画面（"直播间"→直播卖课画面、"敲键盘"→MacBook打字）
5. **数字/金额** → 搜相关画面（"3980"→钱/账单、"月入三万"→财富象征）

**指向性要求**：
- 图片必须让人一眼看出对应哪句话
- 不能用泛泛的"科技感"图片凑数
- 品牌名出现时优先用品牌logo或界面截图
- 场景描述时用真实场景照片

**WSL 环境下载方式**（SSL 不通，绕道 PowerShell）：

```bash
powershell.exe -Command "
Invoke-WebRequest -Uri 'IMAGE_URL' -OutFile 'C:\Users\25128\AppData\Local\Temp\dl.jpg' -TimeoutSec 15 -UseBasicParsing
"
cp /mnt/c/Users/25128/AppData/Local/Temp/dl.jpg /tmp/remotion-demo/public/images/target.jpg
```

**图片来源优先级**：
1. Unsplash（高质量免费图）：`https://images.unsplash.com/photo-{ID}?w=600&q=80`
2. Pixabay
3. 品牌官网 logo/截图
4. 维基百科

**图片规范**：
- 格式：JPG，600x400~800x600 横向
- 临时素材：定稿后删除

#### 5c. 输出调度表

分析完成后，生成 SCHEDULE 数组写入 Composition.tsx：

```typescript
const SCHEDULE: ScheduleItem[] = [
  { type: "image", subIdx: 1, src: "/images/scam-warning.jpg", label: "SCAM" },
  { type: "image", subIdx: 23, src: "/images/gym-sales.jpg", label: "GYM" },
  { type: "image", subIdx: 23, src: "/images/money-stack.jpg", label: "SALES", delay: 1.2 }, // 双图序列
  { type: "video", subIdx: 68, src: "/videos/ai-screen.mp4", label: "AI SCREEN" },
];
```

#### 5d. 更新关键词高亮

根据稿子内容更新 KW 字典。分类规则：
- **tool（蓝#4FC3F7）**：产品名、工具名、技术名词
- **concept（橙#FFB74D）**：抽象概念、理念、趋势
- **platform（紫#CE93D8）**：平台名、场景、地点
- **trap（红#EF5350）**：负面词汇、讽刺、骗局
- **money（绿#A5D6A7）**：金额、数字、收入

### Step 6: 更新 Root.tsx 时长 + 渲染

用 Step 2 检测到的视频时长更新 Root.tsx：

```typescript
// Root.tsx 中替换这行
durationInFrames={Math.ceil(视频秒数 * 30)}
```

然后渲染：

```bash
cd /tmp/remotion-demo
TMPDIR=/tmp npx remotion render src/index.ts main /tmp/output.mp4 --codec h264
cp /tmp/output.mp4 /mnt/e/Downloads/remotion_v3.mp4
```

渲染耗时参考（RTX 4070）：
- 1分钟视频（1800帧）：~2分钟
- 2分钟视频（3600帧）：~3-5分钟
- 5分钟视频（9000帧）：~8-12分钟

**内存不足时**：加 `--concurrency 1` 避免 OOM 被 kill。症状是渲染到 90%+ 突然被 kill，exit_code=0。

### Step 7: 交付

- 渲染完成后，将视频复制到 E盘 `/mnt/e/Downloads/`（覆盖上一版）
- 备份源码到 `/mnt/e/Downloads/remotion-project/`（包含 Composition.tsx + subtitles.json + 图片/视频素材）
- 临时图片素材保留在 `public/images/`，用户确认最终版后删除

---

## 模板规格（默认基线）

以下参数写入模板后不再因内容而改变。

### 视频参数
- 分辨率：1920x1080（横屏）
- 帧率：30fps
- 编码：H.264
- 时长：由口播视频决定（自动检测）
- 背景色：#0A0A0A

### 字幕样式（当前默认：昨天成片确认版）
- 字体：LXGW WenKai（中文）+ ChakraPetch SemiBold（英文/数字）
- 中文：44px，line-height 1.5，letter-spacing 1.5px，颜色 `#F0F0F0`
- 英文：26px，line-height 1.4，颜色 `rgba(255,255,255,0.46)`，上边距 3px
- 位置：底部居中，默认 `bottom: 50px`
- 背景：`rgba(0,0,0,0.42)` + `backdrop-filter: blur(16px)`
- 圆角：14px
- 内边距：`14px 44px 10px`
- 层级：`zIndex: 1000`，是整个合成的最高层
- 显示方式：宽度跟随内容，中英两行纵向居中；`en` 缺失时只显示中文
- 去除句号：text.replace(/[。.]+$/g, "")
- 入场动画：translateY(6px→0) + opacity(0→1)，5帧
- 文字阴影：`0 2px 10px rgba(0,0,0,0.45)`

赛博风 60px 单行字幕只作为旧版可选变体，不再作为 Mode1 默认模板。无论使用哪种视觉变体，字幕层级都必须保持 1000。

### 关键词高亮（锁死样式，内容可变）
- tool（蓝#4FC3F7）：工具/产品名
- concept（橙#FFB74D）：概念/理念
- platform（紫#CE93D8）：平台/场景
- trap（红#EF5350）：陷阱/负面
- money（绿#A5D6A7）：金钱/数字
- 匹配规则：按长度降序排序，逐字符扫描
- 高亮样式：color + textShadow(0 0 8px 同色44) + fontWeight:600

### HUD 元素（锁死）— 赛博装饰层
HUD = Heads-Up Display，指视频上的赛博朋克装饰元素（不是内容本身）：
- **四角框**：屏幕四角的青色 L 形线段，80px，#00F0FF，opacity 0.5，距边缘 20px
- **REC 指示灯**：右上角红色圆点 + "REC" 文字，#FF0040 闪烁（15帧切换），模拟录制中状态
- **扫描线**：全屏半透明横线，repeating-linear-gradient，#00F0FF opacity 0.015，4px 间距，模拟 CRT 显示器效果
- **帧数**：左上角动态数字，ChakraPetch 11px，#00F0FF opacity 0.4，letter-spacing 2

> **注意**：Chris 不熟悉 "HUD" 这个术语（2026-05-30 确认），沟通时用"赛博装饰"或直接描述具体元素。不要假设用户知道 HUD 是什么。

### 两种视频模式
Chris 有两种视频生产模式，本 skill 只覆盖 Mode1：
- **Mode1: 口播+稿子** → Remotion（本 skill），成熟管线
- **Mode2: 纯稿子** → HyperFrames，skill `mode2-hyperframes`，项目 `/mnt/e/Downloads/mode2-hyperframes/`
- 纯稿子+赛博风 → 仍可用本 Remotion 模板（HUD 已有）

### 图片与组件叠加
- 尺寸：自定义 width/height 参数传入
- **保持组件固有尺寸**：组件库已有尺寸优先，不为满足比例而强制压缩。
- **右侧参考区**：约画面 1/3，通常 `right: 40-50px`、`top: 80-120px`
- **左侧参考区**：约画面 1/4，通常 `left: 40-50px`、`top: 60-80px`
- 双图偏移：±200px（一上一下）
- 边框：1px solid rgba(255,255,255,0.06-0.08)（干净风）
- 阴影：0 20px 60px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)
- 圆角：14-18px
- 标签：ChakraPetch 11-13px，rgba(255,255,255,0.4-0.6)，letter-spacing 2.5-3，text-transform uppercase
- 入场：spring（damping:13-14, stiffness:100-110, mass:0.8-0.9）
- 出场：8-10帧淡出（紧凑节奏）
- 悬浮：sin(local*0.05)*2 微浮动
- **智能布局**：根据内容判断——能搭配的就一左一右同时出现，冲突的才错开
- 右侧约 1/3、左侧约 1/4 仅用于选位；冲突时调整人物构图，不修改已确认的组件规格
- 图片滤镜：干净风不加滤镜

### 视频叠加（锁死）
- 尺寸/位置/边框：同图片叠加
- muted + loop
- 入场/出场：同图片叠加

### 双图序列参数（锁死）
- 第一张图：立即弹入（无 delay）
- 第二张图：delay: 1.0~1.2s（在第一张之后弹入）
- 两张图同时淡出（共享同一个 exitFrame）
- 垂直偏移：第一张 -200px，第二张 +200px

### 淡出延迟规则（锁死）
- 紧凑节奏：extraHold = 0.8s（不再区分冲突/无冲突）
- 子项交错延迟：3帧（从4帧压缩）
- 弹入 spring 参数：damping:13-16, stiffness:100-160（更高=更快）
- 淡出帧数：8-10帧（从15帧压缩）

### BGM（锁死参数）
- 音量：0.08（8%），用户要求时可调到 0.06
- loop：贯穿全片
- startFrom: 0
- 默认文件：music/track-32.mp3（从 E盘 /mnt/e/Downloads/bgm/ 复制）

### 音效 SFX（v2 更新）

音效用于强化 UI 元素的出现感。**音频必须领先视觉 2 帧**（人耳感知比视觉快）。
**默认音量：1.2**（Chris 要求翻倍，2026-06-11）。

**SFX 文件生成**（ffmpeg 合成，无需下载）：
```bash
mkdir -p public/sfx
# Whoosh - 滑入
ffmpeg -y -f lavfi -i "anoisesrc=d=0.3:c=pink:a=0.5" -af "afade=t=in:st=0:d=0.05,afade=t=out:st=0.15:d=0.15,highpass=f=2000,lowpass=f=10000,volume=1.5" -c:a libmp3lame -q:a 2 public/sfx/whoosh.mp3
# Pop - 弹出
ffmpeg -y -f lavfi -i "sine=f=800:d=0.15" -af "afade=t=in:st=0:d=0.01,afade=t=out:st=0.05:d=0.1,volume=0.8" -c:a libmp3lame -q:a 2 public/sfx/pop.mp3
# Slide - 滑动
ffmpeg -y -f lavfi -i "sine=f=400:d=0.25" -af "afade=t=in:st=0:d=0.02,afade=t=out:st=0.15:d=0.1,volume=0.7" -c:a libmp3lame -q:a 2 public/sfx/slide.mp3
# Notification - macOS通知
ffmpeg -y -f lavfi -i "sine=f=800:d=0.1" -f lavfi -i "sine=f=1200:d=0.15" -filter_complex "[0]afade=t=in:st=0:d=0.01,afade=t=out:st=0.04:d=0.06,volume=1.2[a];[1]adelay=80|80,afade=t=in:st=0:d=0.01,afade=t=out:st=0.06:d=0.09,volume=1.0[b];[a][b]amix=inputs=2" -c:a libmp3lame -q:a 2 public/sfx/notification.mp3
# Click - 点击
ffmpeg -y -f lavfi -i "anoisesrc=d=0.05:c=white:a=0.3" -af "afade=t=in:st=0:d=0.005,afade=t=out:st=0.01:d=0.04,highpass=f=3000,volume=2.0" -c:a libmp3lame -q:a 2 public/sfx/click.mp3
# Typing - 打字
ffmpeg -y -f lavfi -i "anoisesrc=d=0.03:c=white:a=0.4" -af "highpass=f=4000,volume=2.0" -c:a libmp3lame -q:a 2 public/sfx/typing.mp3
# Success - 成功（三音和弦）
ffmpeg -y -f lavfi -i "sine=f=523:d=0.1" -f lavfi -i "sine=f=659:d=0.1" -f lavfi -i "sine=f=784:d=0.15" -filter_complex "[0]afade=t=in:st=0:d=0.01,afade=t=out:st=0.04:d=0.06,volume=1.0[a];[1]adelay=60|60,afade=t=in:st=0:d=0.01,afade=t=out:st=0.04:d=0.06,volume=1.0[b];[2]adelay=120|120,afade=t=in:st=0:d=0.01,afade=t=out:st=0.08:d=0.07,volume=1.0[c];[a][b][c]amix=inputs=3" -c:a libmp3lame -q:a 2 public/sfx/success.mp3
```

**NeonBorder 裁切陷阱**（2026-06-12 踩坑）：
NeonBorder 包裹文字时，必须给内层 div 加足够的 padding 和 minWidth，否则文字被裁：
```tsx
// ✗ 错误 — 文字被裁
<NeonBorder><GlitchText text="GLITCH EFFECT" /></NeonBorder>

// ✓ 正确 — 保留足够空间
<NeonBorder>
  <div style={{ padding: "36px 60px", minWidth: 700, textAlign: "center" }}>
    <GlitchText text="GLITCH EFFECT" />
  </div>
</NeonBorder>
```
NeonBorder 本身是 inline 元素，不会自动撑开宽度。内容必须有显式 minWidth。

**配色偏好：赛博朋克蓝**（Chris 硬性要求，2026-06-11）：
- 主色：`#00D4FF`（电光蓝）
- 辅色：`#7DD3FC`（浅蓝）、`#A78BFA`（淡紫）
- **禁用**：`#FF006E`（品红/粉色）— Chris 明确不要
- GlitchText 色偏层：`#00D4FF` + `#A78BFA`（不是红绿）
- NeonBorder 默认 `#00D4FF`
- 所有发光/阴影统一用蓝色系

**科技感SFX生成**（ffmpeg 合成）：
```bash
# Glitch 故障音
ffmpeg -y -f lavfi -i "anoisesrc=d=0.08:c=white:a=0.5" -af "highpass=f=2000,volume=2.5,afade=t=out:st=0.04:d=0.04" -c:a libmp3lame -q:a 2 glitch-fast.mp3
# Neon 霓虹嗡鸣
ffmpeg -y -f lavfi -i "sine=f=120:d=0.15" -af "vibrato=f=8:d=0.5,afade=t=in:st=0:d=0.03,afade=t=out:st=0.08:d=0.07,volume=1.0" -c:a libmp3lame -q:a 2 neon-buzz.mp3
# Pulse 脉冲
ffmpeg -y -f lavfi -i "sine=f=500:d=0.2" -af "afade=t=in:st=0:d=0.05,afade=t=out:st=0.1:d=0.1,vibrato=f=3:d=0.4,volume=1.5" -c:a libmp3lame -q:a 2 pulse.mp3
# Circuit 电路连接
ffmpeg -y -f lavfi -i "sine=f=2200:d=0.05" -af "afade=t=in:st=0:d=0.01,afade=t=out:st=0.02:d=0.03,volume=1.8" -c:a libmp3lame -q:a 2 circuit.mp3
# HUD 扫描
ffmpeg -y -f lavfi -i "anoisesrc=d=0.2:c=pink:a=0.25" -af "highpass=f=4000,afade=t=in:st=0:d=0.05,afade=t=out:st=0.1:d=0.1,volume=1.5" -c:a libmp3lame -q:a 2 hud-scan.mp3
# Counter tick
ffmpeg -y -f lavfi -i "sine=f=1800:d=0.04" -af "afade=t=in:st=0:d=0.005,afade=t=out:st=0.02:d=0.02,volume=1.8" -c:a libmp3lame -q:a 2 counter-tick.mp3
# Typewriter key
ffmpeg -y -f lavfi -i "anoisesrc=d=0.03:c=white:a=0.6" -af "highpass=f=3000,lowpass=f=8000,afade=t=in:st=0:d=0.003,afade=t=out:st=0.01:d=0.02,volume=2.0" -c:a libmp3lame -q:a 2 typewriter-key.mp3
# Card fan
ffmpeg -y -f lavfi -i "anoisesrc=d=0.25:c=pink:a=0.4" -af "afade=t=in:st=0:d=0.03,afade=t=out:st=0.08:d=0.17,highpass=f=1500,lowpass=f=6000,volume=1.5" -c:a libmp3lame -q:a 2 card-fan.mp3
# Check mark
ffmpeg -y -f lavfi -i "sine=f=2400:d=0.06" -af "afade=t=in:st=0:d=0.01,afade=t=out:st=0.03:d=0.03,volume=2.0" -c:a libmp3lame -q:a 2 check.mp3
# Toast notification
ffmpeg -y -f lavfi -i "sine=f=1200:d=0.08" -af "afade=t=in:st=0:d=0.01,afade=t=out:st=0.04:d=0.04,volume=1.8" -c:a libmp3lame -q:a 2 toast-in.mp3
# Sweep divider
ffmpeg -y -f lavfi -i "anoisesrc=d=0.15:c=pink:a=0.3" -af "afade=t=in:st=0:d=0.05,afade=t=out:st=0.08:d=0.07,highpass=f=4000,volume=1.5" -c:a libmp3lame -q:a 2 sweep.mp3
# Lower third slide
ffmpeg -y -f lavfi -i "anoisesrc=d=0.18:c=pink:a=0.35" -af "afade=t=in:st=0:d=0.02,afade=t=out:st=0.06:d=0.12,highpass=f=2000,lowpass=f=7000,volume=1.6" -c:a libmp3lame -q:a 2 lower-third.mp3
```

**SFX 触发组件**（音量默认 1.2）：
```tsx
const Sfx: React.FC<{ src: string; at: number; vol?: number }> = ({ src, at, vol = 1.2 }) => {
  const f = useCurrentFrame();
  if (f !== at) return null;
  return <Audio src={staticFile(src)} volume={vol} />;
};
// 用法：at = Math.max(0, enterFrame - 2)  // 领先2帧
```

**SFX 映射规则**（音量全部 1.2）：

基础SFX：
| 元素类型 | SFX 文件 |
|---------|----------|
| Tag（标签） | click.mp3 |
| ListCard/GlassCard | slide.mp3 |
| ChatBubble（聊天窗） | notification.mp3 |
| MacWindow/MacTerminal | slide.mp3 |
| MacCodeEditor | typing.mp3 |
| FeatureCard | pop.mp3 |
| StepIndicator（完成） | success.mp3 |

科技感SFX：
| 元素类型 | SFX 文件 |
|---------|----------|
| CounterAnimation数字滚动 | counter-tick.mp3 (0.04s) |
| TypewriterText打字机 | typewriter-key.mp3 (0.03s) |
| CardStack扇形展开 | card-fan.mp3 (0.25s) |
| CircularGauge仪表填充 | gauge-fill.mp3 (0.5s) |
| AnimatedChecklist勾选 | check.mp3 (0.06s) |
| NotificationToast弹入 | toast-in.mp3 (0.08s) |
| Divider分隔线展开 | sweep.mp3 (0.15s) |
| MetricCard弹入 | metric-pop.mp3 (0.05s) |
| LowerThird新闻条滑入 | lower-third.mp3 (0.18s) |
| ScreenRecording录屏开始 | rec-start.mp3 (0.15s) |
| CircularGauge仪表满 | gauge-complete.mp3 (0.12s) |
| 通用轻柔提示 | chime.mp3 (0.2s) |
| GlitchText故障 | glitch-fast.mp3 (0.08s) |
| NeonBorder/霓虹 | neon-buzz.mp3 (0.15s) |
| PulseRing脉冲 | pulse.mp3 (0.2s) |
| CircuitLines电路 | circuit.mp3 (0.05s) |
| HudCorners扫描 | hud-scan.mp3 (0.2s) |

### 口播原声（锁死）
- 音量：1.0（100%）
- 来源：input-video.mp4

### 底部渐变（锁死）
- 透明→55%→rgba(0,0,0,0.5)@75%→rgba(0,0,0,0.8)@100%
- zIndex: 10

---

## 文件管理

### 永久资产（存E盘）
- BGM：`/mnt/e/Downloads/bgm/`
- 音效：`/mnt/e/Downloads/sfx/`
- 字体：E盘项目目录内
- 动画模板：E盘

### 临时素材（定稿后删除）
- 搜到的配图：`public/images/`
- 搜到的视频：`public/videos/`
- whisper 输出

### E盘项目备份
- 每次重大更新后备份源码到 `/mnt/e/Downloads/remotion-project/`

---

## WSL 环境注意事项

1. **npm 慢**：用 `--registry=https://registry.npmmirror.com`
2. **删 node_modules**：从 Windows 侧 `powershell Remove-Item -Recurse -Force`
3. **图片下载 SSL 不通**：绕道 PowerShell `Invoke-WebRequest`
4. **TMPDIR 问题**：渲染时设 `TMPDIR=/tmp` 避免 webpack bundle 写到 Windows temp
5. **推 GitHub**：WSL 的 GnuTLS 对 GitHub SSL 经常挂，必须绕道 PowerShell。详见 `references/github-push-from-wsl.md`
6. **Composition ID**：是 `main` 不是 `MainComposition`
7. **ffmpeg 转码**：H.265 必须转 H.264，否则 Remotion 报错
8. **字体注册**：用 @font-face + staticFile()，不用 @remotion/google-fonts
9. **Video 组件**：口播视频用 `muted` 属性，否则浏览器策略阻止自动播放
10. **TTS 中文语音**：内置 text_to_speech 对长中文文本会截断（>50字），用 edge-tts CLI 代替（详见 mode2-hyperframes skill 的 TTS 章节）

---

## 参考视频分析（调研竞品/风格参考）

用户可能发一个参考视频链接（抖音/B站/YouTube），要求"做成这样"。**禁止问"你的输入是什么"——skill 已经定义了。**

**Chris 铁律（2026-06-11）**：必须先充分调研参考视频的 BGM/音效/节奏/动画/UI，调研清楚才能开始做。"给你100亿token去调研" = 深度分析，不是快速扫一眼。

### 正确的调研流程

1. **打开视频**：用 `cmd.exe /c start "链接"` 打开浏览器
2. **逐段截图分析**：用 PowerShell 在不同时间点截桌面截图（最小化终端→等待→截图）
3. **每个截图用 vision_analyze 详细分析**：
   - 文字叠加：字体、大小、颜色、位置、背景
   - UI 组件：标签、卡片、聊天窗、手机浮窗
   - 动画暗示：元素的出现/消失规律
   - 字幕格式：单行/双行、语言
   - 色彩方案：主色调、强调色
4. **汇总视觉规律**：哪些组件是固定的，哪些随内容变化
5. **对比现有管线**：指出 gap，再问用户确认

### PowerShell 逐段截图脚本

```powershell
# 最小化终端 + 逐段截取参考视频
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
Add-Type @"
using System;
using System.Runtime.InteropServices;
public class WinApi {
    [DllImport("user32.dll")]
    public static extern bool SetForegroundWindow(IntPtr hWnd);
    [DllImport("user32.dll")]
    public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
    [DllImport("user32.dll")]
    public static extern IntPtr FindWindow(string lpClassName, string lpWindowName);
}
"@

# 1. 最小化终端
$hwnd = [WinApi]::FindWindow($null, $null)
[WinApi]::ShowWindow($hwnd, 6)  # SW_MINIMIZE
Start-Sleep -Seconds 1

# 2. 找到浏览器窗口并置前
$procs = Get-Process | Where-Object { $_.MainWindowTitle -match 'douyin|抖音' }
if ($procs) {
    [WinApi]::ShowWindow($procs[0].MainWindowHandle, 9)  # SW_RESTORE
    [WinApi]::SetForegroundWindow($procs[0].MainWindowHandle)
}
Start-Sleep -Seconds 1

# 3. 用右方向键逐段跳转 + 截图
for ($i = 0; $i -lt 10; $i++) {
    for ($j = 0; $j -lt 33; $j++) {
        [System.Windows.Forms.SendKeys]::SendWait('{RIGHT}')
        Start-Sleep -Milliseconds 30
    }
    Start-Sleep -Milliseconds 500
    $screen = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
    $bmp = New-Object System.Drawing.Bitmap($screen.Width, $screen.Height)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.CopyFromScreen($screen.Location, [System.Drawing.Point]::Empty, $screen.Size)
    $bmp.Save("C:\Users\25128\AppData\Local\Temp\ref_frame_$i.png")
    $g.Dispose(); $bmp.Dispose()
}
```

然后对每张截图调用 `vision_analyze` 详细分析。

### 分析完后的处理

分析完参考视频后，对比现有 Mode1/Mode2 管线，指出 gap，再问用户确认需求。

## 快速启动检查清单

收到新任务时：

- [ ] 稿子文字是否完整？（检查是否有截断）
- [ ] 口播视频是否放入 input/？
- [ ] 视频是否需要转码？（H.265→H.264）
- [ ] whisper base 时间戳是否可用？
- [ ] AI 分析插入点：单图/双图/视频，后半段频率高
- [ ] 自动搜索下载图片：指向性强，和说话内容一一对应
- [ ] SCHEDULE subIdx 是否和字幕 index 对应？
- [ ] BGM 是否在 public/music/？
- [ ] 渲染前 TMPDIR=/tmp？
- [ ] 模板参数是否全部锁死？（字幕/HUD/图片位置/BGM音量/边框）
