import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const FeatureCard: React.FC<{
  features: { icon: string; title: string; desc: string; color?: string }[];
  columns?: 1 | 2;
  side: "left" | "right";
  width?: number;
  enterFrame: number;
  exitFrame: number;
}> = ({ features, columns = 1, side, width, enterFrame, exitFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < enterFrame - 3 || frame > exitFrame) return null;
  const local = frame - enterFrame + 3;
  const dir = side === "left" ? -1 : 1;

  const slide = spring({ frame: local, fps, config: { damping: 15, stiffness: 100, mass: 1.0 } });
  const fade = interpolate(frame, [exitFrame - 14, exitFrame], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const float = Math.sin(local * 0.035) * 2;

  const w = width || (side === "left" ? 480 : 640);
  const pos = side === "left" ? { left: 40 } : { right: 40 };

  return (
    <div style={{
      position: "absolute", ...pos, top: 60 + float, zIndex: 65,
      opacity: fade, transform: `translateX(${(1 - slide) * 25 * dir}px)`, width: w,
    }}>
      <div style={{
        borderRadius: 24, padding: 1,
        background: "linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.03))",
      }}>
        <div style={{
          background: "rgba(15,15,20,0.75)",
          backdropFilter: "blur(40px) saturate(180%)",
          borderRadius: 19, padding: "30px 26px",
          boxShadow: "0 24px 64px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.12)",
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: columns === 2 ? "1fr 1fr" : "1fr",
            gap: 16,
          }}>
            {features.map((feat, i) => {
              const delay = i * 4;
              const si = clamp01((local - delay) / 10);
              return (
                <div key={i} style={{
                  padding: "22px 20px", borderRadius: 14,
                  background: "rgba(255,255,255,0.03)",
                  border: "0.5px solid rgba(255,255,255,0.06)",
                  opacity: si, transform: `translateY(${(1 - si) * 10}px) scale(${si})`,
                }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 14, marginBottom: 12,
                    background: `${feat.color || "rgba(125,211,252,0.15)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 27,
                  }}>{feat.icon}</div>
                  <div style={{ fontFamily: "'LXGW WenKai', sans-serif", fontSize: 21, color: "#E8E8E8", fontWeight: 500, marginBottom: 6 }}>{feat.title}</div>
                  <div style={{ fontFamily: "-apple-system, sans-serif", fontSize: 16, color: "rgba(255,255,255,0.35)", lineHeight: 1.5 }}>{feat.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

function clamp01(v: number) { return Math.min(Math.max(v, 0), 1); }
