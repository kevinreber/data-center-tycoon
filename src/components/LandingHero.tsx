import { useEffect, useRef } from 'react'
import type { HardwareArt, CabinetArtSpec, Pt } from '@/game/hardware'
import {
  HARDWARE_STYLES,
  cabinetChassisArt,
  cabinetServersArt,
  cabinetLeafArt,
  cabinetLedAnchors,
  spineArt,
  coolingArt,
} from '@/game/hardware'
import { DEFAULT_COLORS, ENVIRONMENT_CONFIG } from '@/stores/gameStore'

// Landing-page hero drawn with the same Canvas 2D hardware pieces the game uses,
// so the first thing players see matches the floor they get. The static scene is
// baked once per size; each frame only adds LEDs, traffic packets and earnings.

const TILE_W = 64
const TILE_H = 32
/** Scene window in game units (the canvas keeps this aspect ratio) */
const VIEW = { x: -150, y: -118, w: 320, h: 252 }
const STYLE = HARDWARE_STYLES.neon

const SERVER = DEFAULT_COLORS.server.top
const LEAF = DEFAULT_COLORS.leaf_switch.top
const SPINE_COLOR = DEFAULT_COLORS.spine_switch.top
const GPU = 0xff44ff
const ENV = parseInt(ENVIRONMENT_CONFIG.production.color.replace('#', ''), 16)

function tile(col: number, row: number): Pt {
  return [(col - row) * (TILE_W / 2), (col + row) * (TILE_H / 2)]
}

/** Art origin for a tile, matching DataCenterScene's placement (tile top vertex + half a tile) */
function tileOrigin(col: number, row: number): Pt {
  const [x, y] = tile(col, row)
  return [x, y + TILE_H / 2]
}

interface HeroCabinet {
  col: number
  row: number
  spec: CabinetArtSpec
}

const cab = (col: number, row: number, servers: number, overrides: Partial<CabinetArtSpec> = {}): HeroCabinet => ({
  col,
  row,
  spec: {
    servers,
    leaf: true,
    facing: row === 0 ? 'north' : 'south',
    density: 'standard',
    envColor: ENV,
    serverColor: SERVER,
    leafColor: LEAF,
    powerOn: true,
    liquidCooling: 'none',
    ...overrides,
  },
})

// Back row shows rack rears (fans, PSUs), front row shows bezels, plus one liquid-cooled GPU rack
const CABINETS: HeroCabinet[] = [
  cab(0, 0, 4),
  cab(1, 0, 3),
  cab(2, 0, 4),
  cab(0, 2, 4),
  cab(1, 2, 2),
  cab(2, 2, 4),
  cab(3, 2, 4, { density: 'high_density', serverColor: GPU, liquidCooling: 'direct_to_chip' }),
]

const SPINES: Pt[] = [[-30, -96], [42, -96]]
const CRAC: Pt = tileOrigin(3, 0)

interface Layout {
  leafTops: Pt[]
  spineFeet: Pt[]
  leds: { pt: Pt; color: number; leaf: boolean }[]
}

function buildLayout(): Layout {
  const leafTops: Pt[] = []
  const leds: Layout['leds'] = []
  for (const c of CABINETS) {
    const [ox, oy] = tileOrigin(c.col, c.row)
    const { bounds } = cabinetChassisArt(c.spec)
    leafTops.push([ox + (bounds.minX + bounds.maxX) / 2, oy + bounds.minY + 8])
    const anchors = cabinetLedAnchors(c.spec)
    for (const [x, y] of anchors.servers) leds.push({ pt: [ox + x, oy + y], color: c.spec.serverColor, leaf: false })
    for (const [x, y] of anchors.leaf) leds.push({ pt: [ox + x, oy + y], color: LEAF, leaf: true })
  }
  const { bounds } = spineArt({ color: SPINE_COLOR, powerOn: true })
  const spineFeet = SPINES.map(([x, y]): Pt => [x + (bounds.minX + bounds.maxX) / 2, y + bounds.maxY - 6])
  return { leafTops, spineFeet, leds }
}

function drawArt(ctx: CanvasRenderingContext2D, art: HardwareArt, [x, y]: Pt, s: number) {
  ctx.save()
  ctx.translate(x, y)
  art.draw({ ctx, s, style: STYLE })
  ctx.restore()
}

function drawFloor(ctx: CanvasRenderingContext2D) {
  ctx.save()
  ctx.strokeStyle = 'rgba(0, 255, 136, 0.12)'
  ctx.lineWidth = 0.6
  for (let c = -5; c <= 8; c++) {
    for (let r = -4; r <= 7; r++) {
      const [x, y] = tile(c, r)
      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x + TILE_W / 2, y + TILE_H / 2)
      ctx.lineTo(x, y + TILE_H)
      ctx.lineTo(x - TILE_W / 2, y + TILE_H / 2)
      ctx.closePath()
      ctx.stroke()
    }
  }
  // Fade the grid out toward the edges
  const cx = VIEW.x + VIEW.w / 2
  const cy = VIEW.y + VIEW.h * 0.6
  const fade = ctx.createRadialGradient(cx, cy, 0, cx, cy, VIEW.w * 0.55)
  fade.addColorStop(0, 'rgba(0,0,0,1)')
  fade.addColorStop(0.6, 'rgba(0,0,0,0.7)')
  fade.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.globalCompositeOperation = 'destination-in'
  ctx.fillStyle = fade
  ctx.fillRect(VIEW.x, VIEW.y, VIEW.w, VIEW.h)
  ctx.restore()
}

