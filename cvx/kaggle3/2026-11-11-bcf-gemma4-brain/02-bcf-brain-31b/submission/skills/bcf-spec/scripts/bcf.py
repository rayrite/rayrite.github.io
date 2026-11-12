#!/usr/bin/env python3
"""BCF helper — deterministic classifier, localizer, fix-spec generator and edit guard.

Stdlib only. Offline. Writes ONLY under <repo>/.git/bcf/ (patch-invisible).
Subcommands: spec, anchors, apply, locate, strike, check, state.
All arguments are scalar positionals; the problem statement and apply replacements
arrive on stdin via a single-quoted heredoc. See --help.

Design contract: architecture.md v1.0 (sections 3.0-3.8, 7). Generic mechanism-based
localization is the foundation; known-repo priors only tune weights. No public task
ids, expected strings or snapshots are embedded.
"""

import ast
import difflib
import glob
import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import threading
import time
import unicodedata

BCF_VERSION = "1.0.0"
STDOUT_CAP = 4800          # run_command caps at 5000; design to the tighter known cap
SPEC_WORD_CAP = 300
SPEC_CHAR_CAP = 4800
ANCHOR_CHAR_CAP = 2000
APPLY_DIFF_CAP = 1500
CHECK_CHAR_CAP = 1500
STATE_CHAR_CAP = 1200
MAX_WINDOW = 7             # anchor window expansion limit (lines)
MAX_APPLY_LINES = 120      # anti-whole-file-overwrite
MAX_CUES = 12
SCAN_SOFT_DEADLINE = 8.0   # cold spec target
SCAN_HARD_DEADLINE = 20.0  # cold spec guard -> partial
MAX_FILE_BYTES = 400_000   # skip megafiles during scan
DELIM = '<|"|>'            # gemma4 string delimiter; never emit inside anchors

PROTECTED_NAMES = {
    "conftest.py", "pytest.ini", ".pytest.ini", "pyproject.toml", "tox.ini",
    "setup.cfg", "sitecustomize.py", "usercustomize.py", "_swegemma_stubs.py",
}
PROTECTED_DIRS = {"tests", "test", "testing"}
SKIP_DIRS = {
    ".git", "__pycache__", "node_modules", ".venv", "venv", "build", "dist",
    ".tox", ".mypy_cache", ".pytest_cache", "migrations",
}

# ---------------------------------------------------------------------------
# Output helpers
# ---------------------------------------------------------------------------

def sanitize(text):
    """Brace-sanitize prose/spec (defense against recursive ADK templating).

    Applied to the spec and to prose-only output. Code windows (anchors old_string,
    apply diffs) are verbatim DATA read back from tool results, never interpolated
    into an instruction, so they are preserved exactly (architecture 3.5 'exact').
    """
    return text.replace("{", "(").replace("}", ")")


def emit(text, cap=STDOUT_CAP):
    # Hard cap INCLUDING the final newline: marker is 15 chars, reserve 1 for "\n".
    text = text.rstrip()
    if len(text) > cap - 1:
        text = text[: cap - 16].rstrip() + "\n...[truncated]"
    sys.stdout.write(text + "\n")
    sys.stdout.flush()


def die(reason, hint="work manually: grep symptom terms, read the top file, edit a unique anchor, py_compile, submit_patch last"):
    emit("BCF-ERROR: " + sanitize(str(reason)) + "\nFallback: " + hint)
    sys.exit(1)


# ---------------------------------------------------------------------------
# Repo root discovery (cwd-agnostic) + git helpers
# ---------------------------------------------------------------------------

def _git(args, root, timeout=5):
    try:
        p = subprocess.run(
            ["git"] + args, cwd=str(root), capture_output=True, text=True,
            timeout=timeout,
        )
        if p.returncode == 0:
            return p.stdout.strip()
    except Exception:
        pass
    return None


def find_repo_root(override=None):
    if override:
        p = os.path.abspath(override)
        if os.path.isdir(p):
            return p
    # 1. git rev-parse from cwd
    try:
        p = subprocess.run(
            ["git", "rev-parse", "--show-toplevel"], capture_output=True,
            text=True, timeout=5,
        )
        if p.returncode == 0 and p.stdout.strip():
            return os.path.abspath(p.stdout.strip())
    except Exception:
        pass
    # 2. upward .git search from cwd
    cur = os.path.abspath(os.getcwd())
    while True:
        if os.path.isdir(os.path.join(cur, ".git")):
            return cur
        parent = os.path.dirname(cur)
        if parent == cur:
            break
        cur = parent
    # 3. /workspace if it contains .git
    ws = "/workspace"
    if os.path.isdir(os.path.join(ws, ".git")):
        return ws
    # 3b. subprocess-sandbox layout (workspace/ under a sandbox temp dir)
    probe = _sandbox_workspace_probe()
    if probe:
        return probe
    # 4. cwd
    return os.path.abspath(os.getcwd())


def git_head(root):
    h = _git(["rev-parse", "HEAD"], root)
    return h or "no-git"


def bcf_dir(root):
    return os.path.join(root, ".git", "bcf")


def ensure_bcf_dir(root):
    d = bcf_dir(root)
    os.makedirs(d, exist_ok=True)
    return d


def atomic_write(path, text):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    tmp = path + ".tmp." + str(os.getpid())
    with open(tmp, "w", encoding="utf-8", newline="\n") as f:
        f.write(text)
    os.replace(tmp, path)


def read_text(path):
    with open(path, "r", encoding="utf-8", errors="replace") as f:
        return f.read()


def read_stdin_bounded(timeout=10.0):
    """Read stdin with a hard wall-clock bound. Returns None on timeout.

    run_command's stdin plumbing is undocumented: a heredoc delivers data
    immediately and a closed pipe EOFs immediately, but an open idle pipe would
    block sys.stdin.read() until the 150-180s command timeout, burning most of
    the per-task budget. The reader thread is a daemon so a stuck read never
    prevents process exit.
    """
    box = {}

    def _reader():
        try:
            box["data"] = sys.stdin.read()
        except Exception:
            box["data"] = ""

    t = threading.Thread(target=_reader, daemon=True)
    t.start()
    t.join(timeout)
    if t.is_alive():
        return None
    return box.get("data", "")


def _sandbox_workspace_probe():
    """Subprocess-sandbox root discovery (no /workspace exists there).

    The sandbox layout is <tmp>/swegemma_sandbox_<id>/workspace/.git. Skill
    scripts may run from a temp skill copy outside the repo. Try (a) a
    workspace/.git child of any cwd ancestor, then (b) a UNIQUE sandbox
    workspace under the system temp dir. Never guess between concurrent
    sandboxes: ambiguity returns None (caller degrades to manual fallback).
    """
    cur = os.path.abspath(os.getcwd())
    while True:
        cand = os.path.join(cur, "workspace")
        if os.path.isdir(os.path.join(cand, ".git")):
            return cand
        parent = os.path.dirname(cur)
        if parent == cur:
            break
        cur = parent
    try:
        pattern = os.path.join(tempfile.gettempdir(), "swegemma_sandbox_*", "workspace")
        hits = [w for w in glob.glob(pattern) if os.path.isdir(os.path.join(w, ".git"))]
        if len(hits) == 1:
            return hits[0]
    except Exception:
        pass
    return None


# ---------------------------------------------------------------------------
# Durable state
# ---------------------------------------------------------------------------

def load_state(root):
    p = os.path.join(bcf_dir(root), "state.json")
    if os.path.exists(p):
        try:
            return json.loads(read_text(p))
        except Exception:
            pass
    return {
        "phase": "init", "strikes": [], "last_check": None, "edits": [],
        "key": None, "version": BCF_VERSION, "tests_run": False,
    }


def save_state(root, st):
    st["version"] = BCF_VERSION
    st["timestamp"] = int(time.time())
    atomic_write(os.path.join(bcf_dir(root), "state.json"),
                 json.dumps(st, indent=1, sort_keys=True))


def load_json(root, name, default):
    p = os.path.join(bcf_dir(root), name)
    if os.path.exists(p):
        try:
            return json.loads(read_text(p))
        except Exception:
            pass
    return default


# ---------------------------------------------------------------------------
# Normalization + cache key
# ---------------------------------------------------------------------------

_URL_RE = re.compile(r"https?://\S+|www\.\S+")
_FENCE_RE = re.compile(r"```[^\n]*")


def strip_emoji(text):
    out = []
    for ch in text:
        if ch in ("️", "‍", "⃣"):
            continue
        cat = unicodedata.category(ch)
        if cat in ("So", "Sk", "Cs"):
            continue
        out.append(ch)
    return "".join(out)


def normalize(text):
    t = strip_emoji(text)
    t = _FENCE_RE.sub(" ", t)
    t = _URL_RE.sub(" ", t)
    t = t.lower()
    t = " ".join(t.split())
    return t


def cache_key(norm_text, head):
    raw = norm_text + "|" + head + "|" + BCF_VERSION
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()


# ---------------------------------------------------------------------------
# Classification (deterministic, confidence-scored)
# ---------------------------------------------------------------------------

