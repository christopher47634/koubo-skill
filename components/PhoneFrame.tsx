import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const PhoneFrame: React.FC<{
  children: React.ReactNode;
  side: "left" | "right";
  enterFrame: number;
  exitFrame: number;
  borderColor?: string;
}> = ({ children, side, enterFrame, exitFrame, borderColor = "rgba(125,211,252,0.42)" }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < enterFrame - 4 || frame > exitFrame) return null;
  const local = frame - enterFrame + 4;
  const dir = side === "left" ? -1 : 1;

  // 弹入：从底部+侧面滑入
  const slide = spring({ frame: local, fps, config: { damping: 13, stiffness: 85, mass: 1.1 } });
  const fade = interpolate(frame, [exitFrame - 15, exitFrame], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const float = Math.sin(local * 0.04) * 3;

  const pos = side === "left" ? { left: 60 } : { right: 60 };

  return (
    <div style={{
      position: "absolute", ...pos, top: 120 + float, zIndex: 60,
      opacity: fade,
      transform: `translate(${(1 - slide) * 30 * dir}px, ${(1 - slide) * 20}px)`,
    }}>
      {/* 手机外框 */}
      <div style={{
        width: 280, height: 560, borderRadius: 32, padding: 8,
        background: `linear-gradient(135deg, ${borderColor}, rgba(255,255,255,0.08))`,
        boxShadow: `0 20px 60px rgba(0,0,0,0.4), 0 0 30px ${borderColor}`,
      }}>
        {/* 屏幕 */}
        <div style={{
          width: "100%", height: "100%", borderRadius: 30, overflow: "hidden",
          background: "#000", position: "relative",
        }}>
          {children}
          {/* 刘海 */}
          <div style={{
            position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)",
            width: 100, height: 24, background: "#000", borderRadius: "0 0 16px 16px", zIndex: 5,
          }} />
        </div>
      </div>
    </div>
  );
};
