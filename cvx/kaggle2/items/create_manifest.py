#!/usr/bin/env python3
"""
Sanitize markdown filenames in the current folder to be Linux-friendly,
rename them in place, and emit a manifest.json recording the mapping.

Run this script from inside the folder containing the markdown files:

    python3 sanitize_filenames.py

Sanitization rules
------------------
- Spaces become underscores.
- Every character not in [A-Za-z0-9._-] is stripped.
- Original case is preserved (so `CLARIFYING_...` stays upper-case).
- If two markdown files would collapse to the same name, the later one
  gets a `_2`, `_3`, ... suffix.
- Non-markdown files already in the folder are reserved so a renamed
  markdown file can't clobber them.

The manifest matches this schema — both fields hold the (sanitized)
name that's actually on disk after the rename, so they always agree::

    {
      "files": [
        {"filename": "<sanitized name>", "originalPath": "<sanitized name>"},
        ...
      ]
    }
"""

import json
import re
import sys
from pathlib import Path


def sanitize_filename(name: str) -> str:
    """Return a Linux-friendly version of *name* (preserves case)."""
    name = name.replace(" ", "_")
    name = re.sub(r"[^A-Za-z0-9._-]", "", name)
    return name


def unique_name(candidate: str, used: set) -> str:
    """Disambiguate *candidate* against *used* by appending ``_2``, ``_3``..."""
    if candidate not in used:
        return candidate
    stem = Path(candidate).stem
    ext = Path(candidate).suffix
    i = 2
    while f"{stem}_{i}{ext}" in used:
        i += 1
    return f"{stem}_{i}{ext}"


def main() -> int:
    cwd = Path(".").resolve()

    # Reserve names of any non-markdown files so a sanitized markdown
    # name can't accidentally overwrite one of them.
    used = {
        p.name
        for p in cwd.iterdir()
        if p.is_file() and p.suffix.lower() != ".md"
    }

    md_files = sorted(
        (p for p in cwd.iterdir() if p.is_file() and p.suffix.lower() == ".md"),
        key=lambda p: p.name.lower(),
    )

    if not md_files:
        print("No markdown files found in the current folder.")
        return 0

    # Plan: keep the real on-disk source name locally, but record the
    # sanitized name in BOTH `filename` and `originalPath` so the
    # manifest always matches what's on disk after the rename.
    plan = []
    for md in md_files:
        original = md.name
        sanitized = unique_name(sanitize_filename(original), used)
        used.add(sanitized)
        plan.append((original, sanitized))

    manifest = {
        "files": [
            {"filename": sanitized, "originalPath": sanitized}
            for _original, sanitized in plan
        ]
    }

    # Write the manifest first so the plan is on disk even if a rename
    # step blows up halfway through.
    manifest_path = cwd / "manifest.json"
    with manifest_path.open("w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)
        f.write("\n")

    renamed = unchanged = 0
    for original, sanitized in plan:
        source = cwd / original
        target = cwd / sanitized
        if source == target:
            unchanged += 1
            print(f"  unchanged: {original}")
        else:
            source.rename(target)
            renamed += 1
            print(f"  renamed:   {original} -> {sanitized}")

    print(
        f"\nProcessed {len(plan)} markdown file(s): "
        f"{renamed} renamed, {unchanged} unchanged."
    )
    print(f"Manifest written to: {manifest_path}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
