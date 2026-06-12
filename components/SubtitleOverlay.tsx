import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate } from "remotion";

export const SUBTITLE_Z_INDEX = 1000;

export const SubtitleOverlay: React.FC<{
  text: string;
  en?: string;
  startFrame: number;
  endFrame: number;
  highlightFn?: (text: string) => React.ReactNode;
}> = ({ text, en, startFrame, endFrame, highlightFn }) => {
  const frame = useCurrentFrame();
  if (frame < startFrame || frame > endFrame) return null;

  const prog = interpolate(frame, [startFrame, startFrame + 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [endFrame - 8, endFrame], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = Math.min(prog, fadeOut);

  return (
    <div style={{
      position: "absolute", bottom: 50, left: 0, right: 0, zIndex: SUBTITLE_Z_INDEX,
      display: "flex", justifyContent: "center",
      transform: `translateY(${(1 - prog) * 6}px)`, opacity,
    }}>
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        background: "rgba(0,0,0,0.42)", backdropFilter: "blur(16px)",
        borderRadius: 14, padding: "14px 44px 10px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.25)",
      }}>
        <div style={{
          fontFamily: "'LXGW WenKai', sans-serif", fontSize: 44,
          lineHeight: 1.5, textAlign: "center", letterSpacing: 1.5,
          color: "#F0F0F0", textShadow: "0 2px 10px rgba(0,0,0,0.45)",
        }}>{highlightFn ? highlightFn(text) : text}</div>
        {en && (
          <div style={{
            fontFamily: "'ChakraPetch', sans-serif", fontSize: 26,
            lineHeight: 1.4, textAlign: "center",
            color: "rgba(255,255,255,0.46)", marginTop: 3,
          }}>{en}</div>
        )}
      </div>
    </div>
  );
};