KIND_PATTERNS = [
    ("bugfix", r"\b(fix|fixes|fixed|bug|crash|hang|regression|wrong|incorrect|broken|error|fails?|failure|traceback|exception)\b"),
    ("feature", r"\b(add|adds|added|support|introduce|allow|enable|new|implement|capability|handle|automate|enhance|improve)\b"),
    ("deprecation", r"\bdeprecat"),
    ("docs", r"\b(docs?|documentation|example|tutorial|docstring|readme)\b"),
    ("performance", r"\b(speed|slow|performance|import time|optimi[sz]e|faster|latency)\b"),
    ("security", r"\b(security|injection|csrf|xss|vulnerab)\b"),
    ("dependency-compat", r"\b(compat|compatibility|pydantic|starlette|urllib3|version)\b"),
    ("refactor", r"\b(refactor|rename|restructure|cleanup|clean up)\b"),
    ("dx", r"\b(error message|warning|release|changelog|developer|tooling|ci)\b"),
]

FAMILY_PATTERNS = [
    ("infinite-loop-recursion", r"\b(infinite loop|hang|recursion|recursive|never ends|loop forever|stack overflow|deadlock)\b"),
    ("boundary-edge-case", r"\b(none|null|empty|trailing|leading|escape|unicode|width|backslash|codepoint|off.by.one|regex|pattern|grapheme|emoji|whitespace|slash|edge case|zwj|zero.width|space)\b"),
    ("type-introspection", r"(annotated|union|isinstance|getattr|setattr|unwrap|partial|__wrapped__|descriptor|proxy|wrapper|wraps|callable|hasattr|inspect)"),
    ("state-lifecycle", r"\b(cache|alias|mutated|teardown|exit stack|lifecycle|scope|keep.alive|keep_alive|cleanup|reset|state|stream|connection|close|startup|shutdown|lifespan)\b"),
    ("schema-generation-logic", r"\b(schema|openapi|\$ref|json.schema|jsonschema|ref|definition|remap)\b"),
    ("api-contract-violation", r"\b(rfc|spec|contract|should|must|expected|preserve|correctly|behavior|behaviour|compatib)\b"),
    ("ordering-off-by-one", r"\b(off.by.one|index|offset|order|reverse|sorting|sorted|first|last)\b"),
    ("compatibility-shim", r"\b(version.gated|shim|backport|pydantic v[12]|urllib3|compat layer|version range|supported version|drop support|workaround)\b"),
    # "fix support for X" is a bugfix, not a capability request: the lookbehinds
    # stop the verb matching right after fix/fixes/fixed.
    ("missing-capability", r"\b(?<!fix )(?<!fixed )(?<!fixes )(add|adds|support|introduce|allow|enable|new|implement|capability|automate|handle|update|updates|enhance|enhancement|improve|improvement|extend|expose|provide|permit|integrate)\b"),
    ("docs-content-error", r"\b(docs?|documentation|example|tutorial|docstring|constant|typo)\b"),
]

# Discourse-level words that appear in any report: weak evidence (weight 1).
# Specific mechanism nouns weight 2; multi-word mechanism phrases weight 3.
_GENERIC_WORDS = {
    "error", "warning", "release", "ci", "version", "compat", "example", "docs",
    "doc", "add", "adds", "added", "support", "allow", "enable", "new", "handle",
    "should", "must", "expected", "preserve", "correctly", "behavior", "behaviour",
    "compatib", "state", "ref", "first", "last", "index", "order", "empty",
    "none", "null", "pattern", "slash", "constant", "stream", "connection",
    "close", "reset", "scope", "update", "updates", "extend", "provide",
    "permit", "space", "definition",
}

_CHECKBOX_RE = re.compile(r"(?m)^[ \t]*[-*][ \t]+\[([ xX])\][ \t]+(.*)$")
_HTML_COMMENT_RE = re.compile(r"<!--.*?-->", re.S)
_META_HEADERS = {"## type of changes", "## checklist", "## pull request"}


def clean_statement(text):
    """Strip PR-template boilerplate (generic structure, not repo-specific).

    HTML comments are meta-text; unchecked option boxes are noise; long checked
    checklist sentences are boilerplate. Short checked labels ("Bug fix",
    "New feature") are the author's own kind signal and are kept + returned.
    """
    t = _HTML_COMMENT_RE.sub(" ", text)
    labels = []
    out = []
    for line in t.split("\n"):
        m = _CHECKBOX_RE.match(line)
        if m:
            if m.group(1).lower() == "x":
                label = m.group(2).strip()
                if len(label.split()) <= 6:
                    labels.append(label)
                    out.append(label)
            continue
        if line.strip().lower() in _META_HEADERS:
            continue
        if re.match(r"(?i)^\s*discussion:\s*$", line):
            continue
        out.append(line)
    return "\n".join(out), labels


def _prose_only(text):
    """Remove code spans (backticks / quoted literals): identifier DATA, not prose.

    Verb-driven labels (feature verbs, docs words) must not fire on config
    literals like `extra="allow"`; mechanism identifiers may still match them.
    """
    t = _BACKTICK_RE.sub(" ", text)
    t = _QUOTED_RE.sub(" ", t)
    return t

BUG_FAMILIES = {
    "boundary-edge-case", "type-introspection", "state-lifecycle",
    "infinite-loop-recursion", "api-contract-violation", "ordering-off-by-one",
    "schema-generation-logic", "compatibility-shim",
}

PLAYBOOKS = {
    "boundary-edge-case": "Handle the empty/None/trailing/out-of-range input explicitly. Guard before the operation; keep the happy path byte-identical. Check escape parity and inclusive/exclusive bounds.",
    "type-introspection": "Unwrap before checking: inspect.unwrap, peel partial and __wrapped__, getattr fallbacks, identity (is) for sentinels. Handle both the wrapper and the wrapped object.",
    "state-lifecycle": "Find the shared mutable state. Copy per-use, invalidate caches on mutation, order teardown after consumption. Ask: who else holds a reference to this object?",
    "infinite-loop-recursion": "Make the loop advance, or snapshot the iterable being mutated (iterate a copy). Add cycle detection with a seen set. Verify with a timeout.",
    "api-contract-violation": "The statement/spec is the contract. Match documented behavior exactly; do not preserve base behavior the statement contradicts. Check the exact output shape and message strings.",
    "missing-capability": "Add the named API/keyword. Mirror the nearest sibling implementation's signature and conventions; wire it through every layer the siblings touch.",
    "schema-generation-logic": "Fix the construction logic: ref resolution, mode selection, merging, config propagation. Check both compat paths (v1/v2) if the repo has them.",
    "ordering-off-by-one": "Check index arithmetic at boundaries: len-1 bias, reverse vs forward, head/mid/foot. Write a tiny /tmp assertion for the first and last element.",
    "compatibility-shim": "Gate on the dependency version; keep both paths working. Extend the repo's existing shim layer rather than inventing a new one.",
    "docs-content-error": "Change only the named constant/content in the docs example. No library logic.",
}


def _match_weight(matched):
    if matched in _GENERIC_WORDS:
        return 1
    if re.search(r"[\s_-]", matched):
        return 3
    return 2


def _score_patterns(text, patterns):
    scores = {}
    low = text.lower()
    # title = first non-empty line, weighted higher
    lines = [l for l in text.splitlines() if l.strip()]
    title = lines[0].lower() if lines else ""
    for name, pat in patterns:
        rx = re.compile(pat)
        s = sum(_match_weight(m.group(0)) for m in rx.finditer(low))
        s += 2 * sum(_match_weight(m.group(0)) for m in rx.finditer(title))
        if s:
            scores[name] = s
    return scores


def classify(text, cues, sparse, labels=()):
    prose = _prose_only(text)
    ks = _score_patterns(text, KIND_PATTERNS)
    # feature verbs are natural-language signals: score them on prose only
    feat = _score_patterns(prose, [p for p in KIND_PATTERNS if p[0] == "feature"])
    if "feature" in feat:
        ks["feature"] = feat["feature"]
    else:
        ks.pop("feature", None)
    # checked PR-template labels are the author's own kind signal
    for lab in labels:
        ll = lab.lower()
        if "bug" in ll:
            ks["bugfix"] = ks.get("bugfix", 0) + 3
        elif "feature" in ll:
            ks["feature"] = ks.get("feature", 0) + 3
        elif "doc" in ll:
            ks["docs"] = ks.get("docs", 0) + 3
    kind = max(ks, key=ks.get) if ks else "bugfix"
    fs = _score_patterns(text, FAMILY_PATTERNS)
    # verb-driven families ignore code spans (config literals are not verbs)
    for fam in ("missing-capability", "docs-content-error"):
        pf = _score_patterns(prose, [p for p in FAMILY_PATTERNS if p[0] == fam])
        if fam in pf:
            fs[fam] = pf[fam]
        else:
            fs.pop(fam, None)
    if not fs:
        # no mechanism evidence: fall back by kind (a bug with no named mechanism
        # is a boundary/contract question; a non-bug change is a capability add)
        if kind in ("feature", "deprecation", "performance", "refactor", "dx",
                    "security", "dependency-compat"):
            family, runner = "missing-capability", "api-contract-violation"
        elif kind == "docs":
            family, runner = "docs-content-error", "missing-capability"
        else:
            family, runner = "boundary-edge-case", "api-contract-violation"
        margin = 0.0
    else:
        # tie-break: bugs prefer a concrete mechanism over missing-capability
        ordered = sorted(fs.items(), key=lambda kv: (
            -kv[1], 0 if (kind == "bugfix" and kv[0] in BUG_FAMILIES) else 1, kv[0]))
        family = ordered[0][0]
        runner = ordered[1][0] if len(ordered) > 1 else family
        top = ordered[0][1]
        second = ordered[1][1] if len(ordered) > 1 else 0
        margin = (top - second) / top if top else 0.0
    # is_bug independent of kind
    is_bug = (kind == "bugfix") or (family in BUG_FAMILIES and kind not in ("feature", "docs", "deprecation"))
    # confidence
    strong = any(c["type"] in ("path", "ident", "call", "literal") for c in cues)
    if sparse == "url_only":
        conf = "low"
    elif strong and margin >= 0.2:
        conf = "high"
    elif strong or margin >= 0.2:
        conf = "medium"
    else:
        conf = "low"
    tie = margin < 0.2 and family != runner
    return {
        "kind": kind, "family": family, "runner_up": runner,
        "confidence": conf, "is_bug": is_bug, "tie": tie,
        "kind_scores": ks, "family_scores": fs,
    }


