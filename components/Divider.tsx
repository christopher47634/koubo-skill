import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

export const Divider: React.FC<{
  width?: string;
  color?: string;
  enterFrame: number;
  exitFrame: number;
}> = ({ width = "60%", color = "rgba(255,255,255,0.08)", enterFrame, exitFrame }) => {
  const frame = useCurrentFrame();
  if (frame < enterFrame - 3 || frame > exitFrame) return null;
  const local = frame - enterFrame + 3;
  const fade = interpolate(frame, [exitFrame - 10, exitFrame], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const lineW = interpolate(clamp01(local / 20), [0, 1], [0, 100]);

  return (
    <div style={{
      display: "flex", justifyContent: "center", opacity: fade, padding: "12px 0",
    }}>
      <div style={{
        width: `${lineW}%`, maxWidth: width, height: 1,
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        borderRadius: 1,
      }} />
    </div>
  );
};

function clamp01(v: number) { return Math.min(Math.max(v, 0), 1); }
