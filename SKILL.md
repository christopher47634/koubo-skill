---
name: remotion-oral-video
description: "Mode1 口播视频生产：用户提供真人口播视频和稿子，AI 自动完成转码、Whisper 时间戳对齐、真实素材调研、Remotion 组件排期、中英双语字幕、HUD、BGM、SFX、渲染和质检。适用于口播视频、口播 Skill、Mode1、真人视频加字幕和信息组件等请求。沿用已验证的 Remotion 组件固有尺寸，空间不足时优先缩放或重构人物画面；字幕必须位于全局最高层。不要用于只有稿子的 Mode2。"
---

# 口播视频生产 (Remotion, Mode1)

用户只提供两样东西：**稿子（纯文本）** 和 **口播视频（MP4）**。搜图、字幕对齐、插入点分析、渲染全部由 AI 完成。

## 何时使用

- 触发：口播视频、Mode1、真人视频加字幕 / 信息组件 / HUD / BGM。
- 不适用：只有稿子、没有真人视频（Mode2，用 HyperFrames，见 `references/hyperframes-comparison.md`）。

## 两种工作模式（先判断用户要哪种）

| 用户说 | 做什么 | 不做什么 |
|--------|--------|----------|
| 「扩充组件库」 | 只更新 `components/` 与音效 | 不渲染视频 |
| 「做个视频看看」 | 走完整 7 步，渲染并交付 | — |
| 「检查一下效果」 | ffmpeg 从成片抽帧逐帧检查 | 不截桌面 |
| 「调研一下」 | 搜 GitHub / 分析参考视频 | 不动手做 |

新组件 / 新风格动手前必须先调研，流程见 `references/reference-video-analysis.md`。

## 目录与产物

| 路径 | 作用 |
|------|------|
| `templates/` | 项目模板：Composition / Root / index / subtitles / package.json（锁 remotion 4.0.290）/ tsconfig |
| `components/` | 51 个组件，统一从 `components/index.ts` 导出；`designTokens.ts` 管字号、间距、配色、缩放 |
| `assets/sfx/` | 32 个 ffmpeg 合成音效（BGM 需自备，见 `assets/README.md`） |
| `scripts/` | `init_project.sh`、`run_whisper.py`、`align_subtitles.py`、`typecheck.sh`、`package.sh` |
| `references/` | 详细规格与踩坑，见文末索引 |

## 硬约束（最高优先级）

1. **字幕全局最高层**：`SubtitleOverlay` 用 `SUBTITLE_Z_INDEX = 1000`，REC、扫描线、通知、组件、图片、视频都必须低于它。字幕压住人物嘴部时调人物构图或字幕纵向位置，不降层级、不压缩字幕字号。
2. **尊重组件固有尺寸**：不批量缩放、不重写组件尺寸。需要整体放大 / 缩小，只改 `components/designTokens.ts` 的 `scale = { font, space }`。
3. **空间不足先调人物**：对真人视频缩放、裁切、位移，为组件留位。
4. **布局参考区**：左侧约 1/4、右侧约 1/3 画宽是选位参考，不是宽度上限。人物偏左放右侧，偏右放左侧；内容互补时左右可同时出现，冲突才错开。
5. **内容严格对应稿子**：卡片、列表、聊天窗的每一项都要直接反映口播内容，不用泛泛占位文字。
6. **科技感**：毛玻璃 + 精细边框 + 发光 + monospace，不是白底卡片；配色以电光蓝 `#00D4FF` 为主，禁用品红 `#FF006E`。
7. **调研清楚再做**：没调研参考视频 / GitHub 实现就不要动手。
8. **一次只改一个变量**：每改一个参数就重渲一版让用户确认。
9. 模板中「锁死」部分（HUD、字幕样式、BGM 音量 0.08、口播原声 1.0）不因内容而改；AI 只填 `SCHEDULE` 和 `KW` 两个区域。
10. 图片版权：商用 / 公开发布前注意授权，见 `references/image-download-workflow.md`。

## 两种视觉风格

- **赛博风（默认）**：科技 / 硬核内容，带 HUD 四角框、REC、扫描线、帧数。
- **干净风**：商务 / 科普 / 日常，去掉上述装饰，柔和圆角与阴影。

