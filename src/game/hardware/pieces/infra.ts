import type { DrawCtx, HardwareArt } from '../draw'
import { drawBox, faceGradient, glowStroke, strokePoly, tintBox } from '../draw'
import type { IsoBox, Pt } from '../iso'
import { box, boxBounds, facePoint, faceWidth, onFace, topFace } from '../iso'
import type { ChassisPalette, HardwareStyle } from '../styles'
import { hexKey, rgba, shade } from '../styles'
import { dot, fan, hazard, hline, rect, vline } from './detail'
import { CHILLER, COOLING, IB_SWITCH, PDU, SPINE } from './dimensions'

/** Chassis palette tinted toward an accent color (dark in neon, pale in blueprint) */
function tinted(style: HardwareStyle, color: number, strength = 0.35): ChassisPalette {
  const neon = style.theme === 'neon'
  const t = (c: number, a: number) => rgba(shade(c, a))
  if (neon) {
    const base = shade(color, -1 + strength)
    return {
      top: { from: t(base, 0.18), to: t(base, 0.05) },
      left: { from: t(base, -0.15), to: t(base, -0.35) },
      right: { from: t(base, -0.3), to: t(base, -0.5) },
    }
  }
  const base = shade(color, 1 - strength * 0.7)
  return {
    top: { from: t(base, 0.4), to: t(base, 0.2) },
    left: { from: t(base, 0), to: t(base, -0.08) },
    right: { from: t(base, 0.15), to: t(base, 0.05) },
  }
}

/** Box-local bounds with extra headroom for glows above the box */
function boundsWithGlow(b: IsoBox, extra = 3) {
  const bb = boxBounds(b)
  return { minX: bb.minX - extra, minY: bb.minY - extra, maxX: bb.maxX + extra, maxY: bb.maxY + extra }
}

function topFrontEdges(b: IsoBox): Pt[] {
  const t = topFace(b)
  return [t[3], t[2], t[1]]
}

function topBackEdges(b: IsoBox): Pt[] {
  const t = topFace(b)
  return [t[3], t[0], t[1]]
}

// ── Spine switch ──────────────────────────────────────────

export interface SpineArtSpec {
  color: number
  powerOn: boolean
}

const SPINE_BOX = box(0, 0, SPINE.w, SPINE.h, SPINE.depth)

/** Modular spine chassis: line cards with port rows, fan trays, PSUs */
export function spineArt(spec: SpineArtSpec): HardwareArt {
  const b = SPINE_BOX
  return {
    key: ['spine', spec.powerOn ? 'on' : 'off', hexKey(spec.color)].join(':'),
    bounds: boundsWithGlow(b),
    draw: (dc) => {
      const { ctx, style } = dc
      const c = spec.color
      const on = spec.powerOn
      const palette = tinted(style, c, 0.18)
      drawBox(dc, b, palette, { outline: false })
      onFace(ctx, b, 'left', (w, h) => {
        rect(ctx, 0.8, 0.8, w - 1.6, h - 1.6, style.recess)
        // Supervisor strip
        rect(ctx, 1.4, 1.3, w - 2.8, 1.6, faceGradient(ctx, 0, 1.3, 0, 2.9, style.bezel))
        dot(ctx, 3, 2.1, 0.5, rgba(c, on ? 0.9 : 0.2))
        dot(ctx, 4.6, 2.1, 0.5, rgba(0x44ff66, on ? 0.8 : 0.2))
        // Three line cards with port rows
        for (let k = 0; k < 3; k++) {
          const t = 3.5 + k * 3.4
          rect(ctx, 1.4, t, w - 2.8, 2.9, faceGradient(ctx, 0, t, 0, t + 2.9, style.bezel))
          rect(ctx, 1.6, t + 0.3, 0.8, 2.3, rgba(c, on ? 0.85 : 0.25))
          for (let p = 0; p < 8; p++) rect(ctx, 3.2 + p * 2.7, t + 0.8, 1.8, 1.3, style.recess)
        }
        // Fan tray vents
        for (let s = 2; s < w - 2; s += 1.4) vline(ctx, s, h - 2.6, h - 1.2, style.detail, 0.5)
      })
      onFace(ctx, b, 'right', (w, h) => {
        fan(ctx, w * 0.27, h * 0.5, 4.2, style.detail, style.recess)
        fan(ctx, w * 0.6, h * 0.5, 4.2, style.detail, style.recess)
        rect(ctx, w * 0.82, 2, w * 0.12, h - 4, style.recess)
        dot(ctx, w * 0.88, 3.4, 0.5, rgba(0x44ff66, on ? 0.8 : 0.2))
      })
      onFace(ctx, b, 'top', (w) => {
        for (let r = 0; r < 4; r++) hline(ctx, w * 0.25, w * 0.75, w * 0.3 + r * 2.4, style.detail, 0.7)
      })
      if (!on) tintBox(ctx, b, style.offTint)
      drawBox(dc, b, palette, { shadow: false, faces: false })
      glowStroke(dc, topFrontEdges(b), rgba(c, on ? 0.85 : 0.2), 1, 4)
    },
  }
}

