#!/usr/bin/env python3
"""
refresh_site.py — scan the site tree and refresh the front-door data files.

Walks the document root (this script's parent folder by default), respects
the skip-list in site-data/config.json, discovers content sections and their
entry pages, classifies families, merges agent summaries from
site-data/summaries.json (heuristic fallback for missing ones), and writes:

  site-data/site.json            portal catalog (consumed by index.html)
  site-data/refresh-report.json  machine-readable report for the agent
  <readerFolders>/index.html     redirect stubs into /reader/?src=...

Writes are byte-compared first (idempotent). Never deletes. Stdlib only.
"""
import argparse
import datetime
import fnmatch
import html as htmllib
import json
import re
import sys
from pathlib import Path

IMAGE_EXTS = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".ico"}
MAX_READ = 2 * 1024 * 1024

DEFAULT_CONFIG = {
    "skip": [".git", "docs", "site-data", "reader", "files", "fonts", "img"],
    "skipFiles": ["index_0*.html", "index_basic.html", "index_test.html",
                  "index_old.html", "updated-index-html.html",
                  "index-gallery-legacy.html", "*.zip", "dukr.png", "image*.jpg",
                  "LAUNCH_WEB_SERVER.bat", "create_manifest.*", "combine_md.*",
                  "refresh_site.py", "REFRESH_SITE.bat"],
    "sections": {"aws2": {"title": "AWS Study Kit"}},
    "readerFolders": {
        "md": "md/items", "md-dxc": "md-dxc/items", "scam": "scam/items",
        "dukr/opensource/1": "dukr/opensource/1/items", "mdh": "mdh/items",
        "bsh/docs": "bsh/docs/index", "cvx/advertising/2": "cvx/advertising/2/items",
        "cvx/companal": "cvx/companal/items", "cvx/kaggle": "cvx/kaggle/items",
        "cvx/plan": "cvx/plan/items",
    },
}

FAMILY_RULES = [
    ("study", r"exam|aws|study|quiz|gloss|certif|practice|simulator"),
    ("research", r"whitepaper|research|kaggle|corpus|plan|taxonomy|council|roadmap"),
    ("data", r"viewer|browser|archive|watchlist|review|showcase|dashboard|catalog|explorer|tracker"),
    ("creative", r"demo|splash|anim|timeline|game|three|pixi|webgl|carousel|cloud|ocean|abyss|constellation"),
]


def utcnow_iso():
    return datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")


def load_json(path, default):
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except (OSError, json.JSONDecodeError):
        return default


def is_skipped_dir(name, config):
    return name in config.get("skip", [])


def is_skipped_file(name, config):
    return any(fnmatch.fnmatch(name, pat) for pat in config.get("skipFiles", []))


def read_text_capped(path):
    try:
        if path.stat().st_size > MAX_READ:
            return ""
        return path.read_text(encoding="utf-8", errors="replace")
    except OSError:
        return ""


def html_title(text):
    m = re.search(r"<title[^>]*>(.*?)</title>", text, re.IGNORECASE | re.DOTALL)
    if not m:
        return ""
    t = htmllib.unescape(m.group(1))
    return re.sub(r"\s+", " ", t).strip()


def prettify_name(name):
    return name.replace("_", " ").replace("-", " ").strip().title() or name


def file_title(path):
    text = read_text_capped(path)
    return html_title(text)


def iter_tree_files(section_dir):
    for p in section_dir.rglob("*"):
        if p.is_file():
            yield p


def discover_entries(section_dir, root):
    """Entry pages: section-root *.html + index.html in child dirs (<=2 levels)."""
    entries = []
    for p in sorted(section_dir.glob("*.html")):
        entries.append({"path": p.relative_to(root).as_posix(), "title": file_title(p) or p.stem})
    for p in sorted(section_dir.glob("*/*/index.html")):
        entries.append({"path": p.relative_to(root).as_posix(), "title": file_title(p) or p.parent.name})
    for p in sorted(section_dir.glob("*/index.html")):
        entries.append({"path": p.relative_to(root).as_posix(), "title": file_title(p) or p.parent.name})
    # order: index pages shallow-first, then other html; dedupe
    seen, ordered = set(), []
    index_entries = [e for e in entries if Path(e["path"]).name == "index.html"]
    other = [e for e in entries if Path(e["path"]).name != "index.html"]
    for e in sorted(index_entries, key=lambda e: e["path"].count("/")) + sorted(other, key=lambda e: e["path"]):
        if e["path"] not in seen:
            seen.add(e["path"])
            ordered.append(e)
    return ordered


def section_stats(section_dir):
    files = docs = images = 0
    total_bytes = 0
    latest = 0.0
    for p in iter_tree_files(section_dir):
        files += 1
        try:
            st = p.stat()
            total_bytes += st.st_size
            latest = max(latest, st.st_mtime)
        except OSError:
            pass
        ext = p.suffix.lower()
        if ext == ".md":
            docs += 1
        elif ext in IMAGE_EXTS:
            images += 1
    last_modified = (
        datetime.datetime.fromtimestamp(latest, datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
        if latest else ""
    )
    return {"fileCount": files, "docCount": docs, "imageCount": images,
            "bytes": total_bytes, "lastModified": last_modified}


def scan_tree(root, config):
    sections = []
    for d in sorted(p for p in root.iterdir() if p.is_dir()):
        if is_skipped_dir(d.name, config):
            continue
        entries = discover_entries(d, root)
        if not entries:
            continue
        sec_id = d.name
        override = config.get("sections", {}).get(sec_id, {})
        for rel in override.get("extraEntries", []):
            p = root / rel
            if p.is_file():
                entries.append({"path": Path(rel).as_posix(), "title": file_title(p) or p.stem})
        section_index = d / "index.html"
        primary = (section_index.relative_to(root).as_posix()
                   if section_index.is_file() else entries[0]["path"])
        title = override.get("title") or file_title(root / primary) or prettify_name(sec_id)
        s = {"id": sec_id, "path": f"{sec_id}/", "title": title, "primary": primary,
             "entries": entries}
        s.update(section_stats(d))
        sections.append(s)
    return sections


if __name__ == "__main__":
    print("scanner core only — emitter added in Task 2")
