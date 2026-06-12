import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const CircularGauge: React.FC<{
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  suffix?: string;
  enterFrame: number;
  exitFrame: number;
}> = ({ value, max = 100, size = 140, strokeWidth = 8, color = "#7DD3FC", label, suffix = "%", enterFrame, exitFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < enterFrame - 3 || frame > exitFrame) return null;
  const local = frame - enterFrame + 3;

  const s = spring({ frame: local, fps, config: { damping: 20, stiffness: 60 } });
  const fade = interpolate(frame, [exitFrame - 12, exitFrame], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = (value / max) * s;
  const dashOffset = circumference * (1 - pct);

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: 10,
      opacity: fade, transform: `scale(${0.85 + s * 0.15})`,
    }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        {/* 背景圆 */}
        <circle cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
        {/* 进度圆 */}
        <circle cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${color}44)` }} />
      </svg>
      {/* 中心文字 */}
      <div style={{
        position: "absolute", display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", width: size, height: size,
      }}>
        <div style={{
          fontFamily: "'ChakraPetch', sans-serif",
          fontSize: size * 0.25, color: "#F5F5F5", fontWeight: 700,
          fontVariantNumeric: "tabular-nums", lineHeight: 1,
        }}>{Math.round(value * s)}{suffix}</div>
      </div>
      {label && (
        <div style={{
          fontFamily: "-apple-system, sans-serif",
          fontSize: 15, color: "rgba(255,255,255,0.35)", fontWeight: 500, letterSpacing: 1,
        }}>{label}</div>
      )}
    </div>
  );
};
