import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const CounterAnimation: React.FC<{
  from: number;
  to: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  label?: string;
  color?: string;
  fontSize?: number;
  enterFrame: number;
  exitFrame: number;
}> = ({ from, to, duration = 40, prefix = "", suffix = "", label, color = "#F5F5F5", fontSize = 72, enterFrame, exitFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < enterFrame - 3 || frame > exitFrame) return null;
  const local = frame - enterFrame + 3;

  const slide = spring({ frame: local, fps, config: { damping: 18, stiffness: 90 } });
  const fade = interpolate(frame, [exitFrame - 14, exitFrame], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // 数字滚动：easeOutExpo
  const rawProg = clamp01(local / duration);
  const prog = 1 - Math.pow(1 - rawProg, 3);
  const current = Math.round(from + (to - from) * prog);

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
      opacity: fade, transform: `translateY(${(1 - slide) * 20}px) scale(${0.9 + slide * 0.1})`,
    }}>
      <div style={{
        fontFamily: "'ChakraPetch', -apple-system, sans-serif",
        fontSize, color, fontWeight: 700, fontVariantNumeric: "tabular-nums",
        lineHeight: 1, letterSpacing: -2,
        textShadow: `0 0 30px ${color}33, 0 2px 10px rgba(0,0,0,0.3)`,
      }}>
        {prefix}{current.toLocaleString()}{suffix}
      </div>
      {label && (
        <div style={{
          fontFamily: "-apple-system, sans-serif",
          fontSize: 18, color: "rgba(255,255,255,0.35)", fontWeight: 500,
          letterSpacing: 1, textTransform: "uppercase",
        }}>{label}</div>
      )}
    </div>
  );
};

function clamp01(v: number) { return Math.min(Math.max(v, 0), 1); }
