import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

export const NeonBorder: React.FC<{
  children: React.ReactNode;
  color?: string;
  glowSize?: number;
  borderWidth?: number;
  borderRadius?: number;
  pulse?: boolean;
  enterFrame: number;
  exitFrame: number;
}> = ({ children, color = "#00D4FF", glowSize = 20, borderWidth = 1.5, borderRadius = 16, pulse = true, enterFrame, exitFrame }) => {
  const frame = useCurrentFrame();
  if (frame < enterFrame - 3 || frame > exitFrame) return null;
  const local = frame - enterFrame + 3;
  const fade = interpolate(frame, [exitFrame - 12, exitFrame], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const glowIntensity = pulse ? 0.6 + Math.sin(local * 0.08) * 0.4 : 1;

  return (
    <div style={{
      position: "relative", opacity: fade,
      borderRadius, padding: borderWidth,
      background: `linear-gradient(135deg, ${color}, ${color}66, ${color})`,
      boxShadow: `0 0 ${glowSize * glowIntensity}px ${color}66, 0 0 ${glowSize * 2.5 * glowIntensity}px ${color}33, 0 0 ${glowSize * 4 * glowIntensity}px ${color}18, inset 0 0 ${glowSize}px ${color}11`,
    }}>
      <div style={{
        background: "rgba(10,10,18,0.95)",
        borderRadius: borderRadius - borderWidth,
        overflow: "hidden",
      }}>
        {children}
      </div>
    </div>
  );
};
