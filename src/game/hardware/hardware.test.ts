import { afterEach, describe, expect, it, vi } from 'vitest'
import type Phaser from 'phaser'
import { box, faceTransform, facePoint, faceWidth, leftFace, rightFace, topFace, silhouette, boxBounds } from './iso'
import { CAB } from './pieces/dimensions'
import { HARDWARE_STYLES, shade, rgba } from './styles'
import { ensureHardwareTexture, pruneHardwareTextures, textureKey, textureScaleForZoom, countHardwareTextures } from './textureCache'
import type { HardwareArt } from './draw'

const close = (a: readonly number[], b: readonly number[]) => {
  expect(a[0]).toBeCloseTo(b[0], 6)
  expect(a[1]).toBeCloseTo(b[1], 6)
}

describe('iso geometry', () => {
  const b = box(0, 0, 44, 22, 56)

  it('face polygons share the front vertical edge', () => {
    const l = leftFace(b)
    const r = rightFace(b)
    close(l[1], r[0])
    close(l[2], r[3])
  })

  it('silhouette spans the box bounds', () => {
    const xs = silhouette(b).map((p) => p[0])
    const ys = silhouette(b).map((p) => p[1])
    const bounds = boxBounds(b)
    expect(Math.min(...xs)).toBe(bounds.minX)
    expect(Math.max(...xs)).toBe(bounds.maxX)
    expect(Math.min(...ys)).toBe(bounds.minY)
    expect(Math.max(...ys)).toBe(bounds.maxY)
  })

  it('face transforms map the local rectangle onto each face', () => {
    const L = faceWidth(b)
    const l = leftFace(b)
    close(facePoint(b, 'left', 0, 0), l[0])
    close(facePoint(b, 'left', L, 0), l[1])
    close(facePoint(b, 'left', L, b.d), l[2])
    close(facePoint(b, 'left', 0, b.d), l[3])

    const r = rightFace(b)
    close(facePoint(b, 'right', 0, 0), r[0])
    close(facePoint(b, 'right', L, 0), r[1])
    close(facePoint(b, 'right', L, b.d), r[2])

    const t = topFace(b)
    close(facePoint(b, 'top', 0, 0), t[0])
    close(facePoint(b, 'top', L, 0), t[1])
    close(facePoint(b, 'top', L, L), t[2])
    close(facePoint(b, 'top', 0, L), t[3])
  })

  it('side-face axes have unit length so detail sizes are in screen pixels', () => {
    const [a, bb] = faceTransform(b, 'left')
    expect(Math.hypot(a, bb)).toBeCloseTo(1, 9)
  })
})

describe('dimensions', () => {
  // Must match the classic renderer constants in PhaserGame.ts so overlays line up
  it('cabinet geometry matches the classic renderer', () => {
    expect(CAB.depth).toBe(4 + 4 * (10 + 1) + (7 + 1))
    expect(CAB.slotY(0)).toBe(-5)
    expect(CAB.slotY(3)).toBe(-5 - 3 * 11)
    expect(CAB.leafY).toBe(-5 - 4 * 11)
  })
})

describe('styles', () => {
  it('shade mixes toward black and white', () => {
    expect(shade(0x808080, -1)).toBe(0x000000)
    expect(shade(0x808080, 1)).toBe(0xffffff)
    expect(shade(0x123456, 0)).toBe(0x123456)
    expect(rgba(0xff0000, 0.5)).toBe('rgba(255, 0, 0, 0.5)')
  })
})

describe('texture cache', () => {
  afterEach(() => vi.restoreAllMocks())

  it('picks texture resolution from the camera zoom', () => {
    expect(textureScaleForZoom(0.3)).toBe(1)
    expect(textureScaleForZoom(0.75)).toBe(1)
    expect(textureScaleForZoom(1)).toBe(2)
    expect(textureScaleForZoom(1.5)).toBe(2)
    expect(textureScaleForZoom(2.5)).toBe(3)
  })

  function fakeTextures() {
    const keys = new Set<string>()
    const added: string[] = []
    const tm = {
      exists: (k: string) => keys.has(k),
      addCanvas: (k: string) => { keys.add(k); added.push(k) },
      getTextureKeys: () => [...keys],
      remove: (k: string) => { keys.delete(k) },
    }
    return { tm: tm as unknown as Phaser.Textures.TextureManager, keys, added }
  }

  function stubCanvas() {
    const ctx = { setTransform: vi.fn() }
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(ctx as unknown as CanvasRenderingContext2D)
    return ctx
  }

  const art: HardwareArt = { key: 'test', bounds: { minX: -22, minY: -56, maxX: 22, maxY: 22 }, draw: vi.fn() }

  it('draws each variant once and anchors the local origin', () => {
    const ctx = stubCanvas()
    const { tm, added } = fakeTextures()
    const style = HARDWARE_STYLES.neon
    const a = ensureHardwareTexture(tm, art, style, 2)
    const b = ensureHardwareTexture(tm, art, style, 2)
    expect(added).toEqual([textureKey(art, style, 2)])
    expect(art.draw).toHaveBeenCalledTimes(1)
    // Pad 8 on each side: width (44 + 16) * 2 = 120, anchor at (8 + 22) * 2 = 60
    expect(a).toEqual(b)
    expect(a?.originX).toBeCloseTo(60 / 120)
    expect(a?.originY).toBeCloseTo(((8 + 56) * 2) / ((78 + 16) * 2))
    expect(ctx.setTransform).toHaveBeenCalledWith(2, 0, 0, 2, 60, 128)
  })

  it('prunes textures for other themes and scales only', () => {
    const { tm, keys } = fakeTextures()
    for (const k of ['hw:a:neon@2', 'hw:a:neon@3', 'hw:a:blueprint@2', 'floor']) keys.add(k)
    pruneHardwareTextures(tm, ':neon@2')
    expect([...keys].sort()).toEqual(['floor', 'hw:a:neon@2'])
    expect(countHardwareTextures(tm)).toBe(1)
    pruneHardwareTextures(tm, null)
    expect([...keys]).toEqual(['floor'])
  })
})