def edit_shape(cls, candidates, new_file, large_data):
    if new_file:
        return "new-files"
    if large_data:
        return "large"
    fam = cls["family"]
    strong = [c for c in candidates if c["score"] >= 40]
    if fam in ("schema-generation-logic", "state-lifecycle") and len(strong) >= 2:
        return "multi-file"
    if fam == "missing-capability" and len(strong) >= 2:
        return "multi-file"
    if fam in ("ordering-off-by-one", "boundary-edge-case", "compatibility-shim"):
        return "one-line" if len(strong) <= 1 else "few-lines"
    if len(strong) >= 3:
        return "multi-file"
    return "few-lines"


# ---------------------------------------------------------------------------
# Cue extraction
# ---------------------------------------------------------------------------

_STOPWORDS = {
    "the", "and", "for", "with", "this", "that", "from", "into", "when", "where",
    "which", "what", "will", "would", "should", "could", "have", "has", "had",
    "are", "was", "were", "been", "being", "does", "did", "not", "but", "also",
    "than", "then", "them", "they", "their", "there", "here", "some", "any",
    "all", "each", "both", "more", "most", "other", "such", "only", "own",
    "same", "too", "very", "can", "may", "might", "must", "shall", "about",
    "after", "before", "between", "during", "without", "within", "upon", "over",
    "under", "again", "further", "once", "fix", "fixes", "fixed", "bug", "issue",
    "issues", "pull", "request", "type", "changes", "change", "checklist",
    "description", "note", "notes", "summary", "tests", "test", "added", "add",
    "new", "code", "using", "used", "use", "make", "made", "see", "via", "per",
}

_PATH_RE = re.compile(r"(?:[A-Za-z0-9_./\-]+/)?[A-Za-z0-9_\-]+\.py")
_MODSYM_RE = re.compile(r"\b([a-z_][\w.]*[a-z0-9_])\s*:\s*([A-Z]\w*)")
_BACKTICK_RE = re.compile(r"`([^`\n]+)`")
_CALL_RE = re.compile(r"\b([A-Za-z_]\w*)\s*\(\)")
_IDENT_RE = re.compile(r"^[A-Za-z_][A-Za-z0-9_.]*$")
_CAMEL_RE = re.compile(r"\b([A-Z][a-z0-9]+(?:[A-Z][a-z0-9]+)+)\b")
_SNAKE_RE = re.compile(r"\b([a-z][a-z0-9]*(?:_[a-z0-9]+)+)\b")
_QUOTED_RE = re.compile(r"[\"']([^\"'\n]{3,60})[\"']")
_EXC_RE = re.compile(r"\b([A-Z]\w*(?:Error|Exception|Warning))\b")
_TRACE_RE = re.compile(r'File "([^"]+)", line (\d+)')
_FENCE_CODE_RE = re.compile(r"```(?:python|py)\n(.*?)```", re.S)
_ISSUE_RE = re.compile(r"#(\d+)")


def _add_cue(cues, seen, term, ctype, weight, prov):
    term = term.strip()
    if not term or len(term) < 2:
        return
    key = (term.lower(), ctype)
    if key in seen:
        return
    seen.add(key)
    cues.append({"term": term, "type": ctype, "weight": weight, "prov": prov})


def extract_cues(text):
    cues = []
    seen = set()
    # 1. explicit .py paths
    for m in _PATH_RE.finditer(text):
        p = m.group(0).lstrip("./")
        _add_cue(cues, seen, p, "path", 3.0, "path")
    # dotted module:Symbol -> path + symbol
    for m in _MODSYM_RE.finditer(text):
        mod, sym = m.group(1), m.group(2)
        if "." in mod:
            _add_cue(cues, seen, mod.replace(".", "/") + ".py", "path", 3.0, "modsym")
        _add_cue(cues, seen, sym, "ident", 2.0, "modsym")
    # 2. backtick identifier spans
    for m in _BACKTICK_RE.finditer(text):
        span = m.group(1).strip()
        if _IDENT_RE.match(span):
            _add_cue(cues, seen, span, "ident", 2.0, "backtick")
        elif span.endswith(".py"):
            _add_cue(cues, seen, span.lstrip("./"), "path", 3.0, "backtick")
    # 3. call syntax + CamelCase + snake_case
    for m in _CALL_RE.finditer(text):
        _add_cue(cues, seen, m.group(1), "call", 2.2, "call")
    for m in _CAMEL_RE.finditer(text):
        _add_cue(cues, seen, m.group(1), "ident", 1.4, "camel")
    for m in _SNAKE_RE.finditer(text):
        w = m.group(1)
        if w.lower() not in _STOPWORDS and len(w) >= 4:
            _add_cue(cues, seen, w, "ident", 1.4, "snake")
    # 4. quoted literals (error messages / keys like $ref)
    for m in _QUOTED_RE.finditer(text):
        lit = m.group(1).strip()
        if lit and not lit.startswith("http") and len(lit) >= 2:
            _add_cue(cues, seen, lit, "literal", 2.0, "quoted")
    # 5. exception types + traceback frames
    for m in _EXC_RE.finditer(text):
        _add_cue(cues, seen, m.group(1), "exception", 2.0, "exception")
    for m in _TRACE_RE.finditer(text):
        _add_cue(cues, seen, m.group(1).lstrip("./"), "path", 3.0, "traceback")
    # 6. fenced python code -> repro seed
    repro = None
    fm = _FENCE_CODE_RE.search(text)
    if fm:
        repro = fm.group(1).strip()
    # 7. sparse symptom words from title
    symptom = symptom_words(text)
    for w in symptom:
        _add_cue(cues, seen, w, "symptom", 1.0, "symptom")
    # rank by specificity (weight desc), dedupe terms keeping highest weight, cap
    cues.sort(key=lambda c: -c["weight"])
    best = {}
    for c in cues:
        k = c["term"].lower()
        if k not in best or c["weight"] > best[k]["weight"]:
            best[k] = c
    ranked = sorted(best.values(), key=lambda c: (-c["weight"], c["term"]))
    return ranked[:MAX_CUES], repro, symptom


def symptom_words(text):
    lines = [l for l in text.splitlines() if l.strip()]
    title = lines[0] if lines else text
    title = strip_emoji(title)
    title = _URL_RE.sub(" ", title)
    title = re.sub(r"(?i)^\s*(fix for|fixes|fix|bug|feat|feature)\b", " ", title)
    title = re.sub(r"\[[^\]]*\]", " ", title)  # [BUG] etc.
    title = re.sub(r"[\"'][^\"']*[\"']", " ", title)  # quoted literals are separate cues
    words = re.findall(r"[A-Za-z][A-Za-z0-9_]{2,}", title)
    out = []
    for w in words:
        wl = w.lower()
        if wl in _STOPWORDS or wl in ("github", "https", "http", "com", "www"):
            continue
        if wl not in out:
            out.append(wl)
    return out[:12]


def sparse_tier(text, cues):
    had_url = bool(_URL_RE.search(text))
    stripped = _URL_RE.sub(" ", strip_emoji(text))
    stripped = _FENCE_RE.sub(" ", stripped)
    stripped = " ".join(stripped.split())
    strong = any(c["type"] in ("path", "ident", "call", "literal", "exception") for c in cues)
    nwords = len(re.findall(r"[A-Za-z0-9_]+", stripped))
    if had_url and len(stripped) < 120 and not strong:
        return "url_only"
    if len(stripped) < 120 or nwords <= 8:
        return "low_info"
    return "no"


# ---------------------------------------------------------------------------
# Subsystem map + repo priors (generic foundation; priors only tune weights)
# ---------------------------------------------------------------------------

