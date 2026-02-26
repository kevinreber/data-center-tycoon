import Phaser from 'phaser'
import type { LayerVisibility, LayerOpacity, LayerColors, LayerColorOverrides, TrafficLink, CabinetEnvironment, CabinetFacing, PlacementHint, DataCenterLayout, CoolingUnitType, ChillerTier, ViewMode, RowEndSlot } from '@/stores/gameStore'
import { DEFAULT_COLORS, ENVIRONMENT_CONFIG, MAX_SERVERS_PER_CABINET, getFacingOffsets, COOLING_UNIT_CONFIG, CHILLER_PLANT_CONFIG, ROW_END_SLOT_CONFIG } from '@/stores/gameStore'

const COLORS = DEFAULT_COLORS

// Cabinet grid dimensions
const TILE_W = 64
const TILE_H = 32
// Default grid size — overridden dynamically by suite tier
const DEFAULT_CAB_COLS = 5
const DEFAULT_CAB_ROWS = 5
const DEFAULT_SPINE_SLOTS = 2
const DRAG_THRESHOLD = 5  // pixels before mouse movement counts as a drag

// Cabinet visual dimensions
const CUBE_W = 44
const CUBE_H = 22
const BASE_DEPTH = 4     // bottom plate of cabinet
const SERVER_DEPTH = 10  // height per server unit
const LEAF_DEPTH = 7     // leaf switch band on top
const SECTION_GAP = 1    // subtle gap between stacked sections
const SERVER_INSET = 8   // servers are narrower than cabinet (inset per side = half)

// Full cabinet enclosure height (fixed regardless of contents)
const CABINET_ENCLOSURE_DEPTH = BASE_DEPTH
  + MAX_SERVERS_PER_CABINET * (SERVER_DEPTH + SECTION_GAP)
  + (LEAF_DEPTH + SECTION_GAP)

// Light gray cabinet enclosure colors
const CABINET_COLORS = { top: 0x667788, side: 0x4a5a6a, front: 0x3d4d5d }

// Spine visual dimensions
const SPINE_W = 50
const SPINE_H = 25
const SPINE_DEPTH = 16

// Facing direction display helpers
const FACING_ARROW: Record<CabinetFacing, string> = { north: '▲', south: '▼', east: '►', west: '◄' }
const FACING_COLOR: Record<CabinetFacing, string> = { north: '#00ccff', south: '#ff8844', east: '#00ccff', west: '#ff8844' }
const FACING_LABEL: Record<CabinetFacing, string> = { north: 'INTAKE ▲', south: 'INTAKE ▼', east: 'INTAKE ►', west: 'INTAKE ◄' }


// ── Worker Sprite (Peep) ──────────────────────────────────
interface WorkerSprite {
  id: string
  role: 'network_engineer' | 'electrician' | 'cooling_specialist' | 'security_officer'
  screenX: number
  screenY: number
  targetX: number
  targetY: number
  speed: number         // pixels per second
  busy: boolean         // walking to incident vs patrolling
  patrolDir: number     // +1 or -1 along current corridor row
  patrolRow: number     // gridRow the worker patrols on (corridor/aisle)
}

const WORKER_ROLE_COLORS: Record<string, number> = {
  network_engineer: 0x00ff88,   // green
  electrician: 0xffcc00,        // yellow
  cooling_specialist: 0x00aaff, // blue
  security_officer: 0xff4444,   // red
}

// ── Particle Effect ──────────────────────────────────────
interface Particle {
  x: number; y: number
  vx: number; vy: number
  color: number; alpha: number
  life: number; maxLife: number
  size: number
}

// ── Weather Particle ─────────────────────────────────────
interface WeatherParticle {
  x: number; y: number
  vx: number; vy: number
  alpha: number; size: number
  color: number
}

interface CabinetEntry {
  id: string
  col: number
  row: number
  serverCount: number
  hasLeafSwitch: boolean
  powerOn: boolean
  environment: CabinetEnvironment
  facing: CabinetFacing
  // Visual state differentiation fields
  heatLevel: number        // actual temperature (°C)
  isThrottled: boolean     // above throttle temp (80°C)
  isOnFire: boolean        // cabinet is on fire
  hasIncident: boolean     // has an active incident affecting it
  inMaintenance: boolean   // currently under maintenance
  serverAge: number        // server age in ticks (for depreciation tint)
  recentlyPlaced: number   // timestamp (ms) when placed, 0 = not recent
}

interface PDUEntry {
  id: string
  col: number
  row: number
  label: string
  overloaded: boolean
}

interface CableTrayEntry {
  id: string
  col: number
  row: number
}

interface CoolingUnitEntry {
  id: string
  col: number
  row: number
  type: CoolingUnitType
  operational: boolean
}

interface ChillerPlantEntry {
  id: string
  col: number
  row: number
  tier: ChillerTier
  operational: boolean
}

interface CoolingPipeEntry {
  id: string
  col: number
  row: number
}

interface SpineEntry {
  id: string
  slot: number
  powerOn: boolean
}

class DataCenterScene extends Phaser.Scene {
  private gridGraphics: Phaser.GameObjects.Graphics | null = null
  private floorGraphics: Phaser.GameObjects.Graphics | null = null
  private spineFloorGraphics: Phaser.GameObjects.Graphics | null = null
  private spineLabel: Phaser.GameObjects.Text | null = null
  private cabinetGraphics: Map<string, Phaser.GameObjects.Graphics> = new Map()
  private cabinetLabels: Map<string, Phaser.GameObjects.Text[]> = new Map()
  private spineGraphics: Map<string, Phaser.GameObjects.Graphics> = new Map()
  private spineNodeLabels: Map<string, Phaser.GameObjects.Text> = new Map()
  private cabEntries: Map<string, CabinetEntry> = new Map()
  private spineEntries: Map<string, SpineEntry> = new Map()
  private cabCount = 0
  private spineCount = 0
  private offsetX = 0
  private offsetY = 0
  private spineOffsetX = 0
  private spineOffsetY = 0
  private layerVisibility: LayerVisibility = { server: true, leaf_switch: true, spine_switch: true }
  private layerOpacity: LayerOpacity = { server: 1, leaf_switch: 1, spine_switch: 1 }
  private layerColors: LayerColorOverrides = { server: null, leaf_switch: null, spine_switch: null }

  // Dynamic grid dimensions (set by suite tier)
  private cabCols = DEFAULT_CAB_COLS
  private cabRows = DEFAULT_CAB_ROWS
  private spineSlots = DEFAULT_SPINE_SLOTS

  // Row-based layout
  private layout: DataCenterLayout | null = null
  private aisleGraphics: Phaser.GameObjects.Graphics | null = null
  private aisleLabels: Phaser.GameObjects.Text[] = []
  private corridorGraphics: Phaser.GameObjects.Graphics | null = null
  private containmentGraphics: Phaser.GameObjects.Graphics | null = null
  private containedAisles: Set<number> = new Set()

  // Traffic visualization
  private trafficGraphics: Phaser.GameObjects.Graphics | null = null
  private packetGraphics: Phaser.GameObjects.Graphics | null = null
  private trafficLinks: TrafficLink[] = []
  private trafficVisible = true
  private packetTime = 0   // cumulative time (seconds) for per-link speed animation

  // Infrastructure overlays
  private pduGraphics: Map<string, Phaser.GameObjects.Graphics> = new Map()
  private pduLabels: Map<string, Phaser.GameObjects.Text> = new Map()
  private pduEntries: Map<string, PDUEntry> = new Map()
  private cableTrayGraphics: Map<string, Phaser.GameObjects.Graphics> = new Map()
  private cableTrayEntries: Map<string, CableTrayEntry> = new Map()
  private coolingUnitGraphics: Map<string, Phaser.GameObjects.Graphics> = new Map()
  private coolingUnitLabels: Map<string, Phaser.GameObjects.Text> = new Map()
  private coolingUnitEntries: Map<string, CoolingUnitEntry> = new Map()
  private chillerGraphics: Map<string, Phaser.GameObjects.Graphics> = new Map()
  private chillerLabels: Map<string, Phaser.GameObjects.Text> = new Map()
  private chillerEntries: Map<string, ChillerPlantEntry> = new Map()
  private pipeGraphics: Map<string, Phaser.GameObjects.Graphics> = new Map()
  private pipeEntries: Map<string, CoolingPipeEntry> = new Map()
  private facingIndicators: Map<string, Phaser.GameObjects.Text> = new Map()

  // Placement mode
  private placementActive = false
  private placementFacing: CabinetFacing = 'north'
  private rowPlacementActive = false
  private placementHighlight: Phaser.GameObjects.Graphics | null = null
  private placementZoneGraphics: Phaser.GameObjects.Graphics | null = null
  private placementZoneLabels: Phaser.GameObjects.Text[] = []
  private placementHintText: Phaser.GameObjects.Text | null = null
  private placementModeLabel: Phaser.GameObjects.Text | null = null
  private hoveredTile: { col: number; row: number } | null = null
  private occupiedTiles: Set<string> = new Set()
  private onTileClick: ((col: number, row: number) => void) | null = null
  private onTileHover: ((col: number, row: number) => PlacementHint[]) | null = null

  // Pan/zoom
  private isDragging = false
  private isPotentialDrag = false
  private dragStartX = 0
  private dragStartY = 0
  private clickStartX = 0
  private clickStartY = 0
  private panOffsetX = 0
  private panOffsetY = 0
  private zoomLevel = 1
  // Touch gesture support (pinch-to-zoom)
  private pinchStartDistance = 0
  private pinchStartZoom = 1
  private isPinching = false

  // Zone outlines
  private zoneGraphics: Phaser.GameObjects.Graphics | null = null

  // Dedicated row highlights
  private dedicatedRowGraphics: Phaser.GameObjects.Graphics | null = null
  private dedicatedRowLabels: Phaser.GameObjects.Text[] = []

  // Heat map overlay
  private heatMapGraphics: Phaser.GameObjects.Graphics | null = null
  private heatMapVisible = false

  // View mode
  private viewMode: ViewMode = 'cabinet'

  // Sub-floor view
  private subFloorGraphics: Phaser.GameObjects.Graphics | null = null

  // Row-end slot rendering
  private rowEndGraphics: Map<string, Phaser.GameObjects.Graphics> = new Map()
  private rowEndLabels: Map<string, Phaser.GameObjects.Text> = new Map()

  // Audio context for procedural sounds
  private audioCtx: AudioContext | null = null
  private audioMuted = false
  private audioMasterVolume = 0.5
  private audioSfxVolume = 0.7
  private audioAmbientVolume = 0.3
  private ambientOscillator: OscillatorNode | null = null
  private ambientGain: GainNode | null = null

  // Floating text pool (world-space "damage numbers")
  private floatingTextPool: Phaser.GameObjects.Text[] = []
  private activeFloatingTexts: Phaser.GameObjects.Text[] = []
  private readonly FLOATING_TEXT_POOL_SIZE = 30

  // Hover highlight
  private hoveredCabinetId: string | null = null
  private hoveredSpineId: string | null = null
  private hoverGraphics: Phaser.GameObjects.Graphics | null = null

  // Selected cabinet
  private selectedCabinetId: string | null = null
  private selectionGraphics: Phaser.GameObjects.Graphics | null = null
  private onCabinetSelect: ((id: string | null) => void) | null = null

  // Equipment placement mode (server/leaf targeting)
  private equipmentPlacementMode: 'server' | 'leaf' | null = null
  private equipHighlightGraphics: Phaser.GameObjects.Graphics | null = null
  private onEquipmentCabinetClick: ((cabinetId: string) => void) | null = null

  // Ambient animation state
  private ambientTime = 0           // accumulated time for ambient cycles (seconds)
  private ambientGraphicsLayer: Phaser.GameObjects.Graphics | null = null

  // Worker sprites (peeps)
  private workers: WorkerSprite[] = []
  private workerGraphicsLayer: Phaser.GameObjects.Graphics | null = null

  // Particle effects
  private particles: Particle[] = []
  private particleGraphicsLayer: Phaser.GameObjects.Graphics | null = null

  // Weather/day-night overlay
  private weatherOverlayGraphics: Phaser.GameObjects.Graphics | null = null
  private dayNightOverlay: Phaser.GameObjects.Graphics | null = null
  private currentWeather = 'clear'
  private currentSeason = 'spring'
  private currentGameHour = 8
  private weatherParticles: WeatherParticle[] = []

  // Previous server counts per cabinet (for detecting server installs)
  private prevServerCounts: Map<string, number> = new Map()
  private prevLeafSwitches: Map<string, boolean> = new Map()

  constructor() {
    super({ key: 'DataCenterScene' })
  }

  /** Compute offsets to center all content (spine area + grid) both horizontally and vertically */
  private computeLayout() {
    const w = this.scale.width
    const h = this.scale.height

    // Horizontal centering
    this.offsetX = w / 2
    this.spineOffsetX = w / 2

    // Vertical centering:
    // Content spans from spine label (spineOffsetY - 20) to grid diamond bottom.
    // Keep the relative gap between spine and grid constant.
    const SPINE_GRID_GAP = 110
    const LABEL_OVERHEAD = 20 // spine label sits above spineOffsetY
    const gridHeight = (this.cabCols + this.cabRows) * (TILE_H / 2)

    const totalHeight = LABEL_OVERHEAD + SPINE_GRID_GAP + gridHeight
    const startY = Math.max(10, (h - totalHeight) / 2)

    this.spineOffsetY = startY + LABEL_OVERHEAD
    this.offsetY = this.spineOffsetY + SPINE_GRID_GAP
  }

