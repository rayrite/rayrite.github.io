# Lesson 1 · Server foundations — first login, SSH key, cPanel recon

> **Visual aids:** `visual-aids/va08_deployment_topology.html` (the topology we'll progressively assemble).
> **Time budget:** ~2 hrs · **MVP gate contribution:** a hardened SSH login + a basic cPanel subdomain on HTTP, ready for HTTPS in Lesson 9.

---

## What we're doing

You're standing in front of a brand-new LiquidWeb managed VPS running **AlmaLinux 9** with **cPanel/WHM** in the box. Before a single line of application code touches it, we want three things:

1. We can **log in as a non-root user** with an SSH key (and root reachable only via that user).
2. We **know exactly what's running**: Apache version, cPanel tier, CSF firewall state, free RAM.
3. We have a **cPanel subdomain** we own, sitting on HTTP — and AutoSSL hasn't been pointed at it yet (we'll do that in Lesson 9 after the proxy config is in place).

This is the **boring** part of DevSecOps — and the part that saves you the most time later. Done well, every later lesson touches this foundation only when it has to.

---

## Step 1.1 — Open Windows Terminal (or `cmd` → `powershell`), generate an ed25519 keypair

> *Why ed25519, not RSA?* ed25519 keys are short (~96 chars), fast, considered more secure per bit, and supported by every modern OpenSSH — including the one shipping in cPanel EL9. You'll be typing this public key in via the cPanel UI, so shorter is better.

PowerShell on Windows 11 has the modern OpenSSH client built in. From a *regular* PowerShell window (not admin):

```powershell
ssh-keygen -t ed25519 -f $env:USERPROFILE\.ssh\shamshield_deploy -C "your-real-email@example.com"
# passphrase: STRONGLY recommend one.  Memorize it.  Store it in your password manager.
# You can also accept the default location, but per-key naming makes the GH Actions key
# we'll generate later (L10) easy to keep distinct.
```

Verify the keys exist:

```powershell
dir $env:USERPROFILE\.ssh\
# → id_ed25519 / id_ed25519.pub (or your custom name + .pub)
```

Copy the *public* key. We need the full one-line value:

```powershell
Get-Content $env:USERPROFILE\.ssh\shamshield_deploy.pub
# → ssh-ed25519 AAAA…  shamshield_deploy
```

That's the only key we'll register with the VPS in this lesson. The *private* half never leaves your laptop.

---

## Step 1.2 — Provision the server (LiquidWeb control panel)

> *I can't click buttons for you, but here's the recipe.*

In the LiquidWeb control panel (or the welcome email), you'll receive a *root password* over either plaintext (horrible) or a one-time secret URL (better). Either way:

1. **Save the root password** in your password manager. We'll use it once to bootstrap a non-root user, then never again.
2. Note the **server's public IP** and **hostname** (e.g. `123.45.67.89` and `lvps123-45-67-89.dedicated.hosteurope.de` or similar).
3. Confirm your **cPanel license tier** (Admin 5 in your spec) — it caps how many cPanel accounts you can host; you only need one.
4. If the welcome email offers a `recovery` URL or an SSH key *pair* — that's the only time their UI will be more convenient than yours. Skip it; we'll use the password exactly once.

> ⚠️ **Stop and read me**: every step from here assumes you have a LiquidWeb-managed VPS. *If you don't have one yet, stop and buy one before continuing.* Everything else cascades from the assumption that you can SSH to a real AlmaLinux box.

---

## Step 1.3 — First SSH login as root

Open a Windows Terminal (PowerShell) tab:

```powershell
ssh root@<VPS_IP>
# paste the welcome password when prompted
```

You should land at a prompt like:

```
[root@lvps123 ~]#
```

### A — recon (the *only* root command run of the whole project)

Run these one at a time, read the output, copy the output somewhere safe. We will reference it for every later lesson.

```bash
cat /etc/os-release            # → NAME="AlmaLinux" VERSION="9.x (Emerald Puma)"
free -m                        # → confirm 2 GB RAM (or whatever you actually bought)
nproc                          # → confirm 2 vCPU
df -h / /tmp                   # → 50 GB / should be plenty
apachectl -v                   # → Apache/2.4.x — remember the EXACT minor
csf -v   2>/dev/null || echo "csf not present (uncommon on LW; we'll handle below)"
sestatus                       # → SELinux probably enforcing on managed LW
# node / npm — almost certainly missing on a fresh LW box
which node ; node --version
which npm ; npm --version
# nvm (we'll install)
ls /opt
# cPanel
/usr/local/cpanel/cpanel -V    # cPanel version
```

