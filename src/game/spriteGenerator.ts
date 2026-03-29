/**
 * Runtime pixel art sprite generation for data center equipment.
 *
 * All textures are generated at 2x resolution and displayed at 0.5 scale
 * for crisp rendering. Drawing uses logical (1x) coordinates via ctx.scale(2,2).
 */
import Phaser from 'phaser'

// ── Drawing Helpers (all coords are in logical/1x space) ──────

function rect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string) {
  ctx.fillStyle = color
  ctx.fillRect(x, y, w, h)
}

function line(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string, width = 1) {
  ctx.strokeStyle = color
  ctx.lineWidth = width
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()
}

/** Fill an isometric top face (diamond) */
function isoTop(ctx: CanvasRenderingContext2D, cx: number, cy: number, w: number, h: number, color: string) {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(cx, cy - h / 2)
  ctx.lineTo(cx + w / 2, cy)
  ctx.lineTo(cx, cy + h / 2)
  ctx.lineTo(cx - w / 2, cy)
  ctx.closePath()
  ctx.fill()
}

/** Fill an isometric left face */
function isoLeft(ctx: CanvasRenderingContext2D, cx: number, cy: number, w: number, h: number, depth: number, color: string) {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(cx - w / 2, cy)
  ctx.lineTo(cx, cy + h / 2)
  ctx.lineTo(cx, cy + h / 2 + depth)
  ctx.lineTo(cx - w / 2, cy + depth)
  ctx.closePath()
  ctx.fill()
}

/** Fill an isometric right face */
function isoRight(ctx: CanvasRenderingContext2D, cx: number, cy: number, w: number, h: number, depth: number, color: string) {
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.moveTo(cx + w / 2, cy)
  ctx.lineTo(cx, cy + h / 2)
  ctx.lineTo(cx, cy + h / 2 + depth)
  ctx.lineTo(cx + w / 2, cy + depth)
  ctx.closePath()
  ctx.fill()
}

/** Stroke isometric cube edges for clean definition */
function isoCubeEdges(ctx: CanvasRenderingContext2D, cx: number, cy: number, w: number, h: number, depth: number, color: string, width = 0.5) {
  const hw = w / 2, hh = h / 2
  ctx.strokeStyle = color
  ctx.lineWidth = width
  ctx.beginPath()
  // Top face
  ctx.moveTo(cx, cy - hh)
  ctx.lineTo(cx + hw, cy)
  ctx.lineTo(cx, cy + hh)
  ctx.lineTo(cx - hw, cy)
  ctx.closePath()
  ctx.stroke()
  // Left vertical
  ctx.beginPath()
  ctx.moveTo(cx - hw, cy)
  ctx.lineTo(cx - hw, cy + depth)
  ctx.stroke()
  // Front vertical
  ctx.beginPath()
  ctx.moveTo(cx, cy + hh)
  ctx.lineTo(cx, cy + hh + depth)
  ctx.stroke()
  // Right vertical
  ctx.beginPath()
  ctx.moveTo(cx + hw, cy)
  ctx.lineTo(cx + hw, cy + depth)
  ctx.stroke()
  // Bottom left edge
  ctx.beginPath()
  ctx.moveTo(cx - hw, cy + depth)
  ctx.lineTo(cx, cy + hh + depth)
  ctx.stroke()
  // Bottom right edge
  ctx.beginPath()
  ctx.moveTo(cx + hw, cy + depth)
  ctx.lineTo(cx, cy + hh + depth)
  ctx.stroke()
}

// ── Cabinet Sprite (64×96 logical → 128×192 actual) ───────────

