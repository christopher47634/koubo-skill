import React from "react";
import {
  AbsoluteFill,
  Audio,
  Video,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Img,
  staticFile,
} from "remotion";
import { subtitles } from "./subtitles";

// ── 素材排期：由 AI 自动生成，用户不手动编辑 ──
type ScheduleItem =
  | { type: "image"; subIdx: number; src: string; label: string; delay?: number }
  | { type: "video"; subIdx: number; src: string; label: string };

// ▼▼▼ AI 自动填充区：根据稿子分析结果生成 ▼▼▼
const SCHEDULE: ScheduleItem[] = [
  // 示例：
  // { type: "image", subIdx: 1, src: "/images/scam-warning.jpg", label: "SCAM" },
  // { type: "image", subIdx: 23, src: "/images/gym-sales.jpg", label: "GYM" },
  // { type: "image", subIdx: 23, src: "/images/money-stack.jpg", label: "SALES", delay: 1.2 },
  // { type: "video", subIdx: 68, src: "/videos/ai-screen.mp4", label: "AI SCREEN" },
];
// ▲▲▲ AI 自动填充区结束 ▲▲▲

// ═══════════════════════════════════════════════
// 以下为锁死模板，永不因内容改变
// ═══════════════════════════════════════════════

// ── Font Face（锁死） ──
const FontLoader: React.FC = () => (
  <style>{`
    @font-face { font-family: 'LXGW WenKai'; src: url('${staticFile("fonts/LXGWWenKai-Regular.ttf")}') format('truetype'); font-weight: normal; font-style: normal; }
    @font-face { font-family: 'ChakraPetch'; src: url('${staticFile("fonts/ChakraPetch-SemiBold.ttf")}') format('truetype'); font-weight: 600; font-style: normal; }
  `}</style>
);

// ── HUD Corner（锁死：80px #00F0FF opacity 0.5 距边缘20px） ──
const HudCorner: React.FC<{ pos: "tl" | "tr" | "bl" | "br" }> = ({ pos }) => {
  const s = 80, c = "#00F0FF", o = 0.5;
  const base: React.CSSProperties = { position: "absolute", width: s, height: s, opacity: o };
  const line: React.CSSProperties = { position: "absolute", background: c };
  const maps = {
    tl: { style: { top: 20, left: 20 }, h: { top: 0, left: 0 }, v: { top: 0, left: 0 } },
    tr: { style: { top: 20, right: 20 }, h: { top: 0, right: 0 }, v: { top: 0, right: 0 } },
    bl: { style: { bottom: 20, left: 20 }, h: { bottom: 0, left: 0 }, v: { bottom: 0, left: 0 } },
    br: { style: { bottom: 20, right: 20 }, h: { bottom: 0, right: 0 }, v: { bottom: 0, right: 0 } },
  };
  const m = maps[pos];
  return (
    <div style={{ ...base, ...m.style }}>
      <div style={{ ...line, width: s, height: 2, ...m.h }} />
      <div style={{ ...line, width: 2, height: s, ...m.v }} />
    </div>
  );
};