SUBSYSTEM_MAP = [
    ({"parse", "parsing", "validation", "validate", "schema", "deserialize"}, ("pars", "valid", "schema", "compat")),
    ({"render", "rendering", "output", "console", "print", "display"}, ("render", "format", "output", "console", "print")),
    ({"network", "protocol", "http", "connection", "request", "server", "socket"}, ("http", "conn", "request", "server", "network", "pool", "adapter")),
    ({"markdown", "table", "tables"}, ("markdown", "table")),
    ({"text", "width", "cell", "cells", "grapheme", "graphemes", "unicode", "emoji", "wrap"}, ("text", "cell", "width", "unicode", "wrap")),
    ({"highlight", "highlighting", "hyperlink", "syntax"}, ("highlight",)),
    ({"style", "styles", "styling", "color", "theme"}, ("style", "theme", "color")),
    ({"async", "stream", "streaming", "sse", "event", "events"}, ("stream", "async", "sse", "event", "routing")),
    ({"release", "version", "prepare", "automation", "automate"}, ("release", "version", "prepare")),
    ({"url", "path", "slash", "slashes", "proxy"}, ("url", "path", "adapter", "model")),
    ({"file", "files", "upload", "wrapper", "encode"}, ("file", "model", "util", "upload")),
    ({"dependency", "dependencies", "partial", "wrap", "wraps", "callable"}, ("depend", "util", "model", "compat")),
]

REPO_PRIORS = {
    "fastapi": ("_compat", "openapi", "dependencies", "routing", "responses", "sse", "utils"),
    "rich": ("text", "console", "table", "markdown", "cells", "highlighter", "style", "default_styles"),
    "requests": ("models", "utils", "adapters", "sessions", "structures"),
    "httpx": ("_parsers", "_pool", "_server", "_network", "_models", "_client", "_content"),
}


def detect_repo(root):
    name = None
    for cfg in ("pyproject.toml", "setup.cfg", "setup.py"):
        p = os.path.join(root, cfg)
        if os.path.exists(p):
            try:
                txt = read_text(p)
            except Exception:
                continue
            m = re.search(r'(?m)^\s*name\s*=\s*["\']([^"\']+)["\']', txt)
            if m:
                name = m.group(1).lower()
                break
    if name:
        for known in REPO_PRIORS:
            if known in name:
                return known
    # top-level package dir fallback
    for known in REPO_PRIORS:
        if os.path.isdir(os.path.join(root, known)) or os.path.isdir(os.path.join(root, "src", known)):
            return known
    return "generic"


def subsystem_bonus(relpath, symptom):
    if not symptom:
        return 0
    stem = os.path.splitext(os.path.basename(relpath))[0].lower()
    parts = relpath.lower()
    sset = set(symptom)
    for words, dirs in SUBSYSTEM_MAP:
        if sset & words:
            for d in dirs:
                if d in stem or d in parts:
                    return 15
    return 0


def repo_prior_bonus(relpath, repo):
    if repo == "generic":
        return 0
    stem = os.path.splitext(os.path.basename(relpath))[0].lower()
    for prior in REPO_PRIORS.get(repo, ()):
        if stem == prior.lower() or stem.startswith(prior.lower()):
            return 8
    return 0


# ---------------------------------------------------------------------------
# Repo index (incremental AST symbol index)
# ---------------------------------------------------------------------------

def _symbols_from_ast(text):
    syms = {}
    try:
        tree = ast.parse(text)
    except SyntaxError:
        for m in re.finditer(r"(?m)^[ \t]*(?:async[ \t]+)?def[ \t]+(\w+)|^[ \t]*class[ \t]+(\w+)", text):
            name = m.group(1) or m.group(2)
            line = text.count("\n", 0, m.start()) + 1
            syms[name] = [line, line, "def"]
        return syms
    for node in tree.body:
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
            syms[node.name] = [node.lineno, getattr(node, "end_lineno", node.lineno) or node.lineno, "def"]
        elif isinstance(node, ast.ClassDef):
            syms[node.name] = [node.lineno, getattr(node, "end_lineno", node.lineno) or node.lineno, "class"]
            for sub in node.body:
                if isinstance(sub, (ast.FunctionDef, ast.AsyncFunctionDef)):
                    syms[sub.name] = [sub.lineno, getattr(sub, "end_lineno", sub.lineno) or sub.lineno, "method"]
        elif isinstance(node, ast.Assign):
            for t in node.targets:
                if isinstance(t, ast.Name):
                    syms[t.id] = [node.lineno, node.lineno, "assign"]
        elif isinstance(node, ast.AnnAssign):
            if isinstance(node.target, ast.Name):
                syms[node.target.id] = [node.lineno, node.lineno, "assign"]
    return syms


def _walk_py_files(root, include_docs):
    for dp, dn, fn in os.walk(root):
        dn[:] = [d for d in dn if d not in SKIP_DIRS and not d.endswith(".egg-info")]
        rel_dir = os.path.relpath(dp, root)
        parts = set(rel_dir.replace("\\", "/").split("/"))
        if parts & PROTECTED_DIRS:
            continue
        if not include_docs and (parts & {"docs", "docs_src", "doc", "examples"}):
            continue
        for f in fn:
            if not f.endswith(".py"):
                continue
            full = os.path.join(dp, f)
            try:
                if os.path.getsize(full) > MAX_FILE_BYTES:
                    continue
            except OSError:
                continue
            yield os.path.relpath(full, root).replace("\\", "/"), full


def build_index(root, cues, include_docs, deadline):
    """Return (files, index, partial, nfiles). files: list of per-file dicts.

    Performance: a single case-insensitive presence regex pre-filters each file.
    Files matching no cue skip lowercasing, per-cue counting AND ast.parse (the
    expensive steps), so a 3000-file repo scans in a few seconds. Only matching
    files are AST-parsed; their symbols are cached keyed (size, mtime_ns).
    """
    index = load_json(root, "index.json", {})
    files = []
    partial = False
    cue_terms = [(c["term"], c["type"]) for c in cues]
    path_cues = [t.lower() for t, k in cue_terms if k == "path"]
    nonpath = [t for t, k in cue_terms if k != "path"]
    presence_rx = None
    if nonpath:
        presence_rx = re.compile("|".join(re.escape(t) for t in nonpath), re.I)
    n = 0
    for rel, full in _walk_py_files(root, include_docs):
        if time.monotonic() > deadline:
            partial = True
            break
        try:
            text = read_text(full)
        except Exception:
            continue
        n += 1
        rel_l = rel.lower()
        path_match = any(rel_l == p or rel_l.endswith("/" + p) for p in path_cues)
        has_cue = path_match or (presence_rx is not None and presence_rx.search(text) is not None)
        if not has_cue:
            # No cue hit: skip stat, newline count, AST and index write entirely.
            files.append({
                "path": rel, "symbols": {}, "matched": {}, "ref_occ": 0,
                "nlines": 0, "bytes": 0, "cue_lines": {},
            })
            continue
        # matching file: full processing (stat + cached AST + cue counting)
        try:
            st = os.stat(full)
        except OSError:
            continue
        key = [st.st_size, st.st_mtime_ns]
        cached = index.get(rel)
        key_ok = bool(cached and cached.get("key") == key)
        if key_ok and cached.get("parsed"):
            syms = cached.get("symbols", {})
        else:
            syms = _symbols_from_ast(text)
        index[rel] = {"key": key, "symbols": syms, "parsed": True}
        low = text.lower()
        matched = {}
        ref_occ = 0
        for term, ctype in cue_terms:
            tl = term.lower()
            if ctype == "path":
                if rel_l == tl or rel_l.endswith("/" + tl):
                    matched[term] = "path"
                continue
            if term in syms:
                matched[term] = "def"
                ref_occ += low.count(tl)
            elif tl in low:
                matched[term] = "ref"
                ref_occ += low.count(tl)
        cue_lines = {}
        if matched:
            file_lines = low.split("\n")
            for term, ctype in cue_terms:
                if ctype == "path" or term not in matched:
                    continue
                tl = term.lower()
                hits = [i + 1 for i, l in enumerate(file_lines) if tl in l]
                if hits:
                    cue_lines[term] = hits[:40]
        files.append({
            "path": rel, "symbols": syms, "matched": matched,
            "ref_occ": ref_occ, "nlines": text.count("\n") + 1,
            "bytes": st.st_size, "cue_lines": cue_lines,
        })
    return files, index, partial, n


def rarity_weights(files, cues, nfiles):
    df = {}
    for c in cues:
        tl = c["term"].lower()
        cnt = 0
        for f in files:
            if c["type"] == "path":
                if f["path"].lower() == tl or f["path"].lower().endswith("/" + tl):
                    cnt += 1
            elif c["term"] in f["matched"] or any(tl == s.lower() for s in f["symbols"]):
                cnt += 1
        df[c["term"]] = cnt
    import math
    N = max(1, nfiles)
    weights = {}
    for c in cues:
        d = df.get(c["term"], 0)
        idf = math.log(1 + N / (1 + d)) / math.log(1 + N)
        weights[c["term"]] = 0.5 + idf  # ~0.6 common .. ~1.4 rare
    return weights, df


def _name_match(name, terms):
    """Substring + morphological part match (a gerund cue may match a verb stem)."""
    nl = name.lower()
    parts = [p for p in nl.split("_") if len(p) >= 4]
    for t in terms:
        if not t:
            continue
        if t in nl:
            return True
        # morphological part match only for single-word cues (a verb cue may match a
        # symbol stem with a suffix); never for compound cues, whose parts are too generic
        if "_" not in t:
            for p in parts:
                if t.startswith(p) or p.startswith(t):
                    return True
    return False


