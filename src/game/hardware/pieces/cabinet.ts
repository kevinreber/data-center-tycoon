import type { HardwareArt } from '../draw'
import { drawBox, tintBox } from '../draw'
import { box, boxBounds } from '../iso'
import type { ChassisPalette } from '../styles'
import { hexKey, rgba, shade } from '../styles'
import { CAB } from './dimensions'

export interface CabinetArtSpec {
  servers: number
  leaf: boolean
  facing: 'north' | 'south' | 'east' | 'west'
  density: 'standard' | 'high_density' | 'extreme_density'
  envColor: number
  serverColor: number
  leafColor: number
  powerOn: boolean
}

const ENCLOSURE = box(0, 0, CAB.w, CAB.h, CAB.depth)
const BOUNDS = boxBounds(ENCLOSURE)

function accentPalette(color: number): ChassisPalette {
  return {
    top: { from: rgba(shade(color, 0.15)), to: rgba(color) },
    left: { from: rgba(shade(color, -0.25)), to: rgba(shade(color, -0.45)) },
    right: { from: rgba(shade(color, -0.4)), to: rgba(shade(color, -0.6)) },
  }
}

function servers(spec: CabinetArtSpec): number {
  return Math.max(0, Math.min(spec.servers, CAB.maxServers))
}

const power = (spec: CabinetArtSpec) => (spec.powerOn ? 'on' : 'off')

/** Rack enclosure with empty slots */
export function cabinetChassisArt(spec: CabinetArtSpec): HardwareArt {
  return {
    key: ['cab', spec.density, spec.facing, power(spec), hexKey(spec.envColor)].join(':'),
    bounds: BOUNDS,
    draw: (dc) => {
      drawBox(dc, ENCLOSURE, spec.density === 'standard' ? dc.style.chassis : dc.style.gpuChassis)
      if (!spec.powerOn) tintBox(dc.ctx, ENCLOSURE, dc.style.offTint)
    },
  }
}

/** Installed servers (drawn above the chassis so layer opacity fades only the servers) */
export function cabinetServersArt(spec: CabinetArtSpec): HardwareArt {
  const n = servers(spec)
  return {
    key: ['srv', spec.density, spec.facing, n, power(spec), hexKey(spec.serverColor)].join(':'),
    bounds: BOUNDS,
    draw: (dc) => {
      for (let i = 0; i < n; i++) {
        const unit = box(0, CAB.slotY(i), CAB.w - CAB.inset, CAB.h - CAB.inset / 2, CAB.serverDepth)
        drawBox(dc, unit, accentPalette(spec.serverColor), { shadow: false })
        if (!spec.powerOn) tintBox(dc.ctx, unit, dc.style.offTint)
      }
    },
  }
}

/** Top-of-rack leaf switch */
export function cabinetLeafArt(spec: CabinetArtSpec): HardwareArt {
  return {
    key: ['leaf', spec.density, spec.facing, power(spec), hexKey(spec.leafColor)].join(':'),
    bounds: BOUNDS,
    draw: (dc) => {
      const unit = box(0, CAB.leafY, CAB.w - CAB.inset, CAB.h - CAB.inset / 2, CAB.leafDepth)
      drawBox(dc, unit, accentPalette(spec.leafColor), { shadow: false })
      if (!spec.powerOn) tintBox(dc.ctx, unit, dc.style.offTint)
    },
  }
}
