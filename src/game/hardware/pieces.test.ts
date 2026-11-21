import { describe, expect, it } from 'vitest'
import { box, leftFace } from './iso'
import { CAB } from './pieces/dimensions'
import { HARDWARE_STYLES } from './styles'
import type { HardwareStyle } from './styles'
import type { DrawCtx, HardwareArt } from './draw'
import type { CabinetArtSpec } from './pieces/cabinet'
import { cabinetChassisArt, cabinetServersArt, cabinetLeafArt, cabinetDoorArt, cabinetHasDoor, cabinetLedAnchors } from './pieces/cabinet'
import { spineArt, ibSwitchArt, pduArt, coolingArt, coolingBox, coolingFans, coolingFanCenter, chillerArt, cableTrayArt } from './pieces/infra'

/** Canvas 2D stand-in that accepts every call, so draw code can run under jsdom */
export function fakeDrawCtx(style: HardwareStyle = HARDWARE_STYLES.neon): DrawCtx {
  const gradient = { addColorStop: () => {} }
  const state: Record<string | symbol, unknown> = {}
  const ctx = new Proxy(state, {
    get(t, prop) {
      if (prop in t) return t[prop]
      if (prop === 'createLinearGradient' || prop === 'createRadialGradient') return () => gradient
      return () => {}
    },
    set(t, prop, value) {
      t[prop] = value
      return true
    },
  }) as unknown as CanvasRenderingContext2D
  return { ctx, s: 2, style }
}

export function drawsCleanly(art: HardwareArt) {
  for (const style of [HARDWARE_STYLES.neon, HARDWARE_STYLES.blueprint]) art.draw(fakeDrawCtx(style))
  const { minX, minY, maxX, maxY } = art.bounds
  expect(maxX).toBeGreaterThan(minX)
  expect(maxY).toBeGreaterThan(minY)
}

describe('infrastructure art', () => {
  it('every variant draws without throwing and has a unique key', () => {
    const arts: HardwareArt[] = []
    for (const powerOn of [true, false]) arts.push(spineArt({ color: 0xff6644, powerOn }))
    arts.push(spineArt({ color: 0x123456, powerOn: true }))
    for (const type of ['ib_leaf', 'ib_spine'] as const) for (const operational of [true, false]) arts.push(ibSwitchArt({ type, operational }))
    for (const overloaded of [true, false]) arts.push(pduArt({ overloaded }))
    for (const type of ['fan_tray', 'crac', 'crah', 'immersion_pod'] as const)
      for (const operational of [true, false]) arts.push(coolingArt({ type, operational, color: 0x00aaff }))
    for (const tier of ['basic', 'advanced'] as const) for (const operational of [true, false]) arts.push(chillerArt({ tier, operational }))
    arts.push(cableTrayArt())

    for (const art of arts) drawsCleanly(art)
    expect(new Set(arts.map((a) => a.key)).size).toBe(arts.length)
  })

  it('exposes the same fans the art draws, centered on the top face', () => {
    expect(coolingFans('fan_tray')).toHaveLength(2)
    expect(coolingFans('crac')).toHaveLength(1)
    expect(coolingFans('crah')).toHaveLength(1)
    expect(coolingFans('immersion_pod')).toHaveLength(0)
    const b = coolingBox('crac')
    const [x, y] = coolingFanCenter('crac', coolingFans('crac')[0])
    // Center of the top face sits one box-height above the base diamond's center
    expect(x).toBeCloseTo(0)
    expect(y).toBeCloseTo(b.h / 2 - b.d)
  })
})

