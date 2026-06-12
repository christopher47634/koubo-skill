import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

export const Waveform: React.FC<{
  bars?: number;
  color?: string;
  height?: number;
  enterFrame: number;
  exitFrame: number;
}> = ({ bars = 40, color = "#7DD3FC", height = 60, enterFrame, exitFrame }) => {
  const frame = useCurrentFrame();
  if (frame < enterFrame - 3 || frame > exitFrame) return null;
  const local = frame - enterFrame + 3;
  const fade = interpolate(frame, [exitFrame - 10, exitFrame], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 2, height,
      opacity: fade,
    }}>
      {Array.from({ length: bars }).map((_, i) => {
        const delay = i * 1;
        const si = clamp01((local - delay) / 8);
        // 伪随机高度（基于sin组合）
        const h = (Math.sin(i * 0.7 + local * 0.12) * 0.4 + 0.6) * si;
        return (
          <div key={i} style={{
            width: 3, borderRadius: 2,
            height: `${h * 100}%`,
            background: `linear-gradient(to top, ${color}, ${color}66)`,
            opacity: 0.4 + h * 0.6,
            transition: "height 0.05s ease",
          }} />
        );
      })}
    </div>
  );
};

function clamp01(v: number) { return Math.min(Math.max(v, 0), 1); }
