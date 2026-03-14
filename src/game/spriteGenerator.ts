/**
 * Runtime pixel art sprite generation for data center equipment.
 * Generates canvas textures that look distinctly "game-like" at the isometric tile scale.
 *
 * All sprites are drawn onto HTML Canvas elements and registered as Phaser textures.
 * Uses a deliberate chunky pixel art style with visible details like LED arrays,
 * drive bays, port indicators, and ventilation grilles.
 */
import Phaser from 'phaser'

// ── Pixel Art Drawing Helpers ──────────────────────────────────

/** Fill a rectangle on the canvas context */
function rect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
  ctx.fillStyle = color
  ctx.fillRect(Math.floor(x), Math.floor(y), Math.ceil(w), Math.ceil(h))
}

/** Draw a single pixel (2x2 for crispness at small sizes) */
function px(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, size = 2) {
  ctx.fillStyle = color
  ctx.fillRect(Math.floor(x), Math.floor(y), size, size)
}

/** Draw an isometric diamond (top face) */
function isoDiamond(ctx: CanvasRenderingContext2D, cx: number, cy: number, w: number, h: number, color: string) {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(cx, cy - h / 2)
  ctx.lineTo(cx + w / 2, cy)
  ctx.lineTo(cx, cy + h / 2)
  ctx.lineTo(cx - w / 2, cy)
  ctx.closePath()
  ctx.fill()
}

/** Draw an isometric left face (parallelogram) */
function isoLeftFace(ctx: CanvasRenderingContext2D, cx: number, cy: number, w: number, h: number, depth: number, color: string) {
  const hw = w / 2
  const hh = h / 2
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(cx - hw, cy)
  ctx.lineTo(cx, cy + hh)
  ctx.lineTo(cx, cy + hh + depth)
  ctx.lineTo(cx - hw, cy + depth)
  ctx.closePath()
  ctx.fill()
}

/** Draw an isometric right face (parallelogram) */
function isoRightFace(ctx: CanvasRenderingContext2D, cx: number, cy: number, w: number, h: number, depth: number, color: string) {
  const hw = w / 2
  const hh = h / 2
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(cx + hw, cy)
  ctx.lineTo(cx, cy + hh)
  ctx.lineTo(cx, cy + hh + depth)
  ctx.lineTo(cx + hw, cy + depth)
  ctx.closePath()
  ctx.fill()
}

// ── Cabinet Sprite (64×96) ─────────────────────────────────────

function generateCabinetTexture(canvas: HTMLCanvasElement) {
  const W = 64
  const H = 96
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, W, H)
  ctx.imageSmoothingEnabled = false

  const cx = W / 2
  const cubeW = 44
  const cubeH = 22
  const depth = 56

  // Top face - metallic gray
  isoDiamond(ctx, cx, 16, cubeW, cubeH, '#778899')

  // Top face detail - ventilation grille pattern
  for (let i = -3; i <= 3; i++) {
    const gx = cx + i * 3
    ctx.fillStyle = 'rgba(50, 60, 70, 0.4)'
    ctx.fillRect(gx, 14, 1, 1)
    ctx.fillRect(gx - 1, 15, 1, 1)
  }

  // Left face - darker
  isoLeftFace(ctx, cx, 16, cubeW, cubeH, depth, '#556677')

  // Right face - front panel
  isoRightFace(ctx, cx, 16, cubeW, cubeH, depth, '#667788')

  // Rack rails on right face (two vertical lines)
  const railX1 = cx + 3
  const railX2 = cx + cubeW / 2 - 3
  for (let dy = 0; dy < depth; dy += 2) {
    const yOff = 27 + dy
    px(ctx, railX1, yOff, '#8899aa', 1)
    px(ctx, railX2, yOff, '#8899aa', 1)
  }

  // U-slot horizontal lines on right face
  for (let slot = 0; slot < 8; slot++) {
    const sy = 30 + slot * 6
    ctx.fillStyle = 'rgba(40, 50, 60, 0.5)'
    ctx.fillRect(railX1, sy, railX2 - railX1, 1)
  }

  // Ventilation holes on left face (diagonal pattern)
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 3; col++) {
      const vx = cx - cubeW / 2 + 4 + col * 5
      const vy = 32 + row * 8 + col * 2
      px(ctx, vx, vy, '#445566', 1)
      px(ctx, vx + 1, vy + 1, '#445566', 1)
    }
  }

  // Door handle on right face
  rect(ctx, cx + 8, 45, 1, 8, '#99aabb')

  // Bottom feet
  rect(ctx, cx - cubeW / 2 + 3, 16 + cubeH / 2 + depth - 1, 4, 2, '#445566')
  rect(ctx, cx + cubeW / 2 - 7, 16 + cubeH / 2 + depth - 1, 4, 2, '#445566')

  // Edge highlights
  ctx.strokeStyle = 'rgba(153, 170, 187, 0.3)'
  ctx.lineWidth = 0.5
  ctx.beginPath()
  ctx.moveTo(cx, 5)
  ctx.lineTo(cx + cubeW / 2, 16)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(cx, 5)
  ctx.lineTo(cx - cubeW / 2, 16)
  ctx.stroke()
}

