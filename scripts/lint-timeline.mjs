#!/usr/bin/env node
// 渲染前 lint：node scripts/lint-timeline.mjs [--src src] [--subtitles <src>/subtitles.json] [--duration 120]
// 未指定 --duration 时读 <src>/Root.tsx 的 DURATION_SECONDS；SCHEDULE 的 subIdx 从 <src>/Composition.tsx 解析。
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { lintTimeline } from "./lib/lint.mjs";

/** 解析 Composition.tsx 里 SCHEDULE 数组（忽略注释行）得到场景列表 */
export function parseSchedule(src) {
  const m = src.match(/const SCHEDULE[^=]*=\s*\[([\s\S]*?)\n\];/);
  if (!m) return [];
  const items = [];
  for (const line of m[1].split("\n")) {
    if (/^\s*\/\//.test(line)) continue;
    const idx = line.match(/subIdx:\s*(-?\d+)/);
    if (!idx) continue;
    const delay = line.match(/delay:\s*([\d.]+)/);
    items.push({ subIdx: Number(idx[1]), ...(delay ? { delay: Number(delay[1]) } : {}) });
  }
  return items;
}

export function parseDuration(src) {
  const m = src.match(/const DURATION_SECONDS\s*=\s*([\d.]+)/);
  return m ? Number(m[1]) : undefined;
}

function main() {
  const args = process.argv.slice(2);
  const get = (k, d) => (args.includes(k) ? args[args.indexOf(k) + 1] : d);
  const srcDir = get("--src", "src");
  const subPath = resolve(get("--subtitles", `${srcDir}/subtitles.json`));
  const rootPath = resolve(srcDir, "Root.tsx");
  const compPath = resolve(srcDir, "Composition.tsx");

  let subtitles;
  try {
    subtitles = JSON.parse(readFileSync(subPath, "utf8"));
  } catch (e) {
    console.error(`无法读取字幕 ${subPath}: ${e.message}`);
    process.exit(2);
  }
  const durationSeconds = get("--duration")
    ? Number(get("--duration"))
    : existsSync(rootPath) ? parseDuration(readFileSync(rootPath, "utf8")) : undefined;
  const schedule = existsSync(compPath) ? parseSchedule(readFileSync(compPath, "utf8")) : [];

  const issues = lintTimeline({ subtitles, durationSeconds, schedule });
  for (const i of issues) console.log(`${i.level === "error" ? "ERROR" : "WARN "} ${i.msg}`);
  const errors = issues.filter((i) => i.level === "error").length;
  console.log(`lint 完成：字幕 ${subtitles.length} 条，场景 ${schedule.length} 个，时长 ${durationSeconds ?? "未知"}s，${errors} 个错误，${issues.length - errors} 个警告`);
  process.exit(errors ? 1 : 0);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
