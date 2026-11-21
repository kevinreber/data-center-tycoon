// Palettes for the v2 hardware renderer. `neon` matches the game's dark UI;
// `blueprint` is the light line-art look from Protocol Explorer and is only
// selectable in the Hardware Lab for now.

export type HardwareTheme = 'neon' | 'blueprint'

/** Light-to-dark gradient stops for one face */
export interface FaceShade {
  from: string
  to: string
}

export interface ChassisPalette {
  top: FaceShade
  left: FaceShade
  right: FaceShade
}

export interface HardwareStyle {
  theme: HardwareTheme
  /** Silhouette outline */
  outline: string
  outlineWidth: number
  /** Inner edge highlight along the top face's front edges */
  rim: string
  /** Fine detail lines (panel seams, vents) */
  detail: string
  /** Contact shadow under each object */
  shadow: string
  shadowBlur: number
  /** Multiplier for accent glows (0 disables) */
  glow: number
  chassis: ChassisPalette
  /** GPU / high-density cabinet chassis */
  gpuChassis: ChassisPalette
  /** Equipment bezels inside a rack */
  bezel: FaceShade
  /** Unused rack slots */
  blank: FaceShade
  /** Perforated door mesh dots */
  mesh: string
  /** Dark recess behind equipment (rack interior, port holes) */
  recess: string
  /** Applied over everything when a unit is powered off */
  offTint: string
  /** Applied over failed infrastructure */
  failTint: string
}

export const HARDWARE_STYLES: Record<HardwareTheme, HardwareStyle> = {
  neon: {
    theme: 'neon',
    outline: 'rgba(170, 200, 225, 0.55)',
    outlineWidth: 1,
    rim: 'rgba(210, 230, 250, 0.35)',
    detail: 'rgba(150, 180, 210, 0.22)',
    shadow: 'rgba(0, 0, 0, 0.55)',
    shadowBlur: 5,
    glow: 1,
    chassis: {
      top: { from: '#4a5a6e', to: '#36424f' },
      left: { from: '#2b3542', to: '#1b222c' },
      right: { from: '#232c37', to: '#151b23' },
    },
    gpuChassis: {
      top: { from: '#5c3d63', to: '#432a4a' },
      left: { from: '#3a2440', to: '#22142a' },
      right: { from: '#2e1c34', to: '#1a0f20' },
    },
    bezel: { from: '#1a222c', to: '#10161d' },
    blank: { from: '#262f3a', to: '#1d242d' },
    mesh: 'rgba(160, 190, 220, 0.16)',
    recess: '#06090d',
    offTint: 'rgba(4, 6, 10, 0.55)',
    failTint: 'rgba(255, 40, 40, 0.35)',
  },
  blueprint: {
    theme: 'blueprint',
    outline: 'rgba(28, 44, 110, 0.9)',
    outlineWidth: 1.1,
    rim: 'rgba(255, 255, 255, 0.85)',
    detail: 'rgba(40, 60, 140, 0.45)',
    shadow: 'rgba(40, 60, 140, 0.22)',
    shadowBlur: 6,
    glow: 0.35,
    chassis: {
      top: { from: '#eef2fb', to: '#dde4f5' },
      left: { from: '#cdd7f0', to: '#b9c6e8' },
      right: { from: '#dbe2f4', to: '#c8d3ee' },
    },
    gpuChassis: {
      top: { from: '#f1e9fa', to: '#e2d4f3' },
      left: { from: '#d6c4ee', to: '#c3abe5' },
      right: { from: '#e2d4f3', to: '#d0bdec' },
    },
    bezel: { from: '#f4f6fc', to: '#e3e9f7' },
    blank: { from: '#dfe5f4', to: '#d2daf0' },
    mesh: 'rgba(40, 60, 140, 0.18)',
    recess: '#9fb0dc',
    offTint: 'rgba(120, 130, 160, 0.45)',
    failTint: 'rgba(230, 40, 60, 0.28)',
  },
}

export function hexToRgb(color: number): [number, number, number] {
  return [(color >> 16) & 0xff, (color >> 8) & 0xff, color & 0xff]
}

export function rgba(color: number, alpha = 1): string {
  const [r, g, b] = hexToRgb(color)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

/** Mix a color toward black (amount < 0) or white (amount > 0), amount in [-1, 1] */
export function shade(color: number, amount: number): number {
  const [r, g, b] = hexToRgb(color)
  const t = amount < 0 ? 0 : 255
  const p = Math.abs(amount)
  const mix = (c: number) => Math.round(c + (t - c) * p)
  return (mix(r) << 16) | (mix(g) << 8) | mix(b)
}

export function hexKey(color: number): string {
  return color.toString(16).padStart(6, '0')
}