def pick_symbols(symbols, cue_lines, terms, k=3):
    """Rank symbols by name match + body cue-line density; prefer defs over assigns."""
    all_lines = sorted({ln for hits in cue_lines.values() for ln in hits})
    scored = []
    for name, info in symbols.items():
        lo, hi = info[0], info[1]
        nm = _name_match(name, terms)
        body = min(3, sum(1 for ln in all_lines if lo <= ln <= hi))
        kind_bonus = 0.5 if info[2] in ("def", "method", "class") else 0.0
        # a named symbol beats a large enclosing class that merely contains cue lines
        score = (5.0 if nm else 0.0) + body + kind_bonus
        if score > 0:
            scored.append((score, lo, name, info))
    scored.sort(key=lambda x: (-x[0], x[1]))
    out = [{"name": n, "line": i[0], "kind": i[2]} for _s, _l, n, i in scored[:k]]
    if not out:
        for name, info in sorted(symbols.items(), key=lambda kv: kv[1][0]):
            if info[2] in ("def", "method", "class"):
                out.append({"name": name, "line": info[0], "kind": info[2]})
                break
    return out


def rank_candidates(files, cues, symptom, repo, nfiles):
    rarity, df = rarity_weights(files, cues, nfiles)
    scored = []
    for f in files:
        matched = f["matched"]
        path_hits = sum(1 for t, k in matched.items() if k == "path")
        stem = os.path.splitext(os.path.basename(f["path"]))[0].lower()
        stem_hits = sum(1 for c in cues if c["term"].lower() == stem)
        defined = [t for t, k in matched.items() if k == "def"]
        coverage = 0.0
        for c in cues:
            if c["term"] in matched:
                coverage += c["weight"] * rarity.get(c["term"], 1.0)
        score = (
            100 * path_hits
            + 12 * stem_hits
            + 25 * coverage
            + 30 * len(defined)
            + 8 * min(f["ref_occ"], 5)
            + subsystem_bonus(f["path"], symptom)
            + repo_prior_bonus(f["path"], repo)
        )
        if score <= 0:
            continue
        # top-3 symbol anchors: name match (morphological) + body cue-line density.
        terms = [c["term"].lower() for c in cues]
        sym_anchors = pick_symbols(f["symbols"], f.get("cue_lines", {}), terms, k=3)
        scored.append({
            "path": f["path"], "score": round(score, 1),
            "matched_cues": sorted(matched.keys()),
            "defined": defined, "symbols": sym_anchors[:3],
            "nlines": f["nlines"], "bytes": f["bytes"],
        })
    scored.sort(key=lambda c: (-c["score"], c["path"]))
    return scored[:5], df


# ---------------------------------------------------------------------------
# Anchors (window expansion + edit-time re-verification)
# ---------------------------------------------------------------------------

def _count(content, snippet):
    if not snippet:
        return 0
    return content.count(snippet)


def expand_window(lines, content, idx):
    """Return (start, end, old_string, occurrences) 0-based inclusive, or None."""
    n = len(lines)
    if idx < 0 or idx >= n:
        return None
    start = end = idx
    snippet = lines[idx]
    occ = _count(content, snippet)
    while occ > 1 and (end - start + 1) < MAX_WINDOW:
        grew = False
        if end + 1 < n:
            end += 1
            snippet = "\n".join(lines[start:end + 1])
            occ = _count(content, snippet)
            grew = True
            if occ == 1:
                break
        if start - 1 >= 0 and (end - start + 1) < MAX_WINDOW:
            start -= 1
            snippet = "\n".join(lines[start:end + 1])
            occ = _count(content, snippet)
            grew = True
        if not grew:
            break
    return start, end, snippet, occ


def _family_lines(block_lines, family):
    pats = {
        "infinite-loop-recursion": r"\b(for|while)\b|\.extend\(|\.append\(",
        "boundary-edge-case": r"\bif\b|\breturn\b|len\(",
        "ordering-off-by-one": r"\bif\b|\breturn\b|len\(|\[-1\]|\[0\]",
        "type-introspection": r"isinstance|getattr|hasattr|unwrap|partial",
        "state-lifecycle": r"\breturn\b|\.close\(|\.reset\(|self\.",
    }
    pat = pats.get(family)
    if not pat:
        return []
    rx = re.compile(pat)
    return [i for i, l in enumerate(block_lines) if rx.search(l)]


def _good_anchor(snippet):
    if not snippet.strip():
        return False
    if snippet.rstrip().endswith("`"):
        return False
    if DELIM in snippet:
        return False
    return True


def gen_anchors(root, relpath, symbols, cues, family, strikes, max_anchors=3):
    full = os.path.join(root, relpath)
    if not os.path.exists(full):
        return {"file": relpath, "exists": False, "anchors": []}
    content = read_text(full)
    lines = content.split("\n")
    low_lines = [l.lower() for l in lines]
    # LIST of strike dicts for this file (a set comprehension would raise
    # TypeError: unhashable type 'dict' the moment any strike exists, crashing
    # the anchors-after-strike circuit-breaker path — 756051/747519/756433).
    struck = [s for s in strikes if s.get("file") == relpath]
    terms = [c["term"].lower() for c in cues if c["type"] != "path"]
    cue_lines = {}
    for t in terms:
        if not t:
            continue
        hits = [i + 1 for i, l in enumerate(low_lines) if t in l]
        if hits:
            cue_lines[t] = hits[:60]
    chosen = pick_symbols(symbols, cue_lines, terms, k=3)
    all_cue_lines = sorted({ln for hits in cue_lines.values() for ln in hits})
    targets = []
    # 1. cue lines inside the best-matching symbol (most specific edit locus)
    if chosen:
        top = symbols.get(chosen[0]["name"])
        if top:
            lo, hi = top[0], top[1]
            targets += [ln - 1 for ln in all_cue_lines if lo <= ln <= hi]
    # 2. remaining cue lines (direct symptom evidence)
    targets += [ln - 1 for ln in all_cue_lines[:8]]
    # 3. chosen symbol def lines + family-prioritized lines within their blocks
    for a in chosen:
        info = symbols.get(a["name"])
        if not info:
            continue
        line0 = info[0] - 1
        end0 = min(info[1], len(lines)) - 1
        targets.append(line0)
        for i in _family_lines(lines[line0:end0 + 1], family):
            targets.append(line0 + i)
    if not targets:
        targets = [min(5, len(lines) - 1)]
    # dedupe targets, keep order
    seen = set()
    uniq_targets = []
    for t in targets:
        if 0 <= t < len(lines) and t not in seen:
            seen.add(t)
            uniq_targets.append(t)
    anchors = []
    used_windows = set()
    for t in uniq_targets:
        if any(s.get("line") == t + 1 for s in struck):
            continue
        w = expand_window(lines, content, t)
        if not w:
            continue
        start, end, snippet, occ = w
        wkey = (start, end)
        if wkey in used_windows:
            continue
        if occ == 1 and _good_anchor(snippet):
            used_windows.add(wkey)
            anchors.append({
                "file": relpath, "start_line": start + 1, "end_line": end + 1,
                "old_string": snippet, "occurrences": 1, "status": "unique",
                "strategy": "exact",
            })
        elif occ == 0:
            anchors.append({
                "file": relpath, "start_line": start + 1, "end_line": end + 1,
                "old_string": snippet, "occurrences": 0, "status": "absent",
                "strategy": "reread",
            })
        else:
            used_windows.add(wkey)
            anchors.append({
                "file": relpath, "start_line": start + 1, "end_line": end + 1,
                "old_string": "", "occurrences": occ, "status": "ambiguous",
                "strategy": "line-range",
            })
        if len(anchors) >= max_anchors:
            break
    return {"file": relpath, "exists": True, "anchors": anchors,
            "symbols": [{"name": a["name"], "line": a["line"],
                         "end": symbols.get(a["name"], [a["line"], a["line"]])[1]} for a in chosen]}


# ---------------------------------------------------------------------------
# Acceptance-test discovery
# ---------------------------------------------------------------------------

def discover_tests(root, cues, family):
    test_files = []
    cue_terms = [c["term"].lower() for c in cues if c["type"] in ("ident", "call", "symptom", "path")]
    for dp, dn, fn in os.walk(root):
        dn[:] = [d for d in dn if d not in SKIP_DIRS]
        rel_dir = os.path.relpath(dp, root).replace("\\", "/")
        parts = set(rel_dir.split("/"))
        # test dirs at any depth, plus repo-root test files (private-repo layouts)
        if not (parts & PROTECTED_DIRS) and rel_dir != ".":
            continue
        for f in fn:
            if not f.endswith(".py"):
                continue
            if not (f.startswith("test_") or f.endswith("_test.py")):
                continue
            full = os.path.join(dp, f)
            rel = os.path.relpath(full, root).replace("\\", "/")
            try:
                text = read_text(full)
            except Exception:
                continue
            stem = f[5:-3].lower() if f.startswith("test_") else f[:-8].lower()
            score = 0
            for t in cue_terms:
                if t and t in stem:
                    score += 3
            funcs = re.findall(r"(?m)^\s*def\s+(test_\w+)", text)
            best_kw = None
            for fn_name in funcs:
                fl = fn_name.lower()
                for t in cue_terms:
                    if t and len(t) >= 4 and t in fl:
                        score += 2
                        if best_kw is None:
                            best_kw = fn_name
            if score > 0:
                test_files.append((score, rel, best_kw))
    test_files.sort(key=lambda x: (-x[0], x[1]))
    cmds = []
    for score, rel, kw in test_files[:2]:
        cmd = "timeout 60 python3 -m pytest " + rel
        if kw:
            cmd += " -k " + kw
        cmd += " -x -q"
        cmds.append(cmd)
    return cmds