function generateCabinetTexture(ctx: CanvasRenderingContext2D) {
  const cx = 32
  const topY = 8         // where the top face diamond sits
  const cubeW = 44
  const cubeH = 22
  const depth = 56

  // Three faces — dark charcoal with clear value separation
  isoTop(ctx, cx, topY, cubeW, cubeH, '#454b55')    // top — lightest
  isoLeft(ctx, cx, topY, cubeW, cubeH, depth, '#2a2e36')   // left — darkest
  isoRight(ctx, cx, topY, cubeW, cubeH, depth, '#363b44')  // right/front — mid

  // Bold edge outlines for clean definition
  isoCubeEdges(ctx, cx, topY, cubeW, cubeH, depth, '#5a6272', 0.8)

  // ── Right face (front panel) detail ──
  const railL = cx + 3
  const railR = cx + cubeW / 2 - 3

  // Vertical rack rails
  line(ctx, railL, topY + cubeH / 2 + 2, railL, topY + cubeH / 2 + depth - 2, '#4e5460', 0.8)
  line(ctx, railR, topY + cubeH / 2 + 2, railR, topY + cubeH / 2 + depth - 2, '#4e5460', 0.8)

  // Server bay dividers (8 slots)
  const bayH = (depth - 6) / 8
  for (let i = 0; i < 8; i++) {
    const by = topY + cubeH / 2 + 3 + i * bayH

    // Divider line
    line(ctx, railL + 1, by, railR - 1, by, '#1e2228', 0.5)

    // Server faceplate (slightly different shade)
    rect(ctx, railL + 1, by + 0.5, railR - railL - 2, bayH - 1.5, '#2e333b')

    // Drive bay dots
    for (let d = 0; d < 3; d++) {
      rect(ctx, railL + 3 + d * 3.5, by + 2, 2, 2, '#1e2228')
    }

    // LED indicator (green for active bays)
    if (i < 6) {
      rect(ctx, railR - 3, by + 2, 1.5, 1.5, '#00cc44')
    }
  }

  // ── Left face (side panel) ventilation ──
  for (let i = 0; i < 6; i++) {
    const vy = topY + cubeH / 2 + 6 + i * 8
    for (let j = 0; j < 3; j++) {
      const vx = cx - cubeW / 2 + 3 + j * 3.5
      rect(ctx, vx, vy + j * 1.5, 2, 1, '#1e2228')
    }
  }

  // ── Top face detail — exhaust vents ──
  for (let i = -1; i <= 1; i++) {
    rect(ctx, cx + i * 6 - 1, topY - 2, 2, 4, 'rgba(40, 44, 52, 0.6)')
  }

  // Bottom base
  const bottomY = topY + cubeH / 2 + depth
  rect(ctx, cx - cubeW / 2 + 2, bottomY - 1, cubeW - 4, 1.5, '#222630')
}

// ── Server Sprite (48×16 logical → 96×32 actual) ──────────────
// Simple horizontal bar with LED — not a full iso cube.

function generateServerTexture(ctx: CanvasRenderingContext2D) {
  const cx = 24
  const cubeW = 36
  const cubeH = 9
  const depth = 7
  const topY = 2

  // Clean iso cube
  isoTop(ctx, cx, topY, cubeW, cubeH, '#3e4550')
  isoLeft(ctx, cx, topY, cubeW, cubeH, depth, '#2a3038')
  isoRight(ctx, cx, topY, cubeW, cubeH, depth, '#343a44')

  // Edge definition
  isoCubeEdges(ctx, cx, topY, cubeW, cubeH, depth, '#525a66', 0.5)

  // Simple front panel detail
  const fy = topY + cubeH / 2 + 1
  for (let i = 0; i < 3; i++) {
    rect(ctx, cx + 2 + i * 4, fy + 1, 2.5, 2, '#1e2228')
  }

  // Green activity LED
  rect(ctx, cx + cubeW / 2 - 5, fy + 1, 2, 2, '#00dd55')
}

// ── Leaf Switch Sprite (48×14 logical → 96×28 actual) ─────────

function generateLeafTexture(ctx: CanvasRenderingContext2D) {
  const cx = 24
  const cubeW = 36
  const cubeH = 7
  const depth = 5
  const topY = 2

  // Clean iso cube
  isoTop(ctx, cx, topY, cubeW, cubeH, '#3a4250')
  isoLeft(ctx, cx, topY, cubeW, cubeH, depth, '#283038')
  isoRight(ctx, cx, topY, cubeW, cubeH, depth, '#323a44')

  // Edge definition
  isoCubeEdges(ctx, cx, topY, cubeW, cubeH, depth, '#4a5262', 0.5)

  // Port indicators — row of cyan dots on right face
  const fy = topY + cubeH / 2 + 1
  for (let i = 0; i < 5; i++) {
    rect(ctx, cx + 2 + i * 3, fy + 1, 1.5, 1.5, '#0099bb')
  }

  // Activity LED
  rect(ctx, cx + 1, fy, 2, 2, '#00ccee')
}

// ── Spine Switch Sprite (64×32 logical → 128×64 actual) ───────

function generateSpineTexture(ctx: CanvasRenderingContext2D) {
  const cx = 32
  const cubeW = 50
  const cubeH = 14
  const depth = 12
  const topY = 4

  // Clean iso cube
  isoTop(ctx, cx, topY, cubeW, cubeH, '#444a54')
  isoLeft(ctx, cx, topY, cubeW, cubeH, depth, '#2c3038')
  isoRight(ctx, cx, topY, cubeW, cubeH, depth, '#383e48')

  // Bold edge outlines
  isoCubeEdges(ctx, cx, topY, cubeW, cubeH, depth, '#5c6472', 0.7)

  // Port array on right face (2 rows)
  const fy = topY + cubeH / 2 + 2
  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 7; col++) {
      const color = row === 0 ? '#cc7722' : '#1e2228'
      rect(ctx, cx + 3 + col * 3, fy + row * 3, 1.5, 1.5, color)
    }
  }

  // Status LED — orange
  rect(ctx, cx + 2, fy - 1, 2, 2, '#ff8833')

  // Heatsink fins on top
  for (let i = -3; i <= 3; i++) {
    line(ctx, cx + i * 4, topY - 2, cx + i * 4, topY + 1, 'rgba(55, 60, 70, 0.5)', 0.5)
  }
}

