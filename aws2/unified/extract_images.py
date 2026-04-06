"""
Extract images and captions from the 3 HTML exam guides and consolidate
into aws_images_unified.json + images/ directory.

Sources:
  ../1/index.html   — AIF-C01 (figure-card, external JPEG files)
  ../1b/index.html  — AIF-C01 variant (image-card, base64 embedded)
  ../2/index.html   — SAA-C03 (image-card, external PNG/JPG files)
"""

import base64, json, os, re, shutil
from html.parser import HTMLParser

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
IMAGES_DIR = os.path.join(SCRIPT_DIR, "images")
OUTPUT     = os.path.join(SCRIPT_DIR, "aws_images_unified.json")

os.makedirs(IMAGES_DIR, exist_ok=True)

# ──────────────────────────────────────────────────────
# Minimal HTML parser (no external deps like BeautifulSoup)
# ──────────────────────────────────────────────────────

class SimpleDOM:
    """Very minimal DOM-like parser using html.parser."""

    class Node:
        __slots__ = ('tag', 'attrs', 'children', 'text', 'parent')
        def __init__(self, tag, attrs, parent=None):
            self.tag = tag
            self.attrs = dict(attrs) if attrs else {}
            self.children = []
            self.text = ""
            self.parent = parent

        def find_all(self, tag=None, class_name=None):
            results = []
            self._collect(self, tag, class_name, results)
            return results

        def find(self, tag=None, class_name=None):
            hits = self.find_all(tag, class_name)
            return hits[0] if hits else None

        def _collect(self, node, tag, class_name, results):
            for child in node.children:
                if isinstance(child, SimpleDOM.Node):
                    match = True
                    if tag and child.tag != tag:
                        match = False
                    if class_name and class_name not in child.attrs.get('class', '').split():
                        match = False
                    if match:
                        results.append(child)
                    child._collect(child, tag, class_name, results)

        def get_text(self):
            parts = []
            self._text(self, parts)
            return ''.join(parts).strip()

        def _text(self, node, parts):
            for child in node.children:
                if isinstance(child, str):
                    parts.append(child)
                elif isinstance(child, SimpleDOM.Node):
                    child._text(child, parts)

        def ancestor(self, tag=None, class_name=None):
            p = self.parent
            while p:
                ok = True
                if tag and p.tag != tag:
                    ok = False
                if class_name and class_name not in p.attrs.get('class', '').split():
                    ok = False
                if ok:
                    return p
                p = p.parent
            return None

    class _Parser(HTMLParser):
        VOID = {'area','base','br','col','embed','hr','img','input','link','meta','source','track','wbr'}

        def __init__(self):
            super().__init__()
            self.root = SimpleDOM.Node('root', {})
            self.stack = [self.root]

        def handle_starttag(self, tag, attrs):
            node = SimpleDOM.Node(tag, attrs, self.stack[-1])
            self.stack[-1].children.append(node)
            if tag.lower() not in self.VOID:
                self.stack.append(node)

        def handle_endtag(self, tag):
            # Pop up to the matching open tag
            for i in range(len(self.stack) - 1, 0, -1):
                if self.stack[i].tag == tag:
                    self.stack = self.stack[:i]
                    break

        def handle_data(self, data):
            self.stack[-1].children.append(data)
            self.stack[-1].text += data

    @staticmethod
    def parse(html_text):
        parser = SimpleDOM._Parser()
        parser.feed(html_text)
        return parser.root


# ──────────────────────────────────────────────────────
# Helpers
# ──────────────────────────────────────────────────────

def slugify(text, maxlen=50):
    s = re.sub(r'[^a-z0-9]+', '_', text.lower()).strip('_')
    return s[:maxlen]

def extract_page_number(text):
    """Extract numeric page from strings like 'Page 43'."""
    m = re.search(r'(?:page\s*)(\d+)', text, re.I)
    return int(m.group(1)) if m else None

def extract_figure_number(title):
    """Extract figure number like '1.1' from 'Figure 1.1: ...'."""
    m = re.search(r'Figure\s+(\d+\.\d+)', title, re.I)
    return m.group(1) if m else None

