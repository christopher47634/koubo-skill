#!/bin/bash
# 打包 Skill：SKILL.md + scripts + components + templates + assets + references -> dist/koubo.skill (zip)
# 用法：bash scripts/package.sh [输出文件，默认 dist/koubo.skill]
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="${1:-$ROOT/dist/koubo.skill}"
mkdir -p "$(dirname "$OUT")"
OUT="$(cd "$(dirname "$OUT")" && pwd)/$(basename "$OUT")"
rm -f "$OUT"
cd "$ROOT"
INCLUDE=(SKILL.md LICENSE scripts components templates assets references)
if command -v zip >/dev/null 2>&1; then
    zip -rq "$OUT" "${INCLUDE[@]}" -x '*/__pycache__/*' '*.pyc'
else
    PY=""
    for c in python3 python py; do
        if command -v "$c" >/dev/null 2>&1 && "$c" -c "import zipfile" >/dev/null 2>&1; then PY="$c"; break; fi
    done
    [ -n "$PY" ] || { echo "错误：需要 zip 或 python" >&2; exit 1; }
    "$PY" -c '
import os, sys, zipfile
out, items = sys.argv[1], sys.argv[2:]
with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
    for it in items:
        paths = [it] if os.path.isfile(it) else [os.path.join(d, f) for d, _, fs in os.walk(it) for f in fs]
        for p in paths:
            if "__pycache__" not in p and not p.endswith(".pyc"):
                z.write(p, p.replace(os.sep, "/"))
' "$OUT" "${INCLUDE[@]}"
fi
echo "已生成: $OUT ($(du -h "$OUT" | cut -f1))"
