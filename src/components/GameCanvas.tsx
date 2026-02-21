import { useEffect, useRef, useCallback, useState } from 'react'
import type Phaser from 'phaser'
import { createGame, getScene } from '@/game/PhaserGame'
import { useGameStore, getSuiteLimits, getPlacementHints, SUITE_TIERS, ENVIRONMENT_CONFIG, CUSTOMER_TYPE_CONFIG } from '@/stores/gameStore'
import { SIM } from '@/stores/constants'
import type { DedicatedRowInfo } from '@/stores/gameStore'
import { Crosshair } from 'lucide-react'

export function GameCanvas() {
  const gameRef = useRef<Phaser.Game | null>(null)
  const prevCabCount = useRef(0)
  const prevSpineCount = useRef(0)
  // Incremented once when Phaser scene finishes booting, so all sync
  // effects re-run against the now-ready scene (fixes demo-mode load
  // where state is populated before Phaser's async create() completes).
  const [sceneReady, setSceneReady] = useState(false)
  // Track the active site so we can detect switches and do a full re-render
  const prevSiteId = useRef<string | null>(null)

  const cabinets = useGameStore((s) => s.cabinets)
  const spineSwitches = useGameStore((s) => s.spineSwitches)
  const layerVisibility = useGameStore((s) => s.layerVisibility)
  const layerOpacity = useGameStore((s) => s.layerOpacity)
  const layerColors = useGameStore((s) => s.layerColors)
  const trafficStats = useGameStore((s) => s.trafficStats)
  const trafficVisible = useGameStore((s) => s.trafficVisible)
  const suiteTier = useGameStore((s) => s.suiteTier)
  const placementMode = useGameStore((s) => s.placementMode)
  const placementFacing = useGameStore((s) => s.placementFacing)
  const pdus = useGameStore((s) => s.pdus)
  const cableTrays = useGameStore((s) => s.cableTrays)
  const pduOverloaded = useGameStore((s) => s.pduOverloaded)
  const heatMapVisible = useGameStore((s) => s.heatMapVisible)
  const fireActive = useGameStore((s) => s.fireActive)
  const activeIncidents = useGameStore((s) => s.activeIncidents)
  const maintenanceWindows = useGameStore((s) => s.maintenanceWindows)
  const aisleContainments = useGameStore((s) => s.aisleContainments)
  const zones = useGameStore((s) => s.zones)
  const dedicatedRows = useGameStore((s) => s.dedicatedRows)
  const coolingUnits = useGameStore((s) => s.coolingUnits)
  const chillerPlants = useGameStore((s) => s.chillerPlants)
  const coolingPipes = useGameStore((s) => s.coolingPipes)
  const viewMode = useGameStore((s) => s.viewMode)
  const rowEndSlots = useGameStore((s) => s.rowEndSlots)
  const audioSettings = useGameStore((s) => s.audioSettings)
  const activeSiteId = useGameStore((s) => s.activeSiteId)

  // ── Detect site switch and trigger full Phaser re-render ─────────
  useEffect(() => {
    if (!gameRef.current || !sceneReady) return
    // Skip initial render — only trigger on actual switches
    if (prevSiteId.current === activeSiteId) return
    prevSiteId.current = activeSiteId

    const scene = getScene(gameRef.current)
    if (!scene) return

    // Reset ref counters so all cabinets/spines are re-added from scratch
    prevCabCount.current = 0
    prevSpineCount.current = 0

    // Clear all scene objects (will be rebuilt by subsequent sync effects)
    scene.clearAllCabinets()
    scene.clearAllSpines()
    scene.clearInfrastructure()
    scene.clearCoolingUnits()
    scene.clearChillerPlants()
    scene.clearCoolingPipes()

    // Re-sync grid size for the current suite tier
    const state = useGameStore.getState()
    const limits = getSuiteLimits(state.suiteTier)
    const layout = SUITE_TIERS[state.suiteTier].layout
    scene.setGridSize(limits.cols, layout.totalGridRows, limits.maxSpines, layout)
  }, [activeSiteId, sceneReady])

  // Tile click handler — called from Phaser when user clicks a grid tile
  const handleTileClick = useCallback((col: number, row: number) => {
    const state = useGameStore.getState()
    if (!state.placementMode) return
    state.addCabinet(col, row, state.placementEnvironment, state.placementCustomerType, state.placementFacing)
  }, [])

  // Tile hover handler — returns placement hints for the hovered tile
  const handleTileHover = useCallback((col: number, row: number) => {
    const state = useGameStore.getState()
    return getPlacementHints(col, row, state.cabinets, state.suiteTier, state.placementEnvironment, state.placementCustomerType)
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

  // Sync placement facing to Phaser (updates zone overlays when user changes direction)
  useEffect(() => {
    if (!gameRef.current) return
    const scene = getScene(gameRef.current)
    if (!scene) return
    scene.setPlacementFacing(placementFacing)
  }, [placementFacing, sceneReady])

  // Keyboard shortcuts during placement mode (R = rotate facing, Esc = cancel)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const state = useGameStore.getState()
      if (!state.placementMode) return
      if (e.key === 'r' || e.key === 'R') {
        state.togglePlacementFacing()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Sync suite tier (grid dimensions + row layout) to Phaser
  useEffect(() => {
    if (!gameRef.current) return
    const scene = getScene(gameRef.current)
    if (!scene) return
    const limits = getSuiteLimits(suiteTier)
    const layout = SUITE_TIERS[suiteTier].layout
    // Use totalGridRows as the visual row count (includes aisles + corridors)
    scene.setGridSize(limits.cols, layout.totalGridRows, limits.maxSpines, layout)
  }, [suiteTier, sceneReady])

  // Sync cabinets to Phaser (including visual state for state differentiation)
  useEffect(() => {
    if (!gameRef.current) return
    const scene = getScene(gameRef.current)
    if (!scene) return

    // Build sets of cabinet IDs with active incidents or maintenance
    const incidentCabIds = new Set<string>()
    for (const incident of activeIncidents) {
      if (!incident.resolved && incident.affectedHardwareId) {
        incidentCabIds.add(incident.affectedHardwareId)
      }
    }
    const maintCabIds = new Set<string>()
    for (const mw of maintenanceWindows) {
      if (mw.targetType === 'cabinet' && mw.status !== 'completed') {
        maintCabIds.add(mw.targetId)
      }
    }

    // Add new cabinets (with explicit positions)
    for (let i = prevCabCount.current; i < cabinets.length; i++) {
      const cab = cabinets[i]
      scene.addCabinetToScene(cab.id, cab.col, cab.row, cab.serverCount, cab.hasLeafSwitch, cab.environment, cab.facing)
    }
    prevCabCount.current = cabinets.length

    // Update all existing cabinets (server count, leaf switch, power, environment, facing, visual state)
    for (const cab of cabinets) {
      scene.updateCabinet(cab.id, cab.serverCount, cab.hasLeafSwitch, cab.powerStatus, cab.environment, cab.facing, {
        heatLevel: cab.heatLevel,
        isThrottled: cab.heatLevel >= SIM.throttleTemp && cab.powerStatus,
        isOnFire: fireActive && cab.heatLevel >= SIM.criticalTemp,
        hasIncident: incidentCabIds.has(cab.id),
        inMaintenance: maintCabIds.has(cab.id),
        serverAge: cab.serverAge,
      })
    }

    // Sync occupied tiles
    const occupied = new Set<string>(cabinets.map((c) => `${c.col},${c.row}`))
    scene.syncOccupiedTiles(occupied)
  }, [cabinets, fireActive, activeIncidents, maintenanceWindows, sceneReady])

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

  // Sync cooling units to Phaser
  useEffect(() => {
    if (!gameRef.current) return
    const scene = getScene(gameRef.current)
    if (!scene) return

    // Clear and rebuild all cooling units each time state changes
    scene.clearCoolingUnits()
    for (const unit of coolingUnits) {
      scene.addCoolingUnitToScene(unit.id, unit.col, unit.row, unit.type, unit.operational)
    }
  }, [coolingUnits, sceneReady])

  // Sync chiller plants to Phaser
  useEffect(() => {
    if (!gameRef.current) return
    const scene = getScene(gameRef.current)
    if (!scene) return

    scene.clearChillerPlants()
    for (const plant of chillerPlants) {
      scene.addChillerPlantToScene(plant.id, plant.col, plant.row, plant.tier, plant.operational)
    }
  }, [chillerPlants, sceneReady])

  // Sync cooling pipes to Phaser
  useEffect(() => {
    if (!gameRef.current) return
    const scene = getScene(gameRef.current)
    if (!scene) return

    scene.clearCoolingPipes()
    for (const pipe of coolingPipes) {
      scene.addCoolingPipeToScene(pipe.id, pipe.col, pipe.row)
    }
  }, [coolingPipes, sceneReady])

  // Sync traffic visibility to Phaser
  useEffect(() => {
    if (!gameRef.current) return
    const scene = getScene(gameRef.current)
    if (!scene) return
    scene.setTrafficVisible(trafficVisible)
  }, [trafficVisible, sceneReady])

  // Sync heat map visibility to Phaser (re-render when cabinets change to update temperatures)
  useEffect(() => {
    if (!gameRef.current) return
    const scene = getScene(gameRef.current)
    if (!scene) return
    scene.setHeatMapVisible(heatMapVisible)
  }, [heatMapVisible, cabinets, sceneReady])

  // Sync aisle containment state to Phaser
  useEffect(() => {
    if (!gameRef.current) return
    const scene = getScene(gameRef.current)
    if (!scene) return
    scene.setAisleContainments(aisleContainments)
  }, [aisleContainments, sceneReady])

  // Sync zone outlines to Phaser
  useEffect(() => {
    if (!gameRef.current) return
    const scene = getScene(gameRef.current)
    if (!scene) return
    const zoneData = zones.map((z) => {
      const color = z.type === 'environment'
        ? ENVIRONMENT_CONFIG[z.key as keyof typeof ENVIRONMENT_CONFIG].color
        : CUSTOMER_TYPE_CONFIG[z.key as keyof typeof CUSTOMER_TYPE_CONFIG].color
      return { tiles: z.tiles, color }
    })
    scene.setZones(zoneData)
  }, [zones, sceneReady])

  // Sync dedicated row highlights to Phaser
  useEffect(() => {
    if (!gameRef.current) return
    const scene = getScene(gameRef.current)
    if (!scene) return
    const rowData = dedicatedRows.map((r: DedicatedRowInfo) => ({
      gridRow: r.gridRow,
      color: ENVIRONMENT_CONFIG[r.environment].color,
    }))
    scene.setDedicatedRows(rowData)
  }, [dedicatedRows, sceneReady])

  // Sync view mode to Phaser
  useEffect(() => {
    if (!gameRef.current) return
    const scene = getScene(gameRef.current)
    if (!scene) return
    scene.setViewMode(viewMode)
  }, [viewMode, sceneReady])

  // Sync row-end slots to Phaser
  useEffect(() => {
    if (!gameRef.current) return
    const scene = getScene(gameRef.current)
    if (!scene) return
    scene.setRowEndSlots(rowEndSlots)
  }, [rowEndSlots, sceneReady])

  // Sync audio settings to Phaser
  useEffect(() => {
    if (!gameRef.current) return
    const scene = getScene(gameRef.current)
    if (!scene) return
    scene.initAudio()
    scene.setAudioSettings(audioSettings.muted, audioSettings.masterVolume, audioSettings.sfxVolume, audioSettings.ambientVolume)
  }, [audioSettings, sceneReady])

  // Dispatch floating text events from store to Phaser each tick
  const tickCount = useGameStore((s) => s.tickCount)
  useEffect(() => {
    if (!gameRef.current) return
    const scene = getScene(gameRef.current)
    if (!scene) return
    const state = useGameStore.getState()
    const texts = state.pendingFloatingTexts
    if (texts.length === 0) return
    useGameStore.setState({ pendingFloatingTexts: [] })
    for (const evt of texts) {
      if (evt.center) {
        scene.spawnCenterText(evt.text, evt.color, evt.fontSize)
      } else if (evt.col != null && evt.row != null) {
        scene.spawnFloatingText(evt.col, evt.row, evt.text, evt.color, evt.fontSize)
      }
    }
  }, [tickCount, sceneReady])

  // Dispatch camera effects from store to Phaser (fires on tick or non-tick triggers like suite upgrade)
  const pendingCameraEffects = useGameStore((s) => s.pendingCameraEffects)
  useEffect(() => {
    if (!gameRef.current || pendingCameraEffects.length === 0) return
    const scene = getScene(gameRef.current)
    if (!scene) return
    useGameStore.setState({ pendingCameraEffects: [] })
    for (const fx of pendingCameraEffects) {
      switch (fx.type) {
        case 'shake_light': scene.cameraShake('light'); break
        case 'shake_medium': scene.cameraShake('medium'); break
        case 'shake_heavy': scene.cameraShake('heavy'); break
        case 'zoom_pulse': scene.cameraZoomPulse(); break
        case 'zoom_reveal': scene.cameraZoomReveal(); break
      }
    }
  }, [pendingCameraEffects, sceneReady])

  // Sync worker sprites (peeps) from staff state to Phaser
  const staff = useGameStore((s) => s.staff)
  const gameHour = useGameStore((s) => s.gameHour)
  const shiftPattern = useGameStore((s) => s.shiftPattern)
  useEffect(() => {
    if (!gameRef.current) return
    const scene = getScene(gameRef.current)
    if (!scene) return
    const isNight = gameHour < 6 || gameHour >= 22
    const isDayNight = shiftPattern === 'day_night' || shiftPattern === 'round_the_clock'
    const isRoundClock = shiftPattern === 'round_the_clock'
    const staffList = staff.map(s => ({
      id: s.id,
      role: s.role,
      onShift: isRoundClock || (isDayNight && !isNight) || (!isNight && shiftPattern === 'day_only') || s.fatigueLevel < 90,
    }))
    scene.syncWorkers(staffList)
  }, [staff, gameHour, shiftPattern, sceneReady])

  // Dispatch workers to incidents
  useEffect(() => {
    if (!gameRef.current) return
    const scene = getScene(gameRef.current)
    if (!scene) return
    for (const incident of activeIncidents) {
      if (!incident.resolved && incident.affectedHardwareId) {
        const cab = cabinets.find(c => c.id === incident.affectedHardwareId)
        if (cab) scene.dispatchWorkerToIncident(cab.col, cab.row)
      }
    }
  }, [activeIncidents, cabinets, sceneReady])

  // Sync weather/day-night to Phaser
  const weatherCondition = useGameStore((s) => s.currentCondition)
  const season = useGameStore((s) => s.currentSeason)
  useEffect(() => {
    if (!gameRef.current) return
    const scene = getScene(gameRef.current)
    if (!scene) return
    scene.setWeatherCondition(weatherCondition, season, gameHour)
  }, [weatherCondition, season, gameHour, sceneReady])

  // Spawn particle effects for events each tick
  useEffect(() => {
    if (!gameRef.current) return
    const scene = getScene(gameRef.current)
    if (!scene) return
    const state = useGameStore.getState()

    // Fire particles on burning cabinets
    if (state.fireActive) {
      for (const cab of cabinets) {
        if (cab.heatLevel >= SIM.criticalTemp && cab.powerStatus) {
          scene.spawnFireParticles(cab.col, cab.row)
        }
      }
    }

    // Heat shimmer on throttled cabinets (sample every 8 ticks)
    if (tickCount % 8 === 0) {
      for (const cab of cabinets) {
        if (cab.heatLevel >= SIM.throttleTemp && cab.powerStatus) {
          scene.spawnHeatShimmer(cab.col, cab.row)
        }
      }
    }

    // Spark particles on overloaded PDUs (sample every 12 ticks)
    if (tickCount % 12 === 0 && state.pduOverloaded) {
      for (const pdu of state.pdus) {
        scene.spawnSparkParticles(pdu.col, pdu.row)
      }
    }

    // Cooling mist on operational cooling units (sample every 16 ticks)
    if (tickCount % 16 === 0) {
      for (const unit of coolingUnits) {
        if (unit.operational) {
          scene.spawnCoolMist(unit.col, unit.row)
        }
      }
    }
  }, [tickCount, cabinets, coolingUnits, fireActive, sceneReady])

  // Spawn achievement gold shower
  const newAchievement = useGameStore((s) => s.newAchievement)
  useEffect(() => {
    if (!gameRef.current || !newAchievement) return
    const scene = getScene(gameRef.current)
    if (!scene) return
    scene.spawnAchievementShower()
  }, [newAchievement, sceneReady])

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