def get_chapter_context(card_node):
    """Walk up to find the chapter-card section and return (number, title)."""
    section = card_node.ancestor(tag='section', class_name='chapter-card')
    if not section:
        # folder 1 uses <section class="chapter-card">
        section = card_node.ancestor(tag='section')
    if section:
        # Try to find chapter-number and chapter-title
        ch_num_el = section.find(tag='span', class_name='chapter-number')
        ch_title_el = section.find(tag='h2', class_name='chapter-title')
        ch_num = None
        ch_title = None
        if ch_num_el:
            m = re.search(r'(\d+)', ch_num_el.get_text())
            ch_num = int(m.group(1)) if m else None
        if ch_title_el:
            ch_title = ch_title_el.get_text().strip()
        return ch_num, ch_title
    return None, None


# ──────────────────────────────────────────────────────
# Source 1: folder 1 — AIF-C01 (figure-card, external files)
# ──────────────────────────────────────────────────────

def extract_folder1(base_dir):
    html_path = os.path.join(base_dir, "1", "index.html")
    print(f"Parsing {html_path} ...")
    with open(html_path, "r", encoding="utf-8") as f:
        root = SimpleDOM.parse(f.read())

    entries = []
    cards = root.find_all(tag='div', class_name='figure-card')
    print(f"  Found {len(cards)} figure-cards")

    for card in cards:
        img = card.find(tag='img')
        title_el = card.find(tag='div', class_name='figure-title')
        caption_el = card.find(tag='div', class_name='figure-caption')
        meta_el = card.find(tag='div', class_name='figure-meta')

        src = img.attrs.get('src', '') if img else ''
        alt = img.attrs.get('alt', '') if img else ''
        title = title_el.get_text() if title_el else ''
        caption = caption_el.get_text() if caption_el else ''

        page = None
        if meta_el:
            page = extract_page_number(meta_el.get_text())

        fig_num = extract_figure_number(title)
        ch_num, ch_title = get_chapter_context(card)

        # Copy image
        src_path = os.path.join(base_dir, "1", src)
        filename = os.path.basename(src)
        dest_name = f"aif_{filename}"
        dest_path = os.path.join(IMAGES_DIR, dest_name)
        if os.path.isfile(src_path):
            shutil.copy2(src_path, dest_path)

        entry_id = f"aif-1-{slugify(title)}" if title else f"aif-1-img{len(entries)}"
        entries.append({
            "id": entry_id,
            "title": title,
            "caption": caption,
            "examFocusTip": None,  # will be filled from folder 1b matching
            "alt": alt,
            "exam": "AIF-C01",
            "chapter": ch_title,
            "chapterNumber": ch_num,
            "page": page,
            "figureNumber": fig_num,
            "imagePath": f"images/{dest_name}",
            "source": "1",
            "sourceFile": "1/index.html"
        })

    print(f"  Extracted {len(entries)} entries from folder 1")
    return entries


# ──────────────────────────────────────────────────────
# Source 2: folder 1b — AIF-C01 variant (image-card, base64)
# ──────────────────────────────────────────────────────

