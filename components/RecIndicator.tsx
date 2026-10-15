import React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { ui } from "./designTokens";

/** 右上角 REC 红点 + 计时，每 15 帧闪烁一次。 */
export const RecIndicator: React.FC<{ color?: string; right?: number; top?: number }> = ({
  color = "#FF0040",
  right = 120,
  top = 28,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const on = Math.floor(frame / 15) % 2 === 0;
  const sec = Math.floor(frame / fps);
  const t = `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;
  return (
    <div style={{ position: "absolute", top, right, display: "flex", alignItems: "center", gap: 8, zIndex: 100 }}>
      <div style={{ width: 10, height: 10, borderRadius: "50%", background: on ? color : "transparent", boxShadow: on ? `0 0 8px ${color}` : "none" }} />
      <span style={{ fontFamily: "ChakraPetch, sans-serif", fontSize: ui.font.label, color, letterSpacing: 2, fontWeight: 600 }}>REC {t}</span>
    </div>
  );
};
