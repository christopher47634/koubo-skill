import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const LowerThird: React.FC<{
  name: string;
  title: string;
  accentColor?: string;
  avatar?: string;
  position?: "left" | "right";
  enterFrame: number;
  exitFrame: number;
}> = ({ name, title, accentColor = "#00d4ff", avatar, position = "left", enterFrame, exitFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < enterFrame - 3 || frame > exitFrame) return null;
  const local = frame - enterFrame + 3;

  const slide = spring({ frame: local, fps, config: { damping: 16, stiffness: 110 } });
  const fade = interpolate(frame, [exitFrame - 14, exitFrame], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // 先出名字，再出头衔（延迟4帧）
  const nameS = clamp01(local / 10);
  const titleS = clamp01((local - 4) / 10);

  const dir = position === "left" ? -1 : 1;
  const pos = position === "left" ? { left: 50 } : { right: 50 };

  return (
    <div style={{
      position: "absolute", ...pos, bottom: 160, zIndex: 75,
      opacity: fade,
      transform: `translateX(${(1 - slide) * 60 * dir}px)`,
    }}>
      <div style={{ display: "flex", alignItems: "stretch" }}>
        {/* 侧边强调条 */}
        <div style={{
          width: 4, borderRadius: "4px 0 0 4px",
          background: `linear-gradient(to bottom, ${accentColor}, ${accentColor}88)`,
          boxShadow: `0 0 12px ${accentColor}44`,
        }} />
        {/* 内容区 */}
        <div style={{
          background: "rgba(10,10,15,0.82)",
          backdropFilter: "blur(24px) saturate(180%)",
          borderRadius: "0 10px 10px 0",
          borderTop: "0.5px solid rgba(255,255,255,0.10)",
          borderRight: "0.5px solid rgba(255,255,255,0.08)",
          borderBottom: "0.5px solid rgba(255,255,255,0.06)",
          padding: "18px 30px 18px 22px",
          boxShadow: `0 14px 38px rgba(0,0,0,0.42), 0 0 22px ${accentColor}18, inset 0 1px 0 rgba(255,255,255,0.08)`,
          minWidth: 240,
        }}>
          <div style={{
            fontFamily: "'ChakraPetch', -apple-system, sans-serif",
            fontSize: 25, color: "#F5F5F5", fontWeight: 600, letterSpacing: 0.5,
            opacity: nameS, transform: `translateX(${(1 - nameS) * 15}px)`,
            marginBottom: 4,
          }}>
            {avatar && <span style={{ marginRight: 10, fontSize: 18 }}>{avatar}</span>}
            {name}
          </div>
          <div style={{
            fontFamily: "-apple-system, 'SF Pro Text', sans-serif",
            fontSize: 18, color: accentColor, fontWeight: 500, letterSpacing: 0.3,
            opacity: titleS, transform: `translateX(${(1 - titleS) * 12}px)`,
          }}>{title}</div>
        </div>
      </div>
    </div>
  );
};

function clamp01(v: number) { return Math.min(Math.max(v, 0), 1); }