# ---------------------------------------------------------------------------
# Spec render
# ---------------------------------------------------------------------------

def _word_count(text):
    return len(text.split())


def render_spec(cls, repo, sparse, candidates, anchors_map, test_cmds, repro, new_file, large_data, shape):
    fam = cls["family"]
    alt = cls["runner_up"]
    playbook = PLAYBOOKS.get(fam, PLAYBOOKS["boundary-edge-case"])
    lines = []
    lines.append("# BCF spec")
    lines.append("kind: %s | family: %s (alt: %s) | shape: %s | confidence: %s" % (
        cls["kind"], fam, alt, shape, cls["confidence"]))
    lines.append("repo: %s | sparse: %s" % (repo, sparse))
    if sparse in ("url_only", "low_info"):
        lines.append("SPARSE STATEMENT: reconstruct from title + subsystem conventions; never fetch URLs; state your hypothesis before editing.")
    if cls["tie"]:
        lines.append("Family uncertain: confirm which mechanism (top vs alt) before editing.")
    lines.append("")
    lines.append("## Target")
    if new_file and not candidates:
        lines.append("1. Likely a NEW file: no existing candidate matches. Mirror the nearest sibling module/script and its conventions; create the file under the matching subsystem.")
    elif candidates:
        c0 = candidates[0]
        sym = c0["symbols"][0] if c0["symbols"] else None
        if sym:
            lines.append("1. %s — %s (line %d)" % (c0["path"], sym["name"], sym["line"]))
        else:
            lines.append("1. %s" % c0["path"])
        if len(candidates) > 1:
            c1 = candidates[1]
            sym1 = c1["symbols"][0] if c1["symbols"] else None
            if sym1:
                lines.append("2. alt: %s — %s (line %d)" % (c1["path"], sym1["name"], sym1["line"]))
            else:
                lines.append("2. alt: %s" % c1["path"])
        if new_file:
            lines.append("Note: part of this change is likely a NEW file; create it mirroring sibling conventions.")
    else:
        lines.append("1. No strong candidate. Run locate with refined symptom words; grep the repo; read the top hit before editing.")
    if large_data:
        lines.append("LARGE DATA: treat data tables as assets; edit the loader/algorithm, never the data; never read whole.")
    lines.append("")
    lines.append("## Anchors")
    lines.append("Fetch fresh verified windows before every edit: python3 .git/bcf/bcf.py anchors PATH")
    lines.append("")
    lines.append("## Fix")
    lines.append(playbook)
    lines.append("")
    lines.append("## Steps")
    lines.append("1. Read the target range (start_line/end_line).")
    lines.append("2. Run anchors; copy the UNIQUE window verbatim (31B) or use apply with the range (E4B).")
    lines.append("3. Make the minimal mechanism change; keep the happy path byte-identical.")
    lines.append("4. Compile: python3 -m py_compile FILE.")
    lines.append("5. Run the Verify test command.")
    lines.append("6. Run check, review git diff, submit_patch last.")
    lines.append("")
    lines.append("## Verify")
    if test_cmds:
        for cmd in test_cmds:
            lines.append(cmd)
    else:
        lines.append("No matching existing test found. Write a /tmp repro via run_command heredoc; run with timeout 10.")
    if repro:
        lines.append("Repro seed: .git/bcf/repro_seed.py — copy to /tmp, run with timeout 10.")
    lines.append("Then: python3 .git/bcf/bcf.py check")
    lines.append("")
    lines.append("## Rules")
    lines.append("Minimal edit. Never touch tests, conftest.py, pytest.ini, pyproject.toml. Scratch in /tmp only.")
    lines.append("Existing tests guard regressions; the statement is the contract. submit_patch last.")
    spec = "\n".join(lines)
    spec = sanitize(spec)
    # enforce word cap: trim Verify/Rules detail if needed (keep structure)
    if _word_count(spec) > SPEC_WORD_CAP:
        spec = _trim_spec(spec)
    if len(spec) > SPEC_CHAR_CAP:
        spec = spec[: SPEC_CHAR_CAP - 15].rstrip() + "\n...[truncated]"
    return spec


def _trim_spec(spec):
    # Drop optional banner lines first, then shorten Steps wording.
    drop_prefixes = ("SPARSE STATEMENT:", "Family uncertain:", "LARGE DATA:", "Note:", "Repro seed:")
    out = []
    for line in spec.split("\n"):
        if any(line.startswith(p) for p in drop_prefixes):
            continue
        out.append(line)
    spec = "\n".join(out)
    if _word_count(spec) <= SPEC_WORD_CAP:
        return spec
    # compact steps
    spec = spec.replace(
        "2. Run anchors; copy the UNIQUE window verbatim (31B) or use apply with the range (E4B).",
        "2. Run anchors; use the unique window or apply the range.")
    spec = spec.replace(
        "3. Make the minimal mechanism change; keep the happy path byte-identical.",
        "3. Minimal mechanism change; keep happy path identical.")
    return spec


# ---------------------------------------------------------------------------
# spec subcommand
# ---------------------------------------------------------------------------

def cmd_spec(root, args):
    t0 = time.monotonic()
    d = ensure_bcf_dir(root)
    problem_path = os.path.join(d, "problem.md")
    if os.path.exists(problem_path):
        problem = read_text(problem_path)
    else:
        problem = read_stdin_bounded()
        if problem is None:
            die("stdin timeout (no statement arrived; provide .git/bcf/problem.md or a single-quoted heredoc)")
        if problem.strip():
            atomic_write(problem_path, problem)
    if not problem.strip():
        die("empty problem statement (provide .git/bcf/problem.md or stdin heredoc)")
    head = git_head(root)
    norm = normalize(problem)
    key = cache_key(norm, head)
    cache_spec = os.path.join(d, "cache", key, "spec.md")
    if os.path.exists(cache_spec):
        emit(read_text(cache_spec))
        return 0
    # cold pipeline
    cues, repro, symptom = extract_cues(problem)
    cleaned, labels = clean_statement(problem)
    sparse = sparse_tier(cleaned, cues)
    cls = classify(cleaned, cues, sparse, labels)
    # docs dirs are scanned when the change is docs-directed: family/kind say so,
    # a path cue points there, or the TITLE names docs (a docs tutorial change
    # may classify as a capability add, but its locus is still under docs_src).
    title_line = next((l for l in cleaned.splitlines() if l.strip()), "")
    docs_title = re.search(r"\b(docs?|documentation|tutorial|docstring|readme)\b",
                           title_line.lower())
    include_docs = (cls["family"] == "docs-content-error" or cls["kind"] == "docs"
                    or bool(docs_title)
                    or any(c["type"] == "path" and ("docs" in c["term"]) for c in cues))
    repo = detect_repo(root)
    # 8s is the performance TARGET; the contract guard is 20s. Scan up to the hard
    # guard (minus margin for ranking/anchors/render/persist) before going partial.
    deadline = t0 + max(2.0, SCAN_HARD_DEADLINE - 3.0)
    files, index, partial, nfiles = build_index(root, cues, include_docs, deadline)
    candidates, df = rank_candidates(files, cues, symptom, repo, nfiles)
    # new-file detection: strong symptom/path cue but no existing candidate
    new_file = (not candidates) and bool(symptom or cues)
    # generic large-data heuristic: a candidate is a megafile / generated table
    large_data = any(c["nlines"] > 2000 or c["bytes"] > 200000 for c in candidates)
    shape = edit_shape(cls, candidates, new_file, large_data)
    # anchors for top-2 files
    st = load_state(root)
    anchors_map = {}
    file_syms = {f["path"]: f["symbols"] for f in files}
    for c in candidates[:2]:
        syms = file_syms.get(c["path"], {})
        anchors_map[c["path"]] = gen_anchors(root, c["path"], syms, cues, cls["family"], st.get("strikes", []))
    test_cmds = discover_tests(root, cues, cls["family"])
    if repro:
        atomic_write(os.path.join(d, "repro_seed.py"), repro)
    spec = render_spec(cls, repo, sparse, candidates, anchors_map, test_cmds, repro, new_file, large_data, shape)
    if partial or (time.monotonic() - t0) > SCAN_HARD_DEADLINE:
        # A partial spec is USABLE output: mark it in the text and exit 0.
        # A nonzero exit would wrap it in run_command's CommandError envelope
        # and invite blind install/spec retries (same philosophy as check FAIL
        # exiting 0: the verdict is text, not a command error).
        spec = spec.replace("confidence: ", "confidence: partial-", 1)
    # persist
    atomic_write(os.path.join(d, "spec.md"), spec)
    atomic_write(os.path.join(d, "candidates.json"), json.dumps({
        "candidates": candidates, "cues": cues, "classification": cls,
        "repo": repo, "sparse": sparse, "shape": shape, "symptom": symptom,
        "df": df, "nfiles": nfiles, "partial": partial, "include_docs": include_docs,
    }, indent=1, sort_keys=True))
    atomic_write(os.path.join(d, "anchors.json"), json.dumps(anchors_map, indent=1, sort_keys=True))
    if not partial:
        atomic_write(os.path.join(d, "index.json"), json.dumps(index, sort_keys=True))
    atomic_write(os.path.join(d, "cache", key, "spec.md"), spec)
    atomic_write(os.path.join(d, "cache", key, "detail.json"), json.dumps({
        "key": key, "head": head, "candidates": candidates, "classification": cls,
        "shape": shape, "sparse": sparse,
    }, indent=1, sort_keys=True))
    st.update({"phase": "spec-ready", "key": key, "strikes": st.get("strikes", []),
               "last_check": None, "edits": st.get("edits", []), "tests_run": False})
    save_state(root, st)
    emit(spec)
    return 0


