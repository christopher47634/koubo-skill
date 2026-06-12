import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const StepIndicator: React.FC<{
  steps: { label: string; done?: boolean; active?: boolean }[];
  enterFrame: number;
  exitFrame: number;
}> = ({ steps, enterFrame, exitFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < enterFrame - 3 || frame > exitFrame) return null;
  const local = frame - enterFrame + 3;
  const fade = interpolate(frame, [exitFrame - 12, exitFrame], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{ display: "flex", gap: 4, opacity: fade, flexWrap: "wrap" }}>
      {steps.map((step, i) => {
        const delay = i * 4;
        const s = clamp01((local - delay) / 8);
        const scale = spring({ frame: Math.max(0, local - delay), fps, config: { damping: 14, stiffness: 120 } });
        const bg = step.done ? "rgba(74,222,128,0.15)" : step.active ? "rgba(96,165,250,0.15)" : "rgba(255,255,255,0.04)";
        const border = step.done ? "rgba(74,222,128,0.3)" : step.active ? "rgba(96,165,250,0.3)" : "rgba(255,255,255,0.06)";
        const color = step.done ? "#4ADE80" : step.active ? "#60A5FA" : "rgba(255,255,255,0.4)";
        return (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 6,
            background: bg, border: `1px solid ${border}`, borderRadius: 24,
            padding: "9px 18px", opacity: s, transform: `scale(${scale})`,
          }}>
            {step.done && <span style={{ fontSize: 11 }}>✓</span>}
            {step.active && <span style={{ fontSize: 14, color }}>●</span>}
            <span style={{ fontFamily: "-apple-system, sans-serif", fontSize: 15, color, fontWeight: 500 }}>{step.label}</span>
          </div>
        );
      })}
    </div>
  );
};

function clamp01(v: number) { return Math.min(Math.max(v, 0), 1); }
