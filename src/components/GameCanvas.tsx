import { useEffect, useRef } from 'react'
import type Phaser from 'phaser'
import { createGame, getScene } from '@/game/PhaserGame'
import { useGameStore } from '@/stores/gameStore'

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

  useEffect(() => {
    if (!gameRef.current) {
      gameRef.current = createGame('phaser-container')
    }

    return () => {
      gameRef.current?.destroy(true)
      gameRef.current = null
    }
  }, [])

  // Sync cabinets to Phaser
  useEffect(() => {
    if (!gameRef.current) return
    const scene = getScene(gameRef.current)
    if (!scene) return

    // Add new cabinets
    for (let i = prevCabCount.current; i < cabinets.length; i++) {
      const cab = cabinets[i]
      scene.addCabinetToScene(cab.id, cab.serverCount, cab.hasLeafSwitch)
    }
    prevCabCount.current = cabinets.length

    // Update all existing cabinets (server count, leaf switch, power may have changed)
    for (const cab of cabinets) {
      scene.updateCabinet(cab.id, cab.serverCount, cab.hasLeafSwitch, cab.powerStatus)
    }
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
      className="w-full h-full rounded-lg border border-border overflow-hidden relative scanlines glow-green"
      style={{ background: 'linear-gradient(180deg, #060a10 0%, #0a1018 50%, #060a10 100%)' }}
    />
  )
}
