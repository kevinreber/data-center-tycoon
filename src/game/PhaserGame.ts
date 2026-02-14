import Phaser from 'phaser'
import type { ViewMode } from '@/stores/gameStore'

const COLORS = {
  server: { top: 0x00ff88, side: 0x00cc66, front: 0x009944 },
  leaf_switch: { top: 0x00aaff, side: 0x0088cc, front: 0x006699 },
  spine_switch: { top: 0xff6644, side: 0xcc4422, front: 0x993311 },
}

// Which view plane each node type belongs to
const NODE_PLANE: Record<string, ViewMode> = {
  server: 'cabinet',
  leaf_switch: 'above_cabinet',
  spine_switch: 'above_cabinet',
}

const TILE_W = 64
const TILE_H = 32
const COLS = 12
const ROWS = 8

interface RackEntry {
  id: string
  type: string
  col: number
  row: number
  powerOn: boolean
}

class DataCenterScene extends Phaser.Scene {
  private gridGraphics: Phaser.GameObjects.Graphics | null = null
  private floorGraphics: Phaser.GameObjects.Graphics | null = null
  private rackSprites: Map<string, Phaser.GameObjects.Graphics> = new Map()
  private rackLabels: Map<string, Phaser.GameObjects.Text> = new Map()
  private rackEntries: Map<string, RackEntry> = new Map()
  private nodeCount = 0
  private offsetX = 0
  private offsetY = 0
  private currentViewMode: ViewMode = 'cabinet'

  constructor() {
    super({ key: 'DataCenterScene' })
  }

  create() {
    const w = this.scale.width
    this.offsetX = w / 2
    this.offsetY = 60

    this.drawFloor()
    this.drawGrid()
  }

  private isoToScreen(col: number, row: number): { x: number; y: number } {
    return {
      x: this.offsetX + (col - row) * (TILE_W / 2),
      y: this.offsetY + (col + row) * (TILE_H / 2),
    }
  }

