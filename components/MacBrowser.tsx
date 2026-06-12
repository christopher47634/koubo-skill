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
      <div style={{ height: "100%", display: "flex", flexDirection: "column", background: "#FFF" }}>
        {/* 地址栏 */}
        <div style={{
          padding: "12px 16px", background: "#F5F5F5",
          borderBottom: "1px solid #E0E0E0", display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{ display: "flex", gap: 5 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF5F57" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FEBC2E" }} />
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28C840" }} />
          </div>
          <div style={{
            flex: 1, background: "#FFF", borderRadius: 6, padding: "8px 14px",
            border: "1px solid #D0D0D0",
            fontFamily: "-apple-system, sans-serif", fontSize: 15, color: "#666",
          }}>🔒 {url}</div>
        </div>
        {/* 内容 */}
        <div style={{ flex: 1, overflow: "hidden" }}>
          {children}
        </div>
      </div>
    </MacWindow>
  );
};
