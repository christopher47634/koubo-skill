import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

export const GradientBorder: React.FC<{
  children: React.ReactNode;
  colors?: string[];
  width?: number;
  enterFrame: number;
  exitFrame: number;
}> = ({ children, colors = ["#667eea", "#764ba2", "#f093fb"], width, enterFrame, exitFrame }) => {
  const frame = useCurrentFrame();
  if (frame < enterFrame - 3 || frame > exitFrame) return null;
  const local = frame - enterFrame + 3;
  const fade = interpolate(frame, [exitFrame - 12, exitFrame], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // 渐变旋转
  const angle = (local * 2) % 360;
  const grad = `conic-gradient(from ${angle}deg, ${colors.join(", ")})`;

  return (
    <div style={{ opacity: fade }}>
      <div style={{
        borderRadius: 26, padding: 1.5,
        background: grad,
        boxShadow: `0 0 20px ${colors[0]}33`,
      }}>
        <div style={{
          background: "rgba(10,10,15,0.92)",
          borderRadius: 20.5, padding: "30px 34px",
          backdropFilter: "blur(20px)",
        }}>
          {children}
        </div>
      </div>
    </div>
  );
};
