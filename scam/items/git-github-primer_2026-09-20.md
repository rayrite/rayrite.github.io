# Git & GitHub Primer for a Solo Windows 11 Developer

**Written for:** you — a solo developer on Windows 11 using VS Code + Claude Code + GitHub Desktop, working out of `D:\stuff\ai-misc\_bsh2026\vscode_project01\73-product_staged_research`, with a new empty subfolder `github\` intended as a repository root.
**Verified against official documentation:** 2026-09-20 (git-scm.com, docs.github.com, cli.github.com, gitforwindows.org, GCM docs).
**Your tool versions that day:** Git 2.55.0.windows.3 · GitHub CLI 2.100.0 · GitHub Desktop 3.6.x.

---

## 0. The 60-second mental model

- **Git** is a local version-control program installed on your PC. It records snapshots ("commits") of a folder's contents. It works fully offline.
- **GitHub** is a website that hosts a copy of your Git repository ("the remote") so it's backed up, shareable, and browsable. GitHub did not make Git and Git does not require GitHub.
- **GitHub Desktop** is a GUI that runs ordinary Git commands for you. A repo made by the CLI, Desktop, or the web UI is the same thing — you can mix all three freely on the same folder.
- A **repository ("repo")** = a folder whose history is stored in a hidden `.git` subfolder inside it. Everything inside the folder can be versioned; nothing outside it is. `github\` becomes your repo root — its *contents* get versioned, its parent and sibling folders do not.

| Term | Plain meaning |
|---|---|
| commit | A saved snapshot of your staged files, with a message. Immutable once made (you add new commits to change things, you don't edit old ones) |
| staging area | The "shopping cart" of files/content queued up for the next commit |
| branch | A movable label pointing at a commit; a parallel line of work. Cheap to create |
| `main` | The conventional name of the default ("spine") branch on GitHub |
| `origin` | The default nickname for the remote repo URL (just a shorthand, nothing magic) |
| HEAD | What you currently have checked out (usually the tip of your current branch) |
| tag | A *fixed* label pinned to one commit forever — perfect for "baselines" |
| clone | Download a full copy of a remote repo to a new folder |
| push / pull (fetch) | Upload your new commits / download and integrate remote commits |

Sources: [Pro Git ch. 1–3](https://git-scm.com/book/en/v2), [docs.github.com](https://docs.github.com/en/get-started/using-github/github-flow).

---

## 1. Where your machine stands today (checked 2026-09-20)

I inspected your setup before writing this. You're further along than most beginners:

| Component | Status on your PC | Action needed |
|---|---|---|
| Git installed | ✅ 2.55.0.windows.3 (current family is 2.55.x) | none |
| Git identity (`user.name` / `user.email`) | ✅ configured globally | none |
| Line endings (`core.autocrlf=true`) | ✅ set system-wide — the official Windows recommendation | none |
| Credential helper (`credential.helper=manager`) | ✅ Git Credential Manager (GCM) active | none |
| GitHub CLI (`gh`) | ✅ 2.100.0 installed | **sign in** (§2.2) |
| Default branch name | ⚠️ your system config says `master`; GitHub's convention is `main` | **1 command** (§2.1) |
| `github\` folder | ✅ exists, empty — perfect blank slate | §3 or §4 |

> Why branch name matters: Git's own default is still `master` (it only changes in Git 3.0), but [GitHub defaults new repos to `main`](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-branches). Aligning them avoids a confusing mismatch.

---

## 2. One-time setup (≈5 minutes, do this once ever)

### 2.1 Make `git init` create `main` branches

```bash
git config --global init.defaultBranch main
```

From now on every new repo starts on `main`, matching GitHub. (Pro Git documents this exact setting: [First-Time Git Setup](https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup).)

### 2.2 Sign in the GitHub CLI

```bash
gh auth login
```

Answer the prompts: **GitHub.com** → **HTTPS** → **Yes** to "Authenticate Git with your GitHub credentials" → **Login with a web browser**. It shows a one-time code, opens your browser, you paste the code and authorize. This one login covers both `gh` commands *and* `git push` over HTTPS (it stores the token in Windows' secure credential store). Manual: [`gh auth login`](https://cli.github.com/manual/gh_auth_login).

### 2.3 How GitHub authentication works in 2026 (so nothing surprises you)

GitHub [removed password authentication for Git operations in August 2021](https://github.blog/2020-12-15-token-authentication-requirements-for-git-operations/). Today `git push` over HTTPS uses one of:

- **Browser sign-in via Git Credential Manager** — the default you already have. Your *first* push opens a browser window, you log into GitHub (with 2FA), GCM stores the token in Windows Credential Manager and reuses it silently forever after. ([GitHub Docs: caching credentials](https://docs.github.com/en/get-started/getting-started-with-git/caching-your-github-credentials-in-git))
- **`gh` CLI as credential helper** — what §2.2 set up.
- **Personal Access Tokens (PATs)** — manual tokens for scripts/CI. If you ever need one, prefer [fine-grained PATs](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens), which GitHub recommends and which can be scoped to single repos.
- **SSH keys** — an alternative channel some developers prefer; unnecessary for you right now. ([SSH guide](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent))

For a solo Windows workflow, HTTPS + GCM + `gh` is the simplest path. You're done with auth after §2.2.

---

## 3. Path A — Command line: turn `github\` into a published GitHub repo

Ten minutes, and you'll understand every gear. Run these in **Git Bash** (or PowerShell — the commands are identical). Note: GitHub's current docs teach exactly this sequence ([Adding locally hosted code to GitHub](https://docs.github.com/en/get-started/importing-your-projects-to-github/importing-source-code-to-github/adding-locally-hosted-code-to-github)).

### A1. Move into the folder

```bash
cd "D:\stuff\ai-misc\_bsh2026\vscode_project01\73-product_staged_research\github"
```

### A2. Initialize the repository

```bash
git init -b main
```

`git init` creates the hidden `.git` database; `-b main` names the first branch `main` (the `-b` flag needs Git 2.28+, which you far exceed). You'll see `Initialized empty Git repository in .../github/.git/`. Nothing is committed yet.

### A3. Create your starter files

Every repo deserves a README (what is this?) and a .gitignore (what should never be committed). In VS Code or from the shell:

**`README.md`**
```markdown
# product-staged-research

