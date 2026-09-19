# Lesson 9 · cPanel subdomain + AutoSSL + Apache reverse proxy (SSE-safe config)

> **Visual aid:** `visual-aids/va08_deployment_topology.html`.
> **Time budget:** ~4 hrs · **MLP gate contribution:** `v0.6-mlp-public` — `https://concierge.<your-domain>` is reachable, `/healthz` is 200, SSE delivers a full event stream through the proxy.

---

## What this lesson produces

A real, public, HTTPS URL that reaches the same `scamshield.service` you stood up in L8 — but now through Apache EA4 with proper TLS, header normalization, and the SSE-safe proxy settings the design doc spells out.

After L9:

- `https://concierge.<your-domain>/` → home page (TLS via AutoSSL)
- `POST https://concierge.<your-domain>/api/jobs` → 202 / 409
- `https://concierge.<your-domain>/api/jobs/<id>/events` → SSE (no buffering, http/1.1)
- `https://concierge.<your-domain>/report/<id>/...` → guarded static
- The SSH tunnel from L8 still works as a backup channel.

---

## The critical *order* — AutoSSL FIRST, then proxy

> *This is the most-skipped step in first-time cPanel setups, and the lesson saves you hours of pain.*

`AutoSSL` (cPanel's bundled Let's Encrypt client) issues certs via the HTTP-01 Domain Control Validation flow, which means it serves a token at `http://<your-domain>/.well-known/acme-challenge/<token>`. **The moment your proxy catches `/`, AutoSSL's renewals fail.**

So:

1. **Step 1:** Add the subdomain. Don't add any reverse-proxy include yet.
2. **Step 2:** Wait for AutoSSL to issue the cert.
3. **Step 3:** Now add the reverse-proxy include.
4. **Step 4:** Confirm the cert still renews.

If you swap the order — if you add the proxy first — you'll spend an hour debugging why `.well-known` is suddenly 404.

---

## Step 9.1 — Add the cPanel subdomain (HTTP only, *no* proxied anything yet)

In **cPanel → Domains → Subdomains**:

- Subdomain: `concierge` (or whatever you chose in L1)
- Domain: `<your-root-domain>`
- Document Root: leave as the default (`public_html/concierge/`)

Click *Create*. Verify via SSH:

```bash
# on the VPS
ls /var/www/vhosts/<your-user>/concierge/
# expect: an empty default docroot (e.g. cgi-bin/, etc.)
```

Now visit `http://concierge.<your-root-domain>/` in a browser. You should see cPanel's default placeholder page (a simple "this site is hosted by cPanel" thing). That's correct — it means DNS is right, Apache is responding on `:80`.

> ⚠️ If you see **cPanel's default SSL cert warning** or no redirect-to-HTTPS: that's *also* correct at this stage. We don't have the cert yet; AutoSSL is about to fix it.

---

## Step 9.2 — AutoSSL — issue the cert before the proxy is in place

In **cPanel → Security → SSL/TLS Status**, find `concierge.<your-root-domain>` and click **Run AutoSSL**. Or visit **WHM → SSL/TLS → Manage AutoSSL** if you have WHM access.

A successful run prints:

```
The system successfully provisioned a certificate for concierge.<your-root-domain> …
```

