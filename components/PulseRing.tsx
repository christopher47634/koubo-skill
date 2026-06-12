import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

export const PulseRing: React.FC<{
  x: string;
  y: string;
  color?: string;
  maxSize?: number;
  duration?: number;
  enterFrame: number;
  exitFrame: number;
}> = ({ x, y, color = "#00D4FF", maxSize = 200, duration = 60, enterFrame, exitFrame }) => {
  const frame = useCurrentFrame();
  if (frame < enterFrame || frame > exitFrame) return null;
  const local = frame - enterFrame;
  const fade = interpolate(frame, [exitFrame - 15, exitFrame], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // 多层脉冲
  const rings = [0, 0.3, 0.6].map(offset => {
    const prog = ((local / duration + offset) % 1);
    return {
      size: prog * maxSize,
      opacity: (1 - prog) * 0.4,
    };
  });

  return (
    <div style={{
      position: "absolute", left: x, top: y, zIndex: 3,
      transform: "translate(-50%, -50%)", opacity: fade,
    }}>
      {rings.map((ring, i) => (
        <div key={i} style={{
          position: "absolute",
          left: "50%", top: "50%",
          width: ring.size, height: ring.size,
          borderRadius: "50%",
          border: `1px solid ${color}`,
          opacity: ring.opacity,
          transform: "translate(-50%, -50%)",
          boxShadow: `0 0 ${ring.size * 0.1}px ${color}22`,
        }} />
      ))}
      {/* 中心点 */}
      <div style={{
        width: 4, height: 4, borderRadius: "50%",
        background: color,
        boxShadow: `0 0 12px ${color}, 0 0 24px ${color}44`,
      }} />
    </div>
  );
};
