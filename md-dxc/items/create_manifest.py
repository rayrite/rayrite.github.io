#!/usr/bin/env python3
"""
create_manifest.py

Create manifest.json from Markdown files in the current folder.

Default schema:
{
  "files": [
    {
      "filename": "folder__subfolder__file.md",
      "originalPath": "folder/subfolder/file.md"
    }
  ]
}

Use --match-attached to reproduce the attached sample's trailing-space quirks:
{
  "files ": [
    {
      "filename ": "folder__subfolder__file.md ",
      "originalPath ": "folder/subfolder/file.md "
    }
  ]
}
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Find Markdown files and create manifest.json."
    )

    parser.add_argument(
        "--root",
        default=".",
        help="Folder to scan. Default: current folder.",
    )

    parser.add_argument(
        "--output",
        default="manifest.json",
        help="Output manifest filename. Default: manifest.json.",
    )

    parser.add_argument(
        "--extensions",
        nargs="+",
        default=[".md"],
        help="Markdown extensions to include. Default: .md",
    )

    parser.add_argument(
        "--no-recursive",
        action="store_true",
        help="Only scan the root folder, not subfolders.",
    )

    parser.add_argument(
        "--separator-replacement",
        default="__",
        help="String used to replace path separators in filename. Default: __",
    )

    parser.add_argument(
        "--strip-chars",
        default="[]",
        help="Characters to remove from filename. Default: []",
    )

    parser.add_argument(
        "--match-attached",
        action="store_true",
        help=(
            "Match the attached sample's quirks: trailing spaces in keys/values "
            "and UTF-8 BOM."
        ),
    )

    parser.add_argument(
        "--indent",
        type=int,
        default=2,
        help="JSON indentation. Default: 2.",
    )

    return parser.parse_args()


def normalize_extensions(extensions: list[str]) -> set[str]:
    normalized = set()

    for ext in extensions:
        ext = ext.strip().lower()
        if not ext:
            continue

        if not ext.startswith("."):
            ext = "." + ext

        normalized.add(ext)

    return normalized


def iter_markdown_files(
    root: Path,
    recursive: bool,
    extensions: set[str],
):
    if recursive:
        candidates = root.rglob("*")
    else:
        candidates = root.iterdir()

    for path in candidates:
        try:
            if path.is_file() and path.suffix.lower() in extensions:
                yield path
        except OSError:
            # Ignore unreadable files/directories.
            continue


def make_filename(
    original_path: str,
    separator_replacement: str,
    strip_chars: str,
) -> str:
    """
    Convert a relative path into the manifest filename value.

    Example:
        input/36/file[abc].md
        becomes:
        input__36__fileabc.md
    """
    filename = original_path

    for char in strip_chars:
        filename = filename.replace(char, "")

    filename = filename.replace("/", separator_replacement)

    return filename


def build_entries(
    root: Path,
    output_path: Path,
    recursive: bool,
    extensions: set[str],
    separator_replacement: str,
    strip_chars: str,
    match_attached: bool,
) -> list[dict[str, str]]:
    entries = []

    files = sorted(
        iter_markdown_files(root, recursive, extensions),
        key=lambda p: p.relative_to(root).as_posix().lower(),
    )

    for path in files:
        try:
            resolved_path = path.resolve()
        except OSError:
            continue

        # Do not include the output file if it happens to be a markdown file.
        if resolved_path == output_path:
            continue

        original_path = path.relative_to(root).as_posix()
        filename = make_filename(
            original_path,
            separator_replacement,
            strip_chars,
        )

        if match_attached:
            entries.append(
                {
                    "filename ": filename.rstrip() + " ",
                    "originalPath ": original_path.rstrip() + " ",
                }
            )
        else:
            entries.append(
                {
                    "filename": filename,
                    "originalPath": original_path,
                }
            )

    return entries


def main() -> int:
    args = parse_args()

    root = Path(args.root).expanduser().resolve()
    output_path = Path(args.output).expanduser().resolve()

    if not root.is_dir():
        print(f"Error: root folder not found: {root}", file=sys.stderr)
        return 1

    extensions = normalize_extensions(args.extensions)
    recursive = not args.no_recursive

    entries = build_entries(
        root=root,
        output_path=output_path,
        recursive=recursive,
        extensions=extensions,
        separator_replacement=args.separator_replacement,
        strip_chars=args.strip_chars,
        match_attached=args.match_attached,
    )

    if args.match_attached:
        manifest = {"files ": entries}
        encoding = "utf-8-sig"
    else:
        manifest = {"files": entries}
        encoding = "utf-8"

    output_path.parent.mkdir(parents=True, exist_ok=True)

    with output_path.open("w", encoding=encoding, newline="\n") as f:
        json.dump(manifest, f, indent=args.indent, ensure_ascii=False)
        f.write("\n")

    print(f"Wrote {output_path} with {len(entries)} file(s).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())