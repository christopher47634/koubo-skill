#!/bin/bash
# 类型检查：把 templates/ + components/ 按项目布局拼到临时目录，npm install 后跑 tsc --noEmit
# 用法：bash scripts/typecheck.sh [工作目录，默认 mktemp]
set -euo pipefail
SKILL_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORK="${1:-$(mktemp -d)}"
mkdir -p "$WORK/src/components"
cp "$SKILL_ROOT"/templates/* "$WORK/src/" 2>/dev/null || true
mv "$WORK/src/package.json" "$WORK/src/tsconfig.json" "$WORK/"
cp "$SKILL_ROOT"/components/*.ts "$SKILL_ROOT"/components/*.tsx "$WORK/src/components/"
cd "$WORK"
[ -d node_modules ] || npm install --no-audit --no-fund ${NPM_REGISTRY:+--registry="$NPM_REGISTRY"}
npx tsc --noEmit && echo "typecheck OK ($WORK)"
