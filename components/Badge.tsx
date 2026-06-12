import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { rgba } from "./designTokens";

export const Badge: React.FC<{
  text: string;
  icon?: string;
  color?: string;
  bgColor?: string;
  enterFrame: number;
  exitFrame: number;
}> = ({ text, icon, color = "#86EFAC", bgColor, enterFrame, exitFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < enterFrame - 2 || frame > exitFrame) return null;
  const local = frame - enterFrame + 2;

  const scale = spring({ frame: local, fps, config: { damping: 12, stiffness: 150 } });
  const fade = interpolate(frame, [exitFrame - 10, exitFrame], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 5, opacity: fade,
      transform: `scale(${scale})`,
      background: bgColor || `linear-gradient(135deg, ${rgba(color, 0.14)}, rgba(255,255,255,0.035))`,
      border: `0.5px solid ${rgba(color, 0.32)}`,
      boxShadow: `0 8px 24px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 18px ${rgba(color, 0.08)}`,
      borderRadius: 24, padding: "8px 18px",
    }}>
      {icon && <span style={{ fontSize: 11 }}>{icon}</span>}
      <span style={{
        fontFamily: "'ChakraPetch', sans-serif", fontSize: 14,
        color, letterSpacing: 2, fontWeight: 600,
        textShadow: `0 0 14px ${rgba(color, 0.18)}`,
      }}>{text}</span>
    </div>
  );
};
