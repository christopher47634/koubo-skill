import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const Tag: React.FC<{
  text: string;
  icon?: string;
  enterFrame: number;
  exitFrame: number;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
  color?: string;
}> = ({ text, icon, enterFrame, exitFrame, position = "top-right", color = "rgba(255,255,255,0.55)" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < enterFrame - 2 || frame > exitFrame) return null;
  const local = frame - enterFrame + 2;

  const slide = spring({ frame: local, fps, config: { damping: 18, stiffness: 120 } });
  const fade = interpolate(frame, [exitFrame - 12, exitFrame], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulse = 1 + Math.sin(local * 0.06) * 0.01;

  const posMap = {
    "top-right": { top: 40, right: 50 },
    "top-left": { top: 40, left: 50 },
    "bottom-right": { bottom: 140, right: 50 },
    "bottom-left": { bottom: 140, left: 50 },
  };

  return (
    <div style={{
      position: "absolute", ...posMap[position], zIndex: 70,
      opacity: fade,
      transform: `translateX(${(1 - slide) * 25}px) scale(${pulse})`,
    }}>
      <div style={{
        borderRadius: 12,
        padding: 1,
        background: "linear-gradient(135deg, rgba(125,211,252,0.34), rgba(255,255,255,0.08) 42%, rgba(196,181,253,0.2))",
        boxShadow: "0 10px 34px rgba(0,0,0,0.38), 0 0 24px rgba(56,189,248,0.08)",
      }}>
        <div style={{
          position: "relative",
          display: "flex", alignItems: "center", gap: 9,
          overflow: "hidden",
          background: "linear-gradient(135deg, rgba(17,24,39,0.82), rgba(9,12,20,0.7))",
          backdropFilter: "blur(32px) saturate(180%)",
          WebkitBackdropFilter: "blur(32px) saturate(180%)",
          borderRadius: 11, padding: "13px 27px",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.2)",
        }}>
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "linear-gradient(105deg, transparent 15%, rgba(255,255,255,0.07) 46%, transparent 70%)",
            transform: `translateX(${Math.sin(local * 0.025) * 18}%)`,
          }} />
          <div style={{
            width: 5, height: 5, borderRadius: "50%",
            background: "#7DD3FC",
            boxShadow: "0 0 10px rgba(125,211,252,0.85)",
            flexShrink: 0,
          }} />
          {icon && <span style={{ fontSize: 14, color: "#C4B5FD" }}>{icon}</span>}
          <span style={{
            position: "relative",
            fontFamily: "'ChakraPetch', -apple-system, sans-serif",
            fontSize: 15, color, letterSpacing: 3, fontWeight: 600,
            textShadow: "0 0 16px rgba(125,211,252,0.12)",
          }}>{text}</span>
        </div>
      </div>
    </div>
  );
};
