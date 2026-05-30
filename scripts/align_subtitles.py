import json

# 手动校准锚点对齐脚本
# whisper 识别对的句子 → 直接用时间戳作锚点
# whisper 识别错的句子 → 按字数在锚点间插值
# 最小持续时间 0.3s，无重叠

alignment = [
    # (稿子文字, whisper_start, whisper_end)
    # 格式：("文字内容。", 0.0, 3.1),
    # whisper识别正确的用真实时间戳
    # whisper识别错误的估算时间，后续手动校准
]

subtitles = []
for i, (text, start, end) in enumerate(alignment):
    if end <= start:
        end = start + 0.3
    subtitles.append({
        "index": i,
        "text": text,
        "start": round(start, 2),
        "end": round(end, 2),
    })

# 修复重叠
for i in range(1, len(subtitles)):
    if subtitles[i]["start"] < subtitles[i-1]["end"]:
        mid = (subtitles[i-1]["end"] + subtitles[i]["start"]) / 2
        subtitles[i-1]["end"] = round(mid - 0.02, 2)
        subtitles[i]["start"] = round(mid + 0.02, 2)

with open("subtitles.json", "w", encoding="utf-8") as f:
    json.dump(subtitles, f, ensure_ascii=False, indent=2)

print(f"Total: {len(subtitles)} lines")
print(f"Coverage: {subtitles[0]['start']:.1f}s - {subtitles[-1]['end']:.1f}s")
print()
for s in subtitles:
    dur = s["end"] - s["start"]
    print(f"  [{s['start']:6.1f}-{s['end']:6.1f}] ({dur:.1f}s) {s['text'][:45]}")
