#!/usr/bin/env python3
"""校验 README 中的组件/主题数量是否与源码一致（声明对齐）。"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def count_components() -> int:
    # packages/ui/src/components/* 目录名；兼容其它布局
    candidates = [
        ROOT / "packages" / "ui" / "src" / "components",
        ROOT / "packages" / "ui" / "components",
        ROOT / "src" / "components",
    ]
    for c in candidates:
        if c.is_dir():
            return sum(1 for p in c.iterdir() if p.is_dir() and not p.name.startswith("."))
    return 0


def count_themes() -> int:
    candidates = [
        ROOT / "packages" / "ui" / "src" / "styles" / "themes",
        ROOT / "packages" / "ui" / "styles" / "themes",
        ROOT / "themes",
    ]
    for c in candidates:
        if c.is_dir():
            return sum(1 for p in c.iterdir() if p.suffix.lower() in {".css", ".scss"} or p.is_dir())
    return 0


def main() -> int:
    readme = ROOT / "README.md"
    text = readme.read_text(encoding="utf-8")
    comps = count_components()
    themes = count_themes()
    issues = []
    # badge 组件-N
    m = re.search(r"组件-([0-9]+)-", text)
    if m and comps:
        claimed = int(m.group(1))
        if abs(claimed - comps) > 2:
            issues.append(f"README badge 组件={claimed} vs 目录≈{comps}")
    m = re.search(r"主题-([0-9]+)-", text)
    if m and themes:
        claimed = int(m.group(1))
        if abs(claimed - themes) > 5:
            issues.append(f"README badge 主题={claimed} vs 目录≈{themes}")
    # 禁止旧的 56 组件文案与 73 同时出现时以目录为准提示
    if "56 组件" in text and comps >= 70:
        issues.append("README 仍含「56 组件」表述，请与实际组件数对齐")
    print(f"components≈{comps} themes≈{themes}")
    if issues:
        print("CLAIM ISSUES:")
        for i in issues:
            print(" -", i)
        return 1
    print("claims ok")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
