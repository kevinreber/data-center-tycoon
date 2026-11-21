import type { DrawCtx, HardwareArt } from '../draw'
import { drawBox, faceGradient, glowStroke, strokePoly, tintBox } from '../draw'
import type { IsoBox, Pt } from '../iso'
import { box, boxBounds, facePoint, onFace, topFace } from '../iso'
import { hexKey, rgba, shade } from '../styles'
import { CAB } from './dimensions'
import { dot, fan, hline, rect, vline } from './detail'

export type LiquidCooling = 'none' | 'rear_door_hx' | 'direct_to_chip' | 'single_phase_immersion'

export interface CabinetArtSpec {
  servers: number
  leaf: boolean
  facing: 'north' | 'south' | 'east' | 'west'
  density: 'standard' | 'high_density' | 'extreme_density'
  envColor: number
  serverColor: number
  leafColor: number
  powerOn: boolean
  liquidCooling: LiquidCooling
}

const ENCLOSURE: IsoBox = box(0, 0, CAB.w, CAB.h, CAB.depth)
const FACE_W = Math.hypot(CAB.w / 2, CAB.h / 2)
// Glow from GPU accents and hoses can spill slightly past the enclosure
const BOUNDS = { ...boxBounds(ENCLOSURE), minY: -CAB.depth - 3 }

// Rack layout on the front/rear face, in face-local units (t runs down from the top edge)
const RAIL = 2.2
const BAY_L = RAIL + 1.2
const BAY_R = FACE_W - RAIL - 1.2
const LEAF_H = 6
const SERVER_H = CAB.serverDepth - 0.6
const LEAF_PORTS = 5
/** z (height above floor) of the bottom of server slot i — same as the classic stack */
const slotZ = (i: number) => CAB.baseDepth + CAB.gap + i * (CAB.serverDepth + CAB.gap)
const LEAF_Z = slotZ(CAB.maxServers)
const zToT = (z: number) => CAB.depth - z

/** The front of the rack faces the viewer's left face when the cabinet faces south */
const showsFront = (spec: CabinetArtSpec) => spec.facing !== 'north'
const isGpu = (spec: CabinetArtSpec) => spec.density !== 'standard'
const serverCount = (spec: CabinetArtSpec) => Math.max(0, Math.min(spec.servers, CAB.maxServers))
const power = (spec: CabinetArtSpec) => (spec.powerOn ? 'on' : 'off')
const view = (spec: CabinetArtSpec) => (showsFront(spec) ? 'F' : 'R')

// Face-local LED positions, shared by the baked (dim) LEDs and the live blink overlay
const serverLed = (i: number, front: boolean): [number, number] =>
  [front ? BAY_R - 2.2 : BAY_L + 2.2, zToT(slotZ(i) + CAB.serverDepth) + SERVER_H / 2]
const leafPortLed = (p: number): [number, number] => [BAY_L + 1.75 + p * 2.2, zToT(LEAF_Z + LEAF_H) + 2.4]
const leafRearLed = (): [number, number] => [BAY_L + 2.3, zToT(LEAF_Z + LEAF_H) + LEAF_H / 2]

/** Box-local outline of server slot i's front panel (for fault highlights drawn over the art) */
export function cabinetServerQuad(i: number): Pt[] {
  const t0 = zToT(slotZ(i) + CAB.serverDepth)
  const t1 = t0 + SERVER_H
  return [
    facePoint(ENCLOSURE, 'left', BAY_L, t0),
    facePoint(ENCLOSURE, 'left', BAY_R, t0),
    facePoint(ENCLOSURE, 'left', BAY_R, t1),
    facePoint(ENCLOSURE, 'left', BAY_L, t1),
  ]
}

/** Box-local LED positions for live blinking overlays (one per server, link lights on the leaf) */
export function cabinetLedAnchors(spec: Pick<CabinetArtSpec, 'servers' | 'leaf' | 'facing'>): { servers: Pt[]; leaf: Pt[] } {
  const n = Math.max(0, Math.min(spec.servers, CAB.maxServers))
  const front = spec.facing !== 'north'
  const servers: Pt[] = []
  for (let i = 0; i < n; i++) servers.push(facePoint(ENCLOSURE, 'left', ...serverLed(i, front)))
  const leaf: Pt[] = []
  if (spec.leaf) {
    if (front) for (let p = 0; p < LEAF_PORTS; p++) leaf.push(facePoint(ENCLOSURE, 'left', ...leafPortLed(p)))
    else leaf.push(facePoint(ENCLOSURE, 'left', ...leafRearLed()))
  }
  return { servers, leaf }
}