# ---------------------------------------------------------------------------
# anchors subcommand
# ---------------------------------------------------------------------------

def cmd_anchors(root, args):
    if not args:
        die("anchors requires one repo-relative file path")
    rel = args[0].replace("\\", "/")
    d = bcf_dir(root)
    detail = load_json(root, "candidates.json", {})
    cues = detail.get("cues", [])
    cls = detail.get("classification", {})
    family = cls.get("family", "boundary-edge-case")
    st = load_state(root)
    full = os.path.join(root, rel)
    if not os.path.exists(full):
        emit("ANCHORS %s\nFile absent. If this is a NEW file, create it with write_file. Otherwise re-localize: python3 .git/bcf/bcf.py locate WORDS" % sanitize(rel))
        return 2
    syms = _symbols_from_ast(read_text(full))
    res = gen_anchors(root, rel, syms, cues, family, st.get("strikes", []))
    out = ["ANCHORS %s (family: %s)" % (rel, family)]
    anchors = res.get("anchors", [])
    if not anchors:
        out.append("No cue-matching locus found. Use apply with a line range, or locate WORDS to re-localize.")
    # Build one line-group per anchor, then assemble under a byte budget so
    # emit() can NEVER truncate INSIDE a verbatim old_string window. A cut window
    # copied as old_string is a guaranteed edit_file failure and a retry-loop
    # trigger (the 756051/744272 copy-fidelity class). Whole trailing groups that
    # do not fit are dropped (advisory) or replaced by a short line-range recipe
    # (unique); the closing prose line always survives.
    groups = []
    for i, a in enumerate(anchors, 1):
        g = ["[%d] lines %d-%d status=%s strategy=%s" % (
            i, a["start_line"], a["end_line"], a["status"], a["strategy"])]
        if a["status"] == "unique":
            g.append("old_string (copy verbatim):")
            g.append(a["old_string"])
        elif a["status"] == "absent":
            g.append("Absent: likely already edited. Re-read the file range before editing.")
        else:
            g.append("No unique window <=%d lines. Use: python3 .git/bcf/bcf.py apply %s %d %d (heredoc replacement)." % (
                MAX_WINDOW, rel, a["start_line"], a["end_line"]))
        groups.append((i, a, g))
    struck = [s for s in st.get("strikes", []) if s.get("file") == rel]
    # Closing prose line: emit() rstrips the output tail, so a unique window that
    # ends in a blank line / trailing whitespace must never be the LAST line, or
    # its verbatim old_string would lose those characters on the copy path.
    tail = []
    if struck:
        tail.append("Struck loci excluded: " + ", ".join(str(s.get("line")) for s in struck))
    tail.append("End of anchors: re-run anchors before every edit; never reuse a stale window.")
    budget = ANCHOR_CHAR_CAP - (len(out[0]) + 1) - sum(len(l) + 1 for l in tail)
    used = 0
    for i, a, g in groups:
        size = sum(len(l) + 1 for l in g)
        if used + size <= budget:
            out.extend(g)
            used += size
        elif a["status"] == "unique":
            fb = "[%d] lines %d-%d status=unique (window too long to print verbatim; use apply %s %d %d heredoc)." % (
                i, a["start_line"], a["end_line"], rel, a["start_line"], a["end_line"])
            if used + len(fb) + 1 <= budget:
                out.append(fb)
                used += len(fb) + 1
        # absent/ambiguous advisory groups that do not fit are dropped whole
    out.extend(tail)
    text = "\n".join(out)
    # prose headers sanitized; code windows preserved verbatim
    emit(text, ANCHOR_CHAR_CAP)
    return 0


# ---------------------------------------------------------------------------
# apply subcommand
# ---------------------------------------------------------------------------

def _is_protected(rel):
    rel = rel.replace("\\", "/")
    base = os.path.basename(rel)
    parts = rel.split("/")
    if base in PROTECTED_NAMES:
        return True
    if base.startswith("test_") and base.endswith(".py"):
        return True
    if base.endswith("_test.py"):
        return True
    if base.endswith(".pth"):
        return True
    if set(parts[:-1]) & PROTECTED_DIRS:
        return True
    return False


def cmd_apply(root, args):
    if len(args) < 3:
        die("apply requires: apply FILE START END (replacement lines on stdin heredoc)")
    rel = args[0].replace("\\", "/")
    try:
        start = int(args[1]); end = int(args[2])
    except ValueError:
        die("apply START and END must be integers")
    if _is_protected(rel):
        emit("APPLY-REFUSED: %s is a protected test/runner-config path. Fix library code only." % sanitize(rel))
        return 1
    full = os.path.join(root, rel)
    real = os.path.realpath(full)
    if not real.startswith(os.path.realpath(root) + os.sep) and real != os.path.realpath(root):
        emit("APPLY-REFUSED: path outside repo.")
        return 1
    if not os.path.exists(full):
        emit("APPLY-REFUSED: %s does not exist. Use write_file for new files." % sanitize(rel))
        return 1
    if end - start + 1 > MAX_APPLY_LINES:
        emit("APPLY-REFUSED: range %d-%d exceeds %d lines (no whole-file overwrites). Split into smaller ranges." % (start, end, MAX_APPLY_LINES))
        return 1
    content = read_text(full)
    lines = content.split("\n")
    n = len(lines)
    if start < 1 or end < start or end > n:
        emit("APPLY-REFUSED: invalid range %d-%d for file with %d lines." % (start, end, n))
        return 1
    replacement = read_stdin_bounded()
    if replacement is None:
        emit("APPLY-REFUSED: stdin timeout — no replacement lines arrived. Re-issue apply with the replacement on a single-quoted heredoc (<<'BCF_EOF' ... BCF_EOF). File unchanged.")
        return 1
    if not replacement.strip():
        # Empty stdin (forgotten heredoc / closed pipe) must NEVER silently
        # delete the range — that is a destructive edit disguised as success.
        emit("APPLY-REFUSED: empty replacement on stdin. Re-issue apply with the replacement lines on a single-quoted heredoc. To DELETE lines deliberately, use edit_file with an empty new_string. File unchanged.")
        return 1
    rep_lines = replacement.split("\n")
    if rep_lines and rep_lines[-1] == "":
        rep_lines = rep_lines[:-1]
    new_lines = lines[:start - 1] + rep_lines + lines[end:]
    new_content = "\n".join(new_lines)
    # syntax gate (compile builtin: no bytecode pollution)
    if rel.endswith(".py"):
        try:
            compile(new_content, rel, "exec")
        except SyntaxError as e:
            emit("APPLY-FAIL: syntax error at line %s: %s. Rolled back; file unchanged. Fix the replacement and retry." % (
                e.lineno, sanitize(e.msg or "invalid syntax")))
            return 2
    # backup + atomic write
    d = ensure_bcf_dir(root)
    backup = os.path.join(d, "backup", rel.replace("/", "__"))
    atomic_write(backup, content)
    atomic_write(full, new_content)
    # record edit
    st = load_state(root)
    st.setdefault("edits", []).append({"file": rel, "start": start, "end": end, "ts": int(time.time())})
    st["phase"] = "editing"
    save_state(root, st)
    diff = "".join(difflib.unified_diff(
        content.splitlines(keepends=True), new_content.splitlines(keepends=True),
        fromfile="a/" + rel, tofile="b/" + rel, n=2))
    if len(diff) > APPLY_DIFF_CAP:
        diff = diff[:APPLY_DIFF_CAP - 14] + "\n...[truncated]"
    emit(diff + "\nOK lines %d-%d replaced" % (start, end))
    return 0


# ---------------------------------------------------------------------------
# locate subcommand
# ---------------------------------------------------------------------------

def cmd_locate(root, args):
    detail = load_json(root, "candidates.json", {})
    cues = list(detail.get("cues", []))
    symptom = list(detail.get("symptom", []))
    repo = detail.get("repo", "generic")
    words = " ".join(args).strip()
    if words:
        seen = {(c["term"].lower(), c["type"]) for c in cues}
        for w in re.findall(r"[A-Za-z_][A-Za-z0-9_.]{2,}", words):
            _add_cue(cues, seen, w, "ident", 1.6, "locate")
            if w.lower() not in symptom:
                symptom.append(w.lower())
    if not cues:
        emit("LOCATE: no cues. Provide symptom words: python3 .git/bcf/bcf.py locate WORDS")
        return 2
    include_docs = detail.get("include_docs",
                              detail.get("classification", {}).get("family") == "docs-content-error")
    files, index, partial, nfiles = build_index(root, cues, include_docs, time.monotonic() + 3.0)
    candidates, df = rank_candidates(files, cues, symptom, repo, nfiles)
    out = ["LOCATE (top hits; file:symbol:line)"]
    if not candidates:
        out.append("No matches. Broaden the words or grep the repo directly.")
    for c in candidates:
        if c["symbols"]:
            s = c["symbols"][0]
            out.append("%s:%s:%d  (score %.0f)" % (c["path"], s["name"], s["line"], c["score"]))
        else:
            out.append("%s  (score %.0f)" % (c["path"], c["score"]))
    emit("\n".join(out), 1500)
    return 0


