#!/usr/bin/env python3
"""
批量放大/缩小 Remotion UI 组件的字号、内边距、图标容器等。
用法: python3 scale_components.py [components_dir]

Chris 要求所有组件整体放大时使用。
放大规则基于 1920x1080 视频分辨率。

支持两种 fontSize 写法：
- 字面量：fontSize: 48,
- 变量默认值：fontSize = 48
"""
import re
import sys
import os

def scale_content(content: str) -> str:
    # 1. fontSize 字面量 (fontSize: 48,)
    def inc_font(match):
        prefix = match.group(1)
        size = int(match.group(2))
        suffix = match.group(3)
        if size < 14: nv = size + 3
        elif size < 20: nv = size + 4
        elif size < 30: nv = size + 5
        elif size < 50: nv = size + 6
        else: nv = size + 8
        return f"{prefix}{nv}{suffix}"
    content = re.sub(r'(fontSize:\s*)(\d+)(,)', inc_font, content)

    # 1b. fontSize 变量默认值 (fontSize = 48)
    def inc_font_var(match):
        prefix = match.group(1)
        size = int(match.group(2))
        suffix = match.group(3)
        if size < 14: nv = size + 3
        elif size < 20: nv = size + 4
        elif size < 30: nv = size + 5
        elif size < 50: nv = size + 6
        else: nv = size + 8
        return f"{prefix}{nv}{suffix}"
    content = re.sub(r'(fontSize\s*=\s*)(\d+)(\s*[,)])', inc_font_var, content)

    # 2. padding with px
    def inc_pad(match):
        full = match.group(0)
        nums = re.findall(r'(\d+)px', full)
        if not nums: return full
        result = full
        for n in nums:
            v = int(n)
            nv = v + (4 if v < 20 else 6 if v < 40 else 8)
            result = result.replace(f'{n}px', f'{nv}px', 1)
        return result
    content = re.sub(r'padding:\s*["\'][^"\']*px[^"\']*["\']', inc_pad, content)

    # 3. icon containers (width/height 36-52)
    def inc_icon(match):
        prefix = match.group(1)
        size = int(match.group(2))
        suffix = match.group(3)
        return f"{prefix}{size + (6 if size < 40 else 8 if size < 50 else 10)}{suffix}"
    content = re.sub(r'(width:\s*)(36|40|44|52)(,)', inc_icon, content)
    content = re.sub(r'(height:\s*)(36|40|44|52)(,)', inc_icon, content)

    # 4. borderRadius
    def inc_radius(match):
        prefix = match.group(1)
        val = int(match.group(2))
        suffix = match.group(3)
        return f"{prefix}{val + (2 if val < 16 else 4 if val < 24 else 6)}{suffix}"
    content = re.sub(r'(borderRadius:\s*)(8|10|12|14|16|20|22|24)(,)', inc_radius, content)

    # 5. gap
    def inc_gap(match):
        prefix = match.group(1)
        val = int(match.group(2))
        suffix = match.group(3)
        return f"{prefix}{val + (2 if val < 12 else 4 if val < 20 else 6)}{suffix}"
    content = re.sub(r'(gap:\s*)(8|10|12|14|16|18|20)(,)', inc_gap, content)

    return content

def fix_line_numbers(filepath: str):
    """修复 heredoc 写入导致的行号前缀损坏"""
    with open(filepath, 'r') as f:
        content = f.read()
    if re.match(r'^1\|', content):
        lines = content.split('\n')
        fixed = [re.sub(r'^\d+\|', '', line) for line in lines]
        with open(filepath, 'w') as f:
            f.write('\n'.join(fixed))
        print(f"  Fixed line numbers: {os.path.basename(filepath)}")

def main():
    comp_dir = sys.argv[1] if len(sys.argv) > 1 else "/tmp/remotion-demo/src/components"
    count = 0
    for fname in sorted(os.listdir(comp_dir)):
        if not fname.endswith('.tsx'):
            continue
        fpath = os.path.join(comp_dir, fname)
        # 先修复可能的行号损坏
        fix_line_numbers(fpath)
        with open(fpath, 'r') as f:
            original = f.read()
        scaled = scale_content(original)
        if scaled != original:
            with open(fpath, 'w') as f:
                f.write(scaled)
            print(f"  Scaled: {fname}")
            count += 1
    print(f"\nScaled {count} components in {comp_dir}")

if __name__ == "__main__":
    main()
