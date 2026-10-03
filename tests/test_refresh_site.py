# tests/test_refresh_site.py
import json, sys, tempfile, time, unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import refresh_site as rs


class _KeepAlivePath(Path):
    """Path subclass: pathlib.Path defines __slots__, so attributes such as
    the brief's `root._tmp` can only be attached on a subclass."""


def make_tree(spec):
    """spec: {relpath: content}. Creates under a tempdir; returns Path root."""
    tmp = tempfile.TemporaryDirectory()
    root = _KeepAlivePath(tmp.name)
    for rel, content in spec.items():
        p = root / rel
        p.parent.mkdir(parents=True, exist_ok=True)
        p.write_text(content, encoding="utf-8")
    root._tmp = tmp  # keep alive
    return root


class TestScan(unittest.TestCase):
    def setUp(self):
        self.root = make_tree({
            "aws2/index.html": "<html><head><title>AWS Study Kit</title></head><body>x</body></html>",
            "aws2/exam/index.html": "<title>AWS  Practice</title>",
            "dukr/opensource/1/index.html": "<title>FOSS Explorer</title>",
            "dukr/dukr01.html": "<title>DUKR</title>",
            "md/items/a.md": "# Doc A\n\nfirst para",
            "md/items/manifest.json": "{}",  # non-doc file: fileCount >= 3 with docCount == 1
            "md/index.html": "<title>Markdown Viewer</title>",
            ".git/config": "x",
            "docs/spec.md": "skip me",
            "image1.jpg": "x", "index_01.html": "<title>old</title>",
        })
        self.config = {
            "skip": [".git", "docs"],
            "skipFiles": ["image*.jpg", "index_01.html"],
            "sections": {}, "readerFolders": {"md": "md/items"},
        }

    def tearDown(self):
        self.root._tmp.cleanup()

    def test_skip_rules(self):
        self.assertTrue(rs.is_skipped_dir(".git", self.config))
        self.assertTrue(rs.is_skipped_dir("docs", self.config))
        self.assertFalse(rs.is_skipped_dir("aws2", self.config))
        self.assertTrue(rs.is_skipped_file("image1.jpg", self.config))
        self.assertTrue(rs.is_skipped_file("index_01.html", self.config))
        self.assertFalse(rs.is_skipped_file("REFRESH_SITE.bat", self.config))

    def test_sections_discovered(self):
        sections = rs.scan_tree(self.root, self.config)
        ids = {s["id"] for s in sections}
        self.assertEqual(ids, {"aws2", "dukr", "md"})  # .git/docs skipped, no others

    def test_entry_discovery_two_levels(self):
        sections = {s["id"]: s for s in rs.scan_tree(self.root, self.config)}
        dukr_paths = [e["path"] for e in sections["dukr"]["entries"]]
        self.assertIn("dukr/opensource/1/index.html", dukr_paths)  # 2 levels deep
        self.assertIn("dukr/dukr01.html", dukr_paths)              # section-root html

    def test_primary_prefers_section_index(self):
        sections = {s["id"]: s for s in rs.scan_tree(self.root, self.config)}
        self.assertEqual(sections["aws2"]["primary"], "aws2/index.html")
        self.assertTrue(sections["dukr"]["primary"].startswith("dukr/"))  # no index → first entry

    def test_title_from_title_tag(self):
        sections = {s["id"]: s for s in rs.scan_tree(self.root, self.config)}
        self.assertEqual(sections["aws2"]["title"], "AWS Study Kit")

    def test_stats_counted(self):
        sections = {s["id"]: s for s in rs.scan_tree(self.root, self.config)}
        md = sections["md"]
        self.assertEqual(md["docCount"], 1)
        self.assertGreaterEqual(md["fileCount"], 3)
        self.assertTrue(md["lastModified"].endswith("Z"))


if __name__ == "__main__":
    unittest.main()
