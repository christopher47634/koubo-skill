import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const ProgressBar: React.FC<{
  value: number;
  label?: string;
  color?: string;
  enterFrame: number;
  exitFrame: number;
}> = ({ value, label, color = "#7DD3FC", enterFrame, exitFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < enterFrame - 3 || frame > exitFrame) return null;
  const local = frame - enterFrame + 3;

  const progress = spring({ frame: local, fps, config: { damping: 20, stiffness: 60 } });
  const fade = interpolate(frame, [exitFrame - 10, exitFrame], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ opacity: fade, width: "100%" }}>
      {label && (
        <div style={{
          fontFamily: "'ChakraPetch', -apple-system, sans-serif",
          fontSize: 15, color: "rgba(255,255,255,0.45)", marginBottom: 8, letterSpacing: 1,
          display: "flex", justifyContent: "space-between",
        }}>
          <span>{label}</span>
          <span>{Math.round(value * progress)}%</span>
        </div>
      )}
      <div style={{
        width: "100%", height: 9, borderRadius: 6,
        background: "rgba(255,255,255,0.06)",
        border: "0.5px solid rgba(255,255,255,0.06)",
        boxShadow: "inset 0 1px 3px rgba(0,0,0,0.32)",
        overflow: "hidden",
      }}>
        <div style={{
          width: `${Math.min(value * progress, 100)}%`, height: "100%", borderRadius: 6,
          background: `linear-gradient(90deg, ${color}99, ${color})`,
          boxShadow: `0 0 14px ${color}66, inset 0 1px 0 rgba(255,255,255,0.34)`,
        }} />
      </div>
    </div>
  );
};
