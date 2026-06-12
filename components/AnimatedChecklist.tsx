import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const AnimatedChecklist: React.FC<{
  items: { text: string; checked?: boolean; delay?: number }[];
  color?: string;
  enterFrame: number;
  exitFrame: number;
}> = ({ items, color = "#4ADE80", enterFrame, exitFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < enterFrame - 3 || frame > exitFrame) return null;
  const local = frame - enterFrame + 3;
  const fade = interpolate(frame, [exitFrame - 12, exitFrame], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, opacity: fade }}>
      {items.map((item, i) => {
        const d = (item.delay || 0) + i * 8;
        const si = clamp01((local - d) / 10);
        const checkFrame = Math.max(0, local - d - 6);
        const checkProg = clamp01(checkFrame / 8);
        const isChecked = item.checked !== false && checkProg > 0;

        return (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 16,
            opacity: si, transform: `translateX(${(1 - si) * 12}px)`,
          }}>
            {/* 勾选框 */}
            <div style={{
              width: 24, height: 24, borderRadius: 6, flexShrink: 0,
              background: isChecked ? color : "rgba(255,255,255,0.04)",
              border: isChecked ? "none" : "1.5px solid rgba(255,255,255,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center",
              transform: `scale(${isChecked ? 1 : 0.9})`,
              boxShadow: isChecked ? `0 0 10px ${color}33` : "none",
              transition: "all 0.15s ease",
            }}>
              {isChecked && (
                <svg width="14" height="14" viewBox="0 0 14 14" style={{ opacity: checkProg }}>
                  <path d="M2.5 7L5.5 10L11.5 4" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                    strokeDasharray="15" strokeDashoffset={15 * (1 - checkProg)} />
                </svg>
              )}
            </div>
            <span style={{
              fontFamily: "'LXGW WenKai', sans-serif",
              fontSize: 21, color: isChecked ? "#E0E0E0" : "rgba(255,255,255,0.45)",
              lineHeight: 1.5,
              textDecoration: isChecked ? "none" : "none",
            }}>{item.text}</span>
          </div>
        );
      })}
    </div>
  );
};

function clamp01(v: number) { return Math.min(Math.max(v, 0), 1); }
