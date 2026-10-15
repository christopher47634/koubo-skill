// 字幕数据 <-> Remotion @remotion/captions 的 Caption 格式转换
// Caption: { text, startMs, endMs, timestampMs, confidence }
// 参考 https://www.remotion.dev/docs/captions/caption

const toMs = (sec) => Math.round(sec * 1000);

/**
 * 本项目字幕（秒）-> Remotion Caption[]（毫秒）。
 * timestampMs 取区间中点；无置信度时为 null。
 * @param {{text:string,start:number,end:number,confidence?:number|null}[]} subtitles
 */
export function toCaptions(subtitles) {
  return subtitles.map((s) => {
    const startMs = toMs(s.start);
    const endMs = toMs(s.end);
    return {
      text: s.text,
      startMs,
      endMs,
      timestampMs: Math.round((startMs + endMs) / 2),
      confidence: typeof s.confidence === "number" ? s.confidence : null,
    };
  });
}

/**
 * Remotion Caption[] -> 本项目字幕（秒）。en 可按下标补回。
 * @param {{text:string,startMs:number,endMs:number}[]} captions
 * @param {(string|undefined)[]} [en]
 */
export function fromCaptions(captions, en = []) {
  return captions.map((c, index) => {
    const sub = { index, text: c.text, start: c.startMs / 1000, end: c.endMs / 1000 };
    if (en[index]) sub.en = en[index];
    return sub;
  });
}
