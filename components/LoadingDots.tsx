import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

export const LoadingDots: React.FC<{
  text?: string;
  color?: string;
  enterFrame: number;
  exitFrame: number;
}> = ({ text = "Processing", color = "#7DD3FC", enterFrame, exitFrame }) => {
  const frame = useCurrentFrame();
  if (frame < enterFrame - 2 || frame > exitFrame) return null;
  const local = frame - enterFrame + 2;
  const fade = interpolate(frame, [exitFrame - 10, exitFrame], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 6, opacity: fade,
      fontFamily: "'JetBrains Mono', monospace", fontSize: 18, color: "rgba(255,255,255,0.5)",
    }}>
      <span>{text}</span>
      {[0, 1, 2].map(i => {
        const bounce = Math.sin((local * 0.15) + i * 1.2);
        return (
          <span key={i} style={{
            display: "inline-block", width: 4, height: 4, borderRadius: "50%",
            background: color,
            transform: `translateY(${bounce * -4}px)`,
            opacity: 0.4 + (bounce + 1) * 0.3,
          }} />
        );
      })}
    </div>
  );
};
