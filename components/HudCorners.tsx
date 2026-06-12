import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

export const HudCorners: React.FC<{
  color?: string;
  size?: number;
  thickness?: number;
  opacity?: number;
  pulse?: boolean;
  enterFrame: number;
  exitFrame: number;
}> = ({ color = "#00D4FF", size = 50, thickness = 2, opacity = 0.3, pulse = true, enterFrame, exitFrame }) => {
  const frame = useCurrentFrame();
  if (frame < enterFrame - 3 || frame > exitFrame) return null;
  const local = frame - enterFrame + 3;
  const fade = interpolate(frame, [exitFrame - 12, exitFrame], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const glow = pulse ? 0.5 + Math.sin(local * 0.06) * 0.5 : 1;

  const cornerStyle = (top?: number, right?: number, bottom?: number, left?: number): React.CSSProperties => ({
    position: "absolute",
    ...(top !== undefined ? { top: 30 } : {}),
    ...(bottom !== undefined ? { bottom: 130 } : {}),
    ...(left !== undefined ? { left: 30 } : {}),
    ...(right !== undefined ? { right: 30 } : {}),
    width: size, height: size,
    borderTop: top !== undefined ? `${thickness}px solid ${color}` : "none",
    borderBottom: bottom !== undefined ? `${thickness}px solid ${color}` : "none",
    borderLeft: left !== undefined ? `${thickness}px solid ${color}` : "none",
    borderRight: right !== undefined ? `${thickness}px solid ${color}` : "none",
    opacity: opacity * fade * glow,
    filter: `drop-shadow(0 0 ${4 * glow}px ${color})`,
  });

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 4, pointerEvents: "none" }}>
      <div style={cornerStyle(30, undefined, undefined, 30)} />
      <div style={cornerStyle(30, 30, undefined, undefined)} />
      <div style={cornerStyle(undefined, undefined, 130, 30)} />
      <div style={cornerStyle(undefined, 30, 130, undefined)} />
    </div>
  );
};
