import type Phaser from 'phaser'
import type { HardwareArt } from './draw'
import type { HardwareStyle } from './styles'

// Hardware art is drawn once per variant into an offscreen canvas and kept as
// a Phaser texture. Scene objects then show it as a plain Image, which is far
// cheaper than re-tessellating vector paths each time a cabinet re-renders.

export const HW_TEXTURE_PREFIX = 'hw:'

/** Room around the art for contact shadows and glows */
const PAD = 8

/**
 * Texture resolution for a camera zoom. Bilinear filtering only averages 2×2
 * texels, so minifying by much more than 2× aliases fine detail; matching the
 * texture scale to the zoom keeps detail crisp without wasting memory.
 */
export function textureScaleForZoom(zoom: number): number {
  if (zoom <= 0.75) return 1
  if (zoom <= 1.5) return 2
  return 3
}

export function textureKey(art: HardwareArt, style: HardwareStyle, scale: number): string {
  return `${HW_TEXTURE_PREFIX}${art.key}:${style.theme}@${scale}`
}

export interface PlacedTexture {
  key: string
  originX: number
  originY: number
  scale: number
}

export function ensureHardwareTexture(textures: Phaser.Textures.TextureManager, art: HardwareArt, style: HardwareStyle, scale: number): PlacedTexture | null {
  const key = textureKey(art, style, scale)
  const { minX, minY, maxX, maxY } = art.bounds
  const width = Math.ceil((maxX - minX + PAD * 2) * scale)
  const height = Math.ceil((maxY - minY + PAD * 2) * scale)
  const anchorX = (PAD - minX) * scale
  const anchorY = (PAD - minY) * scale

  if (!textures.exists(key)) {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return null
    ctx.setTransform(scale, 0, 0, scale, anchorX, anchorY)
    art.draw({ ctx, s: scale, style })
    textures.addCanvas(key, canvas)
  }
  return { key, originX: anchorX / width, originY: anchorY / height, scale }
}

/** Create an Image showing `art` with its local origin at (x, y). Not added to the display list. */
export function makeHardwareImage(scene: Phaser.Scene, art: HardwareArt, style: HardwareStyle, scale: number, x: number, y: number): Phaser.GameObjects.Image | null {
  const placed = ensureHardwareTexture(scene.textures, art, style, scale)
  if (!placed) return null
  const img = scene.make.image({ x, y, key: placed.key }, false)
  img.setOrigin(placed.originX, placed.originY)
  img.setScale(1 / placed.scale)
  return img
}

/**
 * Soft radial glow in a fixed color (pre-colored rather than tinted so it also
 * works under the Canvas renderer). Not prefixed with HW_TEXTURE_PREFIX, so
 * pruning never removes it.
 */
export function ensureGlowTexture(textures: Phaser.Textures.TextureManager, color: number): string {
  const key = `hwfx:glow:${color.toString(16).padStart(6, '0')}`
  if (textures.exists(key)) return key
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (ctx) {
    const r = (color >> 16) & 0xff, g = (color >> 8) & 0xff, b = color & 0xff
    const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    grad.addColorStop(0, `rgba(${r}, ${g}, ${b}, 1)`)
    grad.addColorStop(0.45, `rgba(${r}, ${g}, ${b}, 0.45)`)
    grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, size, size)
  }
  textures.addCanvas(key, canvas)
  return key
}

/** Display size (px) of an LED image created from ensureLedTexture */
export const LED_DISPLAY_SIZE = 3.6

/**
 * Pre-colored LED sprite: hot near-white core, colored body, soft halo.
 * LEDs are Images rather than Graphics so they batch with the hardware art
 * (a Graphics object per rack forces a WebGL batch flush per rack).
 */
export function ensureLedTexture(textures: Phaser.Textures.TextureManager, color: number): string {
  const key = `hwfx:led:${color.toString(16).padStart(6, '0')}`
  if (textures.exists(key)) return key
  const size = 16
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (ctx) {
    const r = (color >> 16) & 0xff, g = (color >> 8) & 0xff, b = color & 0xff
    const mix = (c: number) => Math.round(c + (255 - c) * 0.6)
    const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    grad.addColorStop(0, `rgba(${mix(r)}, ${mix(g)}, ${mix(b)}, 1)`)
    grad.addColorStop(0.22, `rgba(${r}, ${g}, ${b}, 1)`)
    grad.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, 0.45)`)
    grad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, size, size)
  }
  textures.addCanvas(key, canvas)
  return key
}

export function countHardwareTextures(textures: Phaser.Textures.TextureManager): number {
  return textures.getTextureKeys().filter((k) => k.startsWith(HW_TEXTURE_PREFIX)).length
}

/**
 * Drop cached textures that don't end with `keepSuffix` (all of them when null).
 * Only call after every hardware object has been re-rendered, or live Images
 * would lose their texture.
 */
export function pruneHardwareTextures(textures: Phaser.Textures.TextureManager, keepSuffix: string | null) {
  for (const k of textures.getTextureKeys()) {
    if (k.startsWith(HW_TEXTURE_PREFIX) && (keepSuffix === null || !k.endsWith(keepSuffix))) textures.remove(k)
  }
}