// ── REC（锁死：右上角 红色闪烁 15帧切换） ──
const Rec: React.FC<{ frame: number }> = ({ frame }) => {
  const on = Math.floor(frame / 15) % 2 === 0;
  const sec = Math.floor(frame / 30);
  const t = `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;
  return (
    <div style={{ position: "absolute", top: 28, right: 120, display: "flex", alignItems: "center", gap: 8, zIndex: 100 }}>
      <div style={{ width: 10, height: 10, borderRadius: "50%", background: on ? "#FF0040" : "transparent", boxShadow: on ? "0 0 8px #FF0040" : "none" }} />
      <span style={{ fontFamily: "ChakraPetch, sans-serif", fontSize: 14, color: "#FF0040", letterSpacing: 2, fontWeight: 600 }}>REC {t}</span>
    </div>
  );
};

// ── Scanlines（锁死：#00F0FF opacity 0.015 4px间距） ──
const Scanlines: React.FC<{ frame: number }> = ({ frame }) => (
  <div style={{
    position: "absolute", inset: 0, pointerEvents: "none", zIndex: 50,
    background: `repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,240,255,0.015) 3px,rgba(0,240,255,0.015) 4px)`,
    backgroundPosition: `0 ${(frame * 2) % 100}px`,
  }} />
);

// ── Image Overlay（锁死：540x405 right:100 top:340 spring动画 15帧淡出） ──
const ImageItem: React.FC<{
  src: string;
  label: string;
  enterFrame: number;
  exitFrame: number;
  offsetY?: number;
}> = ({ src, label, enterFrame, exitFrame, offsetY = 0 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < enterFrame - 5 || frame > exitFrame) return null;
  const local = frame - enterFrame + 5;

  const scale = spring({ frame: local, fps, config: { damping: 12, stiffness: 150, mass: 0.8 } });
  const fade = interpolate(frame, [exitFrame - 15, exitFrame], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const floatY = Math.sin(local * 0.06) * 3;

  return (
    <div style={{
      position: "absolute",
      right: 100,
      top: 340 + offsetY + floatY,
      width: 540,
      height: 405,
      zIndex: 60,
      opacity: fade,
      transform: `scale(${scale})`,
    }}>
      {/* 发光边框 + 阴影 */}
      <div style={{
        position: "absolute", inset: -3,
        border: "2px solid rgba(0,240,255,0.5)",
        borderRadius: 6,
        boxShadow: "0 0 20px rgba(0,240,255,0.15), 0 4px 30px rgba(0,0,0,0.5)",
        zIndex: 2,
      }} />
      {/* 角标 */}
      <div style={{ position: "absolute", top: -3, left: -3, width: 20, height: 20, borderTop: "2px solid #00F0FF", borderLeft: "2px solid #00F0FF", zIndex: 3 }} />
      <div style={{ position: "absolute", bottom: -3, right: -3, width: 20, height: 20, borderBottom: "2px solid #00F0FF", borderRight: "2px solid #00F0FF", zIndex: 3 }} />
      {/* 图片 */}
      <Img src={staticFile(src)} style={{
        width: "100%", height: "100%", objectFit: "cover", borderRadius: 4,
        filter: "saturate(0.85) contrast(1.1)",
      }} />
      {/* 标签 */}
      <div style={{
        position: "absolute", bottom: 8, right: 12,
        fontFamily: "ChakraPetch, sans-serif", fontSize: 12, color: "#00F0FF",
        letterSpacing: 3, textShadow: "0 0 8px rgba(0,240,255,0.8)", zIndex: 3,
      }}>{label}</div>
      {/* 入场闪光 */}
      {local < 6 && <div style={{
        position: "absolute", inset: 0, zIndex: 4, borderRadius: 4,
        background: `linear-gradient(${local * 30}deg, rgba(0,240,255,0.3), transparent)`,
        mixBlendMode: "screen",
      }} />}
    </div>
  );
};

// ── Video Overlay（锁死：同ImageItem尺寸位置边框，muted+loop） ──
const VideoItem: React.FC<{
  src: string;
  label: string;
  enterFrame: number;
  exitFrame: number;
}> = ({ src, label, enterFrame, exitFrame }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  if (frame < enterFrame - 5 || frame > exitFrame) return null;
  const local = frame - enterFrame + 5;

  const scale = spring({ frame: local, fps, config: { damping: 12, stiffness: 150, mass: 0.8 } });
  const fade = interpolate(frame, [exitFrame - 15, exitFrame], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <div style={{
      position: "absolute",
      right: 100, top: 80,
      width: 540, height: 405,
      zIndex: 60, opacity: fade,
      transform: `scale(${scale})`,
      borderRadius: 6, overflow: "hidden",
      border: "2px solid rgba(0,240,255,0.5)",
      boxShadow: "0 0 20px rgba(0,240,255,0.15), 0 4px 30px rgba(0,0,0,0.5)",
    }}>
      <Video src={staticFile(src)} style={{ width: "100%", height: "100%", objectFit: "cover" }} muted loop />
      <div style={{
        position: "absolute", bottom: 8, right: 12,
        fontFamily: "ChakraPetch, sans-serif", fontSize: 12, color: "#00F0FF",
        letterSpacing: 3, textShadow: "0 0 8px rgba(0,240,255,0.8)", zIndex: 3,
      }}>{label}</div>
      <div style={{ position: "absolute", top: -2, left: -2, width: 20, height: 20, borderTop: "2px solid #00F0FF", borderLeft: "2px solid #00F0FF" }} />
      <div style={{ position: "absolute", bottom: -2, right: -2, width: 20, height: 20, borderBottom: "2px solid #00F0FF", borderRight: "2px solid #00F0FF" }} />
    </div>
  );
};

// ── 关键词高亮（锁死样式，内容由AI根据稿子填充） ──
const HL: Record<string, string> = { tool: "#4FC3F7", concept: "#FFB74D", platform: "#CE93D8", trap: "#EF5350", money: "#A5D6A7" };
// ▼▼▼ AI 自动填充区：根据稿子内容生成关键词分类 ▼▼▼
const KW: Record<string, string> = {
  // tool: 产品名、工具名
  // concept: 抽象概念
  // platform: 平台名、场景
  // trap: 负面词汇、讽刺
  // money: 金额、数字
};
// ▲▲▲ AI 自动填充区结束 ▲▲▲
const sortedKw = Object.keys(KW).sort((a, b) => b.length - a.length);

const highlight = (text: string) => {
  text = text.replace(/[。.]+$/g, "");
  const parts: React.ReactNode[] = [];
  let rest = text, idx = 0;
  while (rest.length > 0) {
    let found = false;
    for (const kw of sortedKw) {
      if (rest.startsWith(kw)) {
        const color = HL[KW[kw]] || "#FFF";
        parts.push(<span key={idx++} style={{ color, textShadow: `0 0 8px ${color}44`, fontWeight: 600 }}>{kw}</span>);
        rest = rest.slice(kw.length); found = true; break;
      }
    }
    if (!found) { parts.push(<span key={idx++} style={{ color: "#E0E0E0" }}>{rest[0]}</span>); rest = rest.slice(1); }
  }
  return parts;
};

// ── Main（锁死逻辑） ──
export const MainComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const currentTime = frame / fps;
  const currentSub = subtitles.find((s) => currentTime >= s.start && currentTime <= s.end);

  // 素材调度（锁死逻辑）
  const activeItems: React.ReactNode[] = [];
  SCHEDULE.forEach((item, i) => {
    const sub = subtitles[item.subIdx];
    if (!sub) return;
    const delay = (item.type === "image" && item.delay) ? item.delay : 0;
    const enter = Math.round((sub.start + delay) * fps);
    // 淡出延迟（锁死：冲突0.5s / 无冲突1.5s）
    const nextConflict = SCHEDULE.find((s) => {
      const ns = subtitles[s.subIdx];
      return ns && ns.start > sub.end && ns.start < sub.end + 2.0;
    });
    const extraHold = nextConflict ? 0.5 : 1.5;
    const exit = Math.round(sub.end * fps) + Math.round(extraHold * fps);

    // 双图偏移（锁死：±200px）
    const sameIdxItems = SCHEDULE.filter((s) => s.subIdx === item.subIdx);
    const idxInGroup = sameIdxItems.indexOf(item);
    const groupSize = sameIdxItems.length;
    const offsetY = groupSize > 1 ? (idxInGroup === 0 ? -200 : 200) : 0;

    if (item.type === "image") {
      activeItems.push(
        <ImageItem key={`img-${i}`} src={item.src} label={item.label} enterFrame={enter} exitFrame={exit} offsetY={offsetY} />
      );
    } else {
      activeItems.push(
        <VideoItem key={`vid-${i}`} src={item.src} label={item.label} enterFrame={enter} exitFrame={exit} />
      );
    }
  });

  const subProg = currentSub
    ? interpolate(frame, [Math.round(currentSub.start * fps), Math.round(currentSub.start * fps) + 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : 0;

  return (
    <AbsoluteFill style={{ background: "#0A0A0A" }}>
      <FontLoader />

      {/* 口播视频（锁死：全屏 muted） */}
      <AbsoluteFill>
        <Video src={staticFile("input-video.mp4")} style={{ width: "100%", height: "100%", objectFit: "cover" }} muted />
      </AbsoluteFill>

      {/* 底部渐变（锁死） */}
      <AbsoluteFill style={{
        background: "linear-gradient(to bottom, transparent 0%, transparent 55%, rgba(0,0,0,0.5) 75%, rgba(0,0,0,0.8) 100%)",
        zIndex: 10,
      }} />

      {/* HUD 全套（锁死） */}
      <Scanlines frame={frame} />
      <HudCorner pos="tl" /><HudCorner pos="tr" /><HudCorner pos="bl" /><HudCorner pos="br" />
      <Rec frame={frame} />

      {/* 帧数（锁死） */}
      <div style={{
        position: "absolute", top: 28, left: 120,
        fontFamily: "ChakraPetch, sans-serif", fontSize: 11, color: "rgba(0,240,255,0.4)", letterSpacing: 2, zIndex: 100,
      }}>FRAME {String(frame).padStart(4, "0")} / {durationInFrames}</div>

      {/* 素材弹入 */}
      {activeItems}

      {/* 字幕（锁死样式：60px居中inline-flex） */}
      {currentSub && (
        <div style={{
          position: "absolute", bottom: 60, left: 0, right: 0, zIndex: 90,
          display: "flex", justifyContent: "center",
          transform: `translateY(${(1 - subProg) * 10}px)`, opacity: subProg,
        }}>
          <div style={{
            display: "inline-flex", justifyContent: "center",
            background: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)",
            border: "1px solid rgba(0,240,255,0.15)", borderRadius: 4, padding: "10px 24px",
          }}>
            <div style={{
              fontFamily: "'LXGW WenKai', 'ChakraPetch', sans-serif",
              fontSize: 60, lineHeight: 1.5, textAlign: "center", letterSpacing: 1,
              textShadow: "0 2px 12px rgba(0,0,0,0.8)",
            }}>{highlight(currentSub.text)}</div>
          </div>
        </div>
      )}

      {/* BGM（锁死：8%音量 循环贯穿） */}
      <Audio src={staticFile("music/track-32.mp3")} volume={0.08} startFrom={0} loop />
      {/* 口播原声（锁死：100%音量） */}
      <Audio src={staticFile("input-video.mp4")} volume={1} />
    </AbsoluteFill>
  );
};
