import { Composition } from "remotion";
import { MainComposition } from "./Composition";

// ▼▼▼ 替换 DURATION_SECONDS 为 ffprobe 检测到的视频秒数 ▼▼▼
// 例：视频 153.7 秒 → Math.ceil(153.7 * 30) = 4611
const DURATION_SECONDS = 120; // ← 改这里
// ▲▲▲ 替换区结束 ▲▲▲

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="main"
        component={MainComposition}
        durationInFrames={Math.ceil(DURATION_SECONDS * 30)}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