// ── Server Sprite (48×16) ──────────────────────────────────────

function generateServerTexture(canvas: HTMLCanvasElement) {
  const W = 48
  const H = 16
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, W, H)
  ctx.imageSmoothingEnabled = false

  const cx = W / 2
  const cubeW = 36
  const cubeH = 10
  const depth = 8

  // Top face - bright green
  isoDiamond(ctx, cx, 2, cubeW, cubeH, '#00cc66')

  // Left face
  isoLeftFace(ctx, cx, 2, cubeW, cubeH, depth, '#009944')

  // Right face - front panel
  isoRightFace(ctx, cx, 2, cubeW, cubeH, depth, '#00bb55')

  // Drive bay indicators on right face (2x2 pixel blocks)
  for (let i = 0; i < 4; i++) {
    const bx = cx + 3 + i * 4
    const by = 9
    px(ctx, bx, by, '#006633', 2)
  }

  // Status LED on right face - bright green dot
  px(ctx, cx + 2, 8, '#66ffaa', 2)

  // Ventilation pattern on left face
  for (let i = 0; i < 3; i++) {
    const vx = cx - cubeW / 2 + 3 + i * 4
    px(ctx, vx, 9, '#007744', 1)
    px(ctx, vx, 11, '#007744', 1)
  }

  // Top face detail - heatsink fins
  for (let i = -2; i <= 2; i++) {
    const fx = cx + i * 3
    px(ctx, fx, 2, 'rgba(0, 255, 136, 0.3)', 1)
  }
}

// ── Leaf Switch Sprite (48×12) ─────────────────────────────────

function generateLeafTexture(canvas: HTMLCanvasElement) {
  const W = 48
  const H = 14
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, W, H)
  ctx.imageSmoothingEnabled = false

  const cx = W / 2
  const cubeW = 36
  const cubeH = 8
  const depth = 6

  // Top face - cyan
  isoDiamond(ctx, cx, 2, cubeW, cubeH, '#0088cc')

  // Left face
  isoLeftFace(ctx, cx, 2, cubeW, cubeH, depth, '#006699')

  // Right face - port panel
  isoRightFace(ctx, cx, 2, cubeW, cubeH, depth, '#0077bb')

  // Port indicators on right face - row of small dots
  for (let i = 0; i < 6; i++) {
    const px1 = cx + 2 + i * 3
    px(ctx, px1, 8, '#00ddff', 1)
  }

  // Second row of ports
  for (let i = 0; i < 6; i++) {
    const px1 = cx + 2 + i * 3
    px(ctx, px1, 10, '#005577', 1)
  }

  // Activity LED
  px(ctx, cx + 1, 7, '#00ffff', 2)

  // Top surface label area
  rect(ctx, cx - 5, 1, 10, 2, 'rgba(0, 200, 255, 0.2)')
}

// ── Spine Switch Sprite (64×32) ────────────────────────────────

function generateSpineTexture(canvas: HTMLCanvasElement) {
  const W = 64
  const H = 32
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, W, H)
  ctx.imageSmoothingEnabled = false

  const cx = W / 2
  const cubeW = 50
  const cubeH = 14
  const depth = 12

  // Top face - warm orange
  isoDiamond(ctx, cx, 6, cubeW, cubeH, '#dd8833')

  // Left face
  isoLeftFace(ctx, cx, 6, cubeW, cubeH, depth, '#aa6622')

  // Right face
  isoRightFace(ctx, cx, 6, cubeW, cubeH, depth, '#cc7722')

  // Heatsink fins on top face
  for (let i = -4; i <= 4; i++) {
    const fx = cx + i * 3
    ctx.fillStyle = 'rgba(255, 170, 68, 0.35)'
    ctx.fillRect(fx, 5, 1, 3)
  }

  // High-density port array on right face
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 8; col++) {
      const portX = cx + 3 + col * 3
      const portY = 15 + row * 3
      const portColor = row === 0 ? '#ffaa44' : '#885522'
      px(ctx, portX, portY, portColor, 1)
    }
  }

  // Power/status LED
  px(ctx, cx + 2, 14, '#88ff88', 2)

  // Fan grilles on left face
  const fanCx1 = cx - cubeW / 2 + 8
  const fanCx2 = cx - cubeW / 2 + 18
  const fanY = 17
  ctx.strokeStyle = '#886633'
  ctx.lineWidth = 0.8
  ctx.beginPath()
  ctx.arc(fanCx1, fanY, 3, 0, Math.PI * 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(fanCx2, fanY, 3, 0, Math.PI * 2)
  ctx.stroke()

  // Model label on top
  rect(ctx, cx - 6, 5, 12, 2, 'rgba(255, 200, 100, 0.2)')
}

