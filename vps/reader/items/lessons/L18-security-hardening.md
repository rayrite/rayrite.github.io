# Lesson 18 · Enterprise security hardening — CIS benchmarks, fail2ban, secrets vault, audit logging

> **Visual aid:** `visual-aids/va11_security_threat_model.html`.
> **Time budget:** ~8 hrs · **Audience:** when a customer asks for SOC 2, when you go multi-tenant, or when "show me your security posture" stops being a vibe-check.

---

## What this lesson produces

The ScamShield Concierge stack hardened to a level you'd be comfortable showing a security review:

1. **CIS EL9 server hardening baseline** — applied via `cis-cat` audit + a hardening script; ~30 controls.
2. **fail2ban jail for SSH + App + API** — automated throttling of credential-stuffing and scraping bursts.
3. **Secrets in HashiCorp Vault (or systemd-creds)** — `SSC_EBAY_*` env vars no longer in unit files; rotated automatically.
4. **Audit logging** — every typed error, every auth event, every state transition is recorded to a separate audit log; tamper-evident hash chain.
5. **A weekly security smoke test** that proves the hardening holds.

This is the same lesson applied horizontally to the L17 topology if/when you have multiple VMs.

> *Adopting all of this takes you from "credible weekend project" to "credible enterprise service."* None of it changes how the app *behaves* for the user — it changes what *operators* see and what *attackers* can do.

---

## The maturity model (realistic for a solopreneur with higher standards)

```
M0 = L1 + L2 + L8 + L9        (the minimum — VPN-IP-only SSH, cPanel subdomain)
M1 = M0 + L11 + L12           (production baseline — backups, runbook, observability)
M2 = M1 + L18                 (this lesson — audit, secret rotation, fail2ban)
M3 = M2 + L17 + Vault         (multi-VM + secret vault — for SOC 2 evidence)
M4 = M3 + full CIS + SOC 2    (compliance certified — for enterprise deals)
```

You can stop anywhere on this ladder. M2 is "credible security for a closed-beta SaaS". M4 is "what a regulated enterprise asks for."

---

## Step 18.1 — CIS EL9 baseline (the friendly version)

### Audit first

```bash
# On the VPS, as root
dnf install -y epel-release
dnf install -y openscap-scanner openscap-utils scap-security-guide
oscap info /usr/share/xml/scap/ssg/content/ssg-almalinux9-ds.xml
# Run Level-2 (Server):
oscap xccdf eval \
  --profile xccdf_org.ssgproject.content_profile_standard \
  --results scan.xml --report scan.html \
  /usr/share/xml/scap/ssg/content/ssg-almalinux9-ds.xml
# open scan.html in your laptop browser
```

`scan.html` will show ~150 controls; ~30 are non-compliant by default on a LiquidWeb base image. The "high risk" ones:

| Control | Risk | Default state | Fix |
|---|---|---|---|
| Disable unused filesystems (`cramfs`, `freevxfs`, `jffs2`, `hfs`, `hfsplus`, `squashfs`, `udf`) | Drive-by kernel vulns | off | `echo "install <fs> /bin/true" > /etc/modprobe.d/disable-fs.conf` |
| Restrict `kernel.kexec_load_disabled` | kernel escape | 0 | `sysctl -w kernel.kexec_load_disabled=1` |
| Restrict USB storage | usb-borne malware | on | `echo "install usb-storage /bin/true" > /etc/modprobe.d/usb-storage.conf` |
| Disable Avahi (mDNS) | info leak on shared net | on | `systemctl disable --now avahi-daemon` |
| Disable uncommon network protocols (dccp, sctp, rds, tipc) | kernel attack surface | on | `echo "install <proto> /bin/true" > /etc/modprobe.d/disable-proto.conf` |
| Banner | misleading | undefined | Set `/etc/issue` and `/etc/issue.net` to authorized-use notice |
| Permissions on `/etc/shadow`, `/etc/passwd`, etc. | credential leak | often lax | `chmod 0640 /etc/shadow` etc. |
| SSH: `MaxAuthTries`, `MaxSessions`, `LoginGraceTime` | brute force | default 6/10/60 | `MaxAuthTries 3`, `MaxSessions 2`, `LoginGraceTime 30` |
| Audit `uid != 0` after login | shell audit | off | rules in `/etc/audit/rules.d/` |
| Disable postfix if not used | MTA attack surface | running | `systemctl disable --now postfix` |
| Disable rpcbind, nfs, named, dhcpd, slapd, ypserv if unused | port-exposure | running | `systemctl disable --now nfs rpcbind` |

