import React from "react";
import { useCurrentFrame } from "remotion";

export const ScanLines: React.FC<{
  opacity?: number;
  lineSpacing?: number;
  speed?: number;
  color?: string;
}> = ({ opacity = 0.03, lineSpacing = 3, speed = 0.5, color = "255,255,255" }) => {
  const frame = useCurrentFrame();
  const offset = (frame * speed) % lineSpacing;

  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 95, pointerEvents: "none",
      opacity,
      backgroundImage: `repeating-linear-gradient(0deg, rgba(${color},0.15) 0px, transparent 1px, transparent ${lineSpacing}px)`,
      backgroundSize: `100% ${lineSpacing}px`,
      transform: `translateY(${offset}px)`,
    }} />
  );
};
