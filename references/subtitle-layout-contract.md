# Mode1 字幕与布局契约

## 字幕数据

默认使用中英双语字段；英文可选，缺失时仅渲染中文。

```ts
export interface Subtitle {
  index: number;
  text: string;
  en?: string;
  start: number;
  end: number;
}
```

```json
{
  "index": 0,
  "text": "大家好，今天聊聊 AI",
  "en": "Hey everyone, today we're talking about AI.",
  "start": 0,
  "end": 2.5
}
```

## 渲染方式

优先使用组件库的 `SubtitleOverlay`：

```tsx
<SubtitleOverlay
  text={currentSub.text}
  en={currentSub.en}
  startFrame={Math.round(currentSub.start * fps)}
  endFrame={Math.round(currentSub.end * fps)}
  highlightFn={highlight}
/>
```

- 中文：LXGW WenKai 44px。
- 英文：ChakraPetch 26px，`rgba(255,255,255,0.46)`，保持次级但可读。
- 容器：玻璃底 `rgba(0,0,0,0.42)` + `blur(16px)`。
- 层级：`SUBTITLE_Z_INDEX = 1000`，任何 UI、REC、扫描线、图片或视频都不得超过。

## 组件与人物

- 保持组件库已经验证的尺寸，不为套固定比例而缩放组件。
- 左侧约 1/4、右侧约 1/3 是放置参考区，不是组件宽度裁切规则。
- 空间不足时优先缩放、裁切或移动人物视频。
- 字幕不能被任何图层遮挡；发生冲突时调整人物构图或字幕纵向位置。
