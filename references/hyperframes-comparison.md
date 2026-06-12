# HyperFrames vs Remotion 对比

**决策结果**：Mode2（纯稿子）已选定 HyperFrames，管线已建。
- 项目: `/mnt/e/Downloads/mode2-hyperframes/`
- Skill: `mode2-hyperframes`

## 适用场景

| 场景 | 推荐工具 | 原因 |
|------|----------|------|
| 口播+字幕+配图 | Remotion | whisper 对齐、关键词高亮、赛博 HUD 已有模板 |
| 纯文字动画 | HyperFrames | 更轻量，HTML/CSS 直觉，不需要 React |
| 产品宣传片 | HyperFrames | 快速出活，AI agent 原生支持 |
| 数据可视化 | HyperFrames | HTML 天然擅长图表、动画 |
| 需要赛博风装饰 | Remotion | HUD 元素已锁死在模板里 |

## HyperFrames 核心特性

- **HTML-native**：写 HTML 定义视频，不需要 React 组件树
- **GSAP 动画**：声明式写法，比 Remotion 的 `useCurrentFrame()` 直觉
- **AI agent 友好**：HeyGen 原生支持，描述需求 → agent 写 HTML → 渲染
- **Catalog**：可复用 blocks（转场、overlay、字幕、图表、地图、效果）
- **渲染链路短**：调试快，改布局就是改 CSS

## HyperFrames 局限

- 赛博 HUD 需自己用 CSS 实现（不难，但需要手动写）
- 口播对齐（whisper 时间戳）没有内置支持
- 关键词高亮需自己实现
- 生态比 Remotion 小，社区资源少

## Chris 的决策框架（已定）

**Mode1: 口播+稿子** → Remotion（成熟管线，不要换）
**Mode2: 纯稿子** → HyperFrames（已建管线，skill `mode2-hyperframes`）
**纯稿子+赛博风** → 仍可用 Remotion 模板（HUD 已有）

## 参考链接

- HyperFrames 文档: https://hyperframes.heygen.com/introduction
- HyperFrames Playground: https://www.hyperframes.dev/
- HyperFrames Showcase: https://hyperframes.heygen.com/showcase
- Remotion 口播模板: 本 skill（remotion-oral-video）