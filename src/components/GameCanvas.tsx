import { useEffect, useRef } from 'react'
import type Phaser from 'phaser'
import { createGame, getScene } from '@/game/PhaserGame'
import { useGameStore } from '@/stores/gameStore'

export function GameCanvas() {
  const gameRef = useRef<Phaser.Game | null>(null)
  const prevRackCount = useRef(0)

  const racks = useGameStore((s) => s.racks)
  const viewMode = useGameStore((s) => s.viewMode)

  useEffect(() => {
    if (!gameRef.current) {
      gameRef.current = createGame('phaser-container')
    }

    return () => {
      gameRef.current?.destroy(true)
      gameRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!gameRef.current) return
    const scene = getScene(gameRef.current)
    if (!scene) return

    // Add new racks to the scene
    for (let i = prevRackCount.current; i < racks.length; i++) {
      scene.addRackToScene(racks[i].id, racks[i].type)
    }
    prevRackCount.current = racks.length

    // Sync power status
    for (const rack of racks) {
      scene.toggleRackPower(rack.id, rack.powerStatus)
    }
  }, [racks])

  // Sync view mode to Phaser
  useEffect(() => {
    if (!gameRef.current) return
    const scene = getScene(gameRef.current)
    if (!scene) return
    scene.setViewMode(viewMode)
  }, [viewMode])

  return (
    <div
      id="phaser-container"
      className="w-full h-full rounded-lg border border-border overflow-hidden relative scanlines glow-green"
      style={{ background: 'linear-gradient(180deg, #060a10 0%, #0a1018 50%, #060a10 100%)' }}
    />
  )
}
