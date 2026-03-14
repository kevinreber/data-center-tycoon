/**
 * Runtime pixel art sprite generation for data center equipment.
 * Generates canvas textures styled after realistic data center aesthetics —
 * dark charcoal server racks with subtle LED accents, inspired by games
 * like Startup Company.
 *
 * All sprites are drawn onto HTML Canvas elements and registered as Phaser textures.
 */
import Phaser from 'phaser'

// ── Pixel Art Drawing Helpers ──────────────────────────────────

/** Fill a rectangle on the canvas context */
function rect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
  ctx.fillStyle = color
  ctx.fillRect(Math.floor(x), Math.floor(y), Math.ceil(w), Math.ceil(h))
}

/** Draw a single pixel (default 2x2 for crispness at small sizes) */
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
// Dark charcoal server rack with visible front mesh, green LEDs,
// and realistic detail.

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

  // Top face — dark steel
  isoDiamond(ctx, cx, 16, cubeW, cubeH, '#3a3e48')

  // Top face detail — exhaust fan grates (circles approximated as dots)
  for (let i = -2; i <= 2; i++) {
    const gx = cx + i * 4
    px(ctx, gx, 14, '#2a2e36', 2)
    px(ctx, gx - 1, 16, '#2a2e36', 1)
  }
  // Fan center dots
  px(ctx, cx - 5, 15, '#22262e', 2)
  px(ctx, cx + 5, 15, '#22262e', 2)

  // Left face — dark side panel with ventilation
  isoLeftFace(ctx, cx, 16, cubeW, cubeH, depth, '#282c34')

  // Right face — front panel (slightly lighter to read detail)
  isoRightFace(ctx, cx, 16, cubeW, cubeH, depth, '#32363e')

  // ── Front panel detail (right face) ──

  // Steel frame rails (two vertical lines on the front)
  const railX1 = cx + 2
  const railX2 = cx + cubeW / 2 - 2
  for (let dy = 0; dy < depth; dy += 1) {
    const yOff = 27 + dy
    px(ctx, railX1, yOff, '#444850', 1)
    px(ctx, railX2, yOff, '#444850', 1)
  }

  // Server bay horizontal dividers (dark lines showing U-slot separators)
  for (let slot = 0; slot < 8; slot++) {
    const sy = 29 + slot * 6
    ctx.fillStyle = '#1e2228'
    ctx.fillRect(railX1 + 1, sy, railX2 - railX1 - 1, 1)

    // Server faceplate fill (slightly lighter than frame)
    ctx.fillStyle = '#2e3238'
    ctx.fillRect(railX1 + 1, sy + 1, railX2 - railX1 - 1, 4)

    // Green activity LED per server bay
    if (slot < 6) {
      px(ctx, railX2 - 2, sy + 2, '#00cc44', 1)
    }

    // Drive bay indicators (small dark squares)
    for (let d = 0; d < 3; d++) {
      px(ctx, railX1 + 3 + d * 4, sy + 2, '#1a1e24', 2)
    }
  }

  // ── Left face ventilation pattern ──
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 3; col++) {
      const vx = cx - cubeW / 2 + 3 + col * 4
      const vy = 30 + row * 6 + col * 2
      px(ctx, vx, vy, '#1e2228', 1)
      px(ctx, vx + 1, vy + 1, '#1e2228', 1)
    }
  }

  // Top edge highlight (subtle steel gleam)
  ctx.strokeStyle = 'rgba(80, 90, 100, 0.4)'
  ctx.lineWidth = 0.5
  ctx.beginPath()
  ctx.moveTo(cx, 5)
  ctx.lineTo(cx + cubeW / 2, 16)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(cx, 5)
  ctx.lineTo(cx - cubeW / 2, 16)
  ctx.stroke()

  // Bottom base plate
  rect(ctx, cx - cubeW / 2 + 2, 16 + cubeH / 2 + depth - 2, cubeW - 4, 2, '#22262e')

  // Bottom feet
  rect(ctx, cx - cubeW / 2 + 3, 16 + cubeH / 2 + depth, 4, 2, '#1a1e24')
  rect(ctx, cx + cubeW / 2 - 7, 16 + cubeH / 2 + depth, 4, 2, '#1a1e24')
}

// ── Server Sprite (48×16) ──────────────────────────────────────
// Dark server blade with subtle green LED accent.

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

  // Top face — dark steel
  isoDiamond(ctx, cx, 2, cubeW, cubeH, '#3a4048')

  // Left face — side panel
  isoLeftFace(ctx, cx, 2, cubeW, cubeH, depth, '#282e34')

  // Right face — front panel
  isoRightFace(ctx, cx, 2, cubeW, cubeH, depth, '#323840')

  // Drive bay indicators (small dark insets)
  for (let i = 0; i < 4; i++) {
    const bx = cx + 2 + i * 4
    px(ctx, bx, 9, '#1e2228', 2)
  }

  // Power/activity LED — green
  px(ctx, cx + cubeW / 2 - 6, 8, '#00dd55', 2)

  // Ventilation slots on left face
  for (let i = 0; i < 3; i++) {
    px(ctx, cx - cubeW / 2 + 3 + i * 4, 9, '#1e2228', 1)
    px(ctx, cx - cubeW / 2 + 3 + i * 4, 11, '#1e2228', 1)
  }

  // Subtle top face heatsink detail
  for (let i = -2; i <= 2; i++) {
    px(ctx, cx + i * 3, 2, 'rgba(50, 56, 64, 0.6)', 1)
  }
}

