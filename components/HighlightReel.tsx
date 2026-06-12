import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const HighlightReel: React.FC<{
  items: { text: string; icon?: string; highlight?: boolean }[];
  side: "left" | "right";
  width?: number;
  enterFrame: number;
  exitFrame: number;
}> = ({ items, side, width, enterFrame, exitFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < enterFrame - 3 || frame > exitFrame) return null;
  const local = frame - enterFrame + 3;
  const dir = side === "left" ? -1 : 1;

  const slide = spring({ frame: local, fps, config: { damping: 15, stiffness: 100 } });
  const fade = interpolate(frame, [exitFrame - 14, exitFrame], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const w = width || (side === "left" ? 480 : 640);
  const pos = side === "left" ? { left: 40 } : { right: 40 };

  return (
    <div style={{
      position: "absolute", ...pos, top: 60, zIndex: 65, width: w,
      opacity: fade, transform: `translateX(${(1 - slide) * 25 * dir}px)`,
    }}>
      <div style={{
        borderRadius: 24, padding: 1,
        background: "linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.03))",
      }}>
        <div style={{
          background: "rgba(15,15,20,0.78)",
          backdropFilter: "blur(40px) saturate(180%)",
          borderRadius: 19, padding: "28px 26px",
          boxShadow: "0 24px 64px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
        }}>
          {items.map((item, i) => {
            const delay = i * 5;
            const si = clamp01((local - delay) / 10);
            const isHl = item.highlight;
            return (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 18,
                padding: "18px 20px", marginBottom: i < items.length - 1 ? 6 : 0,
                borderRadius: 14,
                background: isHl ? "rgba(96,165,250,0.06)" : "rgba(255,255,255,0.02)",
                border: isHl ? "1px solid rgba(96,165,250,0.15)" : "0.5px solid rgba(255,255,255,0.04)",
                opacity: si,
                transform: `translateX(${(1 - si) * 10}px)`,
              }}>
                {/* 选中指示器 */}
                <div style={{
                  width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
                  background: isHl ? "#60A5FA" : "rgba(255,255,255,0.15)",
                  boxShadow: isHl ? "0 0 8px rgba(96,165,250,0.4)" : "none",
                }} />
                {item.icon && <span style={{ fontSize: 22, flexShrink: 0 }}>{item.icon}</span>}
                <span style={{
                  fontFamily: "'LXGW WenKai', sans-serif",
                  fontSize: isHl ? 19 : 17,
                  color: isHl ? "#E8E8E8" : "rgba(255,255,255,0.55)",
                  fontWeight: isHl ? 500 : 400,
                  lineHeight: 1.5,
                }}>{item.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

function clamp01(v: number) { return Math.min(Math.max(v, 0), 1); }
