import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const CardStack: React.FC<{
  cards: { title: string; content: string; icon?: string; color?: string }[];
  side: "left" | "right";
  width?: number;
  enterFrame: number;
  exitFrame: number;
}> = ({ cards, side, width, enterFrame, exitFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < enterFrame - 4 || frame > exitFrame) return null;
  const local = frame - enterFrame + 4;
  const dir = side === "left" ? -1 : 1;

  const slide = spring({ frame: local, fps, config: { damping: 14, stiffness: 85, mass: 1.0 } });
  const fade = interpolate(frame, [exitFrame - 15, exitFrame], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const w = width || 400;
  const pos = side === "left" ? { left: 50 } : { right: 50 };

  return (
    <div style={{
      position: "absolute", ...pos, top: 80, zIndex: 65,
      opacity: fade, width: w, height: 400,
    }}>
      {cards.map((card, i) => {
        const delay = i * 6;
        const si = clamp01((local - delay) / 12);
        const s = spring({ frame: Math.max(0, local - delay), fps, config: { damping: 16, stiffness: 100 } });
        const color = card.color || "rgba(125,211,252,0.45)";

        // 扇形展开：每张偏移角度和位移
        const fanAngle = (i - (cards.length - 1) / 2) * 4 * s;
        const fanY = i * 35 * s;
        const fanX = (i - (cards.length - 1) / 2) * 8 * s;
        const zIndex = cards.length - i;

        return (
          <div key={i} style={{
            position: "absolute", top: fanY, left: fanX, zIndex,
            width: "100%",
            opacity: si,
            transform: `rotate(${fanAngle}deg) scale(${0.95 + s * 0.05})`,
          }}>
            <div style={{
              background: "rgba(15,15,20,0.8)",
              backdropFilter: "blur(24px) saturate(180%)",
              borderRadius: 20, padding: "22px 26px",
              border: `1px solid ${color.replace("0.45", "0.15")}`,
              boxShadow: "0 12px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                {card.icon && <span style={{ fontSize: 18 }}>{card.icon}</span>}
                <span style={{
                  fontFamily: "'ChakraPetch', sans-serif",
                  fontSize: 16, color, letterSpacing: 2, fontWeight: 600,
                }}>{card.title}</span>
              </div>
              <div style={{
                fontFamily: "'LXGW WenKai', sans-serif",
                fontSize: 20, color: "rgba(255,255,255,0.7)", lineHeight: 1.5,
              }}>{card.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

function clamp01(v: number) { return Math.min(Math.max(v, 0), 1); }