// ── Leaf Switch Sprite (48×14) ─────────────────────────────────
// Dark network switch with cyan port indicators.

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

  // Top face — dark steel
  isoDiamond(ctx, cx, 2, cubeW, cubeH, '#363c44')

  // Left face
  isoLeftFace(ctx, cx, 2, cubeW, cubeH, depth, '#262c32')

  // Right face — port panel
  isoRightFace(ctx, cx, 2, cubeW, cubeH, depth, '#303640')

  // Port indicators on right face — row of cyan dots
  for (let i = 0; i < 6; i++) {
    const px1 = cx + 2 + i * 3
    px(ctx, px1, 8, '#0088aa', 1)
  }

  // Second row of ports (darker, unused)
  for (let i = 0; i < 6; i++) {
    const px1 = cx + 2 + i * 3
    px(ctx, px1, 10, '#1a2028', 1)
  }

  // Activity LED — cyan
  px(ctx, cx + 1, 7, '#00bbdd', 2)
}

// ── Spine Switch Sprite (64×32) ────────────────────────────────
// Dark chassis with orange status accents.

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

  // Top face — dark metal
  isoDiamond(ctx, cx, 6, cubeW, cubeH, '#3a3e46')

  // Left face — side panel
  isoLeftFace(ctx, cx, 6, cubeW, cubeH, depth, '#282c34')

  // Right face — front panel
  isoRightFace(ctx, cx, 6, cubeW, cubeH, depth, '#323840')

  // Heatsink fins on top face
  for (let i = -4; i <= 4; i++) {
    ctx.fillStyle = 'rgba(50, 56, 64, 0.5)'
    ctx.fillRect(cx + i * 3, 5, 1, 3)
  }

  // High-density port array on right face
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 8; col++) {
      const portX = cx + 3 + col * 3
      const portY = 15 + row * 3
      const portColor = row === 0 ? '#cc7722' : '#1e2228'
      px(ctx, portX, portY, portColor, 1)
    }
  }

  // Status LED — orange
  px(ctx, cx + 2, 14, '#ff8833', 2)

  // Fan grilles on left face
  const fanCx1 = cx - cubeW / 2 + 8
  const fanCx2 = cx - cubeW / 2 + 18
  const fanY = 17
  ctx.strokeStyle = '#3a3e46'
  ctx.lineWidth = 0.8
  ctx.beginPath()
  ctx.arc(fanCx1, fanY, 3, 0, Math.PI * 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(fanCx2, fanY, 3, 0, Math.PI * 2)
  ctx.stroke()
}

// ── Cooling Unit Sprite (48×40) ────────────────────────────────
// Blue-gray equipment with fan and pipe detail.

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

  // Top face — blue-gray
  isoDiamond(ctx, cx, 6, cubeW, cubeH, '#3a4858')

  // Left face
  isoLeftFace(ctx, cx, 6, cubeW, cubeH, depth, '#283848')

  // Right face
  isoRightFace(ctx, cx, 6, cubeW, cubeH, depth, '#304050')

  // Fan grille on top face (concentric rings)
  ctx.strokeStyle = 'rgba(80, 140, 200, 0.4)'
  ctx.lineWidth = 0.8
  ctx.beginPath()
  ctx.arc(cx, 6, 4, 0, Math.PI * 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(cx, 6, 2, 0, Math.PI * 2)
  ctx.stroke()

  // Pipe connections on left face
  rect(ctx, cx - cubeW / 2 + 2, 20, 3, 2, '#2868a8')
  rect(ctx, cx - cubeW / 2 + 2, 26, 3, 2, '#2868a8')

  // Control panel on right face
  rect(ctx, cx + 3, 18, 8, 6, '#1a2838')
  // LED indicators
  px(ctx, cx + 4, 19, '#00cc44', 1)
  px(ctx, cx + 6, 19, '#cc8800', 1)
  px(ctx, cx + 8, 19, '#00cc44', 1)

  // Temperature display
  rect(ctx, cx + 4, 21, 6, 2, '#0a1828')
}

// ── PDU Sprite (40×28) ─────────────────────────────────────────
// Dark gray with amber power accents.

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

  // Top face — dark metal
  isoDiamond(ctx, cx, 5, cubeW, cubeH, '#3a3830')

  // Left face
  isoLeftFace(ctx, cx, 5, cubeW, cubeH, depth, '#2a2820')

  // Right face
  isoRightFace(ctx, cx, 5, cubeW, cubeH, depth, '#343228')

  // Power outlets on right face
  for (let i = 0; i < 3; i++) {
    const ox = cx + 2 + i * 4
    const oy = 14
    rect(ctx, ox, oy, 2, 3, '#1e1c16')
    px(ctx, ox, oy, '#cc9900', 1)
  }

  // Circuit breaker switches on left face
  for (let i = 0; i < 2; i++) {
    const sx = cx - cubeW / 2 + 3 + i * 5
    rect(ctx, sx, 14, 2, 4, '#222018')
  }

  // Power LED — amber
  px(ctx, cx + 2, 12, '#ddaa00', 2)

  // Cable entry at bottom
  rect(ctx, cx - 2, 20, 4, 2, '#1a1810')
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
