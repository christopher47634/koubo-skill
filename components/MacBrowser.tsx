import React from "react";
import { useCurrentFrame } from "remotion";
import { MacWindow } from "./MacWindow";

export const MacBrowser: React.FC<{
  url: string;
  title?: string;
  children: React.ReactNode;
  side: "left" | "right";
  width?: number;
  height?: number;
  enterFrame: number;
  exitFrame: number;
}> = ({ url, title, children, side, width, height, enterFrame, exitFrame }) => {
  const frame = useCurrentFrame();
  if (frame < enterFrame - 4 || frame > exitFrame) return null;

  return (
    <MacWindow title={title || url} side={side} width={width} height={height} enterFrame={enterFrame} exitFrame={exitFrame}>
      <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#F7F8FA" }}>
        {/* 地址栏 */}
        <div style={{
          padding: "12px 16px", background: "linear-gradient(180deg, #F2F3F5, #E8EAED)",
          borderBottom: "1px solid #D8DADF", display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{ color: "#8B9098", fontSize: 15 }}>‹</span>
          <span style={{ color: "#8B9098", fontSize: 15 }}>›</span>
          <div style={{
            flex: 1, background: "rgba(255,255,255,0.88)", borderRadius: 8, padding: "8px 14px",
            border: "0.5px solid rgba(0,0,0,0.12)",
            boxShadow: "inset 0 1px 2px rgba(0,0,0,0.04)",
            fontFamily: "-apple-system, sans-serif", fontSize: 14, color: "#5F6368",
          }}>● {url}</div>
        </div>
        {/* 内容 */}
        <div style={{ flex: 1, overflow: "hidden" }}>
          {children}
        </div>
      </div>
    </MacWindow>
  );
};
