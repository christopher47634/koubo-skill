#!/usr/bin/env node
// 导出 Remotion Caption[] JSON：node scripts/export-captions.mjs [src/subtitles.json] [captions.json]
import { readFileSync, writeFileSync } from "node:fs";
import { toCaptions } from "./lib/captions.mjs";

const [inp = "src/subtitles.json", out = "captions.json"] = process.argv.slice(2);
const caps = toCaptions(JSON.parse(readFileSync(inp, "utf8")));
writeFileSync(out, JSON.stringify(caps, null, 2) + "\n");
console.log(`已导出 ${caps.length} 条 Caption -> ${out}`);