If you see an error like `The system was unable to provision a certificate …`, the usual cause is that `/.well-known/acme-challenge/` is already proxied (which we just said don't do) — or your domain's DNS A record doesn't actually point at the VPS. Verify:

```powershell
# laptop
Resolve-DnsName concierge.<your-root-domain>
# expect IP == your VPS IP
```

Try the AutoSSL run again. Patience: AutoSSL retried hourly; the first successful issue usually takes <5 minutes.

Sanity-check the cert is now live:

```powershell
(Invoke-WebRequest "https://concierge.<your-root-domain>/" -SkipCertificateCheck).Headers
# expect a Set-Cookie or X-Cache with normal Apache headers
(Invoke-WebRequest "https://concierge.<your-root-domain/" -SkipCertificateCheck).Content.Substring(0, 200)
# expect: cPanel default page bytes (no 503, no proxy errors)
```

> 🚦 **Stop. Don't add the proxy until you've seen the cert issued.** This is a choke point; pushing past it makes the cert renewal later silently fail and you find out about it at demo time. Not great.

---

## Step 9.3 — The reverse-proxy include (corrected SSE config)

> *This is the file most often wrong.* The design doc enumerates the corrections: no `flushpackets` (AJP/FCGI only), SSE on the events path needs `SetEnvIf` for `no-gzip`, and `Protocols http/1.1` to dodge a long-known h2 stall on long-lived streams.

File: `/etc/apache2/conf.d/userdata/std/2_4/<USER>/concierge.<your-root-domain>/scamshield.conf` (and matching `ssl/2_4/...`)

```apache
# AutoSSL FIRST: HTTP-01 DCV must NOT be proxied (order matters; first match wins)
ProxyPass        /.well-known/acme-challenge !
ProxyPass        /.well-known/cpanel-dcv !
ProxyPass        /.well-known/pki-validation !

ProxyPreserveHost On
ProxyRequests Off

# flushpackets/flushwait deliberately ABSENT: mod_proxy_http ignores them
# (AJP/FCGI-only per ASF docs). Streaming works; we only need generous timeouts.
ProxyPass        / http://127.0.0.1:8787/ timeout=3600 retry=0
ProxyPassReverse / http://127.0.0.1:8787/
ProxyTimeout     3600

# mod_deflate buffers SSE to death — disable compression on the events path:
SetEnvIf Request_URI ^/api/jobs/.+/events$ no-gzip dont-vary

# httpd's h2 has a history of stalling long-lived streams — force 1.1 on this vhost
Protocols http/1.1
```

> The same file in *both* `std/2_4/...` (port 80) and `ssl/2_4/...` (port 443) — Apache uses the `std` one when the request was plain HTTP, and the `ssl` one when HTTPS. They're separately evaluated.

The path `<USER>` is your cPanel account username (often the same as the root domain). Quick check:

```bash
ls /var/cpanel/users/                 # your user record
ls /etc/apache2/conf.d/userdata/std/2_4/   # existing userdata
```

> **Don't use the WHM UI's "include editor".** The UI's editor silently drops files you create by hand on some cPanel versions. SSH + `tee` is the safest path.

Apply:

```bash
sudo /scripts/rebuildhttpdconf
sudo /scripts/restartsrv_httpd
```

If `rebuildhttpdconf` fails: read the error; usually it's "include file outside expected paths" — the path format above is the canonical one. Don't write files into `conf.d/`; the `userdata/...` tree is the correct surface.

Verify the include was loaded:

```bash
apachectl -t -D DUMP_INCLUDES 2>&1 | head -30
# expect: a line with the path to your include file
```

---

## Step 9.4 — Verify SSE through the proxy (the moment of truth)

The include can be syntactically valid *and* still kill SSE because of buffering. Test end-to-end *before* declaring L9 done.

`curl -N` is the canonical test (the `-N` = `--no-buffer`):

```powershell
# Submit a job
$r = Invoke-WebRequest "https://concierge.<your-root-domain>/api/jobs" -Method POST `
   -Headers @{"content-type"="application/json"} -Body '{"query":"rtx 3090"}' `
   -SkipCertificateCheck
$jobId = ($r.Content | ConvertFrom-Json).jobId
echo "jobId = $jobId"

# Watch SSE *through the proxy*
curl.exe -N "https://concierge.<your-root-domain>/api/jobs/$jobId/events" --max-time 30 -k
# expect: a stream of `data: …` lines arriving ~every second
# at the end: `data: {"kind":"done","reportUrl":"/report/.../"}`
```

If the stream buffers (you see nothing for 8+ seconds and then a burst), `mod_deflate` is enabled on the events path. Re-check `SetEnvIf Request_URI ^/api/jobs/.+/events$ no-gzip dont-vary`. If buffers every 20s, Apache 2.4.5x had a bug; verify the Apache minor:

```bash
httpd -v
# Apache/2.4.X …
```

If you see connection-drop after 60s, you might have hit `ProxyTimeout 3600` plus something else; check `/var/log/apache2/error_log` on the server:

```bash
sudo tail -n 100 /var/log/apache2/error_log | grep -i "scamshield\|sse\|"
```

> I would *love* it if every lesson ended "first try it works" but the truth is Apache SSE is finicky, and ~20% of first attempts need 1-2 iterations of "review the include file vs. the design doc one more time."

---

## Step 9.5 — Force-HTTPS redirect (a small cPanel trade-off)

cPanel's "Force HTTPS Redirect" toggle in the UI gets permanently *disabled* for any domain where we add a custom userdata include (cPanel rule: including Apache yourself disables the UI's macro because we could conflict with each other).