// ── Chassis ───────────────────────────────────────────────

function drawRackFace(dc: DrawCtx, spec: CabinetArtSpec) {
  const { ctx, style } = dc
  const palette = isGpu(spec) ? style.gpuChassis : style.chassis
  onFace(ctx, ENCLOSURE, 'left', (w, h) => {
    // Rack interior
    rect(ctx, RAIL, zToT(CAB.depth - 0.8), w - RAIL * 2, h - 0.8 - CAB.baseDepth, style.recess)
    // Vertical rails with mounting holes
    const railFill = faceGradient(ctx, 0, 0, 0, h, palette.left)
    rect(ctx, 0, 0, RAIL, h, railFill)
    rect(ctx, w - RAIL, 0, RAIL, h, railFill)
    for (let t = 2; t < h - CAB.baseDepth; t += 2.75) {
      dot(ctx, RAIL / 2, t, 0.28, style.detail)
      dot(ctx, w - RAIL / 2, t, 0.28, style.detail)
    }
    // Blanking panels in every slot; installed equipment is drawn over them
    for (let i = 0; i < CAB.maxServers; i++) {
      const t = zToT(slotZ(i) + CAB.serverDepth)
      rect(ctx, BAY_L, t, BAY_R - BAY_L, CAB.serverDepth, faceGradient(ctx, 0, t, 0, t + CAB.serverDepth, style.blank))
      hline(ctx, BAY_L + 1, BAY_R - 1, t + CAB.serverDepth / 2, style.detail)
    }
    const lt = zToT(LEAF_Z + LEAF_H)
    rect(ctx, BAY_L, lt, BAY_R - BAY_L, LEAF_H, faceGradient(ctx, 0, lt, 0, lt + LEAF_H, style.blank))
    // Kickplate with environment stripe
    rect(ctx, 0, h - CAB.baseDepth, w, CAB.baseDepth, faceGradient(ctx, 0, h - CAB.baseDepth, 0, h, palette.right))
    rect(ctx, 1, h - CAB.baseDepth + 1.2, w - 2, 1.1, rgba(spec.envColor, spec.powerOn ? 0.85 : 0.3))
    if (showsFront(spec)) {
      // Door handle on the right rail
      rect(ctx, w - RAIL + 0.5, h * 0.42, 1.2, 6, style.rim)
    }
  })
}

function drawSidePanel(dc: DrawCtx) {
  const { ctx, style } = dc
  onFace(ctx, ENCLOSURE, 'right', (w, h) => {
    // Two removable side panels
    const mid = (h - CAB.baseDepth) / 2
    ctx.strokeStyle = style.detail
    ctx.lineWidth = 0.6
    ctx.strokeRect(1.5, 1.5, w - 3, mid - 2)
    ctx.strokeRect(1.5, mid + 0.5, w - 3, mid - 2)
    // Vent slots near the top of each panel
    for (const t0 of [3.5, mid + 2.5]) {
      for (let k = 0; k < 3; k++) hline(ctx, w * 0.3, w * 0.7, t0 + k * 1.3, style.detail, 0.6)
    }
    hline(ctx, 0, w, h - CAB.baseDepth, style.detail, 0.6)
  })
}

function drawRoof(dc: DrawCtx) {
  const { ctx, style } = dc
  onFace(ctx, ENCLOSURE, 'top', (w) => {
    // Cable entry cut-out toward the back and a vent grid toward the front
    rect(ctx, w * 0.18, w * 0.18, w * 0.3, w * 0.22, style.recess)
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 4; c++) rect(ctx, w * 0.52 + c * 2.4, w * 0.5 + r * 2.4, 1.4, 1.4, style.detail)
    }
  })
}

function drawHoses(dc: DrawCtx, spec: CabinetArtSpec) {
  if (spec.liquidCooling === 'none') return
  const { ctx } = dc
  const supply = spec.liquidCooling === 'single_phase_immersion' ? 0x33ddff : 0x3399ff
  const ret = 0xff5544
  // Supply and return lines run up the side panel and over the roof
  ;[{ s: FACE_W * 0.32, c: supply }, { s: FACE_W * 0.5, c: ret }].forEach(({ s, c }) => {
    // The right face's top edge is the top face's s = FACE_W edge, with t = FACE_W - s,
    // so the hose turns onto the roof there and runs straight back toward the cable entry.
    const path: Pt[] = [
      facePoint(ENCLOSURE, 'right', s, CAB.depth - CAB.baseDepth - 1),
      facePoint(ENCLOSURE, 'right', s, 0),
      facePoint(ENCLOSURE, 'top', FACE_W * 0.55, FACE_W - s),
    ]
    strokePoly(ctx, path, rgba(shade(c, -0.5)), 2.2, false)
    glowStroke(dc, path, rgba(c, spec.powerOn ? 0.95 : 0.4), 1.2, 2)
  })
}