  create() {
    this.computeLayout()

    this.drawSpineFloor()
    this.drawFloor()
    this.drawGrid()
    this.drawAisles()
    this.drawCorridors()
    this.initFloatingTextPool()

    // Set up pointer events for placement mode
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (!this.placementActive) {
        if (this.placementHighlight) {
          this.placementHighlight.clear()
        }
        // Only clear zone overlays if no cabinet is selected — selected
        // cabinets should keep their airflow zone overlays visible.
        if (!this.selectedCabinetId) {
          this.clearZoneOverlays()
        }
        if (this.placementHintText) {
          this.placementHintText.setVisible(false)
        }
        this.hoveredTile = null

        // Hover detection for cabinets and spines (only when not dragging)
        if (!this.isDragging) {
          const wp = this.cameras.main.getWorldPoint(pointer.x, pointer.y)
          const cabId = this.findCabinetAtPoint(wp.x, wp.y)
          const spineId = cabId ? null : this.findSpineAtPoint(wp.x, wp.y)

          if (cabId !== this.hoveredCabinetId || spineId !== this.hoveredSpineId) {
            this.hoveredCabinetId = cabId
            this.hoveredSpineId = spineId
            this.renderHover()
          }

          this.game.canvas.style.cursor = (cabId || spineId) ? 'pointer' : 'default'
        }

        return
      }
      const worldPoint = this.cameras.main.getWorldPoint(pointer.x, pointer.y)
      const tile = this.screenToIso(worldPoint.x, worldPoint.y)
      if (tile && tile.col >= 0 && tile.col < this.cabCols && tile.row >= 0 && tile.row < this.cabRows) {
        this.hoveredTile = tile
        this.drawPlacementHighlight(tile.col, tile.row)
      } else {
        this.hoveredTile = null
        if (this.placementHighlight) this.placementHighlight.clear()
        this.clearZoneOverlays()
        if (this.placementHintText) this.placementHintText.setVisible(false)
      }
    })

    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      // Placement mode tile click
      if (this.placementActive && this.hoveredTile) {
        const { col, row } = this.hoveredTile
        const key = `${col},${row}`
        if (!this.occupiedTiles.has(key) && this.onTileClick) {
          this.onTileClick(col, row)
        }
        return
      }

      // Check for pinch-to-zoom (two fingers down)
      if (this.input.pointer1.isDown && this.input.pointer2.isDown) {
        this.isPinching = true
        this.isPotentialDrag = false
        this.isDragging = false
        const p1 = this.input.pointer1
        const p2 = this.input.pointer2
        this.pinchStartDistance = Math.hypot(p2.x - p1.x, p2.y - p1.y)
        this.pinchStartZoom = this.zoomLevel
        return
      }

      // Left click or primary touch: start potential drag (resolved as click or pan on pointerup)
      if (pointer.leftButtonDown() || pointer.wasTouch) {
        this.isPotentialDrag = true
        this.isDragging = false
        this.clickStartX = pointer.x
        this.clickStartY = pointer.y
        this.dragStartX = pointer.x - this.panOffsetX
        this.dragStartY = pointer.y - this.panOffsetY
      }

      // Right/middle click: immediate drag (desktop only)
      if (pointer.rightButtonDown() || pointer.middleButtonDown()) {
        this.isDragging = true
        this.dragStartX = pointer.x - this.panOffsetX
        this.dragStartY = pointer.y - this.panOffsetY
      }
    })

    this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      // End pinch when fingers are lifted
      if (this.isPinching) {
        if (!this.input.pointer1.isDown || !this.input.pointer2.isDown) {
          this.isPinching = false
        }
        return
      }

      // Equipment placement mode: click a cabinet to install server/leaf
      if (this.isPotentialDrag && !this.isDragging && this.equipmentPlacementMode) {
        const wp = this.cameras.main.getWorldPoint(pointer.x, pointer.y)
        const foundCab = this.findCabinetAtPoint(wp.x, wp.y)
        if (foundCab && this.onEquipmentCabinetClick) {
          this.onEquipmentCabinetClick(foundCab)
        }
        this.isDragging = false
        this.isPotentialDrag = false
        return
      }
      // If left-click/touch didn't become a drag, treat as cabinet selection click
      if (this.isPotentialDrag && !this.isDragging && !this.placementActive) {
        const wp = this.cameras.main.getWorldPoint(pointer.x, pointer.y)
        // Use visual bounding box hit test so clicking anywhere on the cabinet
        // (servers, leaf switch, labels) selects it — not just the ground tile
        const foundCab = this.findCabinetAtPoint(wp.x, wp.y)
        this.selectedCabinetId = foundCab
        this.renderSelection()
        if (this.onCabinetSelect) this.onCabinetSelect(foundCab)
      }
      if (this.isDragging) {
        this.game.canvas.style.cursor = 'default'
      }
      this.isDragging = false
      this.isPotentialDrag = false
    })

    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      // Handle pinch-to-zoom (two fingers)
      if (this.isPinching && this.input.pointer1.isDown && this.input.pointer2.isDown) {
        const p1 = this.input.pointer1
        const p2 = this.input.pointer2
        const currentDist = Math.hypot(p2.x - p1.x, p2.y - p1.y)
        if (this.pinchStartDistance > 0) {
          const scale = currentDist / this.pinchStartDistance
          this.zoomLevel = Math.max(0.3, Math.min(2.5, this.pinchStartZoom * scale))
          this.cameras.main.setZoom(this.zoomLevel)
        }
        return
      }

      // Detect when a potential left-click/touch drag exceeds the threshold
      if (this.isPotentialDrag && !this.isDragging) {
        const dx = pointer.x - this.clickStartX
        const dy = pointer.y - this.clickStartY
        if (Math.sqrt(dx * dx + dy * dy) > DRAG_THRESHOLD) {
          this.isDragging = true
          this.isPotentialDrag = false
          this.game.canvas.style.cursor = 'grabbing'
          this.hoveredCabinetId = null
          this.hoveredSpineId = null
          this.renderHover()
        }
      }
      if (this.isDragging) {
        this.panOffsetX = pointer.x - this.dragStartX
        this.panOffsetY = pointer.y - this.dragStartY
        this.cameras.main.setScroll(-this.panOffsetX, -this.panOffsetY)
      }
    })

    // Zoom with scroll wheel
    this.input.on('wheel', (_pointer: Phaser.Input.Pointer, _gos: Phaser.GameObjects.GameObject[], _dx: number, dy: number) => {
      const zoomDelta = dy > 0 ? -0.1 : 0.1
      this.zoomLevel = Math.max(0.3, Math.min(2.5, this.zoomLevel + zoomDelta))
      this.cameras.main.setZoom(this.zoomLevel)
    })
  }

  /** Convert screen coordinates back to isometric grid cell */
  private screenToIso(screenX: number, screenY: number): { col: number; row: number } | null {
    const dx = screenX - this.offsetX
    const dy = screenY - this.offsetY
    const col = (dx / (TILE_W / 2) + dy / (TILE_H / 2)) / 2
    const row = (dy / (TILE_H / 2) - dx / (TILE_W / 2)) / 2
    const roundCol = Math.floor(col)
    const roundRow = Math.floor(row)
    if (roundCol < 0 || roundCol >= this.cabCols || roundRow < 0 || roundRow >= this.cabRows) return null
    return { col: roundCol, row: roundRow }
  }

  /** Check if a grid row is a valid cabinet row (not an aisle or corridor) */
  private isCabinetRow(gridRow: number): boolean {
    if (!this.layout) return true // fallback: treat all rows as valid
    return this.layout.cabinetRows.some(r => r.gridRow === gridRow)
  }

  /** Find the cabinet whose visual bounding box contains the given world point.
   *  Cabinets are tall isometric cubes, so we check the full rendered area (not just the ground tile).
   *  If multiple overlap, we pick the one closest to the camera (highest depth). */
  private findCabinetAtPoint(wx: number, wy: number): string | null {
    let bestId: string | null = null
    let bestDepth = -1

    for (const [id, entry] of this.cabEntries) {
      const { x, y } = this.isoToScreen(entry.col, entry.row)
      const cx = x
      const cy = y + TILE_H / 2

      // AABB of the cabinet's rendered isometric prism
      const minX = cx - CUBE_W / 2
      const maxX = cx + CUBE_W / 2
      const minY = cy - CABINET_ENCLOSURE_DEPTH - 10 // a bit above the top for labels
      const maxY = cy + CUBE_H / 2

      if (wx >= minX && wx <= maxX && wy >= minY && wy <= maxY) {
        // Depth: higher row/col = closer to camera
        const depth = entry.row * this.cabCols + entry.col
        if (depth > bestDepth) {
          bestDepth = depth
          bestId = id
        }
      }
    }

    return bestId
  }

  /** Find the spine switch whose visual bounding box contains the given world point. */
  private findSpineAtPoint(wx: number, wy: number): string | null {
    for (const [id, entry] of this.spineEntries) {
      const { x, y } = this.spineToScreen(entry.slot)
      const cy = y + SPINE_H / 2

      const minX = x - SPINE_W / 2
      const maxX = x + SPINE_W / 2
      const minY = cy - SPINE_DEPTH - 10
      const maxY = cy + SPINE_H / 2

      if (wx >= minX && wx <= maxX && wy >= minY && wy <= maxY) {
        return id
      }
    }
    return null
  }

  /** Draw a filled isometric diamond tile at the given grid position */
  private drawIsoTile(g: Phaser.GameObjects.Graphics, tileCol: number, tileRow: number, fillColor: number, fillAlpha: number, strokeColor?: number, strokeAlpha?: number) {
    const { x, y } = this.isoToScreen(tileCol, tileRow)
    g.fillStyle(fillColor, fillAlpha)
    g.beginPath()
    g.moveTo(x, y)
    g.lineTo(x + TILE_W / 2, y + TILE_H / 2)
    g.lineTo(x, y + TILE_H)
    g.lineTo(x - TILE_W / 2, y + TILE_H / 2)
    g.closePath()
    g.fillPath()
    if (strokeColor !== undefined) {
      g.lineStyle(1.5, strokeColor, strokeAlpha ?? fillAlpha)
      g.beginPath()
      g.moveTo(x, y)
      g.lineTo(x + TILE_W / 2, y + TILE_H / 2)
      g.lineTo(x, y + TILE_H)
      g.lineTo(x - TILE_W / 2, y + TILE_H / 2)
      g.closePath()
      g.strokePath()
    }
  }

  /** Add a small text label centered on a grid tile */
  private addZoneLabel(tileCol: number, tileRow: number, text: string, color: string, offsetYPx = 0): Phaser.GameObjects.Text {
    const { x, y } = this.isoToScreen(tileCol, tileRow)
    const label = this.add
      .text(x, y + TILE_H / 2 + offsetYPx, text, {
        fontFamily: 'monospace',
        fontSize: '6px',
        color,
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setAlpha(0.7)
      .setDepth(4)
    return label
  }

  /** Clear zone overlay graphics and labels */
  private clearZoneOverlays() {
    if (this.placementZoneGraphics) this.placementZoneGraphics.clear()
    for (const label of this.placementZoneLabels) label.destroy()
    this.placementZoneLabels = []
  }

  /** Draw hover highlight on grid tile during placement mode */
  private drawPlacementHighlight(col: number, row: number) {
    if (!this.placementHighlight) {
      this.placementHighlight = this.add.graphics()
      this.placementHighlight.setDepth(3)
    }
    this.placementHighlight.clear()

    if (!this.placementZoneGraphics) {
      this.placementZoneGraphics = this.add.graphics()
      this.placementZoneGraphics.setDepth(2)
    }
    this.clearZoneOverlays()

    // ── Row Placement Mode ──────────────────────────────────────
    if (this.rowPlacementActive) {
      const isCorridor = row === 0 || (this.layout && row === this.layout.corridorBottom)
      const isExistingRow = this.isCabinetRow(row)
      const isValid = !isCorridor && !isExistingRow && row > 0 && row < this.cabRows - 1

      // Check min gap constraint (must be > 1 row from nearest cabinet row)
      let tooClose = false
      if (isValid && this.layout) {
        for (const cr of this.layout.cabinetRows) {
          if (Math.abs(cr.gridRow - row) < 2) { tooClose = true; break }
        }
      }

      const color = isValid && !tooClose ? 0x00ff88 : isCorridor ? 0x556677 : isExistingRow ? 0xffaa00 : 0xff4444
      const alpha = isValid && !tooClose ? 0.25 : 0.15

      // Highlight the entire row
      for (let c = 0; c < this.cabCols; c++) {
        this.drawIsoTile(this.placementHighlight, c, row, color, alpha, color, 0.4)
      }

      // Add label
      const center = this.isoToScreen(Math.floor(this.cabCols / 2), row)
      let label = 'PLACE ROW HERE'
      if (isCorridor) label = 'CORRIDOR — CANNOT PLACE'
      else if (isExistingRow) label = 'ROW ALREADY HERE'
      else if (tooClose) label = 'TOO CLOSE — MIN 1 ROW GAP'

      this.placementZoneLabels.push(
        this.add.text(center.x, center.y + TILE_H / 2, label, {
          fontFamily: 'monospace',
          fontSize: '8px',
          color: isValid && !tooClose ? '#00ff88' : '#ff6644',
        }).setOrigin(0.5).setAlpha(0.8).setDepth(4)
      )
      return
    }

    const { x, y } = this.isoToScreen(col, row)
    const isValidRow = this.isCabinetRow(row)
    const occupied = this.occupiedTiles.has(`${col},${row}`)

    // Non-cabinet rows (aisles, corridors) show dim gray
    if (!isValidRow) {
      const color = 0x556677
      const alpha = 0.15
      // Draw dim overlay for non-placeable row
      this.drawIsoTile(this.placementZoneGraphics!, col, row, color, alpha)
      return
    }

    // Count orthogonal neighbors to determine density
    let adjacentCount = 0
    if (!occupied) {
      const dirs = [
        `${col},${row - 1}`, `${col},${row + 1}`,
        `${col - 1},${row}`, `${col + 1},${row}`,
      ]
      for (const key of dirs) {
        if (this.occupiedTiles.has(key)) adjacentCount++
      }
    }

    // Highlight color: green (open), yellow (crowded 2+), amber (dense 3+), red (occupied)
    let color: number
    let alpha: number
    if (occupied) {
      color = 0xff4444; alpha = 0.3
    } else if (adjacentCount >= 3) {
      color = 0xff6600; alpha = 0.3
    } else if (adjacentCount >= 2) {
      color = 0xffaa00; alpha = 0.25
    } else {
      color = 0x00ff88; alpha = 0.25
    }

    // Draw main hovered tile
    this.drawIsoTile(this.placementHighlight, col, row, color, alpha, color, occupied ? 0.5 : 0.7)

    // ── Placement zone overlays (only for valid placements) ──
    if (!occupied) {
      const facing = this.placementFacing
      const offsets = getFacingOffsets(facing, col, row)

      // Draw facing arrow on the hovered tile
      this.placementZoneLabels.push(
        this.addZoneLabel(col, row, FACING_ARROW[facing], FACING_COLOR[facing], -3)
      )
      this.placementZoneLabels.push(
        this.addZoneLabel(col, row, FACING_LABEL[facing], FACING_COLOR[facing], 4)
      )

      // ── Front tile (cold / intake side) ──
      const f = offsets.front
      if (f.col >= 0 && f.col < this.cabCols && f.row >= 0 && f.row < this.cabRows) {
        const frontOccupied = this.occupiedTiles.has(`${f.col},${f.row}`)
        if (!frontOccupied) {
          this.drawIsoTile(this.placementZoneGraphics, f.col, f.row, 0x0088ff, 0.15, 0x0088ff, 0.3)
          this.placementZoneLabels.push(this.addZoneLabel(f.col, f.row, 'COLD AISLE', '#4488ff'))
        } else {
          this.drawIsoTile(this.placementZoneGraphics, f.col, f.row, 0xff4400, 0.12, 0xff4400, 0.25)
          this.placementZoneLabels.push(this.addZoneLabel(f.col, f.row, 'BLOCKED!', '#ff6644'))
        }
      }

      // ── Rear tile (hot / exhaust side) ──
      const r = offsets.rear
      if (r.col >= 0 && r.col < this.cabCols && r.row >= 0 && r.row < this.cabRows) {
        const rearOccupied = this.occupiedTiles.has(`${r.col},${r.row}`)
        if (!rearOccupied) {
          this.drawIsoTile(this.placementZoneGraphics, r.col, r.row, 0xff4400, 0.12, 0xff4400, 0.25)
          this.placementZoneLabels.push(this.addZoneLabel(r.col, r.row, 'HOT EXHAUST', '#ff8844'))
        } else {
          this.drawIsoTile(this.placementZoneGraphics, r.col, r.row, 0xff0000, 0.15, 0xff0000, 0.3)
          this.placementZoneLabels.push(this.addZoneLabel(r.col, r.row, 'EXHAUST BLOCKED!', '#ff4444'))
        }
      }

      // ── Side tiles (access for DC techs / cabling) ──
      for (const side of offsets.sides) {
        if (side.col < 0 || side.col >= this.cabCols || side.row < 0 || side.row >= this.cabRows) continue
        const sideOccupied = this.occupiedTiles.has(`${side.col},${side.row}`)
        if (!sideOccupied) {
          this.drawIsoTile(this.placementZoneGraphics, side.col, side.row, 0xffcc00, 0.08, 0xffcc00, 0.15)
          this.placementZoneLabels.push(this.addZoneLabel(side.col, side.row, 'ACCESS', '#aaaa44'))
        }
      }

      // ── Show existing neighbor cabinets' airflow zones ──
      for (const entry of this.cabEntries.values()) {
        const dist = Math.abs(entry.col - col) + Math.abs(entry.row - row)
        if (dist > 2) continue

        const entryOffsets = getFacingOffsets(entry.facing, entry.col, entry.row)

        // Draw exhaust flow indicator
        const er = entryOffsets.rear
        if (er.col >= 0 && er.col < this.cabCols && er.row >= 0 && er.row < this.cabRows) {
          const isHoveredTile = er.col === col && er.row === row
          const isOccupied = this.occupiedTiles.has(`${er.col},${er.row}`)
          if (!isOccupied || isHoveredTile) {
            const { x: ex, y: ey } = this.isoToScreen(entry.col, entry.row)
            const { x: tx, y: ty } = this.isoToScreen(er.col, er.row)
            this.placementZoneGraphics.lineStyle(1, 0xff6644, 0.3)
            this.placementZoneGraphics.lineBetween(ex, ey + TILE_H / 2, tx, ty + TILE_H / 2)
          }
        }

        // Draw intake flow indicator
        const ef = entryOffsets.front
        if (ef.col >= 0 && ef.col < this.cabCols && ef.row >= 0 && ef.row < this.cabRows) {
          const isHoveredTile = ef.col === col && ef.row === row
          const isOccupied = this.occupiedTiles.has(`${ef.col},${ef.row}`)
          if (!isOccupied || isHoveredTile) {
            const { x: ex, y: ey } = this.isoToScreen(entry.col, entry.row)
            const { x: tx, y: ty } = this.isoToScreen(ef.col, ef.row)
            this.placementZoneGraphics.lineStyle(1, 0x0088ff, 0.25)
            this.placementZoneGraphics.lineBetween(ex, ey + TILE_H / 2, tx, ty + TILE_H / 2)
          }
        }
      }
    }

    // Show hint text
    if (this.onTileHover && !occupied && isValidRow) {
      const hints = this.onTileHover(col, row)
      if (hints.length > 0) {
        const hintMsg = hints.map((h) => {
          const prefix = h.type === 'warning' ? '!' : h.type === 'tip' ? '*' : '-'
          return `${prefix} ${h.message}`
        }).join('\n')

        if (!this.placementHintText) {
          this.placementHintText = this.add.text(0, 0, '', {
            fontFamily: 'monospace',
            fontSize: '8px',
            color: '#aacccc',
            backgroundColor: '#0a1520ee',
            padding: { x: 6, y: 4 },
            wordWrap: { width: 240 },
          }).setDepth(100)
        }
        this.placementHintText.setText(hintMsg)
        this.placementHintText.setPosition(x + TILE_W / 2 + 8, y - 10)
        this.placementHintText.setVisible(true)
      } else {
        if (this.placementHintText) this.placementHintText.setVisible(false)
      }
    } else if (!isValidRow) {
      // Hovering over aisle or corridor — pass to hint system for info
      if (this.onTileHover) {
        const hints = this.onTileHover(col, row)
        if (hints.length > 0) {
          const hintMsg = hints.map((h) => {
            const prefix = h.type === 'warning' ? '!' : h.type === 'tip' ? '*' : '-'
            return `${prefix} ${h.message}`
          }).join('\n')
          if (!this.placementHintText) {
            this.placementHintText = this.add.text(0, 0, '', {
              fontFamily: 'monospace',
              fontSize: '8px',
              color: '#aacccc',
              backgroundColor: '#0a1520ee',
              padding: { x: 6, y: 4 },
              wordWrap: { width: 240 },
            }).setDepth(100)
          }
          this.placementHintText.setText(hintMsg)
          this.placementHintText.setPosition(x + TILE_W / 2 + 8, y - 10)
          this.placementHintText.setVisible(true)
        }
      }
    } else if (occupied) {
      if (!this.placementHintText) {
        this.placementHintText = this.add.text(0, 0, '', {
          fontFamily: 'monospace',
          fontSize: '8px',
          color: '#ff6666',
          backgroundColor: '#0a1520ee',
          padding: { x: 6, y: 4 },
        }).setDepth(100)
      }
      this.placementHintText.setText('Tile occupied')
      this.placementHintText.setPosition(x + TILE_W / 2 + 8, y - 10)
      this.placementHintText.setVisible(true)
    } else {
      if (this.placementHintText) this.placementHintText.setVisible(false)
    }
  }

  private isoToScreen(col: number, row: number): { x: number; y: number } {
    return {
      x: this.offsetX + (col - row) * (TILE_W / 2),
      y: this.offsetY + (col + row) * (TILE_H / 2),
    }
  }

  private spineToScreen(slot: number): { x: number; y: number } {
    const totalW = this.spineSlots * 60
    const startX = this.spineOffsetX - totalW / 2
    return {
      x: startX + slot * 60 + 30,
      y: this.spineOffsetY,
    }
  }

  private drawFloor() {
    this.floorGraphics = this.add.graphics()

    // Build sets for quick lookup of row types from layout
    const cabinetGridRows = new Set<number>()
    const aisleGridRows = new Map<number, 'cold' | 'hot' | 'neutral'>()
    const corridorGridRows = new Set<number>()

    if (this.layout) {
      for (const row of this.layout.cabinetRows) cabinetGridRows.add(row.gridRow)
      for (const aisle of this.layout.aisles) {
        const w = aisle.width ?? 1
        for (let i = 0; i < w; i++) aisleGridRows.set(aisle.gridRow + i, aisle.type)
      }
      corridorGridRows.add(this.layout.corridorTop)
      corridorGridRows.add(this.layout.corridorBottom)
    }

    for (let r = 0; r < this.cabRows; r++) {
      for (let c = 0; c < this.cabCols; c++) {
        const { x, y } = this.isoToScreen(c, r)
        let fillColor: number
        let alpha = 0.9

        if (aisleGridRows.has(r)) {
          const aisleType = aisleGridRows.get(r)!
          if (aisleType === 'cold') {
            fillColor = (c + r) % 2 === 0 ? 0x061828 : 0x081e30
          } else if (aisleType === 'hot') {
            fillColor = (c + r) % 2 === 0 ? 0x1a0e06 : 0x201208
          } else {
            fillColor = (c + r) % 2 === 0 ? 0x0e1218 : 0x10141a
          }
        } else if (corridorGridRows.has(r)) {
          fillColor = (c + r) % 2 === 0 ? 0x0f1520 : 0x111822
          alpha = 0.7
        } else {
          // Cabinet row — standard dark floor
          const isAlternate = (r + c) % 2 === 0
          fillColor = isAlternate ? 0x0a1520 : 0x0c1825
        }

        this.floorGraphics.fillStyle(fillColor, alpha)
        this.floorGraphics.beginPath()
        this.floorGraphics.moveTo(x, y)
        this.floorGraphics.lineTo(x + TILE_W / 2, y + TILE_H / 2)
        this.floorGraphics.lineTo(x, y + TILE_H)
        this.floorGraphics.lineTo(x - TILE_W / 2, y + TILE_H / 2)
        this.floorGraphics.closePath()
        this.floorGraphics.fillPath()

        // Draw subtle aisle lane markings
        if (aisleGridRows.has(r)) {
          this.floorGraphics.lineStyle(0.5, 0x335533, 0.3)
          this.floorGraphics.lineBetween(
            x - TILE_W / 4, y + TILE_H / 2,
            x + TILE_W / 4, y + TILE_H / 2,
          )
        }
      }
    }
    this.floorGraphics.setDepth(0)
  }

  /** Draw aisle overlays with labels and color tinting */
  private drawAisles() {
    // Clean up old aisle graphics
    if (this.aisleGraphics) this.aisleGraphics.destroy()
    for (const label of this.aisleLabels) label.destroy()
    this.aisleLabels = []
    if (this.containmentGraphics) this.containmentGraphics.destroy()

    if (!this.layout) return

    this.aisleGraphics = this.add.graphics()
    this.aisleGraphics.setDepth(1)

    this.containmentGraphics = this.add.graphics()
    this.containmentGraphics.setDepth(2)

    for (const aisle of this.layout.aisles) {
      const r = aisle.gridRow
      const w = aisle.width ?? 1
      const color = aisle.type === 'cold' ? 0x00aaff : aisle.type === 'hot' ? 0xff6644 : 0x888888
      const widthLabel = w > 1 ? ` (${w}-WIDE)` : ''
      const typeLabel = (aisle.type === 'cold' ? 'COLD AISLE' : aisle.type === 'hot' ? 'HOT AISLE' : 'AISLE') + widthLabel

      // Draw aisle border lines (top and bottom edges of the full aisle span)
      const leftTop = this.isoToScreen(0, r)
      const rightTop = this.isoToScreen(this.cabCols, r)
      const leftBot = this.isoToScreen(0, r + w)
      const rightBot = this.isoToScreen(this.cabCols, r + w)

      // Top edge
      this.aisleGraphics.lineStyle(1, color, 0.25)
      this.aisleGraphics.lineBetween(leftTop.x, leftTop.y, rightTop.x, rightTop.y)
      // Bottom edge
      this.aisleGraphics.lineBetween(leftBot.x, leftBot.y, rightBot.x, rightBot.y)

      // Center dashed line down the middle of the aisle
      const midY = (leftTop.y + leftBot.y) / 2
      const midX = (leftTop.x + leftBot.x) / 2
      const midYR = (rightTop.y + rightBot.y) / 2
      const midXR = (rightTop.x + rightBot.x) / 2
      this.aisleGraphics.lineStyle(1, color, 0.12)
      const segments = 16
      for (let s = 0; s < segments; s += 2) {
        const t0 = s / segments
        const t1 = (s + 1) / segments
        this.aisleGraphics.lineBetween(
          midX + (midXR - midX) * t0, midY + (midYR - midY) * t0,
          midX + (midXR - midX) * t1, midY + (midYR - midY) * t1
        )
      }

      // Aisle type label
      const centerX = (leftTop.x + rightBot.x) / 2
      const centerY = (leftTop.y + rightBot.y) / 2
      const label = this.add
        .text(centerX, centerY, typeLabel, {
          fontFamily: 'monospace',
          fontSize: '7px',
          color: `#${color.toString(16).padStart(6, '0')}`,
        })
        .setOrigin(0.5)
        .setAlpha(0.35)
        .setDepth(2)
      this.aisleLabels.push(label)

      // Containment panels if installed
      if (this.containedAisles.has(aisle.id)) {
        this.drawContainmentPanels(aisle.gridRow, color, w)
      }
    }
  }

  /** Draw containment panel indicators on a contained aisle */
  private drawContainmentPanels(aisleGridRow: number, aisleColor: number, aisleWidth = 1) {
    if (!this.containmentGraphics) return

    // Draw small barrier marks at each end of the aisle
    const leftTop = this.isoToScreen(0, aisleGridRow)
    const rightTop = this.isoToScreen(this.cabCols, aisleGridRow)
    const leftBot = this.isoToScreen(0, aisleGridRow + aisleWidth)
    const rightBot = this.isoToScreen(this.cabCols, aisleGridRow + aisleWidth)

    // Solid barrier lines (thicker, brighter) on top and bottom edges
    this.containmentGraphics.lineStyle(2.5, aisleColor, 0.5)
    this.containmentGraphics.lineBetween(leftTop.x, leftTop.y, rightTop.x, rightTop.y)
    this.containmentGraphics.lineBetween(leftBot.x, leftBot.y, rightBot.x, rightBot.y)

    // Small panel markers at ends
    this.containmentGraphics.fillStyle(aisleColor, 0.2)
    // Left end panel
    this.containmentGraphics.fillRect(leftTop.x - 2, leftTop.y - 1, 4, (leftBot.y - leftTop.y) + 2)
    // Right end panel
    this.containmentGraphics.fillRect(rightTop.x - 2, rightTop.y - 1, 4, (rightBot.y - rightTop.y) + 2)
  }

  /** Draw corridor overlays at top and bottom */
  private drawCorridors() {
    if (this.corridorGraphics) this.corridorGraphics.destroy()
    if (!this.layout) return

    this.corridorGraphics = this.add.graphics()
    this.corridorGraphics.setDepth(1)

    for (const cr of [this.layout.corridorTop, this.layout.corridorBottom]) {
      const leftTop = this.isoToScreen(0, cr)
      const rightTop = this.isoToScreen(this.cabCols, cr)
      const leftBot = this.isoToScreen(0, cr + 1)
      const rightBot = this.isoToScreen(this.cabCols, cr + 1)

      // Dashed border
      this.corridorGraphics.lineStyle(1, 0x556677, 0.15)
      const segments = 20
      const dx1 = rightTop.x - leftTop.x
      const dy1 = rightTop.y - leftTop.y
      for (let s = 0; s < segments; s += 2) {
        const t0 = s / segments
        const t1 = (s + 1) / segments
        this.corridorGraphics.lineBetween(
          leftTop.x + dx1 * t0, leftTop.y + dy1 * t0,
          leftTop.x + dx1 * t1, leftTop.y + dy1 * t1
        )
      }
      const dx2 = rightBot.x - leftBot.x
      const dy2 = rightBot.y - leftBot.y
      for (let s = 0; s < segments; s += 2) {
        const t0 = s / segments
        const t1 = (s + 1) / segments
        this.corridorGraphics.lineBetween(
          leftBot.x + dx2 * t0, leftBot.y + dy2 * t0,
          leftBot.x + dx2 * t1, leftBot.y + dy2 * t1
        )
      }
    }
  }

  private drawGrid() {
    this.gridGraphics = this.add.graphics()
    this.gridGraphics.lineStyle(1, 0x00ff88, 0.12)

    for (let row = 0; row <= this.cabRows; row++) {
      const start = this.isoToScreen(0, row)
      const end = this.isoToScreen(this.cabCols, row)
      this.gridGraphics.lineBetween(start.x, start.y, end.x, end.y)
    }

    for (let col = 0; col <= this.cabCols; col++) {
      const start = this.isoToScreen(col, 0)
      const end = this.isoToScreen(col, this.cabRows)
      this.gridGraphics.lineBetween(start.x, start.y, end.x, end.y)
    }

    // Outer border glow
    this.gridGraphics.lineStyle(1.5, 0x00ff88, 0.25)
    const tl = this.isoToScreen(0, 0)
    const tr = this.isoToScreen(this.cabCols, 0)
    const br = this.isoToScreen(this.cabCols, this.cabRows)
    const bl = this.isoToScreen(0, this.cabRows)
    this.gridGraphics.lineBetween(tl.x, tl.y, tr.x, tr.y)
    this.gridGraphics.lineBetween(tr.x, tr.y, br.x, br.y)
    this.gridGraphics.lineBetween(br.x, br.y, bl.x, bl.y)
    this.gridGraphics.lineBetween(bl.x, bl.y, tl.x, tl.y)

    this.gridGraphics.setDepth(1)
  }

  private drawSpineFloor() {
    this.spineFloorGraphics = this.add.graphics()

    // Draw a subtle platform for spine switches
    const totalW = this.spineSlots * 60
    const startX = this.spineOffsetX - totalW / 2
    const y = this.spineOffsetY

    // Draw slot markers
    for (let i = 0; i < this.spineSlots; i++) {
      const sx = startX + i * 60 + 30
      const hw = SPINE_W / 2 + 4
      const hh = SPINE_H / 2 + 2

      this.spineFloorGraphics.fillStyle(0x0a1520, 0.6)
      this.spineFloorGraphics.beginPath()
      this.spineFloorGraphics.moveTo(sx, y - hh + SPINE_H / 2)
      this.spineFloorGraphics.lineTo(sx + hw, y + SPINE_H / 2)
      this.spineFloorGraphics.lineTo(sx, y + hh + SPINE_H / 2)
      this.spineFloorGraphics.lineTo(sx - hw, y + SPINE_H / 2)
      this.spineFloorGraphics.closePath()
      this.spineFloorGraphics.fillPath()
    }

    // Border around spine area
    this.spineFloorGraphics.lineStyle(1, 0xff6644, 0.15)
    const lx = startX - 4
    const rx = startX + totalW + 4
    const ty = y - 4
    const by = y + SPINE_H + 8
    this.spineFloorGraphics.strokeRect(lx, ty, rx - lx, by - ty)

    this.spineFloorGraphics.setDepth(0)

    // Label
    this.spineLabel = this.add
      .text(this.spineOffsetX, y - 16, 'SPINE SWITCHES', {
        fontFamily: 'monospace',
        fontSize: '9px',
        color: '#ff6644',
      })
      .setOrigin(0.5)
      .setAlpha(0.5)
      .setDepth(1)
  }

  /** Draw a hollow wireframe isometric cube (edges only) */
  private drawIsoWireframe(
    g: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    w: number,
    h: number,
    depth: number,
    color: number,
    alpha: number
  ) {
    const hw = w / 2
    const hh = h / 2

    // Top face outline
    g.lineStyle(1.5, color, alpha)
    g.beginPath()
    g.moveTo(x, y - depth)
    g.lineTo(x + hw, y + hh - depth)
    g.lineTo(x, y + h - depth)
    g.lineTo(x - hw, y + hh - depth)
    g.closePath()
    g.strokePath()

    // Bottom face outline
    g.lineStyle(1, color, alpha * 0.5)
    g.beginPath()
    g.moveTo(x, y)
    g.lineTo(x + hw, y + hh)
    g.lineTo(x, y + h)
    g.lineTo(x - hw, y + hh)
    g.closePath()
    g.strokePath()

    // Vertical edges connecting top to bottom
    g.lineStyle(1.5, color, alpha * 0.7)
    g.lineBetween(x, y - depth, x, y)                          // back
    g.lineBetween(x + hw, y + hh - depth, x + hw, y + hh)     // right
    g.lineBetween(x, y + h - depth, x, y + h)                  // front
    g.lineBetween(x - hw, y + hh - depth, x - hw, y + hh)     // left
  }

  /** Draw a solid filled isometric cube section */
  private drawIsoCube(
    g: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    w: number,
    h: number,
    depth: number,
    colors: { top: number; side: number; front: number },
    alpha: number
  ) {
    const hw = w / 2
    const hh = h / 2

    // Top face
    g.fillStyle(colors.top, alpha)
    g.beginPath()
    g.moveTo(x, y - depth)
    g.lineTo(x + hw, y + hh - depth)
    g.lineTo(x, y + h - depth)
    g.lineTo(x - hw, y + hh - depth)
    g.closePath()
    g.fillPath()

    // Left face
    g.fillStyle(colors.side, alpha)
    g.beginPath()
    g.moveTo(x - hw, y + hh - depth)
    g.lineTo(x, y + h - depth)
    g.lineTo(x, y + h)
    g.lineTo(x - hw, y + hh)
    g.closePath()
    g.fillPath()

    // Right face
    g.fillStyle(colors.front, alpha)
    g.beginPath()
    g.moveTo(x + hw, y + hh - depth)
    g.lineTo(x, y + h - depth)
    g.lineTo(x, y + h)
    g.lineTo(x + hw, y + hh)
    g.closePath()
    g.fillPath()

    // Edge highlights
    g.lineStyle(1, colors.top, alpha * 0.5)
    g.lineBetween(x, y - depth, x + hw, y + hh - depth)
    g.lineBetween(x, y - depth, x - hw, y + hh - depth)
    g.lineBetween(x - hw, y + hh - depth, x, y + h - depth)
    g.lineBetween(x + hw, y + hh - depth, x, y + h - depth)
  }

  /** Draw a stacked cabinet: base frame + server layers + optional leaf switch on top */
  private renderCabinet(entry: CabinetEntry) {
    // Clean up existing
    const oldG = this.cabinetGraphics.get(entry.id)
    if (oldG) oldG.destroy()
    const oldLabels = this.cabinetLabels.get(entry.id)
    if (oldLabels) oldLabels.forEach((l) => l.destroy())

    const { x, y } = this.isoToScreen(entry.col, entry.row)
    const cx = x
    const cy = y + TILE_H / 2

    const g = this.add.graphics()
    const labels: Phaser.GameObjects.Text[] = []
    const baseDepth = 10 + entry.row * this.cabCols + entry.col

    const serverColors: LayerColors = this.layerColors.server ?? COLORS.server
    const leafColors: LayerColors = this.layerColors.leaf_switch ?? COLORS.leaf_switch
    const serverVis = this.layerVisibility.server
    const leafVis = this.layerVisibility.leaf_switch
    const serverOpacity = this.layerOpacity.server
    const leafOpacity = this.layerOpacity.leaf_switch
    const powerMult = entry.powerOn ? 1 : 0.2

    // 1. Full-height cabinet enclosure — light gray box (fixed height regardless of contents)
    const cabinetAlpha = 0.6 * powerMult
    this.drawIsoCube(g, cx, cy, CUBE_W, CUBE_H, CABINET_ENCLOSURE_DEPTH, CABINET_COLORS, cabinetAlpha)

    // Environment accent — thin wireframe tint on the enclosure
    const envColor = ENVIRONMENT_CONFIG[entry.environment].frameColors.top
    this.drawIsoWireframe(g, cx, cy, CUBE_W, CUBE_H, CABINET_ENCLOSURE_DEPTH, envColor, 0.5 * powerMult)

    // 2. Server layers inside the cabinet (smaller, sitting inside the gray shell)
    let slotY = cy - BASE_DEPTH - SECTION_GAP
    if (serverVis) {
      for (let i = 0; i < entry.serverCount; i++) {
        const alpha = 0.9 * serverOpacity * powerMult
        this.drawIsoCube(g, cx, slotY, CUBE_W - SERVER_INSET, CUBE_H - SERVER_INSET / 2, SERVER_DEPTH, serverColors, alpha)

        // Server LED
        if (serverOpacity > 0.3) {
          const ledColor = `#${serverColors.top.toString(16).padStart(6, '0')}`
          const led = this.add
            .text(cx + (CUBE_W - SERVER_INSET) / 2 - 4, slotY - SERVER_DEPTH + 1, '●', {
              fontFamily: 'monospace',
              fontSize: '5px',
              color: ledColor,
            })
            .setOrigin(0.5)
            .setAlpha(entry.powerOn ? 0.9 * serverOpacity : 0.1)
            .setDepth(baseDepth + 1)
          labels.push(led)
        }

        slotY -= SERVER_DEPTH + SECTION_GAP
      }
    }

    // 3. Leaf switch at top of cabinet (also inset, cyan)
    const leafSlotY = cy - BASE_DEPTH - SECTION_GAP - MAX_SERVERS_PER_CABINET * (SERVER_DEPTH + SECTION_GAP)
    if (entry.hasLeafSwitch) {
      if (leafVis) {
        const alpha = 0.9 * leafOpacity * powerMult
        this.drawIsoCube(g, cx, leafSlotY, CUBE_W - SERVER_INSET, CUBE_H - SERVER_INSET / 2, LEAF_DEPTH, leafColors, alpha)

        // Leaf LED
        if (leafOpacity > 0.3) {
          const ledColor = `#${leafColors.top.toString(16).padStart(6, '0')}`
          const led = this.add
            .text(cx, leafSlotY - LEAF_DEPTH - 4, '●', {
              fontFamily: 'monospace',
              fontSize: '6px',
              color: ledColor,
            })
            .setOrigin(0.5)
            .setAlpha(entry.powerOn ? 1 * leafOpacity : 0.1)
            .setDepth(baseDepth + 1)
          labels.push(led)
        }
      }
    }

    // Cabinet ID label above the fixed-height enclosure
    const topY = cy - CABINET_ENCLOSURE_DEPTH - 10
    const envConfig = ENVIRONMENT_CONFIG[entry.environment]
    const idLabel = this.add
      .text(cx, topY, entry.id.replace('cab-', 'C'), {
        fontFamily: 'monospace',
        fontSize: '7px',
        color: '#556677',
      })
      .setOrigin(0.5)
      .setAlpha(powerMult * 0.7)
      .setDepth(baseDepth + 1)
    labels.push(idLabel)

    // Environment tag below cabinet ID
    const envLabel = this.add
      .text(cx, topY + 9, envConfig.label, {
        fontFamily: 'monospace',
        fontSize: '5px',
        color: envConfig.color,
      })
      .setOrigin(0.5)
      .setAlpha(powerMult * 0.5)
      .setDepth(baseDepth + 1)
    labels.push(envLabel)

    // Content summary label — shows slot fill state so players know what's inside
    const srvText = `${entry.serverCount}/${MAX_SERVERS_PER_CABINET}`
    const leafText = entry.hasLeafSwitch ? 'leaf' : 'no leaf'
    const isEmpty = entry.serverCount === 0 && !entry.hasLeafSwitch
    const summaryStr = isEmpty ? 'EMPTY' : `${srvText} · ${leafText}`
    const summaryColor = isEmpty ? '#665544' : '#556677'
    const summaryLabel = this.add
      .text(cx, topY + 17, summaryStr, {
        fontFamily: 'monospace',
        fontSize: '5px',
        color: summaryColor,
      })
      .setOrigin(0.5)
      .setAlpha(powerMult * 0.6)
      .setDepth(baseDepth + 1)
    labels.push(summaryLabel)

    // Facing direction indicator (small arrow for hot/cold aisle)
    const oldFacing = this.facingIndicators.get(entry.id)
    if (oldFacing) oldFacing.destroy()
    const facingArrow = FACING_ARROW[entry.facing]
    const facingColor = FACING_COLOR[entry.facing]
    const facingLabel = this.add
      .text(cx + CUBE_W / 2 - 2, topY + 4, facingArrow, {
        fontFamily: 'monospace',
        fontSize: '6px',
        color: facingColor,
      })
      .setOrigin(0.5)
      .setAlpha(powerMult * 0.6)
      .setDepth(baseDepth + 1)
    this.facingIndicators.set(entry.id, facingLabel)

    // No-access warning: show amber indicator if cabinet has no adjacent empty tile
    const adjacentDirs = [
      { col: entry.col, row: entry.row - 1 },
      { col: entry.col, row: entry.row + 1 },
      { col: entry.col - 1, row: entry.row },
      { col: entry.col + 1, row: entry.row },
    ]
    let hasAccess = false
    for (const dir of adjacentDirs) {
      if (dir.col < 0 || dir.col >= this.cabCols || dir.row < 0 || dir.row >= this.cabRows) continue
      if (!this.occupiedTiles.has(`${dir.col},${dir.row}`)) {
        hasAccess = true
        break
      }
    }
    if (!hasAccess && entry.powerOn) {
      // Draw a small amber warning dot at the base of the cabinet
      g.fillStyle(0xff8800, 0.6)
      g.fillCircle(cx - CUBE_W / 2 + 4, cy - 2, 2)
      // Warning label
      const warnLabel = this.add
        .text(cx, topY + 24, '! NO ACCESS', {
          fontFamily: 'monospace',
          fontSize: '4px',
          color: '#ff8844',
        })
        .setOrigin(0.5)
        .setAlpha(0.5)
        .setDepth(baseDepth + 1)
      labels.push(warnLabel)
    }

    // ── Visual State Differentiation ────────────────────────────
    // Helper: draw an isometric tile overlay (diamond fill) on the cabinet
    const drawTileOverlay = (color: number, alpha: number) => {
      g.fillStyle(color, alpha)
      g.beginPath()
      g.moveTo(cx, cy - CABINET_ENCLOSURE_DEPTH)
      g.lineTo(cx + CUBE_W / 2, cy + CUBE_H / 2 - CABINET_ENCLOSURE_DEPTH)
      g.lineTo(cx, cy + CUBE_H - CABINET_ENCLOSURE_DEPTH)
      g.lineTo(cx - CUBE_W / 2, cy + CUBE_H / 2 - CABINET_ENCLOSURE_DEPTH)
      g.closePath()
      g.fillPath()
    }

    let statusLabelY = topY + (hasAccess || !entry.powerOn ? 24 : 30)

    // 1. Throttled — red/orange pulsing tint overlay
    if (entry.isThrottled && entry.powerOn && !entry.isOnFire) {
      drawTileOverlay(0xff4400, 0.18)
      const throttleLabel = this.add
        .text(cx, statusLabelY, '⚠ THROTTLED', {
          fontFamily: 'monospace',
          fontSize: '5px',
          color: '#ff6622',
        })
        .setOrigin(0.5)
        .setAlpha(0.7)
        .setDepth(baseDepth + 2)
      labels.push(throttleLabel)
      statusLabelY += 8
    }

    // 2. On fire — orange tint + fire icon
    if (entry.isOnFire) {
      drawTileOverlay(0xff2200, 0.25)
      const fireLabel = this.add
        .text(cx, statusLabelY, '🔥 FIRE', {
          fontFamily: 'monospace',
          fontSize: '5px',
          color: '#ff4400',
        })
        .setOrigin(0.5)
        .setAlpha(0.9)
        .setDepth(baseDepth + 2)
      labels.push(fireLabel)
      statusLabelY += 8
    }

    // 3. Active incident — yellow warning triangle icon
    if (entry.hasIncident && !entry.isOnFire) {
      const incidentLabel = this.add
        .text(cx + CUBE_W / 2 + 2, topY + 2, '⚠', {
          fontFamily: 'monospace',
          fontSize: '8px',
          color: '#ffcc00',
        })
        .setOrigin(0.5)
        .setAlpha(0.8)
        .setDepth(baseDepth + 2)
      labels.push(incidentLabel)
    }

    // 4. Maintenance in progress — blue wrench icon + dimmed tint
    if (entry.inMaintenance) {
      drawTileOverlay(0x0066ff, 0.12)
      const maintLabel = this.add
        .text(cx + CUBE_W / 2 + 2, topY + 2, '🔧', {
          fontFamily: 'monospace',
          fontSize: '7px',
          color: '#4488ff',
        })
        .setOrigin(0.5)
        .setAlpha(0.8)
        .setDepth(baseDepth + 2)
      labels.push(maintLabel)
    }

    // 5. Powered-off cabinet — dark dimming overlay
    if (!entry.powerOn && entry.serverCount > 0) {
      drawTileOverlay(0x000000, 0.3)
      const offLabel = this.add
        .text(cx, statusLabelY, 'OFFLINE', {
          fontFamily: 'monospace',
          fontSize: '5px',
          color: '#556677',
        })
        .setOrigin(0.5)
        .setAlpha(0.5)
        .setDepth(baseDepth + 2)
      labels.push(offLabel)
      statusLabelY += 8
    }

    // 6. Aged/deprecated servers — yellowed tint (when server age > 60% of lifespan)
    if (entry.serverAge > 480 && entry.powerOn && entry.serverCount > 0) {
      const ageFactor = Math.min(1, (entry.serverAge - 480) / 320) // 480–800 range
      drawTileOverlay(0xccaa00, 0.06 + ageFactor * 0.1)
      if (entry.serverAge > 640) {
        const ageLabel = this.add
          .text(cx, statusLabelY, 'AGING', {
            fontFamily: 'monospace',
            fontSize: '4px',
            color: '#bbaa44',
          })
          .setOrigin(0.5)
          .setAlpha(0.5)
          .setDepth(baseDepth + 2)
        labels.push(ageLabel)
        statusLabelY += 8
      }
    }

    // 7. Recently placed — green highlight glow (fades over 3s)
    if (entry.recentlyPlaced > 0) {
      const elapsed = Date.now() - entry.recentlyPlaced
      if (elapsed < 3000) {
        const fadeAlpha = 0.2 * (1 - elapsed / 3000)
        drawTileOverlay(0x00ff88, fadeAlpha)
      } else {
        entry.recentlyPlaced = 0  // stop checking
      }
    }

    g.setDepth(baseDepth)
    this.cabinetGraphics.set(entry.id, g)
    this.cabinetLabels.set(entry.id, labels)
  }

  /** Render a spine switch in the elevated spine row */
  private renderSpine(entry: SpineEntry) {
    const oldG = this.spineGraphics.get(entry.id)
    if (oldG) oldG.destroy()
    const oldLabel = this.spineNodeLabels.get(entry.id)
    if (oldLabel) oldLabel.destroy()

    if (!this.layerVisibility.spine_switch) {
      this.spineGraphics.delete(entry.id)
      this.spineNodeLabels.delete(entry.id)
      return
    }

    const { x, y } = this.spineToScreen(entry.slot)
    const spineColors: LayerColors = this.layerColors.spine_switch ?? COLORS.spine_switch
    const opacity = this.layerOpacity.spine_switch
    const powerMult = entry.powerOn ? 1 : 0.2

    const g = this.add.graphics()
    const alpha = 0.9 * opacity * powerMult
    this.drawIsoCube(g, x, y + SPINE_H / 2, SPINE_W, SPINE_H, SPINE_DEPTH, spineColors, alpha)

    g.setDepth(5)
    this.spineGraphics.set(entry.id, g)

    // LED + label
    const ledColor = `#${spineColors.top.toString(16).padStart(6, '0')}`
    const label = this.add
      .text(x, y + SPINE_H / 2 - SPINE_DEPTH - 6, '●', {
        fontFamily: 'monospace',
        fontSize: '7px',
        color: ledColor,
      })
      .setOrigin(0.5)
      .setAlpha(entry.powerOn ? opacity : 0.1)
      .setDepth(6)
    this.spineNodeLabels.set(entry.id, label)
  }

  /** Re-render everything */
  private rerenderAll() {
    for (const entry of this.cabEntries.values()) {
      this.renderCabinet(entry)
    }
    for (const entry of this.spineEntries.values()) {
      this.renderSpine(entry)
    }
    this.renderTraffic()
  }

  /** Phaser update loop — animate packet dots and ambient effects */
  update(_time: number, delta: number) {
    const dt = delta * 0.001
    this.ambientTime += dt

    // Traffic packet animation
    if (this.trafficVisible && this.trafficLinks.length > 0) {
      this.packetTime += dt
      this.renderPackets()
    }

    // Ambient LED and activity indicators (runs every frame)
    this.renderAmbientOverlay()

    // Worker sprites (peeps) — move and draw
    this.updateWorkers(dt)

    // Particle effects — update and draw
    this.updateParticles(dt)

    // Weather overlay particles
    this.updateWeatherOverlay(dt)

    // Day/night ambient light
    this.renderDayNightOverlay()
  }

  /** Draw ambient animated overlays: LED pulses on cabinets, glow on active spines, cooling fan indicators */
  private renderAmbientOverlay() {
    if (!this.ambientGraphicsLayer) {
      this.ambientGraphicsLayer = this.add.graphics()
    }
    const g = this.ambientGraphicsLayer
    g.clear()
    g.setDepth(200) // above cabinets but below UI overlays

    const t = this.ambientTime

    // Cabinet LED pulse: slow blink (2s cycle) when idle, fast (0.4s) when hot, off when powered down
    for (const entry of this.cabEntries.values()) {
      if (!entry.powerOn || entry.serverCount === 0) continue

      const { x, y } = this.isoToScreen(entry.col, entry.row)
      // LED position: small dot to the right of the cabinet
      const ledX = x + CUBE_W / 2 - 6
      const ledY = y - CABINET_ENCLOSURE_DEPTH + BASE_DEPTH + 4

      // Determine blink speed based on heat level
      let blinkSpeed: number
      let ledColor: number
      if (entry.isOnFire) {
        blinkSpeed = 4    // very fast blink
        ledColor = 0xff4444
      } else if (entry.isThrottled) {
        blinkSpeed = 2.5  // fast blink
        ledColor = 0xff8844
      } else if (entry.heatLevel > 60) {
        blinkSpeed = 1.5  // moderate blink
        ledColor = 0xffcc00
      } else {
        blinkSpeed = 0.5  // slow pulse
        ledColor = 0x00ff88
      }

      // Sinusoidal alpha modulation
      const alpha = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(t * blinkSpeed * Math.PI * 2))
      g.fillStyle(ledColor, alpha)
      g.fillCircle(ledX, ledY, 2)
    }

    // Spine switch activity glow: pulse when handling traffic
    for (const entry of this.spineEntries.values()) {
      if (!entry.powerOn) continue
      const { x, y } = this.spineToScreen(entry.slot)
      // Subtle glow pulse (1.5s cycle)
      const glowAlpha = 0.08 + 0.12 * (0.5 + 0.5 * Math.sin(t * 0.67 * Math.PI * 2 + entry.slot * 1.2))
      g.fillStyle(0xff6644, glowAlpha)
      g.fillCircle(x, y + SPINE_H / 2, SPINE_W / 2)
    }

    // Cooling unit fan indicator: rotating line segments
    for (const entry of this.coolingUnitEntries.values()) {
      if (!entry.operational) continue
      const { x, y } = this.isoToScreen(entry.col, entry.row)
      const fanCenterY = y - 8
      const fanRadius = 5
      const rotAngle = t * 3 // 3 radians/sec rotation
      // Draw 3 rotating fan blade lines
      g.lineStyle(1.5, 0x00aaff, 0.5)
      for (let i = 0; i < 3; i++) {
        const angle = rotAngle + (i * Math.PI * 2) / 3
        const bx = x + Math.cos(angle) * fanRadius
        const by = fanCenterY + Math.sin(angle) * fanRadius * 0.5 // compressed for isometric
        g.beginPath()
        g.moveTo(x, fanCenterY)
        g.lineTo(bx, by)
        g.strokePath()
      }
    }
  }

  /** Get the screen position of a leaf switch on top of a cabinet */
  private getLeafScreenPos(cabId: string): { x: number; y: number } | null {
    const entry = this.cabEntries.get(cabId)
    if (!entry) return null
    const { x, y } = this.isoToScreen(entry.col, entry.row)
    // Leaf is always at the top of the fixed-height cabinet enclosure
    const topY = y + TILE_H / 2 - CABINET_ENCLOSURE_DEPTH
    return { x, y: topY }
  }

  /** Get the screen position of a spine switch */
  private getSpineScreenPos(spineId: string): { x: number; y: number } | null {
    const entry = this.spineEntries.get(spineId)
    if (!entry) return null
    const { x, y } = this.spineToScreen(entry.slot)
    return { x, y: y + SPINE_H / 2 + SPINE_DEPTH / 2 }
  }

  /** Map utilization 0–1 to a color: green → yellow → red */
  private utilizationColor(util: number, redirected: boolean): number {
    if (redirected) {
      // Amber/yellow for redirected traffic
      const intensity = 0.5 + util * 0.5
      const r = Math.round(255 * intensity)
      const g = Math.round(180 * intensity)
      const b = Math.round(30 * (1 - util))
      return (r << 16) | (g << 8) | b
    }
    // Green → Yellow → Red gradient based on utilization
    if (util < 0.5) {
      // Green to Yellow
      const t = util / 0.5
      const r = Math.round(t * 255)
      const g = 255
      const b = Math.round(80 * (1 - t))
      return (r << 16) | (g << 8) | b
    }
    // Yellow to Red
    const t = (util - 0.5) / 0.5
    const r = 255
    const g = Math.round(255 * (1 - t))
    const b = 0
    return (r << 16) | (g << 8) | b
  }

  /** Render traffic connection lines between leaf and spine switches */
  private renderTraffic() {
    if (this.trafficGraphics) this.trafficGraphics.destroy()
    this.trafficGraphics = this.add.graphics()
    this.trafficGraphics.setDepth(4) // between floor and spine layer

    if (!this.trafficVisible || this.trafficLinks.length === 0) return

    for (const link of this.trafficLinks) {
      const leafPos = this.getLeafScreenPos(link.leafCabinetId)
      const spinePos = this.getSpineScreenPos(link.spineId)
      if (!leafPos || !spinePos) continue

      const color = this.utilizationColor(link.utilization, link.redirected)
      const alpha = 0.15 + link.utilization * 0.45
      const lineWidth = link.redirected ? 2 : 1.5

      // Low-traffic links: dashed line to indicate degraded/minimal connection
      if (link.utilization < 0.1 && link.bandwidthGbps > 0) {
        const segments = 12
        const dx = spinePos.x - leafPos.x
        const dy = spinePos.y - leafPos.y
        this.trafficGraphics.lineStyle(1, color, alpha * 0.5)
        for (let s = 0; s < segments; s += 2) {
          const t0 = s / segments
          const t1 = (s + 1) / segments
          this.trafficGraphics.lineBetween(
            leafPos.x + dx * t0, leafPos.y + dy * t0,
            leafPos.x + dx * t1, leafPos.y + dy * t1
          )
        }
      } else {
        this.trafficGraphics.lineStyle(lineWidth, color, alpha)
        this.trafficGraphics.lineBetween(leafPos.x, leafPos.y, spinePos.x, spinePos.y)
      }
    }
  }

  /** Render animated packet dots moving along traffic lines.
   *  - Speed scales with bandwidth (low traffic = slow-moving packets)
   *  - Packet loss visualized on congested links (>80% utilization)
   *  - Dim/small packets on near-zero traffic links */
  private renderPackets() {
    if (this.packetGraphics) this.packetGraphics.destroy()
    this.packetGraphics = this.add.graphics()
    this.packetGraphics.setDepth(7) // above everything

    if (!this.trafficVisible || this.trafficLinks.length === 0) return

    for (let i = 0; i < this.trafficLinks.length; i++) {
      const link = this.trafficLinks[i]
      const leafPos = this.getLeafScreenPos(link.leafCabinetId)
      const spinePos = this.getSpineScreenPos(link.spineId)
      if (!leafPos || !spinePos) continue

      const color = this.utilizationColor(link.utilization, link.redirected)
      const dx = spinePos.x - leafPos.x
      const dy = spinePos.y - leafPos.y

      // Packet speed scales with utilization — low traffic = slow, high traffic = fast
      const speedMult = 0.2 + Math.min(link.utilization, 1) * 0.8

      // Number of packets proportional to utilization (1–3 dots)
      const packetCount = Math.max(1, Math.ceil(link.utilization * 3))

      // Packet loss rate: congested links (>80% utilization) start dropping packets
      const dropRate = link.utilization > 0.8 ? (link.utilization - 0.8) * 5 : 0

      for (let p = 0; p < packetCount; p++) {
        // Per-link phase: advances proportionally to speed (bandwidth)
        const t = ((this.packetTime * speedMult + p / packetCount + i * 0.17) % 1)

        // Deterministic pseudo-random for packet drop decision
        // Changes every ~0.5s per link so drops feel natural, not flickering
        const cycle = Math.floor(this.packetTime * speedMult * 2 + i * 0.17)
        const hash = Math.abs(Math.sin(i * 127.1 + p * 311.7 + cycle * 43.7))

        if (hash < dropRate) {
          // Packet "drops" mid-transit: deviates from path, turns red, fades out
          const dropZone = 0.3 + hash * 0.4
          if (t > dropZone && t < dropZone + 0.25) {
            const dropProgress = (t - dropZone) / 0.25
            const px = leafPos.x + dx * t
            const py = leafPos.y + dy * t + dropProgress * 12 // fall downward
            const dropAlpha = 0.7 * (1 - dropProgress)

            this.packetGraphics.fillStyle(0xff2222, dropAlpha)
            this.packetGraphics.fillCircle(px, py, 1.5)
          }
        } else {
          // Normal packet — dim and small on very low-traffic links
          const px = leafPos.x + dx * t
          const py = leafPos.y + dy * t
          const baseSize = link.redirected ? 2.5 : 2
          const packetAlpha = link.utilization < 0.1 ? 0.3 + link.utilization * 5 : 0.8
          const size = link.utilization < 0.1 ? baseSize * 0.7 : baseSize

          this.packetGraphics.fillStyle(color, packetAlpha)
          this.packetGraphics.fillCircle(px, py, size)
        }
      }
    }
  }

  // ── Worker Sprites (Peeps) ──────────────────────────────

  /** Sync worker list from game state staff members */
  syncWorkers(staffList: { id: string; role: string; onShift: boolean }[]) {
    // Remove workers that no longer exist
    this.workers = this.workers.filter(w =>
      staffList.some(s => s.id === w.id && s.onShift)
    )

    // Add new workers
    for (const s of staffList) {
      if (!s.onShift) continue
      if (this.workers.some(w => w.id === s.id)) continue

      // Pick a patrol row: corridors or aisles
      const patrolRows: number[] = []
      if (this.layout) {
        patrolRows.push(this.layout.corridorTop, this.layout.corridorBottom)
        for (const a of this.layout.aisles) patrolRows.push(a.gridRow)
      }
      const patrolRow = patrolRows.length > 0
        ? patrolRows[Math.floor(Math.random() * patrolRows.length)]
        : 0
      const startCol = Math.random() * this.cabCols
      const pos = this.isoToScreen(startCol, patrolRow)

      this.workers.push({
        id: s.id,
        role: s.role as WorkerSprite['role'],
        screenX: pos.x,
        screenY: pos.y + TILE_H / 2,
        targetX: pos.x,
        targetY: pos.y + TILE_H / 2,
        speed: 30 + Math.random() * 20,
        busy: false,
        patrolDir: Math.random() > 0.5 ? 1 : -1,
        patrolRow,
      })
    }
  }

  /** Dispatch nearest idle worker to an incident's cabinet location */
  dispatchWorkerToIncident(cabinetCol: number, cabinetRow: number) {
    const target = this.isoToScreen(cabinetCol, cabinetRow)
    let best: WorkerSprite | null = null
    let bestDist = Infinity
    for (const w of this.workers) {
      if (w.busy) continue
      const dist = Math.abs(w.screenX - target.x) + Math.abs(w.screenY - target.y)
      if (dist < bestDist) { bestDist = dist; best = w }
    }
    if (best) {
      best.busy = true
      best.targetX = target.x
      best.targetY = target.y + TILE_H / 2
    }
  }

  /** Update worker positions and draw them */
  private updateWorkers(dt: number) {
    if (this.workers.length === 0) return
    if (!this.workerGraphicsLayer) {
      this.workerGraphicsLayer = this.add.graphics()
    }
    const g = this.workerGraphicsLayer
    g.clear()
    g.setDepth(250) // above ambient overlays

    for (const w of this.workers) {
      // Move toward target
      const dx = w.targetX - w.screenX
      const dy = w.targetY - w.screenY
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist > 2) {
        const step = w.speed * dt
        if (step >= dist) {
          w.screenX = w.targetX
          w.screenY = w.targetY
        } else {
          w.screenX += (dx / dist) * step
          w.screenY += (dy / dist) * step
        }
      } else {
        // Reached target — if busy, go back to patrolling
        if (w.busy) {
          w.busy = false
        }
        // Patrol: pick next patrol waypoint
        if (!w.busy) {
          const edgeLeft = this.isoToScreen(0, w.patrolRow)
          const edgeRight = this.isoToScreen(this.cabCols - 1, w.patrolRow)
          // Move along row in patrol direction
          if (w.patrolDir > 0 && w.screenX >= edgeRight.x - 10) {
            w.patrolDir = -1
          } else if (w.patrolDir < 0 && w.screenX <= edgeLeft.x + 10) {
            w.patrolDir = 1
          }
          const nextCol = Math.max(0, Math.min(this.cabCols - 1,
            w.patrolDir > 0 ? this.cabCols - 1 : 0
          ))
          const nextPos = this.isoToScreen(nextCol, w.patrolRow)
          w.targetX = nextPos.x
          w.targetY = nextPos.y + TILE_H / 2
        }
      }

      // Draw worker: small procedural figure
      const color = WORKER_ROLE_COLORS[w.role] ?? 0xcccccc
      const x = w.screenX
      const y = w.screenY

      // Body (small isometric diamond)
      g.fillStyle(color, 0.8)
      g.beginPath()
      g.moveTo(x, y - 8)
      g.lineTo(x + 4, y - 3)
      g.lineTo(x, y + 1)
      g.lineTo(x - 4, y - 3)
      g.closePath()
      g.fillPath()

      // Head (circle)
      g.fillStyle(color, 0.9)
      g.fillCircle(x, y - 10, 2.5)

      // Busy indicator: small exclamation mark
      if (w.busy) {
        g.fillStyle(0xff4444, 0.9)
        g.fillCircle(x, y - 14, 1.5)
      }
    }
  }

  // ── Particle Effects ──────────────────────────────────

  /** Spawn particles at a screen position */
  spawnParticles(screenX: number, screenY: number, count: number, color: number, spread = 30, speed = 40, life = 0.6, size = 2) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const v = speed * (0.5 + Math.random() * 0.5)
      this.particles.push({
        x: screenX + (Math.random() - 0.5) * 4,
        y: screenY + (Math.random() - 0.5) * 4,
        vx: Math.cos(angle) * v * (spread / 30),
        vy: Math.sin(angle) * v * (spread / 30) - speed * 0.3,
        color,
        alpha: 0.8 + Math.random() * 0.2,
        life: life * (0.7 + Math.random() * 0.3),
        maxLife: life,
        size: size * (0.5 + Math.random() * 0.5),
      })
    }
  }

  /** Spawn fire particles over a cabinet */
  spawnFireParticles(col: number, row: number) {
    const pos = this.isoToScreen(col, row)
    this.spawnParticles(pos.x, pos.y - CABINET_ENCLOSURE_DEPTH / 2, 5, 0xff4400, 15, 25, 0.8, 3)
    this.spawnParticles(pos.x, pos.y - CABINET_ENCLOSURE_DEPTH / 2, 3, 0xff8800, 10, 20, 0.6, 2)
  }

  /** Spawn electric spark particles (overloaded PDU) */
  spawnSparkParticles(col: number, row: number) {
    const pos = this.isoToScreen(col, row)
    this.spawnParticles(pos.x, pos.y + TILE_H / 4, 6, 0xffff00, 20, 50, 0.3, 1.5)
    this.spawnParticles(pos.x, pos.y + TILE_H / 4, 3, 0xffffff, 15, 40, 0.2, 1)
  }

  /** Spawn cooling mist particles */
  spawnCoolMist(col: number, row: number) {
    const pos = this.isoToScreen(col, row)
    this.spawnParticles(pos.x, pos.y + TILE_H / 4, 4, 0x00aaff, 20, 10, 1.0, 3)
  }

  /** Spawn heat shimmer particles (throttled cabinet) */
  spawnHeatShimmer(col: number, row: number) {
    const pos = this.isoToScreen(col, row)
    for (let i = 0; i < 3; i++) {
      this.particles.push({
        x: pos.x + (Math.random() - 0.5) * CUBE_W * 0.6,
        y: pos.y - CABINET_ENCLOSURE_DEPTH * 0.3,
        vx: (Math.random() - 0.5) * 5,
        vy: -8 - Math.random() * 5,
        color: 0xff8844,
        alpha: 0.15,
        life: 1.5,
        maxLife: 1.5,
        size: 4 + Math.random() * 3,
      })
    }
  }

  /** Spawn cyan sparkle burst (server refresh) */
  spawnRefreshSparkle(col: number, row: number) {
    const pos = this.isoToScreen(col, row)
    this.spawnParticles(pos.x, pos.y - CABINET_ENCLOSURE_DEPTH / 2, 10, 0x00ffcc, 25, 35, 0.5, 2)
  }

  /** Spawn red warning pulse ring (critical incident) */
  spawnIncidentPulse(col: number, row: number) {
    const pos = this.isoToScreen(col, row)
    const ring = this.add.graphics()
    ring.setDepth(300)
    let radius = 5
    let alpha = 0.8
    const timer = this.time.addEvent({
      delay: 30, repeat: 20,
      callback: () => {
        ring.clear()
        alpha -= 0.04
        radius += 3
        if (alpha <= 0) { ring.destroy(); timer.destroy(); return }
        ring.lineStyle(2.5, 0xff2222, alpha)
        ring.strokeCircle(pos.x, pos.y + TILE_H / 2, radius)
      },
    })
  }

  /** Spawn gold particle shower (achievement) */
  spawnAchievementShower() {
    const w = this.scale.width
    for (let i = 0; i < 20; i++) {
      this.particles.push({
        x: Math.random() * w,
        y: -10,
        vx: (Math.random() - 0.5) * 20,
        vy: 40 + Math.random() * 30,
        color: Math.random() > 0.5 ? 0xffd700 : 0xffaa00,
        alpha: 0.9,
        life: 2.0 + Math.random(),
        maxLife: 2.5,
        size: 2 + Math.random() * 2,
      })
    }
  }

  /** Update and render all active particles */
  private updateParticles(dt: number) {
    if (this.particles.length === 0 && this.particleGraphicsLayer) {
      this.particleGraphicsLayer.clear()
      return
    }
    if (this.particles.length === 0) return

    if (!this.particleGraphicsLayer) {
      this.particleGraphicsLayer = this.add.graphics()
    }
    const g = this.particleGraphicsLayer
    g.clear()
    g.setDepth(280)

    // Update and cull
    this.particles = this.particles.filter(p => {
      p.life -= dt
      if (p.life <= 0) return false
      p.x += p.vx * dt
      p.y += p.vy * dt
      p.vy += 15 * dt // gravity
      return true
    })

    // Draw
    for (const p of this.particles) {
      const lifeFrac = p.life / p.maxLife
      g.fillStyle(p.color, p.alpha * lifeFrac)
      g.fillCircle(p.x, p.y, p.size * (0.3 + lifeFrac * 0.7))
    }
  }

  // ── Weather Overlay ──────────────────────────────────

  /** Set current weather conditions for overlay rendering */
  setWeatherCondition(weather: string, season: string, gameHour: number) {
    this.currentWeather = weather
    this.currentSeason = season
    this.currentGameHour = gameHour
  }

  /** Update weather particle overlay (rain, snow, heat shimmer) */
  private updateWeatherOverlay(dt: number) {
    if (!this.weatherOverlayGraphics) {
      this.weatherOverlayGraphics = this.add.graphics()
    }
    const g = this.weatherOverlayGraphics
    g.clear()
    g.setDepth(290)

    const w = this.scale.width
    const h = this.scale.height
    const cam = this.cameras.main

    const isRain = this.currentWeather === 'rain' || this.currentWeather === 'storm'
    const isSnow = this.currentSeason === 'winter' && (this.currentWeather === 'cloudy' || this.currentWeather === 'storm')
    const isHeatwave = this.currentWeather === 'heatwave'

    if (!isRain && !isSnow && !isHeatwave) {
      this.weatherParticles = []
      return
    }

    // Spawn new weather particles
    const spawnRate = this.currentWeather === 'storm' ? 8 : 3
    for (let i = 0; i < spawnRate; i++) {
      if (this.weatherParticles.length > 200) break
      if (isRain) {
        this.weatherParticles.push({
          x: cam.scrollX + Math.random() * w * 1.5,
          y: cam.scrollY - 10,
          vx: -30 - Math.random() * 20,
          vy: 180 + Math.random() * 80,
          alpha: 0.2 + Math.random() * 0.3,
          size: 1,
          color: 0x6688cc,
        })
      } else if (isSnow) {
        this.weatherParticles.push({
          x: cam.scrollX + Math.random() * w * 1.5,
          y: cam.scrollY - 10,
          vx: (Math.random() - 0.5) * 20,
          vy: 20 + Math.random() * 15,
          alpha: 0.4 + Math.random() * 0.3,
          size: 1.5 + Math.random(),
          color: 0xccddff,
        })
      } else if (isHeatwave) {
        this.weatherParticles.push({
          x: cam.scrollX + Math.random() * w,
          y: cam.scrollY + h * 0.6 + Math.random() * h * 0.4,
          vx: (Math.random() - 0.5) * 8,
          vy: -10 - Math.random() * 8,
          alpha: 0.06 + Math.random() * 0.06,
          size: 8 + Math.random() * 12,
          color: 0xff6644,
        })
      }
    }

    // Update and render
    this.weatherParticles = this.weatherParticles.filter(p => {
      p.x += p.vx * dt
      p.y += p.vy * dt
      // Remove if off screen
      return p.y < cam.scrollY + h + 20 && p.y > cam.scrollY - 20 &&
             p.x > cam.scrollX - 50 && p.x < cam.scrollX + w + 50
    })

    for (const p of this.weatherParticles) {
      if (isRain) {
        // Rain streaks
        g.lineStyle(p.size, p.color, p.alpha)
        g.lineBetween(p.x, p.y, p.x + p.vx * 0.02, p.y + p.vy * 0.02)
      } else {
        // Snow and heat shimmer dots
        g.fillStyle(p.color, p.alpha)
        g.fillCircle(p.x, p.y, p.size)
      }
    }
  }

  // ── Day/Night Overlay ──────────────────────────────────

  /** Render day/night ambient light shift */
  private renderDayNightOverlay() {
    if (!this.dayNightOverlay) {
      this.dayNightOverlay = this.add.graphics()
    }
    const g = this.dayNightOverlay
    g.clear()
    g.setDepth(285)

    // Calculate darkness based on game hour (0-24)
    // Night: 20:00 - 06:00 → darker overlay
    // Dusk/dawn: 06:00-08:00, 18:00-20:00 → gradual transition
    let darkness = 0
    const h = this.currentGameHour
    if (h >= 21 || h < 5) {
      darkness = 0.15 // full night
    } else if (h >= 5 && h < 7) {
      darkness = 0.15 * (1 - (h - 5) / 2) // dawn
    } else if (h >= 19 && h < 21) {
      darkness = 0.15 * ((h - 19) / 2) // dusk
    }

    if (darkness > 0.01) {
      const cam = this.cameras.main
      g.fillStyle(0x000022, darkness)
      g.fillRect(cam.scrollX - 100, cam.scrollY - 100,
        this.scale.width + 200, this.scale.height + 200)
    }
  }

  // ── Placement Animations ────────────────────────────────

  /** Play an expanding ring + flash effect at an isometric tile position */
  private playPlacementEffect(screenX: number, screenY: number, color: number) {
    // Expanding ring
    const ring = this.add.graphics()
    ring.setPosition(screenX, screenY)
    ring.setDepth(9999)
    const maxRadius = TILE_W * 0.8
    this.tweens.add({
      targets: { radius: 4, alpha: 0.8 },
      radius: maxRadius,
      alpha: 0,
      duration: 500,
      ease: 'Power2',
      onUpdate: (_tween: Phaser.Tweens.Tween, target: { radius: number; alpha: number }) => {
        ring.clear()
        ring.lineStyle(2, color, target.alpha)
        ring.strokeCircle(0, 0, target.radius)
      },
      onComplete: () => ring.destroy(),
    })

    // Flash overlay (isometric diamond)
    const flash = this.add.graphics()
    flash.setDepth(9998)
    const hw = TILE_W / 2
    const hh = TILE_H / 2
    flash.fillStyle(color, 0.35)
    flash.beginPath()
    flash.moveTo(screenX, screenY - hh)
    flash.lineTo(screenX + hw, screenY)
    flash.lineTo(screenX, screenY + hh)
    flash.lineTo(screenX - hw, screenY)
    flash.closePath()
    flash.fillPath()
    this.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 400,
      ease: 'Power2',
      onComplete: () => flash.destroy(),
    })
  }

  /** Play a scale-in bounce on a cabinet's graphics */
  private playCabinetScaleIn(id: string) {
    const gfx = this.cabinetGraphics.get(id)
    const labels = this.cabinetLabels.get(id) ?? []
    if (!gfx) return
    // Phaser Graphics don't support setScale nicely, so we animate alpha as a pop-in
    gfx.setAlpha(0)
    this.tweens.add({
      targets: gfx,
      alpha: 1,
      duration: 300,
      ease: 'Back.easeOut',
    })
    for (const label of labels) {
      label.setAlpha(0)
      this.tweens.add({
        targets: label,
        alpha: 1,
        duration: 300,
        ease: 'Back.easeOut',
        delay: 50,
      })
    }
  }

  /** Play a scale pulse on a cabinet's graphics when a server is installed */
  private playServerInstallPulse(id: string) {
    const gfx = this.cabinetGraphics.get(id)
    if (!gfx) return
    this.tweens.add({
      targets: gfx,
      alpha: { from: 0.5, to: 1 },
      duration: 200,
      ease: 'Bounce.easeOut',
    })
  }

  /** Play a cyan flash at a screen position (leaf switch install) */
  private playCyanFlash(screenX: number, screenY: number) {
    const flash = this.add.graphics()
    flash.setDepth(9999)
    flash.fillStyle(0x00aaff, 0.6)
    const hw = CUBE_W / 2
    const hh = CUBE_H / 4
    flash.beginPath()
    flash.moveTo(screenX, screenY)
    flash.lineTo(screenX + hw, screenY + hh)
    flash.lineTo(screenX, screenY + hh * 2)
    flash.lineTo(screenX - hw, screenY + hh)
    flash.closePath()
    flash.fillPath()
    this.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 350,
      ease: 'Power2',
      onComplete: () => flash.destroy(),
    })
  }

  /** Play a removal animation: red flash + fade out */
  playRemovalEffect(col: number, row: number) {
    const pos = this.isoToScreen(col, row)
    const flash = this.add.graphics()
    flash.setDepth(9999)
    flash.fillStyle(0xff2222, 0.5)
    const hw = TILE_W / 2
    const hh = TILE_H / 2
    flash.beginPath()
    flash.moveTo(pos.x, pos.y)
    flash.lineTo(pos.x + hw, pos.y + hh)
    flash.lineTo(pos.x, pos.y + TILE_H)
    flash.lineTo(pos.x - hw, pos.y + hh)
    flash.closePath()
    flash.fillPath()
    this.tweens.add({
      targets: flash,
      alpha: 0,
      scaleX: 0.3,
      scaleY: 0.3,
      duration: 300,
      ease: 'Power2',
      onComplete: () => flash.destroy(),
    })
    this.playSFX('remove')
  }

  // ── Public API ──────────────────────────────────────────

  addCabinetToScene(id: string, col: number, row: number, serverCount: number, hasLeafSwitch: boolean, environment: CabinetEnvironment = 'production', facing: CabinetFacing = 'north') {
    this.cabCount++

    const entry: CabinetEntry = { id, col, row, serverCount, hasLeafSwitch, powerOn: true, environment, facing, heatLevel: 22, isThrottled: false, isOnFire: false, hasIncident: false, inMaintenance: false, serverAge: 0, recentlyPlaced: Date.now() }
    this.cabEntries.set(id, entry)
    this.occupiedTiles.add(`${col},${row}`)
    this.renderCabinet(entry)

    // Track initial state for detecting installs
    this.prevServerCounts.set(id, serverCount)
    this.prevLeafSwitches.set(id, hasLeafSwitch)

    // Placement animation: expanding ring + flash + fade-in
    const { x, y } = this.isoToScreen(col, row)
    this.playPlacementEffect(x, y, 0x00ff88)
    this.playCabinetScaleIn(id)
    this.playSFX('build')

    // Smooth camera pan to newly placed cabinet
    this.cameraPanTo(col, row, 300)
  }

  updateCabinet(id: string, serverCount: number, hasLeafSwitch: boolean, powerOn: boolean, environment: CabinetEnvironment = 'production', facing: CabinetFacing = 'north', visualState?: { heatLevel: number; isThrottled: boolean; isOnFire: boolean; hasIncident: boolean; inMaintenance: boolean; serverAge: number }) {
    const entry = this.cabEntries.get(id)
    if (!entry) return

    // Detect server install → scale pulse + green particle burst
    const prevServers = this.prevServerCounts.get(id) ?? 0
    if (serverCount > prevServers && prevServers >= 0) {
      const pos = this.isoToScreen(entry.col, entry.row)
      this.spawnParticles(pos.x, pos.y - CABINET_ENCLOSURE_DEPTH / 2, 8, 0x00ff88, 20, 30, 0.4, 2)
      this.playServerInstallPulse(id)
      this.playSFX('server_install')
    }
    this.prevServerCounts.set(id, serverCount)

    // Detect leaf switch add → cyan flash on top
    const hadLeaf = this.prevLeafSwitches.get(id) ?? false
    if (hasLeafSwitch && !hadLeaf) {
      const pos = this.isoToScreen(entry.col, entry.row)
      this.playCyanFlash(pos.x, pos.y - CABINET_ENCLOSURE_DEPTH)
      this.playSFX('switch_click')
    }
    this.prevLeafSwitches.set(id, hasLeafSwitch)

    entry.serverCount = serverCount
    entry.hasLeafSwitch = hasLeafSwitch
    entry.powerOn = powerOn
    entry.environment = environment
    entry.facing = facing
    if (visualState) {
      entry.heatLevel = visualState.heatLevel
      entry.isThrottled = visualState.isThrottled
      entry.isOnFire = visualState.isOnFire
      entry.hasIncident = visualState.hasIncident
      entry.inMaintenance = visualState.inMaintenance
      entry.serverAge = visualState.serverAge
    }
    this.renderCabinet(entry)
  }

  addSpineToScene(id: string) {
    const slot = this.spineCount++
    const entry: SpineEntry = { id, slot, powerOn: true }
    this.spineEntries.set(id, entry)
    this.renderSpine(entry)

    // Placement animation: orange ring + flash + fade-in
    const { x, y } = this.spineToScreen(slot)
    this.playPlacementEffect(x, y, 0xff6644)
    const gfx = this.spineGraphics.get(id)
    if (gfx) {
      gfx.setAlpha(0)
      this.tweens.add({ targets: gfx, alpha: 1, duration: 300, ease: 'Back.easeOut' })
    }
    const label = this.spineNodeLabels.get(id)
    if (label) {
      label.setAlpha(0)
      this.tweens.add({ targets: label, alpha: 1, duration: 300, ease: 'Back.easeOut', delay: 50 })
    }
    this.playSFX('build')
  }

  updateSpine(id: string, powerOn: boolean) {
    const entry = this.spineEntries.get(id)
    if (!entry) return
    entry.powerOn = powerOn
    this.renderSpine(entry)
  }

  setLayerVisibility(visibility: LayerVisibility) {
    this.layerVisibility = visibility
    this.rerenderAll()
  }

  setLayerOpacity(opacity: LayerOpacity) {
    this.layerOpacity = opacity
    this.rerenderAll()
  }

  setLayerColors(colors: LayerColorOverrides) {
    this.layerColors = colors
    this.rerenderAll()
  }

  /** Update traffic link data and re-render lines */
  setTrafficLinks(links: TrafficLink[]) {
    this.trafficLinks = links
    this.renderTraffic()
  }

  /** Update grid dimensions (on suite upgrade) and rebuild the scene layout */
  setGridSize(cols: number, rows: number, spineSlots: number, layout?: DataCenterLayout) {
    if (cols === this.cabCols && rows === this.cabRows && spineSlots === this.spineSlots && !layout) return

    this.cabCols = cols
    this.cabRows = rows
    this.spineSlots = spineSlots
    if (layout) this.layout = layout

    // Recalculate offsets (centered both horizontally and vertically)
    this.computeLayout()

    // Clear and redraw floor/grid/aisles/corridors
    if (this.floorGraphics) { this.floorGraphics.destroy(); this.floorGraphics = null }
    if (this.gridGraphics) { this.gridGraphics.destroy(); this.gridGraphics = null }
    if (this.spineFloorGraphics) { this.spineFloorGraphics.destroy(); this.spineFloorGraphics = null }
    if (this.spineLabel) { this.spineLabel.destroy(); this.spineLabel = null }
    if (this.aisleGraphics) { this.aisleGraphics.destroy(); this.aisleGraphics = null }
    for (const label of this.aisleLabels) label.destroy()
    this.aisleLabels = []
    if (this.corridorGraphics) { this.corridorGraphics.destroy(); this.corridorGraphics = null }
    if (this.containmentGraphics) { this.containmentGraphics.destroy(); this.containmentGraphics = null }

    this.drawSpineFloor()
    this.drawFloor()
    this.drawGrid()
    this.drawAisles()
    this.drawCorridors()

    // Rebuild occupied tiles set (positions are preserved — grid only grows)
    this.occupiedTiles.clear()
    for (const entry of this.cabEntries.values()) {
      this.occupiedTiles.add(`${entry.col},${entry.row}`)
    }

    // Reposition existing spines on new spine slots
    let spineIdx = 0
    for (const entry of this.spineEntries.values()) {
      entry.slot = spineIdx
      spineIdx++
    }

    // Re-render everything at new positions
    this.rerenderAll()
  }

  /** Toggle traffic visualization on/off */
  setTrafficVisible(visible: boolean) {
    this.trafficVisible = visible
    if (!visible) {
      if (this.trafficGraphics) { this.trafficGraphics.destroy(); this.trafficGraphics = null }
      if (this.packetGraphics) { this.packetGraphics.destroy(); this.packetGraphics = null }
    } else {
      this.renderTraffic()
    }
  }

  // ── Placement Mode API ──────────────────────────────────────

  /** Enter placement mode — shows hover highlights and accepts tile clicks */
  setPlacementMode(active: boolean) {
    this.placementActive = active
    // Clear hover when entering/exiting placement mode
    this.hoveredCabinetId = null
    this.hoveredSpineId = null
    this.renderHover()
    if (!active) {
      this.hoveredTile = null
      if (this.placementHighlight) {
        this.placementHighlight.clear()
      }
      this.clearZoneOverlays()
      if (this.placementHintText) {
        this.placementHintText.setVisible(false)
      }
      if (this.placementModeLabel) {
        this.placementModeLabel.destroy()
        this.placementModeLabel = null
      }
    } else {
      // Show placement mode indicator — position below the grid
      const w = this.scale.width
      const labelRow = this.cabRows + 1
      this.placementModeLabel = this.add
        .text(w / 2, this.offsetY + labelRow * TILE_H, 'CLICK A ROW SLOT TO PLACE CABINET', {
          fontFamily: 'monospace',
          fontSize: '10px',
          color: '#00ff88',
        })
        .setOrigin(0.5)
        .setAlpha(0.8)
        .setDepth(100)
    }
  }

  /** Update placement facing direction (synced from React store) */
  setPlacementFacing(facing: CabinetFacing) {
    this.placementFacing = facing
    // Re-draw highlight if we're already hovering a tile
    if (this.placementActive && this.hoveredTile) {
      this.drawPlacementHighlight(this.hoveredTile.col, this.hoveredTile.row)
    }
  }

  /** Toggle row placement mode (for custom row layout) */
  setRowPlacementMode(active: boolean) {
    this.rowPlacementActive = active
  }

  /** Register callback for tile clicks during placement mode */
  setOnTileClick(callback: ((col: number, row: number) => void) | null) {
    this.onTileClick = callback
  }

  /** Register callback for tile hover hints during placement mode */
  setOnTileHover(callback: ((col: number, row: number) => PlacementHint[]) | null) {
    this.onTileHover = callback
  }

  /** Update the set of occupied tiles (called when cabinet state changes) */
  syncOccupiedTiles(occupied: Set<string>) {
    const changed = occupied.size !== this.occupiedTiles.size ||
      [...occupied].some(key => !this.occupiedTiles.has(key))
    this.occupiedTiles = occupied
    // Refresh floor tiles to update aisle visualization when cabinet layout changes
    if (changed) {
      this.refreshFloor()
    }
  }

  /** Redraw floor tiles to reflect current aisle layout */
  private refreshFloor() {
    if (this.floorGraphics) {
      this.floorGraphics.destroy()
      this.floorGraphics = null
    }
    this.drawFloor()
  }

  // ── Infrastructure Layout API ──────────────────────────────

  /** Render a PDU at a grid position */
  private renderPDU(entry: PDUEntry) {
    const oldG = this.pduGraphics.get(entry.id)
    if (oldG) oldG.destroy()
    const oldLabel = this.pduLabels.get(entry.id)
    if (oldLabel) oldLabel.destroy()

    const { x, y } = this.isoToScreen(entry.col, entry.row)
    const cx = x
    const cy = y + TILE_H / 2

    const g = this.add.graphics()
    const baseDepth = 10 + entry.row * this.cabCols + entry.col

    // PDU is a small yellow/orange box
    const pduColor = entry.overloaded
      ? { top: 0xff4444, side: 0xcc2222, front: 0x991111 }
      : { top: 0xffaa00, side: 0xcc8800, front: 0x996600 }
    this.drawIsoCube(g, cx, cy, CUBE_W * 0.6, CUBE_H * 0.6, 6, pduColor, 0.8)

    g.setDepth(baseDepth)
    this.pduGraphics.set(entry.id, g)

    // Label
    const label = this.add
      .text(cx, cy - 14, 'PDU', {
        fontFamily: 'monospace',
        fontSize: '6px',
        color: entry.overloaded ? '#ff4444' : '#ffaa00',
      })
      .setOrigin(0.5)
      .setAlpha(0.7)
      .setDepth(baseDepth + 1)
    this.pduLabels.set(entry.id, label)
  }

  /** Add or update a PDU on the grid */
  addPDUToScene(id: string, col: number, row: number, label: string, overloaded: boolean) {
    const entry: PDUEntry = { id, col, row, label, overloaded }
    this.pduEntries.set(id, entry)
    this.renderPDU(entry)
  }

  /** Update PDU overload status */
  updatePDU(id: string, overloaded: boolean) {
    const entry = this.pduEntries.get(id)
    if (!entry) return
    entry.overloaded = overloaded
    this.renderPDU(entry)
  }

  /** Render a cable tray at a grid position */
  private renderCableTray(entry: CableTrayEntry) {
    const oldG = this.cableTrayGraphics.get(entry.id)
    if (oldG) oldG.destroy()

    const { x, y } = this.isoToScreen(entry.col, entry.row)
    const cx = x
    const cy = y + TILE_H / 2

    const g = this.add.graphics()
    const baseDepth = 8 + entry.row * this.cabCols + entry.col

    // Cable tray is a flat colored marker on the floor
    const trayColor = 0x8866cc
    g.fillStyle(trayColor, 0.25)
    g.beginPath()
    g.moveTo(cx, cy - TILE_H / 2 + 2)
    g.lineTo(cx + TILE_W / 2 - 4, cy)
    g.lineTo(cx, cy + TILE_H / 2 - 2)
    g.lineTo(cx - TILE_W / 2 + 4, cy)
    g.closePath()
    g.fillPath()

    // Dashed border
    g.lineStyle(1, trayColor, 0.4)
    g.beginPath()
    g.moveTo(cx, cy - TILE_H / 2 + 2)
    g.lineTo(cx + TILE_W / 2 - 4, cy)
    g.lineTo(cx, cy + TILE_H / 2 - 2)
    g.lineTo(cx - TILE_W / 2 + 4, cy)
    g.closePath()
    g.strokePath()

    g.setDepth(baseDepth)
    this.cableTrayGraphics.set(entry.id, g)
  }

  /** Add a cable tray to the scene */
  addCableTrayToScene(id: string, col: number, row: number) {
    const entry: CableTrayEntry = { id, col, row }
    this.cableTrayEntries.set(id, entry)
    this.renderCableTray(entry)
  }

  /** Render a cooling unit at a grid position */
  private renderCoolingUnit(entry: CoolingUnitEntry) {
    const oldG = this.coolingUnitGraphics.get(entry.id)
    if (oldG) oldG.destroy()
    const oldLabel = this.coolingUnitLabels.get(entry.id)
    if (oldLabel) oldLabel.destroy()

    const cfg = COOLING_UNIT_CONFIG.find((c) => c.type === entry.type)
    if (!cfg) return

    const { x, y } = this.isoToScreen(entry.col, entry.row)
    const cx = x
    const cy = y + TILE_H / 2

    const g = this.add.graphics()
    const baseDepth = 9 + entry.row * this.cabCols + entry.col

    // Parse hex color from config
    const hexStr = cfg.color.replace('#', '')
    const colorNum = parseInt(hexStr, 16)
    const darkerColor = ((colorNum >> 1) & 0x7f7f7f)
    const darkestColor = ((colorNum >> 2) & 0x3f3f3f)

    if (entry.operational) {
      this.drawIsoCube(g, cx, cy, CUBE_W * 0.5, CUBE_H * 0.5, 8,
        { top: colorNum, side: darkerColor, front: darkestColor }, 0.85)
    } else {
      // Failed unit: red tint, lower alpha
      this.drawIsoCube(g, cx, cy, CUBE_W * 0.5, CUBE_H * 0.5, 8,
        { top: 0xff2222, side: 0xaa1111, front: 0x770808 }, 0.6)
    }

    // Coverage ring for units with range > 0
    if (cfg.range > 0 && entry.operational) {
      g.lineStyle(1, colorNum, 0.2)
      // Draw diamond outline at range distance
      const rng = cfg.range
      for (let dr = -rng; dr <= rng; dr++) {
        for (let dc = -rng; dc <= rng; dc++) {
          if (Math.abs(dr) + Math.abs(dc) > rng) continue
          const tc = entry.col + dc
          const tr = entry.row + dr
          if (tc < 0 || tr < 0 || tc >= this.cabCols || tr >= this.cabRows) continue
          const { x: tx, y: ty } = this.isoToScreen(tc, tr)
          const tcx = tx, tcy = ty + TILE_H / 2
          g.lineStyle(1, colorNum, 0.15)
          g.beginPath()
          g.moveTo(tcx, tcy - TILE_H / 2 + 2)
          g.lineTo(tcx + TILE_W / 2 - 4, tcy)
          g.lineTo(tcx, tcy + TILE_H / 2 - 2)
          g.lineTo(tcx - TILE_W / 2 + 4, tcy)
          g.closePath()
          g.strokePath()
        }
      }
    }

    g.setDepth(baseDepth)
    this.coolingUnitGraphics.set(entry.id, g)

    // Label
    const shortLabel = entry.type === 'fan_tray' ? 'FAN' :
      entry.type === 'crac' ? 'CRAC' :
      entry.type === 'crah' ? 'CRAH' : 'IMR'
    const labelColor = entry.operational ? cfg.color : '#ff4444'
    const label = this.add
      .text(cx, cy - 16, shortLabel, {
        fontFamily: 'monospace',
        fontSize: '6px',
        color: labelColor,
      })
      .setOrigin(0.5)
      .setAlpha(0.8)
      .setDepth(baseDepth + 1)
    this.coolingUnitLabels.set(entry.id, label)
  }

  /** Add a cooling unit to the scene */
  addCoolingUnitToScene(id: string, col: number, row: number, type: CoolingUnitType, operational: boolean) {
    const entry: CoolingUnitEntry = { id, col, row, type, operational }
    this.coolingUnitEntries.set(id, entry)
    this.renderCoolingUnit(entry)
  }

  /** Update cooling unit operational status */
  updateCoolingUnit(id: string, operational: boolean) {
    const entry = this.coolingUnitEntries.get(id)
    if (!entry) return
    entry.operational = operational
    this.renderCoolingUnit(entry)
  }

  /** Remove a cooling unit from the scene */
  removeCoolingUnitFromScene(id: string) {
    const g = this.coolingUnitGraphics.get(id)
    if (g) g.destroy()
    const l = this.coolingUnitLabels.get(id)
    if (l) l.destroy()
    this.coolingUnitGraphics.delete(id)
    this.coolingUnitLabels.delete(id)
    this.coolingUnitEntries.delete(id)
  }

  /** Clear all cooling unit graphics */
  clearCoolingUnits() {
    for (const g of this.coolingUnitGraphics.values()) g.destroy()
    for (const l of this.coolingUnitLabels.values()) l.destroy()
    this.coolingUnitGraphics.clear()
    this.coolingUnitLabels.clear()
    this.coolingUnitEntries.clear()
  }

  // ── Chiller Plant Rendering ──────────────────────────────────────

  private renderChillerPlant(entry: ChillerPlantEntry) {
    const oldG = this.chillerGraphics.get(entry.id)
    if (oldG) oldG.destroy()
    const oldLabel = this.chillerLabels.get(entry.id)
    if (oldLabel) oldLabel.destroy()

    const cfg = CHILLER_PLANT_CONFIG.find((c) => c.tier === entry.tier)
    if (!cfg) return

    const { x, y } = this.isoToScreen(entry.col, entry.row)
    const cx = x
    const cy = y + TILE_H / 2

    const g = this.add.graphics()
    const baseDepth = 9 + entry.row * this.cabCols + entry.col

    // Chiller plant: larger cube, industrial blue-green
    const topColor = entry.operational ? 0x00aacc : 0xcc2222
    const sideColor = entry.operational ? 0x007799 : 0x991111
    const frontColor = entry.operational ? 0x005566 : 0x660808

    this.drawIsoCube(g, cx, cy, CUBE_W * 0.7, CUBE_H * 0.7, 12,
      { top: topColor, side: sideColor, front: frontColor }, 0.9)

    // Coverage range ring
    if (cfg.range > 0 && entry.operational) {
      g.lineStyle(1.5, 0x00aacc, 0.2)
      const rng = cfg.range
      for (let dr = -rng; dr <= rng; dr++) {
        for (let dc = -rng; dc <= rng; dc++) {
          if (Math.abs(dr) + Math.abs(dc) > rng) continue
          const tc = entry.col + dc
          const tr = entry.row + dr
          if (tc < 0 || tr < 0 || tc >= this.cabCols || tr >= this.cabRows) continue
          const { x: tx, y: ty } = this.isoToScreen(tc, tr)
          const tcx = tx, tcy = ty + TILE_H / 2
          g.lineStyle(1, 0x00aacc, 0.12)
          g.beginPath()
          g.moveTo(tcx, tcy - TILE_H / 2 + 2)
          g.lineTo(tcx + TILE_W / 2 - 4, tcy)
          g.lineTo(tcx, tcy + TILE_H / 2 - 2)
          g.lineTo(tcx - TILE_W / 2 + 4, tcy)
          g.closePath()
          g.strokePath()
        }
      }
    }

    g.setDepth(baseDepth)
    this.chillerGraphics.set(entry.id, g)

    const tierLabel = entry.tier === 'advanced' ? 'CHILLER+' : 'CHILLER'
    const labelColor = entry.operational ? '#00aacc' : '#ff4444'
    const label = this.add
      .text(cx, cy - 20, tierLabel, {
        fontFamily: 'monospace',
        fontSize: '6px',
        color: labelColor,
      })
      .setOrigin(0.5)
      .setAlpha(0.85)
      .setDepth(baseDepth + 1)
    this.chillerLabels.set(entry.id, label)
  }

  addChillerPlantToScene(id: string, col: number, row: number, tier: ChillerTier, operational: boolean) {
    const entry: ChillerPlantEntry = { id, col, row, tier, operational }
    this.chillerEntries.set(id, entry)
    this.renderChillerPlant(entry)
  }

  updateChillerPlant(id: string, operational: boolean) {
    const entry = this.chillerEntries.get(id)
    if (!entry) return
    entry.operational = operational
    this.renderChillerPlant(entry)
  }

  removeChillerPlantFromScene(id: string) {
    const g = this.chillerGraphics.get(id)
    if (g) g.destroy()
    const l = this.chillerLabels.get(id)
    if (l) l.destroy()
    this.chillerGraphics.delete(id)
    this.chillerLabels.delete(id)
    this.chillerEntries.delete(id)
  }

  clearChillerPlants() {
    for (const g of this.chillerGraphics.values()) g.destroy()
    for (const l of this.chillerLabels.values()) l.destroy()
    this.chillerGraphics.clear()
    this.chillerLabels.clear()
    this.chillerEntries.clear()
  }

  // ── Cooling Pipe Rendering ───────────────────────────────────────

  private renderCoolingPipe(entry: CoolingPipeEntry) {
    const oldG = this.pipeGraphics.get(entry.id)
    if (oldG) oldG.destroy()

    const { x, y } = this.isoToScreen(entry.col, entry.row)
    const cx = x
    const cy = y + TILE_H / 2

    const g = this.add.graphics()
    const baseDepth = 5 + entry.row * this.cabCols + entry.col

    // Pipe: small flat disc on the tile (cyan line segment look)
    g.fillStyle(0x00ccff, 0.3)
    g.beginPath()
    g.moveTo(cx, cy - TILE_H / 4)
    g.lineTo(cx + TILE_W / 4, cy)
    g.lineTo(cx, cy + TILE_H / 4)
    g.lineTo(cx - TILE_W / 4, cy)
    g.closePath()
    g.fillPath()

    // Pipe border
    g.lineStyle(1, 0x00ccff, 0.5)
    g.beginPath()
    g.moveTo(cx, cy - TILE_H / 4)
    g.lineTo(cx + TILE_W / 4, cy)
    g.lineTo(cx, cy + TILE_H / 4)
    g.lineTo(cx - TILE_W / 4, cy)
    g.closePath()
    g.strokePath()

    // Draw pipe connection lines to adjacent pipes
    for (const [, other] of this.pipeEntries) {
      if (other.id === entry.id) continue
      const dist = Math.abs(other.col - entry.col) + Math.abs(other.row - entry.row)
      if (dist === 1) {
        const { x: ox, y: oy } = this.isoToScreen(other.col, other.row)
        g.lineStyle(2, 0x00ccff, 0.35)
        g.lineBetween(cx, cy, ox, oy + TILE_H / 2)
      }
    }

    // Also draw lines to adjacent chiller plants
    for (const [, chiller] of this.chillerEntries) {
      const dist = Math.abs(chiller.col - entry.col) + Math.abs(chiller.row - entry.row)
      if (dist <= 1) {
        const { x: ox, y: oy } = this.isoToScreen(chiller.col, chiller.row)
        g.lineStyle(2, 0x00aacc, 0.4)
        g.lineBetween(cx, cy, ox, oy + TILE_H / 2)
      }
    }

    g.setDepth(baseDepth)
    this.pipeGraphics.set(entry.id, g)
  }

  addCoolingPipeToScene(id: string, col: number, row: number) {
    const entry: CoolingPipeEntry = { id, col, row }
    this.pipeEntries.set(id, entry)
    this.renderCoolingPipe(entry)
  }

  removeCoolingPipeFromScene(id: string) {
    const g = this.pipeGraphics.get(id)
    if (g) g.destroy()
    this.pipeGraphics.delete(id)
    this.pipeEntries.delete(id)
  }

  clearCoolingPipes() {
    for (const g of this.pipeGraphics.values()) g.destroy()
    this.pipeGraphics.clear()
    this.pipeEntries.clear()
  }

  /** Clear all infrastructure graphics (for rebuild) */
  clearInfrastructure() {
    for (const g of this.pduGraphics.values()) g.destroy()
    for (const l of this.pduLabels.values()) l.destroy()
    for (const g of this.cableTrayGraphics.values()) g.destroy()
    for (const g of this.coolingUnitGraphics.values()) g.destroy()
    for (const l of this.coolingUnitLabels.values()) l.destroy()
    for (const g of this.chillerGraphics.values()) g.destroy()
    for (const l of this.chillerLabels.values()) l.destroy()
    for (const g of this.pipeGraphics.values()) g.destroy()
    this.pduGraphics.clear()
    this.pduLabels.clear()
    this.pduEntries.clear()
    this.cableTrayGraphics.clear()
    this.cableTrayEntries.clear()
    this.coolingUnitGraphics.clear()
    this.coolingUnitLabels.clear()
    this.coolingUnitEntries.clear()
    this.chillerGraphics.clear()
    this.chillerLabels.clear()
    this.chillerEntries.clear()
    this.pipeGraphics.clear()
    this.pipeEntries.clear()
  }

  /** Clear all cabinet graphics (used during site switching) */
  clearAllCabinets() {
    for (const g of this.cabinetGraphics.values()) g.destroy()
    for (const labels of this.cabinetLabels.values()) labels.forEach(l => l.destroy())
    this.cabinetGraphics.clear()
    this.cabinetLabels.clear()
    this.occupiedTiles.clear()
    this.clearSelection()
  }

  /** Clear all spine switch graphics (used during site switching) */
  clearAllSpines() {
    for (const g of this.spineGraphics.values()) g.destroy()
    for (const l of this.spineNodeLabels.values()) l.destroy()
    this.spineGraphics.clear()
    this.spineNodeLabels.clear()
    this.spineEntries.clear()
    this.spineCount = 0
    // Clear traffic lines since they reference old spine IDs
    this.trafficLinks = []
  }

  /** Update aisle containment state and redraw aisle overlays */
  setAisleContainments(containedIds: number[]) {
    this.containedAisles = new Set(containedIds)
    this.drawAisles()
  }

  /** Render selection highlight around a cabinet */
  private renderSelection() {
    if (this.selectionGraphics) this.selectionGraphics.destroy()
    this.clearZoneOverlays()
    if (!this.selectedCabinetId) return

    const entry = this.cabEntries.get(this.selectedCabinetId)
    if (!entry) return

    this.selectionGraphics = this.add.graphics()
    this.selectionGraphics.setDepth(50)

    const { x, y } = this.isoToScreen(entry.col, entry.row)
    // Draw selection border
    this.selectionGraphics.lineStyle(2, 0x00ffff, 0.8)
    this.selectionGraphics.beginPath()
    this.selectionGraphics.moveTo(x, y - 4)
    this.selectionGraphics.lineTo(x + TILE_W / 2 + 4, y + TILE_H / 2)
    this.selectionGraphics.lineTo(x, y + TILE_H + 4)
    this.selectionGraphics.lineTo(x - TILE_W / 2 - 4, y + TILE_H / 2)
    this.selectionGraphics.closePath()
    this.selectionGraphics.strokePath()

    // Show airflow zone overlays around the selected cabinet
    this.drawCabinetZoneOverlays(entry.col, entry.row, entry.facing)
  }

  /** Render hover highlight around a cabinet or spine switch */
  private renderHover() {
    if (this.hoverGraphics) this.hoverGraphics.clear()

    // Don't show hover on the already-selected cabinet
    if (this.hoveredCabinetId && this.hoveredCabinetId === this.selectedCabinetId) return

    if (this.hoveredCabinetId) {
      const entry = this.cabEntries.get(this.hoveredCabinetId)
      if (!entry) return

      if (!this.hoverGraphics) {
        this.hoverGraphics = this.add.graphics()
      }
      this.hoverGraphics.setDepth(49)

      const { x, y } = this.isoToScreen(entry.col, entry.row)
      const cx = x
      const cy = y + TILE_H / 2

      // Glow wireframe around the full cabinet enclosure
      this.drawIsoWireframe(this.hoverGraphics, cx, cy, CUBE_W + 4, CUBE_H + 2, CABINET_ENCLOSURE_DEPTH + 2, 0x00ffff, 0.5)

      // Subtle filled diamond on the ground tile
      this.hoverGraphics.fillStyle(0x00ffff, 0.08)
      this.hoverGraphics.beginPath()
      this.hoverGraphics.moveTo(x, y)
      this.hoverGraphics.lineTo(x + TILE_W / 2, y + TILE_H / 2)
      this.hoverGraphics.lineTo(x, y + TILE_H)
      this.hoverGraphics.lineTo(x - TILE_W / 2, y + TILE_H / 2)
      this.hoverGraphics.closePath()
      this.hoverGraphics.fillPath()
      return
    }

    if (this.hoveredSpineId) {
      const entry = this.spineEntries.get(this.hoveredSpineId)
      if (!entry) return

      if (!this.hoverGraphics) {
        this.hoverGraphics = this.add.graphics()
      }
      this.hoverGraphics.setDepth(49)

      const { x, y } = this.spineToScreen(entry.slot)
      const cy = y + SPINE_H / 2

      // Glow wireframe around the spine switch
      this.drawIsoWireframe(this.hoverGraphics, x, cy, SPINE_W + 4, SPINE_H + 2, SPINE_DEPTH + 2, 0xff6644, 0.5)
    }
  }

  /** Draw airflow zone overlays around a cabinet at the given position/facing */
  private drawCabinetZoneOverlays(col: number, row: number, facing: CabinetFacing) {
    if (!this.placementZoneGraphics) {
      this.placementZoneGraphics = this.add.graphics()
      this.placementZoneGraphics.setDepth(2)
    }

    const offsets = getFacingOffsets(facing, col, row)
    const f = offsets.front
    const r = offsets.rear

    // Front tile (cold / intake side)
    if (f.col >= 0 && f.col < this.cabCols && f.row >= 0 && f.row < this.cabRows) {
      const frontOccupied = this.occupiedTiles.has(`${f.col},${f.row}`)
      if (!frontOccupied) {
        this.drawIsoTile(this.placementZoneGraphics, f.col, f.row, 0x0088ff, 0.12, 0x0088ff, 0.25)
        this.placementZoneLabels.push(this.addZoneLabel(f.col, f.row, 'COLD AISLE', '#4488ff'))
      } else {
        this.drawIsoTile(this.placementZoneGraphics, f.col, f.row, 0xff4400, 0.10, 0xff4400, 0.2)
        this.placementZoneLabels.push(this.addZoneLabel(f.col, f.row, 'INTAKE BLOCKED', '#ff6644'))
      }
    }

    // Rear tile (hot / exhaust side)
    if (r.col >= 0 && r.col < this.cabCols && r.row >= 0 && r.row < this.cabRows) {
      const rearOccupied = this.occupiedTiles.has(`${r.col},${r.row}`)
      if (!rearOccupied) {
        this.drawIsoTile(this.placementZoneGraphics, r.col, r.row, 0xff4400, 0.10, 0xff4400, 0.2)
        this.placementZoneLabels.push(this.addZoneLabel(r.col, r.row, 'HOT EXHAUST', '#ff8844'))
      } else {
        this.drawIsoTile(this.placementZoneGraphics, r.col, r.row, 0xff0000, 0.12, 0xff0000, 0.25)
        this.placementZoneLabels.push(this.addZoneLabel(r.col, r.row, 'EXHAUST BLOCKED', '#ff4444'))
      }
    }

    // Side tiles (access)
    for (const side of offsets.sides) {
      if (side.col < 0 || side.col >= this.cabCols || side.row < 0 || side.row >= this.cabRows) continue
      const sideOccupied = this.occupiedTiles.has(`${side.col},${side.row}`)
      if (!sideOccupied) {
        this.drawIsoTile(this.placementZoneGraphics, side.col, side.row, 0xffcc00, 0.06, 0xffcc00, 0.12)
        this.placementZoneLabels.push(this.addZoneLabel(side.col, side.row, 'ACCESS', '#aaaa44'))
      }
    }

    // Draw airflow direction lines from the cabinet
    const { x: cx, y: cy } = this.isoToScreen(col, row)
    if (f.col >= 0 && f.col < this.cabCols && f.row >= 0 && f.row < this.cabRows) {
      const { x: fx, y: fy } = this.isoToScreen(f.col, f.row)
      this.placementZoneGraphics.lineStyle(1.5, 0x0088ff, 0.35)
      this.placementZoneGraphics.lineBetween(cx, cy + TILE_H / 2, fx, fy + TILE_H / 2)
    }
    if (r.col >= 0 && r.col < this.cabCols && r.row >= 0 && r.row < this.cabRows) {
      const { x: rx, y: ry } = this.isoToScreen(r.col, r.row)
      this.placementZoneGraphics.lineStyle(1.5, 0xff6644, 0.35)
      this.placementZoneGraphics.lineBetween(cx, cy + TILE_H / 2, rx, ry + TILE_H / 2)
    }
  }

  /** Render heat map overlay showing temperature per cabinet (uses actual heatLevel) */
  private renderHeatMap() {
    if (this.heatMapGraphics) this.heatMapGraphics.destroy()
    // Clean up heat map text labels from previous render
    this.children.getAll().forEach((child) => {
      if (child instanceof Phaser.GameObjects.Text && child.getData('heatMapLabel')) {
        child.destroy()
      }
    })
    if (!this.heatMapVisible) return

    this.heatMapGraphics = this.add.graphics()
    this.heatMapGraphics.setDepth(45)

    // Temperature range: ambient (22°C) = green, throttle (80°C) = yellow, critical (95°C) = red
    const tempMin = 22   // ambient
    const tempMax = 95   // critical/fire threshold
    for (const [, entry] of this.cabEntries) {
      const { x, y } = this.isoToScreen(entry.col, entry.row)
      // Use actual heatLevel for accurate heat map coloring
      const heatFactor = entry.powerOn
        ? Math.min(1, Math.max(0, (entry.heatLevel - tempMin) / (tempMax - tempMin)))
        : 0
      // Green → Yellow → Red gradient
      const r = Math.round(255 * Math.min(1, heatFactor * 2))
      const g = Math.round(255 * Math.min(1, (1 - heatFactor) * 2))
      const b = 0
      const color = (r << 16) | (g << 8) | b

      this.heatMapGraphics.fillStyle(color, 0.3)
      this.heatMapGraphics.beginPath()
      this.heatMapGraphics.moveTo(x, y)
      this.heatMapGraphics.lineTo(x + TILE_W / 2, y + TILE_H / 2)
      this.heatMapGraphics.lineTo(x, y + TILE_H)
      this.heatMapGraphics.lineTo(x - TILE_W / 2, y + TILE_H / 2)
      this.heatMapGraphics.closePath()
      this.heatMapGraphics.fillPath()

      // Temperature label on each tile
      if (entry.heatLevel > tempMin + 5) {
        const tempText = `${Math.round(entry.heatLevel)}°`
        const tempColor = heatFactor > 0.7 ? '#ff4400' : heatFactor > 0.4 ? '#ffaa00' : '#88cc44'
        const tempLabel = this.add.text(x, y + TILE_H / 2, tempText, {
          fontFamily: 'monospace',
          fontSize: '6px',
          color: tempColor,
        }).setOrigin(0.5).setAlpha(0.7).setDepth(46)
        // Store reference for cleanup (use a simple tag approach)
        tempLabel.setData('heatMapLabel', true)
      }
    }
  }

  /** Set heat map overlay visibility */
  setHeatMapVisible(visible: boolean) {
    this.heatMapVisible = visible
    this.renderHeatMap()
  }

  /** Set callback for cabinet selection */
  setOnCabinetSelect(cb: (id: string | null) => void) {
    this.onCabinetSelect = cb
  }

  /** Deselect all cabinets */
  clearSelection() {
    this.selectedCabinetId = null
    if (this.selectionGraphics) this.selectionGraphics.destroy()
    this.selectionGraphics = null
    this.clearZoneOverlays()
  }

  // ── Equipment Placement Mode API ─────────────────────────────

  /** Enter/exit equipment placement mode — highlights valid cabinets */
  setEquipmentPlacementMode(mode: 'server' | 'leaf' | null, validCabinetIds: string[]) {
    this.equipmentPlacementMode = mode
    if (!mode) {
      if (this.equipHighlightGraphics) {
        this.equipHighlightGraphics.destroy()
        this.equipHighlightGraphics = null
      }
      return
    }
    this.renderEquipmentHighlights(validCabinetIds, mode === 'server' ? 0x00ff88 : 0x00aaff)
  }

  /** Set callback for cabinet clicks during equipment placement */
  setOnEquipmentCabinetClick(cb: ((cabinetId: string) => void) | null) {
    this.onEquipmentCabinetClick = cb
  }

  /** Render pulsing highlights on valid cabinets for equipment placement */
  private renderEquipmentHighlights(cabinetIds: string[], color: number) {
    if (this.equipHighlightGraphics) {
      this.equipHighlightGraphics.destroy()
    }
    this.equipHighlightGraphics = this.add.graphics()
    this.equipHighlightGraphics.setDepth(48)

    for (const id of cabinetIds) {
      const entry = this.cabEntries.get(id)
      if (!entry) continue
      const { x, y } = this.isoToScreen(entry.col, entry.row)

      // Filled diamond highlight on ground tile
      this.equipHighlightGraphics.fillStyle(color, 0.15)
      this.equipHighlightGraphics.beginPath()
      this.equipHighlightGraphics.moveTo(x, y)
      this.equipHighlightGraphics.lineTo(x + TILE_W / 2, y + TILE_H / 2)
      this.equipHighlightGraphics.lineTo(x, y + TILE_H)
      this.equipHighlightGraphics.lineTo(x - TILE_W / 2, y + TILE_H / 2)
      this.equipHighlightGraphics.closePath()
      this.equipHighlightGraphics.fillPath()

      // Border
      this.equipHighlightGraphics.lineStyle(2, color, 0.6)
      this.equipHighlightGraphics.beginPath()
      this.equipHighlightGraphics.moveTo(x, y)
      this.equipHighlightGraphics.lineTo(x + TILE_W / 2, y + TILE_H / 2)
      this.equipHighlightGraphics.lineTo(x, y + TILE_H)
      this.equipHighlightGraphics.lineTo(x - TILE_W / 2, y + TILE_H / 2)
      this.equipHighlightGraphics.closePath()
      this.equipHighlightGraphics.strokePath()
    }
  }

  /** Set zone outlines for rendering */
  setZones(zones: { tiles: { col: number; row: number }[]; color: string }[]) {
    if (this.zoneGraphics) {
      this.zoneGraphics.destroy()
      this.zoneGraphics = null
    }

    if (zones.length === 0) return

    this.zoneGraphics = this.add.graphics()
    this.zoneGraphics.setDepth(2) // above floor/grid, below placement highlight and cabinets

    for (const zone of zones) {
      const tileSet = new Set(zone.tiles.map((t) => `${t.col},${t.row}`))
      const colorNum = parseInt(zone.color.replace('#', ''), 16)

      // Draw a subtle filled highlight on each zone tile
      for (const tile of zone.tiles) {
        const { x, y } = this.isoToScreen(tile.col, tile.row)
        this.zoneGraphics.fillStyle(colorNum, 0.08)
        this.zoneGraphics.beginPath()
        this.zoneGraphics.moveTo(x, y)
        this.zoneGraphics.lineTo(x + TILE_W / 2, y + TILE_H / 2)
        this.zoneGraphics.lineTo(x, y + TILE_H)
        this.zoneGraphics.lineTo(x - TILE_W / 2, y + TILE_H / 2)
        this.zoneGraphics.closePath()
        this.zoneGraphics.fillPath()
      }

      // Draw outline on boundary edges only (edges not shared with another tile in the same zone)
      this.zoneGraphics.lineStyle(2, colorNum, 0.6)
      for (const tile of zone.tiles) {
        const { x, y } = this.isoToScreen(tile.col, tile.row)
        // Check 4 neighbors; draw edge if neighbor is NOT in the zone
        // Top-right edge (col+1 neighbor)
        if (!tileSet.has(`${tile.col + 1},${tile.row}`)) {
          this.zoneGraphics.beginPath()
          this.zoneGraphics.moveTo(x, y)
          this.zoneGraphics.lineTo(x + TILE_W / 2, y + TILE_H / 2)
          this.zoneGraphics.strokePath()
        }
        // Bottom-right edge (row+1 neighbor)
        if (!tileSet.has(`${tile.col},${tile.row + 1}`)) {
          this.zoneGraphics.beginPath()
          this.zoneGraphics.moveTo(x + TILE_W / 2, y + TILE_H / 2)
          this.zoneGraphics.lineTo(x, y + TILE_H)
          this.zoneGraphics.strokePath()
        }
        // Bottom-left edge (col-1 neighbor)
        if (!tileSet.has(`${tile.col - 1},${tile.row}`)) {
          this.zoneGraphics.beginPath()
          this.zoneGraphics.moveTo(x, y + TILE_H)
          this.zoneGraphics.lineTo(x - TILE_W / 2, y + TILE_H / 2)
          this.zoneGraphics.strokePath()
        }
        // Top-left edge (row-1 neighbor)
        if (!tileSet.has(`${tile.col},${tile.row - 1}`)) {
          this.zoneGraphics.beginPath()
          this.zoneGraphics.moveTo(x - TILE_W / 2, y + TILE_H / 2)
          this.zoneGraphics.lineTo(x, y)
          this.zoneGraphics.strokePath()
        }
      }
    }
  }

  /** Set dedicated row highlights for rendering */
  setDedicatedRows(rows: { gridRow: number; color: string }[]) {
    if (this.dedicatedRowGraphics) {
      this.dedicatedRowGraphics.destroy()
      this.dedicatedRowGraphics = null
    }
    for (const label of this.dedicatedRowLabels) label.destroy()
    this.dedicatedRowLabels = []

    if (rows.length === 0) return

    this.dedicatedRowGraphics = this.add.graphics()
    this.dedicatedRowGraphics.setDepth(1) // same depth as aisle graphics

    for (const row of rows) {
      const r = row.gridRow
      const colorNum = parseInt(row.color.replace('#', ''), 16)

      // Draw a subtle highlight stripe across the row
      const leftTop = this.isoToScreen(0, r)
      const rightTop = this.isoToScreen(this.cabCols, r)
      const leftBot = this.isoToScreen(0, r + 1)
      const rightBot = this.isoToScreen(this.cabCols, r + 1)

      // Top edge border
      this.dedicatedRowGraphics.lineStyle(1.5, colorNum, 0.5)
      this.dedicatedRowGraphics.lineBetween(leftTop.x, leftTop.y, rightTop.x, rightTop.y)
      // Bottom edge border
      this.dedicatedRowGraphics.lineBetween(leftBot.x, leftBot.y, rightBot.x, rightBot.y)

      // "DEDICATED" label in the center of the row
      const centerX = (leftTop.x + rightBot.x) / 2
      const centerY = (leftTop.y + rightBot.y) / 2
      const label = this.add
        .text(centerX, centerY - 4, 'DEDICATED', {
          fontFamily: 'monospace',
          fontSize: '6px',
          color: `#${colorNum.toString(16).padStart(6, '0')}`,
        })
        .setOrigin(0.5)
        .setAlpha(0.45)
        .setDepth(2)
      this.dedicatedRowLabels.push(label)
    }
  }

  // ── View Mode API ──────────────────────────────────────────────

  /** Switch the rendering view mode */
  setViewMode(mode: ViewMode) {
    if (mode === this.viewMode) return
    this.viewMode = mode

    if (mode === 'sub_floor') {
      this.renderSubFloorView()
      // Fade cabinet layer
      for (const [, g] of this.cabinetGraphics) g.setAlpha(0.15)
      for (const [, labels] of this.cabinetLabels) labels.forEach(l => l.setAlpha(0.1))
      for (const [, g] of this.spineGraphics) g.setAlpha(0.15)
    } else {
      // Restore normal view
      this.clearSubFloorView()
      for (const [, g] of this.cabinetGraphics) g.setAlpha(1)
      for (const [, labels] of this.cabinetLabels) labels.forEach(l => l.setAlpha(1))
      for (const [, g] of this.spineGraphics) g.setAlpha(1)
    }
  }

  private renderSubFloorView() {
    this.clearSubFloorView()
    this.subFloorGraphics = this.add.graphics()
    this.subFloorGraphics.setDepth(0)

    // Draw underfloor grid with pipe routes
    for (let c = 0; c < this.cabCols; c++) {
      for (let r = 0; r < this.cabRows; r++) {
        const pos = this.isoToScreen(c, r)
        // Underfloor tile
        this.subFloorGraphics.fillStyle(0x1a2a3a, 0.6)
        this.subFloorGraphics.beginPath()
        this.subFloorGraphics.moveTo(pos.x, pos.y)
        this.subFloorGraphics.lineTo(pos.x + TILE_W / 2, pos.y + TILE_H / 2)
        this.subFloorGraphics.lineTo(pos.x, pos.y + TILE_H)
        this.subFloorGraphics.lineTo(pos.x - TILE_W / 2, pos.y + TILE_H / 2)
        this.subFloorGraphics.closePath()
        this.subFloorGraphics.fillPath()

        // Draw conduit lines
        this.subFloorGraphics.lineStyle(1, 0x00aaff, 0.3)
        this.subFloorGraphics.lineBetween(pos.x - TILE_W / 4, pos.y + TILE_H / 4, pos.x + TILE_W / 4, pos.y + TILE_H / 4)
      }
    }

    // Draw cooling pipe routes
    for (const [, pipe] of this.pipeEntries) {
      const pos = this.isoToScreen(pipe.col, pipe.row)
      this.subFloorGraphics.fillStyle(0x00ccff, 0.7)
      this.subFloorGraphics.fillCircle(pos.x, pos.y + TILE_H / 2, 4)
      // Draw pipe connections to adjacent pipes
      this.subFloorGraphics.lineStyle(2, 0x00ccff, 0.5)
      for (const [, otherPipe] of this.pipeEntries) {
        if (otherPipe.id === pipe.id) continue
        const dx = Math.abs(otherPipe.col - pipe.col)
        const dy = Math.abs(otherPipe.row - pipe.row)
        if (dx + dy === 1) {
          const otherPos = this.isoToScreen(otherPipe.col, otherPipe.row)
          this.subFloorGraphics.lineBetween(pos.x, pos.y + TILE_H / 2, otherPos.x, otherPos.y + TILE_H / 2)
        }
      }
    }

    // Draw power conduits under PDUs
    for (const [, pdu] of this.pduEntries) {
      const pos = this.isoToScreen(pdu.col, pdu.row)
      this.subFloorGraphics.fillStyle(0xffaa00, 0.6)
      this.subFloorGraphics.fillCircle(pos.x, pos.y + TILE_H / 2, 5)
      this.subFloorGraphics.lineStyle(2, 0xffaa00, 0.4)
      // Draw conduit lines from PDU outward
      const left = this.isoToScreen(pdu.col - 1, pdu.row)
      const right = this.isoToScreen(pdu.col + 1, pdu.row)
      this.subFloorGraphics.lineBetween(left.x, left.y + TILE_H / 2, right.x, right.y + TILE_H / 2)
    }
  }

  private clearSubFloorView() {
    if (this.subFloorGraphics) {
      this.subFloorGraphics.destroy()
      this.subFloorGraphics = null
    }
  }

  // ── Row-End Slot Rendering ────────────────────────────────────

  /** Render row-end infrastructure slots */
  setRowEndSlots(slots: RowEndSlot[]) {
    // Clear existing
    for (const [, g] of this.rowEndGraphics) g.destroy()
    for (const [, l] of this.rowEndLabels) l.destroy()
    this.rowEndGraphics.clear()
    this.rowEndLabels.clear()

    for (const slot of slots) {
      const config = ROW_END_SLOT_CONFIG.find(c => c.type === slot.type)
      if (!config) continue
      const col = slot.side === 'left' ? -1 : this.cabCols
      const pos = this.isoToScreen(col, slot.row)

      const g = this.add.graphics()
      g.setDepth(5)
      const color = parseInt(config.color.replace('#', ''), 16)
      // Draw a small isometric block for the slot
      g.fillStyle(color, 0.7)
      g.beginPath()
      const hw = TILE_W * 0.3
      const hh = TILE_H * 0.3
      g.moveTo(pos.x, pos.y - 6)
      g.lineTo(pos.x + hw, pos.y - 6 + hh)
      g.lineTo(pos.x, pos.y - 6 + hh * 2)
      g.lineTo(pos.x - hw, pos.y - 6 + hh)
      g.closePath()
      g.fillPath()
      g.lineStyle(1, color, 1)
      g.strokePath()

      this.rowEndGraphics.set(slot.id, g)

      const label = this.add.text(pos.x, pos.y + 10, config.label.substring(0, 8), {
        fontFamily: 'monospace',
        fontSize: '6px',
        color: config.color,
      }).setOrigin(0.5).setDepth(6).setAlpha(0.8)
      this.rowEndLabels.set(slot.id, label)
    }
  }

  // ── Floating Text System ("Damage Numbers") ──────────────────

  /** Initialize the text pool during scene create */
  private initFloatingTextPool() {
    for (let i = 0; i < this.FLOATING_TEXT_POOL_SIZE; i++) {
      const txt = this.add.text(0, 0, '', {
        fontFamily: 'monospace',
        fontSize: '11px',
        color: '#00ff88',
        stroke: '#000000',
        strokeThickness: 3,
        shadow: { offsetX: 0, offsetY: 0, color: '#000', blur: 4, fill: true, stroke: true },
      })
      txt.setOrigin(0.5, 1)
      txt.setDepth(100)
      txt.setVisible(false)
      txt.setAlpha(0)
      this.floatingTextPool.push(txt)
    }
  }

  /** Get a text object from the pool (or recycle the oldest active one) */
  private getPooledText(): Phaser.GameObjects.Text {
    // Try to find an inactive pooled text
    const available = this.floatingTextPool.find((t) => !t.visible)
    if (available) return available

    // All in use — recycle the oldest active one
    if (this.activeFloatingTexts.length > 0) {
      const oldest = this.activeFloatingTexts.shift()!
      this.tweens.killTweensOf(oldest)
      oldest.setVisible(false)
      oldest.setAlpha(0)
      return oldest
    }

    // Shouldn't happen, but create a new one as fallback
    const txt = this.add.text(0, 0, '', {
      fontFamily: 'monospace',
      fontSize: '11px',
      color: '#00ff88',
      stroke: '#000000',
      strokeThickness: 3,
    })
    txt.setOrigin(0.5, 1)
    txt.setDepth(100)
    this.floatingTextPool.push(txt)
    return txt
  }

  /** Spawn floating text at a grid tile position */
  spawnFloatingText(col: number, row: number, text: string, color: string, fontSize?: string) {
    const pos = this.isoToScreen(col, row)
    this.spawnFloatingTextAtScreen(pos.x, pos.y, text, color, fontSize)
  }

  /** Spawn floating text at a specific screen position */
  spawnFloatingTextAtScreen(screenX: number, screenY: number, text: string, color: string, fontSize?: string) {
    const txt = this.getPooledText()
    txt.setText(text)
    txt.setStyle({
      fontFamily: 'monospace',
      fontSize: fontSize ?? '11px',
      color,
      stroke: '#000000',
      strokeThickness: 3,
      shadow: { offsetX: 0, offsetY: 0, color: '#000', blur: 4, fill: true, stroke: true },
    })
    // Add small random horizontal offset to prevent text stacking
    const offsetX = (Math.random() - 0.5) * 20
    txt.setPosition(screenX + offsetX, screenY)
    txt.setAlpha(1)
    txt.setVisible(true)
    txt.setScale(1)

    this.activeFloatingTexts.push(txt)

    // Animate: rise upward and fade out
    this.tweens.add({
      targets: txt,
      y: screenY - 40,
      alpha: 0,
      duration: 1500,
      ease: 'Power2',
      onComplete: () => {
        txt.setVisible(false)
        txt.setAlpha(0)
        const idx = this.activeFloatingTexts.indexOf(txt)
        if (idx >= 0) this.activeFloatingTexts.splice(idx, 1)
      },
    })
  }

  /** Spawn floating text at the center of the viewport */
  spawnCenterText(text: string, color: string, fontSize?: string) {
    const cam = this.cameras.main
    const cx = cam.scrollX + cam.width / 2
    const cy = cam.scrollY + cam.height / 2
    this.spawnFloatingTextAtScreen(cx, cy, text, color, fontSize ?? '14px')
  }

  // ── Placement Animation ───────────────────────────────────────

  /** Animate a build/placement effect at a tile position */
  playPlacementAnimation(col: number, row: number) {
    const pos = this.isoToScreen(col, row)
    const g = this.add.graphics()
    g.setDepth(50)

    // Expanding ring animation
    let radius = 2
    let alpha = 1.0
    const timer = this.time.addEvent({
      delay: 30,
      repeat: 15,
      callback: () => {
        g.clear()
        alpha -= 0.06
        radius += 2
        if (alpha <= 0) {
          g.destroy()
          timer.destroy()
          return
        }
        g.lineStyle(2, 0x00ff88, alpha)
        g.strokeCircle(pos.x, pos.y + TILE_H / 2, radius)
      },
    })
  }

  // ── Audio System ──────────────────────────────────────────────

  /** Initialize the Web Audio context */
  initAudio() {
    if (this.audioCtx) return
    try {
      this.audioCtx = new AudioContext()
    } catch {
      // Audio not supported
    }
  }

  /** Play a procedural SFX */
  playSFX(type: 'build' | 'alert' | 'upgrade' | 'error' | 'server_install' | 'switch_click' | 'fire_alarm' | 'cash' | 'ui_click' | 'hvac_burst' | 'remove') {
    if (!this.audioCtx || this.audioMuted) return
    const ctx = this.audioCtx
    const gain = ctx.createGain()
    gain.connect(ctx.destination)
    const vol = this.audioMasterVolume * this.audioSfxVolume

    const osc = ctx.createOscillator()
    osc.connect(gain)

    switch (type) {
      case 'build':
        osc.frequency.setValueAtTime(440, ctx.currentTime)
        osc.frequency.linearRampToValueAtTime(880, ctx.currentTime + 0.1)
        gain.gain.setValueAtTime(vol * 0.3, ctx.currentTime)
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15)
        osc.start(ctx.currentTime)
        osc.stop(ctx.currentTime + 0.15)
        break
      case 'alert':
        osc.frequency.setValueAtTime(800, ctx.currentTime)
        osc.frequency.linearRampToValueAtTime(400, ctx.currentTime + 0.3)
        gain.gain.setValueAtTime(vol * 0.4, ctx.currentTime)
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3)
        osc.start(ctx.currentTime)
        osc.stop(ctx.currentTime + 0.3)
        break
      case 'upgrade':
        osc.frequency.setValueAtTime(330, ctx.currentTime)
        osc.frequency.linearRampToValueAtTime(660, ctx.currentTime + 0.1)
        osc.frequency.linearRampToValueAtTime(990, ctx.currentTime + 0.2)
        gain.gain.setValueAtTime(vol * 0.3, ctx.currentTime)
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.25)
        osc.start(ctx.currentTime)
        osc.stop(ctx.currentTime + 0.25)
        break
      case 'error':
        osc.type = 'square'
        osc.frequency.setValueAtTime(200, ctx.currentTime)
        gain.gain.setValueAtTime(vol * 0.2, ctx.currentTime)
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2)
        osc.start(ctx.currentTime)
        osc.stop(ctx.currentTime + 0.2)
        break
      case 'server_install': {
        // Metallic slide sound: quick rising noise burst
        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(200, ctx.currentTime)
        osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.05)
        osc.frequency.linearRampToValueAtTime(300, ctx.currentTime + 0.1)
        gain.gain.setValueAtTime(vol * 0.15, ctx.currentTime)
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.12)
        osc.start(ctx.currentTime)
        osc.stop(ctx.currentTime + 0.12)
        break
      }
      case 'switch_click': {
        // Short click/snap
        osc.type = 'square'
        osc.frequency.setValueAtTime(1200, ctx.currentTime)
        osc.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.03)
        gain.gain.setValueAtTime(vol * 0.2, ctx.currentTime)
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.05)
        osc.start(ctx.currentTime)
        osc.stop(ctx.currentTime + 0.05)
        break
      }
      case 'fire_alarm': {
        // Urgent alarm: repeating high-low oscillation
        osc.frequency.setValueAtTime(1000, ctx.currentTime)
        osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.15)
        osc.frequency.linearRampToValueAtTime(1000, ctx.currentTime + 0.3)
        osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.45)
        gain.gain.setValueAtTime(vol * 0.35, ctx.currentTime)
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5)
        osc.start(ctx.currentTime)
        osc.stop(ctx.currentTime + 0.5)
        break
      }
      case 'cash': {
        // Cash register ding: bright short tone
        osc.type = 'sine'
        osc.frequency.setValueAtTime(1400, ctx.currentTime)
        osc.frequency.linearRampToValueAtTime(1600, ctx.currentTime + 0.05)
        gain.gain.setValueAtTime(vol * 0.2, ctx.currentTime)
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15)
        osc.start(ctx.currentTime)
        osc.stop(ctx.currentTime + 0.15)
        break
      }
      case 'ui_click': {
        // Subtle UI click
        osc.type = 'sine'
        osc.frequency.setValueAtTime(600, ctx.currentTime)
        gain.gain.setValueAtTime(vol * 0.08, ctx.currentTime)
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.04)
        osc.start(ctx.currentTime)
        osc.stop(ctx.currentTime + 0.04)
        break
      }
      case 'hvac_burst': {
        // HVAC white noise burst via detuned oscillators
        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(100, ctx.currentTime)
        gain.gain.setValueAtTime(vol * 0.05, ctx.currentTime)
        gain.gain.linearRampToValueAtTime(vol * 0.08, ctx.currentTime + 0.2)
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5)
        osc.start(ctx.currentTime)
        osc.stop(ctx.currentTime + 0.5)
        // Second detuned oscillator for richness
        const osc2 = ctx.createOscillator()
        const gain2 = ctx.createGain()
        osc2.connect(gain2)
        gain2.connect(ctx.destination)
        osc2.type = 'sawtooth'
        osc2.frequency.setValueAtTime(103, ctx.currentTime)
        gain2.gain.setValueAtTime(vol * 0.04, ctx.currentTime)
        gain2.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.5)
        osc2.start(ctx.currentTime)
        osc2.stop(ctx.currentTime + 0.5)
        break
      }
      case 'remove': {
        // Descending tone for removal/deletion
        osc.type = 'triangle'
        osc.frequency.setValueAtTime(600, ctx.currentTime)
        osc.frequency.linearRampToValueAtTime(200, ctx.currentTime + 0.15)
        gain.gain.setValueAtTime(vol * 0.25, ctx.currentTime)
        gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2)
        osc.start(ctx.currentTime)
        osc.stop(ctx.currentTime + 0.2)
        break
      }
    }
  }

  /** Start/stop ambient data center hum */
  setAmbientAudio(active: boolean) {
    if (!this.audioCtx) return
    if (active && !this.ambientOscillator && !this.audioMuted) {
      const ctx = this.audioCtx
      this.ambientGain = ctx.createGain()
      this.ambientGain.gain.setValueAtTime(this.audioMasterVolume * this.audioAmbientVolume * 0.05, ctx.currentTime)
      this.ambientGain.connect(ctx.destination)

      this.ambientOscillator = ctx.createOscillator()
      this.ambientOscillator.type = 'sawtooth'
      this.ambientOscillator.frequency.setValueAtTime(60, ctx.currentTime)
      this.ambientOscillator.connect(this.ambientGain)
      this.ambientOscillator.start()
    } else if (!active && this.ambientOscillator) {
      this.ambientOscillator.stop()
      this.ambientOscillator = null
      this.ambientGain = null
    }
  }

  /** Update audio settings */
  setAudioSettings(muted: boolean, masterVolume: number, sfxVolume: number, ambientVolume: number) {
    this.audioMuted = muted
    this.audioMasterVolume = masterVolume
    this.audioSfxVolume = sfxVolume
    this.audioAmbientVolume = ambientVolume
    if (this.ambientGain && this.audioCtx) {
      if (muted) {
        this.ambientGain.gain.setValueAtTime(0, this.audioCtx.currentTime)
      } else {
        this.ambientGain.gain.setValueAtTime(masterVolume * ambientVolume * 0.05, this.audioCtx.currentTime)
      }
    }
    if (muted && this.ambientOscillator) {
      this.setAmbientAudio(false)
    }
  }

  // ── Camera Juice ──────────────────────────────────────

  /** Brief screen shake for critical incidents (fire, major outage) */
  cameraShake(intensity: 'light' | 'medium' | 'heavy' = 'medium') {
    const config: Record<string, { duration: number; intensity: number }> = {
      light: { duration: 80, intensity: 0.003 },
      medium: { duration: 120, intensity: 0.006 },
      heavy: { duration: 200, intensity: 0.01 },
    }
    const { duration, intensity: amt } = config[intensity]
    this.cameras.main.shake(duration, amt)
  }

  /** Smooth camera pan to a grid tile position */
  cameraPanTo(col: number, row: number, duration = 400) {
    const { x, y } = this.isoToScreen(col, row)
    const cam = this.cameras.main
    cam.pan(x, y, duration, 'Power2')
    // After pan completes, sync our internal offsets so manual drag continues smoothly
    this.time.delayedCall(duration, () => {
      this.panOffsetX = -cam.scrollX
      this.panOffsetY = -cam.scrollY
    })
  }

  /** Quick zoom pulse for achievements or upgrades (zoom in 5%, back out) */
  cameraZoomPulse() {
    const cam = this.cameras.main
    const baseZoom = this.zoomLevel
    cam.zoomTo(baseZoom * 1.05, 150, 'Quad.easeOut', false, (_camera: Phaser.Cameras.Scene2D.Camera, progress: number) => {
      if (progress >= 1) {
        cam.zoomTo(baseZoom, 200, 'Quad.easeIn')
      }
    })
  }

  /** Camera zoom out to reveal expanded grid on suite tier upgrade */
  cameraZoomReveal() {
    const cam = this.cameras.main
    const targetZoom = Math.max(0.6, this.zoomLevel * 0.75)
    cam.zoomTo(targetZoom, 800, 'Power2')
    this.time.delayedCall(800, () => {
      this.zoomLevel = targetZoom
    })
  }

  /** Reset camera to default position and zoom, centered on content */
  resetCamera() {
    this.zoomLevel = 1
    this.cameras.main.setZoom(1)

    // Compute content center in world space and scroll so it's at viewport center
    const w = this.scale.width
    const h = this.scale.height

    const contentCenterX = this.offsetX
    const contentTop = this.spineOffsetY - 20
    const gridBottom = this.offsetY + (this.cabCols + this.cabRows) * (TILE_H / 2)
    const contentCenterY = (contentTop + gridBottom) / 2

    const scrollX = contentCenterX - w / 2
    const scrollY = contentCenterY - h / 2

    this.panOffsetX = -scrollX
    this.panOffsetY = -scrollY
    this.cameras.main.setScroll(scrollX, scrollY)
  }
}

export function createGame(parent: string): Phaser.Game {
  const container = document.getElementById(parent)
  const width = container?.clientWidth ?? 800
  const height = container?.clientHeight ?? 450

  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width,
    height,
    parent,
    transparent: true,
    audio: { disableWebAudio: false },
    input: {
      touch: { target: container ?? undefined },
    },
    scene: DataCenterScene,
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
    },
  }

  return new Phaser.Game(config)
}

export function getScene(game: Phaser.Game): DataCenterScene | undefined {
  return game.scene.getScene('DataCenterScene') as DataCenterScene | undefined
}
