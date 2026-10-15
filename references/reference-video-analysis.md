# 参考视频调研

用户给出参考视频（抖音 / B 站 / YouTube 链接）要求「做成这样」时使用。不要反问「你的输入是什么」——输入已由 SKILL.md 定义（口播视频 + 稿子）。

## 原则

调研清楚再动手：BGM、音效、节奏、动画、UI 都要分析，不能只扫几帧。

## 流程

1. 下载或在浏览器打开参考视频。
2. 逐段取帧：能拿到文件就用 ffmpeg 抽帧（`ffmpeg -i ref.mp4 -vf fps=1/3 ref_%03d.png`）；只能在线看时再用截屏。
3. 逐帧分析：
   - 文字叠加：字体、大小、颜色、位置、背景
   - UI 组件：标签、卡片、聊天窗、手机浮窗
   - 动画：元素出现/消失的规律与时机
   - 字幕格式：单行/双行、语言
   - 色彩：主色调与强调色
4. 音频：ffmpeg 提取音轨，分析 BGM 与音效节奏。
5. 汇总规律：哪些组件固定，哪些随内容变化。
6. 对比现有管线与组件库，列出 gap，再与用户确认需求。

## 做组件前先调研 GitHub

新组件 / 新风格先搜成熟实现，常用关键词：`remotion template`、`glassmorphism react`、`macos window css`、`spring animation config`、`video overlay design`。调研笔记见 `component-design-notes.md`。