A reusable script `/opt/scamshield/scripts/cis_hardening.sh`:

```bash
#!/usr/bin/env bash
set -euo pipefail
echo "[cis] hardening — read-only check first"
grep -E "^(install) " /etc/modprobe.d/*.conf || echo "(no disabled modules yet)"

# Apply
cat > /etc/modprobe.d/disable-fs.conf <<'EOF'
install cramfs /bin/true
install freevxfs /bin/true
install jffs2 /bin/true
install hfs /bin/true
install hfsplus /bin/true
install squashfs /bin/true
install udf /bin/true
EOF

cat > /etc/modprobe.d/disable-proto.conf <<'EOF'
install dccp /bin/true
install sctp /bin/true
install rds /bin/true
install tipc /bin/true
EOF

echo "install usb-storage /bin/true" > /etc/modprobe.d/usb-storage.conf

sysctl -w kernel.kexec_load_disabled=1
cat > /etc/sysctl.d/99-cis.conf <<'EOF'
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1
net.ipv4.icmp_echo_ignore_broadcasts = 1
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.default.accept_redirects = 0
net.ipv6.conf.all.accept_redirects = 0
EOF
sysctl --system >/dev/null

systemctl disable --now avahi-daemon rpcbind nfs-server postfix 2>/dev/null || true

# SSH
sed -i 's/^#\?MaxAuthTries.*/MaxAuthTries 3/'          /etc/ssh/sshd_config
sed -i 's/^#\?MaxSessions.*/MaxSessions 2/'           /etc/ssh/sshd_config
sed -i 's/^#\?LoginGraceTime.*/LoginGraceTime 30/'     /etc/ssh/sshd_config
sshd -t && systemctl reload sshd

chmod 0640 /etc/shadow /etc/gshadow /etc/passwd /etc/group
systemctl enable --now auditd

cat > /etc/issue <<'EOF'
This system is for authorized users only. All activity is monitored and recorded.
Violations will be investigated and prosecuted to the fullest extent of the law.
EOF
cp /etc/issue /etc/issue.net

echo "[cis] done.  re-run 'oscap xccdf eval ...' to verify."
```

Run it *once*, **after** you've verified key-based SSH login from L1 (otherwise you may lock yourself out — the SSH changes only kick in on `systemctl reload sshd`, after which point you test from a fresh session).

---

## Step 18.2 — fail2ban (the 3 jails that matter for this app)

```bash
sudo dnf install -y epel-release fail2ban
sudo systemctl enable --now fail2ban
```

`/etc/fail2ban/jail.d/scamshield.conf`:

```ini
[DEFAULT]
bantime  = 1h
findtime = 10m
maxretry = 5

# 1) SSH — already covered by the standard jail, but tighten
[sshd]
enabled  = true
port     = ssh
maxretry = 3
bantime  = 24h

# 2) App login / 401/403 hammering via the home page
[scamshield-app]
enabled  = true
port     = http,https
filter   = scamshield-app
logpath  = /opt/scamshield/logs/access.log
maxretry = 30
findtime = 5m
bantime  = 30m

# 3) API — POST /api/jobs at high cadence is suspicious
[scamshield-api]
enabled  = true
port     = http,https
filter   = scamshield-api
logpath  = /opt/scamshield/logs/access.log
maxretry = 60
findtime = 1m
bantime  = 10m
```

Filters:

`/etc/fail2ban/filter.d/scamshield-app.conf`:

```ini
[Definition]
failregex = ^<HOST> .* "(GET|POST) \S+ HTTP/1\.\d" 40[13] \d+ .*$
ignoreregex =
```

`/etc/fail2ban/filter.d/scamshield-api.conf`:

```ini
[Definition]
failregex = ^<HOST> .* "POST /api/jobs HTTP/1\.\d" 4(00|09|29) \d+ .*$
ignoreregex =
```

Wire a *simple access log* into the Node app:

```js
// in lib/router.js — at the very top of handle():
import fs from "node:fs";
import { config } from "./config.js";
const accessLogPath = "/opt/scamshield/logs/access.log";
fs.mkdirSync("/opt/scamshield/logs", { recursive: true });
const accessLog = fs.createWriteStream(accessLogPath, { flags: "a" });

// just inside handle, after the routing switches:
accessLog.write(
  `${req.socket.remoteAddress} ${req.method} ${u.pathname} → ${res.statusCode} ua="${(req.headers['user-agent']||'').slice(0,80)}"\n`
);
```

> *This is read-only access logging.* fail2ban *reads* it; nothing touches the application's normal logs. Tighter than `journalctl` matching; easier to forward to a SIEM later.

Restart + verify:

```bash
sudo systemctl restart fail2ban
sudo fail2ban-client status
sudo fail2ban-client status scamshield-api
```

---

## Step 18.3 — Secrets vault (systemd-creds is the *built-in* answer)

> You may not need HashiCorp Vault at scale (1 VM, 4 secrets). systemd-creds (since systemd 250) provides an encrypted credential store bound to the *host's TPM* (or a passphrase file). **It costs you nothing** and avoids leaking secrets into the unit file.

```bash
# Create a credential:
sudo systemd-creds encrypt --name=ebay_user \
  - /etc/credstore/scamshield.cred <<< 'your-ebay-username'
sudo systemd-creds encrypt --name=ebay_pass \
  - /etc/credstore/scamshield.cred <<< 'your-ebay-password'

# Edit the unit to use them:
sudo systemctl edit scamshield.service
# adds /etc/systemd/system/scamshield.service.d/override.conf:

[Service]
LoadCredentialEncrypted=ebay_user:/etc/credstore/scamshield.cred
LoadCredentialEncrypted=ebay_pass:/etc/credstore/scamshield.cred

# The credentials land in /run/credentials/<unit>/<name> at runtime.
```

Read in the Node app:

```js
// in lib/config.js
import fs from "node:fs";
export function readCredential(name) {
  return fs.readFileSync(`/run/credentials/scamshield.service/${name}`, "utf8");
}
```

> Now `Environment=` lines don't carry secret values. The unit is safe to commit / share with the next operator. The credential values live only in `/etc/credstore/` (mode 0600) and on the host's TPM.

For rotation: `systemd-creds setup --with-key=... ; systemd-creds encrypt ...` (re-encrypts under a new key). Old stored creds invalidated atomically.

> *HashiCorp Vault is the production alternative* (gives you lease semantics, dynamic DB creds, audit logs). systemd-creds is the *right* answer until you have >1 VM or >10 secrets.

---

## Step 18.4 — Audit logging (the chain-of-custody angle)

A SOC-2-friendly audit log:

- **Tamper-evident** (hash chain, like a mini-blockchain)
- **Mandatory** (no skip paths)
- **Read-only** to the application processes

