import React from "react";

export const ui = {
  colors: {
    bg: "#07090F",
    surface: "rgba(14,18,28,0.78)",
    surfaceStrong: "rgba(12,15,24,0.92)",
    surfaceSoft: "rgba(255,255,255,0.035)",
    border: "rgba(255,255,255,0.10)",
    borderSoft: "rgba(255,255,255,0.065)",
    text: "#F4F7FB",
    textMuted: "rgba(232,238,248,0.62)",
    textDim: "rgba(220,228,240,0.38)",
    cyan: "#7DD3FC",
    violet: "#C4B5FD",
    green: "#86EFAC",
    amber: "#FCD34D",
    red: "#FCA5A5",
  },
  radius: {
    sm: 10,
    md: 16,
    lg: 22,
    xl: 26,
  },
  glass: {
    background: "linear-gradient(145deg, rgba(19,24,36,0.86), rgba(9,12,20,0.74))",
    backdropFilter: "blur(36px) saturate(175%)",
    WebkitBackdropFilter: "blur(36px) saturate(175%)",
    border: "0.5px solid rgba(255,255,255,0.10)",
    boxShadow: "0 24px 64px rgba(0,0,0,0.34), inset 0 1px 0 rgba(255,255,255,0.11), inset 0 -1px 0 rgba(0,0,0,0.18)",
  } satisfies React.CSSProperties,
};

export const rgba = (hex: string, alpha: number): string => {
  const normalized = hex.replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) return hex;
  const value = Number.parseInt(normalized, 16);
  return `rgba(${(value >> 16) & 255},${(value >> 8) & 255},${value & 255},${alpha})`;
};
