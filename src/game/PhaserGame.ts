import Phaser from 'phaser'
import type { LayerVisibility, LayerOpacity, LayerColors, LayerColorOverrides, TrafficLink, CabinetEnvironment, CabinetFacing, PlacementHint, DataCenterLayout, CoolingUnitType, ChillerTier } from '@/stores/gameStore'
import { DEFAULT_COLORS, ENVIRONMENT_CONFIG, MAX_SERVERS_PER_CABINET, getFacingOffsets, COOLING_UNIT_CONFIG, CHILLER_PLANT_CONFIG } from '@/stores/gameStore'

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


interface CabinetEntry {
  id: string
  col: number
  row: number
  serverCount: number
  hasLeafSwitch: boolean
  powerOn: boolean
  environment: CabinetEnvironment
  facing: CabinetFacing
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

  // Zone outlines
  private zoneGraphics: Phaser.GameObjects.Graphics | null = null

  // Dedicated row highlights
  private dedicatedRowGraphics: Phaser.GameObjects.Graphics | null = null
  private dedicatedRowLabels: Phaser.GameObjects.Text[] = []

  // Heat map overlay
  private heatMapGraphics: Phaser.GameObjects.Graphics | null = null
  private heatMapVisible = false

  // Selected cabinet
  private selectedCabinetId: string | null = null
  private selectionGraphics: Phaser.GameObjects.Graphics | null = null
  private onCabinetSelect: ((id: string | null) => void) | null = null

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

      // Left click: start potential drag (resolved as click or pan on pointerup)
      if (pointer.leftButtonDown()) {
        this.isPotentialDrag = true
        this.isDragging = false
        this.clickStartX = pointer.x
        this.clickStartY = pointer.y
        this.dragStartX = pointer.x - this.panOffsetX
        this.dragStartY = pointer.y - this.panOffsetY
      }

      // Right/middle click: immediate drag
      if (pointer.rightButtonDown() || pointer.middleButtonDown()) {
        this.isDragging = true
        this.dragStartX = pointer.x - this.panOffsetX
        this.dragStartY = pointer.y - this.panOffsetY
      }
    })

    this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      // If left-click didn't become a drag, treat as cabinet selection click
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
      // Detect when a potential left-click drag exceeds the threshold
      if (this.isPotentialDrag && !this.isDragging) {
        const dx = pointer.x - this.clickStartX
        const dy = pointer.y - this.clickStartY
        if (Math.sqrt(dx * dx + dy * dy) > DRAG_THRESHOLD) {
          this.isDragging = true
          this.isPotentialDrag = false
          this.game.canvas.style.cursor = 'grabbing'
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
      for (const aisle of this.layout.aisles) aisleGridRows.set(aisle.gridRow, aisle.type)
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
      const color = aisle.type === 'cold' ? 0x00aaff : aisle.type === 'hot' ? 0xff6644 : 0x888888
      const typeLabel = aisle.type === 'cold' ? 'COLD AISLE' : aisle.type === 'hot' ? 'HOT AISLE' : 'AISLE'

      // Draw aisle border lines (top and bottom edges of the aisle row)
      const leftTop = this.isoToScreen(0, r)
      const rightTop = this.isoToScreen(this.cabCols, r)
      const leftBot = this.isoToScreen(0, r + 1)
      const rightBot = this.isoToScreen(this.cabCols, r + 1)

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
        this.drawContainmentPanels(aisle.gridRow, color)
      }
    }
  }

  /** Draw containment panel indicators on a contained aisle */
  private drawContainmentPanels(aisleGridRow: number, aisleColor: number) {
    if (!this.containmentGraphics) return

    // Draw small barrier marks at each end of the aisle
    const leftTop = this.isoToScreen(0, aisleGridRow)
    const rightTop = this.isoToScreen(this.cabCols, aisleGridRow)
    const leftBot = this.isoToScreen(0, aisleGridRow + 1)
    const rightBot = this.isoToScreen(this.cabCols, aisleGridRow + 1)

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

  /** Phaser update loop — animate packet dots */
  update(_time: number, delta: number) {
    if (!this.trafficVisible || this.trafficLinks.length === 0) return
    this.packetTime += delta * 0.001
    this.renderPackets()
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

  // ── Public API ──────────────────────────────────────────

  addCabinetToScene(id: string, col: number, row: number, serverCount: number, hasLeafSwitch: boolean, environment: CabinetEnvironment = 'production', facing: CabinetFacing = 'north') {
    this.cabCount++

    const entry: CabinetEntry = { id, col, row, serverCount, hasLeafSwitch, powerOn: true, environment, facing }
    this.cabEntries.set(id, entry)
    this.occupiedTiles.add(`${col},${row}`)
    this.renderCabinet(entry)
  }

  updateCabinet(id: string, serverCount: number, hasLeafSwitch: boolean, powerOn: boolean, environment: CabinetEnvironment = 'production', facing: CabinetFacing = 'north') {
    const entry = this.cabEntries.get(id)
    if (!entry) return
    entry.serverCount = serverCount
    entry.hasLeafSwitch = hasLeafSwitch
    entry.powerOn = powerOn
    entry.environment = environment
    entry.facing = facing
    this.renderCabinet(entry)
  }

  addSpineToScene(id: string) {
    const slot = this.spineCount++
    const entry: SpineEntry = { id, slot, powerOn: true }
    this.spineEntries.set(id, entry)
    this.renderSpine(entry)
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

  /** Render heat map overlay showing temperature per cabinet */
  private renderHeatMap() {
    if (this.heatMapGraphics) this.heatMapGraphics.destroy()
    if (!this.heatMapVisible) return

    this.heatMapGraphics = this.add.graphics()
    this.heatMapGraphics.setDepth(45)

    for (const [, entry] of this.cabEntries) {
      const { x, y } = this.isoToScreen(entry.col, entry.row)
      // Color based on implicit heat from server count and power status
      const heatFactor = entry.powerOn ? Math.min(1, entry.serverCount / 4) : 0
      const r = Math.round(255 * heatFactor)
      const g = Math.round(255 * (1 - heatFactor))
      const b = 0
      const color = (r << 16) | (g << 8) | b

      this.heatMapGraphics.fillStyle(color, 0.25)
      this.heatMapGraphics.beginPath()
      this.heatMapGraphics.moveTo(x, y)
      this.heatMapGraphics.lineTo(x + TILE_W / 2, y + TILE_H / 2)
      this.heatMapGraphics.lineTo(x, y + TILE_H)
      this.heatMapGraphics.lineTo(x - TILE_W / 2, y + TILE_H / 2)
      this.heatMapGraphics.closePath()
      this.heatMapGraphics.fillPath()
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
