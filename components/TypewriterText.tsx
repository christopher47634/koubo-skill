import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

export const TypewriterText: React.FC<{
  text: string;
  speed?: number;
  color?: string;
  fontSize?: number;
  fontFamily?: string;
  cursor?: boolean;
  enterFrame: number;
  exitFrame: number;
}> = ({ text, speed = 2, color = "#E0E0E0", fontSize = 30, fontFamily = "'SF Mono', monospace", cursor = true, enterFrame, exitFrame }) => {
  const frame = useCurrentFrame();
  if (frame < enterFrame || frame > exitFrame) return null;
  const local = frame - enterFrame;
  const fade = interpolate(frame, [exitFrame - 10, exitFrame], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const charsVisible = Math.floor(clamp01(local / (text.length * speed)) * text.length);

  return (
    <div style={{
      opacity: fade,
      fontFamily, fontSize, color, lineHeight: 1.6,
    }}>
      {text.slice(0, charsVisible)}
      {cursor && (
        <span style={{
          display: "inline-block", width: fontSize * 0.5, height: fontSize * 0.9,
          background: color, marginLeft: 2, verticalAlign: "text-bottom",
          opacity: Math.sin(local * 0.18) > 0 ? 1 : 0,
          boxShadow: `0 0 10px ${color}66, 0 0 20px ${color}33`,
        }} />
      )}
    </div>
  );
};

function clamp01(v: number) { return Math.min(Math.max(v, 0), 1); }
