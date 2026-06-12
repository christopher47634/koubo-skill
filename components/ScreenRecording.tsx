import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const ScreenRecording: React.FC<{
  title: string;
  url?: string;
  children: React.ReactNode;
  side: "left" | "right";
  width?: number;
  height?: number;
  enterFrame: number;
  exitFrame: number;
  borderColor?: string;
}> = ({ title, url, children, side, width, height, enterFrame, exitFrame, borderColor = "rgba(125,211,252,0.32)" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < enterFrame - 4 || frame > exitFrame) return null;
  const local = frame - enterFrame + 4;
  const dir = side === "left" ? -1 : 1;

  const slide = spring({ frame: local, fps, config: { damping: 13, stiffness: 85, mass: 1.1 } });
  const fade = interpolate(frame, [exitFrame - 15, exitFrame], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const float = Math.sin(local * 0.035) * 2;

  const w = width || (side === "left" ? 520 : 680);
  const h = height || 400;
  const pos = side === "left" ? { left: 40 } : { right: 40 };

  return (
    <div style={{
      position: "absolute", ...pos, top: 50 + float, zIndex: 64,
      opacity: fade,
      transform: `translate(${(1 - slide) * 30 * dir}px, ${(1 - slide) * 10}px)`,
      width: w,
    }}>
      {/* 外框光晕 */}
      <div style={{
        borderRadius: 20, padding: 2,
        background: `linear-gradient(135deg, ${borderColor}, transparent, ${borderColor}66)`,
        boxShadow: `0 0 30px ${borderColor}22, 0 30px 60px rgba(0,0,0,0.4)`,
      }}>
        <div style={{
          background: "#1a1a2e", borderRadius: 16, overflow: "hidden",
        }}>
          {/* 顶栏 */}
          <div style={{
            padding: "18px 14px", background: "rgba(30,30,45,0.9)",
            display: "flex", alignItems: "center", gap: 10,
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}>
            <div style={{ display: "flex", gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FF5F57" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FEBC2E" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#28C840" }} />
            </div>
            <div style={{
              flex: 1, textAlign: "center",
              fontFamily: "-apple-system, sans-serif", fontSize: 15,
              color: "rgba(255,255,255,0.4)", fontWeight: 500,
            }}>{title}</div>
            <div style={{ width: 40 }} />
          </div>
          {/* 地址栏（可选） */}
          {url && (
            <div style={{
              padding: "10px 18px", background: "rgba(20,20,35,0.9)",
              borderBottom: "1px solid rgba(255,255,255,0.04)",
            }}>
              <div style={{
                background: "rgba(255,255,255,0.04)", borderRadius: 6, padding: "8px 14px",
                fontFamily: "-apple-system, sans-serif", fontSize: 14, color: "rgba(255,255,255,0.3)",
              }}>🔒 {url}</div>
            </div>
          )}
          {/* 内容 */}
          <div style={{ height: h, overflow: "hidden", position: "relative" }}>
            {children}
            {/* 录制指示器 */}
            <div style={{
              position: "absolute", top: 10, right: 12,
              display: "flex", alignItems: "center", gap: 5,
              padding: "7px 12px", borderRadius: 12,
              background: "rgba(0,0,0,0.5)",
            }}>
              <div style={{
                width: 6, height: 6, borderRadius: "50%",
                background: "#FF4444",
                boxShadow: "0 0 6px rgba(255,68,68,0.5)",
                opacity: Math.sin(local * 0.1) > 0 ? 1 : 0.3,
              }} />
              <span style={{
                fontFamily: "monospace", fontSize: 13, color: "rgba(255,255,255,0.5)",
              }}>REC</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
