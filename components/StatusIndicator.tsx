import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const StatusIndicator: React.FC<{
  items: { label: string; status: "active" | "warning" | "error" | "idle"; value?: string }[];
  enterFrame: number;
  exitFrame: number;
}> = ({ items, enterFrame, exitFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < enterFrame - 2 || frame > exitFrame) return null;
  const local = frame - enterFrame + 2;
  const fade = interpolate(frame, [exitFrame - 12, exitFrame], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const statusColor = {
    active: "#4ADE80",
    warning: "#FBBF24",
    error: "#F87171",
    idle: "rgba(255,255,255,0.2)",
  };

  return (
    <div style={{ display: "flex", gap: 20, flexWrap: "wrap", opacity: fade }}>
      {items.map((item, i) => {
        const delay = i * 3;
        const si = clamp01((local - delay) / 8);
        const scale = spring({ frame: Math.max(0, local - delay), fps, config: { damping: 14, stiffness: 120 } });
        const color = statusColor[item.status];
        // 脉冲动画（仅active状态）
        const pulse = item.status === "active" ? 0.6 + Math.sin(local * 0.1 + i) * 0.4 : 1;
        return (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "12px 20px", borderRadius: 26,
            background: "rgba(255,255,255,0.03)",
            border: `0.5px solid rgba(255,255,255,0.06)`,
            opacity: si, transform: `scale(${scale})`,
          }}>
            <div style={{
              width: 10, height: 10, borderRadius: "50%",
              background: color,
              boxShadow: `0 0 ${6 * pulse}px ${color}`,
              opacity: pulse,
            }} />
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 18, color: "rgba(255,255,255,0.55)", fontWeight: 600,
            }}>{item.label}</span>
            {item.value && (
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 18, color, fontWeight: 700, fontVariantNumeric: "tabular-nums",
              }}>{item.value}</span>
            )}
          </div>
        );
      })}
    </div>
  );
};

function clamp01(v: number) { return Math.min(Math.max(v, 0), 1); }
