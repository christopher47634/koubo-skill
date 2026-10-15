# assets

## sfx/ 音效

`sfx/` 下 32 个 mp3 全部由 ffmpeg 的 lavfi 滤镜（`sine`、`anoisesrc` 加淡入淡出、高低通等）合成，不含任何第三方采样，没有额外版权要求，随仓库 MIT 许可证分发。

重新生成或新增音效的命令见 `../references/sfx.md`；组件与音效的对应关系也在该文件中。`scripts/init_project.sh` 会把它们复制到项目的 `public/sfx/`。

## BGM 背景音乐

仓库**不提供** BGM。模板默认读取 `public/music/track-32.mp3`，请自备音乐：

- 选择可商用、授权清晰的曲目（如自己制作、购买或 CC0 / 明确允许视频使用的来源），公开发布前确认授权。
- 用 `KOUBO_BGM=/path/to/music.mp3 bash scripts/init_project.sh` 复制到项目，或手动放到 `public/music/track-32.mp3`。
- 不想要 BGM 时删掉 `templates/Composition.tsx` 里对应的 `<Audio ... loop />` 一行。

## 字体

字体文件同样不随仓库分发，请自行下载 LXGW WenKai 与 Chakra Petch（见根目录 README），通过 `KOUBO_FONT_DIR` 指定或手动放入 `public/fonts/`。
