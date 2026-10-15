import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { lintTimeline } from "../scripts/lib/lint.mjs";
import { parseSchedule, parseDuration } from "../scripts/lint-timeline.mjs";

const errs = (r) => r.filter((i) => i.level === "error");
const ok = [
  { index: 0, text: "a", start: 0, end: 1 },
  { index: 1, text: "b", start: 1, end: 2 },
];

test("合法时间轴无错误", () => {
  assert.equal(errs(lintTimeline({ subtitles: ok, durationSeconds: 5, schedule: [{ subIdx: 1 }] })).length, 0);
});
test("end<=start 报错", () => {
  assert.equal(errs(lintTimeline({ subtitles: [{ text: "a", start: 1, end: 1 }] })).length, 1);
});
test("重叠报错", () => {
  const r = lintTimeline({ subtitles: [{ text: "a", start: 0, end: 2 }, { text: "b", start: 1, end: 3 }] });
  assert.match(errs(r)[0].msg, /重叠/);
});
test("非单调报错", () => {
  const r = lintTimeline({ subtitles: [{ text: "a", start: 5, end: 6 }, { text: "b", start: 1, end: 2 }] });
  assert.match(errs(r)[0].msg, /不单调/);
});
test("超出视频时长报错", () => {
  assert.match(errs(lintTimeline({ subtitles: ok, durationSeconds: 1.5 }))[0].msg, /超出/);
});
test("视频时长<=0 报错", () => {
  assert.equal(errs(lintTimeline({ subtitles: ok, durationSeconds: 0 })).length, 1);
});
test("空文本、负 start 报错", () => {
  assert.equal(errs(lintTimeline({ subtitles: [{ text: " ", start: -1, end: 1 }] })).length, 2);
});
test("场景 subIdx 越界 / 所挂字幕时长为0 报错", () => {
  assert.equal(errs(lintTimeline({ subtitles: ok, schedule: [{ subIdx: 9 }] })).length, 1);
  const r = lintTimeline({ subtitles: [{ text: "a", start: 1, end: 1 }], schedule: [{ subIdx: 0 }] });
  assert.ok(r.some((i) => i.msg.includes("场景 duration 无效")));
});
test("index 与下标不一致仅警告", () => {
  const r = lintTimeline({ subtitles: [{ index: 3, text: "a", start: 0, end: 1 }] });
  assert.equal(errs(r).length, 0);
  assert.equal(r.length, 1);
});
test("仓库自带 subtitles.json / Root / Composition 通过 lint", () => {
  const subs = JSON.parse(readFileSync("templates/subtitles.json", "utf8"));
  const dur = parseDuration(readFileSync("templates/Root.tsx", "utf8"));
  const sched = parseSchedule(readFileSync("templates/Composition.tsx", "utf8"));
  assert.ok(dur > 0);
  assert.equal(errs(lintTimeline({ subtitles: subs, durationSeconds: dur, schedule: sched })).length, 0);
});
test("parseSchedule 忽略注释行并解析 delay", () => {
  const src = 'const SCHEDULE: X[] = [\n  // { subIdx: 1 }\n  { type: "image", subIdx: 4, src: "a", delay: 1.2 },\n];';
  assert.deepEqual(parseSchedule(src), [{ subIdx: 4, delay: 1.2 }]);
});
