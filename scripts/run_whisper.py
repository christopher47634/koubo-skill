#!/usr/bin/env python3
"""
Run faster-whisper to extract timestamps from video audio.
Based on the whisper code in the koubo.skill workflow.
"""

import json
import sys
from faster_whisper import WhisperModel

def main():
    input_file = sys.argv[1] if len(sys.argv) > 1 else "public/input-video.mp4"
    output_file = sys.argv[2] if len(sys.argv) > 2 else "whisper_output.json"
    model_size = sys.argv[3] if len(sys.argv) > 3 else "base"
    language = sys.argv[4] if len(sys.argv) > 4 else "zh"

    print(f"Loading whisper model: {model_size}")
    model = WhisperModel(model_size, device="cuda")

    print(f"Transcribing: {input_file}")
    segments, info = model.transcribe(input_file, language=language)

    result = [{"start": s.start, "end": s.end, "text": s.text} for s in segments]

    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    print(f"Saved {len(result)} segments to {output_file}")

if __name__ == "__main__":
    main()
