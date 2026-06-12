import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { GlassCard } from "./GlassCard";

export const TimelineCard: React.FC<{
  events: { time: string; title: string; desc?: string; icon?: string; color?: string }[];
  side: "left" | "right";
  enterFrame: number;
  exitFrame: number;
}> = ({ events, side, enterFrame, exitFrame }) => {
  const frame = useCurrentFrame();
  if (frame < enterFrame - 3 || frame > exitFrame) return null;
  const local = frame - enterFrame + 3;

  return (
    <GlassCard side={side} enterFrame={enterFrame} exitFrame={exitFrame} accentColor="rgba(96,165,250,0.45)">
      <div style={{ position: "relative", paddingLeft: 28 }}>
        {/* 竖线 */}
        <div style={{
          position: "absolute", left: 8, top: 8, bottom: 8, width: 2,
          background: "linear-gradient(to bottom, rgba(96,165,250,0.4), rgba(96,165,250,0.1))",
          borderRadius: 1,
        }} />
        {events.map((ev, i) => {
          const delay = i * 5;
          const si = clamp01((local - delay) / 10);
          return (
            <div key={i} style={{
              position: "relative", marginBottom: i < events.length - 1 ? 18 : 0,
              opacity: si, transform: `translateX(${(1 - si) * 8}px)`,
            }}>
              {/* 圆点 */}
              <div style={{
                position: "absolute", left: -24, top: 6,
                width: 10, height: 10, borderRadius: "50%",
                background: ev.color || "rgba(96,165,250,0.6)",
                boxShadow: `0 0 8px ${ev.color || "rgba(96,165,250,0.4)"}`,
              }} />
              <div style={{ fontFamily: "'ChakraPetch', monospace", fontSize: 14, color: "rgba(255,255,255,0.3)", marginBottom: 3 }}>{ev.time}</div>
              <div style={{ fontFamily: "'LXGW WenKai', sans-serif", fontSize: 21, color: "#E0E0E0", fontWeight: 500 }}>
                {ev.icon && <span style={{ marginRight: 8, fontSize: 14 }}>{ev.icon}</span>}
                {ev.title}
              </div>
              {ev.desc && <div style={{ fontFamily: "-apple-system, sans-serif", fontSize: 16, color: "rgba(255,255,255,0.35)", marginTop: 3 }}>{ev.desc}</div>}
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
};

function clamp01(v: number) { return Math.min(Math.max(v, 0), 1); }
