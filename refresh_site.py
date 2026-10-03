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


def build_stub(items):
    # Temporary stub — the real reader-stub generator arrives in Task 3.
    return ""


# --- classification, summaries, emit (Task 2) ---

def classify(section, config):
    sec_cfg = config.get("sections", {}).get(section["id"], {})
    if sec_cfg.get("family"):
        return sec_cfg["family"]
    if section["id"] in config.get("readerFolders", {}):
        return "library"
    hay = (section["title"] + " " + section["path"] + " " +
           " ".join(e["title"] for e in section["entries"])).lower()
    for fam, pattern in FAMILY_RULES:
        if re.search(pattern, hay):
            return fam
    return "data"


TAG_RE = re.compile(r"<(script|style)[^>]*>.*?</\1>", re.IGNORECASE | re.DOTALL)
ANY_TAG_RE = re.compile(r"<[^>]+>")


def strip_tags(text):
    text = TAG_RE.sub(" ", text)
    text = ANY_TAG_RE.sub(" ", text)
    return re.sub(r"\s+", " ", htmllib.unescape(text)).strip()


def heuristic_summary(root, section):
    """Title + first meaningful text (from primary HTML, or first .md)."""
    source = root / section["primary"]
    text = read_text_capped(source)
    if section["id"] in DEFAULT_CONFIG["readerFolders"] or not text:
        md_dir = root / DEFAULT_CONFIG["readerFolders"].get(section["id"], section["path"])
        mds = sorted(md_dir.glob("*.md")) if md_dir.is_dir() else []
        if mds:
            text = read_text_capped(mds[0])
    body = strip_tags(text)
    summary = f"{section['title']}. {body}" if body else section["title"]
    return summary[:297] + "…" if len(summary) > 300 else summary


def merge_summaries(sections, summaries, root, report):
    sec_summaries = summaries.get("sections", {})
    for s in sections:
        entry = sec_summaries.get(s["id"])
        if entry and entry.get("text"):
            s["summary"] = entry["text"]
            s["summarySource"] = "agent"
            based = entry.get("basedOn", "")
            if not based or (s["lastModified"] and s["lastModified"] > based):
                report["staleSummary"].append(s["id"])
        else:
            s["summary"] = heuristic_summary(root, s)
            s["summarySource"] = "heuristic"
            report["needsSummary"].append(s["id"])
    return sections


def write_if_changed(path, text):
    data = text.encode("utf-8")
    try:
        if path.read_bytes() == data:
            return False
    except OSError:
        pass
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(data)
    return True


def build_site_json(root, config):
    sections = scan_tree(root, config)
    summaries = load_json(root / "site-data" / "summaries.json", {})
    report = {"needsSummary": [], "staleSummary": [], "changed": [], "warnings": []}
    for s in sections:
        s["family"] = classify(s, config)
    merge_summaries(sections, summaries, root, report)
    stats = {
        "sections": len(sections),
        "pages": sum(1 for s in sections for e in s["entries"] if e["path"].endswith(".html")),
        "documents": sum(s["docCount"] for s in sections),
        "images": sum(s["imageCount"] for s in sections),
        "bytes": sum(s["bytes"] for s in sections),
    }
    site = {"version": 1, "generatedAt": utcnow_iso(), "stats": stats, "sections": sections}
    return site, report


def main(argv=None):
    ap = argparse.ArgumentParser(description="Refresh front-door site data")
    ap.add_argument("--dry-run", action="store_true", help="report without writing")
    ap.add_argument("--verbose", action="store_true")
    ap.add_argument("--root", default=str(Path(__file__).resolve().parent))
    args = ap.parse_args(argv)
    root = Path(args.root).resolve()
    config = load_json(root / "site-data" / "config.json", DEFAULT_CONFIG)
    site, report = build_site_json(root, config)

    targets = [(root / "site-data" / "site.json",
                json.dumps(site, indent=2, ensure_ascii=False) + "\n")]
    for viewer, items in config.get("readerFolders", {}).items():
        targets.append((root / viewer / "index.html", build_stub(items)))
    report_text = json.dumps({
        "generatedAt": site["generatedAt"],
        "needsSummary": report["needsSummary"],
        "staleSummary": report["staleSummary"],
        "changed": [str(t.relative_to(root)).replace("\\", "/") for t, _ in targets],
        "warnings": report["warnings"],
    }, indent=2) + "\n"
    targets.append((root / "site-data" / "refresh-report.json", report_text))

    verb = "would write" if args.dry_run else "wrote"
    for path, text in targets:
        if args.dry_run:
            existing = read_text_capped(path)
            if existing != text:
                print(f"  dry-run: {verb} {path.relative_to(root).as_posix()}")
        else:
            if write_if_changed(path, text):
                print(f"  {verb}: {path.relative_to(root).as_posix()}")
    print(f"\nSections: {site['stats']['sections']}  "
          f"needs summary: {len(report['needsSummary'])}  "
          f"stale: {len(report['staleSummary'])}")
    if args.verbose:
        for sid in report["needsSummary"]:
            print(f"  NEEDS_SUMMARY: {sid}")
        for sid in report["staleSummary"]:
            print(f"  STALE_SUMMARY: {sid}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
