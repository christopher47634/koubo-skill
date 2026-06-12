import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

export const TechBackground: React.FC<{
  color?: string;
  gridOpacity?: number;
  gradientFrom?: string;
  gradientTo?: string;
  showGrid?: boolean;
  showParticles?: boolean;
  showVignette?: boolean;
}> = ({ color = "#0a0a14", gridOpacity = 0.04, gradientFrom = "#0a0a14", gradientTo = "#0f0a1a", showGrid = true, showParticles = true, showVignette = true }) => {
  const frame = useCurrentFrame();

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 0, background: color }}>
      {/* 渐变底 */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse at 30% 20%, ${gradientFrom}88 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, ${gradientTo}66 0%, transparent 50%)`,
      }} />

      {/* 网格 */}
      {showGrid && (
        <div style={{
          position: "absolute", inset: 0, opacity: gridOpacity,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          transform: `translateY(${(frame * 0.3) % 60}px)`,
        }} />
      )}

      {/* 浮动粒子 */}
      {showParticles && Array.from({ length: 20 }).map((_, i) => {
        const x = (i * 37 + frame * (0.1 + i * 0.02)) % 100;
        const y = (i * 53 + frame * (0.05 + i * 0.015)) % 100;
        const size = 1 + (i % 3);
        const opacity = 0.03 + Math.sin(frame * 0.02 + i) * 0.02;
        return (
          <div key={i} style={{
            position: "absolute", left: `${x}%`, top: `${y}%`,
            width: size, height: size, borderRadius: "50%",
            background: i % 3 === 0 ? "#7DD3FC" : i % 3 === 1 ? "#A78BFA" : "#F0ABFC",
            opacity,
          }} />
        );
      })}

      {/* 暗角 */}
      {showVignette && (
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.6) 100%)",
        }} />
      )}
    </div>
  );
};
