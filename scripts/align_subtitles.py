#!/usr/bin/env python3
"""锚点对齐：把稿子句子和 whisper 时间戳合成 subtitles.json。

用法: python align_subtitles.py alignment.json [输出，默认 subtitles.json]

alignment.json 是数组，每项 [稿子文字, start, end] 或 {"text","start","end","en"(可选)}：
  [["第一句。", 0.0, 3.1], ["第二句。", 3.6, 7.1]]
whisper 识别对的句子用真实时间戳；识别错的按字数在锚点间估算后手动校准。
规则：每句最短 0.3s，相邻字幕不重叠。
"""
import json
import sys


def load(path):
    with open(path, encoding="utf-8") as f:
        data = json.load(f)
    if not isinstance(data, list) or not data:
        sys.exit(f"错误：{path} 必须是非空数组，每项为 [文字, start, end] 或 {{text,start,end}}。")
    items = []
    for i, row in enumerate(data):
        if isinstance(row, dict):
            items.append((row["text"], float(row["start"]), float(row["end"]), row.get("en")))
        elif isinstance(row, (list, tuple)) and len(row) >= 3:
            items.append((row[0], float(row[1]), float(row[2]), None))
        else:
            sys.exit(f"错误：第 {i} 项格式不对：{row!r}")
    return items


def build(items):
    subs = []
    for i, (text, start, end, en) in enumerate(items):
        if end - start < 0.3:
            end = start + 0.3
        s = {"index": i, "text": text}
        if en:
            s["en"] = en
        s.update(start=round(start, 2), end=round(end, 2))
        subs.append(s)
    for i in range(1, len(subs)):
        if subs[i]["start"] < subs[i - 1]["end"]:
            mid = (subs[i - 1]["end"] + subs[i]["start"]) / 2
            subs[i - 1]["end"] = round(mid - 0.02, 2)
            subs[i]["start"] = round(mid + 0.02, 2)
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