// ── InfiniBand switch ─────────────────────────────────────

export interface IBSwitchArtSpec {
  type: 'ib_leaf' | 'ib_spine'
  operational: boolean
}

const IB_COLORS = { ib_leaf: 0xaa44ff, ib_spine: 0xdd66ff } as const
const IB_BOX = box(0, 0, IB_SWITCH.w, IB_SWITCH.h, IB_SWITCH.depth)

/** Small 1U InfiniBand switch with a rail-colored port strip */
export function ibSwitchArt(spec: IBSwitchArtSpec): HardwareArt {
  const b = IB_BOX
  return {
    key: ['ib', spec.type, spec.operational ? 'ok' : 'down'].join(':'),
    bounds: boundsWithGlow(b, 2),
    draw: (dc) => {
      const { ctx, style } = dc
      const c = IB_COLORS[spec.type]
      const palette = tinted(style, c, 0.3)
      drawBox(dc, b, palette, { outline: false })
      onFace(ctx, b, 'left', (w) => {
        rect(ctx, 0.6, 1.4, w - 1.2, 1.9, style.recess)
        for (let p = 0; p < 4; p++) dot(ctx, 1.5 + p * 1.6, 2.35, 0.35, rgba(c, spec.operational ? 0.95 : 0.25))
      })
      if (!spec.operational) tintBox(ctx, b, style.failTint)
      drawBox(dc, b, palette, { shadow: false, faces: false })
      glowStroke(dc, topBackEdges(b), rgba(c, spec.operational ? 0.9 : 0.3), 0.7, 2.5)
    },
  }
}

// ── PDU ───────────────────────────────────────────────────

export interface PduArtSpec {
  overloaded: boolean
}

const PDU_BOX = box(0, 0, PDU.w, PDU.h, PDU.depth)

/** Floor PDU: amber chassis, outlet row, breaker light; hazard stripes when overloaded */
export function pduArt(spec: PduArtSpec): HardwareArt {
  const b = PDU_BOX
  return {
    key: ['pdu', spec.overloaded ? 'over' : 'ok'].join(':'),
    bounds: boundsWithGlow(b),
    draw: (dc) => {
      const { ctx, style } = dc
      const accent = spec.overloaded ? 0xff4444 : 0xffaa00
      const palette = tinted(style, accent, 0.3)
      drawBox(dc, b, palette, { outline: false })
      onFace(ctx, b, 'left', (w, h) => {
        for (let k = 0; k < 4; k++) {
          rect(ctx, 1.2 + k * 2.8, 1.4, 2.1, h - 2.8, style.recess)
          dot(ctx, 1.85 + k * 2.8, 2.6, 0.3, style.detail)
          dot(ctx, 2.65 + k * 2.8, 2.6, 0.3, style.detail)
        }
        dot(ctx, w - 1.6, h / 2, 0.7, rgba(accent, 0.95))
      })
      onFace(ctx, b, 'right', (w, h) => {
        rect(ctx, 1.5, h / 2 - 0.8, w - 3, 1.6, style.recess)
      })
      onFace(ctx, b, 'top', (w) => {
        if (spec.overloaded) hazard(ctx, w * 0.15, w * 0.15, w * 0.7, w * 0.7, rgba(0x220000), rgba(0xff3333, 0.85), 1.4)
        else rect(ctx, w * 0.2, w * 0.35, w * 0.6, w * 0.3, rgba(accent, style.theme === 'neon' ? 0.55 : 0.7))
      })
      drawBox(dc, b, palette, { shadow: false, faces: false })
      glowStroke(dc, topFrontEdges(b), rgba(accent, spec.overloaded ? 0.95 : 0.6), 0.8, spec.overloaded ? 5 : 2.5)
    },
  }
}

// ── Cooling units ─────────────────────────────────────────

export type CoolingArtType = 'fan_tray' | 'crac' | 'crah' | 'immersion_pod'

export interface CoolingArtSpec {
  type: CoolingArtType
  operational: boolean
  color: number
}

/** Height per unit type: floor-standing air handlers are taller than fan trays and tanks */
export const COOLING_DEPTH: Record<CoolingArtType, number> = {
  fan_tray: 6,
  crac: COOLING.depth + 4,
  crah: COOLING.depth + 4,
  immersion_pod: COOLING.depth - 1,
}