**Paste every output into a scratch note** (e.g. `notes/L1-recon.txt`). This is the discipline that makes the rest of the lessons fast. When we get to "Apache config looks different," the answer is in *that file*, not "let me re-check the server."

### B — create the deployment user (the one you'll SSH as forever)

```bash
# Linux convention: lowercase, no dashes
useradd -m -s /bin/bash scamshield
passwd scamshield              # paste a long random from your password manager
usermod -aG wheel scamshield   # sudo via password (we'll tighten in Step 1.5)

# Confirm
id scamshield
# uid=1001(scamshield) gid=1001(scamshield) groups=1001(scamshield),10(wheel)
```

### C — install your SSH public key for the new user

From your *laptop*:

```powershell
# print the public key once more
Get-Content $env:USERPROFILE\.ssh\shamshield_deploy.pub
```

On the *server*, as root:

```bash
# become the new user for everything below; this is the cleanest way to populate
# ~/.ssh/ with the right ownership.
su - scamshield
mkdir -p ~/.ssh
chmod 700 ~/.ssh
# paste the public key line (the entire `ssh-ed25519 AAAA…` value)
nano ~/.ssh/authorized_keys      # paste, Ctrl-O Enter, Ctrl-X
chmod 600 ~/.ssh/authorized_keys
exit                            # back to root
```

> *Don't have nano?* Try `vi ~/.ssh/authorized_keys` (`:i` to insert, `Esc :wq` to save). One-time pain.

**Test from your laptop**:

```powershell
# open a NEW PowerShell — leave the existing root session as a safety net
ssh -i $env:USERPROFILE\.ssh\shamshield_deploy scamshield@<VPS_IP>
```

If you're prompted for the **key passphrase** (not a password), it worked. If asked for a *password*, the key didn't load; check:

```bash
# on server, as scamshield
ls -la ~/.ssh/                  # authorized_keys must be 600; .ssh must be 700
cat ~/.ssh/authorized_keys      # your actual public key text must be there
```

> *Why open a fresh terminal?* The cached root session is your safety net for the next 30 minutes. If you lock yourself out, you can still `ssh root@<VPS_IP>` from the original tab and fix the new user.

### D — disable password SSH login (the moment you have key access working)

Still as root, in the open terminal:

```bash
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak.$(date +%Y%m%d)
sed -i 's/^#\?PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
sed -i 's/^#\?PermitRootLogin.*/PermitRootLogin prohibit-password/' /etc/ssh/sshd_config
grep -E '^(PasswordAuthentication|PermitRootLogin)' /etc/ssh/sshd_config
# → PasswordAuthentication no
# → PermitRootLogin prohibit-password

# verify config is valid (typos here = lockout)
sshd -t
# → silent exit = OK

# apply
systemctl reload sshd
```

**Open a THIRD terminal** and test:

```powershell
ssh -i $env:USERPROFILE\.ssh\shamshield_deploy scamshield@<VPS_IP>
whoami      # → scamshield
exit
ssh root@<VPS_IP>     # → this should now refuse the password (good — keys-only for root)
```

The original password-accepting root session can be closed. You've earned it.

---

## Step 1.4 — cPanel recon (same server, browser)

Open `https://<VPS_IP>:2087` (WHM) and `https://<VPS_IP>:2083` (cPanel) in your browser. Your LiquidWeb welcome email has the initial `root`/`whmroot` password — or you may need to set one on first connect.

> *Self-signed cert warning* is normal and will go away once we attach a domain in Step 1.5.

In **WHM → Server Information**, confirm:
- OS: AlmaLinux 9
- cPanel version: 11.x.y
- Apache version: 2.4.x (match what `apachectl -v` returned)
- License: Admin

In **WHM → List Accounts**, you should see at least one account — most often named after your cPanel license's primary domain. We'll add a subdomain under it.

> ⚠️ **If you see a previously-owned LiquidWeb WHM with other accounts**, do *not* delete them. We are tenants on this box; we touch only what we add.

---

## Step 1.5 — Add the cPanel subdomain we'll deploy to

In **WHM → DNS Functions → Add a DNS Zone** (or, more typically, in cPanel for the account you control):

