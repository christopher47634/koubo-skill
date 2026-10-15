import { test } from "node:test";
import assert from "node:assert/strict";
import { toCaptions, fromCaptions } from "../scripts/lib/captions.mjs";

const subs = [
  { index: 0, text: "大家好", en: "Hi", start: 0, end: 2.5 },
  { index: 1, text: "第二句", start: 2.5, end: 4.123 },
];

test("toCaptions 字段与毫秒换算", () => {
  const c = toCaptions(subs);
  assert.deepEqual(c[0], { text: "大家好", startMs: 0, endMs: 2500, timestampMs: 1250, confidence: null });
  assert.equal(c[1].endMs, 4123);
  assert.deepEqual(Object.keys(c[0]).sort(), ["confidence", "endMs", "startMs", "text", "timestampMs"]);
});

test("confidence 透传", () => {
  assert.equal(toCaptions([{ text: "a", start: 0, end: 1, confidence: 0.9 }])[0].confidence, 0.9);
});

test("往返转换保持时间与文本", () => {
  const back = fromCaptions(toCaptions(subs), ["Hi"]);
  assert.equal(back[0].en, "Hi");
  assert.equal(back[1].end, 4.123);
  assert.equal(back[1].text, "第二句");
});
