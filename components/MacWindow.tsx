import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { ui } from "./designTokens";

export const MacWindow: React.FC<{
  title: string;
  children: React.ReactNode;
  side: "left" | "right";
  width?: number;
  height?: number;
  enterFrame: number;
  exitFrame: number;
}> = ({ title, children, side, width, height, enterFrame, exitFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < enterFrame - 4 || frame > exitFrame) return null;
  const local = frame - enterFrame + 4;
  const dir = side === "left" ? -1 : 1;

  const slide = spring({ frame: local, fps, config: { damping: 14, stiffness: 85, mass: 1.0 } });
  const fade = interpolate(frame, [exitFrame - 15, exitFrame], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const float = Math.sin(local * 0.035) * 2;

  const w = width || (side === "left" ? 520 : 680);
  const h = height || 420;
  const pos = side === "left" ? { left: 40 } : { right: 40 };

  return (
    <div style={{
      position: "absolute", ...pos, top: 50 + float, zIndex: 65,
      opacity: fade,
      transform: `translate(${(1 - slide) * 30 * dir}px, ${(1 - slide) * 12}px)`,
      width: w,
    }}>
      <div style={{
        borderRadius: 12, overflow: "hidden",
        boxShadow: "0 40px 90px rgba(0,0,0,0.5), 0 14px 34px rgba(0,0,0,0.34), 0 0 0 0.5px rgba(255,255,255,0.10), 0 0 32px rgba(125,211,252,0.06)",
        background: ui.colors.surfaceStrong,
        backdropFilter: "blur(40px) saturate(180%)",
        WebkitBackdropFilter: "blur(40px) saturate(180%)",
      }}>
        {/* 标题栏 */}
        <div style={{
          padding: "0 20px", height: 62,
          display: "flex", alignItems: "center", gap: 10,
          background: "linear-gradient(180deg, rgba(63,68,80,0.72), rgba(34,38,48,0.68))",
          borderBottom: "0.5px solid rgba(255,255,255,0.08)",
        }}>
          {/* 红黄绿灯 */}
          <div style={{ display: "flex", gap: 10, marginRight: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FF5F57", border: "0.5px solid #E14640", boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.12)" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#FEBC2E", border: "0.5px solid #DFA123", boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.12)" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28C840", border: "0.5px solid #1DAD2B", boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.12)" }} />
          </div>
          <span style={{
            flex: 1, textAlign: "center",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
            fontSize: 16, color: "rgba(255,255,255,0.65)", fontWeight: 500, letterSpacing: 0.2,
          }}>{title}</span>
          <div style={{ width: 54 }} />
        </div>
        {/* 内容区 */}
        <div style={{ height: h, overflow: "hidden" }}>{children}</div>
      </div>
    </div>
  );
};
