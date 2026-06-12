import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

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
        borderRadius: 24, padding: 1,
        background: `linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.03))`,
      }}>
        <div style={{
          background: "rgba(15,15,20,0.75)",
          backdropFilter: "blur(40px) saturate(180%)",
          WebkitBackdropFilter: "blur(40px) saturate(180%)",
          borderRadius: 19,
          padding: "34px 34px",
          boxShadow: "0 24px 64px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.1)",
        }}>
          {children}
        </div>
      </div>
    </div>
  );
};