Pick one:

**Option A — let Apache handle the redirect via our include.** Add to the top of both the `std/` and `ssl/` include files:

```apache
# Force HTTPS only when the request is plain HTTP (don't redirect twice on SSL)
<If "req('HTTPS') != 'on'">
  Redirect permanent / https://concierge.<your-root-domain>/
</If>
```

**Option B — accept plain HTTP.** Most demos don't notice; cert renewal still works since AutoSSL uses `:80`.

Pick A. The 1-line cost makes the demo never have an HTTP footgun.

Apply:

```bash
sudo /scripts/rebuildhttpdconf
sudo /scripts/restartsrv_httpd

# Test the redirect:
(Invoke-WebRequest "http://concierge.<your-root-domain/" -MaximumRedirection 0 -SkipHttpError).Headers.Location
# expect: https://concierge.<your-root-domain>/
```

> *cPanel caveat:* this redirect *only* applies to URLs that match the vhost's `ServerName`/`ServerAlias`. If you ever add a wildcard (`*.concierge.<your-domain>`), it'd need a wider `ServerAlias`.

---

## Step 9.6 — Verify *every* route works through the proxy

The 7 routes from L6, now through the public URL:

```powershell
$base = "https://concierge.<your-root-domain"

# 1. GET / (home page)
(Invoke-WebRequest $base -SkipCertificateCheck).StatusCode   # 200

# 2. POST /api/jobs (busy / happy / validation)
$r = Invoke-WebRequest "$base/api/jobs" -Method POST -Headers @{"content-type"="application/json"} `
   -Body '{"query":"rtx 3090"}' -SkipCertificateCheck
$r.StatusCode             # 202
$jobId = ($r.Content | ConvertFrom-Json).jobId

# 3. GET /api/jobs (recent)
(Invoke-WebRequest "$base/api/jobs" -SkipCertificateCheck).StatusCode   # 200

# 4. SSE through proxy — see Step 9.4

# 5. /healthz behind proxy
(Invoke-WebRequest "$base/healthz" -SkipCertificateCheck).Content
# expect: {"ok":true,"busy":false,"env":"prod"}

# 6. traversal guard still works (return 404 if intercepted)
try {
  Invoke-WebRequest "$base/report/$jobId/../captures/current.mhtml" -SkipCertificateCheck
} catch { $_.Exception.Response.StatusCode.value__ }   # expect: 404

