import React from "react";

const COLORS: Record<string, string> = {
  tool: "#7DD3FC",
  concept: "#FCD34D",
  platform: "#C4B5FD",
  trap: "#FCA5A5",
  money: "#86EFAC",
};

// 关键词映射表 - 根据你的内容自定义
export const keywords: Record<string, keyof typeof COLORS> = {
  "AI": "concept",
  "模型": "tool",
  "ChatGPT": "tool",
  "编程": "tool",
  "代码": "tool",
};

const sorted = Object.keys(keywords).sort((a, b) => b.length - a.length);

export const highlightKeywords = (text: string): React.ReactNode[] => {
  text = text.replace(/[。.]+$/g, "");
  const parts: React.ReactNode[] = [];
  let rest = text, idx = 0;
  while (rest.length > 0) {
    let found = false;
    for (const kw of sorted) {
      if (rest.startsWith(kw)) {
        const color = COLORS[keywords[kw]] || "#FFF";
        parts.push(React.createElement("span", { key: idx++, style: { color, fontWeight: 600 } }, kw));
        rest = rest.slice(kw.length);
        found = true;
        break;
      }
    }
    if (!found) {
      parts.push(React.createElement("span", { key: idx++ }, rest[0]));
      rest = rest.slice(1);
    }
  }
  return parts;
};
