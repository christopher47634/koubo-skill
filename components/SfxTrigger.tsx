import React from "react";
import { Audio, staticFile } from "remotion";
import { useCurrentFrame } from "remotion";

export const SfxTrigger: React.FC<{
  src: string;
  triggerFrame: number;
  volume?: number;
}> = ({ src, triggerFrame, volume = 1.2 }) => {
  const frame = useCurrentFrame();
  if (frame !== triggerFrame) return null;
  return <Audio src={staticFile(src)} volume={volume} />;
};