def extract_folder1b(base_dir):
    html_path = os.path.join(base_dir, "1b", "index.html")
    print(f"Parsing {html_path} ...")
    with open(html_path, "r", encoding="utf-8") as f:
        root = SimpleDOM.parse(f.read())

    entries = []
    cards = root.find_all(tag='div', class_name='image-card')
    print(f"  Found {len(cards)} image-cards")

    for idx, card in enumerate(cards):
        img = card.find(tag='img')
        title_el = card.find(tag='div', class_name='image-title')
        caption_el = card.find(tag='div', class_name='image-caption')

        src = img.attrs.get('src', '') if img else ''
        alt = img.attrs.get('alt', '') if img else ''
        title = title_el.get_text() if title_el else ''
        caption = caption_el.get_text() if caption_el else ''

        ch_num, ch_title = get_chapter_context(card)

        # Extract base64 image and save
        dest_name = None
        if src.startswith('data:image/'):
            # data:image/png;base64,iVBOR...
            m = re.match(r'data:image/(\w+);base64,(.+)', src, re.S)
            if m:
                ext = m.group(1).lower()
                if ext == 'jpeg': ext = 'jpg'
                b64data = m.group(2)
                slug = slugify(title) if title else f"img{idx}"
                dest_name = f"aif_1b_{slug}.{ext}"
                dest_path = os.path.join(IMAGES_DIR, dest_name)
                with open(dest_path, 'wb') as out:
                    out.write(base64.b64decode(b64data))

        if not dest_name:
            # Not base64 — possibly a file reference
            if src and not src.startswith('data:'):
                filename = os.path.basename(src)
                dest_name = f"aif_1b_{filename}"
                src_path = os.path.join(base_dir, "1b", src)
                if os.path.isfile(src_path):
                    shutil.copy2(src_path, os.path.join(IMAGES_DIR, dest_name))

        if not dest_name:
            dest_name = f"aif_1b_unknown_{idx}.png"

        entry_id = f"aif-1b-{slugify(title)}" if title else f"aif-1b-img{idx}"
        entries.append({
            "id": entry_id,
            "title": title,
            "caption": caption,
            "examFocusTip": None,
            "alt": alt,
            "exam": "AIF-C01",
            "chapter": ch_title,
            "chapterNumber": ch_num,
            "page": None,
            "figureNumber": None,
            "imagePath": f"images/{dest_name}",
            "source": "1b",
            "sourceFile": "1b/index.html"
        })

    print(f"  Extracted {len(entries)} entries from folder 1b")
    return entries


# ──────────────────────────────────────────────────────
# Source 3: folder 2 — SAA-C03 (image-card, external files)
# ──────────────────────────────────────────────────────

def extract_folder2(base_dir):
    html_path = os.path.join(base_dir, "2", "index.html")
    print(f"Parsing {html_path} ...")
    with open(html_path, "r", encoding="utf-8") as f:
        root = SimpleDOM.parse(f.read())

    entries = []
    cards = root.find_all(tag='div', class_name='image-card')
    print(f"  Found {len(cards)} image-cards")

    for card in cards:
        img = card.find(tag='img')
        title_el = card.find(tag='div', class_name='image-title')
        caption_el = card.find(tag='div', class_name='image-caption')
        meta_el = card.find(tag='div', class_name='image-meta')

        src = img.attrs.get('src', '') if img else ''
        alt = img.attrs.get('alt', '') if img else ''
        title = title_el.get_text() if title_el else ''
        caption = caption_el.get_text() if caption_el else ''

        page = None
        if meta_el:
            page = extract_page_number(meta_el.get_text())
        # Also try to extract page from src filename (pageNN_img1.png)
        if page is None and src:
            pm = re.search(r'page(\d+)_', src)
            if pm:
                page = int(pm.group(1))

        fig_num = extract_figure_number(title)
        ch_num, ch_title = get_chapter_context(card)

        # Copy image
        src_path = os.path.join(base_dir, "2", src)
        filename = os.path.basename(src)
        dest_name = f"saa_{filename}"
        dest_path = os.path.join(IMAGES_DIR, dest_name)
        if os.path.isfile(src_path):
            shutil.copy2(src_path, dest_path)

        entry_id = f"saa-2-{slugify(title)}" if title else f"saa-2-img{len(entries)}"
        entries.append({
            "id": entry_id,
            "title": title,
            "caption": caption,
            "examFocusTip": None,
            "alt": alt,
            "exam": "SAA-C03",
            "chapter": ch_title,
            "chapterNumber": ch_num,
            "page": page,
            "figureNumber": fig_num,
            "imagePath": f"images/{dest_name}",
            "source": "2",
            "sourceFile": "2/index.html"
        })

    print(f"  Extracted {len(entries)} entries from folder 2")
    return entries


# ──────────────────────────────────────────────────────
# Deduplication / merging between folder 1 and 1b
# ──────────────────────────────────────────────────────