// ── Cooling Unit Sprite (48×40 logical → 96×80 actual) ────────

function generateCoolingTexture(ctx: CanvasRenderingContext2D) {
  const cx = 24
  const cubeW = 30
  const cubeH = 14
  const depth = 18
  const topY = 5

  isoTop(ctx, cx, topY, cubeW, cubeH, '#3a4858')
  isoLeft(ctx, cx, topY, cubeW, cubeH, depth, '#283848')
  isoRight(ctx, cx, topY, cubeW, cubeH, depth, '#304050')

  isoCubeEdges(ctx, cx, topY, cubeW, cubeH, depth, '#506878', 0.6)

  // Fan on top face
  ctx.strokeStyle = 'rgba(80, 140, 200, 0.5)'
  ctx.lineWidth = 0.8
  ctx.beginPath()
  ctx.arc(cx, topY, 4, 0, Math.PI * 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(cx, topY, 1.5, 0, Math.PI * 2)
  ctx.stroke()

  // Pipe connections on left face
  const ly = topY + cubeH / 2 + 4
  rect(ctx, cx - cubeW / 2 + 2, ly, 3, 2, '#3080c0')
  rect(ctx, cx - cubeW / 2 + 2, ly + 6, 3, 2, '#3080c0')

  // Control panel on right face
  const ry = topY + cubeH / 2 + 3
  rect(ctx, cx + 3, ry, 8, 5, '#1a2838')
  rect(ctx, cx + 4, ry + 1, 1.5, 1.5, '#00cc44')
  rect(ctx, cx + 7, ry + 1, 1.5, 1.5, '#cc8800')
}

// ── PDU Sprite (40×28 logical → 80×56 actual) ─────────────────

function generatePDUTexture(ctx: CanvasRenderingContext2D) {
  const cx = 20
  const cubeW = 26
  const cubeH = 12
  const depth = 10
  const topY = 4

  isoTop(ctx, cx, topY, cubeW, cubeH, '#484438')
  isoLeft(ctx, cx, topY, cubeW, cubeH, depth, '#2e2c22')
  isoRight(ctx, cx, topY, cubeW, cubeH, depth, '#3c3830')

  isoCubeEdges(ctx, cx, topY, cubeW, cubeH, depth, '#5a5648', 0.6)

  // Power outlets on right face
  const ry = topY + cubeH / 2 + 2
  for (let i = 0; i < 3; i++) {
    rect(ctx, cx + 2 + i * 4, ry, 2.5, 3, '#1e1c16')
    rect(ctx, cx + 2 + i * 4, ry, 1, 1, '#cc9900')
  }

  // Power LED — amber
  rect(ctx, cx + 2, ry - 1, 2, 2, '#ddaa00')
}

// ── Public API ─────────────────────────────────────────────────

/** Texture specs: [key, generator, logicalWidth, logicalHeight] */
const TEXTURE_SPECS: [string, (ctx: CanvasRenderingContext2D) => void, number, number][] = [
  ['px_cabinet', generateCabinetTexture, 64, 96],
  ['px_server', generateServerTexture, 48, 16],
  ['px_leaf', generateLeafTexture, 48, 14],
  ['px_spine', generateSpineTexture, 64, 32],
  ['px_cooling', generateCoolingTexture, 48, 40],
  ['px_pdu', generatePDUTexture, 40, 28],
]

/** Generate all pixel art textures at 2x resolution.
 *  Sprites should be displayed with setScale(0.5) for crisp rendering. */
export function generatePixelArtTextures(scene: Phaser.Scene): boolean {
  const tm = scene.textures

  // Only generate once
  if (tm.exists('px_cabinet')) return true

  for (const [key, gen, w, h] of TEXTURE_SPECS) {
    // Create canvas at 2x resolution
    const canvasTexture = tm.createCanvas(key, w * 2, h * 2)
    if (!canvasTexture) return false
    const canvas = canvasTexture.getSourceImage() as HTMLCanvasElement
    canvas.width = w * 2
    canvas.height = h * 2
    const ctx = canvas.getContext('2d')!
    ctx.imageSmoothingEnabled = false
    // Scale 2x so drawing commands use logical coordinates
    ctx.scale(2, 2)
    gen(ctx)
    canvasTexture.refresh()
  }

  return true
}
