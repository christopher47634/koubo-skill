import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

export const FloatingIcons: React.FC<{
  icons: { emoji: string; x: number; y: number; size?: number; delay?: number }[];
  enterFrame: number;
  exitFrame: number;
}> = ({ icons, enterFrame, exitFrame }) => {
  const frame = useCurrentFrame();
  if (frame < enterFrame - 5 || frame > exitFrame) return null;
  const local = frame - enterFrame + 5;
  const fade = interpolate(frame, [exitFrame - 15, exitFrame], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 5, pointerEvents: "none", opacity: fade }}>
      {icons.map((ic, i) => {
        const d = (ic.delay || 0) + i * 8;
        const si = clamp01((local - d) / 15);
        const floatY = Math.sin((local + i * 40) * 0.03) * 8;
        const floatX = Math.cos((local + i * 30) * 0.025) * 5;
        const rotate = Math.sin((local + i * 50) * 0.02) * 10;
        return (
          <div key={i} style={{
            position: "absolute",
            left: `${ic.x}%`, top: `${ic.y}%`,
            fontSize: ic.size || 28,
            opacity: si * 0.15,
            transform: `translate(${floatX}px, ${floatY}px) rotate(${rotate}deg) scale(${si})`,
          }}>{ic.emoji}</div>
        );
      })}
    </div>
  );
};

function clamp01(v: number) { return Math.min(Math.max(v, 0), 1); }
