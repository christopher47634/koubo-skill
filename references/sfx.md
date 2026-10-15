# 音效（SFX）与 BGM

`assets/sfx/` 里的 32 个 mp3 全部由 ffmpeg lavfi 合成，无第三方素材；BGM 不随仓库提供，需自备（见 `assets/README.md`）。

## 规则

- 音频领先视觉 2 帧：`triggerFrame = Math.max(0, enterFrame - 2)`。
- 默认音量 1.2。
- BGM：音量 0.08（用户要求时可降到 0.06），`loop`，`startFrom: 0`，文件 `public/music/track-32.mp3`。
- 口播原声音量 1.0，来源 `input-video.mp4`；画面中的 `<Video>` 必须 `muted`。

## 触发组件

直接用 `components/SfxTrigger.tsx`：

```tsx
import { SfxTrigger } from "./components";
<SfxTrigger src="sfx/whoosh.mp3" triggerFrame={Math.max(0, enterFrame - 2)} />
```

注意：不能在文件里用 `require("remotion")`，必须顶部 `import`，否则报 `inputRange must contain only numbers`。

## 组件 → 音效映射

| 元素 | 文件 |
|------|------|
| Tag | click.mp3 |
| ListCard / GlassCard / MacWindow / MacTerminal | slide.mp3 |
| ChatBubble | notification.mp3 |
| MacCodeEditor | typing.mp3 |
| FeatureCard | pop.mp3 |
| StepIndicator 完成 | success.mp3 |
| CounterAnimation | counter-tick.mp3 |
| TypewriterText | typewriter-key.mp3 |
| CardStack | card-fan.mp3 |
| CircularGauge 填充 / 满 | gauge-fill.mp3 / gauge-complete.mp3 |
| AnimatedChecklist | check.mp3 |
| NotificationToast | toast-in.mp3 |
| Divider | sweep.mp3 |
| MetricCard | metric-pop.mp3 |
| LowerThird | lower-third.mp3 |
| ScreenRecording | rec-start.mp3 |
| 通用轻提示 | chime.mp3 |
| GlitchText | glitch-fast.mp3 |
| NeonBorder | neon-buzz.mp3 |
| PulseRing | pulse.mp3 |
| CircuitLines | circuit.mp3 |
| HudCorners | hud-scan.mp3 |

## ffmpeg 合成命令

```bash
mkdir -p public/sfx
# whoosh 滑入
ffmpeg -y -f lavfi -i "anoisesrc=d=0.3:c=pink:a=0.5" -af "afade=t=in:st=0:d=0.05,afade=t=out:st=0.15:d=0.15,highpass=f=2000,lowpass=f=10000,volume=1.5" -c:a libmp3lame -q:a 2 public/sfx/whoosh.mp3
# pop 弹出
ffmpeg -y -f lavfi -i "sine=f=800:d=0.15" -af "afade=t=in:st=0:d=0.01,afade=t=out:st=0.05:d=0.1,volume=0.8" -c:a libmp3lame -q:a 2 public/sfx/pop.mp3
# slide 滑动
ffmpeg -y -f lavfi -i "sine=f=400:d=0.25" -af "afade=t=in:st=0:d=0.02,afade=t=out:st=0.15:d=0.1,volume=0.7" -c:a libmp3lame -q:a 2 public/sfx/slide.mp3
# notification 双音通知
ffmpeg -y -f lavfi -i "sine=f=800:d=0.1" -f lavfi -i "sine=f=1200:d=0.15" -filter_complex "[0]afade=t=in:st=0:d=0.01,afade=t=out:st=0.04:d=0.06,volume=1.2[a];[1]adelay=80|80,afade=t=in:st=0:d=0.01,afade=t=out:st=0.06:d=0.09,volume=1.0[b];[a][b]amix=inputs=2" -c:a libmp3lame -q:a 2 public/sfx/notification.mp3
# click 点击
ffmpeg -y -f lavfi -i "anoisesrc=d=0.05:c=white:a=0.3" -af "afade=t=in:st=0:d=0.005,afade=t=out:st=0.01:d=0.04,highpass=f=3000,volume=2.0" -c:a libmp3lame -q:a 2 public/sfx/click.mp3
# typing 打字
ffmpeg -y -f lavfi -i "anoisesrc=d=0.03:c=white:a=0.4" -af "highpass=f=4000,volume=2.0" -c:a libmp3lame -q:a 2 public/sfx/typing.mp3
# success 三音和弦
ffmpeg -y -f lavfi -i "sine=f=523:d=0.1" -f lavfi -i "sine=f=659:d=0.1" -f lavfi -i "sine=f=784:d=0.15" -filter_complex "[0]afade=t=in:st=0:d=0.01,afade=t=out:st=0.04:d=0.06,volume=1.0[a];[1]adelay=60|60,afade=t=in:st=0:d=0.01,afade=t=out:st=0.04:d=0.06,volume=1.0[b];[2]adelay=120|120,afade=t=in:st=0:d=0.01,afade=t=out:st=0.08:d=0.07,volume=1.0[c];[a][b][c]amix=inputs=3" -c:a libmp3lame -q:a 2 public/sfx/success.mp3
```

