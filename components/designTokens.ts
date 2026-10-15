import React from "react";

/**
 * 全局缩放参数。需要整体放大/缩小组件时只改这里，不要批量改源码。
 * font  —— 所有 ui.font.* 字号与 fs() 的倍率
 * space —— sp() 作用的内边距/间距倍率
 */
export const scale = { font: 1, space: 1 };

/** 按 scale.font 缩放字号（取整） */
export const fs = (px: number): number => Math.round(px * scale.font);

/** 按 scale.space 缩放间距；接受数字或 "10px 14px" 这类含 px 的字符串 */
export function sp(value: number): number;
export function sp(value: string): string;
export function sp(value: number | string): number | string {
  if (typeof value === "number") return Math.round(value * scale.space);
  return value.replace(/(-?\d+(?:\.\d+)?)px/g, (_, n: string) => `${Math.round(parseFloat(n) * scale.space)}px`);
}

const BASE_FONT = {
  micro: 11,
  tiny: 12,
  caption: 13,
  label: 14,
  small: 15,
  body: 16,
  bodyLg: 17,
  lead: 18,
  leadLg: 19,
  h5: 20,
  h5Lg: 21,
  h4: 22,
  h3: 25,
  en: 26,
  h3Lg: 27,
  h2: 29,
  h2Lg: 30,
  h2Xl: 31,
  h1: 38,
  subtitle: 44,
  display: 48,
  displayLg: 56,
  stat: 72,
  hero: 88,
};

const font = Object.fromEntries(
  Object.entries(BASE_FONT).map(([k, v]) => [k, fs(v)]),
) as { [K in keyof typeof BASE_FONT]: number };

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
  font,
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
