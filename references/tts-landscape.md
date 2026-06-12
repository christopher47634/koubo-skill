# TTS Landscape (2026)

## Pre-installed on this system

- **edge-tts 7.2.8** — Microsoft Edge online TTS. Free, no registration, 70+ languages including Chinese. Quality: medium-good (mechanical/stiff for Chinese). Config: network only, no local resources. Use: `edge-tts --voice zh-CN-YunxiNeural --text "..." --write-media out.mp3`

## Cloud TTS (recommended for Chinese)

### MiniMax T2A ⭐ 最佳中文TTS
- **Quality**: Best-in-class Chinese TTS. Natural prosody, emotion control, 30+ Chinese voices.
- **Key feature**: `subtitle_enable: true` 自动生成字幕时间戳 — 省掉 whisper 对齐步骤！
- **API**: `POST https://api.minimaxi.com/v1/t2a_v2` (同步), model: `speech-2.8-hd`
- **Auth**: `Authorization: Bearer <API_KEY>` (需注册 https://platform.minimaxi.com)
- **Limits**: 同步单次 ≤10,000 字符; 异步 ≤100,000 字符
- **Output**: hex 编码 MP3, 可设 sample_rate/bitrate/format
- **Params**: voice_id, speed, vol, pitch, emotion (happy/neutral/sad/angry 等)
- **Free tier**: 新用户送几块钱额度，够测试; 付费详见 https://platform.minimaxi.com/docs/guides/pricing-speech
- **Doc index**: https://platform.minimaxi.com/docs/llms.txt
- **Chris选定课程男声**: `male-qn-daxuesheng`（青年大学生）— 用于"AI上大学"全15课
- **推荐课程男声**:
  - `male-qn-daxuesheng` — 青年大学生（最贴合课程主题）✅ Chris选定
  - `male-qn-qingse` — 青涩青年
  - `male-qn-jingying` — 精英青年（试听过，7秒样本音质OK）
  - `junlang_nanyou` — 俊朗男友
  - `Chinese (Mandarin)_Gentleman` — 温润男声
- **示例 curl**:
  ```bash
  curl -X POST "https://api.minimaxi.com/v1/t2a_v2" \
    -H "Authorization: Bearer $MINIMAX_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{
      "model": "speech-2.8-hd",
      "text": "你好，欢迎来到AI上大学！",
      "stream": false,
      "voice_setting": {
        "voice_id": "male-qn-daxuesheng",
        "speed": 1.0,
        "vol": 1,
        "pitch": 0,
        "emotion": "happy"
      },
      "audio_setting": {
        "sample_rate": 32000,
        "bitrate": 128000,
        "format": "mp3",
        "channel": 1
      },
      "subtitle_enable": true
    }'
  ```
- **响应中提取音频**: `extra_info` 包含 audio_length/audio_size; `data.audio` 是 hex 编码的 mp3
- **字幕**: 开启 subtitle_enable 后响应包含字幕时间戳（比 whisper 对齐更准）
- **Voice clone**: 支持音色复刻（上传音频即可），详见 API docs

### ElevenLabs
- **Free tier**: 10,000 chars/month (~10 min audio). No credit card needed.
- **Voice cloning**: NOT available on free tier. Requires Starter ($5/mo) minimum.
- **Free tier limits**: max 3 custom voices, no commercial use, must attribute ElevenLabs.
- **Paid tiers**: Starter $5/mo (30K chars, IVC), Creator $22/mo (100K chars, PVC), Pro $99/mo.
- **Quality**: Highest in industry, near-human. Supports 70+ languages.
- **API**: Available on all tiers including free.
- **Website**: https://elevenlabs.io/zh

### Other cloud TTS
- Google Cloud TTS, Azure Speech, AWS Polly — all have free tiers but require setup.

## Local TTS (self-hosted, free, unlimited)

- **Coqui TTS** — Open source, supports Chinese. Needs GPU (4GB+ VRAM).
- **Bark** — Emotional expression, multi-speaker. Needs GPU (6GB+ VRAM).
- **Piper** — Lightweight, CPU-friendly. Limited Chinese support.
- **XTTS** — Coqui's multilingual model. Good quality, GPU required.

## Decision matrix

| Need | Solution |
|------|----------|
| Quick test, free, no setup | edge-tts (already installed) |
| Chinese TTS, best quality | **MiniMax T2A** (API key needed) |
| Chinese TTS + auto subtitles | **MiniMax T2A** (subtitle_enable) |
| Best quality, budget $5+/mo | ElevenLabs Starter |
| Voice cloning, free | MiniMax (新用户额度) |
| Unlimited local generation | Coqui TTS or Bark (needs GPU) |
| Chinese TTS, no API key | edge-tts (fallback) |

## Pitfalls

1. **MiniMax TTS ≠ MiniMax Messages API**: TTS 用 `/v1/t2a_v2`，对话用 `/anthropic/v1/messages`，两个完全不同的端点
2. **MiniMax 不在 Hermes 内置 TTS provider 中**: 系统 config.yaml 的 tts.providers 只有 edge/elevenlabs/openai/xai/mistral/piper。MiniMax 需要直接 curl 调用。
3. **edge-tts 中文机械感强**: 用户多次反馈"难听"，中文课程视频建议升级到 MiniMax
4. **subtitle_enable 省掉 whisper**: 这是 MiniMax TTS 的杀手级 feature — 其他 TTS 都需要额外跑 whisper 对齐字幕
5. **Hex 编码输出**: MiniMax 返回的 audio 是 hex 字符串，需要 `bytes.fromhex()` 解码后再写文件
6. **API Key 安全层截断**: Hermes 安全层会自动检测并截断 terminal/write_file 中的 API key（截断为 ~14 字符）。`sys.argv[1]` 传参可能第一次成功，后续被截断导致 auth error 1004。**解决流程**: (1) 先尝试 `sys.argv[1]`，如果返回 auth error 1004 说明被截断; (2) 让用户在终端手动 `echo '完整key' > /tmp/.minimax_key`，脚本从文件读取; (3) 不要在对话中重复粘贴 key — 安全层已经见过它，后续所有写入都会被截断。**注意**: `os.environ` 读取 `MINIMAX_KEY` 环境变量也可能被截断（实测 env var 只有13字符）。
7. **MiniMax 错误码速查**: 1004=API key 无效/截断, 1008=余额不足, 2056=用量限制超限。遇到 1004 先检查 key 是否被安全层截断，不一定是 key 本身的问题。
