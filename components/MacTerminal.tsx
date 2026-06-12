import React from "react";
import { useCurrentFrame } from "remotion";
import { MacWindow } from "./MacWindow";

export const MacTerminal: React.FC<{
  lines: { prompt?: string; text: string; type?: "input" | "output" | "success" | "error" | "comment" }[];
  title?: string;
  side: "left" | "right";
  width?: number;
  height?: number;
  enterFrame: number;
  exitFrame: number;
}> = ({ lines, title = "Terminal", side, width, height, enterFrame, exitFrame }) => {
  const frame = useCurrentFrame();
  if (frame < enterFrame - 4 || frame > exitFrame) return null;
  const local = frame - enterFrame + 4;

  const colorMap = {
    input: "#E0E0E0",
    output: "#A0A0A0",
    success: "#4ADE80",
    error: "#F87171",
    comment: "#6B7280",
  };

  return (
    <MacWindow title={title} side={side} width={width} height={height} enterFrame={enterFrame} exitFrame={exitFrame}>
      <div style={{
        padding: "20px 22px",
        fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', 'JetBrains Mono', monospace",
        fontSize: 16, lineHeight: 1.75,
        background: "rgba(18,18,22,0.95)",
      }}>
        {lines.map((line, i) => {
          const delay = i * 3;
          const si = clamp01((local - delay) / 6);
          const color = colorMap[line.type || "output"];
          return (
            <div key={i} style={{
              opacity: si,
              transform: `translateY(${(1 - si) * 3}px)`,
              color, whiteSpace: "pre-wrap",
            }}>
              {line.prompt && (
                <span style={{ color: "#4ADE80", marginRight: 8, userSelect: "none" }}>{line.prompt}</span>
              )}
              {line.text}
            </div>
          );
        })}
        {/* 光标 */}
        <span style={{
          display: "inline-block", width: 8, height: 17,
          background: "#4ADE80", marginLeft: 2, verticalAlign: "text-bottom",
          opacity: Math.sin(local * 0.15) > 0 ? 1 : 0,
          boxShadow: "0 0 6px rgba(74,222,128,0.4)",
        }} />
      </div>
    </MacWindow>
  );
};

function clamp01(v: number) { return Math.min(Math.max(v, 0), 1); }
