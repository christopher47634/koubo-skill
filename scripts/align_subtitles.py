#!/usr/bin/env python3
"""锚点对齐：把稿子句子和 whisper 时间戳合成 subtitles.json。

用法: python align_subtitles.py alignment.json [输出，默认 subtitles.json]

alignment.json 是数组，每项 [稿子文字, start, end] 或 {"text","start","end","en"(可选)}：
  [["第一句。", 0.0, 3.1], ["第二句。", 3.6, 7.1]]
whisper 识别对的句子用真实时间戳；识别错的按字数在锚点间估算后手动校准。
规则：每句最短 0.3s，相邻字幕不重叠且严格保证 start < end、时间单调递增。
"""
import json
import math
import sys

MIN_DURATION = 0.3
OVERLAP_GAP = 0.02


def load(path):
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    if not isinstance(data, list) or not data:
        sys.exit(f"错误：{path} 必须是非空数组，每项为 [文字, start, end] 或 {{text,start,end}}。")
    items = []
    for i, row in enumerate(data):
        if isinstance(row, dict):
            if "text" not in row or "start" not in row or "end" not in row:
                sys.exit(f"错误：第 {i} 项缺少 text/start/end：{row!r}")
            items.append((row["text"], float(row["start"]), float(row["end"]), row.get("en")))
        elif isinstance(row, (list, tuple)) and len(row) >= 3:
            items.append((row[0], float(row[1]), float(row[2]), row[3] if len(row) >= 4 else None))
        else:
            sys.exit(f"错误：第 {i} 项格式不对：{row!r}")
    return items


def build(items, min_duration=MIN_DURATION):
    if not items:
        raise ValueError("items 不能为空")
    subs = []
    prev_raw_start = None
    for i, (text, start, end, en) in enumerate(items):
        if not isinstance(text, str) or not text.strip():
            raise ValueError(f"第 {i} 项 text 不能为空")
        if not (math.isfinite(start) and math.isfinite(end)):
            raise ValueError(f"第 {i} 项 start/end 必须是有限数字")
        if start < 0:
            raise ValueError(f"第 {i} 项 start 不能为负：{start}")
        if prev_raw_start is not None and start < prev_raw_start:
            raise ValueError(
                f"第 {i} 项 start({start}) 早于上一条 start({prev_raw_start})，请先按时间顺序排列"
            )
        prev_raw_start = start
        if end - start < min_duration:
            end = start + min_duration
        s = {"index": i, "text": text.strip()}
        if en:
            s["en"] = en
        s.update(start=round(start, 2), end=round(end, 2))
        subs.append(s)

    for i in range(1, len(subs)):
        prev, cur = subs[i - 1], subs[i]
        if cur["start"] < prev["end"]:
            mid = round((prev["end"] + cur["start"]) / 2, 2)
            # 优先取中点切分；但绝不能把 prev 或 cur 压成 start >= end（原实现在重度重叠时会倒挂）
            min_prev_end = round(prev["start"] + min(0.1, min_duration), 2)
            new_prev_end = max(min_prev_end, round(mid - OVERLAP_GAP, 2))
            new_cur_start = max(round(new_prev_end + OVERLAP_GAP, 2), round(mid + OVERLAP_GAP, 2))
            prev["end"] = new_prev_end
            cur["start"] = new_cur_start
            if cur["end"] <= cur["start"] or cur["end"] - cur["start"] < min_duration:
                cur["end"] = round(cur["start"] + min_duration, 2)

    return subs


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    subs = build(load(sys.argv[1]))
    out = sys.argv[2] if len(sys.argv) > 2 else "subtitles.json"
    with open(out, "w", encoding="utf-8") as f:
        json.dump(subs, f, ensure_ascii=False, indent=2)
    print(f"Total: {len(subs)} lines -> {out}")
    print(f"Coverage: {subs[0]['start']:.1f}s - {subs[-1]['end']:.1f}s\n")
    for s in subs:
        print(f"  [{s['start']:6.1f}-{s['end']:6.1f}] ({s['end'] - s['start']:.1f}s) {s['text'][:45]}")


if __name__ == "__main__":
    main()
