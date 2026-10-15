#!/bin/bash
# 口播视频项目初始化脚本
# 用法：bash init_project.sh [项目目录]
#
# 环境变量（均可选）：
#   KOUBO_PROJECT   项目目录，默认 $HOME/koubo-project（也可用第 1 个参数）
#   KOUBO_FONT_DIR  含 LXGWWenKai-Regular.ttf / ChakraPetch-SemiBold.ttf 的目录
#   KOUBO_BGM       背景音乐 mp3 文件路径（需自备，仓库不带）
#   NPM_REGISTRY    npm 镜像地址，不设则用默认源（国内可设 https://registry.npmmirror.com）

set -euo pipefail

SKILL_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PROJECT="${1:-${KOUBO_PROJECT:-$HOME/koubo-project}}"

# 1. 创建目录结构
mkdir -p "$PROJECT"/{input,public/{fonts,images,videos,music,sfx},src/components}
echo "项目目录: $PROJECT"

# 2. 复制字体（缺失不致命，只警告）
if [ -n "${KOUBO_FONT_DIR:-}" ] && compgen -G "$KOUBO_FONT_DIR/*.ttf" > /dev/null; then
    cp "$KOUBO_FONT_DIR"/*.ttf "$PROJECT/public/fonts/"
    echo "OK: 字体已从 $KOUBO_FONT_DIR 复制"
else
    echo "WARN: 未提供字体。请把 LXGWWenKai-Regular.ttf 与 ChakraPetch-SemiBold.ttf"
    echo "      放进 $PROJECT/public/fonts/（或设置 KOUBO_FONT_DIR 后重跑）"
fi

# 3. 复制 BGM（需用户自备）
if [ -n "${KOUBO_BGM:-}" ] && [ -f "$KOUBO_BGM" ]; then
    cp "$KOUBO_BGM" "$PROJECT/public/music/track-32.mp3"
    echo "OK: BGM 已复制为 public/music/track-32.mp3"
else
    echo "WARN: 未提供 BGM。请自备 mp3 放到 $PROJECT/public/music/track-32.mp3（或设置 KOUBO_BGM）"
fi

# 4. 复制 Skill 内置音效
if compgen -G "$SKILL_ROOT/assets/sfx/*.mp3" > /dev/null; then
    cp "$SKILL_ROOT"/assets/sfx/*.mp3 "$PROJECT/public/sfx/"
    echo "OK: 内置音效已复制"
fi

# 5. 复制组件库
cp "$SKILL_ROOT"/components/*.ts "$SKILL_ROOT"/components/*.tsx "$PROJECT/src/components/"
echo "OK: 组件库已复制"

# 6. 复制模板（不覆盖已存在的项目文件）
for f in Composition.tsx Root.tsx index.ts subtitles.ts subtitles.json; do
    [ -f "$PROJECT/src/$f" ] || cp "$SKILL_ROOT/templates/$f" "$PROJECT/src/$f"
done
for f in package.json tsconfig.json; do
    [ -f "$PROJECT/$f" ] || cp "$SKILL_ROOT/templates/$f" "$PROJECT/$f"
done
echo "OK: 模板已复制（package.json 锁定 remotion 4.0.290）"

# 7. 安装依赖
cd "$PROJECT"
npm install --no-audit --no-fund ${NPM_REGISTRY:+--registry="$NPM_REGISTRY"}

echo ""
echo "=== 项目初始化完成 ==="
echo "目录: $PROJECT"
echo "下一步: 将口播视频放入 $PROJECT/input/"
