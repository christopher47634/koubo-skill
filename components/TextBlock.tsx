import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const TextBlock: React.FC<{
  icon: string;
  headline: string;
  sub: string;
  badge?: string;
  enterFrame: number;
  exitFrame: number;
}> = ({ icon, headline, sub, badge, enterFrame, exitFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < enterFrame - 3 || frame > exitFrame) return null;
  const local = frame - enterFrame + 3;

  const slide = spring({ frame: local, fps, config: { damping: 16, stiffness: 110 } });
  const fade = interpolate(frame, [exitFrame - 12, exitFrame], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{
      position: "absolute", left: 50, top: 70, zIndex: 68,
      opacity: fade, transform: `translateY(${(1 - slide) * 18}px)`,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <span style={{ fontSize: 22 }}>{icon}</span>
        <span style={{
          fontFamily: "'ChakraPetch', sans-serif", fontSize: 29,
          color: "#F5F5F5", fontWeight: 600, letterSpacing: 1.5,
        }}>{headline}</span>
      </div>
      <div style={{
        fontFamily: "'LXGW WenKai', sans-serif", fontSize: 20,
        color: "rgba(255,255,255,0.4)", marginLeft: 32, marginBottom: 10,
      }}>{sub}</div>
      {badge && (
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6, marginLeft: 32,
          background: "rgba(134,239,172,0.08)", border: "1px solid rgba(134,239,172,0.15)",
          borderRadius: 24, padding: "8px 18px",
        }}>
          <span style={{ fontSize: 12 }}>✓</span>
          <span style={{
            fontFamily: "'ChakraPetch', sans-serif", fontSize: 14,
            color: "rgba(134,239,172,0.7)", letterSpacing: 2,
          }}>{badge}</span>
        </div>
      )}
    </div>
  );
};
