import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

interface Message {
  from: "them" | "me";
  text: string;
  avatar?: string;
}

export const ChatBubble: React.FC<{
  title: string;
  messages: Message[];
  side: "left" | "right";
  width?: number;
  enterFrame: number;
  exitFrame: number;
}> = ({ title, messages, side, width, enterFrame, exitFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < enterFrame - 4 || frame > exitFrame) return null;
  const local = frame - enterFrame + 4;
  const dir = side === "left" ? -1 : 1;

  const slide = spring({ frame: local, fps, config: { damping: 14, stiffness: 85, mass: 1.1 } });
  const fade = interpolate(frame, [exitFrame - 14, exitFrame], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const float = Math.sin(local * 0.035) * 1.5;

  const w = width || (side === "left" ? 480 : 640);
  const pos = side === "left" ? { left: 40 } : { right: 40 };

  return (
    <div style={{
      position: "absolute", ...pos, top: 60 + float, zIndex: 62,
      opacity: fade,
      transform: `translateX(${(1 - slide) * 40 * dir}px)`,
      width: w,
    }}>
      <div style={{
        borderRadius: 24, padding: 1,
        background: "linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))",
      }}>
        <div style={{
          background: "rgba(255,255,255,0.96)",
          borderRadius: 19, overflow: "hidden",
          boxShadow: "0 24px 64px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.5)",
        }}>
          {/* 标题栏 */}
          <div style={{
            padding: "18px 26px",
            background: "rgba(59,130,246,0.04)",
            borderBottom: "1px solid rgba(0,0,0,0.04)",
          }}>
            <span style={{
              background: "linear-gradient(135deg, #3B82F6, #2563EB)",
              borderRadius: 10, padding: "9px 20px",
              fontFamily: "'ChakraPetch', -apple-system, sans-serif",
              fontSize: 18, color: "#FFF", fontWeight: 600,
              boxShadow: "0 2px 8px rgba(59,130,246,0.3)",
            }}>{title}</span>
          </div>
          {/* 消息列表 */}
          <div style={{ padding: "22px 26px", display: "flex", flexDirection: "column", gap: 12 }}>
            {messages.map((msg, i) => {
              const delay = i * 5;
              const si = clamp01((local - delay) / 8);
              const isMe = msg.from === "me";
              return (
                <div key={i} style={{
                  display: "flex", justifyContent: isMe ? "flex-end" : "flex-start",
                  opacity: si, transform: `translateY(${(1 - si) * 6}px)`,
                }}>
                  <div style={{
                    maxWidth: "65%",
                    background: isMe
                      ? "linear-gradient(135deg, #95EC69, #7ED957)"
                      : "#FFF",
                    color: "#333",
                    borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                    padding: "15px 20px", fontSize: 20, lineHeight: 1.5,
                    fontFamily: "'LXGW WenKai', -apple-system, sans-serif",
                    boxShadow: isMe
                      ? "0 2px 8px rgba(149,236,105,0.3)"
                      : "0 1px 4px rgba(0,0,0,0.06)",
                  }}>{msg.text}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

function clamp01(v: number) { return Math.min(Math.max(v, 0), 1); }