```js
// mvp/app/lib/audit.js
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const AUDIT_PATH = "/opt/scamshield/logs/audit.log";
const AUDIT_KEY_PATH = "/opt/scamshield/logs/.audit.key";      // for HMAC, mode 0600
const AUDIT_PREV_HASH = "/opt/scamshield/logs/.audit.prev";    // last hash, mode 0600

let _key = null;
async function getKey() {
  if (_key) return _key;
  try {
    _key = await fs.readFile(AUDIT_KEY_PATH, "utf8");
  } catch {
    _key = crypto.randomBytes(32).toString("hex");
    await fs.writeFile(AUDIT_KEY_PATH, _key, { mode: 0o600 });
  }
  return _key;
}

let _prevHash = "0000";
async function loadPrev() {
  try { _prevHash = (await fs.readFile(AUDIT_PREV_HASH, "utf8")).trim(); }
  catch { _prevHash = "0000"; }
  return _prevHash;
}

export async function audit(event, payload = {}) {
  const key = await getKey();
  if (!_prevHash || _prevHash === "0000") await loadPrev();
  const ts = new Date().toISOString();
  const record = { ts, event, ...payload };
  const line = JSON.stringify(record);
  const h = crypto.createHmac("sha256", key).update(_prevHash + line).digest("hex");
  const out = line.slice(0, -1) + `,"hmac":"${h}"}` + "\n";
  await fs.appendFile(AUDIT_PATH, out, { mode: 0o640 });
  _prevHash = h;
  await fs.writeFile(AUDIT_PREV_HASH, _prevHash, { mode: 0o600 });
}

// events:
//   auth_login (Phase A)
//   state_transition  (queued → capture → ... → done)
//   typed_error       (sign_in_required, blocked, layout_drift)
//   job_submit_denied (409 — busy)
//   pr_job_replay     (operator triggered a replay)
//   deploy_completed  (CI/CD hook)
//   admin_override    (any /admin/* that bypasses a guard)
```

> The `hmac` chain is verifiable: take the audit log + the key, re-compute the chain; if a single line is missing or edited, the chain breaks. That's "tamper-evident" — not tamper-proof, but enough to *prove non-repudiation*.

Hook into the orchestrator:

```js
// in lib/orchestrator.js
import { audit } from "./audit.js";
// before submit():
audit("job_submit", { ip: req.socket.remoteAddress, query: query.slice(0, 80) });
// on done / errors:
audit("state_transition", { jobId: id, from: prevState, to: newState });
audit("typed_error",     { jobId: id, facet, status, ... });
```

Verify the chain (every Monday morning via cron):

```bash
node -e "
  const fs = require('node:fs');
  const c = require('node:crypto');
  const key = fs.readFileSync('/opt/scamshield/logs/.audit.key','utf8');
  const lines = fs.readFileSync('/opt/scamshield/logs/audit.log','utf8').trim().split('\n');
  let prev='0000'; let ok=true;
  for (const l of lines) {
    const lineNoHmac = l.replace(/,\"hmac\":\"[a-f0-9]+\"}/, '}');
    const m = l.match(/\"hmac\":\"([a-f0-9]+)\"/);
    if (!m) { ok=false; console.log('no hmac at',l); continue; }
    const want = m[1];
    const got  = c.createHmac('sha256', key).update(prev + lineNoHmac).digest('hex');
    if (got !== want) { ok=false; console.log('mismatch at', l); }
    prev = want;
  }
  console.log(ok ? 'audit chain OK ('+lines.length+' records)' : 'BROKEN');
"
```

---

## Step 18.5 — The weekly security smoke test

A single script that proves the hardening:

```bash
#!/usr/bin/env bash
# /opt/scamshield/scripts/security_smoke.sh
set -uo pipefail
PASS=0; FAIL=0
ok()  { printf "  [OK]  %s\n" "$1"; PASS=$((PASS+1)); }
nok() { printf "  [FAIL] %s — %s\n" "$1" "$2"; FAIL=$((FAIL+1)); }

# 1) PasswordAuthentication is OFF
v=$(grep -E '^PasswordAuthentication' /etc/ssh/sshd_config | awk '{print $2}')
[ "$v" = "no" ] && ok "sshd: PasswordAuth=no" || nok "sshd" "PasswordAuth is $v"

# 2) fail2ban active
systemctl is-active --quiet fail2ban && ok "fail2ban: active" || nok "fail2ban" "inactive"

# 3) auditd active
systemctl is-active --quiet auditd && ok "auditd: active" || nok "auditd" "inactive"

# 4) systemd-creds credential readable
test -r /run/credentials/scamshield.service/ebay_user \
  && ok "systemd-creds: ebay_user present at runtime" \
  || ok "systemd-creds: no credentials mounted (Phase A optional)"

# 5) node app doesn't carry plaintext secrets in its unit file
grep -qE '^[A-Z_]+=[A-Za-z0-9/+]{8,}\b' /etc/systemd/system/scamshield.service \
  && nok "unit-file" "looks like a long-value secret in Environment=" \
  || ok "unit-file: no plaintext secrets in Environment="

# 6) audit log chain
node /opt/scamshield/scripts/audit_verify.mjs >/dev/null \
  && ok "audit chain" \
  || nok "audit chain" "tampered or unreadable"

# 7) data/ permissions
for d in /opt/scamshield/data /opt/scamshield/data/auth; do
  perms=$(stat -c '%a' "$d" 2>/dev/null || echo missing)
  case "$perms" in
    700) ok "data/auth perms = 0700 on $d" ;;
    *)   nok "data/auth perms" "$d has $perms (should be 700)" ;;
  esac
done

echo "----- $PASS pass · $FAIL fail -----"
exit $((FAIL > 0 ? 1 : 0))
```

Run weekly (cron):

```cron
0 6 * * 1  bash /opt/scamshield/scripts/security_smoke.sh >> /home/scamshield/backups/security-smoke.log 2>&1
```

If any FAIL appears: investigate in the morning. Don't ignore it because the app "still works."

---

## Step 18.6 — The "what we *don't* do" (anti-features for this app)

> Five controls that sound responsible but aren't right for a closed-beta MVP:

| Anti-feature | Why we skip it |
|---|---|
| Network segmentation (private VLANS for the app) | Single-VM app; the segmentation we have *is* the OS. |
| HIDS / Wazuh / OSSEC | Single-VM; `auditd` + the audit chain + fail2ban is enough. SOC 2 evidence lives in *that*, not a UI. |
| Egress firewall (block all but 80/443/22 from VMs) | The single egress is eBay (443) — we *want* it. ipset-based egress to eBay ASNs is overkill here. |
| SELinux custom policy beyond `targeted` | Chromium's sandbox + cgroup memory are the boundaries we exercise. SELinux enforcement is fine but custom policies add surface without value. |
| Full mTLS at the app layer | The deployment topology is single-tenant per VPS; mTLS is for multi-tenant. v3+ lesson if/when you go multi-tenant. |

---

## Anti-patterns to avoid

- ⛔ **Don't conflate "compliance checklist" with "secure."** The script above gives you evidence; the actual security is *no long-lived secrets in unit files + audit chain + fail2ban + boundary discipline*. Both matter; don't substitute one for the other.
- ⛔ **Don't put env-var secrets in version control.** Even after Vault or systemd-creds, *the unit file ends up in operational tooling* (Terraform, IaC). Keep the unit *referencing* a credential, not *containing* one.
- ⛔ **Don't disable SELinux to "fix" something.** Targeted is fine; permissive is not.
- ⛔ **Don't widen fail2ban's maxretry to "let real users in."** Tune the `findtime` instead.
- ⛔ **Don't skip the weekly smoke.** It costs 4 lines of cron; failures *will* happen.

---

## What "done" means for Lesson 18

1. `bash /opt/scamshield/scripts/security_smoke.sh` → all OK.
2. `oscap xccdf eval --profile ...` → still has some failures (acceptable; document them) but the *new* ones are the unfixed ones, not old unfixed ones.
3. `fail2ban-client status` shows the three jails active.
4. `/opt/scamshield/logs/audit.log` exists, mode 0640, with the HMAC chain verify-able.
5. `/etc/systemd/system/scamshield.service` has no plaintext secrets.

When all five hold, you've reached **M2 maturity**. From here, M3 (multi-VM + Vault) is L17's territory, and M4 (SOC 2) is mostly the same disciplines + a documented ISMS. You're already most of the way to "credible enterprise posture" just from L1+L8+L9 done rigorously.

---

*Next: L19 — what to actually do when something breaks at 2am (incident response patterns).*
