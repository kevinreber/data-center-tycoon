// Isometric box geometry shared by every hardware piece.
//
// Convention matches DataCenterScene.drawIsoCube(): (x, y) is the BACK vertex
// of the box's base diamond, w/h are the diamond's screen width/height and d
// is the extruded height. The two visible side faces are:
//   left  — the +row ("south") face, spanning the left vertex to the front vertex
//   right — the +col ("east") face, spanning the front vertex to the right vertex

export type Pt = readonly [number, number]

export interface IsoBox {
  x: number
  y: number
  w: number
  h: number
  d: number
}

export interface Bounds {
  minX: number
  minY: number
  maxX: number
  maxY: number
}

export type Face = 'top' | 'left' | 'right'

export function box(x: number, y: number, w: number, h: number, d: number): IsoBox {
  return { x, y, w, h, d }
}

export function topFace(b: IsoBox): Pt[] {
  const hw = b.w / 2, hh = b.h / 2
  return [[b.x, b.y - b.d], [b.x + hw, b.y + hh - b.d], [b.x, b.y + b.h - b.d], [b.x - hw, b.y + hh - b.d]]
}

export function leftFace(b: IsoBox): Pt[] {
  const hw = b.w / 2, hh = b.h / 2
  return [[b.x - hw, b.y + hh - b.d], [b.x, b.y + b.h - b.d], [b.x, b.y + b.h], [b.x - hw, b.y + hh]]
}

export function rightFace(b: IsoBox): Pt[] {
  const hw = b.w / 2, hh = b.h / 2
  return [[b.x, b.y + b.h - b.d], [b.x + hw, b.y + hh - b.d], [b.x + hw, b.y + hh], [b.x, b.y + b.h]]
}

export function baseDiamond(b: IsoBox): Pt[] {
  const hw = b.w / 2, hh = b.h / 2
  return [[b.x, b.y], [b.x + hw, b.y + hh], [b.x, b.y + b.h], [b.x - hw, b.y + hh]]
}

/** Outer outline of the visible box (hexagon) */
export function silhouette(b: IsoBox): Pt[] {
  const hw = b.w / 2, hh = b.h / 2
  return [
    [b.x, b.y - b.d],
    [b.x + hw, b.y + hh - b.d],
    [b.x + hw, b.y + hh],
    [b.x, b.y + b.h],
    [b.x - hw, b.y + hh],
    [b.x - hw, b.y + hh - b.d],
  ]
}

export function boxBounds(b: IsoBox): Bounds {
  return { minX: b.x - b.w / 2, minY: b.y - b.d, maxX: b.x + b.w / 2, maxY: b.y + b.h }
}

export function unionBounds(...all: Bounds[]): Bounds {
  return {
    minX: Math.min(...all.map((a) => a.minX)),
    minY: Math.min(...all.map((a) => a.minY)),
    maxX: Math.max(...all.map((a) => a.maxX)),
    maxY: Math.max(...all.map((a) => a.maxY)),
  }
}

/** Length of a side-face edge (both side faces have the same width) */
export function faceWidth(b: IsoBox): number {
  return Math.hypot(b.w / 2, b.h / 2)
}

/**
 * Affine transform that maps face-local coordinates onto a face.
 * Side faces: s runs along the face (0..faceWidth), t runs DOWN from the top
 * edge (0..d), so rectangles drawn in (s, t) land as parallelograms on the face.
 * Top face: s runs from the back vertex toward the right vertex, t from the
 * back vertex toward the left vertex (both 0..faceWidth).
 * Returned as canvas transform arguments [a, b, c, d, e, f].
 */
export function faceTransform(bx: IsoBox, face: Face): [number, number, number, number, number, number] {
  const hw = bx.w / 2, hh = bx.h / 2
  const L = faceWidth(bx)
  const ux = hw / L, uy = hh / L
  switch (face) {
    case 'left':
      return [ux, uy, 0, 1, bx.x - hw, bx.y + hh - bx.d]
    case 'right':
      return [ux, -uy, 0, 1, bx.x, bx.y + bx.h - bx.d]
    case 'top':
      return [ux, uy, -ux, uy, bx.x, bx.y - bx.d]
  }
}

/** Map a face-local point to box-local screen coordinates (same math as faceTransform) */
export function facePoint(bx: IsoBox, face: Face, s: number, t: number): Pt {
  const [a, b, c, d, e, f] = faceTransform(bx, face)
  return [a * s + c * t + e, b * s + d * t + f]
}

export function pathPoly(ctx: CanvasRenderingContext2D, pts: readonly Pt[]) {
  ctx.beginPath()
  ctx.moveTo(pts[0][0], pts[0][1])
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1])
  ctx.closePath()
}

/** Run `fn` with the context transformed into a face's local coordinate space */
export function onFace(ctx: CanvasRenderingContext2D, bx: IsoBox, face: Face, fn: (width: number, height: number) => void) {
  ctx.save()
  const [a, b, c, d, e, f] = faceTransform(bx, face)
  ctx.transform(a, b, c, d, e, f)
  // Clip to the face so detail never bleeds over an edge
  ctx.beginPath()
  const L = faceWidth(bx)
  const height = face === 'top' ? L : bx.d
  ctx.rect(0, 0, L, height)
  ctx.clip()
  fn(L, height)
  ctx.restore()
}
