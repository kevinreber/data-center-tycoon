import { useEffect, useRef, useCallback } from 'react'
import type Phaser from 'phaser'
import { createGame, getScene } from '@/game/PhaserGame'
import { useGameStore, getSuiteLimits, getPlacementHints } from '@/stores/gameStore'

export function GameCanvas() {
  const gameRef = useRef<Phaser.Game | null>(null)
  const prevCabCount = useRef(0)
  const prevSpineCount = useRef(0)

  const cabinets = useGameStore((s) => s.cabinets)
  const spineSwitches = useGameStore((s) => s.spineSwitches)
  const layerVisibility = useGameStore((s) => s.layerVisibility)
  const layerOpacity = useGameStore((s) => s.layerOpacity)
  const layerColors = useGameStore((s) => s.layerColors)
  const trafficStats = useGameStore((s) => s.trafficStats)
  const trafficVisible = useGameStore((s) => s.trafficVisible)
  const suiteTier = useGameStore((s) => s.suiteTier)
  const placementMode = useGameStore((s) => s.placementMode)

  // Tile click handler — called from Phaser when user clicks a grid tile
  const handleTileClick = useCallback((col: number, row: number) => {
    const state = useGameStore.getState()
    if (!state.placementMode) return
    state.addCabinet(col, row, state.placementEnvironment, state.placementCustomerType)
  }, [])

  // Tile hover handler — returns placement hints for the hovered tile
  const handleTileHover = useCallback((col: number, row: number) => {
    const state = useGameStore.getState()
    return getPlacementHints(col, row, state.cabinets, state.suiteTier)
  }, [])

  useEffect(() => {
    if (!gameRef.current) {
      gameRef.current = createGame('phaser-container')
    }

    return () => {
      gameRef.current?.destroy(true)
      gameRef.current = null
    }
  }, [])

  // Register callbacks on scene once it's ready
  useEffect(() => {
    if (!gameRef.current) return
    const scene = getScene(gameRef.current)
    if (!scene) return
    scene.setOnTileClick(handleTileClick)
    scene.setOnTileHover(handleTileHover)
  }, [handleTileClick, handleTileHover])

  // Sync placement mode to Phaser
  useEffect(() => {
    if (!gameRef.current) return
    const scene = getScene(gameRef.current)
    if (!scene) return
    scene.setPlacementMode(placementMode)
  }, [placementMode])

  // Sync suite tier (grid dimensions) to Phaser
  useEffect(() => {
    if (!gameRef.current) return
    const scene = getScene(gameRef.current)
    if (!scene) return
    const limits = getSuiteLimits(suiteTier)
    scene.setGridSize(limits.cols, limits.rows, limits.maxSpines)
  }, [suiteTier])

  // Sync cabinets to Phaser
  useEffect(() => {
    if (!gameRef.current) return
    const scene = getScene(gameRef.current)
    if (!scene) return

    // Add new cabinets (with explicit positions)
    for (let i = prevCabCount.current; i < cabinets.length; i++) {
      const cab = cabinets[i]
      scene.addCabinetToScene(cab.id, cab.col, cab.row, cab.serverCount, cab.hasLeafSwitch, cab.environment)
    }
    prevCabCount.current = cabinets.length

    // Update all existing cabinets (server count, leaf switch, power, environment may have changed)
    for (const cab of cabinets) {
      scene.updateCabinet(cab.id, cab.serverCount, cab.hasLeafSwitch, cab.powerStatus, cab.environment)
    }

    // Sync occupied tiles
    const occupied = new Set<string>(cabinets.map((c) => `${c.col},${c.row}`))
    scene.syncOccupiedTiles(occupied)
  }, [cabinets])

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
  }, [spineSwitches])

  // Sync layer visibility to Phaser
  useEffect(() => {
    if (!gameRef.current) return
    const scene = getScene(gameRef.current)
    if (!scene) return
    scene.setLayerVisibility(layerVisibility)
  }, [layerVisibility])

  // Sync layer opacity to Phaser
  useEffect(() => {
    if (!gameRef.current) return
    const scene = getScene(gameRef.current)
    if (!scene) return
    scene.setLayerOpacity(layerOpacity)
  }, [layerOpacity])

  // Sync layer colors to Phaser
  useEffect(() => {
    if (!gameRef.current) return
    const scene = getScene(gameRef.current)
    if (!scene) return
    scene.setLayerColors(layerColors)
  }, [layerColors])

  // Sync traffic data to Phaser
  useEffect(() => {
    if (!gameRef.current) return
    const scene = getScene(gameRef.current)
    if (!scene) return
    scene.setTrafficLinks(trafficStats.links)
  }, [trafficStats])

  // Sync traffic visibility to Phaser
  useEffect(() => {
    if (!gameRef.current) return
    const scene = getScene(gameRef.current)
    if (!scene) return
    scene.setTrafficVisible(trafficVisible)
  }, [trafficVisible])

  return (
    <div
      id="phaser-container"
      className={`w-full h-full rounded-lg border overflow-hidden relative scanlines ${
        placementMode
          ? 'border-neon-green/60 glow-green ring-1 ring-neon-green/30'
          : 'border-border glow-green'
      }`}
      style={{ background: 'linear-gradient(180deg, #060a10 0%, #0a1018 50%, #060a10 100%)' }}
    />
  )
}
