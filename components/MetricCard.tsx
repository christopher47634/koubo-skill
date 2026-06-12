import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const MetricCard: React.FC<{
  icon: string;
  label: string;
  value: string;
  trend?: { direction: "up" | "down"; value: string };
  color?: string;
  side: "left" | "right";
  enterFrame: number;
  exitFrame: number;
}> = ({ icon, label, value, trend, color = "#7DD3FC", side, enterFrame, exitFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < enterFrame - 3 || frame > exitFrame) return null;
  const local = frame - enterFrame + 3;
  const dir = side === "left" ? -1 : 1;

  const s = spring({ frame: local, fps, config: { damping: 15, stiffness: 100 } });
  const fade = interpolate(frame, [exitFrame - 14, exitFrame], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const pos = side === "left" ? { left: 40 } : { right: 40 };

  return (
    <div style={{
      position: "absolute", ...pos, top: 70, zIndex: 65, width: 280,
      opacity: fade, transform: `translateX(${(1 - s) * 25 * dir}px) scale(${0.9 + s * 0.1})`,
    }}>
      <div style={{
        background: "rgba(15,15,20,0.8)",
        backdropFilter: "blur(40px) saturate(180%)",
        borderRadius: 24, padding: "34px 30px",
        border: `1px solid ${color}22`,
        boxShadow: `0 24px 64px rgba(0,0,0,0.3), 0 0 40px ${color}11, inset 0 1px 0 rgba(255,255,255,0.08)`,
      }}>
        <div style={{
          width: 62, height: 62, borderRadius: 16, marginBottom: 18,
          background: `${color}15`, border: `1px solid ${color}22`,
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 31,
        }}>{icon}</div>
        <div style={{
          fontFamily: "-apple-system, sans-serif",
          fontSize: 16, color: "rgba(255,255,255,0.35)", fontWeight: 500,
          letterSpacing: 0.5, marginBottom: 6,
        }}>{label}</div>
        <div style={{
          fontFamily: "'ChakraPetch', sans-serif",
          fontSize: 48, color: "#F5F5F5", fontWeight: 700, lineHeight: 1,
          fontVariantNumeric: "tabular-nums",
        }}>{value}</div>
        {trend && (
          <div style={{
            display: "flex", alignItems: "center", gap: 4, marginTop: 10,
          }}>
            <span style={{ fontSize: 18, color: trend.direction === "up" ? "#4ADE80" : "#F87171" }}>
              {trend.direction === "up" ? "↑" : "↓"}
            </span>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 16, color: trend.direction === "up" ? "#4ADE80" : "#F87171", fontWeight: 600,
            }}>{trend.value}</span>
          </div>
        )}
      </div>
    </div>
  );
};
