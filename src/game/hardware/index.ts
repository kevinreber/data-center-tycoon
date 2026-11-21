// v2 hardware renderer: Canvas 2D art cached as Phaser textures.
// See docs/HARDWARE_VISUALS_PLAN.md.

export type RendererStyle = 'classic' | 'v2'

export type { HardwareArt, DrawCtx } from './draw'
export type { HardwareTheme, HardwareStyle } from './styles'
export { HARDWARE_STYLES } from './styles'
export { silhouette, box as isoBox, facePoint } from './iso'
export type { Pt, IsoBox } from './iso'
export {
  HW_TEXTURE_PREFIX,
  countHardwareTextures,
  ensureGlowTexture,
  ensureHardwareTexture,
  makeHardwareImage,
  pruneHardwareTextures,
  textureKey,
  textureScaleForZoom,
} from './textureCache'
export type { CabinetArtSpec, LiquidCooling } from './pieces/cabinet'
export { cabinetChassisArt, cabinetServersArt, cabinetLeafArt, cabinetDoorArt, cabinetHasDoor, cabinetLedAnchors, cabinetServerQuad } from './pieces/cabinet'
export type { SpineArtSpec, IBSwitchArtSpec, PduArtSpec, CoolingArtSpec, CoolingArtType, ChillerArtSpec } from './pieces/infra'
export { spineArt, spineLedAnchors, ibSwitchArt, pduArt, coolingArt, coolingBox, coolingFans, coolingFanCenter, chillerArt, cableTrayArt } from './pieces/infra'
export type { FanPlacement } from './pieces/infra'
export { CAB, SPINE, IB_SWITCH, PDU, COOLING, CHILLER } from './pieces/dimensions'