/** Rack enclosure: frame, rails, blanking panels, side panels, roof, hoses */
export function cabinetChassisArt(spec: CabinetArtSpec): HardwareArt {
  return {
    key: ['cab', spec.density, view(spec), power(spec), hexKey(spec.envColor), spec.liquidCooling].join(':'),
    bounds: BOUNDS,
    draw: (dc) => {
      const gpu = isGpu(spec)
      drawBox(dc, ENCLOSURE, gpu ? dc.style.gpuChassis : dc.style.chassis, { outline: false })
      drawRackFace(dc, spec)
      drawSidePanel(dc)
      drawRoof(dc)
      drawHoses(dc, spec)
      if (!spec.powerOn) tintBox(dc.ctx, ENCLOSURE, dc.style.offTint)
      drawBox(dc, ENCLOSURE, gpu ? dc.style.gpuChassis : dc.style.chassis, { shadow: false, rim: true, outline: true, faces: false })
      if (gpu) {
        const t = topFace(ENCLOSURE)
        glowStroke(dc, [t[3], t[0], t[1]], rgba(spec.serverColor, spec.powerOn ? 0.9 : 0.25), 1.4, 5)
      }
    },
  }
}

/** Whether this cabinet shows a door layer in front of its equipment */
export function cabinetHasDoor(spec: Pick<CabinetArtSpec, 'liquidCooling' | 'facing'>): boolean {
  return spec.liquidCooling === 'rear_door_hx' && spec.facing === 'north'
}

/** Rear-door heat exchanger: a coil grid hung over the back of the rack, in front of the servers */
export function cabinetDoorArt(spec: CabinetArtSpec): HardwareArt {
  return {
    key: ['door', 'hx', power(spec)].join(':'),
    bounds: BOUNDS,
    draw: (dc) => {
      const { ctx } = dc
      const coil = 0x3399ff
      onFace(ctx, ENCLOSURE, 'left', (w, h) => {
        rect(ctx, RAIL, 0.8, w - RAIL * 2, h - CAB.baseDepth - 0.8, rgba(coil, 0.16))
        for (let t = 2; t < h - CAB.baseDepth; t += 1.6) hline(ctx, RAIL, w - RAIL, t, rgba(coil, spec.powerOn ? 0.45 : 0.2), 0.4)
        vline(ctx, RAIL + 0.6, 0.8, h - CAB.baseDepth, rgba(coil, 0.6), 0.6)
        vline(ctx, w - RAIL - 0.6, 0.8, h - CAB.baseDepth, rgba(coil, 0.6), 0.6)
      })
    },
  }
}

// ── Servers ───────────────────────────────────────────────

