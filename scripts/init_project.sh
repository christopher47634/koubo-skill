#!/bin/bash
# 口播视频项目初始化脚本
# 用法：bash init_project.sh

set -e

PROJECT="/tmp/remotion-demo"

# 1. 创建目录结构
mkdir -p "$PROJECT"/{input,public/{fonts,images,videos,music,sfx},src}

# 2. 复制字体（从E盘项目备份）
if [ -d /mnt/e/Downloads/remotion-project/public/fonts ]; then
    cp /mnt/e/Downloads/remotion-project/public/fonts/*.ttf "$PROJECT/public/fonts/"
    echo "OK: 字体已复制"
else
    echo "WARN: E盘没有字体备份，需要手动放入 LXGWWenKai-Regular.ttf 和 ChakraPetch-SemiBold.ttf"
fi

# 3. 复制BGM（从E盘永久资产）
if [ -f /mnt/e/Downloads/bgm/track-32.mp3 ]; then
    cp /mnt/e/Downloads/bgm/track-32.mp3 "$PROJECT/public/music/"
    echo "OK: BGM已复制"
fi

# 4. 复制音效（从E盘永久资产）
if [ -d /mnt/e/Downloads/sfx ]; then
    cp /mnt/e/Downloads/sfx/*.mp3 "$PROJECT/public/sfx/"
    echo "OK: 音效已复制"
fi

# 5. 创建 package.json（如果不存在）
if [ ! -f "$PROJECT/package.json" ]; then
    cat > "$PROJECT/package.json" << 'EOF'
{
  "name": "remotion-oral-video",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "start": "remotion studio",
    "render": "TMPDIR=/tmp remotion render src/index.ts main output.mp4 --codec h264"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "remotion": "^4.0.0",
    "@remotion/cli": "^4.0.0",
    "@remotion/bundler": "^4.0.0",
    "@remotion/renderer": "^4.0.0",
    "@remotion/media-utils": "^4.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/react": "^18.0.0"
  }
}
EOF
    echo "OK: package.json 已创建"
fi

# 6. 创建 src/index.ts（如果不存在）
if [ ! -f "$PROJECT/src/index.ts" ]; then
    cat > "$PROJECT/src/index.ts" << 'EOF'
import { registerRoot } from "remotion";
import { RemotionRoot } from "./Root";
registerRoot(RemotionRoot);
EOF
fi

# 7. 创建 src/subtitles.ts（如果不存在）
if [ ! -f "$PROJECT/src/subtitles.ts" ]; then
    cat > "$PROJECT/src/subtitles.ts" << 'EOF'
export interface Subtitle {
  index: number;
  text: string;
  start: number;
  end: number;
}
import data from "./subtitles.json";
export const subtitles: Subtitle[] = data as Subtitle[];
EOF
fi

# 8. 创建 tsconfig.json（如果不存在）
if [ ! -f "$PROJECT/tsconfig.json" ]; then
    cat > "$PROJECT/tsconfig.json" << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"]
}
EOF
fi

# 9. 安装依赖
cd "$PROJECT"
npm install --registry=https://registry.npmmirror.com

echo ""
echo "=== 项目初始化完成 ==="
echo "目录: $PROJECT"
echo "下一步: 将口播视频放入 input/ 目录"
