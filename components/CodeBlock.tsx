import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

export const CodeBlock: React.FC<{
  code: string;
  language?: string;
  enterFrame: number;
  exitFrame: number;
}> = ({ code, language, enterFrame, exitFrame }) => {
  const frame = useCurrentFrame();
  if (frame < enterFrame - 3 || frame > exitFrame) return null;
  const local = frame - enterFrame + 3;
  const fade = interpolate(frame, [exitFrame - 10, exitFrame], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // 逐字符打字效果
  const charsVisible = Math.floor(clamp01(local / 20) * code.length);

  return (
    <div style={{
      background: "#0D1117", borderRadius: 12, padding: "18px 20px",
      border: "1px solid rgba(255,255,255,0.06)", opacity: fade,
      fontFamily: "'SF Mono', 'Fira Code', monospace", fontSize: 16, lineHeight: 1.6,
      color: "#C9D1D9", overflow: "hidden",
    }}>
      {language && (
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.25)", marginBottom: 8, letterSpacing: 1, textTransform: "uppercase" }}>{language}</div>
      )}
      <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{code.slice(0, charsVisible)}<span style={{ opacity: Math.sin(local * 0.2) > 0 ? 1 : 0, color: "#58A6FF" }}>|</span></pre>
    </div>
  );
};

function clamp01(v: number) { return Math.min(Math.max(v, 0), 1); }