// ── Cooling Unit Sprite (48×40) ────────────────────────────────

function generateCoolingTexture(canvas: HTMLCanvasElement) {
  const W = 48
  const H = 40
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, W, H)
  ctx.imageSmoothingEnabled = false

  const cx = W / 2
  const cubeW = 30
  const cubeH = 16
  const depth = 18

  // Top face - cool blue
  isoDiamond(ctx, cx, 6, cubeW, cubeH, '#4488bb')

  // Left face
  isoLeftFace(ctx, cx, 6, cubeW, cubeH, depth, '#336699')

  // Right face
  isoRightFace(ctx, cx, 6, cubeW, cubeH, depth, '#3377aa')

  // Fan grille on top face
  ctx.strokeStyle = 'rgba(100, 180, 255, 0.5)'
  ctx.lineWidth = 0.8
  ctx.beginPath()
  ctx.arc(cx, 6, 4, 0, Math.PI * 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(cx, 6, 2, 0, Math.PI * 2)
  ctx.stroke()

  // Pipe connections on left face
  rect(ctx, cx - cubeW / 2 + 2, 20, 3, 2, '#2288cc')
  rect(ctx, cx - cubeW / 2 + 2, 26, 3, 2, '#2288cc')

  // Control panel on right face
  rect(ctx, cx + 3, 18, 8, 6, '#224466')
  // LED indicators on control panel
  px(ctx, cx + 4, 19, '#00ff88', 1)
  px(ctx, cx + 6, 19, '#ffaa00', 1)
  px(ctx, cx + 8, 19, '#00ff88', 1)

  // Temperature display
  rect(ctx, cx + 4, 21, 6, 2, '#003344')
}

// ── PDU Sprite (40×28) ─────────────────────────────────────────

function generatePDUTexture(canvas: HTMLCanvasElement) {
  const W = 40
  const H = 28
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, W, H)
  ctx.imageSmoothingEnabled = false

  const cx = W / 2
  const cubeW = 26
  const cubeH = 12
  const depth = 10

  // Top face - amber/yellow
  isoDiamond(ctx, cx, 5, cubeW, cubeH, '#cc9900')

  // Left face
  isoLeftFace(ctx, cx, 5, cubeW, cubeH, depth, '#997700')

  // Right face
  isoRightFace(ctx, cx, 5, cubeW, cubeH, depth, '#bb8800')

  // Power outlets on right face
  for (let i = 0; i < 3; i++) {
    const ox = cx + 2 + i * 4
    const oy = 14
    rect(ctx, ox, oy, 2, 3, '#665500')
    px(ctx, ox, oy, '#ffcc00', 1)
  }

  // Circuit breaker switches on left face
  for (let i = 0; i < 2; i++) {
    const sx = cx - cubeW / 2 + 3 + i * 5
    rect(ctx, sx, 14, 2, 4, '#886600')
  }

  // Power LED
  px(ctx, cx + 2, 12, '#00ff44', 2)

  // Cable entry at bottom
  rect(ctx, cx - 2, 20, 4, 2, '#554400')
}

// ── Public API ─────────────────────────────────────────────────

/** Generate all pixel art textures and register them with the Phaser texture manager */
export function generatePixelArtTextures(scene: Phaser.Scene): boolean {
  const tm = scene.textures

  // Only generate once
  if (tm.exists('px_cabinet')) return true

  const generators: [string, (c: HTMLCanvasElement) => void][] = [
    ['px_cabinet', generateCabinetTexture],
    ['px_server', generateServerTexture],
    ['px_leaf', generateLeafTexture],
    ['px_spine', generateSpineTexture],
    ['px_cooling', generateCoolingTexture],
    ['px_pdu', generatePDUTexture],
  ]

  for (const [key, gen] of generators) {
    const canvasTexture = tm.createCanvas(key, 64, 96)
    if (!canvasTexture) return false
    const canvas = canvasTexture.getSourceImage() as HTMLCanvasElement
    gen(canvas)
    canvasTexture.refresh()
  }

  return true
}