describe('cabinet art', () => {
  const base: CabinetArtSpec = {
    servers: 3, leaf: true, facing: 'south', density: 'standard', envColor: 0x00ff88,
    serverColor: 0x00ff88, leafColor: 0x00aaff, powerOn: true, liquidCooling: 'none',
  }

  it('keys distinguish every visual difference and are stable', () => {
    expect(cabinetChassisArt(base).key).toBe(cabinetChassisArt({ ...base }).key)
    expect(cabinetChassisArt(base).key).not.toBe(cabinetChassisArt({ ...base, facing: 'north' }).key)
    expect(cabinetChassisArt(base).key).not.toBe(cabinetChassisArt({ ...base, powerOn: false }).key)
    expect(cabinetChassisArt(base).key).not.toBe(cabinetChassisArt({ ...base, liquidCooling: 'direct_to_chip' }).key)
    expect(cabinetChassisArt(base).key).not.toBe(cabinetChassisArt({ ...base, envColor: 0xcc66ff }).key)
    expect(cabinetChassisArt(base).key).not.toBe(cabinetChassisArt({ ...base, density: 'high_density' }).key)
    expect(cabinetServersArt(base).key).not.toBe(cabinetServersArt({ ...base, servers: 2 }).key)
    expect(cabinetServersArt(base).key).not.toBe(cabinetServersArt({ ...base, serverColor: 0xff0000 }).key)
    expect(cabinetServersArt(base).key).not.toBe(cabinetServersArt({ ...base, density: 'high_density' }).key)
    expect(cabinetLeafArt(base).key).not.toBe(cabinetLeafArt({ ...base, leafColor: 0xff0000 }).key)
    expect(cabinetLeafArt(base).key).not.toBe(cabinetLeafArt({ ...base, facing: 'north' }).key)
    // More servers than the rack holds renders (and caches) like a full rack
    expect(cabinetServersArt({ ...base, servers: 9 }).key).toBe(cabinetServersArt({ ...base, servers: 4 }).key)
  })

  it('every variant draws without throwing', () => {
    for (const facing of ['south', 'north'] as const)
      for (const density of ['standard', 'high_density', 'extreme_density'] as const)
        for (const liquidCooling of ['none', 'rear_door_hx', 'direct_to_chip', 'single_phase_immersion'] as const)
          for (const powerOn of [true, false])
            for (const servers of [0, 1, 4, 9]) {
              const v = { ...base, facing, density, liquidCooling, powerOn, servers, leaf: servers % 2 === 0 }
              drawsCleanly(cabinetChassisArt(v))
              drawsCleanly(cabinetServersArt(v))
              drawsCleanly(cabinetLeafArt(v))
              drawsCleanly(cabinetDoorArt(v))
            }
  })

  it('door layer only appears on the visible rear of rear-door heat exchanger racks', () => {
    expect(cabinetHasDoor({ liquidCooling: 'rear_door_hx', facing: 'north' })).toBe(true)
    expect(cabinetHasDoor({ liquidCooling: 'rear_door_hx', facing: 'south' })).toBe(false)
    expect(cabinetHasDoor({ liquidCooling: 'direct_to_chip', facing: 'north' })).toBe(false)
  })

  it('LED anchors sit on the visible rack face, one per server', () => {
    const face = leftFace(box(0, 0, CAB.w, CAB.h, CAB.depth))
    // Ray-casting point-in-polygon
    const inside = ([x, y]: readonly [number, number]) => {
      let hit = false
      for (let i = 0, j = face.length - 1; i < face.length; j = i++) {
        const [xi, yi] = face[i]
        const [xj, yj] = face[j]
        if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit
      }
      return hit
    }
    for (const facing of ['south', 'north'] as const) {
      const a = cabinetLedAnchors({ servers: 4, leaf: true, facing })
      expect(a.servers).toHaveLength(4)
      expect(a.leaf.length).toBeGreaterThan(0)
      for (const p of [...a.servers, ...a.leaf]) expect(inside(p)).toBe(true)
      // Higher slots sit higher on screen
      expect(a.servers[3][1]).toBeLessThan(a.servers[0][1])
    }
    expect(cabinetLedAnchors({ servers: 9, leaf: false, facing: 'south' }).servers).toHaveLength(4)
    expect(cabinetLedAnchors({ servers: 2, leaf: false, facing: 'south' }).leaf).toHaveLength(0)
  })
})
