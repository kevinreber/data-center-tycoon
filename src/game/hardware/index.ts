// v2 hardware renderer: Canvas 2D art cached as Phaser textures.
// See docs/HARDWARE_VISUALS_PLAN.md.

export type RendererStyle = 'classic' | 'v2'

export type { HardwareArt, DrawCtx } from './draw'
export type { HardwareTheme, HardwareStyle } from './styles'
export { HARDWARE_STYLES } from './styles'
export {
  HW_TEXTURE_PREFIX,
  countHardwareTextures,
  ensureHardwareTexture,
  makeHardwareImage,
  pruneHardwareTextures,
  textureKey,
  textureScaleForZoom,
} from './textureCache'
export type { CabinetArtSpec, LiquidCooling } from './pieces/cabinet'
export { cabinetChassisArt, cabinetServersArt, cabinetLeafArt, cabinetDoorArt, cabinetHasDoor, cabinetLedAnchors } from './pieces/cabinet'
export type { SpineArtSpec, IBSwitchArtSpec, PduArtSpec, CoolingArtSpec, CoolingArtType, ChillerArtSpec } from './pieces/infra'
export { spineArt, ibSwitchArt, pduArt, coolingArt, coolingBox, coolingFanAnchor, chillerArt, cableTrayArt } from './pieces/infra'
export { CAB, SPINE, IB_SWITCH, PDU, COOLING, CHILLER } from './pieces/dimensions'