  private drawFloor() {
    this.floorGraphics = this.add.graphics()

    // Draw filled floor tiles
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        const { x, y } = this.isoToScreen(c, r)
        const isAlternate = (r + c) % 2 === 0
        const fillColor = isAlternate ? 0x0a1520 : 0x0c1825

        this.floorGraphics.fillStyle(fillColor, 0.9)
        this.floorGraphics.beginPath()
        this.floorGraphics.moveTo(x, y)
        this.floorGraphics.lineTo(x + TILE_W / 2, y + TILE_H / 2)
        this.floorGraphics.lineTo(x, y + TILE_H)
        this.floorGraphics.lineTo(x - TILE_W / 2, y + TILE_H / 2)
        this.floorGraphics.closePath()
        this.floorGraphics.fillPath()
      }
    }
    this.floorGraphics.setDepth(0)
  }

  private drawGrid() {
    this.gridGraphics = this.add.graphics()
    this.gridGraphics.lineStyle(1, 0x00ff88, 0.12)

    // Draw horizontal iso lines
    for (let row = 0; row <= ROWS; row++) {
      const start = this.isoToScreen(0, row)
      const end = this.isoToScreen(COLS, row)
      this.gridGraphics.lineBetween(start.x, start.y, end.x, end.y)
    }

    // Draw vertical iso lines
    for (let col = 0; col <= COLS; col++) {
      const start = this.isoToScreen(col, 0)
      const end = this.isoToScreen(col, ROWS)
      this.gridGraphics.lineBetween(start.x, start.y, end.x, end.y)
    }

    // Outer border glow
    this.gridGraphics.lineStyle(1.5, 0x00ff88, 0.25)
    const tl = this.isoToScreen(0, 0)
    const tr = this.isoToScreen(COLS, 0)
    const br = this.isoToScreen(COLS, ROWS)
    const bl = this.isoToScreen(0, ROWS)
    this.gridGraphics.lineBetween(tl.x, tl.y, tr.x, tr.y)
    this.gridGraphics.lineBetween(tr.x, tr.y, br.x, br.y)
    this.gridGraphics.lineBetween(br.x, br.y, bl.x, bl.y)
    this.gridGraphics.lineBetween(bl.x, bl.y, tl.x, tl.y)

    this.gridGraphics.setDepth(1)
  }

  /** Draw a solid filled isometric cube */
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
    g.lineStyle(1, colors.top, alpha * 0.6)
    g.lineBetween(x, y - depth, x + hw, y + hh - depth)
    g.lineBetween(x, y - depth, x - hw, y + hh - depth)
    g.lineBetween(x - hw, y + hh - depth, x, y + h - depth)
    g.lineBetween(x + hw, y + hh - depth, x, y + h - depth)
  }

  /** Draw a dashed line between two points */
  private drawDashedLine(
    g: Phaser.GameObjects.Graphics,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    dashLen: number,
    gapLen: number
  ) {
    const dx = x2 - x1
    const dy = y2 - y1
    const dist = Math.sqrt(dx * dx + dy * dy)
    const nx = dx / dist
    const ny = dy / dist
    let drawn = 0
    let drawing = true

    while (drawn < dist) {
      const segLen = drawing ? dashLen : gapLen
      const end = Math.min(drawn + segLen, dist)
      if (drawing) {
        g.lineBetween(
          x1 + nx * drawn,
          y1 + ny * drawn,
          x1 + nx * end,
          y1 + ny * end
        )
      }
      drawn = end
      drawing = !drawing
    }
  }

  /** Draw a dashed wireframe isometric cube (ghost outline for other-plane objects) */
  private drawDashedIsoCube(
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
    const dash = 4
    const gap = 3

    g.lineStyle(1, color, alpha)

    // Top face edges
    this.drawDashedLine(g, x, y - depth, x + hw, y + hh - depth, dash, gap)
    this.drawDashedLine(g, x + hw, y + hh - depth, x, y + h - depth, dash, gap)
    this.drawDashedLine(g, x, y + h - depth, x - hw, y + hh - depth, dash, gap)
    this.drawDashedLine(g, x - hw, y + hh - depth, x, y - depth, dash, gap)

    // Vertical edges
    this.drawDashedLine(g, x - hw, y + hh - depth, x - hw, y + hh, dash, gap)
    this.drawDashedLine(g, x + hw, y + hh - depth, x + hw, y + hh, dash, gap)
    this.drawDashedLine(g, x, y + h - depth, x, y + h, dash, gap)

    // Bottom face visible edges
    this.drawDashedLine(g, x - hw, y + hh, x, y + h, dash, gap)
    this.drawDashedLine(g, x + hw, y + hh, x, y + h, dash, gap)
  }

  /** Render a single rack node based on the current view mode */
  private renderRack(entry: RackEntry) {
    // Clean up existing graphics for this rack
    const oldG = this.rackSprites.get(entry.id)
    if (oldG) oldG.destroy()
    const oldLabel = this.rackLabels.get(entry.id)
    if (oldLabel) oldLabel.destroy()

    const { x, y } = this.isoToScreen(entry.col, entry.row)
    const cx = x
    const cy = y + TILE_H / 2
    const colors = COLORS[entry.type as keyof typeof COLORS] ?? COLORS.server
    const cubeW = 36
    const cubeH = 18
    const cubeDepth = 20

    const nodePlane = NODE_PLANE[entry.type] ?? 'cabinet'
    const isSolidPlane = nodePlane === this.currentViewMode
    const baseAlpha = entry.powerOn ? 0.9 : 0.25

    const g = this.add.graphics()

    if (isSolidPlane) {
      // Solid filled cube — this node belongs to the active plane
      this.drawIsoCube(g, cx, cy, cubeW, cubeH, cubeDepth, colors, baseAlpha)
    } else {
      // Dashed wireframe — ghost outline for the other plane
      this.drawDashedIsoCube(
        g, cx, cy, cubeW, cubeH, cubeDepth,
        colors.top,
        entry.powerOn ? 0.3 : 0.1
      )
    }

    g.setDepth(10 + entry.row * COLS + entry.col)
    this.rackSprites.set(entry.id, g)

    // LED indicator dot
    const labelAlpha = isSolidPlane
      ? (entry.powerOn ? 1 : 0.15)
      : (entry.powerOn ? 0.3 : 0.08)

    const label = this.add
      .text(cx, cy - cubeDepth - 6, '●', {
        fontFamily: 'monospace',
        fontSize: '8px',
        color: `#${colors.top.toString(16).padStart(6, '0')}`,
      })
      .setOrigin(0.5)
      .setAlpha(labelAlpha)
      .setDepth(11 + entry.row * COLS + entry.col)

    this.rackLabels.set(entry.id, label)
  }

  /** Re-render all racks (called when view mode changes) */
  private rerenderAllRacks() {
    for (const entry of this.rackEntries.values()) {
      this.renderRack(entry)
    }
  }

  addRackToScene(id: string, type: string) {
    const col = this.nodeCount % COLS
    const row = Math.floor(this.nodeCount / COLS) % ROWS
    this.nodeCount++

    const entry: RackEntry = { id, type, col, row, powerOn: true }
    this.rackEntries.set(id, entry)
    this.renderRack(entry)
  }

  toggleRackPower(id: string, powerOn: boolean) {
    const entry = this.rackEntries.get(id)
    if (!entry) return
    entry.powerOn = powerOn
    this.renderRack(entry)
  }

  setViewMode(mode: ViewMode) {
    if (mode === this.currentViewMode) return
    this.currentViewMode = mode
    this.rerenderAllRacks()
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
