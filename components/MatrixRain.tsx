import React from "react";
import { useCurrentFrame } from "remotion";

export const MatrixRain: React.FC<{
  color?: string;
  columns?: number;
  speed?: number;
  opacity?: number;
}> = ({ color = "#00FF41", columns = 20, speed = 1, opacity = 0.08 }) => {
  const frame = useCurrentFrame();
  const chars = "0123456789ABCDEFアイウエオカキクケコ";

  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
      overflow: "hidden", opacity,
    }}>
      {Array.from({ length: columns }).map((_, i) => {
        const x = (i / columns) * 100 + (i % 2) * 2;
        const speedMult = 0.3 + (i % 5) * 0.15;
        const yOffset = (frame * speed * speedMult) % 120;
        const charCount = 6 + (i % 4);
        return (
          <div key={i} style={{
            position: "absolute", left: `${x}%`, top: `${-15 + yOffset}%`,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 15, color, lineHeight: 1.6,
            writingMode: "vertical-rl",
          }}>
            {Array.from({ length: charCount }).map((_, j) => {
              const fadeOut = j / charCount;
              return (
                <span key={j} style={{
                  opacity: j === 0 ? 1 : fadeOut * 0.6,
                  textShadow: j === 0 ? `0 0 8px ${color}` : "none",
                }}>{chars[(i * 7 + j + Math.floor(frame * 0.15)) % chars.length]}</span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
