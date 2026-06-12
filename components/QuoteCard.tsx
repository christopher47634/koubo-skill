import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { GlassCard } from "./GlassCard";

export const QuoteCard: React.FC<{
  quote: string;
  author?: string;
  side: "left" | "right";
  enterFrame: number;
  exitFrame: number;
}> = ({ quote, author, side, enterFrame, exitFrame }) => {
  const frame = useCurrentFrame();
  if (frame < enterFrame - 3 || frame > exitFrame) return null;

  return (
    <GlassCard side={side} enterFrame={enterFrame} exitFrame={exitFrame} accentColor="rgba(167,139,250,0.45)">
      <div style={{ position: "relative", padding: "14px 0" }}>
        <span style={{
          position: "absolute", top: -15, left: -5,
          fontSize: 88, color: "rgba(167,139,250,0.12)",
          fontFamily: "Georgia, serif", lineHeight: 1,
        }}>"</span>
        <div style={{
          fontFamily: "'LXGW WenKai', -apple-system, sans-serif",
          fontSize: 27, color: "#E0E0E0", lineHeight: 1.8, paddingLeft: 30,
        }}>{quote}</div>
        {author && (
          <div style={{
            fontFamily: "'ChakraPetch', -apple-system, sans-serif",
            fontSize: 16, color: "rgba(167,139,250,0.45)", marginTop: 14, paddingLeft: 30,
          }}>— {author}</div>
        )}
      </div>
    </GlassCard>
  );
};
