import React from "react";
import { useCurrentFrame } from "remotion";

export const DataStream: React.FC<{
  columns?: number;
  color?: string;
  speed?: number;
  opacity?: number;
}> = ({ columns = 15, color = "#7DD3FC", speed = 1, opacity = 0.06 }) => {
  const frame = useCurrentFrame();

  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none",
      overflow: "hidden", opacity,
    }}>
      {Array.from({ length: columns }).map((_, i) => {
        const x = (i / columns) * 100;
        const chars = "01アイウエオカキクケコABCDEF";
        const charCount = 8 + (i % 5);
        const yOffset = (frame * speed * (0.5 + i * 0.1)) % 100;
        return (
          <div key={i} style={{
            position: "absolute", left: `${x}%`, top: `${-20 + yOffset}%`,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 14, color, lineHeight: 1.8,
            writingMode: "vertical-rl",
            whiteSpace: "nowrap",
          }}>
            {Array.from({ length: charCount }).map((_, j) => (
              <span key={j} style={{
                opacity: j === 0 ? 1 : 0.3 + (j / charCount) * 0.7,
              }}>{chars[(i + j + Math.floor(frame * 0.1)) % chars.length]}</span>
            ))}
          </div>
        );
      })}
    </div>
  );
};
