import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const Badge: React.FC<{
  text: string;
  icon?: string;
  color?: string;
  bgColor?: string;
  enterFrame: number;
  exitFrame: number;
}> = ({ text, icon, color = "rgba(134,239,172,0.7)", bgColor = "rgba(134,239,172,0.08)", enterFrame, exitFrame }) => {
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
      background: bgColor, border: `1px solid ${color.replace("0.7", "0.2")}`,
      borderRadius: 24, padding: "8px 18px",
    }}>
      {icon && <span style={{ fontSize: 11 }}>{icon}</span>}
      <span style={{
        fontFamily: "'ChakraPetch', sans-serif", fontSize: 14,
        color, letterSpacing: 2, fontWeight: 600,
      }}>{text}</span>
    </div>
  );
};
