import React from "react";

export const HIGHLIGHT_COLORS = {
  tool: "#7DD3FC",
  concept: "#FCD34D",
  platform: "#C4B5FD",
  trap: "#FCA5A5",
  money: "#86EFAC",
} as const;

export type HighlightCategory = keyof typeof HIGHLIGHT_COLORS;
export type KeywordMap = Record<string, HighlightCategory>;

// 默认关键词映射表 - 根据稿子内容自定义（也可在调用处传入自己的 map）
export const keywords: KeywordMap = {
  "AI": "concept",
  "模型": "tool",
  "ChatGPT": "tool",
  "编程": "tool",
  "代码": "tool",
};

export const highlightKeywords = (text: string, map: KeywordMap = keywords): React.ReactNode[] => {
  const sorted = Object.keys(map).sort((a, b) => b.length - a.length);
  const chars = Array.from(text.replace(/[。.]+$/g, ""));
  const parts: React.ReactNode[] = [];
  let i = 0;
  let idx = 0;
  while (i < chars.length) {
    const rest = chars.slice(i).join("");
    const kw = sorted.find((k) => rest.startsWith(k));
    if (kw) {
      const color = HIGHLIGHT_COLORS[map[kw]] ?? "#FFF";
      parts.push(React.createElement("span", { key: idx++, style: { color, textShadow: `0 0 8px ${color}44`, fontWeight: 600 } }, kw));
      i += Array.from(kw).length;
    } else {
      parts.push(React.createElement("span", { key: idx++ }, chars[i]));
      i += 1;
    }
  }
  return parts;
};
