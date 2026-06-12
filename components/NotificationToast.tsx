import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const NotificationToast: React.FC<{
  icon: string;
  app: string;
  title: string;
  body: string;
  enterFrame: number;
  exitFrame: number;
  position?: "top-right" | "top-left" | "bottom-right" | "bottom-left";
}> = ({ icon, app, title, body, enterFrame, exitFrame, position = "top-right" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < enterFrame - 2 || frame > exitFrame) return null;
  const local = frame - enterFrame + 2;

  // 弹入：从顶部滑下+弹性
  const slide = spring({ frame: local, fps, config: { damping: 14, stiffness: 100, mass: 0.9 } });
  const fade = interpolate(frame, [exitFrame - 14, exitFrame], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const posMap = {
    "top-right": { top: 30, right: 30 },
    "top-left": { top: 30, left: 30 },
    "bottom-right": { bottom: 160, right: 30 },
    "bottom-left": { bottom: 160, left: 30 },
  };

  return (
    <div style={{
      position: "absolute", ...posMap[position], zIndex: 85,
      width: 380, opacity: fade,
      transform: `translateY(${(1 - slide) * -25}px) scale(${0.9 + slide * 0.1})`,
    }}>
      <div style={{
        background: "rgba(40,40,45,0.92)",
        backdropFilter: "blur(32px) saturate(180%)",
        borderRadius: 20, padding: "20px 22px",
        boxShadow: "0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <span style={{ fontSize: 18 }}>{icon}</span>
          <span style={{
            fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
            fontSize: 14, color: "rgba(255,255,255,0.35)", fontWeight: 500,
            textTransform: "uppercase", letterSpacing: 0.5,
          }}>{app}</span>
          <span style={{
            marginLeft: "auto",
            fontFamily: "-apple-system, sans-serif",
            fontSize: 14, color: "rgba(255,255,255,0.2)",
          }}>now</span>
        </div>
        <div style={{
          fontFamily: "-apple-system, 'SF Pro Display', sans-serif",
          fontSize: 19, color: "#F5F5F5", fontWeight: 600, marginBottom: 4,
        }}>{title}</div>
        <div style={{
          fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
          fontSize: 16, color: "rgba(255,255,255,0.5)", lineHeight: 1.45,
        }}>{body}</div>
      </div>
    </div>
  );
};
