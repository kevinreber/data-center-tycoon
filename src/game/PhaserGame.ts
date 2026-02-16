import Phaser from 'phaser'
import type { LayerVisibility, LayerOpacity, LayerColors, LayerColorOverrides, TrafficLink, CabinetEnvironment, CabinetFacing, PlacementHint } from '@/stores/gameStore'
import { DEFAULT_COLORS, ENVIRONMENT_CONFIG, MAX_SERVERS_PER_CABINET, getFacingOffsets } from '@/stores/gameStore'

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

  create() {
    const w = this.scale.width
    this.offsetX = w / 2
    this.offsetY = 150

    this.spineOffsetX = w / 2
    this.spineOffsetY = 40

    this.drawSpineFloor()
    this.drawFloor()
    this.drawGrid()

    // Set up pointer events for placement mode
    this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
      if (!this.placementActive) {
        if (this.placementHighlight) {
          this.placementHighlight.clear()
        }
        this.clearZoneOverlays()
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
    const occupied = this.occupiedTiles.has(`${col},${row}`)

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
    if (this.onTileHover && !occupied) {
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

    // Detect which rows are "aisle rows" (empty rows between cabinet rows)
    const cabinetRows = new Set<number>()
    for (const entry of this.cabEntries.values()) {
      cabinetRows.add(entry.row)
    }

    for (let r = 0; r < this.cabRows; r++) {
      // An aisle row is one with no cabinets that sits between two cabinet rows
      const isAisleRow = !cabinetRows.has(r) && cabinetRows.size > 0 &&
        [...cabinetRows].some(cr => cr < r) && [...cabinetRows].some(cr => cr > r)

      for (let c = 0; c < this.cabCols; c++) {
        const { x, y } = this.isoToScreen(c, r)
        const isAlternate = (r + c) % 2 === 0

        let fillColor: number
        let alpha: number
        if (isAisleRow) {
          // Aisle tiles: slightly brighter with a warm tint (walkway floor)
          fillColor = isAlternate ? 0x121a14 : 0x141c16
          alpha = 0.95
        } else {
          fillColor = isAlternate ? 0x0a1520 : 0x0c1825
          alpha = 0.9
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
        if (isAisleRow) {
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
  setGridSize(cols: number, rows: number, spineSlots: number) {
    if (cols === this.cabCols && rows === this.cabRows && spineSlots === this.spineSlots) return

    this.cabCols = cols
    this.cabRows = rows
    this.spineSlots = spineSlots

    // Recalculate offsets
    const w = this.scale.width
    this.offsetX = w / 2
    this.offsetY = 150
    this.spineOffsetX = w / 2
    this.spineOffsetY = 40

    // Clear and redraw floor/grid
    if (this.floorGraphics) { this.floorGraphics.destroy(); this.floorGraphics = null }
    if (this.gridGraphics) { this.gridGraphics.destroy(); this.gridGraphics = null }
    if (this.spineFloorGraphics) { this.spineFloorGraphics.destroy(); this.spineFloorGraphics = null }
    if (this.spineLabel) { this.spineLabel.destroy(); this.spineLabel = null }

    this.drawSpineFloor()
    this.drawFloor()
    this.drawGrid()

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
      // Show placement mode indicator
      const w = this.scale.width
      this.placementModeLabel = this.add
        .text(w / 2, this.offsetY + (this.cabRows + 1) * TILE_H, 'CLICK A TILE TO PLACE CABINET', {
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

  /** Clear all infrastructure graphics (for rebuild) */
  clearInfrastructure() {
    for (const g of this.pduGraphics.values()) g.destroy()
    for (const l of this.pduLabels.values()) l.destroy()
    for (const g of this.cableTrayGraphics.values()) g.destroy()
    this.pduGraphics.clear()
    this.pduLabels.clear()
    this.pduEntries.clear()
    this.cableTrayGraphics.clear()
    this.cableTrayEntries.clear()
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

  /** Reset camera to default position and zoom */
  resetCamera() {
    this.panOffsetX = 0
    this.panOffsetY = 0
    this.zoomLevel = 1
    this.cameras.main.setScroll(0, 0)
    this.cameras.main.setZoom(1)
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