1. Pick a short subdomain name that doesn't collide with anything else on the box. `concierge.<your-root-domain>` works.
2. Set it to **point at the VPS IP** as an A record.
3. In **cPanel → Domains → Subdomains**, add `app` (or whatever you'd like — `concierge.app` is a good default).

Verify:

```bash
# from your laptop
Resolve-DnsName concierge.<your-root-domain>
# → should return your VPS IP
nslookup concierge.<your-root-domain> <VPS_IP>
```

**Wait — I know you want AutoSSL right now. Don't.**
AutoSSL registers itself via an HTTP-01 challenge against `/.well-known/acme-challenge/`, and once we add the reverse-proxy include for the app, that path *becomes proxied* — which breaks DCV. We add AutoSSL in Lesson 9, *after* the Apache config is in the right shape to exclude `/.well-known/*`.

---

## Step 1.6 — Sudo without password (for the deploy user)

> *Read this carefully.* Disabling the password is fine for a deploy user on a single-tenant box where only you SSH in. In a real production team this is `sudoers.d` per-action, not blanket.

```bash
# still as scamshield via the new key-based login
sudo -v    # bootstrap the sudo timestamp cache
sudo bash -c 'cat > /etc/sudoers.d/scamshield-deploy <<EOF
scamshield ALL=(root) NOPASSWD: /usr/bin/systemctl, /usr/sbin/apachectl, /usr/local/cpanel/cpanel/bin/*, /bin/bash /opt/scamshield/scripts/*.sh
EOF
chmod 440 /etc/sudoers.d/scamshield-deploy'
sudo -k    # clear the cache; next sudo must use the user is in the deploy group
```

Verify (in a new login tab):

```bash
ssh -i $env:USERPROFILE\.ssh\shamshield_deploy scamshield@<VPS_IP>
sudo systemctl status sshd
# → should work without a password
sudo -n systemctl status sshd
# → exit 0 means NOPASSWD was applied
```

---

## Step 1.7 — Firewall: leave CSF alone

LiquidWeb ships CSF as the management plane's firewall. **Do not edit `csf.conf`.** Our deployment topology is:

- App binds to `127.0.0.1:8787` (loopback, never reachable from the internet).
- Public traffic enters via Apache on `80`/`443`, which CSF already allows.
- Result: **zero CSF rules needed for the app.**

The only thing CSF cares about for us: leaving it alone. Good. We will not touch it in any future lesson.

---

## Step 1.8 — The first baseline checklist

By the end of this lesson, your `notes/L1-checklist.md` should look like this. Copy this template, fill in the boxes, save as proof-of-completion.

```markdown
# L1 Done

- [x] ed25519 keypair generated; passphrase in password manager.
- [x] Root SSH reachable on first day, then disabled.
- [x] `scamshield` user exists; sudo via NOPASSWD limited to systemctl + apachectl + /opt/scamshield/scripts/*.sh.
- [x] PasswordAuthentication=no globally; PermitRootLogin=prohibit-password.
- [x] Recon output pasted in notes/L1-recon.txt:
      - OS: AlmaLinux 9.x
      - RAM: ___ MB (expect 1900+ available)
      - vCPU: 2
      - Disk: ___ GB free
      - Apache: 2.4.x
      - cPanel: 11.x.y
- [x] cPanel subdomain `concierge.<root-domain>` resolves to the VPS IP; no AutoSSL yet (correct).
- [x] cPanel + WHM UI reachable, license tier visible.

## Open questions / risks
- (e.g. CSF state, SELinux mode, any oddities in `apachectl -M` if you noticed them)
```

The single most valuable thing in that file: the exact Apache minor + cPanel version. We'll need them in Lesson 9.

---

## Anti-patterns to avoid (commit them to memory now)

- ⛔ **Don't install Node from `dnf install nodejs`.** EPEL ships node 16 on EL9, which is end-of-life. We're using nvm + Node 24 in Lesson 8.
- ⛔ **Don't `dnf update` blindly.** LiquidWeb manages the system version pins. If a critical CVE hits, you'll see a notification in WHM.
- ⛔ **Don't open :8787 in CSF.** Loopback + Apache is enough. Public traffic goes through Apache.
- ⛔ **Don't run `cpanelsync` or `/scripts/upcp` yet.** Let cPanel's update schedule handle itself.
- ⛔ **Don't share the root password over Slack.** The deploy user is for you; root goes back in the password manager.

---

## What "done" means for Lesson 1

Open a fresh terminal and run, without errors:

```powershell
ssh -i $env:USERPROFILE\.ssh\shamshield_deploy scamshield@<VPS_IP> \
  "sudo -n systemctl status sshd && whoami && hostname && cat /etc/os-release | head -1"
```

Expected:

```
● sshd.service - OpenBSD Secure Shell server
   Active: active (running) since …
…
scamshield
<vps-hostname>
NAME="AlmaLinux"
```

If you got all three (status / user / os), Lesson 1 is done. Save your `notes/L1-checklist.md` and head to Lesson 2, where we turn the workspace into a private GitHub repo — which is when version control starts giving us rollback confidence.

---
