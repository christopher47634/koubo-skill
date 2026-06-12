import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { GlassCard } from "./GlassCard";

export const StatCard: React.FC<{
  stats: { value: string; label: string; icon?: string; color?: string }[];
  side: "left" | "right";
  enterFrame: number;
  exitFrame: number;
}> = ({ stats, side, enterFrame, exitFrame }) => {
  const frame = useCurrentFrame();
  if (frame < enterFrame - 3 || frame > exitFrame) return null;
  const local = frame - enterFrame + 3;

  return (
    <GlassCard side={side} enterFrame={enterFrame} exitFrame={exitFrame} accentColor="rgba(251,146,60,0.45)">
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {stats.map((stat, i) => {
          const delay = i * 5;
          const si = clamp01((local - delay) / 10);
          return (
            <div key={i} style={{
              opacity: si,
              transform: `translateY(${(1 - si) * 10}px)`,
              display: "flex", alignItems: "center", gap: 20,
              padding: "16px 18px", borderRadius: 12,
              background: "rgba(255,255,255,0.03)",
              border: "0.5px solid rgba(255,255,255,0.06)",
            }}>
              {stat.icon && (
                <div style={{
                  width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                  background: `${stat.color || "rgba(251,146,60,0.45)"}22`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 25,
                }}>{stat.icon}</div>
              )}
              <div>
                <div style={{
                  fontFamily: "'ChakraPetch', -apple-system, sans-serif",
                  fontSize: 38, color: "#F5F5F5", fontWeight: 600, lineHeight: 1.2,
                }}>{stat.value}</div>
                <div style={{
                  fontFamily: "-apple-system, sans-serif",
                  fontSize: 16, color: "rgba(255,255,255,0.35)", marginTop: 3,
                }}>{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
};

function clamp01(v: number) { return Math.min(Math.max(v, 0), 1); }
