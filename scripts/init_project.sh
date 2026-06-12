#!/bin/bash
# 口播视频项目初始化脚本
# 用法：bash init_project.sh

set -e

PROJECT="${MODE1_PROJECT:-/tmp/remotion-demo}"
SKILL_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

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

# 4. 优先复制 Skill 内置音效，E 盘目录作为兼容回退
if [ -d "$SKILL_ROOT/assets/sfx" ]; then
    cp "$SKILL_ROOT"/assets/sfx/*.mp3 "$PROJECT/public/sfx/"
    echo "OK: Skill 内置音效已复制"
elif [ -d /mnt/e/Downloads/sfx ]; then
    cp /mnt/e/Downloads/sfx/*.mp3 "$PROJECT/public/sfx/"
    echo "OK: E 盘音效已复制"
fi

# 5. 复制已验证的组件库；保持组件固有尺寸
if [ -d "$SKILL_ROOT/components" ]; then
    mkdir -p "$PROJECT/src/components"
    cp "$SKILL_ROOT"/components/*.ts "$PROJECT/src/components/"
    cp "$SKILL_ROOT"/components/*.tsx "$PROJECT/src/components/"
    echo "OK: Remotion 组件库已复制"
fi

# 6. 复制 Mode1 模板，不覆盖已存在的项目文件
for template in Composition.tsx Root.tsx subtitles.ts subtitles.json; do
    if [ ! -f "$PROJECT/src/$template" ]; then
        cp "$SKILL_ROOT/templates/$template" "$PROJECT/src/$template"
    fi
done

# 6. 创建 package.json（如果不存在）
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

# 7. 创建 src/index.ts（如果不存在）
if [ ! -f "$PROJECT/src/index.ts" ]; then
    cat > "$PROJECT/src/index.ts" << 'EOF'
import { registerRoot } from "remotion";
import { RemotionRoot } from "./Root";
registerRoot(RemotionRoot);
EOF
fi

# 9. 创建 tsconfig.json（如果不存在）
if [ ! -f "$PROJECT/tsconfig.json" ]; then
    cat > "$PROJECT/tsconfig.json" << 'EOF'
{
  "compilerOptions": {
    "target": "ES2018",
    "module": "commonjs",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true
  },
  "include": ["src"]
}
EOF
fi

# 10. 安装依赖
cd "$PROJECT"
npm install --registry=https://registry.npmmirror.com

echo ""
echo "=== 项目初始化完成 ==="
echo "目录: $PROJECT"
echo "下一步: 将口播视频放入 input/ 目录"
