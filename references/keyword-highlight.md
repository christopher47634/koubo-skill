# 关键词高亮系统

## 颜色分类

| 分类 | 颜色 | HEX | 含义 |
|------|------|-----|------|
| tool | 蓝色 | #4FC3F7 | 工具/产品名 |
| concept | 橙色 | #FFB74D | 概念/理念 |
| platform | 紫色 | #CE93D8 | 平台/场景 |
| trap | 红色 | #EF5350 | 陷阱/负面 |
| money | 黄绿色 | #A5D6A7 | 金钱/数字 |

## 匹配规则

1. 按关键词长度降序排序（避免短词误匹配长词）
2. 逐字符扫描，遇到关键词就高亮
3. 非关键词字符用 #E0E0E0 灰色
4. 句尾句号自动去除

## 新视频适配

每次新视频需要根据稿子内容更新 KW 字典：

```typescript
const KW: Record<string, string> = {
  // tool: 产品名、工具名
  ChatGPT: "tool", 豆包: "tool", Prompt: "tool",
  // concept: 抽象概念
  AI: "concept", 认知: "concept", 风口: "concept",
  // platform: 平台名、场景
  小红书: "platform", 直播: "platform", 星巴克: "platform",
  // trap: 负面词汇、讽刺
  改命: "trap", 被骗: "trap", 离谱: "trap",
  // money: 金额、数字
  月入十万: "money", 3980: "money", 4999: "money",
};
```

## 高亮样式

```typescript
{
  color: color,                    // 分类对应颜色
  textShadow: `0 0 8px ${color}44`, // 同色发光
  fontWeight: 600,                 // 加粗
}
```