Staged research workspace: product investigations, scam-shield checks, and experiments.
```

**`.gitignore`** — a starter tuned to your kind of work (trim to taste):
```
# Secrets & environment
.env
*.key
.claude/settings.local.json

# Python
__pycache__/
.venv/
*.pyc

# Node
node_modules/

# OS / editor cruft
Thumbs.db
.DS_Store

# Scratch output you never want public
*.log
tmp/
```

Syntax notes from [Pro Git](https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository): lines are patterns, `/` at the start anchors to the repo root, trailing `/` means "directory", `!` re-includes, `#` comments. GitHub maintains ready-made templates at [github/gitignore](https://github.com/github/gitignore). **Rule of thumb: commit source and small data; ignore secrets, dependencies, and anything regenerable.**

### A4. Stage and inspect

```bash
git status          # shows untracked files in red
git add .           # stages everything in the folder
git status          # now shows files staged in green
```

The staging area is Git's "cart": `git add` puts content in the cart; `git commit` buys it as one snapshot. `git add` records the content *as it is at that moment* — if you edit a file after adding it, re-add before committing. ([Pro Git: Recording Changes](https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository))

### A5. Commit

```bash
git commit -m "Initial commit: README and .gitignore"
```

You'll see `2 files changed, ...`. `git log --oneline` shows your first commit. From now on, your folder has an undo-able history.

### A6. Create the GitHub repo and connect it — Option 1 (fastest, one command)

```bash
gh repo create product-staged-research --private --source=. --remote=origin --push
```

