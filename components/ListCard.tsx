import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const ListCard: React.FC<{
  title: string;
  icon?: string;
  items: { text: string; sub?: string; icon?: string; iconBg?: string }[];
  accent?: string;
  side: "left" | "right";
  width?: number;
  enterFrame: number;
  exitFrame: number;
}> = ({ title, icon, items, accent = "rgba(125,211,252,0.45)", side, width, enterFrame, exitFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (frame < enterFrame - 3 || frame > exitFrame) return null;
  const local = frame - enterFrame + 3;
  const dir = side === "left" ? -1 : 1;

  // 卡片整体弹入
  const slide = spring({ frame: local, fps, config: { damping: 15, stiffness: 100, mass: 1.0 } });
  const fade = interpolate(frame, [exitFrame - 14, exitFrame], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const float = Math.sin(local * 0.035) * 2;

  const w = width || (side === "left" ? 480 : 640);
  const pos = side === "left" ? { left: 40 } : { right: 40 };

  return (
    <div style={{
      position: "absolute", ...pos, top: 60 + float, zIndex: 65,
      opacity: fade,
      transform: `translateX(${(1 - slide) * 25 * dir}px)`,
      width: w,
    }}>
      {/* 外层：渐变边框 */}
      <div style={{
        borderRadius: 24, padding: 1,
        background: `linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.03))`,
      }}>
        {/* 内层：毛玻璃主体 */}
        <div style={{
          background: "rgba(15,15,20,0.75)",
          backdropFilter: "blur(40px) saturate(180%)",
          WebkitBackdropFilter: "blur(40px) saturate(180%)",
          borderRadius: 19,
          padding: "30px 26px",
          boxShadow: "0 24px 64px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.1)",
        }}>
          {/* 标题行 */}
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            marginBottom: 18, paddingBottom: 14,
            borderBottom: `1px solid rgba(255,255,255,0.06)`,
          }}>
            {icon && <span style={{ fontSize: 16 }}>{icon}</span>}
            <span style={{
              fontFamily: "'ChakraPetch', -apple-system, sans-serif",
              fontSize: 14, color: accent, letterSpacing: 3, fontWeight: 600,
            }}>{title}</span>
          </div>
          {/* 列表项：每行独立卡片 */}
          {items.map((item, i) => {
            const delay = i * 4;
            const si = clamp01((local - delay) / 10);
            return (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 18,
                padding: "16px 18px", marginBottom: i < items.length - 1 ? 4 : 0,
                borderRadius: 12,
                background: "rgba(255,255,255,0.03)",
                border: "0.5px solid rgba(255,255,255,0.06)",
                opacity: si,
                transform: `translateX(${(1 - si) * 10}px)`,
              }}>
                {/* 图标容器 */}
                {item.icon && (
                  <div style={{
                    width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                    background: item.iconBg || `${accent}22`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 22,
                  }}>{item.icon}</div>
                )}
                {/* 文字 */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontFamily: "'LXGW WenKai', -apple-system, sans-serif",
                    fontSize: 21, color: "rgba(255,255,255,0.9)", fontWeight: 500,
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}>{item.text}</div>
                  {item.sub && (
                    <div style={{
                      fontFamily: "-apple-system, sans-serif",
                      fontSize: 15, color: "rgba(255,255,255,0.35)", marginTop: 2,
                    }}>{item.sub}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

function clamp01(v: number) { return Math.min(Math.max(v, 0), 1); }
