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
import {
  FontLoader,
  HudCorner,
  RecIndicator,
  ScanLines,
  SubtitleOverlay,
  SUBTITLE_Z_INDEX,
  highlightKeywords,
  ui,
} from "./components";
import type { KeywordMap } from "./components";

// ── 素材排期：由 AI 自动生成，用户不手动编辑 ──
type ScheduleItem =
  | { type: "image"; subIdx: number; src: string; label: string; delay?: number }
  | { type: "video"; subIdx: number; src: string; label: string };

// ▼▼▼ AI 自动填充区：根据稿子分析结果生成 ▼▼▼
// 层级：背景 0-10；内容 60-85；HUD/REC/扫描线 90-100；字幕 SUBTITLE_Z_INDEX(1000)
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
        fontFamily: "ChakraPetch, sans-serif", fontSize: ui.font.tiny, color: "#00F0FF",
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
        fontFamily: "ChakraPetch, sans-serif", fontSize: ui.font.tiny, color: "#00F0FF",
        letterSpacing: 3, textShadow: "0 0 8px rgba(0,240,255,0.8)", zIndex: 3,
      }}>{label}</div>
      <div style={{ position: "absolute", top: -2, left: -2, width: 20, height: 20, borderTop: "2px solid #00F0FF", borderLeft: "2px solid #00F0FF" }} />
      <div style={{ position: "absolute", bottom: -2, right: -2, width: 20, height: 20, borderBottom: "2px solid #00F0FF", borderRight: "2px solid #00F0FF" }} />
    </div>
  );
};

// ── 关键词高亮：分类色见 components/highlight.ts 的 HIGHLIGHT_COLORS ──
// ▼▼▼ AI 自动填充区：根据稿子内容生成关键词分类 ▼▼▼
const KW: KeywordMap = {
  // "豆包": "tool",      // tool: 产品名、工具名
  // "效率": "concept",   // concept: 抽象概念
  // "抖音": "platform",  // platform: 平台名、场景
  // "割韭菜": "trap",    // trap: 负面词汇、讽刺
  // "3980": "money",     // money: 金额、数字
};
// ▲▲▲ AI 自动填充区结束 ▲▲▲

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
      <ScanLines color="0,240,255" lineSpacing={4} opacity={0.1} />
      <HudCorner pos="tl" /><HudCorner pos="tr" /><HudCorner pos="bl" /><HudCorner pos="br" />
      <RecIndicator />

      {/* 帧数（锁死） */}
      <div style={{
        position: "absolute", top: 28, left: 120,
        fontFamily: "ChakraPetch, sans-serif", fontSize: ui.font.micro, color: "rgba(0,240,255,0.4)", letterSpacing: 2, zIndex: 100,
      }}>FRAME {String(frame).padStart(4, "0")} / {durationInFrames}</div>

      {/* 素材弹入 */}
      {activeItems}

      {/* 字幕：中英双语玻璃模板，z-index 固定为 SUBTITLE_Z_INDEX（全局最高层） */}
      {currentSub && (
        <SubtitleOverlay
          key={currentSub.index}
          text={currentSub.text}
          en={currentSub.en}
          startFrame={Math.round(currentSub.start * fps)}
          endFrame={Math.round(currentSub.end * fps)}
          highlightFn={(t) => highlightKeywords(t, KW)}
        />
      )}

      {/* BGM（锁死：8%音量 循环贯穿） */}
      <Audio src={staticFile("music/track-32.mp3")} volume={0.08} startFrom={0} loop />
      {/* 口播原声（锁死：100%音量） */}
      <Audio src={staticFile("input-video.mp4")} volume={1} />
    </AbsoluteFill>
  );
};
