import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const ComparisonCard: React.FC<{
  left: { title: string; items: string[]; color?: string };
  right: { title: string; items: string[]; color?: string };
  enterFrame: number;
  exitFrame: number;
}> = ({ left, right, enterFrame, exitFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < enterFrame - 3 || frame > exitFrame) return null;
  const local = frame - enterFrame + 3;

  const slideL = spring({ frame: local, fps, config: { damping: 15, stiffness: 90 } });
  const slideR = spring({ frame: local + 3, fps, config: { damping: 15, stiffness: 90 } });
  const fade = interpolate(frame, [exitFrame - 12, exitFrame], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const renderSide = (data: { title: string; items: string[]; color?: string }, slideVal: number, dir: number) => (
    <div style={{
      flex: 1, opacity: fade,
      transform: `translateX(${(1 - slideVal) * 15 * dir}px)`,
    }}>
      <div style={{
        background: "rgba(255,255,255,0.03)", borderRadius: 16, padding: "26px 28px",
        border: `1px solid ${data.color || "rgba(255,255,255,0.06)"}`,
      }}>
        <div style={{
          fontFamily: "-apple-system, sans-serif", fontSize: 16, fontWeight: 600,
          color: data.color || "rgba(255,255,255,0.6)", letterSpacing: 1, marginBottom: 14,
        }}>{data.title}</div>
        {data.items.map((item, i) => {
          const s = clamp01((local - i * 3) / 8);
          return (
            <div key={i} style={{
              fontFamily: "'LXGW WenKai', sans-serif", fontSize: 22, color: "#D4D4D4", lineHeight: 2.2,
              display: "flex", alignItems: "center", gap: 12,
              opacity: s, transform: `translateX(${(1 - s) * 5}px)`,
            }}>
              <span style={{ width: 4, height: 4, borderRadius: "50%", background: data.color || "rgba(255,255,255,0.3)", flexShrink: 0 }} />
              {item}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", gap: 16 }}>
      {renderSide(left, slideL, -1)}
      {renderSide(right, slideR, 1)}
    </div>
  );
};

function clamp01(v: number) { return Math.min(Math.max(v, 0), 1); }