This creates the repo **on your GitHub account**, names it `product-staged-research` (it does *not* have to match the folder name — "github" would be a confusing repo name), connects it as `origin`, and pushes. Omit `--private` and use `--public` if you want it visible to the world; visibility can be flipped later in Settings. ([`gh repo create` manual](https://cli.github.com/manual/gh_repo_create))

### A6 alt. Option 2 (web UI, teaches the plumbing)

1. In your browser: **github.com → New repository**. Name it, choose Private/Public. **Do not** tick "Add a README", ".gitignore", or "license" — GitHub's docs warn this causes merge conflicts when you're importing an existing folder ([source](https://docs.github.com/en/get-started/importing-your-projects-to-github/importing-source-code-to-github/adding-locally-hosted-code-to-github)).
2. Back in the shell:

```bash
git remote add origin https://github.com/YOUR-NAME/product-staged-research.git
git remote -v                  # sanity-check the URL
git push -u origin main
```

`git remote add` saves the URL under the nickname `origin`. `git push -u origin main` uploads `main` and (`-u` = `--set-upstream`) remembers the link, so future pushes are just `git push`. On this first push, GCM may pop a browser login (§2.3) — after that it's silent.

### A7. Verify

Open `https://github.com/YOUR-NAME/product-staged-research` — your files are there. That's publishing: local commits, uploaded.

> **Later — clone on another machine (or after a disk loss):** `gh repo clone YOUR-NAME/product-staged-research` (or `git clone <url>`) downloads the full history into a fresh folder. Push from one machine, `git pull` on the other, and they stay in sync.

---

## 4. Path B — GitHub Desktop: the same result, all GUI

GitHub Desktop's official docs live at [docs.github.com/en/desktop](https://docs.github.com/en/desktop). It's fully interchangeable with Path A — same `.git`, same result.

### B1. Install & sign in (once)

Install from [desktop.github.com](https://desktop.github.com) (Windows 10 64-bit+). Then **File → Options → Accounts → Sign Into GitHub.com → Continue With Browser** — your browser opens, you log in (2FA included) and return to the app. ([docs](https://docs.github.com/en/desktop/installing-and-authenticating-to-github-desktop/authenticating-to-github-in-github-desktop))

### B2. Create the repository on your existing folder

1. **File → New repository…** (Ctrl+N).
2. Fill in: **Name** (`github` is pre-filled from the folder — rename to something meaningful, this is only the local label), **Description** (optional), **Local path** → click **Choose…** and select `D:\stuff\ai-misc\_bsh2026\vscode_project01\73-product_staged_research\github`. Keep **Initialize this repository with a README** ticked; pick a **Git ignore** template (Node or Python) if you like; License optional.
3. **Create repository**. The folder now has a `.git` and a first commit.
   *(Alternative route: **File → Add local repository** on a folder that isn't a repo yet — Desktop offers to initialize it there. That prompt isn't in the current official docs, so the New repository route above is the documented one.)* ([creating your first repo](https://docs.github.com/en/desktop/overview/creating-your-first-repository-using-github-desktop), [adding a repository](https://docs.github.com/en/desktop/adding-and-cloning-repositories/adding-a-repository-from-your-local-computer-to-github-desktop))

### B3. Publish to GitHub

Click the **Publish repository** button in the top bar. In the dialog: the name/description pre-fill; **tick "Keep this code private" for a private repo** (unticked = public); Organization = **None** (your personal account). **Publish**. The repo now exists at `github.com/YOUR-NAME/<name>`. ([docs](https://docs.github.com/en/desktop/overview/creating-your-first-repository-using-github-desktop))

### B4. Your daily controls in Desktop

| UI element | What it does | Git equivalent |
|---|---|---|
| **Changes** tab (left) | Shows modified (yellow), new (green), deleted (red) files; checkbox per file = staging; top checkbox = stage all | `git status` + `git add` |
| **Summary** + **Description** boxes, **Commit to main** button | Write the commit message (Summary = title line) and commit | `git commit -m` |
| **History** tab (left) | Browse every commit, click one to see its diff | `git log`, `git show` |
| **Fetch origin / Pull origin / Push origin** (top bar) | Sync with GitHub — fetch checks, pull downloads, push uploads | `git fetch` / `git pull` / `git push` |
| **Current branch** selector (top bar) | Switch or create branches (§6) | `git switch` |

([committing and reviewing changes](https://docs.github.com/en/desktop/making-changes-in-a-branch/committing-and-reviewing-changes-to-your-project-in-github-desktop), [viewing history](https://docs.github.com/en/desktop/making-changes-in-a-branch/viewing-the-branch-history-in-github-desktop), [syncing](https://docs.github.com/en/desktop/working-with-your-remote-repository-on-github-or-github-enterprise/syncing-your-branch-in-github-desktop))

### B5. Make VS Code the external editor (once)

**File → Options → Integrations → External Editor → Visual Studio Code**. Then **Repository → Open in default editor** (Ctrl+Shift+A) opens the folder in VS Code, ready for Claude Code. ([docs](https://docs.github.com/en/desktop/configuring-and-customizing-github-desktop/configuring-a-default-editor-in-github-desktop))

---

## 5. The daily loop: code → test → debug → publish

This is the heartbeat of development. The git part is only the "save & publish" beats — but doing them at the *right moments* is what makes the loop safe.

```
        ┌──────────────────────────────────────────────────┐
        │                                                  │
        ▼                                                  │
   1. CODE ──► 2. TEST ──► 3. DEBUG ──► 4. COMMIT ──► 5. PUSH ──┐
   edit files    run it      fix what     snapshot      upload    │
                 / tests     broke                       to GitHub │
        ▲              │                                                     │
        └── iterate ───┴──── (repeat 1-3 several times per commit) ─────────┘
```

### A concrete walkthrough (with Claude Code in the loop)

Say the repo now holds a small Python idea, `check.py`, plus `test_check.py`.

**0 · Start of session — sync down, so you build on the latest:**
```bash
git pull                      # download anything pushed from elsewhere
git switch main               # make sure you're on the spine (or a branch — §6)
```

**1 · Code** — write/edit in VS Code. With Claude Code running in the repo, you might say: *"Add a function `is_recall_active(date)` to check.py with a failing test first."* Claude edits the files; you review the diff in VS Code's Source Control panel (or Desktop's Changes tab — same information).

**2 · Test** — run whatever verifies the idea:
```bash
python -m pytest              # or: python check.py, npm test, etc.
```
(Equally: ask Claude Code to run the tests and report — it can execute them and fix failures on request. The `superpowers:test-driven-development` skill you have installed is exactly this discipline.)

**3 · Debug** — tests fail → find why → fix → rerun. `superpowers:systematic-debugging` is your installed skill for doing this methodically. Git's role here: **don't commit broken work**, but *do* feel free to commit a "WIP" checkpoint on a branch if an experiment will take a while — that's what branches are for.

**4 · Commit** — when a coherent unit works:
```bash
git status                    # confirm WHAT is about to be saved (always glance)
git add check.py test_check.py   # or `git add .` if everything belongs
git commit -m "Add is_recall_active() with tests"
```
Commit messages: present-tense summary ≤50 chars, and ideally each commit is one isolated, complete change — [GitHub's own guidance for flow](https://docs.github.com/en/get-started/using-github/github-flow) says exactly this.

**5 · Push (publish)** — at least at the end of a session:
```bash
git push
```
Now it's on GitHub: backed up, timestamped, and visible. (GitHub Desktop users: steps 4–5 are the Summary box + **Commit to main**, then **Push origin**.)

**6 · Occasionally, milestone:** tag a baseline (§6.5) and/or draft a GitHub Release (§6.5).

### Cadence rules of thumb

- **Commit small, commit often** — many small commits are recoverable and reviewable; one giant "stuff" commit is neither. Aim for "each commit passes its tests."
- **Push at least daily / per session** — your laptop is not a backup strategy; GitHub is.
- **Pull before you start** — cheap habit that prevents "rejected push" surprises (§8).
- **Update the README when reality changes** — future-you is the primary reader.

---

## 6. Working several ideas at once: baselines, branching, merging

Your situation — brainstorming multiple ideas, wanting safe checkpoints — is *the* textbook case for branches. This section gives you three escalating workflows plus baselines and merge know-how.

### 6.1 The mental model

- `main` is your **spine**: the version that "works." You protect it by doing experiments elsewhere.
- A **branch** is a parallel timeline that shares all history up to the point it was created. Creating one costs nothing (it's just a movable pointer). Nothing on `main` changes while you work on a branch.
- A **baseline** is a *frozen* named point — a **tag**. Branches move as you commit; tags never do. "v0.2 — the version before I rewrote the parser" is a tag.

### 6.2 Workflow 1 — a branch per idea (your default; this is "GitHub flow")

This is [GitHub's officially recommended lightweight workflow](https://docs.github.com/en/get-started/using-github/github-flow), and it fits solo parallel work perfectly: each idea lives on its own branch, so "a delay in one set of changes doesn't delay your other changes" (their words).

**Start an idea:**
```bash
git switch main
git pull                                  # branch from the latest stable
git switch -c idea/dark-patterns-scan     # create + switch in one move
```
Branch naming that scales: `idea/…`, `fix/…`, `exp/…`. (`git switch` is the modern command, Git ≥2.23; older tutorials say `git checkout -b` — same thing. [Pro Git](https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell))

**Work on it:** the ordinary code→test→commit loop from §5, now on the branch. Push it to GitHub with `git push -u origin idea/dark-patterns-scan` the first time (afterwards plain `git push`).

**Check where things stand:**
```bash
git switch main      ; git log --oneline -3     # the spine
git switch idea/dark-patterns-scan ; git log --oneline --graph -5
git branch -v                                  # all local branches, one line each
```

**Decide the idea's fate:**

*Merge it in (keep it):*
```bash
git switch main
git pull
git merge --no-ff idea/dark-patterns-scan    # --no-ff leaves a visible merge commit
git push
git branch -d idea/dark-patterns-scan        # tidy up: delete the finished branch
git push origin --delete idea/dark-patterns-scan   # and its remote copy, if pushed
```
Prefer main's history to show **one commit per idea** instead of every WIP step? Use `git merge --squash idea/dark-patterns-scan` then commit once — same effect as GitHub's "Squash and merge" button. Squash trade-off per [GitHub's merge-methods doc](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/about-merge-methods-on-github): a streamlined history, at the cost of the individual commits' original SHAs/timestamps.

*Discard it (the idea didn't survive contact with reality):*
```bash
git switch main
git branch -D idea/dead-end            # -D (capital) force-deletes unmerged branches
```
If it was pushed: `git push origin --delete idea/dead-end`. The commits vanish from branch lists; for ~90 days they even remain recoverable via `git reflog` (§6.8) — discarding a branch is not scary.

*Park it (not dead, not done):* just leave it. `git branch -v` is your idea inventory.

**Solo pull requests (optional):** GitHub flow formally includes opening a pull request on github.com to review and merge. Solo, you can merge locally as above — but a PR gives you a diff view, comment thread, and a record of *why* an idea was merged. GitHub Desktop even shows a "Preview Pull Request" flow. Use them when you want the paper trail; skip them when you don't.

### 6.3 Workflow 2 — stash: shelving a mess for ten minutes

You're mid-edit on a messy uncommitted state and need to check something on `main` *right now*:

```bash
git stash push -m "wip: halfway through scraper rewrite"   # shelve everything
git switch main ; # ...do the thing... ;
git switch idea/dark-patterns-scan
git stash pop        # un-shelve: reapply and remove from the stash list
```

`git stash list` shows the stack, `stash apply` reapplies but *keeps* the entry (safer than `pop` if conflicts are possible). If a stash grows into real work, `git stash branch new-idea` turns it into a proper branch. ([Pro Git: Stashing](https://git-scm.com/book/en/v2/Git-Tools-Stashing-and-Cleaning))

**In GitHub Desktop:** right-click the changed-files header → **Stash All Changes**; stashes appear under "Stashed Changes" in the Changes tab with Restore/Discard. Note Desktop supports **one** stash at a time — the CLI has a stack. ([docs](https://docs.github.com/en/desktop/making-changes-in-a-branch/stashing-changes-in-github-desktop))

Rule of thumb: **interruption of minutes → stash; idea of hours/days → branch.**

### 6.4 Workflow 3 — worktrees: several ideas open *simultaneously*

Branches and stashes still give you one working folder at a time — switching branches swaps the files under you. A **worktree** attaches multiple working folders to one repository, each with a different branch checked out. Two VS Code windows, two ideas, zero interference, one shared history:

```bash
# from inside the repo (the main folder stays on main)
git worktree add ../psr-dark-patterns idea/dark-patterns-scan
git worktree add -b exp/new-parser ../psr-new-parser    # new branch in a new folder
```

Now `...\73-product_staged_research\github` has `main` checked out while sibling folders `psr-dark-patterns\` and `psr-new-parser\` hold the other branches. Each is a fully ordinary folder — open each in its own VS Code window, and you can run a Claude Code session per idea.

The mechanics and the rules ([git-worktree reference](https://git-scm.com/docs/git-worktree)):

- **One branch can be checked out in only one worktree at a time** (that's the safety rule that prevents two folders fighting over one branch).
- The extra folders' `.git` is a tiny *file* pointing back at the shared database — you didn't duplicate the repo.
- Cleanup when an idea concludes: `git worktree remove ../psr-new-parser` (add `--force` if it has uncommitted junk; add `git worktree prune` if you deleted a folder by hand).
- Honest caveat, from Git's own docs: multiple checkouts are labeled "still experimental" in corner cases involving submodules — irrelevant for normal projects, worth knowing it's not the mainstream path.

**In GitHub Desktop 3.6.0+** there is built-in worktree support (the worktree list appears in the app), so the GUI can see these folders too. And note: Claude Code itself can create isolated worktrees for risky experiments (you have the `superpowers:using-git-worktrees` skill for exactly this pattern).

### 6.5 Baselines with tags (and GitHub Releases)

Tags pin a permanent name to a commit — your "baselines." Git has two kinds; use **annotated** tags (stored as real objects with message/date; [generally recommended](https://git-scm.com/book/en/v2/Git-Basics-Tagging)):

```bash
git switch main
git tag -a baseline-2026-09-20 -m "Stable: recall-check + scamshield v2 working"
git tag -a v0.3 -m "Version 0.3 — first full pipeline"     # semantic style
git tag                              # list (alphabetical)
git push origin v0.3                 # tags are NOT pushed by default — push explicitly
git push origin --tags               # ...or push all at once
```

**Return to a baseline — safely.** Checking out a tag directly gives you a "detached HEAD" warning (any new commits would belong to no branch). The right move is to branch *from* the tag:

```bash
git switch -c exp/rewrite-from-v0.3 v0.3     # new experiment timeline starting at the baseline
```

**Compare since a baseline:** `git diff v0.3` (working folder vs baseline), `git log --oneline v0.3..main` (what the spine gained since).

**GitHub Releases** are the public face of tags: on github.com → your repo → **Releases → Draft a new release → Choose a tag** (existing, or type a new version to create it there) → title + notes → **Publish release**. A release packages the tag with human-readable notes and optional file attachments. ([about releases](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases), [managing releases](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository))

A sane solo cadence: **commit daily, push per session, tag when you'd hate to lose the current state** ("v0.1", "baseline-before-big-rewrite").

### 6.6 Merging, and merge vs rebase — the 2-minute version

When you merge a branch into `main`, Git integrates both timelines. Three flavors:

| Method | Command / GitHub button | History looks like | Use when |
|---|---|---|---|
| Merge commit | `git merge --no-ff idea/x` / "Create a merge commit" | A fork and a re-joining knot; every WIP commit preserved | You value the full story of the idea |
| Squash | `git merge --squash idea/x` + commit / "Squash and merge" | One tidy commit on `main` | You value a clean spine (my default suggestion for solo work) |
| Fast-forward | `git merge idea/x` (when `main` hasn't moved) | Straight line, no knot | Fine for tiny fixes; `--no-ff` otherwise |

**Rebase** is a different tool: it *replays your branch's commits* as if they'd been made on top of the current `main` — producing a straighter history (`git rebase main` while on your branch; see [Pro Git: Rebasing](https://git-scm.com/book/en/v2/Git-Branching-Rebasing)). Its one iron rule, from the book itself: **"Do not rebase commits that exist outside your repository"** — never rewrite commits you've already pushed somewhere others (or automated processes) may have seen. The book's reassurance for solo devs: *"If you only ever rebase commits that have never left your own computer, you'll be just fine."* Practical solo pattern: before merging, `git switch idea/x && git rebase main` to replay your idea on the latest stable, resolve anything, then merge fast-forward. Optional polish — merging plainly is perfectly fine too.

### 6.7 When two ideas touch the same lines: merge conflicts

A conflict just means Git refuses to guess: both branches changed the same lines of the same file. It marks the file:

```
<<<<<<< HEAD
the version on your current branch (e.g. main)
=======
the version coming in from the other branch
>>>>>>> idea/dark-patterns-scan
```

Resolution is human judgment: edit the file to what *should* be true (keep one side, or blend), then:

```bash
git add the-file.md      # marks it resolved
git commit               # concludes the merge
# cold feet mid-merge?  git merge --abort   restores the pre-merge state
```

([Pro Git: Basic Branching and Merging](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging)) In **VS Code**, clicking a conflicted file in Source Control opens side-by-side Accept-Current / Accept-Incoming buttons — usually the easiest path. In **GitHub Desktop**, the merge dialog flags conflicts and walks you through resolving them (Desktop 3.6+ can even assist with Copilot). Conflicts are rare when each idea touches different files — one more reason for small, focused branches.

### 6.8 The undo kit (because everyone needs it)

| Oops | Command | Notes |
|---|---|---|
| Staged a file by mistake | `git restore --staged <file>` | Just un-carts it; file untouched |
| Ruined a file, want last commit's version | `git restore <file>` | ⚠️ discards uncommitted edits |
| Wrong commit message | `git commit --amend -m "better"` | Fine if not yet pushed |
| Committed, want it gone (keep edits) | `git reset --soft HEAD~1` | Un-commits, keeps changes staged |
| Committed, want it all gone | `git reset --hard HEAD~1` | ⚠️ destroys the changes — one of the few Git commands that really deletes work |
| Bad commit *already pushed* | `git revert <sha>` | Makes a new "anti-commit" — the safe public undo; never rewrite pushed history |
| "I deleted a branch with unmerged gold!" | `git reflog` → find the sha → `git branch rescued <sha>` | reflog records every HEAD move (~90 days); this is why commits are hard to truly lose |

([Pro Git: Reset Demystified](https://git-scm.com/book/en/v2/Git-Tools-Reset-Demystified), [Data Recovery](https://git-scm.com/book/en/v2/Git-Internals-Maintenance-and-Data-Recovery)). **In Desktop:** right-click any commit in History → **Revert Changes in Commit** ([docs](https://docs.github.com/en/desktop/managing-commits/reverting-a-commit-in-github-desktop)).

---

## 7. Cheat sheets

### 7.1 CLI quick reference

| Command | What it does |
|---|---|
| `git status` / `git log --oneline --graph` | Where am I / what happened |
| `git add .` → `git commit -m "msg"` | Snapshot |
| `git push` / `git pull` | Publish / sync |
| `git switch <branch>` / `git switch -c <new>` | Move / create+move |
| `git branch -v` | Branch inventory |
| `git merge --no-ff <branch>` / `--squash` | Fold an idea into the current branch |
| `git stash push -m` / `pop` / `list` | Shelve / unshelve |
| `git worktree add ../folder <branch>` | Parallel working folder |
| `git tag -a v0.3 -m "…"` / `git push origin v0.3` | Baseline / publish it |
| `git restore <file>` / `git restore --staged <file>` | Discard edits / unstage |
| `git revert <sha>` / `git reflog` | Safe undo / rescue parachute |

### 7.2 GitHub Desktop quick reference

| Goal | Clicks |
|---|---|
| Commit | Changes tab → tick files → Summary → **Commit to <branch>** |
| Push / Pull | **Push origin** / **Pull origin** (top bar) |
| See history | History tab |
| New branch / switch | Current-branch dropdown → **New Branch…** (choose "based on") |
| Merge a branch | Current-branch dropdown → **Choose a branch to merge into <current>** |
| Stash | Right-click changed-files header → **Stash All Changes** |
| Revert a commit | History → right-click commit → **Revert Changes in Commit** |
| Open in VS Code | **Repository → Open in default editor** (Ctrl+Shift+A) |

### 7.3 Which tool when

- **VS Code + Claude Code** — writing, testing, debugging; VS Code's Source Control view for quick staging/diffs.
- **GitHub Desktop** — the friendliest view of history and branches; merge-conflict walkthroughs; days you'd rather not type.
- **CLI (`git`/`gh`)** — anything scripted or repeated; worktrees; the moments you want to know exactly what's happening.
- **github.com** — repo settings, Releases, pull-request paper trails, browsing from other devices.

---

## 8. Troubleshooting quick fixes

| Symptom | Meaning → fix |
|---|---|
| `rejected ... fetch first` on push | GitHub has commits you don't → `git pull` (resolve if asked), then `git push` |
| `LF will be replaced by CRLF` warnings | Informational, not an error — your `autocrlf=true` is doing its job; ignore |
| Committed a file that should be ignored | `.gitignore` only blocks *untracked* files → `git rm --cached <file>`, commit; it stays on disk |
| `fatal: not a git repository` | You're in the wrong folder — run commands from inside `github\` (where `.git` lives), or re-`cd` |
| Detached HEAD after checking out a tag | Expected warning → branch off it: `git switch -c exp/name <tag>` |
| Merge conflict panic | `git merge --abort` returns you to the pre-merge state; nothing is lost |
| Accidentally ran `git init` in the *parent* folder | Delete the stray `parent\.git` folder (and nothing else) to un-repo it; otherwise your real repo appears to the parent as one opaque entry |
| `gh` says "not logged in" | `gh auth login` (§2.2) |

---

## 9. Sources & further reading (official, verified 2026-09-20)

- Pro Git, 2nd edition (the canonical book, free): [git-scm.com/book/en/v2](https://git-scm.com/book/en/v2) — esp. ch. 2 (Basics), ch. 3 (Branching), ch. 7 (Tools: stash, reset, reflog)
- Git command reference: [git-scm.com/docs](https://git-scm.com/docs) — [git-init](https://git-scm.com/docs/git-init), [git-switch](https://git-scm.com/docs/git-switch), [git-merge](https://git-scm.com/docs/git-merge), [git-worktree](https://git-scm.com/docs/git-worktree), [git-push](https://git-scm.com/docs/git-push)
- Importing a local folder to GitHub: [docs.github.com — adding locally hosted code](https://docs.github.com/en/get-started/importing-your-projects-to-github/importing-source-code-to-github/adding-locally-hosted-code-to-github)
- GitHub flow (official workflow): [docs.github.com — GitHub flow](https://docs.github.com/en/get-started/using-github/github-flow)
- Merge methods on GitHub: [docs.github.com — About merge methods](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/about-merge-methods-on-github)
- Releases & tags: [About releases](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases) · [Managing releases](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository)
- GitHub Desktop docs hub: [docs.github.com/en/desktop](https://docs.github.com/en/desktop) (note: a `docs.desktop.github.com` address will not resolve — the docs moved under docs.github.com)
- GitHub CLI: [`gh auth login`](https://cli.github.com/manual/gh_auth_login) · [`gh repo create`](https://cli.github.com/manual/gh_repo_create)
- Credential caching / GCM: [docs.github.com — caching credentials](https://docs.github.com/en/get-started/getting-started-with-git/caching-your-github-credentials-in-git) · [GCM install docs](https://github.com/git-ecosystem/git-credential-manager/blob/main/docs/install.md) (the project now lives under `git-ecosystem/`, the old `git-credential-manager/` org URL is dead)
- Token authentication background: [GitHub Blog, 2020-12-15](https://github.blog/2020-12-15-token-authentication-requirements-for-git-operations/) · [Managing PATs](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens)
- Gitignore templates: [github/gitignore](https://github.com/github/gitignore)
- Workflow comparisons: [GitFlow (Driessen, 2010; note his 2020 addendum recommending simpler flows)](https://nvie.com/posts/a-successful-git-branching-model/) · [Atlassian: Gitflow is legacy](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) · [trunkbaseddevelopment.com](https://trunkbaseddevelopment.com/)

*One doc-vs-product nuance found during research: GitHub's docs teach `git init -b main` for new repos, while the quick-setup snippet shown on an empty repo page in the product uses `git branch -M main` (rename-after-init). Both land you on `main`; the docs version is the citable one.*
