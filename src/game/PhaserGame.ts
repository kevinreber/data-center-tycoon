import Phaser from 'phaser'

class DataCenterScene extends Phaser.Scene {
  private grid: Phaser.GameObjects.Graphics | null = null
  private rackSprites: Map<string, Phaser.GameObjects.Rectangle> = new Map()
  private nodeCount = 0

  constructor() {
    super({ key: 'DataCenterScene' })
  }

  create() {
    this.grid = this.add.graphics()
    this.drawGrid()

    this.add
      .text(10, 10, 'FABRIC TYCOON', {
        fontFamily: 'monospace',
        fontSize: '18px',
        color: '#00ff88',
      })
      .setDepth(10)

    this.add
      .text(10, 35, 'Isometric floor view (Phaser 3)', {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#666666',
      })
      .setDepth(10)
  }

  private drawGrid() {
    if (!this.grid) return
    this.grid.clear()
    this.grid.lineStyle(1, 0x1a2a1a, 0.4)

    const tileWidth = 64
    const tileHeight = 32
    const cols = 12
    const rows = 8
    const offsetX = 400
    const offsetY = 80

    for (let row = 0; row <= rows; row++) {
      const startX = offsetX + (0 - row) * (tileWidth / 2)
      const startY = offsetY + (0 + row) * (tileHeight / 2)
      const endX = offsetX + (cols - row) * (tileWidth / 2)
      const endY = offsetY + (cols + row) * (tileHeight / 2)
      this.grid.lineBetween(startX, startY, endX, endY)
    }

    for (let col = 0; col <= cols; col++) {
      const startX = offsetX + (col - 0) * (tileWidth / 2)
      const startY = offsetY + (col + 0) * (tileHeight / 2)
      const endX = offsetX + (col - rows) * (tileWidth / 2)
      const endY = offsetY + (col + rows) * (tileHeight / 2)
      this.grid.lineBetween(startX, startY, endX, endY)
    }
  }

  addRackToScene(id: string, type: string) {
    const col = this.nodeCount % 12
    const row = Math.floor(this.nodeCount / 12) % 8
    this.nodeCount++

    const tileWidth = 64
    const tileHeight = 32
    const offsetX = 400
    const offsetY = 80

    const isoX = offsetX + (col - row) * (tileWidth / 2)
    const isoY = offsetY + (col + row) * (tileHeight / 2) + tileHeight / 4

    const colors: Record<string, number> = {
      server: 0x00ff88,
      leaf_switch: 0x00aaff,
      spine_switch: 0xff6644,
    }

    const rect = this.add.rectangle(isoX, isoY, 20, 12, colors[type] ?? 0xffffff, 0.8)
    rect.setDepth(5)
    this.rackSprites.set(id, rect)
  }

  toggleRackPower(id: string, powerOn: boolean) {
    const sprite = this.rackSprites.get(id)
    if (sprite) {
      sprite.setAlpha(powerOn ? 0.8 : 0.2)
    }
  }
}

export function createGame(parent: string): Phaser.Game {
  const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 400,
    parent,
    transparent: true,
    scene: DataCenterScene,
  }

  return new Phaser.Game(config)
}

export function getScene(game: Phaser.Game): DataCenterScene | undefined {
  return game.scene.getScene('DataCenterScene') as DataCenterScene | undefined
}
