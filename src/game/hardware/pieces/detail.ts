// Small drawing helpers for face-local detail (vents, ports, fans, LEDs).

export function rect(ctx: CanvasRenderingContext2D, s: number, t: number, w: number, h: number, fill: string | CanvasGradient) {
  ctx.fillStyle = fill
  ctx.fillRect(s, t, w, h)
}

export function hline(ctx: CanvasRenderingContext2D, s0: number, s1: number, t: number, color: string, width = 0.5) {
  ctx.beginPath()
  ctx.moveTo(s0, t)
  ctx.lineTo(s1, t)
  ctx.strokeStyle = color
  ctx.lineWidth = width
  ctx.stroke()
}

export function vline(ctx: CanvasRenderingContext2D, s: number, t0: number, t1: number, color: string, width = 0.5) {
  ctx.beginPath()
  ctx.moveTo(s, t0)
  ctx.lineTo(s, t1)
  ctx.strokeStyle = color
  ctx.lineWidth = width
  ctx.stroke()
}

export function dot(ctx: CanvasRenderingContext2D, s: number, t: number, r: number, color: string) {
  ctx.beginPath()
  ctx.arc(s, t, r, 0, Math.PI * 2)
  ctx.fillStyle = color
  ctx.fill()
}

/** Round fan: dark hub, rim and a blade cross so it still reads at small sizes */
export function fan(ctx: CanvasRenderingContext2D, s: number, t: number, r: number, rim: string, hub: string) {
  dot(ctx, s, t, r, hub)
  ctx.beginPath()
  ctx.arc(s, t, r, 0, Math.PI * 2)
  ctx.strokeStyle = rim
  ctx.lineWidth = 0.5
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(s - r * 0.7, t)
  ctx.lineTo(s + r * 0.7, t)
  ctx.moveTo(s, t - r * 0.7)
  ctx.lineTo(s, t + r * 0.7)
  ctx.stroke()
}

/** Diagonal hazard stripes filling a rectangle */
export function hazard(ctx: CanvasRenderingContext2D, s: number, t: number, w: number, h: number, a: string, b: string, step = 2) {
  ctx.save()
  ctx.beginPath()
  ctx.rect(s, t, w, h)
  ctx.clip()
  rect(ctx, s, t, w, h, a)
  ctx.fillStyle = b
  for (let x = s - h; x < s + w; x += step * 2) {
    ctx.beginPath()
    ctx.moveTo(x, t + h)
    ctx.lineTo(x + step, t + h)
    ctx.lineTo(x + step + h, t)
    ctx.lineTo(x + h, t)
    ctx.closePath()
    ctx.fill()
  }
  ctx.restore()
}
