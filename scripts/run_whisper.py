#!/usr/bin/env python3
"""用 faster-whisper 提取口播视频的时间戳。

用法: python run_whisper.py [输入] [输出json] [模型] [语言] [--device auto|cuda|cpu]
设备默认 auto：优先 CUDA，加载或推理失败自动回退 CPU(int8)。
"""
import argparse
import json

from faster_whisper import WhisperModel


def load_model(model_size, device):
    """按设备加载模型；auto 时先试 CUDA，失败回退 CPU。返回 (model, 实际设备)。"""
    if device in ("auto", "cuda"):
        try:
            return WhisperModel(model_size, device="cuda", compute_type="float16"), "cuda"
        except Exception as e:  # CUDA/cuDNN 缺失时 ctranslate2 抛 RuntimeError
            if device == "cuda":
                raise
            print(f"CUDA 不可用（{e}），回退 CPU")
    return WhisperModel(model_size, device="cpu", compute_type="int8"), "cpu"


def transcribe(model, input_file, language):
    segments, _ = model.transcribe(input_file, language=language)
    # segments 是惰性生成器，CUDA 运行库缺失常在迭代时才报错，所以在此处展开
    return [{"start": s.start, "end": s.end, "text": s.text} for s in segments]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("input", nargs="?", default="public/input-video.mp4")
    ap.add_argument("output", nargs="?", default="whisper_output.json")
    ap.add_argument("model", nargs="?", default="base")
    ap.add_argument("language", nargs="?", default="zh")
    ap.add_argument("--device", choices=["auto", "cuda", "cpu"], default="auto")
    args = ap.parse_args()

    print(f"Loading whisper model: {args.model} (device={args.device})")
    model, used = load_model(args.model, args.device)
    print(f"Transcribing on {used}: {args.input}")
    try:
        result = transcribe(model, args.input, args.language)
    except Exception as e:
        if used == "cuda" and args.device == "auto":
            print(f"CUDA 推理失败（{e}），回退 CPU 重试")
            model = WhisperModel(args.model, device="cpu", compute_type="int8")
            result = transcribe(model, args.input, args.language)
        else:
            raise

    with open(args.output, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    print(f"Saved {len(result)} segments to {args.output}")


if __name__ == "__main__":
    main()
