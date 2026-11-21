import type { Bounds, IsoBox, Pt } from './iso'
import { baseDiamond, leftFace, pathPoly, rightFace, silhouette, topFace } from './iso'
import type { ChassisPalette, FaceShade, HardwareStyle } from './styles'

/** Everything a piece needs to draw itself into a texture canvas */
export interface DrawCtx {
  ctx: CanvasRenderingContext2D
  /** Texture resolution multiplier (shadowBlur is in device pixels, so it needs this) */
  s: number
  style: HardwareStyle
}

/** A drawable hardware texture, described in box-local coordinates */
export interface HardwareArt {
  /** Unique per visual variant; theme and scale are appended by the cache */
  key: string
  bounds: Bounds
  draw: (dc: DrawCtx) => void
}

function faceGradient(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number, fill: FaceShade) {
  const g = ctx.createLinearGradient(x0, y0, x1, y1)
  g.addColorStop(0, fill.from)
  g.addColorStop(1, fill.to)
  return g
}

export function fillPoly(ctx: CanvasRenderingContext2D, pts: readonly Pt[], fill: string | CanvasGradient) {
  pathPoly(ctx, pts)
  ctx.fillStyle = fill
  ctx.fill()
}

export function strokePoly(ctx: CanvasRenderingContext2D, pts: readonly Pt[], color: string, width: number, closed = true) {
  ctx.beginPath()
  ctx.moveTo(pts[0][0], pts[0][1])
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1])
  if (closed) ctx.closePath()
  ctx.strokeStyle = color
  ctx.lineWidth = width
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'
  ctx.stroke()
}

/** Soft blurred shadow where the box meets the floor (light comes from the upper left) */
export function contactShadow(dc: DrawCtx, b: IsoBox, spread = 2) {
  const { ctx, s, style } = dc
  const d = baseDiamond(b)
  const grown: Pt[] = [
    [d[0][0] + 2, d[0][1] - spread / 2 + 1.5],
    [d[1][0] + spread + 2, d[1][1] + 1.5],
    [d[2][0] + 2, d[2][1] + spread / 2 + 1.5],
    [d[3][0] - spread + 2, d[3][1] + 1.5],
  ]
  ctx.save()
  ctx.shadowColor = style.shadow
  ctx.shadowBlur = style.shadowBlur * s
  fillPoly(ctx, grown, style.shadow)
  ctx.restore()
}

export interface BoxOptions {
  shadow?: boolean
  /** Fill the three faces (false draws only rim / outline, e.g. over detail) */
  faces?: boolean
  outline?: boolean
  rim?: boolean
}

/** Three gradient-shaded faces with outline and rim light — the base of every piece */
export function drawBox(dc: DrawCtx, b: IsoBox, palette: ChassisPalette, opts: BoxOptions = {}) {
  const { ctx, style } = dc
  const { shadow = true, faces = true, outline = true, rim = true } = opts
  if (shadow) contactShadow(dc, b)

  if (faces) {
    const hw = b.w / 2
    fillPoly(ctx, topFace(b), faceGradient(ctx, b.x - hw, b.y - b.d, b.x + hw, b.y + b.h - b.d, palette.top))
    fillPoly(ctx, leftFace(b), faceGradient(ctx, 0, b.y - b.d, 0, b.y + b.h, palette.left))
    fillPoly(ctx, rightFace(b), faceGradient(ctx, 0, b.y - b.d, 0, b.y + b.h, palette.right))
  }

  if (rim) {
    const t = topFace(b)
    strokePoly(ctx, [t[3], t[2], t[1]], style.rim, 0.8, false)
  }
  if (outline) outlineBox(dc, b)
}

export function outlineBox(dc: DrawCtx, b: IsoBox) {
  const { ctx, style } = dc
  strokePoly(ctx, silhouette(b), style.outline, style.outlineWidth)
  // Front vertical edge separates the two side faces
  const hh = b.h / 2
  strokePoly(ctx, [[b.x, b.y + b.h - b.d], [b.x, b.y + b.h]], style.outline, style.outlineWidth * 0.6, false)
  // Inner edges of the top face
  strokePoly(ctx, [[b.x - b.w / 2, b.y + hh - b.d], [b.x, b.y + b.h - b.d], [b.x + b.w / 2, b.y + hh - b.d]], style.outline, style.outlineWidth * 0.6, false)
}

/** Colored halo stroke along a path (for accent strips and alerting edges) */
export function glowStroke(dc: DrawCtx, pts: readonly Pt[], color: string, width: number, blur: number, closed = false) {
  const { ctx, s, style } = dc
  if (style.glow <= 0) {
    strokePoly(ctx, pts, color, width, closed)
    return
  }
  ctx.save()
  ctx.shadowColor = color
  ctx.shadowBlur = blur * s * style.glow
  strokePoly(ctx, pts, color, width, closed)
  ctx.restore()
}

/** Darken or tint the whole visible box (powered off / failed) */
export function tintBox(ctx: CanvasRenderingContext2D, b: IsoBox, color: string) {
  fillPoly(ctx, silhouette(b), color)
}

export { faceGradient }