def normalize_for_match(text):
    """Lowercase, remove punctuation, collapse spaces."""
    return re.sub(r'\s+', ' ', re.sub(r'[^a-z0-9 ]', '', text.lower())).strip()

def merge_1_and_1b(entries1, entries1b):
    """
    Best-effort matching: for each folder 1b entry, try to find a matching
    folder 1 entry in the same chapter by normalized title keyword overlap.
    If matched, merge the 1b caption into the folder 1 entry's examFocusTip.
    Unmatched 1b entries are kept as separate entries.
    """
    matched_1b = set()

    for e1b_idx, e1b in enumerate(entries1b):
        norm_1b = normalize_for_match(e1b['title'])
        words_1b = set(norm_1b.split()) - {'the', 'a', 'an', 'and', 'or', 'of', 'in', 'for', 'with', 'to', 'on', 'by'}

        best_match = None
        best_score = 0

        for e1 in entries1:
            # Must be same exam
            if e1['exam'] != e1b['exam']:
                continue

            norm_1 = normalize_for_match(e1['title'])
            words_1 = set(norm_1.split()) - {'the', 'a', 'an', 'and', 'or', 'of', 'in', 'for', 'with', 'to', 'on', 'by'}

            if not words_1 or not words_1b:
                continue

            overlap = words_1 & words_1b
            score = len(overlap) / max(len(words_1), len(words_1b))

            if score > best_score and score >= 0.4:
                best_score = score
                best_match = e1

        if best_match:
            # Merge: add 1b's caption as examFocusTip
            best_match['examFocusTip'] = e1b['caption']
            matched_1b.add(e1b_idx)
            print(f"  Matched: [{e1b['title']}] → [{best_match['title']}] (score={best_score:.2f})")

    # Collect unmatched 1b entries
    unmatched = [e for i, e in enumerate(entries1b) if i not in matched_1b]
    print(f"  Merged: {len(matched_1b)} matched, {len(unmatched)} unmatched from folder 1b")
    return unmatched


# ──────────────────────────────────────────────────────
# Main
# ──────────────────────────────────────────────────────

def main():
    base_dir = os.path.join(SCRIPT_DIR, "..")

    print("=" * 60)
    print("Phase 1: Extracting images from HTML sources")
    print("=" * 60)

    entries1  = extract_folder1(base_dir)
    entries1b = extract_folder1b(base_dir)
    entries2  = extract_folder2(base_dir)

    print()
    print("=" * 60)
    print("Phase 2: Merging folder 1 and folder 1b")
    print("=" * 60)

    unmatched_1b = merge_1_and_1b(entries1, entries1b)

    # Combine all entries: folder 1 (with merged examFocusTips) + unmatched 1b + folder 2
    all_entries = entries1 + unmatched_1b + entries2

    # Sort by exam, then chapterNumber, then page, then title
    def sort_key(e):
        exam_order = 0 if e['exam'] == 'AIF-C01' else 1
        ch = e['chapterNumber'] or 999
        pg = e['page'] or 999
        return (exam_order, ch, pg, e['title'])

    all_entries.sort(key=sort_key)

    # Write output
    with open(OUTPUT, 'w', encoding='utf-8') as f:
        json.dump(all_entries, f, indent=2, ensure_ascii=False)

    print()
    print("=" * 60)
    print(f"Done! Wrote {len(all_entries)} entries to {OUTPUT}")
    print(f"Images directory: {IMAGES_DIR}")
    print(f"  - From folder 1:  {len(entries1)} entries")
    print(f"  - From folder 1b: {len(unmatched_1b)} unmatched entries (rest merged)")
    print(f"  - From folder 2:  {len(entries2)} entries")
    print("=" * 60)

    # Verify images exist
    missing = [e for e in all_entries if not os.path.isfile(os.path.join(SCRIPT_DIR, e['imagePath']))]
    if missing:
        print(f"\nWARNING: {len(missing)} entries have missing image files:")
        for e in missing[:10]:
            print(f"  {e['imagePath']} ({e['title']})")
    else:
        print(f"\nAll {len(all_entries)} image files verified OK.")


if __name__ == "__main__":
    main()
