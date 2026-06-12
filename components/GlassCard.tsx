import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { ui } from "./designTokens";

export const GlassCard: React.FC<{
  children: React.ReactNode;
  side: "left" | "right";
  width?: number;
  enterFrame: number;
  exitFrame: number;
  accentColor?: string;
}> = ({ children, side, width, enterFrame, exitFrame, accentColor = "rgba(125,211,252,0.45)" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < enterFrame - 3 || frame > exitFrame) return null;
  const local = frame - enterFrame + 3;
  const dir = side === "left" ? -1 : 1;

  const slide = spring({ frame: local, fps, config: { damping: 15, stiffness: 100, mass: 1.0 } });
  const fade = interpolate(frame, [exitFrame - 14, exitFrame], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const float = Math.sin(local * 0.035) * 2;

  const w = width || (side === "left" ? 480 : 640);
  const pos = side === "left" ? { left: 40 } : { right: 40 };

  return (
    <div style={{
      position: "absolute", ...pos, top: 60 + float, zIndex: 65,
      opacity: fade,
      transform: `translateX(${(1 - slide) * 25 * dir}px)`,
      width: w,
    }}>
      <div style={{
        borderRadius: ui.radius.xl, padding: 1,
        background: `linear-gradient(135deg, ${accentColor}, rgba(255,255,255,0.11) 38%, rgba(196,181,253,0.16))`,
        boxShadow: `0 0 34px ${accentColor.replace("0.45", "0.10")}`,
      }}>
        <div style={{
          ...ui.glass,
          position: "relative", overflow: "hidden",
          border: "none",
          borderRadius: 25,
          padding: "34px 34px",
        }}>
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "radial-gradient(circle at 12% 0%, rgba(125,211,252,0.10), transparent 35%), linear-gradient(115deg, rgba(255,255,255,0.045), transparent 35%)",
          }} />
          <div style={{ position: "relative" }}>
          {children}
          </div>
        </div>
      </div>
    </div>
  );
};
