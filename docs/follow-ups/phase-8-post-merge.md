# Phase 8 Post-Merge Follow-ups

Captured during the Phase 8C/8D/8E stack (PRs #105–#108) so a future session can
pick these up without re-deriving the context.

Pick up in a new session by reading this file first, then opening the
referenced PRs / files. Each item below is sized for a single focused PR.

---

## Status when this file was written

- **PR #104** (Phase 8A/8B — GPU pods + InfiniBand fabric): merged to `main`.
- **PR #105** (polish, v0.6.0, backend fabric toggle): open, base `main`.
- **PR #106** (Phase 8C — NOC panel): open, base `polish/phase-8-v060-fabric-toggle`.
- **PR #107** (Phase 8D — AI incidents): open, base `feat/phase-8c-noc-panel`.
- **PR #108** (Phase 8E — training jobs, v0.6.1, docs roll-up, screenshots): merged into `feat/phase-8d-ai-incidents`, awaiting upstream merges before reaching `main`.

> When the stack lands on `main`, screenshot URLs in #105–#108 descriptions will
> still resolve (raw.githubusercontent points at a branch, but GitHub falls back
> to default-branch contents once the branch tip is on main). Optional cleanup
> below covers permanence.

---

## 1. Tutorial onboarding for the AI tier ⭐ priority

**Why:** Phase 8C/D/E added three new operational concepts that aren't discoverable
from the existing 44 tips:
- The NOC sidebar icon lights up only when a pod is built — new players miss it.
- Knowing which link-triage action to reach for (drain vs. reset vs. optic vs. electrician) is non-obvious.
- Training-contract SLAs (especially pretraining's 0 restarts) deserve a heads-up.

**Where to edit:** `src/stores/configs/progression.ts` — `TUTORIAL_TIPS` and `TUTORIAL_STEPS`.
**Trigger logic:** `src/stores/gameStore.ts` near the `// Tutorial: triggers contextual tips` block (search for `tip.id === 'first_overheat'`).

### TUTORIAL_TIPS to add (6 entries)

| id | category | trigger condition | message |
|----|----------|-------------------|---------|
| `noc_unlocked` | `network` | first time `gpuPods.length === 1` | "Your first GPU pod is online — open the new NOC sidebar to monitor InfiniBand link health and triage flapping cables." |
| `first_ib_flap` | `network` | first time any `ibLinks.some(l => l.status === 'flapping')` | "A backend link is flapping. Open NOC → click the link → drain it or replace the optic before it goes down." |
| `thermal_runaway_warning` | `cooling` | when a cabinet has `density !== 'standard'` AND `liquidCooling !== 'direct_to_chip'` AND `liquidCooling !== 'single_phase_immersion'` | "This high-density cabinet is one bad day away from thermal runaway. Upgrade to direct-to-chip cooling before AI workloads ramp up." |
| `first_training_offer` | `contracts` | first time `trainingJobOffers.length > 0` | "Training contracts pay lump sums on completion. Pretraining is the whale — read the SLA before you click Run." |
| `pretraining_restart_warning` | `contracts` | when player calls `restartTrainingJob` on a pretraining job (intercept in the action OR detect in tick) | "Pretraining has zero restart budget. Restarting now will fail the contract and tank reputation. Cancel instead if you're not committed." |
| `ecc_fault_first_time` | `incidents` | first time any cabinet has `eccFaultedGpus > 0` | "A GPU has thrown ECC errors. Open the cabinet detail panel and click Refresh ($15K) to bring it back online — or accept the proportional revenue drop." |

### TUTORIAL_STEPS — new "First GPU Pod" branch

Add a guided branch reachable from the main tutorial (or replayable from `GuidePanel`):

1. **Research AI Infrastructure** — `requires: !state.unlockedTech.includes('ai_infrastructure')` → highlight Research panel → wait for tech unlock.
2. **Place a Small Pod** — highlight Build panel `GPU PODS` section → wait for `gpuPods.length >= 1`.
3. **Toggle the Backend Fabric layer** — point at the Layers popup → wait for `backendFabricVisible === true` (already default, so just educational).
4. **Accept your first training contract** — wait for `trainingJobOffers.length > 0` → highlight TRAINING CONTRACTS section → wait for `trainingJobs.some(j => j.status === 'running')`.
5. **Watch a job complete** — explain NOC Jobs tab → wait for `trainingJobsCompleted >= 1`.

**Effort:** ~half day for the 6 tips (catalog entries + trigger checks in `tick()`), ~half day for the guided steps. Bump `TUTORIAL_TIPS` count in `CLAUDE.md` (44 → 50) and `TODO.md` after.

**PR title suggestion:** `feat: AI tier tutorial onboarding (6 tips + First GPU Pod guided branch)`

---

## 2. Refresh `docs/images/thumbnail.png` for v0.6.1

The SEO / og:image thumbnail (used in social sharing) currently shows the
pre-Phase-8 game state. The screenshot capture script from PR #108 can drive a
canvas-only screenshot once a pod is built — extend it with a `thumbnail` mode
that:
- Sets up an aesthetically pleasing endgame state (enterprise tier, several pods, active training jobs, fabric activity high so AllReduce dots are visible)
- Hides the sidebar (`pendingPanelOpen: null`, no active selection)
- Captures a 1200×630 (OG image standard) clip centered on the canvas

**Where to edit:** `scripts/capture-pr-screenshots.mjs` — add a `thumbnail` arg gate.
**Effort:** ~1 hour.

---

## 3. README.md mention of the AI Infrastructure tier

README.md is 148 lines and doesn't currently mention AI infrastructure, NOC,
or training jobs. Add a one-paragraph addition to the features highlights
listing the new tier alongside the existing systems.

**Suggested copy:**
> **AI Infrastructure (v0.6.x):** Deploy high-density GPU pods cooled by
> rear-door HX or direct-to-chip liquid loops. Each pod auto-builds an
> InfiniBand backend fabric with rail-isolated AllReduce. Triage flapping
> links from the new NOC sidebar. Accept training contracts that pay lump-sum
> on completion — pretraining is the whale ($2M–$5M, zero restart budget).

**Effort:** 15 minutes.

---

## 4. CONTRIBUTING / `.claude/skills/add-*` extensions

PR #96 added contribution docs and `.claude/skills/add-incident`,
`/add-feature`, etc. With the AI tier landed, two patterns deserve documented
sub-flows so contributors don't have to reverse-engineer them:

### `add-ai-incident.md` (or extend `add-incident`)
- Show the per-type spawn-precondition pattern (the switch in `tick()` around
  line ~5440 in `gameStore.ts`)
- Show the deferred-mutation queue pattern (`pendingOpticFailures`,
  `pendingEccFaults`, `thermalRunawayShutoffCabIds`)
- Show how `affectedPodId`/`affectedIbLinkId`/`affectedCabinetId` get stamped
  onto the `ActiveIncident` so handlers can find their target without
  re-searching state

### `add-training-job-type.md` (new)
- Show the `TRAINING_JOB_CONFIG` shape (duration / payout / restarts / fabric load)
- Show the per-cabinet revenue multiplier table for ai_lab
- Show the offer-generation interval/pool/TTL constants
- Note that `restartTrainingJob` enforces SLA budget; new types should pick
  `maxRestarts` carefully

**Effort:** ~2 hours total.

---

## 5. Manual UI verification (one-time, before next release)

The screenshot capture in PR #108 confirms the UI renders, and tests confirm
the simulation is correct. What hasn't been hand-tested:

- [ ] Drive an `optic_failure` → confirm `replaceOptic` is the only way out (`resetSwitch` should fail to recover a `down` link)
- [ ] Drive a `thermal_runaway` → let it expire unresolved → confirm the cabinet auto-power-offs (status bar should reflect)
- [ ] Accept a `pretraining` contract → restart it once → confirm the job fails and pod is freed
- [ ] Accept an `inference_batch` → run to completion → confirm 0.25× ai_lab base + lump sum both materialize in `money`
- [ ] Click an IB cable in the Phaser scene → confirm the NOC drawer auto-opens to that link via the `pendingPanelOpen` handoff
- [ ] Build a pod on a remote site (after multi-site is unlocked) → switch to HQ and back → confirm the pod's fabric + active job + repair state survive the site switch (snapshot save/restore)

**Effort:** ~30 minutes.

---

## 6. Permanence pass on PR image URLs (optional, after merge)

PR #105–#108 reference screenshots via:

```
https://raw.githubusercontent.com/kevinreber/data-center-tycoon/feat/phase-8e-training-jobs/.github/pr-images/phase-8-cdef/<name>.png
```

Once the stack lands on `main`, the branch will be deleted by GitHub's
auto-cleanup (or manually). The raw URL falls back to default branch contents
silently, but the URL still says "feat/phase-8e-training-jobs" which is
confusing for future readers of merged PR history.

**Fix:** edit each PR body via `gh pr edit <num> --body $(...)` and replace
`feat/phase-8e-training-jobs` with `main` in image URLs. Or write a quick
one-liner with `gh pr view --json body --jq .body | sed | gh pr edit --body-file -`.

**Effort:** 10 minutes.

---

## 7. Phaser polish (lower priority)

- **Hover affordance for errored IB cables** — make `flapping` / `down` links
  pulse subtly on hover in the scene so they're clearly clickable. Today the
  cable hit zones work but there's no visual cue.
- **AllReduce ring intensity tied to job throughput** — when a fast-paced
  inference job is running, dots should travel faster than during a steady
  pretraining run. Currently they all use the same fabric `activityLevel` ramp.
- **Heatmap overlay for AI incidents** — the existing heat map shows cabinet
  temperature. A NOC-specific overlay could tint switches by `errorRate` and
  links by `utilizationPct` so the operator can see fabric stress at a glance.

**Effort:** half-day per item.

---

## Cross-references

- Stack PRs: #105 (polish), #106 (NOC), #107 (AI incidents), #108 (training jobs)
- Design doc: `BRAINSTORM.md` Phase 8 sections (8A–8E shipped; 8F–8J still backlog)
- Type definitions: `src/stores/types.ts` — `TrainingJob`, `TrainingJobOffer`, `IBLinkRepair`, `Cabinet.eccFaultedGpus`, `IncidentDef.effect: 'ai_fabric' | 'ai_cabinet'`
- Configs: `src/stores/configs/equipment.ts` (`TRAINING_JOB_CONFIG`, `GPU_POD_CONFIG`, `LIQUID_COOLING_CONFIG`, `DENSITY_SCALING`, `IB_SWITCH_CONFIG`) and `src/stores/configs/progression.ts` (`INCIDENT_CATALOG` 29 entries incl. 7 Phase 8D AI types)
- Screenshot capture script: `scripts/capture-pr-screenshots.mjs` — reusable for the thumbnail refresh + future feature PRs
