import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type Phaser from 'phaser'
import { createGame, getScene } from '@/game/PhaserGame'
import {
  LAB_LAYOUT,
  applyOverride,
  buildIBFabrics,
  buildSpecimenScenario,
  buildStressScenario,
  buildTrafficLinks,
} from './specimens'
import type { LabMode, LabScenario, StateOverride } from './specimens'

type Scene = NonNullable<ReturnType<typeof getScene>>

interface ViewportStats {
  fps: number
  objects: number
  zoom: number
}

function populate(scene: Scene, scenario: LabScenario, override: StateOverride) {
  scene.setGridSize(scenario.cols, LAB_LAYOUT.totalGridRows, scenario.spineSlots, LAB_LAYOUT)

  for (const s of scenario.spines) {
    scene.addSpineToScene(s.id)
    if (!s.powerOn) scene.updateSpine(s.id, false)
  }

  for (const c of scenario.cabinets) {
    scene.addCabinetToScene(c.id, c.col, c.row, c.servers, c.leaf, c.environment, c.facing, c.density, c.podId)
  }
  applyCabinetStates(scene, scenario, override)
  scene.syncOccupiedTiles(new Set(scenario.cabinets.map((c) => `${c.col},${c.row}`)))

  scene.setGPUPods(scenario.pods)
  const ib = buildIBFabrics(scenario)
  scene.setInfiniBandFabrics(ib.fabrics, ib.switches, ib.links)

  for (const p of scenario.pdus) scene.addPDUToScene(p.id, p.col, p.row, 'PDU', p.overloaded)
  for (const t of scenario.cableTrays) scene.addCableTrayToScene(t.id, t.col, t.row)
  for (const u of scenario.coolingUnits) scene.addCoolingUnitToScene(u.id, u.col, u.row, u.type, u.operational)
  for (const ch of scenario.chillers) scene.addChillerPlantToScene(ch.id, ch.col, ch.row, ch.tier, ch.operational)

  scene.setTrafficLinks(buildTrafficLinks(scenario))
}

function applyCabinetStates(scene: Scene, scenario: LabScenario, override: StateOverride) {
  for (const c of scenario.cabinets) {
    const { powerOn, visual } = applyOverride(c, override)
    scene.updateCabinet(c.id, c.servers, c.leaf, powerOn, c.environment, c.facing, visual, c.density, c.podId)
  }
}

interface ViewportProps {
  containerId: string
  title: string
  scenario: LabScenario
  override: StateOverride
  trafficOn: boolean
  fabricOn: boolean
  zoom: number
  resetToken: number
  onStats: (stats: ViewportStats) => void
}

function LabViewport({ containerId, title, scenario, override, trafficOn, fabricOn, zoom, resetToken, onStats }: ViewportProps) {
  const gameRef = useRef<Phaser.Game | null>(null)
  const [scene, setScene] = useState<Scene | null>(null)
  // Boot a fresh Phaser game per scenario; the scene starts asynchronously.
  // The per-control effects below all depend on `scene`, so they apply the
  // current control values as soon as it is published.
  useEffect(() => {
    const game = createGame(containerId)
    gameRef.current = game
    let resetTimer: ReturnType<typeof setTimeout> | undefined
    const poll = setInterval(() => {
      const s = getScene(game)
      if (!s || !s.sys.isActive()) return
      clearInterval(poll)
      populate(s, scenario, 'none')
      // addCabinetToScene pans the camera to each new cabinet; recentre once those pans finish.
      resetTimer = setTimeout(() => {
        s.resetCamera()
        setScene(s)
      }, 450)
    }, 50)
    return () => {
      clearInterval(poll)
      if (resetTimer) clearTimeout(resetTimer)
      setScene(null)
      gameRef.current = null
      game.destroy(true)
    }
  }, [containerId, scenario])

  useEffect(() => {
    if (scene) applyCabinetStates(scene, scenario, override)
  }, [scene, scenario, override])

  useEffect(() => {
    scene?.setTrafficVisible(trafficOn)
  }, [scene, trafficOn])

  useEffect(() => {
    scene?.setBackendFabricVisible(fabricOn)
  }, [scene, fabricOn])

  useEffect(() => {
    if (scene && Math.abs(scene.getCameraZoom() - zoom) > 0.001) scene.setCameraZoom(zoom)
  }, [scene, zoom])

  useEffect(() => {
    if (!scene || resetToken === 0) return
    scene.resetCamera()
  }, [scene, resetToken])

  useEffect(() => {
    if (!scene) return
    const id = setInterval(() => {
      const game = gameRef.current
      if (!game) return
      onStats({ fps: game.loop.actualFps, objects: scene.children.length, zoom: scene.getCameraZoom() })
    }, 500)
    return () => clearInterval(id)
  }, [scene, onStats])

  return (
    <div className="relative flex-1 min-w-0 border border-border rounded-md overflow-hidden bg-[#070b10]">
      <div className="absolute top-2 left-2 z-10 text-[10px] font-mono tracking-widest text-neon-cyan bg-black/60 border border-neon-cyan/30 rounded px-2 py-0.5 pointer-events-none">
        {title}
      </div>
      <div id={containerId} className="w-full h-full" />
    </div>
  )
}