export function coolingBox(type: CoolingArtType): IsoBox {
  return box(0, 0, COOLING.w, COOLING.h, COOLING_DEPTH[type])
}

/** Box-local center of the top-face fan, for the live spinning-blade overlay */
export function coolingFanAnchor(type: CoolingArtType): Pt | null {
  if (type === 'immersion_pod') return null
  const b = coolingBox(type)
  const L = faceWidth(b)
  return facePoint(b, 'top', L / 2, L / 2)
}

export function coolingArt(spec: CoolingArtSpec): HardwareArt {
  const b = coolingBox(spec.type)
  return {
    key: ['cool', spec.type, spec.operational ? 'ok' : 'fail', hexKey(spec.color)].join(':'),
    bounds: boundsWithGlow(b),
    draw: (dc) => {
      const { ctx, style } = dc
      const ok = spec.operational
      const c = ok ? spec.color : 0xff3333
      const palette = tinted(style, c, 0.28)
      drawBox(dc, b, palette, { outline: false })
      switch (spec.type) {
        case 'fan_tray':
          drawFanTray(dc, b, c)
          break
        case 'crac':
        case 'crah':
          drawAirHandler(dc, b, c, spec.type === 'crah')
          break
        case 'immersion_pod':
          drawImmersionPod(dc, b, c, ok)
          break
      }
      if (!ok) tintBox(ctx, b, style.failTint)
      drawBox(dc, b, palette, { shadow: false, faces: false })
      glowStroke(dc, topFrontEdges(b), rgba(c, ok ? 0.7 : 0.5), 0.8, 3)
    },
  }
}

function drawFanTray(dc: DrawCtx, b: IsoBox, c: number) {
  const { ctx, style } = dc
  onFace(ctx, b, 'top', (w) => {
    fan(ctx, w * 0.3, w * 0.5, w * 0.2, rgba(c, 0.8), style.recess)
    fan(ctx, w * 0.72, w * 0.5, w * 0.2, rgba(c, 0.8), style.recess)
  })
  onFace(ctx, b, 'left', (w, h) => {
    for (let s = 1.5; s < w - 1; s += 1.3) vline(ctx, s, 1.2, h - 1.2, style.detail, 0.5)
  })
}

function drawAirHandler(dc: DrawCtx, b: IsoBox, c: number, chilledWater: boolean) {
  const { ctx, style } = dc
  onFace(ctx, b, 'left', (w, h) => {
    // Control panel with a small status screen
    rect(ctx, 1.2, 1.2, w - 2.4, 2.6, style.recess)
    rect(ctx, 1.8, 1.7, w * 0.35, 1.6, rgba(c, 0.75))
    // Return-air louvers
    rect(ctx, 1.2, 4.6, w - 2.4, h - 5.8, style.recess)
    if (chilledWater) for (let s = 2; s < w - 1.6; s += 1.2) vline(ctx, s, 5, h - 1.6, style.detail, 0.6)
    else for (let t = 5.2; t < h - 1.4; t += 1.1) hline(ctx, 1.6, w - 1.6, t, style.detail, 0.6)
  })
  onFace(ctx, b, 'right', (w, h) => {
    for (let t = 2; t < h - 1.5; t += 1.4) hline(ctx, 1.5, w - 1.5, t, style.detail, 0.5)
  })
  onFace(ctx, b, 'top', (w) => {
    fan(ctx, w * 0.5, w * 0.5, w * 0.28, rgba(c, 0.8), style.recess)
    if (chilledWater) {
      // Chilled-water supply and return stubs
      dot(ctx, w * 0.16, w * 0.16, 1.2, rgba(0x3399ff))
      dot(ctx, w * 0.84, w * 0.16, 1.2, rgba(0xff5544))
    }
  })
}

function drawImmersionPod(dc: DrawCtx, b: IsoBox, c: number, ok: boolean) {
  const { ctx, style } = dc
  onFace(ctx, b, 'top', (w) => {
    // Dielectric fluid surface inside the tank rim
    rect(ctx, 1.4, 1.4, w - 2.8, w - 2.8, faceGradient(ctx, 0, 0, w, w, { from: rgba(c, ok ? 0.85 : 0.4), to: rgba(shade(c, -0.4), ok ? 0.9 : 0.4) }))
    if (ok) {
      dot(ctx, w * 0.35, w * 0.4, 0.5, 'rgba(255, 255, 255, 0.7)')
      dot(ctx, w * 0.6, w * 0.62, 0.4, 'rgba(255, 255, 255, 0.6)')
      dot(ctx, w * 0.7, w * 0.3, 0.35, 'rgba(255, 255, 255, 0.5)')
    }
  })
  onFace(ctx, b, 'left', (w, h) => {
    // Fluid level window
    rect(ctx, w * 0.7, 1, 1.4, h - 2, style.recess)
    rect(ctx, w * 0.7, h * 0.4, 1.4, h * 0.6 - 1, rgba(c, ok ? 0.8 : 0.3))
    hline(ctx, 1, w * 0.6, h / 2, style.detail, 0.6)
  })
}

