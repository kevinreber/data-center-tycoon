import Phaser from 'phaser'
import type { LayerVisibility, LayerOpacity, LayerColors, LayerColorOverrides } from '@/stores/gameStore'
import { DEFAULT_COLORS } from '@/stores/gameStore'

const COLORS = DEFAULT_COLORS

// Cabinet grid dimensions
const TILE_W = 64
const TILE_H = 32
const CAB_COLS = 8
const CAB_ROWS = 4
const SPINE_SLOTS = 6

// Cabinet visual dimensions
const CUBE_W = 44
const CUBE_H = 22
const BASE_DEPTH = 4     // dark cabinet frame base
const SERVER_DEPTH = 10  // height per server unit
const LEAF_DEPTH = 7     // leaf switch band on top
const SECTION_GAP = 1    // subtle gap between stacked sections

// Spine visual dimensions
const SPINE_W = 50
const SPINE_H = 25
const SPINE_DEPTH = 16

// Frame color (dark metal)
const FRAME_COLORS: LayerColors = { top: 0x1a2a3a, side: 0x142230, front: 0x0e1a28 }

interface CabinetEntry {
  id: string
  col: number
  row: number
  serverCount: number
  hasLeafSwitch: boolean
  powerOn: boolean
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
  /* spineLabel is stored on the scene display list, no field needed */
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
  }

  private isoToScreen(col: number, row: number): { x: number; y: number } {
    return {
      x: this.offsetX + (col - row) * (TILE_W / 2),
      y: this.offsetY + (col + row) * (TILE_H / 2),
    }
  }

  private spineToScreen(slot: number): { x: number; y: number } {
    const totalW = SPINE_SLOTS * 60
    const startX = this.spineOffsetX - totalW / 2
    return {
      x: startX + slot * 60 + 30,
      y: this.spineOffsetY,
    }
  }

  private drawFloor() {
    this.floorGraphics = this.add.graphics()

    for (let r = 0; r < CAB_ROWS; r++) {
      for (let c = 0; c < CAB_COLS; c++) {
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

    for (let row = 0; row <= CAB_ROWS; row++) {
      const start = this.isoToScreen(0, row)
      const end = this.isoToScreen(CAB_COLS, row)
      this.gridGraphics.lineBetween(start.x, start.y, end.x, end.y)
    }

    for (let col = 0; col <= CAB_COLS; col++) {
      const start = this.isoToScreen(col, 0)
      const end = this.isoToScreen(col, CAB_ROWS)
      this.gridGraphics.lineBetween(start.x, start.y, end.x, end.y)
    }

    // Outer border glow
    this.gridGraphics.lineStyle(1.5, 0x00ff88, 0.25)
    const tl = this.isoToScreen(0, 0)
    const tr = this.isoToScreen(CAB_COLS, 0)
    const br = this.isoToScreen(CAB_COLS, CAB_ROWS)
    const bl = this.isoToScreen(0, CAB_ROWS)
    this.gridGraphics.lineBetween(tl.x, tl.y, tr.x, tr.y)
    this.gridGraphics.lineBetween(tr.x, tr.y, br.x, br.y)
    this.gridGraphics.lineBetween(br.x, br.y, bl.x, bl.y)
    this.gridGraphics.lineBetween(bl.x, bl.y, tl.x, tl.y)

    this.gridGraphics.setDepth(1)
  }

  private drawSpineFloor() {
    this.spineFloorGraphics = this.add.graphics()

    // Draw a subtle platform for spine switches
    const totalW = SPINE_SLOTS * 60
    const startX = this.spineOffsetX - totalW / 2
    const y = this.spineOffsetY

    // Draw slot markers
    for (let i = 0; i < SPINE_SLOTS; i++) {
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
    this.add
      .text(this.spineOffsetX, y - 16, 'SPINE SWITCHES', {
        fontFamily: 'monospace',
        fontSize: '9px',
        color: '#ff6644',
      })
      .setOrigin(0.5)
      .setAlpha(0.5)
      .setDepth(1)
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
    const baseDepth = 10 + entry.row * CAB_COLS + entry.col

    const serverColors: LayerColors = this.layerColors.server ?? COLORS.server
    const leafColors: LayerColors = this.layerColors.leaf_switch ?? COLORS.leaf_switch
    const serverVis = this.layerVisibility.server
    const leafVis = this.layerVisibility.leaf_switch
    const serverOpacity = this.layerOpacity.server
    const leafOpacity = this.layerOpacity.leaf_switch
    const powerMult = entry.powerOn ? 1 : 0.2

    let currentY = cy // bottom of the stack (floor level)

    // 1. Base frame (always visible, dark metal)
    this.drawIsoCube(g, cx, currentY, CUBE_W, CUBE_H, BASE_DEPTH, FRAME_COLORS, 0.8 * powerMult)
    currentY -= BASE_DEPTH + SECTION_GAP

    // 2. Server layers (green, stacked)
    if (serverVis) {
      for (let i = 0; i < entry.serverCount; i++) {
        const alpha = 0.85 * serverOpacity * powerMult
        this.drawIsoCube(g, cx, currentY, CUBE_W - 2, CUBE_H - 1, SERVER_DEPTH, serverColors, alpha)

        // Server LED
        if (serverOpacity > 0.3) {
          const ledColor = `#${serverColors.top.toString(16).padStart(6, '0')}`
          const led = this.add
            .text(cx + CUBE_W / 2 - 6, currentY - SERVER_DEPTH + 1, '●', {
              fontFamily: 'monospace',
              fontSize: '5px',
              color: ledColor,
            })
            .setOrigin(0.5)
            .setAlpha(entry.powerOn ? 0.9 * serverOpacity : 0.1)
            .setDepth(baseDepth + 1)
          labels.push(led)
        }

        currentY -= SERVER_DEPTH + SECTION_GAP
      }
    } else {
      // Still account for height even if hidden, so leaf sits at right position
      currentY -= entry.serverCount * (SERVER_DEPTH + SECTION_GAP)
    }

    // 3. Leaf switch on top (cyan band)
    if (entry.hasLeafSwitch) {
      if (leafVis) {
        const alpha = 0.85 * leafOpacity * powerMult
        this.drawIsoCube(g, cx, currentY, CUBE_W, CUBE_H, LEAF_DEPTH, leafColors, alpha)

        // Leaf LED
        if (leafOpacity > 0.3) {
          const ledColor = `#${leafColors.top.toString(16).padStart(6, '0')}`
          const led = this.add
            .text(cx, currentY - LEAF_DEPTH - 4, '●', {
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
      currentY -= LEAF_DEPTH + SECTION_GAP
    }

    // Cabinet ID label at the top
    const topY = cy - BASE_DEPTH - entry.serverCount * (SERVER_DEPTH + SECTION_GAP) -
      (entry.hasLeafSwitch ? LEAF_DEPTH + SECTION_GAP : 0) - 10
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
  }

  // ── Public API ──────────────────────────────────────────

  addCabinetToScene(id: string, serverCount: number, hasLeafSwitch: boolean) {
    const col = this.cabCount % CAB_COLS
    const row = Math.floor(this.cabCount / CAB_COLS) % CAB_ROWS
    this.cabCount++

    const entry: CabinetEntry = { id, col, row, serverCount, hasLeafSwitch, powerOn: true }
    this.cabEntries.set(id, entry)
    this.renderCabinet(entry)
  }

  updateCabinet(id: string, serverCount: number, hasLeafSwitch: boolean, powerOn: boolean) {
    const entry = this.cabEntries.get(id)
    if (!entry) return
    entry.serverCount = serverCount
    entry.hasLeafSwitch = hasLeafSwitch
    entry.powerOn = powerOn
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