const OVERRIDES: { value: StateOverride; label: string }[] = [
  { value: 'none', label: 'As specified' },
  { value: 'warm', label: 'Warm (65°C)' },
  { value: 'throttled', label: 'Throttled (85°C)' },
  { value: 'fire', label: 'On fire' },
  { value: 'incident', label: 'Incident' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'offline', label: 'Powered off' },
  { value: 'aging', label: 'Aging servers' },
]

export function LabApp() {
  const [mode, setMode] = useState<LabMode>('specimens')
  const [override, setOverride] = useState<StateOverride>('none')
  const [trafficOn, setTrafficOn] = useState(true)
  const [fabricOn, setFabricOn] = useState(true)
  const [zoom, setZoom] = useState(1)
  const [resetToken, setResetToken] = useState(0)
  const [stats, setStats] = useState<ViewportStats>({ fps: 0, objects: 0, zoom: 1 })

  const scenario = useMemo(() => (mode === 'stress' ? buildStressScenario() : buildSpecimenScenario()), [mode])

  // Keep the slider in sync with wheel / pinch zoom inside the canvas
  const onStats = useCallback((s: ViewportStats) => {
    setStats(s)
    setZoom((z) => (Math.abs(z - s.zoom) > 0.001 ? s.zoom : z))
  }, [])

  return (
    <div className="h-screen flex flex-col bg-background text-foreground font-mono">
      <header className="flex flex-wrap items-center gap-x-5 gap-y-2 px-4 py-2 border-b border-border text-[11px]">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-bold tracking-widest text-neon-green">HARDWARE LAB</span>
          <span className="text-muted-foreground">dev / preview only</span>
        </div>

        <label className="flex items-center gap-1.5">
          <span className="text-muted-foreground">Scene</span>
          <select className="bg-card border border-border rounded px-1.5 py-0.5" value={mode} onChange={(e) => setMode(e.target.value as LabMode)}>
            <option value="specimens">Specimen grid</option>
            <option value="stress">Stress test (50 cabinets)</option>
          </select>
        </label>

        <label className="flex items-center gap-1.5">
          <span className="text-muted-foreground">Force state</span>
          <select className="bg-card border border-border rounded px-1.5 py-0.5" value={override} onChange={(e) => setOverride(e.target.value as StateOverride)}>
            {OVERRIDES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </label>

        <label className="flex items-center gap-1.5">
          <input type="checkbox" checked={trafficOn} onChange={(e) => setTrafficOn(e.target.checked)} className="accent-neon-green" />
          Traffic
        </label>
        <label className="flex items-center gap-1.5">
          <input type="checkbox" checked={fabricOn} onChange={(e) => setFabricOn(e.target.checked)} className="accent-neon-green" />
          InfiniBand
        </label>

        <label className="flex items-center gap-1.5">
          <span className="text-muted-foreground">Zoom</span>
          <input type="range" min={0.3} max={2.5} step={0.05} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="w-28 accent-neon-green" />
          <span className="w-9 tabular-nums">{zoom.toFixed(2)}×</span>
        </label>
        <button className="border border-border rounded px-2 py-0.5 hover:border-neon-green/50" onClick={() => { setZoom(1); setResetToken((t) => t + 1) }}>
          Reset camera
        </button>

        <div className="ml-auto flex gap-3 tabular-nums text-muted-foreground">
          <span>FPS <span className={stats.fps >= 55 ? 'text-neon-green' : stats.fps >= 30 ? 'text-neon-yellow' : 'text-neon-red'}>{stats.fps.toFixed(0)}</span></span>
          <span>Objects <span className="text-foreground">{stats.objects}</span></span>
        </div>
      </header>

      <main className="flex-1 min-h-0 flex gap-2 p-2">
        <LabViewport
          key={mode}
          containerId="lab-view-main"
          title="CLASSIC"
          scenario={scenario}
          override={override}
          trafficOn={trafficOn}
          fabricOn={fabricOn}
          zoom={zoom}
          resetToken={resetToken}
          onStats={onStats}
        />
      </main>

      <footer className="px-4 py-2 border-t border-border text-[10px] text-muted-foreground grid gap-0.5">
        {scenario.rowLegend.map((r) => (
          <div key={r.gridRow}><span className="text-neon-cyan">Row {r.gridRow}</span> · {r.label}</div>
        ))}
        <div>Click a cabinet to test selection, hover to test highlight, drag to pan, scroll to zoom.</div>
      </footer>
    </div>
  )
}