科技感音效（短促、高频、干净）：

```bash
# glitch-fast
ffmpeg -y -f lavfi -i "anoisesrc=d=0.08:c=white:a=0.5" -af "highpass=f=2000,volume=2.5,afade=t=out:st=0.04:d=0.04" -c:a libmp3lame -q:a 2 glitch-fast.mp3
# neon-buzz
ffmpeg -y -f lavfi -i "sine=f=120:d=0.15" -af "vibrato=f=8:d=0.5,afade=t=in:st=0:d=0.03,afade=t=out:st=0.08:d=0.07,volume=1.0" -c:a libmp3lame -q:a 2 neon-buzz.mp3
# pulse
ffmpeg -y -f lavfi -i "sine=f=500:d=0.2" -af "afade=t=in:st=0:d=0.05,afade=t=out:st=0.1:d=0.1,vibrato=f=3:d=0.4,volume=1.5" -c:a libmp3lame -q:a 2 pulse.mp3
# circuit
ffmpeg -y -f lavfi -i "sine=f=2200:d=0.05" -af "afade=t=in:st=0:d=0.01,afade=t=out:st=0.02:d=0.03,volume=1.8" -c:a libmp3lame -q:a 2 circuit.mp3
# hud-scan
ffmpeg -y -f lavfi -i "anoisesrc=d=0.2:c=pink:a=0.25" -af "highpass=f=4000,afade=t=in:st=0:d=0.05,afade=t=out:st=0.1:d=0.1,volume=1.5" -c:a libmp3lame -q:a 2 hud-scan.mp3
# counter-tick
ffmpeg -y -f lavfi -i "sine=f=1800:d=0.04" -af "afade=t=in:st=0:d=0.005,afade=t=out:st=0.02:d=0.02,volume=1.8" -c:a libmp3lame -q:a 2 counter-tick.mp3
# typewriter-key
ffmpeg -y -f lavfi -i "anoisesrc=d=0.03:c=white:a=0.6" -af "highpass=f=3000,lowpass=f=8000,afade=t=in:st=0:d=0.003,afade=t=out:st=0.01:d=0.02,volume=2.0" -c:a libmp3lame -q:a 2 typewriter-key.mp3
# card-fan
ffmpeg -y -f lavfi -i "anoisesrc=d=0.25:c=pink:a=0.4" -af "afade=t=in:st=0:d=0.03,afade=t=out:st=0.08:d=0.17,highpass=f=1500,lowpass=f=6000,volume=1.5" -c:a libmp3lame -q:a 2 card-fan.mp3
# check
ffmpeg -y -f lavfi -i "sine=f=2400:d=0.06" -af "afade=t=in:st=0:d=0.01,afade=t=out:st=0.03:d=0.03,volume=2.0" -c:a libmp3lame -q:a 2 check.mp3
# toast-in
ffmpeg -y -f lavfi -i "sine=f=1200:d=0.08" -af "afade=t=in:st=0:d=0.01,afade=t=out:st=0.04:d=0.04,volume=1.8" -c:a libmp3lame -q:a 2 toast-in.mp3
# sweep
ffmpeg -y -f lavfi -i "anoisesrc=d=0.15:c=pink:a=0.3" -af "afade=t=in:st=0:d=0.05,afade=t=out:st=0.08:d=0.07,highpass=f=4000,volume=1.5" -c:a libmp3lame -q:a 2 sweep.mp3
# lower-third
ffmpeg -y -f lavfi -i "anoisesrc=d=0.18:c=pink:a=0.35" -af "afade=t=in:st=0:d=0.02,afade=t=out:st=0.06:d=0.12,highpass=f=2000,lowpass=f=7000,volume=1.6" -c:a libmp3lame -q:a 2 lower-third.mp3
```
