import { useEffect, useRef } from 'react'
import type Phaser from 'phaser'
import { createGame, getScene } from '@/game/PhaserGame'
import { useGameStore } from '@/stores/gameStore'

export function GameCanvas() {
  const gameRef = useRef<Phaser.Game | null>(null)
  const prevRackCount = useRef(0)

  const racks = useGameStore((s) => s.racks)

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

  return (
    <div
      id="phaser-container"
      className="rounded-lg border border-border overflow-hidden"
    />
  )
}
