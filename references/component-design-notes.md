# GitHub 调研笔记：Remotion UI 组件设计

## 最佳实现参考

### Spring 动画配置
- **来源**：remotion repo examples, framer-motion docs
- 最佳缓动曲线：`cubic-bezier(0.16, 1, 0.3, 1)`（Apple 平滑减速）
- Spring 配置档位：
  - 轻柔：`damping: 20, stiffness: 60, mass: 1.2`（进度条、淡入）
  - 标准：`damping: 15, stiffness: 100, mass: 1.0`（卡片、窗口）
  - 弹性：`damping: 12, stiffness: 150, mass: 0.8`（标签、徽章）

### 毛玻璃 Glassmorphism 模式
- **来源**：linear.app, vercel.com, raycast.com
- `backdrop-filter: blur(40px) saturate(180%)`
- `inset 0 1px 0 rgba(255,255,255,0.12)` 顶部高光
- `inset 0 -1px 0 rgba(0,0,0,0.1)` 底部阴影
- 渐变边框：外层 `padding:1px` + `background: linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.03))`
- 精细边框：`0.5px solid rgba(255,255,255,0.1)`（不是 1px）

### macOS 窗口还原
- **来源**：macos-sonoma-css, mac-style repo
- 红黄绿灯颜色：`#FF5F57` / `#FEBC2E` / `#28C840`
- 标题栏高度：52px
- `inset box-shadow` 模拟深度
- `border: 0.5px solid rgba(255,255,255,0.08)`

### 列表/卡片设计
- **来源**：Linear, Vercel, Raycast
- 每行独立卡片背景 `rgba(255,255,255,0.03)` + 0.5px 边框
- 图标容器：36x36, borderRadius: 8
- 左侧强调色条（LowerThird 用法）
- 子项交错：每项 3-4 帧延迟

### 配色方案（5 套暗色）
1. **Void**：`#0A0A0F` 背景 + `#F5F5F7` 文字
2. **Midnight**：`#0D1117` 背景 + `#C9D1D9` 文字
3. **Obsidian**：`#1A1A2E` 背景 + `#E0E0E0` 文字
4. **Carbon**：`#161616` 背景 + `#FAFAFA` 文字
5. **Deep Ocean**：`#0B1622` 背景 + `#D4E5F7` 文字

### 字体推荐
- 技术：JetBrains Mono
- 系统：SF Pro / Inter
- 标题：Space Grotesk
- 中文：LXGW WenKai / Noto Sans SC

### 音效设计
- 所有 SFX 用 ffmpeg 合成，无需外部素材
- 音频领先视觉 2 帧（人耳感知比视觉快）
- 科技感音效：短促（0.03-0.2s）、高频（>1000Hz）、干净（高通滤波）
- Mixkit 免费 SFX 可直接下载（无归属要求）但需翻墙
