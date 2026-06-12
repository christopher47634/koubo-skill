import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

export const GlitchText: React.FC<{
  text: string;
  fontSize?: number;
  color?: string;
  glitchColor1?: string;
  glitchColor2?: string;
  enterFrame: number;
  exitFrame: number;
}> = ({ text, fontSize = 56, color = "#F5F5F5", glitchColor1 = "#00D4FF", glitchColor2 = "#A78BFA", enterFrame, exitFrame }) => {
  const frame = useCurrentFrame();
  if (frame < enterFrame - 3 || frame > exitFrame) return null;
  const local = frame - enterFrame + 3;
  const fade = interpolate(frame, [exitFrame - 12, exitFrame], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // 故障频率：每30帧一次大故障，每8帧一次小抖动
  const isBigGlitch = local % 25 < 4;
  const isSmallGlitch = local % 8 < 1;
  // 用确定性hash代替Math.random
  const hash = (n: number) => ((n * 9301 + 49297) % 233280) / 233280;
  const glitchX = isBigGlitch ? (hash(local) - 0.5) * 12 : isSmallGlitch ? (hash(local + 100) - 0.5) * 4 : 0;
  const glitchY = isBigGlitch ? (hash(local + 200) - 0.5) * 6 : 0;
  const clipTop = isBigGlitch ? hash(local + 300) * 30 : 0;
  const clipBot = isBigGlitch ? hash(local + 400) * 30 : 0;

  const baseStyle: React.CSSProperties = {
    fontFamily: "'ChakraPetch', -apple-system, sans-serif",
    fontSize, fontWeight: 800, lineHeight: 1.2, letterSpacing: 3,
    position: "relative",
  };

  return (
    <div style={{ opacity: fade, position: "relative", display: "inline-block" }}>
      {/* 色偏层1 */}
      <span style={{
        ...baseStyle, color: glitchColor1, opacity: isBigGlitch ? 0.6 : 0,
        position: "absolute", left: glitchX - 2, top: glitchY,
        clipPath: isBigGlitch ? `inset(${clipTop}% 0 ${clipBot}% 0)` : "none",
      }}>{text}</span>
      {/* 色偏层2 */}
      <span style={{
        ...baseStyle, color: glitchColor2, opacity: isBigGlitch ? 0.6 : 0,
        position: "absolute", left: glitchX + 2, top: -glitchY,
        clipPath: isBigGlitch ? `inset(${clipBot}% 0 ${clipTop}% 0)` : "none",
      }}>{text}</span>
      {/* 主文字 */}
      <span style={{
        ...baseStyle, color,
        transform: `translate(${glitchX}px, ${glitchY}px)`,
        textShadow: isBigGlitch ? `0 0 10px ${color}44` : "none",
      }}>{text}</span>
    </div>
  );
};