参数对比见 `references/template-spec.md`、`references/clean-style-template.md`。

## 主流程（7 步）

命令与规则细节全部在 `references/workflow-details.md`。

1. **环境准备**：`bash scripts/init_project.sh <项目目录>`。字体、BGM 用环境变量 `KOUBO_FONT_DIR`、`KOUBO_BGM` 指定；缺失只警告不中断。
2. **视频转码**：H.265 必须转 H.264（`ffmpeg ... public/input-video.mp4`），用 ffprobe 取时长，写入 `Root.tsx` 的 `DURATION_SECONDS`。
3. **Whisper 时间戳**：`python scripts/run_whisper.py`（`--device auto` 自动 CUDA → CPU 回退）。时间戳做锚点，文字用稿子。
4. **字幕对齐**：识别对的句子当锚点，识别错的按字数插值；每句 >= 0.3s 且无重叠。把 `[文字, start, end]` 数组写成 alignment.json，运行 `python scripts/align_subtitles.py alignment.json subtitles.json`，再复制到 `src/subtitles.json`。
5. **插入点分析 + 搜图**：
   - 5a 判断哪些句子配图 / 双图序列 / 视频；后半段更密，图片必须一眼对应那句话。
   - 5b AI 自行搜索下载（用户不提供图片），来源与版权见 `image-download-workflow.md`。
   - 5c 生成 `SCHEDULE`（`subIdx` 对应字幕 index）。
   - 5d 填 `KW` 关键词分类（tool / concept / platform / trap / money）。
6. **渲染**：`TMPDIR=/tmp npx remotion render src/index.ts main out/output.mp4 --codec h264`；OOM 时加 `--concurrency 1`。Composition ID 是 `main`。
7. **交付与质检**：成片抽帧逐帧检查；备份源码与素材；临时图片待用户确认后删除。

## 反馈迭代

字幕不准改 subtitles.json；图不对换图并改 `SCHEDULE.src`；加减图改 `SCHEDULE`；字幕拆分要同步后续 index 与 `subIdx`。完整对照表见 `references/workflow-details.md`。

## 规划层

收到课程脚本时先读 `references/course-video-planning.md`（脚本审计、生产方式决策树、冲突检测、课程漏斗）。

## 质量与打包命令

```bash
bash scripts/typecheck.sh          # 拼出临时项目并 tsc --noEmit
bash scripts/package.sh            # 生成 dist/koubo.skill（zip，含 SKILL.md/scripts/components/templates/assets/references）
```

## 快速检查清单

- [ ] 稿子完整、口播视频在 `input/`，已转 H.264
- [ ] Whisper 时间戳可用，`subtitles.json` 已复制到 `src/`
- [ ] `SCHEDULE.subIdx` 与字幕 index 对应，图片指向性强
- [ ] 字体在 `public/fonts/`，BGM 在 `public/music/track-32.mp3`
- [ ] `DURATION_SECONDS` 已更新，渲染前设 `TMPDIR=/tmp`
- [ ] 字幕层级 1000，其余层级不超过

## 参考资料索引

| 文件 | 内容 |
|------|------|
| `references/workflow-details.md` | 7 步命令、反馈迭代、管线验证、WSL 注意事项 |
| `references/template-spec.md` | 模板规格、层级、字幕样式、高亮色、叠加参数、组件设计规范 |
| `references/sfx.md` | 音效规则、组件映射、ffmpeg 合成命令、BGM |
| `references/subtitle-layout-contract.md` | 字幕数据与布局契约 |
| `references/ui-component-library.md` / `tech-components-guide.md` | 组件清单与科技感编排 |
| `references/component-design-notes.md` | GitHub 调研笔记 |
| `references/clean-style-template.md` / `keyword-highlight.md` | 干净风参数、关键词高亮 |
| `references/reference-video-analysis.md` | 参考视频调研流程 |
| `references/course-video-planning.md` | 课程脚本规划 |
| `references/image-download-workflow.md` | 搜图下载与版权提醒 |
| `references/pitfalls.md` | 常见问题与踩坑 |
| `references/hyperframes-comparison.md` / `tts-landscape.md` | Mode2 对比、TTS 选型 |
| `references/github-push-from-wsl.md` | WSL 下推 GitHub |