# 7. /captures/ itself is NEVER reachable
try {
  Invoke-WebRequest "$base/captures/current.mhtml" -SkipCertificateCheck
} catch { $_.Exception.Response.StatusCode.value__ }   # expect: 404
# ↑ this is by-design.  Captures are private; only /report/<id>/ is served.
```

---

## Step 9.7 — The cPanel gotchas that bit other people (so they don't bite us)

| Gotcha | Symptom | Mitigation |
|---|---|---|
| Force HTTPS redirect conflicts | cPanel UI complains; redirect loop | Option A above |
| AutoSSL fails after proxy install | `/.well-known/acme-challenge/<token>` returns 404 → cert renewal breaks → 90 days later, **demo day 502** | Order in §9.0; verify renewal 7 days after deploy |
| Passenger installed by cPanel | `Node.js` Application Manager UI becomes available; tempting | Don't touch it. Passenger buffers responses; SSE dies. We've eliminated the path. |
| `ProxyPass /` matches `/.well-known/` | AutoSSL renewal breaks | `ProxyPass /.well-known/acme-challenge !` first (first match wins) |
| `ProxyPreserveHost Off` | Lost `Host: header` breaks Node's `req.headers.host`-based routing | Set `On` explicitly |
| `mod_proxy_http` doesn't honor `flushpackets` | Many blog posts tell you to use them | It's a mod_proxy_ajp / mod_proxy_fcgi directive. Use `timeout=3600` instead. |

---

## Step 9.8 — Tagging the MLP checkpoint

```powershell
git add -A
git commit -m "deploy: Apache reverse proxy + AutoSSL + force-HTTPS; SSE verified end-to-end through https"
git tag -a v0.6-mlp-public -m "MLP: https public URL; cert + Apache SSE-safe proxy in place"
git push --tags
```

> At this milestone you can hand the URL to *anyone with a browser* and they can demo the app. **That's what closes MLP.**

---

## Step 9.9 — Save and update the runbook

Append to `mvp/docs/RUNBOOK-VPS.md`:

```markdown
## Apache + AutoSSL

sudo /scripts/rebuildhttpdconf
sudo /scripts/restartsrv_httpd

# Where the includes live
ls /etc/apache2/conf.d/userdata/std/2_4/$USER/<sub.domain>/
ls /etc/apache2/conf.d/userdata/ssl/2_4/$USER/<sub.domain>/

# Force HTTPS redirect lives inside the include; the cPanel UI toggle is now disabled.
# After any include change:
sudo /scripts/rebuildhttpdconf
sudo /scripts/restartsrv_httpd
curl -N https://<sub.domain>/api/jobs/<id>/events   # verify SSE
```

---

## Anti-patterns to avoid

- ⛔ **Don't proxy `/.well-known/acme-challenge/*`.** AutoSSL renewal breaks silently and the cert expires on day 90.
- ⛔ **Don't use Passenger.** It buffers long responses. SSE is 3+ minutes live; Passenger kills it.
- ⛔ **Don't use Apache's `flushpackets` / `flushwait`** thinking they help streaming — they're AJP/FCGI-only.
- ⛔ **Don't open :8787 in CSF.** Loopback bind already keeps it private. CSF can't help by being opened; only hurt.
- ⛔ **Don't trust the cPanel "Force HTTPS" toggle once you've added a custom include.** It's off by design; you code it yourself.
- ⛔ **Don't trust a green test today that you didn't run last week.** AutoSSL renewal is silent; set a calendar reminder at L12 to verify in 7 days.

---

## What "done" means for Lesson 9

```powershell
(Invoke-WebRequest "https://concierge.<your-root-domain/healthz" -SkipCertificateCheck).Content
# {"ok":true,"busy":false,"env":"prod"}

$r = Invoke-WebRequest "https://concierge.<your-root-domain/api/jobs" -Method POST `
   -Headers @{"content-type"="application/json"} -Body '{"query":"rtx 3090"}' -SkipCertificateCheck
$jobId = ($r.Content | ConvertFrom-Json).jobId
curl.exe -N "https://concierge.<your-root-domain/api/jobs/$jobId/events" --max-time 60 -k
# Streams events live.  :done arrives with reportUrl.
```

When the URL works over HTTPS and SSE flows through the proxy, **MLP is reached**. The remaining lessons (10–12) harden the deploy — CI/CD, runbook rehearsal, backups. Let me know when you're ready and I'll write L10, the GitHub Actions deploy pipeline with tag-based rollbacks.
