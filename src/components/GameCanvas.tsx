import { useEffect, useRef, useCallback, useState } from 'react'
import type Phaser from 'phaser'
import { createGame, getScene } from '@/game/PhaserGame'
import { useGameStore, getSuiteLimits, getPlacementHints } from '@/stores/gameStore'
import { Crosshair } from 'lucide-react'

export function GameCanvas() {
  const gameRef = useRef<Phaser.Game | null>(null)
  const prevCabCount = useRef(0)
  const prevSpineCount = useRef(0)
  // Incremented once when Phaser scene finishes booting, so all sync
  // effects re-run against the now-ready scene (fixes demo-mode load
  // where state is populated before Phaser's async create() completes).
  const [sceneReady, setSceneReady] = useState(false)

  const cabinets = useGameStore((s) => s.cabinets)
  const spineSwitches = useGameStore((s) => s.spineSwitches)
  const layerVisibility = useGameStore((s) => s.layerVisibility)
  const layerOpacity = useGameStore((s) => s.layerOpacity)
  const layerColors = useGameStore((s) => s.layerColors)
  const trafficStats = useGameStore((s) => s.trafficStats)
  const trafficVisible = useGameStore((s) => s.trafficVisible)
  const suiteTier = useGameStore((s) => s.suiteTier)
  const placementMode = useGameStore((s) => s.placementMode)
  const pdus = useGameStore((s) => s.pdus)
  const cableTrays = useGameStore((s) => s.cableTrays)
  const pduOverloaded = useGameStore((s) => s.pduOverloaded)
  const heatMapVisible = useGameStore((s) => s.heatMapVisible)

  // Tile click handler — called from Phaser when user clicks a grid tile
  const handleTileClick = useCallback((col: number, row: number) => {
    const state = useGameStore.getState()
    if (!state.placementMode) return
    state.addCabinet(col, row, state.placementEnvironment, state.placementCustomerType, state.placementFacing)
  }, [])

  // Tile hover handler — returns placement hints for the hovered tile
  const handleTileHover = useCallback((col: number, row: number) => {
    const state = useGameStore.getState()
    return getPlacementHints(col, row, state.cabinets, state.suiteTier)
  }, [])

  // Cabinet selection handler — called from Phaser when user clicks a cabinet
  const handleCabinetSelect = useCallback((id: string | null) => {
    useGameStore.getState().selectCabinet(id)
  }, [])

  useEffect(() => {
    if (!gameRef.current) {
      gameRef.current = createGame('phaser-container')
    }

    // Phaser scene boots asynchronously — poll until create() has run,
    // then flip sceneReady so every sync effect re-fires against the
    // now-available scene.  This is critical for demo mode where state
    // is populated on the same tick as the Phaser game is created.
    const poll = setInterval(() => {
      if (gameRef.current && getScene(gameRef.current)) {
        setSceneReady(true)
        clearInterval(poll)
      }
    }, 50)

    return () => {
      clearInterval(poll)
      gameRef.current?.destroy(true)
      gameRef.current = null
    }
  }, [])

  // Sync placement mode to Phaser and register tile callbacks
  // Callbacks are registered here (not in a separate mount-time effect) because
  // the Phaser scene boots asynchronously and isn't ready on initial mount.
  // By the time the user enters placement mode, the scene is guaranteed to exist.
  useEffect(() => {
    if (!gameRef.current) return
    const scene = getScene(gameRef.current)
    if (!scene) return
    scene.setOnTileClick(handleTileClick)
    scene.setOnTileHover(handleTileHover)
    scene.setOnCabinetSelect(handleCabinetSelect)
    scene.setPlacementMode(placementMode)
    // Clear cabinet selection when entering placement mode
    if (placementMode) {
      scene.clearSelection()
      useGameStore.getState().selectCabinet(null)
    }
  }, [placementMode, handleTileClick, handleTileHover, handleCabinetSelect, sceneReady])

  // Sync suite tier (grid dimensions) to Phaser
  useEffect(() => {
    if (!gameRef.current) return
    const scene = getScene(gameRef.current)
    if (!scene) return
    const limits = getSuiteLimits(suiteTier)
    scene.setGridSize(limits.cols, limits.rows, limits.maxSpines)
  }, [suiteTier, sceneReady])

  // Sync cabinets to Phaser
  useEffect(() => {
    if (!gameRef.current) return
    const scene = getScene(gameRef.current)
    if (!scene) return

    // Add new cabinets (with explicit positions)
    for (let i = prevCabCount.current; i < cabinets.length; i++) {
      const cab = cabinets[i]
      scene.addCabinetToScene(cab.id, cab.col, cab.row, cab.serverCount, cab.hasLeafSwitch, cab.environment, cab.facing)
    }
    prevCabCount.current = cabinets.length

    // Update all existing cabinets (server count, leaf switch, power, environment, facing may have changed)
    for (const cab of cabinets) {
      scene.updateCabinet(cab.id, cab.serverCount, cab.hasLeafSwitch, cab.powerStatus, cab.environment, cab.facing)
    }

    // Sync occupied tiles
    const occupied = new Set<string>(cabinets.map((c) => `${c.col},${c.row}`))
    scene.syncOccupiedTiles(occupied)
  }, [cabinets, sceneReady])

  // Sync spine switches to Phaser
  useEffect(() => {
    if (!gameRef.current) return
    const scene = getScene(gameRef.current)
    if (!scene) return

    // Add new spines
    for (let i = prevSpineCount.current; i < spineSwitches.length; i++) {
      scene.addSpineToScene(spineSwitches[i].id)
    }
    prevSpineCount.current = spineSwitches.length

    // Update power status
    for (const spine of spineSwitches) {
      scene.updateSpine(spine.id, spine.powerStatus)
    }
  }, [spineSwitches, sceneReady])

  // Sync layer visibility to Phaser
  useEffect(() => {
    if (!gameRef.current) return
    const scene = getScene(gameRef.current)
    if (!scene) return
    scene.setLayerVisibility(layerVisibility)
  }, [layerVisibility, sceneReady])

  // Sync layer opacity to Phaser
  useEffect(() => {
    if (!gameRef.current) return
    const scene = getScene(gameRef.current)
    if (!scene) return
    scene.setLayerOpacity(layerOpacity)
  }, [layerOpacity, sceneReady])

  // Sync layer colors to Phaser
  useEffect(() => {
    if (!gameRef.current) return
    const scene = getScene(gameRef.current)
    if (!scene) return
    scene.setLayerColors(layerColors)
  }, [layerColors, sceneReady])

  // Sync traffic data to Phaser
  useEffect(() => {
    if (!gameRef.current) return
    const scene = getScene(gameRef.current)
    if (!scene) return
    scene.setTrafficLinks(trafficStats.links)
  }, [trafficStats, sceneReady])

  // Sync PDUs to Phaser
  useEffect(() => {
    if (!gameRef.current) return
    const scene = getScene(gameRef.current)
    if (!scene) return

    // Re-render all PDUs (clear + add)
    scene.clearInfrastructure()
    for (const pdu of pdus) {
      const state = useGameStore.getState()
      const overloaded = state.pduOverloaded
      scene.addPDUToScene(pdu.id, pdu.col, pdu.row, pdu.label, overloaded)
    }
    for (const tray of cableTrays) {
      scene.addCableTrayToScene(tray.id, tray.col, tray.row)
    }
  }, [pdus, cableTrays, pduOverloaded, sceneReady])

  // Sync traffic visibility to Phaser
  useEffect(() => {
    if (!gameRef.current) return
    const scene = getScene(gameRef.current)
    if (!scene) return
    scene.setTrafficVisible(trafficVisible)
  }, [trafficVisible, sceneReady])

  // Sync heat map visibility to Phaser
  useEffect(() => {
    if (!gameRef.current) return
    const scene = getScene(gameRef.current)
    if (!scene) return
    scene.setHeatMapVisible(heatMapVisible)
  }, [heatMapVisible, sceneReady])

  const handleCenterGrid = useCallback(() => {
    if (gameRef.current) {
      const scene = getScene(gameRef.current)
      scene?.resetCamera()
    }
  }, [])

  return (
    <div
      id="phaser-container"
      className={`w-full h-full rounded-lg border overflow-hidden relative scanlines ${
        placementMode
          ? 'border-neon-green/60 glow-green ring-1 ring-neon-green/30'
          : 'border-border glow-green'
      }`}
      style={{ background: 'linear-gradient(180deg, #060a10 0%, #0a1018 50%, #060a10 100%)' }}
      onContextMenu={(e) => e.preventDefault()}
    >
      <button
        onClick={handleCenterGrid}
        className="absolute top-3 right-[7rem] z-10 p-1.5 rounded bg-black/60 border border-neon-green/30 text-neon-green/70 hover:text-neon-green hover:border-neon-green/60 transition-colors cursor-pointer"
        title="Center grid (reset pan & zoom)"
      >
        <Crosshair size={14} />
      </button>
    </div>
  )
}
