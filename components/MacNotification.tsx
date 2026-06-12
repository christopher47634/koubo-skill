import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const MacNotification: React.FC<{
  app: string;
  icon?: string;
  title: string;
  body: string;
  enterFrame: number;
  exitFrame: number;
}> = ({ app, icon, title, body, enterFrame, exitFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < enterFrame - 2 || frame > exitFrame) return null;
  const local = frame - enterFrame + 2;

  const slide = spring({ frame: local, fps, config: { damping: 16, stiffness: 100 } });
  const fade = interpolate(frame, [exitFrame - 12, exitFrame], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{
      position: "absolute", top: 30, right: 30, zIndex: 80, width: 360,
      opacity: fade, transform: `translateY(${(1 - slide) * -20}px)`,
    }}>
      <div style={{
        background: "rgba(50,50,50,0.92)", backdropFilter: "blur(24px) saturate(1.5)",
        borderRadius: 14, padding: "14px 16px",
        boxShadow: "0 12px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.08)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          {icon && <span style={{ fontSize: 16 }}>{icon}</span>}
          <span style={{ fontFamily: "-apple-system, sans-serif", fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.5 }}>{app}</span>
        </div>
        <div style={{ fontFamily: "-apple-system, sans-serif", fontSize: 15, color: "#F5F5F5", fontWeight: 600, marginBottom: 3 }}>{title}</div>
        <div style={{ fontFamily: "-apple-system, sans-serif", fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.4 }}>{body}</div>
      </div>
    </div>
  );
};