function serverBezel(dc: DrawCtx, spec: CabinetArtSpec, i: number) {
  const { ctx, style } = dc
  const t = zToT(slotZ(i) + CAB.serverDepth)
  const h = SERVER_H
  const w = BAY_R - BAY_L
  const c = spec.serverColor
  const on = spec.powerOn
  const body = faceGradient(ctx, 0, t, 0, t + h, {
    from: rgba(shade(c, style.theme === 'neon' ? -0.55 : 0.55)),
    to: rgba(shade(c, style.theme === 'neon' ? -0.72 : 0.35)),
  })
  rect(ctx, BAY_L, t, w, h, body)
  hline(ctx, BAY_L, BAY_R, t + 0.3, rgba(shade(c, 0.2), 0.5), 0.5)

  if (showsFront(spec)) {
    if (isGpu(spec)) {
      // GPU node: heatsink fins and a light bar
      for (let s = BAY_L + 2; s < BAY_R - 4.5; s += 1.3) vline(ctx, s, t + 1.4, t + h - 2.6, rgba(shade(c, -0.85), 0.9), 0.55)
      rect(ctx, BAY_L + 1, t + h - 1.8, w - 2, 0.9, rgba(c, on ? 0.95 : 0.3))
    } else {
      // Accent strip + drive bays
      rect(ctx, BAY_L + 0.6, t + 1.2, 1.1, h - 2.4, rgba(c, on ? 0.9 : 0.3))
      for (let k = 0; k < 4; k++) {
        rect(ctx, BAY_L + 2.7 + k * 2.75, t + 1.5, 2.2, h - 3, style.recess)
        hline(ctx, BAY_L + 2.9 + k * 2.75, BAY_L + 4.7 + k * 2.75, t + 2.4, rgba(shade(c, 0.1), 0.55), 0.4)
      }
    }
    // Status LED (dim; the live overlay blinks over it)
    dot(ctx, ...serverLed(i, true), 0.75, rgba(c, on ? 0.55 : 0.15))
  } else {
    // Rear: fans, PSU, network ports
    const fanR = isGpu(spec) ? 2.9 : 2.3
    fan(ctx, BAY_R - 3, t + h / 2, fanR, rgba(shade(c, -0.1), 0.6), style.recess)
    fan(ctx, BAY_R - 3 - fanR * 2.3, t + h / 2, fanR, rgba(shade(c, -0.1), 0.6), style.recess)
    rect(ctx, BAY_L + 0.8, t + 1.3, 3.2, h - 2.6, style.recess)
    rect(ctx, BAY_L + 1.3, t + 1.8, 0.9, 0.9, rgba(0x44ff66, on ? 0.8 : 0.2))
    dot(ctx, ...serverLed(i, false), 0.75, rgba(c, on ? 0.55 : 0.15))
  }
}

/** Installed servers, drawn above the chassis so layer opacity fades only the servers */
export function cabinetServersArt(spec: CabinetArtSpec): HardwareArt {
  const n = serverCount(spec)
  return {
    key: ['srv', isGpu(spec) ? 'gpu' : 'std', view(spec), n, power(spec), hexKey(spec.serverColor)].join(':'),
    bounds: BOUNDS,
    draw: (dc) => {
      onFace(dc.ctx, ENCLOSURE, 'left', () => {
        for (let i = 0; i < n; i++) serverBezel(dc, spec, i)
      })
    },
  }
}

// ── Leaf switch ───────────────────────────────────────────

/** Top-of-rack leaf switch */
export function cabinetLeafArt(spec: CabinetArtSpec): HardwareArt {
  return {
    key: ['leaf', view(spec), power(spec), hexKey(spec.leafColor)].join(':'),
    bounds: BOUNDS,
    draw: (dc) => {
      const { ctx, style } = dc
      const c = spec.leafColor
      const on = spec.powerOn
      onFace(ctx, ENCLOSURE, 'left', () => {
        const t = zToT(LEAF_Z + LEAF_H)
        const w = BAY_R - BAY_L
        rect(ctx, BAY_L, t, w, LEAF_H, faceGradient(ctx, 0, t, 0, t + LEAF_H, {
          from: rgba(shade(c, style.theme === 'neon' ? -0.5 : 0.55)),
          to: rgba(shade(c, style.theme === 'neon' ? -0.7 : 0.35)),
        }))
        hline(ctx, BAY_L, BAY_R, t + 0.3, rgba(shade(c, 0.25), 0.6), 0.5)
        if (showsFront(spec)) {
          // Port row: access ports plus two uplinks in the accent color
          for (let p = 0; p < LEAF_PORTS; p++) {
            rect(ctx, BAY_L + 1 + p * 2.2, t + 1.6, 1.5, 1.6, style.recess)
            dot(ctx, ...leafPortLed(p), 0.35, rgba(c, on ? 0.45 : 0.12))
          }
          rect(ctx, BAY_R - 4.4, t + 1.6, 1.5, 1.6, rgba(c, on ? 0.9 : 0.3))
          rect(ctx, BAY_R - 2.4, t + 1.6, 1.5, 1.6, rgba(c, on ? 0.9 : 0.3))
          hline(ctx, BAY_L + 1, BAY_R - 1, t + LEAF_H - 1.1, rgba(c, on ? 0.55 : 0.2), 0.6)
        } else {
          fan(ctx, BAY_R - 2.6, t + LEAF_H / 2, 1.9, rgba(shade(c, -0.1), 0.6), style.recess)
          fan(ctx, BAY_R - 7, t + LEAF_H / 2, 1.9, rgba(shade(c, -0.1), 0.6), style.recess)
          rect(ctx, BAY_L + 0.8, t + 1.4, 3, LEAF_H - 2.8, style.recess)
          dot(ctx, ...leafRearLed(), 0.6, rgba(c, on ? 0.5 : 0.15))
        }
      })
    },
  }
}
