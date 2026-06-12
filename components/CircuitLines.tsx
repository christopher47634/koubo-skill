import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

export const CircuitLines: React.FC<{
  color?: string;
  opacity?: number;
  speed?: number;
}> = ({ color = "#00D4FF", opacity = 0.06, speed = 1 }) => {
  const frame = useCurrentFrame();
  const dashOffset = frame * speed * 2;

  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none", opacity,
    }}>
      <svg width="100%" height="100%" viewBox="0 0 1920 1080" preserveAspectRatio="none">
        {/* 水平线 */}
        <line x1="0" y1="200" x2="600" y2="200" stroke={color} strokeWidth="1"
          strokeDasharray="8 12" strokeDashoffset={dashOffset} />
        <line x1="400" y1="200" x2="400" y2="400" stroke={color} strokeWidth="1"
          strokeDasharray="8 12" strokeDashoffset={dashOffset * 0.7} />
        <line x1="400" y1="400" x2="800" y2="400" stroke={color} strokeWidth="1"
          strokeDasharray="8 12" strokeDashoffset={dashOffset * 1.2} />

        <line x1="1200" y1="300" x2="1920" y2="300" stroke={color} strokeWidth="1"
          strokeDasharray="8 12" strokeDashoffset={-dashOffset * 0.8} />
        <line x1="1500" y1="300" x2="1500" y2="600" stroke={color} strokeWidth="1"
          strokeDasharray="8 12" strokeDashoffset={-dashOffset} />
        <line x1="1500" y1="600" x2="1920" y2="600" stroke={color} strokeWidth="1"
          strokeDasharray="8 12" strokeDashoffset={-dashOffset * 1.3} />

        {/* 节点 */}
        <circle cx="400" cy="200" r="3" fill={color} opacity="0.4" />
        <circle cx="400" cy="400" r="3" fill={color} opacity="0.4" />
        <circle cx="1500" cy="300" r="3" fill={color} opacity="0.4" />
        <circle cx="1500" cy="600" r="3" fill={color} opacity="0.4" />
      </svg>
    </div>
  );
};
