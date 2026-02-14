import Phaser from 'phaser'

const COLORS = {
  server: { top: 0x00ff88, side: 0x00cc66, front: 0x009944 },
  leaf_switch: { top: 0x00aaff, side: 0x0088cc, front: 0x006699 },
  spine_switch: { top: 0xff6644, side: 0xcc4422, front: 0x993311 },
}

const TILE_W = 64
const TILE_H = 32
const COLS = 12
const ROWS = 8

class DataCenterScene extends Phaser.Scene {
  private gridGraphics: Phaser.GameObjects.Graphics | null = null
  private floorGraphics: Phaser.GameObjects.Graphics | null = null
  private rackSprites: Map<string, Phaser.GameObjects.Graphics> = new Map()
  private rackLabels: Map<string, Phaser.GameObjects.Text> = new Map()
  private nodeCount = 0
  private offsetX = 0
  private offsetY = 0

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

  addRackToScene(id: string, type: string) {
    const col = this.nodeCount % COLS
    const row = Math.floor(this.nodeCount / COLS) % ROWS
    this.nodeCount++

    const { x, y } = this.isoToScreen(col, row)
    // Center in tile
    const cx = x
    const cy = y + TILE_H / 2

    const colors = COLORS[type as keyof typeof COLORS] ?? COLORS.server
    const cubeW = 36
    const cubeH = 18
    const cubeDepth = 20

    const g = this.add.graphics()
    this.drawIsoCube(g, cx, cy, cubeW, cubeH, cubeDepth, colors, 0.9)
    g.setDepth(10 + row * COLS + col)

    this.rackSprites.set(id, g)

    // LED indicator dot on top
    const label = this.add
      .text(cx, cy - cubeDepth - 6, '●', {
        fontFamily: 'monospace',
        fontSize: '8px',
        color: `#${colors.top.toString(16).padStart(6, '0')}`,
      })
      .setOrigin(0.5)
      .setDepth(11 + row * COLS + col)
    this.rackLabels.set(id, label)
  }

  toggleRackPower(id: string, powerOn: boolean) {
    const g = this.rackSprites.get(id)
    if (g) {
      g.setAlpha(powerOn ? 1 : 0.25)
    }
    const label = this.rackLabels.get(id)
    if (label) {
      label.setAlpha(powerOn ? 1 : 0.15)
    }
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
