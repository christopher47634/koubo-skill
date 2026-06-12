import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { ui } from "./designTokens";

export const HudPanel: React.FC<{
  metrics: { label: string; value: number; max?: number; unit?: string; color?: string; icon?: string }[];
  side: "left" | "right";
  width?: number;
  enterFrame: number;
  exitFrame: number;
}> = ({ metrics, side, width, enterFrame, exitFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < enterFrame - 3 || frame > exitFrame) return null;
  const local = frame - enterFrame + 3;
  const dir = side === "left" ? -1 : 1;

  const slide = spring({ frame: local, fps, config: { damping: 15, stiffness: 100, mass: 1.0 } });
  const fade = interpolate(frame, [exitFrame - 14, exitFrame], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const w = width || (side === "left" ? 440 : 560);
  const pos = side === "left" ? { left: 40 } : { right: 40 };

  return (
    <div style={{
      position: "absolute", ...pos, top: 60, zIndex: 65,
      opacity: fade, transform: `translateX(${(1 - slide) * 30 * dir}px)`, width: w,
    }}>
      <div style={{
        ...ui.glass,
        background: "linear-gradient(145deg, rgba(13,18,28,0.92), rgba(7,10,17,0.84))",
        border: "0.5px solid rgba(125,211,252,0.12)",
        borderRadius: 20, padding: "30px 28px",
        boxShadow: "0 20px 56px rgba(0,0,0,0.42), 0 0 28px rgba(125,211,252,0.05), inset 0 1px 0 rgba(255,255,255,0.09)",
      }}>
        {metrics.map((m, i) => {
          const delay = i * 5;
          const si = clamp01((local - delay) / 12);
          const color = m.color || "#00d4ff";
          const pct = (m.value / (m.max || 100)) * si;
          return (
            <div key={i} style={{
              marginBottom: i < metrics.length - 1 ? 16 : 0,
              opacity: si, transform: `translateY(${(1 - si) * 8}px)`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  {m.icon && <span style={{ fontSize: 18, opacity: 0.6 }}>{m.icon}</span>}
                  <span style={{
                    fontFamily: "'JetBrains Mono', 'SF Mono', monospace",
                    fontSize: 16, color: "rgba(232,238,248,0.62)", letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 600,
                  }}>{m.label}</span>
                </div>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 27, color, fontWeight: 700, fontVariantNumeric: "tabular-nums",
                }}>{Math.round(m.value * si)}{m.unit || ""}</span>
              </div>
              {/* 条形图 */}
              <div style={{
                width: "100%", height: 9, borderRadius: 6,
                background: "rgba(255,255,255,0.055)",
                border: "0.5px solid rgba(255,255,255,0.06)",
                boxShadow: "inset 0 1px 3px rgba(0,0,0,0.32)",
                overflow: "hidden",
              }}>
                <div style={{
                  width: `${pct}%`, height: "100%", borderRadius: 6,
                  background: `linear-gradient(90deg, ${color}99, ${color})`,
                  boxShadow: `0 0 12px ${color}55, inset 0 1px 0 rgba(255,255,255,0.3)`,
                }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

function clamp01(v: number) { return Math.min(Math.max(v, 0), 1); }
