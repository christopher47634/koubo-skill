# 工作流细节

主流程见 SKILL.md；这里是每一步的命令与规则。下文 `$P` 指项目目录（`scripts/init_project.sh` 创建，默认 `$HOME/koubo-project`）。

## Step 1 环境准备

```bash
bash scripts/init_project.sh "$P"           # 字体 / BGM 用 KOUBO_FONT_DIR / KOUBO_BGM 指定
ls "$P"/public/fonts/LXGWWenKai-Regular.ttf "$P"/public/fonts/ChakraPetch-SemiBold.ttf
ls "$P"/public/music/track-32.mp3           # BGM 需自备
which edge-tts || pip install edge-tts      # 仅测试管线需要生成配音时
```

国内网络慢可设 `NPM_REGISTRY=https://registry.npmmirror.com`。

## Step 2 转码与时长

H.265 在浏览器/Remotion 不兼容，必须转 H.264：

```bash
ffmpeg -i input/*.mp4 -c:v libx264 -crf 18 -preset fast -c:a aac -b:a 128k public/input-video.mp4
ffprobe -v error -show_entries format=duration -of csv=p=0 public/input-video.mp4
```

把秒数写进 `src/Root.tsx` 的 `DURATION_SECONDS`（`durationInFrames = ceil(秒 * 30)`）。

## Step 3 Whisper

```bash
pip install faster-whisper
python scripts/run_whisper.py public/input-video.mp4 whisper_output.json base zh    # --device auto|cuda|cpu
```

`--device auto`（默认）优先 CUDA，不可用自动回退 CPU int8。base 模型中文文字可能不准，但时间戳基本可用：时间戳做锚点，文字用稿子。可生成 whisper 与稿子的左右对比文件，快速判断哪些句子可作锚点。

## Step 4 字幕对齐（锚点 + 插值）

1. 对比 whisper_output.json 与稿子，找出识别正确的句子，直接用其 start/end 作锚点。
2. 两个锚点之间的句子，按字数比例分配时间。
3. 字幕以「当前显示一页」为单位；过长或含两个语义的句子拆成两条，各有独立时间戳。
4. 每句 >= 0.3s，无重叠（脚本自动修复重叠）。

准备 alignment.json（`[["文字", start, end], ...]`，可用 `{"text","start","end","en"}`）：

```bash
python scripts/align_subtitles.py alignment.json subtitles.json
cp subtitles.json src/subtitles.json     # Remotion 从 src/subtitles.json 导入
```

输入为空或格式错误会给出明确报错，不再 IndexError。

## Step 5 插入点分析与素材

### 5a 分析稿子

为每句判断：是否配图（只在关键句）、单图 / 双图序列（对比、递进）/ 视频素材（需要动态）。后半段插入频率更高；图片指向性要强，必须和说的话一一对应。

### 5b 搜图下载

图片完全由 AI 搜索，用户不提供。策略：具体品牌/产品搜品牌名；人物/场景搜描述；抽象概念搜视觉隐喻；数字/金额搜相关画面。来源优先级与版权提醒见 `image-download-workflow.md`。规格：JPG，600x400~800x600 横向，临时素材定稿后删除。

### 5c 调度表

写入 Composition.tsx 的 `SCHEDULE`：

```ts
const SCHEDULE: ScheduleItem[] = [
  { type: "image", subIdx: 1, src: "/images/scam-warning.jpg", label: "SCAM" },
  { type: "image", subIdx: 23, src: "/images/gym-sales.jpg", label: "GYM" },
  { type: "image", subIdx: 23, src: "/images/money-stack.jpg", label: "SALES", delay: 1.2 }, // 双图序列
  { type: "video", subIdx: 68, src: "/videos/ai-screen.mp4", label: "AI SCREEN" },
];
```

`subIdx` 必须与 subtitles.json 的 `index` 对应。

### 5d 关键词高亮

按稿子内容填 Composition.tsx 的 `KW`，分类与颜色见 `template-spec.md`。

## Step 6 渲染

```bash
cd "$P"
TMPDIR=/tmp npx remotion render src/index.ts main out/output.mp4 --codec h264
```

Composition ID 是 `main`。耗时参考（RTX 4070）：1 分钟视频约 2 分钟，5 分钟视频约 8-12 分钟。内存不足时加 `--concurrency 1`（症状：渲染到 90%+ 被 kill）。

## Step 7 交付与质检

- 视频输出到 `$P/out/`，把成品和源码（Composition.tsx、subtitles.json、素材）备份到用户指定位置。
- 检查：ffmpeg 抽帧逐帧看（`ffmpeg -ss 12 -i out/output.mp4 -frames:v 1 f.png`），不要截桌面。
- 临时图片保留在 `public/images/`，用户确认最终版后删除。

## 反馈迭代

| 反馈 | 处理 |
|------|------|
| 字幕不准 | 改 subtitles.json 时间戳，同步到 src/，重渲染 |
| 图片不对 | 换 public/images/ 文件，更新 SCHEDULE 的 src |
| 图片大小/位置 | 改 Composition.tsx 的 width/height 或 right/top（一般不改） |
| BGM 太响/太轻 | 改 volume（默认 0.08） |
| 加图/减图 | 改 SCHEDULE |
| 字幕拆分 | subtitles.json 插入条目并更新后续 index，同步 SCHEDULE 的 subIdx |

每次只改一个变量，渲染确认后再改下一个。

## 管线验证（「洗模板」）

目标是验证流程而非做成品：

1. 测试稿子（5 句左右）+ edge-tts 生成测试音频。
2. ffmpeg 合成纯色背景视频作为「口播视频」。
3. 手写测试 subtitles.json（带 `en`）。
4. 跑 Whisper → 对齐 → 排期 → 渲染。
5. 输出给用户确认，按反馈每次只改一个变量。

成功标志：全链路输出 H.264 MP4，字幕、素材、UI 元素均可见。

## 环境注意（WSL / Windows）

1. WSL 的 TMPDIR 指向 Windows temp 会导致 webpack bundle 找不到：渲染时设 `TMPDIR=/tmp`。
2. WSL 内下载图片 SSL 不通时绕道 PowerShell `Invoke-WebRequest`（`image-download-workflow.md`）。
3. 推 GitHub 见 `github-push-from-wsl.md`。
4. 字体用 `@font-face` + `staticFile()`，不用 `@remotion/google-fonts`（见 `FontLoader`）。
5. 内置 TTS 对长中文会截断（>50 字），用 edge-tts CLI。
6. 删 node_modules 慢时从 Windows 侧 `Remove-Item -Recurse -Force`。