# ---------------------------------------------------------------------------
# strike subcommand
# ---------------------------------------------------------------------------

def cmd_strike(root, args):
    if not args or ":" not in args[0]:
        die("strike requires FILE:LINE")
    rel, _, line = args[0].rpartition(":")
    try:
        line = int(line)
    except ValueError:
        die("strike LINE must be an integer")
    rel = rel.replace("\\", "/")
    st = load_state(root)
    strikes = st.setdefault("strikes", [])
    if not any(s.get("file") == rel and s.get("line") == line for s in strikes):
        strikes.append({"file": rel, "line": line, "ts": int(time.time())})
    save_state(root, st)
    emit("STRUCK %s:%d. Future anchors exclude it. Get a different anchor: python3 .git/bcf/bcf.py anchors %s — or switch to apply line-range. Never retry the identical failed edit." % (sanitize(rel), line, sanitize(rel)))
    return 0


# ---------------------------------------------------------------------------
# check subcommand
# ---------------------------------------------------------------------------

def _changed_paths(root):
    tracked = _git(["diff", "--name-only", "HEAD"], root)
    untracked = _git(["ls-files", "--others", "--exclude-standard"], root)
    tracked_list = [l.strip() for l in tracked.splitlines() if l.strip()] if tracked else []
    untracked_list = [l.strip() for l in untracked.splitlines() if l.strip()] if untracked else []
    return tracked_list + untracked_list, (tracked is not None), untracked_list


def cmd_check(root, args):
    st = load_state(root)
    changed, has_git, untracked = _changed_paths(root)
    if not has_git:
        changed = [e["file"] for e in st.get("edits", [])]
        untracked = []
    untracked_set = set(untracked)
    reasons = []
    warns = []
    fail = False
    # protected scan
    for p in changed:
        if _is_protected(p):
            fail = True
            if p in untracked_set:
                reasons.append("PROTECTED new file %s — scorer discards it. Remove: git clean -f -- %s" % (p, p))
            else:
                reasons.append("PROTECTED edit %s — scorer discards it. Revert: git checkout HEAD -- %s" % (p, p))
    # scratch scan (untracked scratch anywhere in the repo would enter the patch)
    for p in untracked:
        base = os.path.basename(p)
        if not _is_protected(p) and re.match(r"(?i)(repro|scratch|test_tmp|tmp_)", base):
            warns.append("Scratch %s — delete or move to /tmp before submit (it would enter the patch)." % p)
    # compile gate
    for p in changed:
        if p.endswith(".py"):
            full = os.path.join(root, p)
            if os.path.exists(full):
                try:
                    compile(read_text(full), p, "exec")
                except SyntaxError as e:
                    fail = True
                    reasons.append("SYNTAX %s:%s — %s" % (p, e.lineno, e.msg or "invalid syntax"))
                except Exception as e:
                    fail = True
                    reasons.append("COMPILE %s — %s" % (p, e))
    # diff nonempty — untracked NEW files count: submit_patch runs git add -N .
    # and captures them, so a new-file-only fix is a valid non-empty patch.
    diffstat = _git(["diff", "HEAD", "--stat"], root) if has_git else None
    if has_git:
        if not (diffstat and diffstat.strip()) and not untracked:
            fail = True
            reasons.append("Empty diff — nothing to submit. Apply the fix at the spec target first.")
    elif not changed:
        fail = True
        reasons.append("No recorded edits and git unavailable — nothing to submit.")
    verdict = "FAIL" if fail else "PASS"
    out = ["CHECK: " + verdict]
    for r in reasons[:5]:
        out.append("- " + sanitize(r))
    for w in warns[:3]:
        out.append("- WARN " + sanitize(w))
    if not has_git:
        out.append("- note: git unavailable; used recorded edits for the gate.")
    if has_git and not (diffstat and diffstat.strip()) and untracked:
        out.append("- note: patch is %d new untracked file(s); submit_patch includes them via git add -N." % len(untracked))
    if fail:
        out.append("Next: fix the reported issue, then re-run check.")
    elif warns:
        out.append("Next: clean scratch, review git diff, then submit_patch last.")
    else:
        out.append("Next: review git diff, then submit_patch last (verify patch_size > 0).")
    st["last_check"] = verdict
    save_state(root, st)
    emit("\n".join(out), CHECK_CHAR_CAP)
    return 0  # verdict is text, never a command error


# ---------------------------------------------------------------------------
# state subcommand
# ---------------------------------------------------------------------------

def cmd_state(root, args):
    d = bcf_dir(root)
    out = ["STATE (filesystem is the source of truth)"]
    spec_path = os.path.join(d, "spec.md")
    if os.path.exists(spec_path):
        spec = read_text(spec_path)
        # header + Target section summary
        keep = []
        in_target = False
        for line in spec.split("\n"):
            if line.startswith("# BCF spec") or line.startswith("kind:") or line.startswith("repo:") or line.startswith("SPARSE"):
                keep.append(line)
            elif line.startswith("## Target"):
                in_target = True
                keep.append(line)
            elif line.startswith("## ") and in_target:
                in_target = False
            elif in_target:
                keep.append(line)
        out += keep[:8]
    else:
        out.append("No spec yet. Run: python3 .git/bcf/bcf.py spec")
    diffstat = _git(["diff", "--stat"], root)
    untracked_raw = _git(["ls-files", "--others", "--exclude-standard"], root)
    untracked_list = [l.strip() for l in untracked_raw.splitlines() if l.strip()] if untracked_raw else []
    if diffstat and diffstat.strip():
        out.append("git diff --stat: " + diffstat.replace("\n", " | "))
    elif untracked_list:
        out.append("git diff --stat: (empty; %d NEW untracked file(s) present — submit_patch will include them)" % len(untracked_list))
    else:
        out.append("git diff --stat: (empty)")
    st = load_state(root)
    strikes = st.get("strikes", [])
    out.append("strikes: " + (", ".join("%s:%s" % (s.get('file'), s.get('line')) for s in strikes) if strikes else "none"))
    out.append("last check: " + str(st.get("last_check")))
    out.append("edits recorded: %d" % len(st.get("edits", [])))
    # deterministic next-action hint (untracked new files count as work present)
    has_diff = bool((diffstat and diffstat.strip()) or untracked_list)
    if not has_diff and not st.get("edits"):
        hint = "apply the fix at the spec target (anchors, then edit)."
    elif st.get("last_check") == "FAIL":
        hint = "fix the reported check issue, then re-run check."
    elif st.get("last_check") == "PASS":
        hint = "review git diff, then submit_patch last (verify patch_size > 0)."
    else:
        hint = "run the spec Verify command, then check, review git diff, submit_patch last."
    out.append("NEXT: " + hint)
    emit("\n".join(out), STATE_CHAR_CAP)
    return 0


# ---------------------------------------------------------------------------
# help + dispatch
# ---------------------------------------------------------------------------

HELP = """BCF helper v%s — scalar args only; statement/replacements via single-quoted heredoc stdin.
  spec                 compute/cache the fix spec (reads .git/bcf/problem.md or stdin)
  anchors PATH         fresh verified-unique edit windows for PATH (before every edit)
  apply PATH START END replace lines START-END (1-indexed) with stdin heredoc; auto-rollback
  locate WORDS         re-rank top file:symbol:line hits (empty WORDS = reuse spec cues)
  strike FILE:LINE     record a failed anchor; future anchors exclude it (2-strike breaker)
  check                pre-submit gate: protected paths, scratch, compile, diff-nonempty
  state                restart compass: spec summary + diff + strikes + next action
Optional on any command: --repo-root PATH (default: git toplevel / upward .git / /workspace / sandbox workspace / cwd).
Writes only under .git/bcf/. Exit 0 normal (incl check FAIL and partial spec); 2 degraded; 1 fatal.
""" % BCF_VERSION


def main(argv):
    args = list(argv)
    override = None
    if "--repo-root" in args:
        i = args.index("--repo-root")
        if i + 1 >= len(args):
            die("--repo-root requires a path")
        override = args[i + 1]
        del args[i:i + 2]
    if not args or args[0] in ("--help", "-h", "help"):
        emit(HELP, 1500)
        return 0
    cmd = args[0]
    rest = args[1:]
    root = find_repo_root(override)
    handlers = {
        "spec": cmd_spec, "anchors": cmd_anchors, "apply": cmd_apply,
        "locate": cmd_locate, "strike": cmd_strike, "check": cmd_check,
        "state": cmd_state,
    }
    if cmd not in handlers:
        die("unknown subcommand: " + cmd, "run --help for the subcommand list")
    try:
        return handlers[cmd](root, rest)
    except SystemExit:
        raise
    except Exception as e:
        die("%s: %s" % (type(e).__name__, e))


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))