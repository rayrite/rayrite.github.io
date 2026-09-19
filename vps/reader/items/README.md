# ScamShield Concierge · Curriculum (Buildathon edition)

> **22 lessons · 16 visual aids · 4 milestones** — every lesson has a single deliverable + a gate.

## Quick links

### Lessons

| Lesson | Title | Time | Milestone |
|---|---|---|---|
| [L0](lessons/L0-meta.md) | Meta · how this series is shaped | 1h | — |
| [L1](lessons/L1-server-foundations.md) | Server foundations (VPS first-login, SSH, cPanel) | 2h | MVP |
| [L2](lessons/L2-git-repo.md) | Private GitHub repo + the 2 config files that matter | 1h | MVP |
| [L3](lessons/L3-dev-environments.md) | Three dev environments + offline test suite | 2h | MVP |
| [L4](lessons/L4-pipeline-port.md) | Port the proven pipeline; golden test green | 3h | MVP |
| [L5](lessons/L5-capture-module.md) | `lib/capture.js` + `blocked.test` + first live capture | 4h | MVP |
| [L6](lessons/L6-orchestrator.md) | Router + orchestrator + SSE + home UI | 4h | MVP |
| [L7](lessons/L7-dashboard.md) | Dashboard port + 22-field adapter + layout parity | 6h | MVP |
| [L8](lessons/L8-systemd-tunnel.md) | VPS service user + Node 24 + systemd + SSH tunnel | 5h | MVP |
| [L9](lessons/L9-apache-tls.md) | cPanel subdomain + AutoSSL + Apache SSE-safe proxy | 4h | MLP |
| [L10](lessons/L10-cicd.md) | GitHub Actions + tag-based rollback | 5h | MLP |
| [L11](lessons/L11-rehearse.md) | Demo-day rehearsal + runbook + fallback | 4h | v1 |
| [L12](lessons/L12-backups-observability.md) | Backups + observability + final hardening | 4h | v1 |
| | **— post-v1 (operations, scaling, security)** | | |
| [L13](lessons/L13-ebay-wall-handling.md) | When the wall hits — the eBay-day toolkit | ad-hoc | ops |
| [L14](lessons/L14-auth-phase-a.md) | Auth-Plan Phase A — optional headed login + persistent profile | 5h | ops |
| [L15](lessons/L15-replay-debugging.md) | Replay as debugging — fix parsers without eBay | ad-hoc | ops |
| [L16](lessons/L16-vertical-scale.md) | Vertical scale (single VPS, more capacity, no architecture change) | 6h | scale |
| [L17](lessons/L17-multi-vm.md) | Multi-VM topology, load balancer, IaC | 10h | scale |
| [L18](lessons/L18-security-hardening.md) | Enterprise security hardening (CIS, fail2ban, Vault, audit) | 8h | security |
| [L19](lessons/L19-incident-response.md) | When things break — incident-response patterns | ad-hoc | ops |
| [L20](lessons/L20-handoff.md) | Operator handoff — onboarding the next person | 6h | ops |
| [L21](lessons/L21-demo-talk-track.md) | The demo talk-track — 2 / 4 / 8-minute versions | 3h | practice |

### Visual aids (16 standalone HTML, ASCII + Mermaid)

| | Title | Use in |
|---|---|---|
| [VA-01](visual-aids/va01_system_context.html) | System Context (C4 L1) | L1, L9 |
| [VA-02](visual-aids/va02_component_architecture.html) | Component Architecture | L4, L6 |
| [VA-03](visual-aids/va03_data_flow.html) | Data Flow (artifacts lineage) | L6, L21 |
| [VA-04](visual-aids/va04_runtime_sequence.html) | Runtime Sequence | L6, L21 |
| [VA-05](visual-aids/va05_dev_ci_prod.html) | Dev/CI/Prod Environment Matrix | L3, L17 |
| [VA-06](visual-aids/va06_facet_state_machine.html) | Per-Facet State Machine | L5, L21 |
| [VA-07](visual-aids/va07_pipeline_replay.html) | Pipeline Class/Module | L4, L15 |
| [VA-08](visual-aids/va08_deployment_topology.html) | Deployment Topology | L8, L9, L17 |
| [VA-09](visual-aids/va09_cicd_pipeline.html) | CI/CD Pipeline | L10 |
| [VA-10](visual-aids/va10_user_journeys.html) | User Journeys | L11, L21 |
| [VA-11](visual-aids/va11_security_threat_model.html) | Security Threat Model | L18 |
| [VA-12](visual-aids/va12_job_directory_layout.html) | Job Directory Layout | L6, L15 |
| [VA-13](visual-aids/va13_curriculum_map.html) | Curriculum Map | L0 |
| [VA-14](visual-aids/va14_maturity_ladder.html) | Maturity Ladder (M0–M4) | L18 |
| [VA-15](visual-aids/va15_handoff_path.html) | Operator Handoff (14-day rhythm) | L20 |
| [VA-16](visual-aids/va16_talk_track_map.html) | Demo Talk-Track (2/4/8 min) | L21 |

## Milestones

- **MVP** — live demo on VPS via SSH tunnel. Tags: `v0.0-meta` → `v0.5-vps-tunnel`. Lessons L1–L8.
- **MLP** — public `https://concierge.<your-domain>` URL. Tags: `v0.6-mlp-public`. Lessons L9–L10.
- **v1** — CI/CD + rehearsals + backups + observability. Tags: `v1.0-demo` · `v1.0-rehearsal` · `v1.0-hardened`. Lessons L11–L12.
- **post-v1** — operations, scaling, security, handoff, talk-track. Lessons L13–L21.

## Recommended reading order

If you have 55 hours: **L0–L12 in order**. Each unlocks the next.

If you have time after that, in priority order:

1. **L21** (talk-track) — the words you'll say matter
2. **L13** (wall handling) — the wall *will* hit; be ready
3. **L15** (replay debugging) — your most-used debugging tool
4. **L19** (incident response) — when 2am happens
5. **L14** (auth Phase A) — if you want reliable 3-facet reports
6. **L20** (handoff) — before you ever need it
7. **L18** (security hardening) — when a customer asks for it
8. **L17** (multi-VM) — at 5k+ DAU
9. **L16** (vertical scale) — pre-step before multi-VM

## Visual aids toolbox

Every visual aid is one self-contained HTML file. **Controls:** `+` / `−` zoom the focused panel, `0` reset, `p` print, pinch-zoom on touch.