// ── Chiller plant ─────────────────────────────────────────

export interface ChillerArtSpec {
  tier: 'basic' | 'advanced'
  operational: boolean
}

const CHILLER_BOX = box(0, 0, CHILLER.w, CHILLER.h, CHILLER.depth)

/** Packaged chiller: condenser fans on the roof, louvered sides, supply/return pipe stubs */
export function chillerArt(spec: ChillerArtSpec): HardwareArt {
  const b = CHILLER_BOX
  return {
    key: ['chiller', spec.tier, spec.operational ? 'ok' : 'fail'].join(':'),
    bounds: boundsWithGlow(b),
    draw: (dc) => {
      const { ctx, style } = dc
      const ok = spec.operational
      const c = ok ? 0x00aacc : 0xff3333
      const palette = tinted(style, c, 0.3)
      drawBox(dc, b, palette, { outline: false })
      const fans = spec.tier === 'advanced' ? 3 : 2
      onFace(ctx, b, 'top', (w) => {
        for (let k = 0; k < fans; k++) {
          const s = w * ((k + 1) / (fans + 1))
          fan(ctx, s, w * 0.5, w * (fans === 3 ? 0.14 : 0.18), rgba(c, 0.85), style.recess)
        }
      })
      onFace(ctx, b, 'left', (w, h) => {
        rect(ctx, 1.2, 1.4, w - 2.4, h - 2.8, style.recess)
        for (let t = 2; t < h - 1.6; t += 1.2) hline(ctx, 1.6, w - 1.6, t, style.detail, 0.6)
        if (spec.tier === 'advanced') rect(ctx, 1.2, h - 2.2, w - 2.4, 0.8, rgba(c, ok ? 0.9 : 0.3))
      })
      onFace(ctx, b, 'right', (w, h) => {
        dot(ctx, w * 0.3, h * 0.55, 1.6, rgba(0x3399ff, ok ? 0.95 : 0.4))
        dot(ctx, w * 0.55, h * 0.55, 1.6, rgba(0xff5544, ok ? 0.95 : 0.4))
        rect(ctx, w * 0.75, h * 0.3, w * 0.14, h * 0.4, style.recess)
        dot(ctx, w * 0.82, h * 0.5, 0.7, rgba(ok ? 0x44ff66 : 0xff3333, 0.9))
      })
      if (!ok) tintBox(ctx, b, style.failTint)
      drawBox(dc, b, palette, { shadow: false, faces: false })
      glowStroke(dc, topFrontEdges(b), rgba(c, ok ? 0.75 : 0.5), 0.9, 3.5)
    },
  }
}

// ── Cable tray ────────────────────────────────────────────

const TRAY_HALF_W = 28
const TRAY_HALF_H = 14

/** Floor-level ladder tray: two rails with rungs, running along the tile's column axis */
export function cableTrayArt(): HardwareArt {
  return {
    key: 'tray',
    bounds: { minX: -TRAY_HALF_W, minY: -TRAY_HALF_H, maxX: TRAY_HALF_W, maxY: TRAY_HALF_H },
    draw: (dc) => {
      const { ctx, style } = dc
      const c = 0x8866cc
      // Column axis runs toward the right vertex (+2, +1); the row axis toward the left vertex (-2, +1)
      const along = (k: number): Pt => [k * 2, k]
      const across = (k: number): Pt => [-k * 2, k]
      const p = (a: number, b: number): Pt => [along(a)[0] + across(b)[0], along(a)[1] + across(b)[1]]
      const len = 11
      const half = 3.2
      for (const off of [-half, half]) {
        const rail: Pt[] = [p(-len, off), p(len, off)]
        strokePoly(ctx, rail.map(([x, y]) => [x, y + 0.9] as Pt), rgba(shade(c, -0.6), 0.9), 1.6, false)
        strokePoly(ctx, rail, rgba(c, 0.95), 1, false)
      }
      for (let a = -len + 1.5; a <= len - 1.5; a += 2.8) {
        strokePoly(ctx, [p(a, -half), p(a, half)], rgba(shade(c, 0.1), 0.75), 0.7, false)
      }
      // A cable bundle resting in the tray
      strokePoly(ctx, [p(-len, 0.6), p(len, 0.6)], style.theme === 'neon' ? 'rgba(80, 200, 255, 0.55)' : 'rgba(40, 60, 140, 0.5)', 0.9, false)
    },
  }
}
