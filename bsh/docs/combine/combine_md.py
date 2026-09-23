#!/usr/bin/env python3
"""
combine_md.py - combine all Markdown (*.md) files in a folder into one demarcated file.

Usage:
    python combine_md.py             -> combines *.md in the folder THIS script lives in
    python combine_md.py <folder>    -> combines *.md in <folder>

Output:
    <folder>\\_COMBINED.md  (regenerated each run; never included as an input)


Notes:
    - Non-recursive: only *.md files directly in the target folder (any case: .md / .MD).
    - Files are sorted alphabetically for stable, predictable ordering.
    - Each source file is demarcated with --- rules and <!-- FILE: ... --> comment blocks.
    - Reads as UTF-8 (BOM tolerated, bad bytes replaced) so a stray encoding never aborts a run.
"""

import sys
from datetime import datetime
from pathlib import Path

OUTPUT_NAME = "_COMBINED.md"
BAR = "=" * 70


def main() -> int:
    if len(sys.argv) > 1:
        root = Path(sys.argv[1]).resolve()
    else:
        root = Path(__file__).resolve().parent

    if not root.is_dir():
        print(f"[!] Not a folder: {root}")
        return 1

    md_files = sorted(
        f for f in root.iterdir()
        if f.is_file() and f.suffix.lower() == ".md" and f.name != OUTPUT_NAME
    )

    if not md_files:
        print(f"[!] No .md files found in: {root}")
        return 1

    parts = [
        f"# COMBINED MARKDOWN - {root.name}",
        "",
        f"_Generated {datetime.now():%Y-%m-%d %H:%M:%S} | {len(md_files)} files | folder: {root}_",
        "",
        "## Contents",
        "",
    ]
    parts.extend(f"{i}. {f.name}" for i, f in enumerate(md_files, 1))

    total_chars = 0
    for f in md_files:
        text = f.read_text(encoding="utf-8-sig", errors="replace")
        total_chars += len(text)
        print(f"[*] + {f.name}  ({len(text):,} chars)")
        parts += [
            "",
            "---",
            "",
            f"<!-- {BAR} -->",
            f"<!-- FILE: {f.name} -->",
            f"<!-- {BAR} -->",
            "",
            text.rstrip(),
            "",
        ]

    out_path = root / OUTPUT_NAME
    with open(out_path, "w", encoding="utf-8", newline="\n") as fh:
        fh.write("\n".join(parts) + "\n")

    print()
    print(f"[+] Wrote: {out_path}")
    print(f"[+] {len(md_files)} file(s), {total_chars:,} chars of source content")
    return 0


if __name__ == "__main__":
    sys.exit(main())
