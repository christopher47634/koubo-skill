import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate, Img, staticFile } from "remotion";

export const ImageShowcase: React.FC<{
  src: string;
  caption?: string;
  side: "left" | "right";
  width?: number;
  enterFrame: number;
  exitFrame: number;
}> = ({ src, caption, side, width, enterFrame, exitFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < enterFrame - 4 || frame > exitFrame) return null;
  const local = frame - enterFrame + 4;
  const dir = side === "left" ? -1 : 1;

  const scale = spring({ frame: local, fps, config: { damping: 13, stiffness: 100 } });
  const fade = interpolate(frame, [exitFrame - 15, exitFrame], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const float = Math.sin(local * 0.04) * 2;

  const w = width || (side === "left" ? 500 : 640);
  const pos = side === "left" ? { left: 40 } : { right: 40 };

  return (
    <div style={{
      position: "absolute", ...pos, top: 80 + float, zIndex: 60,
      opacity: fade, transform: `scale(${scale}) translateX(${(1 - scale) * 20 * dir}px)`, width: w,
    }}>
      <div style={{
        borderRadius: 16, overflow: "hidden",
        boxShadow: "0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.06)",
      }}>
        <Img src={staticFile(src)} style={{ width: "100%", display: "block" }} />
      </div>
      {caption && (
        <div style={{
          marginTop: 10, textAlign: "center",
          fontFamily: "-apple-system, sans-serif", fontSize: 16,
          color: "rgba(255,255,255,0.35)", fontStyle: "italic",
        }}>{caption}</div>
      )}
    </div>
  );
};