/** Bake the scene that never changes: floor, racks, spines, cooling unit */
function bakeStatic(width: number, height: number, scale: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return canvas
  ctx.setTransform(scale, 0, 0, scale, -VIEW.x * scale, -VIEW.y * scale)
  drawFloor(ctx)

  const pieces: { depth: number; draw: () => void }[] = CABINETS.map((c) => ({
    depth: c.col + c.row + c.col * 0.01,
    draw: () => {
      const origin = tileOrigin(c.col, c.row)
      drawArt(ctx, cabinetChassisArt(c.spec), origin, scale)
      drawArt(ctx, cabinetServersArt(c.spec), origin, scale)
      drawArt(ctx, cabinetLeafArt(c.spec), origin, scale)
    },
  }))
  pieces.push({ depth: 3, draw: () => drawArt(ctx, coolingArt({ type: 'crac', operational: true, color: 0x44aaff }), CRAC, scale) })
  pieces.sort((a, b) => a.depth - b.depth)
  for (const p of pieces) p.draw()

  for (const pt of SPINES) drawArt(ctx, spineArt({ color: SPINE_COLOR, powerOn: true }), pt, scale)
  return canvas
}

function ledSprite(color: number): HTMLCanvasElement {
  const size = 16
  const c = document.createElement('canvas')
  c.width = size
  c.height = size
  const ctx = c.getContext('2d')
  if (!ctx) return c
  const r = (color >> 16) & 0xff
  const g = (color >> 8) & 0xff
  const b = color & 0xff
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.25, `rgba(${r},${g},${b},1)`)
  grad.addColorStop(1, `rgba(${r},${g},${b},0)`)
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)
  return c
}

interface Earning {
  start: number
  pt: Pt
}

export function LandingHero() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!wrap || !canvas || !ctx) return

    const layout = buildLayout()
    const sprites = new Map<number, HTMLCanvasElement>()
    const sprite = (color: number) => {
      let s = sprites.get(color)
      if (!s) sprites.set(color, (s = ledSprite(color)))
      return s
    }
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let baked: HTMLCanvasElement | null = null
    let scale = 1
    let raf = 0
    const earnings: Earning[] = []
    let nextEarning = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const cssW = wrap.clientWidth
      const cssH = (cssW * VIEW.h) / VIEW.w
      canvas.style.height = `${cssH}px`
      canvas.width = Math.round(cssW * dpr)
      canvas.height = Math.round(cssH * dpr)
      scale = canvas.width / VIEW.w
      baked = bakeStatic(canvas.width, canvas.height, scale)
    }

    const frame = (now: number) => {
      const t = now / 1000
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      if (baked) ctx.drawImage(baked, 0, 0)
      ctx.setTransform(scale, 0, 0, scale, -VIEW.x * scale, -VIEW.y * scale)

      // Leaf-to-spine links with packets moving both ways
      ctx.lineWidth = 0.6
      layout.leafTops.forEach(([lx, ly], i) => {
        layout.spineFeet.forEach(([sx, sy], j) => {
          ctx.strokeStyle = 'rgba(0, 255, 136, 0.22)'
          ctx.beginPath()
          ctx.moveTo(lx, ly)
          ctx.lineTo(sx, sy)
          ctx.stroke()
          if (reduceMotion) return
          const up = (i + j) % 2 === 0
          const f = (t * 0.45 + i * 0.37 + j * 0.21) % 1
          const k = up ? f : 1 - f
          ctx.drawImage(sprite(SERVER), lx + (sx - lx) * k - 2.5, ly + (sy - ly) * k - 2.5, 5, 5)
        })
      })

      // Server LEDs breathe; leaf port LEDs flicker like link activity
      layout.leds.forEach(({ pt: [x, y], color, leaf }, i) => {
        let a: number
        if (reduceMotion) a = 0.8
        else if (leaf) {
          const n = Math.sin((Math.floor(t * 8 + i * 2.3) + i * 17) * 12.9898) * 43758.5453
          a = n - Math.floor(n) > 0.35 ? 0.95 : 0.15
        } else a = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * 2.2 + i * 1.3))
        const size = leaf ? 3.2 : 4.2
        ctx.globalAlpha = a
        ctx.drawImage(sprite(color), x - size / 2, y - size / 2, size, size)
      })
      ctx.globalAlpha = 1

      // Floating earnings over random racks
      if (!reduceMotion) {
        if (now >= nextEarning) {
          earnings.push({ start: now, pt: layout.leafTops[Math.floor(Math.random() * layout.leafTops.length)] })
          nextEarning = now + 900 + Math.random() * 700
        }
        ctx.font = 'bold 9px ui-monospace, SFMono-Regular, Menlo, monospace'
        ctx.textAlign = 'center'
        for (let i = earnings.length - 1; i >= 0; i--) {
          const p = (now - earnings[i].start) / 1600
          if (p >= 1) {
            earnings.splice(i, 1)
            continue
          }
          const [x, y] = earnings[i].pt
          ctx.globalAlpha = p < 0.15 ? p / 0.15 : 1 - (p - 0.15) / 0.85
          ctx.fillStyle = '#ffaa00'
          ctx.fillText('+$12', x, y - 6 - p * 22)
        }
        ctx.globalAlpha = 1
        raf = requestAnimationFrame(frame)
      }
    }

    resize()
    const observer = new ResizeObserver(() => {
      resize()
      if (reduceMotion) frame(performance.now())
    })
    observer.observe(wrap)
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      observer.disconnect()
    }
  }, [])

  return (
    <div ref={wrapRef} className="w-full max-w-xl mx-auto">
      <canvas
        ref={canvasRef}
        className="block w-full"
        role="img"
        aria-label="Isometric data center: server racks, a liquid-cooled GPU rack and spine switches with live network traffic"
      />
    </div>
  )
}
