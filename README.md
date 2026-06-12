<div align="center">

# 🎬 koubo-skill

### 口播视频一键生成

> 当前发布版与本地 Mode1 母版同步：内置完整 Remotion UI 组件库与音效库，默认使用昨天成片确认的中英双语玻璃字幕。

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933.svg?logo=node.js&logoColor=white)](https://nodejs.org)
[![Python](https://img.shields.io/badge/Python-3.10+-3776AB.svg?logo=python&logoColor=white)](https://python.org)
[![Remotion](https://img.shields.io/badge/Remotion-v4-000000.svg?logo=remotion&logoColor=white)](https://remotion.dev)

**把你的口播视频和稿子丢给 AI，自动产出带字幕、配图、BGM、赛博朋克 HUD 的 1080p 成品视频。**<br>
**你只需要提供两样东西——稿子和口播视频，其他一切由 AI 自动完成。**

<br>

```
你的输入                          AI 自动完成                          成品输出
┌─────────────┐    ┌──────────────────────────────────┐    ┌─────────────────┐
│  口播视频    │    │  1. 视频转码 (H.265→H.264)       │    │  1920x1080 MP4  │
│  稿子文字    │ →  │  2. Whisper 提取时间戳            │ →  │  赛博朋克字幕    │
│             │    │  3. 字幕对齐 (锚点+插值)           │    │  关键句弹图      │
│             │    │  4. AI 分析插入点 + 搜图           │    │  BGM 循环铺底    │
│             │    │  5. 关键词高亮分类                 │    │  HUD 四角框     │
│             │    │  6. Remotion 渲染                 │    │  REC 指示灯     │
└─────────────┘    └──────────────────────────────────┘    └─────────────────┘
```

</div>

## 当前布局规则

- 组件库已升级为 v5.1，共享 `components/designTokens.ts` 视觉令牌，并通过五组 1920×1080 局部时间轴动态画廊验收。
- 组件库现有尺寸已经确认，生成视频时直接尊重组件固有宽高、字号和内边距。
- 左侧约 1/4、右侧约 1/3 是放置参考区，不是强制压缩组件的尺寸上限。
- 空间不足时优先缩放、裁切或移动人物视频。
- 字幕使用中文 44px + 英文 26px 的玻璃模板，`zIndex: 1000`，始终高于 REC、扫描线、图片、视频和所有信息组件。
- 字幕数据使用 `text` + 可选 `en` 字段，详见 [`references/subtitle-layout-contract.md`](references/subtitle-layout-contract.md)。

---

## 📖 目录

- [快速开始](#-快速开始)
- [成品效果](#-成品效果)
- [前置条件](#-前置条件)
- [详细工作流](#-详细工作流)
- [文件结构](#-文件结构)
- [FAQ](#-faq)
- [技术栈](#-技术栈)
- [贡献](#-贡献)
- [许可](#-许可)

---

## 🚀 快速开始

三种方式，任选其一：

### 方式一：Hermes Agent（推荐，全自动）🤖

> 零配置，对话即出片。

```bash
# 1. 下载 skill
git clone https://github.com/christopher47634/koubo-skill.git
cp koubo-skill/koubo.skill ~/.hermes/skills/

# 2. 重启 Hermes
hermes restart

# 3. 对话中使用
# 对 Hermes 说：「帮我生成一个口播视频，稿子是 [你的稿子]，视频在 [路径]」
```

Hermes 会自动执行全部流程：转码 → Whisper → 对齐 → 搜图 → 渲染，一步到位。

### 方式二：Claude Code（半自动）🧠

> 适合想参与每一步决策的用户。

```bash
# 1. 下载 skill
git clone https://github.com/christopher47634/koubo-skill.git

# 2. 在项目目录启动 Claude Code
cd koubo-skill
claude

# 3. 对 Claude 说：
# 「按照 koubo.skill 的流程，帮我生成口播视频。稿子是 [你的稿子]，视频在 [路径]」
```

Claude Code 会按照 skill 中的步骤逐步执行，每一步你可以确认或调整。

### 方式三：手动执行（了解原理）🔧

> 适合想完全掌控的开发者。

详见下方 [详细工作流](#-详细工作流) 章节，共 7 步，每步都有完整说明。

---

## 🎥 成品效果

<div align="center">

### 字幕系统
</div>

| 特性 | 说明 |
|------|------|
| **字体大小** | 60px 大字，底部居中 |
| **背景样式** | 半透明黑底 + 青色赛博朋克边框 |
| **关键词自动变色** | 见下方色卡 |

**关键词色卡：**

| 颜色 | 类别 | 示例 |
|------|------|------|
| 🔵 蓝色 | 工具/产品名 | ChatGPT、豆包、Notion |
| 🟠 橙色 | 概念/理念 | AI、认知、风口、杠杆 |
| 🟣 紫色 | 平台/场景 | 小红书、直播、星巴克 |
| 🔴 红色 | 陷阱/负面 | 改命、被骗、离谱 |
| 🟢 绿色 | 金钱/数字 | 月入十万、3980、10x |

<div align="center">

### 视觉效果
</div>

| 效果 | 描述 |
|------|------|
| **配图弹入** | 右侧弹入 540×405 大图，spring 弹性动画，发光边框 + 角标 |
| **智能插图** | 关键句才弹图，不是每句都有；后半段频率更高 |
| **HUD 装饰** | 四角青色边框、REC 红色闪烁指示灯、扫描线效果、帧数显示 |
| **BGM** | 8% 音量循环铺底，保留口播原声 |

---

## 📋 前置条件

### 必装软件

| 软件 | 版本要求 | 用途 | 安装方式 |
|------|----------|------|----------|
| **Node.js** | v18+ | 运行 Remotion | [nodejs.org](https://nodejs.org) |
| **Python** | 3.10+ | Whisper 语音识别 | [python.org](https://python.org) |
| **ffmpeg** | 最新版 | 视频转码 | `brew install ffmpeg` 或 `apt install ffmpeg` |
| **npm** | 随 Node.js | 安装依赖 | 内置 |

### 可选（强烈推荐）

| 软件 | 用途 | 说明 |
|------|------|------|
| **NVIDIA GPU + CUDA** | Whisper 加速 | 有 GPU 跑 base 模型只要几十秒，CPU 需要几分钟 |
| **Hermes Agent** | AI 自动化 | [hermes-agent.nousresearch.com](https://hermes-agent.nousresearch.com) |
| **Claude Code** | AI 编码助手 | `npm install -g @anthropic-ai/claude-code` |

### 字体文件（必需）

本模板使用两个字体，请下载后放入项目的 `public/fonts/` 目录：

| 字体 | 用途 | 下载地址 |
|------|------|----------|
| **LXGW WenKai** | 中文字体 | [GitHub Releases](https://github.com/lxgw/LxgwWenKai/releases) — 下载 `LXGWWenKai-Regular.ttf` |
| **Chakra Petch** | 英文字体 | [Google Fonts](https://fonts.google.com/specimen/Chakra+Petch) — 下载 SemiBold 字重 `.ttf` |

---

## 🔧 详细工作流

<details>
<summary><strong>点击展开完整 7 步工作流</strong></summary>

### Step 1: 初始化项目

```bash
mkdir -p my-video/{input,public/{fonts,images,videos,music,sfx},src}
cd my-video

npm init -y
npm install react react-dom remotion @remotion/cli @remotion/bundler @remotion/renderer @remotion/media-utils typescript @types/react --registry=https://registry.npmmirror.com

cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
EOF
```

### Step 2: 放入素材

```
my-video/
├── input/
│   └── your-video.mp4          ← 你的口播视频
├── public/
│   ├── fonts/
│   │   ├── LXGWWenKai-Regular.ttf
│   │   └── ChakraPetch-SemiBold.ttf
│   ├── music/
│   │   └── bgm.mp3             ← BGM（可选，有默认）
│   ├── images/                 ← AI 自动搜图放这里
│   └── videos/                 ← AI 自动搜视频放这里
└── src/
    ├── index.ts
    ├── Root.tsx
    ├── Composition.tsx
    ├── subtitles.ts
    └── subtitles.json
```

### Step 3: 视频转码

H.265（大部分手机录制）需转 H.264：

```bash
ffmpeg -i input/your-video.mp4 -c:v libx264 -crf 18 -preset fast -c:a aac -b:a 128k public/input-video.mp4

# 检查时长（后面要用）
ffprobe -v error -show_entries format=duration -of csv=p=0 public/input-video.mp4
```

### Step 4: Whisper 提取时间戳

```bash
pip install faster-whisper
```

```python
# run_whisper.py
from faster_whisper import WhisperModel
import json

model = WhisperModel("base", device="cuda")  # 没 GPU 改成 device="cpu"
segments, info = model.transcribe("public/input-video.mp4", language="zh")

result = [{"start": s.start, "end": s.end, "text": s.text} for s in segments]
with open("whisper_output.json", "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print(f"识别完成：{len(result)} 个片段")
```

### Step 5: 字幕对齐

核心思路：Whisper 识别对的句子当锚点，识别错的按字数在锚点间插值。

1. 对比 `whisper_output.json` 和你的稿子
2. Whisper 识别正确的句子 → 直接用它的时间戳
3. Whisper 识别错误的句子 → 按字数在两个锚点之间插值
4. 长句可以拆成两句分别跟踪
5. 每句最少 0.3 秒，不能有重叠

```bash
cp subtitles.json src/subtitles.json
```

### Step 6: AI 分析 + 搜图 + 更新代码

这一步由 AI 自动完成：

1. **分析稿子**：为每句话判断是否需要配图
2. **搜图下载**：根据说话内容搜索精准对应的图片
3. **更新 SCHEDULE**：把图片/视频调度表写入 `Composition.tsx`
4. **更新 KW**：把关键词高亮分类写入 `Composition.tsx`

### Step 7: 渲染输出

```bash
# 更新 Root.tsx 中的 durationInFrames（视频秒数 × 30）
TMPDIR=/tmp npx remotion render src/index.ts main output.mp4 --codec h264
```

渲染完成后，`output.mp4` 就是你的成品视频。

</details>

---

## 📁 文件结构

```
koubo-skill/
├── README.md                     ← 你在看的这个文件
├── LICENSE                       ← MIT 许可证
├── koubo.skill                   ← Skill 主文档（AI 读这个）
├── templates/
│   ├── Composition.tsx           ← Remotion 主组件模板
│   ├── Root.tsx                  ← Remotion Root 模板
│   └── subtitles.ts              ← 字幕类型定义
├── scripts/
│   ├── align_subtitles.py        ← 字幕对齐脚本
│   ├── init_project.sh           ← 项目初始化脚本
│   └── run_whisper.py            ← Whisper 运行脚本
└── references/
    ├── keyword-highlight.md      ← 关键词高亮系统说明
    ├── image-download-workflow.md ← 图片搜索策略
    └── pitfalls.md               ← 常见问题排查
```

---

## ❓ FAQ

<details>
<summary><strong>Q: 没有 GPU 能用吗？</strong></summary>

能。Whisper base 模型在 CPU 上也能跑，只是慢一些（2 分钟视频大概 3-5 分钟）。Remotion 渲染不需要 GPU。
</details>

<details>
<summary><strong>Q: 视频是什么格式都行吗？</strong></summary>

输入任意格式，但 H.265 编码的需要先转 H.264（ffmpeg 一行命令搞定）。H.264、VP9 等可以直接用。
</details>

<details>
<summary><strong>Q: 字幕时间不准怎么办？</strong></summary>

Whisper base 的时间戳是粗略的，需要手动校准。AI 会自动做锚点+插值对齐，但建议人工检查关键句子的时间。
</details>

<details>
<summary><strong>Q: 图片是自动找的吗？</strong></summary>

是的。AI 分析你的稿子内容，自动搜索对应图片。品牌名搜品牌图，场景描述搜场景图，抽象概念搜视觉隐喻。
</details>

<details>
<summary><strong>Q: 能换个 BGM 吗？</strong></summary>

能。把你的 BGM 文件放到 `public/music/` 目录，然后修改 `Composition.tsx` 中的文件名。
</details>

<details>
<summary><strong>Q: 能改字幕样式吗？</strong></summary>

模板参数是锁死的（60px 居中、半透明背景等）。如需自定义，直接编辑 `Composition.tsx` 中对应的位置。
</details>

<details>
<summary><strong>Q: 渲染很慢怎么办？</strong></summary>

2 分钟视频在 RTX 4070 上大概 3-5 分钟。没有 GPU 会更慢。可以降低帧率（fps）或分辨率来加速，但会损失质量。
</details>

<details>
<summary><strong>Q: 支持英文稿子吗？</strong></summary>

目前模板针对中文优化（LXGW WenKai 字体）。英文稿子需要换字体，并调整 whisper 的 `language` 参数。
</details>

<details>
<summary><strong>Q: 怎么批量生成多个视频？</strong></summary>

每个视频需要独立的项目目录。可以写脚本循环执行 Step 3-7。
</details>

---

## 🛠 技术栈

| 技术 | 用途 |
|------|------|
| [Remotion](https://remotion.dev) v4 | 用 React 写视频 |
| [faster-whisper](https://github.com/SYSTRAN/faster-whisper) | 语音识别提取时间戳 |
| React 18 + TypeScript | UI 框架 + 类型安全 |
| ffmpeg | 视频转码 |
| Node.js + npm | 运行时 + 包管理 |

---

## 🤝 贡献

欢迎任何形式的贡献！

1. **Fork** 本仓库
2. 创建你的分支：`git checkout -b feature/amazing-feature`
3. 提交你的改动：`git commit -m 'feat: add amazing feature'`
4. 推送到远程：`git push origin feature/amazing-feature`
5. 提交 **Pull Request**

如果你有任何想法、建议或 Bug 报告，欢迎提交 [Issue](https://github.com/christopher47634/koubo-skill/issues)。

---

## 📄 许可

本项目基于 [MIT License](LICENSE) 开源。

自由使用、修改、分发。

---

## 🙏 致谢

- [Remotion](https://www.remotion.dev) — 用 React 写视频的框架
- [LXGW WenKai](https://github.com/lxgw/LxgwWenKai) — 开源中文字体
- [faster-whisper](https://github.com/SYSTRAN/faster-whisper) — 高性能 Whisper 实现
- [Hermes Agent](https://hermes-agent.nousresearch.com) — AI 自动化助手

---

<div align="center">

*Made with ❤️ by 百灵鸟 (Songbird)*

</div>
