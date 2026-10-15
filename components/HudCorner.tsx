import React from "react";

export type HudCornerPos = "tl" | "tr" | "bl" | "br";

/** 静态单角 HUD 框（全程显示，无进出场）。需要脉冲/进出场用 HudCorners。 */
export const HudCorner: React.FC<{
  pos: HudCornerPos;
  size?: number;
  color?: string;
  opacity?: number;
  inset?: number;
}> = ({ pos, size = 80, color = "#00F0FF", opacity = 0.5, inset = 20 }) => {
  const v = pos[0] === "t" ? "top" : "bottom";
  const h = pos[1] === "l" ? "left" : "right";
  const corner = { [v]: 0, [h]: 0 } as React.CSSProperties;
  const line: React.CSSProperties = { position: "absolute", background: color };
  return (
    <div style={{ position: "absolute", width: size, height: size, opacity, [v]: inset, [h]: inset, zIndex: 90 }}>
      <div style={{ ...line, width: size, height: 2, ...corner }} />
      <div style={{ ...line, width: 2, height: size, ...corner }} />
    </div>
  );
};
