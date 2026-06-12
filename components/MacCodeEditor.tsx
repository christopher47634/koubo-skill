import React from "react";
import { useCurrentFrame } from "remotion";
import { MacWindow } from "./MacWindow";

export const MacCodeEditor: React.FC<{
  filename: string;
  language?: string;
  code: { text: string; color?: string; highlight?: boolean }[];
  side: "left" | "right";
  width?: number;
  height?: number;
  enterFrame: number;
  exitFrame: number;
}> = ({ filename, language, code, side, width, height, enterFrame, exitFrame }) => {
  const frame = useCurrentFrame();
  if (frame < enterFrame - 4 || frame > exitFrame) return null;
  const local = frame - enterFrame + 4;

  return (
    <MacWindow title={`${filename}${language ? ` — ${language}` : ""}`} side={side} width={width} height={height} enterFrame={enterFrame} exitFrame={exitFrame}>
      <div style={{ display: "flex", height: "100%", background: "rgba(18,18,22,0.95)" }}>
        {/* 行号 */}
        <div style={{
          padding: "20px 0", minWidth: 44,
          textAlign: "right", paddingRight: 14,
          borderRight: "1px solid rgba(255,255,255,0.05)",
          background: "rgba(0,0,0,0.15)",
        }}>
          {code.map((_, i) => (
            <div key={i} style={{
              fontFamily: "'SF Mono', 'JetBrains Mono', monospace",
              fontSize: 15, lineHeight: 1.75,
              color: "rgba(255,255,255,0.18)",
            }}>{i + 1}</div>
          ))}
        </div>
        {/* 代码 */}
        <div style={{ padding: "20px 18px", flex: 1, overflow: "hidden" }}>
          {code.map((line, i) => {
            const delay = i * 2;
            const si = clamp01((local - delay) / 5);
            return (
              <div key={i} style={{
                fontFamily: "'SF Mono', 'Fira Code', 'JetBrains Mono', monospace",
                fontSize: 16, lineHeight: 1.75,
                color: line.color || "#D4D4D4",
                background: line.highlight ? "rgba(255,255,255,0.04)" : "transparent",
                opacity: si,
                transform: `translateX(${(1 - si) * 5}px)`,
                borderRadius: 3,
                padding: line.highlight ? "1px 6px" : undefined,
                borderLeft: line.highlight ? "2px solid rgba(96,165,250,0.5)" : undefined,
              }}>{line.text || " "}</div>
            );
          })}
        </div>
      </div>
    </MacWindow>
  );
};

function clamp01(v: number) { return Math.min(Math.max(v, 0), 1); }
