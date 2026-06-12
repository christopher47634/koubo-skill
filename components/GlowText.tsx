import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const GlowText: React.FC<{
  text: string;
  fontSize?: number;
  color?: string;
  glowColor?: string;
  glowSize?: number;
  letterSpacing?: number;
  fontWeight?: number;
  enterFrame: number;
  exitFrame: number;
}> = ({ text, fontSize = 44, color = "#E0F2FE", glowColor, glowSize = 20, letterSpacing = 2, fontWeight = 600, enterFrame, exitFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < enterFrame - 3 || frame > exitFrame) return null;
  const local = frame - enterFrame + 3;

  const s = spring({ frame: local, fps, config: { damping: 18, stiffness: 90 } });
  const fade = interpolate(frame, [exitFrame - 12, exitFrame], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulse = 0.5 + Math.sin(local * 0.05) * 0.5;
  const gc = glowColor || color;

  return (
    <div style={{
      opacity: fade,
      transform: `translateY(${(1 - s) * 15}px) scale(${0.95 + s * 0.05})`,
      fontFamily: "'ChakraPetch', -apple-system, sans-serif",
      fontSize, color, fontWeight, letterSpacing, lineHeight: 1.3,
      textShadow: `0 0 ${glowSize * pulse}px ${gc}88, 0 0 ${glowSize * 2.5 * pulse}px ${gc}44, 0 0 ${glowSize * 4 * pulse}px ${gc}22, 0 2px 12px rgba(0,0,0,0.6)`,
    }}>
      {text}
    </div>
  );
};
