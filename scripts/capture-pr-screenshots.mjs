// Drives the dev server via Playwright + the window.__store dev hook to
// capture screenshots used in the Phase 8C/8D/8E PR descriptions.
//
// Usage:
//   npm run dev            # in another shell (defaults to :5173 or next free)
//   PORT=5174 node scripts/capture-pr-screenshots.mjs
//
// Writes PNGs to .github/pr-images/phase-8-cdef/.

import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'

const PORT = process.env.PORT ?? '5174'
const URL = `http://localhost:${PORT}/`
const OUT = '.github/pr-images/phase-8-cdef'

const VIEWPORT = { width: 1280, height: 800 }

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()
  const ctx = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 2 })
  const page = await ctx.newPage()
  page.on('console', (msg) => {
    if (msg.type() === 'error') console.error('[page]', msg.text())
  })

  console.log(`→ Opening ${URL}`)
  await page.goto(URL, { waitUntil: 'domcontentloaded' })
  await page.waitForFunction(() => !!window.__store, null, { timeout: 15_000 })

  // Skip landing page + welcome modal so the canvas + sidebar are visible.
  await page.evaluate(() => {
    const s = window.__store.getState()
    s.skipTutorial?.()
  })
  // Click the PLAY button on the landing page.
  const playBtn = page.locator('button:has-text("PLAY NOW")')
  if (await playBtn.count()) {
    await playBtn.first().click().catch(() => {})
  }
  await page.waitForTimeout(800)
  // Welcome modal — skip tutorial if it appears.
  for (const label of ['Skip tutorial', 'Skip', 'Continue', 'Start playing']) {
    const btn = page.locator(`button:has-text("${label}")`)
    if (await btn.count()) {
      await btn.first().click().catch(() => {})
      await page.waitForTimeout(200)
    }
  }
  // Region select modal — click "Build Here" to commit to Ashburn.
  const buildHereBtn = page.locator('button:has-text("Build Here")').first()
  if (await buildHereBtn.count()) {
    await buildHereBtn.click().catch(() => {})
    await page.waitForTimeout(600)
  }
  // Defensively dismiss anything else lingering.
  await page.keyboard.press('Escape').catch(() => {})
  await page.waitForTimeout(200)

  // ── Set up baseline state via the store ──────────────────────────
  await page.evaluate(() => {
    const store = window.__store
    const s = store.getState()
    // Enable sandbox so builds don't deplete cash.
    if (!s.sandboxMode) s.toggleSandboxMode()
    // Unlock the AI infrastructure + immersion tech.
    store.setState({
      unlockedTech: Array.from(new Set([...(s.unlockedTech ?? []), 'ai_infrastructure', 'immersion_cooling'])),
      suiteTier: 'standard',
      money: 5_000_000,
    })
    // Hire an electrician so dispatchElectrician is unlocked.
    if (!s.staff.some((p) => p.role === 'electrician' && p.onShift)) {
      store.setState({
        staff: [
          ...s.staff,
          { id: 'staff-screencap-1', name: 'Tess Wirex', role: 'electrician', skillLevel: 2, salaryPerTick: 5, hiredAtTick: 0, onShift: true, certifications: [], incidentsResolved: 0, fatigueLevel: 0 },
        ],
      })
    }
    // Place a small GPU pod on the first cabinet row.
    if (store.getState().gpuPods.length === 0) {
      const layout = store.getState().customLayout
        ?? (window.__SUITE_TIERS ? window.__SUITE_TIERS.standard.layout : null)
      const firstRow = layout?.cabinetRows?.[0]?.gridRow ?? 1
      store.getState().createGPUPod('small', 0, firstRow)
    }
    // Tick the world a bunch so fabric activity ramps and history populates.
    for (let i = 0; i < 60; i++) store.getState().tick()
  })

  // The sidebar icons render no title/aria-label, so we open panels by flipping
  // the store's `pendingPanelOpen` field — which is the same handoff the Phaser
  // scene uses when an IB link is clicked.
  const openSidebarPanel = async (panelId) => {
    await page.evaluate((id) => {
      window.__store.setState({ pendingPanelOpen: id })
    }, panelId)
    await page.waitForTimeout(500)
  }
  const dismissAchievement = async () => {
    await page.evaluate(() => {
      const s = window.__store.getState()
      if (s.newAchievement) s.dismissAchievement()
    })
  }
  const coolCabinets = async () => {
    await page.evaluate(() => {
      const s = window.__store.getState()
      window.__store.setState({
        cabinets: s.cabinets.map((c) => ({ ...c, heatLevel: 28 })),
      })
    })
  }

  // ────────────────── #105 Polish — Layers popup ───────────────────
  console.log('→ #105 Polish: Backend Fabric toggle')
  await coolCabinets()
  await dismissAchievement()
  await page.click('button:has-text("LAYERS")', { timeout: 5000 }).catch(() => {})
  await page.waitForTimeout(400)
  await page.screenshot({ path: `${OUT}/polish-layers-popup.png`, fullPage: false })
  // Close popup
  await page.click('button:has-text("LAYERS")').catch(() => {})
  await page.waitForTimeout(200)

  // #105 Polish — pod tooltip ─────────────────────────────────────────
  console.log('→ #105 Polish: Pod power tooltip')
  // Open Build panel via the store pubsub.
  await openSidebarPanel('build')
  await dismissAchievement()
  // Hover the small pod button to surface the tooltip.
  const podBtn = page.locator('button:has-text("Small Pod (64 GPU)")').first()
  if (await podBtn.count()) {
    await podBtn.hover()
    await page.waitForTimeout(900)
    await page.screenshot({ path: `${OUT}/polish-pod-power-tooltip.png`, fullPage: false })
  } else {
    console.warn('  ! Small Pod button not found, skipping tooltip screenshot')
  }

  // ────────────────── #106 Phase 8C — NOC fabric health ──────────
  console.log('→ #106 NOC: fabric health + link list')
  await openSidebarPanel('noc')
  await dismissAchievement()
  await page.waitForTimeout(500)
  await page.screenshot({ path: `${OUT}/noc-fabric-health.png`, fullPage: false })

  // #106 NOC — link detail drawer ─────────────────────────────────────
  console.log('→ #106 NOC: link detail drawer')
  await coolCabinets()
  await dismissAchievement()
  await page.evaluate(() => {
    const linkId = window.__store.getState().ibLinks[0]?.id
    if (linkId) window.__store.getState().openNocDrawer(linkId)
  })
  await page.waitForTimeout(500)
  await page.screenshot({ path: `${OUT}/noc-link-drawer.png`, fullPage: false })
  // Close drawer
  await page.evaluate(() => window.__store.getState().openNocDrawer(null))
  await page.waitForTimeout(300)

  // ────────────────── #107 Phase 8D — AI incident in NOC ─────────
  console.log('→ #107 AI incidents in NOC')
  await page.evaluate(() => {
    const s = window.__store.getState()
    const pod = s.gpuPods[0]
    const link = s.ibLinks[0]
    if (!pod || !link) return
    const defs = window.__INCIDENT_CATALOG ?? null  // not directly available
    // Inject via setState since we don't have direct access to the catalog object
    const fakeDef = (type, label, severity, description, durationTicks, effect) => ({
      type, label, severity, description, durationTicks, resolveCost: 5000, effect, effectMagnitude: 0,
    })
    const now = s.tickCount
    window.__store.setState({
      activeIncidents: [
        ...s.activeIncidents,
        { id: 'inc-screencap-flap', def: fakeDef('ib_link_flap', 'IB Link Flap', 'minor', 'InfiniBand port flapping. Errors accruing fast — drain it or it will degrade the rail.', 25, 'ai_fabric'), ticksRemaining: 20, resolved: false, affectedPodId: pod.id, affectedIbLinkId: link.id },
        { id: 'inc-screencap-hang', def: fakeDef('nccl_collective_hang', 'NCCL Collective Hang', 'major', 'AllReduce stalled across the pod. Pod burning power but doing zero useful work until it recovers.', 20, 'ai_fabric'), ticksRemaining: 14, resolved: false, affectedPodId: pod.id },
      ],
    })
  })
  await page.waitForTimeout(400)
  await dismissAchievement()
  await page.screenshot({ path: `${OUT}/noc-ai-incidents.png`, fullPage: false })

  // #107 cabinet AI alerts ────────────────────────────────────────────
  console.log('→ #107 Cabinet AI alerts')
  // Close the NOC sidebar by clicking the X in its header so the cabinet
  // detail panel has the right side of the screen to itself.
  await page.evaluate(() => {
    const headers = Array.from(document.querySelectorAll('div'))
      .filter((d) => d.textContent?.includes('NOC — TRAFFIC TRIAGE'))
    const closeBtn = headers[0]?.querySelector('button')
    closeBtn?.click()
  })
  await page.waitForTimeout(400)
  await page.evaluate(() => {
    const s = window.__store.getState()
    const cab = s.cabinets.find((c) => c.podId != null)
    if (!cab) return
    window.__store.setState({
      cabinets: s.cabinets.map((c) => c.id === cab.id ? { ...c, eccFaultedGpus: 2 } : c),
      activeIncidents: [
        ...s.activeIncidents.filter((i) => i.def.type !== 'thermal_runaway'),
        {
          id: 'inc-screencap-thermal',
          def: { type: 'thermal_runaway', label: 'Thermal Runaway', severity: 'critical', description: 'High-density cabinet without direct-to-chip cooling is in thermal runaway. Pod will auto-shut within 3 ticks.', durationTicks: 3, resolveCost: 25000, effect: 'ai_cabinet', effectMagnitude: 0 },
          ticksRemaining: 2,
          resolved: false,
          affectedCabinetId: cab.id,
          affectedPodId: cab.podId,
        },
      ],
      selectedCabinetId: cab.id,
    })
  })
  await page.waitForTimeout(700)
  await dismissAchievement()
  await page.screenshot({ path: `${OUT}/cabinet-ai-alerts.png`, fullPage: false })
  // Clear selection + incidents for the next scene.
  await page.evaluate(() => window.__store.setState({ selectedCabinetId: null, activeIncidents: [] }))

  // ────────────────── #108 Phase 8E — BuildPanel training contracts
  console.log('→ #108 BuildPanel training contracts + active job')
  await page.evaluate(() => {
    const s = window.__store.getState()
    const pod = s.gpuPods[0]
    if (!pod) return
    // Force a fresh offer pool with one of each type, then accept the fine-tune
    // one so the per-pod card shows progress.
    const tick = s.tickCount
    const offers = [
      { id: 'tjo-cap-1', jobType: 'pretraining', customerName: 'Helios AI Labs', durationTicks: 175, basePayout: 3_400_000, slaRequirements: { maxRestarts: 0, minThroughputPct: 90, maxIncidents: 1 }, expiresAtTick: tick + 110 },
      { id: 'tjo-cap-2', jobType: 'fine_tuning', customerName: 'QuantStack Research', durationTicks: 60, basePayout: 750_000, slaRequirements: { maxRestarts: 1, minThroughputPct: 80, maxIncidents: 3 }, expiresAtTick: tick + 90 },
      { id: 'tjo-cap-3', jobType: 'inference_batch', customerName: 'Pinnacle Inference', durationTicks: 30, basePayout: 200_000, slaRequirements: { maxRestarts: 2, minThroughputPct: 70, maxIncidents: 5 }, expiresAtTick: tick + 65 },
      { id: 'tjo-cap-4', jobType: 'rl_training', customerName: 'Vector Diligence', durationTicks: 100, basePayout: 1_000_000, slaRequirements: { maxRestarts: 1, minThroughputPct: 85, maxIncidents: 3 }, expiresAtTick: tick + 105 },
    ]
    window.__store.setState({ trainingJobOffers: offers, jobOfferCooldown: 40 })
    window.__store.getState().acceptTrainingContract('tjo-cap-2', pod.id)
    // Run a few ticks for progress to be visible.
    for (let i = 0; i < 20; i++) window.__store.getState().tick()
  })
  await openSidebarPanel('build')
  await dismissAchievement()
  await coolCabinets()
  await page.waitForTimeout(500)
  // Scroll the build panel so the GPU PODS + TRAINING CONTRACTS section is visible.
  await page.evaluate(() => {
    const scrollable = document.querySelector('.flex-1.overflow-y-auto')
    const target = Array.from(document.querySelectorAll('span, div')).find((el) => el.textContent === 'TRAINING CONTRACTS')
    target?.scrollIntoView({ block: 'start', behavior: 'instant' })
    scrollable?.scrollBy({ top: -60 })
  })
  await page.waitForTimeout(300)
  await page.screenshot({ path: `${OUT}/buildpanel-training-contracts.png`, fullPage: false })

  // #108 NOC Jobs tab ─────────────────────────────────────────────────
  console.log('→ #108 NOC Jobs tab')
  await openSidebarPanel('noc')
  await dismissAchievement()
  await page.waitForTimeout(300)
  await page.click('button:has-text("JOBS")').catch(() => {})
  await page.waitForTimeout(400)
  await page.screenshot({ path: `${OUT}/noc-jobs-tab.png`, fullPage: false })

  await ctx.close()
  await browser.close()
  console.log(`\n✓ Screenshots written to ${OUT}/`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
